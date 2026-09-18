# Torre de Control de Trámites

## Descripción

Aplicación web para centralizar la recepción, creación, gestión, seguimiento, control documental, asignación, integración y cierre de trámites aduaneros. Diseñada como una solución empresarial completa con portal de clientes y backoffice interno.

## Estructura de Archivos

```
/index.html              - Punto de entrada principal
/css/styles.css          - Estilos completos de la aplicación
/js/app.js               - Controlador principal SPA
/js/data.js              - Datos de demostración y gestión de localStorage
/js/auth.js              - Autenticación y gestión de sesiones
/js/workflow.js          - Detalle del trámite y gestión de workflow
/js/backoffice.js        - Vista completa del backoffice interno
/js/client-portal.js     - Portal de clientes externos
/js/integrations.js      - Simulación de integraciones SOLSER/OMEGA
/README.md               - Este archivo
```

## Usuarios de Demostración

### Backoffice Interno
- **Usuario:** sebastian.alfaro
- **Contraseña:** demo123
- **Rol:** Coordinador operativo

### Cliente Externo
- **Código:** CLI-1001
- **Contraseña:** demo123
- **Empresa:** LunaToon Studios

## Forma de Ejecución

1. Abra el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge)
2. No requiere servidor web, instalación de dependencias ni conexión a internet
3. Funciona completamente de forma local

## Funcionalidades Implementadas

### Acceso y Autenticación
- Pantalla de bienvenida con selección de tipo de acceso
- Login separado para Backoffice y Cliente
- Persistencia de sesión en localStorage
- Roles con permisos simulados

### Backoffice (13 módulos)
1. **Resumen Ejecutivo** - KPIs y gráficos de estado
2. **Gestión de Trámites** - Bandeja completa con filtros y exportación CSV
3. **Crear Nuevo Trámite** - Formulario completo de creación
4. **Workflow y Seguimiento** - Vista de flujo con línea de tiempo
5. **Recepción por Correo** - Bandeja de emails procesados por RPA
6. **Excepciones** - Casos que requieren intervención manual
7. **Monitoreo de SLA** - Semáforo y seguimiento de niveles de servicio
8. **Alertas y Seguimiento** - Centro de notificaciones
9. **Reasignación** - Gestión de capacidad y reasignación de trámites
10. **Reportes y KPI** - Indicadores de productividad
11. **Integraciones** - Estado de conexiones con sistemas externos
12. **Administración** - Usuarios, clientes, parámetros, SLA, automatización
13. **Auditoría** - Línea de tiempo unificada de acciones

### Detalle del Trámite (10 pestañas)
- Resumen, Workflow, Documentos, Ítems, Proforma, Integraciones, Costos, Comentarios, Alertas, Historial

### Portal de Clientes (7 secciones)
- Resumen, KPIs, Crear trámite, Historial, Documentos pendientes, Proformas, Notificaciones

### Workflow de 10 Etapas
1. Solicitud Recibida
2. Validación Documental
3. Asignación del Trámite
4. Revisión de Ítems y Partidas
5. Proforma y Visto Bueno
6. Declaración, DUA y Aforo
7. Operación y Liberación
8. Entrega a Facturación
9. Facturación
10. Cierre y Archivo

## Integraciones Simuladas

- **SOLSER** - Creación de Orden de Trabajo (OT)
- **DELIMP** - Importación
- **DELEXP** - Exportación
- **DELTRA** - Tránsito
- **DELPAC** - Perfeccionamiento Activo
- **DELZOF** - Zona Franca
- **FACSER** - Facturación

Las integraciones simulan respuestas exitosas y errores aleatorios con opción de reintento.

## Datos de Demostración

- 20 trámites en distintas etapas y estados
- 8 clientes ficticios del sector audiovisual y animación
- 10 usuarios internos con distintos roles
- 5 tipos de trámite (Importación, Exportación, Tránsito, PA, Zona Franca)
- Documentos, comentarios, alertas, costos y proformas

## Limitaciones de la Demostración

- No realiza conexiones reales a sistemas externos
- Los archivos adjuntos son simulados (no se almacenan físicamente)
- Las notificaciones por correo y Teams son simuladas
- Los datos se almacenan en localStorage del navegador
- El botón "Restaurar datos demo" permite reiniciar toda la información

## Tecnología

- HTML5, CSS3, JavaScript puro (Vanilla)
- localStorage para persistencia
- Sin dependencias externas, frameworks ni CDN
- Compatible con navegadores modernos
- Diseño responsive para escritorio y tablet
