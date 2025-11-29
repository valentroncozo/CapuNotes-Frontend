import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import BackButton from "@/components/common/BackButton";
import RepertorioEditor from "./RepertorioEditor";
import { repertoriosService } from "@/services/repertoriosService";
import { eventoService } from "@/services/eventoService";

import "@/styles/abmc.css";

export default function RepertorioFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [initialData, setInitialData] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiempos, setTiempos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cancionesRes, tiemposRes, categoriasRes] = await Promise.all([
          axios.get("/api/canciones"),
          axios.get("/api/tiempos-liturgicos"),
          axios.get("/api/categorias-canciones"),
        ]);

        setAvailableSongs(Array.isArray(cancionesRes.data) ? cancionesRes.data : []);
        setTiempos(
          (Array.isArray(tiemposRes.data) ? tiemposRes.data : []).filter(
            (tiempo) => tiempo.activo !== false
          )
        );
        setCategorias(
          (Array.isArray(categoriasRes.data) ? categoriasRes.data : []).filter(
            (cat) => cat.activo !== false
          )
        );

        if (isEdit) {
          const repertorio = await repertoriosService.get(id);
          setInitialData(repertorio);
        } else {
          setInitialData({ nombre: "", canciones: [] });
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del formulario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data || "No se pudieron cargar los datos del repertorio.",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
        });
        navigate("/repertorios");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (_mode, payload) => {
    try {
      if (isEdit) {
        await repertoriosService.update(id, payload);
        Swal.fire({
          icon: "success",
          title: "Repertorio actualizado",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/repertorios");
        return;
      }

      const creado = await repertoriosService.create(payload);
      const eventoContext = location.state?.eventoContext;

      if (eventoContext?.eventoId) {
        const repertorioIds = Array.from(
          new Set([...(eventoContext.repertorioIds || []), creado.id])
        );
        await eventoService.assignRepertorios(
          eventoContext.eventoId,
          eventoContext.tipoEvento,
          repertorioIds
        );

        Swal.fire({
          icon: "success",
          title: "Repertorio creado y asignado",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#de9205",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(location.state?.redirectTo || "/eventos");
      } else {
        Swal.fire({
          icon: "success",
          title: "Repertorio agregado",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/repertorios");
      }
    } catch (error) {
      console.error("❌ Error al guardar repertorio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data || "No se pudo guardar el repertorio.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#de9205",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <main className="abmc-page repertorios-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            {isEdit ? "Editar repertorio" : "Agregar repertorio"}
          </h1>
        </div>

        {loading || !initialData ? (
          <p style={{ padding: "1rem" }}>Cargando datos...</p>
        ) : (
          <RepertorioEditor
            mode={isEdit ? "edit" : "create"}
            initialData={initialData}
            availableSongs={availableSongs}
            categorias={categorias}
            tiempos={tiempos}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/repertorios")}
          />
        )}
      </div>
    </main>
  );
}
