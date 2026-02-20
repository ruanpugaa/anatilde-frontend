import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ cat }: { cat: any }) => (
    <div className="relative w-full h-full rounded-2xl overflow-hidden group border border-white/10 bg-stone-900 shadow-2xl">
        {/* Camada de Imagem */}
        <div className="absolute inset-0 z-0">
            <img 
                src={cat.image_url} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                alt={cat.name} 
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-90" />
        </div>

        {/* Conteúdo Info */}
        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end items-start">
            <div className="mb-3">
                <h4 className="text-2xl md:text-3xl font-serif text-white/90 leading-tight">
                    {cat.name}
                </h4>
            </div>

            {/* Link para a página de Delícias com filtro de categoria */}
            <a 
                href={`/delicias/${cat.slug || cat.id}`}
                className="relative flex items-center gap-2 text-white/50 group-hover:text-pink-500 transition-colors duration-500"
            >
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                    Conheça
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-500" />
                
                {/* Underline minimalista */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pink-500 transition-all duration-500 group-hover:w-full" />
            </a>
        </div>

        {/* Efeito de brilho sutil no hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] pointer-events-none" />
    </div>
);