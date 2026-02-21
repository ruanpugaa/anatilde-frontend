import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Edit3, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../services/api';
import { Banner } from '../../../@types/banner';

export const BannersView = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBanners = async () => {
        try {
            // STAFF TIP: admin_list retorna todos os banners, inclusive inativos para gestão
            const res = await api.get('/modules/banners/banners.php');
            setBanners(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            toast.error("Erro ao sincronizar banners."); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleDelete = async (id: number | string) => {
        if (!confirm("Esta ação removerá o banner permanentemente da Home. Confirmar?")) return;
        
        const tid = toast.loading("Removendo asset...");
        try {
            const res = await api.post('/modules/banners/delete.php', { id });
            if (res.data.success) {
                setBanners(prev => prev.filter(b => b.id !== id));
                toast.success("Banner removido com sucesso!", { id: tid });
            }
        } catch (err) { 
            toast.error("Falha na exclusão.", { id: tid }); 
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm gap-4">
                <div>
                    <h2 className="text-3xl font-black text-stone-800 tracking-tight">Banners Hero</h2>
                    <p className="text-stone-400 text-sm font-medium">Gestão de campanhas e carrossel principal</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/banners/add')} 
                    className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-pink-600 transition-all shadow-xl shadow-stone-200 active:scale-95"
                >
                    <Plus size={20} /> ADICIONAR BANNER
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="animate-spin text-pink-500" size={40} />
                    <p className="text-stone-400 font-bold tracking-widest text-[10px] uppercase">Otimizando visualização...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {banners.map(banner => {
                        const isActive = Number(banner.is_active) === 1;
                        
                        return (
                            <div key={banner.id} className={`group bg-white p-6 rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 ${!isActive ? 'opacity-60 grayscale' : ''}`}>
                                {/* Preview do Aspect Ratio */}
                                <div className="w-full md:w-80 h-40 rounded-[2rem] overflow-hidden bg-stone-50 border border-stone-100 shrink-0 relative">
                                    <img 
                                        src={banner.image_url} 
                                        alt={banner.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        onError={(e) => e.currentTarget.src = 'https://placehold.co/1200x600?text=Banner+Error'}
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-stone-600 shadow-sm">
                                        Ord: {banner.order_priority}
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
                                        <h4 className="font-black text-stone-800 text-xl tracking-tight">{banner.title}</h4>
                                    </div>
                                    <p className="text-stone-500 text-sm font-medium line-clamp-1 italic">"{banner.subtitle}"</p>
                                    
                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                                            <ExternalLink size={12} className="text-pink-500" />
                                            <span className="text-[10px] font-bold text-stone-500 truncate max-w-[200px]">
                                                {banner.button_link || 'Sem link'}
                                            </span>
                                        </div>
                                        {isActive ? (
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 uppercase">Visível na Home</span>
                                        ) : (
                                            <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 uppercase">Arquivado</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3">
                                    <button 
                                        onClick={() => navigate(`/admin/banners/edit/${banner.id}`)} 
                                        className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-400 hover:text-white hover:bg-stone-900 flex items-center justify-center transition-all shadow-sm"
                                        title="Editar Design"
                                    >
                                        <Edit3 size={22} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(banner.id)} 
                                        className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-400 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all shadow-sm"
                                        title="Excluir Banner"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    {banners.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ImageIcon size={40} className="text-stone-200" />
                            </div>
                            <h3 className="text-stone-800 font-black text-xl">Sua vitrine está vazia</h3>
                            <p className="text-stone-400 text-sm mt-2 font-medium">Adicione banners para dar vida à página inicial.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};