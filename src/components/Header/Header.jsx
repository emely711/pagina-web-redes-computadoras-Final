import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

// Importación correcta del logo desde assets
import logoImg from '../../assets/favicon.png';

function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuActive(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Genera las iniciales del usuario para el avatar
  const getInitials = () => {
    const name = user?.displayName || user?.email || '';
    const parts = name.split(/[\s@.]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="header">
      <div className="navbar-container">

        <Link to="/" className="logo" onClick={() => setMenuActive(false)}>
          <img src={logoImg} alt="Logo" className="logo-icon" />
          <span className="logo-text">Redes Computadoras</span>
        </Link>

        {/* Hamburguesa móvil */}
        <button className={`hamburger-btn ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú de navegación */}
        <nav className={`nav-menu ${menuActive ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={() => setMenuActive(false)}>Inicio</Link>
            <Link to="/nosotros" className="nav-link" onClick={() => setMenuActive(false)}>Sobre Nosotros</Link>
            <Link to="/temario" className="nav-link" onClick={() => setMenuActive(false)}>Temario</Link>
            <Link to="/preguntas" className="nav-link" onClick={() => setMenuActive(false)}>Preguntas</Link>
            <Link to="/contacto" className="nav-link" onClick={() => setMenuActive(false)}>Contacto</Link>
          </div>

          <div className="auth-buttons">
            {user ? (
              <div className="user-badge">
                <div className="user-avatar">{getInitials()}</div>
                <span className="user-greeting">
                  {user.displayName || user.email}
                </span>
                <button className="btn-auth logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-auth login" onClick={() => setMenuActive(false)}>Login</Link>
                <Link to="/registro" className="btn-auth register" onClick={() => setMenuActive(false)}>Registro</Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;