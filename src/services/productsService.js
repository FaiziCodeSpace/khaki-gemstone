import api from "./api";

export const fetchAllProducts = async (limited = false, limit = 0) => {
    try {
        const response = await api.get(`/products?limited=${limited}&limit=${limit}`);
        return response.data;
    } catch (err) {
        console.error('Error fetching products:', err);
        throw err;
    }
}

export const fetchProduct = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error Product:', err);
        throw err;
    }
}

