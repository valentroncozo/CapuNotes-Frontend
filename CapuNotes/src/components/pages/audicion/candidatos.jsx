import { useEffect, useMemo, useState, useCallback } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";
import { candidatosService } from "@/services/candidatosService.js";
import InfoIcon from "@/assets/InfoIcon.jsx";
import ResultadosModal from "./resultados.jsx";

export default function CandidatosPage() {
  const [rows, setRows] = useState([]);
  const [audicionActual, setAudicionActual] = useState(null);
  const [q, setQ] = useState("");
  const [diaSel, setDiaSel] = useState("-");
  const [dias, setDias] = useState([]);
  const [, setVerInscripcion] = useState(null);
  const [editResultado, setEditResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // 🔹 Cargar audición actual y generar los días del rango
  const loadAudicionActual = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadAudicionActual();
  }, [loadAudicionActual]);

  // 🔹 Cargar candidatos
  const loadCandidatos = async (audicionId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/audiciones/${audicionId}/candidatos`);
      if (!res.ok) throw new Error("Error al obtener candidatos");
      const cd = await res.json();
      console.log("📅 Datos de candidatos:", cd[0]);

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

  // 🔹 Botón de resultado (usa ResultadosModal)
  const getResultadoButton = (r) => {
    const estadoRaw = r.resultado?.estado || r.resultado || r.estado || "";
    const estado = String(estadoRaw || "").toLowerCase();
    const idInscripcion = r.idInscripcion || r.inscripcionId || r.id;

    const isNoResultado = !estado || estado === "pendiente" || estado === "sin";
    const isAceptado = estado === "aceptado" || estado === "aprobado";
    const isRechazado = estado === "rechazado";

    const color = isNoResultado ? "#444" : isAceptado ? "green" : isRechazado ? "red" : "#444";
    const label = isNoResultado ? "Añadir" : isAceptado ? "✅" : "❌";
    const readOnly = !isNoResultado; // ✅ Solo lectura si ya hay resultado

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

          const modalRow = {
            ...r,
            idInscripcion,
            resultado:
              typeof r.resultado === "object"
                ? r.resultado
                : { estado: r.resultado || "", obs: r.observaciones || r.obs || "" },
          };

          setEditResultado({ ...modalRow, readOnly }); // ✅ se pasa al modal
        }}
      >
        {label}
      </button>
    );
  };

  // 🔹 Render principal
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

      {/* Modal de resultados */}
      {editResultado && (
        <ResultadosModal
          row={editResultado}
          readOnly={editResultado.readOnly}
          onClose={() => setEditResultado(null)}
          onSave={async (estado, obs) => {
            try {
              // 🔹 Actualizamos el resultado en el backend
              await candidatosService.updateResultado(editResultado.idInscripcion, {
                estado,
                obs,
                cuerda: editResultado.cuerda?.name,
                cancion: editResultado.cancion,
              });

              // 🔹 Actualizamos localmente sin recargar todo
              setRows((prev) =>
                prev.map((r) =>
                  (r.idInscripcion || r.id) === editResultado.idInscripcion
                    ? {
                        ...r,
                        resultado: {
                          estado,
                          obs,
                        },
                      }
                    : r
                )
              );

              // 🔹 Cerramos modal
              setEditResultado(null);
            } catch (err) {
              console.error("❌ Error al guardar resultado:", err);
              alert("No se pudo guardar el resultado.");
            }
          }}
        />
      )}
    </main>
  );
}
