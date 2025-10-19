// src/services/candidatosServiceHelpers.js

export function buildMockInscripcion(partial = {}) {
  return {
    nombreCompleto: "",
    tipoDoc: "",
    nroDoc: "",
    fechaNac: "",
    correo: "",
    telefono: "",
    provincia: "",
    pais: "",
    profesion: "",
    cuerda: "",
    fotoUrl: "",
    contanosDeVos: "",
    motivacion: "",
    cantoAntes: "",
    conoceMisa: "",
    participaGrupo: "",
    instrumentos: "",
    otrosTalentos: "",
    comoTeEnteraste: "",
    queBuscas: "",
    queCancion: "",
    diaAudicion: "",
    horaAudicion: "",
    aceptaTerminos: false,
    ...partial
  };
}
