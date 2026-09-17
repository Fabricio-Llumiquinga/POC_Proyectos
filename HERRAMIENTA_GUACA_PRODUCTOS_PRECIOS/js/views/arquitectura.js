// ===== ARQUITECTURA LAGO DE DATOS VIEW =====
var ArquitecturaView = (function() {
    'use strict';

    function render() {
        var html = '<h2 class="section-title">Arquitectura Lago de Datos</h2>';
        html += '<p class="section-subtitle">Diagrama de la arquitectura del Pricing Control Hub y flujo de datos.</p>';
        html += '<div class="form-card">';
        html += '<div class="arch-diagram">';

        // Layer 1: Sources
        html += '<div style="text-align:center;font-weight:600;color:#1565c0;margin-bottom:8px;">FUENTES DE DATOS</div>';
        html += '<div class="arch-layer">';
        html += node('Sistema Punto de Venta', 'arch-source');
        html += node('Maestro de Productos', 'arch-source');
        html += node('Costos', 'arch-source');
        html += node('Inventario', 'arch-source');
        html += node('Ventas / Consumo', 'arch-source');
        html += node('Precios Competencia', 'arch-source');
        html += node('Investigación Mercado', 'arch-source');
        html += '</div>';

        // Arrow
        html += '<div class="arch-arrow">&#9660; &#9660; &#9660;</div>';

        // Layer 2: Lake
        html += '<div class="arch-layer">';
        html += '<div class="arch-node arch-lake">LAGO DE DATOS<br><span style="font-size:11px;opacity:0.8;">Centralización, limpieza, enriquecimiento</span></div>';
        html += '</div>';

        // Arrow
        html += '<div class="arch-arrow">&#9660; &#9660; &#9660;</div>';

        // Layer 3: Processing
        html += '<div style="text-align:center;font-weight:600;color:#e65100;margin-bottom:8px;">PROCESAMIENTO</div>';
        html += '<div class="arch-layer">';
        html += node('Motor de Reglas', 'arch-engine');
        html += node('Sugerencias IA', 'arch-engine');
        html += node('Comparación Mercado', 'arch-engine');
        html += node('Homologación Lados', 'arch-engine');
        html += '</div>';

        // Arrow
        html += '<div class="arch-arrow">&#9660; &#9660; &#9660;</div>';

        // Layer 4: Output
        html += '<div style="text-align:center;font-weight:600;color:#2e7d32;margin-bottom:8px;">SALIDAS / ACCIONES</div>';
        html += '<div class="arch-layer">';
        html += node('Plataforma Web', 'arch-output');
        html += node('Aprobaciones', 'arch-output');
        html += node('API Punto de Venta', 'arch-output');
        html += node('Histórico y Auditoría', 'arch-output');
        html += node('Chatbot IA', 'arch-output');
        html += '</div>';

        html += '</div>';  // arch-diagram

        // Description
        html += '<div style="margin-top:30px;padding:20px;background:#f8fafc;border-radius:8px;border-left:4px solid #1a73e8;">';
        html += '<p style="line-height:1.7;font-size:13px;color:#37474f;">';
        html += 'El <strong>Lago de Datos</strong> centraliza información comercial, costos, inventario, histórico de precios, rotación, competencia, productos nuevos/usados y reglas de negocio para alimentar la plataforma de pricing con datos consistentes, trazables y reutilizables.';
        html += '</p></div>';

        // Flow
        html += '<div style="margin-top:20px;padding:20px;background:#fff3e0;border-radius:8px;border-left:4px solid #ff9800;">';
        html += '<h4 style="margin-bottom:10px;">Flujo Completo del Sistema</h4>';
        html += '<p style="line-height:1.7;font-size:13px;color:#37474f;">';
        html += '<strong>1.</strong> Datos del Lago de Datos &rarr; <strong>2.</strong> Motor de Reglas &rarr; <strong>3.</strong> Sugerencia IA &rarr; <strong>4.</strong> Aprobación o Aplicación Automática &rarr; <strong>5.</strong> Envío API al Punto de Venta &rarr; <strong>6.</strong> Histórico y Trazabilidad &rarr; <strong>7.</strong> Consulta mediante Chatbot IA';
        html += '</p></div>';
        html += '</div>';
        return html;
    }

    function node(text, cls) {
        return '<div class="arch-node ' + cls + '">' + text + '</div>';
    }

    return { render: render };
})();
