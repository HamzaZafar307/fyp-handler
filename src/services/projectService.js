import api from './api';

const projectService = {
    /**
     * Search projects with filters
     * @param {Object} filters - { searchTerm, category, year, page, pageSize }
     * @returns {Promise<Object>} - { data: [], totalCount: 0 }
     */
    searchProjects: async (filters = {}) => {
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
            const response = await api.get('/department');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
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
    }
};

export default projectService;
