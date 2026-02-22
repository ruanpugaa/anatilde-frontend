import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCacheStore } from '../../store/useCacheStore';
import api from '../../services/api';
import { toast } from 'sonner';

/**
 * STAFF ARCHITECTURE: Motion Constants
 * 'as const' garante que o TS não reclame do tipo da animação.
 */
const springTransition = { 
    type: 'spring', 
    damping: 32, 
    stiffness: 220, 
    mass: 1 
} as const;

export const Sidebar = () => {
    // Seletores de Estado
    const items = useCartStore((state) => state.items);
    const isSidebarOpen = useCartStore((state) => state.isSidebarOpen);
    const toggleSidebar = useCartStore((state) => state.toggleSidebar);
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);

    // Cache Global para Configurações
    const settings = useCacheStore((state: any) => state.settings);
    const whatsappAdmin = settings?.whatsapp_number || '5514991871448';

    // Lógica de Negócio
    const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const hasDiscount = total >= 100;
    const finalPrice = hasDiscount ? total * 0.9 : total;

    /**
     * STAFF SANITIZER: Tratamento de URLs de Imagem
     */
    const resolveImageUrl = (item: any) => {
        const path = item.image_url || item.image || item.foto;
        if (!path) return 'https://placehold.co/400x400?text=Anatilde';
        if (path.startsWith('http')) return path;
        
        const cleanPath = path
            .replace(/^(api\/|uploads\/produtos\/|uploads\/products\/)/g, '')
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/uploads/produtos/${cleanPath}`;
    };

    /**
     * STAFF PROCESS: Checkout & State Reset
     */
    const handleCheckout = async () => {
        if (items.length === 0) return;

        const payload = { 
            items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })), 
            total: finalPrice 
        };

        try { 
            await api.post('modules/orders/process.php', payload); 
        } catch (error: any) { 
            console.error("[Order Error]", error.message); 
        }

        const cleanPhone = whatsappAdmin.replace(/\D/g, '');
        const message = encodeURIComponent(
            `*SOLICITAÇÃO DE PEDIDO | ANATILDE* \n\n` +
            `Olá! Gostaria de encomendar os seguintes itens da Boutique:\n\n` +
            `*ITENS SELECIONADOS*\n` +
            `───────────────────────\n` +
            items.map((i) => 
                `*${i.quantity}x* ${i.name.toUpperCase()}\n` +
                `   _R$ ${Number(i.price).toFixed(2)} un._`
            ).join('\n\n') +
            `\n───────────────────────\n\n` +
            `*RESUMO DO PEDIDO*\n` +
            `• Subtotal: R$ ${total.toFixed(2)}\n` +
            (hasDiscount ? `• Desconto Especial: -10%\n` : '') +
            `*• Total: R$ ${finalPrice.toFixed(2)}*\n\n` +
            `───────────────────────\n` +
            `_Aguardando confirmação de disponibilidade e orientações para pagamento._`
        );

        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
        
        // Fecha a sidebar
        toggleSidebar();
        
        // STAFF FIX: Limpeza direta via setState para evitar erro "is not a function"
        setTimeout(() => {
            useCartStore.setState({ items: [] });
            toast.success("Pedido enviado! Sua sacola foi limpa.");
        }, 600); 
    };

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100]"
                    />

                    <motion.aside
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={springTransition}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDFCFB] z-[110] shadow-2xl flex flex-col"
                    >
                        {/* HEADER */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 pb-6 flex justify-between items-center border-b border-stone-50"
                        >
                            <div>
                                <h2 className="font-serif text-3xl text-stone-800 italic">Sua Sacola</h2>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-pink-400 font-bold mt-1">Premium Experience</p>
                            </div>
                            <button onClick={toggleSidebar} className="p-2 text-stone-300 hover:text-stone-800 transition-all">
                                <X size={28} strokeWidth={1} />
                            </button>
                        </motion.div>

                        {/* PROGRESS BAR */}
                        {items.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 pt-6">
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${hasDiscount ? 'bg-green-50/40 border-green-100' : 'bg-white border-stone-100 shadow-sm'}`}>
                                    <div className="flex justify-between items-center mb-2 text-[10px] uppercase font-bold text-stone-500">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className={hasDiscount ? 'text-green-500' : 'text-pink-300'} />
                                            <span>{hasDiscount ? 'Mimo Ativado!' : 'Ganhe 10% de Desconto'}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
                                            className={`h-full ${hasDiscount ? 'bg-green-400' : 'bg-pink-300'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* CONTENT */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <AnimatePresence mode="popLayout">
                                {items.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
                                        className="h-full flex flex-col items-center justify-center space-y-4"
                                    >
                                        <ShoppingBag size={48} strokeWidth={0.5} />
                                        <p className="font-serif italic text-lg">Sacola vazia</p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-6">
                                        {items.map((item, index) => (
                                            <motion.div 
                                                layout key={item.id}
                                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex gap-4 group"
                                            >
                                                <div className="w-20 h-24 bg-white rounded-xl overflow-hidden border border-stone-100 shrink-0 shadow-sm">
                                                    <img src={resolveImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-800 leading-tight">{item.name}</h4>
                                                        <button onClick={() => removeItem(item.id)} className="text-stone-200 hover:text-red-400 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-pink-500 font-bold text-sm">R$ {Number(item.price).toFixed(2)}</p>
                                                        <div className="flex items-center bg-white rounded-full px-1 border border-stone-100 shadow-sm">
                                                            <button onClick={() => removeItem(item.id)} className="p-2 text-stone-400 hover:text-stone-800"><Minus size={12} /></button>
                                                            <span className="text-[10px] font-bold w-6 text-center">{item.quantity}</span>
                                                            <button onClick={() => addItem(item)} className="p-2 text-stone-400 hover:text-stone-800"><Plus size={12} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* FOOTER */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-white border-t border-stone-100 shadow-[0_-15px_40px_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex justify-between items-end mb-8">
                                <span className="font-serif italic text-2xl text-stone-800">Total</span>
                                <div className="text-right">
                                    {hasDiscount && (
                                        <p className="text-stone-300 text-[10px] line-through mb-1">R$ {total.toFixed(2)}</p>
                                    )}
                                    <p className="text-3xl font-light text-stone-900 tracking-tighter">
                                        R$ {finalPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <button
                                disabled={items.length === 0}
                                onClick={handleCheckout}
                                className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-stone-800 active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
                            >
                                Finalizar Pedido <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};