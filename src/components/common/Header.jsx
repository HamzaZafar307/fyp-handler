import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Menu, X, User, LogOut, Trophy, Search, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { USER_ROLES } from '../../utils/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsProfileOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group animate-fade-in" onClick={closeMenus}>
            <div className="relative">
              <BookOpen className="h-8 w-8 text-blue-600 transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3" />
              <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-display font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              Smart FYP Handler
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 animate-slide-up">
            <Link to="/" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group">
              <span>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group">
                  <span>Dashboard</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/rankings" className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group relative">
                  <Trophy className="h-4 w-4 mr-1 transform group-hover:scale-110 transition-transform duration-300" />
                  <span>Rankings</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/search" className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group relative">
                  <Search className="h-4 w-4 mr-1 transform group-hover:scale-110 transition-transform duration-300" />
                  <span>Search</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link to="/ai" className="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium group relative">
                  <Brain className="h-4 w-4 mr-1 transform group-hover:scale-110 transition-transform duration-300" />
                  <span>AI Recommendations</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group px-3 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <div className="relative">
                      <User className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute -inset-1 bg-blue-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-display">{user?.firstName || 'User'}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsProfileOpen(false)}
                      ></div>
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-900 border-b">
                            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                            <div className="text-gray-500">{user?.email}</div>
                            <div className="text-xs text-blue-600">{user?.role}</div>
                          </div>
                          {user?.role === USER_ROLES.TEACHER && (
                            <Link
                              to="/teacher/ranking-management"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Trophy className="h-4 w-4 mr-2" />
                              Manage Rankings
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition duration-150"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-10 md:hidden" 
              onClick={() => setIsMenuOpen(false)}
            ></div>
            
            {/* Mobile Menu */}
            <div className="md:hidden py-4 border-t border-gray-200 relative z-20 bg-white">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 transition duration-150"
                  onClick={closeMenus}
                >
                  Home
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition duration-150"
                      onClick={closeMenus}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/rankings"
                      className="flex items-center text-gray-700 hover:text-blue-600 transition duration-150"
                      onClick={closeMenus}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Rankings
                    </Link>
                    <Link
                      to="/search"
                      className="flex items-center text-gray-700 hover:text-blue-600 transition duration-150"
                      onClick={closeMenus}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Link>
                    <Link
                      to="/ai"
                      className="flex items-center text-gray-700 hover:text-purple-600 transition duration-150"
                      onClick={closeMenus}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI Recommendations
                    </Link>
                    {user?.role === USER_ROLES.TEACHER && (
                      <Link
                        to="/teacher/ranking-management"
                        className="flex items-center text-gray-700 hover:text-blue-600 transition duration-150"
                        onClick={closeMenus}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Manage Rankings
                      </Link>
                    )}
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-900 mb-2">
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className="text-gray-500">{user?.email}</div>
                        <div className="text-xs text-blue-600">{user?.role}</div>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenus();
                        }}
                        className="flex items-center text-gray-700 hover:text-blue-600 transition duration-150"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-blue-600 transition duration-150"
                      onClick={closeMenus}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 text-center"
                      onClick={closeMenus}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;