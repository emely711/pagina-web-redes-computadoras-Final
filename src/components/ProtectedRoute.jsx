// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Componente que protege rutas privadas.
 * Usa el AuthContext global en vez de tener su propio listener de Firebase,
 * evitando duplicar la lógica de sesión en distintos lugares de la app.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}