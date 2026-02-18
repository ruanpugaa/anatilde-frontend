import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ProdutosEditView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carregar categorias e produto simultaneamente
                const [resCats, resProds] = await Promise.all([
                    axios.get('https://anatilde.com.br/api/admin_categorias.php'),
                    axios.get('https://anatilde.com.br/api/admin_produtos.php')
                ]);

                setCategories(resCats.data);

                const product = resProds.data.find((p: any) => Number(p.id) === Number(id));
                if (product) {
                    setFormData({
                        name: product.name || '',
                        category_id: String(product.category_id),
                        price: product.price || '',
                        description: product.description || '',
                        is_easter_special: Boolean(Number(product.is_easter_special)),
                        is_gift: Boolean(Number(product.is_gift)),
                        image: null
                    });
                    
                    if (product.image_url) {
                        const imgPath = product.image_url.startsWith('http') 
                            ? product.image_url 
                            : `https://anatilde.com.br/uploads/produtos/${product.image_url}`;
                        setPreview(imgPath);
                    }
                }
            } catch (err) {
                toast.error("Erro ao carregar dados.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Salvando...");

        try {
            const data = new FormData();
            data.append('id', id!);
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('is_easter_special', String(formData.is_easter_special));
            data.append('is_gift', String(formData.is_gift));
            if (formData.image) data.append('image', formData.image);

            const res = await axios.post('https://anatilde.com.br/api/admin_produtos_edit.php', data);
            if (res.data.success) {
                toast.success("Sucesso!", { id: tid });
                navigate('/admin/produtos');
            }
        } catch (err) {
            toast.error("Erro ao salvar", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-pink-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <button onClick={() => navigate('/admin/produtos')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors">
                <ArrowLeft size={20} /> Voltar
            </button>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h2 className="text-2xl font-black text-slate-800">Editar Produto</h2>
                    <button disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-600 transition-all">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Salvar Alterações
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Foto</label>
                        <div className="relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                            {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-slate-300" />}
                            <input type="file" accept="image/*" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData({...formData, image: file});
                                    setPreview(URL.createObjectURL(file));
                                }
                            }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <input type="text" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" step="0.01" placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium" />
                            
                            <select 
                                value={formData.category_id} 
                                onChange={e => setFormData({...formData, category_id: e.target.value})} 
                                className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <textarea rows={3} placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-4 font-medium" />
                        <div className="flex gap-4">
                            <label className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={formData.is_easter_special} onChange={e => setFormData({...formData, is_easter_special: e.target.checked})} /> Páscoa
                            </label>
                            <label className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={formData.is_gift} onChange={e => setFormData({...formData, is_gift: e.target.checked})} /> Presente
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};