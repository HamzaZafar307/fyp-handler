// Database Schema Design for FYP Ranking System
// This file outlines the required database structure for the backend

export const FYP_RANKING_SCHEMA = {
  // Departments table
  departments: {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(100) NOT NULL', // e.g., 'Computer Science', 'Software Engineering'
    code: 'VARCHAR(10) UNIQUE NOT NULL', // e.g., 'CS', 'SE'
    university_id: 'INTEGER REFERENCES universities(id)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // Universities table
  universities: {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(200) NOT NULL',
    location: 'VARCHAR(100)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // FYP Projects table
  fyp_projects: {
    id: 'SERIAL PRIMARY KEY',
    title: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    department_id: 'INTEGER REFERENCES departments(id)',
    supervisor_id: 'INTEGER REFERENCES users(id)',
    year: 'INTEGER NOT NULL', // 2023, 2024, etc.
    semester: "ENUM('Spring', 'Fall') NOT NULL",
    category: 'VARCHAR(100)', // 'Machine Learning', 'Web Development', etc.

    // Performance metrics
    final_grade: 'VARCHAR(5)', // 'A+', 'A', 'B+', etc.
    grade_points: 'DECIMAL(3,2)', // 4.00, 3.67, etc. for ranking calculations
    performance_score: 'INTEGER DEFAULT 0', // Calculated ranking score

    // Project status
    status: "ENUM('Completed', 'In Progress', 'Dropped') DEFAULT 'In Progress'",

    // Additional metrics for ranking
    innovation_score: 'INTEGER DEFAULT 0', // 1-10 scale
    implementation_quality: 'INTEGER DEFAULT 0', // 1-10 scale
    documentation_quality: 'INTEGER DEFAULT 0', // 1-10 scale
    presentation_score: 'INTEGER DEFAULT 0', // 1-10 scale

    // Impact metrics
    citations: 'INTEGER DEFAULT 0',
    publications: 'INTEGER DEFAULT 0',
    industry_adoption: 'BOOLEAN DEFAULT FALSE',

    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // Project Team Members
  project_members: {
    id: 'SERIAL PRIMARY KEY',
    project_id: 'INTEGER REFERENCES fyp_projects(id)',
    student_id: 'INTEGER REFERENCES users(id)',
    role: "ENUM('Lead', 'Member') DEFAULT 'Member'",
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // Department Rankings table (for caching/performance)
  department_rankings: {
    id: 'SERIAL PRIMARY KEY',
    department_id: 'INTEGER REFERENCES departments(id)',
    year: 'INTEGER NOT NULL',
    semester: "ENUM('Spring', 'Fall') NOT NULL",
    project_id: 'INTEGER REFERENCES fyp_projects(id)',
    rank_position: 'INTEGER NOT NULL',
    total_projects: 'INTEGER NOT NULL',
    last_calculated: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',

    // Composite unique constraint
    UNIQUE: '(department_id, year, semester, project_id)'
  },

  // University-wide rankings
  university_rankings: {
    id: 'SERIAL PRIMARY KEY',
    university_id: 'INTEGER REFERENCES universities(id)',
    year: 'INTEGER NOT NULL',
    semester: "ENUM('Spring', 'Fall') NOT NULL",
    project_id: 'INTEGER REFERENCES fyp_projects(id)',
    rank_position: 'INTEGER NOT NULL',
    department_rank: 'INTEGER NOT NULL', // Rank within department
    overall_rank: 'INTEGER NOT NULL', // Rank across all departments
    last_calculated: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // Teacher evaluations and comments
  project_evaluations: {
    id: 'SERIAL PRIMARY KEY',
    project_id: 'INTEGER REFERENCES fyp_projects(id)',
    evaluator_id: 'INTEGER REFERENCES users(id)', // Teacher/supervisor
    evaluation_type: "ENUM('Interim', 'Final', 'Defense') NOT NULL",

    // Detailed scoring
    technical_score: 'INTEGER CHECK (technical_score >= 1 AND technical_score <= 10)',
    innovation_score: 'INTEGER CHECK (innovation_score >= 1 AND innovation_score <= 10)',
    implementation_score: 'INTEGER CHECK (implementation_score >= 1 AND implementation_score <= 10)',
    presentation_score: 'INTEGER CHECK (presentation_score >= 1 AND presentation_score <= 10)',
    documentation_score: 'INTEGER CHECK (documentation_score >= 1 AND documentation_score <= 10)',

    overall_score: 'DECIMAL(4,2)',
    comments: 'TEXT',
    recommendations: 'TEXT',

    evaluation_date: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },

  // Search and filtering indexes
  indexes: [
    'CREATE INDEX idx_fyp_projects_year_dept ON fyp_projects(year, department_id)',
    'CREATE INDEX idx_fyp_projects_performance ON fyp_projects(performance_score DESC)',
    'CREATE INDEX idx_department_rankings_year ON department_rankings(department_id, year, semester)',
    'CREATE INDEX idx_project_status ON fyp_projects(status, year)',
    'CREATE INDEX idx_fyp_grade_points ON fyp_projects(grade_points DESC, year)'
  ]
};

// Performance Score Calculation Formula
export const RANKING_FORMULA = {
  weights: {
    grade_points: 0.30,        // 30% - Academic grade
    innovation_score: 0.20,    // 20% - Innovation and creativity
    implementation_quality: 0.20, // 20% - Technical implementation
    documentation_quality: 0.10,  // 10% - Documentation quality
    presentation_score: 0.10,     // 10% - Presentation skills
    citations: 0.05,              // 5% - Research impact
    industry_adoption: 0.05       // 5% - Real-world impact
  },

  // Formula: performance_score = Σ(metric * weight) * 100
  calculatePerformanceScore: function(project) {
    const {
      grade_points = 0,
      innovation_score = 0,
      implementation_quality = 0,
      documentation_quality = 0,
      presentation_score = 0,
      citations = 0,
      industry_adoption = false
    } = project;

    const normalizedCitations = Math.min(citations / 10, 1); // Normalize citations to 0-1
    const adoptionBonus = industry_adoption ? 1 : 0;

    return Math.round((
      (grade_points / 4.0) * this.weights.grade_points +
      (innovation_score / 10) * this.weights.innovation_score +
      (implementation_quality / 10) * this.weights.implementation_quality +
      (documentation_quality / 10) * this.weights.documentation_quality +
      (presentation_score / 10) * this.weights.presentation_score +
      normalizedCitations * this.weights.citations +
      adoptionBonus * this.weights.industry_adoption
    ) * 100);
  }
};

// Sample API Endpoints Structure
export const API_ENDPOINTS = {
  // Get top projects by department and year
  getDepartmentRankings: '/api/rankings/department/:departmentId/:year',

  // Get top projects across all departments for a year
  getYearlyRankings: '/api/rankings/year/:year',

  // Search projects by filters
  searchProjects: '/api/projects/search',

  // Teacher ranking and evaluation endpoints
  getTeacherProjects: '/api/teacher/projects',
  submitEvaluation: '/api/teacher/evaluate/:projectId',
  updateProjectRanking: '/api/teacher/rank/:projectId'
};

export default FYP_RANKING_SCHEMA;