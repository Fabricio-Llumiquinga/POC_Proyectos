# PROMPT DE REPLICACIÓN — Torre Inteligente de Importaciones y Rentabilidad (RENTECO) v3.1

> Copie y pegue este prompt completo en una IA generativa de código para reproducir la solución de punta a punta, incluido el módulo de **Compra Local**.

---

## INSTRUCCIÓN PRINCIPAL

Construye un prototipo web funcional, empresarial y responsive para RENTECO llamado **"Torre Inteligente de Importaciones y Rentabilidad"**.

La aplicación simula el análisis previo a una compra con datos ficticios equivalentes a SAP Business One (stock, reservas, consumo, costos, precios) y a cotizaciones de proveedor. Cubre dos tipos de compra:

1. **Importación** (regular o consolidada) desde proveedores internacionales.
2. **Compra local** en Costa Rica desde proveedores locales.

Ambos tipos usan **el mismo asistente de simulación**: calcula necesidad de compra, optimiza el pedido, estima el costo puesto, evalúa la rentabilidad por producto, simula precios y da una recomendación explicable (**COMPRAR / COMPRAR CON AJUSTES / ESPERAR / NO COMPRAR**). La compra local simplemente omite los datos de importación.

**Principio:** la herramienta asiste al especialista y no lo reemplaza. Mostrar siempre "Recomendación de apoyo. La decisión final corresponde al especialista".

---

## CONDICIONES TÉCNICAS

- Solo HTML5, CSS3 y JavaScript vanilla. Sin frameworks ni backend.
- 3 archivos: `index.html`, `styles.css`, `app.js`.
- Font Awesome 6.5.1 por CDN. Gráficos con barras CSS y líneas SVG generadas en JS.
- Persistencia en `localStorage` (claves `renteco_sims2`, `renteco_rules2`, `renteco_advrules`, `renteco_transit`, `renteco_po`, `renteco_cotizaciones`, `renteco_usuarios`, `renteco_consumo`, `renteco_tc_historial`).
- Debe funcionar al abrir `index.html`. Idioma español. Moneda base USD con equivalencia en CRC (tipo de cambio editable, por defecto ₡530).
- Estilo: azul petróleo `#1a5276`, azul claro `#2980b9`, naranja `#e67e22`, grises y blanco.
- Proveedores y productos anonimizados: "Proveedor N", "Proveedor Local N", "Producto N".

---

## ARQUITECTURA SPA

- Sidebar oscuro colapsable con logo "RENTECO", menú y pie "Datos simulados · Prototipo v2.0".
- Encabezado fijo: buscador, selector de rol, campana de notificaciones y nombre de usuario (cambia con el rol).
- Pie: "⚠️ Prototipo con datos simulados — Sin conexión a SAP ni IA real".
- Contenedores globales para toasts, modal (overlay) y overlay de impresión (OC).
- Estado global `APP` con `currentView`, `currentRole`, `simulaciones`, `rules`, `advancedRules`, `wizardStep`, `wizardData`, `currentSimDetail`, `transitRecords`, `purchaseOrders`, `cotizaciones`, `usuarios` y `consumo`.
- `navigateTo(view)` marca el menú activo y llama `renderView(view)`, que pinta el HTML en `#content`.

### Menú lateral (en este orden)
1. Resumen ejecutivo (`resumen`)
2. Simulaciones (`simulaciones`)
3. **Nueva simulación importación** (`nueva-simulacion`)
4. **Nueva simulación compra local** (`compra-local`)
5. Planificación de compra (`planificacion`)
6. Proveedores e historial (`proveedores`)
7. Maestro de productos (`productos`)
8. Reglas y parámetros (`reglas`, visible solo para el rol Administrador)
9. Configuración (`configuracion`)
10. Usuarios (`usuarios`)
11. Control de consumo (`consumo`)
12. Reportes (`reportes`)

Además existe la vista `detalle-simulacion`, que se abre desde una simulación.

### Roles (selector, sin autenticación)
| Rol | Usuario | Acceso |
|---|---|---|
| comercial | Carlos Méndez | Todo excepto Reglas |
| importaciones | Ana Solano | Todo excepto Reglas |
| aprobador | Roberto Fallas | Todo excepto Reglas |
| admin | Administrador | Todo |

