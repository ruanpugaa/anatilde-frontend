import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Plus, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../services/api';

export const ProdutosEditView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [extraFields, setExtraFields] = useState<{ title: string; content: string }[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        description: '',
        ingredients: '', 
        is_easter_special: false,
        is_gift: false,
        image: null as File | null
    });

    const resolveProductImage = useCallback((path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace('api/uploads/', 'uploads/').replace(/products\//g, 'produtos/').replace(/^\/+/, '');
        return `https://anatilde.com.br/uploads/produtos/${cleanPath}`;
    }, []);

    useEffect(() => {
        const hydrateData = async () => {
            try {
                // STAFF: t=${Date.now()} força o servidor a ignorar caches de rota
                const [resCats, resProds] = await Promise.all([
                    api.get('/modules/categories/categories.php'),
                    api.get(`/modules/products/admin_list.php?t=${Date.now()}`)
                ]);

                setCategories(Array.isArray(resCats.data) ? resCats.data : []);
                const product = resProds.data.find((p: any) => String(p.id) === String(id));
                
                if (product) {
                    // --- STAFF AUDIT LOG ---
                    console.group(`🔎 Audit: Carregando Produto ID ${id}`);
                    console.log("Objeto bruto recebido da API:", product);
                    console.log("Valor de 'ingredients' no JSON:", product.ingredients);
                    console.groupEnd();
                    // -----------------------

                    setFormData({
                        name: product.name || '',
                        category_id: String(product.category_id),
                        price: String(product.price) || '',
                        description: product.description || '',
                        ingredients: product.ingredients || '', // Sincronização aqui
                        is_easter_special: Number(product.is_easter_special) === 1,
                        is_gift: Number(product.is_gift) === 1,
                        image: null
                    });
                    
                    if (product.extra_info) {
                        try {
                            const parsed = typeof product.extra_info === 'string' ? JSON.parse(product.extra_info) : product.extra_info;
                            setExtraFields(Array.isArray(parsed) ? parsed : []);
                        } catch (e) {
                            setExtraFields([]);
                        }
                    }

                    setPreview(resolveProductImage(product.image_url));
                } else {
                    toast.error("Produto não localizado.");
                    navigate('/admin/produtos');
                }
            } catch (err) {
                console.error("Erro na hidratação:", err);
                toast.error("Erro ao sincronizar com servidor.");
            } finally {
                setLoading(false);
            }
        };
        hydrateData();
    }, [id, navigate, resolveProductImage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Salvando edições...");

        try {
            const data = new FormData();
            data.append('id', id!);
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('ingredients', formData.ingredients); 
            data.append('is_easter_special', formData.is_easter_special ? '1' : '0');
            data.append('is_gift', formData.is_gift ? '1' : '0');
            
            const validExtras = extraFields.filter(f => f.title.trim() !== '' || f.content.trim() !== '');
            data.append('extra_info', JSON.stringify(validExtras));
            if (formData.image) data.append('image', formData.image);

            const res = await api.post('/modules/products/edit.php', data);
            
            if (res.data.success) {
                toast.success("Catálogo atualizado!", { id: tid });
                navigate('/admin/produtos');
            } else {
                toast.error(res.data.error || "Erro na gravação.", { id: tid });
            }
        } catch (err) {
            toast.error("Falha na conexão.", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center">Sincronizando com a nuvem...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 p-4">
            <button onClick={() => navigate('/admin/produtos')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-pink-600 transition-all group">
                <div className="bg-white p-2 rounded-xl border border-slate-100 group-hover:bg-pink-50 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Painel Geral
            </button>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6 text-center">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mídia Principal</label>
                        <div className="relative aspect-square rounded-[2rem] bg-slate-50 overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group hover:border-pink-300 transition-all cursor-pointer shadow-inner">
                            {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon size={48} className="text-slate-200" />}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Trocar Foto</span>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, image: file }));
                                    setPreview(URL.createObjectURL(file));
                                }
                            }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <header>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight italic font-serif">Ajustar Detalhes</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase mt-1 tracking-widest">Product Reference: {id}</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Nome do Produto</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none border-none text-slate-700 focus:ring-2 focus:ring-pink-100" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Preço de Venda (R$)</label>
                                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none border-none text-slate-700 focus:ring-2 focus:ring-pink-100" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Categoria</label>
                                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none border-none text-slate-700 cursor-pointer appearance-none">
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Descrição Resumida</label>
                                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none border-none text-slate-700 resize-none focus:ring-2 focus:ring-pink-100" />
                            </div>

                            {/* STAFF: CAMPO DE INGREDIENTES */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">
                                    <FileText size={14} className="text-pink-400" /> Ingredientes & Composição
                                </label>
                                <textarea 
                                    rows={5} 
                                    value={formData.ingredients} 
                                    onChange={e => setFormData({...formData, ingredients: e.target.value})} 
                                    placeholder="Lista detalhada dos componentes..."
                                    className="w-full bg-slate-50 rounded-2xl p-5 font-medium outline-none border-none text-slate-600 resize-y focus:ring-2 focus:ring-pink-100 min-h-[120px]" 
                                />
                            </div>
                        </div>

                        {/* Abas Extras */}
                        <div className="pt-8 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">Abas Personalizadas</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Para informações nutricionais ou técnicas</p>
                                </div>
                                <button type="button" onClick={() => setExtraFields([...extraFields, { title: '', content: '' }])} className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-[10px] font-black hover:bg-pink-100 transition-all shadow-sm">
                                    <Plus size={14} /> NOVA ABA
                                </button>
                            </div>

                            <div className="space-y-4">
                                {extraFields.map((field, index) => (
                                    <div key={`extra-${index}`} className="group relative grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-pink-200 transition-all">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-300 uppercase ml-1">Título Aba</span>
                                            <input value={field.title} onChange={(e) => {
                                                const updated = [...extraFields];
                                                updated[index].title = e.target.value;
                                                setExtraFields(updated);
                                            }} className="w-full bg-white border-none rounded-xl p-3 text-xs font-bold text-slate-800 shadow-sm outline-none" />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <span className="text-[9px] font-black text-slate-300 uppercase ml-1">Conteúdo</span>
                                            <input value={field.content} onChange={(e) => {
                                                const updated = [...extraFields];
                                                updated[index].content = e.target.value;
                                                setExtraFields(updated);
                                            }} className="w-full bg-white border-none rounded-xl p-3 text-xs font-medium text-slate-600 shadow-sm outline-none" />
                                        </div>
                                        <button type="button" onClick={() => setExtraFields(extraFields.filter((_, i) => i !== index))} className="absolute -right-2 -top-2 p-1.5 bg-red-100 text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Configurações de Campanha */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <label className={`flex items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all border-2 ${formData.is_easter_special ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-transparent'}`}>
                                <input type="checkbox" checked={formData.is_easter_special} onChange={e => setFormData({...formData, is_easter_special: e.target.checked})} className="w-5 h-5 accent-pink-500 rounded-lg" />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Especial Páscoa</span>
                            </label>
                            <label className={`flex items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all border-2 ${formData.is_gift ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-transparent'}`}>
                                <input type="checkbox" checked={formData.is_gift} onChange={e => setFormData({...formData, is_gift: e.target.checked})} className="w-5 h-5 accent-pink-500 rounded-lg" />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Disponível p/ Presente</span>
                            </label>
                        </div>

                        <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white p-7 rounded-[2.2rem] font-black text-lg hover:bg-pink-600 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]">
                            {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                            {saving ? 'PROCESSANDO...' : 'SALVAR ALTERAÇÕES'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};