// ===== AJUSTES DE PRECIO VIEW =====
var AjustesView = (function() {
    'use strict';

    var motivos = ['Cambio de costo', 'Competencia', 'Liquidación', 'Sobre stock', 'Bajo stock', 'Política comercial'];

    function render() {
        // Generate AI-detected changes
        var cambiosIA = generarCambiosIA();

        var html = '<h2 class="section-title">Ajustes de Precio</h2>';
        html += '<p class="section-subtitle">Cambios de precio detectados por el motor de reglas e IA. Revise, apruebe o solicite ajustes manuales.</p>';

        // KPIs
        var pendientes = cambiosIA.filter(function(c) { return c.estadoAjuste === 'Pendiente'; }).length;
        var aplicados = cambiosIA.filter(function(c) { return c.estadoAjuste === 'Aplicado'; }).length;
        var enRevision = cambiosIA.filter(function(c) { return c.estadoAjuste === 'En revisión'; }).length;
        html += '<div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px;">';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + cambiosIA.length + '</div><div class="kpi-label">Total detectados</div></div>';
        html += '<div class="kpi-card yellow"><div class="kpi-value">' + pendientes + '</div><div class="kpi-label">Pendientes aplicar</div></div>';
        html += '<div class="kpi-card green"><div class="kpi-value">' + aplicados + '</div><div class="kpi-label">Aplicados</div></div>';
        html += '<div class="kpi-card yellow"><div class="kpi-value">' + enRevision + '</div><div class="kpi-label">En revisión</div></div>';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + AppData.ajustesPrecio.length + '</div><div class="kpi-label">Solicitudes manuales</div></div>';
        html += '</div>';

        // Action buttons
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary" onclick="AjustesView.abrirSolicitud()">&#10010; Nueva solicitud de ajuste</button>';
        html += '<button class="btn btn-success" onclick="AjustesView.aplicarTodosPendientes()">&#9889; Aplicar todos los pendientes</button>';
        html += '</div>';

        // Main table: AI-detected changes
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Cambios Detectados por IA / Motor de Reglas</span></div>';
        html += '<div class="table-wrapper"><table class="table-compact"><thead><tr>';
        html += '<th>SKU</th><th>Producto</th><th>Motivo</th><th>Costo</th><th>Precio Actual</th><th>Precio Sugerido</th><th>Variación</th><th>Markup Nuevo</th><th>Estado</th><th>Acciones</th>';
        html += '</tr></thead><tbody id="ajCambiosBody">';
        cambiosIA.forEach(function(c, idx) {
            var variacion = c.precioActual > 0 ? ((c.precioSugerido - c.precioActual) / c.precioActual * 100) : 0;
            var markupNuevo = c.costo > 0 ? Utils.calcMarkup(c.costo, c.precioSugerido) : 0;
            var varClass = variacion > 0 ? 'badge-green' : (variacion < 0 ? 'badge-red' : 'badge-gray');
            var estadoClass = c.estadoAjuste === 'Aplicado' ? 'badge-green' : (c.estadoAjuste === 'Pendiente' ? 'badge-yellow' : 'badge-blue');
            html += '<tr>';
            html += '<td><strong>' + c.sku + '</strong></td>';
            html += '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + c.descripcion + '</td>';
            html += '<td><span class="tag">' + c.motivo + '</span></td>';
            html += '<td>' + Utils.formatCurrency(c.costo) + '</td>';
            html += '<td>' + Utils.formatCurrency(c.precioActual) + '</td>';
            html += '<td><strong>' + Utils.formatCurrency(c.precioSugerido) + '</strong></td>';
            html += '<td><span class="badge ' + varClass + '">' + (variacion > 0 ? '+' : '') + variacion.toFixed(1) + '%</span></td>';
            html += '<td>' + Utils.formatPercent(markupNuevo) + '</td>';
            html += '<td><span class="badge ' + estadoClass + '">' + c.estadoAjuste + '</span></td>';
            html += '<td class="actions-cell">';
            if (c.estadoAjuste === 'Pendiente') {
                html += '<button class="btn btn-sm btn-success" onclick="AjustesView.aplicarCambio(' + idx + ')">Aplicar</button> ';
                html += '<button class="btn btn-sm btn-outline" onclick="AjustesView.verDetalleIA(' + idx + ')">Detalle</button>';
            } else {
                html += '<button class="btn btn-sm btn-outline" onclick="AjustesView.verDetalleIA(' + idx + ')">Ver</button>';
            }
            html += '</td>';
            html += '</tr>';
        });
        html += '</tbody></table></div></div>';

        // Manual requests table
        if (AppData.ajustesPrecio.length > 0) {
            html += '<div class="table-container"><div class="table-header"><span class="table-title">Solicitudes Manuales</span></div>';
            html += '<div class="table-wrapper"><table class="table-compact"><thead><tr><th>SKU</th><th>Producto</th><th>Motivo</th><th>Costo</th><th>Precio Actual</th><th>Precio Solicitado</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>';
            AppData.ajustesPrecio.forEach(function(a) {
                var p = AppData.getProducto(a.sku);
                html += '<tr><td><strong>' + a.sku + '</strong></td><td>' + (p ? p.descripcion : '-') + '</td><td>' + a.motivo + '</td><td>' + Utils.formatCurrency(a.costo || 0) + '</td><td>' + Utils.formatCurrency(a.precioActual) + '</td><td><strong>' + Utils.formatCurrency(a.precioSolicitado) + '</strong></td><td><span class="badge ' + Utils.getBadgeClass(a.estado) + '">' + a.estado + '</span></td><td>' + a.fecha + '</td></tr>';
            });
            html += '</tbody></table></div></div>';
        }

        return html;
    }

    function generarCambiosIA() {
        var cambios = [];
        // From cost changes
        AppData.cambiosCosto.forEach(function(c) {
            var p = AppData.getProducto(c.sku);
            if (!p) return;
            var eval_ = Utils.evaluarCambioCosto(p, c.nuevoCosto);
            if (eval_.accion !== 'No cambiar precio') {
                cambios.push({
                    sku: c.sku, descripcion: p.descripcion, motivo: 'Cambio de costo',
                    costo: c.nuevoCosto, precioActual: p.precioActual, precioSugerido: eval_.precioPropuesto,
                    estadoAjuste: eval_.requiereAprobacion ? 'En revisión' : 'Pendiente',
                    explicacion: 'Variación de costo: ' + Utils.formatPercent(c.variacion) + '. ' + eval_.accion + '.'
                });
            }
        });
        // From competition
        var skusComp = [...new Set(AppData.preciosCompetencia.map(function(c) { return c.sku; }))];
        skusComp.forEach(function(sku) {
            var p = AppData.getProducto(sku);
            if (!p || p.precioActual === 0) return;
            var precios = AppData.preciosCompetencia.filter(function(c) { return c.sku === sku; });
            var promedio = precios.reduce(function(a, c) { return a + c.precioComp; }, 0) / precios.length;
            var dif = ((p.precioActual - promedio) / promedio) * 100;
            if (dif > 10) {
                var objetivo = Math.round(promedio * 1.05);
                cambios.push({
                    sku: sku, descripcion: p.descripcion, motivo: 'Competencia',
                    costo: p.costoActual, precioActual: p.precioActual, precioSugerido: objetivo,
                    estadoAjuste: 'Pendiente',
                    explicacion: 'Precio ' + Utils.formatPercent(dif) + ' sobre mercado. Objetivo: quedar 5% sobre promedio.'
                });
            }
        });
        // Over stock
        AppData.productos.filter(function(p) { return p.estadoAlerta === 'sobre_stock'; }).forEach(function(p) {
            var reduccion = Math.round(p.precioActual * 0.90);
            cambios.push({
                sku: p.sku, descripcion: p.descripcion, motivo: 'Sobre stock',
                costo: p.costoActual, precioActual: p.precioActual, precioSugerido: reduccion,
                estadoAjuste: 'Pendiente',
                explicacion: 'Inventario alto (' + p.inventario + ' uds). Reducción 10% sugerida.'
            });
        });
        // Low margin
        AppData.productos.filter(function(p) { return p.estadoAlerta === 'margen_bajo' && p.precioActual > 0; }).forEach(function(p) {
            var nuevo = Math.round(p.costoActual * 1.40);
            cambios.push({
                sku: p.sku, descripcion: p.descripcion, motivo: 'Margen bajo',
                costo: p.costoActual, precioActual: p.precioActual, precioSugerido: nuevo,
                estadoAjuste: 'Pendiente',
                explicacion: 'Margen actual: ' + Utils.formatPercent(Utils.calcMargen(p.costoActual, p.precioActual)) + '. Ajuste para alcanzar 40% markup.'
            });
        });
        return cambios;
    }

    function aplicarCambio(idx) {
        var cambios = generarCambiosIA();
        var c = cambios[idx];
        if (!c || c.estadoAjuste !== 'Pendiente') return;
        var p = AppData.getProducto(c.sku);
        if (!p) return;
        if (Utils.puedeAplicarAutomaticamente(p, c.precioSugerido)) {
            Utils.API.pos.actualizarPrecio(c.sku, c.precioSugerido);
            p.precioActual = c.precioSugerido;
            AppData.addBitacora({ tipo: 'Ajuste IA', sku: c.sku, descripcion: 'Precio ajustado por IA: ' + Utils.formatCurrency(c.precioSugerido) + '. Motivo: ' + c.motivo });
            Utils.showToast('Precio de ' + c.sku + ' actualizado a ' + Utils.formatCurrency(c.precioSugerido), 'success');
        } else {
            AppData.solicitudesAprobacion.push({ id: 'APR-' + (AppData.solicitudesAprobacion.length + 1).toString().padStart(3, '0'), sku: c.sku, motivo: c.motivo, accion: 'Ajustar precio', precioActual: c.precioActual, precioPropuesto: c.precioSugerido, margen: Utils.calcMargen(c.costo, c.precioSugerido), regla: 'Requiere aprobación por reglas', solicitante: 'Motor IA', fecha: new Date().toISOString().slice(0, 10), estado: 'Pendiente' });
            Utils.showToast(c.sku + ' enviado a aprobación (no cumple reglas de auto-aplicación)', 'warning');
        }
        // Re-render
        document.getElementById('contentArea').innerHTML = render();
    }

    function aplicarTodosPendientes() {
        var cambios = generarCambiosIA();
        var aplicados = 0;
        var aprobacion = 0;
        cambios.forEach(function(c) {
            if (c.estadoAjuste !== 'Pendiente') return;
            var p = AppData.getProducto(c.sku);
            if (!p) return;
            if (Utils.puedeAplicarAutomaticamente(p, c.precioSugerido)) {
                Utils.API.pos.actualizarPrecio(c.sku, c.precioSugerido);
                p.precioActual = c.precioSugerido;
                aplicados++;
            } else {
                aprobacion++;
            }
        });
        AppData.addBitacora({ tipo: 'Ajuste masivo', sku: '-', descripcion: aplicados + ' aplicados, ' + aprobacion + ' requieren aprobación' });
        Utils.showToast(aplicados + ' aplicado(s), ' + aprobacion + ' requiere(n) aprobación', aplicados > 0 ? 'success' : 'warning');
        document.getElementById('contentArea').innerHTML = render();
    }

    function verDetalleIA(idx) {
        var cambios = generarCambiosIA();
        var c = cambios[idx];
        if (!c) return;
        var margenNuevo = Utils.calcMargen(c.costo, c.precioSugerido);
        var markupNuevo = Utils.calcMarkup(c.costo, c.precioSugerido);
        var variacion = c.precioActual > 0 ? ((c.precioSugerido - c.precioActual) / c.precioActual * 100) : 0;

        var body = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:16px;">';
        body += miniCard('Precio Actual', Utils.formatCurrency(c.precioActual), '#546e7a');
        body += miniCard('Precio Sugerido', Utils.formatCurrency(c.precioSugerido), '#1a73e8');
        body += miniCard('Variación', (variacion > 0 ? '+' : '') + variacion.toFixed(1) + '%', variacion > 0 ? '#2e7d32' : '#c62828');
        body += miniCard('Costo', Utils.formatCurrency(c.costo), '#546e7a');
        body += miniCard('Markup Nuevo', Utils.formatPercent(markupNuevo), '#546e7a');
        body += miniCard('Margen Nuevo', Utils.formatPercent(margenNuevo), margenNuevo < 15 ? '#c62828' : '#2e7d32');
        body += '</div>';
        body += '<div style="padding:12px;background:#f8fafc;border-radius:6px;border-left:3px solid #1a73e8;margin-bottom:12px;">';
        body += '<strong style="font-size:12px;">Motivo:</strong> ' + c.motivo + '<br>';
        body += '<strong style="font-size:12px;">Explicación IA:</strong> ' + c.explicacion;
        body += '</div>';
        body += '<div style="padding:8px 12px;background:' + (c.estadoAjuste === 'Pendiente' ? '#fff8e1' : c.estadoAjuste === 'Aplicado' ? '#e8f5e9' : '#e3f2fd') + ';border-radius:6px;font-size:12px;">';
        body += '<strong>Estado:</strong> ' + c.estadoAjuste;
        body += '</div>';
        Utils.showModal('Detalle Ajuste IA: ' + c.sku, body);
    }

    function miniCard(label, value, color) {
        return '<div style="padding:10px;background:#fff;border-radius:6px;border-left:3px solid ' + color + ';text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);"><div style="font-size:10px;color:#7f8c8d;">' + label + '</div><div style="font-size:16px;font-weight:700;color:' + color + ';margin-top:2px;">' + value + '</div></div>';
    }

    function abrirSolicitud() {
        var body = '<div style="margin-bottom:16px;">';
        body += '<label class="form-label">Buscar producto (SKU o nombre)</label>';
        body += '<input type="text" class="form-control" id="ajBuscarProd" placeholder="Escriba para buscar..." oninput="AjustesView.autocompletar()">';
        body += '<div id="ajSugerencias" style="max-height:120px;overflow-y:auto;border:1px solid #e0e6ed;border-radius:6px;display:none;margin-top:4px;"></div>';
        body += '<input type="hidden" id="ajSkuSeleccionado">';
        body += '</div>';
        body += '<div id="ajInfoProducto"></div>';
        body += '<div class="form-row" style="margin-top:12px;">';
        body += '<div class="form-group"><label class="form-label">Costo del producto</label><input type="number" class="form-control" id="ajCosto" placeholder="0"></div>';
        body += '<div class="form-group"><label class="form-label">Precio sugerido</label><input type="number" class="form-control" id="ajPrecioSugerido" placeholder="0"></div>';
        body += '<div class="form-group"><label class="form-label">Motivo</label><select class="form-control" id="ajMotivo"><option value="">Seleccionar...</option>';
        motivos.forEach(function(m) { body += '<option value="' + m + '">' + m + '</option>'; });
        body += '</select></div>';
        body += '</div>';
        var footer = '<button class="btn btn-primary" onclick="AjustesView.guardarSolicitud()">Guardar solicitud</button> <button class="btn btn-outline" onclick="Utils.closeModal()">Cancelar</button>';
        Utils.showModal('Nueva Solicitud de Ajuste de Precio', body, footer);
    }

    function autocompletar() {
        var query = (document.getElementById('ajBuscarProd').value || '').toLowerCase();
        var container = document.getElementById('ajSugerencias');
        if (query.length < 2) { container.style.display = 'none'; return; }
        var resultados = AppData.productos.filter(function(p) {
            return p.sku.toLowerCase().indexOf(query) > -1 || p.descripcion.toLowerCase().indexOf(query) > -1;
        }).slice(0, 8);
        if (resultados.length === 0) { container.style.display = 'none'; return; }
        var html = '';
        resultados.forEach(function(p) {
            html += '<div style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f0f2f5;font-size:12px;" onmouseover="this.style.background=\'#e3f2fd\'" onmouseout="this.style.background=\'#fff\'" onclick="AjustesView.seleccionarProducto(\'' + p.sku + '\')">';
            html += '<strong>' + p.sku + '</strong> - ' + p.descripcion + ' <span style="color:#7f8c8d;">(' + Utils.formatCurrency(p.precioActual) + ')</span>';
            html += '</div>';
        });
        container.innerHTML = html;
        container.style.display = 'block';
    }

    function seleccionarProducto(sku) {
        var p = AppData.getProducto(sku);
        if (!p) return;
        document.getElementById('ajBuscarProd').value = p.sku + ' - ' + p.descripcion;
        document.getElementById('ajSkuSeleccionado').value = sku;
        document.getElementById('ajSugerencias').style.display = 'none';
        document.getElementById('ajCosto').value = p.costoActual;
        // Show product info
        var info = '<div style="padding:10px;background:#f8fafc;border-radius:6px;font-size:12px;margin-bottom:8px;">';
        info += '<strong>Precio actual:</strong> ' + Utils.formatCurrency(p.precioActual) + ' | <strong>Markup:</strong> ' + Utils.formatPercent(Utils.calcMarkup(p.costoActual, p.precioActual)) + ' | <strong>Inventario:</strong> ' + p.inventario + ' | <strong>Estado:</strong> ' + p.estado;
        info += '</div>';
        document.getElementById('ajInfoProducto').innerHTML = info;
    }

    function guardarSolicitud() {
        var sku = document.getElementById('ajSkuSeleccionado').value;
        var costo = parseFloat(document.getElementById('ajCosto').value) || 0;
        var precio = parseFloat(document.getElementById('ajPrecioSugerido').value) || 0;
        var motivo = document.getElementById('ajMotivo').value;
        if (!sku || !motivo || precio <= 0) { Utils.showToast('Complete producto, motivo y precio sugerido', 'error'); return; }
        var p = AppData.getProducto(sku);
        var ajuste = { sku: sku, costo: costo, precioActual: p ? p.precioActual : 0, precioSolicitado: precio, motivo: motivo, estado: 'Pendiente', fecha: new Date().toISOString().slice(0, 10) };
        AppData.ajustesPrecio.push(ajuste);
        AppData.addBitacora({ tipo: 'Ajuste manual', sku: sku, descripcion: 'Solicitud manual: ' + motivo + '. Precio: ' + Utils.formatCurrency(precio) });
        Utils.closeModal();
        Utils.showToast('Solicitud registrada para ' + sku, 'success');
        document.getElementById('contentArea').innerHTML = render();
    }

    return { render: render, abrirSolicitud: abrirSolicitud, autocompletar: autocompletar, seleccionarProducto: seleccionarProducto, guardarSolicitud: guardarSolicitud, aplicarCambio: aplicarCambio, aplicarTodosPendientes: aplicarTodosPendientes, verDetalleIA: verDetalleIA };
})();
