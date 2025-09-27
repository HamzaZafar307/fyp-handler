/**
 * Content-Based Filtering Algorithm
 * Recommends projects based on project features and user preferences
 */

export class ContentBasedFiltering {
  constructor() {
    this.featureWeights = {
      category: 0.25,
      technologies: 0.30,
      difficulty: 0.15,
      department: 0.20,
      keywords: 0.10
    };
  }

  /**
   * Extract and normalize features from a project
   */
  extractProjectFeatures(project) {
    return {
      category: project.category_name || '',
      technologies: (project.technologies || []).join(' ').toLowerCase(),
      difficulty: project.difficulty_level || 'medium',
      department: project.department_name || '',
      keywords: (project.keywords || project.title || '').toLowerCase(),
      supervisor: project.supervisor_name || ''
    };
  }

  /**
   * Create feature vectors for text similarity
   */
  createFeatureVector(text, vocabulary) {
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const vector = vocabulary.map(term => {
      const count = words.filter(word => word.includes(term) || term.includes(word)).length;
      return count > 0 ? 1 : 0;
    });
    return vector;
  }

  /**
   * Build vocabulary from all projects
   */
  buildVocabulary(projects) {
    const allText = projects.map(project => {
      const features = this.extractProjectFeatures(project);
      return `${features.category} ${features.technologies} ${features.keywords} ${features.supervisor}`;
    }).join(' ');

    const words = allText.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2)
      .filter(word => !['the', 'and', 'or', 'but', 'for', 'with', 'from', 'this', 'that'].includes(word));

    // Get unique words with frequency > 1
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.keys(wordCount)
      .filter(word => wordCount[word] > 1)
      .slice(0, 100); // Top 100 terms
  }

  /**
   * Calculate Jaccard similarity for categorical features
   */
  jaccardSimilarity(setA, setB) {
    const intersection = setA.filter(item => setB.includes(item));
    const union = [...new Set([...setA, ...setB])];
    return union.length === 0 ? 0 : intersection.length / union.length;
  }

  /**
   * Calculate similarity between two projects
   */
  calculateProjectSimilarity(projectA, projectB, vocabulary) {
    const featuresA = this.extractProjectFeatures(projectA);
    const featuresB = this.extractProjectFeatures(projectB);

    let totalSimilarity = 0;

    // Category similarity (exact match)
    const categorySim = featuresA.category === featuresB.category ? 1 : 0;
    totalSimilarity += categorySim * this.featureWeights.category;

    // Technology similarity (Jaccard index)
    const techA = featuresA.technologies.split(' ').filter(t => t.length > 0);
    const techB = featuresB.technologies.split(' ').filter(t => t.length > 0);
    const techSim = this.jaccardSimilarity(techA, techB);
    totalSimilarity += techSim * this.featureWeights.technologies;

    // Department similarity
    const deptSim = featuresA.department === featuresB.department ? 1 : 0;
    totalSimilarity += deptSim * this.featureWeights.department;

    // Difficulty similarity (inverse distance)
    const difficultyLevels = { 'easy': 1, 'medium': 2, 'hard': 3 };
    const diffA = difficultyLevels[featuresA.difficulty] || 2;
    const diffB = difficultyLevels[featuresB.difficulty] || 2;
    const diffSim = 1 - Math.abs(diffA - diffB) / 2;
    totalSimilarity += diffSim * this.featureWeights.difficulty;

    // Keywords similarity (cosine similarity)
    const vectorA = this.createFeatureVector(featuresA.keywords, vocabulary);
    const vectorB = this.createFeatureVector(featuresB.keywords, vocabulary);
    const keywordSim = this.cosineSimilarity(vectorA, vectorB);
    totalSimilarity += keywordSim * this.featureWeights.keywords;

    return Math.min(totalSimilarity, 1); // Ensure max value is 1
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
   * Build user profile from user's historical interactions
   */
  buildUserProfile(userInteractions, projects) {
    const interactedProjects = userInteractions
      .filter(interaction => interaction.rating >= 3 || interaction.applied || interaction.bookmarked)
      .map(interaction => projects.find(p => p.id === interaction.projectId))
      .filter(project => project);

    if (interactedProjects.length === 0) return null;

    const profile = {
      preferredCategories: {},
      preferredTechnologies: {},
      preferredDepartments: {},
      averageDifficulty: 0,
      keywords: {}
    };

    // Aggregate preferences
    interactedProjects.forEach(project => {
      const features = this.extractProjectFeatures(project);

      // Categories
      profile.preferredCategories[features.category] =
        (profile.preferredCategories[features.category] || 0) + 1;

      // Technologies
      features.technologies.split(' ').forEach(tech => {
        if (tech.length > 2) {
          profile.preferredTechnologies[tech] =
            (profile.preferredTechnologies[tech] || 0) + 1;
        }
      });

      // Departments
      profile.preferredDepartments[features.department] =
        (profile.preferredDepartments[features.department] || 0) + 1;

      // Keywords
      features.keywords.split(' ').forEach(keyword => {
        if (keyword.length > 2) {
          profile.keywords[keyword] = (profile.keywords[keyword] || 0) + 1;
        }
      });
    });

    return profile;
  }

  /**
   * Generate content-based recommendations
   */
  getRecommendations(userProfile, projects, userInteractions = [], numRecommendations = 5) {
    if (!userProfile) {
      // Return popular/trending projects if no profile
      return projects
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, numRecommendations)
        .map(project => ({ project, score: 0.5, confidence: 0.3 }));
    }

    const vocabulary = this.buildVocabulary(projects);
    const interactedProjectIds = new Set(userInteractions.map(i => i.projectId));
    const candidateProjects = projects.filter(p => !interactedProjectIds.has(p.id));

    const recommendations = candidateProjects.map(project => {
      let score = 0;
      let confidence = 0;

      const features = this.extractProjectFeatures(project);

      // Category preference match
      const categoryScore = (userProfile.preferredCategories[features.category] || 0) /
        Math.max(...Object.values(userProfile.preferredCategories));
      score += categoryScore * 0.3;

      // Technology preference match
      const projectTechnologies = features.technologies.split(' ').filter(t => t.length > 0);
      const techScore = projectTechnologies.reduce((sum, tech) => {
        return sum + (userProfile.preferredTechnologies[tech] || 0);
      }, 0) / Math.max(1, projectTechnologies.length);
      score += (techScore / Math.max(...Object.values(userProfile.preferredTechnologies))) * 0.4;

      // Department preference
      const deptScore = (userProfile.preferredDepartments[features.department] || 0) /
        Math.max(...Object.values(userProfile.preferredDepartments));
      score += deptScore * 0.2;

      // Keywords match
      const projectKeywords = features.keywords.split(' ').filter(k => k.length > 0);
      const keywordScore = projectKeywords.reduce((sum, keyword) => {
        return sum + (userProfile.keywords[keyword] || 0);
      }, 0) / Math.max(1, projectKeywords.length);
      score += (keywordScore / Math.max(...Object.values(userProfile.keywords))) * 0.1;

      confidence = Math.min(
        Object.keys(userProfile.preferredCategories).length / 5, 1
      );

      return {
        project,
        score: Math.min(score, 1),
        confidence
      };
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, numRecommendations);
  }
}