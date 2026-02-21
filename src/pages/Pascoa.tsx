import { useRef, useCallback } from 'react';
import { useEasterCollection } from '../hooks/useEasterCollection';
import { useCartStore } from '../store/useCartStore';
import { EasterHero } from '../components/pascoa/EasterHero';
import { EasterProductStage } from '../components/pascoa/EasterProductStage';
import { EasterProductSelector } from '../components/pascoa/EasterProductSelector';
import { Newsletter } from '../components/common/Newsletter';
import { Loader2 } from 'lucide-react';
import { Product } from '../@types/product';

export const Pascoa = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    const { products, selectedProduct, setSelectedProduct, loading, error } = useEasterCollection();
    const addItem = useCartStore((state) => state.addItem);

    const scrollToStage = () => stageRef.current?.scrollIntoView({ behavior: 'smooth' });

    /**
     * STAFF FIX: Sanitização de Objeto para o Carrinho
     * O erro ocorre porque o Store espera 'id: number', mas a API manda 'id: string | number'.
     * Criamos um novo objeto garantindo a tipagem correta.
     */
    const handleAddToCart = useCallback((product: Product) => {
        if (!product) return;

        // Criamos uma cópia sanitizada para o Carrinho
        const sanitizedProduct = {
            ...product,
            id: Number(product.id), // Força o ID a ser number
            price: Number(product.price) // Aproveitamos para garantir que o preço também seja number
        };

        // Agora o TS aceita pois o objeto satisfaz Omit<Product, "quantity"> com id: number
        addItem(sanitizedProduct as any); 
    }, [addItem]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-400 mb-4" size={48} />
            <p className="text-stone-400 font-serif italic">Sincronizando Coleção...</p>
        </div>
    );

    if (error || products.length === 0) return null;

    return (
        <>
            <div className="bg-[#080808] min-h-screen w-full font-sans text-white">
                <EasterHero onScrollRequest={scrollToStage} />

                <div ref={stageRef} className="flex flex-col min-h-screen relative">
                    <EasterProductStage 
                        product={selectedProduct} 
                        onAddToCart={handleAddToCart} 
                    />

                    <EasterProductSelector 
                        products={products} 
                        // STAFF FIX: ID convertido para o seletor visual
                        selectedId={selectedProduct?.id ? Number(selectedProduct.id) : undefined} 
                        onSelect={setSelectedProduct} 
                    />
                </div>
            </div>
            <Newsletter />
        </>
    );
};