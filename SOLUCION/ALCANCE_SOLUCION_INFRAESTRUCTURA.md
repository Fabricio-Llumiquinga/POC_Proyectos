# ALCANCE TOTAL DE LA SOLUCIÓN
## Torre Inteligente de Importaciones y Rentabilidad — RENTECO

**Versión:** Prototipo v3.1 (incluye módulo de Compra Local)
**Fecha:** Octubre 2026
**Propósito:** Documento de alcance funcional y técnico. Describe las capacidades implementadas en el prototipo y los requerimientos para el paso a producción.

---

## 1. DESCRIPCIÓN GENERAL

Sistema web para la planificación, simulación, aprobación y seguimiento de compras de RENTECO, tanto **importaciones** como **compras locales en Costa Rica**. Centraliza el análisis previo a cada compra con datos equivalentes a SAP Business One (stock, reservas, consumo, costos, precios), cotizaciones de proveedores y reglas de negocio configurables. Con esa información recomienda, de forma explicable, si una compra debe ejecutarse, ajustarse, posponerse o descartarse.

**Principio de diseño:** la herramienta **asiste** al especialista y no lo reemplaza. Recopila información, hace los cálculos repetitivos (costos, cobertura, utilización, márgenes, escenarios) y sugiere alternativas. El experto valida, ajusta o descarta.

**Usuarios objetivo:** Gerencia Comercial, Importaciones/Compras, Dirección/Aprobadores y Administración del sistema.

**Ubicación:** Costa Rica (sede y bodega), con proveedores internacionales (Europa, Estados Unidos, Asia, Sudamérica) y proveedores locales (San José, Heredia, Cartago).

**Estado actual:** prototipo funcional con datos simulados. No hay conexión a SAP, IA real ni servicios externos. Los proveedores y productos están anonimizados ("Proveedor N", "Producto N").

---

## 2. ARQUITECTURA TÉCNICA ACTUAL

| Componente | Tecnología | Archivo |
|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript vanilla (SPA) | `index.html`, `styles.css`, `app.js` |
| Iconos | Font Awesome 6.5.1 (CDN) | — |
| Gráficos | Barras CSS y líneas SVG generadas en JS | `app.js` |
| Persistencia | `localStorage` del navegador | — |
| Backend / Base de datos | No existe (datos estáticos en JS) | — |
| Autenticación | Simulada (selector de rol en el encabezado) | — |

**Despliegue actual:** archivos estáticos; se abre `index.html` directamente en el navegador.

**Estructura de `app.js`:**

| Bloque | Contenido |
|---|---|
| Datos | Reglas, 11 proveedores, catálogos, combos históricos, tránsitos, OC, 17 simulaciones, cotizaciones, usuarios, consumo |
| Motores de cálculo | `calculatePurchaseNeed`, `calculateProjectedRotation`, `optimizeOrder`, `calculateQuoteStatus`, `compareCosts`, `generatePriceHistory` |
| Estado / ruteo | Objeto `APP`, `navigateTo`, `renderView`, roles |
| Asistente de simulación | 6 pasos, con modo **importación** (regular o consolidada) y modo **compra local** |
| Análisis | `calcAnalysis`, `genInsights`, `genRecommendation` |
| Vistas | Resumen, simulaciones, planificación, proveedores, maestro de productos, reglas, configuración, usuarios, consumo, reportes, detalle |

**Claves de `localStorage`:** `renteco_sims2`, `renteco_rules2`, `renteco_advrules`, `renteco_transit`, `renteco_po`, `renteco_cotizaciones`, `renteco_usuarios`, `renteco_consumo`, `renteco_tc_historial`.

---

## 3. MENÚ Y VISTAS

| # | Menú | Vista | Rol |
|---|---|---|---|
| 1 | Resumen ejecutivo | `resumen` | Todos |
| 2 | Simulaciones | `simulaciones` | Todos |
| 3 | Nueva simulación importación | `nueva-simulacion` | Todos |
| 4 | Nueva simulación compra local | `compra-local` | Todos |
| 5 | Planificación de compra | `planificacion` | Todos |
| 6 | Proveedores e historial | `proveedores` | Todos |
| 7 | Maestro de productos | `productos` | Todos |
| 8 | Reglas y parámetros | `reglas` | Solo Administrador |
| 9 | Configuración | `configuracion` | Todos |
| 10 | Usuarios | `usuarios` | Todos |
| 11 | Control de consumo | `consumo` | Todos |
| 12 | Reportes | `reportes` | Todos |
| — | Detalle de simulación | `detalle-simulacion` | Se abre desde una simulación |

