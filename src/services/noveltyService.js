import api from './api';

const noveltyService = {
    /**
     * Analyze an idea for uniqueness
     * @param {Object} data - { title, abstract }
     * @returns {Promise<Object>} - Analysis result
     */
    analyzeIdea: async (data) => {
        try {
            const response = await api.post('/novelty/analyze', data);
            return response.data;
        } catch (error) {
            console.error('Error analyzing idea:', error);
            throw error;
        }
    },

    /**
     * Get past analysis by ID
     * @param {string} id 
     */
    getAnalysis: async (id) => {
        try {
            const response = await api.get(`/novelty/analysis/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching analysis:', error);
            throw error;
        }
    },

    /**
     * Chat with AI about the idea
     * @param {Object} data - { title, abstract, originalityScore, history, message }
     */
    chatWithAi: async (data) => {
        try {
            const response = await api.post('/novelty/chat', data);
            return response.data;
        } catch (error) {
            console.error('Error chatting with AI:', error);
            throw error;
        }
    }
};

export default noveltyService;
