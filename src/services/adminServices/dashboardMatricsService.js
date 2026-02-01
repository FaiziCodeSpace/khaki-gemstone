import adminApi from "./api.authService";

export const fetchDashboardMetrics = async () => {
  try {
    const response = await adminApi.get("/admin/dashboardMatrics");
    return response.data.dashboardData;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
};