// ===== HISTÓRICO Y TENDENCIA VIEW =====
var HistoricoView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Histórico y Tendencia</h2>';
        html += '<div class="filters-bar">';
        html += '<input type="text" class="filter-input" id="histBuscar" placeholder="Buscar SKU o descripción...">';
        html += '<button class="btn btn-primary btn-sm" onclick="HistoricoView.buscar()">Buscar</button>';
        html += '</div>';
        html += '<div id="histResultado">';
        html += renderProducto('LG-001');
        html += '</div>';
        return html;
    }

    function renderProducto(sku) {
        var p = AppData.getProducto(sku);
        if (!p) return '<div class="result-box"><p>Producto no encontrado. Intente con otro SKU.</p></div>';
        var hist = AppData.getHistorico(sku);
        var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
        var margen = Utils.calcMargen(p.costoActual, p.precioActual);

        var html = '<div class="form-card"><div class="form-card-title">Resumen: ' + p.sku + ' - ' + p.descripcion + '</div>';
        html += '<div class="form-row">';
        html += item('SKU', p.sku) + item('Condición', p.condicion) + item('Tipo ingreso', p.tipoIngreso);
        html += item('Costo actual', Utils.formatCurrency(p.costoActual)) + item('Precio actual', Utils.formatCurrency(p.precioActual));
        html += item('Markup', Utils.formatPercent(markup)) + item('Margen', Utils.formatPercent(margen));
        html += item('Inventario', p.inventario) + item('Rotación', p.rotacion);
        html += item('Última evaluación', p.ultimaEvaluacion || 'Sin evaluar');
        html += '</div></div>';

        // Line chart
        if (hist.length > 0) {
            html += renderLineChart(hist);
        }

        // Table
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Tabla Histórica</span></div>';
        html += '<div class="table-wrapper"><table><thead><tr><th>Fecha</th><th>Costo</th><th>Precio</th><th>Markup</th><th>Margen</th><th>Precio Mercado</th><th>Acción</th><th>Usuario</th></tr></thead><tbody>';
        if (hist.length > 0) {
            hist.forEach(function(h) {
                html += '<tr><td>' + h.fecha + '</td><td>' + Utils.formatCurrency(h.costo) + '</td><td>' + Utils.formatCurrency(h.precio) + '</td><td>' + Utils.formatPercent(h.markup) + '</td><td>' + Utils.formatPercent(h.margen) + '</td><td>' + Utils.formatCurrency(h.precioMercado) + '</td><td>' + h.accion + '</td><td>' + h.usuario + '</td></tr>';
            });
        } else {
            html += '<tr><td colspan="8" class="text-center">Sin historial registrado para este producto</td></tr>';
        }
        html += '</tbody></table></div></div>';

        return html;
    }

    function renderLineChart(hist) {
        var chartW = 700;
        var chartH = 220;
        var padL = 60;
        var padR = 20;
        var padT = 20;
        var padB = 40;
        var drawW = chartW - padL - padR;
        var drawH = chartH - padT - padB;

        var maxVal = Math.max.apply(null, hist.map(function(h) { return Math.max(h.precio, h.costo); }));
        var minVal = Math.min.apply(null, hist.map(function(h) { return Math.min(h.costo, h.precio); })) * 0.85;
        var maxMargen = Math.max.apply(null, hist.map(function(h) { return h.margen; }));
        var range = maxVal - minVal || 1;

        function x(i) { return padL + (i / (hist.length - 1 || 1)) * drawW; }
        function yPrice(val) { return padT + drawH - ((val - minVal) / range) * drawH; }
        function yMargen(val) { return padT + drawH - (val / (maxMargen * 1.3 || 1)) * drawH; }

        // Build SVG paths
        var precioPts = hist.map(function(h, i) { return x(i) + ',' + yPrice(h.precio); }).join(' ');
        var costoPts = hist.map(function(h, i) { return x(i) + ',' + yPrice(h.costo); }).join(' ');
        var margenPts = hist.map(function(h, i) { return x(i) + ',' + yMargen(h.margen); }).join(' ');

        var svg = '<div class="chart-card" style="margin-bottom:24px;">';
        svg += '<div class="chart-title">Tendencia: Precio, Costo y Margen</div>';
        svg += '<div style="display:flex;gap:16px;margin-bottom:10px;font-size:11px;">';
        svg += '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:3px;background:#4caf50;display:inline-block;border-radius:2px;"></span> Precio</span>';
        svg += '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:3px;background:#ff9800;display:inline-block;border-radius:2px;"></span> Costo</span>';
        svg += '<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:3px;background:#f44336;display:inline-block;border-radius:2px;"></span> Margen %</span>';
        svg += '</div>';
        svg += '<svg width="100%" viewBox="0 0 ' + chartW + ' ' + chartH + '" style="max-width:100%;height:auto;">';

        // Grid lines
        for (var g = 0; g <= 4; g++) {
            var gy = padT + (drawH / 4) * g;
            var label = Math.round(maxVal - (range / 4) * g);
            svg += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (chartW - padR) + '" y2="' + gy + '" stroke="#e0e6ed" stroke-width="1"/>';
            svg += '<text x="' + (padL - 5) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="9" fill="#7f8c8d">$' + (label / 1000).toFixed(0) + 'k</text>';
        }

        // X labels
        hist.forEach(function(h, i) {
            svg += '<text x="' + x(i) + '" y="' + (chartH - 10) + '" text-anchor="middle" font-size="9" fill="#7f8c8d">' + h.fecha.slice(5) + '</text>';
        });

        // Lines
        svg += '<polyline points="' + precioPts + '" fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linejoin="round"/>';
        svg += '<polyline points="' + costoPts + '" fill="none" stroke="#ff9800" stroke-width="2.5" stroke-linejoin="round"/>';
        svg += '<polyline points="' + margenPts + '" fill="none" stroke="#f44336" stroke-width="2" stroke-dasharray="4,3" stroke-linejoin="round"/>';

        // Dots
        hist.forEach(function(h, i) {
            svg += '<circle cx="' + x(i) + '" cy="' + yPrice(h.precio) + '" r="4" fill="#4caf50"/>';
            svg += '<circle cx="' + x(i) + '" cy="' + yPrice(h.costo) + '" r="4" fill="#ff9800"/>';
            svg += '<circle cx="' + x(i) + '" cy="' + yMargen(h.margen) + '" r="3" fill="#f44336"/>';
        });

        svg += '</svg></div>';
        return svg;
    }

    function item(label, value) {
        return '<div class="form-group"><span class="form-label">' + label + '</span><div style="font-weight:500;">' + value + '</div></div>';
    }

    function buscar() {
        var query = document.getElementById('histBuscar').value.trim();
        if (!query) return;
        var found = AppData.productos.find(function(p) { return p.sku.toLowerCase() === query.toLowerCase() || p.descripcion.toLowerCase().indexOf(query.toLowerCase()) > -1; });
        if (found) {
            document.getElementById('histResultado').innerHTML = renderProducto(found.sku);
        } else {
            document.getElementById('histResultado').innerHTML = '<div class="result-box error"><p>Producto no encontrado: "' + query + '"</p></div>';
        }
    }

    return { render: render, buscar: buscar };
})();
