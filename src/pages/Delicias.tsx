import { useEffect, useState } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../@types/product';
import { productService } from '../services/productService'; // Import do service
import { Loader2 } from 'lucide-react';

export const Delicias = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // A lógica de fetch agora é uma "black box" para o componente
        productService.getAllActive()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-pink-400" /></div>;

    return (
        <main className="pt-40 pb-20 px-6 md:px-20 bg-[#FFFCFB]">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((p, idx) => (
                    <ProductCard key={p.id} product={p} index={idx} />
                ))}
            </div>
        </main>
    );
};