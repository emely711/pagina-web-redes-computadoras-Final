// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Si el usuario ya eligió un tema antes, lo respetamos
    const guardado = localStorage.getItem("tema");
    if (guardado) return guardado;

    // 2. Si no, usamos la preferencia del sistema operativo
    const prefiereClaro = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefiereClaro ? "light" : "dark";
  });

  useEffect(() => {
    // Aplicamos el atributo data-theme al <html> para que el CSS reaccione
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tema", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((actual) => (actual === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para consumir el tema en cualquier componente
export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme debe usarse dentro de un <ThemeProvider>");
  }
  return contexto;
}