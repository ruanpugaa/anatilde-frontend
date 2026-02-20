import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Upload, Save, Loader2, Image as ImageIcon, Link as LinkIcon, Type, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { bannerService } from '../../../services/bannerService';

export const BannersFormView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    
    // Estados do Formulário
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [buttonLink, setButtonLink] = useState('/delicias');
    const [orderPriority, setOrderPriority] = useState('0');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadBanner();
        }
    }, [id]);

    const loadBanner = async () => {
        setFetching(true);
        try {
            const banners = await bannerService.getAll();
            const banner = banners.find(b => b.id === Number(id));
            if (banner) {
                setTitle(banner.title);
                setSubtitle(banner.subtitle || '');
                setButtonLink(banner.button_link);
                setOrderPriority(String(banner.order_priority));
                setIsActive(Boolean(Number(banner.is_active)));
                setPreviewUrl(banner.image_url);
                setExistingImageUrl(banner.image_url);
            }
        } catch (err) {
            toast.error("Erro ao carregar dados do banner");
        } finally {
            setFetching(false);
        }
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
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('button_link', buttonLink);
        formData.append('order_priority', orderPriority);
        formData.append('is_active', String(isActive));

        if (selectedFile) {
            formData.append('image', selectedFile);
        } else if (existingImageUrl) {
            formData.append('existing_image', existingImageUrl);
        }

        if (id) {
            formData.append('id', id);
        }

        try {
            await bannerService.save(formData as any);
            toast.success(id ? "Banner atualizado!" : "Banner criado com sucesso!");
            navigate('/admin/banners');
        } catch (err) {
            toast.error("Erro ao salvar banner");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-pink-500" size={40} /></div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Link to="/admin/banners" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-400 hover:text-stone-900 shadow-sm border border-stone-100 transition-all">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-stone-800 tracking-tight">
                            {id ? 'Editar Banner' : 'Novo Banner Hero'}
                        </h2>
                        <p className="text-stone-400 text-sm">Configure o visual da sua vitrine principal</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna da Esquerda: Upload e Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative aspect-[3/4] lg:aspect-[9/16] rounded-[2.5rem] border-2 border-dashed border-stone-200 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-pink-300 transition-all shadow-sm"
                    >
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold gap-2">
                                    <Upload size={20} /> Trocar Imagem
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-300">
                                    <ImageIcon size={32} />
                                </div>
                                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Upload Banner</p>
                                <p className="text-stone-300 text-[10px] mt-2 italic">Recomendado: 1920x800px</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="font-bold text-stone-700">Status do Banner</span>
                            <div 
                                onClick={() => setIsActive(!isActive)}
                                className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${isActive ? 'bg-green-500' : 'bg-stone-200'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </label>
                        <p className="text-[10px] text-stone-400 mt-3 leading-relaxed uppercase font-bold">
                            {isActive ? 'Ativo: visível no slider principal' : 'Inativo: banner oculto para clientes'}
                        </p>
                    </div>
                </div>

                {/* Coluna da Direita: Campos de Texto */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Título do Slide</label>
                            <div className="relative">
                                <Type className="absolute left-5 top-5 text-stone-300" size={20} />
                                <input 
                                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-bold text-stone-800 placeholder:text-stone-300"
                                    placeholder="Ex: Coleção de Páscoa"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Subtítulo / Descrição</label>
                            <textarea 
                                value={subtitle} onChange={e => setSubtitle(e.target.value)}
                                className="w-full bg-stone-50 border-none rounded-2xl p-5 outline-none font-medium text-stone-600 placeholder:text-stone-300 h-32 resize-none"
                                placeholder="Descreva brevemente a promoção ou o sentimento do slide..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Link do Botão</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-5 top-5 text-stone-300" size={20} />
                                    <input 
                                        type="text" value={buttonLink} onChange={e => setButtonLink(e.target.value)}
                                        className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-medium text-stone-800"
                                        placeholder="/delicias"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Prioridade</label>
                                <div className="relative">
                                    <Layers className="absolute left-5 top-5 text-stone-300" size={20} />
                                    <input 
                                        type="number" value={orderPriority} onChange={e => setOrderPriority(e.target.value)}
                                        className="w-full bg-stone-50 border-none rounded-2xl p-5 pl-14 outline-none font-bold text-pink-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full bg-stone-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-pink-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={22} /> {id ? 'Salvar Alterações' : 'Publicar no Slider'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};