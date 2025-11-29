import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { eventoService } from "@/services/eventoService";
import { repertoriosService } from "@/services/repertoriosService";
import { cancionesService } from "@/services/cancionesService";
import "@/styles/repertorio-lectura.css";
import Loader from "@/components/common/Loader.jsx";


let html2PdfPromise = null;

const getHtml2Pdf = async () => {
  if (!html2PdfPromise) {
    html2PdfPromise = import("html2pdf.js").then(
      (module) => module.default || module
    );
  }
  return html2PdfPromise;
};

const PX_TO_PT_RATIO = 72 / 96;

const convertRect = (worker, rect) => {
  const factor = PX_TO_PT_RATIO / worker.prop.pageSize.k;
  return {
    top: rect.top * factor,
    left: rect.left * factor,
    width: rect.width * factor,
    height: rect.height * factor,
  };
};

const normalizeRect = (worker, rect, containerRect) => {
  const converted = convertRect(worker, rect);
  converted.top -= containerRect.top;
  converted.left -= containerRect.left;
  return converted;
};

const computePdfPosition = (worker, rect) => {
  const innerHeight = worker.prop.pageSize.inner.height;
  const marginTop = worker.opt.margin[0];
  const marginLeft = worker.opt.margin[1];
  const pageNumber = Math.max(1, Math.floor(rect.top / innerHeight) + 1);
  const localTop = rect.top % innerHeight;
  return {
    pageNumber,
    top: marginTop + localTop,
    left: marginLeft + rect.left,
  };
};

const escapeHashSelector = (hash) => {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return null;
  if (typeof CSS !== "undefined" && CSS.escape) {
    return `#${CSS.escape(id)}`;
  }
  return `#${id.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1")}`;
};

const isInternalAnchor = (anchor) => {
  const hrefAttr = (anchor.getAttribute("href") || "").trim();
  if (!hrefAttr) return false;
  if (hrefAttr.startsWith("#")) return true;
  const hash = anchor.hash;
  if (!hash) return false;
  try {
    const anchorUrl = new URL(anchor.href, window.location.href);
    const current = new URL(window.location.href);
    return (
      anchorUrl.origin === current.origin &&
      anchorUrl.pathname === current.pathname &&
      anchorUrl.search === current.search &&
      !!anchorUrl.hash
    );
  } catch {
    return false;
  }
};

const resolveTargetDestination = (worker, container, containerRect, anchor) => {
  if (!isInternalAnchor(anchor)) return null;
  const selector = escapeHashSelector(anchor.hash || anchor.getAttribute("href") || "");
  if (!selector) return null;
  const target = container.querySelector(selector);
  if (!target) return null;
  const rect = normalizeRect(worker, target.getBoundingClientRect(), containerRect);
  return computePdfPosition(worker, rect);
};

const collectAnchorMetadata = (worker) => {
  const container = worker.prop.container;
  if (!container) return [];
  const containerRect = convertRect(worker, container.getBoundingClientRect());
  const anchors = Array.from(container.querySelectorAll("a[href]"));

  return anchors.flatMap((anchor) => {
    const rects = Array.from(anchor.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0
    );
    return rects.map((rect) => {
      const normalized = normalizeRect(worker, rect, containerRect);
      const clickable = computePdfPosition(worker, normalized);
      return {
        page: clickable.pageNumber,
        top: clickable.top,
        left: clickable.left,
        width: normalized.width,
        height: normalized.height,
        target: resolveTargetDestination(worker, container, containerRect, anchor),
        url: anchor.href,
      };
    });
  });
};

