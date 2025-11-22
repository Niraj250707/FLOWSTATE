import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Award, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first focus session',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      target: 1,
      rarity: 'common',
    },
    {
      id: '2',
      title: 'Focus Warrior',
      description: 'Complete 10 focus sessions',
      icon: '⚔️',
      unlocked: false,
      progress: 0,
      target: 10,
      rarity: 'common',
    },
    {
      id: '3',
      title: 'Marathon Runner',
      description: 'Focus for 100 hours total',
      icon: '🏃',
      unlocked: false,
      progress: 0,
      target: 6000,
      rarity: 'rare',
    },
    {
      id: '4',
      title: 'Week Streak',
      description: 'Study for 7 days in a row',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      target: 7,
      rarity: 'rare',
    },
    {
      id: '5',
      title: 'Early Bird',
      description: 'Complete a session before 8 AM',
      icon: '🌅',
      unlocked: false,
      progress: 0,
      target: 1,
      rarity: 'common',
    },
    {
      id: '6',
      title: 'Night Owl',
      description: 'Complete a session after 10 PM',
      icon: '🦉',
      unlocked: false,
      progress: 0,
      target: 1,
      rarity: 'common',
    },
    {
      id: '7',
      title: 'Century Club',
      description: 'Complete 100 focus sessions',
      icon: '💯',
      unlocked: false,
      progress: 0,
      target: 100,
      rarity: 'epic',
    },
    {
      id: '8',
      title: 'Zen Master',
      description: 'Maintain 90%+ focus score for 10 sessions',
      icon: '🧘',
      unlocked: false,
      progress: 0,
      target: 10,
      rarity: 'epic',
    },
    {
      id: '9',
      title: 'Unstoppable',
      description: 'Achieve a 30-day streak',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      target: 30,
      rarity: 'legendary',
    },
    {
      id: '10',
      title: 'Focus Legend',
      description: 'Complete 1000 focus sessions',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 1000,
      rarity: 'legendary',
    },
  ]);

  useEffect(() => {
    // Calculate achievement progress
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const activitySessions = JSON.parse(localStorage.getItem('activitySessions') || '[]');

    const completedSessions = sessions.filter((s: any) => s.completed).length;
    const totalMinutes = sessions.reduce((acc: number, s: any) => s.completed ? acc + s.duration : acc, 0);

    // Calculate streak
    const dates = new Set(sessions.map((s: any) => new Date(s.date).toDateString()));
    let streak = 0;
    const date = new Date();
    while (dates.has(date.toDateString())) {
      streak++;
      date.setDate(date.getDate() - 1);
    }

    // Check for early bird and night owl
    const earlyBird = sessions.some((s: any) => new Date(s.date).getHours() < 8);
    const nightOwl = sessions.some((s: any) => new Date(s.date).getHours() >= 22);

    // Check high focus sessions
    const highFocusSessions = activitySessions.filter((s: any) => s.finalFocusScore >= 90).length;

    setAchievements(prev => prev.map(achievement => {
      let progress = 0;
      let unlocked = false;

      switch (achievement.id) {
        case '1': // First Steps
          progress = Math.min(completedSessions, 1);
          unlocked = completedSessions >= 1;
          break;
        case '2': // Focus Warrior
          progress = completedSessions;
          unlocked = completedSessions >= 10;
          break;
        case '3': // Marathon Runner
          progress = totalMinutes;
          unlocked = totalMinutes >= 6000;
          break;
        case '4': // Week Streak
          progress = streak;
          unlocked = streak >= 7;
          break;
        case '5': // Early Bird
          progress = earlyBird ? 1 : 0;
          unlocked = earlyBird;
          break;
        case '6': // Night Owl
          progress = nightOwl ? 1 : 0;
          unlocked = nightOwl;
          break;
        case '7': // Century Club
          progress = completedSessions;
          unlocked = completedSessions >= 100;
          break;
        case '8': // Zen Master
          progress = highFocusSessions;
          unlocked = highFocusSessions >= 10;
          break;
        case '9': // Unstoppable
          progress = streak;
          unlocked = streak >= 30;
          break;
        case '10': // Focus Legend
          progress = completedSessions;
          unlocked = completedSessions >= 1000;
          break;
      }

      return { ...achievement, progress, unlocked };
    }));
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = unlockedCount * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-3xl mb-2">Achievements</h2>
            <p className="text-purple-100">Unlock badges and earn rewards for your progress</p>
          </div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Trophy className="w-10 h-10 text-yellow-300" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-purple-100">Unlocked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">{totalPoints}</div>
            <div className="text-sm text-purple-100">Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl mb-1">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-purple-100">Complete</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm whitespace-nowrap transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
              achievement.unlocked ? getRarityBorder(achievement.rarity) : 'border-gray-200'
            } ${!achievement.unlocked && 'opacity-60'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center text-3xl shadow-lg ${
                  !achievement.unlocked && 'grayscale'
                }`}
              >
                {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-white" />}
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs capitalize ${
                achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700' :
                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {achievement.rarity}
              </div>
            </div>

            <h3 className="mb-2">{achievement.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className={achievement.unlocked ? 'text-green-600' : 'text-gray-600'}>
                  {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
              </div>
            </div>

            {achievement.unlocked && (
              <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                <Award className="w-4 h-4" />
                <span>Unlocked!</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Motivational Message */}
      {unlockedCount === 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="mb-2">Start Your Journey!</h3>
          <p className="text-gray-600">
            Complete your first focus session to unlock your first achievement
          </p>
        </div>
      )}
    </div>
  );
}
