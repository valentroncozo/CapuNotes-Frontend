// src/components/pages/miembros/index.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import BackButton from "@/components/common/BackButton.jsx";
import TableABMC from "@/components/common/table.jsx";
import Modal from "@/components/common/Modal.jsx";
import InfoIcon from "@/assets/InfoIcon.jsx";

import { PencilFill, Trash3Fill } from "react-bootstrap-icons";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema } from "@/schemas/miembros.js";

import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";

export default function MiembrosPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [infoRow, setInfoRow] = useState(null);

  // Para el modal de "Más info"
  const schema = useMemo(() => buildMiembroSchema(), []);

  const load = async () => {
    const data = await miembrosService.list();
    setRows(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => {
      const nombre = String(r?.nombre || "").toLowerCase();
      const apellido = String(r?.apellido || "").toLowerCase();
      const cuerda = String(r?.cuerda || "").toLowerCase();
      const estado = String(r?.estado || "").toLowerCase();
      return (
        nombre.includes(t) ||
        apellido.includes(t) ||
        `${apellido}, ${nombre}`.includes(t) ||
        cuerda.includes(t) ||
        estado.includes(t)
      );
    });
  }, [rows, q]);

  const headers = ["Nombre", "Apellido", "Cuerda", "Estado"];
  const columns = ["nombre", "apellido", "cuerda", "estado"];

  const actions = [
    {
      title: "Más información",
      label: "",
      className: "btn-accion btn-accion--icon",
      icon: <InfoIcon size={18} />,
      onClick: (row) => setInfoRow(row),
    },
    {
      title: "Editar",
      label: "",
      className: "btn-accion btn-accion--icon",
      icon: <PencilFill size={18} />,
      onClick: (row) => navigate(`/miembros/editar?id=${row.id}`),
    },
    {
      title: "Eliminar",
      label: "",
      className: "btn-accion btn-accion--icon",
      icon: <Trash3Fill size={18} />,
      onClick: async (row) => {
        const res = await Swal.fire({
          title: `¿Eliminar a ${row.nombre} ${row.apellido}?`,
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ffc107",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          background: "#11103a",
          color: "#E8EAED",
        });
        if (!res.isConfirmed) return;
        await miembrosService.remove(row.id);
        await load();
        await Swal.fire({
          icon: "success",
          title: "Miembro eliminado",
          timer: 1300,
          showConfirmButton: false,
          background: "#11103a",
          color: "#E8EAED",
        });
      },
    },
  ];

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Miembros</h1>
          <hr className="divisor-amarillo" />
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre, apellido, cuerda o estado…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar miembros"
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/miembros/agregar")}
            type="button"
          >
            Agregar miembro
          </button>
        </div>

        <TableABMC
          headers={headers}
          data={filtered}
          columns={columns}
          actions={actions}
          emptyMenssage={filtered.length === 0 ? "No hay miembros para mostrar." : ""}
        />
      </div>

      {infoRow && (
        <Modal
          isOpen={true}
          onClose={() => setInfoRow(null)}
          title={`${infoRow.nombre ?? ""} ${infoRow.apellido ?? ""}`.trim() || "Detalle"}
          showHeaderClose={true}
          actions={
            <button className="btn btn-secondary" onClick={() => setInfoRow(null)} type="button">
              Cerrar
            </button>
          }
        >
          <dl style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "8px 16px" }}>
            {schema
              .filter((f) => !["button", "submit", "label"].includes(f.type))
              .map((f) => (
                <FragmentRow key={f.key} label={f.label} value={infoRow[f.key]} />
              ))}
          </dl>
        </Modal>
      )}
    </main>
  );
}

function FragmentRow({ label, value }) {
  return (
    <>
      <dt style={{ opacity: 0.85 }}>{label}</dt>
      <dd style={{ margin: 0 }}>{String(value ?? "—")}</dd>
    </>
  );
}
