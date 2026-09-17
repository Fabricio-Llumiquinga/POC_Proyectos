// ===== APROBACIONES VIEW =====
// Solo productos nuevos (código nuevo y usados con código nuevo)
var AprobacionesView = (function() {
    'use strict';

    function getSolicitudesNuevos() {
        return AppData.solicitudesAprobacion.filter(function(s) {
            return s.motivo === 'Producto con código nuevo' || s.motivo === 'Producto usado con código nuevo';
        });
    }

    function render() {
        var solicitudes = getSolicitudesNuevos();
        var pendientes = solicitudes.filter(function(s) { return s.estado === 'Pendiente'; }).length;
        var aprobados = solicitudes.filter(function(s) { return s.estado === 'Aprobado'; }).length;
        var rechazados = solicitudes.filter(function(s) { return s.estado === 'Rechazado'; }).length;

        var html = '<h2 class="section-title">Aprobaciones - Productos Nuevos</h2>';
        html += '<p class="section-subtitle">Bandeja exclusiva para aprobar o rechazar productos con código nuevo (nuevos y usados). Los ajustes de precio se gestionan desde Ajustes de Precio.</p>';

        // KPIs
        html += '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + solicitudes.length + '</div><div class="kpi-label">Total solicitudes</div></div>';
        html += '<div class="kpi-card yellow"><div class="kpi-value">' + pendientes + '</div><div class="kpi-label">Pendientes</div></div>';
        html += '<div class="kpi-card green"><div class="kpi-value">' + aprobados + '</div><div class="kpi-label">Aprobados</div></div>';
        html += '<div class="kpi-card red"><div class="kpi-value">' + rechazados + '</div><div class="kpi-label">Rechazados</div></div>';
        html += '</div>';

        // Filter
        html += '<div class="filters-bar" style="flex-wrap:nowrap;">';
        html += '<select class="filter-input" id="aprFiltroEstado" onchange="AprobacionesView.filtrar()"><option value="">Todos los estados</option><option value="Pendiente">Pendiente</option><option value="Aprobado">Aprobado</option><option value="Rechazado">Rechazado</option></select>';
        html += '<select class="filter-input" id="aprFiltroTipo" onchange="AprobacionesView.filtrar()"><option value="">Todos los tipos</option><option value="Producto con código nuevo">Producto nuevo</option><option value="Producto usado con código nuevo">Producto usado</option></select>';
        html += '<input type="text" class="filter-input" id="aprFiltroBuscar" placeholder="Buscar SKU..." onkeyup="AprobacionesView.filtrar()">';
        html += '</div>';

        // Table
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Solicitudes de Productos Nuevos (' + pendientes + ' pendientes)</span></div>';
        html += '<div class="table-wrapper"><table class="table-compact"><thead><tr>';
        html += '<th>ID</th><th>SKU</th><th>Tipo</th><th>Precio Propuesto</th><th>Margen</th><th>Regla</th><th>Solicitante</th><th>Fecha</th><th>Estado</th><th>Acciones</th>';
        html += '</tr></thead><tbody id="aprBody">';
        html += renderRows(solicitudes);
        html += '</tbody></table></div></div>';
        return html;
    }

    function renderRows(solicitudes) {
        var html = '';
        if (solicitudes.length === 0) {
            return '<tr><td colspan="10" class="text-center">Sin solicitudes de productos nuevos</td></tr>';
        }
        solicitudes.forEach(function(s) {
            var badgeClass = s.estado === 'Pendiente' ? 'badge-yellow' : (s.estado === 'Aprobado' ? 'badge-green' : 'badge-red');
            var tipoLabel = s.motivo === 'Producto usado con código nuevo' ? '<span class="badge badge-blue">Usado</span>' : '<span class="badge badge-green">Nuevo</span>';
            html += '<tr>';
            html += '<td><strong>' + s.id + '</strong></td>';
            html += '<td><strong>' + s.sku + '</strong></td>';
            html += '<td>' + tipoLabel + '</td>';
            html += '<td><strong>' + Utils.formatCurrency(s.precioPropuesto) + '</strong></td>';
            html += '<td>' + Utils.formatPercent(s.margen) + '</td>';
            html += '<td style="font-size:11px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + s.regla + '">' + s.regla + '</td>';
            html += '<td>' + s.solicitante + '</td>';
            html += '<td>' + s.fecha + '</td>';
            html += '<td><span class="badge ' + badgeClass + '">' + s.estado + '</span></td>';
            html += '<td class="actions-cell">';
            if (s.estado === 'Pendiente') {
                html += '<button class="btn btn-sm btn-success" onclick="AprobacionesView.aprobar(\'' + s.id + '\')">Aprobar</button> ';
                html += '<button class="btn btn-sm btn-danger" onclick="AprobacionesView.rechazar(\'' + s.id + '\')">Rechazar</button> ';
            }
            html += '<button class="btn btn-sm btn-outline" onclick="AprobacionesView.verDetalle(\'' + s.id + '\')">Detalle</button>';
            html += '</td></tr>';
        });
        return html;
    }

    function filtrar() {
        var estado = document.getElementById('aprFiltroEstado').value;
        var tipo = document.getElementById('aprFiltroTipo').value;
        var buscar = (document.getElementById('aprFiltroBuscar').value || '').toLowerCase();
        var filtered = getSolicitudesNuevos().filter(function(s) {
            if (estado && s.estado !== estado) return false;
            if (tipo && s.motivo !== tipo) return false;
            if (buscar && s.sku.toLowerCase().indexOf(buscar) === -1) return false;
            return true;
        });
        document.getElementById('aprBody').innerHTML = renderRows(filtered);
    }

    function aprobar(id) {
        var sol = AppData.solicitudesAprobacion.find(function(s) { return s.id === id; });
        if (!sol) return;
        sol.estado = 'Aprobado';
        var p = AppData.getProducto(sol.sku);
        if (p && sol.precioPropuesto > 0) {
            p.precioActual = sol.precioPropuesto;
            p.estado = 'Activo';
            Utils.API.pos.actualizarPrecio(sol.sku, sol.precioPropuesto);
        }
        AppData.addBitacora({ tipo: 'Aprobación', sku: sol.sku, descripcion: 'Producto nuevo aprobado. Precio: ' + Utils.formatCurrency(sol.precioPropuesto) });
        document.getElementById('aprBody').innerHTML = renderRows(getSolicitudesNuevos());
        Utils.showToast('Producto ' + sol.sku + ' aprobado y enviado a punto de venta', 'success');
    }

    function rechazar(id) {
        var sol = AppData.solicitudesAprobacion.find(function(s) { return s.id === id; });
        if (!sol) return;
        sol.estado = 'Rechazado';
        AppData.addBitacora({ tipo: 'Aprobación', sku: sol.sku, descripcion: 'Producto nuevo rechazado: ' + id });
        document.getElementById('aprBody').innerHTML = renderRows(getSolicitudesNuevos());
        Utils.showToast('Solicitud ' + id + ' rechazada', 'warning');
    }

    function verDetalle(id) {
        var sol = AppData.solicitudesAprobacion.find(function(s) { return s.id === id; });
        if (!sol) return;
        var p = AppData.getProducto(sol.sku);
        var body = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:16px;">';
        body += miniCard('SKU', sol.sku, '#1a73e8');
        body += miniCard('Precio Propuesto', Utils.formatCurrency(sol.precioPropuesto), '#2e7d32');
        body += miniCard('Margen', Utils.formatPercent(sol.margen), '#546e7a');
        body += miniCard('Estado', sol.estado, sol.estado === 'Pendiente' ? '#e65100' : '#2e7d32');
        body += '</div>';
        if (p) {
            body += '<div style="padding:12px;background:#f8fafc;border-radius:6px;margin-bottom:12px;font-size:12px;">';
            body += '<strong>Descripción:</strong> ' + p.descripcion + '<br>';
            body += '<strong>Marca:</strong> ' + p.marca + ' | <strong>Categoría:</strong> ' + p.categoria + '<br>';
            body += '<strong>Condición:</strong> ' + p.condicion + ' | <strong>Origen:</strong> ' + p.origen + '<br>';
            body += '<strong>Calidad:</strong> ' + p.rangoCalidad + ' | <strong>Inventario:</strong> ' + p.inventario;
            body += '</div>';
        }
        body += '<div style="padding:10px;background:#fff8e1;border-radius:6px;border-left:3px solid #ff9800;font-size:12px;">';
        body += '<strong>Motivo:</strong> ' + sol.motivo + '<br>';
        body += '<strong>Regla:</strong> ' + sol.regla + '<br>';
        body += '<strong>Solicitante:</strong> ' + sol.solicitante + ' | <strong>Fecha:</strong> ' + sol.fecha;
        body += '</div>';
        Utils.showModal('Detalle Aprobación: ' + sol.id, body);
    }

    function miniCard(label, value, color) {
        return '<div style="padding:10px;background:#fff;border-radius:6px;border-left:3px solid ' + color + ';text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);"><div style="font-size:10px;color:#7f8c8d;">' + label + '</div><div style="font-size:15px;font-weight:700;color:' + color + ';margin-top:2px;">' + value + '</div></div>';
    }

    return { render: render, filtrar: filtrar, aprobar: aprobar, rechazar: rechazar, verDetalle: verDetalle };
})();
