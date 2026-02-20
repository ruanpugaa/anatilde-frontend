import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCartStore } from '../../store/useCartStore';
import { useSettings } from '../../hooks/useSettings';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
    const settings = useSettings();
    const scrollDir = useScrollDirection();
    const location = useLocation();
    const { toggleSidebar, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // STAFF TRICK: Enquanto o settings for null, renderizamos apenas o container
    // Isso evita que o fallback de texto apareça antes da logo dinâmica carregar.
    if (!settings) {
        return <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100/50 h-24" />;
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Delícias', path: '/delicias' },
        { name: 'Páscoa 2026', path: '/pascoa' },
        { name: 'Quem Somos', path: '/quem-somos' },
        { name: 'Contato', path: '/contato' },
    ];

    const getLogoUrl = () => {
        if (!settings.site_logo) return null;
        const cleanPath = settings.site_logo.replace(/^\//, ''); 
        return `https://anatilde.com.br/${cleanPath}`;
    };

    const logoUrl = getLogoUrl();

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: scrollDir === "down" ? -100 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100/50 h-24 flex items-center px-10"
        >
            <div className="flex-1">
                <Link to="/" className="outline-none block max-w-[180px]">
                    {logoUrl ? (
                        <img 
                            key={logoUrl}
                            src={logoUrl} 
                            alt="Anatilde" 
                            className="h-12 w-auto object-contain transition-opacity duration-300"
                            onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                            style={{ opacity: 0 }}
                        />
                    ) : (
                        <span className="font-serif text-2xl tracking-tighter text-stone-800">
                            ANA<span className="italic text-pink-500 font-medium">TILDE</span>
                        </span>
                    )}
                </Link>
            </div>

            <nav className="hidden md:flex flex-[3] justify-center gap-10">
                {navLinks.map((link) => (
                    <Link 
                        key={link.path}
                        to={link.path} 
                        className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 relative group
                            ${location.pathname === link.path ? 'text-pink-500' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                        {link.name}
                        <span className={`absolute -bottom-2 left-0 h-[1px] bg-pink-500 transition-all duration-500 
                            ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                        />
                    </Link>
                ))}
            </nav>

            <div className="flex-1 flex justify-end items-center gap-6">
                <button onClick={toggleSidebar} className="relative p-2 text-stone-700 transition-colors hover:text-pink-500 group">
                    <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                    {itemCount > 0 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                            {itemCount}
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.header>
    );
};