// ===== MAESTRO DE PRODUCTOS VIEW =====
var MaestroView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Maestro de Productos</h2>';
        html += '<div class="filters-bar" id="maestroFilters" style="flex-wrap:nowrap;overflow-x:auto;">';
        html += '<input type="text" class="filter-input" id="fCodigo" placeholder="SKU / Descripción..." onkeyup="MaestroView.filter()" style="min-width:140px;">';
        html += '<select class="filter-input" id="fMarca" onchange="MaestroView.filter()"><option value="">Marca</option>';
        var marcas = [...new Set(AppData.productos.map(function(p){return p.marca;}))];
        marcas.forEach(function(m){html += '<option>' + m + '</option>';});
        html += '</select>';
        html += '<select class="filter-input" id="fCategoria" onchange="MaestroView.filter()"><option value="">Categoría</option>';
        var cats = [...new Set(AppData.productos.map(function(p){return p.categoria;}))];
        cats.forEach(function(c){html += '<option>' + c + '</option>';});
        html += '</select>';
        html += '<select class="filter-input" id="fCondicion" onchange="MaestroView.filter()"><option value="">Condición</option><option>Nuevo</option><option>Usado</option></select>';
        html += '<select class="filter-input" id="fEstado" onchange="MaestroView.filter()"><option value="">Estado</option><option>Activo</option><option>Pendiente</option><option>Liquidación</option></select>';
        html += '<select class="filter-input" id="fLado" onchange="MaestroView.filter()"><option value="">Lado</option><option value="si">Con lado</option><option value="no">Sin lado</option></select>';
        html += '<button class="btn btn-outline btn-sm" onclick="MaestroView.exportar()" style="white-space:nowrap;">Exportar CSV</button>';
        html += '</div>';
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary btn-sm" onclick="MaestroView.enviarInvestigacion()">&#128269; Enviar seleccionados a investigación</button>';
        html += '<button class="btn btn-outline btn-sm" onclick="MaestroView.seleccionarTodos()">Seleccionar todos</button>';
        html += '<button class="btn btn-outline btn-sm" onclick="MaestroView.deseleccionarTodos()">Deseleccionar</button>';
        html += '</div>';
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Productos (' + AppData.productos.length + ')</span></div>';
        html += '<div class="table-wrapper"><table id="maestroTable" class="table-compact"><thead><tr>';
        html += '<th style="width:30px;"><input type="checkbox" id="chkTodos" onchange="MaestroView.toggleTodos(this)"></th><th>SKU</th><th>Descripción</th><th>Marca</th><th>Condición</th><th>Costo</th><th>Precio</th><th>Markup</th><th>Margen</th><th>Inv.</th><th>Estado</th><th>Alerta</th><th style="min-width:180px;">Acciones</th>';
        html += '</tr></thead><tbody id="maestroBody">';
        html += renderRows(AppData.productos);
        html += '</tbody></table></div></div>';
        return html;
    }

    function renderRows(prods) {
        var html = '';
        prods.forEach(function(p) {
            var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
            var margen = Utils.calcMargen(p.costoActual, p.precioActual);
            html += '<tr>';
            html += '<td><input type="checkbox" class="chk-producto" value="' + p.sku + '"></td>';
            html += '<td><strong>' + p.sku + '</strong></td>';
            html += '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + p.descripcion + '">' + p.descripcion + '</td>';
            html += '<td>' + p.marca + '</td>';
            html += '<td><span class="badge ' + (p.condicion === 'Usado' ? 'badge-blue' : 'badge-green') + '">' + p.condicion + '</span></td>';
            html += '<td>' + Utils.formatCurrency(p.costoActual) + '</td>';
            html += '<td>' + Utils.formatCurrency(p.precioActual) + '</td>';
            html += '<td>' + Utils.formatPercent(markup) + '</td>';
            html += '<td>' + Utils.formatPercent(margen) + '</td>';
            html += '<td>' + p.inventario + '</td>';
            html += '<td><span class="badge ' + Utils.getBadgeClass(p.estado) + '">' + p.estado + '</span></td>';
            html += '<td>' + Utils.getAlertBadge(p.estadoAlerta) + '</td>';
            html += '<td class="actions-cell">';
            html += '<button class="btn btn-sm btn-outline" onclick="MaestroView.verDetalle(\'' + p.sku + '\')" title="Ver detalle">Detalle</button> ';
            html += '<button class="btn btn-sm btn-primary" onclick="MaestroView.verHistorico(\'' + p.sku + '\')" title="Histórico y tendencia">Histórico</button> ';
            html += '<button class="btn btn-sm btn-warning" onclick="MaestroView.clonar(\'' + p.sku + '\')" title="Clonar producto">Clonar</button>';
            html += '</td>';
            html += '</tr>';
        });
        return html;
    }

    function filter() {
        var codigo = document.getElementById('fCodigo').value.toLowerCase();
        var marca = document.getElementById('fMarca').value;
        var categoria = document.getElementById('fCategoria').value;
        var condicion = document.getElementById('fCondicion').value;
        var estado = document.getElementById('fEstado').value;
        var lado = document.getElementById('fLado').value;
        var filtered = AppData.productos.filter(function(p) {
            if (codigo && p.sku.toLowerCase().indexOf(codigo) === -1 && p.descripcion.toLowerCase().indexOf(codigo) === -1) return false;
            if (marca && p.marca !== marca) return false;
            if (categoria && p.categoria !== categoria) return false;
            if (condicion && p.condicion !== condicion) return false;
            if (estado && p.estado !== estado) return false;
            if (lado === 'si' && !p.tieneLado) return false;
            if (lado === 'no' && p.tieneLado) return false;
            return true;
        });
        document.getElementById('maestroBody').innerHTML = renderRows(filtered);
        // Update count
        var title = document.querySelector('.table-title');
        if (title) title.textContent = 'Productos (' + filtered.length + ')';
    }

    function verDetalle(sku) {
        var p = AppData.getProducto(sku);
        if (!p) return;
        var markup = Utils.calcMarkup(p.costoActual, p.precioActual);
        var margen = Utils.calcMargen(p.costoActual, p.precioActual);
        var body = '<div class="form-row">';
        body += detItem('SKU', p.sku) + detItem('Descripción', p.descripcion) + detItem('Marca', p.marca);
        body += detItem('Familia', p.familia) + detItem('Categoría', p.categoria) + detItem('Copro', p.copro);
        body += detItem('Tipo Ingreso', p.tipoIngreso) + detItem('Condición', p.condicion) + detItem('Origen', p.origen);
        body += detItem('Calidad', p.rangoCalidad) + detItem('Proveedor', p.proveedorActual) + detItem('Prov. Anterior', p.proveedorAnterior || '-');
        body += detItem('Costo', Utils.formatCurrency(p.costoActual)) + detItem('Precio', Utils.formatCurrency(p.precioActual));
        body += detItem('Markup', Utils.formatPercent(markup)) + detItem('Margen', Utils.formatPercent(margen));
        body += detItem('Inventario', p.inventario) + detItem('Rotación', p.rotacion);
        body += detItem('Lado', p.tieneLado ? p.lado + ' (Par: ' + p.skuPareja + ')' : 'No aplica');
        body += detItem('Última Evaluación', p.ultimaEvaluacion || 'Sin evaluar');
        body += '</div>';
        Utils.showModal('Detalle: ' + p.sku + ' - ' + p.descripcion, body);
    }

    function verHistorico(sku) {
        // Navigate to Histórico view with the SKU pre-loaded
        document.querySelector('[data-view="historico"]').click();
        setTimeout(function() {
            var input = document.getElementById('histBuscar');
            if (input) {
                input.value = sku;
                HistoricoView.buscar();
            }
        }, 100);
    }

    function clonar(sku) {
        var p = AppData.getProducto(sku);
        if (!p) return;
        var nuevoSku = 'LG-' + (AppData.productos.length + 1).toString().padStart(3, '0');
        var clon = JSON.parse(JSON.stringify(p));
        clon.sku = nuevoSku;
        clon.descripcion = p.descripcion + ' (Clon)';
        clon.tipoIngreso = 'Código nuevo';
        clon.estado = 'Pendiente';
        clon.precioActual = 0;
        clon.inventario = 0;
        clon.ultimaEvaluacion = null;
        clon.estadoAlerta = 'codigo_nuevo_pendiente';
        clon.skuPareja = null;
        clon.tieneLado = false;
        clon.lado = 'No aplica';
        AppData.productos.push(clon);
        AppData.addBitacora({ tipo: 'Clonar', sku: nuevoSku, descripcion: 'Producto clonado desde ' + sku });
        document.getElementById('maestroBody').innerHTML = renderRows(AppData.productos);
        var title = document.querySelector('.table-title');
        if (title) title.textContent = 'Productos (' + AppData.productos.length + ')';
        Utils.showToast('Producto clonado como ' + nuevoSku + '. Requiere configuración y aprobación.', 'success');
    }

    function detItem(label, value) {
        return '<div class="form-group"><span class="form-label">' + label + '</span><div>' + value + '</div></div>';
    }

    function exportar() {
        var headers = ['SKU','Descripción','Marca','Categoría','Condición','Costo','Precio','Markup','Margen','Inventario','Estado'];
        var rows = AppData.productos.map(function(p) {
            return [p.sku, p.descripcion, p.marca, p.categoria, p.condicion, p.costoActual, p.precioActual, Utils.formatPercent(Utils.calcMarkup(p.costoActual, p.precioActual)), Utils.formatPercent(Utils.calcMargen(p.costoActual, p.precioActual)), p.inventario, p.estado];
        });
        Utils.exportCSV(headers, rows, 'maestro_productos.csv');
        Utils.showToast('Archivo CSV exportado', 'success');
    }

    function enviarInvestigacion() {
        var checks = document.querySelectorAll('.chk-producto:checked');
        if (checks.length === 0) { Utils.showToast('Seleccione al menos un producto', 'warning'); return; }
        var skus = Array.from(checks).map(function(c) { return c.value; });
        var asignados = InvestigacionView.recibirProductos(skus);
        // Uncheck all
        checks.forEach(function(c) { c.checked = false; });
        var chkTodos = document.getElementById('chkTodos');
        if (chkTodos) chkTodos.checked = false;
        AppData.addBitacora({ tipo: 'Investigación', sku: skus.join(', '), descripcion: asignados + ' producto(s) enviado(s) a investigación de mercado' });
        Utils.showToast(asignados + ' producto(s) enviado(s) a investigación. Carga distribuida entre investigadores.', 'success');
    }

    function seleccionarTodos() {
        document.querySelectorAll('.chk-producto').forEach(function(c) { c.checked = true; });
        var chkTodos = document.getElementById('chkTodos');
        if (chkTodos) chkTodos.checked = true;
    }

    function deseleccionarTodos() {
        document.querySelectorAll('.chk-producto').forEach(function(c) { c.checked = false; });
        var chkTodos = document.getElementById('chkTodos');
        if (chkTodos) chkTodos.checked = false;
    }

    function toggleTodos(el) {
        document.querySelectorAll('.chk-producto').forEach(function(c) { c.checked = el.checked; });
    }

    return { render: render, filter: filter, verDetalle: verDetalle, verHistorico: verHistorico, clonar: clonar, exportar: exportar, enviarInvestigacion: enviarInvestigacion, seleccionarTodos: seleccionarTodos, deseleccionarTodos: deseleccionarTodos, toggleTodos: toggleTodos };
})();
