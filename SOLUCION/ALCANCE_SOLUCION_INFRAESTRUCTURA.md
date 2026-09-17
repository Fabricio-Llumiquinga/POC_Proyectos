# ALCANCE TOTAL DE LA SOLUCIÓN
## Torre Inteligente de Importaciones y Rentabilidad — RENTECO

**Versión:** Prototipo v2.0 (Producción futura)  
**Fecha:** Agosto 2026  
**Propósito:** Documento de alcance funcional y técnico para evaluación en reunión de cambios. Describe las capacidades actuales implementadas en el prototipo y los requerimientos para paso a producción.

---

## 1. DESCRIPCIÓN GENERAL

Sistema web empresarial para la planificación, simulación, aprobación y seguimiento de importaciones comerciales. La plataforma centraliza el análisis previo a cada compra internacional, integrando datos de SAP Business One y reglas de negocio configurables para recomendar de forma explicable si una importación debe ejecutarse, ajustarse, posponerse o descartarse.

**Usuarios objetivo:** Gerencia Comercial, Departamento de Importaciones/Compras, Dirección/Aprobadores y Administración de sistemas.

**Ubicación geográfica:** Costa Rica (sede principal), con proveedores en Europa, Estados Unidos, Asia y Sudamérica.

**Estado actual:** Prototipo funcional con datos simulados. Sin conexión a SAP ni servicios externos reales.

---

## 2. ARQUITECTURA TÉCNICA ACTUAL

| Componente | Tecnología | Archivo |
|-----------|-----------|---------|
| Frontend | HTML5 + CSS3 + JavaScript Vanilla | `index.html`, `styles.css`, `app.js` |
| Iconos | Font Awesome 6.5.1 (CDN) | — |
| Persistencia | `localStorage` del navegador | — |
| Backend | No existe (datos estáticos en JS) | — |
| Base de datos | No existe | — |
| Autenticación | Simulada (selector de rol) | — |

**Despliegue actual:** Archivo estático que se abre directamente en navegador.

---

## 3. MÓDULOS FUNCIONALES IMPLEMENTADOS

### 3.1 Dashboard / Resumen Ejecutivo
- **KPIs en tiempo real:** simulaciones en análisis, pendientes de aprobación, órdenes de compra generadas, alertas críticas.
- **Gráficos:** simulaciones por estado (barras), variación de costos por región de origen (barras).
- **Tabla resumen:** últimas 6 simulaciones con acceso directo al detalle.
- **Botón de restauración** de datos de demostración.
- **Datos presentados:**
  - Estado: borrador, aprobada, rechazada, OC creada.
  - Semáforo de utilización por simulación.
  - Badge de recomendación (COMPRAR / CON AJUSTES / ESPERAR / NO COMPRAR).

### 3.2 Simulaciones de Importación (Bandeja)
- **Listado completo** de todas las simulaciones registradas.
- **Filtros avanzados:** búsqueda textual, proveedor, estado, región.
- **Columnas:** código, fecha, proveedor, tipo, región, Incoterm, carga, productos, total USD, costo CR, utilización, recomendación, estado, llegada estimada.
- **Acciones por fila:** ver detalle, duplicar, eliminar (solo borradores).
- **4 estados implementados:** borrador, aprobada, rechazada, OC generada.
- **Botón de creación** de nueva simulación.

### 3.3 Wizard de Nueva Simulación (6 pasos)

#### Paso 1 — Origen de la necesidad
- Tipo de análisis: compra completa por proveedor, reposición, producto nuevo, extraordinaria.
- Área solicitante: Comercial, Operaciones, Proyectos.
- Responsable, fecha requerida, observaciones.

#### Paso 2 — Proveedor, Proforma e Histórico
- **Selección de proveedor** del directorio (6 proveedores configurados).
- **Incoterm:** CIF, FOB, FCA, EXW.
- **Tipo de carga:** 40 pies, 20 pies, Consolidado.
- **Carga de proforma/cotización:**
  - Zona drag & drop (acepta PDF, Excel, imagen).
  - Extracción simulada de costos por producto.
  - Tabla comparativa: costo anterior SAP vs. nuevo costo proforma con variación %.
  - Indicadores visuales de alerta (>15% rojo, >0% naranja, ≤0% verde).
  - Aplicación directa de costos al catálogo de la simulación.
  - Datos extraídos: N° cotización, fecha, cantidad de productos, moneda.
