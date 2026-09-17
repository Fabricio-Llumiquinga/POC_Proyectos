// ===== REGLAS Y PARÁMETROS VIEW =====
var ReglasView = (function() {
    'use strict';

    function render() {
        var p = AppData.parametros;
        var html = '<h2 class="section-title">Reglas y Parámetros</h2>';
        html += '<p class="section-subtitle">Administración visual de reglas de negocio y parámetros del motor de pricing.</p>';

        // Parameters
        html += '<div class="form-card"><div class="form-card-title">Parámetros Editables</div>';
        html += '<div class="form-row">';
        html += param('pUmbralNoCambio', 'Umbral no cambiar precio (%)', p.umbralNoCambio);
        html += param('pUmbralRevision', 'Umbral revisión (%)', p.umbralRevision);
        html += param('pUmbralAjusteAuto', 'Umbral ajuste automático (%)', p.umbralAjusteAuto);
        html += param('pUmbralNuevoCodigo', 'Umbral nuevo código (%)', p.umbralNuevoCodigo);
        html += param('pSobreMercado', '% permitido sobre mercado', p.porcentajeSobreMercado);
        html += param('pBajoMercado', '% permitido bajo mercado', p.porcentajeBajoMercado);
        html += param('pMargenMinimo', 'Margen mínimo (%)', p.margenMinimo);
        html += param('pMarkupPiso', 'Markup piso (%)', p.markupPiso);
        html += param('pMarkupTecho', 'Markup techo (%)', p.markupTecho);
        html += param('pPisoVariacion', 'Piso variación (%)', p.pisoVariacion);
        html += param('pTechoVariacion', 'Techo variación (%)', p.techoVariacion);
        html += param('pPermitidoSobre', '% permitido sobre mercado (objetivo)', p.porcentajePermitidoSobreMercado);
        html += '</div>';
        html += '<button class="btn btn-primary mt-16" onclick="ReglasView.guardarParametros()">Guardar parámetros</button>';
        html += '</div>';

        // Rules
        html += '<div class="form-card"><div class="form-card-title">Reglas de Negocio</div>';
        html += regla('Producto nuevo con código nuevo', 'Todo producto con código nuevo debe solicitar aprobación antes de aplicarse al punto de venta.');
        html += regla('Producto usado con código nuevo', 'Todo producto usado con código nuevo requiere aprobación. La letra U identifica productos usados.');
        html += regla('Cambio de costo', 'Variación <5%: no cambiar. 5-10%: revisar. >10%: ajuste automático si cumple reglas. >40% con proveedor diferente: crear nuevo código.');
        html += regla('Competencia', '>10% sobre mercado: alerta roja. >15% bajo mercado: alerta amarilla. Dentro de rango: verde.');
        html += regla('Lados', 'Artículos con lado deben tener el mismo precio. Precio Homologado = Promedio de precios sugeridos.');
        html += regla('Liquidación', 'Producto por daño → categoría 16. Asignado para liquidación → categoría 12. Primeros 3 meses: costo + 1%. Siguientes 3 meses: hasta 25% del costo.');
        html += regla('Sobre stock', 'Reducir precio para incentivar salida de inventario.');
        html += regla('Bajo stock', 'Aumentar precio o mantener según disponibilidad.');
        html += regla('Política comercial', 'Siempre manual, requiere justificación y aprobación.');
        html += regla('Aplicación automática', 'Solo si cumple TODAS las reglas: sin aprobación pendiente, sin alertas críticas, SKU activo, precio > 0, markup en rango, margen mínimo cumplido, sin inconsistencias.');
        html += regla('Integración POS', 'Consultar precios, costos, variaciones. Enviar cambios aprobados. Reprocesar errores.');
        html += '</div>';
        return html;
    }

    function param(id, label, value) {
        return '<div class="form-group"><label class="form-label">' + label + '</label><input type="number" class="form-control" id="' + id + '" value="' + value + '"></div>';
    }

    function regla(titulo, desc) {
        return '<div style="padding:12px;margin-bottom:10px;background:#f8fafc;border-radius:6px;border-left:3px solid #1a73e8;"><strong style="font-size:13px;">' + titulo + '</strong><p style="font-size:12px;color:#546e7a;margin-top:4px;">' + desc + '</p></div>';
    }

    function guardarParametros() {
        AppData.parametros.umbralNoCambio = parseFloat(document.getElementById('pUmbralNoCambio').value) || 5;
        AppData.parametros.umbralRevision = parseFloat(document.getElementById('pUmbralRevision').value) || 10;
        AppData.parametros.umbralAjusteAuto = parseFloat(document.getElementById('pUmbralAjusteAuto').value) || 10;
        AppData.parametros.umbralNuevoCodigo = parseFloat(document.getElementById('pUmbralNuevoCodigo').value) || 40;
        AppData.parametros.porcentajeSobreMercado = parseFloat(document.getElementById('pSobreMercado').value) || 10;
        AppData.parametros.porcentajeBajoMercado = parseFloat(document.getElementById('pBajoMercado').value) || 15;
        AppData.parametros.margenMinimo = parseFloat(document.getElementById('pMargenMinimo').value) || 15;
        AppData.parametros.markupPiso = parseFloat(document.getElementById('pMarkupPiso').value) || 17;
        AppData.parametros.markupTecho = parseFloat(document.getElementById('pMarkupTecho').value) || 1000;
        AppData.parametros.pisoVariacion = parseFloat(document.getElementById('pPisoVariacion').value) || -50;
        AppData.parametros.techoVariacion = parseFloat(document.getElementById('pTechoVariacion').value) || 50;
        AppData.parametros.porcentajePermitidoSobreMercado = parseFloat(document.getElementById('pPermitidoSobre').value) || 5;
        AppData.addBitacora({ tipo: 'Configuración', sku: '-', descripcion: 'Parámetros actualizados' });
        Utils.showToast('Parámetros guardados correctamente', 'success');
    }

    return { render: render, guardarParametros: guardarParametros };
})();
