import React from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
    { name: "Callebaut", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Callebaut_logo.svg" },
    { name: "Nutella", logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Nutella-logo.svg" },
    { name: "Ferrero Rocher", logo: "https://upload.wikimedia.org/wikipedia/pt/e/ee/Ferrero_Rocher_logo.png" },
    { name: "Nestlé", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Nestl%C3%A9_logo.svg" },
    { name: "Kinder", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Kinder_logo.svg" },
    { name: "Ovomaltine", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Ovomaltine_logo.svg" },
    { name: "Sicao", logo: "https://vignette.wikia.nocookie.net/logopedia/images/4/41/Sicao_logo.png" }, // Alternativa
    { name: "Hershey's", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Hershey_logo.svg" } // Placeholder para teste
];

export const BrandMarquee = () => {
    // Triplicamos para garantir que telas UltraWide não vejam o fim da linha
    const marqueeBrands = [...BRANDS, ...BRANDS, ...BRANDS];

    return (
        <div className="py-16 bg-white border-y border-stone-100 overflow-hidden select-none relative w-full">
            <motion.div 
                className="flex w-max items-center"
                animate={{
                    x: ["0%", "-33.33%"] 
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                    },
                }}
            >
                {marqueeBrands.map((brand, i) => (
                    <div 
                        key={`${brand.name}-${i}`} 
                        className="flex items-center justify-center mx-10 md:mx-16 shrink-0 min-w-[120px]"
                    >
                        <img 
                            src={brand.logo} 
                            alt={brand.name}
                            className="h-8 md:h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain"
                            onLoad={() => console.log(`Loaded: ${brand.name}`)}
                            onError={(e) => {
                                console.error(`Error loading: ${brand.name}`);
                                // Fallback para texto se a imagem falhar
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-stone-300 font-bold uppercase tracking-widest text-[10px]">${brand.name}</span>`;
                            }}
                        />
                    </div>
                ))}
            </motion.div>
            
            {/* Máscaras de Gradiente para profundidade */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
        </div>
    );
};