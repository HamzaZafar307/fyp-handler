/**
 * Hybrid Recommendation Algorithm
 * Combines collaborative and content-based filtering with additional heuristics
 */

import { CollaborativeFiltering } from './collaborativeFiltering.js';
import { ContentBasedFiltering } from './contentBasedFiltering.js';

export class HybridRecommendation {
  constructor() {
    this.collaborativeFilter = new CollaborativeFiltering();
    this.contentFilter = new ContentBasedFiltering();

    // Algorithm weights
    this.weights = {
      collaborative: 0.4,
      contentBased: 0.35,
      popularity: 0.15,
      recency: 0.10
    };

    // Minimum interactions needed for collaborative filtering
    this.minInteractionsForCF = 5;
  }

  /**
   * Calculate popularity score for projects
   */
  calculatePopularityScores(projects, interactions) {
    const projectStats = {};

    // Initialize stats
    projects.forEach(project => {
      projectStats[project.id] = {
        views: 0,
        applications: 0,
        bookmarks: 0,
        ratings: [],
        totalScore: 0
      };
    });

    // Aggregate interaction data
    interactions.forEach(interaction => {
      const stats = projectStats[interaction.projectId];
      if (!stats) return;

      if (interaction.viewed) stats.views++;
      if (interaction.applied) stats.applications++;
      if (interaction.bookmarked) stats.bookmarks++;
      if (interaction.rating > 0) stats.ratings.push(interaction.rating);
    });

    // Calculate popularity scores
    const maxViews = Math.max(...Object.values(projectStats).map(s => s.views));
    const maxApplications = Math.max(...Object.values(projectStats).map(s => s.applications));

    Object.keys(projectStats).forEach(projectId => {
      const stats = projectStats[projectId];
      const avgRating = stats.ratings.length > 0
        ? stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length
        : 0;

      // Weighted popularity score
      stats.totalScore = (
        (stats.views / Math.max(maxViews, 1)) * 0.3 +
        (stats.applications / Math.max(maxApplications, 1)) * 0.4 +
        (stats.bookmarks / Math.max(maxViews, 1)) * 0.2 +
        (avgRating / 5) * 0.1
      );
    });

    return projectStats;
  }

  /**
   * Calculate recency scores (newer projects get higher scores)
   */
  calculateRecencyScores(projects) {
    const now = new Date();
    const scores = {};

    projects.forEach(project => {
      const projectDate = new Date(project.created_at || project.year || now);
      const daysDifference = (now - projectDate) / (1000 * 60 * 60 * 24);

      // Decay function: newer projects get higher scores
      scores[project.id] = Math.exp(-daysDifference / 365); // 1 year half-life
    });

    return scores;
  }

  /**
   * Apply diversity to recommendations to avoid similarity clustering
   */
  diversifyRecommendations(recommendations, diversityFactor = 0.3) {
    if (recommendations.length <= 3) return recommendations;

    const diversified = [recommendations[0]]; // Always include top recommendation
    const remaining = recommendations.slice(1);

    while (diversified.length < recommendations.length && remaining.length > 0) {
      let bestCandidate = null;
      let maxDiversityScore = -1;

      remaining.forEach((candidate, index) => {
        // Calculate diversity score (average distance from selected items)
        let diversityScore = 0;

        diversified.forEach(selected => {
          // Simple category and department diversity check
          const categoryDiff = candidate.project.category_name !== selected.project.category_name ? 1 : 0;
          const departmentDiff = candidate.project.department_name !== selected.project.department_name ? 1 : 0;

          diversityScore += (categoryDiff + departmentDiff) / 2;
        });

        diversityScore /= diversified.length;

        // Combine original score with diversity
        const finalScore = (
          candidate.score * (1 - diversityFactor) +
          diversityScore * diversityFactor
        );

        if (finalScore > maxDiversityScore) {
          maxDiversityScore = finalScore;
          bestCandidate = { candidate, index };
        }
      });

      if (bestCandidate) {
        diversified.push(bestCandidate.candidate);
        remaining.splice(bestCandidate.index, 1);
      } else {
        break;
      }
    }

    return diversified;
  }

