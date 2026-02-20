import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { bannerService } from '../../services/bannerService';
import { Banner } from '../../@types/banner';
import { Link } from 'react-router-dom';

// Estilos Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export const HeroSlider = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const data = await bannerService.getAll();
                // Filtramos os banners ativos. No PHP/MySQL is_active pode vir como string "1" ou number 1
                const activeBanners = data.filter(b => Number(b.is_active) === 1);
                setBanners(activeBanners);
            } catch (error) {
                console.error("Erro ao carregar banners do Hero:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBanners();
    }, []);

    if (loading) {
        return (
            <div className="h-[90vh] w-full bg-stone-100 animate-pulse flex items-center justify-center">
                <span className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Carregando Vitrine...
                </span>
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <section className="h-[90vh] w-full relative overflow-hidden hero-swiper-custom">
            <Swiper 
                modules={[Autoplay, EffectFade, Pagination]} 
                effect="fade" 
                autoplay={{ delay: 6000, disableOnInteraction: false }} 
                pagination={{ 
                    clickable: true,
                    dynamicBullets: true 
                }} 
                className="h-full w-full"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative">
                        {/* Overlay para contraste de texto */}
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        
                        <img 
                            src={slide.image_url} 
                            className="w-full h-full object-cover" 
                            alt={slide.title} 
                        />
                        
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 40 }} 
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-6xl md:text-8xl font-serif italic mb-6"
                            >
                                {slide.title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }} 
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold mb-10 max-w-xl leading-relaxed"
                            >
                                {slide.subtitle}
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link 
                                    to={slide.button_link} 
                                    className="bg-white text-black px-12 py-4 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-pink-500 hover:text-white transition-all shadow-2xl inline-block"
                                >
                                    Ver Mais
                                </Link>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Injeção de CSS compatível com TypeScript/Vite */}
            <style dangerouslySetInnerHTML={{ __html: `
                .hero-swiper-custom .swiper-pagination-bullet-active {
                    background: #ec4899 !important;
                }
                .hero-swiper-custom .swiper-pagination-bullet {
                    background: #fff;
                    opacity: 0.6;
                }
                .hero-swiper-custom .swiper-pagination-dynamic {
                    bottom: 40px !important;
                }
                .hero-swiper-custom .swiper-effect-fade .swiper-slide {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}} />
        </section>
    );
};