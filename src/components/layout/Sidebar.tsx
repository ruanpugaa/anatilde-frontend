import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import axios from 'axios';

export const Sidebar = () => {
    const cart = useCartStore() as any;
    const { items, isSidebarOpen, toggleSidebar, addItem, removeItem, clearCart } = cart;

    const total = items.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0);
    
    const threshold = 100;
    const missing = threshold - total;
    const hasDiscount = total >= threshold;

    // Função para formatar a URL da imagem corretamente
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
            alert("Ops! Tivemos um problema ao registrar seu pedido.");
        }
    };

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    <motion.aside
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                <ShoppingBag className="text-pink-500" /> Seu Carrinho
                            </h2>
                            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {items.length > 0 && (
                            <div className="bg-pink-50 p-4 rounded-xl mb-6 border border-pink-100">
                                {hasDiscount ? (
                                    <p className="text-sm text-green-700 font-bold">🎉 Parabéns! 10% OFF liberado!</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-pink-800">Faltam <strong>R$ {missing.toFixed(2)}</strong> para ganhar 10% OFF!</p>
                                        <div className="h-2 w-full bg-pink-200 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(total / threshold) * 100}%` }}
                                                className="h-full bg-pink-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 italic flex flex-col items-center gap-4">
                                    <ShoppingBag size={48} className="text-gray-200" />
                                    Seu carrinho está vazio...
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                        {/* CORREÇÃO DA IMAGEM ABAIXO */}
                                        <img 
                                            src={getImageUrl(item.image_url)} 
                                            className="w-20 h-20 object-cover rounded-xl bg-gray-50" 
                                            alt={item.name} 
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sem+Foto' }}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-pink-600 font-bold">R$ {Number(item.price).toFixed(2)}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button onClick={() => removeItem(item.id)} className="p-1 border rounded hover:bg-gray-100 transition-colors"><Minus size={14} /></button>
                                                <span className="font-medium w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => addItem(item)} className="p-1 border rounded hover:bg-gray-100 transition-colors"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-6 border-t mt-auto">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-gray-500 font-medium">Total:</span>
                                <div className="text-right">
                                    {hasDiscount && <div className="text-sm text-gray-400 line-through">R$ {total.toFixed(2)}</div>}
                                    <div className={`text-2xl font-black ${hasDiscount ? "text-green-600" : "text-gray-800"}`}>
                                        R$ {(hasDiscount ? total * 0.9 : total).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <button
                                disabled={items.length === 0}
                                onClick={handleCheckout}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 active:scale-[0.98]"
                            >
                                Finalizar no WhatsApp
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};