import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Mail, LogOut, 
    List, Tag, Menu, X, ChevronLeft, ChevronRight,
    Image, Settings // Importamos o Settings para as Configurações
} from 'lucide-react';

export const AdminShell = ({ children, user, onLogout }: any) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => setIsMobileOpen(false), [location]);

    const menuItems = [
        { id: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: '/admin/pedidos', label: 'Pedidos', icon: Package },
        { id: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    ];

    const showText = !isCollapsed || isMobileOpen;

    return (
        <div className="flex min-h-screen bg-[#F8F9FC]">
            {/* Overlay para Mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 
                flex flex-col transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
                ${!isMobileOpen && isCollapsed ? 'lg:w-20' : 'lg:w-72'}
            `}>
                {/* Header do Menu */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 overflow-hidden">
                    {showText ? (
                        <div className="font-black text-xl italic tracking-tighter whitespace-nowrap">
                            ANATILDE<span className="text-pink-500">ADMIN</span>
                        </div>
                    ) : (
                        <div className="mx-auto font-black text-pink-500 text-xl">A</div>
                    )}
                    
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-pink-500 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                    
                    <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-400 p-2">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.id}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                                location.pathname === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {showText && <span>{item.label}</span>}
                        </Link>
                    ))}

                    {/* SEÇÃO: VITRINE */}
                    <div className="pt-4 mt-4 border-t border-slate-50">
                        {showText && <p className="px-4 text-[10px] font-black text-slate-300 uppercase mb-2">Vitrine</p>}
                        <Link to="/admin/banners" className={`flex items-center gap-4 px-4 py-2.5 text-sm font-bold transition-colors whitespace-nowrap ${location.pathname === '/admin/banners' ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                            <Image size={20} className="shrink-0" />
                            {showText && <span>Banners Home</span>}
                        </Link>
                    </div>

                    {/* SEÇÃO: CATÁLOGO */}
                    <div className="pt-4 mt-2 border-t border-slate-50">
                        {showText && <p className="px-4 text-[10px] font-black text-slate-300 uppercase mb-2">Catálogo</p>}
                        <Link to="/admin/produtos" className={`flex items-center gap-4 px-4 py-2.5 text-sm font-bold transition-colors whitespace-nowrap ${location.pathname === '/admin/produtos' ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                            <List size={20} className="shrink-0" />
                            {showText && <span>Produtos</span>}
                        </Link>
                        <Link to="/admin/categorias" className={`flex items-center gap-4 px-4 py-2.5 text-sm font-bold transition-colors whitespace-nowrap ${location.pathname === '/admin/categorias' ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                            <Tag size={20} className="shrink-0" />
                            {showText && <span>Categorias</span>}
                        </Link>
                    </div>

                    {/* SEÇÃO: CONFIGURAÇÕES (Nova) */}
                    <div className="pt-4 mt-2 border-t border-slate-50">
                        {showText && <p className="px-4 text-[10px] font-black text-slate-300 uppercase mb-2">Sistema</p>}
                        <Link to="/admin/configuracoes" className={`flex items-center gap-4 px-4 py-2.5 text-sm font-bold transition-colors whitespace-nowrap ${location.pathname === '/admin/configuracoes' ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                            <Settings size={20} className="shrink-0" />
                            {showText && <span>Configurações</span>}
                        </Link>
                    </div>
                </nav>

                <button 
                    onClick={onLogout} 
                    className="m-4 flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors whitespace-nowrap overflow-hidden"
                >
                    <LogOut size={20} className="shrink-0" />
                    {showText && <span>Sair do Painel</span>}
                </button>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2.5 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <Menu size={22} />
                        </button>
                        <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            {location.pathname.replace('/admin/', '').split('/')[0] || 'DASHBOARD'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden xs:block">
                            <p className="font-bold text-slate-700 text-sm leading-none">{user.nome}</p>
                            <p className="text-[10px] font-black text-pink-500 uppercase mt-1">Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-black shadow-lg shadow-pink-100">
                            {user.nome.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};