import { useEffect, useState } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { BrandMarquee } from '../components/home/BrandMarquee';
import { EasterCountdown } from '../components/home/EasterCountdown';
import { ProductShelf } from '../components/common/ProductShelf';
import { CategoryScroll } from '../components/home/CategoryScroll';
import { Product } from '../@types/product';
import { productService } from '../services/productService';
import { Newsletter } from '../components/common/Newsletter';

export const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        productService.getAllActive().then(setProducts);
    }, []);

    return (
        <div className="bg-[#FFFCFB] w-full">
            {/* 1. Header Dinâmico */}
            <HeroSlider />
            <EasterCountdown />
            {/* 2. Prova Social / Autoridade */}
            

            {/* 3. Conversão Direta (Mais Vendidos) */}
            <ProductShelf 
                title="Mais Vendidos" 
                subtitle="Favoritos" 
                products={products} 
            />

            {/* 4. Navegação por Experiência (Categorias) */}
            <CategoryScroll />

            <Newsletter />
        </div>
    );
};