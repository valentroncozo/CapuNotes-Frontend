import api from './api.js';

// Simulación básica si no tienes backend aún
const miembrosData = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    tipoDocumento: 'DNI',
    numeroDocumento: '12345678',
    fechaNacimiento: '1990-05-15',
    correo: 'juan@email.com',
    telefono: '+549123456789',
    provincia: 'Buenos Aires',
    pais: 'Argentina',
    profesion: 'Ingeniero',
    participacion: 'Sí',
    instrumentos: 'Guitarra',
    talento: 'Canto y guitarra',
    conocerMas: 'Me interesa la parte espiritual',
    esperasDios: 'Crecer en la fe a través de la música',
    encontrarMotivo: 'Quiero servir a Dios con mis talentos',
    convocatoria: 'Redes sociales',
    cancion: 'Amazing Grace',
    activo: true,
    area: 'Tenor',
  },
];

export const listar = async () => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return miembrosData;
};

export const obtenerPorId = async (id) => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const miembro = miembrosData.find((m) => m.id === parseInt(id));
  if (!miembro) {
    throw new Error('Miembro no encontrado');
  }
  return miembro;
};

export const crear = async (miembroData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const nuevoMiembro = {
    ...miembroData,
    id: Date.now(), // ID temporal
    activo: true,
  };
  miembrosData.push(nuevoMiembro);
  return nuevoMiembro;
};

export const actualizar = async (id, miembroData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = miembrosData.findIndex((m) => m.id === parseInt(id));
  if (index === -1) {
    throw new Error('Miembro no encontrado');
  }

  miembrosData[index] = { ...miembrosData[index], ...miembroData };
  return miembrosData[index];
};

export const eliminarPorId = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = miembrosData.findIndex((m) => m.id === parseInt(id));
  if (index === -1) {
    throw new Error('Miembro no encontrado');
  }

  miembrosData.splice(index, 1);
  return true;
};

// Funciones adicionales
export const buscarPorNombre = async (nombre) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return miembrosData.filter((m) =>
    m.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
};

export const obtenerPorArea = async (areaId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return miembrosData.filter((m) => m.area === areaId);
};

export const cambiarEstado = async (id, activo) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const miembro = miembrosData.find((m) => m.id === parseInt(id));
  if (!miembro) {
    throw new Error('Miembro no encontrado');
  }

  miembro.activo = activo;
  return miembro;
};

export const obtenerEstadisticas = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    total: miembrosData.length,
    activos: miembrosData.filter((m) => m.activo).length,
    inactivos: miembrosData.filter((m) => !m.activo).length,
    porArea: {
      Soprano: miembrosData.filter((m) => m.area === 'Soprano').length,
      Alto: miembrosData.filter((m) => m.area === 'Alto').length,
      Tenor: miembrosData.filter((m) => m.area === 'Tenor').length,
      Bajo: miembrosData.filter((m) => m.area === 'Bajo').length,
    },
  };
};
