import { motion, HTMLMotionProps, Transition } from 'framer-motion';
import { MessageCircle, Mail, Instagram, Send, MapPin } from 'lucide-react';

export const Contato = () => {
    // Definindo a transição como uma tupla fixa para satisfazer o compilador
    const transitionConfig: Transition = { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
    };

    // Tipando o objeto de animação com as props do motion.div
    const animaSutil: HTMLMotionProps<"div"> = {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: transitionConfig
    };

    return (
        <div className="bg-[#FFFCFB] min-h-screen font-sans selection:bg-pink-100 pb-24">
            
            {/* HERO SECTION */}
            <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
                <motion.div {...animaSutil}>
                    <span className="text-pink-400 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Contato</span>
                    <h1 className="text-4xl md:text-6xl font-light text-slate-800 tracking-tight mb-8 leading-none">
                        Atendimento <span className="font-serif italic text-pink-500 text-5xl md:text-7xl">Exclusivo</span>
                    </h1>
                    <div className="h-px w-12 bg-pink-100 mx-auto mb-8"></div>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto font-normal leading-relaxed">
                        Seja para uma encomenda personalizada ou uma parceria corporativa, nossa equipe está pronta para lhe atender com a mesma dedicação que colocamos em nossas receitas.
                    </p>
                </motion.div>
            </section>

            <section className="px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* INFO COLUMN */}
                    <motion.div 
                        {...animaSutil}
                        className="lg:col-span-5 space-y-12"
                    >
                        <div className="space-y-8">
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Canais Diretos</h3>
                            
                            <div className="space-y-6">
                                <a href="#" className="group flex items-center gap-6 p-2">
                                    <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                                        <MessageCircle size={22} strokeWidth={1.2} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">WhatsApp</p>
                                        <p className="text-slate-700 font-medium text-lg tracking-tight">(14) 99187-1448</p>
                                    </div>
                                </a>

                                <a href="#" className="group flex items-center gap-6 p-2">
                                    <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                                        <Mail size={22} strokeWidth={1.2} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">E-mail</p>
                                        <p className="text-slate-700 font-medium text-lg tracking-tight">contato@anatilde.com.br</p>
                                    </div>
                                </a>

                                <a href="#" className="group flex items-center gap-6 p-2">
                                    <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                                        <Instagram size={22} strokeWidth={1.2} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">Instagram</p>
                                        <p className="text-slate-700 font-medium text-lg tracking-tight">@anaildedelicias</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-pink-50 space-y-4">
                            <div className="flex items-start gap-4 text-slate-400">
                                <MapPin size={18} strokeWidth={1.5} className="mt-1" />
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Ateliê Bauru</p>
                                    <p className="text-xs leading-relaxed">Disponível para retiradas agendadas e degustações sob consulta.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM COLUMN */}
                    <motion.div 
                        {...animaSutil}
                        className="lg:col-span-7"
                    >
                        <form className="space-y-8 bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-pink-50/50 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Nome</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-slate-200"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Contato</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-slate-200"
                                        placeholder="E-mail ou WhatsApp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Natureza da Mensagem</label>
                                <select className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-600 appearance-none cursor-pointer">
                                    <option>Encomenda Especial</option>
                                    <option>Eventos Corporativos</option>
                                    <option>Dúvidas Técnicas</option>
                                    <option>Outros Assuntos</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Sua Mensagem</label>
                                <textarea 
                                    rows={4}
                                    className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-slate-200 resize-none"
                                    placeholder="Como podemos ajudar?"
                                />
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="button"
                                    className="group relative flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-lg font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-pink-500 transition-all duration-500 shadow-xl shadow-slate-100"
                                >
                                    Enviar Solicitação
                                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};