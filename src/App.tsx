import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
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

// Importação do Layout de Configurações e suas Abas
import { ConfiguracoesLayout } from './modules/admin/views/configuracoes/ConfiguracoesLayout';
import { AbaGeral } from './modules/admin/views/configuracoes/AbaGeral';
import { AbaSEO } from './modules/admin/views/configuracoes/AbaSeo';
import { AbaContato } from './modules/admin/views/configuracoes/AbaContato';
import { AbaSocial } from './modules/admin/views/configuracoes/AbaSocial';

import { HelmetProvider } from 'react-helmet-async';
import { NavigationHandler } from './components/functions/NavigationHandler';
import { SEOManager } from './components/functions/SEOManager';

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
  return (
    <HelmetProvider>
      <SEOManager />
      <BrowserRouter>
        <NavigationHandler />
        <Toaster position="top-right" richColors closeButton />
        
        <Routes>
          {/* ROTAS DO SITE PÚBLICO */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/homenova" element={<HomeNova />} />
            <Route path="/delicias" element={<Delicias />} />
            <Route path="/delicias/:categorySlug?" element={<Delicias />} />
            <Route path="/pascoa" element={<Pascoa />} />
            <Route path="/quem-somos" element={<QuemSomos />} /> 
            <Route path="/contato" element={<Contato />} />
          </Route>

          {/* ROTAS DO ADMIN */}
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

            {/* ESTRUTURA DE CONFIGURAÇÕES EM ROTAS ANINHADAS */}
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