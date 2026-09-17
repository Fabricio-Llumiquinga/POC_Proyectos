// ===== UTILITIES =====
var Utils = (function() {
    'use strict';

    function formatCurrency(value) {
        if (value === null || value === undefined) return '$0';
        return '$' + Math.round(value).toLocaleString('es-CO');
    }

    function formatPercent(value) {
        if (value === null || value === undefined) return '0%';
        return value.toFixed(1) + '%';
    }

    function calcMarkup(costo, precio) {
        if (!costo || costo === 0) return 0;
        return ((precio - costo) / costo) * 100;
    }

    function calcMargen(costo, precio) {
        if (!precio || precio === 0) return 0;
        return ((precio - costo) / precio) * 100;
    }

    function calcVariacion(anterior, nuevo) {
        if (!anterior || anterior === 0) return 0;
        return ((nuevo - anterior) / anterior) * 100;
    }

    function showToast(message, type) {
        type = type || 'info';
        var container = document.getElementById('toastContainer');
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 4000);
    }

    function showModal(title, bodyHtml, footerHtml) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHtml;
        document.getElementById('modalFooter').innerHTML = footerHtml || '';
        document.getElementById('modalOverlay').classList.add('active');
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    function getBadgeClass(estado) {
        var map = {
            'Activo': 'badge-green', 'Aprobado': 'badge-green', 'Aplicado en punto de venta': 'badge-green',
            'Dentro de rango': 'badge-green', 'Homologado correctamente': 'badge-green', 'Sincronizado': 'badge-green',
            'Pendiente': 'badge-yellow', 'En revisión': 'badge-yellow', 'Pendiente de envío': 'badge-yellow',
            'Revisar': 'badge-yellow', 'Pendiente de aprobación': 'badge-yellow',
            'Rechazado': 'badge-red', 'Error de integración': 'badge-red', 'Sobreprecio': 'badge-red',
            'Liquidación': 'badge-purple', 'Código nuevo': 'badge-blue', 'Usado': 'badge-blue'
        };
        return map[estado] || 'badge-gray';
    }

    function getAlertBadge(estadoAlerta) {
        var map = {
            'normal': '<span class="badge badge-green">Normal</span>',
            'dentro_rango': '<span class="badge badge-green">Dentro de rango</span>',
            'aplicacion_exitosa': '<span class="badge badge-green">Aplicado</span>',
            'costo_menor_5': '<span class="badge badge-gray">Sin cambio</span>',
            'costo_5_10': '<span class="badge badge-yellow">En revisión</span>',
            'costo_mayor_10': '<span class="badge badge-yellow">Ajuste automático</span>',
            'costo_mayor_40_prov_dif': '<span class="badge badge-red">Crear código</span>',
            'sobreprecio': '<span class="badge badge-red">Sobreprecio</span>',
            'bajo_mercado': '<span class="badge badge-yellow">Bajo mercado</span>',
            'bajo_stock': '<span class="badge badge-yellow">Bajo stock</span>',
            'sobre_stock': '<span class="badge badge-yellow">Sobre stock</span>',
            'liquidacion': '<span class="badge badge-purple">Liquidación</span>',
            'margen_bajo': '<span class="badge badge-red">Margen bajo</span>',
            'sin_evaluacion_reciente': '<span class="badge badge-gray">Sin evaluación</span>',
            'tendencia_negativa': '<span class="badge badge-yellow">Tendencia -</span>',
            'usado_sin_equivalencia': '<span class="badge badge-yellow">Sin equivalencia</span>',
            'codigo_nuevo_pendiente': '<span class="badge badge-blue">Código nuevo</span>',
            'lado_incompleto': '<span class="badge badge-yellow">Lado incompleto</span>'
        };
        return map[estadoAlerta] || '<span class="badge badge-gray">-</span>';
    }

    function exportCSV(headers, rows, filename) {
        var csv = headers.join(',') + '\n';
        rows.forEach(function(row) {
            csv += row.map(function(cell) {
                return '"' + String(cell || '').replace(/"/g, '""') + '"';
            }).join(',') + '\n';
        });
        var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'export.csv';
        link.click();
    }

    // Simulated API
    var API = {
        pos: {
            getProductos: function() { return Promise.resolve(AppData.productos); },
            getPrecio: function(sku) {
                var p = AppData.getProducto(sku);
                return Promise.resolve(p ? { sku: sku, precio: p.precioActual, costo: p.costoActual } : null);
            },
            getVariaciones: function(sku) {
                var cambios = AppData.cambiosCosto.filter(function(c) { return c.sku === sku; });
                return Promise.resolve(cambios);
            },
            actualizarPrecio: function(sku, nuevoPrecio) {
                var p = AppData.getProducto(sku);
                if (!p) return Promise.resolve({ success: false, error: 'SKU no encontrado' });
                var anterior = p.precioActual;
                p.precioActual = nuevoPrecio;
                var log = { id: 'API-' + (AppData.logApiPos.length + 1).toString().padStart(3, '0'), sku: sku, accion: 'Actualizar precio', precioAnterior: anterior, precioNuevo: nuevoPrecio, estado: 'Aplicado en punto de venta', fecha: new Date().toISOString().slice(0, 16).replace('T', ' '), usuario: 'Sistema' };
                AppData.logApiPos.unshift(log);
                return Promise.resolve({ success: true, id: log.id });
            },
            getEstado: function(idCambio) {
                var log = AppData.logApiPos.find(function(l) { return l.id === idCambio; });
                return Promise.resolve(log ? log.estado : 'No encontrado');
            },
            reprocesar: function(idCambio) {
                var log = AppData.logApiPos.find(function(l) { return l.id === idCambio; });
                if (log) { log.estado = 'Aplicado en punto de venta'; }
                return Promise.resolve({ success: true });
            }
        }
    };

    // Pricing engine
    function calcularPrecioNuevo(datos) {
        var markup = 50; // base
        if (datos.origen === 'Importado') markup += 10;
        if (datos.rangoCalidad === 'Alta') markup += 8;
        if (datos.rangoCalidad === 'Baja') markup -= 10;
        if (datos.rotacion === 'Alta') markup -= 5;
        if (datos.rotacion === 'Baja') markup += 10;
        if (datos.disponibilidadOrigen === 'Baja') markup += 12;
        if (datos.antiguedad > 5) markup -= 5;
        var precio = datos.costo * (1 + markup / 100);
        if (datos.precioCompetencia && datos.precioCompetencia > 0) {
            var precioRef = datos.precioCompetencia * 0.98;
            precio = Math.min(precio, precioRef);
            if (precio < datos.costo * 1.17) precio = datos.costo * 1.17;
        }
        precio = Math.round(precio / 100) * 100;
        return { precio: precio, markup: calcMarkup(datos.costo, precio), margen: calcMargen(datos.costo, precio), reglas: generarReglasAplicadas(datos, markup) };
    }

    function generarReglasAplicadas(datos, markup) {
        var reglas = ['Markup base: 50%'];
        if (datos.origen === 'Importado') reglas.push('Origen importado: +10%');
        if (datos.rangoCalidad === 'Alta') reglas.push('Calidad alta: +8%');
        if (datos.rangoCalidad === 'Baja') reglas.push('Calidad baja: -10%');
        if (datos.rotacion === 'Alta') reglas.push('Rotación alta: -5%');
        if (datos.rotacion === 'Baja') reglas.push('Rotación baja: +10%');
        if (datos.disponibilidadOrigen === 'Baja') reglas.push('Disponibilidad baja: +12%');
        if (datos.precioCompetencia) reglas.push('Ajuste por competencia aplicado');
        reglas.push('Markup final: ' + markup.toFixed(1) + '%');
        return reglas;
    }

    function evaluarCambioCosto(producto, nuevoCosto) {
        var costoAnterior = producto.costoActual;
        var variacion = calcVariacion(costoAnterior, nuevoCosto);
        var absVar = Math.abs(variacion);
        var accion = 'No cambiar precio';
        var requiereAprobacion = false;
        var precioPropuesto = producto.precioActual;
        if (absVar < AppData.parametros.umbralNoCambio) {
            accion = 'No cambiar precio';
        } else if (absVar <= AppData.parametros.umbralRevision) {
            accion = 'Revisar';
            precioPropuesto = Math.round(nuevoCosto * (1 + calcMarkup(costoAnterior, producto.precioActual) / 100));
        } else {
            accion = 'Ajustar automáticamente';
            precioPropuesto = Math.round(nuevoCosto * (1 + calcMarkup(costoAnterior, producto.precioActual) / 100));
        }
        if (absVar > 40 && producto.proveedorActual !== producto.proveedorAnterior) {
            accion = 'Crear nuevo código';
            requiereAprobacion = true;
        }
        var markupPropuesto = calcMarkup(nuevoCosto, precioPropuesto);
        if (markupPropuesto < AppData.parametros.markupPiso || markupPropuesto > AppData.parametros.markupTecho) {
            requiereAprobacion = true;
        }
        if (variacion > AppData.parametros.techoVariacion || variacion < AppData.parametros.pisoVariacion) {
            requiereAprobacion = true;
        }
        return { variacion: variacion, accion: accion, precioPropuesto: precioPropuesto, markupPropuesto: markupPropuesto, requiereAprobacion: requiereAprobacion };
    }

    function puedeAplicarAutomaticamente(producto, precioPropuesto) {
        if (!producto || producto.estado === 'Pendiente') return false;
        if (producto.inventario <= 0) return false;
        if (precioPropuesto <= 0) return false;
        var markup = calcMarkup(producto.costoActual, precioPropuesto);
        if (markup < AppData.parametros.markupPiso) return false;
        if (markup > AppData.parametros.markupTecho) return false;
        var margen = calcMargen(producto.costoActual, precioPropuesto);
        if (margen < AppData.parametros.margenMinimo) return false;
        if (producto.estadoAlerta === 'lado_incompleto') return false;
        if (producto.tipoIngreso === 'Código nuevo') return false;
        if (producto.condicion === 'Usado' && producto.tipoIngreso === 'Código nuevo') return false;
        return true;
    }

    return {
        formatCurrency: formatCurrency,
        formatPercent: formatPercent,
        calcMarkup: calcMarkup,
        calcMargen: calcMargen,
        calcVariacion: calcVariacion,
        showToast: showToast,
        showModal: showModal,
        closeModal: closeModal,
        getBadgeClass: getBadgeClass,
        getAlertBadge: getAlertBadge,
        exportCSV: exportCSV,
        API: API,
        calcularPrecioNuevo: calcularPrecioNuevo,
        evaluarCambioCosto: evaluarCambioCosto,
        puedeAplicarAutomaticamente: puedeAplicarAutomaticamente
    };
})();
