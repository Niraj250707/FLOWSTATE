import { useState, useEffect } from 'react';
import { User, Settings, Save, Download, Upload, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserProfile {
  name: string;
  email: string;
  studyGoal: number;
  notifications: boolean;
  autoStartBreaks: boolean;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}

interface SessionHistory {
  date: string;
  type: string;
  duration: number;
  focusScore?: number;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      studyGoal: 240,
      notifications: true,
      autoStartBreaks: false,
      theme: 'light',
      soundEnabled: true,
    };
  });

  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    // Load session history
    const focusSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const activitySessions = JSON.parse(localStorage.getItem('activitySessions') || '[]');
    const breakHistory = JSON.parse(localStorage.getItem('breakHistory') || '[]');

    const combined: SessionHistory[] = [
      ...focusSessions.map((s: any) => ({
        date: s.date,
        type: 'Focus Session',
        duration: s.duration,
      })),
      ...activitySessions.map((s: any) => ({
        date: new Date(s.startTime).toISOString(),
        type: 'Activity Monitor',
        duration: Math.floor((s.endTime - s.startTime) / 60000),
        focusScore: s.finalFocusScore,
      })),
      ...breakHistory.map((b: any) => ({
        date: new Date(b.timestamp).toISOString(),
        type: b.type,
        duration: 0,
      })),
    ];

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSessionHistory(combined);
  }, []);

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const exportData = () => {
    const data = {
      profile,
      focusSessions: JSON.parse(localStorage.getItem('focusSessions') || '[]'),
      activitySessions: JSON.parse(localStorage.getItem('activitySessions') || '[]'),
      breakHistory: JSON.parse(localStorage.getItem('breakHistory') || '[]'),
      blockerSettings: JSON.parse(localStorage.getItem('blockerSettings') || '{}'),
      timerSettings: JSON.parse(localStorage.getItem('timerSettings') || '{}'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowstate-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.profile) localStorage.setItem('userProfile', JSON.stringify(data.profile));
        if (data.focusSessions) localStorage.setItem('focusSessions', JSON.stringify(data.focusSessions));
        if (data.activitySessions) localStorage.setItem('activitySessions', JSON.stringify(data.activitySessions));
        if (data.breakHistory) localStorage.setItem('breakHistory', JSON.stringify(data.breakHistory));
        if (data.blockerSettings) localStorage.setItem('blockerSettings', JSON.stringify(data.blockerSettings));
        if (data.timerSettings) localStorage.setItem('timerSettings', JSON.stringify(data.timerSettings));

        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const totalSessions = sessionHistory.filter(s => s.type === 'Focus Session').length;
  const totalMinutes = sessionHistory
    .filter(s => s.type === 'Focus Session')
    .reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2>Your Profile</h2>
            <p className="text-gray-500">Manage your preferences and data</p>
          </div>
          {showSaveConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Saved!</span>
            </motion.div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-2xl mb-1">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{totalMinutes}</div>
            <div className="text-sm text-gray-600">Minutes Focused</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{sessionHistory.filter(s => s.type.includes('Break')).length}</div>
            <div className="text-sm text-gray-600">Breaks Taken</div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Daily Study Goal: {profile.studyGoal} minutes
            </label>
            <input
              type="range"
              min="30"
              max="480"
              step="30"
              value={profile.studyGoal}
              onChange={(e) => setProfile({ ...profile, studyGoal: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30 min</span>
              <span>8 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Preferences
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div>Enable Notifications</div>
              <div className="text-sm text-gray-500">Get reminders for breaks and sessions</div>
            </div>
            <input
              type="checkbox"
              checked={profile.notifications}
              onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div>Auto-start Breaks</div>
              <div className="text-sm text-gray-500">Automatically start break timer after focus sessions</div>
            </div>
            <input
              type="checkbox"
              checked={profile.autoStartBreaks}
              onChange={(e) => setProfile({ ...profile, autoStartBreaks: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <div>Sound Effects</div>
              <div className="text-sm text-gray-500">Play sounds when timer completes</div>
            </div>
            <input
              type="checkbox"
              checked={profile.soundEnabled}
              onChange={(e) => setProfile({ ...profile, soundEnabled: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <button
          onClick={saveProfile}
          className="w-full mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Data Management</h3>

        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export All Data
          </button>

          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              id="import-file"
            />
            <div
              onClick={() => document.getElementById('import-file')?.click()}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </div>
          </label>

          <button
            onClick={clearAllData}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Your data is stored locally in your browser. Export regularly to back up your progress.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Recent Activity</h3>

        {sessionHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400">Start a focus session to see your history</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessionHistory.slice(0, 20).map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{session.type}</span>
                    {session.focusScore && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        {session.focusScore}% focus
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleString()}
                  </div>
                </div>
                {session.duration > 0 && (
                  <div className="text-sm text-gray-600">{session.duration} min</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
