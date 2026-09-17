// ===== API PUNTO DE VENTA VIEW =====
var ApiPosView = (function() {
    'use strict';

    function render() {
        var aplicados = AppData.logApiPos.filter(function(l) { return l.estado === 'Aplicado en punto de venta'; }).length;
        var pendientes = AppData.logApiPos.filter(function(l) { return l.estado === 'Pendiente de envío'; }).length;
        var errores = AppData.logApiPos.filter(function(l) { return l.estado === 'Error de integración'; }).length;

        var html = '<h2 class="section-title">Aplicación Automática / API Punto de Venta</h2>';
        html += '<p class="section-subtitle">Integración simulada con sistema de punto de venta.</p>';
        html += '<div class="kpi-grid">';
        html += '<div class="kpi-card green"><div class="kpi-value"><span class="status-dot"></span> Online</div><div class="kpi-label">Estado de conexión</div></div>';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + new Date().toLocaleString('es-CO') + '</div><div class="kpi-label">Última sincronización</div></div>';
        html += '<div class="kpi-card green"><div class="kpi-value">' + aplicados + '</div><div class="kpi-label">Cambios aplicados</div></div>';
        html += '<div class="kpi-card yellow"><div class="kpi-value">' + pendientes + '</div><div class="kpi-label">Cambios pendientes</div></div>';
        html += '<div class="kpi-card red"><div class="kpi-value">' + errores + '</div><div class="kpi-label">Cambios con error</div></div>';
        html += '</div>';
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary" onclick="ApiPosView.consultarProductos()">Consultar productos</button>';
        html += '<button class="btn btn-outline" onclick="ApiPosView.consultarPrecios()">Consultar precios actuales</button>';
        html += '<button class="btn btn-success" onclick="ApiPosView.enviarAprobados()">Enviar cambios aprobados</button>';
        html += '<button class="btn btn-warning" onclick="ApiPosView.reprocesar()">Reprocesar errores</button>';
        html += '</div>';
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Log de Integración API</span>';
        html += '<span class="badge badge-blue">Endpoints simulados: GET/POST /api/pos/*</span></div>';
        html += '<div class="table-wrapper"><table><thead><tr>';
        html += '<th>ID</th><th>SKU</th><th>Acción</th><th>Precio Anterior</th><th>Precio Nuevo</th><th>Estado</th><th>Fecha</th><th>Usuario</th>';
        html += '</tr></thead><tbody id="apiBody">';
        html += renderRows();
        html += '</tbody></table></div></div>';
        return html;
    }

    function renderRows() {
        var html = '';
        AppData.logApiPos.forEach(function(l) {
            var badgeClass = l.estado === 'Aplicado en punto de venta' ? 'badge-green' : (l.estado === 'Error de integración' ? 'badge-red' : 'badge-yellow');
            html += '<tr><td>' + l.id + '</td><td>' + l.sku + '</td><td>' + l.accion + '</td><td>' + Utils.formatCurrency(l.precioAnterior) + '</td><td>' + Utils.formatCurrency(l.precioNuevo) + '</td><td><span class="badge ' + badgeClass + '">' + l.estado + '</span></td><td>' + l.fecha + '</td><td>' + l.usuario + '</td></tr>';
        });
        return html;
    }

    function consultarProductos() {
        Utils.API.pos.getProductos().then(function(prods) {
            Utils.showToast('GET /api/pos/productos - ' + prods.length + ' productos consultados', 'info');
        });
    }

    function consultarPrecios() {
        Utils.showToast('GET /api/pos/productos/{sku}/precio - Precios consultados exitosamente', 'info');
    }

    function enviarAprobados() {
        var aprobados = AppData.solicitudesAprobacion.filter(function(s) { return s.estado === 'Aprobado'; });
        var enviados = 0;
        aprobados.forEach(function(s) {
            var p = AppData.getProducto(s.sku);
            if (p && s.precioPropuesto > 0) {
                var yaEnviado = AppData.logApiPos.find(function(l) { return l.sku === s.sku && l.precioNuevo === s.precioPropuesto && l.estado === 'Aplicado en punto de venta'; });
                if (!yaEnviado) {
                    Utils.API.pos.actualizarPrecio(s.sku, s.precioPropuesto);
                    enviados++;
                }
            }
        });
        document.getElementById('apiBody').innerHTML = renderRows();
        Utils.showToast('POST /api/pos/precios/actualizar - ' + enviados + ' cambio(s) enviado(s)', 'success');
    }

    function reprocesar() {
        var errores = AppData.logApiPos.filter(function(l) { return l.estado === 'Error de integración'; });
        errores.forEach(function(l) {
            Utils.API.pos.reprocesar(l.id);
        });
        document.getElementById('apiBody').innerHTML = renderRows();
        Utils.showToast('POST /api/pos/precios/{id}/reprocesar - ' + errores.length + ' error(es) reprocesado(s)', 'success');
    }

    return { render: render, consultarProductos: consultarProductos, consultarPrecios: consultarPrecios, enviarAprobados: enviarAprobados, reprocesar: reprocesar };
})();