---

## DATOS DE EJEMPLO (objetos JS)

### Reglas por defecto (`DEFAULT_RULES`)
margenMinimo 25, margenObjetivo 35, variacionCostoAlerta 15, utilizacionMinima 80, maxConcentracionCliente 60, tipoCambio 530, capacidad20Peso 21770, capacidad20Volumen 33.2, capacidad40Peso 26780, capacidad40Volumen 67.7, coberturaObjetivo 4, coberturaMaxima 9, umbralSobreStock 9, mesesMaxRotacion 9, umbralCotizacionVencer 15, distribucionHibrida {valor 0.4, peso 0.3, volumen 0.3}, clasificacionRotacion {excelente 3, aceptable 6, riesgoModerado 9}.

### Proveedores (`PROVEEDORES`, 11)
**Campos comunes:** id, nombre, region, pais, recurrente, moneda, incoterm, tipoContenedor, tiempoEntrega, tratado, variacionReciente, ultimaCompra, importaciones, frecuenciaCompra, utilizacionProm, email, direccion, defaultImportMode, usualContainer, allowsConsolidation, consolidationPoint, minimumOrderValue, targetOrderValue, usualIncoterm, quoteValidityDays, averageTransitDays, brands, utilizacionMinRec.

| ID | Nombre | País | Recurr. | Moneda | Incoterm | Contenedor | Tránsito | Var.% | Mín/Obj USD | Consolida |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Proveedor 1 | España (Europa) | Sí | EUR | CIF | 40 pies | 35 | 8.2 | 35k/45k | No |
| 2 | Proveedor 2 | Suiza (Europa) | Sí | EUR | FOB | 40 pies | 40 | 5.1 | 30k/42k | No |
| 3 | Proveedor 3 | EEUU | Sí | USD | FCA | Consolidado | 18 | 12.5 | 8k/15k | Miami |
| 4 | Proveedor 4 | China (Asia) | Sí | USD | FOB | 40 pies | 45 | 18.3 | 25k/40k | No |
| 5 | Proveedor 5 | Colombia (Sudamérica) | No | USD | CIF | 20 pies | 12 | 22.0 | 12k/20k | Miami |
| 6 | Proveedor 6 | Alemania (Europa) | No | EUR | EXW | 40 pies | 38 | 0 | 40k/55k | No |
| 7 | Proveedor 7 | EEUU | Sí | USD | FCA | Consolidado | 20 | 6.8 | 6k/12k | Miami |
| 8 | Proveedor 8 | EEUU | Sí | USD | FCA | Consolidado | 16 | 4.2 | 5k/10k | Miami |

**Proveedores locales** (`local:true`, region/pais 'Costa Rica', incoterm 'N/A', tipoContenedor y usualContainer 'No aplica', defaultImportMode 'compra_local', allowsConsolidation false, importaciones 0). Campos adicionales: `ciudad`, `comprasLocales`, `plazoCredito`, `entregaIncluida`.

| ID | Nombre | Ciudad | Recurr. | Moneda | Entrega | Var.% | Compras | Mín/Obj | Crédito | Entrega incl. |
|---|---|---|---|---|---|---|---|---|---|---|
| 9 | Proveedor Local 1 | San José | Sí | CRC | 3d | 3.5 | 22 | 1.5k/4k | 30d | Sí |
| 10 | Proveedor Local 2 | Heredia | Sí | USD | 5d | 6.0 | 9 | 3k/8k | 45d | No |
| 11 | Proveedor Local 3 | Cartago | No | CRC | 7d | 0 | 0 | 1k/3k | Contado | Sí |

### Catálogos (`SUPPLIER_CATALOGS[provId]`)
**Campos de cada producto:** sku, descripcion, categoria, costoActual, precioVenta, pesoUnitario, volumenUnitario, stockTotal, stockReservado, stockActual, ordenesTransito, ventas3m, ventas6m, ventas12m, cobertura, frecuenciaCompra, cantidadPromedio, ultimaCompra, clientePrincipal, concentracion, consumoVenta, consumoInstalacion, consumoProyecto, consumoMensual, consumoTrimestral, consumoSemestral, consumoAnual, puntoReorden, inventarioMinimo, proyeccionComercial {qty, period, source, notes}, fechaVencimiento, stockPorVencer.

