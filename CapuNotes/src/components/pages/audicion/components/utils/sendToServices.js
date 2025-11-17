import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';
import Swal from 'sweetalert2';

// Helper para convertir DD-MM-YYYY a YYYY-MM-DD
const convertToISODate = (dateStr) => {
    if (!dateStr) return null;
    
    // Si ya está en formato ISO (YYYY-MM-DD), retornar tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    
    // Si está en formato DD-MM-YYYY, convertir
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    }
    
    console.warn('Formato de fecha no reconocido:', dateStr);
    return dateStr;
};

const sendToService = async (data) => {
    try {
        // 1. Crear la audición primero
        let audicion = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            lugar: data.ubicacion,
            fechaInicio: convertToISODate(data.fechaDesde),
            fechaFin: convertToISODate(data.fechaHasta),
            tipoEvento: "AUDICION",
            estadoAudicion: data.estadoAudicion || "BORRADOR",
            estado:"PENDIENTE"
        };

        let audicionCreada = await AudicionService.crear(audicion);
        console.log("Audición creada:", audicionCreada);

        // 2. Verificar si hay turnos para registrar
        let hasDayKeys = (diasObj) => Object.keys(diasObj ?? {}).length > 0;
        let hasAnyFranjas = (diasObj) =>
            Object.values(diasObj ?? {}).some(arr => Array.isArray(arr) && arr.length > 0);

        if (hasDayKeys(data?.dias) && hasAnyFranjas(data.dias)) {
            // Registrar turnos por cada día y franja
            const turnosPromises = [];
            
            for (let key in data.dias) {
                const franjas = data.dias[key];
                
                if (!Array.isArray(franjas) || franjas.length === 0) {
                    continue; // saltar días sin franjas
                }

                for (let turno of franjas) {
                    const duracion = parseInt(turno.duracion, 10);
                    
                    if (isNaN(duracion) || duracion <= 0) {
                        console.warn(`Duración inválida en ${key}:`, turno.duracion);
                        continue;
                    }

                    let turnoReq = {
                        fecha: convertToISODate(key), // Convertir fecha del día también
                        horaInicio: turno.horaDesde,
                        horaFin: turno.horaHasta,
                        duracionTurno: duracion
                    };

                    // Acumular promesas para ejecutar en paralelo
                    turnosPromises.push(
                        TurnoService.generarTurnos(audicionCreada.id, turnoReq)
                    );
                }
            }

            // Ejecutar todas las creaciones de turnos en paralelo
            if (turnosPromises.length > 0) {
                await Promise.all(turnosPromises);
                console.log(`${turnosPromises.length} turnos generados correctamente`);
            }
        } else {
            console.log("No hay turnos para registrar, solo se guardó la audición");
        }

        // 3. Mostrar éxito
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

}

export default sendToService;