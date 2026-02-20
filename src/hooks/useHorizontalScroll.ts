import { useRef, useState, useLayoutEffect } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

// ... (mantenha os imports)

export const useHorizontalScroll = (dependency: any) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        // "start start": O progresso só sai de 0 quando o topo do TARGET encosta no topo da VIEW
        // "end end": O progresso chega a 1 quando o fundo do TARGET encosta no fundo da VIEW
        offset: ["start start", "end end"]
    });

    useLayoutEffect(() => {
        const updateRange = () => {
            if (contentRef.current) {
                const contentWidth = contentRef.current.scrollWidth;
                const windowWidth = window.innerWidth;
                // Staff note: recalculando o range para garantir que o 
                // primeiro card (incluindo o espaçador) comece no ponto zero.
                setScrollRange(contentWidth - windowWidth);
            }
        };

        const resizeObserver = new ResizeObserver(updateRange);
        if (contentRef.current) resizeObserver.observe(contentRef.current);
        updateRange();

        return () => resizeObserver.disconnect();
    }, [dependency]);

    // Usamos um useTransform com um "dead zone" inicial se necessário, 
    // mas o "start start" já deve resolver. 
    const transformX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
    
    // Ajuste no Spring: mass 0.1 e restDelta baixo garantem que ele não "clique" para frente no início
    const x = useSpring(transformX, { 
        stiffness: 100, 
        damping: 30, 
        restDelta: 0.001,
        mass: 0.1 
    });

    return { targetRef, contentRef, x };
};