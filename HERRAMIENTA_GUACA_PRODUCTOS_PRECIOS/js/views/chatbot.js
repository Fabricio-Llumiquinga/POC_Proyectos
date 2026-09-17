// ===== CHATBOT IA VIEW =====
var ChatbotView = (function() {
    'use strict';

    var mensajes = [];
    var sugerencias = [
        '¿Cuál es el precio actual del producto LG-001?',
        '¿Por qué este producto requiere aprobación?',
        '¿Cuál es la tendencia de precio de LG-005?',
        '¿Este producto está por encima del mercado?',
        '¿Qué regla se aplicó al cambio de costo?',
        '¿Cuál es el margen actual de LG-016?',
        '¿Tiene producto relacionado por lado?',
        '¿Se puede aplicar automáticamente este cambio?',
        '¿Qué productos están pendientes de aprobación?',
        '¿Qué productos tienen alerta por competencia?'
    ];

    function render() {
        var html = '<h2 class="section-title">Asistente IA de Pricing</h2>';
        html += '<div class="chatbot-container">';
        html += '<div class="chat-messages" id="chatMessages">';
        html += '<div class="chat-message bot">Hola, soy el Asistente IA de Pricing de La Guaca. Puedo ayudarte con consultas sobre productos, precios, reglas, históricos y competencia. ¿En qué puedo ayudarte?</div>';
        mensajes.forEach(function(m) {
            html += '<div class="chat-message ' + m.tipo + '">' + m.texto + '</div>';
        });
        html += '</div>';
        html += '<div class="chat-suggestions">';
        sugerencias.forEach(function(s) {
            html += '<button class="chat-suggestion" onclick="ChatbotView.preguntar(\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</button>';
        });
        html += '</div>';
        html += '<div class="chat-input-area">';
        html += '<input type="text" class="chat-input" id="chatInput" placeholder="Escribe tu pregunta..." onkeypress="if(event.key===\'Enter\')ChatbotView.enviar()">';
        html += '<button class="chat-send" onclick="ChatbotView.enviar()">Enviar</button>';
        html += '</div></div>';
        return html;
    }

    function enviar() {
        var input = document.getElementById('chatInput');
        var texto = input.value.trim();
        if (!texto) return;
        input.value = '';
        agregarMensaje(texto, 'user');
        setTimeout(function() {
            var respuesta = generarRespuesta(texto);
            agregarMensaje(respuesta, 'bot');
        }, 500);
    }

    function preguntar(texto) {
        document.getElementById('chatInput').value = texto;
        enviar();
    }

    function agregarMensaje(texto, tipo) {
        mensajes.push({ texto: texto, tipo: tipo });
        var container = document.getElementById('chatMessages');
        var div = document.createElement('div');
        div.className = 'chat-message ' + tipo;
        div.textContent = texto;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function generarRespuesta(pregunta) {
        var q = pregunta.toLowerCase();
        // Search for SKU
        var skuMatch = q.match(/lg-\d+|u-lg-\d+/i);
        var sku = skuMatch ? skuMatch[0].toUpperCase() : null;
        var p = sku ? AppData.getProducto(sku) : null;

        if (q.indexOf('precio actual') > -1 || q.indexOf('cuál es el precio') > -1) {
            if (p) return 'El precio actual de ' + p.sku + ' (' + p.descripcion + ') es ' + Utils.formatCurrency(p.precioActual) + ' con un costo de ' + Utils.formatCurrency(p.costoActual) + ' y markup de ' + Utils.formatPercent(Utils.calcMarkup(p.costoActual, p.precioActual)) + '.';
            return 'Por favor indica el SKU del producto. Ejemplo: LG-001';
        }
        if (q.indexOf('aprobación') > -1 || q.indexOf('requiere aprobacion') > -1) {
            if (p) {
                if (p.tipoIngreso === 'Código nuevo') return 'El producto ' + p.sku + ' requiere aprobación porque es un producto con código nuevo. Todo producto con SKU nuevo debe ser aprobado antes de enviarse al punto de venta.';
                if (p.condicion === 'Usado') return 'Este SKU corresponde a un producto usado con código nuevo, por lo que debe solicitar aprobación antes de enviarse al punto de venta.';
                return 'El producto ' + p.sku + ' no tiene requerimiento de aprobación activo en este momento.';
            }
            var pend = AppData.solicitudesAprobacion.filter(function(s){return s.estado==='Pendiente';});
            return 'Actualmente hay ' + pend.length + ' solicitudes pendientes de aprobación. Los motivos incluyen: código nuevo, producto usado, política comercial y cambios fuera de rango.';
        }
        if (q.indexOf('tendencia') > -1) {
            if (p) {
                var hist = AppData.getHistorico(sku);
                if (hist.length > 0) {
                    var ultimo = hist[hist.length - 1];
                    var primero = hist[0];
                    var cambio = ((ultimo.precio - primero.precio) / primero.precio * 100).toFixed(1);
                    return 'La tendencia de precio de ' + p.sku + ' muestra un cambio del ' + cambio + '% desde ' + primero.fecha + '. Precio inicial: ' + Utils.formatCurrency(primero.precio) + ', precio actual: ' + Utils.formatCurrency(ultimo.precio) + '.';
                }
                return 'No hay historial suficiente para determinar la tendencia de ' + p.sku + '.';
            }
            return 'Indica el SKU para consultar su tendencia. Ejemplo: ¿Cuál es la tendencia de precio de LG-005?';
        }
        if (q.indexOf('mercado') > -1 || q.indexOf('competencia') > -1 || q.indexOf('sobreprecio') > -1) {
            if (p) {
                var comp = AppData.getCompetencia(sku);
                if (comp.length > 0) {
                    var promedio = comp.reduce(function(a,c){return a+c.precioComp;},0) / comp.length;
                    var dif = ((p.precioActual - promedio) / promedio * 100).toFixed(1);
                    if (dif > 10) return 'El precio de La Guaca para ' + p.sku + ' está ' + dif + '% por encima del promedio de mercado (' + Utils.formatCurrency(promedio) + '). La plataforma sugiere una reducción calculada para quedar dentro del rango permitido.';
                    if (dif < -15) return 'El producto ' + p.sku + ' está por debajo del mercado en ' + Math.abs(dif) + '%. Se puede evaluar un aumento de precio.';
                    return 'El producto ' + p.sku + ' está dentro del rango de mercado. Diferencia: ' + dif + '% vs promedio ' + Utils.formatCurrency(promedio) + '.';
                }
                return 'No hay datos de competencia registrados para ' + p.sku + '. Se recomienda realizar investigación de mercado.';
            }
            var conAlerta = AppData.productos.filter(function(p){return p.estadoAlerta==='sobreprecio'||p.estadoAlerta==='bajo_mercado';});
            return 'Hay ' + conAlerta.length + ' producto(s) con alerta por competencia: ' + conAlerta.map(function(p){return p.sku;}).join(', ') + '.';
        }
        if (q.indexOf('margen') > -1) {
            if (p) return 'El margen actual de ' + p.sku + ' es ' + Utils.formatPercent(Utils.calcMargen(p.costoActual, p.precioActual)) + ' con markup de ' + Utils.formatPercent(Utils.calcMarkup(p.costoActual, p.precioActual)) + '. El margen mínimo permitido es ' + AppData.parametros.margenMinimo + '%.';
            return 'Indica el SKU para consultar su margen. Ejemplo: ¿Cuál es el margen actual de LG-016?';
        }
        if (q.indexOf('lado') > -1 || q.indexOf('par') > -1) {
            if (p) {
                if (p.tieneLado) return 'Este producto tiene lado ' + p.lado + ' asociado. El par es ' + p.skuPareja + '. Se debe calcular precio homologado usando el promedio de precios sugeridos.';
                return 'El producto ' + p.sku + ' no tiene lado asociado.';
            }
            var conLado = AppData.productos.filter(function(p){return p.tieneLado;});
            return 'Hay ' + conLado.length + ' productos con lado registrado en el sistema.';
        }
        if (q.indexOf('automáticamente') > -1 || q.indexOf('automaticamente') > -1 || q.indexOf('aplicar') > -1) {
            if (p) {
                var puede = Utils.puedeAplicarAutomaticamente(p, p.precioActual);
                if (puede) return 'El producto ' + p.sku + ' cumple todas las condiciones para aplicación automática.';
                return 'El producto ' + p.sku + ' NO puede aplicarse automáticamente. Posibles razones: código nuevo, usado, margen bajo, markup fuera de rango, o tiene alertas pendientes.';
            }
            return 'Un cambio se aplica automáticamente solo si cumple TODAS las reglas de negocio: sin aprobación pendiente, SKU activo, precio > 0, markup y margen en rango, sin inconsistencias por lado, y sin alertas críticas.';
        }
        if (q.indexOf('cambio de costo') > -1 || q.indexOf('regla') > -1 || q.indexOf('costo') > -1) {
            if (p) {
                var cambio = AppData.cambiosCosto.find(function(c){return c.sku === sku;});
                if (cambio) {
                    var abs = Math.abs(cambio.variacion);
                    if (abs < 5) return 'El producto ' + sku + ' tiene un cambio de costo de ' + Utils.formatPercent(cambio.variacion) + ', menor al 5%. Regla aplicada: No cambiar precio.';
                    if (abs <= 10) return 'El producto ' + sku + ' tiene un cambio de costo de ' + Utils.formatPercent(cambio.variacion) + ', entre 5% y 10%. Regla aplicada: Revisar.';
                    return 'El producto ' + sku + ' tiene un cambio de costo mayor al 10% (' + Utils.formatPercent(cambio.variacion) + '). La acción recomendada es ajustar automáticamente.' + (abs > 40 ? ' Sin embargo, supera el 40% lo que podría requerir crear nuevo código.' : '');
                }
                return 'No hay cambio de costo registrado para ' + p.sku + '.';
            }
            return 'Las reglas de cambio de costo son: <5% no cambiar precio, 5-10% revisar, >10% ajustar automáticamente (si cumple reglas), >40% con proveedor diferente: crear nuevo código.';
        }
        if (q.indexOf('pendiente') > -1) {
            var pend = AppData.solicitudesAprobacion.filter(function(s){return s.estado==='Pendiente';});
            return 'Hay ' + pend.length + ' producto(s) pendientes de aprobación: ' + pend.map(function(s){return s.sku + ' (' + s.motivo + ')';}).join(', ') + '.';
        }
        // Default response
        return 'Puedo ayudarte con consultas sobre: precios actuales, tendencias, competencia, reglas de negocio, aprobaciones, márgenes, lados de producto y aplicación automática. Intenta incluir el SKU del producto (ej: LG-001) para respuestas más específicas.';
    }

    return { render: render, enviar: enviar, preguntar: preguntar };
})();
