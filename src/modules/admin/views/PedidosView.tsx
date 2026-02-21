import { useState, useMemo, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar, Filter, Loader2, TrendingUp, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../services/api';

export const PedidosView = ({ isDashboard = false }: { isDashboard?: boolean }) => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const fetchPedidos = async (inicio: string | null = null, fim: string | null = null) => {
        setLoading(true);
        try {
            // STAFF PATTERN: Rota modularizada com params via instância global
            const res = await api.get('/modules/orders/admin_list.php', {
                params: { inicio, fim }
            });
            setPedidos(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            toast.error("Erro ao sincronizar relatório de vendas.");
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPedidos(); }, []);

    // STAFF ANALYTICS: Agrupamento performático para o Recharts
    const chartData = useMemo(() => {
        if (!pedidos.length) return [];
        
        const groups = pedidos.reduce((acc: any, p: any) => {
            const date = new Date(p.data_hora).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + Number(p.total);
            return acc;
        }, {});
        
        // Retorna os últimos 10 dias de movimento para manter o gráfico limpo
        return Object.entries(groups)
            .map(([name, total]) => ({ name, total }))
            .reverse()
            .slice(-10);
    }, [pedidos]);

    const totalReceita = useMemo(() => 
        pedidos.reduce((acc, p) => acc + Number(p.total), 0)
    , [pedidos]);

    if (loading && !isDashboard) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-pink-500" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processando BI...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Barra de Filtros */}
            {!isDashboard && (
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Calendar size={16} className="text-slate-400 ml-2" />
                            <input type="date" className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                            <span className="text-slate-200">|</span>
                            <input type="date" className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                        </div>
                        <button 
                            onClick={() => fetchPedidos(dataInicio, dataFim)} 
                            className="bg-stone-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                        >
                            Filtrar
                        </button>
                        {(dataInicio || dataFim) && (
                            <button onClick={() => { setDataInicio(''); setDataFim(''); fetchPedidos(); }} className="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Performance */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <TrendingUp size={20} className="text-pink-500" /> Fluxo Financeiro
                            </h3>
                            <p className="text-slate-400 text-xs font-medium">Desempenho de vendas diárias</p>
                        </div>
                    </div>
                    
                    <div className="h-[280px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fontWeight: 500, fill: '#94a3b8' }} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={4} fill="url(#colorTotal)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                                Sem dados no período
                            </div>
                        )}
                    </div>
                </div>

                {/* Card de Faturamento */}
                <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl shadow-stone-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                        <ShoppingBag size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Faturamento Bruto</p>
                        <h2 className="text-5xl font-black mt-3 tracking-tighter">
                            <span className="text-pink-500 text-2xl mr-1">R$</span>
                            {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center relative z-10">
                        <div>
                            <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Volume de Pedidos</p>
                            <p className="text-2xl font-black tracking-tighter">{pedidos.length}</p>
                        </div>
                        <div className="bg-pink-500/20 text-pink-500 p-3 rounded-2xl">
                            <Filter size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Pedidos */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6">ID Pedido</th>
                                <th className="px-8 py-6">Data/Hora</th>
                                <th className="px-8 py-6">Itens Selecionados</th>
                                <th className="px-8 py-6 text-right">Montante</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {pedidos.map((p: any) => (
                                <tr key={p.pedido_grupo} className="hover:bg-slate-50/40 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                            #{p.pedido_grupo.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">
                                        {new Date(p.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-600 font-medium truncate max-w-md group-hover:text-slate-900 transition-colors">
                                            {p.itens}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-slate-800">
                                        R$ {Number(p.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};