---

## 4. MÓDULOS FUNCIONALES IMPLEMENTADOS

### 4.1 Resumen ejecutivo
- Gráfico de simulaciones por estado y de variación de costos por región de origen.
- Tabla de las últimas 6 simulaciones: proveedor, país, Incoterm, monto, productos, utilización (o "—" si es compra local), recomendación, estado, llegada estimada y responsable. Las compras locales llevan la etiqueta **Local**.
- Botón **Restaurar datos de demostración**, que limpia `localStorage`.

### 4.2 Simulaciones (bandeja)
- Listado de simulaciones de importación y de compra local.
- **Filtros:** texto, tipo de compra (Importación / Compra local), proveedor, estado y región (incluye Costa Rica).
- **Columnas:** código (con etiqueta Local), fecha, proveedor, tipo de proveedor, región, Incoterm, carga, productos, total, costo puesto, utilización, recomendación, estado y llegada.
- **Acciones:** ver, editar (solo borradores), duplicar, eliminar (solo borradores, con confirmación). Al editar, el asistente se abre en el modo correcto (importación o local).
- **Botones:** "Nueva simulación importación" y "Nueva simulación compra local".

### 4.3 Asistente de simulación (6 pasos)

Es un solo asistente con dos modos. El modo se define con `tipoCompra` (`importacion` o `local`). Ambos modos comparten la necesidad de compra, el catálogo, la optimización, los márgenes, los escenarios, la recomendación y la OC.

Arriba del asistente hay 3 **ejemplos precargados** (COMPRAR, NO COMPRAR, CON AJUSTES) que saltan directo al paso 5.

#### Paso 1 — Origen de la necesidad
- Tipo de análisis: compra completa por proveedor, reposición de productos, producto nuevo, necesidad comercial o proyecto específico.
- Área solicitante, responsable, fecha requerida y observaciones.
- **Importación:** tipo de importación, regular o consolidada.
- **Compra local:** tipo fijo, "Compra local — Costa Rica".

#### Paso 2 — Proveedor y cotización
- **Importación regular:** proveedor internacional; al elegirlo se cargan automáticamente su Incoterm, contenedor habitual y tiempo de tránsito. Muestra la regla logística del proveedor (monto mínimo y objetivo, utilización mínima, vigencia de la cotización, punto de consolidación, marcas) y el resumen histórico (importaciones, combos, contenedor, utilización promedio, tránsito). Si el proveedor es nuevo, muestra una alerta.
- **Importación consolidada:** varios proveedores que comparten punto de consolidación (Miami). Permite buscarlos y agregarlos, cargar una proforma por proveedor y valida la compatibilidad entre ellos.
- **Compra local:** proveedor local (ciudad), moneda de facturación (CRC o USD), tiempo de entrega y condiciones: monto mínimo y objetivo, crédito, si la entrega en bodega está incluida, vigencia de la cotización y marcas. Muestra el historial de compras locales.
- **Cotización / proforma (en ambos modos):** zona de arrastrar y soltar. La extracción de costos es simulada y compara el último costo SAP con el costo cotizado (variación % y estado: Disminución, Estable, Incremento moderado o Incremento crítico). Los costos se pueden aplicar directamente al catálogo.

#### Paso 3 — Necesidad y optimización del pedido
- **Indicadores:** pedido base, monto mínimo (✓/✗), monto objetivo (✓/✗), y utilización (importación) o días de entrega (local).
- **Tabla editable del catálogo:** selección, SKU, descripción, cantidad, stock, reservado, disponible, consumo mensual, cobertura (semáforo), punto de reorden, costo SAP, costo cotizado (editable), variación % y necesidad (Crítico, Necesario u Opcional).
- **Botones:** Necesarios, Limpiar, Optimizar pedido y Buscar producto (modal que muestra solo productos de proveedores del mismo modo).
- **Productos candidatos:** se sugieren productos adicionales para alcanzar el monto objetivo, indicando cobertura antes y después, rotación y clasificación. También se listan los productos **no recomendados** por riesgo de sobre-stock.
- **Optimizar pedido:**
  1. Ajusta cantidades según la necesidad real (cobertura crítica, punto de reorden, órdenes en tránsito, sobre-stock).
  2. Agrega productos con necesidad hasta alcanzar el monto objetivo, validando la rotación.
  3. **Solo en importación:** llena el contenedor hasta ~100%. En compra local este paso no existe.
