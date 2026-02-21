import { Outlet, NavLink } from 'react-router-dom';
import { Globe, Search, MessageCircle, Instagram, Settings2 } from 'lucide-react';

export const ConfiguracoesLayout = () => {
    const tabs = [
        { path: 'geral', label: 'Dados Gerais', icon: Globe },
        { path: 'seo', label: 'SEO & Analytics', icon: Search },
        { path: 'contato', label: 'Atendimento', icon: MessageCircle },
        { path: 'social', label: 'Redes Sociais', icon: Instagram }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            {/* Header de Identidade */}
            <header className="flex items-center gap-6 px-4 py-2">
                <div className="w-16 h-16 bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-stone-200 shrink-0">
                    <Settings2 size={32} strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-stone-800 tracking-tighter">Configurações</h1>
                    <p className="text-stone-400 text-sm font-medium italic">Gerencie o comportamento e a identidade do ecossistema</p>
                </div>
            </header>

            {/* Barra de Navegação Centralizada */}
            <nav className="sticky top-4 z-30 flex items-center justify-center p-1.5 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40">
                <div className="flex flex-wrap md:flex-nowrap w-full gap-1">
                    {tabs.map(tab => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) => `
                                flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500
                                ${isActive 
                                    ? 'bg-stone-900 text-white shadow-lg shadow-stone-300 scale-[1.02]' 
                                    : 'text-stone-400 hover:text-stone-800 hover:bg-stone-50'
                                }
                            `}
                        >
                            {/* Corrigido: Usando render props ou lógica interna para o ícone */}
                            {({ isActive }) => (
                                <>
                                    <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{tab.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Viewport de Renderização */}
            <main className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-sm min-h-[500px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};