import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";
import { candidatosService } from "@/services/candidatosService.js";
import InfoIcon from "@/assets/InfoIcon.jsx";

export default function CandidatosPage() {
  const [rows, setRows] = useState([]);
  const [audicionActual, setAudicionActual] = useState(null);
  const [q, setQ] = useState("");
  const [diaSel, setDiaSel] = useState("-");
  const [dias, setDias] = useState([]);
  const [verInscripcion, setVerInscripcion] = useState(null);
  const [editResultado, setEditResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    loadAudicionActual();
  }, []);

  // 🔹 Cargar audición actual y generar los días del rango
  const loadAudicionActual = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8080/audiciones/actual");
      if (res.status === 204) {
        setError("No hay audiciones activas actualmente.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener audición actual");
      const audicion = await res.json();
      setAudicionActual(audicion);

      // Generar días entre fechaInicio y fechaFin
      const startDate = new Date(audicion.fechaInicio + "T00:00:00");
      const endDate = new Date(audicion.fechaFin + "T00:00:00");
      const diasArray = [];

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        diasArray.push(`${yyyy}-${mm}-${dd}`);
      }

      setDias(diasArray);
      await loadCandidatos(audicion.id);
    } catch (err) {
      console.error("Error al obtener audición actual:", err);
      setError("Error al obtener la audición actual.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar candidatos
  const loadCandidatos = async (audicionId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/audiciones/${audicionId}/candidatos`);
      if (!res.ok) throw new Error("Error al obtener candidatos");
      const cd = await res.json();

      setRows(cd || []);
      setDiaSel("-");
    } catch (err) {
      console.error("Error al cargar candidatos:", err);
      setError("No se pudieron cargar los candidatos de la audición actual.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Normalización texto
  const normalizeText = (text) =>
    text?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  // 🔹 Filtrado por texto
  const filteredByText = useMemo(() => {
    if (!q) return rows;
    const t = normalizeText(q);
    return rows.filter((r) => {
      const ape = normalizeText(r.apellido);
      const nom = normalizeText(r.nombre);
      const apynom = `${ape}, ${nom}`;
      return ape.includes(t) || nom.includes(t) || apynom.includes(t);
    });
  }, [rows, q]);

  // 🔹 Filtrado por día
  const filtered = useMemo(() => {
    if (diaSel === "-") return filteredByText;
    return filteredByText.filter((r) => {
      const fechaTurno =
        r?.inscripcion?.turno?.fechaHoraInicio ||
        r?.fechaAudicion ||
        r?.dia ||
        "";
      if (!fechaTurno) return false;
      const fechaStr = fechaTurno.split("T")[0];
      return fechaStr === diaSel;
    });
  }, [filteredByText, diaSel]);

  // 🔹 Ordenamiento
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "apynom") {
        const av = normalizeText(`${a.apellido || ""} ${a.nombre || ""}`);
        const bv = normalizeText(`${b.apellido || ""} ${b.nombre || ""}`);
        return av.localeCompare(bv) * dir;
      }
      if (sortBy === "hora") {
        const toMinutes = (h) => {
          if (!h) return 0;
          const [hh, mm] = String(h).split(":").map(Number);
          return (hh || 0) * 60 + (mm || 0);
        };
        return (toMinutes(a.hora) - toMinutes(b.hora)) * dir;
      }
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  // 🔹 Utils UI
  const toggleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };
  const thClass = (key) => (sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable");

  // 🔹 Botón de resultado (añadir / aprobado / rechazado)
  const getResultadoButton = (r) => {
    const estado = r.resultado;
    const idInscripcion = r.idInscripcion;

    const color =
      !estado || estado === "PENDIENTE"
        ? "#444"
        : estado === "APROBADO"
        ? "green"
        : estado === "RECHAZADO"
        ? "red"
        : "#444";

    const label =
      !estado || estado === "PENDIENTE"
        ? "Añadir"
        : estado === "APROBADO"
        ? "✅"
        : estado === "RECHAZADO"
        ? "❌"
        : "Añadir";

    return (
      <button
        className="btn-accion"
        style={{ fontSize: "1.1rem", color }}
        onClick={() => {
          if (!idInscripcion) {
            console.warn("⚠️ No se encontró id de inscripción para el candidato:", r);
            alert("No se encontró la inscripción asociada a este candidato.");
            return;
          }

          setEditResultado({
            idInscripcion,
            estado: estado || "",
            obs: r.observaciones || "",
          });
        }}
      >
        {label}
      </button>
    );
  };

  // 🔹 Renderizado principal
  if (loading) {
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Candidatos</h1>
          </div>
          <p style={{ textAlign: "center", padding: "2rem" }}>Cargando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Candidatos</h1>
          </div>
          <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            Candidatos — {audicionActual?.nombre || "Audición actual"}
          </h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido o nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="abmc-input"
            value={diaSel}
            onChange={(e) => setDiaSel(e.target.value)}
          >
            <option value="-">Todos los días</option>
            {dias.map((d) => (
              <option key={d} value={d}>
                {new Date(d + "T00:00:00").toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </option>
            ))}
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("hora")}>
                <span className="th-label">Hora</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("hora")}
                  aria-label="Ordenar por hora"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("apynom")}>
                <span className="th-label">Nombre</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("apynom")}
                  aria-label="Ordenar por nombre"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>
              <th><span className="th-label">Resultado</span></th>
              <th style={{ textAlign: "center" }}></th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                  No hay candidatos en esta audición.
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.idInscripcion || r.id} className="abmc-row">
                  <td>{r.hora || "—"}</td>
                  <td>{r.nombre || "—"}</td>
                  <td>{r.cancion || "—"}</td>
                  <td style={{ textAlign: "center" }}>{getResultadoButton(r)}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-accion btn-accion--icon"
                      onClick={() => setVerInscripcion(r)}
                      title="Ver inscripción"
                    >
                      <InfoIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup de edición de resultado */}
      {editResultado && (
        <div className="pop-backdrop" onMouseDown={() => setEditResultado(null)}>
          <div
            className="pop-dialog"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
          >
            <div className="pop-header">
              <h3 className="pop-title">Resultado</h3>
              <button className="icon-btn" aria-label="Cerrar" onClick={() => setEditResultado(null)}>
                ✕
              </button>
            </div>

            <div className="pop-body">
              <div className="form-grid">
                <div className="field">
                  <label>Estado</label>
                  <select
                    className="input"
                    value={editResultado.estado || ""}
                    onChange={(e) =>
                      setEditResultado((prev) => ({
                        ...prev,
                        estado: e.target.value,
                      }))
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="APROBADO">Aprobado</option>
                    <option value="RECHAZADO">Rechazado</option>
                  </select>
                </div>

                <div className="field">
                  <label>Observaciones</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={editResultado.obs || ""}
                    onChange={(e) =>
                      setEditResultado((prev) => ({
                        ...prev,
                        obs: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pop-footer" style={{ justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await candidatosService.updateResultado(
                      editResultado.idInscripcion,
                      editResultado
                    );
                    setEditResultado(null);
                    await loadCandidatos(audicionActual.id);
                  } catch (err) {
                    console.error("Error al guardar resultado:", err);
                    alert("No se pudo guardar el resultado.");
                  }
                }}
              >
                Guardar
              </button>

              <button className="btn btn-secondary" onClick={() => setEditResultado(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
