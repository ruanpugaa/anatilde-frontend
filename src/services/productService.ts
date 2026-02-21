import api from './api';
import { Product } from '../@types/product';
import { useCacheStore } from '../store/useCacheStore';

const PRODUCTS_CACHE_KEY = 'all_active_products';

export const productService = {
    /**
     * Busca todos os produtos ativos com Cache-Aside inteligente.
     * Filtra localmente para garantir performance extrema.
     */
    async getAllActive(filters?: { category_id?: number }): Promise<Product[]> {
        // 1. Tenta recuperar a lista mestre do cache
        let products = useCacheStore.getState().getCache<Product[]>(PRODUCTS_CACHE_KEY);

        if (!products) {
            // 2. Se não houver cache, busca na API
            const { data } = await api.get<Product[]>('/products.php');
            const rawProducts = Array.isArray(data) ? data : [];
            
            // Regra base: Apenas ativos (cacheamos apenas o que é útil para a loja)
            products = rawProducts.filter(p => Number(p.active) === 1);

            // 3. Alimenta o cache com a lista limpa
            useCacheStore.getState().setCache(PRODUCTS_CACHE_KEY, products);
        }

        // 4. Aplicação de filtros sobre o cache (Operação em memória, ultra rápida)
        if (filters?.category_id) {
            return products.filter(p => Number((p as any).category_id) === filters.category_id);
        }

        return products;
    },

    /**
     * Busca por ID aproveitando o cache do getAllActive
     */
    async getById(id: number): Promise<Product | undefined> {
        const products = await this.getAllActive();
        return products.find(p => p.id === id);
    },

    /**
     * Invalida o cache de produtos. 
     * Deve ser chamado após qualquer CREATE, UPDATE ou DELETE no Admin.
     */
    invalidateCache(): void {
        useCacheStore.getState().invalidate(PRODUCTS_CACHE_KEY);
    }
};