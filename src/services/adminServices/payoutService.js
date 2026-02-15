import adminApi from "./api.authService";

export const payoutServices = {
    fetchPayoutRequests: async (status = '') => {
        try {
            const url = status ? `/admin/payout?status=${status}` : 'admin/payout';
            const response = await adminApi.get(url);
                        return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch payout requests";
        }
    },
    updatePayoutStatus: async (payoutId, status) => {
        try {
            const response = await adminApi.put(`/admin/payout/${payoutId}`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to update payout status";
        }
    }
};