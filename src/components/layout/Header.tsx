import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCartStore } from '../../store/useCartStore';
import { useSettings } from '../../hooks/useSettings';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const settings = useSettings();
    const scrollDir = useScrollDirection();
    const location = useLocation();
    const { toggleSidebar, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Fecha o menu automaticamente ao navegar
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Lock scroll quando o menu mobile está aberto
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

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

    // STAFF DEFINITION: Variantes tipadas para evitar erro de inferência do TS
    const menuVariants: Variants = {
        closed: { 
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: { 
            x: 0,
            transition: { 
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        closed: { opacity: 0, y: 30, transition: { duration: 0.2 } },
        open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <>
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: scrollDir === "down" && !isMenuOpen ? -100 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100/50 h-24 flex items-center px-6 md:px-10"
            >
                {/* Logo Area */}
                <div className="flex-1">
                    <Link to="/" className="outline-none block max-w-[140px] md:max-w-[180px]">
                        {logoUrl ? (
                            <img 
                                key={logoUrl}
                                src={logoUrl} 
                                alt="Anatilde" 
                                className="h-10 md:h-12 w-auto object-contain transition-opacity duration-300"
                                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                                style={{ opacity: 0 }}
                            />
                        ) : (
                            <span className="font-serif text-xl md:text-2xl tracking-tighter text-stone-800">
                                ANA<span className="italic text-pink-500 font-medium">TILDE</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Desktop Navigation */}
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

                {/* Actions Area */}
                <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
                    <button onClick={toggleSidebar} className="relative p-2 text-stone-700 transition-colors hover:text-pink-500 group">
                        <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                        {itemCount > 0 && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                                {itemCount}
                            </motion.span>
                        )}
                    </button>

                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 text-stone-800 hover:text-pink-500 transition-colors"
                    >
                        <Menu size={26} strokeWidth={1.2} />
                    </button>
                </div>
            </motion.header>

            {/* Premium Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[60] bg-white flex flex-col px-8 py-10"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">Navegação</span>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 bg-stone-50 rounded-full text-stone-900 hover:bg-stone-100 transition-colors"
                            >
                                <X size={28} strokeWidth={1} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link, idx) => (
                                <motion.div key={link.path} variants={itemVariants}>
                                    <Link 
                                        to={link.path}
                                        className="group flex items-baseline gap-4"
                                    >
                                        <span className="text-stone-300 text-xs font-bold font-mono">
                                            0{idx + 1}
                                        </span>
                                        <span className={`text-4xl md:text-5xl font-serif tracking-tight transition-colors duration-300
                                            ${location.pathname === link.path ? 'text-pink-500' : 'text-stone-800 group-hover:text-pink-500'}`}
                                        >
                                            {link.name}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div 
                            variants={itemVariants}
                            className="mt-auto pt-10 border-t border-stone-100 flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Atendimento</span>
                                <a href="https://wa.me/seunumeroaqui" className="text-stone-800 font-medium hover:text-pink-500 transition-colors">WhatsApp Anatilde</a>
                            </div>
                            <div className="flex gap-6">
                                <a href="#" className="text-sm font-bold text-stone-800 hover:text-pink-500 transition-colors">Instagram</a>
                                <a href="#" className="text-sm font-bold text-stone-800 hover:text-pink-500 transition-colors">Facebook</a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};