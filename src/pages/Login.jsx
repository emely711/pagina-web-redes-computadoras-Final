import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "./Auth.css";

// Traduce los códigos de error de Firebase a mensajes legibles
const traducirErrorGoogle = (error) => {
  switch (error.code) {
    case "auth/operation-not-allowed":
      return "El inicio de sesión con Google no está habilitado en Firebase (Authentication > Sign-in method).";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase (Authentication > Settings > Authorized domains).";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana emergente. Permite pop-ups para este sitio.";
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana de Google antes de terminar el inicio de sesión.";
    case "auth/cancelled-popup-request":
      return null; // el usuario abrió el popup dos veces seguidas, no es un error real
    default:
      return `Error de Google: ${error.code || error.message}`;
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarCredenciales = () => {
    const nuevosErrores = {};

    if (!formData.email) {
      nuevosErrores.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "El formato del correo no es válido";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCredenciales()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("¡Bienvenido de vuelta!");
      navigate("/dashboard");
    } catch (error) {
      let mensaje = "Ocurrió un error al iniciar sesión.";
      switch (error.code) {
        case "auth/user-not-found":
          mensaje = "No existe una cuenta con ese correo.";
          break;
        case "auth/wrong-password":
          mensaje = "La contraseña es incorrecta.";
          break;
        case "auth/invalid-email":
          mensaje = "El correo no tiene un formato válido.";
          break;
        case "auth/invalid-credential":
          mensaje = "Correo o contraseña incorrectos.";
          break;
        case "auth/too-many-requests":
          mensaje = "Demasiados intentos fallidos. Intenta más tarde.";
          break;
      }
      setErrors({ general: mensaje });
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("¡Sesión iniciada con Google!");
      navigate("/dashboard");
    } catch (error) {
      // Este log es clave: aquí verás el código real del error en la consola (F12)
      console.error("Error al autenticar con Google:", error.code, error.message);
      const mensaje = traducirErrorGoogle(error);
      if (mensaje) toast.error(mensaje);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <span className="auth-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3,5 12,13 21,5" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {errors.email && <span className="auth-error">{errors.email}</span>}

          <div className="auth-field">
            <span className="auth-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errors.password && <span className="auth-error">{errors.password}</span>}

          <div className="auth-options">
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span className="auth-checkmark">
                {remember && (
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                )}
              </span>
              <span>Recuérdame</span>
            </label>
          </div>

          {errors.general && <p className="auth-error-general">{errors.general}</p>}

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="auth-btn-google"
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "11px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            color: "#334155",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "14px"
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
          Ingresar con Google
        </button>

        <Link to="/registro" className="auth-btn-secondary" style={{ display: "block", marginTop: "16px", textAlign: "center" }}>REGISTRARSE</Link>
      </div>
    </div>
  );
}