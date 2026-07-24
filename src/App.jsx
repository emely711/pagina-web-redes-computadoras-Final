import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Contexto de autenticación
import { AuthProvider } from './context/AuthContext';

// Componentes
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Temario from './components/Temario/Temario';
import TemaDetail from './components/Temario/TemaDetail'; 
import Preguntas from './components/Preguntas/Preguntas';
import Formulario from './components/Formulario/Formulario';

// Páginas (Asegúrate de que tus archivos Login, Register y Dashboard estén dentro de la carpeta "src/pages")
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Protección de rutas
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

// Hace scroll suave hacia la sección indicada en location.state.scrollTo,
// sin depender del hash de la URL (más confiable en SPA).
function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
}

function App() {
  // Rastreador para verificar que React Router y App.jsx estén cargando en el navegador
  console.log("Rastreador: ¡App.jsx se está ejecutando y cargando correctamente!");

  return (
    <AuthProvider>
      <Router>
        <ScrollToSection />
        <div className="app-container">
          <Header />
          
          <main className="content-container">
            <Routes>
              {/* Inicio: Landing Page completa */}
              <Route path="/" element={
                <>
                  <Hero />
                  <About />
                  <Temario />
                  <Preguntas />
                  <Formulario />
                </>
              } />

              {/* Rutas individuales */}
              <Route path="/nosotros" element={<About />} />
              <Route path="/temario" element={<Temario />} />
              
              {/* RUTA DINÁMICA: Aquí se cargará el contenido de cada tema */}
              <Route path="/temario/:temaSlug" element={<TemaDetail />} />

              <Route path="/preguntas" element={<Preguntas />} />
              <Route path="/contacto" element={<Formulario />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Ruta protegida: solo usuarios logueados pueden entrar */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Ruta para manejar errores 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;