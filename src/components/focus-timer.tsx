import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, CheckCircle, Target, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

interface FocusTimerProps {
  onSessionChange: (active: boolean) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export function FocusTimer({ onSessionChange }: FocusTimerProps) {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved) : {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
    };
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    onSessionChange(isRunning && mode === 'focus');
  }, [isRunning, mode, onSessionChange]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Save session data
    if (mode === 'focus') {
      const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      sessions.push({
        date: new Date().toISOString(),
        duration: settings.focusDuration,
        completed: true,
      });
      localStorage.setItem('focusSessions', JSON.stringify(sessions));
      
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      
      // Determine next mode
      if (newCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
    }

    // Play notification sound (simulated)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FlowState Timer Complete!', {
        body: mode === 'focus' ? 'Time for a break!' : 'Ready to focus again?',
      });
    }
  };

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = mode === 'focus' ? settings.focusDuration :
                    mode === 'shortBreak' ? settings.shortBreakDuration :
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = newMode === 'focus' ? settings.focusDuration :
                    newMode === 'shortBreak' ? settings.shortBreakDuration :
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (() => {
    const totalTime = mode === 'focus' ? settings.focusDuration * 60 :
                     mode === 'shortBreak' ? settings.shortBreakDuration * 60 :
                     settings.longBreakDuration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  })();

  // Add daily goal tracking
  const [dailyGoal, setDailyGoal] = useState(240);
  const [dailyProgress, setDailyProgress] = useState(0);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (profile.studyGoal) {
      setDailyGoal(profile.studyGoal);
    }

    // Calculate today's progress
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const today = new Date().toDateString();
    const todaySessions = sessions.filter((s: any) => 
      new Date(s.date).toDateString() === today && s.completed
    );
    const totalToday = todaySessions.reduce((acc: number, s: any) => acc + s.duration, 0);
    setDailyProgress(totalToday);
  }, [completedSessions]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6" />
            <h3 className="text-white">Daily Goal</h3>
          </div>
          <div className="mb-4">
            <div className="text-3xl mb-1">
              {dailyProgress} / {dailyGoal} min
            </div>
            <div className="text-sm text-purple-100">
              {Math.round((dailyProgress / dailyGoal) * 100)}% complete
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyProgress / dailyGoal) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h3>Today's Focus</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sessions</span>
              <span className="text-lg">{completedSessions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Focus Time</span>
              <span className="text-lg">{dailyProgress} min</span>
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-white">Keep Going!</h3>
          </div>
          <div className="text-3xl mb-1">🔥 {(() => {
            const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
            const dates = new Set(sessions.map((s: any) => new Date(s.date).toDateString()));
            let streak = 0;
            const date = new Date();
            while (dates.has(date.toDateString())) {
              streak++;
              date.setDate(date.getDate() - 1);
            }
            return streak;
          })()} Days</div>
          <div className="text-sm text-orange-100">Current Streak</div>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-8">
          {[
            { mode: 'focus' as TimerMode, label: 'Focus', color: 'indigo' },
            { mode: 'shortBreak' as TimerMode, label: 'Short Break', color: 'green' },
            { mode: 'longBreak' as TimerMode, label: 'Long Break', color: 'blue' },
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => switchMode(item.mode)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                mode === item.mode
                  ? `bg-${item.color}-100 text-${item.color}-700 border-2 border-${item.color}-400`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="relative w-80 h-80 mx-auto">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                stroke={mode === 'focus' ? '#4f46e5' : mode === 'shortBreak' ? '#10b981' : '#3b82f6'}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 140}
                initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl tracking-wider mb-2">{formatTime(timeLeft)}</div>
              <div className="text-gray-500 capitalize">{mode.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-white shadow-lg transition-all hover:scale-105 ${
              mode === 'focus' ? 'bg-indigo-600 hover:bg-indigo-700' :
              mode === 'shortBreak' ? 'bg-green-600 hover:bg-green-700' :
              'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>
          
          <button
            onClick={resetTimer}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Session Counter */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <CheckCircle className="w-4 h-4" />
          <span>Completed Sessions: {completedSessions}</span>
          <span className="text-gray-400">
            (Next long break in {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)})
          </span>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <h3 className="mb-4">Timer Settings</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={settings.focusDuration}
                    onChange={(e) => setSettings({ ...settings, focusDuration: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Short Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Sessions Until Long Break
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => setSettings({ ...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}