- **Proveedor 1:** 8 productos (P1-001…008). Categorías: impermeabilización, membranas, accesorios, drenaje. Costos de 4.5 a 320. Varios en cobertura crítica (<2 meses) y algunos con concentración >60%.
- **Proveedor 3:** 8 productos (P3-001…008). Categorías: impermeabilización, selladores, geotextiles, adhesivos, fijaciones, imprimantes, cintas, drenaje. Algunos con órdenes en tránsito.
- **Proveedor 7:** 4 productos. **Proveedor 8:** 3 productos.
- **Derivados:**
  - 2 = catálogo 1 con costo ×1.05 y precio ×1.08.
  - 4 = primeros 6 del catálogo 1 con costo ×0.7, precio ×0.9 y concentración +10.
  - 5 = primeros 4 del catálogo 3 con costo ×1.3 y concentración 70.
  - 6 = primeros 5 del catálogo 1 con costo ×1.15.
- **Locales** (cantidadPromedio reducida, porque las compras locales son más pequeñas):
  - 9 = catálogo 3 con costo ×1.12 (L1-00x).
  - 10 = primeros 5 del catálogo 1 con costo ×1.15 (L2-00x).
  - 11 = catálogo 7 con costo ×1.25 y concentración 68 (L3-00x).

### Otros datos
- **HISTORICAL_COMBOS** para los proveedores 1, 2, 3 y 4: nombre, veces usado, contenedor, utilización, productos y cantidades.
- **TRANSIT_RECORDS (3):** naviera, operador, puertos, días restantes, estado aduanero y milestones.
- **PURCHASE_ORDERS (3).**
- **DEFAULT_ADVANCED_RULES (6):** contenedor completo para Europa; cobertura mínima de 3 meses; CIF sin flete ni seguro; alerta por utilización baja; reducir baja rotación; Proveedor 1 siempre en contenedor completo.
- **DEFAULT_SIMULACIONES (17):**
  - 001–015 de importación, con variedad de estados, regiones y recomendaciones.
  - 011–015 son casos v3.0: optimización, consolidado de 3 proveedores en Miami, sobre-stock, cotización vencida y pedido especial.
  - 016 (Proveedor Local 1, COMPRAR, aprobado) y 017 (Proveedor Local 2, CON AJUSTES, borrador) son de compra local: `tipoCompra:'local'`, `incoterm:'N/A'`, `tipoCarga:'Local'`, `utilizacion:null`, `tiempoEntrega`.
- **DEFAULT_COTIZACIONES (6):** vigentes, una vencida (Proveedor 2) y una en evaluación, cada una con items {sku, costoNuevo}.
- **DEFAULT_USUARIOS (6):** con maxSimulaciones, simulacionesUsadas y último acceso.
- **DEFAULT_CONSUMO:** simulaciones (límite 500) y extractorIA (límite 4500), con 5 meses de historial.
- **VENTAS_MENSUALES:** 24 meses por producto con semillas `[12,8,15,10,13,9,11,14,32,10,12,11,9,13,11,10,14,12,8,11,13,10,12,9]`. El mes 9 es atípico.
- **ESTADOS_MAP:** borrador → Borrador, aprobado → Aprobada, rechazado → Rechazada, oc_generada → OC creada. Además se usan dinámicamente sap, enviada, transito y recibida.

---

## MOTORES DE CÁLCULO

### `calculatePurchaseNeed(product, rules)`
- Stock disponible = stockTotal − stockReservado; stock efectivo = disponible + ordenesTransito.
- Consumo mensual = consumoMensual (o ventas3m/3).
- Cobertura actual = disponible / consumo; cobertura efectiva = efectivo / consumo.
- Punto de reorden = puntoReorden (o consumo × 2).
- Si stock efectivo < punto de reorden o cobertura efectiva < coberturaObjetivo, la cantidad base es `ceil(coberturaObjetivo × consumo − stockEfectivo)`.
- Ajuste comercial: si la proyección comercial mensual supera el consumo, se suma `ceil((proy − consumo) × coberturaObjetivo)`.
- Vencimiento: si hay stock por vencer en menos de 90 días, se recalcula sin ese stock y la urgencia es crítica.
- Devuelve: finalSuggestedQty, reason, needsPurchase y urgency (crítica <2 meses o por vencer; necesaria < objetivo; opcional).

