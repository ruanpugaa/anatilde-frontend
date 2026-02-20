import { useState, useEffect, useCallback } from 'react';
import { Product } from '../@types/product';
import { productService } from '../services/productService';

export const useEasterCollection = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const loadCollection = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            
            // Consumindo o service com o filtro que preparamos
            const data = await productService.getAllActive({ category_id: 7 });
            
            setProducts(data);
            
            // Define o primeiro produto como selecionado por padrão
            if (data.length > 0) {
                setSelectedProduct(data[0]);
            }
        } catch (err) {
            console.error("[useEasterCollection] Error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

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