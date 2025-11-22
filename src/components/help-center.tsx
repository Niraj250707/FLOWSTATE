import { useState } from 'react';
import { HelpCircle, PlayCircle, BookOpen, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');

  const faqs = [
    {
      category: 'getting-started',
      title: 'Getting Started',
      icon: PlayCircle,
      questions: [
        {
          q: 'How do I start my first focus session?',
          a: 'Navigate to the Focus Timer tab, click the "Start" button, and begin your session. The timer will automatically count down and notify you when it\'s time for a break.',
        },
        {
          q: 'What is the Pomodoro Technique?',
          a: 'The Pomodoro Technique is a time management method where you work for 25 minutes, then take a 5-minute break. After 4 sessions, you take a longer 15-30 minute break. This helps maintain focus and prevents burnout.',
        },
        {
          q: 'How do I customize my timer settings?',
          a: 'In the Focus Timer page, click the settings icon next to the timer. You can adjust focus duration, break lengths, and the number of sessions before a long break.',
        },
        {
          q: 'Can I set a daily study goal?',
          a: 'Yes! Go to your Profile page and set your daily study goal. You\'ll see your progress on the timer page and dashboard.',
        },
      ],
    },
    {
      category: 'features',
      title: 'Features',
      icon: BookOpen,
      questions: [
        {
          q: 'What is Activity Monitoring?',
          a: 'Activity monitoring tracks your mouse movements, keystrokes, and tab switches to calculate a focus score in real-time. This helps you understand your concentration patterns.',
        },
        {
          q: 'How does the Distraction Blocker work?',
          a: 'Add distracting websites to your blocklist. When blocking is enabled during a focus session, you\'ll be reminded to stay focused if you try to visit those sites. (Note: Full blocking requires a browser extension)',
        },
        {
          q: 'What are Micro-Breaks?',
          a: 'Micro-breaks are short exercises (20-20-20 eye rule, stretches, breathing) suggested based on your activity level. They help prevent fatigue and maintain long-term focus.',
        },
        {
          q: 'How do Achievements work?',
          a: 'Complete focus sessions, maintain streaks, and reach milestones to unlock achievements. They range from common to legendary rarity and help gamify your productivity journey.',
        },
      ],
    },
    {
      category: 'data',
      title: 'Data & Privacy',
      icon: MessageCircle,
      questions: [
        {
          q: 'Where is my data stored?',
          a: 'All your data is stored locally in your browser\'s localStorage. Nothing is sent to external servers, ensuring your privacy and data security.',
        },
        {
          q: 'Can I export my data?',
          a: 'Yes! Go to your Profile page and use the "Export All Data" button to download a JSON file with all your sessions, settings, and progress.',
        },
        {
          q: 'How do I backup my data?',
          a: 'Regularly export your data from the Profile page. You can also import this data later to restore your progress or transfer it to another device.',
        },
        {
          q: 'What happens if I clear my browser data?',
          a: 'If you clear your browser\'s localStorage, all your FlowState data will be lost. Make sure to export your data regularly as a backup.',
        },
      ],
    },
  ];

  const tutorials = [
    {
      title: 'Setting Up Your First Session',
      duration: '2 min',
      steps: ['Choose your focus duration', 'Click Start', 'Work without distractions', 'Take breaks when prompted'],
      icon: '🎯',
    },
    {
      title: 'Maximizing Your Focus Score',
      duration: '3 min',
      steps: ['Minimize tab switching', 'Stay active but not hyperactive', 'Avoid distractions', 'Take regular breaks'],
      icon: '📈',
    },
    {
      title: 'Building a Study Routine',
      duration: '4 min',
      steps: ['Set a realistic daily goal', 'Choose consistent study times', 'Track your progress', 'Celebrate milestones'],
      icon: '📅',
    },
  ];

  const activeFAQ = faqs.find(f => f.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-white text-3xl mb-2">Help Center</h2>
            <p className="text-purple-100">Everything you need to master FlowState</p>
          </div>
        </div>
      </div>

      {/* Quick Tutorials */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Quick Start Tutorials</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3">{tutorial.icon}</div>
              <h4 className="mb-2">{tutorial.title}</h4>
              <div className="text-sm text-gray-600 mb-4">{tutorial.duration} read</div>
              
              <ul className="space-y-2 mb-4">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-600 flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                Start Tutorial
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
            {faqs.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                  activeCategory === category.category
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-sm">{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="mb-6">{activeFAQ?.title}</h3>
            
            <div className="space-y-6">
              {activeFAQ?.questions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="pb-6 border-b border-gray-200 last:border-0"
                >
                  <h4 className="mb-3 text-gray-900">{item.q}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="mb-4">Video Guides</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Complete FlowState Overview', duration: '5:30', thumbnail: '🎬' },
            { title: 'Advanced Focus Techniques', duration: '8:15', thumbnail: '🧠' },
            { title: 'Productivity Tips & Tricks', duration: '6:45', thumbnail: '💡' },
            { title: 'Using Analytics Dashboard', duration: '4:20', thumbnail: '📊' },
          ].map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {video.thumbnail}
              </div>
              <div className="flex-1">
                <h4 className="mb-1">{video.title}</h4>
                <div className="text-sm text-gray-600">{video.duration}</div>
              </div>
              <PlayCircle className="w-8 h-8 text-indigo-600" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <h3 className="mb-4">Still Need Help?</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl transition-colors">
            <Mail className="w-6 h-6 text-indigo-600" />
            <div className="text-left">
              <div>Email Support</div>
              <div className="text-sm text-gray-600">support@flowstate.app</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl transition-colors">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <div className="text-left">
              <div>Community Forum</div>
              <div className="text-sm text-gray-600">Ask questions & share tips</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
