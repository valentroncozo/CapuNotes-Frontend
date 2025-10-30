# Integración Backend - Sistema de Historial de Audiciones

Este documento describe los endpoints y estructuras de datos necesarios en el backend para integrar el sistema de historial de audiciones con los datos de candidatos.

## 📋 Endpoints Requeridos

### 1. Historial de Audiciones

#### `GET /api/historial`
Obtiene el listado completo del historial de audiciones.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "fechaAudicion": "2024-03-15",
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
      "telefono": "+549111234567",
      "fechaNacimiento": "1990-05-20",
      "genero": "Masculino",
      "cuerda": "Tenor",
      "direccion": "Calle Falsa 123",
      "observaciones": "Primera audición"
    }
  }
]
```

#### `GET /api/historial/anio/{anio}`
Obtiene audiciones filtradas por año.

**Parámetros:**
- `anio`: Año a filtrar (ej: 2024)

#### `GET /api/historial/candidato/{tipoDocumento}/{nroDocumento}`
Obtiene el historial de un candidato específico.

**Parámetros:**
- `tipoDocumento`: Tipo de documento (DNI, Pasaporte, etc.)
- `nroDocumento`: Número de documento

#### `GET /api/historial/{id}`
Obtiene el detalle completo de una audición histórica.

**Parámetros:**
- `id`: ID de la audición

#### `GET /api/historial/estadisticas`
Obtiene estadísticas del historial.

**Respuesta esperada:**
```json
{
  "totalCandidatos": 150,
  "aceptados": 45,
  "rechazados": 80,
  "ausentes": 25,
  "porcentajeAceptacion": 30.0,
  "audicionesPorAnio": {
    "2024": 50,
    "2023": 100
  }
}
```

#### `GET /api/historial/buscar?nombre={nombre}`
Busca en el historial por nombre de candidato.

**Query Params:**
- `nombre`: Texto a buscar

---

### 2. Candidatos

#### `GET /api/candidatos`
Lista todos los candidatos de la audición actual.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "nombre": "María",
    "apellido": "González",
    "hora": "10:30",
    "cancion": "Hallelujah",
    "dia": "Lunes 15/03",
    "fechaAudicion": "2024-03-15",
    "resultado": {
      "estado": "aceptado",
      "obs": "Muy buena técnica"
    },
    "inscripcion": {
      "nombre": "María",
      "apellido": "González",
      "tipoDocumento": "DNI",
      "nroDocumento": "87654321",
      "email": "maria@example.com",
      "telefono": "+549111234567",
      "fechaNacimiento": "1995-08-10",
      "genero": "Femenino",
      "cuerda": "Soprano",
      "diaAudicion": "Lunes 15/03"
    }
  }
]
```

#### `GET /api/candidatos/{id}`
Obtiene un candidato por ID.

#### `PATCH /api/candidatos/{id}/resultado`
Actualiza el resultado de un candidato.

**Body:**
```json
{
  "estado": "aceptado",
  "obs": "Excelente desempeño"
}
```

#### `PATCH /api/candidatos/{id}/cuerda`
Actualiza la cuerda de un candidato.

**Body:**
```json
{
  "cuerda": "Tenor"
}
```

#### `GET /api/candidatos/dia/{dia}`
Obtiene candidatos por día de audición.

---

### 3. Audiciones

#### `GET /api/audiciones/dias`
Lista todos los días disponibles de audición.

**Respuesta esperada:**
```json
["Lunes 15/03", "Martes 16/03", "Miércoles 17/03"]
```

#### `GET /api/audiciones/turnos/{dia}`
Lista los turnos de un día específico.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "hora": "10:00",
    "candidato": "Juan Pérez",
    "disponible": false
  }
]
```

#### `GET /api/audiciones/actual`
Obtiene la audición actual/activa.

**Respuesta esperada:**
```json
{
  "id": 1,
  "nombre": "Audición Primavera 2024",
  "fechaInicio": "2024-03-15",
  "fechaFin": "2024-03-20",
  "estado": "activa"
}
```

---

## 🔗 Relación entre Entidades

```
Audición (actual)
  └─> Candidatos (lista)
       ├─> Inscripción (datos personales)
       └─> Resultado (evaluación)

Historial
  └─> Audiciones pasadas
       └─> Candidatos
            ├─> Inscripción
            └─> Resultado
```

---

## 📝 Notas Importantes

1. **Estados de Resultado**: Los valores aceptados son:
   - `"aceptado"`, `"aceptada"`, `"ok"` → Aceptado
   - `"rechazado"`, `"rechazada"`, `"bad"` → Rechazado
   - `"ausente"`, `"pend"` → Ausente
   - `"sin"` o `null` → Sin resultado

2. **Formato de Fechas**: Se espera formato ISO 8601 o formato local `DD/MM/YYYY`

3. **CORS**: Asegúrate de configurar CORS en el backend para permitir peticiones desde `http://localhost:5173` (Vite dev server)

4. **Manejo de Errores**: Todos los endpoints deben retornar:
   - `200 OK` para operaciones exitosas
   - `404 Not Found` cuando no se encuentra el recurso
   - `400 Bad Request` para datos inválidos
   - `500 Internal Server Error` para errores del servidor

---

## 🚀 Ejemplo de Configuración CORS (Spring Boot)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowedHeaders("*");
    }
}
```

---

## ✅ Checklist de Implementación

- [ ] Endpoint `/api/historial` implementado
- [ ] Endpoint `/api/candidatos` implementado
- [ ] Endpoint `/api/audiciones/dias` implementado
- [ ] Endpoint `/api/audiciones/actual` implementado
- [ ] PATCH endpoints para actualizar resultados y cuerdas
- [ ] CORS configurado correctamente
- [ ] Manejo de errores implementado
- [ ] Base de datos con relaciones entre Audición, Candidato e Inscripción
