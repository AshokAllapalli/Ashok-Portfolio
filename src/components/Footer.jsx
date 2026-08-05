// Footer Component
import React from "react";
import { Linkedin, Github, Twitter, Instagram, Code, MapPin, Phone, Mail, Send } from "lucide-react";


function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ashok-allapalli-592b66301', icon: Linkedin, color: 'hover:bg-blue-600' },
    { name: 'GitHub', href: 'https://github.com/AshokAllapalli', icon: Github, color: 'hover:bg-gray-800' },
    // { name: 'Twitter', href: 'https://twitter.com/ashokallapalli', icon: Twitter, color: 'hover:bg-blue-400' },
    { name: 'Instagram', href: 'https://www.instagram.com/ashok_gowd_53/', icon: Instagram, color: 'hover:bg-pink-600' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
                <Code className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold">MyPortfolio</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building modern, beautiful, and fast websites with cutting-edge technologies.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color} group`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300 group">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span>Anantapur District, Andhra Pradesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 group">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span>+91 7032414961</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 group">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span>ashokallapalli790@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get the latest updates and news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MyPortfolio. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;