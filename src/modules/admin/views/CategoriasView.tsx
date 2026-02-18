import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const CategoriasView = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCats = async () => {
        try {
            const res = await axios.get('https://anatilde.com.br/api/admin_categorias.php');
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Erro ao carregar categorias");
        }
    };

    useEffect(() => { fetchCats(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return toast.error("Digite o nome da categoria");

        setLoading(true);
        try {
            const res = await axios.post('https://anatilde.com.br/api/admin_categorias.php', { 
                name: newName.trim() 
            });
            
            if (res.data.success) {
                setNewName('');
                fetchCats();
                toast.success("Categoria adicionada!");
            }
        } catch (err: any) { 
            toast.error(err.response?.data?.message || "Erro ao adicionar"); 
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Aviso: Excluir esta categoria pode afetar produtos vinculados a ela. Continuar?")) return;
        
        try {
            // Enviando o ID via query string para o DELETE do PHP
            const res = await axios.delete(`https://anatilde.com.br/api/admin_categorias.php?id=${id}`);
            if (res.data.success) {
                setCategories(prev => prev.filter(c => c.id !== id));
                toast.success("Categoria removida!");
            }
        } catch (err: any) { 
            toast.error(err.response?.data?.message || "Erro ao remover"); 
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-800">Gerenciar Categorias</h2>
                    <p className="text-slate-400 text-sm">Crie grupos para organizar seus produtos</p>
                </div>
                
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newName} 
                        disabled={loading}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Ex: Doces de Páscoa, Kits..."
                        className="flex-1 bg-slate-50 border-none rounded-xl p-4 font-medium focus:ring-2 focus:ring-pink-100 disabled:opacity-50"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !newName}
                        className="bg-pink-500 text-white px-6 rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        Add
                    </button>
                </form>

                <div className="mt-8 space-y-2">
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500">
                                        <Tag size={16} />
                                    </div>
                                    {cat.name}
                                </div>
                                <button 
                                    onClick={() => handleDelete(cat.id)} 
                                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                    title="Excluir Categoria"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-10 text-slate-400 italic">Nenhuma categoria cadastrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};