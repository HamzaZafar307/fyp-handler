// Sample data for FYP Ranking System
// This file provides mock data for testing the ranking components

export const sampleDepartments = [
  {
    id: 1,
    name: 'Computer Science',
    code: 'CS',
    university_id: 1
  },
  {
    id: 2,
    name: 'Software Engineering',
    code: 'SE',
    university_id: 1
  },
  {
    id: 3,
    name: 'Data Science',
    code: 'DS',
    university_id: 1
  },
  {
    id: 4,
    name: 'Cybersecurity',
    code: 'CYB',
    university_id: 1
  }
];

export const sampleCategories = [
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'IoT & Embedded Systems',
  'Blockchain Technology',
  'Data Science & Analytics',
  'Cybersecurity',
  'Cloud Computing',
  'Artificial Intelligence',
  'Computer Vision',
  'Natural Language Processing',
  'Game Development',
  'AR/VR Development',
  'DevOps & Automation'
];

export const sampleYears = [2020, 2021, 2022, 2023, 2024, 2025];

export const sampleFYPProjects = [
  {
    id: 1,
    title: 'AI-Powered Fake News Detection System',
    description: 'A comprehensive machine learning solution that uses NLP techniques to identify and classify fake news articles with 94% accuracy.',
    department_id: 1,
    department: 'Computer Science',
    supervisor_id: 101,
    supervisor: 'Dr. Ahmad Hassan',
    year: 2024,
    semester: 'Spring',
    category: 'Machine Learning',
    final_grade: 'A+',
    grade_points: 4.0,
    performance_score: 95,
    status: 'Completed',
    innovation_score: 9,
    implementation_quality: 9,
    documentation_quality: 8,
    presentation_score: 9,
    citations: 3,
    publications: 1,
    industry_adoption: true,
    students: ['Fatima Ahmed', 'Usman Sheikh', 'Ali Hassan'],
    department_rank: 1,
    overall_rank: 1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z'
  },
  {
    id: 2,
    title: 'Smart Campus Energy Management IoT System',
    description: 'An integrated IoT solution for monitoring and optimizing energy consumption across university campus buildings.',
    department_id: 1,
    department: 'Computer Science',
    supervisor_id: 102,
    supervisor: 'Prof. Sara Khan',
    year: 2024,
    semester: 'Spring',
    category: 'IoT & Embedded Systems',
    final_grade: 'A',
    grade_points: 3.67,
    performance_score: 89,
    status: 'Completed',
    innovation_score: 8,
    implementation_quality: 9,
    documentation_quality: 8,
    presentation_score: 8,
    citations: 1,
    publications: 0,
    industry_adoption: false,
    students: ['Ahmed Ali', 'Hassan Malik'],
    department_rank: 2,
    overall_rank: 5,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z'
  },
  {
    id: 3,
    title: 'Blockchain-Based Supply Chain Tracking Platform',
    description: 'A decentralized platform for transparent tracking of products through supply chain using smart contracts.',
    department_id: 2,
    department: 'Software Engineering',
    supervisor_id: 103,
    supervisor: 'Dr. Omar Farooq',
    year: 2024,
    semester: 'Spring',
    category: 'Blockchain Technology',
    final_grade: 'A',
    grade_points: 3.67,
    performance_score: 87,
    status: 'Completed',
    innovation_score: 9,
    implementation_quality: 8,
    documentation_quality: 8,
    presentation_score: 8,
    citations: 2,
    publications: 0,
    industry_adoption: true,
    students: ['Zara Noor', 'Bilal Khan'],
    department_rank: 1,
    overall_rank: 7,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z'
  },
  {
    id: 4,
    title: 'Mental Health AI Chatbot',
    description: 'An empathetic AI assistant providing 24/7 mental health support with sentiment analysis and crisis detection.',
    department_id: 1,
    department: 'Computer Science',
    supervisor_id: 104,
    supervisor: 'Dr. Ayesha Siddique',
    year: 2023,
    semester: 'Fall',
    category: 'Artificial Intelligence',
    final_grade: 'A+',
    grade_points: 4.0,
    performance_score: 93,
    status: 'Completed',
    innovation_score: 10,
    implementation_quality: 9,
    documentation_quality: 9,
    presentation_score: 8,
    citations: 5,
    publications: 1,
    industry_adoption: true,
    students: ['Saba Noor', 'Hamza Ali'],
    department_rank: 1,
    overall_rank: 2,
    created_at: '2023-08-15T00:00:00Z',
    updated_at: '2023-12-20T00:00:00Z'
  },
  {
    id: 5,
    title: 'AR Navigation System for University Campus',
    description: 'An augmented reality mobile application providing interactive navigation and information overlay for campus visitors.',
    department_id: 2,
    department: 'Software Engineering',
    supervisor_id: 105,
    supervisor: 'Prof. Noor Ahmed',
    year: 2023,
    semester: 'Fall',
    category: 'AR/VR Development',
    final_grade: 'A+',
    grade_points: 4.0,
    performance_score: 91,
    status: 'Completed',
    innovation_score: 9,
    implementation_quality: 9,
    documentation_quality: 8,
    presentation_score: 9,
    citations: 0,
    publications: 0,
    industry_adoption: true,
    students: ['Maria Khan', 'Tariq Ali'],
    department_rank: 2,
    overall_rank: 4,
    created_at: '2023-08-15T00:00:00Z',
    updated_at: '2023-12-20T00:00:00Z'
  },
  {
    id: 6,
    title: 'Cybersecurity Threat Detection using Deep Learning',
    description: 'Advanced anomaly detection system for identifying zero-day attacks and security threats in network traffic.',
    department_id: 4,
    department: 'Cybersecurity',
    supervisor_id: 106,
    supervisor: 'Dr. Rashid Mahmood',
    year: 2024,
    semester: 'Fall',
    category: 'Cybersecurity',
    final_grade: 'A',
    grade_points: 3.67,
    performance_score: 88,
    status: 'In Progress',
    innovation_score: 8,
    implementation_quality: 8,
    documentation_quality: 7,
    presentation_score: 8,
    citations: 0,
    publications: 0,
    industry_adoption: false,
    students: ['Hassan Ahmed', 'Fatima Shah'],
    department_rank: 1,
    overall_rank: 6,
    created_at: '2024-08-15T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z'
  },
  {
    id: 7,
    title: 'E-commerce Recommendation Engine',
    description: 'Personalized product recommendation system using collaborative filtering and deep learning techniques.',
    department_id: 3,
    department: 'Data Science',
    supervisor_id: 107,
    supervisor: 'Dr. Amina Khatoon',
    year: 2024,
    semester: 'Spring',
    category: 'Data Science & Analytics',
    final_grade: 'A-',
    grade_points: 3.33,
    performance_score: 84,
    status: 'Completed',
    innovation_score: 7,
    implementation_quality: 8,
    documentation_quality: 8,
    presentation_score: 8,
    citations: 1,
    publications: 0,
    industry_adoption: false,
    students: ['Zain Abbas', 'Rida Malik', 'Sarah Ahmed'],
    department_rank: 1,
    overall_rank: 8,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z'
  },
  {
    id: 8,
    title: 'Smart Traffic Management System',
    description: 'AI-powered traffic optimization system using computer vision and predictive analytics.',
    department_id: 1,
    department: 'Computer Science',
    supervisor_id: 108,
    supervisor: 'Prof. Khalid Iqbal',
    year: 2023,
    semester: 'Spring',
    category: 'Computer Vision',
    final_grade: 'A',
    grade_points: 3.67,
    performance_score: 86,
    status: 'Completed',
    innovation_score: 8,
    implementation_quality: 8,
    documentation_quality: 7,
    presentation_score: 9,
    citations: 2,
    publications: 0,
    industry_adoption: true,
    students: ['Ahmed Hassan', 'Noor Fatima'],
    department_rank: 3,
    overall_rank: 9,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-06-20T00:00:00Z'
  }
];

