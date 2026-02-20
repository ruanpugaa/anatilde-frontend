
import { motion, Variants } from 'framer-motion';
import { Gift, Briefcase, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Newsletter } from '../components/common/Newsletter';

// Tipagem para as variantes de animação
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export const QuemSomos = () => {
    return (
        <div className="bg-[#FFFCFB] min-h-screen font-sans selection:bg-pink-100">
            
            {/* HERO SECTION - Storytelling */}
            <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.span variants={itemVariants} className="inline-block py-1 px-3 bg-pink-50 text-pink-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        Nossa Doce Jornada
                    </motion.span>
                    
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-light text-slate-800 tracking-tight mb-8 leading-[1.1]">
                        Feito à mão, com <span className="font-serif italic text-pink-500">precisão</span> e muito afeto.
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
                        A Anailde Delícias nasceu do desejo de transformar ingredientes nobres em experiências que abraçam a alma.
                    </motion.p>
                </motion.div>
            </section>

            {/* SEÇÃO DE SERVIÇOS - Adaptativa & Clean */}
            <section className="px-4 md:px-8 pb-32 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    
                    {/* CARD: PRESENTES */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                        className="group relative bg-white rounded-[3rem] p-8 md:p-12 overflow-hidden border border-pink-50 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500"
                    >
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-14 h-14 bg-[#FFF5F7] text-pink-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Gift size={28} strokeWidth={1.5} />
                            </div>
                            
                            <h2 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">Presentes que Encantam</h2>
                            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
                                Curadoria exclusiva de caixas e mimos artesanais. Perfeito para aniversários, datas especiais ou apenas para dizer "lembrei de você".
                            </p>
                            
                            <div className="mt-auto">
                                <button className="inline-flex items-center gap-2 text-pink-500 font-bold text-sm tracking-wider uppercase group/btn">
                                    Ver opções de presentes
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Elemento Decorativo de Fundo */}
                        <div className="absolute -right-12 -bottom-12 text-pink-50/50 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Sparkles size={240} strokeWidth={1} />
                        </div>
                    </motion.div>

                    {/* CARD: B2B / CORPORATIVO */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                        className="group relative bg-white rounded-[3rem] p-8 md:p-12 overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Briefcase size={28} strokeWidth={1.5} />
                            </div>
                            
                            <h2 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">Soluções Corporativas</h2>
                            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
                                Elevamos o padrão dos seus eventos e mimos corporativos com produtos que refletem a excelência da sua marca.
                            </p>
                            
                            <div className="mt-auto">
                                <button className="inline-flex items-center gap-2 text-slate-800 font-bold text-sm tracking-wider uppercase group/btn">
                                    Solicitar orçamento B2B
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Elemento Decorativo de Fundo */}
                        <div className="absolute -right-12 -bottom-12 text-slate-50 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Heart size={240} strokeWidth={1} />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* SEÇÃO GALERIA SUTIL */}
            <section className="bg-white py-24 border-t border-pink-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">Nosso Ateliê</h3>
                            <p className="text-slate-400 text-sm">Um olhar por dentro de onde a mágica acontece todos os dias.</p>
                        </div>
                        <Link to="/delicias" className="text-pink-500 font-bold text-xs uppercase tracking-widest border-b border-pink-100 pb-1 hover:border-pink-500 transition-all">
                            Explorar catálogo completo
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50">
                                <img 
                                    src={`https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 grayscale-[0.5] hover:grayscale-0"
                                    alt="Ateliê"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />

            
        </div>
    );
};