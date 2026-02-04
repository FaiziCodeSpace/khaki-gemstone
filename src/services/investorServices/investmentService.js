import api from "../api";

export const investorService = {
  investInProduct: async (productId) => {
    try {
      const response = await api.post(`/investor/invest/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Investment failed";
      throw message;
    }
  },

  getMyInvestments: async () => {
    try {
      const response = await api.get("/investor/investments");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Could not fetch investments";
    }
  },

  getInvestorMetrics: async () => {
    try {
      const response = await api.get("/investor/metrics");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Could not fetch investor metrics";
    }
  },
  refundInvestment: async (investmentId) => {
    try {
      const response = await api.post(`/investor/refund/${investmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};