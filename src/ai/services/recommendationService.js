/**
 * Main AI Recommendation Service
 * Orchestrates different recommendation algorithms and provides unified API
 */

import { HybridRecommendation } from '../algorithms/hybridRecommendation.js';
import { sampleFYPProjects, sampleDepartments } from '../../data/sampleFYPData.js';

class RecommendationService {
  constructor() {
    this.hybridRecommender = new HybridRecommendation();
    this.interactionData = new Map(); // Store user interactions
    this.initialized = false;

    // Initialize with sample data
    this.initializeService();
  }

  /**
   * Initialize the service with sample interaction data
   */
  async initializeService() {
    try {
      console.log('Initializing AI Recommendation Service...');

      // Generate sample user interactions for demonstration
      this.generateSampleInteractions();

      this.initialized = true;
      console.log('AI Recommendation Service initialized successfully');

      return true;
    } catch (error) {
      console.error('Failed to initialize AI Recommendation Service:', error);
      return false;
    }
  }

  /**
   * Generate realistic sample interaction data
   */
  generateSampleInteractions() {
    const interactions = [];
    const userIds = ['user1', 'user2', 'user3', 'user4', 'user5', 'student123', 'student456'];

    // Generate interactions for each user
    userIds.forEach(userId => {
      const numInteractions = Math.floor(Math.random() * 8) + 3; // 3-10 interactions per user

      for (let i = 0; i < numInteractions; i++) {
        const project = sampleFYPProjects[Math.floor(Math.random() * sampleFYPProjects.length)];

        const interaction = {
          userId,
          projectId: project.id,
          viewed: Math.random() > 0.2, // 80% chance of viewing
          bookmarked: Math.random() > 0.7, // 30% chance of bookmarking
          applied: Math.random() > 0.85, // 15% chance of applying
          rating: Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 3 : 0, // 40% chance of rating 3-5
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random time in last year
          sessionDuration: Math.floor(Math.random() * 600) + 30 // 30 seconds to 10 minutes
        };

        interactions.push(interaction);
      }
    });

    // Store interactions
    this.storeInteractions(interactions);

    console.log(`Generated ${interactions.length} sample interactions for ${userIds.length} users`);
    return interactions;
  }

  /**
   * Store user interactions
   */
  storeInteractions(interactions) {
    interactions.forEach(interaction => {
      const userId = interaction.userId;

      if (!this.interactionData.has(userId)) {
        this.interactionData.set(userId, []);
      }

      this.interactionData.get(userId).push(interaction);
    });
  }

