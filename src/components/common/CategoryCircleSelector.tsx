import { memo } from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../@types/category';

const UPLOADS_URL = 'https://api.anatilde.com.br/uploads/categorias/';

export const CategoryCircleSelector = memo(({ 
    categories, 
    selectedId, 
    onSelect 
}: { 
    categories: Category[], 
    selectedId: number | null, 
    onSelect: (id: number | null) => void 
}) => (
    <section className="w-full pt-12 pb-8 bg-transparent">
        {/* Header Anatilde Standard */}
        <div className="max-w-[1600px] mx-auto px-6 mb-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
            >
                <span className="text-[9px] uppercase tracking-[0.5em] text-pink-500 font-bold block">
                    Fine Selection
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-800 leading-tight">
                    Escolha por <span className="italic text-stone-400">Categoria</span>
                </h2>
                <div className="w-8 h-[1px] bg-stone-200 mx-auto mt-4" />
            </motion.div>
        </div>

        {/* Scroll Liquido de Categorias */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-6 md:justify-center gap-6 md:gap-10">
            
            {/* Botão "Tudo" */}
            <button 
                onClick={() => onSelect(null)}
                className="flex-shrink-0 flex flex-col items-center gap-3 snap-center group cursor-pointer outline-none"
            >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 border
                    ${selectedId === null 
                        ? 'border-pink-500 bg-pink-50/30 scale-105 shadow-sm' 
                        : 'border-stone-200 bg-transparent opacity-40 group-hover:opacity-100 group-hover:border-stone-300'}`}>
                    <span className={`text-[8px] font-bold uppercase tracking-[0.2em] transition-colors duration-500
                        ${selectedId === null ? 'text-pink-600' : 'text-stone-500'}`}>
                        Tudo
                    </span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500
                    ${selectedId === null ? 'opacity-100 text-pink-500' : 'opacity-0 -translate-y-1'}`}>
                    Geral
                </span>
            </button>

            {categories.map((cat) => {
                const idAsNumber = Number(cat.id);
                const isActive = selectedId === idAsNumber;
                const imageUrl = cat.image_url?.startsWith('http') 
                    ? cat.image_url 
                    : `${UPLOADS_URL}${cat.image_url}`;

                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(idAsNumber)}
                        className="flex-shrink-0 flex flex-col items-center gap-3 snap-center group cursor-pointer outline-none"
                    >
                        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-500 border p-1
                            ${isActive 
                                ? 'border-pink-500 scale-110 shadow-[0_10px_20px_rgba(236,72,153,0.1)]' 
                                : 'border-transparent opacity-60 group-hover:opacity-100'}`}>
                            
                            <div className="w-full h-full rounded-full overflow-hidden bg-stone-50">
                                <motion.img
                                    src={imageUrl}
                                    alt={cat.name}
                                    className={`w-full h-full object-cover transition-all duration-700
                                        ${isActive ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0'}`}
                                />
                            </div>
                        </div>
                        
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors
                            ${isActive ? 'text-pink-600' : 'text-stone-400 group-hover:text-stone-600'}`}>
                            {cat.name}
                        </span>
                    </button>
                );
            })}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
    </section>
));

CategoryCircleSelector.displayName = 'CategoryCircleSelector';