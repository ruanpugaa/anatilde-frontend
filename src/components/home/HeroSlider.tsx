import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Estilos Swiper (Importados aqui para isolar a dependência)
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface SlideItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
}

const SLIDES: SlideItem[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=2000",
        title: "Anatilde",
        subtitle: "Artesanal & Inesquecível",
        buttonText: "Explorar Menu",
        buttonLink: "/delicias"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?q=80&w=2000", // Imagem diferente para o exemplo
        title: "Anatilde",
        subtitle: "Momentos Doces",
        buttonText: "Ver Favoritos",
        buttonLink: "/delicias"
    }
];

export const HeroSlider = () => {
    return (
        <section className="h-[90vh] w-full relative">
            <Swiper 
                modules={[Autoplay, EffectFade, Pagination]} 
                effect="fade" 
                autoplay={{ delay: 5000, disableOnInteraction: false }} 
                pagination={{ clickable: true }} 
                className="h-full w-full"
            >
                {SLIDES.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative">
                        <img 
                            src={slide.image} 
                            className="w-full h-full object-cover" 
                            alt={slide.title} 
                        />
                        <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white text-center px-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }} 
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-6xl md:text-8xl font-serif italic mb-6"
                            >
                                {slide.title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }} 
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-[10px] uppercase tracking-[0.6em] font-bold mb-8"
                            >
                                {slide.subtitle}
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <a 
                                    href={slide.buttonLink} 
                                    className="bg-white text-black px-12 py-4 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-pink-500 hover:text-white transition-all shadow-2xl"
                                >
                                    {slide.buttonText}
                                </a>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};