// Helper function to get department rankings (computed at runtime)
export const getSampleDepartmentRankings = () => [
  {
    department: {
      id: 1,
      name: 'Computer Science',
      code: 'CS'
    },
    projects: sampleFYPProjects.filter(p => p.department_id === 1).sort((a, b) => b.performance_score - a.performance_score),
    avg_performance: 89.5,
    total_projects: 4
  },
  {
    department: {
      id: 2,
      name: 'Software Engineering',
      code: 'SE'
    },
    projects: sampleFYPProjects.filter(p => p.department_id === 2).sort((a, b) => b.performance_score - a.performance_score),
    avg_performance: 89,
    total_projects: 2
  },
  {
    department: {
      id: 3,
      name: 'Data Science',
      code: 'DS'
    },
    projects: sampleFYPProjects.filter(p => p.department_id === 3).sort((a, b) => b.performance_score - a.performance_score),
    avg_performance: 84,
    total_projects: 1
  },
  {
    department: {
      id: 4,
      name: 'Cybersecurity',
      code: 'CYB'
    },
    projects: sampleFYPProjects.filter(p => p.department_id === 4).sort((a, b) => b.performance_score - a.performance_score),
    avg_performance: 88,
    total_projects: 1
  }
];

export const sampleDepartmentRankings = getSampleDepartmentRankings();

