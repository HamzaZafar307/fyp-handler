import axios from 'axios';

const API_URL = 'http://localhost:5003/api/Evaluation';

const evaluationService = {
    getProjectEvaluations: async (projectId) => {
        const response = await axios.get(`${API_URL}/project/${projectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    createEvaluation: async (evaluationData) => {
        const response = await axios.post(API_URL, evaluationData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    updateEvaluation: async (id, evaluationData) => {
        const response = await axios.put(`${API_URL}/${id}`, evaluationData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    deleteEvaluation: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

export default evaluationService;
