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
    
    // STAFF: Injeção do slug semântico. Centralizamos a regra de negócio aqui.
    const { products, selectedProduct, setSelectedProduct, loading, error } = useEasterCollection('pascoa-2026');
    
    const addItem = useCartStore((state) => state.addItem);

    const scrollToStage = () => stageRef.current?.scrollIntoView({ behavior: 'smooth' });

    /**
     * STAFF SANITIZER:
     * Garante o cumprimento do contrato do useCartStore.
     * Resolvemos a divergência de tipos (string vs number) de forma definitiva.
     */
    const handleAddToCart = useCallback((product: Product) => {
        if (!product) return;

        // Omitimos o que não queremos e forçamos a tipagem correta
        const sanitizedItem = {
            ...product,
            id: Number(product.id),
            price: Number(product.price)
        };

        // Tipagem segura: passamos como um item compatível com o carrinho
        addItem(sanitizedItem as unknown as Product & { id: number; price: number });
    }, [addItem]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-400 mb-4" size={48} />
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-stone-400">
                Sincronizando Coleção...
            </p>
        </div>
    );

    // STAFF: Fail-safe para estados vazios ou erros de API
    if (error || products.length === 0) {
        console.warn("[Pascoa] Coleção vazia ou erro de carregamento.");
        return null;
    }

    return (
        <main className="bg-[#080808] min-h-screen w-full font-sans text-white">
            <EasterHero onScrollRequest={scrollToStage} />

            <div ref={stageRef} className="flex flex-col min-h-screen relative overflow-hidden">
                <EasterProductStage 
                    product={selectedProduct} 
                    onAddToCart={handleAddToCart} 
                />

                <EasterProductSelector 
                    products={products} 
                    // STAFF: Converte ID para comparação segura no Seletor Visual
                    selectedId={selectedProduct?.id ? Number(selectedProduct.id) : undefined} 
                    onSelect={setSelectedProduct} 
                />
            </div>
            
            <Newsletter />
        </main>
    );
};