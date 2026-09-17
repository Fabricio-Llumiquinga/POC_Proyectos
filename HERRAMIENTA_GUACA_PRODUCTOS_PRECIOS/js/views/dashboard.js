// ===== DASHBOARD VIEW =====
var DashboardView = (function() {
    'use strict';

    // Filtered products cache
    var filteredProducts = null;

    function getFilteredProducts() {
        if (filteredProducts !== null) return filteredProducts;
        return AppData.productos;
    }

    function render() {
        var prods = AppData.productos;
        var pendAprobacion = AppData.solicitudesAprobacion.filter(function(s) { return s.estado === 'Pendiente'; }).length;
        var cambiosDetectados = AppData.cambiosCosto.length;
        var sobreprecio = prods.filter(function(p) { return p.estadoAlerta === 'sobreprecio'; }).length;
        var bajoMercado = prods.filter(function(p) { return p.estadoAlerta === 'bajo_mercado'; }).length;
        var errores = AppData.logApiPos.filter(function(l) { return l.estado === 'Error de integración'; }).length;
        var alertasActivas = AppData.alertas.length;

        var html = '<h2 class="section-title">Dashboard Ejecutivo</h2>';

        // 6 KPIs de alto impacto en una fila
        html += '<div class="kpi-grid">';
        html += kpi(prods.length, 'Total Productos', 'blue');
        html += kpi(pendAprobacion, 'Pendientes Aprobación', 'yellow');
        html += kpi(cambiosDetectados, 'Cambios de Costo', 'blue');
        html += kpi(sobreprecio + bajoMercado, 'Alertas Competencia', 'red');
        html += kpi(errores, 'Errores Integración', 'red');
        html += kpi(alertasActivas, 'Alertas Activas', 'yellow');
        html += '</div>';

        // Filters bar - una sola línea
        html += '<div class="filters-bar" id="dashFilters" style="flex-wrap:nowrap;overflow-x:auto;">';
        html += '<input type="text" class="filter-input" id="dfCodigo" placeholder="SKU..." onkeyup="DashboardView.filter()" style="min-width:90px;">';
        html += '<select class="filter-input" id="dfMarca" onchange="DashboardView.filter()" style="min-width:100px;"><option value="">Marca</option>';
        var marcas = [...new Set(AppData.productos.map(function(p){return p.marca;}))];
        marcas.forEach(function(m){ html += '<option>' + m + '</option>'; });
        html += '</select>';
        html += '<select class="filter-input" id="dfCategoria" onchange="DashboardView.filter()" style="min-width:100px;"><option value="">Categoría</option>';
        var cats = [...new Set(AppData.productos.map(function(p){return p.categoria;}))];
        cats.forEach(function(c){ html += '<option>' + c + '</option>'; });
        html += '</select>';
        html += '<select class="filter-input" id="dfCondicion" onchange="DashboardView.filter()" style="min-width:90px;"><option value="">Condición</option><option>Nuevo</option><option>Usado</option></select>';
        html += '<select class="filter-input" id="dfEstado" onchange="DashboardView.filter()" style="min-width:90px;"><option value="">Estado</option><option>Activo</option><option>Pendiente</option><option>Liquidación</option></select>';
        html += '<select class="filter-input" id="dfAlerta" onchange="DashboardView.filter()" style="min-width:90px;"><option value="">Alertas</option><option value="si">Con alerta</option><option value="no">Sin alerta</option></select>';
        html += '<select class="filter-input" id="dfLado" onchange="DashboardView.filter()" style="min-width:80px;"><option value="">Lado</option><option value="si">Con lado</option><option value="no">Sin lado</option></select>';
        html += '<select class="filter-input" id="dfCodigoNuevo" onchange="DashboardView.filter()" style="min-width:100px;"><option value="">Ingreso</option><option value="si">Código nuevo</option><option value="no">Existente</option></select>';
        html += '<button class="btn btn-success btn-sm" onclick="DashboardView.exportarExcel()" style="white-space:nowrap;">&#128196; Exportar Excel</button>';
        html += '<button class="btn btn-outline btn-sm" onclick="DashboardView.limpiarFiltros()" style="white-space:nowrap;">Limpiar</button>';
        html += '</div>';

        // Charts - 2 en la primera fila, 1 ancho completo abajo
        html += '<div class="chart-grid">';
        html += renderDistribucionChart();
        html += renderCambiosChart();
        html += '</div>';
        html += renderAlertasChartFull();

        // Alerts table
        html += renderAlertasTable();

        // Products table (filterable)
        html += renderProductosTable(AppData.productos);

        filteredProducts = null;
        return html;
    }

    function kpi(value, label, color) {
        return '<div class="kpi-card ' + color + '"><div class="kpi-value">' + value + '</div><div class="kpi-label">' + label + '</div></div>';
    }

    function renderProductosTable(prods) {
        var html = '<div class="table-container"><div class="table-header"><span class="table-title">Productos (' + prods.length + ' resultados)</span></div>';
        html += '<div class="table-wrapper"><table><thead><tr>';
        html += '<th>SKU</th><th>Descripción</th><th>Marca</th><th>Categoría</th><th>Condición</th><th>Costo</th><th>Precio</th><th>Markup</th><th>Margen</th><th>Inventario</th><th>Rotación</th><th>Estado</th><th>Alerta</th>';
        html += '</tr></thead><tbody id="dashProdBody">';
        html += renderProductRows(prods);
        html += '</tbody></table></div></div>';
        return html;
    }

    function renderProductRows(prods) {
        var html = '';
        prods.forEach(function(p) {
            var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
            var margen = Utils.calcMargen(p.costoActual, p.precioActual);
            html += '<tr>';
            html += '<td><strong>' + p.sku + '</strong></td>';
            html += '<td>' + p.descripcion + '</td>';
            html += '<td>' + p.marca + '</td>';
            html += '<td>' + p.categoria + '</td>';
            html += '<td><span class="badge ' + (p.condicion === 'Usado' ? 'badge-blue' : 'badge-green') + '">' + p.condicion + '</span></td>';
            html += '<td>' + Utils.formatCurrency(p.costoActual) + '</td>';
            html += '<td>' + Utils.formatCurrency(p.precioActual) + '</td>';
            html += '<td>' + Utils.formatPercent(markup) + '</td>';
            html += '<td>' + Utils.formatPercent(margen) + '</td>';
            html += '<td>' + p.inventario + '</td>';
            html += '<td>' + p.rotacion + '</td>';
            html += '<td><span class="badge ' + Utils.getBadgeClass(p.estado) + '">' + p.estado + '</span></td>';
            html += '<td>' + Utils.getAlertBadge(p.estadoAlerta) + '</td>';
            html += '</tr>';
        });
        return html;
    }

    function filter() {
        var codigo = (document.getElementById('dfCodigo').value || '').toLowerCase();
        var marca = document.getElementById('dfMarca').value;
        var categoria = document.getElementById('dfCategoria').value;
        var condicion = document.getElementById('dfCondicion').value;
        var estado = document.getElementById('dfEstado').value;
        var alerta = document.getElementById('dfAlerta').value;
        var lado = document.getElementById('dfLado').value;
        var codigoNuevo = document.getElementById('dfCodigoNuevo').value;

        var filtered = AppData.productos.filter(function(p) {
            if (codigo && p.sku.toLowerCase().indexOf(codigo) === -1 && p.descripcion.toLowerCase().indexOf(codigo) === -1) return false;
            if (marca && p.marca !== marca) return false;
            if (categoria && p.categoria !== categoria) return false;
            if (condicion && p.condicion !== condicion) return false;
            if (estado && p.estado !== estado) return false;
            if (alerta === 'si' && p.estadoAlerta === 'normal') return false;
            if (alerta === 'si' && p.estadoAlerta === 'dentro_rango') return false;
            if (alerta === 'si' && p.estadoAlerta === 'aplicacion_exitosa') return false;
            if (alerta === 'no' && p.estadoAlerta !== 'normal' && p.estadoAlerta !== 'dentro_rango' && p.estadoAlerta !== 'aplicacion_exitosa') return false;
            if (lado === 'si' && !p.tieneLado) return false;
            if (lado === 'no' && p.tieneLado) return false;
            if (codigoNuevo === 'si' && p.tipoIngreso !== 'Código nuevo') return false;
            if (codigoNuevo === 'no' && p.tipoIngreso !== 'Existente') return false;
            return true;
        });

        filteredProducts = filtered;
        var body = document.getElementById('dashProdBody');
        if (body) body.innerHTML = renderProductRows(filtered);
        // Update count in table header
        var container = body ? body.closest('.table-container') : null;
        if (container) {
            var title = container.querySelector('.table-title');
            if (title) title.textContent = 'Productos (' + filtered.length + ' resultados)';
        }
    }

    function limpiarFiltros() {
        document.getElementById('dfCodigo').value = '';
        document.getElementById('dfMarca').value = '';
        document.getElementById('dfCategoria').value = '';
        document.getElementById('dfCondicion').value = '';
        document.getElementById('dfEstado').value = '';
        document.getElementById('dfAlerta').value = '';
        document.getElementById('dfLado').value = '';
        document.getElementById('dfCodigoNuevo').value = '';
        filteredProducts = null;
        var body = document.getElementById('dashProdBody');
        if (body) body.innerHTML = renderProductRows(AppData.productos);
        var container = body ? body.closest('.table-container') : null;
        if (container) {
            var title = container.querySelector('.table-title');
            if (title) title.textContent = 'Productos (' + AppData.productos.length + ' resultados)';
        }
    }

    function exportarExcel() {
        var prods = filteredProducts || AppData.productos;
        var headers = ['SKU', 'Descripción', 'Marca', 'Familia', 'Categoría', 'Copro', 'Tipo Ingreso', 'Condición', 'Origen', 'Calidad', 'Proveedor Actual', 'Proveedor Anterior', 'Costo Actual', 'Precio Actual', 'Markup %', 'Margen %', 'Inventario', 'Rotación', 'Estado', 'Tiene Lado', 'Lado', 'SKU Pareja', 'Última Evaluación', 'Estado Alerta'];
        var rows = prods.map(function(p) {
            var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
            var margen = Utils.calcMargen(p.costoActual, p.precioActual);
            return [p.sku, p.descripcion, p.marca, p.familia, p.categoria, p.copro, p.tipoIngreso, p.condicion, p.origen, p.rangoCalidad, p.proveedorActual, p.proveedorAnterior || '', p.costoActual, p.precioActual, markup.toFixed(1), margen.toFixed(1), p.inventario, p.rotacion, p.estado, p.tieneLado ? 'Sí' : 'No', p.lado, p.skuPareja || '', p.ultimaEvaluacion || '', p.estadoAlerta];
        });
        // Generate Excel-compatible CSV (tab-separated with BOM for Excel)
        var tsv = headers.join('\t') + '\n';
        rows.forEach(function(row) {
            tsv += row.map(function(cell) {
                return String(cell || '').replace(/\t/g, ' ');
            }).join('\t') + '\n';
        });
        var blob = new Blob(['\uFEFF' + tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'productos_la_guaca_' + new Date().toISOString().slice(0, 10) + '.xls';
        link.click();
        Utils.showToast('Archivo Excel exportado: ' + prods.length + ' productos', 'success');
    }

    function renderDistribucionChart() {
        var activos = AppData.productos.filter(function(p) { return p.estado === 'Activo'; }).length;
        var pendientes = AppData.productos.filter(function(p) { return p.estado === 'Pendiente'; }).length;
        var liquidacion = AppData.productos.filter(function(p) { return p.estado === 'Liquidación'; }).length;
        var max = Math.max(activos, pendientes, liquidacion, 1);
        var html = '<div class="chart-card"><div class="chart-title">Distribución por Estado</div><div class="bar-chart">';
        html += bar('Activos', activos, max, '#4caf50');
        html += bar('Pendientes', pendientes, max, '#ff9800');
        html += bar('Liquidación', liquidacion, max, '#9c27b0');
        html += '</div></div>';
        return html;
    }

    function renderCambiosChart() {
        var menos5 = AppData.cambiosCosto.filter(function(c) { return Math.abs(c.variacion) < 5; }).length;
        var entre5y10 = AppData.cambiosCosto.filter(function(c) { var a = Math.abs(c.variacion); return a >= 5 && a <= 10; }).length;
        var mas10 = AppData.cambiosCosto.filter(function(c) { return Math.abs(c.variacion) > 10 && Math.abs(c.variacion) <= 40; }).length;
        var mas40 = AppData.cambiosCosto.filter(function(c) { return Math.abs(c.variacion) > 40; }).length;
        var max = Math.max(menos5, entre5y10, mas10, mas40, 1);
        var html = '<div class="chart-card"><div class="chart-title">Cambios por Variación de Costo</div><div class="bar-chart">';
        html += bar('<5%', menos5, max, '#4caf50');
        html += bar('5-10%', entre5y10, max, '#ff9800');
        html += bar('>10%', mas10, max, '#f44336');
        html += bar('>40%', mas40, max, '#9c27b0');
        html += '</div></div>';
        return html;
    }

    function renderAlertasChartFull() {
        var tipos = {};
        AppData.alertas.forEach(function(a) { tipos[a.tipo] = (tipos[a.tipo] || 0) + 1; });
        var keys = Object.keys(tipos);
        var max = Math.max.apply(null, keys.map(function(k) { return tipos[k]; }).concat([1]));
        var colors = ['#1a73e8', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548', '#607d8b'];
        var html = '<div class="chart-card" style="margin-bottom:24px;"><div class="chart-title">Alertas por Tipo</div><div class="bar-chart" style="height:180px;">';
        keys.forEach(function(k, i) { html += bar(k, tipos[k], max, colors[i % colors.length]); });
        html += '</div></div>';
        return html;
    }

    function bar(label, value, max, color) {
        var h = max > 0 ? (value / max * 140) : 4;
        return '<div class="bar"><div class="bar-value">' + value + '</div><div class="bar-fill" style="height:' + h + 'px;background:' + color + ';"></div><div class="bar-label">' + label + '</div></div>';
    }

    function renderAlertasTable() {
        var html = '<div class="table-container"><div class="table-header"><span class="table-title">Alertas Recientes</span></div><div class="table-wrapper"><table><thead><tr><th>Producto</th><th>Tipo</th><th>Descripción</th><th>Severidad</th><th>Acción Recomendada</th><th>Fecha</th></tr></thead><tbody>';
        AppData.alertas.forEach(function(a) {
            var sevClass = a.severidad === 'Alta' ? 'severity-alta' : (a.severidad === 'Media' ? 'severity-media' : 'severity-baja');
            html += '<tr><td><strong>' + a.producto + '</strong></td><td>' + a.tipo + '</td><td>' + a.descripcion + '</td><td class="' + sevClass + '">' + a.severidad + '</td><td>' + a.accion + '</td><td>' + a.fecha + '</td></tr>';
        });
        html += '</tbody></table></div></div>';
        return html;
    }

    return { render: render, filter: filter, limpiarFiltros: limpiarFiltros, exportarExcel: exportarExcel };
})();