  /**
   * Generate hybrid recommendations
   */
  async getRecommendations(userId, projects, interactions, numRecommendations = 10) {
    try {
      const userInteractions = interactions.filter(i => i.userId === userId);

      // Check if user has enough interactions for collaborative filtering
      const hasEnoughInteractions = userInteractions.length >= this.minInteractionsForCF;

      let collaborativeRecommendations = [];
      let contentRecommendations = [];

      // Get collaborative filtering recommendations
      if (hasEnoughInteractions) {
        this.collaborativeFilter.buildUserItemMatrix(interactions);
        this.collaborativeFilter.calculateItemSimilarity(projects);
        collaborativeRecommendations = this.collaborativeFilter.getRecommendations(
          userId, projects, numRecommendations * 2
        );
      }

      // Get content-based recommendations
      const userProfile = this.contentFilter.buildUserProfile(userInteractions, projects);
      contentRecommendations = this.contentFilter.getRecommendations(
        userProfile, projects, userInteractions, numRecommendations * 2
      );

      // Calculate additional scores
      const popularityScores = this.calculatePopularityScores(projects, interactions);
      const recencyScores = this.calculateRecencyScores(projects);

      // Combine all recommendations
      const hybridScores = new Map();

      // Process collaborative recommendations
      collaborativeRecommendations.forEach(rec => {
        const projectId = rec.project.id;
        const popularity = popularityScores[projectId]?.totalScore || 0;
        const recency = recencyScores[projectId] || 0;

        const hybridScore = (
          rec.score * this.weights.collaborative +
          popularity * this.weights.popularity +
          recency * this.weights.recency
        );

        hybridScores.set(projectId, {
          ...rec,
          score: hybridScore,
          method: 'collaborative',
          components: {
            collaborative: rec.score,
            popularity,
            recency
          }
        });
      });

      // Process content-based recommendations
      contentRecommendations.forEach(rec => {
        const projectId = rec.project.id;
        const popularity = popularityScores[projectId]?.totalScore || 0;
        const recency = recencyScores[projectId] || 0;

        const existing = hybridScores.get(projectId);

        if (existing) {
          // Combine scores if project exists in both methods
          const combinedScore = (
            existing.components.collaborative * this.weights.collaborative +
            rec.score * this.weights.contentBased +
            popularity * this.weights.popularity +
            recency * this.weights.recency
          );

          hybridScores.set(projectId, {
            ...existing,
            score: combinedScore,
            method: 'hybrid',
            components: {
              ...existing.components,
              contentBased: rec.score
            }
          });
        } else {
          // Add new content-based recommendation
          const hybridScore = (
            rec.score * this.weights.contentBased +
            popularity * this.weights.popularity +
            recency * this.weights.recency
          );

          hybridScores.set(projectId, {
            ...rec,
            score: hybridScore,
            method: 'content-based',
            components: {
              contentBased: rec.score,
              popularity,
              recency
            }
          });
        }
      });

      // If no recommendations from algorithms, use popularity + recency
      if (hybridScores.size === 0) {
        const interactedProjectIds = new Set(userInteractions.map(i => i.projectId));

        projects
          .filter(p => !interactedProjectIds.has(p.id))
          .forEach(project => {
            const popularity = popularityScores[project.id]?.totalScore || 0;
            const recency = recencyScores[project.id] || 0;
            const score = popularity * 0.7 + recency * 0.3;

            hybridScores.set(project.id, {
              project,
              score,
              confidence: 0.3,
              method: 'fallback',
              components: { popularity, recency }
            });
          });
      }

      // Sort and get top recommendations
      let finalRecommendations = Array.from(hybridScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, numRecommendations * 1.5); // Get more for diversity

      // Apply diversity
      finalRecommendations = this.diversifyRecommendations(
        finalRecommendations,
        0.2 // 20% diversity factor
      );

      return finalRecommendations.slice(0, numRecommendations);

    } catch (error) {
      console.error('Error generating hybrid recommendations:', error);

      // Fallback: return most popular projects
      const popularityScores = this.calculatePopularityScores(projects, interactions);
      return projects
        .map(project => ({
          project,
          score: popularityScores[project.id]?.totalScore || 0,
          confidence: 0.2,
          method: 'fallback'
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, numRecommendations);
    }
  }

  /**
   * Explain recommendation reasons
   */
  explainRecommendation(recommendation, userProfile) {
    const reasons = [];
    const { method, components } = recommendation;

    if (method === 'collaborative' || method === 'hybrid') {
      reasons.push("Users with similar interests also liked this project");
    }

    if (method === 'content-based' || method === 'hybrid') {
      const features = this.contentFilter.extractProjectFeatures(recommendation.project);

      if (userProfile?.preferredCategories[features.category]) {
        reasons.push(`Matches your interest in ${features.category} projects`);
      }

      if (userProfile?.preferredDepartments[features.department]) {
        reasons.push(`From your preferred ${features.department} department`);
      }
    }

    if (components?.popularity > 0.7) {
      reasons.push("Highly popular among students");
    }

    if (components?.recency > 0.8) {
      reasons.push("Recently added project with modern technologies");
    }

    return reasons.length > 0 ? reasons : ["Recommended based on overall preferences"];
  }
}