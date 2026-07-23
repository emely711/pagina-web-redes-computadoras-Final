import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import "./Auth.css";

const traducirErrorRegistro = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con ese correo.";
    case "auth/invalid-email":
      return "El correo no tiene un formato válido.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    default:
      return `Error: ${error.code || error.message}`;
  }
};

const traducirErrorGoogle = (error) => {
  switch (error.code) {
    case "auth/operation-not-allowed":
      return "El registro con Google no está habilitado en Firebase (Authentication > Sign-in method).";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase (Authentication > Settings > Authorized domains).";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana emergente. Permite pop-ups para este sitio.";
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana de Google antes de terminar el registro.";
    case "auth/cancelled-popup-request":
      return null;
    default:
      return `Error de Google: ${error.code || error.message}`;
  }
};

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarDatos = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

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

    if (formData.confirmarPassword !== formData.password) {
      nuevosErrores.confirmarPassword = "Las contraseñas no coinciden";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarDatos()) return;

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(user, { displayName: formData.nombre });
      toast.success("¡Cuenta creada correctamente!");
      navigate("/dashboard");
    } catch (error) {
      const mensaje = traducirErrorRegistro(error);
      setErrors({ general: mensaje });
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistro = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("¡Cuenta creada con Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar con Google:", error.code, error.message);
      const mensaje = traducirErrorGoogle(error);
      if (mensaje) toast.error(mensaje);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        {/* Panel izquierdo */}
        <div className="auth-side">
          <div className="auth-side-blob" />
          <h2 className="auth-side-title">¡Bienvenido de vuelta!</h2>
          <p className="auth-side-text">¿Ya tienes una cuenta?</p>
          <Link to="/login" className="auth-side-btn">
            Iniciar Sesión
          </Link>
        </div>

        {/* Panel derecho */}
        <div className="auth-content">
          <h1 className="auth-title">Registrarse</h1>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="auth-input"
              />
              <span className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </span>
            </div>
            {errors.nombre && <span className="auth-error">{errors.nombre}</span>}

            <div className="auth-field">
              <input
                type="email"
                name="email"
                placeholder="Correo"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
              <span className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3,5 12,13 21,5" />
                </svg>
              </span>
            </div>
            {errors.email && <span className="auth-error">{errors.email}</span>}

            <div className="auth-field">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />
              <span className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </span>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}

            <div className="auth-field">
              <input
                type="password"
                name="confirmarPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmarPassword}
                onChange={handleChange}
                className="auth-input"
              />
              <span className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </span>
            </div>
            {errors.confirmarPassword && (
              <span className="auth-error">{errors.confirmarPassword}</span>
            )}

            {errors.general && <p className="auth-error-general">{errors.general}</p>}

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <p className="auth-social-label">o Registrarse con Google</p>

          <div className="auth-social-row">
            <button
              onClick={handleGoogleRegistro}
              type="button"
              className="auth-social-btn"
              aria-label="Registrarse con Google"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                width="18"
                height="18"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
