import api from './api';
import { Product } from '../@types/product';
import { useCacheStore } from '../store/useCacheStore';

const PRODUCTS_CACHE_KEY = 'all_active_products';

/**
 * STAFF ARCHITECTURE: Product Service
 * Ajustado para garantir que novos campos (extra_info) e JOINs sejam refletidos.
 */
export const productService = {
    /**
     * Busca produtos ativos com Cache-Aside.
     */
    async getAllActive(filters?: { category_id?: number | string }): Promise<Product[]> {
        const cacheStore = useCacheStore.getState();
        
        // STAFF: Se houver mudança estrutural no banco, force a invalidação manual ou via versão
        let products = cacheStore.getCache<Product[]>(PRODUCTS_CACHE_KEY);

        if (!products) {
            try {
                // STAFF SYNC: Adicionamos um timestamp para bypassar cache de rede do navegador (Edge Cases)
                const { data } = await api.get<Product[]>(`/modules/products/public_list.php?t=${Date.now()}`);
                
                products = Array.isArray(data) ? data : [];
                
                // Armazena no cache para performance
                cacheStore.setCache(PRODUCTS_CACHE_KEY, products);
            } catch (error) {
                console.error("Erro ao buscar produtos ativos:", error);
                return [];
            }
        }

        if (filters?.category_id && filters.category_id !== 'all') {
            return products.filter(p => String(p.category_id) === String(filters.category_id));
        }

        return products;
    },

    /**
     * Busca detalhada
     * STAFF FIX: Garantir que o produto retornado venha com todos os campos novos.
     */
    async getById(id: number | string): Promise<Product | undefined> {
        try {
            // Se o cache estiver limpo, getAllActive vai buscar a versão nova com extra_info
            const products = await this.getAllActive();
            const found = products.find(p => String(p.id) === String(id));
            
            if (!found) {
                // Fallback: Se não achou no cache, tenta buscar direto da fonte (Bypass Cache)
                const { data } = await api.get<Product[]>(`/modules/products/public_list.php?id=${id}&t=${Date.now()}`);
                return Array.isArray(data) ? data.find(p => String(p.id) === String(id)) : undefined;
            }
            
            return found;
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
            
            // STAFF: Invalidação crucial após salvar para refletir extra_info imediatamente
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

    /**
     * STAFF: Use esta função no console do navegador para limpar o cache se necessário:
     * window.localStorage.clear() ou productService.invalidateCache()
     */
    invalidateCache(): void {
        useCacheStore.getState().invalidate(PRODUCTS_CACHE_KEY);
    }
};