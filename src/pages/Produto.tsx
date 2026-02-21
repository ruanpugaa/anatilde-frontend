import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2, Minus, Plus, Heart, ShieldCheck, Leaf, Clock, MapPin, Sparkles, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

import api from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../@types/product';
import { useWishlist } from '../hooks/useWishlist';

export const Produto = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const addItem = useCartStore((state: any) => state.addItem);
    const { isFavorite, toggleFavorite } = useWishlist(id || '');
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    
    const mainBuyButtonRef = useRef<HTMLButtonElement>(null);
    const [showStickyBar, setShowStickyBar] = useState(false);

    // STAFF: Sincronização reativa com eventos globais
    const [, setTick] = useState(0);
    useEffect(() => {
        const handleSync = () => setTick(t => t + 1);
        window.addEventListener('wishlist-updated', handleSync);
        return () => window.removeEventListener('wishlist-updated', handleSync);
    }, []);

    const resolveImageUrl = useCallback((path: string | null) => {
        if (!path) return null;
        const baseUrl = 'https://anatilde.com.br/uploads/produtos/';
        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('api/uploads/', '')
            .replace('uploads/products/', '')
            .replace('uploads/produtos/', '')
            .replace(/products\//g, '')
            .replace(/^\/+/, '');
            
        return `${baseUrl}${cleanPath}`;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (mainBuyButtonRef.current && window.innerWidth < 1024) {
                const rect = mainBuyButtonRef.current.getBoundingClientRect();
                setShowStickyBar(rect.bottom < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get('/modules/products/admin_list.php');
                const found = res.data.find((p: Product) => String(p.id) === String(id));
                if (found) setProduct(found);
                else navigate('/delicias');
            } catch (err) {
                toast.error("Erro ao carregar detalhes.");
            } finally { setLoading(false); }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!product) return;
        const sanitized = { ...product, id: Number(product.id), price: Number(product.price) };
        for (let i = 0; i < quantity; i++) { addItem(sanitized as any); }
        toast.success(`${product.name} adicionado!`);
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-500" size={32} />
        </div>
    );
    
    // STAFF: Type guard crucial para evitar o erro de 'null' no restante do código
    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-32 pt-24 md:pt-36">
            <main className="max-w-6xl mx-auto px-6 md:px-8">
                
                <div className="flex items-center gap-4 mb-6 md:mb-10 opacity-60">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                        <ArrowLeft size={12} /> Voltar
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="aspect-square bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm relative"
                    >
                        {resolveImageUrl(product.image_url) ? (
                             <img src={resolveImageUrl(product.image_url)!} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-100">
                                <ImageOff size={48} />
                            </div>
                        )}
                    </motion.div>

                    <div className="space-y-6 md:space-y-8">
                        <header className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                                <ShieldCheck size={12} className="text-pink-300" /> Boutique Confeitaria
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif text-stone-800 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-light text-pink-600 font-sans tracking-tight">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                            </p>
                        </header>

                        <p className="text-stone-500 leading-relaxed font-light text-base md:text-lg">
                            {product.description || "Uma experiência sensorial equilibrada da Ana Tilde."}
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-white">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-stone-400 hover:text-pink-500 transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-stone-800">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-stone-400 hover:text-pink-500 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={toggleFavorite}
                                    className={`p-4 border border-stone-200 rounded-xl transition-all duration-300 ${
                                        isFavorite ? 'bg-pink-50 border-pink-100 text-pink-500' : 'text-stone-300 hover:text-pink-400'
                                    }`}
                                >
                                    <Heart 
                                        size={20} 
                                        strokeWidth={1.5} 
                                        fill={isFavorite ? "currentColor" : "none"}
                                        className={isFavorite ? "scale-110" : ""}
                                    />
                                </button>
                            </div>

                            <button 
                                ref={mainBuyButtonRef}
                                onClick={handleAddToCart}
                                className="w-full bg-stone-900 text-white py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                            >
                                <ShoppingBag size={16} /> Adicionar à Sacola
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 pt-10 border-t border-stone-100 mt-10">
                            {[
                                { icon: <Leaf size={18}/>, title: 'Ingredientes', desc: 'Matéria-prima premium e zero conservantes.' },
                                { icon: <Clock size={18}/>, title: 'Validade', desc: 'Consumo ideal em até 7 dias.' },
                                { icon: <MapPin size={18}/>, title: 'Entrega', desc: 'Disponível para Bauru e região.' },
                                { icon: <Sparkles size={18}/>, title: 'Artesanal', desc: 'Finalizado à mão com afeto.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">{item.icon}</div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-800 mb-1">{item.title}</h4>
                                        <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showStickyBar && (
                    <motion.div 
                        initial={{ y: 100 }} 
                        animate={{ y: 0 }} 
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-100 p-4 z-[40] lg:hidden flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
                    >
                        <div className="flex flex-col">
                            <span className="text-[9px] text-stone-400 uppercase font-black tracking-[0.2em]">Total</span>
                            <span className="text-lg font-bold text-stone-900 font-sans leading-none">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price) * quantity)}
                            </span>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            <ShoppingBag size={15} /> 
                            Comprar
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};