import { useState } from 'react';
import { Admin } from '../../pages/Admin';

export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Defina sua senha aqui
    const ADMIN_PASSWORD = 'admin'; 

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert('Senha incorreta!');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
                <form 
                    onSubmit={handleLogin}
                    className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Acesso Restrito</h2>
                    <p className="text-gray-500 text-sm mb-6 text-center">Digite a senha administrativa para continuar.</p>
                    
                    <input 
                        type="password" 
                        placeholder="Senha"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <button 
                        type="submit"
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Entrar no Painel
                    </button>
                </form>
            </div>
        );
    }

    return <Admin />;
};