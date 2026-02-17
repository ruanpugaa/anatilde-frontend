import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Sabores } from './pages/Sabores';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Criamos um componente interno para ter acesso ao hook useLocation
const AppContent = () => {
  const location = useLocation();
  
  // Verificamos se a rota atual começa com /admin
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Só renderiza os componentes de layout se NÃO for admin */}
      {!isAdminPage && <Header />}
      {!isAdminPage && <Sidebar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sabores" element={<Sabores />} />
          <Route path="/admin" element={<ProtectedRoute />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;