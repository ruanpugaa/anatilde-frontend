import api from './api';
import { Category } from '../@types/category';
import { useCacheStore } from '../store/useCacheStore';

const CATEGORIES_CACHE_KEY = 'global_categories';

export const categoryService = {
    /**
     * Busca todas as categorias com estratégia Cache-Aside.
     * Ideal para componentes de Menu, Filtros e Vitrines.
     */
    getAll: async (): Promise<Category[]> => {
        // 1. Tenta recuperar do cache local (Zustand)
        const cached = useCacheStore.getState().getCache<Category[]>(CATEGORIES_CACHE_KEY);
        
        if (cached) {
            return cached;
        }

        // 2. Se não houver cache, busca na API
        try {
            const { data } = await api.get<Category[]>('/admin_categorias.php');
            const categories = Array.isArray(data) ? data : [];
            
            // 3. Alimenta o cache para as próximas chamadas
            useCacheStore.getState().setCache(CATEGORIES_CACHE_KEY, categories);
            
            return categories;
        } catch (error) {
            console.error("categoryService.getAll Error:", error);
            return [];
        }
    },

    /**
     * Cria ou Atualiza uma categoria.
     * O interceptor do api.ts já cuidará da invalidação do cache_version.txt no PHP,
     * mas aqui limpamos o cache local para garantir sincronia imediata.
     */
    save: async (formData: FormData) => {
        const { data } = await api.post('/admin_categorias.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Invalidação local imediata
        useCacheStore.getState().invalidate(CATEGORIES_CACHE_KEY);
        return data;
    },

    /**
     * Remove uma categoria e limpa o cache.
     */
    delete: async (id: number) => {
        const { data } = await api.delete(`/admin_categorias.php?id=${id}`);
        
        // Invalidação local imediata
        useCacheStore.getState().invalidate(CATEGORIES_CACHE_KEY);
        return data;
    }
};