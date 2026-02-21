import { useState, useEffect, useMemo } from 'react';
import { 
    Plus, Edit3, Trash2, Loader2, Eye, EyeOff, Filter, ChevronDown 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import api from '../../../services/api';
import { Product } from '../../../@types/product';

export const ProdutosListaView = () => {
    const navigate = useNavigate();
    
    // States
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

    /**
     * STAFF SANITIZER
     * Resolve o conflito de paths EN/PT e remove prefixos de API injetados pelo backend
     */
    const resolveProductImage = (path: string | null) => {
        if (!path) return 'https://placehold.co/600x400?text=Sem+Imagem';
        
        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('api/uploads/', 'uploads/')
            .replace(/products\//g, 'produtos/') // Regex global para garantir a troca
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/${cleanPath}`;
    };

    const fetchData = async () => {
        try {
            const [resProds, resCats] = await Promise.all([
                api.get('/modules/products/admin_list.php'),
                api.get('/modules/categories/categories.php')
            ]);
            setProdutos(Array.isArray(resProds.data) ? resProds.data : []);
            setCategorias(Array.isArray(resCats.data) ? resCats.data : []);
        } catch (err) {
            toast.error("Erro ao sincronizar dados com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Memoização dos produtos filtrados para evitar re-calculo desnecessário no render
    const produtosFiltrados = useMemo(() => {
        return filtroCategoria === 'todos' 
            ? produtos 
            : produtos.filter(p => String(p.category_id) === filtroCategoria);
    }, [produtos, filtroCategoria]);

    const handleToggleStatus = async (id: number | string, currentStatus: any) => {
        const newStatus = Number(currentStatus) === 1 ? 0 : 1;
        try {
            const res = await api.post('/modules/products/status.php', { id, active: newStatus });
            if (res.data.success) {
                setProdutos(prev => prev.map(p => p.id === id ? { ...p, active: newStatus } : p));
                toast.success("Visibilidade atualizada");
            }
        } catch (error) {
            toast.error("Erro ao alterar status.");
        }
    };

    const handleDelete = async (id: number | string, name: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

        try {
            const res = await api.post('/modules/products/delete.php', { id });
            if (res.data.success) {
                setProdutos(prev => prev.filter(p => p.id !== id));
                toast.success("Produto removido com sucesso");
            }
        } catch (error) {
            toast.error("Erro ao excluir produto.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-pink-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Catálogo de Produtos</h2>
                    <p className="text-slate-400 text-sm font-medium">Gerencie o inventário e visibilidade da loja</p>
                </div>
                <Link 
                    to="/admin/produtos/add" 
                    className="flex items-center gap-2 bg-slate-900 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200"
                >
                    <Plus size={20} /> Novo Produto
                </Link>
            </header>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {produtosFiltrados.map((prod) => {
                    const isActive = Number(prod.active) === 1;
                    
                    return (
                        <div key={prod.id} className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 ${!isActive ? 'opacity-80' : ''}`}>
                            {/* Imagem */}
                            <div className="h-64 bg-slate-50 relative overflow-hidden">
                                <img 
                                    src={resolveProductImage(prod.image_url)} 
                                    alt={prod.name} 
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isActive ? 'grayscale' : ''}`}
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('placehold.co')) {
                                            target.src = 'https://placehold.co/600x400?text=Erro+no+Caminho';
                                        }
                                    }}
                                />
                                {!isActive && (
                                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                        Oculto
                                    </div>
                                )}
                            </div>

                            {/* Conteúdo */}
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight">{prod.name}</h3>
                                <p className="text-slate-400 text-xs mb-6 line-clamp-2 h-8">{prod.description}</p>
                                
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Preço</span>
                                        <span className="text-slate-900 font-black text-xl italic">R$ {Number(prod.price).toFixed(2)}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(prod.id, prod.active)} 
                                            className="p-3 bg-slate-50 hover:bg-pink-50 rounded-2xl transition-colors"
                                            title={isActive ? "Ocultar produto" : "Exibir produto"}
                                        >
                                            {isActive ? <Eye size={20} className="text-pink-500" /> : <EyeOff size={20} className="text-slate-400" />}
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/admin/produtos/edit/${prod.id}`)} 
                                            className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
                                        >
                                            <Edit3 size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(prod.id, prod.name)} 
                                            className="p-3 bg-slate-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};