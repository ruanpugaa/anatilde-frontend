import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
    { name: "Cones", img: "https://images.unsplash.com/photo-1589119634735-1210167948b5?q=80&w=1200" },
    { name: "Chocolates", img: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1200" },
    { name: "Cookies", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200" },
    { name: "Palha Italiana", img: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?q=80&w=1200" },
    { name: "Bolo de Pote", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200" },
    { name: "Brownies", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200" },
    { name: "Doces para festas", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200" },
    { name: "Sobremesas", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200" },
];

export const CategoryScroll = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"] // Garante sincronia total com o container pai
    });

    useLayoutEffect(() => {
        const updateRange = () => {
            if (contentRef.current) {
                const contentWidth = contentRef.current.scrollWidth;
                const windowWidth = window.innerWidth;
                
                // Ajuste Staff: Subtraímos apenas 70% da tela para o scroll horizontal 
                // "terminar" quando o item ainda tem 30% de margem à direita.
                setScrollRange(contentWidth - (windowWidth * 0.7));
            }
        };

        updateRange();
        window.addEventListener('resize', updateRange);
        const timer = setTimeout(updateRange, 100);

        return () => {
            window.removeEventListener('resize', updateRange);
            clearTimeout(timer);
        };
    }, []);

    const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${scrollRange}px`]);

    return (
        <section ref={targetRef} className="relative h-[500vh] bg-stone-950">
            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
                
                {/* Título Mobile */}
                <div className="md:hidden absolute top-10 left-10 z-20">
                    <span className="text-pink-500 font-bold text-[10px] uppercase tracking-[0.5em] mb-2 block">Navegue</span>
                    <h3 className="text-5xl font-serif italic text-white leading-tight">Nossas Categorias</h3>
                </div>

                <motion.div 
                    ref={contentRef}
                    style={{ x }} 
                    className="flex gap-8 md:gap-12 items-center px-10 md:px-24 will-change-transform"
                >
                    {/* Título Desktop */}
                    <div className="hidden md:flex flex-col justify-center min-w-[500px] lg:min-w-[700px] shrink-0">
                        <span className="text-pink-500 font-bold text-[10px] uppercase tracking-[0.5em] mb-6">Navegue</span>
                        <h3 className="text-7xl md:text-9xl font-serif italic text-white leading-[0.85] tracking-tighter">
                            Nossas<br />
                            <span className="text-stone-700 not-italic font-sans font-light">Categorias</span>
                        </h3>
                    </div>

                    {/* Cards */}
                    {CATEGORIES.map((cat, i) => (
                        <div 
                            key={i} 
                            className="relative h-[60vh] w-[85vw] md:w-[500px] rounded-[3rem] overflow-hidden shrink-0 group border border-white/5 bg-stone-900"
                        >
                            <img 
                                src={cat.img} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                alt={cat.name} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-4xl font-serif italic text-white mb-6">{cat.name}</h4>
                                <a 
                                    href={`/delicias?category=${cat.name.toLowerCase()}`} 
                                    className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                                >
                                    Explorar <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                    
                    {/* Espaçador reduzido para o ajuste de 30% da direita */}
                    <div className="w-[5vw] shrink-0" />
                </motion.div>
            </div>
        </section>
    );
};