- **Resumen histórico del proveedor** (si recurrente): importaciones, combos, contenedor habitual, utilización promedio, tiempo tránsito, última importación, frecuencia, tratado, moneda.
- **Alerta para proveedor nuevo** (sin histórico, confianza baja).

#### Paso 3 — Catálogo y Mix de Productos
- **Tabla editable del catálogo completo** del proveedor (8 productos por proveedor principal):
  - Checkbox de selección, SKU, descripción, categoría, cantidad (editable), stock, ventas 3m, cobertura, frecuencia, peso, volumen, costo cotizado (editable), costo SAP, precio venta, concentración %, acción recomendada.
- **Combinaciones históricas:** cards con nombre, veces usada, productos, utilización, fecha, botón aplicar.
- **Motor de mix inteligente:**
  - Botón "Recomendados" (selecciona según reglas).
  - Botón "Limpiar" selección.
  - Botón "Mix inteligente" que genera recomendaciones explicables.
  - Acciones por producto: Aumentar, Reducir, Revisar, Agregar, Retirar, Mantener.
  - Justificaciones por cambio: cobertura, rotación, concentración, órdenes en tránsito, incremento de costo.
  - Intento de llenado de contenedor si hay >15% espacio libre.
  - Comparación visual antes/después con métricas logísticas.
  - Tabla de justificación por cambio sugerido.

#### Paso 4 — Logística y Costos
- **Campos de costos dinámicos según Incoterm:**
  - CIF: flete y seguro desactivados (incluidos en costo producto).
  - EXW: alerta de incluir todos los costos desde planta.
  - FOB/FCA: todos los campos activos.
- **Desglose de costos:** flete internacional, seguro, operador logístico, agencia aduanal, aranceles, impuestos, tratado comercial (sí/no), descuento tratado, transporte local, otros costos.
- **Tiempo tránsito** en días.
- **Método de distribución** de costos: por valor, por peso, por volumen.
- **Visualización de utilización del contenedor:**
  - Peso total (kg) con barra de progreso.
  - Volumen (m³) con barra de progreso.
  - Utilización efectiva (%) con semáforo (verde ≥85%, amarillo ≥70%, rojo <70%).
  - Alerta si utilización <70%.

#### Paso 5 — Análisis y Escenarios
- **KPIs:** monto compra, costos adicionales, costo total puesto en CR.
- **Módulo de tipo de cambio y proyección:**
  - TC actual del sistema.
  - Tiempo máximo de entrega del proveedor.
  - TC proyectado a N días (variación estimada ~0.8%/mes).
  - Costo total con TC actual vs. TC proyectado vs. diferencia.
- **3 escenarios de precios:**
  - A. Precio actual (mantener precio, evaluar margen).
  - B. Mantener margen (ajustar precio para conservar margen actual).
  - C. Margen objetivo (ajustar precio al margen configurado).
- **Tabla de análisis por producto:** SKU, costo SAP, costo cotizado, costos logísticos distribuidos, costo CR proyectado, variación %, precio actual, margen actual, margen proyectado, precio sugerido, estado (Saludable/Bajo observación/En riesgo/Negativo), acción recomendada.
- **Resumen de estados de margen:** saludables, en riesgo, negativos.
- **Análisis inteligente (insights):** lista de observaciones en lenguaje natural con iconos.
- **Recomendación final:**
  - 4 niveles: COMPRAR, COMPRAR CON AJUSTES, ESPERAR, NO COMPRAR.
  - Scoring basado en 14+ factores: márgenes, utilización, coincidencia histórica, stock crítico, rotación, Incoterm, concentración, incremento costos, tipo proveedor.
  - Nivel de confianza: Alta, Media, Baja.
  - Razón explicable de la recomendación.

#### Paso 6 — Decisión
- **Resumen ejecutivo:** total compra, costo CR, utilización, tiempo tránsito.
- **Recomendación final** con confianza.
- **Acciones según rol:**
  - Guardar borrador.
  - Aprobar.
  - Aprobar y crear OC en SAP (simulado).
  - Rechazar (con confirmación modal).
  - Exportar reporte.
- **Equivalencia CRC** con tipo de cambio del sistema.

