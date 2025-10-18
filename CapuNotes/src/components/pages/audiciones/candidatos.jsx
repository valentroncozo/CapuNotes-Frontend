// src/components/pages/audiciones/candidatos.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import { candidatosService } from "@/services/candidatosService";
import { CANDIDATO_STORAGE_KEY, candidatoResultados, fmtHora } from "@/schemas/candidatos";
import "@/styles/abmc.css";

const seed = [
  { hora: "17:00", nombre: "Beglardo, Francisco", cancion: "Ya me enteré, Reik", resultado: "—" },
  { hora: "17:15", nombre: "Alejandro, Peréz",   cancion: "Aleluya", resultado: "✖" },
  { hora: "17:30", nombre: "Contretas, Stefani", cancion: "Ella y yo, Don Omar", resultado: "—" },
  { hora: "17:45", nombre: "Bottari, Juan Mauro", cancion: "Zamba para olvidar, Abel Pintos", resultado: "—" },
  { hora: "18:00", nombre: "Acuña, Micaela Sol", cancion: "Intento, Ulises Bueno", resultado: "—" },
  { hora: "18:15", nombre: "Cantarutti, Ariana Gabriela", cancion: "Eterno Amor, Juan Fuentes", resultado: "—" },
];

export default function Candidatos() {
  const [dia, setDia] = useState("Viernes 14");
  const [q, setQ]   = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const arr = JSON.parse(localStorage.getItem(CANDIDATO_STORAGE_KEY) || "[]");
      if (!arr.length) {
        // sembramos datos de ejemplo
        for (const s of seed) await candidatosService.create(s);
      }
      const list = await candidatosService.list();
      setItems(list);
    };
    init();
  }, []);

  const filtrados = useMemo(() => {
    if (!q) return items;
    const term = q.toLowerCase();
    return items.filter(it =>
      (it.nombre || "").toLowerCase().includes(term) ||
      (it.cancion || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Candidatos</h1>
        </div>

        {/* Topbar: buscar + día */}
        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar por nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="abmc-select"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            aria-label="Seleccionar día"
            style={{ maxWidth: 220 }}
          >
            <option>Viernes 14</option>
            <option>Sábado 15</option>
            <option>Domingo 16</option>
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Hora</th>
              <th>Nombre</th>
              <th>Canción</th>
              <th>Resultado</th>
              <th style={{ textAlign: "center" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="abmc-row">
                <td colSpan={5} style={{ textAlign: "center" }}>Sin candidatos</td>
              </tr>
            )}

            {filtrados.map((c) => (
              <tr className="abmc-row" key={c.id}>
                <td style={{ whiteSpace: "nowrap" }}>{fmtHora(c.hora)}</td>
                <td>{c.nombre}</td>
                <td>{c.cancion}</td>
                <td>
                  <span className={`badge-resultado ${c.resultado === "✔" ? "ok" : c.resultado === "✖" ? "bad" : "pend"}`}>
                    {c.resultado}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  {/* Botón para abrir formulario (placeholder) */}
                  <button
                    type="button"
                    className="mini-plus-btn"
                    title="Abrir formulario de evaluación"
                    onClick={() => alert("Abrir formulario (a implementar)")}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <small style={{ opacity: .8 }}>Vista de <b>evaluadores</b>: pueden asignar <i>Resultado</i>.</small>
      </div>
    </main>
  );
}
