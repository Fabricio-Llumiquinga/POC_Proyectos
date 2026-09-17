# PROMPT DE REPLICACIÓN — Torre Inteligente de Importaciones y Rentabilidad (RENTECO)

> Copie y pegue este prompt completo en cualquier IA generativa de código (ChatGPT, Claude, Gemini, Copilot, etc.) para reproducir la solución de punta a punta.

---

## INSTRUCCIÓN PRINCIPAL

Construye un prototipo web funcional, empresarial y responsive para la empresa RENTECO llamado **"Torre Inteligente de Importaciones y Rentabilidad"**.

La aplicación debe simular y visualizar el análisis previo a una importación, integrando datos ficticios equivalentes a los que vendrían de SAP Business One y de cotizaciones de proveedor. Debe estimar el costo total de mercancía puesta en Costa Rica, evaluar la rentabilidad por producto, simular precios de venta y presentar una recomendación explicable (COMPRAR / COMPRAR CON AJUSTES / ESPERAR / NO COMPRAR).

---

## CONDICIONES TÉCNICAS

- **Solo** HTML5, CSS3 y JavaScript vanilla.
- Sin backend ni bases de datos reales.
- Separar en 3 archivos: `index.html`, `styles.css`, `app.js`.
- Puede usar **Font Awesome por CDN** para iconos.
- No usar frameworks (React, Vue, Angular).
- Toda la información almacenada en memoria o `localStorage`.
- La app debe funcionar al abrir `index.html` en un navegador.
- Responsive para escritorio y tablet.
- Idioma: español.
- Moneda principal: USD. Equivalencia opcional en CRC con tipo de cambio editable (por defecto ₡530).
- Estilo corporativo: **azul petróleo (#1a5276)**, azul claro (#2980b9), blanco, gris y **acentos naranja (#e67e22)** para acciones/alertas.

---

## ARQUITECTURA SPA

Aplicación de una sola página con:
- **Sidebar oscuro colapsable** (izquierda)
- **Header** con buscador, selector de rol, campana de notificaciones y nombre de usuario
- **Área principal** donde se renderizan las vistas
- **Footer** con disclaimer "⚠️ Prototipo con datos simulados — Sin conexión a SAP ni IA real"
- Sistema de **modales de confirmación**, **notificaciones toast** y **badges de estado**

---

## ROLES SIMULADOS (selector en header, sin autenticación)

| Rol | Permisos |
|-----|----------|
| Gerencia Comercial | Crea solicitudes, consulta escenarios, revisa recomendaciones |
| Importaciones / Compras | Completa variables logísticas y costos |
| Aprobador / Dirección | Aprueba, solicita ajustes o rechaza |
| Administrador | Gestiona reglas, parámetros y usuarios simulados |

---

## MENÚ LATERAL (7 vistas + 1 detalle)

1. Resumen ejecutivo
2. Simulaciones de importación
3. Nueva simulación
4. Forecast y rotación
5. Proveedores
6. Reglas y parámetros (solo Admin)
7. Reportes
8. Detalle de simulación (se abre al hacer clic en una simulación)

---

## VISTA 1: RESUMEN EJECUTIVO

**KPIs:** Simulaciones activas, pendientes de aprobación, monto total evaluado (USD), margen promedio proyectado (%), alertas críticas.

**Gráficos CSS:**
- Barras: simulaciones por estado (borrador, análisis, ajustes, pendiente, aprobado, rechazado)
- Barras: variación de costos por origen (Europa, Asia, EEUU, Sudamérica)

**Tabla:** Últimas 5 simulaciones con código, proveedor, origen, monto, margen, recomendación, responsable, estado.

**Panel de alertas:**
- Incremento de costo de proveedor entre 15% y 30%
- Margen proyectado menor al mínimo configurado
- Contenedor con utilización inferior al 80%
- Venta histórica concentrada en un único cliente

**Botón:** "Restaurar datos de demostración" (resetea localStorage)

---

## VISTA 2: SIMULACIONES DE IMPORTACIÓN

Tabla con filtros (búsqueda por texto, estado, región) y paginación simulada.

**Columnas:** Código, fecha, motivo, proveedor, tipo (recurrente/nuevo), región, tipo carga, total compra, costo CR, margen, recomendación IA, estado, acciones.

**Acciones:** Ver detalle, duplicar, eliminar borrador (con modal confirmación), exportar reporte (toast).

**Mínimo 10 registros** con variedad de proveedores de Europa, EEUU, Asia y Sudamérica.

**Estados posibles:** borrador, en análisis, requiere ajustes, pendiente de aprobación, aprobado, rechazado.

---

## VISTA 3: NUEVA SIMULACIÓN (Wizard 6 pasos)

### Barra de ejemplos precargados (parte superior)
3 botones que cargan datos de ejemplo y saltan al paso 5:
- **"Ejemplo → COMPRAR"** (verde): Proveedor Danosa S.A. (España, recurrente), costos cotizados menores al SAP, 4 productos de baja concentración, contenedor lleno al ~89%, stock crítico. Score ~90.
- **"Ejemplo → NO COMPRAR"** (rojo): Proveedor Polímeros del Sur (Colombia, nuevo), costos +50% sobre SAP, 2 productos con concentración >65%, contenedor al 1.6%, sin tratado comercial. Score ~-30.
- **"Ejemplo → COMPRAR CON AJUSTES"** (amarillo): Proveedor BuildTech USA (recurrente), costos +8-15%, 3 productos, utilización ~71%, margen entre 25-37%. Score ~60.

### Paso 1: Origen de la necesidad
Motivo (comercial/rotación/producto nuevo), área solicitante, responsable, fecha requerida, observaciones.

### Paso 2: Proveedor y cotización
Proveedor recurrente sí/no, proveedor (selector filtrado), país, región, moneda, incoterm, N° cotización, fecha, archivo adjunto (drag & drop simulado), transporte (marítimo/aéreo/terrestre), tipo carga.

**Reglas visibles:**
- Europa/Asia/Sudamérica → sugerir contenedor completo
- EEUU → permitir consolidado
- Proveedor nuevo → alerta para completar parámetros

### Paso 3: Productos
Tabla editable con botón "Agregar producto". Columnas: SKU, descripción, cantidad (editable), costo cotizado (editable), costo SAP, precio venta, peso kg, volumen m³, stock, ventas 3m, ventas 6m, cliente principal, concentración %. Botón eliminar por fila.

**Productos de ejemplo (inspirados en industria de la construcción):**
- Danopur PT Cubeta 25 kg
- Danopol HS 1.2 Rollo
- Perfil Fijación PVC Pestaña B
- Danopol FV 1.2 Rollo
- Danopol Figura Esquinera Interna/Externa
- Danopol Figura PVC para gravillas
- Danodren H15 Plus Rollo

### Paso 4: Logística y costos adicionales
Campos: flete internacional, seguro, operador logístico, agencia aduanal, aranceles, impuestos, tratado comercial (sí/no), descuento por tratado, transporte local, otros costos, tiempo tránsito, método distribución (por valor/peso/volumen).

**En tiempo real mostrar:**
- Peso total, volumen total
- Utilización por peso, por volumen, efectiva (la mayor)
- Barras de progreso con semáforo: verde ≥85%, amarillo 70-84%, rojo <70%

### Paso 5: Análisis y escenarios

**Cálculos automáticos:**
- Monto compra = Σ(cantidad × costo cotizado)
- Costos adicionales = flete + seguro + operador + agencia + aranceles + impuestos + transporte local + otros − descuento tratado
- Costo total CR = monto compra + costos adicionales
- Distribución por producto según método elegido (valor/peso/volumen)
- Costo unitario proyectado = (valor producto + costos distribuidos) / cantidad
- Aumento % = (costo proyectado − costo SAP) / costo SAP × 100
- Margen actual = (precio venta − costo SAP) / precio venta × 100
- Margen proyectado = (precio venta − costo proyectado) / precio venta × 100

**Selector de escenarios:**
- A. Mantener precio actual
- B. Mantener margen actual → precio = costo proyectado / (1 − margen actual)
- C. Margen objetivo (configurable) → precio = costo proyectado / (1 − margen objetivo)
- D. Precio manual

**Tabla comparativa:** costo actual, costo proyectado, aumento, precio actual, margen actual, margen proyectado, precio sugerido, incremento precio, estado (Saludable/En riesgo/Negativo).

**Análisis inteligente (reglas JavaScript):**
Generar frases explicativas como:
- "Se recomienda ajustar el precio porque el margen proyectado baja del X% al Y%."
- "La demanda histórica está concentrada en un solo cliente (Z%); revise si es proyecto no recurrente."
- "El contenedor se encuentra al N% de utilización; evalúe agregar productos o cambiar tipo."
- "El costo logístico aumentó más de 15%."
- "Existe tratado comercial aplicable; reducción de arancel estimada."
- "Proveedor nuevo sin histórico; confianza media."
- "Productos con cobertura inferior a 2 meses. Compra justificada."

**Recomendación final (tarjeta destacada):**

| Score | Resultado |
|-------|-----------|
| ≥ 65 | COMPRAR |
| 45–64 | COMPRAR CON AJUSTES |
| 30–44 | ESPERAR |
| < 30 | NO COMPRAR |

**Motor de scoring (base 50 puntos):**
- Margen ≥ objetivo (+20), ≥ mínimo (+10), ≥ 15% (−10), < 15% (−25)
- Utilización ≥ 85% (+10), < 70% (−15)
- Aumento promedio > 20% (−15), > 15% (−10)
- Concentración alta en >50% de productos (−15)
- Proveedor nuevo (−10)
- Stock bajo en >50% de productos (+10)

Mostrar nivel de confianza: Alta (proveedor recurrente + score extremo) o Media.

### Paso 6: Decisión y envío
Resumen con KPIs. Botones según rol: guardar borrador, enviar a análisis, solicitar ajustes, aprobar, rechazar (con confirmación modal), descargar reporte. Equivalencia en CRC.

Al guardar → agregar a localStorage → redirigir a tabla de simulaciones.

---

## VISTA 4: DETALLE DE SIMULACIÓN

Pestañas: Resumen, Productos y margen, Logística, Recomendación IA, Historial.

**Línea de tiempo:** Solicitud creada → Cotización cargada → Datos SAP consultados → Análisis completado → Ajustes solicitados (si aplica) → Aprobación/Rechazo.

Botones de acción según rol y estado actual.

---

## VISTA 5: FORECAST Y ROTACIÓN

Etiqueta "Módulo de apoyo / vista preliminar".

- Selector de producto
- Gráfico barras: ventas últimos 12 meses
- Gráfico barras: pronóstico 6 meses
- KPIs: stock actual, órdenes en tránsito (0), cobertura en meses, pronóstico mensual
- Cálculo: promedio móvil ponderado (pesos 1,1,2,2,3,3 sobre últimos 6 meses)
- Checkbox "Excluir mes atípico" (mes 9 con factor 2.5×)
- Compra sugerida = pronóstico × 4 − stock actual
- Alertas: concentración, cobertura baja
- Botón "Crear simulación con esta recomendación"

---

## VISTA 6: PROVEEDORES

Tabla: nombre, región, tipo (recurrente/nuevo), moneda, incoterm, contenedor usual, tiempo entrega, tratado, variación reciente %, última compra, n° importaciones.

Botón "Ver ficha" → modal con detalle y notas.

---

## VISTA 7: REGLAS Y PARÁMETROS (solo Admin)

Formulario editable guardado en localStorage:
- Margen mínimo (25%), margen objetivo (35%)
- Variación costo alerta (15%)
- Utilización mínima contenedor (80%)
- Máx. concentración cliente (60%)
- Capacidades contenedor 20' (21,770 kg / 33.2 m³) y 40' (26,780 kg / 67.7 m³)
- Tipo de cambio USD/CRC (530)
- Carga sugerida por región

---

## VISTA 8: REPORTES

- Gráficos: simulaciones por estado, aprobadas vs rechazadas
- Tabla: margen promedio por proveedor
- Gráfico: variación costos por región
- Métricas: alertas frecuentes, tiempo promedio solicitud→decisión, tasa aprobación, monto total aprobado
- Botones exportar Excel/PDF (simulados con toast)

---

## DATOS DE EJEMPLO REQUERIDOS

- **10 simulaciones** (variedad de estados, regiones, proveedores recurrentes y nuevos)
- **8 productos** industriales/construcción con SKU, costos, precios, pesos, volúmenes, ventas y concentración
- **6 proveedores** (4 recurrentes de Europa/EEUU/Asia, 2 nuevos de Sudamérica/Europa)
- **24 meses de ventas** por producto (generados con random + 1 mes atípico)
- **Reglas predeterminadas** editables
- **3 escenarios precargados** que demuestren los 3 resultados principales

---

## INTERACCIONES OBLIGATORIAS

- Navegación SPA sin recargar
- Buscar/filtrar simulaciones
- Crear, editar, duplicar, eliminar borradores
- Agregar/eliminar productos en el wizard
- Recalcular automáticamente al cambiar cantidades, costos, flete, impuestos, margen o método
- Cambiar escenarios de precio y ver impacto inmediato
- Cambiar rol → ocultar/mostrar acciones
- Aprobar/rechazar/solicitar ajustes (con modales)
- Guardar en localStorage / restaurar datos demo
- Tooltips explicativos en variables financieras
- Badges de estado con colores consistentes

---

## CALIDAD VISUAL

- Sidebar oscuro con logo naranja, colapsable
- Header sticky con sombra sutil
- Tarjetas KPI con iconos y colores diferenciados
- Tablas con header fijo y hover en filas
- Formularios en cards con buena jerarquía visual
- Barras de progreso para utilización
- Panel de recomendación con borde de color según resultado
- No usar lorem ipsum — textos realistas de negocio
- Wizard con barra de progreso y pasos numerados
- Toast animado desde la derecha
- Modal centrado con overlay oscuro

---

## CRITERIOS DE ACEPTACIÓN

1. ✅ Demostrable de punta a punta (crear simulación → ver análisis → ver recomendación → guardar)
2. ✅ Los costos y márgenes cambian en tiempo real al modificar variables
3. ✅ La recomendación cambia al modificar variables críticas (verificable con los 3 presets)
4. ✅ Trazabilidad de estados y acciones en timeline
5. ✅ Aspecto profesional para presentación a gerentes
6. ✅ Indicar claramente "datos simulados" sin sugerir conexión real con SAP o IA

---

## VALIDACIÓN DEL MOTOR DE RECOMENDACIÓN

Los 3 escenarios precargados deben producir exactamente:

| Escenario | Score esperado | Resultado |
|-----------|---------------|-----------|
| COMPRAR | ~90 | ✅ COMPRAR |
| NO COMPRAR | ~-30 | ✅ NO COMPRAR |
| COMPRAR CON AJUSTES | ~60 | ✅ COMPRAR CON AJUSTES |

Si al implementar los scores no coinciden, ajustar los datos de ejemplo (cantidades, costos cotizados, costos logísticos) hasta que el motor produzca el resultado correcto. El truco clave:
- Para COMPRAR: costos cotizados **menores** al costo SAP, costos logísticos bajos, contenedor lleno, stock bajo.
- Para NO COMPRAR: costos cotizados **muy superiores** al SAP (+50%), proveedor nuevo, costos logísticos altísimos, poca carga, alta concentración, stock alto.
- Para AJUSTES: costos cotizados ligeramente superiores (+6-8%), costos logísticos moderados, utilización entre 70-84%.

---

*Fin del prompt de replicación.*
