// src/components/abmc/EntityTableABMC.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "../common/BackButton";
import { PencilFill, Trash3Fill, PlusLg } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import EntityEditForm from "./EntityEditForm.jsx";
import "@/styles/abmc.css";
import "@/styles/miembros.css";

/**
 * ABMC Genérico (versión modal)
 */
export default function EntityTableABMC({
  title = "Catálogo",
  service,
  schema = [],
  uniqueBy = null,
  entityName = "elemento",
  showBackButton = true,
}) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // Popup state
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await service.list();
        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [service]);

  const visibleFields = useMemo(
    () => schema.filter((f) => f.type !== "submit" && f.type !== "button"),
    [schema]
  );

  const filtrados = useMemo(() => {
    if (!q) return items;
    const t = q.toLowerCase();
    return items.filter((row) =>
      visibleFields.some((f) =>
        String(row?.[f.key] ?? "").toLowerCase().includes(t)
      )
    );
  }, [items, q, visibleFields]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const isDuplicate = (payload) => {
    if (!uniqueBy) return false;
    const keys = Array.isArray(uniqueBy) ? uniqueBy : [uniqueBy];
    const normalized = (v) => String(v ?? "").trim().toLowerCase();
    return items.some((it) => {
      if (payload.id && it.id === payload.id) return false;
      return keys.every((k) => normalized(it[k]) === normalized(payload[k]));
    });
  };

  const handleSave = async (data) => {
    try {
      if (isDuplicate(data)) {
        await Swal.fire({
          icon: "warning",
          title: "Ya existe",
          text: `Ya existe ${entityName} con ese/estos dato(s) único(s).`,
          background: "#11103a",
          color: "#E8EAED",
        });
        return;
      }

      if (editing) {
        const updated = await service.update({ ...editing, ...data });
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        await Swal.fire({
          icon: "success",
          title: "Cambios guardados",
          timer: 1200,
          showConfirmButton: false,
          background: "#11103a",
          color: "#E8EAED",
        });
      } else {
        const created = await service.create(data);
        setItems((prev) => [...prev, created]);
        await Swal.fire({
          icon: "success",
          title: "Registrado",
          timer: 1200,
          showConfirmButton: false,
          background: "#11103a",
          color: "#E8EAED",
        });
      }
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Ups",
        text: e?.message || "No se pudo guardar.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar ${entityName}?`,
      text: row?.nombre || "Se quitará de la lista.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    });
    if (!confirm.isConfirmed) return;

    await service.remove(row.id);
    setItems((prev) => prev.filter((x) => x.id !== row.id));
    await Swal.fire({
      icon: "success",
      title: "Eliminado",
      timer: 1000,
      showConfirmButton: false,
      background: "#11103a",
      color: "#E8EAED",
    });
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder={`Buscar ${entityName}...`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="abmc-btn abmc-btn-primary"
            onClick={openAdd}
            title={`Agregar ${entityName}`}
          >
            <PlusLg className="me-1" /> Agregar
          </button>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              {visibleFields.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr className="abmc-row">
                <td colSpan={visibleFields.length + 1}>Cargando...</td>
              </tr>
            )}

            {!loading && filtrados.length === 0 && (
              <tr className="abmc-row">
                <td colSpan={visibleFields.length + 1}>Sin registros</td>
              </tr>
            )}

            {!loading &&
              filtrados.map((row) => (
                <tr className="abmc-row" key={row.id}>
                  {visibleFields.map((f) => (
                    <td key={f.key}>{String(row?.[f.key] ?? "-")}</td>
                  ))}
                  <td className="abmc-actions">
                    <button
                      className="btn-accion me-2"
                      onClick={() => openEdit(row)}
                      title="Editar"
                    >
                      <PencilFill size={18} />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => handleDelete(row)}
                      title="Eliminar"
                    >
                      <Trash3Fill size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <EntityEditForm
        isOpen={isOpen}
        onClose={closeModal}
        entityName={entityName}
        schema={visibleFields}
        entity={editing}
        onSave={handleSave}
      />
    </main>
  );
}
