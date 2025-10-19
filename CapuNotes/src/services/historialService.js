// src/services/historialService.js
// Mock de historial. Más adelante reemplazá list() por la API real.

import { buildMockInscripcion } from "@/services/candidatosServiceHelpers.js";

const historialMock = [
  {
    id: "h-1",
    nombre: "Juan Perez",
    fechaAudicion: "Marzo 2023",
    cancion: "Canción – Autor",
    resultado: { estado: "Aceptado", obs: "Muy buena afinación" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Juan Perez",
      tipoDoc: "DNI",
      nroDoc: "35.555.555",
      fechaNac: "1993-04-11",
      correo: "juanp@example.com",
      telefono: "+54 351 555-1000",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Diseñador",
      cuerda: "Tenor",
      contanosDeVos: "Canto desde los 15.",
      motivacion: "Seguir creciendo en comunidad.",
      cantoAntes: "Coro escolar.",
      conoceMisa: "Sí, voy a la de 21hs.",
      participaGrupo: "Grupo de jóvenes.",
      instrumentos: "Guitarra.",
      otrosTalentos: "Fotografía.",
      comoTeEnteraste: "Instagram.",
      queBuscas: "Amigos y música.",
      queCancion: "Canción – Autor",
      diaAudicion: "Marzo 2023",
      horaAudicion: "—",
      aceptaTerminos: true
    })
  },
  {
    id: "h-2",
    nombre: "Juan Perez",
    fechaAudicion: "Abril 2024",
    cancion: "Canción – Autor",
    resultado: { estado: "Rechazado", obs: "Trabajar respiración" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Juan Perez",
      tipoDoc: "DNI",
      nroDoc: "35.555.555",
      fechaNac: "1993-04-11",
      correo: "juanp@example.com",
      telefono: "+54 351 555-1000",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Diseñador",
      cuerda: "Tenor",
      contanosDeVos: "Canto desde los 15.",
      motivacion: "Seguir creciendo en comunidad.",
      cantoAntes: "Coro escolar.",
      conoceMisa: "Sí, voy a la de 21hs.",
      participaGrupo: "Grupo de jóvenes.",
      instrumentos: "Guitarra.",
      otrosTalentos: "Fotografía.",
      comoTeEnteraste: "Instagram.",
      queBuscas: "Amigos y música.",
      queCancion: "Canción – Autor",
      diaAudicion: "Abril 2024",
      horaAudicion: "—",
      aceptaTerminos: true
    })
  }
];

export const historialService = {
  async list() {
    await new Promise((r) => setTimeout(r, 120));
    return historialMock;
  }
};
