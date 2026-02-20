import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Save, Globe, MessageCircle, MapPin, 
    Instagram, Facebook, Mail, Camera, Loader2,
    AlignLeft
} from 'lucide-react';
import { toast } from 'sonner';

export const Configuracoes = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('geral');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [settings, setSettings] = useState({
        site_logo: '',
        site_description: '', 
        store_address: '',
        whatsapp_number: '',
        instagram_url: '',
        facebook_url: '',
        contact_email: ''
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 1. CARREGAR DADOS DO BANCO
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('https://anatilde.com.br/api/get_settings.php');
                const data = await res.json();
                if (data) {
                    setSettings(prev => ({ ...prev, ...data }));
                    // Se houver logo, monta a URL completa para o preview inicial
                    if (data.site_logo) {
                        const cleanPath = data.site_logo.replace(/^\//, '');
                        setLogoPreview(`https://anatilde.com.br/${cleanPath}`);
                    }
                }
            } catch (err) {
                toast.error("Erro ao carregar dados do servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // 2. TRATAR PREVIEW DA IMAGEM LOCAL
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // 3. SALVAR NO BANCO (POST MULTIPART)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        
        // Append de todos os campos de texto
        Object.entries(settings).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append do arquivo apenas se o usuário selecionou um novo
        if (selectedFile) {
            formData.append('logo', selectedFile);
        }

        try {
            const response = await fetch('https://anatilde.com.br/api/settings.php', {
                method: 'POST',
                body: formData, 
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Configurações atualizadas com sucesso!");
                // Se o PHP retornou um novo path de logo, atualizamos o estado
                if (result.logo_url) {
                    setSettings(prev => ({ ...prev, site_logo: result.logo_url }));
                }
            } else {
                throw new Error(result.error || "Erro ao salvar no servidor");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-4xl pb-20">
            <header className="mb-10">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurações Gerais</h1>
                <p className="text-slate-400 text-sm font-medium">Gerencie a identidade, SEO e informações de contato.</p>
            </header>

            {/* TABS */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
                {[
                    {id: 'geral', label: 'Geral', icon: Globe},
                    {id: 'contato', label: 'Contato', icon: MessageCircle},
                    {id: 'social', label: 'Social', icon: Instagram}
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* ABA GERAL */}
                {activeTab === 'geral' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 shadow-sm">
                            
                            {/* UPLOAD DE LOGO */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logotipo Principal</label>
                                <div className="flex items-center gap-6">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-40 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-pink-300 transition-colors cursor-pointer group overflow-hidden relative"
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <Camera size={24} />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] text-white font-bold">ALTERAR LOGO</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                        <p>• Formatos: PNG, WEBP ou SVG.</p>
                                        <p>• Recomendado: Fundo transparente.</p>
                                        <p>• Otimização automática ativa.</p>
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIÇÃO (BIO DO FOOTER) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição do Footer (Bio)</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-4 text-slate-300" size={18} />
                                    <textarea 
                                        value={settings.site_description}
                                        onChange={e => setSettings({...settings, site_description: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all h-32 resize-none"
                                        placeholder="Descreva a essência da confeitaria..."
                                    />
                                </div>
                            </div>

                            {/* ENDEREÇO */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Endereço Físico</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="text"
                                        value={settings.store_address}
                                        onChange={e => setSettings({...settings, store_address: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                        placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ABA CONTATO */}
                {activeTab === 'contato' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp de Vendas</label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="text"
                                        value={settings.whatsapp_number}
                                        onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail de Suporte</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="email"
                                        value={settings.contact_email}
                                        onChange={e => setSettings({...settings, contact_email: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                        placeholder="contato@anatilde.com.br"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ABA SOCIAL */}
                {activeTab === 'social' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                                    <Instagram size={20} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="URL do Instagram"
                                    value={settings.instagram_url}
                                    onChange={e => setSettings({...settings, instagram_url: e.target.value})}
                                    className="flex-1 bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Facebook size={20} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="URL do Facebook"
                                    value={settings.facebook_url}
                                    onChange={e => setSettings({...settings, facebook_url: e.target.value})}
                                    className="flex-1 bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* AÇÃO FINAL */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all duration-500 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                        )}
                        Salvar Todas as Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};