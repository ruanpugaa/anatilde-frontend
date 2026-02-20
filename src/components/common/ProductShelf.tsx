import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../@types/product';
import { motion } from 'framer-motion';

interface ProductShelfProps {
    title: string;
    subtitle: string;
    products: Product[];
    limit?: number;
}

export const ProductShelf = ({ title, subtitle, products, limit = 8 }: ProductShelfProps) => {
    // Garantimos que o componente não quebre se products for undefined
    const displayProducts = products?.slice(0, limit) || [];

    return (
        <section className="py-24 px-[5vw] md:px-[10vw] mx-auto">
            {/* Header da Seção */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="text-pink-500 font-bold text-[10px] uppercase tracking-[0.4em]">
                    {subtitle}
                </span>
                <h3 className="text-4xl md:text-5xl font-serif italic text-stone-800 mt-2">
                    {title}
                </h3>
            </motion.div>

            {/* Grid de Produtos */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {displayProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-stone-200 rounded-3xl">
                    <p className="text-stone-400 font-serif italic">Preparando delícias para você...</p>
                </div>
            )}
        </section>
    );
};