import { useState } from 'react';
import { motion, HTMLMotionProps, Transition } from 'framer-motion';
import { MessageCircle, Mail, Instagram, Send, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Contato = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        subject: 'Encomenda Especial',
        message: ''
    });

    const transitionConfig: Transition = { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
    };

    const animaSutil: HTMLMotionProps<"div"> = {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: transitionConfig
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Promise para o Sonner gerenciar os estados visualmente
        const promise = async () => {
            const response = await fetch('https://anatilde.com.br/api/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Falha ao enviar');
            
            // Reset do form após sucesso
            setFormData({ name: '', contact: '', subject: 'Encomenda Especial', message: '' });
            return await response.json();
        };

        setIsSubmitting(true);

        toast.promise(promise(), {
            loading: 'Enviando sua mensagem...',
            success: (data) => {
                setIsSubmitting(false);
                return `Mensagem enviada com sucesso!`;
            },
            error: (err) => {
                setIsSubmitting(false);
                return 'Erro ao enviar. Tente pelo WhatsApp.';
            },
        });
    };

    return (
        <div className="bg-[#FFFCFB] min-h-screen font-sans selection:bg-pink-100 pb-24">
            
            <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
                <motion.div {...animaSutil}>
                    <span className="text-pink-400 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Contato</span>
                    <h1 className="text-4xl md:text-6xl font-light text-slate-800 tracking-tight mb-8 leading-none">
                        Atendimento <span className="font-serif italic text-pink-500 text-5xl md:text-7xl">Exclusivo</span>
                    </h1>
                    <div className="h-px w-12 bg-pink-100 mx-auto mb-8"></div>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto font-normal leading-relaxed">
                        Seja para uma encomenda personalizada ou uma parceria corporativa, nossa equipe está pronta para lhe atender.
                    </p>
                </motion.div>
            </section>

            <section className="px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* INFO COLUMN */}
                    <motion.div {...animaSutil} className="lg:col-span-5 space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Canais Diretos</h3>
                            
                            <div className="space-y-6">
                                {[
                                    { icon: MessageCircle, label: 'WhatsApp', val: '(14) 99187-1448', href: 'https://wa.me/5514991871448' },
                                    { icon: Mail, label: 'E-mail', val: 'contato@anatilde.com.br', href: 'mailto:contato@anatilde.com.br' },
                                    { icon: Instagram, label: 'Instagram', val: '@anaildedelicias', href: 'https://instagram.com/anaildedelicias' }
                                ].map((item) => (
                                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="group flex items-center gap-6 p-2 outline-none">
                                        <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                                            <item.icon size={22} strokeWidth={1.2} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">{item.label}</p>
                                            <p className="text-slate-700 font-medium text-lg tracking-tight">{item.val}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-pink-50 flex items-start gap-4 text-slate-400">
                            <MapPin size={18} strokeWidth={1.5} className="mt-1" />
                            <div>
                                <p className="text-sm text-slate-600 font-medium">Ateliê Bauru</p>
                                <p className="text-xs leading-relaxed">Disponível para retiradas agendadas e degustações sob consulta.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM COLUMN */}
                    <motion.div {...animaSutil} className="lg:col-span-7">
                        <form 
                            onSubmit={handleSubmit}
                            className="space-y-8 bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-pink-50/50 rounded-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Nome</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-stone-200"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Contato</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.contact}
                                        onChange={e => setFormData({...formData, contact: e.target.value})}
                                        className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-stone-200"
                                        placeholder="E-mail ou WhatsApp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Natureza da Mensagem</label>
                                <select 
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-600 appearance-none cursor-pointer"
                                >
                                    <option>Encomenda Especial</option>
                                    <option>Eventos Corporativos</option>
                                    <option>Dúvidas Técnicas</option>
                                    <option>Outros Assuntos</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Sua Mensagem</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-transparent border-b border-slate-100 py-3 focus:outline-none focus:border-pink-400 transition-colors text-slate-700 placeholder:text-stone-200 resize-none"
                                    placeholder="Como podemos ajudar?"
                                />
                            </div>

                            <div className="pt-6">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="group relative flex items-center justify-center gap-4 bg-slate-900 text-white w-full md:w-auto px-12 py-5 rounded-lg font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-pink-500 disabled:bg-slate-200 transition-all duration-500 shadow-xl shadow-slate-100 overflow-hidden"
                                >
                                    <span className={`flex items-center gap-4 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                                        Enviar Solicitação
                                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                    
                                    {isSubmitting && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 size={20} className="animate-spin text-white" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};