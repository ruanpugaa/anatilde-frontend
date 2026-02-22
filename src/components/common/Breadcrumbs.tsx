import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const routeLabels: Record<string, string> = {
    'delicias': 'Delícias',
    'quem-somos': 'Quem Somos',
    'contato': 'Contato',
    'pascoa': 'Páscoa'
};

export const Breadcrumbs = () => {
    const { pathname } = useLocation();
    const [productContext, setProductContext] = useState<{name: string, category: string, categorySlug: string} | null>(null);
    
    useEffect(() => {
        const handleProductLoaded = (e: any) => {
            if (e.detail?.name) {
                setProductContext({
                    name: e.detail.name,
                    category: e.detail.categoryName || 'Delícias',
                    categorySlug: e.detail.categorySlug || 'delicias'
                });
            }
        };

        window.addEventListener('product-loaded', handleProductLoaded);
        return () => {
            window.removeEventListener('product-loaded', handleProductLoaded);
            setProductContext(null);
        };
    }, [pathname]);

    if (pathname === '/' || pathname === '/homenova') return null;

    const pathnames = pathname.split('/').filter((x) => x);
    const isProductRoute = pathnames.includes('produto');

    return (
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-stone-50 sticky top-16 md:top-20 z-[35]">
            <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-6 md:px-8 h-12 flex items-center">
                <ol className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 w-full overflow-hidden">
                    <li className="flex items-center shrink-0">
                        <Link to="/" className="hover:text-pink-500 transition-colors flex items-center">
                            <Home size={11} strokeWidth={2.5} />
                        </Link>
                    </li>

                    <AnimatePresence mode="wait">
                        {isProductRoute ? (
                            <motion.div 
                                key="product-bread"
                                initial={{ opacity: 0, x: 5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                className="flex items-center overflow-hidden"
                            >
                                {/* STAFF: Escondemos 'Delícias' no mobile para ganhar espaço inicial */}
                                <li className="hidden md:flex items-center">
                                    <ChevronRight size={10} className="mx-1 text-stone-300" />
                                    <Link to="/delicias" className="hover:text-stone-600 transition-colors">
                                        Delícias
                                    </Link>
                                </li>
                                
                                {productContext ? (
                                    <>
                                        {/* CATEGORIA: No mobile vira "..." se o nome do produto for longo */}
                                        <li className="flex items-center">
                                            <ChevronRight size={10} className="mx-1 text-stone-300 shrink-0" />
                                            
                                            {/* Versão Desktop: Nome completo */}
                                            <Link 
                                                to={`/delicias/${productContext.categorySlug}`} 
                                                className="hidden md:inline hover:text-stone-600 transition-colors whitespace-nowrap"
                                            >
                                                {productContext.category}
                                            </Link>

                                            {/* Versão Mobile: Omissão elegante */}
                                            <span className="md:hidden text-stone-300 font-medium tracking-widest">...</span>
                                        </li>

                                        {/* PRODUTO: Sempre visível, com truncamento inteligente */}
                                        <li className="flex items-center overflow-hidden">
                                            <ChevronRight size={10} className="mx-1 text-stone-300 shrink-0" />
                                            <span className="text-pink-500 font-black truncate max-w-[150px] sm:max-w-[200px] md:max-w-[400px]">
                                                {productContext.name}
                                            </span>
                                        </li>
                                    </>
                                ) : (
                                    <li className="flex items-center">
                                        <ChevronRight size={10} className="mx-1 text-stone-300" />
                                        <span className="animate-pulse text-stone-200 uppercase">Carregando...</span>
                                    </li>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="standard-bread"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center"
                            >
                                {pathnames.map((value, index) => {
                                    const last = index === pathnames.length - 1;
                                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                                    const label = routeLabels[value] || value.replace(/-/g, ' ');

                                    return (
                                        <li key={to} className="flex items-center">
                                            <ChevronRight size={10} className="mx-1 text-stone-300 shrink-0" />
                                            {last ? (
                                                <span className="text-pink-500 font-black truncate max-w-[120px]">
                                                    {label}
                                                </span>
                                            ) : (
                                                <Link to={to} className="hover:text-stone-600 transition-colors hidden sm:inline">
                                                    {label}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ol>
            </nav>
        </div>
    );
};