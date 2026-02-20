import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, ImageOff } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../@types/product';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem) as any;
    const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

    const getProductImage = (url: string) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        setQuantity(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            className="flex flex-col group"
        >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-stone-50 mb-6 border border-stone-100/50 shadow-sm">
                {product.image_url ? (
                    <img
                        src={getProductImage(product.image_url)!}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                        <ImageOff size={40} />
                    </div>
                )}

                <div className="absolute bottom-6 left-6 flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-white/50 z-20">
                    <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="p-2 text-stone-400 hover:text-pink-500 transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-stone-700 text-xs">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="p-2 text-stone-400 hover:text-pink-500 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="hidden md:flex absolute bottom-6 right-6 p-4 bg-stone-900 text-white rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-pink-500"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>

            <div className="px-2">
                <h4 className="text-xl font-serif italic text-stone-800 mb-1">{product.name}</h4>
                <p className="text-stone-400 text-[11px] mb-4 line-clamp-2 leading-relaxed h-8">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-stone-900 font-sans tracking-tight">
                        R$ {Number(product.price).toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        className="md:hidden flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-[9px] font-bold tracking-widest active:scale-95 transition-transform"
                    >
                        COMPRAR <ShoppingCart size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};