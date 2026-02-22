import { useState, useEffect, useCallback } from 'react';
import { Product } from '../@types/product';
import { productService } from '../services/productService';

/**
 * STAFF ARCHITECTURE:
 * O hook agora aceita um slug, tornando-o agnóstico à categoria.
 * Default definido como 'pascoa-2026'.
 */
export const useEasterCollection = (slug = 'pascoa-2026') => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const loadCollection = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            
            /**
             * STAFF FILTERING:
             * Buscamos os produtos ativos e filtramos pelo slug da categoria.
             * Isso evita hard-coded IDs que quebram entre ambientes (dev/prod).
             */
            const allProducts = await productService.getAllActive();
            
            // Filtro por slug (case-insensitive para segurança)
            const collection = allProducts.filter(p => 
                p.category_slug?.toLowerCase() === slug.toLowerCase()
            );
            
            setProducts(collection);
            
            // Memoização do estado inicial: mantém o produto já selecionado 
            // ou reseta para o primeiro da nova lista
            if (collection.length > 0) {
                setSelectedProduct(prev => {
                    const exists = collection.find(p => p.id === prev?.id);
                    return exists || collection[0];
                });
            }
        } catch (err) {
            console.error(`[useEasterCollection] Failure loading slug: ${slug}`, err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadCollection();
    }, [loadCollection]);

    return {
        products,
        selectedProduct,
        setSelectedProduct,
        loading,
        error,
        refresh: loadCollection
    };
};