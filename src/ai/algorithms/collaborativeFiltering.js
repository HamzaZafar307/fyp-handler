/**
 * Collaborative Filtering Algorithm for Project Recommendations
 * Uses user-item matrix and similarity calculations
 */

export class CollaborativeFiltering {
  constructor() {
    this.userItemMatrix = new Map();
    this.projectSimilarity = new Map();
    this.userSimilarity = new Map();
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((sum, a, idx) => sum + a * vectorB[idx], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Build user-item interaction matrix from historical data
   */
  buildUserItemMatrix(interactions) {
    // interactions: [{ userId, projectId, rating, viewed, applied, bookmarked }]
    const matrix = {};

    interactions.forEach(interaction => {
      const { userId, projectId, rating = 0, viewed = 0, applied = 0, bookmarked = 0 } = interaction;

      if (!matrix[userId]) matrix[userId] = {};

      // Create weighted score based on different interactions
      const score = (
        rating * 0.4 +           // Direct rating (highest weight)
        (applied ? 3 : 0) * 0.3 + // Application (high intent)
        (bookmarked ? 2 : 0) * 0.2 + // Bookmark (medium intent)
        (viewed ? 1 : 0) * 0.1    // View (low intent)
      );

      matrix[userId][projectId] = score;
    });

    this.userItemMatrix = matrix;
    return matrix;
  }

  /**
   * Calculate item-based collaborative filtering
   */
  calculateItemSimilarity(projects) {
    const similarity = {};

    for (let i = 0; i < projects.length; i++) {
      const projectA = projects[i];
      similarity[projectA.id] = {};

      for (let j = 0; j < projects.length; j++) {
        const projectB = projects[j];

        if (projectA.id === projectB.id) {
          similarity[projectA.id][projectB.id] = 1;
          continue;
        }

        // Get users who interacted with both projects
        const usersA = Object.keys(this.userItemMatrix).filter(
          userId => this.userItemMatrix[userId][projectA.id] > 0
        );
        const usersB = Object.keys(this.userItemMatrix).filter(
          userId => this.userItemMatrix[userId][projectB.id] > 0
        );

        const commonUsers = usersA.filter(user => usersB.includes(user));

        if (commonUsers.length < 2) {
          similarity[projectA.id][projectB.id] = 0;
          continue;
        }

        // Calculate similarity based on user ratings
        const ratingsA = commonUsers.map(user =>
          this.userItemMatrix[user][projectA.id] || 0
        );
        const ratingsB = commonUsers.map(user =>
          this.userItemMatrix[user][projectB.id] || 0
        );

        similarity[projectA.id][projectB.id] = this.cosineSimilarity(ratingsA, ratingsB);
      }
    }

    this.projectSimilarity = similarity;
    return similarity;
  }

  /**
   * Generate recommendations for a user
   */
  getRecommendations(userId, projects, numRecommendations = 5) {
    const userRatings = this.userItemMatrix[userId] || {};
    const recommendations = new Map();

    // For each project the user hasn't interacted with
    const unratedProjects = projects.filter(project => !userRatings[project.id]);

    unratedProjects.forEach(project => {
      let weightedSum = 0;
      let similaritySum = 0;

      // Find similar projects that user has rated
      Object.keys(userRatings).forEach(ratedProjectId => {
        const similarity = this.projectSimilarity[project.id]?.[ratedProjectId] || 0;
        const userRating = userRatings[ratedProjectId];

        if (similarity > 0.1) { // Minimum similarity threshold
          weightedSum += similarity * userRating;
          similaritySum += Math.abs(similarity);
        }
      });

      if (similaritySum > 0) {
        const predictedRating = weightedSum / similaritySum;
        recommendations.set(project.id, {
          project,
          score: predictedRating,
          confidence: Math.min(similaritySum / 5, 1) // Confidence based on similarity sum
        });
      }
    });

    // Sort by score and return top N
    return Array.from(recommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, numRecommendations);
  }
}