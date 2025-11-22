import { useState } from 'react';
import { Timer, Target, Bell, Sparkles, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    studyGoal: 120,
    notifications: true,
    focusDuration: 25,
    breakDuration: 5,
    studyType: 'student',
  });

  const steps = [
    {
      title: 'Welcome to FlowState! 🎉',
      description: 'Let\'s personalize your experience in just a few steps',
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <Timer className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-2xl mb-3">Ready to Boost Your Focus?</h2>
            <p className="text-gray-600">
              FlowState helps you achieve deep focus through proven techniques and smart automation
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { emoji: '🎯', label: 'Track Focus' },
              { emoji: '⏰', label: 'Smart Timer' },
              { emoji: '📊', label: 'Analytics' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl text-center"
              >
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <div className="text-sm text-gray-700">{feature.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'What Describes You Best?',
      description: 'This helps us customize your experience',
      icon: Target,
      content: (
        <div className="space-y-3">
          {[
            { value: 'student', label: 'Student', emoji: '🎓', desc: 'Studying for exams or coursework' },
            { value: 'professional', label: 'Professional', emoji: '💼', desc: 'Working on projects and tasks' },
            { value: 'researcher', label: 'Researcher', emoji: '🔬', desc: 'Deep work and research' },
            { value: 'creative', label: 'Creative', emoji: '🎨', desc: 'Creative work and projects' },
          ].map((type) => (
            <motion.button
              key={type.value}
              onClick={() => setPreferences({ ...preferences, studyType: type.value })}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                preferences.studyType === type.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{type.emoji}</div>
                <div className="flex-1">
                  <div className={`mb-1 ${preferences.studyType === type.value ? 'text-white' : ''}`}>
                    {type.label}
                  </div>
                  <div className={`text-sm ${
                    preferences.studyType === type.value ? 'text-purple-100' : 'text-gray-600'
                  }`}>
                    {type.desc}
                  </div>
                </div>
                {preferences.studyType === type.value && (
                  <Check className="w-6 h-6 text-white" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'Set Your Daily Goal',
      description: 'How much time do you want to focus each day?',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              key={preferences.studyGoal}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              {preferences.studyGoal} <span className="text-3xl text-gray-500">min</span>
            </motion.div>
            <div className="text-gray-600">
              {(preferences.studyGoal / 60).toFixed(1)} hours per day
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="30"
              max="480"
              step="30"
              value={preferences.studyGoal}
              onChange={(e) => setPreferences({ ...preferences, studyGoal: parseInt(e.target.value) })}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((preferences.studyGoal - 30) / 450) * 100}%, #e5e7eb ${((preferences.studyGoal - 30) / 450) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>30 min</span>
              <span>8 hours</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[60, 120, 240].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setPreferences({ ...preferences, studyGoal: minutes })}
                className={`py-3 px-4 rounded-xl transition-all ${
                  preferences.studyGoal === minutes
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Customize Your Timer',
      description: 'Set your preferred focus and break durations',
      icon: Timer,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-700">Focus Duration</label>
                <span className="text-lg">{preferences.focusDuration} min</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={preferences.focusDuration}
                onChange={(e) => setPreferences({ ...preferences, focusDuration: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((preferences.focusDuration - 15) / 75) * 100}%, #e5e7eb ${((preferences.focusDuration - 15) / 75) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 min</span>
                <span>90 min</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-700">Break Duration</label>
                <span className="text-lg">{preferences.breakDuration} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={preferences.breakDuration}
                onChange={(e) => setPreferences({ ...preferences, breakDuration: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((preferences.breakDuration - 5) / 25) * 100}%, #e5e7eb ${((preferences.breakDuration - 5) / 25) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>30 min</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-sm text-indigo-900 mb-1">
                  <strong>Pro Tip:</strong> The Pomodoro Technique (25 min work + 5 min break) is scientifically proven to boost productivity!
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Enable Notifications',
      description: 'Stay on track with smart reminders',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <Bell className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Session Reminders', desc: 'Get notified when it\'s time to focus' },
              { title: 'Break Alerts', desc: 'Reminders to take healthy breaks' },
              { title: 'Goal Progress', desc: 'Daily updates on your progress' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <label className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl cursor-pointer">
            <div>
              <div className="mb-1">Enable Notifications</div>
              <div className="text-sm text-gray-600">You can change this later in settings</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
              className="w-6 h-6 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences
      localStorage.setItem('timerSettings', JSON.stringify({
        focusDuration: preferences.focusDuration,
        shortBreakDuration: preferences.breakDuration,
        longBreakDuration: preferences.breakDuration * 3,
        sessionsUntilLongBreak: 4,
      }));

      localStorage.setItem('userProfile', JSON.stringify({
        name: '',
        email: '',
        studyGoal: preferences.studyGoal,
        notifications: preferences.notifications,
        autoStartBreaks: false,
        theme: 'light',
        soundEnabled: true,
        studyType: preferences.studyType,
      }));

      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  {(() => {
                    const StepIcon = steps[currentStep].icon;
                    return <StepIcon className="w-6 h-6 text-indigo-600" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl">{steps[currentStep].title}</h2>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                </div>
              </div>

              {/* Step Content */}
              <div className="mt-8 mb-8">
                {steps[currentStep].content}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Get Started
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
