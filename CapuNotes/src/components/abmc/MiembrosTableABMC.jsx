import { useState, useEffect } from "react";
import BackButton from "../common/BackButton";
import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PencilFill, XCircleFill, CheckCircleFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { miembrosService } from "@/services/miembrosService.js";
import { cuerdasService } from "@/services/cuerdasService.js";
import { areasService } from "@/services/areasService.js";

import "../../styles/abmc.css";
import "../../styles/miembros.css";

export default function MiembrosTableABMC({
  title = "Miembros del coro",
  showBackButton = true,
}) {
  const navigate = useNavigate();
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCuerda, setFiltroCuerda] = useState("");
  const [ordenEstadoAscendente, setOrdenEstadoAscendente] = useState(true);

  // 🔹 Cargar miembros y cuerdas desde el backend
  const load = async () => {
    try {
      const [miembrosData, cuerdasData, areasData] = await Promise.all([
        miembrosService.list(),
        cuerdasService.list(),
        areasService.list(),
      ]);


      //verificar porque se ordena por apellido y esta el nombre primero RARI
      // 🧩 Ordenar primero por activo (true arriba), luego alfabéticamente
      const ordenados = [...miembrosData].sort((a, b) => {
        // Activos primero
        if (a.activo && !b.activo) return -1;
        if (!a.activo && b.activo) return 1;

        // Dentro del mismo grupo (ambos activos o ambos inactivos), ordenar por apellido y nombre
        const apA = a.apellido?.toLowerCase() || "";
        const apB = b.apellido?.toLowerCase() || "";
        if (apA !== apB)
          return apA.localeCompare(apB, "es", { sensitivity: "base" });

        return (a.nombre || "").localeCompare(b.nombre || "", "es", {
          sensitivity: "base",
        });
      });


      setListaMiembros(ordenados);
      setCuerdas(cuerdasData);
      setAreas(areasData || []);
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

  // 🟡 Cambiar estado (dar de baja / reactivar)
  const handleCambiarEstado = async (miembro) => {
    const activo = miembro.activo;
    const accion = activo ? "dar de baja" : "reactivar";

    const res = await Swal.fire({
      title: `¿Desea ${accion} a ${miembro?.nombre || "miembro"}?`,
      text: activo
        ? "El miembro pasará a estado inactivo."
        : "El miembro volverá a estar activo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      if (activo) {
        await miembrosService.darDeBaja(
          miembro.id?.nroDocumento,
          miembro.id?.tipoDocumento
        );
      } else {
        await miembrosService.reactivar(
          miembro.id?.nroDocumento,
          miembro.id?.tipoDocumento
        );
      }

      await load();

      Swal.fire({
        icon: "success",
        title: activo ? "Miembro dado de baja" : "Miembro reactivado",
        text: `${miembro.nombre} ${miembro.apellido} ahora está ${activo ? "inactivo" : "activo"
          }.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#ffc107",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del miembro.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const ordenarPorEstado = () => {
    const ordenados = [...listaMiembros].sort((a, b) => {
      if (a.activo === b.activo) return 0;
      return ordenEstadoAscendente ? (a.activo ? -1 : 1) : (a.activo ? 1 : -1);
    });
    setListaMiembros(ordenados);
    setOrdenEstadoAscendente(!ordenEstadoAscendente);
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        {/* === Encabezado === */}
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title" style={{ display: "inline-block", marginRight: "1rem" }}>{title}</h1>
        </div>

        {/* === Barra superior con buscador y filtro === */}
        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
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
            +
          </Button>
        </div>

        {/* === Tabla === */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Nombre y Apellido</th>
              <th>Cuerda</th>
              <th>Área</th>
              <th onClick={ordenarPorEstado} style={{ cursor: "pointer" }}>
                Estado {ordenEstadoAscendente ? "▲" : "▼"}
              </th>
              <th style={{ textAlign: "center" }}></th>
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
                  <td>
                    {(() => {
                      // varias formas en que el backend puede devolver el área:
                      // - objeto: { id, nombre }
                      // - id numérico
                      // - nombre como string
                      const a = m.area;
                      if (!a) return "-";
                      if (typeof a === "string") return a;
                      if (typeof a === "number") {
                        const found = areas.find((x) => x.id === a);
                        return found?.nombre || String(a);
                      }
                      if (a.id) {
                        const found = areas.find((x) => x.id === a.id);
                        return found?.nombre || a.nombre || a.name || "-";
                      }
                      return a.nombre || a.name || "-";
                    })()}
                  </td>
                  <td>
                    <Badge
                      bg={m.activo ? "success" : "secondary"}
                      style={{ fontSize: "0.9rem" }}
                    >
                      {m.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="abmc-actions">
                    <Button
                      className="btn-accion"
                      variant="warning"
                      onClick={() =>
                        navigate("/miembros/editar", { state: { miembro: m } })
                      }
                      title="Editar"
                    >
                      <PencilFill size={18} color="#E8EAED" />
                    </Button>
                    <Button
                      className="btn-accion"
                      variant={m.activo ? "danger" : "success"}
                      onClick={() => handleCambiarEstado(m)}
                      title={m.activo ? "Dar de baja" : "Reactivar"}
                    >
                      {m.activo ? (
                        <XCircleFill size={18} color="#E8EAED" />
                      ) : (
                        <CheckCircleFill size={18} color="#E8EAED" />
                      )}
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