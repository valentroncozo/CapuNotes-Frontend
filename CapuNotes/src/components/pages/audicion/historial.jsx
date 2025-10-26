import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import { historialService } from "@/services/historialService.js";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";
import ResultadosModal from "./resultados.jsx";

export default function HistorialAudicionesPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [verResultado, setVerResultado] = useState(null);
  const [, setVerInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // 🔄 Cargar historial desde backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await historialService.list();

        const rowsAdaptadas = (data || []).map((item, idx) => ({
          id: item.idInscripcion || idx + 1,
          nombre: item.nombre || "",
          apellido: item.apellido || "",
          nombreAudicion: item.nombreAudicion || item.audicion || "—",
          cancion: item.cancion || "",
          resultado: item.resultado || null,
          observaciones: item.observaciones || "",
          inscripcion: item,
        }));

        setRows(rowsAdaptadas);
      } catch (err) {
        console.error("Error cargando historial:", err);
        setError("Error cargando historial de audiciones.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔤 Función auxiliar: quita tildes y pasa a minúsculas
    const normalizeText = (text) =>
      String(text || "")
        .toLowerCase()
        .normalize("NFD")              // separa las tildes de las letras
        .replace(/[\u0300-\u036f]/g, ""); // elimina las tildes, diéresis, etc.

    // 🔍 Filtro solo por nombre y apellido (ignorando tildes)
    const filtered = useMemo(() => {
      if (!q) return rows;
      const t = normalizeText(q);
      return rows.filter(
        (r) =>
          normalizeText(r.nombre).includes(t) ||
          normalizeText(r.apellido).includes(t)
      );
    }, [rows, q]);


  // 🔽 Orden solo por nombre
  const sorted = useMemo(() => {
    if (sortBy !== "nombre") return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const aNombre = `${a.apellido || ""}, ${a.nombre || ""}`.toLowerCase();
      const bNombre = `${b.apellido || ""}, ${b.nombre || ""}`.toLowerCase();
      return aNombre.localeCompare(bNombre) * dir;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  // 🕒 Loading / Error
  if (loading)
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Historial de audiciones</h1>
          </div>
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Cargando historial...
          </p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Historial de audiciones</h1>
          </div>
          <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            {error}
          </p>
        </div>
      </main>
    );

  // 🧾 Tabla principal
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Historial de audiciones</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre o apellido"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("nombre")}>
                <span className="th-label">Nombre</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("nombre")}
                  aria-label="Ordenar por Nombre"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th>
                <span className="th-label">Audición</span>
              </th>

              <th>
                <span className="th-label">Canción</span>
              </th>

              <th>
                <span className="th-label">Resultado</span>
              </th>

              <th style={{ width: 60 }} aria-hidden="true" />
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#666",
                  }}
                >
                  {q
                    ? "No se encontraron resultados con ese nombre o apellido."
                    : "No hay registros en el historial de audiciones."}
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const nombreCompleto =
                  [r.apellido, r.nombre].filter(Boolean).join(", ") || "—";

                return (
                  <tr key={r.id} className="abmc-row">
                    <td>{nombreCompleto}</td>
                    <td>{r.nombreAudicion || "—"}</td>
                    <td>{r.cancion || "—"}</td>

                    {/* ✅ Resultado: solo botón, como el original */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-accion"
                        onClick={() =>
                          setVerResultado({
                            ...r,
                            idInscripcion: r.idInscripcion || r.inscripcion?.id || r.id,
                            resultado:
                              typeof r.resultado === "object"
                                ? r.resultado
                                : { estado: r.resultado || "", obs: r.observaciones || "" },
                          })
                        }
                        title="Ver detalles del resultado"
                        aria-label="Ver detalles del resultado"
                      >
                        Ver
                      </button>
                    </td>


                    {/* ✅ Botón + alineado igual que antes */}
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-accion"
                        title="Abrir cuestionario de inscripción"
                        onClick={() => setVerInscripcion(r.inscripcion || r)}
                        aria-label="Abrir cuestionario de inscripción"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resultado modal (centralized read-only view) */}
      {verResultado && (
        <ResultadosModal row={verResultado} onClose={() => setVerResultado(null)} />
      )}

      
    </main>
  );
}