### 3.4 Ejemplos / Presets de Demostración
- 3 escenarios precargados accesibles desde el wizard:
  - **COMPRAR:** Danosa, CIF, 40 pies, costos -3%, stock crítico, alta utilización.
  - **NO COMPRAR:** Polímeros del Sur (nuevo), CIF, 20 pies, costos +60%, baja rotación, alta concentración.
  - **CON AJUSTES:** Danosa, CIF, 40 pies, costos +10%, cobertura baja, mix aplicado.
- Carga directa al paso 5 para demostración rápida.

### 3.5 Planificación de Compra

#### Pestaña: Por Proveedor
- **Selector de proveedor** (solo recurrentes).
- **KPIs del proveedor:** productos en catálogo, combos históricos, utilización promedio, frecuencia, tiempo tránsito.
- **Información comercial:** país, moneda, Incoterm, última compra, tratado, variación reciente.
- **Catálogo completo** con tabla de selección múltiple:
  - Indicador visual de stock bajo (fondo naranja, borde lateral).
  - Sugerencia IA: "Comprar" para productos con cobertura <3 meses.
  - Botón "Seleccionar sugeridos por IA" (selecciona productos con stock bajo).
  - Checkbox individual y global.
- **Combinaciones históricas** con botón de crear simulación desde combo.
- **Acciones:** crear simulación con proveedor completo, crear simulación con selección específica.

#### Pestaña: Por Producto (Forecast)
- **Selector de producto** individual del catálogo.
- **KPIs:** stock actual, pronóstico mensual, cobertura (meses), compra sugerida.
- **Gráfico de ventas** últimos 12 meses (barras con detección de atípicos).
- **Información del producto:** costo, precio, margen, ventas 3m/6m/12m, cliente principal, concentración.
- **Alertas:** cobertura crítica (<2m), concentración alta (>60%).
- **Pronóstico:** promedio móvil ponderado (pesos [1,1,2,2,3,3] sobre últimos 6 meses).
- **Tabla de selección múltiple** para crear simulación conjunta.
- **Acciones:** crear simulación con productos seleccionados desde forecast.

### 3.6 Proveedores e Historial
- **Directorio de 6 proveedores** con datos comerciales y logísticos:
  - Danosa S.A. (España), Sika AG (Suiza), BuildTech USA Inc. (EEUU), Shanghai Materials Co. (China), Polímeros del Sur S.A. (Colombia), NovaTech Materials GmbH (Alemania).
- **Columnas:** región, tipo (recurrente/nuevo), moneda, Incoterm, contenedor, tiempo entrega histórico, tratado, variación %, importaciones, última compra.
- **Ficha detallada** (modal): datos completos, catálogo, combos, estado del proveedor.
- **Acciones:** ver ficha, planificar compra, crear simulación.

### 3.7 Detalle de Simulación (7 pestañas)

#### Resumen
- KPIs: total compra, costo CR, utilización, Incoterm.
- Datos: motivo, proveedor, región/país, carga, responsable, fecha, llegada, productos, orden SAP, equivalencia CRC.

#### Productos
- Tabla con SKU, descripción, costo SAP, precio, margen, stock del catálogo del proveedor.

#### Mix inteligente
- Indicador de mix aplicado con productos seleccionados y utilización.

#### Logística
- Tipo carga, Incoterm, región, costo logístico estimado, % sobre compra, utilización con semáforo.

#### Recomendación
- Card con recomendación final y confianza.

#### Orden de compra (si existe)
- Datos: número OC, SAP, estado.
- Acciones: imprimir/PDF, enviar al proveedor (simulado), crear en SAP (simulado).

#### Seguimiento logístico
- Datos de embarque: OC, SAP, embarque, contenedor, naviera, operador, puertos, salida.
- KPIs: ubicación actual, días restantes, llegada estimada.
- Línea visual de tránsito: Proveedor → Puerto origen → En tránsito → Puerto intermedio → Costa Rica → Aduana → Bodega.
- Nodos completados, actual (animación pulse) y pendientes.
- Botón actualizar (simulado, reduce días restantes).

#### Historial / Línea de tiempo
- 9 eventos trazables: solicitud creada → cotización cargada → datos SAP consultados → históricos analizados → mix recomendado → análisis completado → compra aprobada → OC generada → orden SAP creada.
- Eventos con fecha y hora.
- Indicación de flujo detenido si rechazada.

