import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Loader2, Upload, Edit3, Link2, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// STAFF INFRA
import api from '../../../services/api';

export const CategoriasView = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Utilitário Staff para SEO
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const fetchCats = async () => {
        try {
            // Rota modularizada unificada
            const res = await api.get('/modules/categories/categories.php');
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            toast.error("Falha ao sincronizar categorias."); 
        }
    };

    useEffect(() => { fetchCats(); }, []);

    const handleNameChange = (val: string) => {
        setNewName(val);
        if (!editingCategory) {
            setNewSlug(slugify(val));
        }
    };

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setNewName('');
        setNewSlug('');
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cat: any) => {
        setEditingCategory(cat);
        setNewName(cat.name);
        setNewSlug(cat.slug || '');
        setPreviewUrl(cat.image_url);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("Limite de 2MB para ícones de categoria.");
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const tid = toast.loading(editingCategory ? "Atualizando..." : "Criando...");

        const formData = new FormData();
        formData.append('name', newName);
        formData.append('slug', newSlug);
        
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        
        if (editingCategory) {
            formData.append('id', editingCategory.id);
        }

        try {
            // CORREÇÃO: Usando o endpoint correto 'categories.php' em vez de 'upsert.php'
            const res = await api.post('/modules/categories/categories.php', formData);
            
            if (res.data.success) {
                toast.success(editingCategory ? "Categoria atualizada!" : "Categoria criada!", { id: tid });
                setIsModalOpen(false);
                fetchCats();
            } else {
                throw new Error(res.data.message || "Erro no processamento");
            }
        } catch (err: any) {
            console.error("Submit Error:", err);
            toast.error(err.response?.data?.message || "Erro ao processar categoria", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm("Isso afetará a exibição dos produtos desta categoria. Confirmar exclusão?")) return;
        
        try {
            // CORREÇÃO: O seu PHP usa o switch DELETE que lê do $_GET['id']
            // Portanto, enviamos o verbo DELETE com o ID na Query String
            const res = await api.delete(`/modules/categories/categories.php?id=${id}`);
            
            if (res.data.success) {
                setCategories(prev => prev.filter(c => c.id !== id));
                toast.success("Categoria removida.");
            }
        } catch (err: any) { 
            console.error("Delete Error:", err);
            toast.error("Erro ao remover categoria."); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-stone-800 tracking-tight">Categorias</h2>
                    <p className="text-stone-400 text-sm font-medium">Organização do catálogo modular</p>
                </div>
                <button onClick={handleOpenCreate} className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-stone-200">
                    <Plus size={20} /> Nova Categoria
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="group bg-white p-4 rounded-[2rem] border border-stone-100 flex items-center gap-4 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100">
                            <img 
                                src={cat.image_url} 
                                alt={cat.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=Cat')} 
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-stone-800 text-lg leading-tight">{cat.name}</h4>
                            <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest mt-0.5">/{cat.slug}</p>
                            <div className="flex gap-4 mt-3">
                                <button onClick={() => handleOpenEdit(cat)} className="text-[10px] uppercase font-black text-stone-400 hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="text-[10px] uppercase font-black text-stone-400 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                                    <Trash2 size={12} /> Remover
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !loading && setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-stone-800">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                                    <p className="text-stone-400 text-xs font-medium">Defina o nome e a URL amigável</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-[2rem] border-2 border-dashed border-stone-100 bg-stone-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors hover:border-pink-200">
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-black uppercase tracking-widest">Trocar Ícone</div>
                                        </>
                                    ) : (
                                        <div className="text-center text-stone-300">
                                            <Upload className="mx-auto mb-2" />
                                            <span className="text-[10px] uppercase font-black tracking-widest">Capa da Categoria</span>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-stone-400 uppercase ml-2 tracking-widest">Nome de Exibição</label>
                                    <input type="text" required value={newName} onChange={e => handleNameChange(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none font-bold text-stone-700 focus:ring-2 focus:ring-pink-100" placeholder="Ex: Bolos de Festa" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-stone-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                                        <Link2 size={10} /> Slug (SEO)
                                    </label>
                                    <input type="text" required value={newSlug} onChange={e => setNewSlug(slugify(e.target.value))} className="w-full bg-stone-100 border-none rounded-2xl p-4 outline-none font-mono text-xs text-pink-600" placeholder="bolos-festa" />
                                </div>

                                <button disabled={loading} className="w-full bg-stone-900 text-white p-5 rounded-[1.5rem] font-black text-sm hover:bg-pink-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-stone-100 active:scale-95 disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin" /> : editingCategory ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR CATEGORIA'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};