import api from "../api"; 

export const investorService = {
  investInProduct: async (productId) => {
    try {
      const response = await api.post(`/investor/invest/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Investment failed";
    }
  },

  getMyInvestments: async () => {
    try {
      const response = await api.get("/investor/investments");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Could not fetch investments";
    }
  }
};