import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCartStore } from '../../store/useCartStore';
import { useSettings } from '../../hooks/useSettings';
import { Link, useLocation } from 'react-router-dom';

// STAFF: Física de mola idêntica à do Carrinho para consistência sistêmica
const menuSpring = { 
    type: 'spring', 
    damping: 35, 
    stiffness: 250, 
    mass: 1 
} as const;

const HEADER_TRANSITION: Transition = { 
    duration: 0.6, 
    ease: [0.22, 1, 0.36, 1] 
};

/**
 * STAFF ARCHITECTURE: Variants com tipagem explícita.
 * Resolve o erro TS2322 garantindo que o ease seja interpretado corretamente.
 */
const itemVariants: Variants = {
    initial: { x: 40, opacity: 0 },
    open: (i: number) => ({ 
        x: 0, 
        opacity: 1, 
        transition: { 
            delay: 0.1 + (i * 0.08),
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as any // 'as any' ou 'as [number, number, number, number]' para o TS aceitar o easing customizado
        } 
    }),
    closed: { 
        x: 20, 
        opacity: 0, 
        transition: { duration: 0.3 } 
    }
};

const CDN_URL = "https://cdn.anatilde.com.br/";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    
    const { settings } = useSettings(); 
    const scrollDir = useScrollDirection();
    const location = useLocation();
    const { toggleSidebar, items } = useCartStore();
    
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const sync = () => {
            const saved = JSON.parse(localStorage.getItem('@anatilde:wishlist') || '[]');
            setWishlistCount(saved.length);
        };
        sync();
        window.addEventListener('wishlist-updated', sync);
        return () => window.removeEventListener('wishlist-updated', sync);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }, [isMenuOpen]);

    // Fecha o menu ao trocar de rota
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const logoUrl = settings?.site_logo 
        ? (settings.site_logo.startsWith('http') ? settings.site_logo : `${CDN_URL}${settings.site_logo.replace(/^\/+/, '')}`)
        : null;

    if (!settings) return <div className="h-24" />;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Delícias', path: '/delicias' },
        { name: 'Páscoa 2026', path: '/pascoa' },
        { name: 'Quem Somos', path: '/quem-somos' },
        { name: 'Contato', path: '/contato' },
    ];

    return (
        <>
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: scrollDir === "down" && !isMenuOpen ? -100 : 0 }}
                transition={HEADER_TRANSITION}
                className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100/50 h-24 flex items-center px-6 md:px-10"
            >
                <div className="flex-1">
                    <Link to="/" className="inline-block outline-none">
                        {logoUrl ? (
                            <img src={logoUrl} alt={settings.site_name} className="h-10 md:h-12 w-auto object-contain" />
                        ) : (
                            <span className="font-serif text-xl md:text-2xl tracking-tighter text-stone-800 uppercase font-light">
                                ANA<span className="italic text-pink-500 font-medium lowercase">tilde</span>
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="hidden md:flex flex-[3] justify-center gap-10">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-300 relative group
                                ${location.pathname === link.path ? 'text-pink-500' : 'text-stone-500 hover:text-stone-900'}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-2 left-0 h-[1px] bg-pink-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>
                    ))}
                </nav>

                <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
                    <ActionButton onClick={() => window.dispatchEvent(new CustomEvent('toggle-wishlist'))} count={wishlistCount} icon={<Heart size={20} strokeWidth={1.2} />} />
                    <ActionButton onClick={toggleSidebar} count={itemCount} icon={<ShoppingBag size={20} strokeWidth={1.2} />} isCart />
                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-stone-800 outline-none"><Menu size={26} /></button>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[59] bg-stone-900/10 backdrop-blur-sm"
                        />

                        <motion.div 
                            initial={{ x: '100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '100%' }} 
                            transition={menuSpring} 
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-[60] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.08)] flex flex-col"
                        >
                            <div className="h-24 flex items-center justify-between px-8 border-b border-stone-50">
                                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-300">Navegação</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            <nav className="flex-1 flex flex-col justify-center px-10 gap-8">
                                {navLinks.map((link, i) => (
                                    <motion.div 
                                        key={link.path} 
                                        custom={i}
                                        variants={itemVariants}
                                        initial="initial"
                                        animate="open"
                                        exit="closed"
                                    >
                                        <Link 
                                            to={link.path} 
                                            className="flex items-center gap-4 group py-1"
                                        >
                                            <span className="text-[9px] font-mono text-pink-300 opacity-70">0{i+1}</span>
                                            <span className={`text-2xl font-serif italic tracking-tight transition-colors ${location.pathname === link.path ? 'text-pink-500' : 'text-stone-800 hover:text-pink-400'}`}>
                                                {link.name}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 0.6 }}
                                className="p-10 border-t border-stone-50 bg-stone-50/30"
                            >
                                <p className="text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-4 font-bold">Anatilde Boutique Deluxe</p>
                                <div className="flex gap-4 text-pink-200">
                                    <Heart size={16} strokeWidth={1.5} />
                                    <ShoppingBag size={16} strokeWidth={1.5} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

const ActionButton = ({ onClick, count, icon, isCart = false }: any) => (
    <button onClick={onClick} className="relative p-2 text-stone-700 hover:text-pink-500 transition-colors group">
        <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <AnimatePresence>
            {count > 0 && (
                <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className={`absolute top-0 right-0 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm ${isCart ? 'bg-pink-500' : 'bg-pink-400'}`}
                >
                    {count}
                </motion.span>
            )}
        </AnimatePresence>
    </button>
);