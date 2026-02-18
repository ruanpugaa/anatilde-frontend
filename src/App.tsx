import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Sabores } from './pages/Sabores';
import { Admin } from './pages/Admin';
import { PedidosView } from './modules/admin/views/PedidosView';
import { NewsletterView } from './modules/admin/views/NewsletterView';
import { ProdutosListaView } from './modules/admin/views/ProdutosListaView';
import { ProdutosAddView } from './modules/admin/views/ProdutosAddView'; 
import { ProdutosEditView } from './modules/admin/views/ProdutosEditView';
import { CategoriasView } from './modules/admin/views/CategoriasView';

// 1. Criamos um Layout para o Site Público
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
      {/* Toaster posicionado no topo para melhor visibilidade no admin */}
      <Toaster position="top-right" richColors closeButton />
      
      <Routes>
        {/* ROTAS DO SITE */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sabores" element={<Sabores />} />
        </Route>

        {/* ROTAS DO ADMIN */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<div className="p-8 bg-white rounded-3xl font-bold text-slate-400">Dashboard em breve...</div>} />
          <Route path="pedidos" element={<PedidosView />} />
          <Route path="newsletter" element={<NewsletterView/>} />
          
          {/* Módulo de Produtos */}
          <Route path="categorias" element={<CategoriasView />} />
          <Route path="produtos" element={<ProdutosListaView />} />
          <Route path="produtos/add" element={<ProdutosAddView />} /> 
          <Route path="produtos/edit/:id" element={<ProdutosEditView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;