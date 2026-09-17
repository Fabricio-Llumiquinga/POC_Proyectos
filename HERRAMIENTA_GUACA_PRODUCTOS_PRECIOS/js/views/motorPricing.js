// ===== MOTOR DE PRICING VIEW =====
var MotorPricingView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Motor de Pricing</h2>';
        html += '<p class="section-subtitle">Flujo completo del motor inteligente de pricing: desde la integración de datos hasta la aplicación del precio.</p>';

        // Pipeline visual
        html += renderPipeline();

        // Simulador
        html += renderSimulador();

        // Detalle de cada paso
        html += renderPasos();

        return html;
    }

    function renderPipeline() {
        var html = '<div class="form-card" style="padding:30px;">';
        html += '<div class="form-card-title">Flujo del Motor de Pricing</div>';
        html += '<div style="display:flex;align-items:center;gap:0;overflow-x:auto;padding:16px 0;">';
        var steps = [
            { num: '1', label: 'Integración', desc: 'POS, inventario, ventas, costos, tránsito', color: '#1a73e8', view: 'api-pos' },
            { num: '2', label: 'Consolidación', desc: 'Histórico ventas, precios, movimientos', color: '#1565c0', view: 'historico' },
            { num: '3', label: 'Reglas', desc: 'Aplicación reglas de negocio', color: '#ff9800', view: 'reglas' },
            { num: '4', label: 'Análisis', desc: 'Elasticidad y demanda', color: '#e65100', view: 'competencia' },
            { num: '5', label: 'Comparación', desc: 'Precio, costo, margen, stock, rotación', color: '#9c27b0', view: 'cambio-costo' },
            { num: '6', label: 'Sugerencia', desc: 'Precio sugerido con explicación', color: '#2e7d32', view: 'ajustes' },
            { num: '7', label: 'Simulación', desc: 'Impacto del cambio', color: '#00838f', view: 'motor-pricing' },
            { num: '8', label: 'Aprobación', desc: 'Aprobar, rechazar, modificar', color: '#c62828', view: 'aprobaciones' },
            { num: '9', label: 'Aplicación', desc: 'Envío a POS', color: '#4caf50', view: 'api-pos' },
            { num: '10', label: 'Histórico', desc: 'Precios, stock, ventas, márgenes', color: '#546e7a', view: 'historico' }
        ];
        steps.forEach(function(s, i) {
            html += '<div style="display:flex;flex-direction:column;align-items:center;min-width:90px;cursor:pointer;" onclick="document.querySelector(\'[data-view=' + s.view + ']\').click()">';
            html += '<div style="width:36px;height:36px;border-radius:50%;background:' + s.color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;">' + s.num + '</div>';
            html += '<div style="font-size:11px;font-weight:600;color:' + s.color + ';margin-top:6px;text-align:center;">' + s.label + '</div>';
            html += '<div style="font-size:9px;color:#7f8c8d;text-align:center;max-width:85px;margin-top:2px;">' + s.desc + '</div>';
            html += '</div>';
            if (i < steps.length - 1) {
                html += '<div style="flex-shrink:0;width:24px;height:2px;background:#cfd8dc;margin-top:-20px;"></div>';
            }
        });
        html += '</div></div>';
        return html;
    }

    function renderSimulador() {
        var html = '<div class="form-card"><div class="form-card-title">Simulador de Impacto de Precio</div>';
        html += '<p style="font-size:12px;color:#7f8c8d;margin-bottom:16px;">Seleccione un producto para simular el impacto de un cambio de precio sobre margen, ventas estimadas e ingresos.</p>';
        html += '<div class="form-row">';
        html += '<div class="form-group"><label class="form-label">Producto</label><select class="form-control" id="mpProducto" onchange="MotorPricingView.cargarProducto()">';
        html += '<option value="">Seleccionar producto...</option>';
        AppData.productos.forEach(function(p) {
            if (p.estado === 'Activo' && p.precioActual > 0) {
                html += '<option value="' + p.sku + '">' + p.sku + ' - ' + p.descripcion + '</option>';
            }
        });
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Nuevo precio propuesto</label><input type="number" class="form-control" id="mpNuevoPrecio" placeholder="0" oninput="MotorPricingView.simular()"></div>';
        html += '</div>';
        html += '<div id="mpInfoProducto"></div>';
        html += '<div id="mpExplicacionIA"></div>';
        html += '<div id="mpResultadoSimulacion"></div>';
        html += '</div>';
        return html;
    }

    function cargarProducto() {
        var sku = document.getElementById('mpProducto').value;
        if (!sku) { document.getElementById('mpInfoProducto').innerHTML = ''; document.getElementById('mpExplicacionIA').innerHTML = ''; document.getElementById('mpResultadoSimulacion').innerHTML = ''; return; }
        var p = AppData.getProducto(sku);
        if (!p) return;
        var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
        var margen = Utils.calcMargen(p.costoActual, p.precioActual);
        var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:12px 0;">';
        html += infoCard('Precio actual', Utils.formatCurrency(p.precioActual), '#1a73e8');
        html += infoCard('Costo', Utils.formatCurrency(p.costoActual), '#546e7a');
        html += infoCard('Markup', Utils.formatPercent(markup), '#546e7a');
        html += infoCard('Margen', Utils.formatPercent(margen), margen < 15 ? '#c62828' : '#2e7d32');
        html += infoCard('Stock', p.inventario + ' uds', '#546e7a');
        html += infoCard('Rotación', p.rotacion, '#546e7a');
        html += '</div>';
        document.getElementById('mpInfoProducto').innerHTML = html;
        document.getElementById('mpNuevoPrecio').value = p.precioActual;
        document.getElementById('mpResultadoSimulacion').innerHTML = '';

        // Generar explicación IA
        document.getElementById('mpExplicacionIA').innerHTML = generarExplicacionIA(p);
    }

    function generarExplicacionIA(p) {
        var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
        var margen = Utils.calcMargen(p.costoActual, p.precioActual);
        var razones = [];
        var precioSugerido = p.precioActual;
        var accionPrincipal = 'Mantener precio';

        // Check cost change
        var cambioCosto = AppData.cambiosCosto.find(function(c) { return c.sku === p.sku; });
        if (cambioCosto) {
            var absVar = Math.abs(cambioCosto.variacion);
            if (absVar >= 5) {
                var eval_ = Utils.evaluarCambioCosto(p, cambioCosto.nuevoCosto);
                precioSugerido = eval_.precioPropuesto;
                accionPrincipal = 'Ajustar por cambio de costo';
                razones.push('Se detectó un cambio de costo de ' + Utils.formatPercent(cambioCosto.variacion) + ' (de ' + Utils.formatCurrency(cambioCosto.costoAnterior) + ' a ' + Utils.formatCurrency(cambioCosto.nuevoCosto) + ').');
                if (absVar > 10) razones.push('La variación supera el 10%, lo que activa ajuste automático según reglas.');
                if (absVar > 40 && p.proveedorActual !== p.proveedorAnterior) razones.push('La variación supera 40% con proveedor diferente. Se recomienda evaluar creación de nuevo código.');
            }
        }

        // Check competition
        var comp = AppData.getCompetencia(p.sku);
        if (comp.length > 0) {
            var promedio = comp.reduce(function(a, c) { return a + c.precioComp; }, 0) / comp.length;
            var dif = ((p.precioActual - promedio) / promedio) * 100;
            if (dif > 10) {
                razones.push('El precio actual está ' + dif.toFixed(1) + '% por encima del promedio de mercado (' + Utils.formatCurrency(promedio) + '). Riesgo de pérdida de competitividad.');
                var objetivo = Math.round(promedio * 1.05);
                if (!cambioCosto || Math.abs(cambioCosto.variacion) < 5) { precioSugerido = objetivo; accionPrincipal = 'Reducir por competencia'; }
            } else if (dif < -15) {
                razones.push('El precio actual está ' + Math.abs(dif).toFixed(1) + '% por debajo del mercado. Oportunidad de aumento sin perder ventas.');
                if (!cambioCosto || Math.abs(cambioCosto.variacion) < 5) { precioSugerido = Math.round(promedio * 0.95); accionPrincipal = 'Aumentar hacia mercado'; }
            } else {
                razones.push('El precio está dentro del rango competitivo (diferencia: ' + dif.toFixed(1) + '% vs mercado).');
            }
        } else {
            razones.push('No hay datos recientes de competencia. Se recomienda enviar a investigación de mercado.');
        }

        // Check margin
        if (margen < 15) {
            razones.push('El margen actual (' + Utils.formatPercent(margen) + ') está por debajo del mínimo permitido (15%). Requiere ajuste urgente.');
            if (accionPrincipal === 'Mantener precio') { precioSugerido = Math.round(p.costoActual * 1.40); accionPrincipal = 'Ajustar por margen bajo'; }
        } else if (margen < 20) {
            razones.push('El margen actual (' + Utils.formatPercent(margen) + ') está cerca del mínimo. Monitorear.');
        }

        // Check stock
        if (p.estadoAlerta === 'sobre_stock') {
            razones.push('El producto tiene sobre stock (' + p.inventario + ' uds) con rotación ' + p.rotacion + '. Reducción de precio podría incentivar salida.');
            if (accionPrincipal === 'Mantener precio') { precioSugerido = Math.round(p.precioActual * 0.92); accionPrincipal = 'Reducir por sobre stock'; }
        } else if (p.estadoAlerta === 'bajo_stock') {
            razones.push('El producto tiene bajo stock (' + p.inventario + ' uds). Se puede mantener o aumentar precio por escasez.');
        }

        // Check rotation
        if (p.rotacion === 'Baja' && p.inventario > 5) {
            razones.push('Rotación baja con inventario disponible. Considerar estrategia de precio para acelerar ventas.');
        } else if (p.rotacion === 'Alta') {
            razones.push('El producto tiene alta rotación, lo que indica buena aceptación del precio en el mercado.');
        }

        // No action needed
        if (razones.length === 0 || accionPrincipal === 'Mantener precio') {
            razones.push('No se detectan factores que requieran un cambio de precio inmediato.');
        }

        var nuevoMarkup = Utils.calcMarkup(p.costoActual, precioSugerido);
        var nuevoMargen = Utils.calcMargen(p.costoActual, precioSugerido);
        var variacion = Utils.calcVariacion(p.precioActual, precioSugerido);

        var iaHtml = '<div style="margin:16px 0;padding:16px;background:#f3e5f5;border-radius:8px;border-left:4px solid #9c27b0;">';
        iaHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span style="font-size:18px;">&#129302;</span><h4 style="color:#6a1b9a;margin:0;">Análisis IA - ¿Por qué cambiar el precio?</h4></div>';

        // Razones
        iaHtml += '<div style="margin-bottom:12px;">';
        razones.forEach(function(r) {
            iaHtml += '<div style="padding:6px 10px;margin-bottom:4px;background:#fff;border-radius:4px;font-size:12px;color:#37474f;border-left:2px solid #9c27b0;">' + r + '</div>';
        });
        iaHtml += '</div>';

        // Recommendation
        iaHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px;">';
        iaHtml += infoCard('Acción recomendada', accionPrincipal, '#6a1b9a');
        iaHtml += infoCard('Precio sugerido IA', Utils.formatCurrency(precioSugerido), '#2e7d32');
        iaHtml += infoCard('Variación', (variacion > 0 ? '+' : '') + variacion.toFixed(1) + '%', variacion > 0 ? '#2e7d32' : '#c62828');
        iaHtml += infoCard('Markup resultante', Utils.formatPercent(nuevoMarkup), '#546e7a');
        iaHtml += infoCard('Margen resultante', Utils.formatPercent(nuevoMargen), nuevoMargen < 15 ? '#c62828' : '#2e7d32');
        iaHtml += '</div>';

        // Button to apply suggestion
        iaHtml += '<div style="margin-top:12px;"><button class="btn btn-sm btn-primary" onclick="document.getElementById(\'mpNuevoPrecio\').value=' + precioSugerido + ';MotorPricingView.simular();">Usar precio sugerido IA en simulación</button></div>';
        iaHtml += '</div>';
        return iaHtml;
    }

    function simular() {
        var sku = document.getElementById('mpProducto').value;
        if (!sku) return;
        var p = AppData.getProducto(sku);
        if (!p) return;
        var nuevoPrecio = parseFloat(document.getElementById('mpNuevoPrecio').value) || 0;
        if (nuevoPrecio <= 0) { document.getElementById('mpResultadoSimulacion').innerHTML = ''; return; }

        var nuevoMarkup = Utils.calcMarkup(p.costoActual, nuevoPrecio);
        var nuevoMargen = Utils.calcMargen(p.costoActual, nuevoPrecio);
        var variacion = Utils.calcVariacion(p.precioActual, nuevoPrecio);

        // Simulate elasticity (simplified)
        var elasticidad = p.rotacion === 'Alta' ? -1.2 : (p.rotacion === 'Media' ? -0.8 : -0.4);
        var cambioVentas = variacion * elasticidad;
        var ventasBase = p.historicoConsumo || 20;
        var ventasEstimadas = Math.max(0, Math.round(ventasBase * (1 + cambioVentas / 100)));
        var ingresoActual = ventasBase * p.precioActual;
        var ingresoEstimado = ventasEstimadas * nuevoPrecio;
        var gananciaActual = ventasBase * (p.precioActual - p.costoActual);
        var gananciaEstimada = ventasEstimadas * (nuevoPrecio - p.costoActual);

        var html = '<div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e0e6ed;">';
        html += '<h4 style="margin-bottom:12px;color:#1a2332;">Resultado de la Simulación</h4>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">';
        html += infoCard('Nuevo precio', Utils.formatCurrency(nuevoPrecio), '#1a73e8');
        html += infoCard('Variación', (variacion > 0 ? '+' : '') + variacion.toFixed(1) + '%', variacion > 0 ? '#2e7d32' : '#c62828');
        html += infoCard('Nuevo markup', Utils.formatPercent(nuevoMarkup), nuevoMarkup < 17 ? '#c62828' : '#546e7a');
        html += infoCard('Nuevo margen', Utils.formatPercent(nuevoMargen), nuevoMargen < 15 ? '#c62828' : '#2e7d32');
        html += infoCard('Elasticidad', elasticidad.toFixed(1), '#9c27b0');
        html += infoCard('Ventas estimadas', ventasEstimadas + ' uds/periodo', cambioVentas < 0 ? '#e65100' : '#2e7d32');
        html += infoCard('Ingreso estimado', Utils.formatCurrency(ingresoEstimado), ingresoEstimado > ingresoActual ? '#2e7d32' : '#c62828');
        html += infoCard('Ganancia estimada', Utils.formatCurrency(gananciaEstimada), gananciaEstimada > gananciaActual ? '#2e7d32' : '#c62828');
        html += '</div>';

        // Impact analysis
        html += '<div style="margin-top:12px;padding:10px;border-radius:6px;font-size:12px;';
        if (gananciaEstimada > gananciaActual) {
            html += 'background:#e8f5e9;border-left:3px solid #4caf50;color:#2e7d32;">';
            html += '&#10004; <strong>Impacto positivo:</strong> La ganancia estimada aumenta ' + Utils.formatCurrency(gananciaEstimada - gananciaActual) + ' respecto al escenario actual.';
        } else if (gananciaEstimada < gananciaActual) {
            html += 'background:#fce4ec;border-left:3px solid #f44336;color:#c62828;">';
            html += '&#9888; <strong>Impacto negativo:</strong> La ganancia estimada disminuye ' + Utils.formatCurrency(gananciaActual - gananciaEstimada) + ' respecto al escenario actual.';
        } else {
            html += 'background:#e3f2fd;border-left:3px solid #1a73e8;color:#1565c0;">';
            html += '&#8594; <strong>Sin cambio significativo</strong> en la ganancia estimada.';
        }
        html += '</div>';

        // Explanation
        html += '<div style="margin-top:10px;padding:10px;background:#fff;border-radius:6px;border:1px solid #e0e6ed;font-size:11px;color:#546e7a;">';
        html += '<strong>Explicación del cálculo:</strong> Elasticidad ' + elasticidad.toFixed(1) + ' (basada en rotación ' + p.rotacion + '). ';
        html += 'Cambio de precio: ' + variacion.toFixed(1) + '% → Cambio estimado en demanda: ' + cambioVentas.toFixed(1) + '%. ';
        html += 'Ventas base: ' + ventasBase + ' → Estimadas: ' + ventasEstimadas + ' uds.';
        html += '</div></div>';
        document.getElementById('mpResultadoSimulacion').innerHTML = html;
    }

    function infoCard(label, value, color) {
        return '<div style="padding:10px;background:#fff;border-radius:6px;border-left:3px solid ' + color + ';text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.04);"><div style="font-size:10px;color:#7f8c8d;">' + label + '</div><div style="font-size:14px;font-weight:700;color:' + color + ';margin-top:2px;">' + value + '</div></div>';
    }

    function renderPasos() {
        var html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:24px;">';

        html += paso('1. Integración con POS', '#1a73e8', 'api-pos', 'API Punto de Venta',
            'Conexión en tiempo real con el sistema de punto de venta para obtener:',
            ['Precios actuales de venta', 'Inventario disponible y en tránsito', 'Ventas realizadas (unidades y montos)', 'Costos actualizados por proveedor', 'Productos nuevos ingresados']);

        html += paso('2. Consolidación del Histórico', '#1565c0', 'historico', 'Histórico y Tendencia',
            'Centralización y limpieza de datos para análisis:',
            ['Histórico de ventas por período', 'Evolución de precios en el tiempo', 'Movimientos de inventario (entradas, salidas, transferencias)', 'Cambios de costo por proveedor', 'Registro de ajustes anteriores']);

        html += paso('3. Aplicación de Reglas de Negocio', '#ff9800', 'reglas', 'Reglas y Parámetros',
            'Motor de reglas configurable que evalúa:',
            ['Variación de costo (<5%, 5-10%, >10%, >40%)', 'Markup mínimo (17%) y máximo (1000%)', 'Margen mínimo (15%)', 'Reglas de proveedor diferente', 'Reglas de liquidación y sobre/bajo stock']);

        html += paso('4. Análisis de Elasticidad', '#e65100', 'competencia', 'Monitoreo de Competencia',
            'Estimación del comportamiento de la demanda:',
            ['Elasticidad por categoría y rotación', 'Sensibilidad al precio por producto', 'Estacionalidad de ventas', 'Impacto histórico de cambios previos', 'Correlación precio-demanda']);

        html += paso('5. Comparación Integral', '#9c27b0', 'cambio-costo', 'Cambio de Costo',
            'Análisis cruzado de variables clave:',
            ['Precio actual vs costo actualizado', 'Margen real vs margen objetivo', 'Stock actual vs rotación esperada', 'Precio La Guaca vs mercado/competencia', 'Tendencia del producto (creciente, estable, decreciente)']);

        html += paso('6. Generación de Precio Sugerido', '#2e7d32', 'ajustes', 'Ajustes de Precio',
            'El motor genera un precio con explicación completa:',
            ['Precio sugerido calculado', 'Markup y margen resultantes', 'Reglas que se aplicaron', 'Comparación con precio actual', 'Nivel de confianza de la sugerencia']);

        html += paso('7. Simulación de Impacto', '#00838f', 'motor-pricing', 'Motor de Pricing (esta vista)',
            'Antes de aplicar, se proyecta el efecto:',
            ['Cambio estimado en volumen de ventas', 'Impacto en ingresos totales', 'Impacto en ganancia bruta', 'Efecto en rotación de inventario', 'Escenarios optimista, base y pesimista']);

        html += paso('8. Aprobación y Decisión', '#c62828', 'aprobaciones', 'Aprobaciones',
            'Flujo de decisión según nivel de riesgo:',
            ['Aplicación automática (cumple todas las reglas)', 'Aprobación manual (fuera de rango)', 'Rechazo con justificación', 'Modificación del precio sugerido', 'Suspensión temporal del ajuste']);

        html += paso('9. Aplicación vía API POS', '#4caf50', 'api-pos', 'API Punto de Venta',
            'Envío del nuevo precio al sistema de venta:',
            ['Actualización en punto de venta', 'Confirmación de aplicación exitosa', 'Manejo de errores y reintentos', 'Registro en log de integración', 'Notificación al solicitante']);

        html += paso('10. Vista Histórica Completa', '#546e7a', 'historico', 'Histórico y Tendencia',
            'Trazabilidad total de cada decisión:',
            ['Historial de precios por producto', 'Evolución de stock y ventas', 'Márgenes obtenidos vs proyectados', 'Resultados reales post-cambio', 'Auditoría de quién aprobó y cuándo']);

        html += '</div>';
        return html;
    }

    function paso(titulo, color, view, viewLabel, desc, items) {
        var html = '<div style="padding:16px;background:#fff;border-radius:8px;border-left:4px solid ' + color + ';box-shadow:0 2px 6px rgba(0,0,0,0.05);">';
        html += '<h4 style="font-size:13px;color:' + color + ';margin-bottom:4px;">' + titulo + '</h4>';
        html += '<a href="#" onclick="document.querySelector(\'[data-view=' + view + ']\').click();return false;" style="font-size:10px;color:#1a73e8;text-decoration:none;display:inline-flex;align-items:center;gap:3px;margin-bottom:8px;">&#9654; Ir a: ' + viewLabel + '</a>';
        html += '<p style="font-size:11px;color:#546e7a;margin-bottom:8px;">' + desc + '</p>';
        html += '<ul style="padding-left:16px;margin:0;">';
        items.forEach(function(item) {
            html += '<li style="font-size:11px;color:#37474f;margin-bottom:3px;">' + item + '</li>';
        });
        html += '</ul></div>';
        return html;
    }

    return { render: render, cargarProducto: cargarProducto, simular: simular };
})();
