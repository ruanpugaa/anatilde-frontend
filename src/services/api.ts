import axios from 'axios';
import { useCacheStore } from '../store/useCacheStore';

/**
 * API Service - Staff Level
 */
const api = axios.create({
    baseURL: 'https://api.anatilde.com.br/',
    timeout: 15000,
});

api.interceptors.request.use(
    (config) => {
        /**
         * STAFF DEBUG: DESATIVAÇÃO DE CACHE VIA URL (CORS SAFE)
         * Usamos apenas o timestamp na URL para evitar erros de CORS 
         * com os headers 'Cache-Control' no servidor HostGator.
         */
        if (import.meta.env.DEV) {
            if (config.method?.toLowerCase() === 'get') {
                config.params = {
                    ...config.params,
                    _v: Date.now(), 
                };
            }
        }

        /**
         * STAFF FIX: Impedir que o Axios anexe o baseURL em URLs externas.
         */
        if (config.url?.startsWith('http')) {
            config.baseURL = ''; 
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        const { method } = response.config;
        const isMutation = ['post', 'put', 'delete', 'patch'].includes(method?.toLowerCase() || '');

        if (response.data && response.data.version) {
            useCacheStore.getState().setVersion(response.data.version);
        }

        if (isMutation) {
            useCacheStore.getState().invalidate();
        }

        return response;
    },
    (error) => {
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        return Promise.reject({ ...error, friendlyMessage: message });
    }
);

export default api;