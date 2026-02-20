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
import { Admin } from './pages/Admin'; // Este componente DEVE ter um <Outlet />
import { PedidosView } from './modules/admin/views/PedidosView';
import { NewsletterView } from './modules/admin/views/NewsletterView';
import { ProdutosListaView } from './modules/admin/views/ProdutosListaView';
import { ProdutosAddView } from './modules/admin/views/ProdutosAddView'; 
import { ProdutosEditView } from './modules/admin/views/ProdutosEditView';
import { CategoriasView } from './modules/admin/views/CategoriasView';
import { BannersView } from './modules/admin/views/BannersView';
import { BannersFormView } from './modules/admin/views/BannersFormView';
import { Configuracoes } from './modules/admin/views/Configuracoes';

import { NavigationHandler } from './components/functions/NavigationHandler';

// Layout do Site Público
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
          {/* Redirecionamento inicial */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Sub-rotas relativas (não precisam repetir /admin) */}
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
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        {/* Fallback para 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;