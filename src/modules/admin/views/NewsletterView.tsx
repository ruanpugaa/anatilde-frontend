import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Copy, Check, FileSpreadsheet, User } from 'lucide-react';
import { toast } from 'sonner';

export const NewsletterView = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        try {
            const res = await axios.get('https://anatilde.com.br/api/admin_leads.php');
            // Garante que o que vem do servidor é um array
            setLeads(Array.isArray(res.data) ? res.data : []);
        } catch (e) { 
            console.error(e); 
            toast.error("Erro ao carregar leads.");
        } finally { 
            setLoading(false); 
        }
    };

    const copyEmails = () => {
        if (leads.length === 0) return;
        const emails = leads.map(l => l.email).join(', ');
        navigator.clipboard.writeText(emails);
        setCopied(true);
        toast.success("E-mails copiados!");
        setTimeout(() => setCopied(false), 2000);
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;
        const headers = ["Nome", "Email", "Data"];
        const rows = leads.map(l => [
            l.name || "Não informado", // CORRIGIDO PARA .name
            l.email,
            new Date(l.created_at).toLocaleDateString('pt-BR')
        ]);

        const BOM = "\uFEFF";
        const csvContent = BOM + [
            headers.join(";"), 
            ...rows.map(row => row.join(";"))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `leads_anatilde_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (loading) return <div className="p-8 text-slate-400 font-bold animate-pulse">Carregando contatos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Base de Newsletter</h2>
                    <p className="text-slate-400 text-sm font-medium">Gerencie seus {leads.length} contatos</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={copyEmails} className="flex items-center gap-2 bg-slate-50 text-slate-600 px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copiados!' : 'Copiar Emails'}
                    </button>
                    <button onClick={exportToCSV} className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
                        <FileSpreadsheet size={16} /> Exportar CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Nome do Cliente</th>
                                <th className="px-8 py-5">E-mail</th>
                                <th className="px-8 py-5">Data</th>
                                <th className="px-8 py-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-[10px]">
                                                {lead.name ? lead.name.charAt(0).toUpperCase() : <User size={14} />}
                                            </div>
                                            {/* CORRIGIDO PARA lead.name ABAIXO */}
                                            <span className="font-bold text-slate-700">{lead.name || "Não informado"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500">{lead.email}</td>
                                    <td className="px-8 py-5 text-slate-400">
                                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '---'}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                            Ativo
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};