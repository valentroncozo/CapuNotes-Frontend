import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import BackButton from "@/components/common/BackButton";
import TableABMC from "@/components/common/table";
import EyeOnIcon from "@/assets/VisibilityOnIcon";
import EditIcon from "@/assets/EditIcon";
import TrashIcon from "@/assets/TrashIcon";
import AddIcon from "@/assets/AddIcon";
import Loader from "@/components/common/Loader";
import "@/styles/abmc.css";

import { fraternidadesService } from "@/services/fraternidadesService";
import FraternidadDetalleModal from "./FraternidadDetalleModal";

export default function FraternidadesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fraternidadesService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error cargando fraternidades", err);
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: err?.response?.data || "No se pudieron obtener las fraternidades.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return items;
    const query = filter.toLowerCase();
    return items.filter((item) => item.nombre?.toLowerCase().includes(query));
  }, [items, filter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        (a.nombre || "").localeCompare(b.nombre || "", "es", { sensitivity: "base" })
      ),
    [filtered]
  );

  const handleView = async (id) => {
    try {
      const detalle = await fraternidadesService.get(id);
      setViewing(detalle);
    } catch (err) {
      console.error("❌ Error al obtener fraternidad", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo cargar la fraternidad",
        text: err?.response?.data || "Intentalo nuevamente.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  const handleDelete = async (fraternidad) => {
    const res = await Swal.fire({
      title: `Eliminar ${fraternidad.nombre}?`,
      text: "Los miembros quedarán sin fraternidad asignada.",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#DE9205",
      cancelButtonColor: "#6c757d",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
      background: "#11103a",
      color: "#E8EAED",
    });
    if (!res.isConfirmed) return;

    try {
      await fraternidadesService.remove(fraternidad.id);
      await load();
      Swal.fire({
        icon: "success",
        title: "Fraternidad eliminada",
        timer: 1500,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });
    } catch (err) {
      console.error("❌ Error al eliminar fraternidad", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: err?.response?.data || "Intentá nuevamente.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  const headers = ["Nombre", "Cantidad de miembros", "Acciones"];
  const columns = ["nombre", "cantidadMiembros"];

  const actions = [
    {
      className: "abmc-btn abmc-btn-icon",
      onClick: (row) => handleView(row.id),
      title: "Ver detalles",
      icon: <EyeOnIcon width={18} height={18} fill="var(--text-light)" />,
    },
    {
      className: "abmc-btn abmc-btn-icon",
      onClick: (row) => navigate(`/fraternidades/${row.id}/editar`),
      title: "Editar",
      icon: <EditIcon />,
    },
    {
      className: "abmc-btn abmc-btn-icon",
      onClick: (row) => handleDelete(row),
      title: "Eliminar",
      icon: <TrashIcon />,
    },
  ];

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Fraternidades</h1>
        </div>

        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar por nombre"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={() => navigate("/fraternidades/nueva")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e3e3e3">
              <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div
            style={{
              width: "100%",
              padding: "3rem 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        ) : (
          <TableABMC
            headers={headers}
            data={sorted}
            columns={columns}
            actions={actions}
            emptyMenssage="No hay fraternidades registradas."
          />
        )}

      </div>

      {viewing && (
        <FraternidadDetalleModal
          fraternidad={viewing}
          isOpen={Boolean(viewing)}
          onClose={() => setViewing(null)}
        />
      )}
    </main>
  );
}

