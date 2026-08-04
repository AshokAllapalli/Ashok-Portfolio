import React, { useState, useEffect } from 'react';
import { Code2, Palette, Server, Layers, Sparkles, TrendingUp, Database, Zap, Radio } from 'lucide-react';

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skillsData = [
    // Frontend
    {
      category: 'frontend',
      name: 'HTML5',
      level: 95,
      icon: <Code2 className="w-8 h-8 text-orange-500" />,
      color: 'from-orange-500 to-red-500',
      description: 'Semantic markup & accessibility'
    },
    {
      category: 'frontend',
      name: 'CSS3',
      level: 90,
      icon: <Palette className="w-8 h-8 text-blue-500" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Modern layouts & animations'
    },
    {
      category: 'frontend',
      name: 'JavaScript (ES6+)',
      level: 88,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Core language for interactive apps'
    },
    {
      category: 'frontend',
      name: 'React.js',
      level: 90,
      icon: <Sparkles className="w-8 h-8 text-cyan-500" />,
      color: 'from-cyan-500 to-blue-500',
      description: 'Component-based architecture'
    },
    {
      category: 'frontend',
      name: 'Tailwind CSS / Bootstrap',
      level: 88,
      icon: <Layers className="w-8 h-8 text-teal-500" />,
      color: 'from-teal-500 to-cyan-500',
      description: 'Responsive design frameworks'
    },
    // Backend
    {
      category: 'backend',
      name: 'Node.js',
      level: 85,
      icon: <Server className="w-8 h-8 text-green-500" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Server-side JavaScript runtime'
    },
    {
      category: 'backend',
      name: 'Express.js',
      level: 85,
      icon: <Server className="w-8 h-8 text-emerald-600" />,
      color: 'from-emerald-500 to-teal-500',
      description: 'REST API & server-side routing'
    },
    {
      category: 'backend',
      name: 'REST APIs',
      level: 85,
      icon: <Server className="w-8 h-8 text-indigo-500" />,
      color: 'from-indigo-500 to-blue-500',
      description: 'Designing & consuming APIs'
    },
    {
      category: 'backend',
      name: 'Socket.IO',
      level: 75,
      icon: <Radio className="w-8 h-8 text-violet-500" />,
      color: 'from-violet-500 to-purple-500',
      description: 'Real-time web applications'
    },
    // Database
    {
      category: 'database',
      name: 'MySQL',
      level: 85,
      icon: <Database className="w-8 h-8 text-orange-600" />,
      color: 'from-orange-500 to-amber-500',
      description: 'Relational database design'
    },
    {
      category: 'database',
      name: 'PostgreSQL',
      level: 80,
      icon: <Database className="w-8 h-8 text-blue-600" />,
      color: 'from-blue-600 to-indigo-500',
      description: 'Scalable relational data storage'
    },
    {
      category: 'database',
      name: 'Prisma ORM',
      level: 80,
      icon: <Database className="w-8 h-8 text-purple-600" />,
      color: 'from-purple-500 to-fuchsia-500',
      description: 'Type-safe database access'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Skills', icon: <Layers className="w-4 h-4" /> },
    { id: 'frontend', label: 'Frontend', icon: <Palette className="w-4 h-4" /> },
    { id: 'backend', label: 'Backend', icon: <Server className="w-4 h-4" /> },
    { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeCategory);

  const stats = [
    { label: 'Technologies', value: '12+', icon: <Code2 className="w-6 h-6" /> },
    { label: 'Years Experience', value: '2', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Projects Built', value: '5+', icon: <Sparkles className="w-6 h-6" /> }
  ];

  return (
    <section id="skills" className="relative min-h-screen py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">What I Know</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            My{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The stack I use to build scalable, full-stack web applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md hover:shadow-lg'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              className={`bg-white rounded-2xl p-8 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              {/* Skill Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{skill.level}%</div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: isVisible ? `${skill.level}%` : '0%',
                    transitionDelay: `${index * 100 + 500}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>

              {/* Proficiency Label */}
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Proficiency</span>
                <span className="font-semibold text-gray-700">
                  {skill.level >= 90 ? 'Expert' : skill.level >= 80 ? 'Advanced' : 'Intermediate'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <p className="text-gray-700">
              <span className="font-semibold text-blue-600">Tools & Cloud:</span> Git, GitHub, Postman, VS Code, AWS S3, Razorpay, Render, Bluehost
            </p>
          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}