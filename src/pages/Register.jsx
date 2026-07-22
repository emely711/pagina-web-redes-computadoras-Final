import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signOut, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
      return "Cerraste la ventana de Google antes de terminar el registro.";
    case "auth/cancelled-popup-request":
      return null;
    default:
      return `Error de Google: ${error.code || error.message}`;
  }
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      // 1. Registrar usuario con credenciales manuales en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // 2. Guardar el nombre en su perfil de Firebase
      await updateProfile(userCredential.user, {
        displayName: formData.nombre
      });

      // 3. Guardar el perfil del usuario en Firestore (colección "usuarios")
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nombre: formData.nombre,
        email: formData.email,
        fechaRegistro: serverTimestamp(),
        proveedor: "email",
      });

      // 4. Forzar el cierre de sesión inmediato para evitar el auto-login de Firebase
      await signOut(auth);

      toast.success("¡Registro completado! Ahora inicia sesión.");
      navigate("/login");
    } catch (error) {
      toast.error("Error al registrar: " + error.message);
    }
  };

  // Función para registrarse de forma directa con una cuenta de Google
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Solo creamos el documento de perfil si el usuario es nuevo
      const refPerfil = doc(db, "usuarios", user.uid);
      const perfilExistente = await getDoc(refPerfil);

      if (!perfilExistente.exists()) {
        await setDoc(refPerfil, {
          nombre: user.displayName || "Estudiante",
          email: user.email,
          fechaRegistro: serverTimestamp(),
          proveedor: "google",
        });
      }

      toast.success("¡Cuenta creada con Google!");
      navigate("/dashboard");
    } catch (error) {
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
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="16" y1="11" x2="22" y2="11" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-field">
            <span className="auth-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="auth-field">
            <span className="auth-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
                <line x1="12" y1="15" x2="12" y2="17" />
              </svg>
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn-primary">REGISTRARSE</button>
        </form>

        <button
          onClick={handleGoogleRegister}
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
          Registrarse con Google
        </button>

        <Link to="/login" className="auth-btn-secondary" style={{ display: "block", marginTop: "16px", textAlign: "center" }}>INICIAR SESIÓN</Link>

      </div>
    </div>
  );
}