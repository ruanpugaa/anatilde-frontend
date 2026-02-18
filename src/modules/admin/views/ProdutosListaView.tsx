import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit3, Trash2, Tag, Filter, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProdutosListaView = () => {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [resProds, resCats] = await Promise.all([
                axios.get('https://anatilde.com.br/api/admin_produtos.php'),
                axios.get('https://anatilde.com.br/api/admin_categorias.php')
            ]);
            setProdutos(Array.isArray(resProds.data) ? resProds.data : []);
            setCategorias(Array.isArray(resCats.data) ? resCats.data : []);
        } catch (err) {
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // FUNÇÃO PARA DELETAR PRODUTO
    const handleDelete = async (id: number, name: string) => {
        const confirmar = window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`);
        
        if (confirmar) {
            const toastId = toast.loading("Excluindo produto...");
            try {
                // Certifique-se de que este endpoint existe no seu PHP
                const res = await axios.post('https://anatilde.com.br/api/admin_produtos_delete.php', { id });

                if (res.data.success) {
                    toast.success("Produto removido com sucesso!", { id: toastId });
                    // Atualiza a lista local removendo o item deletado
                    setProdutos(prev => prev.filter(p => p.id !== id));
                } else {
                    toast.error(res.data.message || "Erro ao excluir", { id: toastId });
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro de conexão com o servidor", { id: toastId });
            }
        }
    };

    const produtosFiltrados = filtroCategoria === 'todos' 
        ? produtos 
        : produtos.filter(p => String(p.category_id) === filtroCategoria);

    const nomeCategoriaAtiva = categorias.find(c => String(c.id) === filtroCategoria)?.name || 'Todos';

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <p className="text-slate-400 font-bold">Carregando catálogo...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Produtos</h2>
                    <p className="text-slate-400 text-sm font-medium">Gerencie seu catálogo de delícias</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                                filtroCategoria !== 'todos' 
                                ? 'bg-pink-50 border-pink-100 text-pink-600' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            <Filter size={18} />
                            {filtroCategoria === 'todos' ? 'Filtrar' : nomeCategoriaAtiva}
                            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-2 max-h-64 overflow-y-auto">
                                    <button 
                                        onClick={() => { setFiltroCategoria('todos'); setIsOpen(false); }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 text-slate-700"
                                    >
                                        Ver Todos
                                        {filtroCategoria === 'todos' && <Check size={16} className="text-pink-500" />}
                                    </button>
                                    <div className="h-px bg-slate-50 my-1" />
                                    {categorias.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => { setFiltroCategoria(String(cat.id)); setIsOpen(false); }}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 text-slate-700"
                                        >
                                            {cat.name}
                                            {filtroCategoria === String(cat.id) && <Check size={16} className="text-pink-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/admin/produtos/add" className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                        <Plus size={18} /> Novo
                    </Link>
                </div>
            </div>

            {produtosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produtosFiltrados.map((prod) => (
                        <div key={prod.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="h-56 bg-slate-50 relative overflow-hidden">
                                <img 
                                    src={prod.image_url?.startsWith('http') ? prod.image_url : `https://anatilde.com.br/uploads/produtos/${prod.image_url}`} 
                                    alt={prod.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Sem+Imagem' }}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/20">
                                    <Tag size={12} className="text-pink-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                                        {categorias.find(c => String(c.id) === String(prod.category_id))?.name || 'Geral'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{prod.name}</h3>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-6 h-8">{prod.description}</p>
                                
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-300 uppercase">Preço</span>
                                        <span className="text-slate-900 font-black text-xl">R$ {Number(prod.price).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex gap-2 relative z-10">
                                        <button 
                                            onClick={() => navigate(`/admin/produtos/edit/${prod.id}`)}
                                            className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 transition-all bg-slate-50 rounded-2xl"
                                            title="Editar"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(prod.id, prod.name)}
                                            className="p-3 text-slate-400 hover:text-white hover:bg-red-500 transition-all bg-slate-50 rounded-2xl"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Filter size={40} />
                    </div>
                    <h3 className="text-slate-800 font-black text-xl">Nenhum produto em "{nomeCategoriaAtiva}"</h3>
                    <button onClick={() => setFiltroCategoria('todos')} className="mt-4 text-pink-500 font-bold hover:underline">Limpar filtros</button>
                </div>
            )}
        </div>
    );
};