### 3.8 Orden de Compra
- **Generación automática** post-aprobación o desde botón en detalle.
- **Vista imprimible/PDF** con diseño de documento formal:
  - Logo RENTECO, datos de proveedor, tabla de productos con cantidades y costos, total, responsable, aprobador.
- **Creación de orden SAP** (simulada, genera número aleatorio 4500XXXX).
- **Envío al proveedor** (simulado, modal con correo, asunto y mensaje).
- **Estados de OC:** generada, SAP, enviada.

### 3.9 Seguimiento Logístico (Datos de tránsito)
- **3 registros de tránsito** configurados:
  - TR-001: Sika AG, Maersk, Rotterdam → Puerto Limón, en tránsito Atlántico.
  - TR-002: Danosa, Hapag-Lloyd, Valencia → Puerto Limón, en aduana.
  - TR-003: BuildTech USA, OOCL, Houston → Puerto Limón, en tránsito Caribe.
- **Datos por registro:** proveedor, OC, SAP, embarque, contenedor, naviera, operador logístico, puerto origen, fecha salida, ubicación actual, próximo puerto, fecha estimada, días restantes, estado aduanero, última actualización.
- **Actualización manual** simulada (reduce días, cambia estado).

### 3.10 Reglas y Parámetros (Solo rol Administrador)

#### Parámetros globales editables
- Margen mínimo (%) — default 25%.
- Margen objetivo (%) — default 35%.
- Variación costo alerta (%) — default 15%.
- Utilización mínima (%) — default 80%.
- Máxima concentración cliente (%) — default 60%.
- Tipo de cambio USD/CRC — default 530.
- Capacidades de contenedor: 20' peso 21,770 kg / 33.2 m³; 40' peso 26,780 kg / 67.7 m³.
- Carga sugerida por región: Europa 40', Asia 40', Sudamérica 20', EEUU Consolidado.

#### Reglas avanzadas (CRUD)
- 6 reglas pre-configuradas.
- Niveles de aplicación: General, Región, Proveedor, Producto, Incoterm.
- Campos: ID, nombre, descripción, condición, resultado, prioridad, activa (toggle), vigencia.
- Acciones: agregar, activar/desactivar, eliminar.
- Filtro por nivel.

### 3.11 Configuración General (Todos los roles)

#### Tipo de Cambio USD/CRC
- Campo editable con fecha de actualización.
- Fuente: ingreso manual, referencia BCCR (manual), tipo de cambio del proveedor.
- Notas opcionales.
- Equivalencia en tiempo real ($1,000 → ₡CRC).
- **Historial de actualizaciones:** tabla con fecha, valor, usuario, variación % respecto al anterior.
- Hasta 20 registros en historial.

#### Información del sistema
- Versión, estado de integración SAP (simulada), moneda base.
- Alerta de prototipo con datos simulados.

### 3.12 Reportes
- **Gráficos:**
  - Simulaciones por estado (barras).
  - Importaciones por Incoterm (barras).
- **Métricas generales:**
  - Importaciones en tránsito, próximas a llegar (15d), utilización promedio, tiempo promedio solicitud→aprobación (4.8d), tasa de aprobación, recomendaciones aceptadas (72%).
- **Tabla:** variación de costos por proveedor con estado (Normal/Moderado/Alerta).
- **Exportación simulada:** botones Excel y PDF (no funcionales, solo toast).

### 3.13 Roles y Permisos (Implementados como selector)
| Rol | Nombre en UI | Vistas | Acciones especiales |
|-----|-------------|--------|---------------------|
| comercial | Gerencia Comercial (Carlos Méndez) | Todas excepto Reglas | Crear, aprobar, rechazar, exportar |
| importaciones | Importaciones/Compras (Ana Solano) | Todas excepto Reglas | Crear, aprobar, rechazar, OC |
| aprobador | Aprobador/Dirección (Roberto Fallas) | Todas excepto Reglas | Aprobar, rechazar |
| admin | Administrador | Todas | Gestión de reglas y parámetros |

### 3.14 Motor de Recomendación (Scoring)
**Factores del score (base 50, rango ~0-100):**

