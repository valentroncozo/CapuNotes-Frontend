# 🎵 Historial de Audiciones - Guía de Uso

## 🎯 Estado Actual

El componente de **Historial de Audiciones** ya está completamente funcional con **datos de prueba (mock)** mientras implementas el backend.

### ✅ ¿Qué funciona ahora?

- ✅ Visualización de historial completo
- ✅ Búsqueda por nombre, apellido o canción
- ✅ Filtro por año
- ✅ Ordenamiento por múltiples columnas
- ✅ Ver detalles de resultados
- ✅ Ver información de inscripción
- ✅ Datos de prueba con 7 candidatos

---

## 🚀 Cómo Probar la Interfaz

1. **Navega al historial:**
   - Ve a `/audicion` 
   - Click en el botón **"Ver Historial"**
   - O navega directamente a `/audicion/historial`

2. **Prueba las funcionalidades:**
   - 🔍 Busca por nombre: "Juan", "María", etc.
   - 📅 Filtra por año: "2023" o "2024"
   - 🔽 Ordena por cualquier columna (click en los encabezados)
   - 👁️ Click en el ícono de documento para ver detalles del resultado
   - ℹ️ Click en el ícono de información para ver la inscripción completa

---

## 🔧 Configuración de Datos de Prueba

### Para usar datos de prueba (ACTUAL):

En `src/services/historialService.js`:
```javascript
const USE_MOCK_DATA = true; // ✅ Está así ahora
```

### Para conectar con el backend:

```javascript
const USE_MOCK_DATA = false; // ⚠️ Cambia a esto cuando el backend esté listo
```

---

## 📊 Datos de Prueba Incluidos

El archivo `mockHistorialData.js` contiene 7 candidatos de ejemplo:

| Candidato | Fecha | Canción | Estado |
|-----------|-------|---------|--------|
| Juan Pérez | 15/03/2024 | Ave María | ✅ Aceptado |
| María González | 15/03/2024 | Hallelujah | ✅ Aceptado |
| Carlos Rodríguez | 16/03/2024 | Nessun Dorma | ❌ Rechazado |
| Ana Martínez | 16/03/2024 | O Mio Babbino Caro | 🚫 Ausente |
| Luis Fernández | 10/09/2023 | Con Te Partirò | ✅ Aceptado |
| Laura Torres | 10/09/2023 | Summertime | ✅ Aceptado |
| Diego Sánchez | 11/09/2023 | Granada | ⚪ Sin resultado |

**Puedes editar `src/services/mockHistorialData.js` para agregar más datos de prueba.**

---

## 🔌 Integración con Backend

### Paso 1: Implementar Endpoints

Consulta el archivo `BACKEND_INTEGRATION.md` para ver todos los endpoints requeridos.

**Endpoint principal:**
```
GET /api/historial
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "fechaAudicion": "15 de Marzo de 2024",
    "cancion": "Ave María",
    "resultado": {
      "estado": "aceptado",
      "obs": "Excelente técnica vocal"
    },
    "inscripcion": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "tipoDocumento": "DNI",
      "nroDocumento": "12345678",
      "email": "juan@example.com",
      // ... más campos
    }
  }
]
```

### Paso 2: Configurar CORS

Asegúrate de que tu backend permita peticiones desde:
- `http://localhost:5173` (desarrollo)

### Paso 3: Desactivar Mock Data

En `historialService.js`:
```javascript
const USE_MOCK_DATA = false;
```

### Paso 4: Probar

Navega al historial y verifica que cargue datos del backend.

---

## 🐛 Solución de Problemas

### Error: "El servicio de historial aún no está disponible"

**Causa:** El backend no está respondiendo en `/api/historial`

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la URL base en `vite.config.js`
3. Verifica CORS en el backend
4. Mientras tanto, usa `USE_MOCK_DATA = true`

### Error: "No hay registros en el historial"

**Causa:** El backend responde pero devuelve un array vacío

**Solución:**
1. Verifica que haya datos en la base de datos
2. Verifica que el endpoint esté retornando los datos correctamente
3. Revisa la consola del navegador para ver la respuesta

### La tabla no muestra algunos campos

**Causa:** La estructura de datos del backend no coincide

**Solución:**
1. Compara la respuesta del backend con `mockHistorialData.js`
2. Ajusta el backend o el componente según sea necesario
3. Verifica que todos los campos requeridos estén presentes

---

## 📝 Archivos Importantes

```
src/
├── components/pages/audicion/
│   └── historial.jsx              # Componente principal
├── services/
│   ├── historialService.js        # Servicio (API + Mock)
│   ├── mockHistorialData.js       # Datos de prueba ⭐
│   ├── candidatosService.js       # API de candidatos
│   └── audicionesService.js       # API de audiciones
├── components/common/
│   ├── InscripcionView.jsx        # Modal de inscripción
│   └── datetime.js                # Utilidades de fecha
├── constants/
│   └── candidatos.js              # Estados y labels
└── utils/
    └── alerts.js                  # Sistema de alertas
```

---

## 🎨 Personalización

### Agregar más datos de prueba

Edita `src/services/mockHistorialData.js` y agrega objetos al array:

```javascript
{
  id: 8,
  nombre: "Tu",
  apellido: "Nombre",
  fechaAudicion: "20 de Octubre de 2024",
  cancion: "Tu Canción",
  resultado: {
    estado: "aceptado",
    obs: "Observaciones..."
  },
  inscripcion: {
    // ... datos de inscripción
  }
}
```

### Cambiar estados de resultado

Estados válidos: `"aceptado"`, `"rechazado"`, `"ausente"`, `"sin"`

### Modificar campos de la tabla

Edita `historial.jsx` en la sección de encabezados (`<thead>`) y cuerpo (`<tbody>`).

---

## ✨ Próximas Mejoras Sugeridas

- [ ] Exportar historial a CSV/PDF
- [ ] Gráficos y estadísticas
- [ ] Comparación entre años
- [ ] Filtros avanzados (por cuerda, estado, etc.)
- [ ] Paginación para grandes volúmenes de datos

---

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica la pestaña Network para ver las peticiones
3. Compara con los datos de prueba en `mockHistorialData.js`
4. Consulta `BACKEND_INTEGRATION.md` para la estructura esperada
