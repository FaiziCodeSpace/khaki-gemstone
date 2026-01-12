import api from "./api";

export const fetchAllProducts = async (limited = false, limit = 0) => {
    try {
        // Builds: /products?limited=true&limit=6
        const response = await api.get(`/products?limited=${limited}&limit=${limit}`);
        return response.data;
    } catch (err) {
        console.error('Error fetching products:', err);
        throw err;
    }
}

export const fetchProduct = async () => {
    try{
        const response = await api.get('/product/:id');
        return response.data;
    }catch(err){
        console.error('Error Product:', err)
        throw err;
    }
}

