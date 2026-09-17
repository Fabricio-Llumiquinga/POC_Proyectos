// ===== PRODUCTO USADO CON CÓDIGO NUEVO VIEW =====
var UsadoNuevoView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Producto Usado con Código Nuevo</h2>';
        html += '<p class="section-subtitle">Calcular precio para productos usados con SKU nuevo. La letra U identifica productos usados. Requiere aprobación obligatoria.</p>';

        // Botones superiores
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-outline" onclick="UsadoNuevoView.precargarEjemplo()">&#128203; Precargar ejemplo</button>';
        html += '<button class="btn btn-outline" onclick="UsadoNuevoView.limpiar()">Limpiar formulario</button>';
        html += '</div>';

        // SECCION 1: Identificación
        html += '<div class="form-card"><div class="form-card-title">1. Identificación del Producto Usado</div>';
        html += '<div class="form-row">';
        html += field('unSku', 'Código usado', 'text', 'Ej: U-LG-030');
        html += field('unDescripcion', 'Descripción', 'text', 'Nombre completo del producto');
        html += fieldSelect('unMarca', 'Marca', ['Toyota','Honda','Mazda','Nissan','Hyundai','Kia','Chevrolet','Ford','Suzuki','Mitsubishi','Subaru','Otro']);
        html += field('unFamilia', 'Familia / Serie', 'text', 'Ej: Iluminación, Eléctrico');
        html += fieldSelect('unCategoria', 'Categoría', ['Faros','Radiadores','Amortiguadores','Bombas','Alternadores','Espejos','Stops','Filtros','Pastillas','Compresores','Guardafangos','Capós','Discos','Termostatos','Correas','Sensores','Parrillas','Clutch','Aceites','Puertas','Otro']);
        html += fieldSelect('unCopro', 'Copro (Productos comparables)', ['Aceites','Puertas','Faros','Radiadores','Amortiguadores','Bombas','Alternadores','Espejos','Stops','Filtros','Pastillas','Compresores','Discos','Termostatos','Correas','Sensores','Clutch','Carrocería','Eléctrico','Refrigeración','Motor','Transmisión','Frenos','Aire Acondicionado','Otro']);
        html += '</div></div>';

        // SECCION 2: Condición y Calidad
        html += '<div class="form-card"><div class="form-card-title">2. Condición y Calidad del Usado</div>';
        html += '<div class="form-row">';
        html += fieldSelect('unCalidad', 'Rango de calidad', ['Alta','Media','Baja']);
        html += fieldSelect('unEstadoFisico', 'Estado físico', ['Excelente','Bueno','Regular','Malo']);
        html += fieldSelect('unOrigen', 'Origen', ['Local','Importado']);
        html += fieldSelect('unDisponibilidad', 'Disponibilidad en origen', ['Alta','Media','Baja','Nula']);
        html += fieldSelect('unTieneLado', '¿Tiene lado?', ['No','Sí']);
        html += fieldSelect('unLado', 'Lado', ['Izquierdo','Derecho']);
        html += '</div></div>';

        // SECCION 3: Referencia y Costos
        html += '<div class="form-card"><div class="form-card-title">3. Referencia, Costos e Inventario</div>';
        html += '<div class="form-row">';
        html += field('unEquivalente', 'Producto nuevo equivalente (SKU)', 'text', 'Ej: LG-006');
        html += field('unPrecioNuevo', 'Precio producto nuevo equiv.', 'number', '0');
        html += field('unPrecioCompUsado', 'Precio competencia usado', 'number', '0');
        html += field('unCosto', 'Costo de adquisición', 'number', '0');
        html += field('unInventario', 'Inventario', 'number', '1');
        html += field('unProveedor', 'Proveedor / Origen', 'text', 'Ej: Compra directa');
        html += '</div></div>';

        // SECCION 4: Competencia y Observaciones
        html += '<div class="form-card"><div class="form-card-title">4. Competencia Interna y Observaciones</div>';
        html += '<div class="form-row">';
        html += fieldSelectMultiple('unCompetidoras', 'Marcas competidoras internas', ['Depo','TYC','Valeo','Monroe','KYB','GMB','NPW','Bosch','Denso','Brembo','Ferodo','Sanden','Gates','Continental','Wix','Mann','TRW','LUK','Aftermarket']);
        html += '<div class="form-group"><label class="form-label">Observación</label><textarea class="form-control" id="unObservacion" rows="3" placeholder="Notas sobre el estado, procedencia o condición del producto..."></textarea></div>';
        html += '</div></div>';

        // Botones de acción
        html += '<div class="form-card" style="background:#f8fafc;border:1px dashed #cfd8dc;">';
        html += '<div class="btn-group">';
        html += '<button class="btn btn-primary" onclick="UsadoNuevoView.calcular()" style="padding:12px 24px;font-size:14px;">&#9654; Calcular precio usado</button>';
        html += '<button class="btn btn-warning" onclick="UsadoNuevoView.enviarAprobacion()" style="padding:12px 24px;font-size:14px;">&#10004; Enviar a aprobación</button>';
        html += '</div></div>';

        html += '<div id="unResultado"></div>';
        return html;
    }

    function field(id, label, type, placeholder) {
        return '<div class="form-group"><label class="form-label">' + label + '</label><input type="' + type + '" class="form-control" id="' + id + '" placeholder="' + (placeholder || '') + '"></div>';
    }

    function fieldSelect(id, label, options) {
        var html = '<div class="form-group"><label class="form-label">' + label + '</label><select class="form-control" id="' + id + '">';
        html += '<option value="">Seleccionar...</option>';
        options.forEach(function(o) { html += '<option value="' + o + '">' + o + '</option>'; });
        html += '</select></div>';
        return html;
    }

    function fieldSelectMultiple(id, label, options) {
        var html = '<div class="form-group" style="flex:1 1 100%;"><label class="form-label">' + label + ' <span style="font-weight:400;color:#90a4ae;">(Ctrl+click para selección múltiple)</span></label>';
        html += '<select class="form-control" id="' + id + '" multiple style="height:90px;">';
        options.forEach(function(o) { html += '<option value="' + o + '">' + o + '</option>'; });
        html += '</select></div>';
        return html;
    }

    function precargarEjemplo() {
        document.getElementById('unSku').value = 'U-LG-031';
        document.getElementById('unDescripcion').value = 'Alternador Toyota Hilux 2017 USADO';
        document.getElementById('unMarca').value = 'Toyota';
        document.getElementById('unFamilia').value = 'Eléctrico';
        document.getElementById('unCategoria').value = 'Alternadores';
        document.getElementById('unCopro').value = 'Eléctrico';
        document.getElementById('unCalidad').value = 'Media';
        document.getElementById('unEstadoFisico').value = 'Bueno';
        document.getElementById('unOrigen').value = 'Local';
        document.getElementById('unDisponibilidad').value = 'Baja';
        document.getElementById('unTieneLado').value = 'No';
        document.getElementById('unLado').value = '';
        document.getElementById('unEquivalente').value = 'LG-006';
        document.getElementById('unPrecioNuevo').value = '135000';
        document.getElementById('unPrecioCompUsado').value = '75000';
        document.getElementById('unCosto').value = '40000';
        document.getElementById('unInventario').value = '1';
        document.getElementById('unProveedor').value = 'Compra directa';
        var sel = document.getElementById('unCompetidoras');
        if (sel) {
            Array.from(sel.options).forEach(function(opt) {
                opt.selected = (opt.value === 'Bosch' || opt.value === 'Denso');
            });
        }
        document.getElementById('unObservacion').value = 'Alternador usado en buen estado. Proviene de vehículo desarmado. Equivalente nuevo: LG-006.';
        Utils.showToast('Datos de ejemplo precargados. Puede calcular el precio.', 'info');
    }

    function calcular() {
        var costo = parseFloat(document.getElementById('unCosto').value) || 0;
        if (costo <= 0) { Utils.showToast('Debe ingresar un costo válido', 'error'); return; }
        var precioNuevoEquiv = parseFloat(document.getElementById('unPrecioNuevo').value) || 0;
        var precioCompUsado = parseFloat(document.getElementById('unPrecioCompUsado').value) || 0;
        var calidad = document.getElementById('unCalidad').value;
        var estadoFisico = document.getElementById('unEstadoFisico').value;
        var tieneLado = document.getElementById('unTieneLado').value === 'Sí';
        var lado = document.getElementById('unLado').value;

        // Calculate used price based on condition
        var factorCalidad = calidad === 'Alta' ? 0.70 : (calidad === 'Media' ? 0.55 : 0.40);
        var factorEstado = estadoFisico === 'Excelente' ? 1.0 : (estadoFisico === 'Bueno' ? 0.9 : (estadoFisico === 'Regular' ? 0.75 : 0.55));
        var precioBase = precioNuevoEquiv > 0 ? precioNuevoEquiv * factorCalidad * factorEstado : costo * 1.5;
        if (precioCompUsado > 0) { precioBase = Math.min(precioBase, precioCompUsado * 0.98); }
        if (precioBase < costo * 1.17) precioBase = costo * 1.17;
        var precioSugerido = Math.round(precioBase / 100) * 100;
        var markup = Utils.calcMarkup(costo, precioSugerido);
        var margen = Utils.calcMargen(costo, precioSugerido);
        var diferencia = precioNuevoEquiv > 0 ? precioSugerido - precioNuevoEquiv : null;
        var sinEquivalencia = !precioNuevoEquiv || precioNuevoEquiv === 0;

        var html = '<div class="result-box success" style="margin-top:24px;">';
        html += '<h3 style="margin-bottom:16px;color:#2e7d32;">&#10004; Resultado del Cálculo - Producto Usado</h3>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
        html += resultCard('Precio sugerido', Utils.formatCurrency(precioSugerido), '#1a73e8');
        html += resultCard('Markup sugerido', Utils.formatPercent(markup), '#546e7a');
        html += resultCard('Margen estimado', Utils.formatPercent(margen), '#546e7a');
        if (diferencia !== null) html += resultCard('Dif. vs nuevo equiv.', Utils.formatCurrency(diferencia), '#e65100');
        html += resultCard('Estado', 'Requiere aprobación', '#e65100');
        if (tieneLado) html += resultCard('Lado', lado, '#1565c0');
        html += '</div>';

        // Alerts and rules
        html += '<div style="margin-top:16px;padding:12px;background:#fff;border-radius:6px;border:1px solid #e0e6ed;">';
        if (sinEquivalencia) {
            html += '<div style="padding:8px 12px;margin-bottom:8px;background:#fff8e1;border-radius:4px;border-left:3px solid #ff9800;font-size:12px;color:#e65100;">&#9888; Sin equivalencia confiable con producto nuevo. Precio calculado con factor sobre costo.</div>';
        }
        html += '<strong style="font-size:12px;">Reglas aplicadas:</strong><ul style="margin-top:6px;padding-left:18px;">';
        html += '<li style="font-size:12px;color:#546e7a;margin-bottom:3px;">Factor calidad (' + calidad + '): ' + (factorCalidad * 100).toFixed(0) + '%</li>';
        html += '<li style="font-size:12px;color:#546e7a;margin-bottom:3px;">Factor estado físico (' + estadoFisico + '): ' + (factorEstado * 100).toFixed(0) + '%</li>';
        if (precioCompUsado > 0) html += '<li style="font-size:12px;color:#546e7a;margin-bottom:3px;">Ajuste por precio competencia usado aplicado</li>';
        html += '<li style="font-size:12px;color:#546e7a;margin-bottom:3px;">Markup mínimo garantizado: 17%</li>';
        html += '<li style="font-size:12px;color:#1565c0;margin-bottom:3px;">Todo producto usado con código nuevo requiere aprobación</li>';
        if (tieneLado) html += '<li style="font-size:12px;color:#1565c0;margin-bottom:3px;">Producto con lado: requiere homologación de precio con par</li>';
        html += '</ul></div></div>';

        document.getElementById('unResultado').innerHTML = html;
        Utils.showToast('Precio usado calculado. Requiere aprobación.', 'info');
    }

    function resultCard(label, value, color) {
        return '<div style="padding:12px;background:#f8fafc;border-radius:8px;border-left:3px solid ' + color + ';"><div style="font-size:11px;color:#7f8c8d;">' + label + '</div><div style="font-size:18px;font-weight:700;color:' + color + ';margin-top:4px;">' + value + '</div></div>';
    }

    function enviarAprobacion() {
        var sku = document.getElementById('unSku').value;
        if (!sku) { Utils.showToast('Debe ingresar un código', 'error'); return; }
        var costo = parseFloat(document.getElementById('unCosto').value) || 0;
        if (costo <= 0) { Utils.showToast('Debe calcular primero', 'error'); return; }
        var precioNuevoEquiv = parseFloat(document.getElementById('unPrecioNuevo').value) || 0;
        var precioCompUsado = parseFloat(document.getElementById('unPrecioCompUsado').value) || 0;
        var calidad = document.getElementById('unCalidad').value;
        var estadoFisico = document.getElementById('unEstadoFisico').value;
        var factorCalidad = calidad === 'Alta' ? 0.70 : (calidad === 'Media' ? 0.55 : 0.40);
        var factorEstado = estadoFisico === 'Excelente' ? 1.0 : (estadoFisico === 'Bueno' ? 0.9 : (estadoFisico === 'Regular' ? 0.75 : 0.55));
        var precioBase = precioNuevoEquiv > 0 ? precioNuevoEquiv * factorCalidad * factorEstado : costo * 1.5;
        if (precioCompUsado > 0) { precioBase = Math.min(precioBase, precioCompUsado * 0.98); }
        if (precioBase < costo * 1.17) precioBase = costo * 1.17;
        var precioSugerido = Math.round(precioBase / 100) * 100;
        var margen = Utils.calcMargen(costo, precioSugerido);

        var solicitud = { id: 'APR-' + (AppData.solicitudesAprobacion.length + 1).toString().padStart(3, '0'), sku: sku, motivo: 'Producto usado con código nuevo', accion: 'Calcular precio usado', precioActual: 0, precioPropuesto: precioSugerido, margen: margen, regla: 'Usado código nuevo requiere aprobación', solicitante: 'Admin General', fecha: new Date().toISOString().slice(0, 10), estado: 'Pendiente' };
        AppData.solicitudesAprobacion.push(solicitud);
        AppData.addBitacora({ tipo: 'Aprobación', sku: sku, descripcion: 'Solicitud aprobación producto usado código nuevo. Precio propuesto: ' + Utils.formatCurrency(precioSugerido) });
        Utils.showToast('Solicitud enviada: ' + solicitud.id, 'success');
    }

    function limpiar() {
        document.querySelectorAll('.form-card input, .form-card select, .form-card textarea').forEach(function(i) {
            if (i.type === 'select-multiple') {
                Array.from(i.options).forEach(function(o) { o.selected = false; });
            } else {
                i.value = '';
            }
        });
        document.getElementById('unResultado').innerHTML = '';
    }

    return { render: render, calcular: calcular, enviarAprobacion: enviarAprobacion, limpiar: limpiar, precargarEjemplo: precargarEjemplo };
})();
