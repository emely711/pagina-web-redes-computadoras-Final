import { useState } from "react";
import { temas } from "../../data/temas";
import "./Apuntes.css";

const FORM_INICIAL = { titulo: "", temaSlug: "", contenido: "" };

// Clave de localStorage por usuario, para que cada quien vea solo sus apuntes
const claveStorage = (uid) => `apuntes_${uid}`;

// ── Helpers de acceso a localStorage ──
const leerApuntes = (uid) => {
  try {
    const data = localStorage.getItem(claveStorage(uid));
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error al leer apuntes de localStorage:", err);
    return [];
  }
};

const guardarApuntes = (uid, apuntes) => {
  localStorage.setItem(claveStorage(uid), JSON.stringify(apuntes));
};

export default function Apuntes({ uid }) {
 const [apuntes, setApuntes] = useState(() => {
    const lista = leerApuntes(uid);
    lista.sort((a, b) => (b.fecha || 0) - (a.fecha || 0));
    return lista;
  });
  const [uidAnterior, setUidAnterior] = useState(uid);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // ── READ: si cambia el usuario (uid), recargar sus apuntes ──
  // Se ajusta el estado durante el render (patrón recomendado por React),
  // en vez de usar useEffect, para evitar el warning de setState en efectos.
  if (uid !== uidAnterior) {
    setUidAnterior(uid);
    const lista = uid ? leerApuntes(uid) : [];
    lista.sort((a, b) => (b.fecha || 0) - (a.fecha || 0));
    setApuntes(lista);
  }

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
      let nuevaLista;

      if (editandoId) {
        // UPDATE: actualiza el apunte existente
        nuevaLista = apuntes.map((a) =>
          a.id === editandoId
            ? { ...a, titulo: form.titulo, temaSlug: form.temaSlug, contenido: form.contenido }
            : a
        );
      } else {
        // CREATE: crea un apunte nuevo asociado al usuario
        const nuevoApunte = {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          uid,
          titulo: form.titulo,
          temaSlug: form.temaSlug,
          contenido: form.contenido,
          fecha: Date.now(),
        };
        nuevaLista = [nuevoApunte, ...apuntes];
      }

      nuevaLista.sort((a, b) => (b.fecha || 0) - (a.fecha || 0));
      guardarApuntes(uid, nuevaLista);
      setApuntes(nuevaLista);
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
  const handleEliminar = (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este apunte? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      const nuevaLista = apuntes.filter((a) => a.id !== id);
      guardarApuntes(uid, nuevaLista);
      setApuntes(nuevaLista);
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

      {apuntes.length === 0 ? (
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