import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import recommendationService from '../../ai/services/recommendationService';
import {
  Sparkles,
  TrendingUp,
  Star,
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  RefreshCw,
  Eye,
  Heart,
  ExternalLink,
  Info,
  Lightbulb
} from 'lucide-react';

const ProjectRecommendations = ({ numRecommendations = 5, showHeader = true }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInsights, setUserInsights] = useState(null);

  useEffect(() => {
    loadRecommendations();
    if (user?.id) {
      loadUserInsights();
    }
  }, [user?.id, numRecommendations]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = user?.id || 'guest_user';
      const recs = await recommendationService.getPersonalizedRecommendations(
        userId,
        numRecommendations
      );

      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserInsights = async () => {
    try {
      const insights = recommendationService.getUserInsights(user.id);
      setUserInsights(insights);
    } catch (err) {
      console.error('Failed to load user insights:', err);
    }
  };

  const handleInteraction = async (projectId, interactionType) => {
    try {
      await recommendationService.trackInteraction(
        user?.id || 'guest_user',
        projectId,
        interactionType
      );

      // Refresh recommendations after interaction
      setTimeout(() => {
        loadRecommendations();
      }, 1000);
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <ExternalLink className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRecommendations}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {showHeader && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI-Powered Recommendations</h2>
                <p className="text-blue-100">Personalized FYP projects for you</p>
              </div>
            </div>
            <button
              onClick={loadRecommendations}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Refresh recommendations"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* User Insights */}
          {userInsights && userInsights.totalInteractions > 0 && (
            <div className="bg-white/10 rounded-lg p-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-blue-200">Interactions</div>
                  <div className="font-semibold">{userInsights.totalInteractions}</div>
                </div>
                <div>
                  <div className="text-blue-200">Engagement</div>
                  <div className="font-semibold capitalize">{userInsights.engagementLevel}</div>
                </div>
                <div>
                  <div className="text-blue-200">Avg Rating</div>
                  <div className="font-semibold">
                    {userInsights.averageRating > 0 ? userInsights.averageRating.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-blue-200">Top Interest</div>
                  <div className="font-semibold">
                    {userInsights.preferredCategories[0]?.name || 'Exploring'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600">
              Start exploring projects to get personalized recommendations!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recommendations.map((rec, index) => (
              <div
                key={rec.project.id}
                className="p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rec.project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {rec.project.supervisor_name} • {rec.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {rec.trending && (
                      <div className="flex items-center text-orange-600 text-xs font-medium bg-orange-100 px-2 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </div>
                    )}
                    <div className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {rec.estimatedMatch}% match
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                    {rec.project.category_name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {rec.project.year}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.project.difficulty_level)}`}>
                      {rec.project.difficulty_level || 'Medium'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {rec.project.description}
                </p>

                {/* AI Explanation */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Why recommended:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {rec.explanation.map((reason, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleInteraction(rec.project.id, 'viewed')}
                      className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleInteraction(rec.project.id, 'bookmarked')}
                      className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {rec.score.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleInteraction(rec.project.id, 'applied')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors group"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-600">
          Recommendations powered by advanced AI algorithms including collaborative filtering,
          content-based analysis, and popularity trends
        </p>
      </div>
    </div>
  );
};

export default ProjectRecommendations;