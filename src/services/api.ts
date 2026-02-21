import axios from 'axios';
import { useCacheStore } from '../store/useCacheStore';

const api = axios.create({
    baseURL: 'https://anatilde.com.br/api',
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => {
        // STAFF LOGIC: Se for uma requisição de escrita (mutação) bem sucedida
        const isMutation = ['post', 'put', 'delete'].includes(response.config.method || '');
        
        if (isMutation) {
            // Invalida o cache globalmente no front-end do Admin/Cliente
            useCacheStore.getState().invalidate(); 
            console.log('✨ Cache invalidado devido a mutação no banco.');
        }
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;