import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronRight, ChevronLeft, Star, ChevronDown, Cookie, IceCream, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useCartStore } from '../store/useCartStore';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    active: number | string;
    category_id?: number | string;
}

export const Pascoa = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    const addItem = useCartStore((state) => state.addItem) as any;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [selected, setSelected] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://anatilde.com.br/api/products.php');
                const data = Array.isArray(response.data) ? response.data : [];
                
                const filterPascoa = data.filter((p: Product) => 
                    Number(p.active) === 1 && 
                    Number(p.category_id) === 7
                );
                
                setProducts(filterPascoa);
                if (filterPascoa.length > 0) setSelected(filterPascoa[0]);

            } catch (err) {
                console.error("Erro na integração:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getProductImage = (url: string) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
    };

    const scrollToStage = () => {
        stageRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <Loader2 className="animate-spin text-pink-400 mb-4" size={48} />
            <p className="text-stone-400 font-serif italic tracking-wide">Sincronizando a Coleção de Páscoa...</p>
        </div>
    );

    if (error || products.length === 0) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB] p-10 text-center">
            <h2 className="text-stone-800 font-serif text-2xl italic">Coleção em breve</h2>
            <p className="text-stone-400 text-[10px] mt-2 uppercase tracking-[0.3em]">Estamos a preparar as novidades de Páscoa.</p>
        </div>
    );

    return (
        <div className="bg-[#080808] min-h-screen w-full font-sans text-white">
            
            {/* 1. SEÇÃO CLARA */}
            <section className="relative bg-[#FDFCFB] min-h-[75vh] flex flex-col items-center justify-center overflow-hidden py-32 pb-16">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-pink-900"
                            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
                            style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%` }}
                        >
                            {i % 2 === 0 ? <Cookie size={120} /> : <IceCream size={100} />}
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 text-center space-y-10 px-6">
                    <div className="space-y-4">
                        <motion.span 
                            initial={{ opacity: 0, letterSpacing: '0.2em' }}
                            whileInView={{ opacity: 1, letterSpacing: '0.6em' }}
                            transition={{ duration: 1 }}
                            className="text-pink-500 font-bold text-[10px] uppercase block"
                        >
                            Exclusividade Anatilde
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-serif italic text-stone-800 leading-tight">
                            Personalize sua <br />
                            <span className="text-pink-600 not-italic font-sans font-light tracking-tighter">Encomenda de Páscoa</span>
                        </h2>
                    </div>

                    <motion.button 
                        onClick={scrollToStage}
                        whileHover={{ y: 5 }}
                        className="flex flex-col items-center gap-4 mx-auto group outline-none"
                    >
                        <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold group-hover:text-pink-500 transition-colors">
                            Ver Sabores
                        </span>
                        <div className="p-4 rounded-full border border-stone-100 group-hover:border-pink-200 transition-all bg-white shadow-sm">
                            <ChevronDown className="text-stone-300 group-hover:text-pink-500 animate-bounce" size={20} strokeWidth={1} />
                        </div>
                    </motion.button>
                </div>
            </section>

            {/* 2. MAIN STAGE COM EFEITO LENTE */}
            <div ref={stageRef} className="flex flex-col min-h-screen relative">
                <section className="relative flex-1 w-full flex items-center justify-start px-8 md:px-24 overflow-hidden pt-12 md:pt-20">
                    <div className="absolute inset-0 z-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected?.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="w-full h-full relative"
                            >
                                <img 
                                    src={getProductImage(selected?.image_url || '')} 
                                    className="w-full h-full object-cover object-center" 
                                    alt={selected?.name} 
                                />
                                
                                {/* LENTE: Gradiente Denso da Esquerda (Preto) para a Direita (Transparente) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent z-10" />
                                
                                {/* Suavização Inferior para o Seletor */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Conteúdo sobre a lente */}
                    <div className="relative z-20 w-full max-w-lg md:max-w-xl py-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected?.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-2">
                                    <Star size={10} className="text-pink-500 fill-pink-500" />
                                    <span className="text-pink-500 font-bold tracking-[0.5em] text-[9px] uppercase">Haute Chocolaterie</span>
                                </div>
                                <h3 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                                    {selected?.name}
                                </h3>
                                <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-light max-w-sm drop-shadow-md">
                                    {selected?.description}
                                </p>
                                <div className="flex flex-col items-start gap-5 pt-2">
                                    <p className="text-2xl md:text-3xl font-thin tracking-tighter text-white">
                                        R$ {Number(selected?.price).toFixed(2)}
                                    </p>
                                    <button 
                                        onClick={() => addItem(selected)}
                                        className="group bg-white text-black px-10 py-3.5 rounded-full font-bold text-[9px] uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95"
                                    >
                                        Adicionar ao Carrinho <ShoppingCart size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* 3. SELETOR DOCK */}
                <footer className="relative z-40 bg-[#080808] border-t border-white/5 pt-6 pb-14">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h4 className="text-[8px] uppercase tracking-[0.4em] text-slate-600 font-bold italic font-serif">Nossos Sabores</h4>
                            <div className="flex gap-4">
                                <button className="nav-prev-v12 p-1 text-slate-700 hover:text-pink-500 transition-colors"><ChevronLeft size={16} /></button>
                                <button className="nav-next-v12 p-1 text-slate-700 hover:text-pink-500 transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={16}
                            slidesPerView={3.5}
                            navigation={{ nextEl: '.nav-next-v12', prevEl: '.nav-prev-v12' }}
                            pagination={{ clickable: true, el: '.custom-dots' }}
                            breakpoints={{ 1024: { slidesPerView: 6.2 } }}
                            className="pascoa-swiper-final"
                        >
                            {products.map((prod) => (
                                <SwiperSlide key={prod.id}>
                                    <div 
                                        onClick={() => setSelected(prod)}
                                        className={`relative cursor-pointer transition-all duration-300 ${
                                            selected?.id === prod.id ? 'opacity-100 scale-105' : 'opacity-20 grayscale hover:opacity-50'
                                        }`}
                                    >
                                        <div className={`aspect-video rounded-md overflow-hidden border transition-all duration-300 ${
                                            selected?.id === prod.id ? 'border-pink-500 shadow-lg shadow-pink-500/10' : 'border-white/5'
                                        }`}>
                                            <img src={getProductImage(prod.image_url)} className="w-full h-full object-cover" alt={prod.name} />
                                        </div>
                                        <p className={`mt-2 text-[7px] font-bold uppercase tracking-widest text-center truncate ${selected?.id === prod.id ? 'text-pink-500' : 'text-slate-700'}`}>
                                            {prod.name}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="custom-dots flex justify-center gap-2 mt-8" />
                    </div>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .pascoa-swiper-final { overflow: visible !important; }
                .custom-dots .swiper-pagination-bullet {
                    width: 6px; height: 2px; background: #333; border-radius: 0; opacity: 1; transition: all 0.3s ease; margin: 0 !important;
                }
                .custom-dots .swiper-pagination-bullet-active {
                    background: #ec4899; width: 20px;
                }
                @media (max-width: 768px) {
                    .pascoa-swiper-final .swiper-slide { width: 120px !important; }
                }
            `}} />
        </div>
    );
};