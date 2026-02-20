import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Importações da nossa arquitetura centralizada
import { SettingsService } from '../../../../services/SettingsService';
import { ISettings } from '../../../../@types/settings';

export const AbaContato = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Estado tipado com a interface global
    const [settings, setSettings] = useState<Partial<ISettings>>({
        whatsapp_number: '',
        contact_email: '',
        store_address: ''
    });

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const data = await SettingsService.getSettings();
                setSettings({
                    whatsapp_number: data.whatsapp_number || '',
                    contact_email: data.contact_email || '',
                    store_address: data.store_address || ''
                });
            } catch (err) {
                toast.error("Erro ao carregar dados de contato");
            } finally {
                setLoading(false);
            }
        };
        loadContacts();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        
        // Populando o FormData apenas com os campos desta aba
        if (settings.whatsapp_number) formData.append('whatsapp_number', settings.whatsapp_number);
        if (settings.contact_email) formData.append('contact_email', settings.contact_email);
        if (settings.store_address) formData.append('store_address', settings.store_address);

        try {
            await SettingsService.updateSettings(formData);
            toast.success("Informações de contato salvas com sucesso!");
            
            // Opcional: Notifica outros componentes se necessário
            window.dispatchEvent(new Event('settingsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar contatos");
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WhatsApp */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp de Atendimento</label>
                        <div className="relative group">
                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                            <input 
                                type="text" 
                                value={settings.whatsapp_number} 
                                onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} 
                                className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    {/* E-mail */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail de Contato</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                            <input 
                                type="email" 
                                value={settings.contact_email} 
                                onChange={e => setSettings({...settings, contact_email: e.target.value})} 
                                className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                                placeholder="contato@anatilde.com.br"
                            />
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Endereço da Loja Física</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={settings.store_address} 
                            onChange={e => setSettings({...settings, store_address: e.target.value})} 
                            className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                            placeholder="Rua, Número, Bairro - Cidade / Estado"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all flex items-center gap-3 shadow-xl shadow-slate-100 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Contatos</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};