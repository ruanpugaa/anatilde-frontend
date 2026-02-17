import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export const Sabores = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError(false);
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:3001/products');
                
                // Log para debug no console do navegador (F12)
                console.log("Dados recebidos:", response.data);
                
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Erro Axios:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Carregando cardápio...</p>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center text-red-500">
            Erro ao carregar produtos. Verifique se a API está rodando.
        </div>
    );

    return (
        <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <header className="mb-12 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-800 mb-4"
                >
                    Nosso Cardápio
                </motion.h1>
                <p className="text-gray-600">Escolha suas delícias favoritas.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                    >
                        <div className="h-64 overflow-hidden relative">
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-pink-500">
                                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <button 
                                    onClick={() => addItem(product)}
                                    className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-pink-600 transition-colors flex items-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    );
};