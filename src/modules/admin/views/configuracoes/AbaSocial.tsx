import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Infraestrutura Staff
import { SettingsService } from '../../../../services/SettingsService';
import { ISettings } from '../../../../@types/settings';

export const AbaSocial = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Estado utilizando a interface global
    const [social, setSocial] = useState<Partial<ISettings>>({ 
        instagram_url: '', 
        facebook_url: '' 
    });

    useEffect(() => {
        const loadSocial = async () => {
            try {
                const data = await SettingsService.getSettings();
                setSocial({
                    instagram_url: data.instagram_url || '',
                    facebook_url: data.facebook_url || ''
                });
            } catch (err) {
                toast.error("Erro ao carregar redes sociais");
            } finally {
                setLoading(false);
            }
        };
        loadSocial();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        if (social.instagram_url) formData.append('instagram_url', social.instagram_url);
        if (social.facebook_url) formData.append('facebook_url', social.facebook_url);

        try {
            await SettingsService.updateSettings(formData);
            toast.success("Redes sociais atualizadas!");
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar redes sociais");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={32} />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Links das Redes Sociais</label>
                    
                    {/* Instagram */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0 group-focus-within:bg-pink-500 group-focus-within:text-white transition-all">
                            <Instagram size={20} />
                        </div>
                        <div className="flex-1">
                            <input 
                                type="url" 
                                placeholder="https://instagram.com/anatilde" 
                                value={social.instagram_url} 
                                onChange={e => setSocial({...social, instagram_url: e.target.value})} 
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-500/20 transition-all" 
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all">
                            <Facebook size={20} />
                        </div>
                        <div className="flex-1">
                            <input 
                                type="url" 
                                placeholder="https://facebook.com/anatilde" 
                                value={social.facebook_url} 
                                onChange={e => setSocial({...social, facebook_url: e.target.value})} 
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all flex items-center gap-3 shadow-xl shadow-slate-100 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Redes Sociais</>}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] text-slate-400 text-center italic">
                    Estes links serão utilizados nos ícones do cabeçalho e rodapé do site.
                </p>
            </div>
        </motion.div>
    );
};