import { Instagram, Phone, MessageCircle, MapPin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import { useMemo } from 'react';

export const Footer = () => {
    const year = new Date().getFullYear();
    
    // STAFF FIX: Desestruturação correta do hook
    const { settings, loading } = useSettings();

    // STAFF SANITIZER: Garantindo que o logo apareça sem o prefixo /api
    const logoUrl = useMemo(() => {
        const path = (settings as any)?.site_logo;
        if (!path) return null;

        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('api/uploads/', 'uploads/')
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/${cleanPath}`;
    }, [settings]);

    // STAFF TRICK: Skeleton/Placeholder durante o loading ou ausência de dados
    if (loading || !settings) {
        return <footer className="bg-[#FFFCFB] h-96 border-t border-stone-100" />;
    }

    // Cast para 'any' temporário para evitar os erros de TS reportados
    const s = settings as any;

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Delícias', path: '/delicias' },
        { label: 'Páscoa 2026', path: '/pascoa' },
        { label: 'Quem Somos', path: '/quem-somos' },
        { label: 'Contato', path: '/contato' }
    ];

    const whatsappLink = s.whatsapp_number 
        ? `https://wa.me/55${s.whatsapp_number.replace(/\D/g, '')}` 
        : "#";

    return (
        <footer className="bg-[#FFFCFB] border-t border-stone-100 pt-24 pb-12 px-[5vw] md:px-[10vw]">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8"
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-5 space-y-8">
                    <Link to="/" className="outline-none block ">
                        {logoUrl ? (
                            <img 
                                key={logoUrl} 
                                src={logoUrl} 
                                alt="Anatilde" 
                                className="mx-auto hover:grayscale-0 transition-all duration-500" 
                            />
                        ) : (
                            <span className="font-serif text-3xl tracking-tighter text-stone-800">
                                ANA<span className="italic text-pink-500 font-medium">TILDE</span>
                            </span>
                        )}
                    </Link>
                    <p className="text-stone-500 text-sm leading-relaxed max-w-sm font-light tracking-wide">
                        {s.site_description || "Confeitaria artesanal com afeto e sofisticação."}
                    </p>
                    <div className="flex gap-6 items-center">
                        {s.instagram_url && (
                            <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-500 transition-all duration-500">
                                <Instagram size={18} strokeWidth={1.5} />
                            </a>
                        )}
                        {s.facebook_url && (
                            <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-500 transition-all duration-500">
                                <Facebook size={18} strokeWidth={1.5} />
                            </a>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-900">Navegação</h4>
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((item) => (
                            <li key={item.label}>
                                <Link to={item.path} className="text-xs text-stone-500 hover:text-pink-500 transition-all duration-300 font-light">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-900">Boutique</h4>
                    <ul className="flex flex-col gap-4 text-xs text-stone-500 font-light leading-relaxed">
                        <li className="flex items-start gap-2">
                            <MapPin size={14} className="shrink-0 text-stone-300 mt-1" />
                            <span>{s.store_address || "Bauru, SP"}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={14} className="shrink-0 text-stone-300" />
                            <span>{s.whatsapp_number}</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-3 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-900">Atendimento</h4>
                    <p className="text-xs text-stone-400 font-light leading-relaxed">Dúvidas sobre encomendas personalizadas?</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between w-full border-b border-stone-200 py-2 text-stone-800 text-xs font-medium transition-all hover:border-green-500 outline-none">
                        Falar no WhatsApp
                        <MessageCircle size={14} strokeWidth={1.5} className="text-stone-300 group-hover:text-green-500 transition-all" />
                    </a>
                </motion.div>
            </motion.div>

            <div className="mt-24 pt-8 border-t border-stone-100/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-stone-400 uppercase tracking-widest">
                <p>© {year} Anatilde Delícias Boutique.</p>
                <div className="flex items-center gap-1">
                    <span>by</span>
                    <span className="text-stone-900 font-bold tracking-tighter">RUANPUGA</span>
                    <span className="text-pink-500 font-black text-[12px] ml-1">.</span>
                </div>
            </div>
        </footer>
    );
};