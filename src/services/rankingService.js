// Test direct import
import '../test-data';

import {
  sampleDepartments,
  sampleCategories,
  sampleYears,
  sampleFYPProjects,
  getSampleDepartmentRankings,
  sampleOverallRankings,
  sampleRankingStats,
  sampleTeacherProjects,
  mockApiResponses
} from '../data/sampleFYPData';

class RankingService {
  constructor() {
    // Debug: Log imported data on service initialization
    console.log('RankingService initialized with data:');
    console.log('- sampleDepartments:', sampleDepartments);
    console.log('- sampleCategories:', sampleCategories);
    console.log('- sampleYears:', sampleYears);
    console.log('- sampleFYPProjects:', sampleFYPProjects);
  }

  // Simulate API delay for realistic experience
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get department-wise rankings for a specific year
  async getDepartmentRankings(departmentId, year, semester = null) {
    try {
      await this.delay(300);

      const department = sampleDepartments.find(d => d.id === parseInt(departmentId));
      if (!department) {
        throw new Error('Department not found');
      }

      let projects = sampleFYPProjects.filter(p =>
        p.department_id === parseInt(departmentId) &&
        p.year === parseInt(year) &&
        (!semester || p.semester === semester)
      );

      projects = projects.sort((a, b) => b.performance_score - a.performance_score);

      return {
        department,
        projects,
        stats: sampleRankingStats
      };
    } catch (error) {
      console.error('Error fetching department rankings:', error);
      throw error;
    }
  }

  // Get all departments with their top projects for a year
  async getAllDepartmentRankings(year, semester = null) {
    try {
      console.log('RankingService: Getting all department rankings for year:', year, 'semester:', semester);
      console.log('RankingService: Available projects:', sampleFYPProjects);

      await this.delay(400);

      // Instead of using getSampleDepartmentRankings, build rankings directly from projects and departments
      const departmentRankings = sampleDepartments.map(dept => {
        // Get projects for this department
        let deptProjects = sampleFYPProjects.filter(p =>
          p.department_id === dept.id &&
          p.year === parseInt(year) &&
          (!semester || p.semester === semester)
        );

        deptProjects = deptProjects.sort((a, b) => b.performance_score - a.performance_score);

        const avgPerformance = deptProjects.length > 0
          ? Math.round(deptProjects.reduce((acc, p) => acc + p.performance_score, 0) / deptProjects.length)
          : 0;

        return {
          department: dept,
          projects: deptProjects,
          avg_performance: avgPerformance,
          total_projects: deptProjects.length
        };
      }).filter(dept => dept.projects.length > 0);

      console.log('RankingService: Department rankings result:', departmentRankings);
      return departmentRankings;
    } catch (error) {
      console.error('Error fetching all department rankings:', error);
      throw error;
    }
  }

  // Get yearly rankings across all departments
  async getYearlyRankings(year, semester = null, limit = 50) {
    try {
      console.log('RankingService: Getting yearly rankings for year:', year, 'semester:', semester);
      console.log('RankingService: Total available projects:', sampleFYPProjects.length);

      await this.delay(300);

      let projects = sampleFYPProjects.filter(p =>
        p.year === parseInt(year) &&
        (!semester || p.semester === semester)
      );

      console.log('RankingService: Filtered projects:', projects.length);

      projects = projects.sort((a, b) => b.performance_score - a.performance_score);
      projects = projects.slice(0, limit);

      console.log('RankingService: Final yearly rankings:', projects);
      return projects;
    } catch (error) {
      console.error('Error fetching yearly rankings:', error);
      throw error;
    }
  }

