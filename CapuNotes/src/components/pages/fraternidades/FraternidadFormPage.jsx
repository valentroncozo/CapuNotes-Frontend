import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import BackButton from "@/components/common/BackButton";
import FraternidadEditor from "./FraternidadEditor";
import { fraternidadesService } from "@/services/fraternidadesService";
import { areasService } from "@/services/areasService";
import { cuerdasService } from "@/services/cuerdasService";
import "@/styles/abmc.css";
import "@/styles/repertorios.css";

export default function FraternidadFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [initialData, setInitialData] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [areasRes, cuerdasRes, disponibles] = await Promise.all([
          areasService.list(),
          cuerdasService.list(),
          fraternidadesService.listAvailableMembers(),
        ]);
        setAreas(Array.isArray(areasRes) ? areasRes : []);
        setCuerdas(Array.isArray(cuerdasRes) ? cuerdasRes : []);
        setAvailableMembers(disponibles || []);

        if (isEdit) {
          const detalle = await fraternidadesService.get(id);
          setInitialData(detalle);
        } else {
          setInitialData({ nombre: "", miembros: [] });
        }
      } catch (err) {
        console.error("❌ Error cargando datos de fraternidad", err);
        Swal.fire({
          icon: "error",
          title: "No se pudo cargar la información",
          text: err?.response?.data || "Intentalo nuevamente.",
          background: "#11103a",
          color: "#E8EAED",
        });
        navigate("/fraternidades");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (payload) => {
    try {
      if (isEdit) {
        await fraternidadesService.update(id, payload);
        Swal.fire({
          icon: "success",
          title: "Fraternidad actualizada",
          timer: 1500,
          background: "#11103a",
          color: "#E8EAED",
          showConfirmButton: false,
        });
      } else {
        await fraternidadesService.create(payload);
        Swal.fire({
          icon: "success",
          title: "Fraternidad creada",
          timer: 1500,
          background: "#11103a",
          color: "#E8EAED",
          showConfirmButton: false,
        });
      }
      navigate("/fraternidades");
    } catch (err) {
      console.error("❌ Error guardando fraternidad", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: err?.response?.data || "Revisá los datos enviados.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  return (
    <main className="abmc-page repertorios-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            {isEdit ? "Editar fraternidad" : "Crear fraternidad"}
          </h1>
        </div>

        {loading || !initialData ? (
          <p style={{ padding: "1rem" }}>Cargando datos...</p>
        ) : (
          <FraternidadEditor
            mode={isEdit ? "edit" : "create"}
            initialData={initialData}
            availableMembers={availableMembers}
            areas={areas}
            cuerdas={cuerdas}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/fraternidades")}
          />
        )}
      </div>
    </main>
  );
}
