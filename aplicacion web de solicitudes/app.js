// ===== LA GUACA - APP.JS =====
// Estado global de la aplicación
let currentUser = null;
let currentRole = null;
let currentView = 'dashboard';

// Catálogo de gastos y cuentas contables
const categoriasGasto = [
    { id: 1, nombre: 'Alimentación', cuenta: '6101-001', activo: true },
    { id: 14, nombre: 'Hospedaje', cuenta: '6101-005', activo: true },
    { id: 2, nombre: 'Combustibles y lubricantes', cuenta: '6101-002', activo: true },
    { id: 3, nombre: 'Parqueo y peajes', cuenta: '6101-003', activo: true },
    { id: 4, nombre: 'Fletes y encomiendas', cuenta: '6101-004', activo: true },
    { id: 5, nombre: 'Papelería y útiles de oficina', cuenta: '6102-001', activo: true },
    { id: 6, nombre: 'Limpieza e higiene', cuenta: '6102-002', activo: true },
    { id: 7, nombre: 'Accesorios y equipo menor', cuenta: '6103-001', activo: true },
    { id: 8, nombre: 'Legales y timbres', cuenta: '6104-001', activo: true },
    { id: 9, nombre: 'Licencias y software', cuenta: '6105-001', activo: true },
    { id: 10, nombre: 'Materiales de limpieza y aseo', cuenta: '6102-003', activo: true },
    { id: 11, nombre: 'Reparación y mantenimiento', cuenta: '6106-001', activo: true },
    { id: 12, nombre: 'Gastos no deducibles tarjeta', cuenta: '6199-001', activo: true },
    { id: 13, nombre: 'Otros', cuenta: '6199-099', activo: true }
];

const centrosCosto = [
    { id: 'CC-100', nombre: 'Administración' },
    { id: 'CC-200', nombre: 'Ventas' },
    { id: 'CC-300', nombre: 'Operaciones' },
    { id: 'CC-400', nombre: 'Tecnología' },
    { id: 'CC-500', nombre: 'Finanzas' },
    { id: 'CC-600', nombre: 'Recursos Humanos' }
];

const sucursales = [
    { id: 1, nombre: 'San José Central' },
    { id: 2, nombre: 'Heredia' },
    { id: 3, nombre: 'Cartago' },
    { id: 4, nombre: 'Alajuela' }
];

const departamentos = [
    'Administración', 'Ventas', 'Operaciones', 'Tecnología', 'Finanzas', 'Recursos Humanos', 'Compras', 'Logística'
];

// Catálogo de empleados (vincula usuario con su departamento, centro de costo y supervisor)
const empleados = [
    { id: 1, nombre: 'Juan Rodríguez', email: 'jrodriguez@laguaca.com', departamento: 'Ventas', centroCosto: 'CC-200', supervisor: 'María López', activo: true },
    { id: 2, nombre: 'María López', email: 'mlopez@laguaca.com', departamento: 'Administración', centroCosto: 'CC-100', supervisor: 'Director General', activo: true },
    { id: 3, nombre: 'Patricia Vargas', email: 'pvargas@laguaca.com', departamento: 'Finanzas', centroCosto: 'CC-500', supervisor: 'María López', activo: true },
    { id: 4, nombre: 'Erika Mora', email: 'emora@laguaca.com', departamento: 'Compras', centroCosto: 'CC-100', supervisor: 'María López', activo: true },
    { id: 5, nombre: 'Carlos Méndez', email: 'cmendez@laguaca.com', departamento: 'Operaciones', centroCosto: 'CC-300', supervisor: 'Ana Jiménez', activo: true },
    { id: 6, nombre: 'Roberto Chen', email: 'rchen@laguaca.com', departamento: 'Tecnología', centroCosto: 'CC-400', supervisor: 'María López', activo: true },
    { id: 7, nombre: 'Andrea Solano', email: 'asolano@laguaca.com', departamento: 'Administración', centroCosto: 'CC-100', supervisor: 'María López', activo: true },
    { id: 8, nombre: 'Fernando Araya', email: 'faraya@laguaca.com', departamento: 'Operaciones', centroCosto: 'CC-300', supervisor: 'Ana Jiménez', activo: false },
    { id: 9, nombre: 'Laura Mora', email: 'lmora@laguaca.com', departamento: 'Tecnología', centroCosto: 'CC-400', supervisor: 'Roberto Chen', activo: true },
    { id: 10, nombre: 'Ana Jiménez', email: 'ajimenez@laguaca.com', departamento: 'Operaciones', centroCosto: 'CC-300', supervisor: 'Director General', activo: true },
    { id: 11, nombre: 'Admin Sistema', email: 'admin@laguaca.com', departamento: 'Tecnología', centroCosto: 'CC-400', supervisor: 'Director General', activo: true }
];

function getEmpleadoActual() {
    if (!currentUser) return null;
    return empleados.find(e => e.nombre === currentUser.nombre) || { nombre: currentUser.nombre, departamento: 'Sin asignar', centroCosto: 'CC-100', supervisor: 'Sin asignar' };
}

const porcentajesIVA = [
    { valor: 0, texto: '0%' },
    { valor: 1, texto: '1%' },
    { valor: 2, texto: '2%' },
    { valor: 4, texto: '4%' },
    { valor: 13, texto: '13%' }
];

const estados = {
    borrador: { label: 'Borrador', clase: 'badge-borrador' },
    pendiente: { label: 'Pendiente aprobación', clase: 'badge-pendiente' },
    aprobada: { label: 'Aprobada', clase: 'badge-aprobada' },
    rechazada: { label: 'Rechazada', clase: 'badge-rechazada' },
    revision_contabilidad: { label: 'En revisión contabilidad', clase: 'badge-revision' },
    aprobada_contabilidad: { label: 'Aprobada contabilidad', clase: 'badge-aprobada' },
    rechazada_contabilidad: { label: 'Rechazada contabilidad', clase: 'badge-rechazada' },
    aceptacion_parcial: { label: 'Aceptación parcial', clase: 'badge-parcial' },
    aplicada_sap: { label: 'Aplicada en SAP (Total)', clase: 'badge-sap' },
    aplicada_sap_parcial: { label: 'Aplicada en SAP (Parcial)', clase: 'badge-parcial' },
    error_sap: { label: 'Error SAP', clase: 'badge-error' },
    cerrada: { label: 'Cerrada', clase: 'badge-cerrada' }
};

