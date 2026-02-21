import { useState } from 'react';
import api from '../../../services/api'; // Importando sua instância configurada

export const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            /** * STAFF: Alterado para a rota correta e usando a instância 'api' 
             * que já deve conter as configurações de baseURL e interceptors.
             */
            const res = await api.post('/modules/auth/login.php', { 
                username, 
                password 
            });

            if (res.data.success) {
                onLogin(res.data.user);
            } else {
                setError(res.data.error || 'Credenciais inválidas');
            }
        } catch (err: any) {
            // Tratamento de erro robusto para falhas de rede ou CORS
            const msg = err.response?.data?.error || 'Erro de conexão (CORS ou Rede)';
            setError(msg);
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-800 italic tracking-tighter">
                            ANATILDE <span className="text-pink-500">ADMIN</span>
                        </h2>
                        <p className="text-slate-400 text-sm font-medium mt-2">Acesso restrito ao operacional</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black mb-6 border border-red-100 text-center uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Usuário</label>
                            <input 
                                type="text" 
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-bold text-slate-700"
                                value={username} 
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Senha</label>
                            <input 
                                type="password" 
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-bold text-slate-700"
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-pink-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 mt-4 active:scale-95"
                        >
                            {loading ? 'VALIDANDO ACESSO...' : 'ENTRAR NO SISTEMA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};