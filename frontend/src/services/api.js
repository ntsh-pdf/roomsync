
import axios from 'axios';

// Using the direct IPv4 loopback address prevents OS network confusion
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

export const resourceService = {
    getAll: async () => {
        const response = await API.get('/resources');
        return response.data;
    }
};

export const bookingService = {
    create: async (bookingData) => {
        const response = await API.post('/bookings', bookingData);
        return response.data;
    },
    getUserBookings: async (userId) => {
        const response = await API.get(`/bookings/user/${userId}`);
        return response.data;
    }
};

export default API;