import { memo } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
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

    // Tipagem explícita para evitar o erro de 'number[]'
    const transitionConfig: Transition = { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] 
    };

    return (
        <section className="relative w-full h-[80vh] md:h-[70vh] flex flex-col md:flex-row bg-[#FDFBF7] overflow-hidden border-b border-stone-100">
            
            {/* Background Decorativo - Staff Touch */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ y: [0, -10, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-10 text-[#D4AF37] text-4xl font-serif"
                >✦</motion.div>
            </div>

            {/* METADE 1: IMAGEM (LEFT) */}
            <div className="relative w-full md:w-1/2 h-[45%] md:h-full overflow-hidden bg-stone-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={product.id}
                        src={imageUrl}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={transitionConfig}
                        className="w-full h-full object-cover"
                        alt={product.name}
                    />
                </AnimatePresence>
            </div>

            {/* METADE 2: CONTEÚDO (RIGHT) */}
            <div className="relative w-full md:w-1/2 h-[55%] md:h-full flex items-center justify-center p-6 md:p-16 z-10 bg-[#FDFBF7]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={transitionConfig}
                        className="max-w-xs w-full text-center md:text-left"
                    >
                        <span className="text-[9px] uppercase tracking-[0.4em] text-[#B8860B] font-bold mb-3 block">Premium Selection</span>
                        
                        <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 leading-tight mb-4">
                            {product.name}
                        </h2>

                        <p className="text-stone-400 text-[11px] md:text-xs leading-relaxed mb-8 font-light italic">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between md:justify-start gap-10 pt-6 border-t border-stone-100">
                            <div className="flex flex-col text-left">
                                <span className="text-[8px] uppercase text-stone-300 font-bold tracking-widest">Valor</span>
                                <p className="text-xl font-light text-slate-800 tracking-tighter">
                                    R$ {Number(product.price).toFixed(2)}
                                </p>
                            </div>

                            <button 
                                onClick={() => onAddToCart(product)}
                                className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all shadow-lg active:scale-95 flex items-center gap-3"
                            >
                                Adicionar <ShoppingCart size={12} className="text-[#D4AF37]" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
});