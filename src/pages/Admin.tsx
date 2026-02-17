import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign, RefreshCw } from 'lucide-react';

interface Pedido {
    pedido_grupo: string;
    itens: string;
    total: string;
    data_hora: string;
}

export const Admin = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:3001/admin/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPedidos(); }, []);

    return (
        <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Painel de Pedidos</h1>
                    <p className="text-gray-500 text-sm">Gerencie as vendas da Doce Magia</p>
                </div>
                <button 
                    onClick={fetchPedidos}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Atualizar
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                            <tr>
                                <th className="p-6">ID Pedido</th>
                                <th className="p-6">Itens</th>
                                <th className="p-6">Valor Total</th>
                                <th className="p-6">Data/Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pedidos.map((pedido) => (
                                <tr key={pedido.pedido_grupo} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-mono text-xs text-pink-600 font-bold">
                                        {pedido.pedido_grupo}
                                    </td>
                                    <td className="p-6 text-gray-700 max-w-xs truncate">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-gray-400" />
                                            {pedido.itens}
                                        </div>
                                    </td>
                                    <td className="p-6 font-bold text-gray-800">
                                        R$ {Number(pedido.total).toFixed(2)}
                                    </td>
                                    <td className="p-6 text-gray-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(pedido.data_hora).toLocaleString('pt-BR')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};