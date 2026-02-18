import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar, Filter } from 'lucide-react';

export const PedidosView = ({ isDashboard = false }: { isDashboard?: boolean }) => {
    // Inicializamos como array vazio para evitar o erro de 'reduce'
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const fetchPedidos = async (inicio = null, fim = null) => {
        setLoading(true);
        try {
            const url = inicio && fim 
                ? `https://anatilde.com.br/api/admin_pedidos.php?inicio=${inicio}&fim=${fim}`
                : 'https://anatilde.com.br/api/admin_pedidos.php';
            const res = await axios.get(url);
            setPedidos(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPedidos(); }, []);

    const chartData = useMemo(() => {
        if (!pedidos.length) return [];
        const groups = pedidos.reduce((acc: any, p: any) => {
            const date = new Date(p.data_hora).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + Number(p.total);
            return acc;
        }, {});
        return Object.entries(groups).map(([name, total]) => ({ name, total })).reverse();
    }, [pedidos]);

    if (loading) return <div className="p-8 text-slate-400 font-bold animate-pulse">Carregando pedidos...</div>;

    return (
        <div className="space-y-6">
            {/* Barra de Filtros (Oculta se for o mini dashboard se desejar) */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Calendar size={16} className="text-slate-400 ml-2" />
                        <input type="date" className="bg-transparent border-none outline-none text-xs font-bold text-slate-600" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                        <span className="text-slate-300">|</span>
                        <input type="date" className="bg-transparent border-none outline-none text-xs font-bold text-slate-600" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                    </div>
                    <button onClick={() => fetchPedidos(dataInicio as any, dataFim as any)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Filtrar Período
                    </button>
                    <button onClick={() => { setDataInicio(''); setDataFim(''); fetchPedidos(); }} className="text-slate-400 hover:text-pink-500 text-xs font-bold transition-colors">
                        Visualizar Todos
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Fluxo de Vendas</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Area type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={3} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Card de Valor */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Receita no Período</p>
                        <h2 className="text-4xl font-black mt-2 tracking-tighter italic">
                            R$ {pedidos.reduce((acc, p) => acc + Number(p.total), 0).toFixed(2)}
                        </h2>
                    </div>
                    <div className="pt-6 border-t border-white/10 mt-6 flex justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase">Total de Pedidos</span>
                        <span>{pedidos.length}</span>
                    </div>
                </div>
            </div>

            {/* Listagem (Apenas se não for um mini dashboard simplificado) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Código</th>
                            <th className="px-8 py-5">Data</th>
                            <th className="px-8 py-5">Itens</th>
                            <th className="px-8 py-5 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {pedidos.map((p: any) => (
                            <tr key={p.pedido_grupo} className="hover:bg-slate-50/50">
                                <td className="px-8 py-5 text-pink-500 font-bold">#{p.pedido_grupo.slice(-6).toUpperCase()}</td>
                                <td className="px-8 py-5 text-slate-400">{new Date(p.data_hora).toLocaleDateString()}</td>
                                <td className="px-8 py-5 text-slate-600 truncate max-w-xs">{p.itens}</td>
                                <td className="px-8 py-5 text-right font-black">R$ {Number(p.total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};