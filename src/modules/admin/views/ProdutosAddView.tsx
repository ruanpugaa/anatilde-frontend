import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, UploadCloud, X, Plus, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../services/api';

export const ProdutosAddView = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    // STAFF: Estrutura de campos adicionais dinâmicos
    const [extraFields, setExtraFields] = useState<{ title: string; content: string }[]>([
        { title: '', content: '' }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        description: '',
        ingredients: '', // STAFF: Novo campo para listagem técnica
        is_easter_special: false,
        is_gift: false,
        image: null as File | null
    });

    useEffect(() => {
        api.get('/modules/categories/categories.php')
            .then(res => {
                setCategories(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: String(res.data[0].id) }));
                }
            })
            .catch(() => toast.error("Erro ao sincronizar categorias"));
    }, []);

    const addExtraField = () => {
        if (extraFields.length < 6) {
            setExtraFields([...extraFields, { title: '', content: '' }]);
        } else {
            toast.error("Limite de 6 campos adicionais atingido.");
        }
    };

    const removeExtraField = (index: number) => {
        setExtraFields(extraFields.filter((_, i) => i !== index));
    };

    const handleExtraFieldChange = (index: number, field: 'title' | 'content', value: string) => {
        const newFields = [...extraFields];
        newFields[index][field] = value;
        setExtraFields(newFields);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return toast.error("Arquivo excedeu o limite de 5MB.");
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.category_id) {
            return toast.error("Campos obrigatórios: Nome, Preço e Categoria.");
        }

        setLoading(true);
        const toastId = toast.loading("Enviando para o catálogo modular...");

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('ingredients', formData.ingredients); // STAFF: Append do novo campo
            data.append('is_easter_special', formData.is_easter_special ? '1' : '0');
            data.append('is_gift', formData.is_gift ? '1' : '0');
            
            const validExtras = extraFields.filter(f => f.title.trim() !== '' && f.content.trim() !== '');
            data.append('extra_info', JSON.stringify(validExtras));
            
            if (formData.image) data.append('image', formData.image);

            const res = await api.post('/modules/products/add.php', data);

            if (res.data.success) {
                toast.success("Produto indexado com sucesso!", { id: toastId });
                navigate('/admin/produtos');
            }
        } catch (error: any) {
            toast.error(error.friendlyMessage || "Falha na persistência dos dados", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4">
            <button 
                onClick={() => navigate('/admin/produtos')} 
                className="group flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold transition-all"
            >
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-pink-50 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Voltar para o catálogo
            </button>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna de Mídia */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Visual do Produto</label>
                        
                        <div className={`relative group aspect-square rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                            ${preview ? 'border-pink-200' : 'border-slate-200 bg-slate-50 hover:border-pink-300 hover:bg-pink-50/30'}`}>
                            
                            {preview ? (
                                <>
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                    <button type="button" onClick={removeImage} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all">
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-6 pointer-events-none">
                                    <UploadCloud size={40} className="mx-auto text-slate-300 mb-3 group-hover:text-pink-400 transition-colors" />
                                    <p className="text-sm font-bold text-slate-500">Selecionar Imagem</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Coluna de Dados */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">Especificações Técnicas</h2>
                            <p className="text-slate-400 text-sm font-medium">Preços e categorização comercial</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Título do Produto</label>
                                <input type="text" required placeholder="Ex: Brownie Recheado com Ninho" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-200 font-bold text-slate-700" />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Valor (R$)</label>
                                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-200 font-bold text-slate-700" />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Categoria</label>
                                <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-200 font-bold text-slate-700 cursor-pointer">
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Descrição Curta</label>
                                <textarea rows={2} placeholder="Peso, resumo comercial..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-200 font-medium text-slate-600 resize-none" />
                            </div>

                            {/* STAFF: CAMPO DE INGREDIENTES (TEXTO LONGO) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-2">
                                    <FileText size={14} className="text-pink-400" /> 
                                    Composição / Ingredientes
                                </label>
                                <textarea 
                                    rows={4} 
                                    placeholder="Liste os ingredientes linha por linha..." 
                                    value={formData.ingredients} 
                                    onChange={e => setFormData({...formData, ingredients: e.target.value})} 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-pink-200 font-medium text-slate-600 resize-y min-h-[100px]" 
                                />
                                <p className="mt-1 text-[10px] text-slate-400 font-medium">Pressione Enter para separar os itens da lista.</p>
                            </div>
                        </div>

                        {/* STAFF: SEÇÃO DE CAMPOS PERSONALIZADOS */}
                        <div className="pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Abas Extras (Acordion)</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                        <Info size={12} /> Outras informações dinâmicas
                                    </p>
                                </div>
                                <button type="button" onClick={addExtraField} className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-black hover:bg-pink-100 transition-colors">
                                    <Plus size={14} /> ADICIONAR ABA
                                </button>
                            </div>

                            <div className="space-y-4">
                                {extraFields.map((field, index) => (
                                    <div key={index} className="group relative grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-pink-100 transition-all">
                                        <input 
                                            placeholder="Título (Ex: Alergênicos)" 
                                            value={field.title}
                                            onChange={(e) => handleExtraFieldChange(index, 'title', e.target.value)}
                                            className="bg-white border-none rounded-xl p-3 text-xs font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-pink-200"
                                        />
                                        <input 
                                            placeholder="Conteúdo informativo..." 
                                            value={field.content}
                                            onChange={(e) => handleExtraFieldChange(index, 'content', e.target.value)}
                                            className="md:col-span-2 bg-white border-none rounded-xl p-3 text-xs font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-pink-200"
                                        />
                                        {extraFields.length > 1 && (
                                            <button type="button" onClick={() => removeExtraField(index)} className="absolute -right-2 -top-2 p-1.5 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <label className={`flex-1 min-w-[140px] flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 ${formData.is_easter_special ? 'bg-pink-50 border-pink-100' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                                <input type="checkbox" checked={formData.is_easter_special} onChange={e => setFormData({...formData, is_easter_special: e.target.checked})} className="w-5 h-5 accent-pink-500 rounded-lg" />
                                <span className="text-xs font-black text-slate-700 uppercase">Campanha Páscoa</span>
                            </label>
                            <label className={`flex-1 min-w-[140px] flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 ${formData.is_gift ? 'bg-pink-50 border-pink-100' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                                <input type="checkbox" checked={formData.is_gift} onChange={e => setFormData({...formData, is_gift: e.target.checked})} className="w-5 h-5 accent-pink-500 rounded-lg" />
                                <span className="text-xs font-black text-slate-700 uppercase">Item Presenteável</span>
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-pink-500 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                            {loading ? 'SINCRONIZANDO...' : 'PUBLICAR PRODUTO'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};