import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProjectRecommendations from './ProjectRecommendations';
import recommendationService from '../../ai/services/recommendationService';
import {
  Brain,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

const AIDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [userInsights, setUserInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [loading, setLoading] = useState(true);
  const [similarProjects, setSimilarProjects] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load analytics
      const analyticsData = recommendationService.getAnalytics();
      setAnalytics(analyticsData);

      // Load user insights if user is logged in
      if (user?.id) {
        const insights = recommendationService.getUserInsights(user.id);
        setUserInsights(insights);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindSimilar = async (projectId) => {
    try {
      const similar = await recommendationService.getSimilarProjects(projectId, 3);
      setSimilarProjects(similar);
    } catch (error) {
      console.error('Failed to find similar projects:', error);
    }
  };

  const tabs = [
    { id: 'recommendations', label: 'AI Recommendations', icon: Target },
    { id: 'insights', label: 'User Insights', icon: BarChart3 },
    { id: 'analytics', label: 'System Analytics', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 text-purple-600 mr-3" />
                AI Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered insights and personalized recommendations
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Users</p>
                <p className="text-3xl font-bold">{analytics?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Projects</p>
                <p className="text-3xl font-bold">{analytics?.totalProjects || 0}</p>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Interactions</p>
                <p className="text-3xl font-bold">{analytics?.totalInteractions || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">AI Status</p>
                <p className="text-sm font-medium">
                  {analytics?.serviceStatus === 'active' ? 'Active' : 'Initializing'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'recommendations' && (
            <ProjectRecommendations numRecommendations={8} showHeader={false} />
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {user ? (
                <>
                  {userInsights && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Learning Profile</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{userInsights.totalInteractions}</p>
                          <p className="text-sm text-gray-600">Total Interactions</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 capitalize">{userInsights.engagementLevel}</p>
                          <p className="text-sm text-gray-600">Engagement Level</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Target className="h-8 w-8 text-yellow-600" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {userInsights.averageRating > 0 ? userInsights.averageRating.toFixed(1) : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">Avg Rating</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {userInsights.preferredCategories[0]?.name || 'Exploring'}
                          </p>
                          <p className="text-sm text-gray-600">Top Interest</p>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Preferred Categories</h4>
                          <div className="space-y-2">
                            {userInsights.preferredCategories.map((cat, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{cat.name}</span>
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{
                                        width: `${(cat.count / Math.max(...userInsights.preferredCategories.map(c => c.count))) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{cat.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Preferred Departments</h4>
                          <div className="space-y-2">
                            {userInsights.preferredDepartments.map((dept, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{dept.name}</span>
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{
                                        width: `${(dept.count / Math.max(...userInsights.preferredDepartments.map(d => d.count))) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{dept.count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in for Personal Insights</h3>
                  <p className="text-gray-600">
                    Login to see your learning profile and personalized analytics
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Analytics</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">User Engagement</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Average interactions per user
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics?.averageInteractionsPerUser?.toFixed(1) || '0.0'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">AI Performance</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Service status
                  </p>
                  <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${
                    analytics?.serviceStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {analytics?.serviceStatus || 'Unknown'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Data Coverage</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Projects available
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics?.totalProjects || 0}
                  </p>
                </div>
              </div>

              {/* Algorithm Information */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">AI Algorithms</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800">Collaborative Filtering</h5>
                    <p className="text-blue-700">Recommends based on similar user preferences</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800">Content-Based Filtering</h5>
                    <p className="text-blue-700">Matches projects to user profile and interests</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800">Hybrid Approach</h5>
                    <p className="text-blue-700">Combines multiple algorithms for better accuracy</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800">Real-time Learning</h5>
                    <p className="text-blue-700">Adapts to user interactions continuously</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;