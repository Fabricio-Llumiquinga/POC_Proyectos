// ===== CAMBIO DE COSTO VIEW =====
var CambioCostoView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Evaluación de Cambio de Costo</h2>';
        html += '<p class="section-subtitle">Evaluar productos existentes con variación en costo. Regla: &lt;5% no cambiar, 5-10% revisar, &gt;10% ajuste automático (si cumple reglas).</p>';
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-primary" onclick="CambioCostoView.detectar()">Detectar cambios de costo</button>';
        html += '<button class="btn btn-success" onclick="CambioCostoView.aplicarAuto()">Aplicar automáticamente</button>';
        html += '<button class="btn btn-outline" onclick="CambioCostoView.exportar()">Exportar CSV</button>';
        html += '</div>';
        html += '<div class="table-container"><div class="table-header"><span class="table-title">Cambios de Costo Detectados</span></div>';
        html += '<div class="table-wrapper"><table><thead><tr>';
        html += '<th>SKU</th><th>Producto</th><th>Prov. Actual</th><th>Prov. Anterior</th><th>Costo Ant.</th><th>Nuevo Costo</th><th>Precio Actual</th><th>Variación %</th><th>Precio Propuesto</th><th>Markup Prop.</th><th>Acción</th><th>Aprobación</th><th>Estado</th>';
        html += '</tr></thead><tbody id="costoBody">';
        html += renderRows();
        html += '</tbody></table></div></div>';
        html += '<div id="costoExplicacion"></div>';
        return html;
    }

    function renderRows() {
        var html = '';
        AppData.cambiosCosto.forEach(function(c) {
            var p = AppData.getProducto(c.sku);
            if (!p) return;
            var eval_ = Utils.evaluarCambioCosto(p, c.nuevoCosto);
            var varClass = Math.abs(c.variacion) < 5 ? 'badge-green' : (Math.abs(c.variacion) <= 10 ? 'badge-yellow' : 'badge-red');
            html += '<tr>';
            html += '<td><strong>' + c.sku + '</strong></td>';
            html += '<td>' + p.descripcion + '</td>';
            html += '<td>' + p.proveedorActual + '</td>';
            html += '<td>' + (p.proveedorAnterior || '-') + '</td>';
            html += '<td>' + Utils.formatCurrency(c.costoAnterior) + '</td>';
            html += '<td>' + Utils.formatCurrency(c.nuevoCosto) + '</td>';
            html += '<td>' + Utils.formatCurrency(p.precioActual) + '</td>';
            html += '<td><span class="badge ' + varClass + '">' + Utils.formatPercent(c.variacion) + '</span></td>';
            html += '<td>' + Utils.formatCurrency(eval_.precioPropuesto) + '</td>';
            html += '<td>' + Utils.formatPercent(eval_.markupPropuesto) + '</td>';
            html += '<td>' + eval_.accion + '</td>';
            html += '<td>' + (eval_.requiereAprobacion ? '<span class="badge badge-yellow">Sí</span>' : '<span class="badge badge-green">No</span>') + '</td>';
            html += '<td><button class="btn btn-sm btn-outline" onclick="CambioCostoView.verExplicacion(\'' + c.sku + '\')">IA</button></td>';
            html += '</tr>';
        });
        return html;
    }

    function detectar() {
        Utils.showToast('Cambios de costo detectados: ' + AppData.cambiosCosto.length + ' productos', 'info');
    }

    function aplicarAuto() {
        var aplicados = 0;
        AppData.cambiosCosto.forEach(function(c) {
            var p = AppData.getProducto(c.sku);
            if (!p) return;
            var eval_ = Utils.evaluarCambioCosto(p, c.nuevoCosto);
            if (eval_.accion === 'Ajustar automáticamente' && !eval_.requiereAprobacion) {
                if (Utils.puedeAplicarAutomaticamente(p, eval_.precioPropuesto)) {
                    Utils.API.pos.actualizarPrecio(c.sku, eval_.precioPropuesto);
                    p.costoActual = c.nuevoCosto;
                    aplicados++;
                    AppData.addBitacora({ tipo: 'Ajuste automático', sku: c.sku, descripcion: 'Precio ajustado por cambio de costo. Nuevo precio: ' + Utils.formatCurrency(eval_.precioPropuesto) });
                }
            }
        });
        if (aplicados > 0) {
            Utils.showToast(aplicados + ' cambio(s) aplicado(s) automáticamente', 'success');
            document.getElementById('costoBody').innerHTML = renderRows();
        } else {
            Utils.showToast('No hay cambios elegibles para aplicación automática', 'warning');
        }
    }

    function verExplicacion(sku) {
        var c = AppData.cambiosCosto.find(function(x) { return x.sku === sku; });
        var p = AppData.getProducto(sku);
        if (!c || !p) return;
        var eval_ = Utils.evaluarCambioCosto(p, c.nuevoCosto);
        var absVar = Math.abs(c.variacion);
        var explicacion = '';
        if (absVar < 5) {
            explicacion = 'La variación del costo es de ' + Utils.formatPercent(c.variacion) + ', menor al umbral del 5%. No se recomienda cambiar el precio. El markup actual se mantiene dentro de los rangos permitidos.';
        } else if (absVar <= 10) {
            explicacion = 'La variación del costo es de ' + Utils.formatPercent(c.variacion) + ', entre 5% y 10%. Se recomienda revisar el precio propuesto de ' + Utils.formatCurrency(eval_.precioPropuesto) + ' para mantener el margen.';
        } else if (absVar > 40 && p.proveedorActual !== p.proveedorAnterior) {
            explicacion = 'La variación del costo supera el 40% (' + Utils.formatPercent(c.variacion) + ') y el proveedor cambió de "' + p.proveedorAnterior + '" a "' + p.proveedorActual + '". Se recomienda crear un nuevo código/SKU para este producto.';
        } else {
            explicacion = 'La variación del costo es de ' + Utils.formatPercent(c.variacion) + ', mayor al 10%. La acción recomendada es ajustar automáticamente el precio a ' + Utils.formatCurrency(eval_.precioPropuesto) + ' con markup de ' + Utils.formatPercent(eval_.markupPropuesto) + '.';
            if (eval_.requiereAprobacion) explicacion += ' Sin embargo, requiere aprobación porque el markup o variación queda fuera del rango permitido.';
        }
        var body = '<div class="result-box"><h4 style="margin-bottom:10px;">Explicación IA - ' + sku + '</h4><p style="line-height:1.6;">' + explicacion + '</p></div>';
        Utils.showModal('Explicación IA: ' + sku, body);
    }

    function exportar() {
        var headers = ['SKU','Producto','Costo Anterior','Nuevo Costo','Variación %','Precio Propuesto','Acción'];
        var rows = AppData.cambiosCosto.map(function(c) {
            var p = AppData.getProducto(c.sku);
            var eval_ = Utils.evaluarCambioCosto(p, c.nuevoCosto);
            return [c.sku, p ? p.descripcion : '', c.costoAnterior, c.nuevoCosto, c.variacion.toFixed(2), eval_.precioPropuesto, eval_.accion];
        });
        Utils.exportCSV(headers, rows, 'cambios_costo.csv');
        Utils.showToast('CSV exportado', 'success');
    }

    return { render: render, detectar: detectar, aplicarAuto: aplicarAuto, verExplicacion: verExplicacion, exportar: exportar };
})();