- Muestra la comparación y la justificación de cada cambio.
- Combos históricos como referencia (en importación).

#### Paso 4 — Costos
- **Importación:**
  - Flete internacional, seguro, operador logístico, agencia aduanal, aranceles, impuestos, tratado comercial y su descuento, transporte local, otros costos, tiempo de tránsito.
  - Los campos se adaptan al Incoterm: en CIF se desactivan flete y seguro; en EXW aparece una alerta.
  - En consolidada se agregan: transporte proveedor → punto de consolidación, recepción, handling, bodega, consolidación y documentación.
  - Métodos de distribución de costos: valor, peso, volumen o **híbrido** (40/30/30, configurable).
  - Utilización del contenedor: peso, volumen y efectiva, con semáforo (≥85% verde, ≥70% amarillo, <70% rojo).
- **Compra local:**
  - Transporte a bodega, carga/descarga, otros costos y descuento comercial; tiempo de entrega; método de distribución.
  - Aclara que no aplican flete internacional, seguro marítimo, agencia aduanal, aranceles ni tratados, y que el IVA es crédito fiscal (no se suma al costo).
  - Resumen de la entrega: peso, volumen y % de costos sobre la compra.

#### Paso 5 — Análisis y escenarios
- **Indicadores:** monto de compra, costos adicionales (o de compra local) y costo puesto en Costa Rica (o en bodega).
- **Tipo de cambio:**
  - Importación: tipo de cambio actual, proyectado a N días de tránsito (~0.8%/mes) y diferencia de costo.
  - Local: solo la equivalencia en colones (sin proyección, porque la entrega es corta).
- **Escenarios de precio:** A. mantener precio actual; B. mantener margen actual; C. margen objetivo.
- **Tabla por producto:** costo SAP, costo cotizado, costos distribuidos, costo proyectado, variación %, precio, margen actual, margen proyectado, precio sugerido, estado del margen y acción recomendada.
- Resumen de productos saludables, en riesgo y negativos.
- **Análisis inteligente:** frases explicativas generadas por reglas.
- **Recomendación final** (ver 4.12) con nivel de confianza y explicación.

#### Paso 6 — Decisión
- **Resumen:** total compra y costo puesto. En importación se muestran utilización y tránsito; en local, crédito del proveedor y entrega.
- **Acciones:** guardar borrador, aprobar, **aprobar y crear OC en SAP** (simulado), rechazar (con confirmación) y exportar.
- **Al aprobar y crear la OC:** se genera la simulación con estado "OC creada", la OC y el número SAP (4500XXXX). Se abre el detalle y **la vista PDF de la orden** con las líneas reales del pedido.
- Equivalencia en colones y aviso de "recomendación de apoyo".

### 4.4 Módulo de Compra Local
Es una variante del asistente para compras a proveedores de Costa Rica.

| Aspecto | Importación | Compra local |
|---|---|---|
| Proveedores | Internacionales (1–8) | Locales (9–11) |
| Incoterm / contenedor | Sí | No aplica (`N/A` / `Local`) |
| Costos | Flete, seguro, operador, agencia, aranceles, impuestos, tratado, consolidación | Transporte a bodega, carga/descarga, otros, descuento comercial |
| Optimización | Necesidad + monto objetivo + llenado de contenedor | Necesidad + monto objetivo |
| Tipo de cambio | Proyección durante el tránsito | Solo equivalencia en colones |
| Puntaje | Incluye utilización y consolidación | Excluye utilización; +5 si la entrega en ≤7 días cubre productos críticos |
| Detalle | Logística y seguimiento marítimo | Entrega local (sin puerto ni aduana) |
| OC / PDF | Incoterm | "Entrega: Bodega RENTECO, Costa Rica" |

