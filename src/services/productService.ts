import api from './api';
import { Product } from '../@types/product';

export const productService = {
    /**
     * Busca todos os produtos ativos e permite filtros opcionais 
     * como category_id para evitar múltiplas chamadas pesadas.
     */
    async getAllActive(filters?: { category_id?: number }): Promise<Product[]> {
        const { data } = await api.get<Product[]>('/products.php');
        let products = Array.isArray(data) ? data : [];
        
        // Primeiro filtro: Apenas ativos (Regra base do seu Service)
        products = products.filter(p => Number(p.active) === 1);

        // Segundo filtro: Categoria (Se fornecido)
        if (filters?.category_id) {
            // Usamos 'as any' aqui apenas no filtro para acessar a propriedade da API 
            // que não está mapeada no seu Type global para não forçar alteração no Type.
            products = products.filter(p => Number((p as any).category_id) === filters.category_id);
        }

        return products;
    },

    async getById(id: number): Promise<Product | undefined> {
        const products = await this.getAllActive();
        return products.find(p => p.id === id);
    }
};