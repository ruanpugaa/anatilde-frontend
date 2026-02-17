import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import axios from 'axios';

export const Sidebar = () => {
    // Alinhando os nomes das funções com a Store criada (addItem/removeItem)
    const { items, isSidebarOpen, toggleSidebar, addItem, removeItem } = useCartStore();

    // Cálculo do total garantindo conversão numérica
    const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    
    const threshold = 100;
    const missing = threshold - total;
    const hasDiscount = total >= threshold;

    const handleCheckout = async () => {
    // Calculamos o preço final (com ou sem desconto)
    const finalPrice = hasDiscount ? total * 0.9 : total;

    try {
        // 1. Salva no Banco de Dados via API
        await axios.post('http://127.0.0.1:3001/pedidos', {
            items: items,
            total: finalPrice
        });

        // 2. Prepara a mensagem para o WhatsApp
        const message = encodeURIComponent(
            `*Novo Pedido Doce Magia*\n\n` +
            items.map(i => `- ${i.quantity}x ${i.name}`).join('\n') +
            `\n\n*Total:* R$ ${finalPrice.toFixed(2)}` +
            `\n\n_Pedido registrado no sistema!_`
        );

        // 3. Abre o WhatsApp
        window.open(`https://wa.me/5514991871448?text=${message}`);

        // Opcional: Limpa o carrinho e fecha a sidebar após o sucesso
        // clearCart(); 
        // toggleSidebar();

    } catch (error) {
        console.error("Erro ao registrar pedido:", error);
        alert("Ops! Tivemos um problema ao registrar seu pedido. Tente novamente.");
    }
};

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    {/* Overlay Escuro */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
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

                        {/* Widget de Desconto */}
                        {items.length > 0 && (
                            <div className="bg-pink-50 p-4 rounded-xl mb-6 border border-pink-100">
                                {hasDiscount ? (
                                    <p className="text-sm text-green-700 font-bold">
                                        🎉 Parabéns! Você ganhou 10% de desconto!
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-sm text-pink-800">
                                            Faltam <strong>R$ {missing.toFixed(2)}</strong> para ganhar 10% OFF!
                                        </p>
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

                        {/* Listagem */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 italic">
                                    Seu carrinho está vazio...
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                        <img 
                                            src={item.image_url} 
                                            className="w-20 h-20 object-cover rounded-xl" 
                                            alt={item.name} 
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-pink-600 font-bold">R$ {Number(item.price).toFixed(2)}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button 
                                                    onClick={() => removeItem(item.id)} 
                                                    className="p-1 border rounded hover:bg-gray-50"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-medium w-4 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => addItem(item)} 
                                                    className="p-1 border rounded hover:bg-gray-50"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer da Sidebar */}
                        <div className="pt-6 border-t mt-auto">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-gray-500 font-medium">Total:</span>
                                <div className="text-right">
                                    {hasDiscount && (
                                        <div className="text-sm text-gray-400 line-through">
                                            R$ {total.toFixed(2)}
                                        </div>
                                    )}
                                    <div className={`text-2xl font-black ${hasDiscount ? "text-green-600" : "text-gray-800"}`}>
                                        R$ {(hasDiscount ? total * 0.9 : total).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <button
                                disabled={items.length === 0}
                                onClick={handleCheckout}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200"
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