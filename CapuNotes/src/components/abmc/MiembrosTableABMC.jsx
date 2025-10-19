// src/components/abmc/MiembrosTableABMC.jsx
import { useState, useEffect } from "react";
import BackButton from "../common/BackButton";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PencilFill, XCircleFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { miembrosService } from "@/services/miembrosService.js";
import { cuerdasService } from "@/services/cuerdasService.js";

import "../../styles/abmc.css";
import "../../styles/miembros.css";

export default function MiembrosTableABMC({
  title = "Miembros del coro",
  showBackButton = true,
}) {
  const navigate = useNavigate();
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCuerda, setFiltroCuerda] = useState("");

  // 🔹 Cargar miembros y cuerdas desde el backend
  const load = async () => {
    try {
      const [miembrosData, cuerdasData] = await Promise.all([
        miembrosService.list(),
        cuerdasService.list(),
      ]);

      // Ordenar alfabéticamente por apellido y nombre
      const ordenados = [...miembrosData].sort((a, b) => {
        const apA = a.apellido?.toLowerCase() || "";
        const apB = b.apellido?.toLowerCase() || "";
        if (apA !== apB) return apA.localeCompare(apB, "es", { sensitivity: "base" });
        return (a.nombre || "").localeCompare(b.nombre || "", "es", { sensitivity: "base" });
      });

      setListaMiembros(ordenados);
      setCuerdas(cuerdasData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔎 Filtros combinados
  const miembrosFiltrados = listaMiembros.filter((m) => {
    const matchTexto =
      !filtroTexto ||
      (m.nombre || "").toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (m.apellido || "").toLowerCase().includes(filtroTexto.toLowerCase());

    const matchCuerda =
      !filtroCuerda ||
      (m.cuerda?.name || "").toLowerCase() === filtroCuerda.toLowerCase();

    return matchTexto && matchCuerda;
  });

  // 🗑️ Eliminar miembro
  const handleEliminar = async (miembro) => {
    const res = await Swal.fire({
      title: `¿Eliminar a ${miembro?.nombre || "miembro"}?`,
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

    try {
      await miembrosService.remove(
        miembro.id?.nroDocumento,
        miembro.id?.tipoDocumento
      );
      await load();
      Swal.fire({
        title: "Eliminado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el miembro", "error");
    }
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        {/* === Encabezado === */}
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
        </div>

        {/* === Barra superior con buscador y filtro === */}
        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="abmc-input"
          />

          <select
            className="abmc-select"
            value={filtroCuerda}
            onChange={(e) => setFiltroCuerda(e.target.value)}
          >
            <option value="">Todas las cuerdas</option>
            {cuerdas.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <Button
            className="abmc-btn abmc-btn-primary"
            onClick={() => navigate("/miembros/agregar")}
          >
            Agregar miembro
          </Button>
        </div>

        {/* === Tabla === */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Nombre y Apellido</th>
              <th>Cuerda</th>
              <th>Área</th>
              <th>Activo</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {miembrosFiltrados.length > 0 ? (
              miembrosFiltrados.map((m) => (
                <tr
                  key={`${m.id?.nroDocumento}-${m.id?.tipoDocumento}`}
                  className="abmc-row"
                >
                  <td>{`${m.nombre || "-"} ${m.apellido || ""}`}</td>
                  <td>{m.cuerda?.name || "-"}</td>
                  <td>{m.area?.nombre || "-"}</td>
                  <td>{m.activo ? "Sí" : "No"}</td>
                  <td className="abmc-actions">
                    <Button
                      className="btn-accion"
                      variant="warning"
                      onClick={() =>
                        navigate("/miembros/editar", { state: { miembro: m } })
                      }
                      title="Editar"
                    >
                      <PencilFill size={18} />
                    </Button>
                    <Button
                      className="btn-accion eliminar"
                      variant="danger"
                      onClick={() => handleEliminar(m)}
                      title="Eliminar"
                    >
                      <XCircleFill size={18} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay miembros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

