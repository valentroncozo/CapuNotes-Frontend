import { areasService } from '../services/areasService';
import { cuerdasService } from '../services/cuerdasService';

/**
 * Construye el esquema del formulario de Miembro.
 * Ahora las opciones se obtienen del backend usando los servicios.
 */
export async function buildMiembroSchema() {
  try {
    // Obtener datos del backend
    const [cuerdas, areas] = await Promise.all([
      cuerdasService.list(),
      areasService.list(),
    ]);

    // Mapear nombres
    const cuerdaOptions = cuerdas.map((c) => c.name);
    const areaOptions = areas.map((a) => a.nombre);
    const estadoOptions = ['Activo', 'Inactivo'];

    // Retornar estructura del formulario
    return [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, max: 80 },
      {
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        max: 80,
      },
      {
        key: 'cuerda',
        label: 'Cuerda',
        type: 'select',
        required: true,
        options: cuerdaOptions,
      },
      {
        key: 'area',
        label: 'Área',
        type: 'select',
        required: false,
        options: areaOptions,
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        options: estadoOptions,
      },
      { key: 'primary', label: 'Agregar', type: 'button' },
    ];
  } catch (error) {
    console.error('❌ Error cargando datos para el schema:', error);
    // En caso de error, retornar un esquema básico para evitar que el form se rompa
    return [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, max: 80 },
      {
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        max: 80,
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        options: ['Activo', 'Inactivo'],
      },
      { key: 'primary', label: 'Agregar', type: 'button' },
    ];
  }
}

export const miembroEntityName = 'miembro';
