import api from './api';

const projectService = {
    /**
     * Get projects with filters (formerly searchProjects)
     * @param {Object} filters - { searchTerm, category, year, page, pageSize }
     * @returns {Promise<Object>} - { data: [], totalCount: 0 }
     */
    getProjects: async (filters = {}) => {
        try {
            // Map frontend filters to Backend DTO
            const apiParams = {
                ...filters,
                Title: filters.searchTerm, // Backend Param is Title
                // Remove searchTerm to avoid confusion, though extra params usually ignored
            };
            delete apiParams.searchTerm;

            const response = await api.get('/projects/search', { params: apiParams });
            // Backend returns { success: true, data: { items: [], totalCount: ... } }
            return response.data;
        } catch (error) {
            console.error('Error searching projects:', error);
            throw error;
        }
    },

    /**
     * Search projects (alias for getProjects for backward compatibility)
     */
    searchProjects: async (filters = {}) => {
        return projectService.getProjects(filters);
    },

    /**
     * Get project by ID
     * @param {number} id 
     */
    getProjectById: async (id) => {
        try {
            const response = await api.get(`/projects/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    },

    /**
     * Get all categories
     */
    getProjectCategories: async () => {
        try {
            const response = await api.get('/projects/categories');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    /**
     * Get available years
     */
    getAvailableYears: async () => {
        try {
            const response = await api.get('/projects/years');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching years:', error);
            return [];
        }
    },

    /**
     * Get all departments
     */
    getDepartments: async () => {
        try {
            console.log('Fetching departments from /Department...');
            const response = await api.get('/Department');
            console.log('Departments API full response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
            return [];
        }
    },

    getSearchHistory: async () => {
        try {
            const response = await api.get('/projects/search-history');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching search history:', error);
            return [];
        }
    },

    saveSearchHistory: async (query, resultsCount) => {
        try {
            await api.post('/projects/search-history', { query, resultsCount });
            return true;
        } catch (error) {
            console.error('Error saving search history:', error);
            return false;
        }
    },

    clearSearchHistory: async () => {
        try {
            await api.delete('/projects/search-history');
            return true;
        } catch (error) {
            console.error('Error clearing search history:', error);
            return false;
        }
    },

    getSupervisors: async () => {
        try {
            const response = await api.get('/projects/supervisors');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching supervisors:', error);
            return [];
        }
    },

    /**
     * Get dashboard stats
     */
    getDashboardStats: async () => {
        try {
            const response = await api.get('/projects/stats');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    /**
     * Create a new project
     * @param {Object} projectData 
     */
    createProject: async (projectData) => {
        try {
            const response = await api.post('/projects', projectData);
            return response.data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    /**
     * Get projects by teacher ID
     * @param {number} teacherId 
     */
    getProjectsByTeacher: async (teacherId) => {
        try {
            const response = await api.get(`/projects/teacher/${teacherId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching teacher projects:', error);
            throw error;
        }
    },

    /**
     * Get pending projects for approval
     */
    getPendingProjects: async () => {
        try {
            const response = await api.get('/projects/search', { params: { Status: 'Proposed' } });
            return response.data.data.items;
        } catch (error) {
            console.error('Error fetching pending projects:', error);
            throw error;
        }
    }
};

export default projectService;
