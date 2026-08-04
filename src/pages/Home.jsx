import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Download,
  Sparkles,
  Code,
  Zap,
  Target,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from "lucide-react";
import {
  Home,
  User,
  Briefcase,
  Menu,
  X,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Skills", href: "#skills", icon: Code },
    { name: "Projects", href: "#projects", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: Mail },
  ];
  return (
    <div>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                <a href="#home">Ashok Allapalli</a>
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
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-blue-600" />
              ) : (
                <Menu className="w-6 h-6 text-blue-600" />
              )}
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
      
      {/* home */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT SIDE - Content */}
            <div className="space-y-8">
              {/* Badge with Glass Effect */}
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full border border-blue-200 shadow-lg transition-all duration-700 hover:bg-white hover:scale-105 hover:shadow-xl ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold tracking-wide">
                  Welcome to my portfolio
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>

              {/* Main Heading */}
              <div
                className={`transition-all duration-700 delay-100 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <h2 className="text-2xl md:text-3xl text-gray-600 font-medium mb-4">
                  Hi, I'm
                </h2>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                  <span className="relative inline-block group">
                    <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                      Ashok Allapalli
                    </span>
                    {/* Animated underline */}
                    <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </span>
                </h1>
              </div>

              {/* Subtitle with Icons */}
              <div
                className={`flex flex-wrap gap-3 transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 rounded-xl border border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">Frontend Developer</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 rounded-xl border border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">React Specialist</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 rounded-xl border border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">UI/UX Enthusiast</span>
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-lg md:text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                Crafting{" "}
                <span className="text-blue-600 font-semibold">beautiful</span>,{" "}
                <span className="text-blue-600 font-semibold">responsive</span>{" "}
                web experiences with modern technologies. Passionate about{" "}
                <span className="text-blue-600 font-semibold">clean code</span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold">
                  intuitive design
                </span>
                .
              </p>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">View My Work</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </a>

                <a
                  href="#contact"
                  className="group relative inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold border-2 border-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                  <span>Download CV</span>
                </a>
              </div>

              
            </div>
             

            {/* RIGHT SIDE - Image with Advanced Effects */}
            <div
              className={`flex justify-center lg:justify-end transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative group">
                {/* Outer Glow Ring - Animated */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
                
                {/* Rotating Border */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
                
                {/* Inner Container */}
                <div className="relative w-72 h-52 md:w-96 md:h-96">
                  {/* Geometric Shapes Background */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-400 rounded-full blur-xl opacity-60 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400 rounded-full blur-xl opacity-60 group-hover:scale-150 transition-transform duration-700"></div>
                  </div>

                  {/* Main Image Container */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-105">
                    {/* Image */}
                    <img
                      src="/photos/ashok-1.jpg"
                      alt="Ashok Allapalli"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-500">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Available</span>
                  </div>

                  {/* Floating Icons */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 border-2 border-blue-100">
                    <Code className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500 border-2 border-purple-100">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

            
              </div>
            </div>

          </div>
        </div>
      </section>

      
      <div className="" id="about">
        <About />
      </div>
      <div className="" id="skills">
        <Skills />
      </div>
      <div className="" id="projects">
        <Projects />
      </div>
      <div className="" id="contact">
        <Contact />
      </div>
    </div>
  );
}
