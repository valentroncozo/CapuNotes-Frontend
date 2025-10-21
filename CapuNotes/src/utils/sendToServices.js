import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';
import Swal from 'sweetalert2';

// Helper para convertir DD-MM-YYYY o DD/MM/YYYY a YYYY-MM-DD
const convertToISODate = (dateStr) => {
  if (!dateStr) return null;

  // Si ya está en formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Acepta DD-MM-YYYY o DD/MM/YYYY
  const m = dateStr.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  console.warn('Formato de fecha no reconocido:', dateStr);
  return dateStr;
};

const sendToService = async (data) => {
  try {
    // 1) Crear la audición
    const audicion = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      lugar: data.ubicacion,
      fechaInicio: convertToISODate(data.fechaDesde),
      fechaFin: convertToISODate(data.fechaHasta),
      tipoEvento: "AUDICION",
      estado: "BORRADOR"
    };

    const audicionCreada = await AudicionService.crear(audicion);
    console.log("Audición creada:", audicionCreada);

    // 2) Generar turnos (si hay franjas)
    const hasDayKeys = (diasObj) => Object.keys(diasObj ?? {}).length > 0;
    const hasAnyFranjas = (diasObj) =>
      Object.values(diasObj ?? {}).some(arr => Array.isArray(arr) && arr.length > 0);

    if (hasDayKeys(data?.dias) && hasAnyFranjas(data.dias)) {
      const turnosPromises = [];

      for (const key in data.dias) {
        const franjas = data.dias[key];
        if (!Array.isArray(franjas) || franjas.length === 0) continue;

        for (const turno of franjas) {
          const duracion = parseInt(turno.duracion, 10);
          if (isNaN(duracion) || duracion <= 0) {
            console.warn(`Duración inválida en ${key}:`, turno.duracion);
            continue;
          }

          const turnoReq = {
            fecha: convertToISODate(key),
            horaInicio: turno.horaDesde,
            horaFin: turno.horaHasta,
            duracionTurno: duracion
          };

          turnosPromises.push(
            TurnoService.generarTurnos(audicionCreada.id, turnoReq)
          );
        }
      }

      if (turnosPromises.length > 0) {
        await Promise.all(turnosPromises);
        console.log(`${turnosPromises.length} turnos generados correctamente`);
      }
    } else {
      console.log("No hay turnos para registrar, solo se guardó la audición");
    }

    // 3) Éxito
    Swal.fire({
      icon: "success",
      title: "Audición registrada",
      text: "La audición se registró correctamente.",
      background: "#11103a",
      color: "#E8EAED",
      timer: 2000,
      showConfirmButton: false
    });

    return audicionCreada;

  } catch (error) {
    const mensaje = error?.response?.data?.message || error?.message || "Ocurrió un error al registrar la audición.";
    Swal.fire({
      icon: "error",
      title: "Error al registrar",
      text: mensaje,
      background: "#11103a",
      color: "#E8EAED",
    });
    console.error("Error al crear audición:", error);
    throw error;
  }
};

export default sendToService;
