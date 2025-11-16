import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, CheckCircleFill } from "react-bootstrap-icons";

import BackButton from "@/components/common/BackButton";
import RepertorioDetalleModal from "./RepertorioDetalleModal";
import StarIcon from "@/assets/StarIcon";
import AddIcon from "@/assets/AddIcon";
import EditIcon from "@/assets/EditIcon";
import TrashIcon from "@/assets/TrashIcon";
import { repertoriosService } from "@/services/repertoriosService";
import { formatDate } from "@/components/common/datetime";

import "@/styles/abmc.css";
import "@/styles/repertorios.css";
import { normalizeText } from "@/utils/text";

const sortCompare = {
  nombre: (a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es", { sensitivity: "base" }),
  fechaCreacion: (a, b) => new Date(a.fechaCreacion || 0) - new Date(b.fechaCreacion || 0),
  fechaUltimoEnsayo: (a, b) => new Date(a.fechaUltimoEnsayo || 0) - new Date(b.fechaUltimoEnsayo || 0),
  cantidadCanciones: (a, b) => (a.cantidadCanciones || 0) - (b.cantidadCanciones || 0),
};

export default function RepertoriosPage() {
  const navigate = useNavigate();
  const [repertorios, setRepertorios] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [sortField, setSortField] = useState("nombre");
  const [sortAsc, setSortAsc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRepertorio, setDetailRepertorio] = useState(null);

  const fetchRepertorios = async () => {
    try {
      const data = await repertoriosService.list();
      setRepertorios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar repertorios:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: error?.response?.data || "No se pudieron cargar los repertorios.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchRepertorios();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedRepertorios = useMemo(() => {
    const query = normalizeText(filtroTexto).trim();
    const base = repertorios.filter((repo) =>
      normalizeText(repo.nombre).includes(query)
    );
    const compare = sortCompare[sortField] || (() => 0);
    const comparator = (a, b) => {
      const result = compare(a, b);
      return sortAsc ? result : -result;
    };
    const favoritos = base.filter((repo) => repo.favorito);
    const noFavoritos = base.filter((repo) => !repo.favorito);
    return [...favoritos.sort(comparator), ...noFavoritos.sort(comparator)];
  }, [filtroTexto, repertorios, sortField, sortAsc]);

  const handleCreate = () => {
    navigate("/repertorios/nuevo");
  };

  const handleEdit = (repertorio) => {
    navigate(`/repertorios/${repertorio.id}/editar`);
  };

  const handleDelete = async (repertorio) => {
    const res = await Swal.fire({
      title: `¿Eliminar ${repertorio.nombre}?`,
      text: "Esta acción solo marca el repertorio como inactivo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await repertoriosService.remove(repertorio.id);
      await fetchRepertorios();
      Swal.fire({
        icon: "success",
        title: "Repertorio inhabilitado",
        text: `${repertorio.nombre} ahora está inactivo.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ Error al eliminar repertorio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudo eliminar el repertorio.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const handleToggleFavorito = async (repertorio) => {
    try {
      await repertoriosService.update(repertorio.id, {
        favorito: !repertorio.favorito,
      });
      await fetchRepertorios();
    } catch (error) {
      console.error("❌ Error al cambiar favorito:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: "Intentá nuevamente más tarde.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const handleReactivar = async (repertorio) => {
    const res = await Swal.fire({
      title: `¿Reactivar ${repertorio.nombre}?`,
      text: "Volverá a estar disponible en la lista.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, reactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await repertoriosService.reactivar(repertorio.id);
      await fetchRepertorios();
      Swal.fire({
        icon: "success",
        title: "Repertorio reactivado",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ Error al reactivar repertorio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reactivar el repertorio.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const openDetail = (repertorio) => {
    setDetailRepertorio(repertorio);
    setDetailOpen(true);
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return <span style={{ marginLeft: 6 }}>{sortAsc ? "▲" : "▼"}</span>;
  };

  const tableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="6">Cargando repertorios...</td>
        </tr>
      );
    }
    if (!sortedRepertorios.length) {
      return (
        <tr>
          <td colSpan="6">No hay repertorios cargados.</td>
        </tr>
      );
    }

    return sortedRepertorios.map((repo) => (
      <tr key={repo.id} style={{ opacity: repo.activo ? 1 : 0.6 }}>
        <td>{repo.nombre}</td>
        <td>{formatDate(repo.fechaCreacion)}</td>
        <td>{formatDate(repo.fechaUltimoEnsayo) || "—"}</td>
        <td>{repo.cantidadCanciones ?? repo.canciones?.length ?? "—"}</td>
        <td className="abmc-actions">
          <button
            type="button"
            className="abmc-btn abmc-btn-icon"
            title={repo.favorito ? "Quitar de favoritos" : "Marcar como favorito"}
            onClick={() => handleToggleFavorito(repo)}
          >
            <StarIcon filled={repo.favorito} color={repo.favorito ? "#ffffff" : "#E8EAED"} />
          </button>
          <button
            type="button"
            className="abmc-btn abmc-btn-icon"
            title="Ver repertorio"
            onClick={() => openDetail(repo)}
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            className="abmc-btn abmc-btn-icon"
            title="Editar"
            onClick={() => handleEdit(repo)}
          >
            <EditIcon width={18} height={18} />
          </button>
          <button
            type="button"
            className="abmc-btn abmc-btn-icon"
            title="Eliminar"
            onClick={() => handleDelete(repo)}
          >
            <TrashIcon width={18} height={18} />
          </button>
          {!repo.activo && (
            <button
              type="button"
              className="abmc-btn abmc-btn-icon"
              title="Reactivar repertorio"
              onClick={() => handleReactivar(repo)}
            >
              <CheckCircleFill size={18} />
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <main className="abmc-page repertorios-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Repertorios</h1>
        </div>

        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Buscar por nombre del repertorio"
            className="abmc-input"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            title="Agregar repertorio"
            onClick={handleCreate}
          >
            <AddIcon width={20} height={20} fill="#fff" />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="abmc-table abmc-table-rect abmc-table--aligned">
            <thead className="abmc-thead">
              <tr>
                <th>
                  <button type="button" className="abmc-sort-btn" onClick={() => handleSort("nombre")}>
                    Nombre {renderSortIndicator("nombre")}
                  </button>
                </th>
                <th>
                  <button type="button" className="abmc-sort-btn" onClick={() => handleSort("fechaCreacion")}>
                    Fecha creación {renderSortIndicator("fechaCreacion")}
                  </button>
                </th>
                <th>
                  <button type="button" className="abmc-sort-btn" onClick={() => handleSort("fechaUltimoEnsayo")}>
                    Último ensayo {renderSortIndicator("fechaUltimoEnsayo")}
                  </button>
                </th>
                <th>
                  <button type="button" className="abmc-sort-btn" onClick={() => handleSort("cantidadCanciones")}>
                    Cantidad canciones {renderSortIndicator("cantidadCanciones")}
                  </button>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>{tableBody()}</tbody>
          </table>
        </div>
      </div>

      <RepertorioDetalleModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        repertorio={detailRepertorio}
      />
    </main>
  );
}
