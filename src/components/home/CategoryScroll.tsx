import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { categoryService } from '../../services/categoryService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export const CategoryScroll = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService.getAll()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="h-[40vh] bg-stone-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={24} />
        </div>
    );

    return (
        <section className="relative bg-stone-950 py-20 w-full overflow-hidden">
            {/* Header Deluxe */}
            <div className="px-[5vw] md:px-[10vw] mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="text-[9px] uppercase tracking-[0.6em] text-pink-500 font-bold block mb-3">
                        Boutique Selection
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                        Explore <span className="italic text-stone-500">Categorias</span>
                    </h2>
                </motion.div>

                {/* Custom Navigation */}
                <div className="flex gap-3">
                    <button className="swiper-prev-cat w-11 h-11 rounded-full border border-stone-800 flex items-center justify-center text-stone-500 hover:text-white hover:border-pink-500 transition-all duration-500 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button className="swiper-next-cat w-11 h-11 rounded-full border border-stone-800 flex items-center justify-center text-white hover:border-pink-500 transition-all duration-500 group">
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="px-[5vw] md:px-[10vw]">
                <Swiper
                    modules={[Navigation, Autoplay, FreeMode]}
                    navigation={{
                        nextEl: '.swiper-next-cat',
                        prevEl: '.swiper-prev-cat',
                    }}
                    spaceBetween={24}
                    slidesPerView={1.3}
                    freeMode={true}
                    breakpoints={{
                        640: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 4 }, // 4 itens perfeitamente distribuídos
                    }}
                    className="overflow-visible"
                >
                    {categories.map((cat) => (
                        <SwiperSlide key={cat.id} className="pb-4">
                            {/* Forçamos o aspect ratio aqui para garantir a altura reduzida */}
                            <div className="aspect-[4/3] md:aspect-[3/4] w-full overflow-hidden rounded-lg">
                                <CategoryCard cat={cat} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/5 blur-[100px] rounded-full -z-10" />
        </section>
    );
};