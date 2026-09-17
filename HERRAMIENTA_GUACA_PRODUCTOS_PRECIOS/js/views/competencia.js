// ===== MONITOREO DE COMPETENCIA VIEW =====
var CompetenciaView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Monitoreo de Competencia</h2>';
        html += '<p class="section-subtitle">Comparar precios de La Guaca contra mercado. Regla: >10% sobre mercado = alerta roja. >15% bajo mercado = alerta amarilla.</p>';
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary" onclick="CompetenciaView.buscar()">Buscar precios de competencia</button>';
        html += '<button class="btn btn-outline" onclick="CompetenciaView.exportar()">Exportar CSV</button>';
        html += '</div>';
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Comparativo de Precios vs Mercado</span></div>';
        html += '<div class="table-wrapper"><table><thead><tr>';
        html += '<th>SKU</th><th>Producto</th><th>Precio Guaca</th><th>Promedio Mercado</th><th>Mín. Mercado</th><th>Máx. Mercado</th><th>Dif. % vs Mercado</th><th>Estado</th><th>Acción</th><th>Acciones</th>';
        html += '</tr></thead><tbody id="compBody">';
        html += renderRows();
        html += '</tbody></table></div></div>';
        return html;
    }

    function getAnalisis() {
        var resultados = [];
        var skus = [...new Set(AppData.preciosCompetencia.map(function(c) { return c.sku; }))];
        skus.forEach(function(sku) {
            var p = AppData.getProducto(sku);
            if (!p) return;
            var precios = AppData.preciosCompetencia.filter(function(c) { return c.sku === sku; });
            var valores = precios.map(function(c) { return c.precioComp; });
            var promedio = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
            var min = Math.min.apply(null, valores);
            var max = Math.max.apply(null, valores);
            var dif = ((p.precioActual - promedio) / promedio) * 100;
            var estado = 'Dentro de rango';
            var accion = 'Mantener precio';
            if (dif > AppData.parametros.porcentajeSobreMercado) {
                estado = 'Sobreprecio';
                var precioObjetivo = promedio * (1 + AppData.parametros.porcentajePermitidoSobreMercado / 100);
                accion = 'Reducir ' + Utils.formatCurrency(p.precioActual - precioObjetivo);
            } else if (dif < -AppData.parametros.porcentajeBajoMercado) {
                estado = 'Muy bajo';
                accion = 'Evaluar aumento';
            }
            resultados.push({ sku: sku, producto: p, promedio: promedio, min: min, max: max, dif: dif, estado: estado, accion: accion, precios: precios });
        });
        return resultados;
    }

    function renderRows() {
        var analisis = getAnalisis();
        var html = '';
        analisis.forEach(function(a) {
            var badgeClass = a.estado === 'Sobreprecio' ? 'badge-red' : (a.estado === 'Muy bajo' ? 'badge-yellow' : 'badge-green');
            html += '<tr>';
            html += '<td><strong>' + a.sku + '</strong></td>';
            html += '<td>' + a.producto.descripcion + '</td>';
            html += '<td>' + Utils.formatCurrency(a.producto.precioActual) + '</td>';
            html += '<td>' + Utils.formatCurrency(a.promedio) + '</td>';
            html += '<td>' + Utils.formatCurrency(a.min) + '</td>';
            html += '<td>' + Utils.formatCurrency(a.max) + '</td>';
            html += '<td><span class="badge ' + badgeClass + '">' + Utils.formatPercent(a.dif) + '</span></td>';
            html += '<td><span class="badge ' + badgeClass + '">' + a.estado + '</span></td>';
            html += '<td>' + a.accion + '</td>';
            html += '<td><button class="btn btn-sm btn-outline" onclick="CompetenciaView.verDetalle(\'' + a.sku + '\')">Detalle</button></td>';
            html += '</tr>';
        });
        if (html === '') html = '<tr><td colspan="10" class="text-center">Sin datos de competencia. Use Investigación de Mercado para registrar precios.</td></tr>';
        return html;
    }

    function buscar() {
        Utils.showToast('Búsqueda de competencia ejecutada. ' + getAnalisis().length + ' productos comparados.', 'info');
    }

    function verDetalle(sku) {
        var a = getAnalisis().find(function(x) { return x.sku === sku; });
        if (!a) return;
        var body = '<div class="result-box"><h4>Detalle Competencia: ' + sku + '</h4>';
        body += '<div class="result-item"><span class="result-label">Precio La Guaca</span><span class="result-value">' + Utils.formatCurrency(a.producto.precioActual) + '</span></div>';
        body += '<div class="result-item"><span class="result-label">Promedio mercado</span><span class="result-value">' + Utils.formatCurrency(a.promedio) + '</span></div>';
        body += '<div class="result-item"><span class="result-label">Diferencia</span><span class="result-value">' + Utils.formatPercent(a.dif) + '</span></div>';
        body += '<div class="result-item"><span class="result-label">Estado</span><span class="result-value"><span class="badge ' + (a.estado === 'Sobreprecio' ? 'badge-red' : a.estado === 'Muy bajo' ? 'badge-yellow' : 'badge-green') + '">' + a.estado + '</span></span></div>';
        body += '</div><h4 style="margin-top:16px;">Precios por Competidor</h4><table style="width:100%;margin-top:8px;"><thead><tr><th>Competidor</th><th>Precio</th><th>Fuente</th><th>Fecha</th><th>Confianza</th></tr></thead><tbody>';
        a.precios.forEach(function(pr) {
            body += '<tr><td>' + pr.competidor + '</td><td>' + Utils.formatCurrency(pr.precioComp) + '</td><td>' + pr.fuente + '</td><td>' + pr.fecha + '</td><td>' + pr.confianza + '</td></tr>';
        });
        body += '</tbody></table>';
        Utils.showModal('Competencia: ' + sku, body);
    }

    function exportar() {
        var analisis = getAnalisis();
        var headers = ['SKU','Producto','Precio Guaca','Promedio Mercado','Diferencia %','Estado','Acción'];
        var rows = analisis.map(function(a) { return [a.sku, a.producto.descripcion, a.producto.precioActual, Math.round(a.promedio), a.dif.toFixed(2), a.estado, a.accion]; });
        Utils.exportCSV(headers, rows, 'competencia.csv');
        Utils.showToast('CSV exportado', 'success');
    }

    return { render: render, buscar: buscar, verDetalle: verDetalle, exportar: exportar };
})();
