import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Heart,
  ArrowUp,
  Star,
  Users,
  Award,
  Zap
} from 'lucide-react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    { icon: Users, text: "10K+ Active Users", delay: "0s" },
    { icon: Award, text: "500+ Projects Completed", delay: "0.2s" },
    { icon: Star, text: "4.9/5 Rating", delay: "0.4s" },
    { icon: Zap, text: "99.9% Uptime", delay: "0.6s" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500/10 rounded-full animate-bounce-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group animate-slide-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-xl mb-3 group-hover:bg-blue-600/30 transition-all duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              </div>
              <p className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 animate-fade-in-up">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3" />
                <div className="absolute -inset-2 bg-blue-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-glow"></div>
              </div>
              <span className="text-2xl font-display font-bold group-hover:text-blue-300 transition-colors duration-300">
                Smart FYP Handler
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed font-sans">
              Revolutionizing Final Year Project management with cutting-edge technology.
              Empowering students, supervisors, and administrators to achieve excellence.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium">support@smartfyp.com</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-green-400 transition-colors duration-300 group">
                <Phone className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium">+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { Icon: Github, color: "hover:text-gray-300", bg: "hover:bg-gray-700" },
                { Icon: Twitter, color: "hover:text-blue-400", bg: "hover:bg-blue-900/30" },
                { Icon: Linkedin, color: "hover:text-blue-500", bg: "hover:bg-blue-900/30" }
              ].map(({ Icon, color, bg }, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-xl bg-gray-800/50 text-gray-400 ${color} ${bg} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group`}
                >
                  <Icon className="h-5 w-5 group-hover:animate-pulse" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-display font-semibold mb-6 text-blue-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", text: "Home" },
                { to: "/rankings", text: "Rankings" },
                { to: "/search", text: "Search" },
                { to: "/login", text: "Sign In" },
                { to: "/register", text: "Register" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center"
                    onMouseEnter={() => setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`transform transition-all duration-300 ${hoveredLink === index ? 'translate-x-2' : ''}`}>
                      {link.text}
                    </span>
                    <ArrowUp className={`h-3 w-3 ml-2 transform transition-all duration-300 ${hoveredLink === index ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-display font-semibold mb-6 text-purple-300">Features</h3>
            <ul className="space-y-3">
              {[
                "Project Management",
                "Performance Analytics",
                "Real-time Collaboration",
                "Progress Tracking",
                "Grade Management"
              ].map((feature, index) => (
                <li key={index}>
                  <div className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center cursor-pointer">
                    <Star className="h-3 w-3 mr-2 text-yellow-400 group-hover:animate-pulse" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {feature}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center animate-fade-in-up">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© 2025 Smart FYP Handler. Made with</span>
              <Heart className="h-4 w-4 mx-2 text-red-400 animate-pulse" />
              <span>for academic excellence</span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-6">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy"
                ].map((link, index) => (
                  <button
                    key={index}
                    className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline decoration-blue-400 underline-offset-4"
                  >
                    {link}
                  </button>
                ))}
              </div>

              {/* Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="group flex items-center justify-center w-10 h-10 bg-blue-600/20 hover:bg-blue-600/30 rounded-full transition-all duration-300 hover:scale-110 border border-blue-500/20 hover:border-blue-400/40"
              >
                <ArrowUp className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transform group-hover:-translate-y-0.5 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Version info */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 font-mono">
              v2.1.0 | Built with React & Tailwind CSS | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
