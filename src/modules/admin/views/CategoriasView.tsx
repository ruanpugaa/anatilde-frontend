import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Plus, Tag, Loader2, X, Upload, Edit3, Link2 } from 'lucide-react'; // Adicionei Link2
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const CategoriasView = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState(''); // Novo estado para o Slug
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Função auxiliar para formatar o slug
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .normalize('NFD') // Remove acentos
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-') // Espaços por hifens
            .replace(/[^\w-]+/g, '') // Remove caracteres especiais
            .replace(/--+/g, '-'); // Remove hifens duplos
    };

    const fetchCats = async () => {
        try {
            const res = await axios.get('https://anatilde.com.br/api/admin_categorias.php');
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) { toast.error("Erro ao carregar"); }
    };

    useEffect(() => { fetchCats(); }, []);

    // Atualiza o slug automaticamente ao digitar o nome (apenas se for nova categoria)
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
        setNewSlug(cat.slug || ''); // Carrega o slug existente
        setPreviewUrl(cat.image_url);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', newName);
        formData.append('slug', newSlug); // Envia o slug para o PHP
        if (selectedFile) formData.append('image', selectedFile);
        if (editingCategory) formData.append('id', editingCategory.id);

        try {
            const res = await axios.post('https://anatilde.com.br/api/admin_categorias.php', formData);
            if (res.data.success) {
                toast.success(editingCategory ? "Atualizado!" : "Criado!");
                setIsModalOpen(false);
                fetchCats();
            }
        } catch (err) {
            toast.error("Erro ao processar");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Excluir esta categoria?")) return;
        try {
            await axios.delete(`https://anatilde.com.br/api/admin_categorias.php?id=${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success("Removida!");
        } catch (err) { toast.error("Erro"); }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header ... mantido igual */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-stone-800 tracking-tight">Categorias</h2>
                    <p className="text-stone-400 text-sm">Gerencie o conteúdo do site</p>
                </div>
                <button onClick={handleOpenCreate} className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-500 transition-all shadow-lg">
                    <Plus size={20} /> Nova Categoria
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="group bg-white p-4 rounded-[2rem] border border-stone-100 flex items-center gap-4 hover:shadow-xl transition-all">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-50">
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-stone-800 text-lg">{cat.name}</h4>
                            <p className="text-[10px] text-stone-400 font-mono">/{cat.slug}</p>
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => handleOpenEdit(cat)} className="text-[10px] uppercase font-bold text-stone-400 hover:text-pink-500 flex items-center gap-1 transition-colors">
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="text-[10px] uppercase font-bold text-stone-400 hover:text-red-500 flex items-center gap-1 transition-colors">
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl">
                            <h3 className="text-xl font-bold text-stone-800 mb-6">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-[2rem] border-2 border-dashed border-stone-100 bg-stone-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">Trocar Foto</div>
                                        </>
                                    ) : (
                                        <div className="text-center text-stone-400"><Upload className="mx-auto mb-2" /><span className="text-[10px] uppercase font-bold tracking-widest">Upload Imagem</span></div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                </div>

                                {/* Campo de Nome */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase ml-2 tracking-widest">Nome</label>
                                    <input type="text" required value={newName} onChange={e => handleNameChange(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none font-medium" placeholder="Ex: Bolos de Festa" />
                                </div>

                                {/* Campo de Slug */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                                        <Link2 size={10} /> URL Amigável (slug)
                                    </label>
                                    <input type="text" required value={newSlug} onChange={e => setNewSlug(slugify(e.target.value))} className="w-full bg-stone-100 border-none rounded-2xl p-4 outline-none font-mono text-sm text-pink-600" placeholder="bolos-festa" />
                                </div>

                                <button disabled={loading} className="w-full bg-stone-900 text-white p-5 rounded-2xl font-bold hover:bg-pink-500 transition-all flex items-center justify-center gap-2 mt-2">
                                    {loading ? <Loader2 className="animate-spin" /> : editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};