import axios from 'axios';

const api = axios.create({
    baseURL: 'https://anatilde.com.br/api',
    timeout: 10000,
});

// Interceptor para logs ou tratamento de erros global (Staff Level)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;