import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2, MousePointer2, MapPin, Store, Info } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../../services/api';

/**
 * STAFF ARCHITECTURE: AbaGeral (Branding & Identity)
 * - Integração nativa com CDN Otimizado.
 * - Gerenciamento de memória para previews (Blob Cleanup).
 * - Consumo passivo de URLs absolutas via Backend.
 */
export const AbaGeral = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const logoRef = useRef<HTMLInputElement>(null);
    const faviconRef = useRef<HTMLInputElement>(null);
    
    // STAFF: Constante do CDN para garantir sincronia no pós-upload
    const CDN_URL = "https://cdn.anatilde.com.br/";

    const [settings, setSettings] = useState({
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

    useEffect(() => {
        const loadData = async () => {
            try {
                /**
                 * STAFF PATTERN: 
                 * O get.php já retorna URLs completas (https://cdn.anatilde.com.br/...)
                 * eliminando a necessidade de tratamentos de string no frontend.
                 */
                const res = await api.get('/modules/settings/get.php');
                const data = res.data;
                
                setSettings({
                    site_name: data.site_name || '',
                    site_description: data.site_description || '',
                    store_address: data.store_address || ''
                });
                
                setPreviews({
                    logo: data.site_logo || null,
                    favicon: data.site_favicon || null
                });
            } catch (err) {
                toast.error("Erro ao sincronizar configurações gerais.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Publicando alterações de marca...");

        const formData = new FormData();
        formData.append('site_name', settings.site_name);
        formData.append('site_description', settings.site_description);
        formData.append('store_address', settings.store_address);

        if (files.logo) formData.append('logo', files.logo);
        if (files.favicon) formData.append('favicon', files.favicon);

        try {
            const res = await api.post('/modules/settings/update.php', formData);
            
            if (res.data.success) {
                toast.success("Identidade da marca atualizada!", { id: tid });
                
                // Dispara sinalizador global para Header/Sidebar
                window.dispatchEvent(new Event('settingsUpdated'));

                /**
                 * STAFF POST-UPLOAD SYNC:
                 * Se o backend retornar novos paths (WebP), atualizamos o preview com o domínio do CDN.
                 */
                if (res.data.paths) {
                    setPreviews(prev => ({
                        ...prev,
                        logo: res.data.paths.site_logo ? `${CDN_URL}${res.data.paths.site_logo}` : prev.logo,
                        favicon: res.data.paths.site_favicon ? `${CDN_URL}${res.data.paths.site_favicon}` : prev.favicon
                    }));
                }
                
                // Reseta os arquivos em memória
                setFiles({ logo: null, favicon: null });
            }
        } catch (err: any) {
            toast.error("Erro ao salvar configurações", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (type: 'logo' | 'favicon', file: File) => {
        // STAFF SAFETY: Revoga blob antigo para evitar vazamento de memória do navegador
        if (previews[type]?.startsWith('blob:')) {
            URL.revokeObjectURL(previews[type]!);
        }
        
        setFiles(prev => ({ ...prev, [type]: file }));
        setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    };

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-stone-300">
            <Loader2 className="animate-spin text-pink-500" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Carregando Brandbook...</span>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 space-y-10 shadow-sm">
                
                {/* Branding Core */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Nome Comercial da Loja</label>
                            <div className="relative">
                                <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                                <input 
                                    type="text" 
                                    value={settings.site_name} 
                                    onChange={e => setSettings({...settings, site_name: e.target.value})}
                                    className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                                    placeholder="Ex: Ana Tilde Confeitaria"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Descrição Institucional</label>
                            <textarea 
                                value={settings.site_description}
                                onChange={e => setSettings({...settings, site_description: e.target.value})}
                                className="w-full bg-stone-50 border-none rounded-2xl py-5 px-6 text-sm font-medium text-stone-600 outline-none focus:ring-2 focus:ring-pink-100 transition-all h-32 resize-none"
                                placeholder="Uma breve história ou slogan para o rodapé do site..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Favicon (Ícone Navegador)</label>
                            <div className="flex items-center gap-5 bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                                <div 
                                    onClick={() => faviconRef.current?.click()} 
                                    className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center cursor-pointer hover:border-pink-300 transition-all overflow-hidden group relative"
                                >
                                    {previews.favicon ? (
                                        <img src={previews.favicon} className="w-full h-full object-contain p-3" alt="Favicon Preview" />
                                    ) : (
                                        <MousePointer2 size={20} className="text-stone-300" />
                                    )}
                                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-black">UP</div>
                                </div>
                                <input type="file" ref={faviconRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange('favicon', e.target.files[0])} />
                                <div className="space-y-1">
                                    <p className="text-[10px] text-stone-500 font-bold uppercase">Formato Recomendado</p>
                                    <p className="text-[9px] text-stone-400 uppercase font-black tracking-tighter">PNG ou WebP (32x32px)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo Section */}
                <div className="space-y-4 pt-8 border-t border-stone-50">
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1 flex items-center gap-2">
                        Logo Principal <Info size={14} className="text-pink-400" />
                    </label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div 
                            onClick={() => logoRef.current?.click()} 
                            className="w-full md:w-64 h-32 rounded-[2rem] bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all hover:border-pink-300 hover:bg-white"
                        >
                            {previews.logo ? (
                                <img src={previews.logo} className="w-full h-full object-contain p-6" alt="Logo Preview" />
                            ) : (
                                <Camera size={32} className="text-stone-200" />
                            )}
                            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">Atualizar Identidade</span>
                            </div>
                        </div>
                        <input type="file" ref={logoRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange('logo', e.target.files[0])} />
                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 flex-1">
                            <h4 className="text-[10px] font-black text-stone-800 uppercase tracking-widest mb-2">Especificações Técnicas:</h4>
                            <ul className="text-[11px] text-stone-500 space-y-1 font-medium italic">
                                <li>• Fundo transparente (PNG ou WebP) é altamente recomendado.</li>
                                <li>• Otimização automática para WebP via CDN integrada.</li>
                                <li>• Proporção ideal: Horizontal (2:1 ou 3:1).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Localização */}
                <div className="space-y-4 pt-8 border-t border-stone-50">
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Sede Física / Endereço</label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-pink-500 group-focus-within:text-pink-600 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <input 
                            type="text" 
                            value={settings.store_address} 
                            onChange={e => setSettings({...settings, store_address: e.target.value})}
                            className="w-full bg-stone-50 border-none rounded-[1.5rem] py-6 pl-20 pr-8 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-pink-100 transition-all shadow-inner"
                            placeholder="Rua das Flores, 123 - Bauru, SP"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-stone-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-stone-200 active:scale-95"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Consolidar Alterações</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};