| Factor | Impacto |
|--------|---------|
| >60% productos con margen saludable | +15 |
| Margen promedio ≥ margen mínimo | +5 |
| Productos con margen negativo | -15 |
| Utilización ≥85% | +15 |
| Utilización <70% | -15 |
| Combo histórico aplicado | +15 |
| Sin combos históricos | -10 |
| >30% productos con stock crítico (<2m cobertura) | +10 |
| >50% productos baja rotación (<10 ventas/3m) | -15 |
| >50% productos alta concentración | -15 |
| Aumento promedio costos >20% | -15 |
| Aumento promedio costos >15% | -10 |
| Proveedor no recurrente | -10 |
| Incoterm CIF o FCA | +5 |
| Costos adicionales <30% del monto compra | +10 |

**Resultados:**
- Score ≥65 → COMPRAR
- Score ≥45 → COMPRAR CON AJUSTES
- Score ≥30 → ESPERAR
- Score <30 → NO COMPRAR

**Confianza:**
- Proveedor no recurrente → Baja
- Score ≥60 o <30 → Alta
- Resto → Media

---

## 4. DATOS DE DEMOSTRACIÓN CONFIGURADOS

### Proveedores (6)
| # | Proveedor | País | Región | Recurrente | Moneda | Incoterm | Importaciones |
|---|-----------|------|--------|-----------|--------|----------|---------------|
| 1 | Danosa S.A. | España | Europa | Sí | EUR | CIF | 14 |
| 2 | Sika AG | Suiza | Europa | Sí | EUR | FOB | 8 |
| 3 | BuildTech USA Inc. | EEUU | Estados Unidos | Sí | USD | FCA | 15 |
| 4 | Shanghai Materials Co. | China | Asia | Sí | USD | FOB | 5 |
| 5 | Polímeros del Sur S.A. | Colombia | Sudamérica | No | USD | CIF | 0 |
| 6 | NovaTech Materials GmbH | Alemania | Europa | No | EUR | EXW | 0 |

### Productos (catálogos por proveedor)
- Danosa: 8 productos (impermeabilización, membranas, accesorios, drenaje).
- BuildTech USA: 8 productos (impermeabilización, selladores, geotextiles, adhesivos, fijaciones, imprimantes, cintas, drenaje).
- Sika: derivado de Danosa (+5% costo, +8% precio).
- Shanghai: derivado de Danosa (primeros 6, -30% costo, -10% precio).
- Polímeros del Sur: derivado de BuildTech (primeros 4, +30% costo).
- NovaTech: derivado de Danosa (primeros 5, +15% costo).

### Simulaciones de demostración (10)
- SIM-2026-001 a SIM-2026-010 con variedad de estados, proveedores, recomendaciones.

### Órdenes de compra (3)
- OC-2026-038 (Danosa), OC-2026-042 (Sika), OC-2026-045 (BuildTech).

### Registros de tránsito (3)
- Con datos de embarque, naviera, operador, estados variados.

### Combinaciones históricas (6+ combos)
- Danosa: 3 combos (Impermeabilización completa, Membranas + Accesorios, Reposición rápida).
- BuildTech: 3 combos (Mix completo, Geotextiles + Drenaje, Impermeabilización integral).

---

## 5. CARACTERÍSTICAS DE UX/UI IMPLEMENTADAS

