// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Este listener se registra UNA sola vez para toda la app.
    // Se dispara automáticamente cuando el usuario inicia sesión,
    // cierra sesión, o al recargar la página (Firebase restaura la sesión).
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto fácilmente en cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}