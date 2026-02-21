import api from './api';
import { Product } from '../@types/product';
import { useCacheStore } from '../store/useCacheStore';

const PRODUCTS_CACHE_KEY = 'all_active_products';

/**
 * STAFF ARCHITECTURE: Product Service
 * Responsável pela gestão de catálogo e integração com a nova API modular.
 */
export const productService = {
    /**
     * Busca produtos ativos com Cache-Aside e Versionamento.
     */
    async getAllActive(filters?: { category_id?: number | string }): Promise<Product[]> {
        const cacheStore = useCacheStore.getState();
        let products = cacheStore.getCache<Product[]>(PRODUCTS_CACHE_KEY);

        if (!products) {
            try {
                const version = cacheStore.version;
                // STAFF SYNC: Rota modularizada para listagem pública
                const { data } = await api.get<Product[]>(`/modules/products/public_list.php?v=${version}`);
                
                products = Array.isArray(data) ? data : [];
                cacheStore.setCache(PRODUCTS_CACHE_KEY, products);
            } catch (error) {
                console.error("Erro ao buscar produtos ativos:", error);
                return [];
            }
        }

        // Filtragem no Client-side para reduzir hits na API (Performance Staff Level)
        if (filters?.category_id && filters.category_id !== 'all') {
            return products.filter(p => String(p.category_id) === String(filters.category_id));
        }

        return products;
    },

    /**
     * Busca detalhada (Admin/Single Product Page)
     */
    async getById(id: number | string): Promise<Product | undefined> {
        try {
            // STAFF TIP: Para a página de produto ou edição no admin, 
            // buscamos no cache primeiro, mas podemos ter um fallback para a API se necessário.
            const products = await this.getAllActive();
            return products.find(p => String(p.id) === String(id));
        } catch (error) {
            return undefined;
        }
    },

    /**
     * Operações de Escrita (Admin)
     */
    async save(formData: FormData): Promise<{ success: boolean; product?: Product }> {
        try {
            const { data } = await api.post('/modules/products/save.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            this.invalidateCache();
            return data;
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            throw error;
        }
    },

    async delete(id: number | string): Promise<void> {
        try {
            await api.delete(`/modules/products/delete.php?id=${id}`);
            this.invalidateCache();
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            throw error;
        }
    },

    invalidateCache(): void {
        useCacheStore.getState().invalidate(PRODUCTS_CACHE_KEY);
    }
};