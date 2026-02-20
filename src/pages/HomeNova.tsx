import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { ShoppingCart, ArrowRight, Star, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

// Estilos Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HeroSlider } from '../components/home/HeroSlider';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    active: number | string;
}

export const HomeNova = () => {
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const addItem = useCartStore((state) => state.addItem) as any;
    const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://anatilde.com.br/api/products.php');
                const data = Array.isArray(response.data) ? response.data : [];
                setBestSellers(data.filter(p => Number(p.active) === 1));
            } catch (err) {
                console.error("Erro ao carregar vitrine:", err);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: "Cones Trufados", img: "https://images.unsplash.com/photo-1589119634735-1210167948b5?q=80&w=800", path: "/delicias" },
        { name: "Barras de Chocolate", img: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800", path: "/delicias" },
        { name: "Cookies Artesanais", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800", path: "/delicias" },
        { name: "Palha Italiana", img: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?q=80&w=800", path: "/delicias" },
        { name: "Bolo de Pote", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800", path: "/delicias" },
        { name: "Doces para Festas", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800", path: "/delicias" },
    ];

    const getProductImage = (url: string) => url?.startsWith('http') ? url : `${UPLOADS_URL}${url}`;

    return (
        <div className="bg-[#FFFCFB] overflow-x-hidden">
            
            {/* 1. HERO BANNER SLIDER (LUMINOUS DESIGN) */}
            <HeroSlider />

            {/* 2. TEXT MARQUEE (HIGH IMPACT) */}
            <div className="py-12 bg-white border-y border-stone-100 overflow-hidden select-none">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <h2 key={i} className="text-[80px] md:text-[120px] font-serif italic font-light text-stone-100 uppercase flex items-center">
                            Escolha sua Felicidade <Star className="mx-10 text-pink-500 fill-pink-500 h-16 w-16" />
                        </h2>
                    ))}
                </div>
            </div>

            {/* 3. BEST SELLERS CAROUSEL */}
            <section className="py-24 px-6 md:px-20 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-pink-500 font-bold text-[10px] uppercase tracking-[0.4em]">Favoritos</span>
                        <h3 className="text-4xl md:text-5xl font-serif italic text-stone-800">Mais Vendidos</h3>
                    </div>
                    <div className="flex gap-4">
                        <button className="bs-prev p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-all"><ChevronLeft size={20} className="text-stone-400" /></button>
                        <button className="bs-next p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-all"><ChevronRight size={20} className="text-stone-400" /></button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1.2}
                    navigation={{ nextEl: '.bs-next', prevEl: '.bs-prev' }}
                    breakpoints={{ 768: { slidesPerView: 2.5 }, 1024: { slidesPerView: 4 } }}
                >
                    {bestSellers.map((product) => (
                        <SwiperSlide key={product.id}>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="group">
                                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 bg-stone-50 relative shadow-sm">
                                    <img src={getProductImage(product.image_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <button 
                                        onClick={() => addItem(product)}
                                        className="absolute bottom-6 right-6 p-4 bg-white rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                                    >
                                        <ShoppingCart size={20} className="text-pink-500" />
                                    </button>
                                </div>
                                <h4 className="text-lg font-serif italic text-stone-800">{product.name}</h4>
                                <p className="text-stone-400 text-xs mb-2 truncate">{product.description}</p>
                                <span className="font-bold text-stone-900">R$ {Number(product.price).toFixed(2)}</span>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* 4. MODERN CATEGORY GRID */}
            <section className="py-24 bg-stone-50 px-6 md:px-20">
                <div className="text-center mb-16">
                    <h3 className="text-4xl md:text-5xl font-serif italic text-stone-800">Categorias</h3>
                    <div className="h-px w-20 bg-pink-200 mx-auto mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {categories.map((cat, idx) => (
                        <motion.a 
                            key={idx}
                            href={cat.path}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative h-80 rounded-[3rem] overflow-hidden group ${idx === 0 || idx === 5 ? 'md:col-span-2' : ''}`}
                        >
                            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <h5 className="text-2xl font-serif italic mb-2">{cat.name}</h5>
                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                    Explorar <ArrowUpRight size={14} />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* CSS ANIMATIONS */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .swiper-pagination-bullet-active { background: #ec4899 !important; }
            `}} />
        </div>
    );
};