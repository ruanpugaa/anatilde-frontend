import { Outlet, NavLink } from 'react-router-dom';
import { Globe, Search, MessageCircle, Instagram } from 'lucide-react';

export const ConfiguracoesLayout = () => {
    const tabs = [
        { path: 'geral', label: 'Geral', icon: Globe },
        { path: 'seo', label: 'SEO & Analytics', icon: Search },
        { path: 'contato', label: 'Contato', icon: MessageCircle },
        { path: 'social', label: 'Social', icon: Instagram }
    ];

    return (
        <div className="max-w-4xl pb-20">
            <header className="mb-10">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurações do Sistema</h1>
                <p className="text-slate-400 text-sm font-medium">Controle total da marca, SEO e canais digitais.</p>
            </header>

            {/* TABS NAVEGÁVEIS */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive }) => `
                            flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all
                            ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </NavLink>
                ))}
            </div>

            {/* ONDE AS ABAS SERÃO RENDERIZADAS */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};