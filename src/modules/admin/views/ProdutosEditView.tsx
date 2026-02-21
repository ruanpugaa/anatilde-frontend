import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../services/api';
import { Product } from '../../../@types/product';

export const ProdutosEditView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // States de Controle
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        description: '',
        is_easter_special: false,
        is_gift: false,
        image: null as File | null
    });

    /**
     * STAFF SANITIZER - Idêntico ao do ListView para manter consistência total
     */
    const resolveProductImage = useCallback((path: string | null) => {
        if (!path) return null;
        
        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('api/uploads/', 'uploads/')
            .replace(/products\//g, 'produtos/') // Corrige o erro de inglês do backend
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/${cleanPath}`;
    }, []);

    useEffect(() => {
        const hydrateData = async () => {
            try {
                const [resCats, resProds] = await Promise.all([
                    api.get('/modules/categories/categories.php'),
                    api.get('/modules/products/admin_list.php')
                ]);

                setCategories(Array.isArray(resCats.data) ? resCats.data : []);
                
                const product = resProds.data.find((p: Product) => String(p.id) === String(id));
                
                if (product) {
                    setFormData({
                        name: product.name || '',
                        category_id: String(product.category_id),
                        price: String(product.price) || '',
                        description: product.description || '',
                        is_easter_special: Number(product.is_easter_special) === 1,
                        is_gift: Number(product.is_gift) === 1,
                        image: null
                    });
                    
                    // Aplica a sanitização no preview inicial
                    const sanitizedUrl = resolveProductImage(product.image_url);
                    setPreview(sanitizedUrl);
                } else {
                    toast.error("Produto não localizado no inventário.");
                    navigate('/admin/produtos');
                }
            } catch (err) {
                toast.error("Erro na sincronização de dados.");
            } finally {
                setLoading(false);
            }
        };

        hydrateData();
    }, [id, navigate, resolveProductImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            // Para arquivos locais (upload novo), usamos URL.createObjectURL direto
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Sincronizando alterações...");

        try {
            const data = new FormData();
            data.append('id', id!);
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('is_easter_special', formData.is_easter_special ? '1' : '0');
            data.append('is_gift', formData.is_gift ? '1' : '0');
            
            if (formData.image) {
                data.append('image', formData.image);
            }

            const res = await api.post('/modules/products/edit.php', data);
            
            if (res.data.success) {
                toast.success("Produto atualizado com sucesso!", { id: tid });
                navigate('/admin/produtos');
            } else {
                toast.error(res.data.error || "Erro ao salvar.", { id: tid });
            }
        } catch (err: any) {
            toast.error("Falha na comunicação com o servidor.", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-pink-500" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-tighter text-xs">Acessando Registro...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 p-4">
            <button 
                onClick={() => navigate('/admin/produtos')} 
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-pink-600 transition-all group"
            >
                <div className="bg-white p-2 rounded-xl border border-slate-100 group-hover:bg-pink-50 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Cancelar e Voltar
            </button>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Media Section */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Mídia do Produto</label>
                        
                        <div className="relative aspect-square rounded-[2rem] bg-slate-50 overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group hover:border-pink-300 transition-all">
                            {preview ? (
                                <img 
                                    src={preview} 
                                    className="w-full h-full object-cover" 
                                    alt="Preview" 
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('placehold.co')) {
                                            target.src = 'https://placehold.co/600x400?text=Erro+no+Caminho';
                                        }
                                    }} 
                                />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon size={48} className="text-slate-200 mx-auto mb-2" />
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">Nenhuma imagem</span>
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-xs font-black uppercase tracking-widest">Substituir Foto</span>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase">Recomendado: 1000x1000px (WebP/JPG)</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Editar Produto</h2>
                            <p className="text-slate-400 font-medium">Atualize as informações de preço, categoria e descrição</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Nome do Produto</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-pink-100 transition-all border-none text-slate-700" 
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Preço de Venda (R$)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    required 
                                    value={formData.price} 
                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                    className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-pink-100 transition-all border-none text-slate-700" 
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Categoria</label>
                                <div className="relative">
                                    <select 
                                        value={formData.category_id} 
                                        onChange={e => setFormData({...formData, category_id: e.target.value})} 
                                        className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none appearance-none border-none text-slate-700 cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Descrição</label>
                                <textarea 
                                    rows={4}
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                    className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-pink-100 transition-all border-none text-slate-700 resize-none" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-lg hover:bg-pink-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        PROCESSANDO...
                                    </>
                                ) : (
                                    <>
                                        <Save size={24} />
                                        SALVAR ALTERAÇÕES
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};