import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import axios from 'axios';

export const Sidebar = () => {
    const cart = useCartStore() as any;
    const { items, isSidebarOpen, toggleSidebar, addItem, removeItem, clearCart, removeItemCompletely } = cart;

    const total = items.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0);
    
    const threshold = 100;
    const missing = threshold - total;
    const hasDiscount = total >= threshold;

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/400x400?text=Sem+Foto';
        if (url.startsWith('http')) return url;
        return `https://anatilde.com.br/uploads/produtos/${url}`;
    };

    const handleCheckout = async () => {
        const finalPrice = hasDiscount ? total * 0.9 : total;
        try {
            await axios.post('https://anatilde.com.br/api/pedidos.php', {
                items: items,
                total: finalPrice
            });

            const message = encodeURIComponent(
                `*Novo Pedido Anatilide*\n\n` +
                items.map((i: any) => `- ${i.quantity}x ${i.name}`).join('\n') +
                `\n\n*Total:* R$ ${finalPrice.toFixed(2)}` +
                `\n\n_Pedido registrado no sistema!_`
            );

            window.open(`https://wa.me/5514991871448?text=${message}`);
            if (clearCart) clearCart();
            toggleSidebar();
        } catch (error) {
            console.error("Erro ao registrar pedido:", error);
        }
    };

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
                    />

                    <motion.aside
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FFFCFB] z-[70] shadow-2xl p-6 md:p-8 flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                                <ShoppingBag className="text-pink-400" size={20} strokeWidth={1.5} /> 
                                Carrinho <span className="font-serif italic text-pink-500 text-3xl">Delicioso</span>
                            </h2>
                            <button onClick={toggleSidebar} className="p-3 text-slate-400 hover:text-pink-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* PROGRESSO DE DESCONTO */}
                        {items.length > 0 && (
                            <div className="bg-white p-5 rounded-[1.5rem] mb-8 border border-pink-50 shadow-sm">
                                {hasDiscount ? (
                                    <p className="text-[11px] text-green-600 font-bold uppercase tracking-widest text-center italic">✨ 10% OFF aplicado!</p>
                                ) : (
                                    <>
                                        <p className="text-xs text-slate-500 font-medium text-center mb-3">
                                            Faltam <span className="text-pink-500 font-bold">R$ {missing.toFixed(2)}</span> para o desconto
                                        </p>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(total / threshold) * 100}%` }}
                                                className="h-full bg-pink-300"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* LISTA DE ITENS */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                        <ShoppingBag size={32} strokeWidth={1} />
                                    </div>
                                    <p className="text-slate-400 font-light italic">Seu carrinho está vazio...</p>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-3xl border border-slate-50 shadow-sm">
                                        <img 
                                            src={getImageUrl(item.image_url)} 
                                            className="w-20 h-20 object-cover rounded-2xl bg-slate-50" 
                                            alt={item.name} 
                                        />
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-medium text-slate-800 tracking-tight line-clamp-1">{item.name}</h4>
                                                {/* BOTÃO EXCLUIR TUDO */}
                                                <button 
                                                    onClick={() => removeItemCompletely ? removeItemCompletely(item.id) : removeItem(item.id)} 
                                                    className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                                                    title="Remover item"
                                                >
                                                    <Trash2 size={16} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            
                                            <p className="text-pink-500 text-sm font-medium mb-3">R$ {Number(item.price).toFixed(2)}</p>
                                            
                                            {/* SELETORES DE QUANTIDADE OTIMIZADOS */}
                                            <div className="flex items-center bg-slate-50 rounded-xl w-fit p-1 border border-slate-100">
                                                <button 
                                                    onClick={() => removeItem(item.id)} 
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-pink-500 active:scale-90 transition-all"
                                                >
                                                    <Minus size={16} strokeWidth={2.5} />
                                                </button>
                                                <span className="text-xs font-bold text-slate-600 w-8 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => addItem(item)} 
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-pink-500 active:scale-90 transition-all"
                                                >
                                                    <Plus size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="pt-8 border-t border-slate-100 mt-auto">
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em]">Total Estimado</span>
                                <div className="text-right">
                                    {hasDiscount && <div className="text-xs text-slate-300 line-through mb-1">R$ {total.toFixed(2)}</div>}
                                    <div className={`text-3xl font-light tracking-tighter ${hasDiscount ? "text-green-600" : "text-slate-800"}`}>
                                        R$ {(hasDiscount ? total * 0.9 : total).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                disabled={items.length === 0}
                                onClick={handleCheckout}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-pink-500 shadow-xl shadow-slate-100 active:scale-[0.98]"
                            >
                                Finalizar via WhatsApp
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};