import { useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";

import "@/styles/abmc.css";
import "@/styles/ReportesPage.css";

// Subcomponentes (los iremos creando)
import ReportePorMiembro from "@/components/pages/reportes/ReporteAsistenciaMiembroAnualPage.jsx";
import ReporteParticipacionPage from "@/components/pages/reportes/ReporteParticipacionPage.jsx";

// import ReporteGeneral from "@/components/reportes/ReporteGeneral.jsx";
// import ReportePorCuerda from "@/components/reportes/ReportePorCuerda.jsx";

export default function ReportesPage() {
    const [tabActiva, setTabActiva] = useState("participacion");

    const renderContenido = () => {
        switch (tabActiva) {
            //case "general":
              //  return <div>ACA VA EL REPORTE GENERAL</div>; // luego lo reemplazamos
            case "participacion":
                return <ReporteParticipacionPage />;
            case "miembro":
                return <ReportePorMiembro />;
            //case "cuerda":
              //  return <div>ACA VA REPORTE POR CUERDA</div>;
            default:
                return null;
        }
    };

    return (
        <main className="abmc-page">
            <div className="abmc-card">

                {/* ===== HEADER ===== */}
                <div className="abmc-header">
                    <BackButton />
                    <div>
                        <h1 className="abmc-title">Reportes</h1>
                    </div>
                </div>

                {/* ===== TABS ===== */}
                <div className="reportes-tabs">
                    {/*<button
                        className={tabActiva === "general" ? "tab activa" : "tab"}
                        onClick={() => setTabActiva("general")}
                    >
                        Estadísticas generales
                    </button>*/}

                     <button
                        className={tabActiva === "participacion" ? "tab activa" : "tab"}
                        onClick={() => setTabActiva("participacion")}
                    >
                        Participación general
                    </button>

                    <button
                        className={tabActiva === "miembro" ? "tab activa" : "tab"}
                        onClick={() => setTabActiva("miembro")}
                    >
                        Por miembro
                    </button>

                    {/*<button
                        className={tabActiva === "cuerda" ? "tab activa" : "tab"}
                        onClick={() => setTabActiva("cuerda")}
                    >
                        Por cuerda
                    </button>*/}
                </div>

                {/* ===== CONTENIDO ===== */}
                <div className="reportes-contenido">
                    {renderContenido()}
                </div>

            </div>
        </main>
    );
}
