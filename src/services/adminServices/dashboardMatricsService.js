import api from "../api";

export const fetchDashboardMetrics = async () => {
  try {
    const response = await api.get("/admin/dashboardMatrics");
    return response.data.dashboardData;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
};