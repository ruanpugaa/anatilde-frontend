import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2, Minus, Plus, Heart, ShieldCheck, ImageOff, ChevronRight, Utensils } from 'lucide-react';
import { toast } from 'sonner';

import api from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../@types/product';
import { useWishlist } from '../hooks/useWishlist';

/**
 * STAFF ARCHITECTURE: Produto Component
 * - Resiliência no parse de metadados (extra_info)
 * - Renderização inteligente de Ingredientes (Parsing de quebra de linha)
 * - Sincronização de Breadcrumb via CustomEvents
 */
export const Produto = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const addItem = useCartStore((state: any) => state.addItem);
    const { isFavorite, toggleFavorite } = useWishlist(id || '');
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const mainBuyButtonRef = useRef<HTMLButtonElement>(null);

    // STAFF: Processamento dos ingredientes (converte quebras de linha em Array)
    const ingredientsList = useMemo(() => {
        if (!product?.ingredients) return [];
        return product.ingredients
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }, [product?.ingredients]);

    // STAFF: Processamento seguro de campos dinâmicos vindo do JSON do banco
    const extraFields = useMemo(() => {
        if (!product?.extra_info) return [];
        try {
            const parsed = typeof product.extra_info === 'string' 
                ? JSON.parse(product.extra_info) 
                : product.extra_info;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Staff Debug: Falha no parse do extra_info", e);
            return [];
        }
    }, [product]);

    const resolveImageUrl = useCallback((path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `https://anatilde.com.br/uploads/produtos/${path}`;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (mainBuyButtonRef.current && window.innerWidth < 1024) {
                const rect = mainBuyButtonRef.current.getBoundingClientRect();
                setShowStickyBar(rect.bottom < 0);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        const loadInitialData = async () => {
            try {
                const res = await api.get(`/modules/products/public_list.php?t=${Date.now()}`);
                const found = res.data.find((p: any) => String(p.id) === String(id));
                
                if (found && isMounted) {
                    setProduct(found);
                    window.dispatchEvent(new CustomEvent('product-loaded', { 
                        detail: { 
                            name: found.name, 
                            categoryName: found.category_name || 'Delícias',
                            categorySlug: found.category_slug || 'delicias'
                        } 
                    }));
                } else if (isMounted) {
                    navigate('/delicias');
                }
            } catch (err) {
                toast.error("Não foi possível carregar os detalhes do produto.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadInitialData();
        return () => { isMounted = false; };
    }, [id, navigate]);

    const handleAddToCart = useCallback(() => {
        if (!product) return;
        const priceNumber = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        const sanitized = { ...product, id: Number(product.id), price: priceNumber };
        for (let i = 0; i < quantity; i++) { addItem(sanitized as any); }
        toast.success(`${product.name} adicionado à sacola!`);
    }, [product, quantity, addItem]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-500" size={32} />
        </div>
    );
    
    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-32">
            <main className="max-w-6xl mx-auto px-6 md:px-8 pt-6 md:pt-10">
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-pink-500 transition-colors group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Voltar
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    {/* Visualização do Produto */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm relative">
                        {resolveImageUrl(product.image_url) ? (
                            <img src={resolveImageUrl(product.image_url)!} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-100">
                                <ImageOff size={48} />
                            </div>
                        )}
                    </motion.div>

                    {/* Conteúdo Informativo */}
                    <div className="space-y-6 md:space-y-8">
                        <header className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                                <ShieldCheck size={12} className="text-pink-300" /> Boutique Confeitaria Artesanal
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight italic">{product.name}</h1>
                            <p className="text-2xl font-light text-pink-600 font-sans">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                            </p>
                        </header>

                        <p className="text-stone-500 leading-relaxed font-light text-base md:text-lg">
                            {product.description || "Uma experiência sensorial equilibrada e artesanal da Ana Tilde."}
                        </p>

                        {/* STAFF: SEÇÃO DE INGREDIENTES (RENDERIZAÇÃO EM LISTA) */}
                        {ingredientsList.length > 0 && (
                            <div className="space-y-4 py-6 border-t border-stone-100">
                                <div className="flex items-center gap-2 text-[10px] font-black text-stone-800 uppercase tracking-widest">
                                    <Utensils size={14} className="text-pink-400" />
                                    Composição & Ingredientes
                                </div>
                                <ul className="grid grid-cols-1 gap-y-2">
                                    {ingredientsList.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-stone-500 font-light">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-200 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Controles de Compra */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-white shadow-sm">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-stone-400 hover:text-pink-500 transition-colors"><Minus size={16} /></button>
                                    <span className="w-8 text-center text-sm font-bold text-stone-800">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-stone-400 hover:text-pink-500 transition-colors"><Plus size={16} /></button>
                                </div>
                                <button onClick={toggleFavorite} className={`p-4 border rounded-xl transition-all ${isFavorite ? 'bg-pink-50 border-pink-100 text-pink-500' : 'border-stone-200 text-stone-300'}`}>
                                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                                </button>
                            </div>
                            <button ref={mainBuyButtonRef} onClick={handleAddToCart} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                <ShoppingBag size={16} /> Adicionar à Sacola
                            </button>
                        </div>

                        {/* STAFF: Accordion UI de Metadados (Extra Fields) */}
                        {extraFields.length > 0 && (
                            <div className="py-6 space-y-3 border-t border-stone-100">
                                {extraFields.map((field: any, idx: number) => (
                                    <div key={idx} className="border border-stone-100 rounded-2xl overflow-hidden bg-white/50 shadow-sm hover:border-stone-200 transition-colors">
                                        <button onClick={() => setActiveTab(activeTab === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-800">{field.title || "Informações"}</span>
                                            <ChevronRight size={14} className={`transition-transform duration-300 ${activeTab === idx ? 'rotate-90 text-pink-400' : 'text-stone-300'}`} />
                                        </button>
                                        <AnimatePresence>
                                            {activeTab === idx && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="overflow-hidden px-4 pb-4">
                                                    <p className="text-sm text-stone-500 font-light leading-relaxed whitespace-pre-line border-t border-stone-50 pt-3">{field.content}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Sticky Bar Mobile */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-100 p-4 z-50 lg:hidden flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-stone-400 uppercase font-black tracking-widest">Total</span>
                            <span className="text-lg font-bold text-stone-900 leading-none">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price) * quantity)}
                            </span>
                        </div>
                        <button onClick={handleAddToCart} className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg">Comprar Agora</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};