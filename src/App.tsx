import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';

// Layout & Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar'; // O Carrinho
import { WishlistSidebar } from './components/layout/WishListSideBar'; // STAFF: Novo Componente
import { Footer } from './components/layout/Footer';
import { NavigationHandler } from './components/functions/NavigationHandler';
import { SEOManager } from './components/functions/SEOManager';

// Pages & Views Públicas
import { Home } from './pages/Home';
import { HomeNova } from './pages/HomeNova';
import { Delicias } from './pages/Delicias';
import { QuemSomos } from './pages/QuemSomos';
import { Pascoa } from './pages/Pascoa';
import { Contato } from './pages/Contato';
import { Produto } from './pages/Produto';

// Admin Views
import { Admin } from './pages/Admin'; 
import { PedidosView } from './modules/admin/views/PedidosView';
import { NewsletterView } from './modules/admin/views/NewsletterView';
import { ProdutosListaView } from './modules/admin/views/ProdutosListaView';
import { ProdutosAddView } from './modules/admin/views/ProdutosAddView'; 
import { ProdutosEditView } from './modules/admin/views/ProdutosEditView';
import { CategoriasView } from './modules/admin/views/CategoriasView';
import { BannersView } from './modules/admin/views/BannersView';
import { BannersFormView } from './modules/admin/views/BannersFormView';

// Configuracoes Admin
import { ConfiguracoesLayout } from './modules/admin/views/configuracoes/ConfiguracoesLayout';
import { AbaGeral } from './modules/admin/views/configuracoes/AbaGeral';
import { AbaSEO } from './modules/admin/views/configuracoes/AbaSeo';
import { AbaContato } from './modules/admin/views/configuracoes/AbaContato';
import { AbaSocial } from './modules/admin/views/configuracoes/AbaSocial';

// Services & Store
import api from './services/api';
import { useCacheStore } from './store/useCacheStore';

/**
 * STAFF: Hook de Sincronização de Cache
 * Mantém a versão do app atualizada com o servidor para evitar stale data.
 */
export const useCacheSync = () => {
    const setVersion = useCacheStore(state => state.setVersion);

    useEffect(() => {
        const syncVersion = async () => {
            try {
                const { data } = await api.get('/core/get_cache_version.php');
                if (data.version) {
                    setVersion(data.version);
                }
            } catch (e) {
                console.warn("[CacheSync] Falha ao sincronizar versão.");
            }
        };
        syncVersion();
        const interval = setInterval(syncVersion, 1000 * 60 * 5);
        return () => clearInterval(interval);
    }, [setVersion]);
};

/**
 * STAFF: Layout Principal do Site
 * Centraliza os elementos globais de UI (Modais, Sidebars, Overlays)
 */
const SiteLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Header />
    <Sidebar /> {/* Carrinho de Compras */}
    <WishlistSidebar /> {/* STAFF: Lista de Desejos injetada globalmente */}
    <main className="flex-grow">
      <Outlet /> 
    </main>
    <Footer />
  </div>
);

function App() {
  useCacheSync();
  
  return (
    <HelmetProvider>
      <SEOManager />
      <BrowserRouter>
        <NavigationHandler />
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          toastOptions={{
            style: { borderRadius: '1rem', border: '1px solid #f5f5f4' },
          }}
        />
        
        <Routes>
          {/* SITE PÚBLICO */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/homenova" element={<HomeNova />} />
            <Route path="/delicias" element={<Delicias />} />
            <Route path="/delicias/:categorySlug?" element={<Delicias />} />
            
            {/* Detalhe do Produto */}
            <Route path="/produto/:id" element={<Produto />} />
            
            <Route path="/pascoa" element={<Pascoa />} />
            <Route path="/quem-somos" element={<QuemSomos />} /> 
            <Route path="/contato" element={<Contato />} />
          </Route>

          {/* PAINEL ADMINISTRATIVO */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-8 bg-white rounded-3xl font-bold text-slate-400 italic">Dashboard em breve...</div>} />
            <Route path="pedidos" element={<PedidosView />} />
            <Route path="newsletter" element={<NewsletterView/>} />
            <Route path="banners" element={<BannersView />} />
            <Route path="banners/add" element={<BannersFormView />} />
            <Route path="banners/edit/:id" element={<BannersFormView />} />
            <Route path="categorias" element={<CategoriasView />} />
            <Route path="produtos" element={<ProdutosListaView />} />
            <Route path="produtos/add" element={<ProdutosAddView />} /> 
            <Route path="produtos/edit/:id" element={<ProdutosEditView />} />

            <Route path="configuracoes" element={<ConfiguracoesLayout />}>
              <Route index element={<Navigate to="geral" replace />} />
              <Route path="geral" element={<AbaGeral />} />
              <Route path="seo" element={<AbaSEO />} />
              <Route path="contato" element={<AbaContato />} />
              <Route path="social" element={<AbaSocial />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;