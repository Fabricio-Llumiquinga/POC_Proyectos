// ===== DATA LAYER - Pricing Control Hub =====
// Simulated data store for La Guaca

var AppData = (function() {
    'use strict';

    // Parameters and rules
    var parametros = {
        umbralNoCambio: 5,
        umbralRevision: 10,
        umbralAjusteAuto: 10,
        umbralNuevoCodigo: 40,
        porcentajeSobreMercado: 10,
        porcentajeBajoMercado: 15,
        margenMinimo: 15,
        markupPiso: 17,
        markupTecho: 1000,
        pisoVariacion: -50,
        techoVariacion: 50,
        porcentajePermitidoSobreMercado: 5
    };

    // Competitors (configurable)
    var competidores = [
        { id: 'C1', nombre: 'Competidor 1' },
        { id: 'C2', nombre: 'Competidor 2' },
        { id: 'C3', nombre: 'Competidor 3' }
    ];

    // 20+ simulated products
    var productos = [
        {
            sku: 'LG-001', descripcion: 'Faro Delantero Corolla 2020', marca: 'Toyota', familia: 'Iluminación',
            categoria: 'Faros', copro: 'CP-101', tipoIngreso: 'Código nuevo', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: 'Proveedor Alpha', costoActual: 45000, precioActual: 68000,
            inventario: 15, rotacion: 'Alta', estado: 'Activo', tieneLado: true,
            lado: 'Izquierdo', skuPareja: 'LG-002', ultimaEvaluacion: '2026-06-15',
            estadoAlerta: 'normal', antiguedad: 2, historicoConsumo: 120,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Depo, TYC'
        },
        {
            sku: 'LG-002', descripcion: 'Faro Delantero Corolla 2020', marca: 'Toyota', familia: 'Iluminación',
            categoria: 'Faros', copro: 'CP-101', tipoIngreso: 'Código nuevo', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: 'Proveedor Alpha', costoActual: 52000, precioActual: 78000,
            inventario: 12, rotacion: 'Alta', estado: 'Activo', tieneLado: true,
            lado: 'Derecho', skuPareja: 'LG-001', ultimaEvaluacion: '2026-06-15',
            estadoAlerta: 'normal', antiguedad: 2, historicoConsumo: 115,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Depo, TYC'
        },

        {
            sku: 'LG-003', descripcion: 'Radiador Civic 2019', marca: 'Honda', familia: 'Refrigeración',
            categoria: 'Radiadores', copro: 'CP-200', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Local', rangoCalidad: 'Media', proveedorActual: 'Proveedor Beta',
            proveedorAnterior: 'Proveedor Beta', costoActual: 38000, precioActual: 54000,
            inventario: 8, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-10',
            estadoAlerta: 'costo_menor_5', antiguedad: 3, historicoConsumo: 45,
            disponibilidadOrigen: 'Media', marcasCompetidoras: 'Valeo'
        },
        {
            sku: 'LG-004', descripcion: 'Amortiguador Mazda 3 2021', marca: 'Mazda', familia: 'Suspensión',
            categoria: 'Amortiguadores', copro: 'CP-300', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Gamma',
            proveedorAnterior: 'Proveedor Gamma', costoActual: 62000, precioActual: 89000,
            inventario: 5, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-05-28',
            estadoAlerta: 'costo_5_10', antiguedad: 1, historicoConsumo: 30,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Monroe, KYB'
        },
        {
            sku: 'LG-005', descripcion: 'Bomba de Agua Hilux 2018', marca: 'Toyota', familia: 'Refrigeración',
            categoria: 'Bombas', copro: 'CP-400', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Delta',
            proveedorAnterior: 'Proveedor Epsilon', costoActual: 28000, precioActual: 42000,
            inventario: 20, rotacion: 'Alta', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-01',
            estadoAlerta: 'costo_mayor_10', antiguedad: 4, historicoConsumo: 90,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'GMB, NPW'
        },

        {
            sku: 'LG-006', descripcion: 'Alternador Nissan Frontier 2017', marca: 'Nissan', familia: 'Eléctrico',
            categoria: 'Alternadores', copro: 'CP-500', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Media', proveedorActual: 'Proveedor Zeta',
            proveedorAnterior: 'Proveedor Omega', costoActual: 95000, precioActual: 135000,
            inventario: 3, rotacion: 'Baja', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-04-15',
            estadoAlerta: 'costo_mayor_40_prov_dif', antiguedad: 5, historicoConsumo: 12,
            disponibilidadOrigen: 'Baja', marcasCompetidoras: 'Bosch, Denso'
        },
        {
            sku: 'LG-007', descripcion: 'Espejo Retrovisor RAV4 2021 LH', marca: 'Toyota', familia: 'Carrocería',
            categoria: 'Espejos', copro: 'CP-600', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: 'Proveedor Alpha', costoActual: 75000, precioActual: 118000,
            inventario: 6, rotacion: 'Media', estado: 'Activo', tieneLado: true,
            lado: 'Izquierdo', skuPareja: 'LG-008', ultimaEvaluacion: '2026-06-18',
            estadoAlerta: 'normal', antiguedad: 1, historicoConsumo: 25,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Depo'
        },
        {
            sku: 'LG-008', descripcion: 'Espejo Retrovisor RAV4 2021 RH', marca: 'Toyota', familia: 'Carrocería',
            categoria: 'Espejos', copro: 'CP-600', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: 'Proveedor Alpha', costoActual: 78000, precioActual: 110000,
            inventario: 4, rotacion: 'Media', estado: 'Activo', tieneLado: true,
            lado: 'Derecho', skuPareja: 'LG-007', ultimaEvaluacion: '2026-06-18',
            estadoAlerta: 'normal', antiguedad: 1, historicoConsumo: 22,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Depo'
        },

        {
            sku: 'LG-009', descripcion: 'Stop Trasero Tucson 2020 LH', marca: 'Hyundai', familia: 'Iluminación',
            categoria: 'Stops', copro: 'CP-700', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Beta',
            proveedorAnterior: 'Proveedor Beta', costoActual: 55000, precioActual: 82000,
            inventario: 2, rotacion: 'Baja', estado: 'Activo', tieneLado: true,
            lado: 'Izquierdo', skuPareja: 'LG-010', ultimaEvaluacion: '2026-06-12',
            estadoAlerta: 'lado_incompleto', antiguedad: 2, historicoConsumo: 18,
            disponibilidadOrigen: 'Media', marcasCompetidoras: 'Depo, TYC'
        },
        {
            sku: 'LG-010', descripcion: 'Stop Trasero Tucson 2020 RH', marca: 'Hyundai', familia: 'Iluminación',
            categoria: 'Stops', copro: 'CP-700', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Beta',
            proveedorAnterior: 'Proveedor Beta', costoActual: 0, precioActual: 0,
            inventario: 0, rotacion: 'N/A', estado: 'Pendiente', tieneLado: true,
            lado: 'Derecho', skuPareja: 'LG-009', ultimaEvaluacion: null,
            estadoAlerta: 'lado_incompleto', antiguedad: 0, historicoConsumo: 0,
            disponibilidadOrigen: 'Baja', marcasCompetidoras: 'Depo, TYC'
        },
        {
            sku: 'LG-011', descripcion: 'Filtro de Aceite Sportage 2019', marca: 'Kia', familia: 'Filtros',
            categoria: 'Filtros', copro: 'CP-800', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Local', rangoCalidad: 'Media', proveedorActual: 'Proveedor Gamma',
            proveedorAnterior: 'Proveedor Gamma', costoActual: 8500, precioActual: 9200,
            inventario: 150, rotacion: 'Alta', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-20',
            estadoAlerta: 'sobreprecio', antiguedad: 3, historicoConsumo: 500,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Wix, Mann'
        },

        {
            sku: 'LG-012', descripcion: 'Pastillas de Freno CR-V 2020', marca: 'Honda', familia: 'Frenos',
            categoria: 'Pastillas', copro: 'CP-900', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Delta',
            proveedorAnterior: 'Proveedor Delta', costoActual: 22000, precioActual: 28000,
            inventario: 45, rotacion: 'Alta', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-19',
            estadoAlerta: 'bajo_mercado', antiguedad: 2, historicoConsumo: 200,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Brembo, Ferodo'
        },
        {
            sku: 'LG-013', descripcion: 'Compresor A/C Accent 2018', marca: 'Hyundai', familia: 'Aire Acondicionado',
            categoria: 'Compresores', copro: 'CP-1000', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Media', proveedorActual: 'Proveedor Epsilon',
            proveedorAnterior: 'Proveedor Epsilon', costoActual: 180000, precioActual: 245000,
            inventario: 2, rotacion: 'Baja', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-05-10',
            estadoAlerta: 'bajo_stock', antiguedad: 4, historicoConsumo: 8,
            disponibilidadOrigen: 'Baja', marcasCompetidoras: 'Denso, Sanden'
        },
        {
            sku: 'LG-014', descripcion: 'Guardafango Elantra 2021', marca: 'Hyundai', familia: 'Carrocería',
            categoria: 'Guardafangos', copro: 'CP-1100', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Media', proveedorActual: 'Proveedor Zeta',
            proveedorAnterior: 'Proveedor Zeta', costoActual: 32000, precioActual: 44000,
            inventario: 85, rotacion: 'Baja', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-05',
            estadoAlerta: 'sobre_stock', antiguedad: 1, historicoConsumo: 10,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Aftermarket'
        },

        {
            sku: 'LG-015', descripcion: 'Capó Corolla 2018 - Liquidación', marca: 'Toyota', familia: 'Carrocería',
            categoria: 'Capós', copro: 'CP-1200', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Baja', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: 'Proveedor Alpha', costoActual: 120000, precioActual: 121200,
            inventario: 3, rotacion: 'Nula', estado: 'Liquidación', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-03-01',
            estadoAlerta: 'liquidacion', antiguedad: 6, historicoConsumo: 2,
            disponibilidadOrigen: 'Nula', marcasCompetidoras: ''
        },
        {
            sku: 'LG-016', descripcion: 'Disco de Freno Camry 2019', marca: 'Toyota', familia: 'Frenos',
            categoria: 'Discos', copro: 'CP-1300', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Local', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Beta',
            proveedorAnterior: 'Proveedor Beta', costoActual: 35000, precioActual: 41000,
            inventario: 10, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-18',
            estadoAlerta: 'margen_bajo', antiguedad: 3, historicoConsumo: 55,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Brembo, TRW'
        },
        {
            sku: 'LG-017', descripcion: 'Termostato Mazda CX-5 2020', marca: 'Mazda', familia: 'Refrigeración',
            categoria: 'Termostatos', copro: 'CP-1400', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Media', proveedorActual: 'Proveedor Gamma',
            proveedorAnterior: 'Proveedor Gamma', costoActual: 15000, precioActual: 23000,
            inventario: 18, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-02-20',
            estadoAlerta: 'sin_evaluacion_reciente', antiguedad: 2, historicoConsumo: 40,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Gates, Wahler'
        },

        {
            sku: 'LG-018', descripcion: 'Correa de Tiempo Sentra 2017', marca: 'Nissan', familia: 'Motor',
            categoria: 'Correas', copro: 'CP-1500', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Delta',
            proveedorAnterior: 'Proveedor Delta', costoActual: 42000, precioActual: 58000,
            inventario: 7, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-10',
            estadoAlerta: 'tendencia_negativa', antiguedad: 5, historicoConsumo: 35,
            disponibilidadOrigen: 'Media', marcasCompetidoras: 'Gates, Continental'
        },
        {
            sku: 'U-LG-019', descripcion: 'Faro Delantero Civic 2018 USADO', marca: 'Honda', familia: 'Iluminación',
            categoria: 'Faros', copro: 'CP-1600', tipoIngreso: 'Código nuevo', condicion: 'Usado',
            origen: 'Local', rangoCalidad: 'Media', proveedorActual: 'Compra directa',
            proveedorAnterior: null, costoActual: 25000, precioActual: 0,
            inventario: 1, rotacion: 'Baja', estado: 'Pendiente', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: null,
            estadoAlerta: 'usado_sin_equivalencia', antiguedad: 5, historicoConsumo: 0,
            disponibilidadOrigen: 'Baja', marcasCompetidoras: '',
            estadoFisico: 'Bueno', productoNuevoEquivalente: null
        },
        {
            sku: 'U-LG-020', descripcion: 'Alternador Hilux 2016 USADO', marca: 'Toyota', familia: 'Eléctrico',
            categoria: 'Alternadores', copro: 'CP-1700', tipoIngreso: 'Código nuevo', condicion: 'Usado',
            origen: 'Local', rangoCalidad: 'Media', proveedorActual: 'Compra directa',
            proveedorAnterior: null, costoActual: 45000, precioActual: 68000,
            inventario: 1, rotacion: 'Baja', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-01',
            estadoAlerta: 'normal', antiguedad: 8, historicoConsumo: 3,
            disponibilidadOrigen: 'Baja', marcasCompetidoras: 'Bosch, Denso',
            estadoFisico: 'Regular', productoNuevoEquivalente: 'LG-006'
        },

        {
            sku: 'LG-021', descripcion: 'Sensor O2 RAV4 2019', marca: 'Toyota', familia: 'Eléctrico',
            categoria: 'Sensores', copro: 'CP-1800', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Epsilon',
            proveedorAnterior: 'Proveedor Epsilon', costoActual: 38000, precioActual: 56000,
            inventario: 9, rotacion: 'Media', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-20',
            estadoAlerta: 'aplicacion_exitosa', antiguedad: 3, historicoConsumo: 28,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Denso, NTK'
        },
        {
            sku: 'LG-022', descripcion: 'Parrilla Frontal Fortuner 2020', marca: 'Toyota', familia: 'Carrocería',
            categoria: 'Parrillas', copro: 'CP-1900', tipoIngreso: 'Código nuevo', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Alpha',
            proveedorAnterior: null, costoActual: 85000, precioActual: 0,
            inventario: 4, rotacion: 'Baja', estado: 'Pendiente', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: null,
            estadoAlerta: 'codigo_nuevo_pendiente', antiguedad: 0, historicoConsumo: 0,
            disponibilidadOrigen: 'Alta', marcasCompetidoras: 'Aftermarket'
        },
        {
            sku: 'LG-023', descripcion: 'Kit Clutch Mazda 2 2019', marca: 'Mazda', familia: 'Transmisión',
            categoria: 'Clutch', copro: 'CP-2000', tipoIngreso: 'Existente', condicion: 'Nuevo',
            origen: 'Importado', rangoCalidad: 'Alta', proveedorActual: 'Proveedor Zeta',
            proveedorAnterior: 'Proveedor Zeta', costoActual: 155000, precioActual: 220000,
            inventario: 3, rotacion: 'Baja', estado: 'Activo', tieneLado: false,
            lado: 'No aplica', skuPareja: null, ultimaEvaluacion: '2026-06-15',
            estadoAlerta: 'dentro_rango', antiguedad: 3, historicoConsumo: 15,
            disponibilidadOrigen: 'Media', marcasCompetidoras: 'Valeo, LUK'
        }
    ];

    // Cost changes data
    var cambiosCosto = [
        { sku: 'LG-003', costoAnterior: 37500, nuevoCosto: 38000, variacion: 1.33 },
        { sku: 'LG-004', costoAnterior: 57000, nuevoCosto: 62000, variacion: 8.77 },
        { sku: 'LG-005', costoAnterior: 22000, nuevoCosto: 28000, variacion: 27.27 },
        { sku: 'LG-006', costoAnterior: 55000, nuevoCosto: 95000, variacion: 72.73 },
        { sku: 'LG-018', costoAnterior: 44000, nuevoCosto: 42000, variacion: -4.55 }
    ];

    // Competition prices
    var preciosCompetencia = [
        { sku: 'LG-011', competidor: 'Competidor 1', precioComp: 8200, fecha: '2026-06-18', fuente: 'Web', confianza: 'Alta' },
        { sku: 'LG-011', competidor: 'Competidor 2', precioComp: 8000, fecha: '2026-06-17', fuente: 'Cotización', confianza: 'Alta' },
        { sku: 'LG-011', competidor: 'Competidor 3', precioComp: 8400, fecha: '2026-06-19', fuente: 'Visita', confianza: 'Media' },
        { sku: 'LG-012', competidor: 'Competidor 1', precioComp: 32000, fecha: '2026-06-15', fuente: 'Web', confianza: 'Alta' },
        { sku: 'LG-012', competidor: 'Competidor 2', precioComp: 34000, fecha: '2026-06-16', fuente: 'Cotización', confianza: 'Alta' },
        { sku: 'LG-023', competidor: 'Competidor 1', precioComp: 225000, fecha: '2026-06-10', fuente: 'Web', confianza: 'Alta' },
        { sku: 'LG-023', competidor: 'Competidor 2', precioComp: 218000, fecha: '2026-06-12', fuente: 'Visita', confianza: 'Media' },
        { sku: 'LG-001', competidor: 'Competidor 1', precioComp: 70000, fecha: '2026-06-14', fuente: 'Web', confianza: 'Alta' },
        { sku: 'LG-005', competidor: 'Competidor 1', precioComp: 44000, fecha: '2026-06-08', fuente: 'Cotización', confianza: 'Alta' }
    ];

    // Approval requests
    var solicitudesAprobacion = [
        { id: 'APR-001', sku: 'LG-022', motivo: 'Producto con código nuevo', accion: 'Calcular precio', precioActual: 0, precioPropuesto: 135000, margen: 58.8, regla: 'Código nuevo requiere aprobación', solicitante: 'Sistema', fecha: '2026-06-20', estado: 'Pendiente' },
        { id: 'APR-002', sku: 'U-LG-019', motivo: 'Producto usado con código nuevo', accion: 'Calcular precio usado', precioActual: 0, precioPropuesto: 42000, margen: 68, regla: 'Usado código nuevo requiere aprobación', solicitante: 'Sistema', fecha: '2026-06-19', estado: 'Pendiente' },
        { id: 'APR-003', sku: 'LG-006', motivo: 'Cambio > 40% proveedor diferente', accion: 'Crear nuevo código', precioActual: 135000, precioPropuesto: 155000, margen: 63.2, regla: 'Variación >40% con proveedor diferente', solicitante: 'Motor de reglas', fecha: '2026-06-18', estado: 'Pendiente' },
        { id: 'APR-004', sku: 'LG-016', motivo: 'Margen bajo', accion: 'Ajustar precio', precioActual: 41000, precioPropuesto: 49000, margen: 40, regla: 'Margen mínimo 15%', solicitante: 'Sistema', fecha: '2026-06-17', estado: 'Pendiente' }
    ];

    // API POS log
    var logApiPos = [
        { id: 'API-001', sku: 'LG-021', accion: 'Actualizar precio', precioAnterior: 52000, precioNuevo: 56000, estado: 'Aplicado en punto de venta', fecha: '2026-06-20 14:30', usuario: 'Sistema' },
        { id: 'API-002', sku: 'LG-005', accion: 'Actualizar precio', precioAnterior: 38000, precioNuevo: 42000, estado: 'Aplicado en punto de venta', fecha: '2026-06-19 09:15', usuario: 'Sistema' },
        { id: 'API-003', sku: 'LG-004', accion: 'Actualizar precio', precioAnterior: 82000, precioNuevo: 89000, estado: 'Error de integración', fecha: '2026-06-18 16:45', usuario: 'Sistema' },
        { id: 'API-004', sku: 'LG-011', accion: 'Actualizar precio', precioAnterior: 9500, precioNuevo: 9200, estado: 'Pendiente de envío', fecha: '2026-06-21 08:00', usuario: 'Admin' }
    ];

    // Historic data
    var historico = [
        { sku: 'LG-001', fecha: '2026-01-15', costo: 40000, precio: 64000, markup: 60, margen: 37.5, precioMercado: 65000, accion: 'Precio inicial', usuario: 'Admin' },
        { sku: 'LG-001', fecha: '2026-02-20', costo: 42000, precio: 67000, markup: 59.5, margen: 37.3, precioMercado: 66000, accion: 'Cambio de costo', usuario: 'Sistema' },
        { sku: 'LG-001', fecha: '2026-04-10', costo: 44000, precio: 70000, markup: 59.1, margen: 37.1, precioMercado: 68000, accion: 'Cambio de costo', usuario: 'Sistema' },
        { sku: 'LG-001', fecha: '2026-06-01', costo: 45000, precio: 68000, markup: 51.1, margen: 33.8, precioMercado: 70000, accion: 'Ajuste competencia', usuario: 'Admin' },
        { sku: 'LG-005', fecha: '2026-01-01', costo: 18000, precio: 30000, markup: 66.7, margen: 40, precioMercado: 32000, accion: 'Precio inicial', usuario: 'Admin' },
        { sku: 'LG-005', fecha: '2026-03-15', costo: 20000, precio: 34000, markup: 70, margen: 41.2, precioMercado: 35000, accion: 'Cambio de costo', usuario: 'Sistema' },
        { sku: 'LG-005', fecha: '2026-05-01', costo: 22000, precio: 38000, markup: 72.7, margen: 42.1, precioMercado: 40000, accion: 'Cambio de costo', usuario: 'Sistema' },
        { sku: 'LG-005', fecha: '2026-06-01', costo: 28000, precio: 42000, markup: 50, margen: 33.3, precioMercado: 44000, accion: 'Ajuste automático', usuario: 'Sistema' }
    ];

    // Alerts
    var alertas = [
        { producto: 'LG-011', tipo: 'Sobreprecio', descripcion: 'Precio 12% sobre promedio de mercado', severidad: 'Alta', accion: 'Reducir precio', fecha: '2026-06-20' },
        { producto: 'LG-012', tipo: 'Bajo mercado', descripcion: 'Precio 15% bajo promedio de mercado', severidad: 'Media', accion: 'Evaluar aumento', fecha: '2026-06-19' },
        { producto: 'LG-006', tipo: 'Cambio costo >40%', descripcion: 'Variación 72.73% con proveedor diferente', severidad: 'Alta', accion: 'Crear nuevo código', fecha: '2026-06-18' },
        { producto: 'LG-016', tipo: 'Margen bajo', descripcion: 'Margen actual 17.1% cerca del mínimo', severidad: 'Media', accion: 'Ajustar precio', fecha: '2026-06-18' },
        { producto: 'LG-009', tipo: 'Lado incompleto', descripcion: 'Par LG-010 sin precio/costo registrado', severidad: 'Media', accion: 'Completar par', fecha: '2026-06-17' },
        { producto: 'LG-017', tipo: 'Sin evaluación reciente', descripcion: 'Última evaluación hace más de 90 días', severidad: 'Baja', accion: 'Evaluar competencia', fecha: '2026-06-16' },
        { producto: 'LG-022', tipo: 'Código nuevo pendiente', descripcion: 'Producto nuevo sin precio aprobado', severidad: 'Alta', accion: 'Calcular y aprobar', fecha: '2026-06-15' },
        { producto: 'LG-004', tipo: 'Error integración', descripcion: 'Fallo al enviar precio a punto de venta', severidad: 'Alta', accion: 'Reprocesar', fecha: '2026-06-18' }
    ];

    // Bitacora
    var bitacora = [];

    // Adjustments
    var ajustesPrecio = [];

    // Market research entries
    var investigacionMercado = [];

    // Investigators
    var investigadores = [
        { id: 'INV-01', nombre: 'Carlos Pérez', carga: 1 },
        { id: 'INV-02', nombre: 'María López', carga: 1 },
        { id: 'INV-03', nombre: 'Andrés Gómez', carga: 2 }
    ];

    // Investigation queue
    var colaInvestigacion = [
        { sku: 'LG-001', responsableId: 'INV-01', estado: 'Validado', fechaAsignacion: '2026-06-10', fechaComparacion: '2026-06-14', precioCompetencia: 70000, competidor: 'Competidor 1', observacion: 'Precio confirmado en web' },
        { sku: 'LG-003', responsableId: 'INV-02', estado: 'Pendiente', fechaAsignacion: '2026-06-18', fechaComparacion: null, precioCompetencia: null, competidor: null, observacion: null },
        { sku: 'LG-005', responsableId: 'INV-03', estado: 'Validado', fechaAsignacion: '2026-06-05', fechaComparacion: '2026-06-08', precioCompetencia: 44000, competidor: 'Competidor 1', observacion: 'Cotización directa con proveedor' },
        { sku: 'LG-011', responsableId: 'INV-01', estado: 'Validado', fechaAsignacion: '2026-06-12', fechaComparacion: '2026-06-18', precioCompetencia: 8200, competidor: 'Competidor 1', observacion: 'Precio validado en 3 fuentes' },
        { sku: 'LG-012', responsableId: 'INV-02', estado: 'Validado', fechaAsignacion: '2026-06-10', fechaComparacion: '2026-06-15', precioCompetencia: 32000, competidor: 'Competidor 1', observacion: 'Verificado en visita' },
        { sku: 'LG-004', responsableId: 'INV-03', estado: 'Pendiente', fechaAsignacion: '2026-06-20', fechaComparacion: null, precioCompetencia: null, competidor: null, observacion: null },
        { sku: 'LG-016', responsableId: 'INV-01', estado: 'Pendiente', fechaAsignacion: '2026-06-19', fechaComparacion: null, precioCompetencia: null, competidor: null, observacion: null },
        { sku: 'LG-023', responsableId: 'INV-02', estado: 'Validado', fechaAsignacion: '2026-06-08', fechaComparacion: '2026-06-12', precioCompetencia: 221500, competidor: 'Competidor 2', observacion: 'Promedio de 2 competidores' },
        { sku: 'LG-018', responsableId: 'INV-03', estado: 'Pendiente', fechaAsignacion: '2026-06-21', fechaComparacion: null, precioCompetencia: null, competidor: null, observacion: null },
        { sku: 'LG-007', responsableId: 'INV-01', estado: 'Validado', fechaAsignacion: '2026-06-14', fechaComparacion: '2026-06-18', precioCompetencia: 115000, competidor: 'Competidor 3', observacion: 'Precio por llamada telefónica' },
        { sku: 'LG-013', responsableId: 'INV-02', estado: 'Pendiente', fechaAsignacion: '2026-06-22', fechaComparacion: null, precioCompetencia: null, competidor: null, observacion: null },
        { sku: 'LG-021', responsableId: 'INV-03', estado: 'Validado', fechaAsignacion: '2026-06-15', fechaComparacion: '2026-06-20', precioCompetencia: 58000, competidor: 'Competidor 1', observacion: 'Precio en catálogo web actualizado' }
    ];

    // Public API
    return {
        parametros: parametros,
        competidores: competidores,
        productos: productos,
        cambiosCosto: cambiosCosto,
        preciosCompetencia: preciosCompetencia,
        solicitudesAprobacion: solicitudesAprobacion,
        logApiPos: logApiPos,
        historico: historico,
        alertas: alertas,
        bitacora: bitacora,
        ajustesPrecio: ajustesPrecio,
        investigacionMercado: investigacionMercado,
        investigadores: investigadores,
        colaInvestigacion: colaInvestigacion,
        getProducto: function(sku) {
            return productos.find(function(p) { return p.sku === sku; });
        },
        getCompetencia: function(sku) {
            return preciosCompetencia.filter(function(c) { return c.sku === sku; });
        },
        getHistorico: function(sku) {
            return historico.filter(function(h) { return h.sku === sku; });
        },
        addBitacora: function(entry) {
            entry.fecha = new Date().toISOString().slice(0, 16).replace('T', ' ');
            bitacora.unshift(entry);
        }
    };
})();
