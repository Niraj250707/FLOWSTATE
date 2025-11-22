import { useState, useEffect } from 'react';
import { Coffee, Eye, Droplet, Wind, Sunrise, Moon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BreakSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: typeof Coffee;
  category: 'physical' | 'mental' | 'visual';
  instructions: string[];
}

export function MicroBreaks() {
  const [activityLevel, setActivityLevel] = useState(0);
  const [lastBreakTime, setLastBreakTime] = useState<number>(Date.now());
  const [breakHistory, setBreakHistory] = useState<{ timestamp: number; type: string }[]>([]);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [activeBreak, setActiveBreak] = useState<BreakSuggestion | null>(null);
  const [breakTimer, setBreakTimer] = useState(0);

  const breakSuggestions: BreakSuggestion[] = [
    {
      id: '1',
      title: '20-20-20 Eye Break',
      description: 'Reduce eye strain with the 20-20-20 rule',
      duration: 20,
      icon: Eye,
      category: 'visual',
      instructions: [
        'Look away from your screen',
        'Focus on something 20 feet away',
        'Keep your eyes relaxed for 20 seconds',
        'Blink several times to refresh your eyes',
      ],
    },
    {
      id: '2',
      title: 'Hydration Break',
      description: 'Stay hydrated for better focus',
      duration: 60,
      icon: Droplet,
      category: 'physical',
      instructions: [
        'Stand up from your desk',
        'Get a glass of water',
        'Drink slowly and mindfully',
        'Take a few deep breaths',
      ],
    },
    {
      id: '3',
      title: 'Breathing Exercise',
      description: 'Deep breathing to reduce stress',
      duration: 120,
      icon: Wind,
      category: 'mental',
      instructions: [
        'Sit comfortably with your back straight',
        'Breathe in deeply through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat 5 times',
      ],
    },
    {
      id: '4',
      title: 'Desk Stretches',
      description: 'Quick stretches to relieve tension',
      duration: 180,
      icon: Sunrise,
      category: 'physical',
      instructions: [
        'Roll your shoulders backward 10 times',
        'Stretch your neck side to side',
        'Reach your arms overhead and stretch',
        'Do 10 seated twists',
        'Shake out your hands and wrists',
      ],
    },
    {
      id: '5',
      title: 'Mindful Moment',
      description: 'Brief meditation to reset focus',
      duration: 300,
      icon: Moon,
      category: 'mental',
      instructions: [
        'Close your eyes or lower your gaze',
        'Notice your breath without changing it',
        'Acknowledge any thoughts and let them pass',
        'Focus on the present moment',
        'Slowly open your eyes when ready',
      ],
    },
  ];

  useEffect(() => {
    // Simulate activity tracking
    const interval = setInterval(() => {
      setActivityLevel(prev => Math.min(100, prev + Math.random() * 5));
      
      const timeSinceLastBreak = Date.now() - lastBreakTime;
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeSinceLastBreak > thirtyMinutes && !showBreakReminder && !activeBreak) {
        setShowBreakReminder(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastBreakTime, showBreakReminder, activeBreak]);

  useEffect(() => {
    if (activeBreak && breakTimer > 0) {
      const interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeBreak, breakTimer]);

  const startBreak = (suggestion: BreakSuggestion) => {
    setActiveBreak(suggestion);
    setBreakTimer(suggestion.duration);
    setShowBreakReminder(false);
  };

  const completeBreak = () => {
    if (activeBreak) {
      const newBreak = {
        timestamp: Date.now(),
        type: activeBreak.title,
      };
      
      setBreakHistory(prev => [...prev, newBreak]);
      localStorage.setItem('breakHistory', JSON.stringify([...breakHistory, newBreak]));
    }
    
    setActiveBreak(null);
    setBreakTimer(0);
    setLastBreakTime(Date.now());
    setActivityLevel(0);
  };

  const dismissReminder = () => {
    setShowBreakReminder(false);
    setLastBreakTime(Date.now());
  };

  const getSuggestedBreak = (): BreakSuggestion => {
    if (activityLevel > 70) {
      return breakSuggestions[2]; // Breathing exercise for high activity
    } else {
      return breakSuggestions[0]; // Eye break for moderate activity
    }
  };

  const timeSinceLastBreak = Math.floor((Date.now() - lastBreakTime) / 1000 / 60);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Activity Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2>Micro-Break Assistant</h2>
            <p className="text-sm text-gray-500">Smart break suggestions based on your activity</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Time Since Last Break</div>
            <div className="text-2xl">{timeSinceLastBreak} min</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Activity Level</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    activityLevel > 70 ? 'bg-red-500' :
                    activityLevel > 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  animate={{ width: `${activityLevel}%` }}
                />
              </div>
              <span className="text-sm">{Math.round(activityLevel)}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Breaks Today</div>
            <div className="text-2xl">{breakHistory.filter(b => {
              const today = new Date().toDateString();
              return new Date(b.timestamp).toDateString() === today;
            }).length}</div>
          </div>
        </div>
      </div>

      {/* Break Reminder */}
      <AnimatePresence>
        {showBreakReminder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white mb-2">Time for a Break! 🎯</h3>
                <p className="text-orange-100">
                  You've been working for {timeSinceLastBreak} minutes. Taking regular breaks improves focus and productivity.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => startBreak(getSuggestedBreak())}
                className="px-6 py-3 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Take Suggested Break
              </button>
              <button
                onClick={dismissReminder}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Remind Me Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Break */}
      <AnimatePresence>
        {activeBreak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <activeBreak.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-2">{activeBreak.title}</h2>
              <p className="text-gray-600">{activeBreak.description}</p>
            </div>

            <div className="mb-8">
              <div className="text-6xl text-center mb-4">
                {Math.floor(breakTimer / 60)}:{(breakTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  animate={{ width: `${((activeBreak.duration - breakTimer) / activeBreak.duration) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="mb-4">Instructions</h3>
              <ol className="space-y-3">
                {activeBreak.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={completeBreak}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              Complete Break
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Break Suggestions */}
      {!activeBreak && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="mb-4">Available Breaks</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {breakSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                onClick={() => startBreak(suggestion)}
                className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    suggestion.category === 'physical' ? 'bg-green-100' :
                    suggestion.category === 'mental' ? 'bg-purple-100' :
                    'bg-blue-100'
                  }`}>
                    <suggestion.icon className={`w-6 h-6 ${
                      suggestion.category === 'physical' ? 'text-green-600' :
                      suggestion.category === 'mental' ? 'text-purple-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4>{suggestion.title}</h4>
                      <span className="text-sm text-gray-500">
                        {Math.floor(suggestion.duration / 60)}:{(suggestion.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        suggestion.category === 'physical' ? 'bg-green-50 text-green-700' :
                        suggestion.category === 'mental' ? 'bg-purple-50 text-purple-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Breaks */}
      {breakHistory.length > 0 && !activeBreak && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="mb-4">Recent Breaks</h3>
          
          <div className="space-y-2">
            {breakHistory.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>{entry.type}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
