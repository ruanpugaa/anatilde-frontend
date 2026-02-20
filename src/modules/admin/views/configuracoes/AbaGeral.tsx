import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2, MousePointer2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Importações da nova infraestrutura
import { SettingsService } from '../../../../services/SettingsService';
import { ISettings } from '../../../../@types/settings';

export const AbaGeral = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const logoRef = useRef<HTMLInputElement>(null);
    const faviconRef = useRef<HTMLInputElement>(null);
    
    // Estado tipado com a nossa Interface global
    const [settings, setSettings] = useState<Partial<ISettings>>({
        site_name: '',
        site_description: '',
        store_address: ''
    });

    const [previews, setPreviews] = useState({ 
        logo: null as string | null, 
        favicon: null as string | null 
    });
    
    const [files, setFiles] = useState({ 
        logo: null as File | null, 
        favicon: null as File | null 
    });

    // Load inicial via Service
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await SettingsService.getSettings();
                
                setSettings({
                    site_name: data.site_name || '',
                    site_description: data.site_description || '',
                    store_address: data.store_address || ''
                });
                
                const baseUrl = 'https://anatilde.com.br/';
                setPreviews({
                    logo: data.site_logo ? `${baseUrl}${data.site_logo.replace(/^\//, '')}` : null,
                    favicon: data.site_favicon ? `${baseUrl}${data.site_favicon.replace(/^\//, '')}` : null
                });
            } catch (err) {
                toast.error("Erro ao carregar configurações");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        
        // Adiciona campos de texto
        if (settings.site_name) formData.append('site_name', settings.site_name);
        if (settings.site_description) formData.append('site_description', settings.site_description);
        if (settings.store_address) formData.append('store_address', settings.store_address);

        // Adiciona arquivos se houver alteração
        if (files.logo) formData.append('logo', files.logo);
        if (files.favicon) formData.append('favicon', files.favicon);

        try {
            const result = await SettingsService.updateSettings(formData);
            toast.success("Configurações gerais atualizadas!");

            // Dispara evento para o SEOManager atualizar o site em tempo real
            window.dispatchEvent(new Event('settingsUpdated'));

            // Se o servidor retornou novos paths (ex: após converter para WebP), atualizamos o preview
            if (result.paths) {
                const baseUrl = 'https://anatilde.com.br/';
                if (result.paths.site_logo) setPreviews(prev => ({ ...prev, logo: `${baseUrl}${result.paths.site_logo}` }));
                if (result.paths.site_favicon) setPreviews(prev => ({ ...prev, favicon: `${baseUrl}${result.paths.site_favicon}` }));
            }
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar");
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
            <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
                
                {/* Nome e Favicon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nome da Loja</label>
                        <input 
                            type="text" 
                            value={settings.site_name} 
                            onChange={e => setSettings({...settings, site_name: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Favicon</label>
                        <div className="flex items-center gap-4">
                            <div 
                                onClick={() => faviconRef.current?.click()} 
                                className="w-12 h-12 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-pink-300 transition-all overflow-hidden"
                            >
                                {previews.favicon ? <img src={previews.favicon} className="w-full h-full object-contain p-2" /> : <MousePointer2 size={14} className="text-slate-300" />}
                            </div>
                            <input type="file" ref={faviconRef} className="hidden" accept=".ico,.png" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFiles({...files, favicon: file});
                                    setPreviews({...previews, favicon: URL.createObjectURL(file)});
                                }
                            }} />
                            <span className="text-[10px] text-slate-400 font-medium">PNG ou ICO</span>
                        </div>
                    </div>
                </div>

                {/* Logo Principal */}
                <div className="space-y-2 pt-4 border-t border-slate-50">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logo Principal</label>
                    <div className="flex items-center gap-6">
                        <div 
                            onClick={() => logoRef.current?.click()} 
                            className="w-44 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all hover:border-pink-300"
                        >
                            {previews.logo ? <img src={previews.logo} className="w-full h-full object-contain p-4" /> : <Camera size={24} className="text-slate-300" />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[10px] text-white font-bold">TROCAR LOGO</span>
                            </div>
                        </div>
                        <input type="file" ref={logoRef} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFiles({...files, logo: file});
                                setPreviews({...previews, logo: URL.createObjectURL(file)});
                            }
                        }} />
                        <div className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                            <p>• Prefira arquivos com fundo transparente.</p>
                            <p>• O sistema converterá para WebP automaticamente.</p>
                        </div>
                    </div>
                </div>

                {/* Endereço e Descrição */}
                <div className="space-y-6 pt-4 border-t border-slate-50">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descrição da Marca (Rodapé)</label>
                        <textarea 
                            value={settings.site_description}
                            onChange={e => setSettings({...settings, site_description: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-pink-500/20 font-medium h-24 resize-none"
                            placeholder="Conte um pouco sobre a doceria..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Endereço Completo</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text" 
                                value={settings.store_address} 
                                onChange={e => setSettings({...settings, store_address: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                                placeholder="Rua, Número, Bairro - Cidade"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-100"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Alterações</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};