  // Search projects with various filters
  async searchProjects(filters) {
    try {
      await this.delay(400);

      const {
        year,
        semester,
        department,
        category,
        minGrade,
        searchTerm,
        sortBy = 'performance_score',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = filters;

      let results = [...sampleFYPProjects];

      // Apply filters
      if (year) results = results.filter(p => p.year === parseInt(year));
      if (semester) results = results.filter(p => p.semester === semester);
      if (department) results = results.filter(p => p.department === department || p.department.includes(department));
      if (category) results = results.filter(p => p.category === category);

      if (minGrade) {
        const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
        const minIndex = gradeOrder.indexOf(minGrade);
        results = results.filter(p => {
          const gradeIndex = gradeOrder.indexOf(p.final_grade);
          return gradeIndex <= minIndex;
        });
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(p =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.students.some(s => s.toLowerCase().includes(term)) ||
          p.supervisor.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      }

      // Apply sorting
      results.sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case 'performance_score':
            aVal = a.performance_score || 0;
            bVal = b.performance_score || 0;
            break;
          case 'final_grade':
            const gradeValues = { 'A+': 4.0, 'A': 3.67, 'A-': 3.33, 'B+': 3.0, 'B': 2.67, 'B-': 2.33, 'C+': 2.0, 'C': 1.67, 'C-': 1.33, 'D+': 1.0, 'D': 0.67, 'F': 0 };
            aVal = gradeValues[a.final_grade] || 0;
            bVal = gradeValues[b.final_grade] || 0;
            break;
          case 'year':
            aVal = a.year;
            bVal = b.year;
            break;
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'citations':
            aVal = a.citations || 0;
            bVal = b.citations || 0;
            break;
          default:
            aVal = a.performance_score || 0;
            bVal = b.performance_score || 0;
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Calculate pagination
      const total = results.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = results.slice(startIndex, endIndex);

      return {
        projects: paginatedResults,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          avg_performance: results.length > 0
            ? Math.round(results.reduce((acc, p) => acc + p.performance_score, 0) / results.length)
            : 0,
          departments_count: [...new Set(results.map(p => p.department))].length,
          top_grade_count: results.filter(p => p.final_grade === 'A+').length
        }
      };
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }

  // Get available years for filtering
  async getAvailableYears() {
    try {
      console.log('RankingService: Getting available years...');
      console.log('RankingService: sampleYears raw:', sampleYears);

      if (!sampleYears || sampleYears.length === 0) {
        console.warn('RankingService: sampleYears is empty or undefined!');
        return [2024, 2023, 2022, 2021, 2020]; // Fallback years
      }

      await this.delay(200);
      const years = [...sampleYears].sort((a, b) => b - a); // Return newest first
      console.log('RankingService: Available years result:', years);
      return years;
    } catch (error) {
      console.error('Error fetching available years:', error);
      throw error;
    }
  }

  // Get departments list
  async getDepartments() {
    try {
      console.log('RankingService: Getting departments...');
      console.log('RankingService: sampleDepartments raw:', sampleDepartments);

      if (!sampleDepartments || sampleDepartments.length === 0) {
        console.warn('RankingService: sampleDepartments is empty or undefined!');
        return [
          { id: 1, name: 'Computer Science', code: 'CS' },
          { id: 2, name: 'Software Engineering', code: 'SE' }
        ]; // Fallback departments
      }

      await this.delay(200);
      console.log('RankingService: Departments result:', sampleDepartments);
      return sampleDepartments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // Get project categories
  async getProjectCategories() {
    try {
      console.log('RankingService: Getting categories...');
      await this.delay(200);
      console.log('RankingService: Categories:', sampleCategories);
      return sampleCategories;
    } catch (error) {
      console.error('Error fetching project categories:', error);
      throw error;
    }
  }

  // Teacher-specific methods
  async getTeacherProjects(teacherId, filters = {}) {
    try {
      await this.delay(300);

      let projects = sampleFYPProjects.filter(p => p.supervisor_id === parseInt(teacherId));

      if (filters.year) {
        projects = projects.filter(p => p.year === parseInt(filters.year));
      }
      if (filters.semester) {
        projects = projects.filter(p => p.semester === filters.semester);
      }

      // Add some mock evaluation data
      projects = projects.map(p => ({
        ...p,
        latest_evaluation: {
          evaluation_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          overall_score: p.performance_score / 10,
          technical_score: Math.floor(p.performance_score / 10),
          innovation_score: p.innovation_score,
          implementation_score: p.implementation_quality,
          presentation_score: p.presentation_score,
          documentation_score: p.documentation_quality
        }
      }));

      return projects;
    } catch (error) {
      console.error('Error fetching teacher projects:', error);
      throw error;
    }
  }

  async submitProjectEvaluation(projectId, evaluation) {
    try {
      await this.delay(500);

      // Simulate successful evaluation submission
      console.log('Submitting evaluation for project:', projectId, evaluation);

      // Update the project's performance score based on evaluation
      const projectIndex = sampleFYPProjects.findIndex(p => p.id === parseInt(projectId));
      if (projectIndex !== -1) {
        const newScore = this.calculatePerformanceScore({
          grade_points: sampleFYPProjects[projectIndex].grade_points,
          innovation_score: evaluation.innovation_score,
          implementation_quality: evaluation.implementation_score,
          documentation_quality: evaluation.documentation_score,
          presentation_score: evaluation.presentation_score,
          citations: sampleFYPProjects[projectIndex].citations,
          industry_adoption: sampleFYPProjects[projectIndex].industry_adoption
        });

        sampleFYPProjects[projectIndex].performance_score = newScore;
      }

      return {
        success: true,
        message: 'Evaluation submitted successfully',
        evaluation: {
          id: Date.now(),
          project_id: projectId,
          ...evaluation,
          evaluation_date: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      throw error;
    }
  }

  async updateProjectRanking(projectId, rankingData) {
    try {
      await this.delay(300);

      // Simulate successful ranking update
      console.log('Updating ranking for project:', projectId, rankingData);

      return {
        success: true,
        message: 'Project ranking updated successfully'
      };
    } catch (error) {
      console.error('Error updating project ranking:', error);
      throw error;
    }
  }

  // Get ranking statistics
  async getRankingStats(year, semester = null) {
    try {
      await this.delay(200);

      let filteredProjects = sampleFYPProjects.filter(p =>
        p.year === parseInt(year) &&
        (!semester || p.semester === semester)
      );

      return {
        total_projects: filteredProjects.length,
        total_departments: [...new Set(filteredProjects.map(p => p.department))].length,
        avg_performance: filteredProjects.length > 0
          ? Math.round(filteredProjects.reduce((acc, p) => acc + p.performance_score, 0) / filteredProjects.length)
          : 0,
        a_plus_count: filteredProjects.filter(p => p.final_grade === 'A+').length,
        completed_projects: filteredProjects.filter(p => p.status === 'Completed').length,
        in_progress_projects: filteredProjects.filter(p => p.status === 'In Progress').length
      };
    } catch (error) {
      console.error('Error fetching ranking stats:', error);
      throw error;
    }
  }

  // Calculate performance score client-side (for preview)
  calculatePerformanceScore(project) {
    const weights = {
      grade_points: 0.30,
      innovation_score: 0.20,
      implementation_quality: 0.20,
      documentation_quality: 0.10,
      presentation_score: 0.10,
      citations: 0.05,
      industry_adoption: 0.05
    };

    const {
      grade_points = 0,
      innovation_score = 0,
      implementation_quality = 0,
      documentation_quality = 0,
      presentation_score = 0,
      citations = 0,
      industry_adoption = false
    } = project;

    const normalizedCitations = Math.min(citations / 10, 1);
    const adoptionBonus = industry_adoption ? 1 : 0;

    return Math.round((
      (grade_points / 4.0) * weights.grade_points +
      (innovation_score / 10) * weights.innovation_score +
      (implementation_quality / 10) * weights.implementation_quality +
      (documentation_quality / 10) * weights.documentation_quality +
      (presentation_score / 10) * weights.presentation_score +
      normalizedCitations * weights.citations +
      adoptionBonus * weights.industry_adoption
    ) * 100);
  }
}

export default new RankingService();