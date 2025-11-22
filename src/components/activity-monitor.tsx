import { useState, useEffect } from 'react';
import { Activity, Eye, MousePointer, Keyboard, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityData {
  mouseMovements: number;
  keystrokes: number;
  focusScore: number;
  distractions: number;
  timestamp: number;
}

export function ActivityMonitor() {
  const [activityData, setActivityData] = useState<ActivityData>({
    mouseMovements: 0,
    keystrokes: 0,
    focusScore: 100,
    distractions: 0,
    timestamp: Date.now(),
  });
  
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isMonitoring) return;

    let mouseCount = 0;
    let keyCount = 0;
    let lastActivityTime = Date.now();
    let inactivityCount = 0;

    const handleMouseMove = () => {
      mouseCount++;
      lastActivityTime = Date.now();
    };

    const handleKeyPress = () => {
      keyCount++;
      lastActivityTime = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActivityData(prev => ({
          ...prev,
          distractions: prev.distractions + 1,
          focusScore: Math.max(0, prev.focusScore - 5),
        }));
      }
    };

    // Track activity every second
    const activityInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;
      
      // Check for inactivity (more than 30 seconds)
      if (timeSinceLastActivity > 30000) {
        inactivityCount++;
      } else {
        inactivityCount = 0;
      }

      // Calculate focus score based on activity patterns
      const activityLevel = mouseCount + keyCount * 2;
      let newFocusScore = activityData.focusScore;
      
      if (activityLevel > 5 && activityLevel < 100) {
        // Good activity level
        newFocusScore = Math.min(100, newFocusScore + 1);
      } else if (activityLevel > 200) {
        // Too much activity (possible distraction)
        newFocusScore = Math.max(0, newFocusScore - 2);
      } else if (inactivityCount > 0) {
        // Inactivity detected
        newFocusScore = Math.max(0, newFocusScore - 3);
      }

      const newData: ActivityData = {
        mouseMovements: mouseCount,
        keystrokes: keyCount,
        focusScore: newFocusScore,
        distractions: activityData.distractions,
        timestamp: now,
      };

      setActivityData(newData);
      setRecentActivity(prev => [...prev.slice(-19), newData]);

      // Reset counters
      mouseCount = 0;
      keyCount = 0;
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keypress', handleKeyPress);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMonitoring, activityData.distractions, activityData.focusScore]);

  const toggleMonitoring = () => {
    if (!isMonitoring) {
      setSessionStartTime(Date.now());
      setActivityData({
        mouseMovements: 0,
        keystrokes: 0,
        focusScore: 100,
        distractions: 0,
        timestamp: Date.now(),
      });
      setRecentActivity([]);
    } else {
      // Save session data
      if (sessionStartTime) {
        const sessions = JSON.parse(localStorage.getItem('activitySessions') || '[]');
        sessions.push({
          startTime: sessionStartTime,
          endTime: Date.now(),
          finalFocusScore: activityData.focusScore,
          totalDistractions: activityData.distractions,
        });
        localStorage.setItem('activitySessions', JSON.stringify(sessions));
      }
    }
    setIsMonitoring(!isMonitoring);
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '00:00';
    const seconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusStatus = () => {
    if (activityData.focusScore >= 80) return { label: 'Excellent Focus', color: 'green' };
    if (activityData.focusScore >= 60) return { label: 'Good Focus', color: 'blue' };
    if (activityData.focusScore >= 40) return { label: 'Moderate Focus', color: 'yellow' };
    return { label: 'Low Focus', color: 'red' };
  };

  const status = getFocusStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2>Activity Monitor</h2>
              <p className="text-sm text-gray-500">Real-time focus detection</p>
            </div>
          </div>
          
          <button
            onClick={toggleMonitoring}
            className={`px-6 py-3 rounded-xl transition-all ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        {isMonitoring && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Session Duration</div>
              <div className="text-2xl">{getSessionDuration()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Focus Status</div>
              <div className={`text-2xl text-${status.color}-600`}>{status.label}</div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Metrics */}
      {isMonitoring && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Focus Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3>Focus Score</h3>
            </div>
            
            <div className="relative">
              <div className="flex items-end justify-center h-40">
                <div className="relative w-full max-w-xs">
                  <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        activityData.focusScore >= 80 ? 'bg-green-500' :
                        activityData.focusScore >= 60 ? 'bg-blue-500' :
                        activityData.focusScore >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${activityData.focusScore}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">{activityData.focusScore}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Your focus score is calculated based on activity patterns and tab switching behavior
              </p>
            </div>
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3>Activity Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MousePointer className="w-5 h-5 text-gray-600" />
                  <span>Mouse Activity</span>
                </div>
                <span className="text-2xl">{activityData.mouseMovements}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-gray-600" />
                  <span>Keystrokes</span>
                </div>
                <span className="text-2xl">{activityData.keystrokes}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <span>Distractions</span>
                </div>
                <span className="text-2xl">{activityData.distractions}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Activity Timeline */}
      {isMonitoring && recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="mb-4">Focus Timeline (Last 20 seconds)</h3>
          
          <div className="flex items-end gap-1 h-32">
            {recentActivity.map((data, index) => (
              <motion.div
                key={index}
                className={`flex-1 rounded-t ${
                  data.focusScore >= 80 ? 'bg-green-500' :
                  data.focusScore >= 60 ? 'bg-blue-500' :
                  data.focusScore >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${data.focusScore}%` }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {!isMonitoring && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="mb-2">Start Activity Monitoring</h3>
          <p className="text-gray-500 mb-6">
            Track your focus levels in real-time based on activity patterns
          </p>
          <button
            onClick={toggleMonitoring}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            Begin Monitoring
          </button>
        </div>
      )}
    </div>
  );
}
