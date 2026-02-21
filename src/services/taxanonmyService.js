import api from "./api";
import adminApi from "./adminServices/api.authService";

const TAXONOMY_URL = "/taxonomy"; 

const taxonomyService = {
  // Renamed from 'ta' for better readability and to match its purpose
  getMetadata: async () => {
    try {
      const response = await api.get(`${TAXONOMY_URL}/metadata`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEvent: async () => {
    try {
      const response = await api.get(`${TAXONOMY_URL}/active-event`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await adminApi.post(`${TAXONOMY_URL}/updateTaxonomy`, {
        id,
        ...data,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default taxonomyService;