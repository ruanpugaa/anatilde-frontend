import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../@types/product';

const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

export const EasterProductStage = memo(({ product, onAddToCart }: { 
    product: Product | null, 
    onAddToCart: (p: Product) => void 
}) => {
    if (!product) return null;

    const imageUrl = product.image_url.startsWith('http') 
        ? product.image_url 
        : `${UPLOADS_URL}${product.image_url}`;

    return (
        <section className="relative flex-1 w-full flex items-center justify-start px-8 md:px-24 overflow-hidden pt-12 md:pt-20 min-h-[70vh]">
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full relative"
                    >
                        <img src={imageUrl} className="w-full h-full object-cover object-center" alt={product.name} />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-20 w-full max-w-lg md:max-w-xl py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <Star size={10} className="text-pink-500 fill-pink-500" />
                            <span className="text-pink-500 font-bold tracking-[0.5em] text-[9px] uppercase">Haute Chocolaterie</span>
                        </div>
                        <h3 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-[0.9] text-white">
                            {product.name}
                        </h3>
                        <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-light max-w-sm">
                            {product.description}
                        </p>
                        <div className="flex flex-col items-start gap-5 pt-2">
                            <p className="text-2xl md:text-3xl font-thin tracking-tighter text-white italic">
                                R$ {Number(product.price).toFixed(2)}
                            </p>
                            <button 
                                onClick={() => onAddToCart(product)}
                                className="group bg-white text-black px-10 py-3.5 rounded-full font-bold text-[9px] uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all flex items-center gap-3 cursor-pointer shadow-2xl"
                            >
                                Adicionar ao Carrinho <ShoppingCart size={14} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
});