### `calculateProjectedRotation(product, qty, rules)`
- Cobertura antes y después, meses de rotación adicional y fecha de normalización.
- Clasificación: Excelente ≤3, Aceptable ≤6, Riesgo moderado ≤9, Sobre-stock.
- `esSobreStock` = cobertura posterior > coberturaMaxima.

### `optimizeOrder(selected, all, supplier, rules, containerType)`
- Pedido base, faltante para mínimo y objetivo, utilización por peso y volumen.
- Candidatos: productos no seleccionados con su cantidad sugerida, separados en recomendados (caben en el contenedor y no generan sobre-stock) y no recomendados (sobre-stock).
- Motivo del candidato: crítico / bajo reorden / alcanza monto objetivo / mejora utilización / proyección comercial.
- Si `containerType==='Local'`, `getCaps` devuelve capacidad infinita y nunca se usa el motivo "mejora utilización".

### `calculateQuoteStatus` y `compareCosts`
- **Cotización:** días restantes con semáforo gris (vencida), rojo (<5 días), amarillo (≤ umbral) o verde.
- **Comparación de costos:** variación % con estado Disminución (<−2%), Estable (≤2%), Incremento moderado (≤ umbral) o Incremento crítico.

### `generatePriceHistory(product)`
4 registros determinísticos (semilla por SKU) con fecha, costo, precio, markup, margen, precio de mercado, acción y usuario. Se usa en Reportes.

---

## VISTA: RESUMEN EJECUTIVO
- Gráfico CSS de simulaciones por estado y de variación de costos por origen (Europa 6.5%, Asia 18.3%, EEUU 12.5%, Sudamérica 22%).
- Tabla de las últimas 6 simulaciones: código (con etiqueta **Local** si aplica), proveedor, país, Incoterm, monto, productos, utilización (semáforo, o "—" si es null), recomendación, estado, llegada y responsable.
- Botón "Restaurar datos de demostración".

## VISTA: SIMULACIONES
- Título "Simulaciones de Compra" y botones **"Nueva simulación importación"** y **"Nueva simulación compra local"**.
- **Filtros:** búsqueda, tipo de compra (Importación / Compra local), proveedor, estado y región (incluye Costa Rica).
- **Columnas:** código, fecha, proveedor, tipo, región, Incoterm, carga, productos, total, costo puesto, utilización, recomendación, estado, llegada y acciones (ver, editar borrador, duplicar, eliminar borrador con confirmación).

---

## ASISTENTE DE SIMULACIÓN (6 pasos, dos modos)

`initWizard(modo)`:
- **Importación:** `tipoCompra:'importacion'`, tipoImportacion 'regular', proveedor 1, CIF, 40 pies, costos de importación por defecto.
- **Local (`initWizard('local')`):** `tipoCompra:'local'`, primer proveedor local, incoterm 'N/A', tipoCarga 'Local', costos `transporteLocal`, `cargaDescarga`, `otrosCostos`, `descuentoComercial`, tiempoTransito 3.

**Cambio de modo:** `navigateTo('compra-local')` reinicia el asistente en modo local si no lo estaba, y `navigateTo('nueva-simulacion')` lo reinicia en importación si estaba en local. `renderView` dibuja el mismo asistente para ambas vistas y el modo se lee de `wizardData.tipoCompra`. Así, los re-render internos no pierden el modo. Usar helpers `isLocalWiz()`, `isLocalSim(s)`, `localBadge(s)` y `utilCell(u)`.

**Encabezado:**
- Título "Nueva Simulación Importación" o "Nueva Simulación Compra Local".
- En modo local, un banner que explica que se omiten Incoterm, contenedor, flete internacional, aranceles, tratados y aduana.
- Barra de ejemplos COMPRAR / NO COMPRAR / CON AJUSTES (en local llaman a los presets `local-*`).
- Pasos: importación = Origen, Proveedor, Catálogo y Mix, Logística, Análisis, Decisión; local = Origen, Proveedor local, Catálogo, Costos de compra, Análisis, Decisión.

