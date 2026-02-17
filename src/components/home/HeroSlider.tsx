import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SLIDES = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1920",
        title: "Festival de Brigadeiros",
        subtitle: "Os clássicos com um toque gourmet.",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1920",
        title: "Especial de Páscoa",
        subtitle: "Garanta seu ovo artesanal agora.",
    },
];

export const HeroSlider = () => {
    return (
        <section className="w-full h-[70vh] md:h-[85vh] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                className="h-full w-full"
            >
                {SLIDES.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-10 md:px-20 text-white">
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    className="text-5xl md:text-7xl font-bold max-w-2xl"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl md:text-2xl mt-4 opacity-90"
                                >
                                    {slide.subtitle}
                                </motion.p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
