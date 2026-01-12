import api from "./api";

export const fetchEvent = async () => {
    try{
        const response = await api.get('/event');
        return response.data;
    }catch(err){
        console.error('Error fetching Event:', err)
        throw err;
    }
};