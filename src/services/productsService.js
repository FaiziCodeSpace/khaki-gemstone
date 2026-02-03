import adminApi from "./adminServices/api.authService";
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
                limit: arg1.limit || 0,
                page: arg1.page || 1,
                portal: arg1.portal || undefined
            };
        } else {

            params = { 
                limited: arg1, 
                limit: arg2 || 0, 
                page: arguments[2] || 1 
            };
        }

        const response = await api.get(`/products`, { params });

        if (response.data && response.data.products) {
            const products = response.data.products;
            products.pagination = {
                totalProducts: response.data.totalProducts,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage
            };
            return products;
        }

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
        console.error('Error fetching product:', err);
        throw err;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await adminApi.post("/createProduct", productData);
        return response.data;
    } catch (err) {
        console.error('Error creating product:', err);
        throw err;
    }
};

export const updateProduct = async (id, updateData) => {
    try {
        const response = await adminApi.patch(`/updateProduct/${id}`, updateData);
        return response.data;
    } catch (err) {
        console.error('Error updating product:', err);
        throw err;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await adminApi.delete(`/deleteProduct/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error deleting product:', err);
        throw err;
    }
};