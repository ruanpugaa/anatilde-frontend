import axios from 'axios';
import { useCacheStore } from '../store/useCacheStore';

/**
 * API Service - Staff Level
 */
const api = axios.create({
    // O problema pode estar aqui se o app entender que TUDO abaixo de anatilde.com.br pertence à API
    baseURL: 'https://api.anatilde.com.br/',
    timeout: 15000,
});

api.interceptors.request.use(
    (config) => {
        /**
         * STAFF FIX: Impedir que o Axios anexe o baseURL em URLs que já começam 
         * com http ou https. Isso evita comportamentos bizarros se você usar
         * a instância da API para buscar algum asset externo.
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
        // Tratamento de erro robusto
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        
        // Se for 401 ou 403, você pode disparar um redirect de auth aqui no futuro
        
        return Promise.reject({ ...error, friendlyMessage: message });
    }
);

export default api;