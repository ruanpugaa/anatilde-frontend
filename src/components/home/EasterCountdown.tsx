import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const Digit = memo(({ value, label, primary = false }: { value: number, label: string, primary?: boolean }) => {
    return (
        <div className="flex flex-col items-center">
            <div className={`relative w-16 h-20 md:w-24 md:h-28 flex items-center justify-center rounded-sm overflow-hidden
                ${primary ? 'bg-[#3D2622]' : 'bg-white border border-stone-200'}`}>
                
                <div className="absolute w-full h-[1px] bg-stone-500/10 top-1/2 z-10" />
                
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                        className={`text-4xl md:text-6xl font-extralight tracking-tighter tabular-nums
                            ${primary ? 'text-[#D4AF37]' : 'text-stone-800'}`}
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mt-4">
                {label}
            </span>
        </div>
    );
});

Digit.displayName = 'Digit';

export const EasterCountdown = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const bgElementsRef = useRef<HTMLDivElement>(null);
    
    const targetDate = new Date('2026-04-05T00:00:00').getTime();
    const [timer, setTimer] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const update = () => {
            const diff = targetDate - new Date().getTime();
            if (diff > 0) {
                setTimer({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        };

        const interval = setInterval(update, 1000);
        update();

        // GSAP: Animação de Entrada e Flutuação dos Elementos
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }
            );

            // Flutuação independente para cada ícone decorativo
            const icons = bgElementsRef.current?.querySelectorAll('.floating-icon');
            icons?.forEach((icon, i) => {
                gsap.to(icon, {
                    y: "random(-20, 20)",
                    x: "random(-10, 10)",
                    rotation: "random(-15, 15)",
                    duration: `random(3, 5)`,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.2
                });
            });
        });

        return () => {
            clearInterval(interval);
            ctx.revert();
        };
    }, [targetDate]);

    return (
        <section ref={containerRef} className="w-full bg-white py-20 relative border-y border-stone-100 overflow-hidden">
            
            {/* BACKGROUND DECORATIVO SUTIL */}
            <div ref={bgElementsRef} className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.04]">
                {/* Coelho Minimalista */}
                <div className="floating-icon absolute top-10 left-[10%] text-stone-900">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 22c0 0 5 0 7-4c2-4 1-9-1-11c-2-2-4-1-5 1c0 0 0-6-3-6s-3 6-3 6c-1-2-3-3-5-1c-2 2-3 7-1 11c2 4 7 4 7 4z"/>
                    </svg>
                </div>
                {/* Ovo Geométrico 1 */}
                <div className="floating-icon absolute bottom-10 left-[25%] text-stone-900">
                    <svg width="60" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <ellipse cx="12" cy="13" rx="7" ry="10" />
                    </svg>
                </div>
                {/* Barra de Chocolate */}
                <div className="floating-icon absolute top-20 right-[15%] text-stone-900">
                    <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="4" y="3" width="16" height="18" rx="2" />
                        <path d="M4 9h16M4 15h16M10 3v18" />
                    </svg>
                </div>
                {/* Ovo Geométrico 2 */}
                <div className="floating-icon absolute bottom-20 right-[5%] text-stone-900">
                    <svg width="90" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <ellipse cx="12" cy="13" rx="7" ry="10" />
                        <path d="M7 10c2 1 4-1 6 0c2 1 4-1 4-1" />
                    </svg>
                </div>
            </div>

            <div className="px-[5vw] md:px-[10vw]  mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    
                    {/* Título com Serif Classica */}
                    <div className="max-w-sm text-center lg:text-left">
                        <h2 className="text-5xl md:text-6xl font-serif text-stone-900 leading-[0.9]">
                            Páscoa 2026<br />
                            <span className="text-2xl md:text-3xl font-light italic text-stone-400 tracking-tight">Contagem Regressiva</span>
                        </h2>
                        <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
                            <div className="h-[1px] w-12 bg-stone-200" />
                            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Reserva Exclusiva</span>
                        </div>
                    </div>

                    {/* Display do Contador */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Digit value={timer.d} label="Dias" />
                        <Digit value={timer.h} label="Horas" primary />
                        <Digit value={timer.m} label="Minutos" />
                        <Digit value={timer.s} label="Segundos" />
                    </div>

                    {/* Ação Minimalista */}
                    <motion.button
                        whileHover={{ y: -5 }}
                        onClick={() => navigate('/pascoa')}
                        className="group flex flex-col items-center lg:items-end cursor-pointer"
                    >
                        <div className="w-20 h-20 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:border-stone-900 transition-all duration-500 shadow-sm">
                            <ArrowRight className="text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all" size={32} strokeWidth={1} />
                        </div>
                        <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">
                            Conheça nossa linha para Páscoa
                        </span>
                    </motion.button>

                </div>
            </div>
        </section>
    );
};