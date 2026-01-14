import api from "./api";

export const fetchAllProducts = async (arg1 = false, arg2 = 0) => {
    try {
        let params = {};

        if (typeof arg1 === 'object' && arg1 !== null) {
            params = {
                search: arg1.search || undefined,
                category: arg1.category?.join(',') || undefined,
                filter: arg1.filter?.join(',') || undefined,
                limited: arg1.limited,
                limit: arg1.limit || 0
            };
        } 

        else {
            params = {
                limited: arg1,
                limit: arg2 || 0
            };
        }

        const response = await api.get(`/products`, { params });
        return response.data;
    } catch (err) {
        console.error('Error fetching products:', err);
        throw err;
    }
};

export const fetchProduct = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error Product:', err);
        throw err;
    }
}

