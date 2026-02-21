import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Save, Loader2, PhoneCall, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../../services/api';

export const AbaContato = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [settings, setSettings] = useState({
        whatsapp_number: '',
        contact_email: '',
        store_address: ''
    });

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const res = await api.get('/modules/settings/get.php');
                const data = res.data;
                setSettings({
                    whatsapp_number: data.whatsapp_number || '',
                    contact_email: data.contact_email || '',
                    store_address: data.store_address || ''
                });
            } catch (err) {
                toast.error("Falha ao sincronizar canais de atendimento.");
            } finally {
                setLoading(false);
            }
        };
        loadContacts();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tid = toast.loading("Atualizando protocolos de contato...");

        try {
            const formData = new FormData();
            formData.append('whatsapp_number', settings.whatsapp_number);
            formData.append('contact_email', settings.contact_email);
            formData.append('store_address', settings.store_address);

            const res = await api.post('/modules/settings/update.php', formData);
            
            if (res.data.success) {
                toast.success("Canais de atendimento atualizados!", { id: tid });
                window.dispatchEvent(new Event('settingsUpdated'));
            }
        } catch (err: any) {
            toast.error(err.friendlyMessage || "Erro ao salvar informações", { id: tid });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-stone-300">
            <Loader2 className="animate-spin text-pink-500" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Acessando Central de Contatos...</span>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 space-y-10 shadow-sm">
                
                <header className="flex items-center gap-4 border-b border-stone-50 pb-8">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                        <PhoneCall size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-stone-800 tracking-tight">Canais de Atendimento</h3>
                        <p className="text-stone-400 text-xs font-medium">Como seus clientes encontrarão a Ana Tilde.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* WhatsApp */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">WhatsApp Business</label>
                        <div className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-stone-300 group-focus-within:text-green-500 transition-colors">
                                <MessageCircle size={20} />
                            </div>
                            <input 
                                type="text" 
                                value={settings.whatsapp_number} 
                                onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-green-100 transition-all placeholder:font-normal"
                                placeholder="Ex: 14999999999"
                            />
                        </div>
                        <p className="text-[9px] text-stone-400 font-bold ml-1 uppercase italic">* Apenas números, com DDD.</p>
                    </div>

                    {/* E-mail */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">E-mail de Suporte</label>
                        <div className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-stone-300 group-focus-within:text-blue-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input 
                                type="email" 
                                value={settings.contact_email} 
                                onChange={e => setSettings({...settings, contact_email: e.target.value})} 
                                className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                placeholder="contato@anatilde.com.br"
                            />
                        </div>
                        <p className="text-[9px] text-stone-400 font-bold ml-1 uppercase italic">* Usado para notificações de pedidos.</p>
                    </div>
                </div>

                {/* Endereço */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Endereço de Exibição (Rodapé)</label>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-stone-300 group-focus-within:text-pink-500 transition-colors">
                            <MapPin size={20} />
                        </div>
                        <input 
                            type="text" 
                            value={settings.store_address} 
                            onChange={e => setSettings({...settings, store_address: e.target.value})} 
                            className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-pink-100 transition-all shadow-inner"
                            placeholder="Rua das Flores, 123 - Bauru, SP"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-stone-50">
                    <div className="flex items-center gap-3 text-stone-400">
                        <ShieldCheck size={18} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Conexão Segura SSL Ativa</span>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-stone-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-200 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Finalizar Configurações</>}
                    </button>
                </div>
            </form>

            <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                    <strong className="text-stone-800">Dica Staff:</strong> Ao alterar o WhatsApp, o botão flutuante no site será atualizado instantaneamente para todos os usuários ativos através do evento de sincronização global.
                </p>
            </div>
        </motion.div>
    );
};