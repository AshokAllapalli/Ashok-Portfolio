import React, { useState, useEffect } from 'react';
import { Code, Palette, Zap, Target, Award, BookOpen, Coffee, Heart } from 'lucide-react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = [
    { name: 'React.js & Node.js', level: 90 },
    { name: 'Express.js & REST APIs', level: 85 },
    { name: 'Prisma ORM (MySQL / PostgreSQL)', level: 85 },
    { name: 'Payment & Cloud Integrations', level: 80 },
  ];

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Full Stack Development',
      description: 'Building scalable web apps with React.js, Node.js, Express.js, and Prisma ORM'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'ERP & CRM Systems',
      description: 'Designing role-based, multi-tenant platforms for schools and businesses'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Payments & Integrations',
      description: 'Integrating Razorpay, Stripe, PayPal, Twilio, and SendGrid into production apps'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Real-Time & Cloud',
      description: 'Shipping real-time features with Socket.IO, AWS S3, and analytics dashboards'
    }
  ];

  return (
    <section id="about" className="relative min-h-screen py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      
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
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Get to know me</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Full Stack Developer building efficient, business-focused software solutions
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Left Column - Story */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                My Story
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  I'm Ashok Allapalli, a Full Stack Developer with hands-on experience designing
                  and building scalable web applications using React.js, Node.js, Express.js,
                  Prisma ORM, PostgreSQL, and MySQL.
                </p>
                <p>
                  At Abacco Technology, I've built a full-stack School ERP and multi-school SaaS
                  platform, a Garage CRM for vehicle service management, and an email
                  verification & marketing automation platform &mdash; integrating payment gateways,
                  OCR, GPS tracking, and real-time notifications along the way.
                </p>
                <p>
                  I enjoy turning real business problems into efficient, user-friendly software,
                  and I'm always exploring new technologies to sharpen my craft.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 text-blue-600">
                <Coffee className="w-5 h-5" />
                <span className="font-medium">Based in Anantapur District, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Skills & Expertise
              </h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-blue-600 font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 100 + 300}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">Certified:</span> Full Stack Web Development Certification &mdash; Kapil IT Skill Hub, Hyderabad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
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
      `}</style>
    </section>
  );
}