### Paso 1 — Origen
- Tipo de análisis, área, responsable, fecha requerida y observaciones.
- Importación: selector Regular / Consolidada. Local: campo fijo "Compra local — Costa Rica".

### Paso 2 — Proveedor
- **Importación regular:**
  - Selector solo con proveedores no locales. Al elegirlo se cargan su incoterm, contenedor y tránsito.
  - Tarjeta "Regla logística del proveedor" y resumen histórico (importaciones, combos, contenedor, utilización, tránsito). Si es proveedor nuevo, alerta de confianza baja.
- **Importación consolidada:** lista de proveedores con `allowsConsolidation` en el mismo punto (Miami), modal para buscar y agregar proveedores (excluye locales), proforma por proveedor y alerta de incompatibilidad.
- **Compra local:**
  - Selector de proveedores locales (nombre — ciudad), moneda de facturación y tiempo de entrega.
  - Tarjeta de condiciones: mínimo, objetivo, crédito, entrega en bodega, vigencia y marcas. Si factura en CRC, nota de que los montos se muestran en USD al tipo de cambio del sistema.
  - Historial de compras locales (compras, entrega promedio, variación, crédito). Si es proveedor nuevo, alerta.
- **Bloque de cotización** (función compartida `renderProformaBlock`): zona de arrastrar y soltar con extracción simulada (costo = costoActual × (1 + variación × aleatorio 0.6–1.4)), tabla de costo SAP vs. cotizado con variación y estado, y botones "Aplicar costos al catálogo" y "Quitar".

### Paso 3 — Necesidad y optimización
- Al entrar, se carga el catálogo del proveedor con `selected = needsPurchase`, cantidad sugerida y costo cotizado = costo × (1 + variación).
- **Indicadores:** pedido base, mínimo ✓/✗, objetivo ✓/✗, y utilización (importación) o entrega local en días.
- Alertas por faltante para el objetivo o por pedido bajo el mínimo.
- Combos históricos (importación).
- Tabla editable (ver campos en el alcance) y candidatos recomendados y no recomendados.
- Botones: Necesarios, Limpiar, Optimizar pedido y Buscar producto (el modal filtra por el modo: locales o internacionales).
- **`generateMix()`:**
  1. Ajusta cantidades por necesidad, tránsito y sobre-stock.
  2. Agrega productos con necesidad hasta alcanzar el monto objetivo, sin sobre-stock.
  3. **Solo en importación:** llena el contenedor hasta ~100%, agregando productos de mayor rotación y subiendo cantidades.

  Muestra la comparación (en local, monto del pedido en lugar de utilización) y una tabla de justificaciones.

### Paso 4 — Costos
- **Importación:**
  - Flete internacional y seguro (desactivados con CIF), operador, agencia aduanal, aranceles, impuestos, tratado sí/no con descuento, transporte local, otros costos y tránsito.
  - Método de distribución: valor, peso, volumen o híbrido.
  - En consolidada se agregan: transporte al punto de consolidación, recepción, handling, bodega, consolidación y documentación.
  - Utilización del contenedor: peso, volumen y efectiva, con barras y semáforo, y alerta si es <70%.
- **Local (`renderWS4Local`):**
  - Aviso de que no aplican flete internacional, seguro marítimo, agencia, aranceles ni tratados, y de que el IVA (13%) es crédito fiscal.
  - Si el proveedor incluye la entrega, aviso de que solo se registren entregas adicionales.
  - Campos: transporte a bodega, carga/descarga, otros costos, descuento comercial, tiempo de entrega y método de distribución (valor, peso o volumen).
  - Resumen: peso, volumen y % de costos sobre la compra.

### Paso 5 — Análisis (`calcAnalysis`)
- Monto de compra = Σ cantidad × costo cotizado.
- **Costos adicionales:**
  - Importación: flete + seguro + operador + agencia + aranceles + impuestos + transporte local + otros − descuento por tratado + costos de consolidación.
  - Local: transporte a bodega + carga/descarga + otros − descuento comercial.
