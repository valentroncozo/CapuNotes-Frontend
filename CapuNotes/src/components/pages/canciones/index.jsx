import { useEffect, useMemo, useState } from "react";
import { Eye, CheckCircleFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import BackButton from "@/components/common/BackButton";
import CancionModal from "./CancionModal";
import { cancionesService } from "@/services/cancionesService";
import { categoriasCancionesService } from "@/services/categoriasCancionesService";
import { tiemposLiturgicosService } from "@/services/tiemposLiturgicosService";
import AddIcon from "@/assets/AddIcon";
import EditIcon from "@/assets/EditIcon";
import TrashIcon from "@/assets/TrashIcon";
import "@/styles/abmc.css";
import { normalizeText } from "@/utils/text";

export default function CancionesPage() {
  const [canciones, setCanciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiempos, setTiempos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCancion, setSelectedCancion] = useState(null);

  const mapNamesToIds = (names, catalog) => {
    if (!Array.isArray(names) || !names.length) return [];
    const normalized = names
      .filter(Boolean)
      .map((name) => String(name).toLowerCase());
    return catalog
      .filter((item) =>
        normalized.includes(String(item.nombre || "").toLowerCase())
      )
      .map((item) => item.id);
  };

  const normalizeCancion = (cancion) => {
    if (!cancion) return null;
    const categoriasIds =
      Array.isArray(cancion.categoriaIds) && cancion.categoriaIds.length
        ? cancion.categoriaIds
        : mapNamesToIds(cancion.categoriasNombres, categorias);
    const tiemposIds =
      Array.isArray(cancion.tiempoLiturgicoIds) &&
      cancion.tiempoLiturgicoIds.length
        ? cancion.tiempoLiturgicoIds
        : mapNamesToIds(cancion.tiemposLiturgicosNombres, tiempos);

    return {
      ...cancion,
      categoriaIds: categoriasIds,
      tiempoLiturgicoIds: tiemposIds,
    };
  };

  const loadCanciones = async () => {
    try {
      const data = await cancionesService.list();
      setCanciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar canciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudieron cargar las canciones.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const loadCatalogos = async () => {
    try {
      const [catRes, tiempoRes] = await Promise.all([
        categoriasCancionesService.list(),
        tiemposLiturgicosService.list(),
      ]);
      setCategorias((Array.isArray(catRes) ? catRes : []).filter((c) => c.activo !== false));
      setTiempos((Array.isArray(tiempoRes) ? tiempoRes : []).filter((t) => t.activo !== false));
    } catch (error) {
      console.error("❌ Error al cargar catálogos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar categorías o tiempos.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  useEffect(() => {
    const cargarTodo = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadCanciones(), loadCatalogos()]);
      } finally {
        setIsLoading(false);
      }
    };
    cargarTodo();
  }, []);

  const filteredCanciones = useMemo(() => {
    const q = normalizeText(searchTerm).trim();
    if (!q) return canciones;
    return canciones.filter((cancion) => {
      const titulo = normalizeText(cancion.titulo);
      const cat = normalizeText(
        Array.isArray(cancion.categoriasNombres)
          ? cancion.categoriasNombres.join(" ")
          : cancion.categoriasNombres || ""
      );
      const tiemposText = normalizeText(
        Array.isArray(cancion.tiemposLiturgicosNombres)
          ? cancion.tiemposLiturgicosNombres.join(" ")
          : cancion.tiemposLiturgicosNombres || ""
      );
      return titulo.includes(q) || cat.includes(q) || tiemposText.includes(q);
    });
  }, [canciones, searchTerm]);

  const openModal = (mode, cancion = null) => {
    setModalMode(mode);
    setSelectedCancion(mode === "create" ? null : normalizeCancion(cancion));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCancion(null);
  };

  const handleModalSubmit = async (mode, payload) => {
    try {
      if (mode === "create") {
        await cancionesService.create(payload);
        Swal.fire({
          icon: "success",
          title: "Canción agregada",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await cancionesService.update(selectedCancion?.id, payload);
        Swal.fire({
          icon: "success",
          title: "Canción actualizada",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeModal();
      await loadCanciones();
    } catch (error) {
      console.error("❌ Error al guardar canción:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudo guardar la canción.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const confirmDelete = async (cancion) => {
    const res = await Swal.fire({
      title: `¿Eliminar ${cancion.titulo}?`,
      text: "Esta acción marca la canción como inactiva.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DE9205",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });
    if (!res.isConfirmed) return;

    try {
      await cancionesService.remove(cancion.id);
      await loadCanciones();
      Swal.fire({
        icon: "success",
        title: "Canción inhabilitada",
        text: `${cancion.titulo} está inactiva.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ Error al eliminar canción:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudo eliminar la canción.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const confirmReactivate = async (cancion) => {
    const res = await Swal.fire({
      title: `¿Reactivar ${cancion.titulo}?`,
      text: "Esta canción volverá a estar activa.",
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
      await cancionesService.reactivar(cancion.id);
      await loadCanciones();
      Swal.fire({
        icon: "success",
        title: "Canción reactivada",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ Error al reactivar canción:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudo reactivar la canción.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const toastEmpty = !isLoading && filteredCanciones.length === 0;

  const formatList = (list) => {
    if (!Array.isArray(list)) return list || "—";
    const filtered = list.filter(Boolean);
    return filtered.length ? filtered.join(", ") : "—";
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Canciones</h1>
        </div>

        <div className="abmc-topbar" style={{ marginTop: 0 }}>
          <input
            type="text"
            placeholder="Buscar por título, categoría o tiempo"
            className="abmc-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            title="Agregar canción"
            onClick={() => openModal("create")}
          >
            <AddIcon width={20} height={20} fill="#fff" />
          </button>
        </div>

        <div className="abmc-table-wrapper">
          <table className="abmc-table abmc-table-rect abmc-table--aligned">
            <thead className="abmc-thead">
              <tr>
                <th>Título</th>
                <th>Categorías</th>
                <th>Tiempos litúrgicos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Cargando canciones...
                  </td>
                </tr>
              )}
              {!isLoading && toastEmpty && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay canciones registradas.
                  </td>
                </tr>
              )}
              {!isLoading &&
                filteredCanciones.map((cancion) => (
                  <tr
                    key={cancion.id}
                    style={{ opacity: cancion.activo === false ? 0.6 : 1 }}
                  >
                    <td>{cancion.titulo || "—"}</td>
                    <td>{formatList(cancion.categoriasNombres)}</td>
                    <td>{formatList(cancion.tiemposLiturgicosNombres)}</td>
                    <td className="abmc-actions">
                      <button
                        type="button"
                        className="abmc-btn abmc-btn-icon"
                        title="Ver canción"
                        onClick={() => openModal("view", cancion)}
                      >
                        <Eye />
                      </button>
                      <button
                        type="button"
                        className="abmc-btn abmc-btn-icon"
                        title="Editar canción"
                        onClick={() => openModal("edit", cancion)}
                      >
                        <EditIcon width={18} height={18} />
                      </button>
                      <button
                        type="button"
                        className="abmc-btn abmc-btn-icon"
                        title="Eliminar canción"
                        onClick={() => confirmDelete(cancion)}
                      >
                        <TrashIcon width={18} height={18} />
                      </button>
                      {!cancion.activo && (
                        <button
                          type="button"
                          className="abmc-btn abmc-btn-icon"
                          title="Reactivar canción"
                          onClick={() => confirmReactivate(cancion)}
                        >
                          <CheckCircleFill />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <CancionModal
        isOpen={modalOpen}
        onClose={closeModal}
        mode={modalMode}
        initialData={selectedCancion}
        onSubmit={handleModalSubmit}
        categorias={categorias}
        tiempos={tiempos}
      />
    </main>
  );
}