**Campos propios del proveedor local:** `local`, `ciudad`, `comprasLocales`, `plazoCredito`, `entregaIncluida`.
**Campos propios de la simulación local:** `tipoCompra:'local'`, `incoterm:'N/A'`, `tipoCarga:'Local'`, `utilizacion:null`, `tiempoEntrega`.

### 4.5 Planificación de compra
- **Por proveedor:** proveedores internacionales recurrentes. Muestra indicadores, información comercial y el catálogo con la necesidad calculada. Permite seleccionar los productos sugeridos por IA, optimizar el pedido, ver los combos históricos, crear una simulación (proveedor completo, selección o combo) y generar una OC directa con su vista previa.
- **Por producto (forecast):** ventas de 24 meses (con un mes atípico), gráfico de los últimos 12 meses, pronóstico por promedio móvil ponderado (pesos 1,1,2,2,3,3), cobertura, compra sugerida, alertas de cobertura y concentración. Permite seleccionar varios productos para una simulación.
- **Consolidada:** proveedores consolidables por punto de consolidación (Miami), con montos, necesidad de reposición y vigencia de la cotización. Botón para crear una simulación consolidada.

### 4.6 Proveedores e historial
- Directorio de **11 proveedores**.
- **Columnas:** proveedor, **Origen (Local / Internacional)**, región, país o ciudad, tipo (recurrente o nuevo), moneda, Incoterm, contenedor, tiempo promedio, tratado, variación %, compras (importaciones o compras locales) y última compra.
- **Ficha (modal):** la de proveedor internacional muestra datos logísticos y comerciales; la de proveedor local muestra dirección, crédito, entrega y monto mínimo.
- **Acción:** crear una simulación, que abre el asistente en el modo que corresponde al proveedor.

### 4.7 Maestro de productos
- Catálogo general de todos los proveedores, con filtro por proveedor y búsqueda.
- **Columnas:** stock, reservado, disponible, consumo mensual, cobertura, punto de reorden, costo, precio, margen, vencimiento (stock por vencer) y estado (Crítico, Necesario u OK).

### 4.8 Detalle de simulación
- **Pestañas:** Resumen, Productos, Mix inteligente, Logística (o **Entrega** en compra local), Recomendación, Orden de compra (si existe), Seguimiento e Historial.
- **Orden de compra:** imprimir/PDF, enviar al proveedor (simulado) y crear en SAP (simulado).
- **Seguimiento:**
  - Importación: datos del embarque y línea de tránsito Proveedor → Puerto origen → En tránsito → Puerto intermedio → Costa Rica → Aduana → Bodega.
  - Local: entrega directa en bodega.
- **Historial:** 9 eventos, desde la solicitud hasta la orden en SAP.
- **Acciones:** aprobar, rechazar, generar OC y exportar.

### 4.9 Orden de compra (vista PDF)
- Documento formal con logo RENTECO, número de OC, fecha, número SAP, datos del proveedor, moneda, Incoterm o entrega local, fecha de entrega esperada, tabla de líneas (SKU, descripción, cantidad, costo unitario, total), total general, responsable y aprobador.
- **Las líneas salen del pedido simulado** (campo `lineas` de la simulación). Las simulaciones antiguas, que no tienen ese campo, usan el catálogo.
- Imprimir o guardar como PDF con `window.print()` (hay estilos de impresión).

### 4.10 Reglas y parámetros (solo Administrador)
- **Parámetros generales:** margen mínimo (25%), margen objetivo (35%), variación de costo que genera alerta (15%), utilización mínima (80%), concentración máxima por cliente (60%), tipo de cambio (₡530).
- **Parámetros v3.0:** cobertura objetivo (4 meses), cobertura máxima (9), umbral de sobre-stock (9), meses máximos de rotación (9), umbral de cotización por vencer (15 días).
- **Capacidades de contenedor:** 20' = 21,770 kg / 33.2 m³; 40' = 26,780 kg / 67.7 m³.
- **Distribución híbrida:** 40% valor, 30% peso, 30% volumen.
- **Reglas avanzadas** (6 precargadas): niveles General, Región, Proveedor, Producto e Incoterm. Se pueden crear, activar/desactivar, eliminar y filtrar por nivel.

