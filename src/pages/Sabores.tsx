import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2, ImageOff, Plus, Minus } from 'lucide-react';
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
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    
    const addItem = useCartStore((state) => state.addItem) as any;
    const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://anatilde.com.br/api/products.php');
                const data = Array.isArray(response.data) ? response.data : [];
                setProducts(data);
                
                const initialQuants: Record<number, number> = {};
                data.forEach((p: Product) => initialQuants[p.id] = 1);
                setQuantities(initialQuants);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const updateLocalQuantity = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const handleAddToCart = (product: Product) => {
        const qty = quantities[product.id] || 1;
        for (let i = 0; i < qty; i++) {
            addItem(product);
        }
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    };

    const getProductImage = (url: string) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
            <p className="text-gray-500 font-medium font-sans">Sincronizando delícias...</p>
        </div>
    );

    return (
        <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <header className="mb-12 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight"
                >
                    Nosso Cardápio
                </motion.h1>
                <p className="text-gray-500 font-medium">Produtos artesanais feitos com amor.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
                    >
                        {/* Container da Imagem com Seletor Flutuante */}
                        <div className="h-72 overflow-hidden relative bg-slate-50">
                            {product.image_url ? (
                                <img 
                                    src={getProductImage(product.image_url) || ''} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <ImageOff size={48} />
                                </div>
                            )}

                            {/* SELETOR FLUTUANTE */}
                            <div className="absolute bottom-4 right-4 flex items-center bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-xl border border-white/20 ring-1 ring-black/5">
                                <button 
                                    onClick={() => updateLocalQuantity(product.id, -1)}
                                    className="p-2 text-slate-400 hover:text-pink-500 transition-colors"
                                >
                                    <Minus size={16} strokeWidth={3} />
                                </button>
                                <span className="w-8 text-center font-black text-slate-800 text-sm">
                                    {quantities[product.id] || 1}
                                </span>
                                <button 
                                    onClick={() => updateLocalQuantity(product.id, 1)}
                                    className="p-2 text-slate-400 hover:text-pink-500 transition-colors"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo do Card */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors leading-tight">
                                    {product.name}
                                </h3>
                                <span className="text-xl font-black text-pink-500 whitespace-nowrap">
                                    R$ {Number(product.price).toFixed(2)}
                                </span>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>
                            
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl hover:bg-pink-500 transition-all active:scale-[0.98] shadow-lg shadow-slate-100 flex items-center justify-center gap-3 font-bold text-sm tracking-wide"
                            >
                                <ShoppingCart size={18} />
                                ADICIONAR AO CARRINHO
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    );
};