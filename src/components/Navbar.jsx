import React, { useState } from 'react';
import { Home, User, Code, Briefcase, Mail, Menu, X, } from 'lucide-react';

// Navbar Component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Skills', href: '/skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: Mail }
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
             <img
                src="/photos/ashok-1.jpg"
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover border-2 border-blue-500 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              MyPortfolio
            </h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>{link.name}</span>
                  </a>
                </li>
              );
            })}
            <li>
              <button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
                Hire Me
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fadeIn">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
                  Hire Me
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;