import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Upload, Save, Loader2, Image as ImageIcon, Link as LinkIcon, Type, Layers } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../services/api';
import { Banner } from '../../../@types/banner';

export const BannersFormView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        button_link: '/delicias',
        order_priority: '0',
        is_active: true,
        selectedFile: null as File | null,
        previewUrl: null as string | null
    });

    useEffect(() => {
        if (id) {
            loadBanner();
        }
    }, [id]);

    const loadBanner = async () => {
        setFetching(true);
        try {
            // STAFF PATTERN: Busca no endpoint unificado
            const res = await api.get('/modules/banners/banners.php');
            const banner = res.data.find((b: Banner) => String(b.id) === String(id));
            
            if (banner) {
                setFormData({
                    title: banner.title,
                    subtitle: banner.subtitle || '',
                    button_link: banner.button_link || '/delicias',
                    order_priority: String(banner.order_priority),
                    is_active: Number(banner.is_active) === 1,
                    selectedFile: null,
                    previewUrl: banner.image_url
                });
            } else {
                toast.error("Banner não localizado.");
                navigate('/admin/banners');
            }
        } catch (err) {
            toast.error("Erro na sincronização dos dados do banner.");
        } finally {
            setFetching(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return toast.error("Arquivo muito grande (Máx 5MB).");
            setFormData(prev => ({
                ...prev,
                selectedFile: file,
                previewUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const tid = toast.loading("Processando imagem e salvando...");

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('button_link', formData.button_link);
            data.append('order_priority', formData.order_priority);
            
            // STAFF SYNC: PHP espera string 'true'/'false' no seu switch
            data.append('is_active', formData.is_active ? 'true' : 'false');

            if (formData.selectedFile) {
                data.append('image', formData.selectedFile);
            }

            // Se for edição, enviamos o ID para o banners.php decidir pelo UPDATE
            if (id) {
                data.append('id', id);
            }

            // CORREÇÃO: Endpoint unificado conforme seu PHP modular
            const res = await api.post('/modules/banners/banners.php', data);

            if (res.data.success) {
                toast.success(id ? "Campanha atualizada!" : "Banner publicado!", { id: tid });
                navigate('/admin/banners');
            } else {
                throw new Error(res.data.error || "Erro desconhecido no servidor");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.error || "Erro ao persistir banner", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-pink-500" size={40} />
                <p className="text-stone-400 font-bold uppercase tracking-tighter">Hidratando UI...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/admin/banners" className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black text-stone-800 tracking-tight">
                            {id ? 'Editar Campanha' : 'Criar Vitrine'}
                        </h2>
                        <p className="text-stone-400 text-xs font-medium">Configure o visual principal do e-commerce</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-1 space-y-6">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative aspect-[3/4] lg:aspect-[9/16] rounded-[2.5rem] border-2 border-dashed border-stone-200 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-pink-300 transition-all shadow-sm"
                    >
                        {formData.previewUrl ? (
                            <>
                                <img src={formData.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-black text-xs uppercase tracking-widest gap-2">
                                    <Upload size={20} /> Substituir Mídia
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-300">
                                    <ImageIcon size={32} />
                                </div>
                                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Clique para Upload</p>
                                <p className="text-stone-300 text-[9px] mt-2 italic">Formatos: JPG, WEBP, PNG</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
                        <div className="flex items-center justify-between group">
                            <span className="font-black text-xs uppercase tracking-widest text-stone-500">Publicação Ativa</span>
                            <button 
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                                className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_active ? 'bg-emerald-500' : 'bg-stone-200'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Chamada Principal (H1)</label>
                            <div className="relative">
                                <Type className="absolute left-5 top-5 text-stone-300" size={20} />
                                <input 
                                    type="text" required value={formData.title} 
                                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                    className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-bold text-stone-800 focus:ring-2 focus:ring-pink-100"
                                    placeholder="Ex: O Natal Chegou!"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Texto Auxiliar</label>
                            <textarea 
                                value={formData.subtitle} 
                                onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))}
                                className="w-full bg-stone-50 border-none rounded-2xl p-5 outline-none font-medium text-stone-600 h-32 resize-none focus:ring-2 focus:ring-pink-100"
                                placeholder="Descreva os produtos..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">URL de Destino</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-5 top-5 text-stone-300" size={20} />
                                    <input 
                                        type="text" value={formData.button_link} 
                                        onChange={e => setFormData(p => ({ ...p, button_link: e.target.value }))}
                                        className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-medium text-stone-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Ordem de Exibição</label>
                                <div className="relative">
                                    <Layers className="absolute left-5 top-5 text-stone-300" size={20} />
                                    <input 
                                        type="number" value={formData.order_priority} 
                                        onChange={e => setFormData(p => ({ ...p, order_priority: e.target.value }))}
                                        className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-black text-pink-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full bg-stone-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={22} /> {id ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR VITRINE'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};