### 4.11 Configuración, Usuarios, Consumo y Reportes
- **Configuración:** tipo de cambio USD/CRC con fecha, fuente (manual, referencia BCCR, tipo de cambio del proveedor) y notas; historial de hasta 20 registros con su variación %.
- **Usuarios:** 6 usuarios simulados con rol, estado, límite de simulaciones, simulaciones usadas, % de uso y último acceso. Se pueden crear, activar/desactivar, eliminar y editar el límite.
- **Control de consumo:** simulaciones mensuales (límite 500) y páginas procesadas por el extractor IA (límite 4,500), con semáforo, historial de 5 meses y límites configurables.
- **Reportes:** tendencia de precio, costo, margen y precio de mercado por producto, con varios proveedores y productos a la vez (gráfico SVG); detalle de precio/costo/margen; tabla histórica; simulaciones por estado; variación de costos por proveedor. La exportación a Excel/PDF es simulada.

### 4.12 Motor de recomendación (puntaje)

**Base: 50 puntos.**

| Factor | Impacto |
|---|---|
| Monto del pedido ≥ monto mínimo del proveedor | +10 |
| Monto del pedido ≥ monto objetivo | +10 |
| Utilización ≥ 85% *(solo importación)* | +15 |
| Cobertura posterior promedio ≤ 6 meses | +10 |
| Incluye productos en cobertura crítica | +10 |
| Entrega ≤ 7 días que cubre productos críticos *(solo local)* | +5 |
| Proyección comercial en >30% de los productos | +5 |
| Aumento promedio del costo ≤ 5% | +5 |
| Alta rotación (>30 u/3m) en >50% de los productos | +10 |
| Cotización vencida | −25 |
| Monto por debajo del mínimo | −15 |
| Algún producto en sobre-stock (> cobertura máxima) | −20 |
| Baja rotación (<10 u/3m) en >50% de los productos | −15 |
| Órdenes en tránsito cubren la necesidad en >30% de los productos | −10 |
| Concentración alta en >50% de los productos | −10 |
| Aumento promedio del costo > 20% | −15 |
| Algún producto con margen negativo | −15 |
| Proveedor no recurrente | −10 |
| Utilización < 70% *(solo importación)* | −15 |
| Consolidado: mismo punto de consolidación | +5 |
| Consolidado: proveedores incompatibles / sin excepción aprobada | −15 / −20 |

**Resultado:** ≥65 COMPRAR · ≥45 COMPRAR CON AJUSTES · ≥30 ESPERAR · <30 NO COMPRAR.
**Confianza:** proveedor no recurrente → Baja; puntaje ≥60 o <30 → Alta; resto → Media.
**Estado del margen:** ≥ objetivo Saludable; ≥ mínimo Bajo observación; ≥10% En riesgo; <10% Negativo. **Acción:** Negativo → Retirar; En riesgo → Ajustar precio.

**Validación de los ejemplos precargados:**

| Ejemplo | Puntaje | Resultado |
|---|---|---|
| Importación — COMPRAR | 70 | COMPRAR |
| Importación — CON AJUSTES | 50 | COMPRAR CON AJUSTES |
| Importación — NO COMPRAR | −20 | NO COMPRAR |
| Local — COMPRAR | 95 | COMPRAR |
| Local — CON AJUSTES | 60 | COMPRAR CON AJUSTES |
| Local — NO COMPRAR | −10 | NO COMPRAR |

### 4.13 Cálculo de necesidad de compra
- Stock disponible = stock total − reservado; stock efectivo = disponible + órdenes en tránsito.
- Cobertura = stock / consumo mensual (el consumo se separa en venta, instalación y proyecto).
- Si el stock efectivo está bajo el punto de reorden o la cobertura es menor que el objetivo, la cantidad sugerida es la necesaria para llegar a la cobertura objetivo.
- Se ajusta por proyección comercial (cuando supera el consumo histórico) y por stock por vencer (<90 días).
- **Urgencia:** crítica (<2 meses o por vencer), necesaria (< objetivo) u opcional.
- **Rotación proyectada:** clasificación Excelente (≤3m), Aceptable (≤6m), Riesgo moderado (≤9m) o Sobre-stock.

