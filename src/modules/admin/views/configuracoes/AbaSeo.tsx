import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, Image as ImageIcon, Save, Loader2, Share2, Eye } from 'lucide-react';
import { toast } from 'sonner';

import api from '../../../../services/api';

export const AbaSEO = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const shareImageRef = useRef<HTMLInputElement>(null);

    const [settings, setSettings] = useState({
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        analytics_id: ''
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    /**
     * STAFF SANITIZER
     * Remove prefixos de API e garante que a imagem aponte para a raiz de uploads
     */
    const resolveSeoImage = useCallback((path: string | null) => {
        if (!path) return null;
        
        // Se já for um blob local (upload recém feito), não mexe
        if (path.startsWith('blob:')) return path;

        const cleanPath = path
            .replace('https://anatilde.com.br/api/', '')
            .replace('https://anatilde.com.br/', '')
            .replace('api/uploads/', 'uploads/')
            .replace(/^\/+/, '');

        return `https://anatilde.com.br/${cleanPath}`;
    }, []);

    useEffect(() => {
        const loadSEO = async () => {
            try {
                const res = await api.get('/modules/settings/get.php');
                const data = res.data;
                
                setSettings({
                    seo_title: data.seo_title || '',
                    seo_description: data.seo_description || '',
                    seo_keywords: data.seo_keywords || '',
                    analytics_id: data.analytics_id || ''
                });

                if (data.seo_share_image) {
                    setPreview(resolveSeoImage(data.seo_share_image));
                }
            } catch (err) {
                toast.error("Erro na hidratação dos dados de SEO.");
            } finally {
                setLoading(false);
            }
        };
        loadSEO();
    }, [resolveSeoImage]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Indexando metadados...");

        const formData = new FormData();
        formData.append('seo_title', settings.seo_title);
        formData.append('seo_description', settings.seo_description);
        formData.append('seo_keywords', settings.seo_keywords);
        formData.append('analytics_id', settings.analytics_id);
        
        if (file) formData.append('share_image', file);

        try {
            const res = await api.post('/modules/settings/update.php', formData);
            if (res.data.success) {
                toast.success("Otimização de SEO atualizada!", { id: tid });
                // Dispara evento para outros componentes que usem settings
                window.dispatchEvent(new Event('settingsUpdated'));
            }
        } catch (err: any) {
            toast.error(err.friendlyMessage || "Erro ao persistir SEO", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-stone-300">
            <Loader2 className="animate-spin text-pink-500" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Tags...</span>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            
            {/* Google Search Simulator */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Eye size={14} className="text-pink-500" /> Preview no Google
                </h3>
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 max-w-2xl">
                    <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-default truncate">
                        {settings.seo_title || "Título da Página | Ana Tilde Confeitaria"}
                    </p>
                    <p className="text-[#006621] text-sm mt-1 mb-2 truncate">
                        https://anatilde.com.br
                    </p>
                    <p className="text-[#545454] text-sm leading-relaxed line-clamp-2">
                        {settings.seo_description || "Aqui aparece a descrição do seu site nos resultados de busca do Google..."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white p-8 rounded-[3rem] border border-stone-100 space-y-8 shadow-sm">
                
                {/* Media Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">Social Share Image (Open Graph)</label>
                        <div 
                            onClick={() => shareImageRef.current?.click()}
                            className="aspect-video rounded-[2rem] bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer group overflow-hidden relative transition-all hover:border-pink-300 hover:bg-white"
                        >
                            {preview ? (
                                <img 
                                    src={preview} 
                                    className="w-full h-full object-cover shadow-inner" 
                                    alt="SEO Preview"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('placehold.co')) {
                                            target.src = 'https://placehold.co/600x400?text=Erro+na+Imagem+SEO';
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 text-stone-300 shadow-sm">
                                        <Share2 size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-tighter text-stone-400">Upload OG Image</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm">
                                <ImageIcon size={28} className="text-white mb-2" />
                                <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Substituir</span>
                            </div>
                        </div>
                        <input type="file" ref={shareImageRef} className="hidden" accept="image/*" onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { 
                                setFile(f); 
                                setPreview(URL.createObjectURL(f)); 
                            }
                        }} />
                    </div>
                    
                    <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 mt-8">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Checklist Staff:</p>
                        <ul className="text-[11px] text-stone-500 space-y-2 font-medium">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-pink-500 rounded-full" /> Dimensão recomendada: 1200x630px.</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-pink-500 rounded-full" /> Título ideal: entre 50 e 60 caracteres.</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-pink-500 rounded-full" /> Descrição ideal: até 160 caracteres.</li>
                        </ul>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Meta Title (H1 de Busca)</label>
                        <input 
                            type="text" value={settings.seo_title} 
                            onChange={e => setSettings({...settings, seo_title: e.target.value})} 
                            className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-pink-100 outline-none transition-all" 
                            placeholder="Ex: Anatilde | Confeitaria Artesanal e Presentes"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Meta Description</label>
                        <textarea 
                            value={settings.seo_description} 
                            onChange={e => setSettings({...settings, seo_description: e.target.value})} 
                            className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-stone-600 focus:ring-2 focus:ring-pink-100 outline-none transition-all h-28 resize-none" 
                            placeholder="Descreva seu negócio para o Google..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1 flex items-center gap-2">
                                <BarChart3 size={12} className="text-pink-500" /> Analytics Measurement ID
                            </label>
                            <input 
                                type="text" value={settings.analytics_id} 
                                onChange={e => setSettings({...settings, analytics_id: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-mono text-pink-600 focus:ring-2 focus:ring-pink-100 outline-none" 
                                placeholder="G-XXXXXXXXXX" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1 flex items-center gap-2">
                                <Search size={12} className="text-pink-500" /> Keywords (LSI)
                            </label>
                            <input 
                                type="text" value={settings.seo_keywords} 
                                onChange={e => setSettings({...settings, seo_keywords: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-pink-100 outline-none" 
                                placeholder="doces, bauru, gourmet, presentes"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-stone-50 pt-6">
                    <button 
                        type="submit" disabled={saving} 
                        className="bg-stone-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl shadow-stone-200 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Publicar Indexação</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};