- Distribución por producto según el método; costo proyectado = cotizado + costo distribuido / cantidad; aumento % contra el costo SAP.
- Margen actual = (precio − costo SAP) / precio.
- **Escenarios:**
  - A: precio actual; margen proyectado = (precio − costo proyectado) / precio.
  - B: precio = costo proyectado / (1 − margen actual).
  - C: precio = costo proyectado / (1 − margen objetivo).
- **Estado del margen:** ≥ objetivo Saludable; ≥ mínimo Bajo observación; ≥10% En riesgo; si no, Negativo. **Acción:** Negativo → Retirar; En riesgo → Ajustar precio; resto → Mantener.
- **Indicadores:** monto, costos ("Costos de compra local" en modo local) y "Costo puesto en CR" o "Costo puesto en bodega".
- **Tipo de cambio:** en importación, el actual, el proyectado (+0.8% por mes de tránsito) y la diferencia. En local, solo la equivalencia en colones, sin proyección.
- **`genInsights`:**
  - Caída del margen promedio y concentración alta.
  - Importación: contenedor bajo la utilización mínima y tratado aplicable.
  - Local: entrega en N días que cubre productos críticos, y costos de compra >5% del monto.
  - Proveedor nuevo, combo histórico aplicado y márgenes negativos.
- **Tarjeta de recomendación:** texto, confianza y narrativa. En la narrativa local: "Compra local con entrega en N días, sin costos de importación".

### Paso 6 — Decisión
- **Indicadores:** importación = total, costo CR, utilización y tránsito; local = total, costo en bodega, crédito del proveedor y entrega local.
- Botones (todos los roles): Guardar borrador, Aprobar, **Aprobar y crear OC en SAP**, Rechazar (modal) y Exportar.
- `buildSimRecord(d, id, estado, sapOrder)` arma el registro de la simulación:
  - id, fecha, motivo, proveedor, tipoProveedor, país, región.
  - incoterm ('N/A' si es local), tipoCarga ('Local' si es local), numProductos, totalCompra, costoCR, utilizacion (null si es local), recomendación, estado, responsable, sapOrder, tipoImportacion, tipoCompra y tiempoEntrega.
  - **`lineas`**: [{sku, descripcion, cantidad, costo}] de los productos seleccionados.
- **Aprobar y crear OC en SAP:**
  - Crea la simulación con estado `oc_generada`, un número SAP `4500XXXX` y la OC (`OC-2026-NNN`, estado `sap`).
  - Luego **abre el detalle de la simulación y la vista PDF de la OC** (`viewSimDetail(id)` y `printPO(id)`).
- Pie: equivalencia en colones y "La decisión final corresponde al especialista de Importaciones/Compras" (según el modo).

### Presets (resultados esperados)
| Preset | Datos clave | Puntaje | Resultado |
|---|---|---|---|
| `comprar` | Proveedor 1, CIF, 40', catálogo 1 completo, cantidadPromedio, costo ×0.97 | ~70 | COMPRAR |
| `ajustes` | Proveedor 1, CIF, 40', cantidad ×0.8, costo ×1.10 | ~50 | CON AJUSTES |
| `no-comprar` | Proveedor 5 (nuevo), 20', cantidad 5, costo ×1.6, concentración 72, ventas3m 3, costos logísticos altos | ~−20 | NO COMPRAR |
| `local-comprar` | Proveedor Local 1, catálogo 9 completo, costo ×0.98, carga 60, descuento 40, entrega 3d | ~95 | COMPRAR |
| `local-ajustes` | Proveedor Local 2, cantidad = cantidadPromedio/4, costo ×1.22, transporte 180, carga 60, otros 40, entrega 8d | ~60 | CON AJUSTES |
| `local-no-comprar` | Proveedor Local 3 (nuevo), cantidad 80, costo ×1.35, stock 200, consumo 1/mes, concentración 72, transporte 250, carga 120, otros 150 | ~−10 | NO COMPRAR |

Todos los presets saltan al paso 5. Si los puntajes no coinciden, ajusta cantidades y costos hasta lograr el resultado.

---

## MOTOR DE RECOMENDACIÓN (`genRecommendation`)

