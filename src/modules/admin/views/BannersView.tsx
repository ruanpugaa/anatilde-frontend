import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Edit3, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { bannerService } from '../../../services/bannerService';
import { Banner } from '../../../@types/banner';

export const BannersView = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBanners = async () => {
        try {
            const data = await bannerService.getAll();
            setBanners(data);
        } catch (err) { toast.error("Erro ao carregar"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Excluir este banner?")) return;
        try {
            await bannerService.delete(id);
            setBanners(prev => prev.filter(b => b.id !== id));
            toast.success("Removido!");
        } catch (err) { toast.error("Erro"); }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-stone-800 tracking-tight">Banners Hero</h2>
                    <p className="text-stone-400 text-sm">Gerencie o carrossel da página inicial</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/banners/add')} 
                    className="bg-stone-900 text-white px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 hover:bg-pink-500 transition-all shadow-lg"
                >
                    <Plus size={20} /> Novo Banner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-stone-200" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {banners.map(banner => (
                        <div key={banner.id} className="group bg-white p-6 rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-all">
                            <div className="w-full md:w-64 h-36 rounded-3xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                                <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${Number(banner.is_active) === 1 ? 'bg-green-500' : 'bg-stone-300'}`} />
                                    <h4 className="font-bold text-stone-800 text-xl">{banner.title}</h4>
                                </div>
                                <p className="text-stone-400 text-sm line-clamp-2 mb-4">{banner.subtitle}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest bg-stone-50 px-3 py-1 rounded-lg">Prioridade: {banner.order_priority}</span>
                                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest bg-stone-50 px-3 py-1 rounded-lg">Link: {banner.button_link}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => navigate(`/admin/banners/edit/${banner.id}`)} 
                                    className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-400 hover:text-pink-500 hover:bg-pink-50 flex items-center justify-center transition-all"
                                >
                                    <Edit3 size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(banner.id)} 
                                    className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {banners.length === 0 && (
                        <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-100 text-stone-300">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">Nenhum banner cadastrado</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};