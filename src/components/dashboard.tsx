import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface SessionData {
  date: string;
  duration: number;
  completed: boolean;
}

interface ActivitySession {
  startTime: number;
  endTime: number;
  finalFocusScore: number;
  totalDistractions: number;
}

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [focusSessions, setFocusSessions] = useState<SessionData[]>([]);
  const [activitySessions, setActivitySessions] = useState<ActivitySession[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedSessions = localStorage.getItem('focusSessions');
    const savedActivity = localStorage.getItem('activitySessions');
    
    if (savedSessions) {
      setFocusSessions(JSON.parse(savedSessions));
    }
    
    if (savedActivity) {
      setActivitySessions(JSON.parse(savedActivity));
    }

    // Add some demo data if empty
    if (!savedSessions || JSON.parse(savedSessions).length === 0) {
      const demoData: SessionData[] = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const sessions = Math.floor(Math.random() * 8) + 2;
        
        for (let j = 0; j < sessions; j++) {
          demoData.push({
            date: date.toISOString(),
            duration: 25,
            completed: Math.random() > 0.2,
          });
        }
      }
      
      setFocusSessions(demoData);
    }
  }, []);

  // Calculate statistics
  const stats = {
    totalFocusTime: focusSessions.reduce((acc, session) => 
      session.completed ? acc + session.duration : acc, 0
    ),
    completedSessions: focusSessions.filter(s => s.completed).length,
    averageFocusScore: activitySessions.length > 0
      ? Math.round(activitySessions.reduce((acc, s) => acc + s.finalFocusScore, 0) / activitySessions.length)
      : 85,
    totalDistractions: activitySessions.reduce((acc, s) => acc + s.totalDistractions, 0),
    streak: calculateStreak(focusSessions),
  };

  function calculateStreak(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;
    
    const today = new Date().toDateString();
    const dates = new Set(sessions.map(s => new Date(s.date).toDateString()));
    
    let streak = 0;
    const date = new Date();
    
    while (dates.has(date.toDateString())) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    
    return streak;
  }

  // Prepare chart data
  const dailyData = (() => {
    const days = timeRange === 'week' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const daySessions = focusSessions.filter(s => 
        new Date(s.date).toDateString() === dateStr && s.completed
      );
      
      const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minutes: totalMinutes,
        sessions: daySessions.length,
      });
    }
    
    return data;
  })();

  const hourlyDistribution = (() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, sessions: 0 }));
    
    focusSessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      hours[hour].sessions++;
    });
    
    return hours
      .filter(h => h.sessions > 0)
      .map(h => ({
        hour: `${h.hour.toString().padStart(2, '0')}:00`,
        sessions: h.sessions,
      }));
  })();

  const focusDistribution = [
    { name: 'Deep Focus', value: Math.round(stats.completedSessions * 0.6), color: '#4f46e5' },
    { name: 'Moderate Focus', value: Math.round(stats.completedSessions * 0.3), color: '#8b5cf6' },
    { name: 'Light Focus', value: Math.round(stats.completedSessions * 0.1), color: '#c084fc' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Focus Analytics</h2>
          <p className="text-gray-600">Track your productivity and focus patterns</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl mb-1">{stats.totalFocusTime}</div>
          <div className="text-sm text-gray-600">Minutes Focused</div>
          <div className="text-xs text-gray-500 mt-2">
            {(stats.totalFocusTime / 60).toFixed(1)} hours total
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl mb-1">{stats.completedSessions}</div>
          <div className="text-sm text-gray-600">Sessions Completed</div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.completedSessions > 0 ? 'Great progress!' : 'Start your first session'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl mb-1">{stats.averageFocusScore}%</div>
          <div className="text-sm text-gray-600">Average Focus Score</div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.averageFocusScore >= 80 ? 'Excellent!' : 'Keep improving'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl mb-1">{stats.streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.streak > 0 ? 'Keep it going!' : 'Start your streak today'}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="mb-4">Daily Focus Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="minutes" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="mb-4">Focus Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={focusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {focusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="mb-4">Session Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Distribution */}
        {hourlyDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="mb-4">Most Productive Hours</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sessions" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-white mb-4">Insights & Tips</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white mb-2">🎯 Focus Pattern</h4>
            <p className="text-sm text-indigo-100">
              {stats.completedSessions > 10
                ? "You're building a strong focus habit! Keep it up."
                : "Try to complete more sessions to build your focus muscle."}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white mb-2">⚡ Peak Performance</h4>
            <p className="text-sm text-indigo-100">
              {hourlyDistribution.length > 0
                ? `Your peak focus time is around ${hourlyDistribution[0].hour}`
                : "Start tracking to discover your peak focus hours"}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white mb-2">📈 Growth</h4>
            <p className="text-sm text-indigo-100">
              {stats.streak >= 3
                ? `Amazing ${stats.streak} day streak! You're on fire 🔥`
                : "Build a daily habit to unlock your full potential"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
