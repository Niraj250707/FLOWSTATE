import { useState, useEffect } from 'react';
import { Timer, Activity, Shield, Coffee, BarChart3, User, Trophy, HelpCircle } from 'lucide-react';
import { FocusTimer } from './components/focus-timer';
import { ActivityMonitor } from './components/activity-monitor';
import { DistractionBlocker } from './components/distraction-blocker';
import { MicroBreaks } from './components/micro-breaks';
import { Dashboard } from './components/dashboard';
import { Profile } from './components/profile';
import { Achievements } from './components/achievements';
import { HelpCenter } from './components/help-center';
import { LandingPage } from './components/landing-page';
import { AuthPage } from './components/auth-page';
import { Onboarding } from './components/onboarding';

type View = 'timer' | 'activity' | 'blocker' | 'breaks' | 'dashboard' | 'profile' | 'achievements' | 'help';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('timer');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const savedUser = localStorage.getItem('currentUser');
    
    if (hasVisited && savedUser) {
      setShowLanding(false);
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    } else if (hasVisited) {
      setShowLanding(false);
    }
  }, []);

  const handleAuth = (user: any, isNewUser: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('hasVisited', 'true');
    
    if (isNewUser) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setShowLanding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthPage onAuth={handleAuth} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>FlowState</h1>
                <p className="text-sm text-gray-500">Welcome back, {currentUser?.name || 'Student'}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isSessionActive && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-700">Session Active</span>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'timer' as View, icon: Timer, label: 'Focus Timer' },
              { id: 'activity' as View, icon: Activity, label: 'Activity' },
              { id: 'blocker' as View, icon: Shield, label: 'Blocker' },
              { id: 'breaks' as View, icon: Coffee, label: 'Breaks' },
              { id: 'dashboard' as View, icon: BarChart3, label: 'Dashboard' },
              { id: 'profile' as View, icon: User, label: 'Profile' },
              { id: 'achievements' as View, icon: Trophy, label: 'Achievements' },
              { id: 'help' as View, icon: HelpCircle, label: 'Help' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  currentView === item.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'timer' && <FocusTimer onSessionChange={setIsSessionActive} />}
        {currentView === 'activity' && <ActivityMonitor />}
        {currentView === 'blocker' && <DistractionBlocker />}
        {currentView === 'breaks' && <MicroBreaks />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'profile' && <Profile />}
        {currentView === 'achievements' && <Achievements />}
        {currentView === 'help' && <HelpCenter />}
      </main>
    </div>
  );
}