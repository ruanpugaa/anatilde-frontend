import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Save, Loader2, Globe } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../../services/api';

export const AbaSocial = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [social, setSocial] = useState({ 
        instagram_url: '', 
        facebook_url: '' 
    });

    useEffect(() => {
        const loadSocial = async () => {
            try {
                // STAFF PATTERN: Consumindo do endpoint de configurações globais
                const res = await api.get('/modules/settings/get.php');
                const data = res.data;
                setSocial({
                    instagram_url: data.instagram_url || '',
                    facebook_url: data.facebook_url || ''
                });
            } catch (err) {
                toast.error("Falha ao sincronizar redes sociais.");
            } finally {
                setLoading(false);
            }
        };
        loadSocial();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Atualizando ecossistema social...");

        try {
            const formData = new FormData();
            formData.append('instagram_url', social.instagram_url);
            formData.append('facebook_url', social.facebook_url);

            const res = await api.post('/modules/settings/update.php', formData);
            
            if (res.data.success) {
                toast.success("Presença digital atualizada!", { id: tid });
            }
        } catch (err: any) {
            toast.error(err.friendlyMessage || "Erro ao salvar configurações", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-pink-500" size={32} />
            <p className="text-stone-400 font-black text-[10px] uppercase tracking-widest">Conectando APIs...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <form onSubmit={handleSave} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 space-y-8 shadow-sm">
                
                <div className="space-y-6">
                    <header>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block mb-1">Canais Oficiais</label>
                        <p className="text-stone-500 text-sm font-medium">Links diretos para as páginas da Ana Tilde.</p>
                    </header>
                    
                    {/* Instagram */}
                    <div className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center text-pink-600 shrink-0 group-focus-within:shadow-lg group-focus-within:shadow-pink-100 transition-all duration-500">
                            <Instagram size={24} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[9px] font-black text-stone-300 uppercase ml-1">Instagram URL</span>
                            <input 
                                type="url" 
                                placeholder="https://instagram.com/anatilde" 
                                value={social.instagram_url} 
                                onChange={e => setSocial({...social, instagram_url: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-pink-200 transition-all placeholder:text-stone-300" 
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-focus-within:shadow-lg group-focus-within:shadow-blue-100 transition-all duration-500">
                            <Facebook size={24} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[9px] font-black text-stone-300 uppercase ml-1">Facebook URL</span>
                            <input 
                                type="url" 
                                placeholder="https://facebook.com/anatilde" 
                                value={social.facebook_url} 
                                onChange={e => setSocial({...social, facebook_url: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-stone-300" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-stone-50 pt-6">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-stone-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center gap-3 shadow-xl shadow-stone-200 disabled:opacity-50 active:scale-95"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Presença Social</>}
                    </button>
                </div>
            </form>
            
            <div className="p-6 bg-stone-900 rounded-[2rem] border border-stone-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-pink-500">
                    <Globe size={20} />
                </div>
                <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                    <strong className="text-white block uppercase tracking-widest mb-0.5">Nota de Implantação:</strong>
                    Certifique-se de incluir o protocolo <span className="text-pink-400 font-mono">https://</span> para garantir que os redirecionamentos externos funcionem em todos os navegadores.
                </p>
            </div>
        </motion.div>
    );
};