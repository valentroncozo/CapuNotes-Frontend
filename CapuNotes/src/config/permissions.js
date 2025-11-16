// src/config/permissions.js

export const normalizePermission = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const MENU_SECTIONS = [
    { key: 'extra', label: null, type: 'links' },
    { key: 'rep', label: 'Repertorio', type: 'accordion' },
    { key: 'aud', label: 'Audiciones', type: 'accordion' },
    { key: 'org', label: 'Organización del Coro', type: 'accordion' },
];

export const PROTECTED_VIEWS = [
  { key: 'asistencias', label: 'Asistencias', path: 'asistencias', permission: 'view:asistencias', section: 'extra', componentKey: 'AsistenciaEnsayos' },
  { key: 'asistencias-detalle', label: 'Detalle de asistencia', path: 'asistencias/ensayos/:idEnsayo', permission: 'view:asistencias', showInMenu: false, section: 'extra', componentKey: 'AsistenciaEnsayosDetalle' },
  
  { key: 'eventos', label: 'Eventos', path: 'eventos', permission: 'view:eventos', section: 'extra', componentKey: 'Eventos' },
  
  { key: 'audicion', label: 'Audición', path: 'audicion', permission: 'view:audicion', section: 'aud', componentKey: 'Audicion' },
  { key: 'audicion-agregar', label: 'Crear audición', path: 'audicion/agregar', permission: 'view:crear:audicion', showInMenu: false, section: 'aud', componentKey: 'AudicionAgregar' },
  { key: 'audicion-editar', label: 'Editar audición', path: 'audicion/editar', permission: 'view:editar:audicion', showInMenu: false, section: 'aud', componentKey: 'AudicionEditar' },
  { key: 'audicion-historial', label: 'Historial Candidatos', path: 'audicion/historial', permission: 'view:historialaudiciones', section: 'aud', componentKey: 'HistorialAudiciones' },
  { key: 'audicion-candidatos', label: 'Candidatos', path: 'audicion/candidatos', permission: 'view:candidatosturnos', section: 'aud', componentKey: 'Candidatos' },
  { key: 'candidatos-admin', label: 'Candidatos (T)', path: 'candidatos-administracion', permission: 'view:candidatoevaluacion', section: 'aud', componentKey: 'CandidatosCoordinadores' },
  { key: 'cuestionario-config', label: 'Configurar Cuestionario', path: 'cuestionario/configuracion', permission: 'view:preguntas', section: 'aud', componentKey: 'CuestionarioConfig' },
  { key: 'cuestionario-preview', label: 'Vista cuestionario', path: 'cuestionario/preview', permission: 'view:vistacuestionario', showInMenu: false, section: 'aud', componentKey: 'CuestionarioPreview' },
  
  { key: 'cuerdas', label: 'Cuerdas', path: 'cuerdas', permission: 'view:cuerdas', section: 'org', componentKey: 'Cuerdas' },
  { key: 'areas', label: 'Áreas', path: 'areas', permission: 'view:areas', section: 'org', componentKey: 'Areas' },
  { key: 'miembros', label: 'Miembros', path: 'miembros', permission: 'view:miembros', section: 'org', componentKey: 'Miembros' },
  { key: 'miembros-agregar', label: 'Agregar miembro', path: 'miembros/agregar', permission: 'view:crear:miembros', showInMenu: false, section: 'org', componentKey: 'MiembrosAgregar' },
  { key: 'miembros-editar', label: 'Editar miembro', path: 'miembros/editar', permission: 'view:editar:miembros', showInMenu: false, section: 'org', componentKey: 'MiembrosEditar' },


  { key: 'reportes', label: 'Reportes', path: 'reportes', permission: 'view:reportesasistencia', section: 'extra', componentKey: 'ReportesPage' },
  { key: 'reporte-miembro', label: 'Reporte de miembro', path: 'reportes/miembro/:tipoDocumento/:nroDocumento', permission: 'view:reporteasistencia', showInMenu: false, section: 'extra', componentKey: 'ReporteAsistenciaMiembroAnualPage' },
  { key: 'reporte-asistencia-miembro', label: 'Reporte asistencia miembro', path: 'reportes/asistencias/miembro', permission: 'view:reporteasistencia', showInMenu: false, section: 'extra', componentKey: 'ReporteAsistenciaMiembroAnualPage' },

  { key: 'inscripcion', label: 'Consulta inscripción', path: 'inscripcion/:id', permission: 'view:inscripcion', showInMenu: false, section: null, componentKey: 'FormularioConsulta' },
  { key: 'inscripcion-coordinadores', label: 'Consulta coordinación', path: 'inscripcion/coordinadores/:id', permission: 'view:inscripcioncoordinador', showInMenu: false, section: null, componentKey: 'FormularioConsultaCoordinacion' },

];
