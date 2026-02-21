import api from './api';
import { Category } from '../@types/category';
import { useCacheStore } from '../store/useCacheStore';

/**
 * STAFF ARCHITECTURE: Category Service
 * Sincronizado com o CRUD unificado em categories.php
 */
const CATEGORIES_CACHE_KEY = 'global_categories';

export const categoryService = {
    /**
     * STAFF SYNC: Aponta para o arquivo centralizado categories.php
     */
    getAll: async (): Promise<Category[]> => {
        const cached = useCacheStore.getState().getCache<Category[]>(CATEGORIES_CACHE_KEY);
        if (cached) return cached;

        try {
            // CORREÇÃO: apontando para categories.php
            const { data } = await api.get<Category[]>('/modules/categories/categories.php');
            const categories = Array.isArray(data) ? data : [];
            useCacheStore.getState().setCache(CATEGORIES_CACHE_KEY, categories);
            return categories;
        } catch (error) {
            console.error("categoryService.getAll Error:", error);
            return [];
        }
    },

    /**
     * STAFF SYNC: POST para categories.php
     */
    save: async (formData: FormData) => {
        try {
            // CORREÇÃO: apontando para categories.php
            const { data } = await api.post('/modules/categories/categories.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            useCacheStore.getState().invalidate(CATEGORIES_CACHE_KEY);
            return data;
        } catch (error) {
            console.error("categoryService.save Error:", error);
            throw error;
        }
    },

    /**
     * STAFF SYNC: DELETE para categories.php
     */
    delete: async (id: number) => {
        try {
            // CORREÇÃO: apontando para categories.php
            const { data } = await api.delete(`/modules/categories/categories.php?id=${id}`);
            useCacheStore.getState().invalidate(CATEGORIES_CACHE_KEY);
            return data;
        } catch (error) {
            console.error("categoryService.delete Error:", error);
            throw error;
        }
    }
};