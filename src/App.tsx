import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';

// Layout & Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { NavigationHandler } from './components/functions/NavigationHandler';
import { SEOManager } from './components/functions/SEOManager';

// Pages & Views
import { Home } from './pages/Home';
import { HomeNova } from './pages/HomeNova';
import { Delicias } from './pages/Delicias';
import { QuemSomos } from './pages/QuemSomos';
import { Pascoa } from './pages/Pascoa';
import { Contato } from './pages/Contato';
import { Admin } from './pages/Admin'; 
import { PedidosView } from './modules/admin/views/PedidosView';
import { NewsletterView } from './modules/admin/views/NewsletterView';
import { ProdutosListaView } from './modules/admin/views/ProdutosListaView';
import { ProdutosAddView } from './modules/admin/views/ProdutosAddView'; 
import { ProdutosEditView } from './modules/admin/views/ProdutosEditView';
import { CategoriasView } from './modules/admin/views/CategoriasView';
import { BannersView } from './modules/admin/views/BannersView';
import { BannersFormView } from './modules/admin/views/BannersFormView';

// Configuracoes
import { ConfiguracoesLayout } from './modules/admin/views/configuracoes/ConfiguracoesLayout';
import { AbaGeral } from './modules/admin/views/configuracoes/AbaGeral';
import { AbaSEO } from './modules/admin/views/configuracoes/AbaSeo';
import { AbaContato } from './modules/admin/views/configuracoes/AbaContato';
import { AbaSocial } from './modules/admin/views/configuracoes/AbaSocial';

// Services & Store
import api from './services/api';
import { useCacheStore } from './store/useCacheStore';

/**
 * Hook de Sincronização Staff
 * Monitora a versão do backend e invalida o cache local se necessário.
 */
export const useCacheSync = () => {
    const setVersion = useCacheStore(state => state.setVersion);

    useEffect(() => {
        const syncVersion = async () => {
            try {
                // Rota atualizada para a nova estrutura de pastas
                const { data } = await api.get('/core/get_cache_version.php');
                
                if (data.version) {
                    // O setVersion no store já cuida da invalidação se a versão for diferente
                    setVersion(data.version);
                }
            } catch (e) {
                console.warn("[CacheSync] Falha ao sincronizar versão com o servidor.");
            }
        };

        syncVersion();
        
        // Polling de 5 minutos para manter o cliente sempre atualizado com o Admin
        const interval = setInterval(syncVersion, 1000 * 60 * 5);
        return () => clearInterval(interval);
    }, [setVersion]);
};

const SiteLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Header />
    <Sidebar />
    <main className="flex-grow">
      <Outlet /> 
    </main>
    <Footer />
  </div>
);

function App() {
  // Inicia a sincronização de versão logo no mount do App
  useCacheSync();
  
  return (
    <HelmetProvider>
      <SEOManager />
      <BrowserRouter>
        <NavigationHandler />
        <Toaster position="top-right" richColors closeButton />
        
        <Routes>
          {/* SITE PÚBLICO */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/homenova" element={<HomeNova />} />
            <Route path="/delicias" element={<Delicias />} />
            <Route path="/delicias/:categorySlug?" element={<Delicias />} />
            <Route path="/pascoa" element={<Pascoa />} />
            <Route path="/quem-somos" element={<QuemSomos />} /> 
            <Route path="/contato" element={<Contato />} />
          </Route>

          {/* PAINEL ADMINISTRATIVO */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-8 bg-white rounded-3xl font-bold text-slate-400">Dashboard em breve...</div>} />
            <Route path="pedidos" element={<PedidosView />} />
            <Route path="newsletter" element={<NewsletterView/>} />
            <Route path="banners" element={<BannersView />} />
            <Route path="banners/add" element={<BannersFormView />} />
            <Route path="banners/edit/:id" element={<BannersFormView />} />
            <Route path="categorias" element={<CategoriasView />} />
            <Route path="produtos" element={<ProdutosListaView />} />
            <Route path="produtos/add" element={<ProdutosAddView />} /> 
            <Route path="produtos/edit/:id" element={<ProdutosEditView />} />

            {/* CONFIGURAÇÕES ANINHADAS */}
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