// Datos de ejemplo
const solicitudes = [
    {
        id: 'VIA-2026-001', tipo: 'viaticos', tipoLabel: 'Solicitud de Viáticos',
        solicitante: 'Juan Rodríguez', departamento: 'Ventas', centroCosto: 'CC-200',
        supervisor: 'María López', fechaSolicitud: '2026-06-10', fechaInicio: '2026-06-20',
        fechaFin: '2026-06-22', dias: 3, destino: 'Limón', motivo: 'Visita a cliente Corporación del Caribe',
        tipoGira: 'Nacional', transporte: 'Vehículo empresa',
        montoSolicitado: 285000, montoAprobado: 285000, estado: 'aprobada',
        gastos: [
            { categoria: 14, monto: 120000, observacion: 'Hotel 2 noches' },
            { categoria: 2, monto: 45000, observacion: 'Combustible ida y vuelta' },
            { categoria: 3, monto: 20000, observacion: 'Peajes ruta 32' },
            { categoria: 1, monto: 100000, observacion: 'Alimentación 3 días' }
        ],
        historial: [
            { fecha: '2026-06-10 08:30', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Solicitud creada', comentario: '' },
            { fecha: '2026-06-10 08:45', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' },
            { fecha: '2026-06-11 10:15', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada', comentario: 'Autorizado según presupuesto trimestral' }
        ]
    },
    {
        id: 'VIA-2026-002', tipo: 'viaticos', tipoLabel: 'Solicitud de Viáticos',
        solicitante: 'Carlos Méndez', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Ana Jiménez', fechaSolicitud: '2026-06-15', fechaInicio: '2026-06-25',
        fechaFin: '2026-06-26', dias: 2, destino: 'Guanacaste', motivo: 'Supervisión de obra en planta Liberia',
        tipoGira: 'Nacional', transporte: 'Vehículo propio',
        montoSolicitado: 195000, montoAprobado: 0, estado: 'pendiente',
        gastos: [
            { categoria: 14, monto: 80000, observacion: 'Hotel 1 noche' },
            { categoria: 2, monto: 60000, observacion: 'Combustible' },
            { categoria: 1, monto: 55000, observacion: 'Alimentación 2 días' }
        ],
        historial: [
            { fecha: '2026-06-15 14:20', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Solicitud creada', comentario: '' },
            { fecha: '2026-06-15 14:22', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' }
        ]
    },

    {
        id: 'REI-2026-001', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Juan Rodríguez', departamento: 'Ventas', centroCosto: 'CC-200',
        supervisor: 'María López', fechaSolicitud: '2026-06-23', fechaInicio: '2026-06-20',
        fechaFin: '2026-06-22', dias: 3, solicitudRelacionada: 'VIA-2026-001',
        montoAprobadoOriginal: 285000, montoConfirmado: 312500, diferencia: 27500,
        montoSolicitado: 312500, montoAprobado: 285000, estado: 'revision_contabilidad',
        comprobantes: [
            { fecha: '2026-06-20', numFactura: 'FE-001-456', proveedor: 'Hotel Caribe', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 53097, iva: 6903, servicio: 5310, total: 65310, estado: 'pendiente', adjunto: 'factura_hotel.pdf' },
            { fecha: '2026-06-20', numFactura: 'FE-002-789', proveedor: 'Rest. Mariscos del Puerto', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 22124, iva: 2876, servicio: 2212, total: 27212, estado: 'pendiente', adjunto: 'factura_rest1.pdf' },
            { fecha: '2026-06-21', numFactura: 'FE-003-012', proveedor: 'Gasolinera Shell Siquirres', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 39823, iva: 5177, servicio: 0, total: 45000, estado: 'pendiente', adjunto: 'factura_gas.pdf' },
            { fecha: '2026-06-21', numFactura: 'FE-004-345', proveedor: 'Hotel Caribe', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 53097, iva: 6903, servicio: 5310, total: 65310, estado: 'pendiente', adjunto: 'factura_hotel2.pdf' },
            { fecha: '2026-06-22', numFactura: 'FE-005-678', proveedor: 'Rest. El Limón Criollo', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 17699, iva: 2301, servicio: 1770, total: 21770, estado: 'pendiente', adjunto: 'factura_rest2.pdf' },
            { fecha: '2026-06-20', numFactura: 'REC-0012', proveedor: 'Peajes ruta 32', tipoGasto: 3, tieneIVA: false, pctIVA: 0, montoSinIVA: 19600, iva: 0, servicio: 0, total: 19600, estado: 'pendiente', adjunto: 'recibo_peaje.jpg' }
        ],
        historial: [
            { fecha: '2026-06-23 09:00', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-23 09:10', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-23 14:30', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada por supervisor', comentario: 'Facturas en orden' },
            { fecha: '2026-06-24 08:00', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'REI-2026-002', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Laura Mora', departamento: 'Tecnología', centroCosto: 'CC-400',
        supervisor: 'Roberto Chen', fechaSolicitud: '2026-06-01', fechaInicio: '2026-05-28',
        fechaFin: '2026-05-29', dias: 2, solicitudRelacionada: 'VIA-2026-003',
        montoAprobadoOriginal: 150000, montoConfirmado: 142000, diferencia: -8000,
        montoSolicitado: 142000, montoAprobado: 142000, estado: 'aplicada_sap',
        refSAP: 'SAP-DOC-2026-0045',
        comprobantes: [
            { fecha: '2026-05-28', numFactura: 'FE-100-001', proveedor: 'Hotel San José Inn', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 44248, iva: 5752, servicio: 4425, total: 54425, estado: 'aceptada', adjunto: 'hotel_sj.pdf' },
            { fecha: '2026-05-28', numFactura: 'FE-100-002', proveedor: 'Rest. La Casona', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 15929, iva: 2071, servicio: 1593, total: 19593, estado: 'aceptada', adjunto: 'rest_casona.pdf' },
            { fecha: '2026-05-29', numFactura: 'FE-100-003', proveedor: 'Uber CRC', tipoGasto: 3, tieneIVA: true, pctIVA: 13, montoSinIVA: 12389, iva: 1611, servicio: 0, total: 14000, estado: 'aceptada', adjunto: 'uber_recibo.pdf' },
            { fecha: '2026-05-29', numFactura: 'FE-100-004', proveedor: 'Soda El Buen Sabor', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 9735, iva: 1265, servicio: 0, total: 11000, estado: 'aceptada', adjunto: 'soda_recibo.pdf' }
        ],
        historial: [
            { fecha: '2026-06-01 10:00', usuario: 'Laura Mora', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-01 10:05', usuario: 'Laura Mora', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-02 09:00', usuario: 'Roberto Chen', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-03 08:30', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aceptación total', comentario: 'Todo correcto' },
            { fecha: '2026-06-03 09:00', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aplicada en SAP', comentario: 'Doc SAP-DOC-2026-0045' }
        ]
    },

    {
        id: 'CCH-2026-002', tipo: 'caja_chica', tipoLabel: 'Liquidación Caja Chica',
        solicitante: 'Fernando Araya', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Ana Jiménez', sucursal: 'Heredia',
        fechaSolicitud: '2026-06-20', fechaInicio: '2026-06-01', fechaFin: '2026-06-18', dias: 18,
        fondoAsignado: 300000, montoLiquidado: 215000, saldoRestante: 85000,
        montoSolicitado: 215000, montoAprobado: 0, estado: 'borrador',
        gastos: [
            { fecha: '2026-06-03', numFactura: 'FE-HE-001', proveedor: 'Ferretería El Maestro', tipoGasto: 11, tieneIVA: true, pctIVA: 13, montoSinIVA: 88496, iva: 11504, servicio: 0, total: 100000, estado: 'pendiente', adjunto: 'ferreteria.pdf' },
            { fecha: '2026-06-10', numFactura: 'FE-HE-002', proveedor: 'Gasolinera Total', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 57522, iva: 7478, servicio: 0, total: 65000, estado: 'pendiente', adjunto: 'gasolina.pdf' },
            { fecha: '2026-06-15', numFactura: 'FE-HE-003', proveedor: 'Walmart', tipoGasto: 6, tieneIVA: true, pctIVA: 13, montoSinIVA: 44248, iva: 5752, servicio: 0, total: 50000, estado: 'pendiente', adjunto: 'limpieza_h.pdf' }
        ],
        historial: [
            { fecha: '2026-06-20 16:00', usuario: 'Fernando Araya', rol: 'Solicitante', accion: 'Liquidación creada', comentario: 'Pendiente de completar' }
        ]
    },

    {
        id: 'TCR-2026-001', tipo: 'tarjeta_corporativa', tipoLabel: 'Reintegro Tarjeta Corporativa',
        solicitante: 'Roberto Chen', departamento: 'Tecnología', centroCosto: 'CC-400',
        supervisor: 'Erika Mora', tarjetahabiente: 'Roberto Chen',
        numTarjeta: '**** **** **** 4521', grupoCorte: 'Grupo A', mesCorte: 'Mayo 2026',
        fechaEstadoCuenta: '2026-06-06',
        responsableRevision: 'Erika Mora',
        fechaSolicitud: '2026-06-08', fechaInicio: '2026-05-01', fechaFin: '2026-05-31', dias: 31,
        montoEstadoCuenta: 1250000, montoTotalFacturas: 1195000, diferencia: 55000,
        montoSolicitado: 1250000, montoAprobado: 0, estado: 'pendiente',
        transacciones: [
            { fechaTrans: '2026-05-03', fechaFactura: '2026-05-03', numFactura: 'FE-T-001', comercio: 'Amazon Web Services', tipoGasto: 9, montoColones: 350000, montoDolares: 650, tipoCambio: 538.46, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 309735, montoExento: 0, iva: 40265, servicio: 0, total: 350000, indicadorImpuesto: 'IV', estado: 'Pendiente', adjunto: 'aws_mayo.pdf' },
            { fechaTrans: '2026-05-10', fechaFactura: '2026-05-10', numFactura: 'FE-T-002', comercio: 'Microsoft 365', tipoGasto: 9, montoColones: 280000, montoDolares: 520, tipoCambio: 538.46, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 247788, montoExento: 0, iva: 32212, servicio: 0, total: 280000, indicadorImpuesto: 'IV', estado: 'Pendiente', adjunto: 'ms365_mayo.pdf' },
            { fechaTrans: '2026-05-15', fechaFactura: '2026-05-15', numFactura: 'FE-T-003', comercio: 'Rest. Ejecutivo Downtown', tipoGasto: 1, montoColones: 95000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 73009, montoExento: 0, iva: 9491, servicio: 7301, total: 89801, indicadorImpuesto: 'IV', estado: 'Pendiente', adjunto: 'rest_downtown.pdf', observacion: 'Almuerzo con equipo de desarrollo' },
            { fechaTrans: '2026-05-18', fechaFactura: '', numFactura: '', comercio: 'Tienda Electrónica XYZ', tipoGasto: 7, montoColones: 185000, montoDolares: 0, tipoCambio: 0, facturaElectronica: false, tieneIVA: false, pctIVA: 0, montoGravado: 0, montoExento: 185000, iva: 0, servicio: 0, total: 185000, indicadorImpuesto: '', estado: 'Falta factura', adjunto: '', observacion: 'Pendiente factura electrónica' },
            { fechaTrans: '2026-05-22', fechaFactura: '2026-05-22', numFactura: 'FE-T-005', comercio: 'Zoom Video Communications', tipoGasto: 9, montoColones: 145000, montoDolares: 269, tipoCambio: 538.66, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 128319, montoExento: 0, iva: 16681, servicio: 0, total: 145000, indicadorImpuesto: 'IV', estado: 'Pendiente', adjunto: 'zoom_mayo.pdf' },
            { fechaTrans: '2026-05-28', fechaFactura: '2026-05-28', numFactura: 'FE-T-006', comercio: 'Slack Technologies', tipoGasto: 9, montoColones: 140000, montoDolares: 260, tipoCambio: 538.46, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 123894, montoExento: 0, iva: 16106, servicio: 0, total: 140000, indicadorImpuesto: 'IV', estado: 'Pendiente', adjunto: 'slack_mayo.pdf' }
        ],
        historial: [
            { fecha: '2026-06-08 09:00', usuario: 'Roberto Chen', rol: 'Solicitante', accion: 'Solicitud creada', comentario: '' },
            { fecha: '2026-06-08 09:15', usuario: 'Roberto Chen', rol: 'Solicitante', accion: 'Enviada a responsable de tarjetas', comentario: '' }
        ]
    },

    {
        id: 'TCR-2026-002', tipo: 'tarjeta_corporativa', tipoLabel: 'Reintegro Tarjeta Corporativa',
        solicitante: 'María López', departamento: 'Administración', centroCosto: 'CC-100',
        supervisor: 'Erika Mora', tarjetahabiente: 'María López',
        numTarjeta: '**** **** **** 8832', grupoCorte: 'Grupo B', mesCorte: 'Mayo 2026',
        fechaEstadoCuenta: '2026-06-06',
        responsableRevision: 'Erika Mora',
        fechaSolicitud: '2026-06-05', fechaInicio: '2026-05-01', fechaFin: '2026-05-31', dias: 31,
        montoEstadoCuenta: 520000, montoTotalFacturas: 520000, diferencia: 0,
        montoSolicitado: 520000, montoAprobado: 520000, estado: 'revision_contabilidad',
        transacciones: [
            { fechaTrans: '2026-05-05', fechaFactura: '2026-05-05', numFactura: 'FE-ML-001', comercio: 'Office Depot', tipoGasto: 5, montoColones: 180000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 159292, montoExento: 0, iva: 20708, servicio: 0, total: 180000, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'office_depot.pdf' },
            { fechaTrans: '2026-05-12', fechaFactura: '2026-05-12', numFactura: 'FE-ML-002', comercio: 'Hotel Marriott', tipoGasto: 14, montoColones: 220000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 168142, montoExento: 0, iva: 21858, servicio: 16814, total: 206814, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'marriott.pdf', observacion: 'Evento corporativo' },
            { fechaTrans: '2026-05-20', fechaFactura: '2026-05-20', numFactura: 'FE-ML-003', comercio: 'Taxi Aeropuerto', tipoGasto: 3, montoColones: 45000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 39823, montoExento: 0, iva: 5177, servicio: 0, total: 45000, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'taxi.pdf' },
            { fechaTrans: '2026-05-25', fechaFactura: '2026-05-25', numFactura: 'FE-ML-004', comercio: 'Imprenta Gráfica', tipoGasto: 5, montoColones: 75000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 66372, montoExento: 0, iva: 8628, servicio: 0, total: 75000, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'imprenta.pdf' }
        ],
        historial: [
            { fecha: '2026-06-05 08:00', usuario: 'María López', rol: 'Solicitante', accion: 'Solicitud creada', comentario: '' },
            { fecha: '2026-06-05 08:30', usuario: 'María López', rol: 'Solicitante', accion: 'Enviada a responsable de tarjetas', comentario: '' },
            { fecha: '2026-06-07 10:00', usuario: 'Erika Mora', rol: 'Resp. Tarjetas', accion: 'Aprobada por responsable de tarjetas', comentario: 'Documentación completa, facturas cuadran con estado de cuenta' },
            { fecha: '2026-06-07 10:01', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },

    // Solicitudes adicionales para revisión contabilidad
    {
        id: 'REI-2026-003', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Carlos Méndez', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Ana Jiménez', fechaSolicitud: '2026-06-12', fechaInicio: '2026-06-05', fechaFin: '2026-06-06', dias: 2,
        solicitudRelacionada: 'VIA-2026-004', montoAprobadoOriginal: 180000, montoConfirmado: 175000, diferencia: -5000,
        montoSolicitado: 175000, montoAprobado: 175000, estado: 'revision_contabilidad',
        comprobantes: [
            { fecha: '2026-06-05', numFactura: 'FE-200-001', proveedor: 'Hotel Villa Real', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 70796, iva: 9204, servicio: 7080, total: 87080, estado: 'pendiente', adjunto: 'hotel_villa.pdf' },
            { fecha: '2026-06-05', numFactura: 'FE-200-002', proveedor: 'Soda La Esquina', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 15929, iva: 2071, servicio: 0, total: 18000, estado: 'pendiente', adjunto: 'soda_esquina.pdf' },
            { fecha: '2026-06-06', numFactura: 'FE-200-003', proveedor: 'Gasolinera Delta', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 44248, iva: 5752, servicio: 0, total: 50000, estado: 'pendiente', adjunto: 'gasolina_delta.pdf' },
            { fecha: '2026-06-06', numFactura: 'REC-200-004', proveedor: 'Peajes Autopista', tipoGasto: 3, tieneIVA: false, pctIVA: 0, montoSinIVA: 19920, iva: 0, servicio: 0, total: 19920, estado: 'pendiente', adjunto: 'peajes.jpg' }
        ],
        historial: [
            { fecha: '2026-06-12 10:00', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-12 10:05', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-13 09:00', usuario: 'Ana Jiménez', rol: 'Supervisor', accion: 'Aprobada', comentario: 'OK' },
            { fecha: '2026-06-13 09:01', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'CCH-2026-003', tipo: 'caja_chica', tipoLabel: 'Liquidación Caja Chica',
        solicitante: 'Laura Mora', departamento: 'Tecnología', centroCosto: 'CC-400',
        supervisor: 'Roberto Chen', sucursal: 'Heredia',
        fechaSolicitud: '2026-06-14', fechaInicio: '2026-06-01', fechaFin: '2026-06-13', dias: 13,
        fondoAsignado: 400000, montoLiquidado: 285000, saldoRestante: 115000,
        montoSolicitado: 285000, montoAprobado: 285000, estado: 'revision_contabilidad',
        gastos: [
            { fecha: '2026-06-03', numFactura: 'FE-LM-001', proveedor: 'Librería Universal', tipoGasto: 5, tieneIVA: true, pctIVA: 13, montoSinIVA: 44248, iva: 5752, servicio: 0, total: 50000, estado: 'pendiente', adjunto: 'libreria.pdf' },
            { fecha: '2026-06-07', numFactura: 'FE-LM-002', proveedor: 'Uber Technologies', tipoGasto: 3, tieneIVA: true, pctIVA: 13, montoSinIVA: 22124, iva: 2876, servicio: 0, total: 25000, estado: 'pendiente', adjunto: 'uber.pdf' },
            { fecha: '2026-06-10', numFactura: 'FE-LM-003', proveedor: 'EPA Heredia', tipoGasto: 7, tieneIVA: true, pctIVA: 13, montoSinIVA: 132743, iva: 17257, servicio: 0, total: 150000, estado: 'pendiente', adjunto: 'epa.pdf' },
            { fecha: '2026-06-12', numFactura: 'FE-LM-004', proveedor: 'Café Britt', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 53097, iva: 6903, servicio: 0, total: 60000, estado: 'pendiente', adjunto: 'cafe_britt.pdf' }
        ],
        historial: [
            { fecha: '2026-06-14 11:00', usuario: 'Laura Mora', rol: 'Solicitante', accion: 'Liquidación creada', comentario: '' },
            { fecha: '2026-06-14 11:05', usuario: 'Laura Mora', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' },
            { fecha: '2026-06-15 09:00', usuario: 'Roberto Chen', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-15 09:01', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'TCR-2026-003', tipo: 'tarjeta_corporativa', tipoLabel: 'Reintegro Tarjeta Corporativa',
        solicitante: 'Ana Jiménez', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Erika Mora', tarjetahabiente: 'Ana Jiménez',
        numTarjeta: '**** **** **** 3310', grupoCorte: 'Grupo A', mesCorte: 'Mayo 2026',
        fechaEstadoCuenta: '2026-06-06', responsableRevision: 'Erika Mora',
        fechaSolicitud: '2026-06-09', fechaInicio: '2026-05-01', fechaFin: '2026-05-31', dias: 31,
        montoEstadoCuenta: 380000, montoTotalFacturas: 380000, diferencia: 0,
        montoSolicitado: 380000, montoAprobado: 380000, estado: 'revision_contabilidad',
        transacciones: [
            { fechaTrans: '2026-05-08', fechaFactura: '2026-05-08', numFactura: 'FE-AJ-001', comercio: 'Hotel Presidente', tipoGasto: 14, montoColones: 180000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 159292, montoExento: 0, iva: 20708, servicio: 0, total: 180000, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'hotel_pres.pdf' },
            { fechaTrans: '2026-05-15', fechaFactura: '2026-05-15', numFactura: 'FE-AJ-002', comercio: 'Rest. El Fogón', tipoGasto: 1, montoColones: 85000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 75221, montoExento: 0, iva: 9779, servicio: 7522, total: 92522, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'fogon.pdf' },
            { fechaTrans: '2026-05-22', fechaFactura: '2026-05-22', numFactura: 'FE-AJ-003', comercio: 'Gasolinera Total', tipoGasto: 2, montoColones: 115000, montoDolares: 0, tipoCambio: 0, facturaElectronica: true, tieneIVA: true, pctIVA: 13, montoGravado: 101770, montoExento: 0, iva: 13230, servicio: 0, total: 115000, indicadorImpuesto: 'IV', estado: 'Aprobada', adjunto: 'gas_total.pdf' }
        ],
        historial: [
            { fecha: '2026-06-09 08:00', usuario: 'Ana Jiménez', rol: 'Solicitante', accion: 'Solicitud creada', comentario: '' },
            { fecha: '2026-06-09 08:10', usuario: 'Ana Jiménez', rol: 'Solicitante', accion: 'Enviada a responsable de tarjetas', comentario: '' },
            { fecha: '2026-06-11 14:00', usuario: 'Erika Mora', rol: 'Resp. Tarjetas', accion: 'Aprobada por responsable de tarjetas', comentario: 'Todo en orden' },
            { fecha: '2026-06-11 14:01', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'REI-2026-004', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Andrea Solano', departamento: 'Administración', centroCosto: 'CC-100',
        supervisor: 'María López', fechaSolicitud: '2026-06-16', fechaInicio: '2026-06-10', fechaFin: '2026-06-12', dias: 3,
        solicitudRelacionada: 'VIA-2026-005', montoAprobadoOriginal: 220000, montoConfirmado: 238500, diferencia: 18500,
        montoSolicitado: 238500, montoAprobado: 0, estado: 'revision_contabilidad',
        comprobantes: [
            { fecha: '2026-06-10', numFactura: 'FE-AS-001', proveedor: 'Hotel La Fortuna', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 88496, iva: 11504, servicio: 8850, total: 108850, estado: 'pendiente', adjunto: 'hotel_fortuna.pdf' },
            { fecha: '2026-06-11', numFactura: 'FE-AS-002', proveedor: 'Rest. Arenal Springs', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 35398, iva: 4602, servicio: 3540, total: 43540, estado: 'pendiente', adjunto: 'arenal_springs.pdf' },
            { fecha: '2026-06-12', numFactura: 'FE-AS-003', proveedor: 'Gasolinera Shell', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 53097, iva: 6903, servicio: 0, total: 60000, estado: 'pendiente', adjunto: 'shell.pdf' },
            { fecha: '2026-06-12', numFactura: 'REC-AS-004', proveedor: 'Peajes ruta 1', tipoGasto: 3, tieneIVA: false, pctIVA: 0, montoSinIVA: 26110, iva: 0, servicio: 0, total: 26110, estado: 'pendiente', adjunto: 'peajes_r1.jpg' }
        ],
        historial: [
            { fecha: '2026-06-16 09:00', usuario: 'Andrea Solano', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-16 09:10', usuario: 'Andrea Solano', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-17 08:30', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada', comentario: 'Excede monto pero justificado' },
            { fecha: '2026-06-17 08:31', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'CCH-2026-004', tipo: 'caja_chica', tipoLabel: 'Liquidación Caja Chica',
        solicitante: 'Roberto Chen', departamento: 'Tecnología', centroCosto: 'CC-400',
        supervisor: 'María López', sucursal: 'San José Central',
        fechaSolicitud: '2026-06-10', fechaInicio: '2026-05-15', fechaFin: '2026-06-08', dias: 25,
        fondoAsignado: 350000, montoLiquidado: 198000, saldoRestante: 152000,
        montoSolicitado: 198000, montoAprobado: 198000, estado: 'aplicada_sap', refSAP: 'SAP-DOC-2026-0078',
        gastos: [
            { fecha: '2026-05-20', numFactura: 'FE-RC-001', proveedor: 'Amazon CR', tipoGasto: 9, tieneIVA: true, pctIVA: 13, montoSinIVA: 79646, iva: 10354, servicio: 0, total: 90000, estado: 'aceptada', adjunto: 'amazon.pdf' },
            { fecha: '2026-06-01', numFactura: 'FE-RC-002', proveedor: 'Uber Eats', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 26549, iva: 3451, servicio: 0, total: 30000, estado: 'aceptada', adjunto: 'uber_eats.pdf' },
            { fecha: '2026-06-05', numFactura: 'FE-RC-003', proveedor: 'Office Max', tipoGasto: 5, tieneIVA: true, pctIVA: 13, montoSinIVA: 69027, iva: 8973, servicio: 0, total: 78000, estado: 'aceptada', adjunto: 'officemax.pdf' }
        ],
        historial: [
            { fecha: '2026-06-10 15:00', usuario: 'Roberto Chen', rol: 'Solicitante', accion: 'Liquidación creada', comentario: '' },
            { fecha: '2026-06-10 15:05', usuario: 'Roberto Chen', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' },
            { fecha: '2026-06-11 10:00', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-12 09:00', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aceptación total', comentario: '' },
            { fecha: '2026-06-12 09:05', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aplicada en SAP', comentario: 'Referencia: SAP-DOC-2026-0078' }
        ]
    },
    {
        id: 'REI-2026-005', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Fernando Araya', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Ana Jiménez', fechaSolicitud: '2026-06-18', fechaInicio: '2026-06-14', fechaFin: '2026-06-15', dias: 2,
        solicitudRelacionada: 'VIA-2026-006', montoAprobadoOriginal: 160000, montoConfirmado: 155000, diferencia: -5000,
        montoSolicitado: 155000, montoAprobado: 140000, estado: 'aplicada_sap_parcial', refSAP: 'SAP-DOC-2026-0082',
        comprobantes: [
            { fecha: '2026-06-14', numFactura: 'FE-FA-001', proveedor: 'Hotel Cartago', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 61947, iva: 8053, servicio: 6195, total: 76195, estado: 'aceptada', adjunto: 'hotel_cart.pdf' },
            { fecha: '2026-06-14', numFactura: 'FE-FA-002', proveedor: 'Rest. La Casona', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 22124, iva: 2876, servicio: 2212, total: 27212, estado: 'aceptada', adjunto: 'casona.pdf' },
            { fecha: '2026-06-15', numFactura: 'FE-FA-003', proveedor: 'Gasolinera Uno', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 35398, iva: 4602, servicio: 0, total: 40000, estado: 'aceptada', adjunto: 'gas_uno.pdf' },
            { fecha: '2026-06-15', numFactura: 'REC-NOAUT', proveedor: 'Compra sin factura', tipoGasto: 13, tieneIVA: false, pctIVA: 0, montoSinIVA: 11593, iva: 0, servicio: 0, total: 11593, estado: 'rechazada', adjunto: '', observacion: 'Sin comprobante fiscal' }
        ],
        historial: [
            { fecha: '2026-06-18 08:00', usuario: 'Fernando Araya', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-18 08:10', usuario: 'Fernando Araya', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-19 09:00', usuario: 'Ana Jiménez', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-20 10:00', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aceptación parcial', comentario: 'Línea 4 rechazada: sin comprobante fiscal válido' },
            { fecha: '2026-06-20 10:05', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aplicada en SAP', comentario: 'Referencia: SAP-DOC-2026-0082' }
        ]
    },
    {
        id: 'CCH-2026-005', tipo: 'caja_chica', tipoLabel: 'Liquidación Caja Chica',
        solicitante: 'Erika Mora', departamento: 'Compras', centroCosto: 'CC-100',
        supervisor: 'María López', sucursal: 'San José Central',
        fechaSolicitud: '2026-06-20', fechaInicio: '2026-06-01', fechaFin: '2026-06-18', dias: 18,
        fondoAsignado: 250000, montoLiquidado: 178000, saldoRestante: 72000,
        montoSolicitado: 178000, montoAprobado: 0, estado: 'rechazada_contabilidad',
        gastos: [
            { fecha: '2026-06-05', numFactura: 'FE-EM-001', proveedor: 'Papelera Internacional', tipoGasto: 5, tieneIVA: true, pctIVA: 13, montoSinIVA: 70796, iva: 9204, servicio: 0, total: 80000, estado: 'rechazada', adjunto: 'papelera.pdf', observacion: 'Factura con datos incorrectos' },
            { fecha: '2026-06-10', numFactura: 'FE-EM-002', proveedor: 'Correos de CR', tipoGasto: 4, tieneIVA: true, pctIVA: 13, montoSinIVA: 53097, iva: 6903, servicio: 0, total: 60000, estado: 'rechazada', adjunto: 'correos.pdf', observacion: 'Duplicado con otra liquidación' },
            { fecha: '2026-06-15', numFactura: 'FE-EM-003', proveedor: 'Café Doka', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 33628, iva: 4372, servicio: 0, total: 38000, estado: 'rechazada', adjunto: 'cafe_doka.pdf', observacion: 'No corresponde a gasto empresarial' }
        ],
        historial: [
            { fecha: '2026-06-20 14:00', usuario: 'Erika Mora', rol: 'Solicitante', accion: 'Liquidación creada', comentario: '' },
            { fecha: '2026-06-20 14:05', usuario: 'Erika Mora', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' },
            { fecha: '2026-06-21 09:00', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-22 11:00', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Rechazada por contabilidad', comentario: 'Todas las facturas presentan irregularidades. Devolver para corrección.' }
        ]
    },
    {
        id: 'REI-2026-006', tipo: 'reintegro_viaticos', tipoLabel: 'Reintegro de Viáticos',
        solicitante: 'Juan Rodríguez', departamento: 'Ventas', centroCosto: 'CC-200',
        supervisor: 'María López', fechaSolicitud: '2026-06-25', fechaInicio: '2026-06-22', fechaFin: '2026-06-24', dias: 3,
        solicitudRelacionada: 'VIA-2026-007', montoAprobadoOriginal: 300000, montoConfirmado: 295000, diferencia: -5000,
        montoSolicitado: 295000, montoAprobado: 0, estado: 'revision_contabilidad',
        comprobantes: [
            { fecha: '2026-06-22', numFactura: 'FE-JR-001', proveedor: 'Hotel Wyndham', tipoGasto: 14, tieneIVA: true, pctIVA: 13, montoSinIVA: 106195, iva: 13805, servicio: 10620, total: 130620, estado: 'pendiente', adjunto: 'wyndham.pdf' },
            { fecha: '2026-06-23', numFactura: 'FE-JR-002', proveedor: 'Rest. Mar y Tierra', tipoGasto: 1, tieneIVA: true, pctIVA: 13, montoSinIVA: 44248, iva: 5752, servicio: 4425, total: 54425, estado: 'pendiente', adjunto: 'mar_tierra.pdf' },
            { fecha: '2026-06-24', numFactura: 'FE-JR-003', proveedor: 'Gasolinera Shell', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 61947, iva: 8053, servicio: 0, total: 70000, estado: 'pendiente', adjunto: 'shell2.pdf' },
            { fecha: '2026-06-24', numFactura: 'REC-JR-004', proveedor: 'Peajes autopista', tipoGasto: 3, tieneIVA: false, pctIVA: 0, montoSinIVA: 39955, iva: 0, servicio: 0, total: 39955, estado: 'pendiente', adjunto: 'peajes2.jpg' }
        ],
        historial: [
            { fecha: '2026-06-25 10:00', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Reintegro creado', comentario: '' },
            { fecha: '2026-06-25 10:10', usuario: 'Juan Rodríguez', rol: 'Solicitante', accion: 'Enviado a supervisor', comentario: '' },
            { fecha: '2026-06-26 08:00', usuario: 'María López', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-26 08:01', usuario: 'Sistema', rol: 'Sistema', accion: 'Enviada a contabilidad', comentario: '' }
        ]
    },
    {
        id: 'CCH-2026-006', tipo: 'caja_chica', tipoLabel: 'Liquidación Caja Chica',
        solicitante: 'Carlos Méndez', departamento: 'Operaciones', centroCosto: 'CC-300',
        supervisor: 'Ana Jiménez', sucursal: 'Cartago',
        fechaSolicitud: '2026-06-22', fechaInicio: '2026-06-01', fechaFin: '2026-06-20', dias: 20,
        fondoAsignado: 300000, montoLiquidado: 245000, saldoRestante: 55000,
        montoSolicitado: 245000, montoAprobado: 245000, estado: 'error_sap',
        errorSAP: 'Error de conexión con SAP B1 Service Layer: Timeout (código SL-TIMEOUT-503)',
        gastos: [
            { fecha: '2026-06-05', numFactura: 'FE-CM-001', proveedor: 'Ferretería El Constructor', tipoGasto: 11, tieneIVA: true, pctIVA: 13, montoSinIVA: 88496, iva: 11504, servicio: 0, total: 100000, estado: 'aceptada', adjunto: 'ferreteria_c.pdf' },
            { fecha: '2026-06-12', numFactura: 'FE-CM-002', proveedor: 'Gasolinera Shell Cartago', tipoGasto: 2, tieneIVA: true, pctIVA: 13, montoSinIVA: 79646, iva: 10354, servicio: 0, total: 90000, estado: 'aceptada', adjunto: 'shell_cart.pdf' },
            { fecha: '2026-06-18', numFactura: 'FE-CM-003', proveedor: 'Walmart Cartago', tipoGasto: 6, tieneIVA: true, pctIVA: 13, montoSinIVA: 48673, iva: 6327, servicio: 0, total: 55000, estado: 'aceptada', adjunto: 'walmart_c.pdf' }
        ],
        historial: [
            { fecha: '2026-06-22 09:00', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Liquidación creada', comentario: '' },
            { fecha: '2026-06-22 09:05', usuario: 'Carlos Méndez', rol: 'Solicitante', accion: 'Enviada a aprobación', comentario: '' },
            { fecha: '2026-06-23 10:00', usuario: 'Ana Jiménez', rol: 'Supervisor', accion: 'Aprobada', comentario: '' },
            { fecha: '2026-06-24 08:30', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Aceptación total', comentario: '' },
            { fecha: '2026-06-24 08:35', usuario: 'Patricia Vargas', rol: 'Contabilidad', accion: 'Error al aplicar en SAP', comentario: 'Timeout Service Layer - SL-TIMEOUT-503' }
        ]
    }
];

// ===== AUTENTICACIÓN =====
function simulateLogin() {
    document.getElementById('roleSelect').style.display = 'block';
}

function enterApp() {
    currentRole = document.getElementById('loginRole').value;
    const roleNames = {
        solicitante: 'Solicitante',
        supervisor: 'Supervisor / Aprobador',
        contabilidad: 'Contabilidad',
        tarjetas: 'Resp. Tarjetas / Compras',
        admin: 'Administrador'
    };
    const userNames = {
        solicitante: 'Juan Rodríguez',
        supervisor: 'María López',
        contabilidad: 'Patricia Vargas',
        tarjetas: 'Erika Mora',
        admin: 'Admin Sistema'
    };
    currentUser = { nombre: userNames[currentRole], rol: roleNames[currentRole], rolKey: currentRole };
    document.getElementById('userName').textContent = currentUser.nombre;
    document.getElementById('userRole').textContent = currentUser.rol;
    document.getElementById('userAvatar').textContent = currentUser.nombre.split(' ').map(n=>n[0]).join('');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    applyRoleVisibility();
    showView(currentRole === 'solicitante' ? 'misSolicitudes' : 'dashboard');
    updateDate();
}

function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('roleSelect').style.display = 'none';
    currentUser = null;
    currentRole = null;
}

function applyRoleVisibility() {
    document.querySelectorAll('.nav-indicadores').forEach(el => el.style.display = (currentRole === 'supervisor' || currentRole === 'contabilidad' || currentRole === 'tarjetas' || currentRole === 'admin') ? '' : 'none');
    document.querySelectorAll('.nav-supervisor').forEach(el => el.style.display = (currentRole === 'supervisor' || currentRole === 'admin') ? '' : 'none');
    document.querySelectorAll('.nav-tarjetas').forEach(el => el.style.display = (currentRole === 'tarjetas' || currentRole === 'admin') ? '' : 'none');
    document.querySelectorAll('.nav-contabilidad').forEach(el => el.style.display = (currentRole === 'contabilidad' || currentRole === 'admin') ? '' : 'none');
    document.querySelectorAll('.nav-admin').forEach(el => el.style.display = (currentRole === 'admin') ? '' : 'none');
}

function updateDate() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== NAVEGACIÓN =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function showView(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.querySelector(`[data-view="${view}"]`);
    if (navEl) navEl.classList.add('active');

    const titles = {
        dashboard: 'Indicadores de Gestión',
        misSolicitudes: 'Mis Solicitudes',
        solicitudViaticos: 'Solicitud de Viáticos',
        reintegroViaticos: 'Reintegro de Viáticos',
        cajaChica: 'Liquidaciones de Caja Chica',
        tarjetaCorporativa: 'Reintegro por Tarjeta Corporativa',
        bandejaAprobaciones: 'Bandeja de Aprobaciones',
        bandejaTarjetas: 'Bandeja Tarjetas Corporativas',
        revisionContabilidad: 'Revisión Contabilidad',
        administrador: 'Administrador'
    };
    document.getElementById('viewTitle').textContent = titles[view] || '';

    const renderers = {
        dashboard: renderDashboard,
        misSolicitudes: renderMisSolicitudes,
        solicitudViaticos: renderSolicitudViaticos,
        reintegroViaticos: renderReintegroViaticos,
        cajaChica: renderCajaChica,
        tarjetaCorporativa: renderTarjetaCorporativa,
        bandejaAprobaciones: renderBandejaAprobaciones,
        bandejaTarjetas: renderBandejaTarjetas,
        revisionContabilidad: renderRevisionContabilidad,
        administrador: renderAdministrador
    };
    if (renderers[view]) renderers[view]();
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

// ===== UTILIDADES =====
function formatMoney(amount) {
    return '₡' + (amount || 0).toLocaleString('es-CR');
}

function getBadge(estado) {
    const e = estados[estado];
    return e ? `<span class="badge ${e.clase}">${e.label}</span>` : estado;
}

function getCategoriaNombre(id) {
    const cat = categoriasGasto.find(c => c.id === id);
    return cat ? cat.nombre : 'Sin categoría';
}

function getCategoriaOptions(selected) {
    return categoriasGasto.filter(c=>c.activo).map(c => `<option value="${c.id}" ${c.id==selected?'selected':''}>${c.nombre}</option>`).join('');
}

function getIVAOptions(selected) {
    return porcentajesIVA.map(p => `<option value="${p.valor}" ${p.valor==selected?'selected':''}>${p.texto}</option>`).join('');
}

function calcDias(inicio, fin) {
    if (!inicio || !fin) return 0;
    const d1 = new Date(inicio), d2 = new Date(fin);
    return Math.ceil((d2 - d1) / (1000*60*60*24)) + 1;
}

// ===== DASHBOARD =====
function getDefaultDashboardFilters() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const lastDayStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    return { desde: firstDay, hasta: lastDayStr, tipo: '' };
}

let dashboardFilters = getDefaultDashboardFilters();

function filterDashboardData() {
    return solicitudes.filter(s => {
        if (s.estado === 'borrador') return false;
        const fecha = s.fechaSolicitud;
        if (dashboardFilters.desde && fecha < dashboardFilters.desde) return false;
        if (dashboardFilters.hasta && fecha > dashboardFilters.hasta) return false;
        if (dashboardFilters.tipo && s.tipo !== dashboardFilters.tipo) return false;
        return true;
    });
}

function onDashboardFilterChange() {
    dashboardFilters.desde = document.getElementById('dashDesde').value;
    dashboardFilters.hasta = document.getElementById('dashHasta').value;
    dashboardFilters.tipo = document.getElementById('dashTipo').value;
    renderDashboard();
}

function renderDashboard() {
    const area = document.getElementById('contentArea');
    const filtered = filterDashboardData();
    const totalSolicitudes = filtered.length;
    const pendientes = filtered.filter(s => s.estado === 'pendiente' || s.estado === 'revision_contabilidad').length;
    const aprobadas = filtered.filter(s => s.estado === 'aprobada' || s.estado === 'aprobada_contabilidad' || s.estado === 'aplicada_sap').length;
    const rechazadas = filtered.filter(s => s.estado === 'rechazada' || s.estado === 'rechazada_contabilidad').length;
    const otros = totalSolicitudes - aprobadas - pendientes - rechazadas;
    const montoTotal = filtered.reduce((s, x) => s + (x.montoSolicitado || 0), 0);
    const montoAprobado = filtered.reduce((s, x) => s + (x.montoAprobado || 0), 0);

    // Viáticos unificado (solicitud + reintegro)
    const porTipo = {
        viaticos: filtered.filter(s => s.tipo === 'viaticos' || s.tipo === 'reintegro_viaticos').length,
        caja_chica: filtered.filter(s => s.tipo === 'caja_chica').length,
        tarjeta_corporativa: filtered.filter(s => s.tipo === 'tarjeta_corporativa').length
    };
    const maxTipo = Math.max(porTipo.viaticos, porTipo.caja_chica, porTipo.tarjeta_corporativa, 1);

    const pctAprobadas = totalSolicitudes > 0 ? (aprobadas / totalSolicitudes * 100) : 0;
    const pctPendientes = totalSolicitudes > 0 ? (pendientes / totalSolicitudes * 100) : 0;
    const pctRechazadas = totalSolicitudes > 0 ? (rechazadas / totalSolicitudes * 100) : 0;
    const pctOtros = totalSolicitudes > 0 ? (otros / totalSolicitudes * 100) : 0;

    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Filtros</h3></div>
            <div class="filters-bar">
                <div class="filter-group"><label>Desde</label><input type="date" id="dashDesde" value="${dashboardFilters.desde}" onchange="onDashboardFilterChange()"></div>
                <div class="filter-group"><label>Hasta</label><input type="date" id="dashHasta" value="${dashboardFilters.hasta}" onchange="onDashboardFilterChange()"></div>
                <div class="filter-group"><label>Tipo de Solicitud</label>
                    <select id="dashTipo" onchange="onDashboardFilterChange()">
                        <option value="">Todos</option>
                        <option value="viaticos" ${dashboardFilters.tipo==='viaticos'?'selected':''}>Viáticos (Solicitud)</option>
                        <option value="reintegro_viaticos" ${dashboardFilters.tipo==='reintegro_viaticos'?'selected':''}>Viáticos (Reintegro)</option>
                        <option value="caja_chica" ${dashboardFilters.tipo==='caja_chica'?'selected':''}>Caja Chica</option>
                        <option value="tarjeta_corporativa" ${dashboardFilters.tipo==='tarjeta_corporativa'?'selected':''}>Tarjeta Corporativa</option>
                    </select>
                </div>
                <button class="btn-secondary btn-sm" onclick="dashboardFilters=getDefaultDashboardFilters();renderDashboard();">Limpiar filtros</button>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">Total Solicitudes</div>
                <div class="kpi-value">${totalSolicitudes}</div>
                <div class="kpi-sub">Período seleccionado</div>
            </div>
            <div class="kpi-card success">
                <div class="kpi-label">Aprobadas / Aplicadas</div>
                <div class="kpi-value">${aprobadas}</div>
                <div class="kpi-sub">${totalSolicitudes > 0 ? Math.round(pctAprobadas) : 0}% del total</div>
            </div>
            <div class="kpi-card warning">
                <div class="kpi-label">Pendientes de Gestión</div>
                <div class="kpi-value">${pendientes}</div>
                <div class="kpi-sub">Requieren acción</div>
            </div>
            <div class="kpi-card danger">
                <div class="kpi-label">Monto Solicitado vs Aprobado</div>
                <div class="kpi-value">${formatMoney(montoAprobado)}</div>
                <div class="kpi-sub">de ${formatMoney(montoTotal)} solicitado</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Solicitudes por Tipo de Proceso</h3>
                    <button class="btn-secondary btn-sm" onclick="exportarTipoProcesoExcel()">📥 Exportar Excel</button>
                </div>
                <div class="chart-bar-container">
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">Viáticos</span>
                        <div class="chart-bar-track"><div class="chart-bar-fill blue" style="width:${porTipo.viaticos/maxTipo*100}%">${porTipo.viaticos}</div></div>
                    </div>
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">Caja Chica</span>
                        <div class="chart-bar-track"><div class="chart-bar-fill yellow" style="width:${porTipo.caja_chica/maxTipo*100}%">${porTipo.caja_chica}</div></div>
                    </div>
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">Tarj. Corporativa</span>
                        <div class="chart-bar-track"><div class="chart-bar-fill purple" style="width:${porTipo.tarjeta_corporativa/maxTipo*100}%">${porTipo.tarjeta_corporativa}</div></div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Estado General</h3>
                    <button class="btn-secondary btn-sm" onclick="exportarEstadoGeneralExcel()">📥 Exportar Excel</button>
                </div>
                <div class="donut-container">
                    <div class="donut-chart" style="background: conic-gradient(var(--success) 0% ${pctAprobadas}%, var(--warning) ${pctAprobadas}% ${pctAprobadas+pctPendientes}%, var(--danger) ${pctAprobadas+pctPendientes}% ${pctAprobadas+pctPendientes+pctRechazadas}%, var(--gray-300) ${pctAprobadas+pctPendientes+pctRechazadas}% 100%);">
                        <div class="donut-center" style="background:#fff;width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;">${totalSolicitudes}</div>
                    </div>
                    <div class="donut-legend">
                        <div class="legend-item"><div class="legend-dot" style="background:var(--success)"></div> Aprobadas (${aprobadas})</div>
                        <div class="legend-item"><div class="legend-dot" style="background:var(--warning)"></div> Pendientes (${pendientes})</div>
                        <div class="legend-item"><div class="legend-dot" style="background:var(--danger)"></div> Rechazadas (${rechazadas})</div>
                        <div class="legend-item"><div class="legend-dot" style="background:var(--gray-300)"></div> Otros (${otros})</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Detalle de Solicitudes</h3>
                <button class="btn-secondary btn-sm" onclick="exportarDetalleSolicitudesExcel()">📥 Exportar Excel</button>
            </div>
            <div class="table-container">
                <table id="tablaDashDetalle">
                    <thead><tr><th>N°</th><th>Tipo</th><th>Solicitante</th><th>Fecha</th><th>Monto Solicitado</th><th>Monto Aprobado</th><th>Estado</th></tr></thead>
                    <tbody>
                        ${filtered.length > 0 ? filtered.map(s => `<tr>
                            <td>${s.id}</td>
                            <td>${s.tipoLabel}</td>
                            <td>${s.solicitante}</td>
                            <td>${s.fechaSolicitud}</td>
                            <td class="text-right">${formatMoney(s.montoSolicitado)}</td>
                            <td class="text-right">${formatMoney(s.montoAprobado)}</td>
                            <td>${getBadge(s.estado)}</td>
                        </tr>`).join('') : '<tr><td colspan="7" class="text-center text-muted">No hay solicitudes en el período seleccionado</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===== EXPORTAR A EXCEL =====
function exportarEstadoGeneralExcel() {
    const filtered = filterDashboardData();
    const pendientes = filtered.filter(s => s.estado === 'pendiente' || s.estado === 'revision_contabilidad').length;
    const aprobadas = filtered.filter(s => s.estado === 'aprobada' || s.estado === 'aprobada_contabilidad' || s.estado === 'aplicada_sap').length;
    const rechazadas = filtered.filter(s => s.estado === 'rechazada' || s.estado === 'rechazada_contabilidad').length;
    const otros = filtered.length - aprobadas - pendientes - rechazadas;

    const rows = [
        ['Estado', 'Cantidad', 'Porcentaje'],
        ['Aprobadas', aprobadas, filtered.length > 0 ? (aprobadas/filtered.length*100).toFixed(1) + '%' : '0%'],
        ['Pendientes', pendientes, filtered.length > 0 ? (pendientes/filtered.length*100).toFixed(1) + '%' : '0%'],
        ['Rechazadas', rechazadas, filtered.length > 0 ? (rechazadas/filtered.length*100).toFixed(1) + '%' : '0%'],
        ['Otros', otros, filtered.length > 0 ? (otros/filtered.length*100).toFixed(1) + '%' : '0%'],
        ['Total', filtered.length, '100%']
    ];
    downloadExcel(rows, 'Estado_General_Solicitudes');
}

function exportarTipoProcesoExcel() {
    const filtered = filterDashboardData();
    const viaticos = filtered.filter(s => s.tipo === 'viaticos' || s.tipo === 'reintegro_viaticos').length;
    const cajaChica = filtered.filter(s => s.tipo === 'caja_chica').length;
    const tarjeta = filtered.filter(s => s.tipo === 'tarjeta_corporativa').length;

    const rows = [
        ['Tipo de Proceso', 'Cantidad'],
        ['Viáticos', viaticos],
        ['Caja Chica', cajaChica],
        ['Tarjeta Corporativa', tarjeta],
        ['Total', filtered.length]
    ];
    downloadExcel(rows, 'Solicitudes_por_Tipo');
}

function exportarDetalleSolicitudesExcel() {
    const filtered = filterDashboardData();
    const rows = [
        ['N° Solicitud', 'Tipo', 'Solicitante', 'Departamento', 'Centro Costo', 'Fecha Solicitud', 'Fecha Inicio', 'Fecha Fin', 'Días', 'Monto Solicitado', 'Monto Aprobado', 'Estado']
    ];
    filtered.forEach(s => {
        rows.push([
            s.id, s.tipoLabel, s.solicitante, s.departamento, s.centroCosto,
            s.fechaSolicitud, s.fechaInicio, s.fechaFin, s.dias,
            s.montoSolicitado, s.montoAprobado, estados[s.estado]?.label || s.estado
        ]);
    });
    downloadExcel(rows, 'Detalle_Solicitudes');
}

function downloadExcel(rows, filename) {
    // Genera un archivo CSV compatible con Excel (con BOM UTF-8 para acentos)
    const BOM = '\uFEFF';
    const csv = rows.map(row =>
        row.map(cell => {
            const val = String(cell == null ? '' : cell);
            // Escapar comillas y envolver en comillas si contiene coma o comillas
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        }).join(',')
    ).join('\r\n');

    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== MIS SOLICITUDES =====
function renderMisSolicitudes() {
    const area = document.getElementById('contentArea');
    area.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Todas mis solicitudes</h3>
                <div class="flex gap-8">
                    <button class="btn-primary btn-sm" onclick="showView('solicitudViaticos')">+ Nueva Solicitud Viáticos</button>
                    <button class="btn-info btn-sm" onclick="showView('cajaChica')">+ Liquidación Caja Chica</button>
                </div>
            </div>
            <div class="filters-bar">
                <div class="filter-group"><label>Tipo</label><select onchange="filterMisSolicitudes()"><option value="">Todos</option><option value="viaticos">Viáticos</option><option value="reintegro_viaticos">Reintegro Viáticos</option><option value="caja_chica">Caja Chica</option><option value="tarjeta_corporativa">Tarjeta Corporativa</option></select></div>
                <div class="filter-group"><label>Estado</label><select onchange="filterMisSolicitudes()"><option value="">Todos</option>${Object.entries(estados).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></div>
                <div class="filter-group"><label>Desde</label><input type="date"></div>
                <div class="filter-group"><label>Hasta</label><input type="date"></div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr>
                        <th>N° Solicitud</th><th>Tipo</th><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Días</th><th>Monto Solicitado</th><th>Monto Aprobado</th><th>Estado</th><th>Acciones</th>
                    </tr></thead>
                    <tbody>
                        ${solicitudes.map(s => `<tr>
                            <td><strong>${s.id}</strong></td>
                            <td>${s.tipoLabel}</td>
                            <td>${s.fechaSolicitud}</td>
                            <td>${s.fechaInicio}</td>
                            <td>${s.fechaFin}</td>
                            <td>${s.dias}</td>
                            <td class="text-right">${formatMoney(s.montoSolicitado)}</td>
                            <td class="text-right">${formatMoney(s.montoAprobado)}</td>
                            <td>${getBadge(s.estado)}</td>
                            <td>
                                <button class="btn-primary btn-xs" onclick="openDetailModal('${s.id}')">Ver</button>
                                ${s.estado === 'borrador' ? `<button class="btn-secondary btn-xs" onclick="editSolicitud('${s.id}')">Editar</button>
                                <button class="btn-danger btn-xs" onclick="deleteSolicitud('${s.id}')">Eliminar</button>` : ''}
                                <button class="btn-secondary btn-xs" onclick="duplicarSolicitud('${s.id}')">Duplicar</button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function filterMisSolicitudes() {
    // Simplified filter - in production would filter the table
}

// ===== SOLICITUD DE VIÁTICOS =====
function renderSolicitudViaticos() {
    const area = document.getElementById('contentArea');
    const emp = getEmpleadoActual();
    const ccObj = centrosCosto.find(c => c.id === emp.centroCosto);
    const today = new Date().toISOString().split('T')[0];

    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Nueva Solicitud de Viáticos</h3></div>
            <form id="formViaticos" onsubmit="return false;">
                <div class="form-section">
                    <div class="form-section-title">Información del Solicitante</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Solicitante</label><input type="text" value="${emp.nombre}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Departamento</label><input type="text" value="${emp.departamento}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Centro de Costo</label><input type="text" value="${emp.centroCosto}${ccObj ? ' - ' + ccObj.nombre : ''}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Supervisor</label><input type="text" value="${emp.supervisor}" readonly style="background:#f3f4f6"></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Información del Viaje</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Fecha de Solicitud</label><input type="date" value="${today}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Fecha Salida</label><input type="date" id="viaSalida" onchange="calcDiasViaticos()"></div>
                        <div class="form-group"><label>Fecha Regreso</label><input type="date" id="viaRegreso" onchange="calcDiasViaticos()"></div>
                        <div class="form-group"><label>Días</label><input type="number" id="viaDias" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Destino</label><input type="text" placeholder="Ej: Limón, Guanacaste"></div>
                        <div class="form-group"><label>Motivo del Viaje</label><input type="text" placeholder="Describa el motivo"></div>
                        <div class="form-group"><label>Tipo de Gira</label><select><option>Nacional</option><option>Internacional</option></select></div>
                        <div class="form-group"><label>Medio de Transporte</label><select><option>Vehículo empresa</option><option>Vehículo propio</option><option>Transporte público</option><option>Avión</option></select></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Detalle de Gastos Estimados</div>
                    <button type="button" class="btn-primary btn-sm mb-8" onclick="addGastoViatico()">+ Añadir gasto estimado</button>
                    <div class="table-container">
                        <table id="tablaGastosViaticos">
                            <thead><tr><th>Categoría</th><th>Monto Estimado</th><th>Observación</th>${currentRole==='contabilidad'||currentRole==='admin'?'<th>Cuenta Contable</th>':''}<th>Acción</th></tr></thead>
                            <tbody id="bodyGastosViaticos"></tbody>
                            <tfoot><tr><td><strong>Total</strong></td><td id="totalGastosVia" class="text-right"><strong>₡0</strong></td><td colspan="${currentRole==='contabilidad'||currentRole==='admin'?'3':'2'}"></td></tr></tfoot>
                        </table>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Resumen de Montos Estimados</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Alimentación</label><input type="text" id="viaResAlim" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Hospedaje</label><input type="text" id="viaResHosp" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Transporte / Parqueo / Peajes</label><input type="text" id="viaResTrans" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Combustible</label><input type="text" id="viaResComb" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Otros</label><input type="text" id="viaResOtros" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label><strong>Total Solicitado</strong></label><input type="text" id="viaTotalSol" readonly value="₡0" style="font-weight:bold;background:#eef2ff;border-color:var(--accent)"></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Observaciones</div>
                    <div class="form-group"><textarea placeholder="Observaciones adicionales..." rows="3"></textarea></div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="alert('Borrador guardado')">Guardar Borrador</button>
                    <button type="button" class="btn-primary" onclick="enviarAprobacion('viaticos')">Enviar a Aprobación</button>
                    <button type="button" class="btn-secondary" onclick="alert('Solicitud duplicada')">Duplicar</button>
                </div>
            </form>
        </div>
    `;
}

function calcDiasViaticos() {
    const salida = document.getElementById('viaSalida').value;
    const regreso = document.getElementById('viaRegreso').value;
    document.getElementById('viaDias').value = calcDias(salida, regreso);
}

let gastosViaticosTemp = [];
function addGastoViatico() {
    gastosViaticosTemp.push({ categoria: 1, monto: 0, observacion: '' });
    renderGastosViaticos();
}

function renderGastosViaticos() {
    const tbody = document.getElementById('bodyGastosViaticos');
    const showCuenta = currentRole==='contabilidad'||currentRole==='admin';
    tbody.innerHTML = gastosViaticosTemp.map((g, i) => `<tr>
        <td><select onchange="gastosViaticosTemp[${i}].categoria=parseInt(this.value);calcTotalGastosVia()">${getCategoriaOptions(g.categoria)}</select></td>
        <td><input type="number" value="${g.monto}" onchange="gastosViaticosTemp[${i}].monto=parseFloat(this.value)||0;calcTotalGastosVia()" style="width:120px"></td>
        <td><input type="text" value="${g.observacion}" onchange="gastosViaticosTemp[${i}].observacion=this.value" style="width:150px"></td>
        ${showCuenta?`<td>${categoriasGasto.find(c=>c.id==g.categoria)?.cuenta||''}</td>`:''}
        <td><button class="btn-danger btn-xs" onclick="gastosViaticosTemp.splice(${i},1);renderGastosViaticos()">✕</button></td>
    </tr>`).join('');
    calcTotalGastosVia();
}

function calcTotalGastosVia() {
    // Sumar por categoría automáticamente
    // Cat 1 = Alimentación, Cat 14 = Hospedaje, Cat 2 = Combustible, Cat 3 = Transporte/Parqueo/Peajes, Otros = todo lo demás
    let alimentacion = 0, hospedaje = 0, transporte = 0, combustible = 0, otros = 0;

    gastosViaticosTemp.forEach(g => {
        const monto = parseFloat(g.monto) || 0;
        const catId = parseInt(g.categoria);
        if (catId === 1) {
            alimentacion += monto;
        } else if (catId === 14) {
            hospedaje += monto;
        } else if (catId === 2) {
            combustible += monto;
        } else if (catId === 3) {
            transporte += monto;
        } else {
            otros += monto;
        }
    });

    const total = gastosViaticosTemp.reduce((s, g) => s + (parseFloat(g.monto) || 0), 0);

    const el = document.getElementById('totalGastosVia');
    if (el) el.innerHTML = `<strong>${formatMoney(total)}</strong>`;

    // Actualizar resumen
    const resAlim = document.getElementById('viaResAlim');
    const resHosp = document.getElementById('viaResHosp');
    const resTrans = document.getElementById('viaResTrans');
    const resComb = document.getElementById('viaResComb');
    const resOtros = document.getElementById('viaResOtros');
    const totalSol = document.getElementById('viaTotalSol');

    if (resAlim) resAlim.value = formatMoney(alimentacion);
    if (resHosp) resHosp.value = formatMoney(hospedaje);
    if (resTrans) resTrans.value = formatMoney(transporte);
    if (resComb) resComb.value = formatMoney(combustible);
    if (resOtros) resOtros.value = formatMoney(otros);
    if (totalSol) totalSol.value = formatMoney(total);
}

// ===== REINTEGRO DE VIÁTICOS =====
function renderReintegroViaticos() {
    const area = document.getElementById('contentArea');
    const viaticosAprobados = solicitudes.filter(s => s.tipo === 'viaticos' && s.estado === 'aprobada');
    const emp = getEmpleadoActual();
    const ccObj = centrosCosto.find(c => c.id === emp.centroCosto);
    const today = new Date().toISOString().split('T')[0];

    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Nuevo Reintegro de Viáticos</h3></div>
            <form id="formReintegro" onsubmit="return false;">
                <div class="form-section">
                    <div class="form-section-title">Solicitud de Viáticos Relacionada</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Seleccionar solicitud aprobada</label>
                            <select id="selViatico" onchange="cargarViatico()">
                                <option value="">-- Seleccione una solicitud aprobada --</option>
                                ${viaticosAprobados.map(v => `<option value="${v.id}">${v.id} - ${v.destino} (${formatMoney(v.montoAprobado)})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group"><label>Monto Aprobado Original</label><input type="text" id="reiMontoAprobado" readonly value="₡0" style="background:#f3f4f6;font-weight:bold"></div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title">Información General</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Solicitante</label><input type="text" id="reiSolicitante" value="${emp.nombre}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Departamento</label><input type="text" id="reiDepto" value="${emp.departamento}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Centro de Costo</label><input type="text" id="reiCC" value="${emp.centroCosto}${ccObj ? ' - ' + ccObj.nombre : ''}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Supervisor</label><input type="text" id="reiSupervisor" value="${emp.supervisor}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Fecha Solicitud</label><input type="text" id="reiFechaSol" value="${today}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Fecha Inicio</label><input type="text" id="reiInicio" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Fecha Fin</label><input type="text" id="reiFin" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Días</label><input type="text" id="reiDias" readonly style="background:#f3f4f6"></div>
                    </div>
                </div>

                <div class="form-section" id="seccionComprobantesRei" style="display:none;">
                    <div class="form-section-title">Comprobantes / Facturas</div>
                    <div class="alert alert-info mb-8">Los gastos aprobados de la solicitud original se cargan automáticamente. Puede agregar comprobantes adicionales.</div>
                    <button type="button" class="btn-primary btn-sm mb-8" onclick="addComprobanteReintegro()">+ Añadir comprobante adicional</button>
                    <div class="table-container">
                        <table id="tablaComprobantesRei">
                            <thead><tr><th>Fecha Factura</th><th>N° Factura</th><th>Proveedor</th><th>Tipo Gasto</th><th>¿IVA?</th><th>% IVA</th><th>Monto s/IVA</th><th>IVA</th><th>¿Servicio?</th><th>% Serv.</th><th>Servicio</th><th>Total</th><th>Adjunto</th><th>Acción</th></tr></thead>
                            <tbody id="bodyComprobantesRei"></tbody>
                            <tfoot><tr><td colspan="11"><strong>Total Confirmado</strong></td><td id="totalConfirmadoRei"><strong>₡0</strong></td><td colspan="2"></td></tr></tfoot>
                        </table>
                    </div>
                    <div class="form-grid mt-16">
                        <div class="form-group"><label>Monto Aprobado</label><input type="text" id="reiAprobadoComp" readonly value="₡0" style="background:#f3f4f6;font-weight:bold"></div>
                        <div class="form-group"><label>Monto Confirmado</label><input type="text" id="reiConfirmadoComp" readonly value="₡0" style="background:#f3f4f6;font-weight:bold"></div>
                        <div class="form-group"><label>Diferencia</label><input type="text" id="reiDiferencia" readonly value="₡0" style="background:#f3f4f6;font-weight:bold"></div>
                    </div>
                    <div id="alertDiferencia"></div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="alert('Borrador guardado')">Guardar Borrador</button>
                    <button type="button" class="btn-primary" onclick="enviarAprobacion('reintegro')">Enviar a Supervisor</button>
                </div>
            </form>
        </div>
    `;
}

function cargarViatico() {
    const sel = document.getElementById('selViatico').value;
    const v = solicitudes.find(s => s.id === sel);
    if (!v) {
        document.getElementById('reiMontoAprobado').value = '₡0';
        document.getElementById('reiInicio').value = '';
        document.getElementById('reiFin').value = '';
        document.getElementById('reiDias').value = '';
        document.getElementById('seccionComprobantesRei').style.display = 'none';
        comprobantesReiTemp = [];
        return;
    }

    // Precargar datos de la solicitud aprobada
    document.getElementById('reiMontoAprobado').value = formatMoney(v.montoAprobado);
    document.getElementById('reiAprobadoComp').value = formatMoney(v.montoAprobado);
    document.getElementById('reiInicio').value = v.fechaInicio;
    document.getElementById('reiFin').value = v.fechaFin;
    document.getElementById('reiDias').value = v.dias;

    // Cargar los gastos aprobados como comprobantes base
    comprobantesReiTemp = (v.gastos || []).map(g => ({
        fecha: '',
        numFactura: '',
        proveedor: '',
        tipoGasto: g.categoria,
        tieneIVA: true,
        pctIVA: 13,
        montoSinIVA: Math.round(g.monto / 1.13),
        iva: Math.round(g.monto - g.monto / 1.13),
        tieneServicio: false,
        pctServicio: 10,
        servicio: 0,
        total: g.monto,
        adjunto: '',
        observacion: g.observacion || '',
        esOriginal: true
    }));

    // Mostrar sección de comprobantes
    document.getElementById('seccionComprobantesRei').style.display = 'block';
    renderComprobantesRei();
}

function calcDiasReintegro() {
    const inicio = document.getElementById('reiInicio').value;
    const fin = document.getElementById('reiFin').value;
    document.getElementById('reiDias').value = calcDias(inicio, fin);
}

let comprobantesReiTemp = [];
function addComprobanteReintegro() {
    comprobantesReiTemp.push({ fecha:'', numFactura:'', proveedor:'', tipoGasto:1, tieneIVA:true, pctIVA:13, montoSinIVA:0, iva:0, tieneServicio:false, pctServicio:10, servicio:0, total:0, adjunto:'', esOriginal: false });
    renderComprobantesRei();
}

function renderComprobantesRei() {
    const tbody = document.getElementById('bodyComprobantesRei');
    tbody.innerHTML = comprobantesReiTemp.map((c, i) => {
        return `<tr${c.esOriginal ? ' style="background:#f0f9ff"' : ''}>
        <td><input type="date" value="${c.fecha}" onchange="comprobantesReiTemp[${i}].fecha=this.value" style="width:110px"></td>
        <td><input type="text" value="${c.numFactura}" onchange="comprobantesReiTemp[${i}].numFactura=this.value" style="width:100px"></td>
        <td><input type="text" value="${c.proveedor}" placeholder="${c.esOriginal?(c.observacion||'Gasto aprobado'):''}" onchange="comprobantesReiTemp[${i}].proveedor=this.value" style="width:120px"></td>
        <td><select onchange="comprobantesReiTemp[${i}].tipoGasto=this.value" style="width:130px">${getCategoriaOptions(c.tipoGasto)}</select></td>
        <td><select onchange="comprobantesReiTemp[${i}].tieneIVA=this.value==='si';calcLineaRei(${i})" style="width:55px"><option value="si" ${c.tieneIVA?'selected':''}>Sí</option><option value="no" ${!c.tieneIVA?'selected':''}>No</option></select></td>
        <td><select onchange="comprobantesReiTemp[${i}].pctIVA=parseInt(this.value);calcLineaRei(${i})" style="width:65px" ${!c.tieneIVA?'disabled':''}>${getIVAOptions(c.pctIVA)}</select></td>
        <td><input type="number" value="${c.montoSinIVA}" onchange="comprobantesReiTemp[${i}].montoSinIVA=parseFloat(this.value);calcLineaRei(${i})" style="width:100px"></td>
        <td><input type="number" value="${c.iva}" readonly style="width:80px;background:#f3f4f6"></td>
        <td><select onchange="comprobantesReiTemp[${i}].tieneServicio=this.value==='si';calcLineaRei(${i})" style="width:55px"><option value="no" ${!c.tieneServicio?'selected':''}>No</option><option value="si" ${c.tieneServicio?'selected':''}>Sí</option></select></td>
        <td><input type="number" value="${c.pctServicio}" onchange="comprobantesReiTemp[${i}].pctServicio=parseFloat(this.value);calcLineaRei(${i})" style="width:55px;${!c.tieneServicio?'background:#e5e7eb;':''};" ${!c.tieneServicio?'disabled':''}></td>
        <td><input type="number" value="${c.servicio}" readonly style="width:75px;background:#f3f4f6"></td>
        <td><strong>${formatMoney(c.total)}</strong></td>
        <td><input type="file" onchange="comprobantesReiTemp[${i}].adjunto=this.files[0]?.name||''" style="width:100px"></td>
        <td><button class="btn-danger btn-xs" onclick="comprobantesReiTemp.splice(${i},1);renderComprobantesRei()">✕</button></td>
    </tr>`;
    }).join('');
    calcTotalRei();
}

function calcLineaRei(i) {
    const c = comprobantesReiTemp[i];
    c.iva = c.tieneIVA ? Math.round(c.montoSinIVA * c.pctIVA / 100) : 0;
    c.servicio = c.tieneServicio ? Math.round(c.montoSinIVA * (c.pctServicio || 10) / 100) : 0;
    c.total = c.montoSinIVA + c.iva + c.servicio;
    renderComprobantesRei();
}

function calcTotalRei() {
    const total = comprobantesReiTemp.reduce((s,c) => s + c.total, 0);
    document.getElementById('totalConfirmadoRei').innerHTML = `<strong>${formatMoney(total)}</strong>`;
    document.getElementById('reiConfirmadoComp').value = formatMoney(total);
    const aprobadoText = document.getElementById('reiMontoAprobado').value;
    const aprobado = parseFloat(aprobadoText.replace(/[₡,.\s]/g,'')) || 0;
    const dif = total - aprobado;
    document.getElementById('reiDiferencia').value = formatMoney(dif);
    const alertDiv = document.getElementById('alertDiferencia');
    if (dif > 0) {
        alertDiv.innerHTML = `<div class="alert alert-warning">⚠️ El monto confirmado excede el aprobado por ${formatMoney(dif)}</div>`;
    } else if (dif < 0) {
        alertDiv.innerHTML = `<div class="alert alert-info">ℹ️ El monto confirmado es menor al aprobado. Diferencia a favor: ${formatMoney(Math.abs(dif))}</div>`;
    } else {
        alertDiv.innerHTML = `<div class="alert alert-success">✓ El monto confirmado coincide con el aprobado</div>`;
    }
}

// ===== CAJA CHICA =====
const categoriasCajaChica = [
    { id: 'CC-01', nombre: 'Compra mercadería para Inventarios', cuenta: '1101002002', seccion: 'Compras IVA Directo', pctIVA: 13 },
    { id: 'CC-02', nombre: 'Eventos y Ferias', cuenta: '6101060007', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-03', nombre: 'Reuniones y Capacitaciones', cuenta: '6101005004', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-04', nombre: 'Atenciones Clientes', cuenta: '6101070001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-05', nombre: 'Atenciones Proveedores', cuenta: '6101070002', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-06', nombre: 'Hospedaje (IVA 13%)', cuenta: '6101010001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-07', nombre: 'Viajes, Viáticos y Alimentación (IVA 13%)', cuenta: '6101010003', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-08', nombre: 'Reparaciones-Mantenim. General', cuenta: '6101045001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-09', nombre: 'Reparaciones-Mantenim. Vehículos', cuenta: '6101045002', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-10', nombre: 'Accesorios y equipo menor (IVA 13%)', cuenta: '6101045004', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-11', nombre: 'Papelería y útiles oficina', cuenta: '6101040001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-12', nombre: 'Materiales de limpieza y aseo', cuenta: '6101040002', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-13', nombre: 'Aceites y lubricantes', cuenta: '6101040003', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-14', nombre: 'Materiales de empaque', cuenta: '6101065003', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-15', nombre: 'Fletes y encomiendas', cuenta: '6101065001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-16', nombre: 'Reparaciones por garantías', cuenta: '6101070006', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-17', nombre: 'Servicios profesionales', cuenta: '6101020001', seccion: 'Gastos IVA 13%', pctIVA: 13 },
    { id: 'CC-18', nombre: 'Medicamentos (IVA 2%)', cuenta: '6101005003', seccion: 'Gastos IVA 2%', pctIVA: 2 },
    { id: 'CC-19', nombre: 'Alimentos Canasta básica (IVA 1%)', cuenta: '6101040002', seccion: 'Gastos IVA 1%', pctIVA: 1 },
    { id: 'CC-20', nombre: 'Combustibles (exento)', cuenta: '6101040003', seccion: 'Gastos Exentos', pctIVA: 0 },
    { id: 'CC-21', nombre: 'Viajes y Alimentación (exento)', cuenta: '6101010003', seccion: 'Gastos Exentos', pctIVA: 0 },
    { id: 'CC-22', nombre: 'Transporte Local (Taxis/Buses con tickete)', cuenta: '6101010003', seccion: 'Gastos Exentos', pctIVA: 0 },
    { id: 'CC-23', nombre: 'Parqueo y Peajes (exento)', cuenta: '6101010003', seccion: 'Gastos Exentos', pctIVA: 0 },
    { id: 'CC-24', nombre: 'Accesorios y equipo menor (exento)', cuenta: '6101045004', seccion: 'Gastos Exentos', pctIVA: 0 },
    { id: 'CC-25', nombre: 'Encomiendas informales', cuenta: '8101020002', seccion: 'No Deducibles', pctIVA: 0 },
    { id: 'CC-26', nombre: 'Donaciones', cuenta: '8101020001', seccion: 'No Deducibles', pctIVA: 0 },
    { id: 'CC-27', nombre: 'Transporte (UBER/Taxis sin tickete)', cuenta: '8101020002', seccion: 'No Deducibles', pctIVA: 0 },
    { id: 'CC-28', nombre: 'Facturas no autorizadas', cuenta: '8101020002', seccion: 'No Deducibles', pctIVA: 0 }
];

const empresasCajaChica = [
    { id: 'usado', nombre: 'Usado' },
    { id: 'nuevo', nombre: 'Nuevo' }
];

function getCategoriasCCOptions(selected) {
    let html = '';
    const secciones = [...new Set(categoriasCajaChica.map(c => c.seccion))];
    secciones.forEach(sec => {
        html += `<optgroup label="${sec}">`;
        categoriasCajaChica.filter(c => c.seccion === sec).forEach(c => {
            html += `<option value="${c.id}" ${c.id===selected?'selected':''}>${c.nombre}</option>`;
        });
        html += `</optgroup>`;
    });
    return html;
}

function renderCajaChica() {
    const area = document.getElementById('contentArea');
    const emp = getEmpleadoActual();
    const ccObj = centrosCosto.find(c => c.id === emp.centroCosto);
    const today = new Date().toISOString().split('T')[0];
    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Nueva Liquidación de Caja Chica</h3></div>
            <form onsubmit="return false;">
                <div class="form-section">
                    <div class="form-section-title">Información del Solicitante</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Solicitante</label><input type="text" value="${emp.nombre}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Departamento</label><input type="text" value="${emp.departamento}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Centro de Costo</label><input type="text" value="${emp.centroCosto}${ccObj?' - '+ccObj.nombre:''}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Supervisor / Autorizado</label><input type="text" value="${emp.supervisor}" readonly style="background:#f3f4f6"></div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title">Información General</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Tipo</label><select>${empresasCajaChica.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Sucursal / Sede</label><select>${sucursales.map(s=>`<option>${s.nombre}</option>`).join('')}<option>Sede Central</option><option>Servicio Express</option><option>Servicio Por Mayor</option><option>Centro Transportes</option><option>Centro Distribución CPD</option></select></div>
                        <div class="form-group"><label>Fecha Solicitud</label><input type="text" value="${today}" readonly style="background:#f3f4f6"></div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title">Detalle de Gastos / Comprobantes</div>
                    <div class="alert alert-info">Seleccione la categoría según sección (IVA 13%, 2%, 1%, Exentos, No Deducibles). El IVA y cuenta contable se asignan automáticamente.</div>
                    <button type="button" class="btn-primary btn-sm mb-8" onclick="addGastoCC()">+ Añadir gasto</button>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>Fecha Factura</th><th>N° Factura</th><th>Proveedor</th><th>Categoría de Gasto</th><th>Monto s/IVA</th><th>IVA</th><th>Total</th><th>Cuenta</th><th>Adjunto</th><th>Acción</th></tr></thead>
                            <tbody id="bodyGastosCC"></tbody>
                            <tfoot><tr><td colspan="4"><strong>TOTAL A REINTEGRAR</strong></td><td id="totalSinIVACC"><strong>₡0</strong></td><td id="totalIVACC"><strong>₡0</strong></td><td id="totalGastosCC"><strong>₡0</strong></td><td colspan="3"></td></tr></tfoot>
                        </table>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section-title">Observaciones</div>
                    <div class="form-group"><textarea placeholder="Observaciones..." rows="3"></textarea></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="alert('Borrador guardado')">Guardar Borrador</button>
                    <button type="button" class="btn-primary" onclick="enviarAprobacion('caja_chica')">Enviar a Aprobación</button>
                </div>
            </form>
        </div>
    `;
}

let gastosCCTemp = [];
function addGastoCC() {
    gastosCCTemp.push({ fecha:'', numFactura:'', proveedor:'', categoriaCC:'CC-07', montoSinIVA:0, iva:0, total:0, adjunto:'' });
    renderGastosCC();
}

function renderGastosCC() {
    const tbody = document.getElementById('bodyGastosCC');
    tbody.innerHTML = gastosCCTemp.map((c, i) => {
        const cat = categoriasCajaChica.find(x => x.id === c.categoriaCC);
        return `<tr>
        <td><input type="date" value="${c.fecha}" onchange="gastosCCTemp[${i}].fecha=this.value" style="width:110px"></td>
        <td><input type="text" value="${c.numFactura}" onchange="gastosCCTemp[${i}].numFactura=this.value" style="width:100px"></td>
        <td><input type="text" value="${c.proveedor}" onchange="gastosCCTemp[${i}].proveedor=this.value" style="width:130px"></td>
        <td><select onchange="gastosCCTemp[${i}].categoriaCC=this.value;calcLineaCC(${i})" style="width:200px">${getCategoriasCCOptions(c.categoriaCC)}</select></td>
        <td><input type="number" value="${c.montoSinIVA}" onchange="gastosCCTemp[${i}].montoSinIVA=parseFloat(this.value)||0;calcLineaCC(${i})" style="width:100px"></td>
        <td><input type="number" value="${c.iva}" readonly style="width:80px;background:#f3f4f6"></td>
        <td><strong>${formatMoney(c.total)}</strong></td>
        <td><code style="font-size:11px">${cat?cat.cuenta:''}</code></td>
        <td><input type="file" onchange="gastosCCTemp[${i}].adjunto=this.files[0]?.name||''" style="width:90px"></td>
        <td><button class="btn-danger btn-xs" onclick="gastosCCTemp.splice(${i},1);renderGastosCC()">✕</button></td>
    </tr>`;
    }).join('');
    calcTotalCC();
}

function calcLineaCC(i) {
    const c = gastosCCTemp[i];
    const cat = categoriasCajaChica.find(x => x.id === c.categoriaCC);
    const pctIVA = cat ? cat.pctIVA : 0;
    c.iva = Math.round(c.montoSinIVA * pctIVA / 100);
    c.total = c.montoSinIVA + c.iva;
    renderGastosCC();
}

function calcTotalCC() {
    const totalSinIVA = gastosCCTemp.reduce((s,c) => s + (c.montoSinIVA||0), 0);
    const totalIVA = gastosCCTemp.reduce((s,c) => s + (c.iva||0), 0);
    const total = gastosCCTemp.reduce((s,c) => s + c.total, 0);
    const el1 = document.getElementById('totalSinIVACC');
    const el2 = document.getElementById('totalIVACC');
    const el3 = document.getElementById('totalGastosCC');
    if(el1) el1.innerHTML = `<strong>${formatMoney(totalSinIVA)}</strong>`;
    if(el2) el2.innerHTML = `<strong>${formatMoney(totalIVA)}</strong>`;
    if(el3) el3.innerHTML = `<strong>${formatMoney(total)}</strong>`;
    const elLiq = document.getElementById('ccLiquidado');
    if(elLiq) elLiq.value = formatMoney(total);
    calcSaldoCC();
}

function calcSaldoCC() {
    const fondo = parseFloat(document.getElementById('ccFondo')?.value) || 0;
    const liquidado = gastosCCTemp.reduce((s,c) => s + c.total, 0);
    const el = document.getElementById('ccSaldo');
    if(el) el.value = formatMoney(fondo - liquidado);
}

function calcDiasCC() {
    const inicio = document.getElementById('ccInicio').value;
    const fin = document.getElementById('ccFin').value;
    document.getElementById('ccDias').value = calcDias(inicio, fin);
}

// ===== TARJETA CORPORATIVA =====
function renderTarjetaCorporativa() {
    const area = document.getElementById('contentArea');
    const emp = getEmpleadoActual();
    const ccObj = centrosCosto.find(c => c.id === emp.centroCosto);
    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Nuevo Reintegro por Tarjeta Corporativa</h3></div>
            <form onsubmit="return false;">
                <div class="form-section">
                    <div class="form-section-title">Información del Solicitante</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Solicitante</label><input type="text" value="${emp.nombre}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Departamento</label><input type="text" value="${emp.departamento}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Centro de Costo</label><input type="text" value="${emp.centroCosto}${ccObj?' - '+ccObj.nombre:''}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Supervisor</label><input type="text" value="${emp.supervisor}" readonly style="background:#f3f4f6"></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Información de la Tarjeta</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Tarjetahabiente</label><input type="text" value="${emp.nombre}" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>N° Tarjeta</label><select id="tcTarjeta"><option value="**** **** **** 4521">**** **** **** 4521</option><option value="**** **** **** 8832">**** **** **** 8832</option></select></div>
                        <div class="form-group"><label>Grupo de Corte</label><select id="tcGrupoCorte" onchange="updateFechaCorte()"><option value="A">Grupo A — Corte día 2 de cada mes</option><option value="B">Grupo B — Corte día 16 de cada mes</option></select></div>
                        <div class="form-group"><label>Fecha de Corte</label><input type="text" id="tcFechaCorte" readonly value="2 de cada mes" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Mes de Corte</label><select><option>Junio 2026</option><option>Mayo 2026</option><option>Abril 2026</option></select></div>
                        <div class="form-group"><label>Fecha Estado de Cuenta</label><input type="date" value="2026-06-06"></div>
                        <div class="form-group"><label>Responsable de Revisión</label><input type="text" value="Erika Mora" readonly style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Moneda del gasto</label><select id="tcMoneda" onchange="renderTransaccionesTC()"><option value="CRC">₡ Colones</option><option value="USD">$ Dólares</option></select></div>
                        <div class="form-group"><label>Monto Estado de Cuenta</label><input type="number" id="tcMontoEC" value="0" onchange="calcDifTC()"></div>
                        <div class="form-group"><label>Monto Total Facturas</label><input type="text" id="tcMontoFact" readonly value="₡0" style="background:#f3f4f6"></div>
                        <div class="form-group"><label>Diferencia</label><input type="text" id="tcDif" readonly value="₡0" style="background:#f3f4f6"></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Adjuntos Generales</div>
                    <div class="form-grid">
                        <div class="form-group"><label>Estado de Cuenta</label><div class="file-upload" onclick="this.querySelector('input').click()"><input type="file" style="display:none" onchange="showFileName(this)">📄 Adjuntar estado de cuenta</div><div class="file-list" id="fileEC"></div></div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">Detalle de Transacciones</div>
                    <button type="button" class="btn-primary btn-sm mb-8" onclick="addTransaccionTC()">+ Añadir transacción</button>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>Fecha Trans.</th><th>Fecha Fact.</th><th>N° Factura</th><th>Comercio</th><th>Tipo Gasto</th><th>Monto</th><th>¿IVA?</th><th>%IVA</th><th>IVA</th><th>¿Serv?</th><th>% Serv.</th><th>Servicio</th><th>Total</th><th>Adjunto</th><th>Acción</th></tr></thead>
                            <tbody id="bodyTransTC"></tbody>
                            <tfoot><tr><td colspan="12"><strong>Total Transacciones</strong></td><td id="totalTransTC"><strong>₡0</strong></td><td colspan="2"></td></tr></tfoot>
                        </table>
                    </div>
                    <div id="alertDifTC" class="mt-16"></div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="alert('Borrador guardado')">Guardar Borrador</button>
                    <button type="button" class="btn-primary" onclick="enviarAprobacion('tarjeta')">Enviar a Responsable de Tarjetas</button>
                </div>
            </form>
        </div>
    `;
}

let transaccionesTCTemp = [];
function addTransaccionTC() {
    transaccionesTCTemp.push({ fechaTrans:'', fechaFactura:'', numFactura:'', comercio:'', tipoGasto:1, monto:0, tieneIVA:true, pctIVA:13, iva:0, tieneServicio:false, pctServicio:10, servicio:0, total:0, adjunto:'' });
    renderTransaccionesTC();
}

function getMonedaTC() {
    const sel = document.getElementById('tcMoneda');
    return sel ? sel.value : 'CRC';
}

function formatMoneyTC(amount) {
    const moneda = getMonedaTC();
    if (moneda === 'USD') return '$' + (amount || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
    return '₡' + (amount || 0).toLocaleString('es-CR');
}

function updateFechaCorte() {
    const grupo = document.getElementById('tcGrupoCorte').value;
    const el = document.getElementById('tcFechaCorte');
    if (el) el.value = grupo === 'A' ? '2 de cada mes' : '16 de cada mes';
}

function renderTransaccionesTC() {
    const tbody = document.getElementById('bodyTransTC');
    const moneda = getMonedaTC();
    const simbolo = moneda === 'USD' ? '$' : '₡';
    tbody.innerHTML = transaccionesTCTemp.map((t, i) => `<tr>
        <td><input type="date" value="${t.fechaTrans}" onchange="transaccionesTCTemp[${i}].fechaTrans=this.value" style="width:105px"></td>
        <td><input type="date" value="${t.fechaFactura}" onchange="transaccionesTCTemp[${i}].fechaFactura=this.value" style="width:105px"></td>
        <td><input type="text" value="${t.numFactura}" onchange="transaccionesTCTemp[${i}].numFactura=this.value" style="width:90px"></td>
        <td><input type="text" value="${t.comercio}" onchange="transaccionesTCTemp[${i}].comercio=this.value" style="width:120px"></td>
        <td><select onchange="transaccionesTCTemp[${i}].tipoGasto=this.value" style="width:120px">${getCategoriaOptions(t.tipoGasto)}</select></td>
        <td><div style="display:flex;align-items:center;gap:2px"><span style="font-size:12px">${simbolo}</span><input type="number" value="${t.monto}" onchange="transaccionesTCTemp[${i}].monto=parseFloat(this.value)||0;calcLineaTC(${i})" style="width:90px"></div></td>
        <td><select onchange="transaccionesTCTemp[${i}].tieneIVA=this.value==='si';calcLineaTC(${i})" style="width:50px"><option value="si" ${t.tieneIVA?'selected':''}>Sí</option><option value="no" ${!t.tieneIVA?'selected':''}>No</option></select></td>
        <td><select onchange="transaccionesTCTemp[${i}].pctIVA=parseInt(this.value);calcLineaTC(${i})" style="width:60px" ${!t.tieneIVA?'disabled':''}>${getIVAOptions(t.pctIVA)}</select></td>
        <td>${formatMoneyTC(t.iva)}</td>
        <td><select onchange="transaccionesTCTemp[${i}].tieneServicio=this.value==='si';calcLineaTC(${i})" style="width:50px"><option value="no" ${!t.tieneServicio?'selected':''}>No</option><option value="si" ${t.tieneServicio?'selected':''}>Sí</option></select></td>
        <td><input type="number" value="${t.pctServicio}" onchange="transaccionesTCTemp[${i}].pctServicio=parseFloat(this.value);calcLineaTC(${i})" style="width:50px;${!t.tieneServicio?'background:#e5e7eb;':''}" ${!t.tieneServicio?'disabled':''}></td>
        <td><input type="number" value="${t.servicio}" readonly style="width:70px;background:#f3f4f6"></td>
        <td><strong>${formatMoneyTC(t.total)}</strong></td>
        <td><input type="file" onchange="transaccionesTCTemp[${i}].adjunto=this.files[0]?.name||''" style="width:80px"></td>
        <td><button class="btn-danger btn-xs" onclick="transaccionesTCTemp.splice(${i},1);renderTransaccionesTC()">✕</button></td>
    </tr>`).join('');
    calcTotalTC();
}

function calcLineaTC(i) {
    const t = transaccionesTCTemp[i];
    const base = t.monto;
    t.iva = t.tieneIVA ? Math.round(base * t.pctIVA / 100 / (1 + t.pctIVA/100)) : 0;
    t.servicio = t.tieneServicio ? Math.round((base - t.iva) * (t.pctServicio || 10) / 100) : 0;
    t.total = base + t.servicio;
    renderTransaccionesTC();
}

function calcTotalTC() {
    const total = transaccionesTCTemp.reduce((s,t) => s + t.total, 0);
    document.getElementById('totalTransTC').innerHTML = `<strong>${formatMoneyTC(total)}</strong>`;
    document.getElementById('tcMontoFact').value = formatMoneyTC(total);
    calcDifTC();
}

function calcDifTC() {
    const ec = parseFloat(document.getElementById('tcMontoEC').value) || 0;
    const fact = transaccionesTCTemp.reduce((s,t) => s + t.total, 0);
    const dif = ec - fact;
    document.getElementById('tcDif').value = formatMoneyTC(dif);
    const alertDiv = document.getElementById('alertDifTC');
    if (alertDiv) {
        if (dif !== 0) {
            alertDiv.innerHTML = `<div class="alert alert-warning">⚠️ Diferencia entre estado de cuenta y facturas: ${formatMoneyTC(dif)}</div>`;
        } else {
            alertDiv.innerHTML = `<div class="alert alert-success">✓ Estado de cuenta cuadra con facturas</div>`;
        }
    }
}

function showFileName(input) {
    if (input.files.length) {
        const parent = input.closest('.form-group');
        const list = parent.querySelector('.file-list');
        if (list) list.innerHTML = `<div class="file-item">📎 ${input.files[0].name} <span class="file-remove" onclick="this.parentElement.remove()">✕</span></div>`;
    }
}

// ===== BANDEJA APROBACIONES SUPERVISOR =====
function renderBandejaAprobaciones() {
    const area = document.getElementById('contentArea');
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente');

    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Solicitudes Pendientes de Aprobación</h3></div>
            <div class="filters-bar">
                <div class="filter-group"><label>Usuario</label><input type="text" placeholder="Buscar..."></div>
                <div class="filter-group"><label>Tipo</label><select><option value="">Todos</option><option>Viáticos</option><option>Reintegro</option><option>Caja Chica</option><option>Tarjeta</option></select></div>
                <div class="filter-group"><label>Desde</label><input type="date"></div>
                <div class="filter-group"><label>Hasta</label><input type="date"></div>
                <div class="filter-group"><label>Monto mín.</label><input type="number" placeholder="0"></div>
                <div class="filter-group"><label>Monto máx.</label><input type="number" placeholder="999999"></div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Solicitud</th><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Días</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead>
                    <tbody>
                        ${pendientes.map(s => `<tr>
                            <td><strong>${s.id}</strong></td>
                            <td>${s.tipoLabel}</td>
                            <td>${s.solicitante}</td>
                            <td>${s.fechaSolicitud}</td>
                            <td>${s.fechaInicio}</td>
                            <td>${s.fechaFin}</td>
                            <td>${s.dias}</td>
                            <td class="text-right">${formatMoney(s.montoSolicitado)}</td>
                            <td>${getBadge(s.estado)}</td>
                            <td><button class="btn-primary btn-sm" onclick="openApprovalModal('${s.id}')">Ver detalle</button></td>
                        </tr>`).join('')}
                        ${pendientes.length === 0 ? '<tr><td colspan="10" class="text-center text-muted">No hay solicitudes pendientes</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openApprovalModal(id) {
    const s = solicitudes.find(x => x.id === id);
    if (!s) return;
    const modal = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = `Detalle - ${s.id}`;

    let gastosHtml = '';
    if (s.gastos) {
        gastosHtml = `<table class="mt-8"><thead><tr><th>Categoría</th><th>Monto</th><th>Observación</th></tr></thead><tbody>
            ${s.gastos.map(g=>`<tr><td>${getCategoriaNombre(g.categoria)}</td><td class="text-right">${formatMoney(g.monto)}</td><td>${g.observacion||''}</td></tr>`).join('')}
        </tbody></table>`;
    }

    document.getElementById('modalBody').innerHTML = `
        <div class="form-grid">
            <div class="form-group"><label>Solicitante</label><p>${s.solicitante}</p></div>
            <div class="form-group"><label>Departamento</label><p>${s.departamento}</p></div>
            <div class="form-group"><label>Centro de Costo</label><p>${s.centroCosto}</p></div>
            <div class="form-group"><label>Supervisor</label><p>${s.supervisor}</p></div>
            <div class="form-group"><label>Fechas</label><p>${s.fechaInicio} a ${s.fechaFin} (${s.dias} días)</p></div>
            <div class="form-group"><label>Monto Solicitado</label><p><strong>${formatMoney(s.montoSolicitado)}</strong></p></div>
            ${s.destino ? `<div class="form-group"><label>Destino</label><p>${s.destino}</p></div>` : ''}
            ${s.motivo ? `<div class="form-group"><label>Motivo</label><p>${s.motivo}</p></div>` : ''}
        </div>
        ${gastosHtml ? `<div class="form-section mt-16"><div class="form-section-title">Detalle de Gastos</div>${gastosHtml}</div>` : ''}
        <div class="form-section mt-16">
            <div class="form-section-title">Flujo de Aprobación</div>
            <div class="flow-timeline">
                ${s.historial.map(h => `<div class="flow-step">
                    <div class="flow-dot active">✓</div>
                    <div class="flow-info">
                        <div class="flow-action">${h.accion}</div>
                        <div class="flow-meta">${h.fecha} - ${h.usuario} (${h.rol}) ${h.comentario ? '- ' + h.comentario : ''}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
        <div class="form-section mt-16">
            <div class="form-section-title">Comentario</div>
            <div class="form-group"><textarea id="approvalComment" placeholder="Comentario (obligatorio para rechazo)..." rows="3"></textarea></div>
        </div>
    `;

    document.getElementById('modalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
        <button class="btn-danger" onclick="rechazarSolicitud('${s.id}')">Rechazar</button>
        <button class="btn-success" onclick="aprobarSolicitud('${s.id}')">Aprobar</button>
    `;
    modal.style.display = 'flex';
}

// ===== BANDEJA TARJETAS CORPORATIVAS =====
function renderBandejaTarjetas() {
    const area = document.getElementById('contentArea');
    const tarjetas = solicitudes.filter(s => s.tipo === 'tarjeta_corporativa');

    area.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Solicitudes de Tarjeta Corporativa para Revisión</h3></div>
            <div class="filters-bar">
                <div class="filter-group"><label>Tarjetahabiente</label><input type="text" placeholder="Buscar..."></div>
                <div class="filter-group"><label>Mes de Corte</label><select><option value="">Todos</option><option>Mayo 2026</option><option>Junio 2026</option></select></div>
                <div class="filter-group"><label>Estado</label><select><option value="">Todos</option><option value="pendiente">Pendiente</option><option value="aprobada">Aprobada</option><option value="rechazada">Rechazada</option></select></div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>N°</th><th>Tarjetahabiente</th><th>Tarjeta</th><th>Mes Corte</th><th>Monto EC</th><th>Monto Facturas</th><th>Diferencia</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${tarjetas.map(s => `<tr>
                            <td>${s.id}</td>
                            <td>${s.tarjetahabiente}</td>
                            <td>${s.numTarjeta}</td>
                            <td>${s.mesCorte}</td>
                            <td class="text-right">${formatMoney(s.montoEstadoCuenta)}</td>
                            <td class="text-right">${formatMoney(s.montoTotalFacturas)}</td>
                            <td class="text-right ${s.diferencia>0?'text-danger':''}">${formatMoney(s.diferencia)}</td>
                            <td>${getBadge(s.estado)}</td>
                            <td>
                                <button class="btn-primary btn-xs" onclick="openTarjetaRevisionModal('${s.id}')">Ver</button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openTarjetaRevisionModal(id) {
    const s = solicitudes.find(x => x.id === id);
    if (!s) return;
    const modal = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = `Revisión Tarjeta - ${s.id}`;

    let transHtml = '';
    if (s.transacciones) {
        transHtml = `<table class="mt-8"><thead><tr><th>Fecha</th><th>Comercio</th><th>Tipo Gasto</th><th>Monto</th><th>IVA</th><th>Total</th><th>Estado</th><th>Adjunto</th></tr></thead><tbody>
            ${s.transacciones.map(t => `<tr>
                <td>${t.fechaTrans}</td><td>${t.comercio}</td><td>${getCategoriaNombre(t.tipoGasto)}</td>
                <td class="text-right">${formatMoney(t.montoColones)}</td>
                <td class="text-right">${formatMoney(t.iva)}</td>
                <td class="text-right"><strong>${formatMoney(t.total)}</strong></td>
                <td>${t.estado}</td>
                <td>${t.adjunto ? '📎 ' + t.adjunto : '-'}</td>
            </tr>`).join('')}
        </tbody></table>`;
    }

    document.getElementById('modalBody').innerHTML = `
        <div class="form-grid">
            <div class="form-group"><label>Tarjetahabiente</label><p>${s.tarjetahabiente}</p></div>
            <div class="form-group"><label>Tarjeta</label><p>${s.numTarjeta}</p></div>
            <div class="form-group"><label>Departamento</label><p>${s.departamento}</p></div>
            <div class="form-group"><label>Centro de Costo</label><p>${s.centroCosto}</p></div>
            <div class="form-group"><label>Mes de Corte</label><p>${s.mesCorte}</p></div>
            <div class="form-group"><label>Monto Estado de Cuenta</label><p><strong>${formatMoney(s.montoEstadoCuenta)}</strong></p></div>
            <div class="form-group"><label>Monto Total Facturas</label><p><strong>${formatMoney(s.montoTotalFacturas)}</strong></p></div>
            <div class="form-group"><label>Diferencia</label><p class="${s.diferencia>0?'text-danger':''}">${formatMoney(s.diferencia)}</p></div>
            <div class="form-group"><label>Estado</label><p>${getBadge(s.estado)}</p></div>
        </div>
        ${transHtml ? `<div class="form-section mt-16"><div class="form-section-title">Detalle de Transacciones</div><div class="table-container">${transHtml}</div></div>` : ''}
        <div class="form-section mt-16">
            <div class="form-section-title">Flujo de Aprobación</div>
            <div class="flow-timeline">
                ${s.historial.map(h => `<div class="flow-step">
                    <div class="flow-dot ${h.accion.includes('Rechazada')?'error':'active'}">${h.accion.includes('Rechazada')?'✕':'✓'}</div>
                    <div class="flow-info"><div class="flow-action">${h.accion}</div><div class="flow-meta">${h.fecha} — ${h.usuario} (${h.rol}) ${h.comentario?'<br>💬 '+h.comentario:''}</div></div>
                </div>`).join('')}
            </div>
        </div>
        ${s.estado !== 'revision_contabilidad' && s.estado !== 'aprobada' ? `<div class="form-section mt-16">
            <div class="form-section-title">Observación</div>
            <div class="form-group"><textarea id="tarjetaObservacion" placeholder="Observación (obligatoria para aprobar o rechazar)..." rows="3"></textarea></div>
        </div>` : ''}
    `;

    document.getElementById('modalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
        ${s.estado !== 'revision_contabilidad' && s.estado !== 'aprobada' ? `<button class="btn-danger" onclick="rechazarTarjeta('${s.id}')">Rechazar</button>
        <button class="btn-success" onclick="aprobarTarjeta('${s.id}')">Aprobar y Enviar a Contabilidad</button>` : ''}
    `;
    modal.style.display = 'flex';
}

function aprobarTarjeta(id) {
    const obs = document.getElementById('tarjetaObservacion')?.value || '';
    if (!obs) { alert('La observación es obligatoria para aprobar'); return; }
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        s.estado = 'revision_contabilidad';
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Resp. Tarjetas', accion: 'Aprobada por responsable de tarjetas', comentario: obs });
        alert('✅ Solicitud aprobada y enviada a contabilidad');
        closeModal();
        renderBandejaTarjetas();
    }
}

function rechazarTarjeta(id) {
    const obs = document.getElementById('tarjetaObservacion')?.value || '';
    if (!obs) { alert('La observación es obligatoria para rechazar'); return; }
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        s.estado = 'rechazada';
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Resp. Tarjetas', accion: 'Rechazada', comentario: obs });
        alert('Solicitud rechazada');
        closeModal();
        renderBandejaTarjetas();
    }
}

// ===== REVISIÓN CONTABILIDAD =====
function renderRevisionContabilidad() {
    const area = document.getElementById('contentArea');
    const paraRevision = solicitudes.filter(s => s.estado === 'revision_contabilidad' || s.estado === 'aceptacion_parcial' || s.estado === 'aprobada_contabilidad' || s.estado === 'aplicada_sap' || s.estado === 'aplicada_sap_parcial' || s.estado === 'rechazada_contabilidad' || s.estado === 'error_sap');

    area.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Solicitudes para Revisión Contable</h3>
                <div style="display:flex;align-items:center;gap:8px;padding:6px 12px;background:#d1fae5;border-radius:20px;font-size:12px;color:#065f46;font-weight:500">
                    <div style="width:10px;height:10px;border-radius:50%;background:#10b981;animation:pulse 2s infinite"></div>
                    Conectado a SAP
                </div>
            </div>
            <div class="filters-bar">
                <div class="filter-group"><label>Tipo</label><select><option value="">Todos</option><option>Reintegro Viáticos</option><option>Caja Chica</option><option>Tarjeta Corporativa</option></select></div>
                <div class="filter-group"><label>Estado</label><select><option value="">Todos</option><option value="revision_contabilidad">En revisión contabilidad</option><option value="aplicada_sap">Aceptada / Aplicada en SAP (Total)</option><option value="aplicada_sap_parcial">Aceptada Parcial / Aplicada en SAP</option><option value="rechazada_contabilidad">Rechazada</option><option value="error_sap">Error SAP</option></select></div>
                <div class="filter-group"><label>Desde</label><input type="date"></div>
                <div class="filter-group"><label>Hasta</label><input type="date"></div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>N°</th><th>Tipo</th><th>Solicitante</th><th>Centro Costo</th><th>Monto</th><th>Estado</th><th>Ref. SAP</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${paraRevision.map(s => `<tr>
                            <td><strong>${s.id}</strong></td>
                            <td>${s.tipoLabel}</td>
                            <td>${s.solicitante}</td>
                            <td>${s.centroCosto}</td>
                            <td class="text-right">${formatMoney(s.montoSolicitado)}</td>
                            <td>${getBadge(s.estado)}</td>
                            <td>${s.refSAP ? '<code>'+s.refSAP+'</code>' : '-'}</td>
                            <td>
                                <button class="btn-primary btn-xs" onclick="openContabilidadFullScreen('${s.id}')">Revisar</button>
                                ${s.estado === 'error_sap' ? `<button class="btn-warning btn-xs" onclick="reprocesarSAP('${s.id}')">Reprocesar</button>` : ''}
                            </td>
                        </tr>`).join('')}
                        ${paraRevision.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No hay solicitudes para revisión</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generarAsientoContable(s) {
    const lineas = s.comprobantes || s.transacciones || [];
    let asiento = [];
    if (s.comprobantes) {
        s.comprobantes.forEach(c => {
            const cat = categoriasGasto.find(x => x.id === c.tipoGasto);
            if (c.estado !== 'rechazada') {
                asiento.push({ cuenta: cat ? cat.cuenta : '6199-099', descripcion: cat ? cat.nombre : 'Otros', debe: c.montoSinIVA + (c.servicio||0), haber: 0, cc: s.centroCosto });
                if (c.iva > 0) asiento.push({ cuenta: '1135003004', descripcion: 'IVA Crédito Fiscal', debe: c.iva, haber: 0, cc: s.centroCosto });
            }
        });
        const totalHaber = asiento.reduce((sum, l) => sum + l.debe, 0);
        asiento.push({ cuenta: '1101001001', descripcion: 'Cuentas por pagar / Banco', debe: 0, haber: totalHaber, cc: s.centroCosto });
    } else if (s.transacciones) {
        s.transacciones.forEach(t => {
            const cat = categoriasGasto.find(x => x.id === t.tipoGasto);
            if (t.estado !== 'Rechazada') {
                const base = (t.montoColones || t.total || 0) - (t.iva || 0);
                asiento.push({ cuenta: cat ? cat.cuenta : '6199-099', descripcion: cat ? cat.nombre : t.comercio, debe: base + (t.servicio||0), haber: 0, cc: s.centroCosto });
                if (t.iva > 0) asiento.push({ cuenta: '1135003004', descripcion: 'IVA Crédito Fiscal', debe: t.iva, haber: 0, cc: s.centroCosto });
            }
        });
        const totalHaber = asiento.reduce((sum, l) => sum + l.debe, 0);
        asiento.push({ cuenta: '2101001001', descripcion: 'Tarjeta Corporativa por pagar', debe: 0, haber: totalHaber, cc: s.centroCosto });
    }
    return asiento;
}

function openContabilidadFullScreen(id) {
    openContabilidadModal(id);
    document.getElementById('modalContent').classList.add('modal-fullscreen');
}

function openContabilidadModal(id) {
    const s = solicitudes.find(x => x.id === id);
    if (!s) return;
    const modal = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = `Revisión Contable - ${s.id}`;

    let lineasHtml = '';
    if (s.comprobantes) {
        lineasHtml = `<table class="mt-8"><thead><tr><th>Fecha</th><th>Factura</th><th>Proveedor</th><th>Tipo</th><th>Monto s/IVA</th><th>IVA</th><th>Serv.</th><th>Total</th><th>Cuenta</th><th>Adjunto</th><th>Estado</th><th>Validar</th></tr></thead><tbody>
            ${s.comprobantes.map((c,i)=>{
                const cat = categoriasGasto.find(x=>x.id===c.tipoGasto);
                return `<tr>
                    <td>${c.fecha}</td><td>${c.numFactura}</td><td>${c.proveedor}</td>
                    <td>${cat?cat.nombre:''}</td>
                    <td class="text-right">${formatMoney(c.montoSinIVA)}</td>
                    <td class="text-right">${formatMoney(c.iva)}</td>
                    <td class="text-right">${formatMoney(c.servicio)}</td>
                    <td class="text-right"><strong>${formatMoney(c.total)}</strong></td>
                    <td><code>${cat?cat.cuenta:''}</code></td>
                    <td>${c.adjunto ? `<button class="btn-secondary btn-xs" onclick="alert('Descargando: ${c.adjunto}')">📎 ${c.adjunto}</button>` : '<span class="text-muted">-</span>'}</td>
                    <td>${c.estado==='aceptada'?'<span class="badge badge-aprobada">Aceptada</span>':c.estado==='rechazada'?'<span class="badge badge-rechazada">Rechazada</span>':'<span class="badge badge-pendiente">Pendiente</span>'}</td>
                    <td><div class="line-status">
                        <button class="line-btn accept ${c.estado==='aceptada'?'accepted':''}" onclick="aceptarLinea('${id}',${i})">✓</button>
                        <button class="line-btn reject ${c.estado==='rechazada'?'rejected':''}" onclick="rechazarLinea('${id}',${i})">✕</button>
                    </div></td>
                </tr>`;
            }).join('')}
        </tbody></table>`;
    } else if (s.transacciones) {
        lineasHtml = `<table class="mt-8"><thead><tr><th>Fecha</th><th>Comercio</th><th>Tipo</th><th>Monto</th><th>IVA</th><th>Total</th><th>Cuenta</th><th>Adjunto</th><th>Estado</th><th>Validar</th></tr></thead><tbody>
            ${s.transacciones.map((t,i)=>{
                const cat = categoriasGasto.find(x=>x.id===t.tipoGasto);
                return `<tr>
                <td>${t.fechaTrans}</td><td>${t.comercio}</td>
                <td>${cat?cat.nombre:''}</td>
                <td class="text-right">${formatMoney(t.montoColones||t.total)}</td>
                <td class="text-right">${formatMoney(t.iva)}</td>
                <td class="text-right"><strong>${formatMoney(t.total)}</strong></td>
                <td><code>${cat?cat.cuenta:''}</code></td>
                <td>${t.adjunto ? `<button class="btn-secondary btn-xs" onclick="alert('Descargando: ${t.adjunto}')">📎 ${t.adjunto}</button>` : '<span class="text-muted">-</span>'}</td>
                <td>${t.estado==='Aprobada'?'<span class="badge badge-aprobada">OK</span>':'<span class="badge badge-pendiente">'+t.estado+'</span>'}</td>
                <td><div class="line-status">
                    <button class="line-btn accept" onclick="aceptarLineaTC('${id}',${i})">✓</button>
                    <button class="line-btn reject" onclick="rechazarLineaTC('${id}',${i})">✕</button>
                </div></td>
            </tr>`;}).join('')}
        </tbody></table>`;
    }

    // Generar previsualización de asiento contable
    const asiento = generarAsientoContable(s);
    const totalDebe = asiento.reduce((sum,l) => sum + l.debe, 0);
    const totalHaber = asiento.reduce((sum,l) => sum + l.haber, 0);
    const asientoHtml = `<table class="mt-8" style="font-size:12px">
        <thead><tr><th>Cuenta</th><th>Descripción</th><th>Centro Costo</th><th class="text-right">Debe</th><th class="text-right">Haber</th></tr></thead>
        <tbody>
            ${asiento.map(l => `<tr>
                <td><code>${l.cuenta}</code></td><td>${l.descripcion}</td><td>${l.cc}</td>
                <td class="text-right">${l.debe ? formatMoney(l.debe) : ''}</td>
                <td class="text-right">${l.haber ? formatMoney(l.haber) : ''}</td>
            </tr>`).join('')}
        </tbody>
        <tfoot><tr><td colspan="3"><strong>Totales</strong></td><td class="text-right"><strong>${formatMoney(totalDebe)}</strong></td><td class="text-right"><strong>${formatMoney(totalHaber)}</strong></td></tr></tfoot>
    </table>
    <div class="${totalDebe===totalHaber?'alert alert-success':'alert alert-danger'} mt-8">${totalDebe===totalHaber?'✓ Asiento cuadrado':'⚠️ Asiento descuadrado - revisar líneas'}</div>`;

    document.getElementById('modalBody').innerHTML = `
        <div class="form-grid">
            <div class="form-group"><label>Solicitante</label><p>${s.solicitante}</p></div>
            <div class="form-group"><label>Tipo</label><p>${s.tipoLabel}</p></div>
            <div class="form-group"><label>Departamento</label><p>${s.departamento}</p></div>
            <div class="form-group"><label>Centro de Costo</label><p>${s.centroCosto}</p></div>
            <div class="form-group"><label>Monto Solicitado</label><p><strong>${formatMoney(s.montoSolicitado)}</strong></p></div>
            <div class="form-group"><label>Estado Actual</label><p>${getBadge(s.estado)}</p></div>
            ${s.refSAP ? `<div class="form-group"><label>Referencia SAP</label><p><code>${s.refSAP}</code></p></div>` : ''}
        </div>
        ${s.errorSAP ? `<div class="alert alert-danger mt-16">⚠️ Error SAP: ${s.errorSAP}</div>` : ''}
        <div class="form-section mt-16"><div class="form-section-title">Detalle de Líneas</div>${lineasHtml}</div>
        <div class="form-section mt-16"><div class="form-section-title">Previsualización Asiento Contable (SAP)</div>${asientoHtml}</div>
        <div class="form-section mt-16">
            <div class="form-section-title">Flujo de Aprobación</div>
            <div class="flow-timeline">
                ${s.historial.map(h => `<div class="flow-step">
                    <div class="flow-dot ${h.accion.includes('Error')||h.accion.includes('Rechazada')?'error':'active'}">${h.accion.includes('Error')||h.accion.includes('Rechazada')?'✕':'✓'}</div>
                    <div class="flow-info"><div class="flow-action">${h.accion}</div><div class="flow-meta">${h.fecha} - ${h.usuario} (${h.rol}) ${h.comentario?'- '+h.comentario:''}</div></div>
                </div>`).join('')}
            </div>
        </div>
        ${(s.estado === 'revision_contabilidad' || s.estado === 'error_sap') ? `<div class="form-section mt-16">
            <div class="form-section-title">Observaciones de Contabilidad</div>
            <div class="form-group"><textarea id="contabComment" placeholder="Observación (obligatoria en aceptación parcial o rechazo)..." rows="3"></textarea></div>
        </div>` : ''}
    `;

    const esEditable = s.estado === 'revision_contabilidad' || s.estado === 'error_sap';

    document.getElementById('modalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
        ${esEditable ? `<button class="btn-danger" onclick="rechazarContabilidad('${s.id}')">Rechazar Total</button>
        <button class="btn-warning" onclick="aceptarParcial('${s.id}')">Aplicada en SAP (Parcial)</button>
        <button class="btn-success" onclick="aceptarTotal('${s.id}')">Aceptar Total</button>` : ''}
        ${s.estado === 'error_sap' ? `<button class="btn-info" onclick="reprocesarSAP('${s.id}')">Reprocesar SAP</button>` : ''}
    `;
    modal.style.display = 'flex';
}

function aceptarLinea(solId, idx) {
    const s = solicitudes.find(x => x.id === solId);
    if (s && s.comprobantes) { s.comprobantes[idx].estado = 'aceptada'; openContabilidadModal(solId); }
}
function rechazarLinea(solId, idx) {
    const obs = prompt('Observación para rechazar línea:');
    const s = solicitudes.find(x => x.id === solId);
    if (s && s.comprobantes) { s.comprobantes[idx].estado = 'rechazada'; s.comprobantes[idx].observacion = obs; openContabilidadModal(solId); }
}
function aceptarLineaTC(solId, idx) {
    const s = solicitudes.find(x => x.id === solId);
    if (s && s.transacciones) { s.transacciones[idx].estado = 'Aprobada'; openContabilidadModal(solId); }
}
function rechazarLineaTC(solId, idx) {
    const s = solicitudes.find(x => x.id === solId);
    if (s && s.transacciones) { s.transacciones[idx].estado = 'Rechazada'; openContabilidadModal(solId); }
}

function aceptarTotal(id) {
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        const refSAP = 'SAP-DOC-2026-' + String(Math.floor(Math.random()*9000)+1000).padStart(4,'0');
        s.estado = 'aplicada_sap';
        s.montoAprobado = s.montoSolicitado;
        s.refSAP = refSAP;
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Aceptación total', comentario: '' });
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Aplicada en SAP', comentario: `Referencia: ${refSAP}` });
        alert(`✅ Solicitud aceptada y aplicada en SAP\nReferencia: ${refSAP}`);
        closeModal();
        renderRevisionContabilidad();
    }
}

function rechazarContabilidad(id) {
    const comment = document.getElementById('contabComment').value;
    if (!comment) { alert('La observación es obligatoria para rechazar'); return; }
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        s.estado = 'rechazada_contabilidad';
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Rechazada por contabilidad', comentario: comment });
        alert('Solicitud rechazada por contabilidad');
        closeModal();
        renderRevisionContabilidad();
    }
}

function aceptarParcial(id) {
    const comment = document.getElementById('contabComment').value;
    if (!comment) { alert('La observación es obligatoria para aceptación parcial'); return; }
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        const refSAP = 'SAP-DOC-2026-' + String(Math.floor(Math.random()*9000)+1000).padStart(4,'0');
        s.estado = 'aplicada_sap_parcial';
        s.refSAP = refSAP;
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Aplicada en SAP (Parcial)', comentario: comment });
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Referencia SAP generada', comentario: `Referencia: ${refSAP}` });
        alert(`✅ Aplicada en SAP (Parcial)\nReferencia: ${refSAP}`);
        closeModal();
        renderRevisionContabilidad();
    }
}

function reprocesarSAP(id) {
    const s = solicitudes.find(x => x.id === id);
    if (!s) return;
    const refSAP = 'SAP-DOC-2026-' + String(Math.floor(Math.random()*9000)+1000).padStart(4,'0');
    s.estado = 'aplicada_sap';
    s.refSAP = refSAP;
    s.errorSAP = null;
    s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Contabilidad', accion: 'Reprocesada y aplicada en SAP', comentario: `Referencia: ${refSAP}` });
    alert(`✅ Reprocesamiento exitoso. Aplicada en SAP\nReferencia: ${refSAP}`);
    closeModal();
    renderRevisionContabilidad();
}

// ===== ADMINISTRADOR =====
function renderAdministrador() {
    const area = document.getElementById('contentArea');
    area.innerHTML = `
        <div class="card">
            <div class="tabs">
                <button class="tab-btn active" onclick="showAdminTab('usuarios')">Usuarios</button>
                <button class="tab-btn" onclick="showAdminTab('empleados')">Catálogo Empleados</button>
                <button class="tab-btn" onclick="showAdminTab('roles')">Roles y Permisos</button>
                <button class="tab-btn" onclick="showAdminTab('centros')">Centros de Costo</button>
                <button class="tab-btn" onclick="showAdminTab('categorias')">Categorías y Cuentas</button>
                <button class="tab-btn" onclick="showAdminTab('aprobadores')">Aprobadores</button>
                <button class="tab-btn" onclick="showAdminTab('tarjetahabientes')">Tarjetahabientes</button>
                <button class="tab-btn" onclick="showAdminTab('parametros')">Parámetros</button>
            </div>

            <div class="tab-content active" id="tab-usuarios">
                <div class="card-header"><h3>Gestión de Usuarios</h3><button class="btn-primary btn-sm">+ Nuevo Usuario</button></div>
                <div class="table-container">
                    <table>
                        <thead><tr><th>Usuario</th><th>Email</th><th>Departamento</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            <tr><td>Juan Rodríguez</td><td>jrodriguez@laguaca.com</td><td>Ventas</td><td><span class="badge badge-revision">Solicitante</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>María López</td><td>mlopez@laguaca.com</td><td>Administración</td><td><span class="badge badge-pendiente">Supervisor</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Patricia Vargas</td><td>pvargas@laguaca.com</td><td>Finanzas</td><td><span class="badge badge-sap">Contabilidad</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Erika Mora</td><td>emora@laguaca.com</td><td>Compras</td><td><span class="badge badge-parcial">Resp. Tarjetas</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Carlos Méndez</td><td>cmendez@laguaca.com</td><td>Operaciones</td><td><span class="badge badge-revision">Solicitante</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Roberto Chen</td><td>rchen@laguaca.com</td><td>Tecnología</td><td><span class="badge badge-pendiente">Supervisor</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Andrea Solano</td><td>asolano@laguaca.com</td><td>Administración</td><td><span class="badge badge-revision">Solicitante</span></td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-warning btn-xs">Inactivar</button></td></tr>
                            <tr><td>Fernando Araya</td><td>faraya@laguaca.com</td><td>Operaciones</td><td><span class="badge badge-revision">Solicitante</span></td><td><span class="badge badge-rechazada">Inactivo</span></td><td><button class="btn-secondary btn-xs">Editar</button> <button class="btn-success btn-xs">Activar</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="tab-empleados">
                <div class="card-header"><h3>Catálogo de Empleados</h3><button class="btn-primary btn-sm" onclick="alert('Formulario nuevo empleado')">+ Nuevo Empleado</button></div>
                <p class="text-muted mb-16">Este catálogo define la relación entre cada empleado, su departamento, centro de costo y supervisor. Se usa para autocompletar los formularios de solicitud.</p>
                <div class="table-container">
                    <table>
                        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Departamento</th><th>Centro de Costo</th><th>Supervisor</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            ${empleados.map(e=>`<tr>
                                <td>${e.id}</td>
                                <td>${e.nombre}</td>
                                <td>${e.email}</td>
                                <td>${e.departamento}</td>
                                <td>${e.centroCosto}</td>
                                <td>${e.supervisor}</td>
                                <td>${e.activo?'<span class="badge badge-aprobada">Activo</span>':'<span class="badge badge-rechazada">Inactivo</span>'}</td>
                                <td><button class="btn-secondary btn-xs">Editar</button> ${e.activo?'<button class="btn-warning btn-xs">Inactivar</button>':'<button class="btn-success btn-xs">Activar</button>'}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="tab-roles">
                <div class="card-header"><h3>Roles y Permisos</h3></div>
                <div class="table-container">
                    <table>
                        <thead><tr><th>Rol</th><th>Crear Solicitudes</th><th>Aprobar</th><th>Rev. Contable</th><th>Administrar</th><th>Ver Indicadores</th></tr></thead>
                        <tbody>
                            <tr><td>Solicitante</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td><td>❌</td></tr>
                            <tr><td>Supervisor</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>✅</td></tr>
                            <tr><td>Contabilidad</td><td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>✅</td></tr>
                            <tr><td>Resp. Tarjetas</td><td>❌</td><td>✅ (Tarjetas)</td><td>❌</td><td>❌</td><td>✅</td></tr>
                            <tr><td>Administrador</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="tab-centros">
                <div class="card-header"><h3>Centros de Costo y Sucursales</h3><button class="btn-primary btn-sm">+ Nuevo Centro</button></div>
                <div class="grid-2">
                    <div>
                        <h4 class="mb-8">Centros de Costo</h4>
                        <table><thead><tr><th>Código</th><th>Nombre</th><th>Estado</th></tr></thead><tbody>
                            ${centrosCosto.map(c=>`<tr><td>${c.id}</td><td>${c.nombre}</td><td><span class="badge badge-aprobada">Activo</span></td></tr>`).join('')}
                        </tbody></table>
                    </div>
                    <div>
                        <h4 class="mb-8">Sucursales</h4>
                        <table><thead><tr><th>ID</th><th>Nombre</th><th>Estado</th></tr></thead><tbody>
                            ${sucursales.map(s=>`<tr><td>${s.id}</td><td>${s.nombre}</td><td><span class="badge badge-aprobada">Activo</span></td></tr>`).join('')}
                        </tbody></table>
                    </div>
                </div>
            </div>

            <div class="tab-content" id="tab-categorias">
                <div class="card-header"><h3>Categorías de Gasto y Cuentas Contables SAP</h3><button class="btn-primary btn-sm">+ Nueva Categoría</button></div>
                <div class="table-container">
                    <table>
                        <thead><tr><th>ID</th><th>Categoría</th><th>Cuenta Contable SAP</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            ${categoriasGasto.map(c=>`<tr><td>${c.id}</td><td>${c.nombre}</td><td><code>${c.cuenta}</code></td><td><span class="badge badge-aprobada">Activa</span></td><td><button class="btn-secondary btn-xs">Editar</button></td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="tab-aprobadores">
                <div class="card-header"><h3>Aprobadores por Área y Reglas por Monto</h3></div>
                <div class="grid-2">
                    <div>
                        <h4 class="mb-8">Aprobadores por Área</h4>
                        <table><thead><tr><th>Departamento</th><th>Aprobador</th><th>Tipo</th></tr></thead><tbody>
                            <tr><td>Ventas</td><td>María López</td><td>Viáticos, Reintegros, Caja Chica</td></tr>
                            <tr><td>Operaciones</td><td>Ana Jiménez</td><td>Viáticos, Reintegros, Caja Chica</td></tr>
                            <tr><td>Tecnología</td><td>Roberto Chen</td><td>Viáticos, Reintegros, Caja Chica</td></tr>
                            <tr><td>Todas (Tarjetas)</td><td>Erika Mora</td><td>Tarjeta Corporativa</td></tr>
                        </tbody></table>
                    </div>
                    <div>
                        <h4 class="mb-8">Reglas de Aprobación por Monto</h4>
                        <table><thead><tr><th>Rango</th><th>Aprobador Requerido</th></tr></thead><tbody>
                            <tr><td>₡0 - ₡500,000</td><td>Supervisor directo</td></tr>
                            <tr><td>₡500,001 - ₡1,500,000</td><td>Gerente de área</td></tr>
                            <tr><td>₡1,500,001 - ₡5,000,000</td><td>Director financiero</td></tr>
                            <tr><td>> ₡5,000,000</td><td>Gerencia general</td></tr>
                        </tbody></table>
                    </div>
                </div>
            </div>

            <div class="tab-content" id="tab-tarjetahabientes">
                <div class="card-header"><h3>Tarjetahabientes Corporativos</h3><button class="btn-primary btn-sm">+ Nuevo Tarjetahabiente</button></div>
                <div class="table-container">
                    <table>
                        <thead><tr><th>Colaborador</th><th>N° Tarjeta</th><th>Grupo Corte</th><th>Límite</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                            <tr><td>Roberto Chen</td><td>**** **** **** 4521</td><td>Grupo A</td><td>₡2,000,000</td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button></td></tr>
                            <tr><td>María López</td><td>**** **** **** 8832</td><td>Grupo B</td><td>₡1,500,000</td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button></td></tr>
                            <tr><td>Ana Jiménez</td><td>**** **** **** 3310</td><td>Grupo A</td><td>₡1,000,000</td><td><span class="badge badge-aprobada">Activo</span></td><td><button class="btn-secondary btn-xs">Editar</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tab-content" id="tab-parametros">
                <div class="card-header"><h3>Parámetros del Sistema</h3></div>
                <div class="grid-2">
                    <div class="card">
                        <h4 class="mb-8">Parámetros de IVA</h4>
                        <div class="form-grid">
                            <div class="form-group"><label>IVA General</label><input type="number" value="13">%</div>
                            <div class="form-group"><label>IVA Reducido 1</label><input type="number" value="4">%</div>
                            <div class="form-group"><label>IVA Reducido 2</label><input type="number" value="2">%</div>
                            <div class="form-group"><label>IVA Mínimo</label><input type="number" value="1">%</div>
                            <div class="form-group"><label>Servicio Restaurantes</label><input type="number" value="10">%</div>
                        </div>
                        <button class="btn-primary btn-sm mt-16" onclick="alert('Parámetros IVA actualizados')">Guardar</button>
                    </div>
                    <div class="card">
                        <h4 class="mb-8">Integración SAP Business One</h4>
                        <div class="form-grid">
                            <div class="form-group"><label>URL Service Layer</label><input type="text" value="https://sap.laguaca.com:50000/b1s/v1"></div>
                            <div class="form-group"><label>Compañía</label><input type="text" value="LAGUACA_PROD"></div>
                            <div class="form-group"><label>Usuario SAP</label><input type="text" value="api_user"></div>
                            <div class="form-group"><label>Estado Conexión</label><span class="badge badge-aprobada">Conectado</span></div>
                        </div>
                        <button class="btn-primary btn-sm mt-16" onclick="alert('Configuración SAP guardada')">Guardar</button>
                        <button class="btn-info btn-sm mt-16" onclick="alert('Conexión exitosa con SAP B1 Service Layer')">Probar Conexión</button>
                    </div>
                </div>
                <div class="card mt-16">
                    <h4 class="mb-8">Estados del Proceso</h4>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>Código</th><th>Etiqueta</th><th>Color</th><th>Activo</th></tr></thead>
                            <tbody>
                                ${Object.entries(estados).map(([k,v])=>`<tr><td><code>${k}</code></td><td>${v.label}</td><td><span class="badge ${v.clase}">${v.label}</span></td><td>✅</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showAdminTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    event.target.classList.add('active');
}

// ===== MODAL GENÉRICO DE DETALLE =====
function openDetailModal(id) {
    const s = solicitudes.find(x => x.id === id);
    if (!s) return;
    const modal = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = `${s.tipoLabel} - ${s.id}`;

    let lineasHtml = '';
    if (s.gastos && s.tipo === 'viaticos') {
        lineasHtml = `<table><thead><tr><th>Categoría</th><th>Monto</th><th>Observación</th></tr></thead><tbody>
            ${s.gastos.map(g=>`<tr><td>${getCategoriaNombre(g.categoria)}</td><td class="text-right">${formatMoney(g.monto)}</td><td>${g.observacion||''}</td></tr>`).join('')}
            <tr><td><strong>Total</strong></td><td class="text-right"><strong>${formatMoney(s.gastos.reduce((t,g)=>t+g.monto,0))}</strong></td><td></td></tr>
        </tbody></table>`;
    } else if (s.comprobantes) {
        lineasHtml = `<table><thead><tr><th>Fecha</th><th>Factura</th><th>Proveedor</th><th>Monto s/IVA</th><th>IVA</th><th>Serv.</th><th>Total</th><th>Estado</th><th>Adjunto</th></tr></thead><tbody>
            ${s.comprobantes.map(c=>`<tr><td>${c.fecha}</td><td>${c.numFactura}</td><td>${c.proveedor}</td><td class="text-right">${formatMoney(c.montoSinIVA)}</td><td class="text-right">${formatMoney(c.iva)}</td><td class="text-right">${formatMoney(c.servicio)}</td><td class="text-right"><strong>${formatMoney(c.total)}</strong></td><td>${c.estado==='aceptada'?'✅':c.estado==='rechazada'?'❌':'⏳'}</td><td>${c.adjunto?'📎 '+c.adjunto:'-'}</td></tr>`).join('')}
        </tbody></table>`;
    } else if (s.transacciones) {
        lineasHtml = `<table><thead><tr><th>Fecha</th><th>Comercio</th><th>Monto</th><th>IVA</th><th>Total</th><th>Estado</th><th>Adjunto</th></tr></thead><tbody>
            ${s.transacciones.map(t=>`<tr><td>${t.fechaTrans}</td><td>${t.comercio}</td><td class="text-right">${formatMoney(t.montoColones)}</td><td class="text-right">${formatMoney(t.iva)}</td><td class="text-right"><strong>${formatMoney(t.total)}</strong></td><td>${t.estado}</td><td>${t.adjunto?'📎 '+t.adjunto:'-'}</td></tr>`).join('')}
        </tbody></table>`;
    } else if (s.gastos && s.tipo === 'caja_chica') {
        lineasHtml = `<table><thead><tr><th>Fecha</th><th>Factura</th><th>Proveedor</th><th>Monto s/IVA</th><th>IVA</th><th>Serv.</th><th>Total</th><th>Estado</th></tr></thead><tbody>
            ${s.gastos.map(g=>`<tr><td>${g.fecha}</td><td>${g.numFactura}</td><td>${g.proveedor}</td><td class="text-right">${formatMoney(g.montoSinIVA)}</td><td class="text-right">${formatMoney(g.iva)}</td><td class="text-right">${formatMoney(g.servicio)}</td><td class="text-right"><strong>${formatMoney(g.total)}</strong></td><td>${g.estado==='aceptada'?'✅':g.estado==='rechazada'?'❌':'⏳'}</td></tr>`).join('')}
        </tbody></table>`;
    }

    document.getElementById('modalBody').innerHTML = `
        <div class="form-grid">
            <div class="form-group"><label>Solicitante</label><p>${s.solicitante}</p></div>
            <div class="form-group"><label>Departamento</label><p>${s.departamento}</p></div>
            <div class="form-group"><label>Centro de Costo</label><p>${s.centroCosto}</p></div>
            <div class="form-group"><label>Supervisor</label><p>${s.supervisor}</p></div>
            <div class="form-group"><label>Fecha Solicitud</label><p>${s.fechaSolicitud}</p></div>
            <div class="form-group"><label>Período</label><p>${s.fechaInicio} a ${s.fechaFin} (${s.dias} días)</p></div>
            <div class="form-group"><label>Monto Solicitado</label><p><strong>${formatMoney(s.montoSolicitado)}</strong></p></div>
            <div class="form-group"><label>Monto Aprobado</label><p><strong>${formatMoney(s.montoAprobado)}</strong></p></div>
            <div class="form-group"><label>Estado</label><p>${getBadge(s.estado)}</p></div>
            ${s.destino ? `<div class="form-group"><label>Destino</label><p>${s.destino}</p></div>` : ''}
            ${s.motivo ? `<div class="form-group"><label>Motivo</label><p>${s.motivo}</p></div>` : ''}
            ${s.refSAP ? `<div class="form-group"><label>Referencia SAP</label><p><code>${s.refSAP}</code></p></div>` : ''}
            ${s.errorSAP ? `<div class="form-group"><label>Error SAP</label><p class="text-danger">${s.errorSAP}</p></div>` : ''}
            ${s.solicitudRelacionada ? `<div class="form-group"><label>Viático Relacionado</label><p>${s.solicitudRelacionada}</p></div>` : ''}
            ${s.diferencia !== undefined ? `<div class="form-group"><label>Diferencia</label><p class="${s.diferencia>0?'text-danger':'text-success'}">${formatMoney(s.diferencia)}</p></div>` : ''}
            ${s.tarjetahabiente ? `<div class="form-group"><label>Tarjetahabiente</label><p>${s.tarjetahabiente}</p></div>` : ''}
            ${s.numTarjeta ? `<div class="form-group"><label>Tarjeta</label><p>${s.numTarjeta}</p></div>` : ''}
        </div>

        ${lineasHtml ? `<div class="form-section mt-16"><div class="form-section-title">Detalle</div><div class="table-container">${lineasHtml}</div></div>` : ''}

        <div class="form-section mt-16">
            <div class="form-section-title">Flujo de Aprobación</div>
            <div class="flow-timeline">
                ${s.historial.map(h => `<div class="flow-step">
                    <div class="flow-dot ${h.accion.includes('Error')||h.accion.includes('Rechazada')?'error':'active'}">
                        ${h.accion.includes('Error')||h.accion.includes('Rechazada')?'✕':'✓'}
                    </div>
                    <div class="flow-info">
                        <div class="flow-action">${h.accion}</div>
                        <div class="flow-meta">${h.fecha} — ${h.usuario} (${h.rol}) ${h.comentario ? '<br>💬 ' + h.comentario : ''}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    `;

    document.getElementById('modalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
        <button class="btn-secondary" onclick="alert('Descarga simulada de adjuntos para ${s.id}')">📥 Descargar Adjuntos</button>
    `;
    modal.style.display = 'flex';
}

// ===== ACCIONES GENERALES =====
function enviarAprobacion(tipo) {
    const tipoLabels = { viaticos: 'Solicitud de Viáticos', reintegro: 'Reintegro de Viáticos', caja_chica: 'Liquidación Caja Chica', tarjeta: 'Reintegro Tarjeta Corporativa' };
    alert(`✅ ${tipoLabels[tipo] || 'Solicitud'} enviada a aprobación exitosamente.\n\nSe ha notificado al supervisor/responsable correspondiente.`);
}

function aprobarSolicitud(id) {
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        s.estado = 'aprobada';
        s.montoAprobado = s.montoSolicitado;
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Supervisor', accion: 'Aprobada', comentario: document.getElementById('approvalComment')?.value || '' });
        alert('✅ Solicitud aprobada exitosamente');
        closeModal();
        renderBandejaAprobaciones();
    }
}

function rechazarSolicitud(id) {
    const comment = document.getElementById('approvalComment')?.value;
    if (!comment) { alert('⚠️ El comentario es obligatorio para rechazar una solicitud'); return; }
    const s = solicitudes.find(x => x.id === id);
    if (s) {
        s.estado = 'rechazada';
        s.historial.push({ fecha: new Date().toLocaleString('es-CR'), usuario: currentUser.nombre, rol: 'Supervisor', accion: 'Rechazada', comentario: comment });
        alert('Solicitud rechazada');
        closeModal();
        renderBandejaAprobaciones();
    }
}

function duplicarSolicitud(id) {
    alert(`Solicitud ${id} duplicada como borrador. Se ha creado una copia para editar.`);
}

function editSolicitud(id) {
    const s = solicitudes.find(x => x.id === id);
    if (s && s.estado === 'borrador') {
        alert(`Editando solicitud ${id}...`);
        // Navigate to appropriate view based on type
        if (s.tipo === 'viaticos') showView('solicitudViaticos');
        else if (s.tipo === 'reintegro_viaticos') showView('reintegroViaticos');
        else if (s.tipo === 'caja_chica') showView('cajaChica');
        else if (s.tipo === 'tarjeta_corporativa') showView('tarjetaCorporativa');
    }
}

function deleteSolicitud(id) {
    if (confirm(`¿Está seguro de eliminar la solicitud ${id}? Esta acción no se puede deshacer.`)) {
        const idx = solicitudes.findIndex(x => x.id === id);
        if (idx > -1 && solicitudes[idx].estado === 'borrador') {
            solicitudes.splice(idx, 1);
            alert('Solicitud eliminada');
            renderMisSolicitudes();
        }
    }
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('modalContent').classList.remove('modal-fullscreen');
}

// Close modal on overlay click
document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Keyboard shortcut to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
});
