// src/components/pages/audiciones/historial.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { historialService } from "@/services/historialService.js";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import infoIcon from "/info.png";
import Modal from "@/components/common/Modal.jsx";

export default function HistorialAudicionesPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [viewRow, setViewRow] = useState(null);
  const [verResultado, setVerResultado] = useState(null); // {estado, obs}

  useEffect(() => {
    (async () => {
      const data = await historialService.list();
      setRows(data);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => r.nombre.toLowerCase().includes(t));
  }, [rows, q]);

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
            placeholder="Buscar por nombre de candidatos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th><span className="th-label">Nombre</span></th>
              <th><span className="th-label">Audición</span></th>
              <th><span className="th-label">Canción</span></th>
              <th style={{ textAlign: "center" }}><span className="th-label">Resultado</span></th>
              <th style={{ textAlign: "center" }}><span className="th-label">Inscripción</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="abmc-row">
                <td>{r.nombre}</td>
                <td>{r.fechaAudicion}</td>
                <td>{r.cancion}</td>
                <td style={{ textAlign: "center" }}>
                  <button className="btn-accion" onClick={() => setVerResultado(r.resultado)} title="Ver resultado">
                    Ver
                  </button>
                </td>
                <td className="abmc-actions">
                  <button
                    className="btn-accion"
                    title="Ver inscripción"
                    onClick={() => setViewRow(r)}
                    aria-label="Ver inscripción"
                  >
                    <img src={infoIcon} alt="Info" style={{ width: 18, height: 18 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {verResultado && (
        <Modal isOpen onClose={() => setVerResultado(null)}>
          <div className="modal-body">
            <h3 className="pop-title" style={{ marginBottom: 10 }}>Resultado</h3>
            <div className="form-grid">
              <div className="field">
                <label>Estado</label>
                <input className="input" value={verResultado.estado || ""} readOnly disabled />
              </div>
              <div className="field">
                <label>Observaciones</label>
                <textarea className="input" rows={4} value={verResultado.obs || ""} readOnly disabled />
              </div>
            </div>
            <div className="pop-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setVerResultado(null)}>Cerrar</button>
            </div>
          </div>
        </Modal>
      )}

      {viewRow && (
        <InscripcionView
          data={viewRow.inscripcion}
          open={true}
          onClose={() => setViewRow(null)}
          editable={false}
        />
      )}
    </main>
  );
}
