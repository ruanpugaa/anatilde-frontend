import { useRef } from 'react';
import { useEasterCollection } from '../hooks/useEasterCollection';
import { useCartStore } from '../store/useCartStore';
import { EasterHero } from '../components/pascoa/EasterHero';
import { EasterProductStage } from '../components/pascoa/EasterProductStage';
import { EasterProductSelector } from '../components/pascoa/EasterProductSelector';
import { Newsletter } from '../components/common/Newsletter';
import { Loader2 } from 'lucide-react';

export const Pascoa = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    const { products, selectedProduct, setSelectedProduct, loading, error } = useEasterCollection();
    const addItem = useCartStore((state) => state.addItem) as any;

    const scrollToStage = () => stageRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-400 mb-4" size={48} />
            <p className="text-stone-400 font-serif italic">Sincronizando Coleção...</p>
        </div>
    );

    if (error || products.length === 0) return null; // Ou seu EmptyState

    return (
        <>
            <div className="bg-[#080808] min-h-screen w-full font-sans text-white">
                <EasterHero onScrollRequest={scrollToStage} />

                <div ref={stageRef} className="flex flex-col min-h-screen relative">
                    {/* Filho 1: O Palco Principal */}
                    <EasterProductStage 
                        product={selectedProduct} 
                        onAddToCart={addItem} 
                    />

                    {/* Filho 2: O Seletor (Dock) */}
                    <EasterProductSelector 
                        products={products} 
                        selectedId={selectedProduct?.id} 
                        onSelect={setSelectedProduct} 
                    />
                </div>
            </div>
            <Newsletter />
        </>
    );
};