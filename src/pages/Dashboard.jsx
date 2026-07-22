import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase"; // <-- CORREGIDO: ../ para salir de la carpeta pages
import { signOut, onAuthStateChanged } from "firebase/auth";
import { temas } from "../data/temas";
import Apuntes from "../components/Apuntes/Apuntes";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("Estudiante");
  const [uid, setUid] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = onAuthStateChanged(auth, (user) => {
      if (user) {
        setNombre(user.displayName || "Estudiante");
        setUid(user.uid);
        setCargando(false);
      } else {
        navigate("/login");
      }
    });

    return () => verificarSesion();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (cargando) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <h3>Verificando credenciales...</h3>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <div className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-greeting">Bienvenido de vuelta,</span>
          <h1 className="dash-name">{nombre} 👋</h1>
          <p className="dash-subtitle">Continúa aprendiendo donde lo dejaste. Tienes <strong>9 temas</strong> disponibles.</p>
        </div>
        <div className="dash-hero-actions">
          <button className="dash-btn-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="dash-stats">
        <div className="dash-stat">
          <span className="dash-stat-num">9</span>
          <span className="dash-stat-label">Temas</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">30+</span>
          <span className="dash-stat-label">Subtemas</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">0%</span>
          <span className="dash-stat-label">Completado</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">∞</span>
          <span className="dash-stat-label">Recursos</span>
        </div>
      </div>

      <div className="dash-section">
        <h2 className="dash-section-title">Temas del curso</h2>
        <div className="dash-temas-grid">
          {temas.map((tema) => (
            <Link
              key={tema.id}
              to={`/temario/${tema.slug}`}
              className="dash-tema-card"
            >
              <div className="dash-tema-top">
                <span className="dash-tema-icon">{tema.icon}</span>
                <span className="dash-tema-num">#{tema.id}</span>
              </div>
              <h3 className="dash-tema-titulo">{tema.titulo}</h3>
              <div className="dash-tema-footer">
                <span className="dash-tema-badge">Ver tema →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Apuntes uid={uid} />
    </div>
  );
}