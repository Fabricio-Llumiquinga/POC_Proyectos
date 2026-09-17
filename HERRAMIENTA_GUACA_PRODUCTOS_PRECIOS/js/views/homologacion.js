// ===== HOMOLOGACIÓN POR LADO VIEW =====
var HomologacionView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Homologación por Lado</h2>';
        html += '<p class="section-subtitle">Artículos con lado deben tener el mismo precio. Precio Homologado = Promedio de precios sugeridos.</p>';
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary" onclick="HomologacionView.buscarParejas()">Buscar parejas</button>';
        html += '<button class="btn btn-success" onclick="HomologacionView.calcularHomologado()">Calcular precio homologado</button>';
        html += '<button class="btn btn-warning" onclick="HomologacionView.enviarAprobacion()">Enviar a aprobación</button>';
        html += '</div>';
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Productos con Lado (' + getParejas().length + ' parejas)</span></div>';
        html += '<div class="table-wrapper"><table class="table-compact"><thead><tr>';
        html += '<th>SKU Izq.</th><th>Producto</th><th>Costo Izq.</th><th>Precio Actual Izq.</th><th>SKU Der.</th><th>Costo Der.</th><th>Precio Actual Der.</th><th>Precio Homologado</th><th>Estado</th><th>Acciones</th>';
        html += '</tr></thead><tbody id="homoBody">';
        html += renderRows();
        html += '</tbody></table></div></div>';
        return html;
    }

    function getParejas() {
        var parejas = [];
        var procesados = [];
        AppData.productos.forEach(function(p) {
            if (p.tieneLado && p.lado === 'Izquierdo' && procesados.indexOf(p.sku) === -1) {
                var der = AppData.getProducto(p.skuPareja);
                parejas.push({ izq: p, der: der });
                procesados.push(p.sku);
                if (der) procesados.push(der.sku);
            }
        });
        return parejas;
    }

    function renderRows() {
        var parejas = getParejas();
        var html = '';
        parejas.forEach(function(par, idx) {
            var izq = par.izq;
            var der = par.der;
            var precioIzq = izq.precioActual || 0;
            var precioDer = der ? (der.precioActual || 0) : 0;
            var homologado = (precioIzq + precioDer) / 2;
            var estado = 'Homologado correctamente';
            var badgeClass = 'badge-green';
            if (!der || precioDer === 0) { estado = 'Lado incompleto'; badgeClass = 'badge-yellow'; }
            else {
                var margenIzq = Utils.calcMargen(izq.costoActual, homologado);
                var margenDer = Utils.calcMargen(der.costoActual, homologado);
                if (margenIzq < 15 || margenDer < 15) { estado = 'Margen bajo en un lado'; badgeClass = 'badge-red'; }
            }
            html += '<tr>';
            html += '<td><strong>' + izq.sku + '</strong></td>';
            html += '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + izq.descripcion + '">' + izq.descripcion + '</td>';
            html += '<td>' + Utils.formatCurrency(izq.costoActual) + '</td>';
            html += '<td>' + Utils.formatCurrency(precioIzq) + '</td>';
            html += '<td><strong>' + (der ? der.sku : 'Sin par') + '</strong></td>';
            html += '<td>' + (der ? Utils.formatCurrency(der.costoActual) : '-') + '</td>';
            html += '<td>' + Utils.formatCurrency(precioDer) + '</td>';
            html += '<td><strong>' + Utils.formatCurrency(homologado) + '</strong></td>';
            html += '<td><span class="badge ' + badgeClass + '">' + estado + '</span></td>';
            html += '<td><button class="btn btn-sm btn-outline" onclick="HomologacionView.verDetalle(' + idx + ')">Ver detalle</button></td>';
            html += '</tr>';
        });
        return html;
    }

    function verDetalle(idx) {
        var parejas = getParejas();
        var par = parejas[idx];
        if (!par) return;
        var izq = par.izq;
        var der = par.der;
        var precioIzq = izq.precioActual || 0;
        var precioDer = der ? (der.precioActual || 0) : 0;
        var homologado = (precioIzq + precioDer) / 2;

        // Calculate suggested prices (individual, before homologation)
        var datosIzq = { costo: izq.costoActual, origen: izq.origen, rangoCalidad: izq.rangoCalidad, rotacion: izq.rotacion, antiguedad: izq.antiguedad || 0, disponibilidadOrigen: izq.disponibilidadOrigen || 'Alta', precioCompetencia: 0 };
        var sugIzq = Utils.calcularPrecioNuevo(datosIzq);
        var sugDer = { precio: 0, markup: 0, margen: 0 };
        if (der && der.costoActual > 0) {
            var datosDer = { costo: der.costoActual, origen: der.origen, rangoCalidad: der.rangoCalidad, rotacion: der.rotacion, antiguedad: der.antiguedad || 0, disponibilidadOrigen: der.disponibilidadOrigen || 'Alta', precioCompetencia: 0 };
            sugDer = Utils.calcularPrecioNuevo(datosDer);
        }

        var margenIzqHomo = izq.costoActual > 0 ? Utils.calcMargen(izq.costoActual, homologado) : 0;
        var margenDerHomo = der && der.costoActual > 0 ? Utils.calcMargen(der.costoActual, homologado) : 0;
        var markupIzqHomo = izq.costoActual > 0 ? Utils.calcMarkup(izq.costoActual, homologado) : 0;
        var markupDerHomo = der && der.costoActual > 0 ? Utils.calcMarkup(der.costoActual, homologado) : 0;

        var body = '';
        // Header info
        body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">';

        // Left side
        body += '<div style="padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #1a73e8;">';
        body += '<h4 style="margin-bottom:12px;color:#1a73e8;">&#9664; Lado Izquierdo</h4>';
        body += detRow('SKU', izq.sku);
        body += detRow('Descripción', izq.descripcion);
        body += detRow('Marca', izq.marca);
        body += detRow('Categoría', izq.categoria);
        body += detRow('Costo', Utils.formatCurrency(izq.costoActual));
        body += detRow('Precio actual', '<strong>' + Utils.formatCurrency(precioIzq) + '</strong>');
        body += detRow('Precio sugerido (individual)', '<strong style="color:#1a73e8;">' + Utils.formatCurrency(sugIzq.precio) + '</strong>');
        body += detRow('Markup actual', Utils.formatPercent(Utils.calcMarkup(izq.costoActual, precioIzq)));
        body += detRow('Margen actual', Utils.formatPercent(Utils.calcMargen(izq.costoActual, precioIzq)));
        body += detRow('Inventario', izq.inventario);
        body += detRow('Rotación', izq.rotacion);
        body += detRow('Calidad', izq.rangoCalidad);
        body += '</div>';

        // Right side
        body += '<div style="padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #ff9800;">';
        if (der) {
            body += '<h4 style="margin-bottom:12px;color:#ff9800;">&#9654; Lado Derecho</h4>';
            body += detRow('SKU', der.sku);
            body += detRow('Descripción', der.descripcion);
            body += detRow('Marca', der.marca);
            body += detRow('Categoría', der.categoria);
            body += detRow('Costo', Utils.formatCurrency(der.costoActual));
            body += detRow('Precio actual', '<strong>' + Utils.formatCurrency(precioDer) + '</strong>');
            body += detRow('Precio sugerido (individual)', '<strong style="color:#ff9800;">' + Utils.formatCurrency(sugDer.precio) + '</strong>');
            body += detRow('Markup actual', Utils.formatPercent(Utils.calcMarkup(der.costoActual, precioDer)));
            body += detRow('Margen actual', Utils.formatPercent(Utils.calcMargen(der.costoActual, precioDer)));
            body += detRow('Inventario', der.inventario);
            body += detRow('Rotación', der.rotacion);
            body += detRow('Calidad', der.rangoCalidad);
        } else {
            body += '<h4 style="margin-bottom:12px;color:#ff9800;">&#9654; Lado Derecho</h4>';
            body += '<p style="color:#e65100;font-size:13px;">&#9888; Par no registrado. Lado incompleto.</p>';
        }
        body += '</div>';
        body += '</div>';

        // Homologation result
        body += '<div style="margin-top:20px;padding:16px;background:#e8f5e9;border-radius:8px;border:1px solid #a5d6a7;">';
        body += '<h4 style="margin-bottom:12px;color:#2e7d32;">Resultado de Homologación</h4>';
        body += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">';
        body += miniCard('Precio Homologado', Utils.formatCurrency(homologado), '#2e7d32');
        body += miniCard('Margen Izq. (homo)', Utils.formatPercent(margenIzqHomo), margenIzqHomo < 15 ? '#c62828' : '#2e7d32');
        body += miniCard('Margen Der. (homo)', Utils.formatPercent(margenDerHomo), margenDerHomo < 15 ? '#c62828' : '#2e7d32');
        body += miniCard('Markup Izq. (homo)', Utils.formatPercent(markupIzqHomo), '#546e7a');
        body += miniCard('Markup Der. (homo)', Utils.formatPercent(markupDerHomo), '#546e7a');
        body += '</div>';

        // Formula explanation
        body += '<div style="margin-top:12px;padding:10px;background:#fff;border-radius:6px;font-size:12px;color:#546e7a;">';
        body += '<strong>Fórmula:</strong> Precio Homologado = (' + Utils.formatCurrency(precioIzq) + ' + ' + Utils.formatCurrency(precioDer) + ') / 2 = <strong>' + Utils.formatCurrency(homologado) + '</strong>';
        body += '</div>';

        // Warnings
        if (margenIzqHomo < 15 || margenDerHomo < 15) {
            body += '<div style="margin-top:8px;padding:8px 12px;background:#fce4ec;border-radius:4px;font-size:12px;color:#c62828;">&#9888; El margen en uno de los lados queda por debajo del mínimo (15%) con el precio homologado.</div>';
        }
        body += '</div>';

        Utils.showModal('Detalle Homologación: ' + izq.sku + ' / ' + (der ? der.sku : 'Sin par'), body);
    }

    function detRow(label, value) {
        return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #e0e6ed;font-size:12px;"><span style="color:#7f8c8d;">' + label + '</span><span>' + value + '</span></div>';
    }

    function miniCard(label, value, color) {
        return '<div style="padding:10px;background:#fff;border-radius:6px;border-left:3px solid ' + color + ';text-align:center;"><div style="font-size:10px;color:#7f8c8d;">' + label + '</div><div style="font-size:16px;font-weight:700;color:' + color + ';margin-top:2px;">' + value + '</div></div>';
    }

    function buscarParejas() {
        var parejas = getParejas();
        Utils.showToast(parejas.length + ' pareja(s) encontrada(s)', 'info');
    }

    function calcularHomologado() {
        var parejas = getParejas();
        var calculados = 0;
        parejas.forEach(function(par) {
            if (par.izq && par.der && par.der.precioActual > 0) {
                var homologado = Math.round((par.izq.precioActual + par.der.precioActual) / 2);
                par.izq.precioActual = homologado;
                par.der.precioActual = homologado;
                calculados++;
            }
        });
        document.getElementById('homoBody').innerHTML = renderRows();
        Utils.showToast(calculados + ' precio(s) homologado(s)', 'success');
    }

    function enviarAprobacion() {
        var parejas = getParejas();
        var enviados = 0;
        parejas.forEach(function(par) {
            if (!par.der || par.der.precioActual === 0) {
                var solicitud = { id: 'APR-' + (AppData.solicitudesAprobacion.length + 1).toString().padStart(3, '0'), sku: par.izq.sku, motivo: 'Lado incompleto', accion: 'Completar par', precioActual: par.izq.precioActual, precioPropuesto: par.izq.precioActual, margen: 0, regla: 'Producto con lado incompleto', solicitante: 'Sistema', fecha: new Date().toISOString().slice(0, 10), estado: 'Pendiente' };
                AppData.solicitudesAprobacion.push(solicitud);
                enviados++;
            }
        });
        if (enviados > 0) Utils.showToast(enviados + ' solicitud(es) de aprobación enviada(s)', 'success');
        else Utils.showToast('No hay parejas pendientes de aprobación', 'info');
    }

    return { render: render, buscarParejas: buscarParejas, calcularHomologado: calcularHomologado, enviarAprobacion: enviarAprobacion, verDetalle: verDetalle };
})();
