// src/services/candidatosService.js
// Por ahora mock. Más adelante reemplazás list() por una llamada real.

import { buildMockInscripcion } from "./candidatosServiceHelpers.js";

const mockRows = [
  {
    id: 1,
    hora: "17.00 hs",
    nombre: "Begliardo, Francisco",
    cancion: "Ya me enteré, Reik",
    resultado: { estado: "sin", obs: "" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Francisco Begliardo",
      tipoDoc: "DNI",
      nroDoc: "38.123.456",
      fechaNac: "1997-06-21",
      correo: "fran@example.com",
      telefono: "+54 351 555-0101",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Estudiante",
      cuerda: "Tenor",
      contanosDeVos: "Me gusta cantar desde chico.",
      motivacion: "Quiero crecer en la fe y la música.",
      cantoAntes: "Coro parroquial de mi barrio.",
      conoceMisa: "Sí, misa de 21hs de Capuchinos.",
      participaGrupo: "Grupo de jóvenes.",
      instrumentos: "Guitarra básica.",
      otrosTalentos: "Actuación.",
      comoTeEnteraste: "Instagram del coro.",
      queBuscas: "Comunidad y aprendizaje.",
      queCancion: "Ya me enteré (Reik).",
      diaAudicion: "Viernes 14",
      horaAudicion: "17.00 hs",
      aceptaTerminos: true,
    }),
  },
  {
    id: 2,
    hora: "17.15 hs",
    nombre: "Alejandro, Peréz",
    cancion: "Aleluya",
    resultado: { estado: "rechazado", obs: "Fuera de tono" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Alejandro Peréz",
      tipoDoc: "DNI",
      nroDoc: "39.777.111",
      fechaNac: "1995-01-12",
      correo: "ale@example.com",
      telefono: "+54 351 555-0202",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Programador",
      cuerda: "Barítono",
      contanosDeVos: "Autodidacta.",
      motivacion: "Servir con la música.",
      cantoAntes: "No.",
      conoceMisa: "La conozco hace años.",
      participaGrupo: "No.",
      instrumentos: "Ninguno.",
      otrosTalentos: "Ilustración.",
      comoTeEnteraste: "Un amigo.",
      queBuscas: "Sumarme a un coro.",
      queCancion: "Aleluya.",
      diaAudicion: "Viernes 14",
      horaAudicion: "17.15 hs",
      aceptaTerminos: true,
    }),
  },
];

export const candidatosService = {
  async list() {
    // simula latencia
    await new Promise((r) => setTimeout(r, 100));
    return mockRows;
  },
  // ganchos para actualizar (futuro persistente)
  async updateResultado(id, resultado) {
    const row = mockRows.find((r) => r.id === id);
    if (row) row.resultado = resultado;
    return row;
  },
};
