import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Globe, Bell, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlockedSite {
  id: string;
  url: string;
  category: string;
}

interface BlockerSettings {
  blockingEnabled: boolean;
  blockNotifications: boolean;
  blockedSites: BlockedSite[];
  customMessage: string;
}

export function DistractionBlocker() {
  const [settings, setSettings] = useState<BlockerSettings>(() => {
    const saved = localStorage.getItem('blockerSettings');
    return saved ? JSON.parse(saved) : {
      blockingEnabled: false,
      blockNotifications: false,
      blockedSites: [
        { id: '1', url: 'twitter.com', category: 'Social Media' },
        { id: '2', url: 'facebook.com', category: 'Social Media' },
        { id: '3', url: 'instagram.com', category: 'Social Media' },
        { id: '4', url: 'youtube.com', category: 'Entertainment' },
        { id: '5', url: 'reddit.com', category: 'Social Media' },
      ],
      customMessage: 'Stay focused! You can visit this site later.',
    };
  });

  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteCategory, setNewSiteCategory] = useState('Social Media');
  const [blockedAttempts, setBlockedAttempts] = useState(0);

  useEffect(() => {
    localStorage.setItem('blockerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.blockingEnabled) {
      // Simulate blocking notifications
      if (settings.blockNotifications) {
        console.log('Notifications blocked');
      }
    }
  }, [settings.blockingEnabled, settings.blockNotifications]);

  const addBlockedSite = () => {
    if (!newSiteUrl.trim()) return;

    const newSite: BlockedSite = {
      id: Date.now().toString(),
      url: newSiteUrl.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
      category: newSiteCategory,
    };

    setSettings({
      ...settings,
      blockedSites: [...settings.blockedSites, newSite],
    });

    setNewSiteUrl('');
  };

  const removeSite = (id: string) => {
    setSettings({
      ...settings,
      blockedSites: settings.blockedSites.filter(site => site.id !== id),
    });
  };

  const toggleBlocking = () => {
    const newState = !settings.blockingEnabled;
    setSettings({ ...settings, blockingEnabled: newState });
    
    if (newState) {
      // Save activation event
      const events = JSON.parse(localStorage.getItem('blockerEvents') || '[]');
      events.push({
        timestamp: Date.now(),
        type: 'activated',
        blockedSitesCount: settings.blockedSites.length,
      });
      localStorage.setItem('blockerEvents', JSON.stringify(events));
    }
  };

  const categories = ['Social Media', 'Entertainment', 'News', 'Shopping', 'Other'];

  const groupedSites = settings.blockedSites.reduce((acc, site) => {
    if (!acc[site.category]) {
      acc[site.category] = [];
    }
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, BlockedSite[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              settings.blockingEnabled
                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2>Distraction Blocker</h2>
              <p className="text-sm text-gray-500">
                {settings.blockingEnabled ? 'Protection Active' : 'Protection Disabled'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleBlocking}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
              settings.blockingEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <motion.span
              className="inline-block h-10 w-10 transform rounded-full bg-white shadow-lg"
              animate={{ x: settings.blockingEnabled ? 50 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {settings.blockingEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">
                Distraction blocker is active. {settings.blockedSites.length} sites are blocked.
              </p>
              <p className="text-sm text-green-600 mt-1">
                Blocked attempts: {blockedAttempts}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Blocking Options</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <div>Block Notifications</div>
                <div className="text-sm text-gray-500">
                  Silence distracting notifications during focus sessions
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.blockNotifications}
              onChange={(e) => setSettings({ ...settings, blockNotifications: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block mb-2">Custom Block Message</label>
            <input
              type="text"
              value={settings.customMessage}
              onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter custom message..."
            />
            <p className="text-sm text-gray-500 mt-2">
              This message will be shown when you try to visit a blocked site
            </p>
          </div>
        </div>
      </div>

      {/* Add New Site */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Add Blocked Site</h3>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newSiteUrl}
              onChange={(e) => setNewSiteUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBlockedSite()}
              placeholder="example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={newSiteCategory}
            onChange={(e) => setNewSiteCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button
            onClick={addBlockedSite}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Blocked Sites List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Blocked Sites ({settings.blockedSites.length})</h3>
        
        {settings.blockedSites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sites blocked yet</p>
            <p className="text-sm text-gray-400">Add sites above to start blocking distractions</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSites).map(([category, sites]) => (
              <div key={category}>
                <div className="text-sm text-gray-500 mb-2">{category}</div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {sites.map((site) => (
                      <motion.div
                        key={site.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <span>{site.url}</span>
                        </div>
                        
                        <button
                          onClick={() => removeSite(site.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="mb-2">
              <strong>Note:</strong> This is a demonstration of distraction blocking functionality.
            </p>
            <p>
              In a real implementation, this would require a browser extension to actually block websites.
              The app currently tracks your blocked sites list and settings for reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