const applyPdfLinks = (pdf, linkInfo = []) => {
  if (!pdf || !Array.isArray(linkInfo)) return;
  linkInfo.forEach((info) => {
    pdf.setPage(info.page);
    if (info.target) {
      pdf.link(info.left, info.top, info.width, info.height, {
        pageNumber: info.target.pageNumber,
        top: info.target.top,
        left: info.target.left,
        zoom: 0,
        magFactor: "XYZ",
      });
    } else if (info.url) {
      pdf.link(info.left, info.top, info.width, info.height, { url: info.url });
    }
  });
  const totalPages = pdf.internal.getNumberOfPages();
  pdf.setPage(totalPages);
};

function parseDateTime(fecha, hora) {
  if (!fecha) return null;
  const date = new Date(fecha);
  if (hora) {
    const [h, m, s] = hora.split(":").map(Number);
    date.setHours(h ?? 0, m ?? 0, s ?? 0, 0);
  }
  return date;
}

function pickNextEvent(eventos = []) {
  const now = new Date();
  return eventos
    .map((evento) => ({
      ...evento,
      __dt: parseDateTime(evento.fechaInicio, evento.hora),
    }))
    .filter((e) => e.__dt && e.__dt.getTime() > now.getTime())
    .sort((a, b) => a.__dt - b.__dt)[0];
}