### 4.14 Roles (selector, sin autenticación)
| Rol | Usuario demo | Acceso |
|---|---|---|
| Gerencia Comercial | Carlos Méndez | Todas las vistas excepto Reglas |
| Importaciones / Compras | Ana Solano | Todas las vistas excepto Reglas |
| Aprobador / Dirección | Roberto Fallas | Todas las vistas excepto Reglas |
| Administrador | Administrador | Todas, incluida Reglas |

---

## 5. DATOS DE DEMOSTRACIÓN

### Proveedores (11)
| ID | Proveedor | Origen | País / ciudad | Recurrente | Moneda | Modo | Mín. / Obj. |
|---|---|---|---|---|---|---|---|
| 1 | Proveedor 1 | Internacional | España | Sí | EUR | CIF · 40' | $35k / $45k |
| 2 | Proveedor 2 | Internacional | Suiza | Sí | EUR | FOB · 40' | $30k / $42k |
| 3 | Proveedor 3 | Internacional | EEUU | Sí | USD | FCA · Consolidado Miami | $8k / $15k |
| 4 | Proveedor 4 | Internacional | China | Sí | USD | FOB · 40' | $25k / $40k |
| 5 | Proveedor 5 | Internacional | Colombia | No | USD | CIF · 20' | $12k / $20k |
| 6 | Proveedor 6 | Internacional | Alemania | No | EUR | EXW · 40' | $40k / $55k |
| 7 | Proveedor 7 | Internacional | EEUU | Sí | USD | FCA · Consolidado Miami | $6k / $12k |
| 8 | Proveedor 8 | Internacional | EEUU | Sí | USD | FCA · Consolidado Miami | $5k / $10k |
| 9 | Proveedor Local 1 | Local | San José | Sí | CRC | Entrega 3d · crédito 30d · entrega incluida | $1.5k / $4k |
| 10 | Proveedor Local 2 | Local | Heredia | Sí | USD | Entrega 5d · crédito 45d | $3k / $8k |
| 11 | Proveedor Local 3 | Local | Cartago | No | CRC | Entrega 7d · contado · entrega incluida | $1k / $3k |

### Catálogos
- Catálogos propios: proveedores 1, 3 (8 productos cada uno), 7 (4) y 8 (3).
- Catálogos derivados: 2 (del 1, +5% costo), 4 (del 1, −30% costo), 5 (del 3, +30%), 6 (del 1, +15%).
- Catálogos locales derivados: 9 (del 3, +12%), 10 (del 1, +15%), 11 (del 7, +25%).

### Otros datos
- **Simulaciones:** 17 (SIM-2026-001 a 015 de importación; 016 y 017 de compra local).
- **Órdenes de compra:** 3. **Registros de tránsito:** 3. **Cotizaciones abiertas:** 6 (vigentes, vencida y en evaluación).
- **Combos históricos:** proveedores 1, 2, 3 y 4. **Usuarios:** 6. **Consumo:** mes actual más 5 meses de historial.

---

## 6. CARACTERÍSTICAS DE UX/UI
- Sidebar oscuro colapsable, encabezado fijo con buscador, selector de rol, notificaciones y usuario, y pie con el aviso de datos simulados.
- Paleta: azul petróleo `#1a5276`, azul claro `#2980b9`, naranja `#e67e22`, grises.
- Notificaciones tipo toast, modales de confirmación, badges de estado, semáforos, barras de progreso y tooltips.
- Asistente con indicador de progreso; los títulos de los pasos cambian según el modo.
- Iconografía del origen de los datos: SAP, cálculo e IA.
- Diseño responsive y estilos de impresión para la OC.

---

## 7. INTEGRACIÓN REQUERIDA EN PRODUCCIÓN

| Sistema | Tipo | Datos | Frecuencia |
|---|---|---|---|
| SAP Business One | Service Layer / DI API | Maestro de artículos y proveedores (locales e internacionales), stock por bodega y reservas, consumo, órdenes en tránsito, último costo de compra, precios, OC | Tiempo real / batch diario |
| Extractor IA de documentos | OCR + LLM (AWS Textract / Azure AI) | Proformas y cotizaciones (PDF, Excel, imagen) → JSON | Por documento |

