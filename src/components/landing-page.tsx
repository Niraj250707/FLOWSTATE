import { Timer, Brain, Shield, TrendingUp, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Timer className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl text-white">FlowState</span>
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6 border border-white/30">
                ✨ #1 Focus App for Students
              </div>
              
              <h1 className="text-5xl md:text-6xl text-white mb-6">
                Achieve Deep Focus & Peak Productivity
              </h1>
              
              <p className="text-xl text-purple-100 mb-8">
                Transform your study sessions with AI-powered focus tracking, smart break reminders, 
                and distraction blocking. Join thousands of students achieving their goals.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xl flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>

              <div className="flex items-center gap-8 text-white">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>50K+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-4xl">🎯</span>
                </div>
                
                <div className="bg-white/90 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-800">Focus Timer</span>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</div>
                  </div>
                  <div className="text-5xl text-center text-gray-800 mb-4">25:00</div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 2, delay: 0.8 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/90 rounded-xl p-4 text-center">
                    <div className="text-2xl text-gray-800">12</div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div className="bg-white/90 rounded-xl p-4 text-center">
                    <div className="text-2xl text-gray-800">95%</div>
                    <div className="text-xs text-gray-600">Focus</div>
                  </div>
                  <div className="bg-white/90 rounded-xl p-4 text-center">
                    <div className="text-2xl text-gray-800">5h</div>
                    <div className="text-xs text-gray-600">Today</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Everything You Need to Focus</h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to help you achieve peak productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Timer,
                title: 'Smart Pomodoro Timer',
                description: 'Customizable focus sessions with automatic break reminders',
                color: 'indigo',
              },
              {
                icon: Brain,
                title: 'AI Focus Tracking',
                description: 'Real-time activity monitoring to detect your focus levels',
                color: 'purple',
              },
              {
                icon: Shield,
                title: 'Distraction Blocker',
                description: 'Block distracting websites during study sessions',
                color: 'green',
              },
              {
                icon: TrendingUp,
                title: 'Analytics Dashboard',
                description: 'Detailed insights into your productivity patterns',
                color: 'blue',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">Why Students Love FlowState</h2>
              <div className="space-y-4">
                {[
                  'Increase study productivity by up to 300%',
                  'Reduce distractions and stay in the flow',
                  'Build consistent study habits with streak tracking',
                  'Get personalized break suggestions based on activity',
                  'Track progress with detailed analytics',
                  'Sync data across all your devices',
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Active Users', value: '50K+', icon: '👥' },
                { label: 'Study Hours', value: '2M+', icon: '⏰' },
                { label: 'Success Rate', value: '94%', icon: '🎯' },
                { label: 'Avg. Rating', value: '4.9★', icon: '⭐' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl text-white mb-6">
              Ready to Achieve Peak Focus?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of students who are already improving their productivity
            </p>
            <motion.button
              onClick={onGetStarted}
              className="px-12 py-5 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-colors shadow-2xl text-lg inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">FlowState</span>
          </div>
          <p className="text-gray-400 mb-4">Your AI-Powered Focus Companion</p>
          <p className="text-sm text-gray-500">© 2025 FlowState. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
