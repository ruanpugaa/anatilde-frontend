import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { newsletterService, newsletterSchema, NewsletterData } from '../../services/newsletterService';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Newsletter = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<NewsletterData>({
        resolver: zodResolver(newsletterSchema)
    });

    const onSubmit = async (data: NewsletterData) => {
        setStatus('loading');
        try {
            await newsletterService.subscribe(data);
            setStatus('success');
            reset();
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section className="py-24 bg-white border-t border-stone-100">
            <div className="px-[5vw] md:px-[10vw] mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    
                    <motion.div className="max-w-md text-center lg:text-left">
                        <span className="text-pink-500 font-bold text-[9px] uppercase tracking-[0.4em] mb-4 block">Mailing List</span>
                        <h2 className="text-3xl md:text-4xl font-serif italic text-stone-800 leading-tight mb-4">
                            Mantenha-se <span className="text-stone-400 not-italic font-sans font-light">inspirada</span>
                        </h2>
                        <p className="text-stone-500 text-sm leading-relaxed tracking-wide">
                            Assine para receber convites exclusivos e lançamentos sazonais.
                        </p>
                    </motion.div>

                    <div className="w-full lg:max-w-2xl">
                        {status === 'success' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                <CheckCircle2 className="text-pink-500" size={20} />
                                <p className="text-stone-800 font-serif italic text-sm">Sua presença foi confirmada.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                                    {/* Nome */}
                                    <div className="relative">
                                        <input
                                            {...register("name")}
                                            placeholder="Seu nome"
                                            className={`w-full bg-stone-50 px-6 py-4 rounded-full border ${errors.name ? 'border-red-200' : 'border-stone-100'} outline-none text-sm transition-all`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            {...register("email")}
                                            placeholder="E-mail"
                                            className={`w-full bg-stone-50 px-6 py-4 rounded-full border ${errors.email ? 'border-red-200' : 'border-stone-100'} outline-none text-sm transition-all`}
                                        />
                                    </div>

                                    <button
                                        disabled={status === 'loading'}
                                        className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group h-full"
                                    >
                                        {status === 'loading' ? '...' : <>Participar <Send size={14} /></>}
                                    </button>
                                </div>

                                {/* Mensagens de Erro Inteligentes */}
                                <AnimatePresence mode="wait">
                                    {(errors.name || errors.email || status === 'error') && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 mt-2 ml-4 text-[10px] font-bold text-red-400 uppercase tracking-tighter"
                                        >
                                            <AlertCircle size={12} />
                                            <span>{errors.name?.message || errors.email?.message || "Erro na conexão"}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};