El tipo de cambio se administra manualmente desde Configuración.

---

## 8. REQUERIMIENTOS PARA PASO A PRODUCCIÓN

### Infraestructura (AWS como base)
- Servidor de aplicación con API REST (Node.js, .NET o Java).
- Base de datos relacional (PostgreSQL o SQL Server).
- Certificado SSL; ambientes de staging y producción.
- Conectividad segura con SAP (VPN o red privada).

### Desarrollo
- Backend con API REST y modelo de datos relacional que incluya `tipoCompra` (importación/local) y líneas de OC.
- Autenticación y autorización reales (usuarios, contraseñas, JWT, RBAC).
- Integración con SAP B1 para lectura de datos y creación de OC.
- Parser de proformas y cotizaciones (OCR para PDF/imagen, parser para Excel).
- Generación real de PDF de OC en servidor y envío por correo.
- Logs de auditoría; migración de `localStorage` a base de datos.
- Validaciones en servidor, manejo de errores, pruebas unitarias y de integración.

### Seguridad
- Hash de contraseñas, RBAC, protección CSRF/XSS, rate limiting y auditoría inmutable.

---

## 9. EXCLUSIONES DEL ALCANCE
- App móvil nativa.
- Machine learning real: el motor usa reglas determinísticas configurables.
- Integración con navieras y operadores logísticos (el seguimiento es manual).
- Integración con transportistas locales (la entrega local se registra manualmente).
- Servicio de correo transaccional, integración con SSO / Directorio Activo, API de tipo de cambio del BCCR.
- Migración de datos históricos de otros sistemas, capacitación y soporte post-implementación.
- Personalización de SAP Business One, hardware de usuario final.
- Exportación real a Excel (actualmente simulada), multi-idioma.
- Multi-moneda simultánea: los cálculos son en USD con equivalencia en CRC, incluso para proveedores locales que facturan en colones.

---

## 10. SUPUESTOS
- RENTECO tiene SAP Business One operativo con Service Layer habilitado.
- Los proveedores locales están registrados en SAP con su moneda, crédito y condiciones de entrega.
- Para efectos de costo, el IVA de las compras locales se trata como crédito fiscal.
- El tipo de cambio se actualiza manualmente por un usuario autorizado.
- El seguimiento logístico y la confirmación de entrega local se registran manualmente.
- El envío de la OC al proveedor se hace por correo del usuario.
- Los datos del prototipo representan la estructura real de la información de RENTECO.

---

## 11. MÉTRICAS DEL PROTOTIPO

| Métrica | Valor |
|---|---|
| Archivos | 3 (`index.html`, `styles.css`, `app.js`) |
| Líneas de `app.js` | ~2,230 |
| Vistas | 12 en el menú + detalle |
| Modos del asistente | Importación regular, importación consolidada, compra local |
| Proveedores | 11 (8 internacionales, 3 locales) |
| Productos | ~70 en 11 catálogos |
| Simulaciones demo | 17 (15 de importación, 2 locales) |
| Reglas | 6 avanzadas + 16 parámetros |
| Órdenes de compra / tránsitos / cotizaciones | 3 / 3 / 6 |
| Roles / usuarios demo | 4 / 6 |

---

## 12. RIESGOS IDENTIFICADOS

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Complejidad de la integración con SAP | Alto | Validar Service Layer con el equipo SAP antes del desarrollo |
| Calidad de la extracción de proformas | Medio | Validación humana de lo extraído; servicios cloud de OCR |
| Cotizaciones abiertas que generan ruido en la proyección | Medio | Control de vigencia y semáforo; penalización por cotización vencida |
| Diferencias de moneda en compras locales en CRC | Medio | Tipo de cambio controlado; evaluar multi-moneda en producción |
| Volumen de datos real vs. demo | Medio | Pruebas de carga con datos representativos |
| Adopción de usuarios | Medio | Capacitación y UAT con usuarios clave |
| Tipo de cambio manual | Bajo | Proceso operativo definido y alertas de actualización |

---

*Documento actualizado — Octubre 2026 (v3.1: módulo de Compra Local, vista PDF de la OC al aprobar, origen de proveedores).*
