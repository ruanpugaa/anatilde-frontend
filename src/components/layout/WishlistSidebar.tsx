import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ArrowRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Product } from '../../@types/product';
import { useCartStore } from '../../store/useCartStore';
import { toast } from 'sonner';

export const WishlistSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const addItem = useCartStore((state: any) => state.addItem);

    /**
     * STAFF SANITIZER: Corrige o path das imagens removendo o /api e 
     * unificando a pasta para uploads/produtos/
     */
    const getProductImage = (url: string | null) => {
        if (!url) return null;
        
        const baseUrl = 'https://anatilde.com.br/uploads/produtos/';
        
        // Se a URL vier completa da API, tratamos os caminhos incorretos
        if (url.startsWith('http')) {
            return url
                .replace('/api/uploads/products/', '/uploads/produtos/')
                .replace('/api/uploads/produtos/', '/uploads/produtos/')
                .replace('/uploads/products/', '/uploads/produtos/');
        }

        // Se vier apenas o nome do arquivo ou path relativo
        const cleanFileName = url
            .replace(/^api\//, '')
            .replace(/^uploads\/products\//, '')
            .replace(/^uploads\/produtos\//, '');
            
        return `${baseUrl}${cleanFileName}`;
    };

    const loadWishlistProducts = async () => {
        const savedIds = JSON.parse(localStorage.getItem('@anatilde:wishlist') || '[]');
        if (savedIds.length === 0) {
            setWishlistItems([]);
            return;
        }

        setLoading(true);
        try {
            const res = await api.get('/modules/products/admin_list.php');
            // Garantimos a comparação como string para evitar bugs de tipo
            const filtered = res.data.filter((p: Product) => 
                savedIds.map(String).includes(String(p.id))
            );
            setWishlistItems(filtered);
        } catch (error) {
            console.error("[Wishlist] Erro ao carregar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const toggleHandler = () => setIsOpen(prev => !prev);
        
        window.addEventListener('toggle-wishlist', toggleHandler);
        window.addEventListener('wishlist-updated', loadWishlistProducts);

        if (isOpen) loadWishlistProducts();

        return () => {
            window.removeEventListener('toggle-wishlist', toggleHandler);
            window.removeEventListener('wishlist-updated', loadWishlistProducts);
        };
    }, [isOpen]);

    const removeItem = (id: number | string) => {
        const savedIds = JSON.parse(localStorage.getItem('@anatilde:wishlist') || '[]');
        const newList = savedIds.filter((itemId: any) => String(itemId) !== String(id));
        localStorage.setItem('@anatilde:wishlist', JSON.stringify(newList));
        
        window.dispatchEvent(new Event('wishlist-updated'));
        toast.success("Removido dos favoritos");
    };

    const moveToCart = (product: Product) => {
        const itemToCart = { 
            ...product, 
            id: Number(product.id), 
            price: Number(product.price) 
        };
        addItem(itemToCart as any);
        removeItem(product.id);
        toast.success("Movido para a sacola!");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[70]"
                    />

                    {/* Sidebar Container */}
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-[80] shadow-2xl flex flex-col"
                    >
                        {/* Header Section */}
                        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Heart size={20} className="text-pink-500 fill-pink-500" />
                                <h2 className="font-serif text-2xl text-stone-800 italic font-medium tracking-tight">Meus Desejos</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                <X size={24} className="text-stone-400" />
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {loading ? (
                                <div className="h-40 flex items-center justify-center text-stone-400 text-sm italic font-light">
                                    Sincronizando mimos...
                                </div>
                            ) : wishlistItems.length > 0 ? (
                                wishlistItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-300">
                                        {/* Image Box */}
                                        <div className="w-20 h-24 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-100 shadow-sm relative">
                                            {item.image_url ? (
                                                <img 
                                                    src={getProductImage(item.image_url)!} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-stone-200"><ImageOff size="20" /></div>';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-200">
                                                    <ImageOff size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info Box */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <Link 
                                                    to={`/produto/${item.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-800 hover:text-pink-500 transition-colors line-clamp-1"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-pink-600 font-sans text-sm font-bold mt-0.5">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-2">
                                                <button 
                                                    onClick={() => moveToCart(item)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-stone-900 flex items-center gap-2 hover:text-pink-500 transition-colors group/btn"
                                                >
                                                    Mover p/ Sacola 
                                                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                                <button 
                                                    onClick={() => removeItem(item.id)} 
                                                    className="text-stone-300 hover:text-red-400 transition-colors p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Empty State */
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-6">
                                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                                        <Heart size={40} strokeWidth={1} />
                                    </div>
                                    <div className="max-w-[200px]">
                                        <p className="text-stone-800 font-serif italic text-lg mb-1">Lista vazia</p>
                                        <p className="text-stone-400 text-xs font-light leading-relaxed">
                                            Seus produtos favoritos aparecerão aqui.
                                        </p>
                                    </div>
                                    <Link 
                                        to="/delicias" 
                                        onClick={() => setIsOpen(false)}
                                        className="text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-900 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-pink-600 transition-all active:scale-95"
                                    >
                                        Ver Cardápio
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Footer Section */}
                        {wishlistItems.length > 0 && (
                            <div className="p-8 border-t border-stone-100 bg-stone-50/50">
                                <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] leading-relaxed text-center font-medium">
                                    Anatilde Boutique • 2026
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};