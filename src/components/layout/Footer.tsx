import { Instagram, Phone, MessageCircle, MapPin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';

export const Footer = () => {
    const year = new Date().getFullYear();
    const settings = useSettings();

    // STAFF TRICK: Se não houver settings, renderizamos um espaço vazio preservado
    // Isso evita o flicker de textos "fake" (fallback) antes do dado real.
    if (!settings) {
        return <footer className="bg-[#FFFCFB] h-96 border-t border-stone-100" />;
    }

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Delícias', path: '/delicias' },
        { label: 'Páscoa 2026', path: '/pascoa' },
        { label: 'Quem Somos', path: '/quem-somos' },
        { label: 'Contato', path: '/contato' }
    ];

    const whatsappLink = settings.whatsapp_number 
        ? `https://wa.me/55${settings.whatsapp_number.replace(/\D/g, '')}` 
        : "#";

    const logoUrl = settings.site_logo 
        ? `https://anatilde.com.br/${settings.site_logo.replace(/^\//, '')}` 
        : null;

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
                    <Link to="/" className="outline-none block max-w-[200px]">
                        {logoUrl ? (
                            <img key={logoUrl} src={logoUrl} alt="Anatilde" className="h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 transition-all duration-500" />
                        ) : (
                            <span className="font-serif text-3xl tracking-tighter text-stone-800">
                                ANA<span className="italic text-pink-500 font-medium">TILDE</span>
                            </span>
                        )}
                    </Link>
                    <p className="text-stone-500 text-sm leading-relaxed max-w-sm font-light tracking-wide">
                        {settings.site_description}
                    </p>
                    <div className="flex gap-6 items-center">
                        {settings.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-500 transition-all duration-500">
                                <Instagram size={18} strokeWidth={1.5} />
                            </a>
                        )}
                        {settings.facebook_url && (
                            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-500 transition-all duration-500">
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
                            <span>{settings.store_address}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={14} className="shrink-0 text-stone-300" />
                            <span>{settings.whatsapp_number}</span>
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
                    <span>Handcrafted by</span>
                    <span className="text-stone-900 font-bold tracking-tighter">ANATILDE</span>
                    <span className="text-pink-500 font-black text-[12px] ml-1">.</span>
                </div>
            </div>
        </footer>
    );
};