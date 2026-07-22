// src/components/Apuntes/Apuntes.jsx
// CRUD (Crear, Leer, Actualizar, Eliminar) de apuntes personales del estudiante.
// Cada apunte se guarda en Firestore, en la colección "apuntes", ligado al uid
// del usuario autenticado, de modo que cada quien solo ve y gestiona los suyos.

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { temas } from "../../data/temas";
import "./Apuntes.css";

const FORM_INICIAL = { titulo: "", temaSlug: "", contenido: "" };

export default function Apuntes({ uid }) {
  const [apuntes, setApuntes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // ── READ: escuchar en tiempo real los apuntes del usuario autenticado ──
  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "apuntes"), where("uid", "==", uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Orden descendente por fecha (los más recientes primero).
        // Se ordena en el cliente para no depender de un índice compuesto en Firestore.
        lista.sort((a, b) => {
          const fechaA = a.fecha?.toMillis ? a.fecha.toMillis() : 0;
          const fechaB = b.fecha?.toMillis ? b.fecha.toMillis() : 0;
          return fechaB - fechaA;
        });

        setApuntes(lista);
        setCargando(false);
      },
      (err) => {
        console.error("Error al leer apuntes:", err);
        setError("No se pudieron cargar tus apuntes.");
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
  };

  // ── CREATE / UPDATE ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim()) return;

    setGuardando(true);
    setError("");

    try {
      if (editandoId) {
        // UPDATE: actualiza el apunte existente
        await updateDoc(doc(db, "apuntes", editandoId), {
          titulo: form.titulo,
          temaSlug: form.temaSlug,
          contenido: form.contenido,
        });
      } else {
        // CREATE: crea un apunte nuevo asociado al usuario
        await addDoc(collection(db, "apuntes"), {
          uid,
          titulo: form.titulo,
          temaSlug: form.temaSlug,
          contenido: form.contenido,
          fecha: serverTimestamp(),
        });
      }
      limpiarFormulario();
    } catch (err) {
      console.error("Error al guardar el apunte:", err);
      setError("Ocurrió un error al guardar el apunte. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (apunte) => {
    setForm({
      titulo: apunte.titulo || "",
      temaSlug: apunte.temaSlug || "",
      contenido: apunte.contenido || "",
    });
    setEditandoId(apunte.id);
  };

  // ── DELETE ──
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este apunte? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "apuntes", id));
      if (editandoId === id) limpiarFormulario();
    } catch (err) {
      console.error("Error al eliminar el apunte:", err);
      setError("Ocurrió un error al eliminar el apunte.");
    }
  };

  const nombreTema = (slug) => temas.find((t) => t.slug === slug)?.titulo || "General";

  return (
    <div className="ap-section">
      <div className="ap-header">
        <h2 className="dash-section-title">📝 Mis Apuntes</h2>
        <span className="ap-count">{apuntes.length} guardado{apuntes.length !== 1 ? "s" : ""}</span>
      </div>

      {error && <p className="ap-error">{error}</p>}

      {/* ── Formulario: Crear / Actualizar ── */}
      <form className="ap-form" onSubmit={handleSubmit}>
        <div className="ap-form-row">
          <div className="ap-form-group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ej. Resumen de subnetting"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ap-form-group">
            <label htmlFor="temaSlug">Tema relacionado</label>
            <select id="temaSlug" name="temaSlug" value={form.temaSlug} onChange={handleChange}>
              <option value="">General</option>
              {temas.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ap-form-group">
          <label htmlFor="contenido">Contenido</label>
          <textarea
            id="contenido"
            name="contenido"
            rows="4"
            placeholder="Escribe aquí tu apunte..."
            value={form.contenido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ap-form-actions">
          <button type="submit" className="ap-btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : editandoId ? "Actualizar apunte" : "Agregar apunte"}
          </button>
          {editandoId && (
            <button type="button" className="ap-btn-secondary" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {/* ── Lista de apuntes ── */}
      {cargando ? (
        <p className="ap-empty">Cargando apuntes...</p>
      ) : apuntes.length === 0 ? (
        <p className="ap-empty">Aún no tienes apuntes. ¡Crea el primero arriba! ✍️</p>
      ) : (
        <div className="ap-grid">
          {apuntes.map((apunte) => (
            <div key={apunte.id} className="ap-card">
              <div className="ap-card-top">
                <span className="ap-card-tag">{nombreTema(apunte.temaSlug)}</span>
              </div>
              <h3 className="ap-card-titulo">{apunte.titulo}</h3>
              <p className="ap-card-contenido">{apunte.contenido}</p>
              <div className="ap-card-actions">
                <button className="ap-btn-edit" onClick={() => handleEditar(apunte)}>
                  Editar
                </button>
                <button className="ap-btn-delete" onClick={() => handleEliminar(apunte.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
