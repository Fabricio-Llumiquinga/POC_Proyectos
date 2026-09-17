// ===== INVESTIGACIÓN DE MERCADO VIEW =====
var InvestigacionView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Investigación de Mercado</h2>';
        html += '<p class="section-subtitle">Gestionar la investigación de precios de competencia. Los productos se asignan a investigadores para validar precios del mercado.</p>';

        // KPIs
        var pendientes = AppData.colaInvestigacion.filter(function(c) { return c.estado === 'Pendiente'; }).length;
        var validados = AppData.colaInvestigacion.filter(function(c) { return c.estado === 'Validado'; }).length;
        var total = AppData.colaInvestigacion.length;
        html += '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px;">';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + total + '</div><div class="kpi-label">Total asignados</div></div>';
        html += '<div class="kpi-card yellow"><div class="kpi-value">' + pendientes + '</div><div class="kpi-label">Pendientes investigación</div></div>';
        html += '<div class="kpi-card green"><div class="kpi-value">' + validados + '</div><div class="kpi-label">Validados</div></div>';
        html += '<div class="kpi-card blue"><div class="kpi-value">' + AppData.investigadores.length + '</div><div class="kpi-label">Investigadores</div></div>';
        html += '</div>';

        // Filters
        html += '<div class="filters-bar" style="flex-wrap:nowrap;overflow-x:auto;">';
        html += '<select class="filter-input" id="imFiltroResponsable" onchange="InvestigacionView.filtrar()"><option value="">Todos los investigadores</option>';
        AppData.investigadores.forEach(function(inv) { html += '<option value="' + inv.id + '">' + inv.nombre + '</option>'; });
        html += '</select>';
        html += '<select class="filter-input" id="imFiltroEstado" onchange="InvestigacionView.filtrar()"><option value="">Todos los estados</option><option value="Pendiente">Pendiente</option><option value="Validado">Validado</option></select>';
        html += '<input type="text" class="filter-input" id="imFiltroBuscar" placeholder="Buscar SKU..." onkeyup="InvestigacionView.filtrar()" style="min-width:120px;">';
        html += '</div>';

        // Products table (queue)
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Cola de Investigación</span></div>';
        html += '<div class="table-wrapper"><table class="table-compact"><thead><tr>';
        html += '<th>SKU</th><th>Producto</th><th>Marca</th><th>Precio Guaca</th><th>Responsable</th><th>Estado</th><th>Última comparación</th><th>Acciones</th>';
        html += '</tr></thead><tbody id="imColaBody">';
        html += renderColaRows(AppData.colaInvestigacion);
        html += '</tbody></table></div></div>';

        // Form for registering competition data (hidden until selecting a product)
        html += '<div id="imFormContainer"></div>';

        return html;
    }

    function renderColaRows(items) {
        var html = '';
        if (items.length === 0) {
            html = '<tr><td colspan="8" class="text-center">Sin productos asignados. Use el Maestro de Productos para enviar productos a investigación.</td></tr>';
            return html;
        }
        items.forEach(function(item, idx) {
            var p = AppData.getProducto(item.sku);
            var badgeClass = item.estado === 'Validado' ? 'badge-green' : 'badge-yellow';
            var inv = AppData.investigadores.find(function(i) { return i.id === item.responsableId; });
            html += '<tr>';
            html += '<td><strong>' + item.sku + '</strong></td>';
            html += '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (p ? p.descripcion : item.sku) + '</td>';
            html += '<td>' + (p ? p.marca : '-') + '</td>';
            html += '<td>' + (p ? Utils.formatCurrency(p.precioActual) : '-') + '</td>';
            html += '<td>' + (inv ? inv.nombre : '-') + '</td>';
            html += '<td><span class="badge ' + badgeClass + '">' + item.estado + '</span></td>';
            html += '<td>' + (item.fechaComparacion || 'Sin comparar') + '</td>';
            html += '<td class="actions-cell">';
            if (item.estado === 'Pendiente') {
                html += '<button class="btn btn-sm btn-primary" onclick="InvestigacionView.abrirFormulario(' + idx + ')">Investigar</button>';
            } else {
                html += '<button class="btn btn-sm btn-outline" onclick="InvestigacionView.verResultado(' + idx + ')">Ver resultado</button>';
            }
            html += '</td>';
            html += '</tr>';
        });
        return html;
    }

    function filtrar() {
        var responsable = document.getElementById('imFiltroResponsable').value;
        var estado = document.getElementById('imFiltroEstado').value;
        var buscar = (document.getElementById('imFiltroBuscar').value || '').toLowerCase();
        var filtered = AppData.colaInvestigacion.filter(function(item) {
            if (responsable && item.responsableId !== responsable) return false;
            if (estado && item.estado !== estado) return false;
            if (buscar && item.sku.toLowerCase().indexOf(buscar) === -1) return false;
            return true;
        });
        document.getElementById('imColaBody').innerHTML = renderColaRows(filtered);
    }

    function abrirFormulario(idx) {
        var item = AppData.colaInvestigacion[idx];
        if (!item) return;
        var p = AppData.getProducto(item.sku);

        var html = '<div class="form-card" style="border:2px solid #1a73e8;"><div class="form-card-title">Registrar Datos de Competencia - ' + item.sku + '</div>';
        if (p) {
            html += '<div style="padding:10px;background:#e3f2fd;border-radius:6px;margin-bottom:16px;font-size:12px;">';
            html += '<strong>Producto interno:</strong> ' + p.descripcion + ' | <strong>Marca:</strong> ' + p.marca + ' | <strong>Precio actual:</strong> ' + Utils.formatCurrency(p.precioActual) + ' | <strong>Categoría:</strong> ' + p.categoria;
            html += '</div>';
        }
        html += '<div class="form-row">';
        html += field('imCodigoComp', 'Código/SKU competencia', 'text', 'Código del competidor');
        html += field('imDetalleComp', 'Detalle producto competencia', 'text', 'Descripción del producto');
        html += fieldSelect('imCompetidor', 'Competidor', AppData.competidores.map(function(c) { return c.nombre; }));
        html += field('imPrecioComp', 'Precio competencia', 'number', '0');
        html += fieldSelect('imFuente', 'Fuente', ['Web','Cotización','Llamada','Visita','Archivo','Proveedor','Otro']);
        html += fieldSelect('imCondicionComp', 'Condición', ['Nuevo','Usado','No identificado']);
        html += '</div>';
        html += '<div class="form-group"><label class="form-label">Observaciones</label><textarea class="form-control" id="imObsComp" rows="2" placeholder="Notas sobre la investigación..."></textarea></div>';
        html += '<div class="btn-group mt-16">';
        html += '<button class="btn btn-success" onclick="InvestigacionView.validarRegistro(' + idx + ')">&#10004; Validar y guardar</button>';
        html += '<button class="btn btn-outline" onclick="InvestigacionView.cerrarFormulario()">Cancelar</button>';
        html += '</div></div>';

        document.getElementById('imFormContainer').innerHTML = html;
        document.getElementById('imFormContainer').scrollIntoView({ behavior: 'smooth' });
    }

    function validarRegistro(idx) {
        var item = AppData.colaInvestigacion[idx];
        if (!item) return;
        var precio = parseFloat(document.getElementById('imPrecioComp').value) || 0;
        var competidor = document.getElementById('imCompetidor').value;
        if (!competidor || precio <= 0) { Utils.showToast('Complete competidor y precio', 'error'); return; }

        // Save competition price
        var registro = {
            sku: item.sku,
            competidor: competidor,
            productoComp: document.getElementById('imDetalleComp').value,
            codigoComp: document.getElementById('imCodigoComp').value,
            precioComp: precio,
            fuente: document.getElementById('imFuente').value,
            fecha: new Date().toISOString().slice(0, 10),
            confianza: 'Alta',
            estado: 'Validado'
        };
        AppData.preciosCompetencia.push(registro);
        AppData.investigacionMercado.push(registro);

        // Update queue item
        item.estado = 'Validado';
        item.fechaComparacion = new Date().toISOString().slice(0, 10);
        item.precioCompetencia = precio;
        item.competidor = competidor;
        item.observacion = document.getElementById('imObsComp').value;

        // Update investigator load
        var inv = AppData.investigadores.find(function(i) { return i.id === item.responsableId; });
        if (inv) inv.carga = Math.max(0, inv.carga - 1);

        AppData.addBitacora({ tipo: 'Investigación', sku: item.sku, descripcion: 'Precio validado por investigador: ' + competidor + ' ' + Utils.formatCurrency(precio) });

        document.getElementById('imColaBody').innerHTML = renderColaRows(AppData.colaInvestigacion);
        document.getElementById('imFormContainer').innerHTML = '';
        Utils.showToast('Producto ' + item.sku + ' validado correctamente', 'success');
    }

    function verResultado(idx) {
        var item = AppData.colaInvestigacion[idx];
        if (!item) return;
        var p = AppData.getProducto(item.sku);
        var inv = AppData.investigadores.find(function(i) { return i.id === item.responsableId; });
        var body = '<div class="form-row">';
        body += detItem('SKU', item.sku);
        body += detItem('Producto', p ? p.descripcion : '-');
        body += detItem('Precio La Guaca', p ? Utils.formatCurrency(p.precioActual) : '-');
        body += detItem('Competidor', item.competidor || '-');
        body += detItem('Precio competencia', Utils.formatCurrency(item.precioCompetencia || 0));
        body += detItem('Responsable', inv ? inv.nombre : '-');
        body += detItem('Fecha comparación', item.fechaComparacion || '-');
        body += detItem('Observación', item.observacion || '-');
        body += '</div>';
        if (p && item.precioCompetencia) {
            var dif = ((p.precioActual - item.precioCompetencia) / item.precioCompetencia * 100);
            body += '<div style="margin-top:12px;padding:10px;background:' + (dif > 10 ? '#fce4ec' : dif < -15 ? '#fff8e1' : '#e8f5e9') + ';border-radius:6px;font-size:13px;">';
            body += 'Diferencia vs competencia: <strong>' + Utils.formatPercent(dif) + '</strong>';
            body += '</div>';
        }
        Utils.showModal('Resultado Investigación: ' + item.sku, body);
    }

    function cerrarFormulario() {
        document.getElementById('imFormContainer').innerHTML = '';
    }

    function detItem(label, value) {
        return '<div class="form-group"><span class="form-label">' + label + '</span><div>' + value + '</div></div>';
    }

    function field(id, label, type, ph) {
        return '<div class="form-group"><label class="form-label">' + label + '</label><input type="' + type + '" class="form-control" id="' + id + '" placeholder="' + (ph || '') + '"></div>';
    }

    function fieldSelect(id, label, opts) {
        var h = '<div class="form-group"><label class="form-label">' + label + '</label><select class="form-control" id="' + id + '"><option value="">Seleccionar...</option>';
        opts.forEach(function(o) { h += '<option value="' + o + '">' + o + '</option>'; });
        return h + '</select></div>';
    }

    // Called externally from MaestroView
    function recibirProductos(skus) {
        var asignados = 0;
        skus.forEach(function(sku) {
            // Check if already in queue
            var yaExiste = AppData.colaInvestigacion.find(function(c) { return c.sku === sku && c.estado === 'Pendiente'; });
            if (yaExiste) return;
            // Assign to investigator with least load
            var invMenorCarga = AppData.investigadores.reduce(function(min, inv) { return inv.carga < min.carga ? inv : min; }, AppData.investigadores[0]);
            invMenorCarga.carga++;
            AppData.colaInvestigacion.push({
                sku: sku,
                responsableId: invMenorCarga.id,
                estado: 'Pendiente',
                fechaAsignacion: new Date().toISOString().slice(0, 10),
                fechaComparacion: null,
                precioCompetencia: null,
                competidor: null,
                observacion: null
            });
            asignados++;
        });
        return asignados;
    }

    return { render: render, filtrar: filtrar, abrirFormulario: abrirFormulario, validarRegistro: validarRegistro, verResultado: verResultado, cerrarFormulario: cerrarFormulario, recibirProductos: recibirProductos };
})();
