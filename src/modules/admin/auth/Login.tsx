import { useState } from 'react';
import axios from 'axios';

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
            const res = await axios.post('https://anatilde.com.br/api/admin_login.php', { username, password });
            onLogin(res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao conectar ao servidor');
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
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Usuário" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Senha" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};