export const sampleOverallRankings = sampleFYPProjects
  .sort((a, b) => b.performance_score - a.performance_score)
  .map((project, index) => ({
    ...project,
    overall_rank: index + 1
  }));

export const sampleRankingStats = {
  total_projects: sampleFYPProjects.length,
  total_departments: sampleDepartments.length,
  avg_performance: Math.round(sampleFYPProjects.reduce((acc, p) => acc + p.performance_score, 0) / sampleFYPProjects.length),
  a_plus_count: sampleFYPProjects.filter(p => p.final_grade === 'A+').length,
  completed_projects: sampleFYPProjects.filter(p => p.status === 'Completed').length,
  in_progress_projects: sampleFYPProjects.filter(p => p.status === 'In Progress').length
};

export const sampleTeacherProjects = (teacherId) => {
  // Return projects for a specific teacher
  return sampleFYPProjects.filter(p => p.supervisor_id === teacherId);
};

export const sampleEvaluations = [
  {
    id: 1,
    project_id: 1,
    evaluator_id: 101,
    evaluation_type: 'Final',
    technical_score: 9,
    innovation_score: 9,
    implementation_score: 9,
    presentation_score: 9,
    documentation_score: 8,
    overall_score: 8.8,
    comments: 'Exceptional work demonstrating deep understanding of NLP and machine learning concepts. The accuracy achieved is impressive.',
    recommendations: 'Consider publishing this work in a peer-reviewed journal.',
    evaluation_date: '2024-06-15T00:00:00Z'
  },
  {
    id: 2,
    project_id: 2,
    evaluator_id: 102,
    evaluation_type: 'Final',
    technical_score: 8,
    innovation_score: 8,
    implementation_score: 9,
    presentation_score: 8,
    documentation_score: 8,
    overall_score: 8.2,
    comments: 'Well-implemented IoT solution with good practical applications. The energy optimization results are significant.',
    recommendations: 'Expand the system to include predictive maintenance features.',
    evaluation_date: '2024-06-15T00:00:00Z'
  }
];

// Mock API responses
export const mockApiResponses = {
  getDepartmentRankings: (departmentId, year, semester) => {
    return {
      data: {
        department: sampleDepartments.find(d => d.id === parseInt(departmentId)),
        projects: sampleFYPProjects.filter(p =>
          p.department_id === parseInt(departmentId) &&
          p.year === parseInt(year) &&
          (!semester || p.semester === semester)
        ).sort((a, b) => b.performance_score - a.performance_score),
        stats: sampleRankingStats
      }
    };
  },

  getAllDepartmentRankings: (year, semester) => {
    return {
      data: sampleDepartmentRankings.map(dept => ({
        ...dept,
        projects: dept.projects.filter(p =>
          p.year === parseInt(year) &&
          (!semester || p.semester === semester)
        )
      }))
    };
  },

  getYearlyRankings: (year, semester, limit) => {
    return {
      data: sampleOverallRankings
        .filter(p =>
          p.year === parseInt(year) &&
          (!semester || p.semester === semester)
        )
        .slice(0, limit)
    };
  },

  searchProjects: (filters) => {
    let results = sampleFYPProjects;

    if (filters.year) results = results.filter(p => p.year === parseInt(filters.year));
    if (filters.semester) results = results.filter(p => p.semester === filters.semester);
    if (filters.department) results = results.filter(p => p.department === filters.department);
    if (filters.category) results = results.filter(p => p.category === filters.category);
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.students.some(s => s.toLowerCase().includes(term)) ||
        p.supervisor.toLowerCase().includes(term)
      );
    }

    return {
      data: {
        projects: results.slice(0, filters.limit || 20),
        total: results.length,
        stats: {
          avg_performance: Math.round(results.reduce((acc, p) => acc + p.performance_score, 0) / results.length),
          departments_count: [...new Set(results.map(p => p.department))].length,
          top_grade_count: results.filter(p => p.final_grade === 'A+').length
        }
      }
    };
  }
};

export default {
  sampleDepartments,
  sampleCategories,
  sampleYears,
  sampleFYPProjects,
  sampleDepartmentRankings,
  sampleOverallRankings,
  sampleRankingStats,
  sampleTeacherProjects,
  sampleEvaluations,
  mockApiResponses
};