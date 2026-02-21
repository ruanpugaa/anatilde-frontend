import { useEffect, useState } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { EasterCountdown } from '../components/home/EasterCountdown';
import { ProductShelf } from '../components/common/ProductShelf';
import { CategoryScroll } from '../components/home/CategoryScroll';
import { Newsletter } from '../components/common/Newsletter';
import { Product } from '../@types/product';
import { productService } from '../services/productService';

export const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        productService.getAllActive()
            .then(data => {
                if (isMounted) {
                    setProducts(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    return (
        <div className="bg-[#FFFCFB] w-full">
            <HeroSlider />
            <EasterCountdown />

            {/* Shelf de Produtos com Skeleton ou Empty State logic */}
            {loading ? (
                <div className="h-96 flex items-center justify-center text-slate-400">
                    Carregando delícias...
                </div>
            ) : (
                <ProductShelf 
                    title="Mais Vendidos" 
                    subtitle="Favoritos" 
                    products={products.slice(0, 8)} // Staff Tip: Limita a shelf para performance
                />
            )}

            <CategoryScroll />
            <Newsletter />
        </div>
    );
};