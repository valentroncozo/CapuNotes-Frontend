// src/components/pages/usuarios-roles/index.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "@/components/common/BackButton.jsx";
import Loader from "@/components/common/Loader.jsx";

import { usuariosService } from "@/services/usuariosService.js";

import Swal from "sweetalert2";

import { Badge } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import EditIcon from "@/assets/EditIcon";

import "@/styles/abmc.css";
import '@/styles/miembros.css';

export default function UsuariosRolesPage() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const ROLES = ["SUPERADMIN", "ADMINISTRADOR", "COORDINADOR"];

  // =========================================================
  // LOAD
  // =========================================================
  const load = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.listarTodos();

      // Orden: ACTIVO → PENDIENTE → RECHAZADO
      const ordenEstado = { ACTIVO: 1, PENDIENTE: 2, RECHAZADO: 3 };

      const ordenados = [...data].sort(
        (a, b) => ordenEstado[a.estado] - ordenEstado[b.estado]
      );

      setUsuarios(ordenados);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err);
      Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================================================
  // FILTRO
  // =========================================================
  const usuariosFiltrados = usuarios.filter((u) => {
    const value = filtroTexto.toLowerCase();
    const fullName = `${u.apellido || ""} ${u.nombre || ""}`.toLowerCase();
    const username = (u.username || "").toLowerCase();

    const matchTexto =
      !filtroTexto || fullName.includes(value) || username.includes(value);

    const matchEstado =
      !filtroEstado || u.estado.toLowerCase() === filtroEstado.toLowerCase();

    return matchTexto && matchEstado;
  });

  // =========================================================
  // CAMBIAR ESTADO (ACTIVAR / RECHAZAR)
  // =========================================================
  const handleCambiarEstado = async (usuario) => {
    let accion = "";
    let metodo = null;

    if (usuario.estado === "ACTIVO") {
      accion = "rechazar";
      metodo = usuariosService.rechazar;
    } else {
      accion = "activar";
      metodo = usuariosService.aprobar; // require rol, pero le daremos el mismo rol actual
    }

    const res = await Swal.fire({
      title: `¿Desea ${accion} al usuario ${usuario.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DE9205",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
      reverseButtons: true,
    });

    if (!res.isConfirmed) return;

    try {
      if (accion === "rechazar") {
        await usuariosService.rechazar(usuario.id);
      } else {
        await usuariosService.aprobar(usuario.id, { rol: usuario.rol });
      }

      await load();

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `El usuario ahora está ${accion === "rechazar" ? "INACTIVO" : "ACTIVO"}.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cambiar el estado.", "error");
    }
  };

  // =========================================================
  // EDITAR ROL
  // =========================================================
 const handleEditarRol = async (usuario) => {
    const { value: nuevoRol } = await Swal.fire({
      title: `Editar Rol`,
      html: `<div class="thead-modal-userrol" ></div>`,
      input: "select",
      inputOptions: {
        SUPERADMIN: "SUPERADMIN",
        ADMINISTRADOR: "ADMINISTRADOR",
        COORDINADOR: "COORDINADOR",
      },
      inputValue: usuario.rol,

      inputLabel: "Seleccione un rol",

      background: "#11103a",
      color: "#E8EAED",

      showCancelButton: true,

      // 🔥 BOTONES POSICIONADOS CORRECTAMENTE
      reverseButtons: true, // Cancelar izquierda, Aceptar derecha
      
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",

      // 🔥 COLORES
      confirmButtonColor: "#DE9205", // naranja CapuNotes
      cancelButtonColor: "#6c757d",  // gris

      didOpen: () => {
        const select = Swal.getPopup().querySelector("select");
        if (select) {
          select.style.backgroundColor = "#0f0e39";
          select.style.color = "white";
          select.style.padding = "10px";
          select.style.borderRadius = "8px";
        }
        const title = Swal.getPopup().querySelector(".swal2-title");
        if (title) {
          title.classList.add("titulo-modal-userrol");
        }
        const label = Swal.getPopup().querySelector(".swal2-input-label");
        if (label) {
          label.classList.add("label-modal-userrol");
        }
      },
    });

    if (!nuevoRol) return;

    await usuariosService.actualizarRol(usuario.id, { rol: nuevoRol });
    await load();

    Swal.fire({
      icon: "success",
      title: "Rol actualizado",
      timer: 1500,
      showConfirmButton: false,
      background: "#11103a",
      color: "#E8EAED",
    });
  };


  // =========================================================
  // UI
  // =========================================================
  return (
  <>
    <main className="abmc-page">
      <div className="abmc-card">

        {/* HEADER */}
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Usuarios y Roles</h1>
        </div>

        {/* FILTROS */}
        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar por nombre o usuario"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />

          <select
            className="abmc-select abmc-select-roles"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECHAZADO">Inactivo</option>
          </select>
        </div>

        {/* TABLA */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>{`${u.nombre} ${u.apellido}`}</td>
                  <td>{u.username}</td>
                  <td>{u.rol}</td>

                  <td>
                    <Badge
                      bg={
                        u.estado === "ACTIVO"
                          ? "success"
                          : u.estado === "PENDIENTE"
                          ? "warning"
                          : "secondary"
                      }
                      style={{
                        fontSize: "1rem",
                        padding: "6px 14px",
                        borderRadius: "10px",
                        color: u.estado === "PENDIENTE" ? "#000" : undefined,
                      }}
                    >
                      {u.estado === "RECHAZADO" ? "INACTIVO" : u.estado}
                    </Badge>
                  </td>

                  <td className="abmc-actions">
                    <button
                      className="abmc-btn abmc-btn-icon"
                      title="Editar rol"
                      onClick={() => handleEditarRol(u)}
                    >
                      <EditIcon width={18} height={18} />
                    </button>

                    <button
                      className="abmc-btn abmc-btn-icon"
                      title={u.estado === "ACTIVO" ? "Rechazar" : "Activar"}
                      onClick={() => handleCambiarEstado(u)}
                    >
                      {u.estado === "ACTIVO" ? (
                        <XCircle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  </>
);
}
