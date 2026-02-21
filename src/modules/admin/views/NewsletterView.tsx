import { useState, useEffect } from 'react';
import { Mail, Copy, Check, FileSpreadsheet, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// STAFF INFRA
import api from '../../../services/api';

export const NewsletterView = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const fetchLeads = async () => {
        try {
            // STAFF PATTERN: Rota modularizada de CRM/Leads
            const res = await api.get('/modules/forms/process_newsletter.php');
            setLeads(Array.isArray(res.data) ? res.data : []);
        } catch (e) { 
            toast.error("Falha ao sincronizar base de contatos.");
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    const copyEmails = () => {
        if (leads.length === 0) return;
        const emails = leads.map(l => l.email).join(', ');
        navigator.clipboard.writeText(emails);
        setCopied(true);
        toast.success("E-mails copiados para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;
        
        // Estrutura para compatibilidade universal (RFC 4180)
        const headers = ["Nome", "Email", "Data de Cadastro"];
        const rows = leads.map(l => [
            `"${l.name || 'Cliente Geral'}"`, // Escapando strings para CSV
            `"${l.email}"`,
            `"${l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : '---'}"`
        ]);

        const BOM = "\uFEFF"; // Byte Order Mark para Excel reconhecer UTF-8
        const csvContent = BOM + [
            headers.join(";"), 
            ...rows.map(row => row.join(";"))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ana_tilde_leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url); // Limpeza de memória
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-pink-500" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Acessando CRM...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 shadow-inner">
                        <Mail size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Leads & Newsletter</h2>
                        <p className="text-slate-400 text-sm font-medium">Captura ativa: <span className="text-pink-500 font-bold">{leads.length} contatos</span></p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={copyEmails} 
                        className="flex items-center gap-2 bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copiados' : 'Copiar Emails'}
                    </button>
                    <button 
                        onClick={exportToCSV} 
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl shadow-slate-200"
                    >
                        <FileSpreadsheet size={16} /> Exportar Base
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6">Identificação</th>
                                <th className="px-8 py-6">Canal de E-mail</th>
                                <th className="px-8 py-6">Inscrição</th>
                                <th className="px-8 py-6 text-center">Origem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-pink-50/20 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-pink-500 font-black text-xs transition-colors border border-transparent group-hover:border-pink-100">
                                                {lead.name ? lead.name.charAt(0).toUpperCase() : <User size={16} />}
                                            </div>
                                            <span className="font-bold text-slate-700">{lead.name || "Interessado Anônimo"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-slate-500 font-medium">{lead.email}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-slate-400 font-mono text-xs">
                                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '---'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                            Footer-Form
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-300">
                                        <Mail size={40} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-widest text-xs">Ainda não há inscritos na newsletter</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};