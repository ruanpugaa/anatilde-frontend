import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCacheStore } from '../../store/useCacheStore';
import api from '../../services/api';
import { toast } from 'sonner';

export const Sidebar = () => {
    // Seletores atômicos (estáveis por padrão no Zustand)
    const items = useCartStore((state) => state.items);
    const isSidebarOpen = useCartStore((state) => state.isSidebarOpen);
    const toggleSidebar = useCartStore((state) => state.toggleSidebar);
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);

    const settings = useCacheStore((state: any) => state.settings);
    const whatsappAdmin = settings?.whatsapp || '5514991871448';

    // Cálculos simples fora de hooks complexos para evitar o loop de snapshot
    const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const hasDiscount = total >= 100;
    const finalPrice = hasDiscount ? total * 0.9 : total;

    const resolveImageUrl = (item: any) => {
        const path = item.image_url || item.image || item.foto;
        if (!path) return 'https://placehold.co/400x400?text=Anatilde';
        if (path.startsWith('http')) return path;
        
        // Mantém a estrutura de subpastas (ex: pistache/imagem.webp)
        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('uploads/produtos/', '')
            .replace('uploads/products/', '')
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/uploads/produtos/${cleanPath}`;
    };

    // Trecho corrigido do handleCheckout na Sidebar.tsx

const handleCheckout = async () => {
    if (items.length === 0) return;

    const payload = {
        items: items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price
        })),
        total: finalPrice
    };

    try {
        // Corrigido: Removido 'api/' pois o Axios já deve incluir
        // Se o erro persistir, tente apenas 'modules/orders/process.php'
        await api.post('modules/orders/process.php', payload);
    } catch (error: any) {
        console.error("[Backend Order Error]", error.response?.data || error.message);
    }

    const cleanPhone = whatsappAdmin.replace(/\D/g, '');
    const message = encodeURIComponent(
        `*NOVO PEDIDO ANATILDE Boutique*\n` +
        `───────────────────────\n` +
        items.map((i) => `• ${i.quantity}x ${i.name}`).join('\n') +
        `\n───────────────────────\n` +
        `*Total:* R$ ${finalPrice.toFixed(2)}`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    toggleSidebar();
    toast.success("Pedido finalizado!");
};

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100]"
                    />

                    <motion.aside
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDFCFB] z-[110] shadow-2xl flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="p-8 pb-6 flex justify-between items-center border-b border-stone-50">
                            <div>
                                <h2 className="font-serif text-3xl text-stone-800 italic">Sua Sacola</h2>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mt-1 text-center">Premium Experience</p>
                            </div>
                            <button onClick={toggleSidebar} className="p-2 text-stone-300 hover:text-stone-800 transition-all">
                                <X size={28} strokeWidth={1} />
                            </button>
                        </div>

                        {/* DESCONTO */}
                        {items.length > 0 && (
                            <div className="px-8 pt-6">
                                <div className={`p-4 rounded-2xl border ${hasDiscount ? 'bg-green-50/50 border-green-100' : 'bg-white border-stone-100'}`}>
                                    <div className="flex justify-between items-center mb-2 text-[10px] uppercase font-bold tracking-widest text-stone-500">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className={hasDiscount ? 'text-green-500' : 'text-pink-300'} />
                                            <span>{hasDiscount ? 'Mimo Ativado!' : 'Ganhe 10% de Desconto'}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-stone-50 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
                                            className={`h-full transition-all duration-500 ${hasDiscount ? 'bg-green-400' : 'bg-pink-300'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LISTA */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20">
                                    <ShoppingBag size={48} strokeWidth={1} />
                                    <p className="mt-4 font-serif italic">Sacola vazia</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-white rounded-xl overflow-hidden border border-stone-100 shrink-0">
                                            <img 
                                                src={resolveImageUrl(item)} 
                                                className="w-full h-full object-cover" 
                                                alt={item.name}
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Produto'; }}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-800 line-clamp-2">{item.name}</h4>
                                                <button onClick={() => removeItem(item.id)} className="text-stone-200 hover:text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-pink-500 font-bold text-sm">R$ {Number(item.price).toFixed(2)}</p>
                                                <div className="flex items-center bg-stone-50 rounded-lg p-1 border border-stone-100">
                                                    <button onClick={() => removeItem(item.id)} className="p-2 text-stone-400"><Minus size={14} /></button>
                                                    <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                                                    <button onClick={() => addItem(item)} className="p-2 text-stone-400"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-8 bg-white border-t border-stone-100">
                            <div className="flex justify-between items-end mb-8">
                                <span className="font-serif italic text-2xl text-stone-800">Total</span>
                                <p className="text-3xl font-light text-stone-900 tracking-tighter">R$ {finalPrice.toFixed(2)}</p>
                            </div>
                            <button
                                disabled={items.length === 0}
                                onClick={handleCheckout}
                                className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                            >
                                Finalizar Pedido <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};