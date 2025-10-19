// src/components/pages/miembros/index.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntityTableABMC from "@/components/abmc/EntityTableABMC.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros.js";
import { PencilFill, Trash3Fill } from "react-bootstrap-icons";
import infoIcon from "/info.png";
import Modal from "@/components/common/Modal.jsx";

export default function MiembrosPage() {
  const navigate = useNavigate();
  const baseSchema = useMemo(() => buildMiembroSchema(), []);

  // columnas visibles en la tabla
  const tableKeys = useMemo(() => new Set(["nombre", "apellido", "cuerda", "estado"]), []);

  const [infoRow, setInfoRow] = useState(null);

  const schemaForTable = useMemo(
    () => baseSchema.map((f) => (tableKeys.has(f.key) ? f : { ...f, table: false })),
    [baseSchema, tableKeys]
  );

  return (
    <div className="pantalla-miembros">
      <EntityTableABMC
        title="Miembros"
        service={miembrosService}
        schema={schemaForTable}
        entityName={miembroEntityName}
        showBackButton
        usePopupForm={false}
        onAdd={() => navigate("/miembros/agregar")}
        sortable
        renderActions={(row, { requestDelete }) => (
          <>
            <button
              type="button"
              className="btn-accion me-2"
              title="Más información"
              onClick={() => setInfoRow(row)}
            >
              <img src={infoIcon} alt="Info" style={{ width: 18, height: 18 }} />
            </button>
            <button
              type="button"
              className="btn-accion me-2"
              title="Editar"
              onClick={() => navigate(`/miembros/editar?id=${encodeURIComponent(row.id)}`)}
            >
              <PencilFill size={18} />
            </button>
            <button
              type="button"
              className="btn-accion eliminar"
              title="Eliminar"
              onClick={() => requestDelete(row)}
            >
              <Trash3Fill size={18} />
            </button>
          </>
        )}
      />

      {infoRow && (
        <Modal
          isOpen={true}
          onClose={() => setInfoRow(null)}
          title={`${infoRow.nombre} ${infoRow.apellido}`}
          showHeaderClose={true}
          actions={
            <button className="btn btn-secondary" onClick={() => setInfoRow(null)} type="button">
              Cerrar
            </button>
          }
        >
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px 16px" }}>
            {baseSchema
              .filter((f) => f.type !== "button" && f.type !== "submit")
              .map((f) => (
                <FragmentRow key={f.key} label={f.label} value={infoRow[f.key]} />
              ))}
          </dl>
        </Modal>
      )}
    </div>
  );
}

function FragmentRow({ label, value }) {
  return (
    <>
      <dt style={{ opacity: 0.8 }}>{label}</dt>
      <dd style={{ margin: 0 }}>{String(value ?? "—")}</dd>
    </>
  );
}
