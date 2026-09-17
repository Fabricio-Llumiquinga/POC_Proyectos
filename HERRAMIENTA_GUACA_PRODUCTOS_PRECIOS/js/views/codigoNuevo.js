// ===== PRODUCTO CÓDIGO NUEVO VIEW =====
var CodigoNuevoView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Producto con Código Nuevo</h2>';
        html += '<p class="section-subtitle">Calcular precio sugerido para productos que ingresan con un SKU nuevo. Todo producto con código nuevo requiere aprobación.</p>';

        // Botones superiores
        html += '<div class="btn-group mb-16">';
        html += '<button class="btn btn-outline" onclick="CodigoNuevoView.precargarEjemplo()">&#128203; Precargar ejemplo</button>';
        html += '<button class="btn btn-outline" onclick="CodigoNuevoView.limpiar()">Limpiar formulario</button>';
        html += '</div>';

        // SECCION 1: Identificación
        html += '<div class="form-card"><div class="form-card-title">1. Identificación del Producto</div>';
        html += '<div class="form-row">';
        html += field('cnSku', 'Código / SKU', 'text', 'Ej: LG-025');
        html += field('cnDescripcion', 'Descripción', 'text', 'Nombre completo del producto');
        html += fieldSelect('cnMarca', 'Marca', ['Toyota','Honda','Mazda','Nissan','Hyundai','Kia','Chevrolet','Ford','Suzuki','Mitsubishi','Subaru','Otro']);
        html += field('cnFamilia', 'Familia / Serie', 'text', 'Ej: Iluminación, Suspensión');
        html += fieldSelect('cnCategoria', 'Categoría', ['Faros','Radiadores','Amortiguadores','Bombas','Alternadores','Espejos','Stops','Filtros','Pastillas','Compresores','Guardafangos','Capós','Discos','Termostatos','Correas','Sensores','Parrillas','Clutch','Aceites','Puertas','Otro']);
        html += fieldSelect('cnCopro', 'Copro (Productos comparables)', ['Aceites','Puertas','Faros','Radiadores','Amortiguadores','Bombas','Alternadores','Espejos','Stops','Filtros','Pastillas','Compresores','Discos','Termostatos','Correas','Sensores','Clutch','Carrocería','Eléctrico','Refrigeración','Motor','Transmisión','Frenos','Aire Acondicionado','Otro']);
        html += '</div></div>';

        // SECCION 2: Clasificación
        html += '<div class="form-card"><div class="form-card-title">2. Clasificación y Condición</div>';
        html += '<div class="form-row">';
        html += fieldSelect('cnCondicion', 'Condición', ['Nuevo','Usado']);
        html += fieldSelect('cnOrigen', 'Origen', ['Local','Importado']);
        html += field('cnAntiguedad', 'Antigüedad (años)', 'number', '0');
        html += fieldSelect('cnRotacion', 'Rotación esperada', ['Alta','Media','Baja']);
        html += fieldSelect('cnCalidad', 'Rango de calidad', ['Alta','Media','Baja']);
        html += fieldSelect('cnDisponibilidad', 'Disponibilidad en origen', ['Alta','Media','Baja','Nula']);
        html += fieldSelect('cnTieneLado', '¿Tiene lado?', ['No','Sí']);
        html += fieldSelect('cnLado', 'Lado', ['Izquierdo','Derecho']);
        html += '</div></div>';

        // SECCION 3: Costos y Proveedor
        html += '<div class="form-card"><div class="form-card-title">3. Costos, Inventario y Proveedor</div>';
        html += '<div class="form-row">';
        html += field('cnCosto', 'Costo', 'number', '0');
        html += field('cnInventario', 'Inventario inicial', 'number', '0');
        html += field('cnProveedor', 'Proveedor', 'text', 'Nombre del proveedor');
        html += field('cnPrecioComp', 'Precio de competencia (si existe)', 'number', '0');
        html += '</div></div>';

        // SECCION 4: Competencia interna
        html += '<div class="form-card"><div class="form-card-title">4. Marcas Competidoras Internas</div>';
        html += '<div class="form-row">';
        html += fieldSelectMultiple('cnCompetidoras', 'Seleccione las marcas que compiten internamente', ['Depo','TYC','Valeo','Monroe','KYB','GMB','NPW','Bosch','Denso','Brembo','Ferodo','Sanden','Gates','Continental','Wix','Mann','TRW','LUK','Aftermarket']);
        html += '<div class="form-group"><label class="form-label">Observación</label><textarea class="form-control" id="cnObservacion" rows="3" placeholder="Notas adicionales sobre el producto..."></textarea></div>';
        html += '</div></div>';

        // Botones de acción
        html += '<div class="form-card" style="background:#f8fafc;border:1px dashed #cfd8dc;">';
        html += '<div class="btn-group">';
        html += '<button class="btn btn-primary" onclick="CodigoNuevoView.calcular()" style="padding:12px 24px;font-size:14px;">&#9654; Calcular precio sugerido</button>';
        html += '<button class="btn btn-warning" onclick="CodigoNuevoView.enviarAprobacion()" style="padding:12px 24px;font-size:14px;">&#10004; Enviar a aprobación</button>';
        html += '</div></div>';

        html += '<div id="cnResultado"></div>';
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
        document.getElementById('cnSku').value = 'LG-030';
        document.getElementById('cnDescripcion').value = 'Faro Antiniebla Mazda CX-5 2022';
        document.getElementById('cnMarca').value = 'Mazda';
        document.getElementById('cnFamilia').value = 'Iluminación';
        document.getElementById('cnCategoria').value = 'Faros';
        document.getElementById('cnCopro').value = 'Faros';
        document.getElementById('cnCondicion').value = 'Nuevo';
        document.getElementById('cnOrigen').value = 'Importado';
        document.getElementById('cnAntiguedad').value = '1';
        document.getElementById('cnRotacion').value = 'Media';
        document.getElementById('cnCalidad').value = 'Alta';
        document.getElementById('cnDisponibilidad').value = 'Alta';
        document.getElementById('cnTieneLado').value = 'Sí';
        document.getElementById('cnLado').value = 'Izquierdo';
        document.getElementById('cnCosto').value = '55000';
        document.getElementById('cnInventario').value = '6';
        document.getElementById('cnProveedor').value = 'Proveedor Alpha';
        document.getElementById('cnPrecioComp').value = '92000';
        var sel = document.getElementById('cnCompetidoras');
        if (sel) {
            Array.from(sel.options).forEach(function(opt) {
                opt.selected = (opt.value === 'Depo' || opt.value === 'TYC');
            });
        }
        document.getElementById('cnObservacion').value = 'Producto nuevo para línea Mazda CX-5. Primera importación.';
        Utils.showToast('Datos de ejemplo precargados. Puede calcular el precio.', 'info');
    }

    function calcular() {
        var costo = parseFloat(document.getElementById('cnCosto').value) || 0;
        if (costo <= 0) { Utils.showToast('Debe ingresar un costo válido', 'error'); return; }
        var datos = {
            costo: costo,
            origen: document.getElementById('cnOrigen').value,
            rangoCalidad: document.getElementById('cnCalidad').value,
            rotacion: document.getElementById('cnRotacion').value,
            antiguedad: parseInt(document.getElementById('cnAntiguedad').value) || 0,
            disponibilidadOrigen: document.getElementById('cnDisponibilidad').value,
            precioCompetencia: parseFloat(document.getElementById('cnPrecioComp').value) || 0
        };
        var resultado = Utils.calcularPrecioNuevo(datos);
        var tieneLado = document.getElementById('cnTieneLado').value === 'Sí';
        var lado = document.getElementById('cnLado').value;

        var html = '<div class="result-box success" style="margin-top:24px;">';
        html += '<h3 style="margin-bottom:16px;color:#2e7d32;">&#10004; Resultado del Cálculo</h3>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
        html += resultCard('Precio sugerido', Utils.formatCurrency(resultado.precio), '#1a73e8');
        html += resultCard('Markup sugerido', Utils.formatPercent(resultado.markup), '#546e7a');
        html += resultCard('Margen estimado', Utils.formatPercent(resultado.margen), '#546e7a');
        html += resultCard('Estado', 'Requiere aprobación', '#e65100');
        if (tieneLado) html += resultCard('Lado', lado, '#1565c0');
        html += '</div>';
        html += '<div style="margin-top:16px;padding:12px;background:#fff;border-radius:6px;border:1px solid #e0e6ed;">';
        html += '<strong style="font-size:12px;">Reglas aplicadas:</strong><ul style="margin-top:6px;padding-left:18px;">';
        resultado.reglas.forEach(function(r) { html += '<li style="font-size:12px;color:#546e7a;margin-bottom:3px;">' + r + '</li>'; });
        if (tieneLado) html += '<li style="font-size:12px;color:#1565c0;margin-bottom:3px;">Producto con lado: requiere homologación de precio con par</li>';
        html += '</ul></div></div>';
        document.getElementById('cnResultado').innerHTML = html;
        Utils.showToast('Precio calculado. Requiere aprobación para aplicar.', 'info');
    }

    function resultCard(label, value, color) {
        return '<div style="padding:12px;background:#f8fafc;border-radius:8px;border-left:3px solid ' + color + ';"><div style="font-size:11px;color:#7f8c8d;">' + label + '</div><div style="font-size:18px;font-weight:700;color:' + color + ';margin-top:4px;">' + value + '</div></div>';
    }

    function enviarAprobacion() {
        var sku = document.getElementById('cnSku').value;
        if (!sku) { Utils.showToast('Debe ingresar un SKU', 'error'); return; }
        var costo = parseFloat(document.getElementById('cnCosto').value) || 0;
        if (costo <= 0) { Utils.showToast('Debe calcular primero', 'error'); return; }
        var datos = { costo: costo, origen: document.getElementById('cnOrigen').value, rangoCalidad: document.getElementById('cnCalidad').value, rotacion: document.getElementById('cnRotacion').value, antiguedad: parseInt(document.getElementById('cnAntiguedad').value) || 0, disponibilidadOrigen: document.getElementById('cnDisponibilidad').value, precioCompetencia: parseFloat(document.getElementById('cnPrecioComp').value) || 0 };
        var resultado = Utils.calcularPrecioNuevo(datos);
        var solicitud = { id: 'APR-' + (AppData.solicitudesAprobacion.length + 1).toString().padStart(3, '0'), sku: sku, motivo: 'Producto con código nuevo', accion: 'Calcular precio', precioActual: 0, precioPropuesto: resultado.precio, margen: resultado.margen, regla: 'Código nuevo requiere aprobación', solicitante: 'Admin General', fecha: new Date().toISOString().slice(0, 10), estado: 'Pendiente' };
        AppData.solicitudesAprobacion.push(solicitud);
        AppData.addBitacora({ tipo: 'Aprobación', sku: sku, descripcion: 'Solicitud de aprobación enviada para código nuevo' });
        Utils.showToast('Solicitud de aprobación enviada: ' + solicitud.id, 'success');
    }

    function limpiar() {
        document.querySelectorAll('.form-card input, .form-card select, .form-card textarea').forEach(function(i) {
            if (i.type === 'select-multiple') {
                Array.from(i.options).forEach(function(o) { o.selected = false; });
            } else {
                i.value = '';
            }
        });
        document.getElementById('cnResultado').innerHTML = '';
    }

    return { render: render, calcular: calcular, enviarAprobacion: enviarAprobacion, limpiar: limpiar, precargarEjemplo: precargarEjemplo };
})();
