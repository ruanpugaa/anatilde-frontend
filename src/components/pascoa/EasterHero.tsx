import { motion } from 'framer-motion';
import { ChevronDown, Cookie, IceCream } from 'lucide-react';

interface EasterHeroProps {
    onScrollRequest: () => void;
}

export const EasterHero = ({ onScrollRequest }: EasterHeroProps) => {
    return (
        <section className="relative bg-[#FDFCFB] min-h-[75vh] flex flex-col items-center justify-center overflow-hidden py-32 pb-16">
            {/* Elementos flutuantes de fundo */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-pink-900"
                        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
                        style={{ 
                            top: `${Math.random() * 80}%`, 
                            left: `${Math.random() * 90}%` 
                        }}
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
                    onClick={onScrollRequest}
                    whileHover={{ y: 5 }}
                    className="flex flex-col items-center gap-4 mx-auto group outline-none cursor-pointer"
                >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold group-hover:text-pink-500 transition-colors">
                        Em breve
                    </span>
                    <div className="p-4 rounded-full border border-stone-100 group-hover:border-pink-200 transition-all bg-white shadow-sm">
                        <ChevronDown 
                            className="text-stone-300 group-hover:text-pink-500 animate-bounce" 
                            size={20} 
                            strokeWidth={1} 
                        />
                    </div>
                </motion.button>
            </div>
        </section>
    );
};