Base 50. Con `local = d.tipoCompra==='local'`:
- **Positivos:**
  - +10 si el monto ≥ mínimo; +10 si el monto ≥ objetivo.
  - +15 si la utilización es ≥85% (**solo importación**).
  - +10 si la cobertura posterior promedio es ≤6 meses.
  - +10 si hay productos críticos; **+5 si es local, hay críticos y la entrega es en ≤7 días**.
  - +5 si hay proyección comercial en >30% de los productos.
  - +5 si el aumento promedio del costo es ≤5%.
  - +10 si hay alta rotación (>30 u/3m) en >50% de los productos.
- **Negativos:**
  - −25 si la cotización del proveedor está vencida.
  - −15 si el monto está bajo el mínimo.
  - −20 si hay sobre-stock.
  - −15 si hay baja rotación (<10 u/3m) en >50% de los productos.
  - −10 si el tránsito cubre la necesidad en >30% de los productos.
  - −10 si hay concentración alta en >50% de los productos.
  - −15 si el aumento promedio del costo es >20%.
  - −15 si algún producto tiene margen negativo.
  - −10 si el proveedor no es recurrente.
  - −15 si la utilización es <70% (**solo importación**).
- **Consolidado:** +5 si todos comparten punto de consolidación; −15 si hay incompatibles; −20 si no hay excepción aprobada.
- **Resultado:** ≥65 COMPRAR · ≥45 COMPRAR CON AJUSTES · ≥30 ESPERAR · <30 NO COMPRAR.
- **Confianza:** proveedor no recurrente → Baja; ≥60 o <30 → Alta; resto → Media.

---

## VISTA: PLANIFICACIÓN DE COMPRA (3 pestañas)
- **Por proveedor:**
  - Selector de proveedores internacionales recurrentes (excluye locales).
  - Indicadores, información comercial y catálogo con la necesidad; selección individual y global, y "Seleccionar sugeridos por IA".
  - Optimizar pedido, combos históricos con "crear simulación desde combo", crear simulación (completa o por selección) y generar una OC directa con vista previa.
- **Por producto (forecast):**
  - Etiqueta "Módulo de apoyo".
  - Selector de producto, gráfico de los últimos 12 meses y pronóstico por promedio móvil ponderado (1,1,2,2,3,3).
  - Cobertura, compra sugerida = pronóstico × 4 − stock, alertas, y selección múltiple para crear una simulación.
- **Consolidada:** proveedores con `allowsConsolidation && recurrente` por punto, con montos, necesidad y vigencia de la cotización. "Crear simulación consolidada" abre el asistente en el paso 2 con 3 proveedores de Miami.

## VISTA: PROVEEDORES E HISTORIAL
- **Columnas:** Proveedor, **Origen** (badge verde "Local" con ícono de tienda o azul "Internacional" con ícono de globo), Región, País (ciudad si es local), Tipo, Moneda, Incoterm ("—" si es local), Contenedor ("—"), Tiempo prom., Tratado ("—"), Var.%, Compras (`comprasLocales` o `importaciones`), Última compra y acciones.
- **Ficha (modal):** la del proveedor local muestra dirección, moneda, crédito, entrega, compras, monto mínimo y catálogo, con botón "Nueva compra local". La del internacional muestra datos logísticos.
- `startSimFromProv(id)` abre el asistente en modo local o importación según el proveedor.

## VISTA: MAESTRO DE PRODUCTOS
Todos los catálogos, con filtro por proveedor y búsqueda. Columnas: stock, reservado, disponible, consumo mensual, cobertura, punto de reorden, costo, precio, margen, vencimiento y estado (Crítico, Necesario u OK).

## VISTA: DETALLE DE SIMULACIÓN
- Encabezado con el código, el estado y la etiqueta Local.
- **Pestañas:** Resumen, Productos, Mix inteligente, Logística (**"Entrega"** si es local), Recomendación, Orden de compra (si existe), Seguimiento e Historial.
- **Resumen local:** costo en bodega, días de entrega y tipo de compra "Local", en lugar de utilización e Incoterm.
- **Entrega (local):** proveedor y ciudad, entrega en bodega, crédito, costos de compra local, % sobre la compra y días.
- **Seguimiento:**
  - Importación: tracking con 7 nodos y botón "Actualizar" simulado.
  - Local: mensaje de entrega directa en bodega, sin puerto ni aduana.