  /**
   * Track a new user interaction
   */
  async trackInteraction(userId, projectId, interactionType, metadata = {}) {
    try {
      const interaction = {
        userId,
        projectId,
        timestamp: new Date(),
        ...metadata
      };

      // Set interaction type flags
      interaction[interactionType] = true;

      // Store interaction
      if (!this.interactionData.has(userId)) {
        this.interactionData.set(userId, []);
      }

      this.interactionData.get(userId).push(interaction);

      console.log(`Tracked ${interactionType} interaction for user ${userId} on project ${projectId}`);
      return true;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  }

  /**
   * Get all interactions (for algorithms)
   */
  getAllInteractions() {
    const allInteractions = [];
    this.interactionData.forEach((interactions, userId) => {
      allInteractions.push(...interactions);
    });
    return allInteractions;
  }

  /**
   * Get user interactions
   */
  getUserInteractions(userId) {
    return this.interactionData.get(userId) || [];
  }

  /**
   * Get personalized project recommendations for a user
   */
  async getPersonalizedRecommendations(userId, numRecommendations = 5) {
    try {
      if (!this.initialized) {
        await this.initializeService();
      }

      const allInteractions = this.getAllInteractions();

      console.log(`Generating recommendations for user: ${userId}`);
      console.log(`Using ${allInteractions.length} total interactions`);
      console.log(`User has ${this.getUserInteractions(userId).length} interactions`);

      const recommendations = await this.hybridRecommender.getRecommendations(
        userId,
        sampleFYPProjects,
        allInteractions,
        numRecommendations
      );

      // Add explanation for each recommendation
      const userProfile = this.hybridRecommender.contentFilter.buildUserProfile(
        this.getUserInteractions(userId),
        sampleFYPProjects
      );

      const enrichedRecommendations = recommendations.map(rec => ({
        ...rec,
        explanation: this.hybridRecommender.explainRecommendation(rec, userProfile),
        department: sampleDepartments.find(d => d.id === rec.project.department_id)?.name || 'Unknown',
        estimatedMatch: Math.round(rec.score * 100),
        trending: rec.components?.popularity > 0.6
      }));

      console.log(`Generated ${enrichedRecommendations.length} recommendations`);
      return enrichedRecommendations;

    } catch (error) {
      console.error('Error generating personalized recommendations:', error);

      // Fallback: return popular projects
      return this.getFallbackRecommendations(numRecommendations);
    }
  }

  /**
   * Get trending/popular projects (fallback when personalization fails)
   */
  getFallbackRecommendations(numRecommendations = 5) {
    const popularProjects = sampleFYPProjects
      .map(project => ({
        project,
        score: Math.random() * 0.5 + 0.3, // Random score between 0.3-0.8
        confidence: 0.3,
        method: 'popular',
        explanation: ['Popular among students', 'Trending project'],
        department: sampleDepartments.find(d => d.id === project.department_id)?.name || 'Unknown',
        estimatedMatch: Math.floor(Math.random() * 30) + 40, // 40-70% match
        trending: true
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, numRecommendations);

    console.log(`Returning ${popularProjects.length} fallback recommendations`);
    return popularProjects;
  }

  /**
   * Get similar projects to a given project
   */
  async getSimilarProjects(projectId, numSimilar = 3) {
    try {
      const targetProject = sampleFYPProjects.find(p => p.id === projectId);
      if (!targetProject) return [];

      const vocabulary = this.hybridRecommender.contentFilter.buildVocabulary(sampleFYPProjects);

      const similarities = sampleFYPProjects
        .filter(p => p.id !== projectId)
        .map(project => ({
          project,
          similarity: this.hybridRecommender.contentFilter.calculateProjectSimilarity(
            targetProject,
            project,
            vocabulary
          )
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, numSimilar);

      return similarities.map(sim => ({
        ...sim.project,
        similarityScore: Math.round(sim.similarity * 100),
        department: sampleDepartments.find(d => d.id === sim.project.department_id)?.name || 'Unknown'
      }));

    } catch (error) {
      console.error('Error finding similar projects:', error);
      return [];
    }
  }

  /**
   * Get user preferences and statistics
   */
  getUserInsights(userId) {
    const interactions = this.getUserInteractions(userId);

    if (interactions.length === 0) {
      return {
        totalInteractions: 0,
        preferredCategories: [],
        preferredDepartments: [],
        averageRating: 0,
        engagementLevel: 'new'
      };
    }

    const categoryCount = {};
    const departmentCount = {};
    const ratings = interactions.filter(i => i.rating > 0).map(i => i.rating);

    interactions.forEach(interaction => {
      const project = sampleFYPProjects.find(p => p.id === interaction.projectId);
      if (!project) return;

      const category = project.category_name;
      const department = sampleDepartments.find(d => d.id === project.department_id)?.name;

      if (category) categoryCount[category] = (categoryCount[category] || 0) + 1;
      if (department) departmentCount[department] = (departmentCount[department] || 0) + 1;
    });

    return {
      totalInteractions: interactions.length,
      preferredCategories: Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count })),
      preferredDepartments: Object.entries(departmentCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count })),
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      engagementLevel: interactions.length < 3 ? 'new' : interactions.length < 10 ? 'moderate' : 'high'
    };
  }

  /**
   * Get recommendation analytics
   */
  getAnalytics() {
    const allInteractions = this.getAllInteractions();
    const uniqueUsers = new Set(allInteractions.map(i => i.userId)).size;

    return {
      totalUsers: uniqueUsers,
      totalInteractions: allInteractions.length,
      averageInteractionsPerUser: allInteractions.length / uniqueUsers,
      totalProjects: sampleFYPProjects.length,
      serviceStatus: this.initialized ? 'active' : 'initializing'
    };
  }
}

// Create singleton instance
const recommendationService = new RecommendationService();

export default recommendationService;