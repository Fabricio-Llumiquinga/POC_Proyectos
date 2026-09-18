/**
 * ═══════════════════════════════════════════════════════════════════════
 * 💳 Aplicación Inteligente de Pagos y Conciliación Bancaria
 * JavaScript Principal - Plantilla Empresarial
 * 
 * Control centralizado de extractos bancarios, comprobantes recibidos,
 * conciliación y aplicación automática de pagos mediante integración API.
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

// ─── CONFIGURACIÓN Y CATÁLOGOS ───────────────────────────────────────
const CONFIG = {
    ITEMS_POR_PAGINA: 10,
    EMPRESAS: ['Nuevos', 'Usados'],
    BANCOS: ['BCR', 'Banco Nacional', 'BAC', 'BCT', 'BCT Panamá'],
    BANCOS_CARGA_MANUAL: ['BCR', 'Banco Nacional', 'BAC', 'BCT', 'BCT Panamá'],
    MONEDAS: ['CRC', 'USD'],
    CANALES: ['Carga manual', 'Chatbot / WhatsApp'],
    SISTEMAS_DESTINO: ['SAP', 'ERP', 'Sistema Contable', 'Sistema de Caja', 'Sistema Legacy'],
    TIPOS_MOVIMIENTO: ['Crédito', 'Débito'],
    CATEGORIAS: [
        'Pago de cliente', 'Pago procesador de tarjeta', 'Depósito de caja',
        'Débito bancario', 'Transacción entre compañías', 'SINPE Móvil Davivienda excluido',
        'Ingreso no identificado', 'Otro'
    ],
    ESTADOS_EXTRACTO: ['Pendiente', 'Aplicado'],
    ESTADOS_PAGO: ['En proceso', 'Aplicado', 'Revisión manual'],
    METODOS_OBTENCION: ['API bancaria', 'API de banco', 'API interna', 'Carga desde archivo', 'Carga manual'],
    METODOS_INTEGRACION: ['API bancaria', 'API sistema destino', 'API interna', 'Servicio backend', 'Agente API'],
    MOTIVOS_EXCEPCION: [
        'Monto no coincide', 'Referencia no encontrada', 'Fecha fuera de rango',
        'Imagen ilegible', 'Datos incompletos', 'Duplicado detectado',
        'Error de conexión API', 'Sistema destino no disponible', 'Cliente no identificado'
    ],
    // Cuentas bancarias ficticias por banco
    CUENTAS_BANCARIAS: {
        'BCR': ['bcr-4521', 'bcr-7834', 'bcr-1290', 'bcr-5567', 'bcr-8823'],
        'Banco Nacional': ['bn-3312', 'bn-6654', 'bn-9901', 'bn-2245', 'bn-7780'],
        'BAC': ['bac-1223', 'bac-4456', 'bac-7789', 'bac-3301', 'bac-5543'],
        'BCT': ['bct-2210', 'bct-5543', 'bct-8876', 'bct-1102'],
        'BCT Panamá': ['bctp-1001', 'bctp-2002', 'bctp-3003']
    }
};

// ─── GENERADOR DE DATA SIMULADA ──────────────────────────────────────

function generarCuentaBancaria(banco) {
    const cuentas = CONFIG.CUENTAS_BANCARIAS[banco];
    if (cuentas && cuentas.length > 0) {
        return cuentas[Math.floor(Math.random() * cuentas.length)];
    }
    return banco.toLowerCase().replace(/\s+/g, '').substring(0, 3) + '-' + Math.floor(1000 + Math.random() * 9000);
}

function generarReferencia() {
    return 'REF-' + Math.floor(100000 + Math.random() * 900000);
}

function fechaAleatoria(diasAtras) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * diasAtras));
    return fecha;
}

function formatearFecha(fecha) {
    return fecha.toISOString().split('T')[0];
}

function formatearMonto(monto, moneda) {
    const simbolo = moneda === 'CRC' ? '₡' : '$';
    return simbolo + monto.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function aleatorio(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generarCliente() {
    const nombres = ['Carlos Ramírez', 'María Solano', 'José Mora', 'Ana Jiménez', 'Luis Vargas', 'Sofía Castro', 'Diego Hernández', 'Laura Quesada', 'Roberto Arias', 'Patricia Rojas', 'Fernando Calvo', 'Andrea Sánchez', 'Mauricio Cordero', 'Gabriela Montero', 'Ricardo Vindas'];
    return aleatorio(nombres);
}

function generarCodigoCliente() {
    return 'CLI-' + Math.floor(10000 + Math.random() * 90000);
}

// ─── GENERAR EXTRACTOS BANCARIOS (50+ registros) ────────────────────
function generarExtractosBancarios() {
    const datos = [];
    const descripciones = [
        'Transferencia recibida', 'Depósito en ventanilla', 'Pago electrónico',
        'Transferencia SINPE', 'Depósito ATM', 'Pago de factura',
        'Crédito por devolución', 'Débito automático', 'Comisión bancaria',
        'Transferencia internacional', 'Pago de préstamo', 'Depósito de cheque',
        'Transferencia interbancaria', 'Cargo por servicio', 'Abono de intereses'
    ];

    for (let i = 0; i < 65; i++) {
        const empresa = aleatorio(CONFIG.EMPRESAS);
        const banco = aleatorio(CONFIG.BANCOS);
        const moneda = Math.random() > 0.2 ? 'CRC' : 'USD';
        const tipo = Math.random() > 0.4 ? 'Crédito' : 'Débito';
        const monto = moneda === 'CRC'
            ? Math.floor(50000 + Math.random() * 5000000)
            : Math.floor(100 + Math.random() * 10000);

        const estadoExt = aleatorio(CONFIG.ESTADOS_EXTRACTO);
        datos.push({
            id: i + 1,
            fecha: fechaAleatoria(30),
            empresa: empresa,
            banco: banco,
            cuenta: generarCuentaBancaria(banco),
            moneda: moneda,
            referencia: generarReferencia(),
            descripcion: aleatorio(descripciones),
            tipo: tipo,
            monto: monto,
            estado: estadoExt,
            observacion: estadoExt === 'Aplicado' ? 'Aplicación automática vía API' : '',
            metodo: aleatorio(CONFIG.METODOS_OBTENCION),
            fechaCarga: fechaAleatoria(5),
            archivoOrigen: `extracto_${banco.toLowerCase().replace(' ', '_')}_${formatearFecha(new Date())}.csv`,
            seleccionado: false
        });
    }

    return datos.sort((a, b) => b.fecha - a.fecha);
}

// ─── GENERAR PAGOS SIMULADOS (50+ registros) ────────────────────────
function generarPagos() {
    const datos = [];
    for (let i = 0; i < 55; i++) {
        const empresa = aleatorio(CONFIG.EMPRESAS);
        const banco = aleatorio(CONFIG.BANCOS);
        const moneda = Math.random() > 0.15 ? 'CRC' : 'USD';
        const estado = aleatorio(CONFIG.ESTADOS_PAGO);
        const monto = moneda === 'CRC'
            ? Math.floor(100000 + Math.random() * 8000000)
            : Math.floor(200 + Math.random() * 15000);
        const fechaRecepcion = fechaAleatoria(30);
        const diasPendientes = estado === 'Aplicado' ? 0 : Math.floor(Math.random() * 10);
        const canal = aleatorio(CONFIG.CANALES);
        const codigoCliente = generarCodigoCliente();

        datos.push({
            id: i + 1,
            fecha: fechaRecepcion,
            empresa: empresa,
            canal: canal,
            usuario: aleatorio(['Juan Pérez', 'María López', 'Carlos Ruiz', 'Ana Mora', 'Sistema API']),
            codigoCliente: codigoCliente,
            nombreCliente: generarCliente(),
            banco: banco,
            cuenta: generarCuentaBancaria(banco),
            referencia: generarReferencia(),
            monto: monto,
            moneda: moneda,
            estado: estado,
            diasPendientes: diasPendientes,
            observacion: estado === 'Aplicado' ? 'Aplicación automática vía API' : (estado === 'Revisión manual' ? aleatorio(['Monto no coincide', 'Referencia no encontrada', 'Imagen ilegible']) : ''),
            fechaAplicacion: estado === 'Aplicado' ? formatearFecha(new Date(fechaRecepcion.getTime() + Math.random() * 86400000 * 2)) : null,
            confianzaIA: (0.6 + Math.random() * 0.4).toFixed(2),
            metodoIntegracion: aleatorio(CONFIG.METODOS_INTEGRACION)
        });
    }
    return datos.sort((a, b) => b.fecha - a.fecha);
}

// ─── APLICACIÓN PRINCIPAL ────────────────────────────────────────────
const App = {
    // Estado global
    extractos: [],
    pagos: [],
    extractosFiltrados: [],
    pagosFiltrados: [],
    reportesFiltrados: [],
    paginaExtractos: 1,
    paginaPagos: 1,
    paginaReportes: 1,
    ordenExtractos: { campo: 'fecha', asc: false },
    ordenPagos: { campo: 'fecha', asc: false },
    extractosSeleccionados: new Set(),

    // ─── INICIALIZACIÓN ─────────────────────────────────────────────
    init() {
        this.extractos = generarExtractosBancarios();
        this.pagos = generarPagos();
        this.extractosFiltrados = [...this.extractos];
        this.pagosFiltrados = [...this.pagos];
        this.reportesFiltrados = [...this.pagos];

        this.configurarNavegacion();
        this.configurarMenuMovil();
        this.mostrarFechaActual();
        this.poblarSelects();
        this.renderizarModulo('extractos');
    },

    // ─── NAVEGACIÓN SPA ─────────────────────────────────────────────
    configurarNavegacion() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const modulo = item.dataset.module;
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                document.querySelectorAll('.module').forEach(m => m.classList.add('hidden'));
                document.getElementById(`module-${modulo}`).classList.remove('hidden');
                this.renderizarModulo(modulo);
                document.getElementById('sidebar').classList.remove('open');
            });
        });
    },

    configurarMenuMovil() {
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    },

    mostrarFechaActual() {
        const fecha = new Date();
        document.getElementById('currentDate').textContent = fecha.toLocaleDateString('es-CR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    },

    // ─── POBLAR SELECTS ─────────────────────────────────────────────
    poblarSelects() {
        const poblar = (id, opciones) => {
            const sel = document.getElementById(id);
            if (!sel) return;
            opciones.forEach(op => {
                const option = document.createElement('option');
                option.value = op;
                option.textContent = op;
                sel.appendChild(option);
            });
        };

        // Extractos (sin moneda, tipo, categoría)
        poblar('ext-empresa', CONFIG.EMPRESAS);
        poblar('ext-banco', CONFIG.BANCOS);
        poblar('ext-estado', CONFIG.ESTADOS_EXTRACTO);

        // Poblar cuentas bancarias
        const selCuenta = document.getElementById('ext-cuenta');
        if (selCuenta) {
            Object.entries(CONFIG.CUENTAS_BANCARIAS).forEach(([banco, cuentas]) => {
                cuentas.forEach(cuenta => {
                    const option = document.createElement('option');
                    option.value = cuenta;
                    option.textContent = cuenta;
                    selCuenta.appendChild(option);
                });
            });
        }

        // Pagos
        poblar('pag-empresa', CONFIG.EMPRESAS);
        poblar('pag-banco', CONFIG.BANCOS);
        poblar('pag-canal', CONFIG.CANALES);
        poblar('pag-estado', CONFIG.ESTADOS_PAGO);

        // Reportes
        poblar('rep-empresa', CONFIG.EMPRESAS);
        poblar('rep-banco', CONFIG.BANCOS);
        poblar('rep-moneda', CONFIG.MONEDAS);
        poblar('rep-estado', CONFIG.ESTADOS_PAGO);
        poblar('rep-canal', CONFIG.CANALES);
    },

    renderizarModulo(modulo) {
        switch (modulo) {
            case 'extractos':
                this.renderKPIExtractos();
                this.renderTablaExtractos();
                break;
            case 'pagos':
                this.renderKPIPagos();
                this.renderTablaPagos();
                break;
            case 'kpis':
                this.renderKPIReportes();
                this.renderGraficos();
                this.renderTablaReportes();
                break;
        }
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 1: EXTRACTOS BANCARIOS
    // ═══════════════════════════════════════════════════════════════════

    renderKPIExtractos() {
        const datos = this.extractosFiltrados;
        const aplicados = datos.filter(d => d.estado === 'Aplicado').length;
        const pendientes = datos.filter(d => d.estado === 'Pendiente').length;
        const bancos = [...new Set(datos.map(d => d.banco))].length;
        const cuentas = [...new Set(datos.map(d => d.cuenta))].length;

        document.getElementById('kpi-extractos').innerHTML = `
            <div class="kpi-card"><div class="kpi-icon">📋</div><div class="kpi-value">${datos.length}</div><div class="kpi-label">Total transacciones</div></div>
            <div class="kpi-card"><div class="kpi-icon">✅</div><div class="kpi-value">${aplicados}</div><div class="kpi-label">Aplicados</div></div>
            <div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-value">${pendientes}</div><div class="kpi-label">Pendientes</div></div>
            <div class="kpi-card"><div class="kpi-icon">🏦</div><div class="kpi-value">${bancos}</div><div class="kpi-label">Bancos consultados</div></div>
            <div class="kpi-card"><div class="kpi-icon">🏧</div><div class="kpi-value">${cuentas}</div><div class="kpi-label">Cuentas activas</div></div>
        `;
    },

    renderTablaExtractos() {
        const inicio = (this.paginaExtractos - 1) * CONFIG.ITEMS_POR_PAGINA;
        const fin = inicio + CONFIG.ITEMS_POR_PAGINA;
        const pagina = this.extractosFiltrados.slice(inicio, fin);

        document.getElementById('ext-total-registros').textContent = `${this.extractosFiltrados.length} registros`;
        this.actualizarInfoSeleccion();

        const tbody = document.getElementById('tbody-extractos');
        tbody.innerHTML = pagina.map(r => {
            const esAplicado = r.estado === 'Aplicado';
            const checkboxDisabled = esAplicado ? 'disabled' : '';
            return `
            <tr class="${this.extractosSeleccionados.has(r.id) ? 'row-selected' : ''} ${esAplicado ? 'row-applied' : ''}">
                <td><input type="checkbox" ${this.extractosSeleccionados.has(r.id) ? 'checked' : ''} ${checkboxDisabled} onchange="App.toggleSeleccionExtracto(${r.id}, this.checked)"></td>
                <td>${formatearFecha(r.fecha)}</td>
                <td>${r.empresa}</td>
                <td>${r.banco}</td>
                <td><small>${r.cuenta}</small></td>
                <td><span class="badge badge-info">${r.moneda}</span></td>
                <td><small>${r.referencia}</small></td>
                <td><small>${r.descripcion}</small></td>
                <td><span class="badge ${r.tipo === 'Crédito' ? 'badge-success' : 'badge-warning'}">${r.tipo}</span></td>
                <td><strong>${formatearMonto(r.monto, r.moneda)}</strong></td>
                <td>${this.getBadgeEstadoRelacion(r.estado)}</td>
                <td><small>${r.observacion || '-'}</small></td>
                <td><small>${r.metodo}</small></td>
                <td class="actions-cell">
                    <button class="btn btn-xs btn-primary" onclick="App.verDetalleExtracto(${r.id})">👁️</button>
                    ${esAplicado ? '' : `<button class="btn btn-xs btn-secondary" onclick="App.relacionarManual(${r.id})">🔗</button>`}
                </td>
            </tr>`;
        }).join('');

        this.renderPaginacion('paginacion-extractos', this.extractosFiltrados.length, this.paginaExtractos, 'Extractos');
    },

    // ─── SELECCIÓN MASIVA DE EXTRACTOS ──────────────────────────────
    toggleSeleccionExtracto(id, checked) {
        if (checked) {
            this.extractosSeleccionados.add(id);
        } else {
            this.extractosSeleccionados.delete(id);
        }
        this.actualizarInfoSeleccion();
        this.renderTablaExtractos();
    },

    seleccionarTodosExtractos(checked) {
        const inicio = (this.paginaExtractos - 1) * CONFIG.ITEMS_POR_PAGINA;
        const fin = inicio + CONFIG.ITEMS_POR_PAGINA;
        const pagina = this.extractosFiltrados.slice(inicio, fin);

        pagina.forEach(r => {
            if (r.estado === 'Aplicado') return; // No permitir seleccionar aplicados
            if (checked) {
                this.extractosSeleccionados.add(r.id);
            } else {
                this.extractosSeleccionados.delete(r.id);
            }
        });
        this.actualizarInfoSeleccion();
        this.renderTablaExtractos();
    },

    actualizarInfoSeleccion() {
        const count = this.extractosSeleccionados.size;
        const infoEl = document.getElementById('ext-seleccionados');
        const btnEl = document.getElementById('btn-autoaplicar-masivo');

        if (count > 0) {
            const seleccionados = this.extractos.filter(e => this.extractosSeleccionados.has(e.id));
            const sumatoria = seleccionados.reduce((s, e) => s + e.monto, 0);
            infoEl.innerHTML = `<strong>${count} seleccionados</strong> | Total: <strong>${formatearMonto(sumatoria, 'CRC')}</strong>`;
            btnEl.style.display = 'inline-flex';
        } else {
            infoEl.innerHTML = '';
            btnEl.style.display = 'none';
        }
    },

    autoaplicarSeleccionMasiva() {
        const count = this.extractosSeleccionados.size;
        if (count === 0) {
            this.mostrarToast('Info', 'Seleccione al menos una transacción', 'warning');
            return;
        }

        const seleccionados = this.extractos.filter(e => this.extractosSeleccionados.has(e.id));
        const sumatoria = seleccionados.reduce((s, e) => s + e.monto, 0);

        const contenido = `
            <div style="margin-bottom:16px; padding:12px; background:var(--azul-claro); border-radius:8px;">
                <p><strong>Transacciones seleccionadas:</strong> ${count}</p>
                <p><strong>Monto total (sumatoria):</strong> ${formatearMonto(sumatoria, 'CRC')}</p>
            </div>
            <div class="modal-form-grid">
                <div class="form-group full-width">
                    <label>Código de cliente al cual se aplicará el pago *</label>
                    <input type="text" id="masivo-codigo-cliente" placeholder="CLI-00000" required>
                </div>
                <div class="form-group full-width">
                    <label>Observación</label>
                    <textarea id="masivo-observacion" placeholder="Observaciones para la aplicación masiva..."></textarea>
                </div>
            </div>
            <div style="margin-top:12px; font-size:11px; color:var(--gris-texto);">
                <strong>Transacciones incluidas:</strong>
                <ul style="margin-top:4px; padding-left:16px;">
                    ${seleccionados.slice(0, 10).map(e => `<li>${e.referencia} - ${e.banco} - ${formatearMonto(e.monto, e.moneda)}</li>`).join('')}
                    ${seleccionados.length > 10 ? `<li>... y ${seleccionados.length - 10} más</li>` : ''}
                </ul>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="App.confirmarAutoaplicarMasivo()">⚙️ Confirmar y autoaplicar vía API</button>
        `;

        this.abrirModal('⚙️ Autoaplicar Selección Masiva', contenido, footer);
    },

    confirmarAutoaplicarMasivo() {
        const codigoCliente = document.getElementById('masivo-codigo-cliente').value.trim();
        if (!codigoCliente) {
            this.mostrarToast('Error', 'Debe ingresar el código de cliente', 'error');
            return;
        }

        const observacion = document.getElementById('masivo-observacion').value.trim();
        this.cerrarModal();
        this.mostrarToast('Procesando', 'Ejecutando autoaplicar masiva vía API...', 'warning');

        setTimeout(() => {
            const seleccionados = this.extractos.filter(e => this.extractosSeleccionados.has(e.id));
            seleccionados.forEach(ext => {
                ext.estado = 'Aplicado';
                ext.observacion = observacion || 'Aplicación masiva vía API - Cliente: ' + codigoCliente;
            });
            this.extractosSeleccionados.clear();
            this.extractosFiltrados = [...this.extractos];
            this.renderKPIExtractos();
            this.renderTablaExtractos();
            this.mostrarToast('Aplicación exitosa', `${seleccionados.length} transacciones aplicadas al cliente ${codigoCliente} vía API.`, 'success');
        }, 1500);
    },

    getBadgeEstadoRelacion(estado) {
        const mapeo = {
            'Aplicado': 'badge-success',
            'Pendiente': 'badge-warning'
        };
        return `<span class="badge ${mapeo[estado] || 'badge-secondary'}">${estado}</span>`;
    },

    getBadgeEstadoPago(estado) {
        const mapeo = {
            'En proceso': 'badge-info',
            'Aplicado': 'badge-success',
            'Revisión manual': 'badge-warning'
        };
        return `<span class="badge ${mapeo[estado] || 'badge-secondary'}">${estado}</span>`;
    },

    // Filtros Extractos (sin moneda, tipo, categoría, referencia)
    filtrarExtractos() {
        let datos = [...this.extractos];
        const val = (id) => document.getElementById(id)?.value || '';

        if (val('ext-fecha-desde')) datos = datos.filter(d => formatearFecha(d.fecha) >= val('ext-fecha-desde'));
        if (val('ext-fecha-hasta')) datos = datos.filter(d => formatearFecha(d.fecha) <= val('ext-fecha-hasta'));
        if (val('ext-empresa')) datos = datos.filter(d => d.empresa === val('ext-empresa'));
        if (val('ext-banco')) datos = datos.filter(d => d.banco === val('ext-banco'));
        if (val('ext-cuenta')) datos = datos.filter(d => d.cuenta === val('ext-cuenta'));
        if (val('ext-estado')) datos = datos.filter(d => d.estado === val('ext-estado'));
        if (val('ext-monto-desde')) datos = datos.filter(d => d.monto >= parseFloat(val('ext-monto-desde')));
        if (val('ext-monto-hasta')) datos = datos.filter(d => d.monto <= parseFloat(val('ext-monto-hasta')));

        this.extractosFiltrados = datos;
        this.paginaExtractos = 1;
        this.extractosSeleccionados.clear();
        this.renderKPIExtractos();
        this.renderTablaExtractos();
        this.mostrarToast('Filtros aplicados', `${datos.length} registros encontrados`, 'success');
    },

    limpiarFiltrosExtractos() {
        document.querySelectorAll('#filtros-extractos input, #filtros-extractos select').forEach(el => {
            if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        });
        this.extractosFiltrados = [...this.extractos];
        this.paginaExtractos = 1;
        this.extractosSeleccionados.clear();
        this.renderKPIExtractos();
        this.renderTablaExtractos();
    },

    busquedaGlobalExtractos(texto) {
        if (!texto) {
            this.extractosFiltrados = [...this.extractos];
        } else {
            const t = texto.toLowerCase();
            this.extractosFiltrados = this.extractos.filter(d =>
                d.referencia.toLowerCase().includes(t) ||
                d.descripcion.toLowerCase().includes(t) ||
                d.empresa.toLowerCase().includes(t) ||
                d.banco.toLowerCase().includes(t) ||
                d.cuenta.toLowerCase().includes(t) ||
                (d.observacion && d.observacion.toLowerCase().includes(t))
            );
        }
        this.paginaExtractos = 1;
        this.renderKPIExtractos();
        this.renderTablaExtractos();
    },

    ordenarExtractos(campo) {
        if (this.ordenExtractos.campo === campo) {
            this.ordenExtractos.asc = !this.ordenExtractos.asc;
        } else {
            this.ordenExtractos = { campo, asc: true };
        }
        this.extractosFiltrados.sort((a, b) => {
            let va = a[campo], vb = b[campo];
            if (campo === 'fecha') { va = va.getTime(); vb = vb.getTime(); }
            if (va < vb) return this.ordenExtractos.asc ? -1 : 1;
            if (va > vb) return this.ordenExtractos.asc ? 1 : -1;
            return 0;
        });
        this.renderTablaExtractos();
    },

    // ─── ACCIONES DE EXTRACTOS ──────────────────────────────────────

    // Relacionar manualmente con confirmación, observación y código de cliente
    relacionarManual(id) {
        const r = this.extractos.find(e => e.id === id);
        if (!r) return;

        const contenido = `
            <div style="margin-bottom:16px; padding:12px; background:var(--azul-claro); border-radius:8px;">
                <p><strong>Transacción:</strong> ${r.referencia}</p>
                <p><strong>Banco:</strong> ${r.banco} | <strong>Monto:</strong> ${formatearMonto(r.monto, r.moneda)}</p>
                <p><strong>Descripción:</strong> ${r.descripcion}</p>
            </div>
            <div class="modal-form-grid">
                <div class="form-group full-width">
                    <label>Código de cliente al cual se le debe aplicar el pago *</label>
                    <input type="text" id="relacionar-codigo-cliente" placeholder="CLI-00000" required>
                </div>
                <div class="form-group full-width">
                    <label>Observación *</label>
                    <textarea id="relacionar-observacion" placeholder="Ingrese el motivo de la relación manual..." required></textarea>
                </div>
            </div>
            <p style="font-size:11px; color:var(--gris-texto); margin-top:12px;">
                ⚠️ Al confirmar, esta transacción será marcada como "Aplicado" y vinculada al cliente indicado.
            </p>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="App.confirmarRelacionManual(${id})">✅ Confirmar relación</button>
        `;

        this.abrirModal('🔗 Relacionar Manualmente', contenido, footer);
    },

    confirmarRelacionManual(id) {
        const codigoCliente = document.getElementById('relacionar-codigo-cliente').value.trim();
        const observacion = document.getElementById('relacionar-observacion').value.trim();

        if (!codigoCliente) {
            this.mostrarToast('Error', 'Debe ingresar el código de cliente', 'error');
            return;
        }
        if (!observacion) {
            this.mostrarToast('Error', 'Debe ingresar una observación', 'error');
            return;
        }

        const r = this.extractos.find(e => e.id === id);
        if (r) {
            r.estado = 'Aplicado';
            r.observacion = observacion;
            this.extractosFiltrados = [...this.extractos];
            this.cerrarModal();
            this.renderKPIExtractos();
            this.renderTablaExtractos();
            this.mostrarToast('Éxito', `Movimiento ${r.referencia} aplicado al cliente ${codigoCliente}.`, 'success');
        }
    },


    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 2: SEGUIMIENTO DE PAGOS
    // ═══════════════════════════════════════════════════════════════════

    renderKPIPagos() {
        const datos = this.pagosFiltrados;
        const enProceso = datos.filter(d => d.estado === 'En proceso').length;
        const aplicados = datos.filter(d => d.estado === 'Aplicado').length;
        const revision = datos.filter(d => d.estado === 'Revisión manual').length;

        document.getElementById('kpi-pagos').innerHTML = `
            <div class="kpi-card"><div class="kpi-icon">📥</div><div class="kpi-value">${datos.length}</div><div class="kpi-label">Comprobantes recibidos</div></div>
            <div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-value">${enProceso}</div><div class="kpi-label">En proceso</div></div>
            <div class="kpi-card"><div class="kpi-icon">✅</div><div class="kpi-value">${aplicados}</div><div class="kpi-label">Aplicados</div></div>
            <div class="kpi-card"><div class="kpi-icon">⚠️</div><div class="kpi-value">${revision}</div><div class="kpi-label">Revisión manual</div></div>
        `;
    },

    renderTablaPagos() {
        const inicio = (this.paginaPagos - 1) * CONFIG.ITEMS_POR_PAGINA;
        const fin = inicio + CONFIG.ITEMS_POR_PAGINA;
        const pagina = this.pagosFiltrados.slice(inicio, fin);

        document.getElementById('pag-total-registros').textContent = `${this.pagosFiltrados.length} registros`;

        const tbody = document.getElementById('tbody-pagos');
        tbody.innerHTML = pagina.map(r => {
            const deshabilitarReproceso = r.estado === 'Aplicado' || r.estado === 'En proceso';
            return `
            <tr>
                <td>${formatearFecha(r.fecha)}</td>
                <td>${r.empresa}</td>
                <td><small>${r.canal}</small></td>
                <td><small>${r.codigoCliente}</small></td>
                <td>${r.banco}</td>
                <td><strong>${formatearMonto(r.monto, r.moneda)}</strong></td>
                <td>${this.getBadgeEstadoPago(r.estado)}</td>
                <td>${r.diasPendientes > 0 ? r.diasPendientes + 'd' : '-'}</td>
                <td><small>${r.observacion || '-'}</small></td>
                <td class="actions-cell">
                    <button class="btn btn-xs btn-primary" onclick="App.verDetallePago(${r.id})">👁️</button>
                    <button class="btn btn-xs btn-secondary" onclick="App.verComprobante(${r.id})">🖼️</button>
                    <button class="btn btn-xs btn-success" onclick="App.reprocesarPago(${r.id})" ${deshabilitarReproceso ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>🔁</button>
                </td>
            </tr>`;
        }).join('');

        this.renderPaginacion('paginacion-pagos', this.pagosFiltrados.length, this.paginaPagos, 'Pagos');
    },

    filtrarPagos() {
        let datos = [...this.pagos];
        const val = (id) => document.getElementById(id)?.value || '';

        if (val('pag-fecha-desde')) datos = datos.filter(d => formatearFecha(d.fecha) >= val('pag-fecha-desde'));
        if (val('pag-fecha-hasta')) datos = datos.filter(d => formatearFecha(d.fecha) <= val('pag-fecha-hasta'));
        if (val('pag-empresa')) datos = datos.filter(d => d.empresa === val('pag-empresa'));
        if (val('pag-banco')) datos = datos.filter(d => d.banco === val('pag-banco'));
        if (val('pag-canal')) datos = datos.filter(d => d.canal === val('pag-canal'));
        if (val('pag-estado')) datos = datos.filter(d => d.estado === val('pag-estado'));

        this.pagosFiltrados = datos;
        this.paginaPagos = 1;
        this.renderKPIPagos();
        this.renderTablaPagos();
        this.mostrarToast('Filtros aplicados', `${datos.length} registros encontrados`, 'success');
    },

    limpiarFiltrosPagos() {
        document.querySelectorAll('#filtros-pagos input, #filtros-pagos select').forEach(el => {
            if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        });
        this.pagosFiltrados = [...this.pagos];
        this.paginaPagos = 1;
        this.renderKPIPagos();
        this.renderTablaPagos();
    },

    busquedaGlobalPagos(texto) {
        if (!texto) {
            this.pagosFiltrados = [...this.pagos];
        } else {
            const t = texto.toLowerCase();
            this.pagosFiltrados = this.pagos.filter(d =>
                d.nombreCliente.toLowerCase().includes(t) ||
                d.codigoCliente.toLowerCase().includes(t) ||
                d.referencia.toLowerCase().includes(t) ||
                d.banco.toLowerCase().includes(t) ||
                d.empresa.toLowerCase().includes(t)
            );
        }
        this.paginaPagos = 1;
        this.renderKPIPagos();
        this.renderTablaPagos();
    },

    ordenarPagos(campo) {
        if (this.ordenPagos.campo === campo) {
            this.ordenPagos.asc = !this.ordenPagos.asc;
        } else {
            this.ordenPagos = { campo, asc: true };
        }
        this.pagosFiltrados.sort((a, b) => {
            let va = a[campo], vb = b[campo];
            if (campo === 'fecha') { va = va.getTime(); vb = vb.getTime(); }
            if (va < vb) return this.ordenPagos.asc ? -1 : 1;
            if (va > vb) return this.ordenPagos.asc ? 1 : -1;
            return 0;
        });
        this.renderTablaPagos();
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 3: KPIs Y REPORTES
    // ═══════════════════════════════════════════════════════════════════

    renderKPIReportes() {
        const datos = this.pagos;
        const aplicados = datos.filter(d => d.estado === 'Aplicado');
        const enProceso = datos.filter(d => d.estado === 'En proceso').length;
        const revision = datos.filter(d => d.estado === 'Revisión manual').length;
        const montoAplicado = aplicados.reduce((s, d) => s + d.monto, 0);
        const pctAuto = datos.length > 0 ? ((aplicados.length / datos.length) * 100).toFixed(1) : 0;

        document.getElementById('kpi-reportes').innerHTML = `
            <div class="kpi-card"><div class="kpi-icon">📥</div><div class="kpi-value">${datos.length}</div><div class="kpi-label">Comprobantes recibidos</div></div>
            <div class="kpi-card"><div class="kpi-icon">✅</div><div class="kpi-value">${aplicados.length}</div><div class="kpi-label">Pagos aplicados</div></div>
            <div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-value">${enProceso}</div><div class="kpi-label">En proceso</div></div>
            <div class="kpi-card"><div class="kpi-icon">⚠️</div><div class="kpi-value">${revision}</div><div class="kpi-label">Revisión manual</div></div>
            <div class="kpi-card"><div class="kpi-icon">💰</div><div class="kpi-value">${formatearMonto(montoAplicado, 'CRC')}</div><div class="kpi-label">Monto aplicado</div></div>
            <div class="kpi-card"><div class="kpi-icon">🤖</div><div class="kpi-value">${pctAuto}%</div><div class="kpi-label">Aplicación automática</div></div>
        `;
    },

    // ─── GRÁFICOS ───────────────────────────────────────────────────
    renderGraficos() {
        this.renderChartEstados();
        this.renderChartDiario();
        this.renderChartBancos();
        this.renderChartCanales();
    },

    renderChartEstados() {
        const estados = {};
        this.pagos.forEach(p => { estados[p.estado] = (estados[p.estado] || 0) + 1; });

        const colores = ['#198754', '#FFC107', '#1E5A8A', '#DC3545', '#6f42c1', '#0dcaf0', '#fd7e14', '#20c997'];
        const items = Object.entries(estados).slice(0, 8);
        const total = items.reduce((s, [, v]) => s + v, 0);
        let acumulado = 0;

        const segmentos = items.map(([label, valor], i) => {
            const pct = (valor / total) * 100;
            const offset = acumulado;
            acumulado += pct;
            return { label, valor, pct, offset, color: colores[i % colores.length] };
        });

        const radio = 60, circunferencia = 2 * Math.PI * radio;
        let svgPaths = '';
        segmentos.forEach(seg => {
            const dashLen = (seg.pct / 100) * circunferencia;
            const dashOffset = -((seg.offset / 100) * circunferencia);
            svgPaths += `<circle cx="80" cy="80" r="${radio}" fill="none" stroke="${seg.color}" stroke-width="20" stroke-dasharray="${dashLen} ${circunferencia - dashLen}" stroke-dashoffset="${dashOffset}"/>`;
        });

        const legend = segmentos.map(s => `<div class="legend-item"><div class="legend-color" style="background:${s.color}"></div><span>${s.label}: ${s.valor} (${s.pct.toFixed(0)}%)</span></div>`).join('');

        document.getElementById('chart-estados').innerHTML = `<div class="donut-chart"><svg class="donut-svg" viewBox="0 0 160 160">${svgPaths}</svg><div class="donut-legend">${legend}</div></div>`;
    },

    renderChartDiario() {
        const dias = [];
        for (let i = 9; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = formatearFecha(d);
            const recibidos = this.pagos.filter(p => formatearFecha(p.fecha) === key).length || Math.floor(Math.random() * 8 + 2);
            const aplicados = Math.floor(recibidos * (0.5 + Math.random() * 0.4));
            dias.push({ label: d.getDate() + '/' + (d.getMonth() + 1), recibidos, aplicados });
        }

        const maxVal = Math.max(...dias.map(d => Math.max(d.recibidos, d.aplicados)), 1);
        const bars = dias.map(d => `<div class="line-chart-bar"><div class="bar-pair"><div class="bar-col" style="height:${(d.recibidos / maxVal) * 140}px; background:var(--azul-medio)"></div><div class="bar-col" style="height:${(d.aplicados / maxVal) * 140}px; background:var(--verde-exito)"></div></div><div class="bar-label">${d.label}</div></div>`).join('');

        document.getElementById('chart-diario').innerHTML = `<div class="line-chart">${bars}</div><div class="line-chart-legend"><span><span style="display:inline-block;width:12px;height:12px;background:var(--azul-medio);border-radius:2px;margin-right:4px"></span>Recibidos</span><span><span style="display:inline-block;width:12px;height:12px;background:var(--verde-exito);border-radius:2px;margin-right:4px"></span>Aplicados</span></div>`;
    },

    renderChartBancos() {
        const bancos = {};
        this.pagos.forEach(p => { bancos[p.banco] = (bancos[p.banco] || 0) + 1; });
        const items = Object.entries(bancos).sort((a, b) => b[1] - a[1]);
        const maxVal = Math.max(...items.map(([, v]) => v), 1);
        const colores = ['#0B1F3A', '#123C69', '#1E5A8A', '#2E86C1', '#5DADE2', '#85C1E9'];

        const bars = items.map(([label, valor], i) => `<div class="chart-bar-item"><div class="chart-bar-label">${label}</div><div class="chart-bar"><div class="chart-bar-fill" style="width:${(valor / maxVal) * 100}%; background:${colores[i % colores.length]}">${valor}</div></div></div>`).join('');
        document.getElementById('chart-bancos').innerHTML = `<div class="chart-bar-group">${bars}</div>`;
    },

    renderChartCanales() {
        const canales = {};
        this.pagos.forEach(p => { canales[p.canal] = (canales[p.canal] || 0) + 1; });
        const colores = ['#1E5A8A', '#198754', '#FFC107', '#DC3545', '#6f42c1'];
        const items = Object.entries(canales);
        const total = items.reduce((s, [, v]) => s + v, 0);
        let acumulado = 0;

        const segmentos = items.map(([label, valor], i) => {
            const pct = (valor / total) * 100;
            const offset = acumulado;
            acumulado += pct;
            return { label, valor, pct, offset, color: colores[i % colores.length] };
        });

        const radio = 60, circunferencia = 2 * Math.PI * radio;
        let svgPaths = '';
        segmentos.forEach(seg => {
            const dashLen = (seg.pct / 100) * circunferencia;
            const dashOffset = -((seg.offset / 100) * circunferencia);
            svgPaths += `<circle cx="80" cy="80" r="${radio}" fill="none" stroke="${seg.color}" stroke-width="20" stroke-dasharray="${dashLen} ${circunferencia - dashLen}" stroke-dashoffset="${dashOffset}"/>`;
        });

        const legend = segmentos.map(s => `<div class="legend-item"><div class="legend-color" style="background:${s.color}"></div><span>${s.label}: ${s.valor} (${s.pct.toFixed(0)}%)</span></div>`).join('');
        document.getElementById('chart-canales').innerHTML = `<div class="donut-chart"><svg class="donut-svg" viewBox="0 0 160 160">${svgPaths}</svg><div class="donut-legend">${legend}</div></div>`;
    },

    // Tabla de reportes
    renderTablaReportes() {
        const inicio = (this.paginaReportes - 1) * CONFIG.ITEMS_POR_PAGINA;
        const fin = inicio + CONFIG.ITEMS_POR_PAGINA;
        const pagina = this.reportesFiltrados.slice(inicio, fin);

        document.getElementById('rep-total-registros').textContent = `${this.reportesFiltrados.length} registros`;

        const tbody = document.getElementById('tbody-reportes');
        tbody.innerHTML = pagina.map(r => `
            <tr>
                <td>${formatearFecha(r.fecha)}</td>
                <td>${r.empresa}</td>
                <td>${r.nombreCliente}</td>
                <td><small>${r.codigoCliente}</small></td>
                <td>${r.banco}</td>
                <td><small>${r.referencia}</small></td>
                <td><strong>${formatearMonto(r.monto, r.moneda)}</strong></td>
                <td><span class="badge badge-info">${r.moneda}</span></td>
                <td>${this.getBadgeEstadoPago(r.estado)}</td>
                <td><small>${r.canal}</small></td>
                <td><small>${r.sistemaDestino}</small></td>
                <td>${r.fechaAplicacion || '-'}</td>
                <td>${r.resultadoValidacion}</td>
            </tr>
        `).join('');

        this.renderPaginacion('paginacion-reportes', this.reportesFiltrados.length, this.paginaReportes, 'Reportes');
    },

    filtrarReportes() {
        let datos = [...this.pagos];
        const val = (id) => document.getElementById(id)?.value || '';

        if (val('rep-fecha-desde')) datos = datos.filter(d => formatearFecha(d.fecha) >= val('rep-fecha-desde'));
        if (val('rep-fecha-hasta')) datos = datos.filter(d => formatearFecha(d.fecha) <= val('rep-fecha-hasta'));
        if (val('rep-empresa')) datos = datos.filter(d => d.empresa === val('rep-empresa'));
        if (val('rep-banco')) datos = datos.filter(d => d.banco === val('rep-banco'));
        if (val('rep-moneda')) datos = datos.filter(d => d.moneda === val('rep-moneda'));
        if (val('rep-estado')) datos = datos.filter(d => d.estado === val('rep-estado'));
        if (val('rep-canal')) datos = datos.filter(d => d.canal === val('rep-canal'));

        this.reportesFiltrados = datos;
        this.paginaReportes = 1;
        this.renderTablaReportes();
        this.mostrarToast('Filtros aplicados', `${datos.length} registros encontrados`, 'success');
    },

    limpiarFiltrosReportes() {
        document.querySelectorAll('.reportes-section input, .reportes-section select').forEach(el => {
            if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        });
        this.reportesFiltrados = [...this.pagos];
        this.paginaReportes = 1;
        this.renderTablaReportes();
    },

    busquedaGlobalReportes(texto) {
        if (!texto) {
            this.reportesFiltrados = [...this.pagos];
        } else {
            const t = texto.toLowerCase();
            this.reportesFiltrados = this.pagos.filter(d =>
                d.nombreCliente.toLowerCase().includes(t) ||
                d.codigoCliente.toLowerCase().includes(t) ||
                d.referencia.toLowerCase().includes(t) ||
                d.banco.toLowerCase().includes(t)
            );
        }
        this.paginaReportes = 1;
        this.renderTablaReportes();
    },

    // ═══════════════════════════════════════════════════════════════════
    // PAGINACIÓN
    // ═══════════════════════════════════════════════════════════════════

    renderPaginacion(containerId, totalItems, paginaActual, tipo) {
        const totalPaginas = Math.ceil(totalItems / CONFIG.ITEMS_POR_PAGINA);
        const container = document.getElementById(containerId);
        if (totalPaginas <= 1) { container.innerHTML = ''; return; }

        let html = `<button ${paginaActual === 1 ? 'disabled' : ''} onclick="App.irPagina('${tipo}', ${paginaActual - 1})">◀</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            if (i === 1 || i === totalPaginas || Math.abs(i - paginaActual) <= 2) {
                html += `<button class="${i === paginaActual ? 'active' : ''}" onclick="App.irPagina('${tipo}', ${i})">${i}</button>`;
            } else if (Math.abs(i - paginaActual) === 3) {
                html += `<span>...</span>`;
            }
        }
        html += `<button ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="App.irPagina('${tipo}', ${paginaActual + 1})">▶</button>`;
        container.innerHTML = html;
    },

    irPagina(tipo, pagina) {
        switch (tipo) {
            case 'Extractos': this.paginaExtractos = pagina; this.renderTablaExtractos(); break;
            case 'Pagos': this.paginaPagos = pagina; this.renderTablaPagos(); break;
            case 'Reportes': this.paginaReportes = pagina; this.renderTablaReportes(); break;
        }
    },

    // ═══════════════════════════════════════════════════════════════════
    // MODALES
    // ═══════════════════════════════════════════════════════════════════

    abrirModal(titulo, contenido, footer) {
        document.getElementById('modal-title').textContent = titulo;
        document.getElementById('modal-body').innerHTML = contenido;
        document.getElementById('modal-footer').innerHTML = footer || '';
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    cerrarModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ─── MODAL: Detalle Extracto ────────────────────────────────────
    verDetalleExtracto(id) {
        const r = this.extractos.find(e => e.id === id);
        if (!r) return;

        // Buscar pago asociado si está aplicado
        let pagoAsociado = null;
        if (r.estado === 'Aplicado') {
            pagoAsociado = this.pagos.find(p =>
                p.banco === r.banco && p.estado === 'Aplicado' && Math.abs(p.monto - r.monto) < 100
            );
        }

        const pagoAsociadoHTML = pagoAsociado ? `
            <div class="detail-item full-width" style="border-top:2px solid var(--azul-medio); padding-top:12px; margin-top:8px;">
                <div class="detail-label" style="color:var(--azul-medio); font-size:12px;">💳 PAGO ASOCIADO</div>
            </div>
            <div class="detail-item"><div class="detail-label">Código cliente</div><div class="detail-value">${pagoAsociado.codigoCliente}</div></div>
            <div class="detail-item"><div class="detail-label">Canal</div><div class="detail-value">${pagoAsociado.canal}</div></div>
            <div class="detail-item"><div class="detail-label">Monto pago</div><div class="detail-value"><strong>${formatearMonto(pagoAsociado.monto, pagoAsociado.moneda)}</strong></div></div>
            <div class="detail-item"><div class="detail-label">Fecha aplicación</div><div class="detail-value">${pagoAsociado.fechaAplicacion || '-'}</div></div>
            <div class="detail-item full-width"><div class="detail-label">Observación del pago</div><div class="detail-value">${pagoAsociado.observacion || '-'}</div></div>
        ` : (r.estado === 'Aplicado' ? `
            <div class="detail-item full-width" style="border-top:2px solid var(--azul-medio); padding-top:12px; margin-top:8px;">
                <div class="detail-label" style="color:var(--azul-medio); font-size:12px;">💳 PAGO ASOCIADO</div>
                <div class="detail-value">Aplicado vía integración API</div>
            </div>
        ` : '');

        const contenido = `
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Empresa</div><div class="detail-value">${r.empresa}</div></div>
                <div class="detail-item"><div class="detail-label">Banco</div><div class="detail-value">${r.banco}</div></div>
                <div class="detail-item"><div class="detail-label">Cuenta</div><div class="detail-value">${r.cuenta}</div></div>
                <div class="detail-item"><div class="detail-label">Moneda</div><div class="detail-value">${r.moneda}</div></div>
                <div class="detail-item"><div class="detail-label">Fecha</div><div class="detail-value">${formatearFecha(r.fecha)}</div></div>
                <div class="detail-item"><div class="detail-label">Referencia</div><div class="detail-value">${r.referencia}</div></div>
                <div class="detail-item full-width"><div class="detail-label">Descripción</div><div class="detail-value">${r.descripcion}</div></div>
                <div class="detail-item"><div class="detail-label">Tipo</div><div class="detail-value">${r.tipo}</div></div>
                <div class="detail-item"><div class="detail-label">Monto</div><div class="detail-value"><strong>${formatearMonto(r.monto, r.moneda)}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Estado</div><div class="detail-value">${this.getBadgeEstadoRelacion(r.estado)}</div></div>
                <div class="detail-item"><div class="detail-label">Observación</div><div class="detail-value">${r.observacion || '-'}</div></div>
                <div class="detail-item"><div class="detail-label">Método</div><div class="detail-value">${r.metodo}</div></div>
                <div class="detail-item"><div class="detail-label">Archivo origen</div><div class="detail-value">${r.archivoOrigen}</div></div>
                <div class="detail-item"><div class="detail-label">Fecha de carga</div><div class="detail-value">${formatearFecha(r.fechaCarga)}</div></div>
                ${pagoAsociadoHTML}
                <div class="detail-item full-width"><div class="detail-label">Historial</div><div class="detail-value">• ${formatearFecha(r.fechaCarga)} - Cargado vía ${r.metodo}<br>• ${formatearFecha(r.fecha)} - Transacción en banco${r.estado === 'Aplicado' ? '<br>• ' + formatearFecha(new Date()) + ' - Aplicado' : ''}</div></div>
            </div>`;
        this.abrirModal('🏦 Detalle de Transacción Bancaria', contenido, '<button class="btn btn-secondary" onclick="App.cerrarModal()">Cerrar</button>');
    },

    // ─── MODAL: Detalle Pago ────────────────────────────────────────
    verDetallePago(id) {
        const r = this.pagos.find(p => p.id === id);
        if (!r) return;
        const contenido = `
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Cliente</div><div class="detail-value">${r.nombreCliente}</div></div>
                <div class="detail-item"><div class="detail-label">Código</div><div class="detail-value">${r.codigoCliente}</div></div>
                <div class="detail-item"><div class="detail-label">Empresa</div><div class="detail-value">${r.empresa}</div></div>
                <div class="detail-item"><div class="detail-label">Canal</div><div class="detail-value">${r.canal}</div></div>
                <div class="detail-item"><div class="detail-label">Banco</div><div class="detail-value">${r.banco}</div></div>
                <div class="detail-item"><div class="detail-label">Cuenta</div><div class="detail-value">${r.cuenta}</div></div>
                <div class="detail-item"><div class="detail-label">Referencia</div><div class="detail-value">${r.referencia}</div></div>
                <div class="detail-item"><div class="detail-label">Monto</div><div class="detail-value"><strong>${formatearMonto(r.monto, r.moneda)}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Moneda</div><div class="detail-value">${r.moneda}</div></div>
                <div class="detail-item"><div class="detail-label">Estado</div><div class="detail-value">${r.estado}</div></div>
                <div class="detail-item"><div class="detail-label">Fecha recepción</div><div class="detail-value">${formatearFecha(r.fecha)}</div></div>
                <div class="detail-item"><div class="detail-label">Fecha aplicación</div><div class="detail-value">${r.fechaAplicacion || 'Pendiente'}</div></div>
                <div class="detail-item"><div class="detail-label">Sistema destino</div><div class="detail-value">${r.sistemaDestino}</div></div>
                <div class="detail-item"><div class="detail-label">Método integración</div><div class="detail-value">${r.metodoIntegracion}</div></div>
                <div class="detail-item"><div class="detail-label">Confianza IA</div><div class="detail-value">${(r.confianzaIA * 100).toFixed(0)}%</div></div>
                <div class="detail-item"><div class="detail-label">Resultado</div><div class="detail-value">${r.resultadoValidacion}</div></div>
                ${r.motivoExcepcion ? `<div class="detail-item full-width"><div class="detail-label">Motivo excepción</div><div class="detail-value" style="color:var(--rojo-error)">${r.motivoExcepcion}</div></div>` : ''}
                <div class="detail-item full-width"><div class="detail-label">Historial</div><div class="detail-value">• ${formatearFecha(r.fecha)} - Recibido vía ${r.canal}<br>• ${formatearFecha(r.fecha)} - IA ejecutada (${(r.confianzaIA * 100).toFixed(0)}%)<br>${r.fechaAplicacion ? '• ' + r.fechaAplicacion + ' - Aplicado en ' + r.sistemaDestino : '• Pendiente de aplicación'}</div></div>
            </div>`;
        this.abrirModal('💳 Detalle de Pago', contenido, '<button class="btn btn-secondary" onclick="App.cerrarModal()">Cerrar</button>');
    },

    // ─── MODAL: Ver Comprobante ─────────────────────────────────────
    verComprobante(id) {
        const r = this.pagos.find(p => p.id === id);
        if (!r) return;
        const camposDetectados = ['Banco', 'Monto', 'Fecha', 'Referencia'];
        const camposNoDetectados = r.confianzaIA < 0.8 ? ['Número de cuenta destino'] : [];
        const contenido = `
            <div style="text-align:center; padding:20px; background:var(--fondo-gris); border-radius:8px; margin-bottom:16px;">
                <div style="font-size:48px; margin-bottom:8px;">🖼️</div>
                <p style="font-size:12px; color:var(--gris-texto);">Vista simulada del comprobante de pago</p>
                <p style="font-size:11px; color:var(--azul-medio);">Archivo: comprobante_${r.referencia.toLowerCase()}.jpg</p>
            </div>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Banco</div><div class="detail-value">${r.banco}</div></div>
                <div class="detail-item"><div class="detail-label">Referencia</div><div class="detail-value">${r.referencia}</div></div>
                <div class="detail-item"><div class="detail-label">Monto</div><div class="detail-value">${formatearMonto(r.monto, r.moneda)}</div></div>
                <div class="detail-item"><div class="detail-label">Fecha</div><div class="detail-value">${formatearFecha(r.fecha)}</div></div>
                <div class="detail-item"><div class="detail-label">Cliente</div><div class="detail-value">${r.nombreCliente}</div></div>
                <div class="detail-item"><div class="detail-label">Confianza</div><div class="detail-value" style="color:${r.confianzaIA >= 0.8 ? 'var(--verde-exito)' : 'var(--amarillo-warn)'}">${(r.confianzaIA * 100).toFixed(0)}%</div></div>
                <div class="detail-item full-width"><div class="detail-label">Campos detectados</div><div class="detail-value">${camposDetectados.map(c => `<span class="badge badge-success" style="margin:2px">${c}</span>`).join(' ')}</div></div>
                ${camposNoDetectados.length > 0 ? `<div class="detail-item full-width"><div class="detail-label">No detectados</div><div class="detail-value">${camposNoDetectados.map(c => `<span class="badge badge-danger" style="margin:2px">${c}</span>`).join(' ')}</div></div>` : ''}
            </div>`;
        this.abrirModal('🖼️ Comprobante de Pago', contenido, '<button class="btn btn-secondary" onclick="App.cerrarModal()">Cerrar</button>');
    },

    // ─── MODAL: Ingreso Manual de Pago ──────────────────────────────
    mostrarModalIngresoPago() {
        const opcionesEmpresa = CONFIG.EMPRESAS.map(e => `<option value="${e}">${e}</option>`).join('');
        const opcionesBanco = CONFIG.BANCOS.map(b => `<option value="${b}">${b}</option>`).join('');
        const opcionesMoneda = CONFIG.MONEDAS.map(m => `<option value="${m}">${m}</option>`).join('');

        const contenido = `
            <div class="modal-form-grid">
                <div class="form-group"><label>Empresa *</label><select id="ingreso-empresa">${opcionesEmpresa}</select></div>
                <div class="form-group"><label>Código de cliente *</label><input type="text" id="ingreso-codigo" placeholder="CLI-00000"></div>
                <div class="form-group"><label>Banco *</label><select id="ingreso-banco">${opcionesBanco}</select></div>
                <div class="form-group"><label>Cuenta bancaria (opcional)</label><input type="text" id="ingreso-cuenta" placeholder="bac-1223"></div>
                <div class="form-group"><label>Referencia bancaria (opcional)</label><input type="text" id="ingreso-referencia" placeholder="REF-000000"></div>
                <div class="form-group"><label>Monto (opcional)</label><input type="number" id="ingreso-monto" placeholder="0.00"></div>
                <div class="form-group"><label>Moneda (opcional)</label><select id="ingreso-moneda">${opcionesMoneda}</select></div>
                <div class="form-group full-width"><label>Comprobante (opcional)</label><input type="file" id="ingreso-archivo" accept="image/*,.pdf"></div>
                <div class="form-group full-width"><label>Observación (opcional)</label><textarea id="ingreso-observacion" placeholder="Observaciones adicionales..."></textarea></div>
            </div>`;
        const footer = `<button class="btn btn-secondary" onclick="App.cerrarModal()">Cancelar</button><button class="btn btn-primary" onclick="App.guardarIngresoPago()">💾 Guardar pago</button>`;
        this.abrirModal('➕ Ingreso Manual de Pago', contenido, footer);
    },

    guardarIngresoPago() {
        const empresa = document.getElementById('ingreso-empresa').value;
        const codigo = document.getElementById('ingreso-codigo').value.trim();

        if (!codigo) {
            this.mostrarToast('Error', 'Debe ingresar el código de cliente', 'error');
            return;
        }

        const monto = parseFloat(document.getElementById('ingreso-monto').value) || 0;

        const nuevoPago = {
            id: this.pagos.length + 1,
            fecha: new Date(),
            empresa: empresa,
            canal: 'Carga manual',
            usuario: 'Usuario actual',
            codigoCliente: codigo,
            nombreCliente: '',
            banco: document.getElementById('ingreso-banco').value,
            cuenta: document.getElementById('ingreso-cuenta').value || '',
            referencia: document.getElementById('ingreso-referencia').value || '',
            monto: monto,
            moneda: document.getElementById('ingreso-moneda').value || 'CRC',
            estado: 'En proceso',
            diasPendientes: 0,
            observacion: document.getElementById('ingreso-observacion').value.trim() || '',
            fechaAplicacion: null,
            confianzaIA: '0.00',
            metodoIntegracion: 'Carga manual'
        };

        this.pagos.unshift(nuevoPago);
        this.pagosFiltrados = [...this.pagos];
        this.cerrarModal();
        this.renderKPIPagos();
        this.renderTablaPagos();
        this.mostrarToast('Pago registrado', `Pago de ${codigo} registrado exitosamente.`, 'success');

        setTimeout(() => { this.simularConciliacion(nuevoPago.id); }, 2000);
    },

    // ─── MODAL: Reprocesar Pago (pide confirmación con datos) ──────
    reprocesarPago(id) {
        const r = this.pagos.find(p => p.id === id);
        if (!r) return;

        const opcionesBanco = CONFIG.BANCOS.map(b => `<option value="${b}" ${b === r.banco ? 'selected' : ''}>${b}</option>`).join('');

        const contenido = `
            <div style="margin-bottom:16px; padding:12px; background:var(--azul-claro); border-radius:8px;">
                <p><strong>Pago:</strong> ${r.codigoCliente} - ${formatearFecha(r.fecha)}</p>
                <p><strong>Estado actual:</strong> ${r.estado}</p>
            </div>
            <div class="modal-form-grid">
                <div class="form-group"><label>Código de cliente *</label><input type="text" id="reproceso-codigo" value="${r.codigoCliente}" required></div>
                <div class="form-group"><label>Banco *</label><select id="reproceso-banco">${opcionesBanco}</select></div>
                <div class="form-group"><label>Referencia bancaria</label><input type="text" id="reproceso-referencia" value="${r.referencia || ''}"></div>
                <div class="form-group"><label>Monto</label><input type="number" id="reproceso-monto" value="${r.monto}"></div>
                <div class="form-group full-width"><label>Observación *</label><textarea id="reproceso-observacion" placeholder="Motivo del reproceso..." required></textarea></div>
            </div>
        `;
        const footer = `<button class="btn btn-secondary" onclick="App.cerrarModal()">Cancelar</button><button class="btn btn-primary" onclick="App.confirmarReproceso(${id})">🔁 Confirmar reproceso</button>`;
        this.abrirModal('🔁 Reprocesar Pago', contenido, footer);
    },

    confirmarReproceso(id) {
        const codigo = document.getElementById('reproceso-codigo').value.trim();
        const observacion = document.getElementById('reproceso-observacion').value.trim();

        if (!codigo) {
            this.mostrarToast('Error', 'Debe ingresar el código de cliente', 'error');
            return;
        }
        if (!observacion) {
            this.mostrarToast('Error', 'Debe ingresar una observación', 'error');
            return;
        }

        this.cerrarModal();
        this.mostrarToast('Procesando', 'Ejecutando reproceso vía API...', 'warning');

        setTimeout(() => {
            const r = this.pagos.find(p => p.id === id);
            if (r) {
                r.estado = 'Aplicado';
                r.fechaAplicacion = formatearFecha(new Date());
                r.diasPendientes = 0;
                r.observacion = observacion;
                r.codigoCliente = codigo;
                r.banco = document.getElementById('reproceso-banco')?.value || r.banco;
                this.pagosFiltrados = [...this.pagos];
                this.renderKPIPagos();
                this.renderTablaPagos();
                this.mostrarToast('Reproceso exitoso', `Pago ${r.referencia || r.codigoCliente} reprocesado y aplicado.`, 'success');
            }
        }, 1500);
    },

    // ─── MODAL: Cargar Extracto Manual (sin Davivienda, sin cuenta/moneda/observaciones) ──
    mostrarModalCargaExtracto() {
        const opcionesEmpresa = CONFIG.EMPRESAS.map(e => `<option value="${e}">${e}</option>`).join('');
        const opcionesBanco = CONFIG.BANCOS_CARGA_MANUAL.map(b => `<option value="${b}">${b}</option>`).join('');

        const contenido = `
            <div class="info-banner" style="margin-bottom:16px; border-radius:6px;">
                ⚠️ La carga manual es únicamente una contingencia operativa. Los extractos se obtienen normalmente vía API bancaria.
            </div>
            <div class="modal-form-grid">
                <div class="form-group"><label>Empresa</label><select id="carga-empresa">${opcionesEmpresa}</select></div>
                <div class="form-group"><label>Banco</label><select id="carga-banco">${opcionesBanco}</select></div>
                <div class="form-group full-width"><label>Archivo de extracto (.csv, .xlsx)</label><input type="file" id="carga-archivo" accept=".csv,.xlsx,.xls"></div>
            </div>`;
        const footer = `<button class="btn btn-secondary" onclick="App.cerrarModal()">Cancelar</button><button class="btn btn-primary" onclick="App.procesarCargaExtracto()">📤 Cargar extracto</button>`;
        this.abrirModal('📤 Cargar Extracto Manual', contenido, footer);
    },

    procesarCargaExtracto() {
        const banco = document.getElementById('carga-banco').value;
        this.cerrarModal();
        this.mostrarToast('Procesando', 'Cargando extracto bancario...', 'warning');
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                this.extractos.unshift({
                    id: this.extractos.length + i + 1,
                    fecha: fechaAleatoria(5),
                    empresa: document.getElementById('carga-empresa')?.value || 'Nuevos',
                    banco: banco,
                    cuenta: generarCuentaBancaria(banco),
                    moneda: 'CRC',
                    referencia: generarReferencia(),
                    descripcion: 'Movimiento cargado manualmente',
                    tipo: Math.random() > 0.5 ? 'Crédito' : 'Débito',
                    categoria: aleatorio(CONFIG.CATEGORIAS.slice(0, 4)),
                    monto: Math.floor(100000 + Math.random() * 3000000),
                    estado: 'Pendiente',
                    metodo: 'Carga desde archivo',
                    fechaCarga: new Date(),
                    archivoOrigen: 'extracto_manual_cargado.csv',
                    seleccionado: false
                });
            }
            this.extractosFiltrados = [...this.extractos];
            this.renderKPIExtractos();
            this.renderTablaExtractos();
            this.mostrarToast('Carga exitosa', '5 movimientos cargados desde archivo.', 'success');
        }, 1500);
    },

    // ─── APLICAR PAGO VÍA API ───────────────────────────────────────
    aplicarPagoAPI(id) {
        const r = this.pagos.find(p => p.id === id);
        if (!r) return;
        if (r.estado === 'Aplicado') {
            this.mostrarToast('Info', 'Este pago ya fue aplicado.', 'warning');
            return;
        }
        this.mostrarToast('Procesando', `Aplicando pago ${r.codigoCliente} vía ${r.metodoIntegracion}...`, 'warning');
        setTimeout(() => {
            const coincidencia = this.extractos.find(e =>
                e.banco === r.banco && Math.abs(e.monto - r.monto) < 100 && e.estado !== 'Aplicado'
            );
            if (coincidencia) {
                r.estado = 'Aplicado';
                r.fechaAplicacion = formatearFecha(new Date());
                r.diasPendientes = 0;
                r.observacion = 'Aplicación automática vía API';
                coincidencia.estado = 'Aplicado';
                coincidencia.observacion = 'Aplicación automática vía API';
                this.mostrarToast('Pago aplicado', `Pago ${r.codigoCliente} aplicado vía ${r.metodoIntegracion}.`, 'success');
            } else {
                r.estado = 'En proceso';
                this.mostrarToast('Sin coincidencia', `No se encontró movimiento bancario. Se actualiza extracto vía API.`, 'warning');
                setTimeout(() => this.simularActualizacionAPI(), 1500);
            }
            this.pagosFiltrados = [...this.pagos];
            this.extractosFiltrados = [...this.extractos];
            this.renderKPIPagos();
            this.renderTablaPagos();
        }, 1500);
    },

    // ─── SIMULACIONES ───────────────────────────────────────────────
    simularActualizacionAPI() {
        this.mostrarToast('API Bancaria', 'Consultando extractos vía API...', 'warning');
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                const banco = aleatorio(CONFIG.BANCOS);
                this.extractos.unshift({
                    id: this.extractos.length + i + 100,
                    fecha: new Date(),
                    empresa: aleatorio(CONFIG.EMPRESAS),
                    banco: banco,
                    cuenta: generarCuentaBancaria(banco),
                    moneda: 'CRC',
                    referencia: generarReferencia(),
                    descripcion: 'Actualización API bancaria',
                    tipo: 'Crédito',
                    categoria: 'Pago de cliente',
                    monto: Math.floor(200000 + Math.random() * 5000000),
                    estado: 'Pendiente',
                    metodo: 'API bancaria',
                    fechaCarga: new Date(),
                    archivoOrigen: 'api_sync_' + formatearFecha(new Date()) + '.json',
                    seleccionado: false
                });
            }
            this.extractosFiltrados = [...this.extractos];
            this.renderKPIExtractos();
            this.renderTablaExtractos();
            this.mostrarToast('Actualización completa', '3 nuevos movimientos obtenidos vía API bancaria.', 'success');
        }, 2000);
    },

    simularConciliacion(pagoId) {
        const pago = this.pagos.find(p => p.id === pagoId);
        if (!pago) return;
        const coincidencia = this.extractos.find(e =>
            e.banco === pago.banco && e.estado === 'Pendiente' && e.tipo === 'Crédito'
        );
        if (coincidencia && Math.random() > 0.4) {
            pago.estado = 'Aplicado';
            pago.observacion = 'Aplicación automática vía API';
            pago.fechaAplicacion = formatearFecha(new Date());
            pago.diasPendientes = 0;
            coincidencia.estado = 'Aplicado';
            coincidencia.observacion = 'Aplicación automática vía API';
            this.mostrarToast('Aplicado', `Pago ${pago.codigoCliente} aplicado automáticamente.`, 'success');
        } else {
            pago.estado = 'En proceso';
            this.mostrarToast('En proceso', `Pago ${pago.codigoCliente} en proceso de conciliación.`, 'warning');
        }
        this.pagosFiltrados = [...this.pagos];
        this.renderKPIPagos();
        this.renderTablaPagos();
    },

    // ═══════════════════════════════════════════════════════════════════
    // EXPORTACIÓN A EXCEL (CSV)
    // ═══════════════════════════════════════════════════════════════════

    exportarExtractos() {
        const datos = this.extractosFiltrados;
        const headers = ['Fecha', 'Empresa', 'Banco', 'Cuenta', 'Moneda', 'Referencia', 'Descripción', 'Tipo', 'Monto', 'Estado', 'Observación', 'Método'];
        const filas = datos.map(r => [
            formatearFecha(r.fecha), r.empresa, r.banco, r.cuenta, r.moneda,
            r.referencia, r.descripcion, r.tipo, r.monto, r.estado, r.observacion || '', r.metodo
        ]);
        this.descargarCSV(headers, filas, 'extractos_bancarios');
    },

    exportarPagos() {
        const datos = this.pagosFiltrados;
        const headers = ['Fecha', 'Empresa', 'Canal', 'Cliente', 'Código', 'Banco', 'Referencia', 'Monto', 'Moneda', 'Estado', 'Sistema', 'Días Pend.', 'F. Aplicación'];
        const filas = datos.map(r => [
            formatearFecha(r.fecha), r.empresa, r.canal, r.nombreCliente, r.codigoCliente,
            r.banco, r.referencia, r.monto, r.moneda, r.estado, r.sistemaDestino,
            r.diasPendientes, r.fechaAplicacion || ''
        ]);
        this.descargarCSV(headers, filas, 'seguimiento_pagos');
    },

    exportarReporteExcel() {
        const datos = this.reportesFiltrados;
        const headers = ['Fecha', 'Empresa', 'Cliente', 'Código', 'Banco', 'Referencia', 'Monto', 'Moneda', 'Estado', 'Canal', 'Sistema', 'F. Aplicación', 'Resultado'];
        const filas = datos.map(r => [
            formatearFecha(r.fecha), r.empresa, r.nombreCliente, r.codigoCliente,
            r.banco, r.referencia, r.monto, r.moneda, r.estado, r.canal,
            r.sistemaDestino, r.fechaAplicacion || '', r.resultadoValidacion
        ]);
        this.descargarCSV(headers, filas, 'reporte_pagos');
    },

    exportarReporteCSV() { this.exportarReporteExcel(); },

    descargarCSV(headers, filas, nombre) {
        const BOM = '\uFEFF';
        let csv = BOM + headers.join(',') + '\n';
        filas.forEach(fila => {
            csv += fila.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${nombre}_${formatearFecha(new Date())}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.mostrarToast('Exportación', `Archivo ${nombre}.csv descargado.`, 'success');
    },

    // ═══════════════════════════════════════════════════════════════════
    // TOAST NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════════

    mostrarToast(titulo, mensaje, tipo) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        const iconos = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        toast.innerHTML = `<span>${iconos[tipo] || 'ℹ️'}</span><div><strong>${titulo}</strong><br><small>${mensaje}</small></div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// ─── INICIALIZAR APLICACIÓN ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') App.cerrarModal(); });
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') App.cerrarModal();
});