- **Orden de compra:** Imprimir/PDF, Enviar al proveedor (modal simulado) y Crear en SAP (modal simulado).
- **Historial:** timeline de 9 pasos según el estado.

### Vista PDF de la OC (`printPO`)
- Overlay con los botones "Imprimir / PDF" (`window.print()`) y "Cerrar".
- Encabezado: logo RENTECO, "ORDEN DE COMPRA", número de OC, fecha y número SAP.
- Proveedor y dirección (el país solo si es internacional), moneda, "Incoterm" o "Entrega: Bodega RENTECO, Costa Rica", y entrega esperada.
- Tabla con `s.lineas` (respaldo: catálogo), el total, el responsable, el aprobador y el pie "Documento generado desde prototipo (datos simulados)".

## VISTA: REGLAS Y PARÁMETROS (solo admin)
- Formulario de parámetros generales y v3.0 que se guardan en `localStorage`.
- Tabla de reglas avanzadas: filtro por nivel, activar/desactivar, eliminar y agregar.

## VISTA: CONFIGURACIÓN
- Tipo de cambio USD/CRC con fecha, fuente y notas.
- Equivalencia en tiempo real de $1,000 en colones.
- Historial de hasta 20 registros con su variación %.
- Información del sistema (versión, integración SAP simulada, moneda base).

## VISTA: USUARIOS
Indicadores (registrados, activos, simulaciones usadas, capacidad asignada) y tabla con límite editable, % de uso, activar/desactivar, eliminar y "Nuevo usuario".

## VISTA: CONTROL DE CONSUMO
Tarjetas de simulaciones nuevas y páginas del extractor IA (usadas / límite, barra con semáforo ≥70% amarillo y ≥90% rojo, alertas e historial de 5 meses), configuración de límites y actualización demo de lo usado.

## VISTA: REPORTES
- Filtros: proveedores (selección múltiple), métrica (precio, costo, margen %, precio de mercado) y productos (selección múltiple).
- Gráfico SVG de tendencia comparativa; si hay un solo producto, el detalle de precio, costo y precio de mercado.
- Tabla histórica por producto, simulaciones por estado y tabla de variación de costos por proveedor (Normal, Moderado o Alerta).
- Exportar a Excel/PDF (simulado con toast).

---

## INTERACCIONES OBLIGATORIAS
- Navegación SPA sin recargar.
- Cambio de modo importación/local desde el menú, el listado, la ficha de proveedor y al editar.
- Buscar y filtrar simulaciones por texto, tipo de compra, proveedor, estado y región.
- Crear, editar, duplicar y eliminar borradores.
- Cargar cotización, aplicar costos, seleccionar, agregar y buscar productos, y optimizar el pedido.
- Recálculo inmediato al cambiar cantidades, costos, escenario o método de distribución.
- Aprobar, rechazar y crear OC; **la vista PDF se abre automáticamente al crear la OC en SAP**.
- Cambiar de rol oculta Reglas y cambia el nombre del usuario.
- Guardar en `localStorage` y restaurar los datos demo.
- Modales de confirmación, toasts, tooltips, badges y semáforos consistentes.

---

## CRITERIOS DE ACEPTACIÓN
1. ✅ Se puede demostrar de punta a punta tanto una importación como una compra local: crear → analizar → recomendar → aprobar → OC con PDF.
2. ✅ La compra local no muestra Incoterm, contenedor, flete internacional, aranceles, tratados, proyección de tipo de cambio ni seguimiento marítimo.
3. ✅ Costos, márgenes y recomendación cambian en tiempo real.
4. ✅ Los 6 presets producen los resultados de la tabla de presets.
5. ✅ Proveedores muestra la columna Origen (Local / Internacional).
6. ✅ El PDF de la OC muestra las líneas reales del pedido simulado.
7. ✅ Hay trazabilidad de estados en el timeline.
8. ✅ Aspecto profesional y aviso de "datos simulados" sin sugerir conexión real con SAP o IA.

---

*Fin del prompt de replicación — v3.1 (Octubre 2026).*
