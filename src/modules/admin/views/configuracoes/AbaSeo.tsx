import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Infraestrutura centralizada
import { SettingsService } from '../../../../services/SettingsService';
import { ISettings } from '../../../../@types/settings';

export const AbaSEO = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const shareImageRef = useRef<HTMLInputElement>(null);

    // Estado tipado
    const [settings, setSettings] = useState<Partial<ISettings>>({
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        analytics_id: ''
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const loadSEO = async () => {
            try {
                const data = await SettingsService.getSettings();
                setSettings({
                    seo_title: data.seo_title || '',
                    seo_description: data.seo_description || '',
                    seo_keywords: data.seo_keywords || '',
                    analytics_id: data.analytics_id || ''
                });

                if (data.seo_share_image) {
                    setPreview(`https://anatilde.com.br/${data.seo_share_image.replace(/^\//, '')}`);
                }
            } catch (err) {
                toast.error("Erro ao carregar dados de SEO");
            } finally {
                setLoading(false);
            }
        };
        loadSEO();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        
        // Mapeamento explícito baseado no tipo ISettings
        if (settings.seo_title) formData.append('seo_title', settings.seo_title);
        if (settings.seo_description) formData.append('seo_description', settings.seo_description);
        if (settings.seo_keywords) formData.append('seo_keywords', settings.seo_keywords);
        if (settings.analytics_id) formData.append('analytics_id', settings.analytics_id);
        
        // Arquivo de compartilhamento social (OG Image)
        if (file) formData.append('share_image', file);

        try {
            const result = await SettingsService.updateSettings(formData);
            toast.success("Configurações de SEO atualizadas!");

            // Notifica o SEOManager global para atualizar as tags no <head>
            window.dispatchEvent(new Event('settingsUpdated'));

            // Atualiza o preview se o servidor retornar um novo caminho WebP
            if (result.paths?.seo_share_image) {
                setPreview(`https://anatilde.com.br/${result.paths.seo_share_image}`);
            }
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar SEO");
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
                
                {/* Imagem de Compartilhamento Social */}
                <div className="space-y-4 mb-8">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Share Image (OG Image)</label>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div 
                            onClick={() => shareImageRef.current?.click()}
                            className="w-full md:w-64 aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group overflow-hidden relative transition-all hover:border-pink-300"
                        >
                            {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon size={28} className="text-slate-300" />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold">ALTERAR IMAGEM</div>
                        </div>
                        <input 
                            type="file" 
                            ref={shareImageRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) { 
                                    setFile(f); 
                                    setPreview(URL.createObjectURL(f)); 
                                }
                            }} 
                        />
                        <div className="flex-1 text-[11px] text-slate-400 flex flex-col justify-center space-y-2">
                            <p className="font-bold text-slate-600 uppercase tracking-tighter">Padrão Staff de Qualidade:</p>
                            <p>Esta imagem aparece no WhatsApp e Redes Sociais. Use 1200x630px para evitar cortes indesejados.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Title (Título de Busca)</label>
                    <input 
                        type="text" 
                        value={settings.seo_title} 
                        onChange={e => setSettings({...settings, seo_title: e.target.value})} 
                        className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" 
                        placeholder="Ex: Anatilde | Os melhores doces gourmet de Bauru"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Description</label>
                    <textarea 
                        value={settings.seo_description} 
                        onChange={e => setSettings({...settings, seo_description: e.target.value})} 
                        className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all h-24 resize-none" 
                        placeholder="Breve descrição que aparece nos resultados do Google..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <BarChart3 size={12} /> Google Analytics ID
                        </label>
                        <input 
                            type="text" 
                            value={settings.analytics_id} 
                            onChange={e => setSettings({...settings, analytics_id: e.target.value})} 
                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-mono focus:ring-2 focus:ring-pink-500/20 outline-none" 
                            placeholder="G-XXXXXXXXXX" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Search size={12} /> Keywords (Separadas por vírgula)
                        </label>
                        <input 
                            type="text" 
                            value={settings.seo_keywords} 
                            onChange={e => setSettings({...settings, seo_keywords: e.target.value})} 
                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-pink-500/20 outline-none font-medium" 
                            placeholder="doces, bauru, confeitaria, gourmet"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all shadow-xl shadow-slate-100 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Configurações SEO</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};