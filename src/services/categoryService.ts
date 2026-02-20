import api from './api';
import { Category } from '../@types/category';

export const categoryService = {
    // Agora com retorno tipado
    getAll: async (): Promise<Category[]> => {
        const { data } = await api.get<Category[]>('/admin_categorias.php');
        return Array.isArray(data) ? data : [];
    },

    create: async (formData: FormData) => {
        const { data } = await api.post('/admin_categorias.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.delete(`/admin_categorias.php?id=${id}`);
        return data;
    }
};