export default function RepertorioLecturaPage() {
  const [searchParams] = useSearchParams();
  const eventoIdParam = searchParams.get("eventoId");
  const autoPrint = searchParams.get("print") === "1";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const eventoBase = await obtenerEventoBase(eventoIdParam);
        if (!eventoBase) {
          setError("No hay eventos próximos programados.");
          setLoading(false);
          return;
        }
        const detalle = await eventoService.getById(eventoBase.id);
        const repertoriosDetallados = await Promise.all(
          (detalle.repertorios || []).map(async (rep) => {
            try {
              const completo = await repertoriosService.get(rep.id);
              const cancionesOrdenadas = Array.isArray(completo.canciones)
                ? [...completo.canciones].sort(
                  (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
                )
                : [];

              const cancionesConLetra = await Promise.all(
                cancionesOrdenadas.map(async (cancionItem) => {
                  try {
                    const song = await cancionesService.get(
                      cancionItem.cancionId
                    );
                    return {
                      orden: cancionItem.orden,
                      titulo: song.titulo || cancionItem.titulo,
                      letra: song.letra || "Letra no disponible.",
                      arregloUrl: song.arregloUrl,
                    };
                  } catch (songErr) {
                    console.error("Error cargando canción", songErr);
                    return {
                      orden: cancionItem.orden,
                      titulo: cancionItem.titulo || "Canción",
                      letra: "No se pudo cargar la letra.",
                    };
                  }
                })
              );

              return { ...rep, cancionesDetalle: cancionesConLetra };
            } catch (repErr) {
              console.error("Error cargando repertorio", repErr);
              return { ...rep, cancionesDetalle: [] };
            }
          })
        );

        setPayload({
          evento: detalle,
          repertorios: repertoriosDetallados,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error generando vista de repertorios", err);
        setError("No se pudo generar la vista de repertorios.");
        setLoading(false);
      }
    };

    load();
  }, [eventoIdParam, autoPrint]);

  useEffect(() => {
    if (!autoPrint || loading || !payload || isExporting) return;

    const exportPdf = async () => {
      try {
        setIsExporting(true);
        const html2pdf = await getHtml2Pdf();
        const element = document.getElementById("lectura-root");
        if (!element) return;
        const nombreSeguro = (payload?.evento?.nombre || "Repertorio")
          .trim()
          .replace(/\s+/g, "_");

        const worker = html2pdf()
          .set({
            margin: 0,
            filename: `${nombreSeguro}.pdf`,
            enableLinks: false,
            pagebreak: { mode: ["css", "legacy"] },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: "#040421" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(element);

        let linkMetadata = [];

        await worker
          .toContainer()
          .then(() => {
            linkMetadata = collectAnchorMetadata(worker);
          })
          .toCanvas()
          .toPdf()
          .get("pdf")
          .then((pdf) => applyPdfLinks(pdf, linkMetadata))
          .save();

      } catch (err) {
        console.error("Error generando PDF", err);
      } finally {
        window.close();
      }
    };

    exportPdf();
  }, [autoPrint, loading, payload, isExporting]);

  const evento = payload?.evento;
  const repertorios = payload?.repertorios || [];

  return (
    <main className="lectura-page" id="lectura-root">
      <div className="lectura-wrap">
        {loading && (
          <div className="lectura-loading">
            <Loader />
          </div>
        )}

        {!loading && error && <div className="lectura-error">{error}</div>}
        {!loading && !error && evento && (
          <>
            <section className="lectura-card lectura-header">
              <h1>{evento.nombre}</h1>
              <p style={{ opacity: 0.85 }}>{evento.descripcion || ""}</p>

              <div className="lectura-meta">
                <div className="lectura-meta-item">
                  <span>Fecha</span>
                  <strong>
                    {evento.fechaInicio
                      ? new Date(evento.fechaInicio).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                      : "-"}
                  </strong>
                </div>
                <div className="lectura-meta-item">
                  <span>Hora</span>
                  <strong>{evento.hora || "-"}</strong>
                </div>
                <div className="lectura-meta-item">
                  <span>Lugar</span>
                  <strong>{evento.lugar || "A confirmar"}</strong>
                </div>
              </div>
            </section>

            {repertorios.length > 0 && (
              <section className="lectura-card lectura-indice">
                <h2>Índice</h2>
                <ol>
                  {repertorios.map((rep) => {
                    const repAnchorId = `rep-${rep.id}`;
                    return (
                      <li key={`idx-${rep.id}`}>
                        <a
                          href={`#${repAnchorId}`}
                          className="indice-link"
                          data-scroll-target={repAnchorId}
                        >
                          {rep.nombre}
                        </a>
                        {rep.cancionesDetalle.length > 0 && (
                          <ul>
                            {rep.cancionesDetalle.map((cancion, idx) => {
                              const songAnchorId = `rep-${rep.id}-song-${cancion.orden ?? idx + 1
                                }`;
                              return (
                                <li key={`idx-${rep.id}-${idx}`}>
                                  <a
                                    href={`#${songAnchorId}`}
                                    className="indice-link cancion"
                                    data-scroll-target={songAnchorId}
                                  >
                                    #{cancion.orden ?? idx + 1} {cancion.titulo}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {repertorios.length === 0 && (
              <div className="lectura-card lectura-empty">
                Este evento todavía no tiene repertorios asignados.
              </div>
            )}

            {repertorios.map((rep) => (
              <section
                className="lectura-card lectura-repertorio"
                key={rep.id}
                id={`rep-${rep.id}`}
              >
                <h2>{rep.nombre}</h2>
                {rep.cancionesDetalle.length === 0 && (
                  <p>No hay canciones asociadas.</p>
                )}
                {rep.cancionesDetalle.map((cancion, idx) => (
                  <article
                    className="lectura-cancion"
                    key={`${rep.id}-${cancion.orden ?? idx}`}
                    id={`rep-${rep.id}-song-${cancion.orden ?? idx + 1}`}
                  >
                    <h3>
                      #{cancion.orden ?? "-"} {cancion.titulo}
                    </h3>
                    <p className="lectura-letra">
                      {cancion.letra || "Letra no disponible."}
                    </p>
                  </article>
                ))}
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  );
}

async function obtenerEventoBase(eventoIdParam) {
  if (eventoIdParam) {
    return { id: eventoIdParam };
  }
  try {
    const pendientes = await eventoService.pendientes();
    const siguiente = pickNextEvent(pendientes || []);
    if (!siguiente) {
      Swal.fire({
        icon: "info",
        title: "Sin eventos próximos",
        text: "Agendá un evento para generar su repertorio.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
    return siguiente || null;
  } catch (err) {
    console.error("Error al buscar eventos pendientes", err);
    return null;
  }
}
