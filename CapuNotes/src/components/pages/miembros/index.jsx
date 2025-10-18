// src/components/pages/miembros/index.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntityTableABMC from "@/components/abmc/EntityTableABMC.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroUniqueBy, miembroEntityName } from "@/schemas/miembros.js";
import { PencilFill, Trash3Fill } from "react-bootstrap-icons";
import infoIcon from "/info.png";

export default function MiembrosPage() {
  const navigate = useNavigate();
  const baseSchema = useMemo(() => buildMiembroSchema(), []);
  const [infoRow, setInfoRow] = useState(null);
  const tableKeys = new Set(["nombre", "apellido", "cuerda", "estado"]);
  const schemaForTable = useMemo(
    () => baseSchema.map((f) => (tableKeys.has(f.key) ? f : { ...f, table: false })),
    [baseSchema]
  );

  return (
    <div className="pantalla-miembros">
      <EntityTableABMC
        title="Miembros"
        service={miembrosService}
        schema={schemaForTable}
        uniqueBy={miembroUniqueBy}
        entityName={miembroEntityName}
        showBackButton
        usePopupForm={false}
        onAdd={() => navigate("/miembros/agregar")}
        sortable={true}
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
              onClick={() => navigate(`/miembros/editar?id=${row.id}`)}
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
        <div className="pop-backdrop" onMouseDown={() => setInfoRow(null)}>
          <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()}>
            <div className="pop-header">
              <h3 className="pop-title">
                {infoRow.nombre} {infoRow.apellido}
              </h3>
              <button className="icon-btn" onClick={() => setInfoRow(null)} type="button">
                ✕
              </button>
            </div>
            <div className="pop-body">
              <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px 16px" }}>
                {baseSchema
                  .filter((f) => f.type !== "button" && f.type !== "submit")
                  .map((f) => (
                    <FragmentRow key={f.key} label={f.label} value={infoRow[f.key]} />
                  ))}
              </dl>
            </div>
            <div className="pop-footer">
              <button className="btn btn-secondary" onClick={() => setInfoRow(null)} type="button">
                Cerrar
              </button>
            </div>
          </div>
        </div>
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