- **Layout:** Sidebar fijo + contenido principal + header sticky + footer.
- **Sidebar colapsable** con toggle.
- **Diseño responsive:** adaptación a escritorio, tablet y móvil.
- **Paleta de colores:** azul petróleo (#1a5276), azul claro (#2980b9), naranja (#e67e22), gris, blanco.
- **Sistema de notificaciones (toast):** success, error, warning, info con animación slide-in.
- **Modales de confirmación** para acciones destructivas.
- **Semáforos visuales** para utilización (verde/amarillo/rojo).
- **Badges de estado** con colores diferenciados por cada estado del ciclo.
- **Barras de progreso** para peso y volumen.
- **Wizard con indicador de progreso** visual (pasos completados/activo/pendiente).
- **Tooltips** informativos.
- **Filtros y búsqueda** en tablas.
- **Menú móvil** con botón hamburguesa.
- **Print styles** para orden de compra.
- **Animación pulse** en nodo actual de seguimiento logístico.
- **Drag & drop zone** para carga de proforma.

---

## 6. INTEGRACIÓN REQUERIDA EN PRODUCCIÓN

| Sistema | Tipo | Datos | Frecuencia |
|---------|------|-------|------------|
| SAP Business One | API (DI API / Service Layer) | Órdenes compra, costos, stock, precios, facturas, maestro de artículos, maestro de proveedores | Tiempo real / batch diario |

**Nota:** El tipo de cambio USD/CRC se administra manualmente desde la vista de Configuración del sistema. No requiere integración con servicios externos.

---

## 7. REQUERIMIENTOS PARA PASO A PRODUCCIÓN

### Infraestructura
- Servidor web (Node.js, .NET, Java o similar).
- Base de datos relacional (PostgreSQL, SQL Server).
- Servidor de aplicación con API REST.
- Certificado SSL.
- Entorno de staging y producción.

### Desarrollo necesario
- Backend con API REST.
- Modelo de datos relacional.
- Autenticación y autorización real (usuarios, contraseñas, sesiones/JWT).
- Integración con SAP Business One (Service Layer o DI API).
- Parser de proformas (OCR para PDF/imagen, parser para Excel).
- Logs de auditoría.
- Migración de localStorage a base de datos.
- Validaciones server-side.
- Manejo de errores robusto.
- Tests unitarios y de integración.

### Seguridad
- Autenticación con hash de contraseñas.
- Control de acceso por rol (RBAC) real.
- Protección CSRF/XSS.
- Rate limiting.
- Logs de auditoría inmutables.

---

## 8. EXCLUSIONES DEL ALCANCE

- Desarrollo de app móvil nativa.
- Machine learning real (el motor usa reglas determinísticas configurables).
- Integración con operadores logísticos o navieras (seguimiento se registra manualmente).
- Servicio de correo transaccional (envío de OC al proveedor es manual por correo del usuario).
- Integración con Directorio Activo / SSO (autenticación propia del sistema).
- Integración con API de tipo de cambio del BCCR (se ingresa manualmente).
- Migración de datos históricos de otros sistemas.
- Capacitación a usuarios finales.
- Soporte post-implementación (SLA separado).
- Personalización de SAP Business One.
- Hardware de usuario final.
- Exportación real a Excel/PDF (actualmente simulada).
- Envío real de correos electrónicos.
- Multi-idioma.
- Multi-moneda simultánea (solo USD con equivalencia CRC).

---

## 9. SUPUESTOS

- RENTECO ya cuenta con SAP Business One operativo con Service Layer habilitado.
- Existe conectividad de red entre el sistema y SAP (red local o VPN).
- El tipo de cambio se actualiza manualmente por un usuario autorizado desde la vista de Configuración.
- El seguimiento logístico se actualiza manualmente conforme se recibe información del operador.
- El envío de órdenes de compra al proveedor se realiza por correo electrónico del usuario (no automatizado).
- Los usuarios acceden desde red corporativa o VPN.
- La autenticación se gestiona dentro del propio sistema (tabla de usuarios y contraseñas).
- Los datos del prototipo representan fielmente la estructura de información real de RENTECO.
- Los catálogos de productos y proveedores son representativos del volumen real.

---

## 10. MÉTRICAS DEL PROTOTIPO ACTUAL

| Métrica | Valor |
|---------|-------|
| Archivos | 3 (index.html, styles.css, app.js) |
| Líneas de código JS | ~905 |
| Líneas de CSS | ~280 |
| Vistas/módulos | 8 principales + sub-vistas |
| Proveedores | 6 |
| Productos totales | ~48 (8 por proveedor principal) |
| Simulaciones demo | 10 |
| Reglas configuradas | 6 avanzadas + 10 parámetros globales |
| Órdenes de compra | 3 |
| Registros de tránsito | 3 |
| Roles implementados | 4 |

---

## 11. RIESGOS IDENTIFICADOS

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Complejidad de integración SAP | Alto | Validar Service Layer con equipo SAP antes de desarrollo |
| Parser de proformas (OCR) | Medio | Evaluar servicios cloud (Azure AI, AWS Textract) vs. ingreso manual |
| Volumen de datos real vs. demo | Medio | Pruebas de carga con datos representativos |
| Adopción de usuarios | Medio | Capacitación y UAT con usuarios clave |
| Disponibilidad de SAP | Medio | Caché local + manejo offline parcial |
| Tipo de cambio manual | Bajo | Proceso operativo definido + alertas de actualización |

---

*Documento generado para revisión en reunión de cambios — Agosto 2026*
