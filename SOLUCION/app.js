'use strict';
// ============================================================
// RENTECO v2.0 - Torre Inteligente de Importaciones
// ============================================================

// ===== DATOS DETERMINÍSTICOS =====
const DEFAULT_RULES = {margenMinimo:25,margenObjetivo:35,variacionCostoAlerta:15,utilizacionMinima:80,maxConcentracionCliente:60,tipoCambio:530,capacidad20Peso:21770,capacidad20Volumen:33.2,capacidad40Peso:26780,capacidad40Volumen:67.7,
// Nuevos parámetros v3.0
coberturaObjetivo:4,coberturaMaxima:9,umbralSobreStock:9,mesesMaxRotacion:9,umbralCotizacionVencer:15,
distribucionHibrida:{valor:0.4,peso:0.3,volumen:0.3},
clasificacionRotacion:{excelente:3,aceptable:6,riesgoModerado:9}};

const PROVEEDORES = [
{id:1,nombre:'Proveedor 1',region:'Europa',pais:'España',recurrente:true,moneda:'EUR',incoterm:'CIF',tipoContenedor:'40 pies',tiempoEntrega:35,tratado:true,variacionReciente:8.2,ultimaCompra:'2026-02-15',importaciones:14,frecuenciaCompra:'Cada 2.5 meses',utilizacionProm:89,email:'proveedor1@ejemplo.com',direccion:'Calle Industrial 24, Madrid, España',
// Nuevos campos v3.0
defaultImportMode:'contenedor_completo',usualContainer:'40 pies',allowsConsolidation:false,consolidationPoint:null,exceptionAllowed:true,exceptionTypes:['Pedido urgente','Proyecto especial'],minimumOrderValue:35000,targetOrderValue:45000,usualIncoterm:'CIF',quoteValidityDays:45,averageTransitDays:35,brands:['Marca A','Marca B','Marca C'],utilizacionMinRec:85},
{id:2,nombre:'Proveedor 2',region:'Europa',pais:'Suiza',recurrente:true,moneda:'EUR',incoterm:'FOB',tipoContenedor:'40 pies',tiempoEntrega:40,tratado:true,variacionReciente:5.1,ultimaCompra:'2026-04-20',importaciones:8,frecuenciaCompra:'Cada 4 meses',utilizacionProm:82,email:'proveedor2@ejemplo.com',direccion:'Tüffenwies 16, Zürich, Suiza',
defaultImportMode:'contenedor_completo',usualContainer:'40 pies',allowsConsolidation:false,consolidationPoint:null,exceptionAllowed:true,exceptionTypes:['Pedido urgente','Necesidad extraordinaria'],minimumOrderValue:30000,targetOrderValue:42000,usualIncoterm:'FOB',quoteValidityDays:30,averageTransitDays:40,brands:['Marca D','Marca E'],utilizacionMinRec:82},
{id:3,nombre:'Proveedor 3',region:'Estados Unidos',pais:'Estados Unidos',recurrente:true,moneda:'USD',incoterm:'FCA',tipoContenedor:'Consolidado',tiempoEntrega:18,tratado:true,variacionReciente:12.5,ultimaCompra:'2026-06-01',importaciones:15,frecuenciaCompra:'Cada 2 meses',utilizacionProm:75,email:'proveedor3@ejemplo.com',direccion:'1200 Commerce Dr, Houston TX, USA',
defaultImportMode:'consolidado',usualContainer:'No aplica',allowsConsolidation:true,consolidationPoint:'Miami',exceptionAllowed:true,exceptionTypes:['Pedido urgente','Proyecto especial','Necesidad extraordinaria'],minimumOrderValue:8000,targetOrderValue:15000,usualIncoterm:'FCA',quoteValidityDays:30,averageTransitDays:18,brands:['Marca F','Marca G'],utilizacionMinRec:70},
{id:4,nombre:'Proveedor 4',region:'Asia',pais:'China',recurrente:true,moneda:'USD',incoterm:'FOB',tipoContenedor:'40 pies',tiempoEntrega:45,tratado:false,variacionReciente:18.3,ultimaCompra:'2026-03-10',importaciones:5,frecuenciaCompra:'Cada 6 meses',utilizacionProm:91,email:'proveedor4@ejemplo.com',direccion:'Pudong New Area, Shanghai, China',
defaultImportMode:'contenedor_completo',usualContainer:'40 pies',allowsConsolidation:false,consolidationPoint:null,exceptionAllowed:false,exceptionTypes:[],minimumOrderValue:25000,targetOrderValue:40000,usualIncoterm:'FOB',quoteValidityDays:30,averageTransitDays:45,brands:['Marca H','Marca I'],utilizacionMinRec:88},
{id:5,nombre:'Proveedor 5',region:'Sudamérica',pais:'Colombia',recurrente:false,moneda:'USD',incoterm:'CIF',tipoContenedor:'20 pies',tiempoEntrega:12,tratado:true,variacionReciente:22.0,ultimaCompra:null,importaciones:0,frecuenciaCompra:'N/A',utilizacionProm:0,email:'proveedor5@ejemplo.com',direccion:'Zona Franca Bogotá, Colombia',
defaultImportMode:'contenedor_completo',usualContainer:'20 pies',allowsConsolidation:true,consolidationPoint:'Miami',exceptionAllowed:true,exceptionTypes:['Pedido urgente'],minimumOrderValue:12000,targetOrderValue:20000,usualIncoterm:'CIF',quoteValidityDays:30,averageTransitDays:12,brands:['Marca J'],utilizacionMinRec:75},
{id:6,nombre:'Proveedor 6',region:'Europa',pais:'Alemania',recurrente:false,moneda:'EUR',incoterm:'EXW',tipoContenedor:'40 pies',tiempoEntrega:38,tratado:true,variacionReciente:0,ultimaCompra:null,importaciones:0,frecuenciaCompra:'N/A',utilizacionProm:0,email:'proveedor6@ejemplo.com',direccion:'Industriestr. 45, München, Alemania',
defaultImportMode:'contenedor_completo',usualContainer:'40 pies',allowsConsolidation:false,consolidationPoint:null,exceptionAllowed:true,exceptionTypes:['Proyecto especial'],minimumOrderValue:40000,targetOrderValue:55000,usualIncoterm:'EXW',quoteValidityDays:45,averageTransitDays:38,brands:['Marca K','Marca L'],utilizacionMinRec:80},
{id:7,nombre:'Proveedor 7',region:'Estados Unidos',pais:'Estados Unidos',recurrente:true,moneda:'USD',incoterm:'FCA',tipoContenedor:'Consolidado',tiempoEntrega:20,tratado:true,variacionReciente:6.8,ultimaCompra:'2026-05-10',importaciones:9,frecuenciaCompra:'Cada 2 meses',utilizacionProm:72,email:'proveedor7@ejemplo.com',direccion:'450 Industrial Blvd, Miami FL, USA',
defaultImportMode:'consolidado',usualContainer:'No aplica',allowsConsolidation:true,consolidationPoint:'Miami',exceptionAllowed:true,exceptionTypes:['Pedido urgente'],minimumOrderValue:6000,targetOrderValue:12000,usualIncoterm:'FCA',quoteValidityDays:30,averageTransitDays:20,brands:['Marca M','Marca N'],utilizacionMinRec:70},
{id:8,nombre:'Proveedor 8',region:'Estados Unidos',pais:'Estados Unidos',recurrente:true,moneda:'USD',incoterm:'FCA',tipoContenedor:'Consolidado',tiempoEntrega:16,tratado:true,variacionReciente:4.2,ultimaCompra:'2026-06-15',importaciones:11,frecuenciaCompra:'Cada 2 meses',utilizacionProm:68,email:'proveedor8@ejemplo.com',direccion:'789 Warehouse Ave, Miami FL, USA',
defaultImportMode:'consolidado',usualContainer:'No aplica',allowsConsolidation:true,consolidationPoint:'Miami',exceptionAllowed:true,exceptionTypes:['Pedido urgente','Necesidad extraordinaria'],minimumOrderValue:5000,targetOrderValue:10000,usualIncoterm:'FCA',quoteValidityDays:30,averageTransitDays:16,brands:['Marca O','Marca P'],utilizacionMinRec:65}
];

// Catálogo por proveedor (8 productos cada uno para los principales)
const SUPPLIER_CATALOGS = {
1: [ // Proveedor 1
{sku:'P1-001',descripcion:'Producto 1',categoria:'Impermeabilización',costoActual:85,precioVenta:152,pesoUnitario:25,volumenUnitario:0.035,stockTotal:45,stockReservado:12,stockActual:33,ordenesTransito:0,ventas3m:38,ventas6m:72,ventas12m:148,cobertura:2.6,frecuenciaCompra:12,cantidadPromedio:400,ultimaCompra:'2026-02-15',clientePrincipal:'Cliente A',concentracion:45,
consumoVenta:28,consumoInstalacion:6,consumoProyecto:4,consumoMensual:12.7,consumoTrimestral:38,consumoSemestral:72,consumoAnual:148,puntoReorden:40,inventarioMinimo:25,proyeccionComercial:{qty:15,period:'mensual',source:'Gerencia Comercial',notes:'Proyecto Torres del Parque Q4'},fechaVencimiento:'2026-11-15',stockPorVencer:8},
{sku:'P1-002',descripcion:'Producto 2',categoria:'Membranas',costoActual:320,precioVenta:575,pesoUnitario:42,volumenUnitario:0.18,stockTotal:12,stockReservado:4,stockActual:8,ordenesTransito:0,ventas3m:15,ventas6m:28,ventas12m:58,cobertura:1.6,frecuenciaCompra:10,cantidadPromedio:80,ultimaCompra:'2026-02-15',clientePrincipal:'Cliente B',concentracion:62,
consumoVenta:8,consumoInstalacion:4,consumoProyecto:3,consumoMensual:5,consumoTrimestral:15,consumoSemestral:28,consumoAnual:58,puntoReorden:15,inventarioMinimo:10,proyeccionComercial:{qty:8,period:'mensual',source:'Gerencia Comercial',notes:'Demanda creciente sector residencial'},fechaVencimiento:'2026-09-30',stockPorVencer:4},
{sku:'P1-003',descripcion:'Producto 3',categoria:'Accesorios',costoActual:4.5,precioVenta:9.8,pesoUnitario:0.3,volumenUnitario:0.002,stockTotal:850,stockReservado:200,stockActual:650,ordenesTransito:0,ventas3m:420,ventas6m:780,ventas12m:1520,cobertura:4.6,frecuenciaCompra:14,cantidadPromedio:3000,ultimaCompra:'2026-02-15',clientePrincipal:'Varios',concentracion:18,
consumoVenta:90,consumoInstalacion:35,consumoProyecto:15,consumoMensual:140,consumoTrimestral:420,consumoSemestral:780,consumoAnual:1520,puntoReorden:500,inventarioMinimo:300,proyeccionComercial:{qty:150,period:'mensual',source:'Ventas',notes:'Estable'},fechaVencimiento:null,stockPorVencer:0},
{sku:'P1-004',descripcion:'Producto 4',categoria:'Membranas',costoActual:295,precioVenta:530,pesoUnitario:38,volumenUnitario:0.16,stockTotal:8,stockReservado:3,stockActual:5,ordenesTransito:0,ventas3m:10,ventas6m:22,ventas12m:40,cobertura:1.5,frecuenciaCompra:8,cantidadPromedio:40,ultimaCompra:'2025-11-20',clientePrincipal:'Cliente C',concentracion:78,
consumoVenta:4,consumoInstalacion:3,consumoProyecto:3,consumoMensual:3.3,consumoTrimestral:10,consumoSemestral:22,consumoAnual:40,puntoReorden:12,inventarioMinimo:8,proyeccionComercial:{qty:5,period:'mensual',source:'Proyectos',notes:'Proyecto Torres del Este fase 2'},fechaVencimiento:'2026-10-20',stockPorVencer:3},
{sku:'P1-005',descripcion:'Producto 5',categoria:'Accesorios',costoActual:12,precioVenta:24.5,pesoUnitario:0.8,volumenUnitario:0.004,stockTotal:320,stockReservado:80,stockActual:240,ordenesTransito:0,ventas3m:95,ventas6m:180,ventas12m:370,cobertura:7.6,frecuenciaCompra:12,cantidadPromedio:1500,ultimaCompra:'2026-02-15',clientePrincipal:'Varios',concentracion:22,
consumoVenta:20,consumoInstalacion:8,consumoProyecto:4,consumoMensual:31.7,consumoTrimestral:95,consumoSemestral:180,consumoAnual:370,puntoReorden:100,inventarioMinimo:60,proyeccionComercial:{qty:32,period:'mensual',source:'Ventas',notes:'Demanda estable'},fechaVencimiento:null,stockPorVencer:0},
{sku:'P1-006',descripcion:'Producto 6',categoria:'Accesorios',costoActual:12.5,precioVenta:25,pesoUnitario:0.8,volumenUnitario:0.004,stockTotal:280,stockReservado:60,stockActual:220,ordenesTransito:0,ventas3m:88,ventas6m:165,ventas12m:340,cobertura:7.5,frecuenciaCompra:12,cantidadPromedio:1400,ultimaCompra:'2026-02-15',clientePrincipal:'Varios',concentracion:20,
consumoVenta:18,consumoInstalacion:7,consumoProyecto:4,consumoMensual:29.3,consumoTrimestral:88,consumoSemestral:165,consumoAnual:340,puntoReorden:90,inventarioMinimo:55,proyeccionComercial:{qty:30,period:'mensual',source:'Ventas',notes:'Estable'},fechaVencimiento:null,stockPorVencer:0},
{sku:'P1-007',descripcion:'Producto 7',categoria:'Accesorios',costoActual:18,precioVenta:36,pesoUnitario:1.2,volumenUnitario:0.006,stockTotal:150,stockReservado:30,stockActual:120,ordenesTransito:0,ventas3m:45,ventas6m:82,ventas12m:170,cobertura:8,frecuenciaCompra:6,cantidadPromedio:200,ultimaCompra:'2025-08-10',clientePrincipal:'Cliente D',concentracion:55,
consumoVenta:10,consumoInstalacion:3,consumoProyecto:2,consumoMensual:15,consumoTrimestral:45,consumoSemestral:82,consumoAnual:170,puntoReorden:50,inventarioMinimo:30,proyeccionComercial:{qty:15,period:'mensual',source:'Ventas',notes:'Normal'},fechaVencimiento:'2027-03-01',stockPorVencer:20},
{sku:'P1-008',descripcion:'Producto 8',categoria:'Drenaje',costoActual:180,precioVenta:340,pesoUnitario:28,volumenUnitario:0.12,stockTotal:18,stockReservado:5,stockActual:13,ordenesTransito:0,ventas3m:12,ventas6m:25,ventas12m:48,cobertura:3.3,frecuenciaCompra:8,cantidadPromedio:60,ultimaCompra:'2026-02-15',clientePrincipal:'Cliente E',concentracion:48,
consumoVenta:2,consumoInstalacion:1,consumoProyecto:1,consumoMensual:4,consumoTrimestral:12,consumoSemestral:25,consumoAnual:48,puntoReorden:16,inventarioMinimo:10,proyeccionComercial:{qty:5,period:'mensual',source:'Proyectos',notes:'Proyecto ICC fase 3'},fechaVencimiento:null,stockPorVencer:0}
],
3: [ // Proveedor 3
{sku:'P3-001',descripcion:'Producto 9',categoria:'Impermeabilización',costoActual:95,precioVenta:170,pesoUnitario:18,volumenUnitario:0.04,stockTotal:30,stockReservado:8,stockActual:22,ordenesTransito:20,ventas3m:25,ventas6m:48,ventas12m:95,cobertura:1.7,frecuenciaCompra:12,cantidadPromedio:60,ultimaCompra:'2026-06-01',clientePrincipal:'Cliente F',concentracion:35,
consumoVenta:5,consumoInstalacion:2,consumoProyecto:1,consumoMensual:8.3,consumoTrimestral:25,consumoSemestral:48,consumoAnual:95,puntoReorden:25,inventarioMinimo:15,proyeccionComercial:{qty:10,period:'mensual',source:'Ventas',notes:'Crecimiento zona Pacífico'},fechaVencimiento:'2026-12-01',stockPorVencer:10},
{sku:'P3-002',descripcion:'Producto 10',categoria:'Selladores',costoActual:42,precioVenta:78,pesoUnitario:5,volumenUnitario:0.008,stockTotal:120,stockReservado:20,stockActual:100,ordenesTransito:0,ventas3m:65,ventas6m:130,ventas12m:250,cobertura:4.6,frecuenciaCompra:15,cantidadPromedio:200,ultimaCompra:'2026-06-01',clientePrincipal:'Varios',concentracion:15,
consumoVenta:15,consumoInstalacion:5,consumoProyecto:2,consumoMensual:21.7,consumoTrimestral:65,consumoSemestral:130,consumoAnual:250,puntoReorden:70,inventarioMinimo:40,proyeccionComercial:{qty:22,period:'mensual',source:'Ventas',notes:'Estable'}},
{sku:'P3-003',descripcion:'Producto 11',categoria:'Geotextiles',costoActual:110,precioVenta:195,pesoUnitario:32,volumenUnitario:0.14,stockTotal:15,stockReservado:5,stockActual:10,ordenesTransito:10,ventas3m:12,ventas6m:22,ventas12m:45,cobertura:1.7,frecuenciaCompra:10,cantidadPromedio:40,ultimaCompra:'2026-06-01',clientePrincipal:'Cliente G',concentracion:52,
consumoVenta:2,consumoInstalacion:1,consumoProyecto:1,consumoMensual:4,consumoTrimestral:12,consumoSemestral:22,consumoAnual:45,puntoReorden:12,inventarioMinimo:8,proyeccionComercial:{qty:5,period:'mensual',source:'Proyectos',notes:'Licitación MOPT'}},
{sku:'P3-004',descripcion:'Producto 12',categoria:'Adhesivos',costoActual:18,precioVenta:35,pesoUnitario:0.4,volumenUnitario:0.001,stockTotal:500,stockReservado:100,stockActual:400,ordenesTransito:0,ventas3m:180,ventas6m:350,ventas12m:720,cobertura:6.7,frecuenciaCompra:14,cantidadPromedio:500,ultimaCompra:'2026-06-01',clientePrincipal:'Varios',concentracion:12,
consumoVenta:45,consumoInstalacion:10,consumoProyecto:5,consumoMensual:60,consumoTrimestral:180,consumoSemestral:350,consumoAnual:720,puntoReorden:200,inventarioMinimo:120,proyeccionComercial:{qty:60,period:'mensual',source:'Ventas',notes:'Alta rotación estable'}},
{sku:'P3-005',descripcion:'Producto 13',categoria:'Fijaciones',costoActual:8.5,precioVenta:18,pesoUnitario:0.6,volumenUnitario:0.003,stockTotal:400,stockReservado:50,stockActual:350,ordenesTransito:0,ventas3m:150,ventas6m:280,ventas12m:560,cobertura:7,frecuenciaCompra:12,cantidadPromedio:400,ultimaCompra:'2026-06-01',clientePrincipal:'Varios',concentracion:20,
consumoVenta:35,consumoInstalacion:10,consumoProyecto:5,consumoMensual:50,consumoTrimestral:150,consumoSemestral:280,consumoAnual:560,puntoReorden:160,inventarioMinimo:100,proyeccionComercial:{qty:50,period:'mensual',source:'Ventas',notes:'Estable'}},
{sku:'P3-006',descripcion:'Producto 14',categoria:'Imprimantes',costoActual:55,precioVenta:98,pesoUnitario:22,volumenUnitario:0.025,stockTotal:40,stockReservado:10,stockActual:30,ordenesTransito:0,ventas3m:18,ventas6m:35,ventas12m:70,cobertura:5,frecuenciaCompra:8,cantidadPromedio:50,ultimaCompra:'2026-04-15',clientePrincipal:'Cliente H',concentracion:40,
consumoVenta:4,consumoInstalacion:1,consumoProyecto:1,consumoMensual:6,consumoTrimestral:18,consumoSemestral:35,consumoAnual:70,puntoReorden:20,inventarioMinimo:12,proyeccionComercial:{qty:6,period:'mensual',source:'Ventas',notes:'Normal'}},
{sku:'P3-007',descripcion:'Producto 15',categoria:'Cintas',costoActual:22,precioVenta:42,pesoUnitario:2.5,volumenUnitario:0.01,stockTotal:80,stockReservado:15,stockActual:65,ordenesTransito:0,ventas3m:30,ventas6m:55,ventas12m:110,cobertura:6.5,frecuenciaCompra:10,cantidadPromedio:100,ultimaCompra:'2026-06-01',clientePrincipal:'Varios',concentracion:25,
consumoVenta:7,consumoInstalacion:2,consumoProyecto:1,consumoMensual:10,consumoTrimestral:30,consumoSemestral:55,consumoAnual:110,puntoReorden:35,inventarioMinimo:20,proyeccionComercial:{qty:10,period:'mensual',source:'Ventas',notes:'Estable'}},
{sku:'P3-008',descripcion:'Producto 16',categoria:'Drenaje',costoActual:145,precioVenta:260,pesoUnitario:35,volumenUnitario:0.15,stockTotal:8,stockReservado:3,stockActual:5,ordenesTransito:0,ventas3m:5,ventas6m:10,ventas12m:22,cobertura:3,frecuenciaCompra:6,cantidadPromedio:20,ultimaCompra:'2026-04-15',clientePrincipal:'Cliente I',concentracion:60,
consumoVenta:1,consumoInstalacion:0,consumoProyecto:1,consumoMensual:1.7,consumoTrimestral:5,consumoSemestral:10,consumoAnual:22,puntoReorden:6,inventarioMinimo:4,proyeccionComercial:{qty:2,period:'mensual',source:'Proyectos',notes:'Demanda baja estable'}}
]
};
// Asignar catálogos para proveedores que no tienen uno específico
SUPPLIER_CATALOGS[2] = SUPPLIER_CATALOGS[1].map((p,i)=>({...p,sku:'P2-00'+(i+1),descripcion:'Producto '+(i+24),costoActual:p.costoActual*1.05,precioVenta:p.precioVenta*1.08}));
SUPPLIER_CATALOGS[4] = SUPPLIER_CATALOGS[1].slice(0,6).map((p,i)=>({...p,sku:'P4-00'+(i+1),descripcion:'Producto '+(i+32),costoActual:p.costoActual*0.7,precioVenta:p.precioVenta*0.9,concentracion:p.concentracion+10}));
SUPPLIER_CATALOGS[5] = SUPPLIER_CATALOGS[3].slice(0,4).map((p,i)=>({...p,sku:'P5-00'+(i+1),descripcion:'Producto '+(i+38),costoActual:p.costoActual*1.3,concentracion:70}));
SUPPLIER_CATALOGS[6] = SUPPLIER_CATALOGS[1].slice(0,5).map((p,i)=>({...p,sku:'P6-00'+(i+1),descripcion:'Producto '+(i+42),costoActual:p.costoActual*1.15}));
// Nuevos proveedores consolidables (7 y 8)
SUPPLIER_CATALOGS[7] = [
{sku:'P7-001',descripcion:'Producto 17',categoria:'Recubrimientos',costoActual:68,precioVenta:125,pesoUnitario:12,volumenUnitario:0.02,stockTotal:35,stockReservado:8,stockActual:27,ordenesTransito:0,ventas3m:20,ventas6m:38,ventas12m:75,cobertura:4.1,frecuenciaCompra:9,cantidadPromedio:50,ultimaCompra:'2026-05-10',clientePrincipal:'Cliente J',concentracion:30,
consumoVenta:5,consumoInstalacion:1,consumoProyecto:1,consumoMensual:6.7,consumoTrimestral:20,consumoSemestral:38,consumoAnual:75,puntoReorden:20,inventarioMinimo:12,proyeccionComercial:{qty:7,period:'mensual',source:'Ventas',notes:'Normal'}},
{sku:'P7-002',descripcion:'Producto 18',categoria:'Epóxicos',costoActual:125,precioVenta:220,pesoUnitario:8,volumenUnitario:0.012,stockTotal:20,stockReservado:5,stockActual:15,ordenesTransito:0,ventas3m:12,ventas6m:22,ventas12m:45,cobertura:3.8,frecuenciaCompra:8,cantidadPromedio:30,ultimaCompra:'2026-05-10',clientePrincipal:'Cliente K',concentracion:42,
consumoVenta:3,consumoInstalacion:1,consumoProyecto:0,consumoMensual:4,consumoTrimestral:12,consumoSemestral:22,consumoAnual:45,puntoReorden:12,inventarioMinimo:8,proyeccionComercial:{qty:4,period:'mensual',source:'Ventas',notes:'Estable'}},
{sku:'P7-003',descripcion:'Producto 19',categoria:'Selladores',costoActual:52,precioVenta:95,pesoUnitario:5.2,volumenUnitario:0.008,stockTotal:60,stockReservado:10,stockActual:50,ordenesTransito:0,ventas3m:28,ventas6m:52,ventas12m:105,cobertura:5.4,frecuenciaCompra:10,cantidadPromedio:80,ultimaCompra:'2026-05-10',clientePrincipal:'Varios',concentracion:18,
consumoVenta:6,consumoInstalacion:2,consumoProyecto:1,consumoMensual:9.3,consumoTrimestral:28,consumoSemestral:52,consumoAnual:105,puntoReorden:30,inventarioMinimo:18,proyeccionComercial:{qty:10,period:'mensual',source:'Ventas',notes:'Crecimiento leve'}},
{sku:'P7-004',descripcion:'Producto 20',categoria:'Imprimantes',costoActual:38,precioVenta:72,pesoUnitario:20,volumenUnitario:0.025,stockTotal:25,stockReservado:5,stockActual:20,ordenesTransito:0,ventas3m:10,ventas6m:18,ventas12m:38,cobertura:6,frecuenciaCompra:6,cantidadPromedio:25,ultimaCompra:'2026-03-20',clientePrincipal:'Cliente H',concentracion:38,
consumoVenta:2,consumoInstalacion:1,consumoProyecto:0,consumoMensual:3.3,consumoTrimestral:10,consumoSemestral:18,consumoAnual:38,puntoReorden:10,inventarioMinimo:6,proyeccionComercial:{qty:3,period:'mensual',source:'Ventas',notes:'Normal'}}
];
SUPPLIER_CATALOGS[8] = [
{sku:'P8-001',descripcion:'Producto 21',categoria:'Selladores',costoActual:15,precioVenta:30,pesoUnitario:0.4,volumenUnitario:0.001,stockTotal:300,stockReservado:40,stockActual:260,ordenesTransito:0,ventas3m:120,ventas6m:230,ventas12m:450,cobertura:6.5,frecuenciaCompra:11,cantidadPromedio:300,ultimaCompra:'2026-06-15',clientePrincipal:'Varios',concentracion:14,
consumoVenta:30,consumoInstalacion:8,consumoProyecto:2,consumoMensual:40,consumoTrimestral:120,consumoSemestral:230,consumoAnual:450,puntoReorden:130,inventarioMinimo:80,proyeccionComercial:{qty:42,period:'mensual',source:'Ventas',notes:'Alta rotación'}},
{sku:'P8-002',descripcion:'Producto 22',categoria:'Cintas',costoActual:8,precioVenta:17,pesoUnitario:0.6,volumenUnitario:0.002,stockTotal:200,stockReservado:30,stockActual:170,ordenesTransito:0,ventas3m:80,ventas6m:155,ventas12m:310,cobertura:6.4,frecuenciaCompra:10,cantidadPromedio:200,ultimaCompra:'2026-06-15',clientePrincipal:'Varios',concentracion:16,
consumoVenta:20,consumoInstalacion:5,consumoProyecto:2,consumoMensual:26.7,consumoTrimestral:80,consumoSemestral:155,consumoAnual:310,puntoReorden:85,inventarioMinimo:50,proyeccionComercial:{qty:28,period:'mensual',source:'Ventas',notes:'Estable'}},
{sku:'P8-003',descripcion:'Producto 23',categoria:'Impermeabilización',costoActual:72,precioVenta:135,pesoUnitario:22,volumenUnitario:0.025,stockTotal:18,stockReservado:4,stockActual:14,ordenesTransito:0,ventas3m:8,ventas6m:15,ventas12m:32,cobertura:5.3,frecuenciaCompra:7,cantidadPromedio:20,ultimaCompra:'2026-06-15',clientePrincipal:'Cliente A',concentracion:45,
consumoVenta:2,consumoInstalacion:1,consumoProyecto:0,consumoMensual:2.7,consumoTrimestral:8,consumoSemestral:15,consumoAnual:32,puntoReorden:8,inventarioMinimo:5,proyeccionComercial:{qty:3,period:'mensual',source:'Ventas',notes:'Normal'}}
];

// Asignar fechaVencimiento y stockPorVencer a productos que no lo tengan
Object.values(SUPPLIER_CATALOGS).forEach(cat=>cat.forEach(p=>{if(p.fechaVencimiento===undefined){p.fechaVencimiento=null;p.stockPorVencer=0;}}));

// Combinaciones históricas por proveedor
const HISTORICAL_COMBOS = {
1: [
{id:'combo-1',nombre:'Combo Europa 40FT — Impermeabilización',veces:8,ultimaFecha:'2026-02-15',contenedor:'40 pies',numProductos:7,pesoUsado:23500,volumenUsado:58.2,utilizacion:92,costoLogistico:9800,tiempoTransito:32,exito:'Alto',productos:['P1-001','P1-002','P1-003','P1-005','P1-006','P1-007','P1-008'],cantidades:{
'P1-001':400,'P1-002':80,'P1-003':3000,'P1-005':1500,'P1-006':1400,'P1-007':200,'P1-008':60}},
{id:'combo-2',nombre:'Combo Membranas + Accesorios',veces:5,ultimaFecha:'2025-11-20',contenedor:'40 pies',numProductos:5,pesoUsado:19800,volumenUsado:45.6,utilizacion:78,costoLogistico:9200,tiempoTransito:34,exito:'Medio',productos:['P1-002','P1-004','P1-003','P1-005','P1-006'],cantidades:{
'P1-002':60,'P1-004':40,'P1-003':2000,'P1-005':1000,'P1-006':1000}},
{id:'combo-3',nombre:'Combo Reposición Rápida',veces:3,ultimaFecha:'2025-08-10',contenedor:'20 pies',numProductos:4,pesoUsado:15200,volumenUsado:22.8,utilizacion:85,costoLogistico:6500,tiempoTransito:35,exito:'Alto',productos:['P1-001','P1-003','P1-005','P1-006'],cantidades:{
'P1-001':300,'P1-003':2000,'P1-005':800,'P1-006':700}}
],
3: [
{id:'combo-4',nombre:'Combo USA Consolidado — Mix Completo',veces:10,ultimaFecha:'2026-06-01',contenedor:'Consolidado',numProductos:6,pesoUsado:4200,volumenUsado:8.5,utilizacion:78,costoLogistico:4500,tiempoTransito:18,exito:'Alto',productos:['P3-001','P3-002','P3-004','P3-005','P3-007','P3-006'],cantidades:{
'P3-001':60,'P3-002':200,'P3-004':500,'P3-005':400,'P3-007':100,'P3-006':50}},
{id:'combo-5',nombre:'Combo Geotextiles + Drenaje',veces:4,ultimaFecha:'2026-04-15',contenedor:'Consolidado',numProductos:4,pesoUsado:3800,volumenUsado:9.2,utilizacion:72,costoLogistico:4800,tiempoTransito:20,exito:'Medio',productos:['P3-003','P3-008','P3-001','P3-006'],cantidades:{
'P3-003':40,'P3-008':20,'P3-001':30,'P3-006':30}},
{id:'combo-6',nombre:'Combo Impermeabilización Integral',veces:6,ultimaFecha:'2026-05-10',contenedor:'Consolidado',numProductos:5,pesoUsado:3500,volumenUsado:7.1,utilizacion:68,costoLogistico:4200,tiempoTransito:17,exito:'Medio',productos:['P3-001','P3-002','P3-006','P3-007','P3-004'],cantidades:{
'P3-001':50,'P3-002':150,'P3-006':40,'P3-007':80,'P3-004':300}}
]
};
HISTORICAL_COMBOS[2]=HISTORICAL_COMBOS[1].map(c=>({...c,id:c.id+'-p2',nombre:c.nombre.replace('Europa','Proveedor 2')}));
HISTORICAL_COMBOS[4]=[{id:'combo-sh1',nombre:'Combo Asia 40FT — Volumen',veces:4,ultimaFecha:'2026-03-10',contenedor:'40 pies',numProductos:5,pesoUsado:24000,volumenUsado:55,utilizacion:91,costoLogistico:12500,tiempoTransito:45,exito:'Medio',productos:SUPPLIER_CATALOGS[4].map(p=>p.sku).slice(0,5),cantidades:{}}];

// Órdenes en tránsito y seguimiento
const TRANSIT_RECORDS = [
{id:'TR-001',simId:'SIM-2026-004',proveedor:'Proveedor 2',ordenCompra:'OC-2026-042',ordenSAP:'4500001285',embarque:'MAEU-2026-7845',contenedor:'MSCU-4521876',naviera:'Maersk Line',operador:'Grupo Montecristo',puertoOrigen:'Rotterdam, Países Bajos',fechaSalida:'2026-07-01',ubicacionActual:'En tránsito - Atlántico',proximoPuerto:'Puerto Limón, Costa Rica',fechaEstimada:'2026-08-05',diasRestantes:7,estadoAduanero:'Pendiente',ultimaActualizacion:'2026-07-28',estado:'transito',milestones:['preparando','despachada','puerto_origen','transito']},
{id:'TR-002',simId:'SIM-2026-001',proveedor:'Proveedor 1',ordenCompra:'OC-2026-038',ordenSAP:'4500001282',embarque:'HLCU-2026-3312',contenedor:'HLXU-8834521',naviera:'Hapag-Lloyd',operador:'Grupo Montecristo',puertoOrigen:'Valencia, España',fechaSalida:'2026-06-20',ubicacionActual:'Puerto Limón - En aduana',proximoPuerto:'N/A',fechaEstimada:'2026-07-30',diasRestantes:1,estadoAduanero:'En proceso de liberación',ultimaActualizacion:'2026-07-29',estado:'aduana',milestones:['preparando','despachada','puerto_origen','transito','puerto_intermedio','proxima_llegada','aduana']},
{id:'TR-003',simId:'SIM-2026-008',proveedor:'Proveedor 3',ordenCompra:'OC-2026-045',ordenSAP:'4500001288',embarque:'OOLU-2026-1198',contenedor:'Consolidado',naviera:'OOCL',operador:'DHL Global',puertoOrigen:'Houston, TX',fechaSalida:'2026-07-15',ubicacionActual:'En tránsito - Caribe',proximoPuerto:'Puerto Limón, Costa Rica',fechaEstimada:'2026-08-12',diasRestantes:14,estadoAduanero:'Pendiente',ultimaActualizacion:'2026-07-27',estado:'transito',milestones:['preparando','despachada','puerto_origen','transito']}
];

// Órdenes de compra generadas
const PURCHASE_ORDERS = [
{id:'OC-2026-038',simId:'SIM-2026-001',proveedor:'Proveedor 1',fecha:'2026-06-16',estado:'enviada',sapOrder:'4500001282',total:48500,productos:4},
{id:'OC-2026-042',simId:'SIM-2026-004',proveedor:'Proveedor 2',fecha:'2026-07-02',estado:'sap',sapOrder:'4500001285',total:35800,productos:5},
{id:'OC-2026-045',simId:'SIM-2026-008',proveedor:'Proveedor 3',fecha:'2026-07-13',estado:'enviada',sapOrder:'4500001288',total:15800,productos:6}
];

// Reglas avanzadas
const DEFAULT_ADVANCED_RULES = [
{id:'R001',nombre:'Contenedor completo Europa',descripcion:'Utilizar contenedor completo para compras desde Europa',nivel:'Región',region:'Europa',proveedor:'',producto:'',incoterm:'',condicion:'Region = Europa',resultado:'Sugerir contenedor 40 pies',prioridad:1,activa:true,vigencia:'2026-12-31'},
{id:'R002',nombre:'Cobertura mínima 3 meses',descripcion:'Mantener cobertura mínima de 3 meses para productos de alta rotación',nivel:'General',region:'',proveedor:'',producto:'',incoterm:'',condicion:'Rotación > 50 unidades/mes',resultado:'Cantidad sugerida = ventas 3m × 1.5',prioridad:2,activa:true,vigencia:'2026-12-31'},
{id:'R003',nombre:'CIF sin flete ni seguro',descripcion:'Para Incoterm CIF no solicitar flete internacional ni seguro',nivel:'Incoterm',region:'',proveedor:'',producto:'',incoterm:'CIF',condicion:'Incoterm = CIF',resultado:'Desactivar campos flete y seguro',prioridad:1,activa:true,vigencia:'2026-12-31'},
{id:'R004',nombre:'Alerta utilización baja',descripcion:'Generar alerta cuando utilización sea inferior al 80%',nivel:'General',region:'',proveedor:'',producto:'',incoterm:'',condicion:'Utilización < 80%',resultado:'Mostrar alerta naranja',prioridad:3,activa:true,vigencia:'2026-12-31'},
{id:'R005',nombre:'Reducir baja rotación',descripcion:'Reducir cantidad sugerida en 30% para productos de baja rotación',nivel:'Producto',region:'',proveedor:'',producto:'',incoterm:'',condicion:'Ventas 6m < 20 unidades',resultado:'Cantidad × 0.7',prioridad:2,activa:true,vigencia:'2026-12-31'},
{id:'R006',nombre:'Proveedor 1 contenedor completo',descripcion:'Proveedor 1 siempre en contenedor completo',nivel:'Proveedor',region:'',proveedor:'Proveedor 1',producto:'',incoterm:'',condicion:'Proveedor = Proveedor 1',resultado:'Contenedor 40 pies',prioridad:1,activa:true,vigencia:'2026-12-31'}
];

const ESTADOS_MAP = {borrador:'Borrador',aprobado:'Aprobada',rechazado:'Rechazada',oc_generada:'OC creada'};

const DEFAULT_SIMULACIONES = [
{id:'SIM-2026-001',fecha:'2026-06-15',motivo:'Compra completa por proveedor',proveedor:'Proveedor 1',tipoProveedor:'Recurrente',pais:'España',region:'Europa',incoterm:'CIF',tipoCarga:'40 pies',numProductos:7,totalCompra:48500,costoCR:62150,utilizacion:92,recomendacion:'COMPRAR',estado:'oc_generada',fechaLlegada:'2026-07-30',responsable:'Carlos Méndez',sapOrder:'4500001282'},
{id:'SIM-2026-002',fecha:'2026-06-20',motivo:'Reposición de productos',proveedor:'Proveedor 3',tipoProveedor:'Recurrente',pais:'Estados Unidos',region:'Estados Unidos',incoterm:'FCA',tipoCarga:'Consolidado',numProductos:5,totalCompra:22300,costoCR:28900,utilizacion:75,recomendacion:'COMPRAR CON AJUSTES',estado:'aprobado',fechaLlegada:'2026-08-10',responsable:'Ana Solano',sapOrder:null},
{id:'SIM-2026-003',fecha:'2026-06-22',motivo:'Producto nuevo',proveedor:'Proveedor 6',tipoProveedor:'Nuevo',pais:'Alemania',region:'Europa',incoterm:'EXW',tipoCarga:'40 pies',numProductos:4,totalCompra:67200,costoCR:89400,utilizacion:55,recomendacion:'ESPERAR',estado:'borrador',fechaLlegada:null,responsable:'Carlos Méndez',sapOrder:null},
{id:'SIM-2026-004',fecha:'2026-07-01',motivo:'Compra completa por proveedor',proveedor:'Proveedor 2',tipoProveedor:'Recurrente',pais:'Suiza',region:'Europa',incoterm:'FOB',tipoCarga:'40 pies',numProductos:6,totalCompra:35800,costoCR:47200,utilizacion:88,recomendacion:'COMPRAR',estado:'oc_generada',fechaLlegada:'2026-08-05',responsable:'Roberto Fallas',sapOrder:'4500001285'},
{id:'SIM-2026-005',fecha:'2026-07-05',motivo:'Importación extraordinaria',proveedor:'Proveedor 4',tipoProveedor:'Recurrente',pais:'China',region:'Asia',incoterm:'FOB',tipoCarga:'40 pies',numProductos:5,totalCompra:41200,costoCR:58700,utilizacion:91,recomendacion:'NO COMPRAR',estado:'rechazado',fechaLlegada:null,responsable:'Ana Solano',sapOrder:null},
{id:'SIM-2026-006',fecha:'2026-07-08',motivo:'Compra completa por proveedor',proveedor:'Proveedor 1',tipoProveedor:'Recurrente',pais:'España',region:'Europa',incoterm:'CIF',tipoCarga:'40 pies',numProductos:7,totalCompra:52100,costoCR:67800,utilizacion:89,recomendacion:'COMPRAR',estado:'aprobado',fechaLlegada:'2026-09-15',responsable:'Carlos Méndez',sapOrder:null},
{id:'SIM-2026-007',fecha:'2026-07-10',motivo:'Producto nuevo',proveedor:'Proveedor 5',tipoProveedor:'Nuevo',pais:'Colombia',region:'Sudamérica',incoterm:'CIF',tipoCarga:'20 pies',numProductos:3,totalCompra:18500,costoCR:24200,utilizacion:42,recomendacion:'NO COMPRAR',estado:'rechazado',fechaLlegada:null,responsable:'Roberto Fallas',sapOrder:null},
{id:'SIM-2026-008',fecha:'2026-07-12',motivo:'Reposición de productos',proveedor:'Proveedor 3',tipoProveedor:'Recurrente',pais:'Estados Unidos',region:'Estados Unidos',incoterm:'FCA',tipoCarga:'Consolidado',numProductos:6,totalCompra:15800,costoCR:20100,utilizacion:78,recomendacion:'COMPRAR',estado:'oc_generada',fechaLlegada:'2026-08-12',responsable:'Ana Solano',sapOrder:'4500001288'},
{id:'SIM-2026-009',fecha:'2026-07-14',motivo:'Compra completa por proveedor',proveedor:'Proveedor 2',tipoProveedor:'Recurrente',pais:'Suiza',region:'Europa',incoterm:'FOB',tipoCarga:'40 pies',numProductos:5,totalCompra:44600,costoCR:58900,utilizacion:85,recomendacion:'COMPRAR',estado:'borrador',fechaLlegada:null,responsable:'Carlos Méndez',sapOrder:null},
{id:'SIM-2026-010',fecha:'2026-07-16',motivo:'Reposición de productos',proveedor:'Proveedor 4',tipoProveedor:'Recurrente',pais:'China',region:'Asia',incoterm:'FOB',tipoCarga:'40 pies',numProductos:4,totalCompra:38900,costoCR:54200,utilizacion:86,recomendacion:'COMPRAR CON AJUSTES',estado:'borrador',fechaLlegada:null,responsable:'Roberto Fallas',sapOrder:null},
// Casos demo v3.0
{id:'SIM-2026-011',fecha:'2026-07-20',motivo:'Compra completa por proveedor',proveedor:'Proveedor 1',tipoProveedor:'Recurrente',pais:'España',region:'Europa',incoterm:'CIF',tipoCarga:'40 pies',numProductos:8,totalCompra:36000,costoCR:45500,utilizacion:74,recomendacion:'COMPRAR',estado:'borrador',fechaLlegada:null,responsable:'Carlos Méndez',sapOrder:null,tipoImportacion:'regular',notas:'Caso 1: Contenedor completo. Pedido base $36k, objetivo $45k. Motor sugiere productos adicionales. Utilización sube a 91%.'},
{id:'SIM-2026-012',fecha:'2026-07-22',motivo:'Necesidad comercial',proveedor:'Proveedor 3',tipoProveedor:'Recurrente',pais:'Estados Unidos',region:'Estados Unidos',incoterm:'FCA',tipoCarga:'Consolidado',numProductos:12,totalCompra:28500,costoCR:36200,utilizacion:86,recomendacion:'COMPRAR',estado:'borrador',fechaLlegada:null,responsable:'Ana Solano',sapOrder:null,tipoImportacion:'consolidada',notas:'Caso 2: Consolidado 3 proveedores (Proveedor 3+7+8) en Miami. 12 productos, $28.5k, utilización 86%.'},
{id:'SIM-2026-013',fecha:'2026-07-24',motivo:'Reposición de productos',proveedor:'Proveedor 2',tipoProveedor:'Recurrente',pais:'Suiza',region:'Europa',incoterm:'FOB',tipoCarga:'40 pies',numProductos:6,totalCompra:42000,costoCR:55800,utilizacion:78,recomendacion:'COMPRAR CON AJUSTES',estado:'borrador',fechaLlegada:null,responsable:'Carlos Méndez',sapOrder:null,tipoImportacion:'regular',notas:'Caso 3: Motor NO agrega producto porque generaría 11.3 meses de cobertura (sobre-stock).'},
{id:'SIM-2026-014',fecha:'2026-07-26',motivo:'Compra completa por proveedor',proveedor:'Proveedor 2',tipoProveedor:'Recurrente',pais:'Suiza',region:'Europa',incoterm:'FOB',tipoCarga:'40 pies',numProductos:5,totalCompra:35000,costoCR:46500,utilizacion:82,recomendacion:'ESPERAR',estado:'borrador',fechaLlegada:null,responsable:'Roberto Fallas',sapOrder:null,tipoImportacion:'regular',notas:'Caso 4: Cotización vencida. Sistema bloquea recomendación. Score penalizado -25.'},
{id:'SIM-2026-015',fecha:'2026-07-28',motivo:'Proyecto específico',proveedor:'Proveedor 1',tipoProveedor:'Recurrente',pais:'España',region:'Europa',incoterm:'CIF',tipoCarga:'Consolidado',numProductos:4,totalCompra:18000,costoCR:24500,utilizacion:65,recomendacion:'COMPRAR CON AJUSTES',estado:'borrador',fechaLlegada:null,responsable:'Ana Solano',sapOrder:null,tipoImportacion:'pedido_especial',notas:'Caso 5: Pedido especial. Proveedor normalmente contenedor completo. Excepción aprobada para consolidado urgente.'}
];

// Ventas mensuales determinísticas
const VENTAS_MENSUALES={};
const seeds=[12,8,15,10,13,9,11,14,32,10,12,11,9,13,11,10,14,12,8,11,13,10,12,9];
(SUPPLIER_CATALOGS[1]||[]).forEach((p,pi)=>{const base=p.ventas3m/3;VENTAS_MENSUALES[p.sku]=seeds.map((s,i)=>Math.round(base*(s/12)));});
(SUPPLIER_CATALOGS[3]||[]).forEach((p,pi)=>{const base=p.ventas3m/3;VENTAS_MENSUALES[p.sku]=seeds.map((s,i)=>Math.round(base*(s/12)));});

// ===== COTIZACIONES ABIERTAS =====
const DEFAULT_COTIZACIONES = [
{id:'COT-2026-001',proveedor:'Proveedor 1',proveedorId:1,fechaEmision:'2026-07-15',fechaVencimiento:'2026-08-29',estado:'vigente',moneda:'EUR',totalUSD:48500,productos:['P1-001','P1-002','P1-003','P1-004','P1-005','P1-006','P1-007','P1-008'],observaciones:'Cotización completa catálogo',
items:[{sku:'P1-001',costoNuevo:88},{sku:'P1-002',costoNuevo:335},{sku:'P1-003',costoNuevo:4.8},{sku:'P1-004',costoNuevo:310},{sku:'P1-005',costoNuevo:12.5},{sku:'P1-006',costoNuevo:13},{sku:'P1-007',costoNuevo:19},{sku:'P1-008',costoNuevo:190}]},
{id:'COT-2026-002',proveedor:'Proveedor 3',proveedorId:3,fechaEmision:'2026-07-20',fechaVencimiento:'2026-08-19',estado:'vigente',moneda:'USD',totalUSD:15800,productos:['P3-001','P3-002','P3-003','P3-004','P3-005','P3-006','P3-007','P3-008'],observaciones:'Lista de precios actualizada Q3',
items:[{sku:'P3-001',costoNuevo:98},{sku:'P3-002',costoNuevo:44},{sku:'P3-003',costoNuevo:118},{sku:'P3-004',costoNuevo:19},{sku:'P3-005',costoNuevo:9},{sku:'P3-006',costoNuevo:58},{sku:'P3-007',costoNuevo:23},{sku:'P3-008',costoNuevo:152}]},
{id:'COT-2026-003',proveedor:'Proveedor 7',proveedorId:7,fechaEmision:'2026-07-25',fechaVencimiento:'2026-08-24',estado:'vigente',moneda:'USD',totalUSD:9200,productos:['P7-001','P7-002','P7-003','P7-004'],observaciones:'Precios consolidado Miami',
items:[{sku:'P7-001',costoNuevo:70},{sku:'P7-002',costoNuevo:128},{sku:'P7-003',costoNuevo:54},{sku:'P7-004',costoNuevo:39}]},
{id:'COT-2026-004',proveedor:'Proveedor 8',proveedorId:8,fechaEmision:'2026-07-28',fechaVencimiento:'2026-08-27',estado:'vigente',moneda:'USD',totalUSD:6800,productos:['P8-001','P8-002','P8-003'],observaciones:'Precios consolidado Miami',
items:[{sku:'P8-001',costoNuevo:15.5},{sku:'P8-002',costoNuevo:8.2},{sku:'P8-003',costoNuevo:74}]},
{id:'COT-2026-005',proveedor:'Proveedor 2',proveedorId:2,fechaEmision:'2026-06-01',fechaVencimiento:'2026-07-15',estado:'vencida',moneda:'EUR',totalUSD:35000,productos:['SKA-PT-25','SKA-HS-12'],observaciones:'Cotización vencida — requiere renovación',
items:[{sku:'P2-001',costoNuevo:92},{sku:'P2-002',costoNuevo:340}]},
{id:'COT-2026-006',proveedor:'Proveedor 4',proveedorId:4,fechaEmision:'2026-08-10',fechaVencimiento:'2026-09-09',estado:'en_evaluacion',moneda:'USD',totalUSD:28000,productos:['SH-PT-25','SH-HS-12','SH-PVC-B','SH-FV-12','SH-EI-01','SH-EE-01'],observaciones:'Evaluación de costos Asia',
items:[{sku:'P4-001',costoNuevo:62},{sku:'P4-002',costoNuevo:230},{sku:'P4-003',costoNuevo:3.2},{sku:'P4-004',costoNuevo:210},{sku:'P4-005',costoNuevo:8.5},{sku:'P4-006',costoNuevo:9}]}
];

// ===== USUARIOS Y CONSUMO =====
const DEFAULT_USUARIOS = [
{id:1,nombre:'Carlos Méndez',email:'cmendez@renteco.com',rol:'comercial',activo:true,maxSimulaciones:80,simulacionesUsadas:42,ultimoAcceso:'2026-08-18'},
{id:2,nombre:'Ana Solano',email:'asolano@renteco.com',rol:'importaciones',activo:true,maxSimulaciones:120,simulacionesUsadas:87,ultimoAcceso:'2026-08-19'},
{id:3,nombre:'Roberto Fallas',email:'rfallas@renteco.com',rol:'aprobador',activo:true,maxSimulaciones:50,simulacionesUsadas:15,ultimoAcceso:'2026-08-17'},
{id:4,nombre:'Administrador',email:'admin@renteco.com',rol:'admin',activo:true,maxSimulaciones:200,simulacionesUsadas:5,ultimoAcceso:'2026-08-19'},
{id:5,nombre:'Laura Campos',email:'lcampos@renteco.com',rol:'comercial',activo:true,maxSimulaciones:60,simulacionesUsadas:38,ultimoAcceso:'2026-08-16'},
{id:6,nombre:'Diego Vargas',email:'dvargas@renteco.com',rol:'importaciones',activo:false,maxSimulaciones:80,simulacionesUsadas:0,ultimoAcceso:'2026-06-10'}
];

const DEFAULT_CONSUMO = {
mesActual:'2026-08',
simulaciones:{limite:500,usadas:187,historial:[
{mes:'2026-07',usadas:342},{mes:'2026-06',usadas:415},{mes:'2026-05',usadas:289},{mes:'2026-04',usadas:378},{mes:'2026-03',usadas:295}
]},
extractorIA:{limite:4500,usadas:1823,historial:[
{mes:'2026-07',usadas:3150},{mes:'2026-06',usadas:2890},{mes:'2026-05',usadas:3420},{mes:'2026-04',usadas:2100},{mes:'2026-03',usadas:2750}
]}
};

// ===== MOTORES DE CÁLCULO v3.0 =====

/**
 * Calcula la necesidad de compra de un producto
 * @param {Object} product - Producto del catálogo
 * @param {Object} rules - Reglas del sistema
 * @returns {Object} Resultado con stock disponible, consumo, cobertura, cantidad sugerida
 */
function calculatePurchaseNeed(product, rules) {
    rules = rules || APP.rules;
    const stockDisponible = (product.stockTotal || product.stockActual || 0) - (product.stockReservado || 0);
    const consumoMensual = product.consumoMensual || (product.ventas3m / 3) || 1;
    const coberturaActual = stockDisponible / consumoMensual;
    const ordenesTransito = product.ordenesTransito || 0;
    const stockEfectivo = stockDisponible + ordenesTransito;
    const coberturaEfectiva = stockEfectivo / consumoMensual;
    const puntoReorden = product.puntoReorden || Math.ceil(consumoMensual * 2);
    const coberturaObj = rules.coberturaObjetivo || 4;

    // Cantidad base sugerida: alcanzar cobertura objetivo
    let baseSuggestedQty = 0;
    if (stockEfectivo < puntoReorden || coberturaEfectiva < coberturaObj) {
        baseSuggestedQty = Math.ceil((coberturaObj * consumoMensual) - stockEfectivo);
        if (baseSuggestedQty < 0) baseSuggestedQty = 0;
    }

    // Ajuste por proyección comercial
    let commercialAdjustment = 0;
    if (product.proyeccionComercial && product.proyeccionComercial.qty) {
        const proyMensual = product.proyeccionComercial.qty;
        if (proyMensual > consumoMensual) {
            commercialAdjustment = Math.ceil((proyMensual - consumoMensual) * coberturaObj);
        }
    }

    // Considerar stock por vencer
    let vencimientoUrgente = false;
    if (product.fechaVencimiento && product.stockPorVencer > 0) {
        const diasVenc = Math.ceil((new Date(product.fechaVencimiento) - new Date()) / (1000*60*60*24));
        if (diasVenc < 90) {
            vencimientoUrgente = true;
            const stockEfectivoSinVencer = stockDisponible - product.stockPorVencer;
            if (stockEfectivoSinVencer < puntoReorden && baseSuggestedQty === 0) {
                baseSuggestedQty = Math.ceil((coberturaObj * consumoMensual) - (stockEfectivoSinVencer + ordenesTransito));
                if (baseSuggestedQty < 0) baseSuggestedQty = 0;
            }
        }
    }
    const finalSuggestedQty = Math.max(0, baseSuggestedQty + commercialAdjustment);

    // Razón de la sugerencia
    let reason = '';
    if (vencimientoUrgente) reason = `Stock por vencer (${product.stockPorVencer}u en ${product.fechaVencimiento}). Requiere reposición.`;
    else if (stockDisponible <= 0) reason = 'Sin stock disponible real (reservado completo).';
    else if (coberturaEfectiva < 2) reason = 'Cobertura crítica (<2 meses). Reposición urgente.';
    else if (stockEfectivo < puntoReorden) reason = 'Stock por debajo del punto de reorden.';
    else if (coberturaEfectiva < coberturaObj) reason = `Cobertura (${coberturaEfectiva.toFixed(1)}m) menor al objetivo (${coberturaObj}m).`;
    else if (commercialAdjustment > 0) reason = 'Ajuste por proyección comercial superior al histórico.';
    else reason = 'Cobertura adecuada. Sin necesidad inmediata.';

    return {
        stockTotal: product.stockTotal || product.stockActual || 0,
        stockReservado: product.stockReservado || 0,
        availableStock: stockDisponible,
        ordenesTransito,
        stockEfectivo,
        averageMonthlyConsumption: consumoMensual,
        consumoVenta: product.consumoVenta || 0,
        consumoInstalacion: product.consumoInstalacion || 0,
        consumoProyecto: product.consumoProyecto || 0,
        currentCoverageMonths: coberturaActual,
        effectiveCoverageMonths: coberturaEfectiva,
        reorderPoint: puntoReorden,
        baseSuggestedQty,
        commercialAdjustment,
        finalSuggestedQty,
        reason,
        needsPurchase: finalSuggestedQty > 0 || vencimientoUrgente,
        urgency: vencimientoUrgente ? 'critica' : coberturaEfectiva < 2 ? 'critica' : coberturaEfectiva < coberturaObj ? 'necesaria' : 'opcional'
    };
}

/**
 * Calcula la rotación proyectada si se agrega cantidad adicional
 * @param {Object} product - Producto del catálogo
 * @param {Number} additionalQty - Cantidad adicional a agregar
 * @param {Object} rules - Reglas del sistema
 * @returns {Object} Proyección de rotación
 */
function calculateProjectedRotation(product, additionalQty, rules) {
    rules = rules || APP.rules;
    const consumoMensual = product.consumoMensual || (product.ventas3m / 3) || 1;
    const stockDisponible = (product.stockTotal || product.stockActual || 0) - (product.stockReservado || 0);
    const ordenesTransito = product.ordenesTransito || 0;
    const stockActualEfectivo = stockDisponible + ordenesTransito;
    const coberturaActual = stockActualEfectivo / consumoMensual;
    const stockPosterior = stockActualEfectivo + additionalQty;
    const coberturaPosterior = stockPosterior / consumoMensual;
    const mesesRotacionAdicional = additionalQty / consumoMensual;

    // Fecha estimada de normalización (cuando el stock adicional se haya consumido)
    const hoy = new Date();
    const mesesHastaConsumo = coberturaPosterior;
    const fechaNormalizacion = new Date(hoy);
    fechaNormalizacion.setMonth(fechaNormalizacion.getMonth() + Math.ceil(mesesHastaConsumo));

    // Clasificación
    const umbrales = rules.clasificacionRotacion || {excelente:3,aceptable:6,riesgoModerado:9};
    let clasificacion;
    if (mesesRotacionAdicional <= umbrales.excelente) clasificacion = 'Excelente';
    else if (mesesRotacionAdicional <= umbrales.aceptable) clasificacion = 'Aceptable';
    else if (mesesRotacionAdicional <= umbrales.riesgoModerado) clasificacion = 'Riesgo moderado';
    else clasificacion = 'Sobre-stock';

    const esSobreStock = coberturaPosterior > (rules.coberturaMaxima || 9);

    return {
        coberturaActual: coberturaActual,
        coberturaPosterior: coberturaPosterior,
        mesesRotacionAdicional: mesesRotacionAdicional,
        fechaNormalizacion: fechaNormalizacion.toISOString().split('T')[0],
        fechaNormalizacionTexto: fechaNormalizacion.toLocaleString('es-CR', {month:'long', year:'numeric'}),
        clasificacion,
        esSobreStock,
        razonSobreStock: esSobreStock ? `Generaría ${coberturaPosterior.toFixed(1)} meses de cobertura (máximo: ${rules.coberturaMaxima || 9}).` : null
    };
}

/**
 * Optimiza el pedido para alcanzar monto/capacidad objetivo
 * @param {Array} selectedProducts - Productos ya seleccionados con cantidades
 * @param {Array} allProducts - Todos los productos disponibles del proveedor
 * @param {Object} supplier - Proveedor
 * @param {Object} rules - Reglas del sistema
 * @param {String} containerType - Tipo de contenedor
 * @returns {Object} Resultado de optimización
 */
function optimizeOrder(selectedProducts, allProducts, supplier, rules, containerType) {
    rules = rules || APP.rules;
    const caps = getCaps(containerType || supplier.usualContainer || '40 pies');

    // Calcular pedido base
    const pedidoBase = selectedProducts.reduce((sum, p) => sum + (p.cantidad || 0) * (p.costoCotizado || p.costoActual), 0);
    const pesoBase = selectedProducts.reduce((sum, p) => sum + (p.cantidad || 0) * p.pesoUnitario, 0);
    const volumenBase = selectedProducts.reduce((sum, p) => sum + (p.cantidad || 0) * p.volumenUnitario, 0);

    const montoMinimo = supplier.minimumOrderValue || 0;
    const montoObjetivo = supplier.targetOrderValue || 0;
    const faltanteMinimo = Math.max(0, montoMinimo - pedidoBase);
    const faltanteObjetivo = Math.max(0, montoObjetivo - pedidoBase);
    const utilizacionPeso = (pesoBase / caps.peso) * 100;
    const utilizacionVol = (volumenBase / caps.vol) * 100;
    const utilizacionActual = Math.max(utilizacionPeso, utilizacionVol);

    // Identificar productos candidatos adicionales
    const skusSeleccionados = selectedProducts.map(p => p.sku);
    const candidatos = [];

    allProducts.forEach(p => {
        if (skusSeleccionados.includes(p.sku)) return;
        const need = calculatePurchaseNeed(p, rules);
        const consumoMensual = p.consumoMensual || (p.ventas3m / 3) || 1;
        const cantSugerida = need.finalSuggestedQty > 0 ? need.finalSuggestedQty : Math.ceil(consumoMensual * 3);
        const valorAdicional = cantSugerida * (p.costoActual);
        const pesoAdicional = cantSugerida * p.pesoUnitario;
        const volumenAdicional = cantSugerida * p.volumenUnitario;

        // Validar rotación antes de agregar
        const rotacion = calculateProjectedRotation(p, cantSugerida, rules);

        // No recomendar si genera sobre-stock
        if (rotacion.esSobreStock) {
            candidatos.push({
                ...p,
                cantidadSugerida: cantSugerida,
                valorAdicional,
                pesoAdicional,
                volumenAdicional,
                coberturaAntes: rotacion.coberturaActual,
                coberturaDespues: rotacion.coberturaPosterior,
                tiempoRotacion: rotacion.mesesRotacionAdicional,
                clasificacionRotacion: rotacion.clasificacion,
                margenEsperado: ((p.precioVenta - p.costoActual) / p.precioVenta * 100),
                motivo: rotacion.razonSobreStock,
                recomendado: false,
                razonNoRecomendado: `No recomendado: generaría ${rotacion.coberturaPosterior.toFixed(1)} meses de cobertura.`
            });
            return;
        }

        // Validar que cabe en el contenedor
        const nuevoPeso = pesoBase + pesoAdicional;
        const nuevoVol = volumenBase + volumenAdicional;
        if (nuevoPeso > caps.peso * 1.0 || nuevoVol > caps.vol * 1.0) return;

        candidatos.push({
            ...p,
            cantidadSugerida: cantSugerida,
            valorAdicional,
            pesoAdicional,
            volumenAdicional,
            coberturaAntes: rotacion.coberturaActual,
            coberturaDespues: rotacion.coberturaPosterior,
            tiempoRotacion: rotacion.mesesRotacionAdicional,
            clasificacionRotacion: rotacion.clasificacion,
            margenEsperado: ((p.precioVenta - p.costoActual) / p.precioVenta * 100),
            motivo: determineAddReason(p, need, faltanteObjetivo, utilizacionActual),
            recomendado: true,
            razonNoRecomendado: null
        });
    });

    // Ordenar candidatos: primero los recomendados, luego por urgencia y rotación
    candidatos.sort((a, b) => {
        if (a.recomendado !== b.recomendado) return b.recomendado - a.recomendado;
        const urgA = a.coberturaAntes < 2 ? 0 : a.coberturaAntes < 4 ? 1 : 2;
        const urgB = b.coberturaAntes < 2 ? 0 : b.coberturaAntes < 4 ? 1 : 2;
        if (urgA !== urgB) return urgA - urgB;
        return a.tiempoRotacion - b.tiempoRotacion;
    });

    return {
        pedidoBase: Math.round(pedidoBase),
        montoMinimo,
        montoObjetivo,
        faltanteMinimo: Math.round(faltanteMinimo),
        faltanteObjetivo: Math.round(faltanteObjetivo),
        alcanzaMinimo: pedidoBase >= montoMinimo,
        alcanzaObjetivo: pedidoBase >= montoObjetivo,
        pesoBase: Math.round(pesoBase),
        volumenBase: parseFloat(volumenBase.toFixed(2)),
        utilizacionActual: parseFloat(utilizacionActual.toFixed(1)),
        candidatos,
        candidatosRecomendados: candidatos.filter(c => c.recomendado),
        candidatosNoRecomendados: candidatos.filter(c => !c.recomendado)
    };
}

function determineAddReason(product, need, faltanteObjetivo, utilizacionActual) {
    if (need.urgency === 'critica') return 'Stock crítico — cobertura menor a 2 meses.';
    if (need.urgency === 'necesaria') return 'Por debajo del punto de reorden.';
    if (faltanteObjetivo > 0) return 'Ayuda a alcanzar monto objetivo del proveedor.';
    if (utilizacionActual < 80) return 'Mejora utilización del contenedor.';
    if (need.commercialAdjustment > 0) return 'Respaldado por proyección comercial.';
    return 'Buena rotación histórica — complementa el pedido.';
}

/**
 * Calcula días hasta vencimiento de una cotización y su semáforo
 * @param {Object} cotizacion - Cotización
 * @param {Object} rules - Reglas del sistema
 * @returns {Object} Estado de vigencia
 */
function calculateQuoteStatus(cotizacion, rules) {
    rules = rules || APP.rules;
    const umbral = rules.umbralCotizacionVencer || 15;
    const hoy = new Date();
    const venc = new Date(cotizacion.fechaVencimiento);
    const diasRestantes = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));

    let semaforo, estado;
    if (diasRestantes < 0) { semaforo = 'gris'; estado = 'Vencida'; }
    else if (diasRestantes < 5) { semaforo = 'rojo'; estado = 'Crítica'; }
    else if (diasRestantes <= umbral) { semaforo = 'amarillo'; estado = 'Próxima a vencer'; }
    else { semaforo = 'verde'; estado = 'Vigente'; }

    return { diasRestantes, semaforo, estado, vencida: diasRestantes < 0 };
}

/**
 * Compara costo SAP vs costo cotizado
 * @param {Number} costoSAP - Último costo registrado en SAP
 * @param {Number} costoCotizado - Nuevo costo de cotización
 * @param {Object} rules - Reglas del sistema
 * @returns {Object} Comparativo
 */
function compareCosts(costoSAP, costoCotizado, rules) {
    rules = rules || APP.rules;
    const diferencia = costoCotizado - costoSAP;
    const variacionPct = costoSAP > 0 ? (diferencia / costoSAP) * 100 : 0;
    const umbral = rules.variacionCostoAlerta || 15;

    let estado;
    if (variacionPct < -2) estado = 'Disminución';
    else if (variacionPct <= 2) estado = 'Estable';
    else if (variacionPct <= umbral) estado = 'Incremento moderado';
    else estado = 'Incremento crítico';

    return { costoSAP, costoCotizado, diferencia, variacionPct, estado };
}

/**
 * Genera historial determinístico de precio/costo/margen de un producto
 * @param {Object} product - Producto del catálogo
 * @returns {Array} Registros históricos con fecha, costo, precio, markup, margen, precioMercado, accion, usuario
 */
function generatePriceHistory(product) {
    // Semilla determinística basada en el SKU para consistencia
    let seed = 0;
    for (let i = 0; i < (product.sku || '').length; i++) seed += product.sku.charCodeAt(i);
    const rnd = (n) => {const x = Math.sin(seed + n) * 10000; return x - Math.floor(x);};

    const costoBase = product.costoActual;
    const precioBase = product.precioVenta;
    const fechas = ['2026-01-15', '2026-02-20', '2026-04-10', '2026-06-01'];
    const acciones = ['Precio inicial', 'Cambio de costo', 'Cambio de costo', 'Ajuste competencia'];
    const usuarios = ['Admin', 'Sistema', 'Sistema', 'Admin'];

    return fechas.map((fecha, i) => {
        // Costo sube gradualmente
        const factorCosto = 1 + (i * 0.04) + (rnd(i) - 0.5) * 0.02;
        const costo = Math.round(costoBase * factorCosto * 100) / 100;
        // Precio sube pero con ajuste de competencia al final
        let factorPrecio = 1 + (i * 0.035) + (rnd(i + 10) - 0.5) * 0.02;
        if (i === fechas.length - 1) factorPrecio *= 0.97; // ajuste competencia
        const precio = Math.round(precioBase * factorPrecio * 100) / 100;
        const markup = ((precio - costo) / costo * 100);
        const margen = ((precio - costo) / precio * 100);
        // Precio de mercado (referencia competencia)
        const precioMercado = Math.round(precio * (1 + (rnd(i + 20) - 0.4) * 0.06) * 100) / 100;
        return {
            fecha, costo, precio,
            markup: parseFloat(markup.toFixed(1)),
            margen: parseFloat(margen.toFixed(1)),
            precioMercado,
            accion: acciones[i],
            usuario: usuarios[i]
        };
    });
}

// ===== APP STATE =====
let APP={currentView:'resumen',currentRole:'comercial',simulaciones:[],rules:{},advancedRules:[],wizardStep:1,wizardData:{},currentSimDetail:null,transitRecords:[...TRANSIT_RECORDS],purchaseOrders:[...PURCHASE_ORDERS],cotizaciones:[],usuarios:[],consumo:{}};

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{loadData();setupEvents();renderView('resumen');updateRoleVis();});

function loadData(){
    APP.simulaciones=JSON.parse(localStorage.getItem('renteco_sims2'))||[...DEFAULT_SIMULACIONES];
    APP.rules=JSON.parse(localStorage.getItem('renteco_rules2'))||{...DEFAULT_RULES};
    APP.advancedRules=JSON.parse(localStorage.getItem('renteco_advrules'))||[...DEFAULT_ADVANCED_RULES];
    APP.transitRecords=JSON.parse(localStorage.getItem('renteco_transit'))||[...TRANSIT_RECORDS];
    APP.purchaseOrders=JSON.parse(localStorage.getItem('renteco_po'))||[...PURCHASE_ORDERS];
    APP.cotizaciones=JSON.parse(localStorage.getItem('renteco_cotizaciones'))||[...DEFAULT_COTIZACIONES];
    APP.usuarios=JSON.parse(localStorage.getItem('renteco_usuarios'))||[...DEFAULT_USUARIOS];
    APP.consumo=JSON.parse(localStorage.getItem('renteco_consumo'))||{...DEFAULT_CONSUMO};
}
function saveData(){
    localStorage.setItem('renteco_sims2',JSON.stringify(APP.simulaciones));
    localStorage.setItem('renteco_rules2',JSON.stringify(APP.rules));
    localStorage.setItem('renteco_advrules',JSON.stringify(APP.advancedRules));
    localStorage.setItem('renteco_transit',JSON.stringify(APP.transitRecords));
    localStorage.setItem('renteco_po',JSON.stringify(APP.purchaseOrders));
    localStorage.setItem('renteco_cotizaciones',JSON.stringify(APP.cotizaciones));
    localStorage.setItem('renteco_usuarios',JSON.stringify(APP.usuarios));
    localStorage.setItem('renteco_consumo',JSON.stringify(APP.consumo));
}
function resetData(){
    localStorage.clear();
    APP.simulaciones=[...DEFAULT_SIMULACIONES];APP.rules={...DEFAULT_RULES};APP.advancedRules=[...DEFAULT_ADVANCED_RULES];APP.transitRecords=[...TRANSIT_RECORDS];APP.purchaseOrders=[...PURCHASE_ORDERS];APP.cotizaciones=[...DEFAULT_COTIZACIONES];APP.usuarios=[...DEFAULT_USUARIOS];APP.consumo={...DEFAULT_CONSUMO};
    saveData();renderView(APP.currentView);showToast('Datos restaurados a demostración','success');
}

function setupEvents(){
    document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',e=>{e.preventDefault();const v=i.dataset.view;if(v)navigateTo(v);}));
    document.getElementById('sidebar-toggle').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('collapsed'));
    document.getElementById('mobile-menu-btn').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
    document.getElementById('role-select').addEventListener('change',e=>{APP.currentRole=e.target.value;updateRoleVis();updateUserDisplay();renderView(APP.currentView);});
    document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')closeModal();});
}

function navigateTo(view){APP.currentView=view;document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));const a=document.querySelector(`[data-view="${view}"]`);if(a)a.classList.add('active');renderView(view);document.getElementById('sidebar').classList.remove('open');}
function updateRoleVis(){const r=APP.currentRole;const a=document.querySelector('[data-role="admin"]');if(a)a.style.display=r==='admin'?'flex':'none';}
function updateUserDisplay(){const n={comercial:'Carlos Méndez',importaciones:'Ana Solano',aprobador:'Roberto Fallas',admin:'Administrador'};document.getElementById('user-name').textContent=n[APP.currentRole]||'Usuario';}
function renderView(v){const c=document.getElementById('content');switch(v){case'resumen':c.innerHTML=renderResumen();break;case'simulaciones':c.innerHTML=renderSimulaciones();break;case'nueva-simulacion':c.innerHTML=renderNuevaSimulacion();break;case'planificacion':c.innerHTML=renderPlanificacion();break;case'proveedores':c.innerHTML=renderProveedores();break;case'productos':c.innerHTML=renderMaestroProductos();break;case'reglas':c.innerHTML=renderReglas();break;case'configuracion':c.innerHTML=renderConfiguracion();break;case'usuarios':c.innerHTML=renderUsuarios();break;case'consumo':c.innerHTML=renderControlConsumo();break;case'reportes':c.innerHTML=renderReportes();break;case'detalle-simulacion':c.innerHTML=renderDetalle();break;default:c.innerHTML=renderResumen();}}

// ===== VISTA 1: RESUMEN EJECUTIVO =====
function renderResumen(){
    const s=APP.simulaciones;const enAnalisis=s.filter(x=>x.estado==='analisis').length;const pendientes=s.filter(x=>x.estado==='pendiente').length;
    const ocs=APP.purchaseOrders.length;const enTransito=APP.transitRecords.filter(t=>t.estado==='transito').length;
    const proxLlegar=APP.transitRecords.filter(t=>t.diasRestantes<=15).length;
    const utilProm=Math.round(s.filter(x=>x.utilizacion).reduce((a,x)=>a+x.utilizacion,0)/(s.length||1));
    const alertas=s.filter(x=>x.utilizacion<80).length+s.filter(x=>x.recomendacion==='NO COMPRAR').length;
    // Nuevos KPIs v3.0
    const allProds=Object.values(SUPPLIER_CATALOGS).flat();
    const bajoReorden=allProds.filter(p=>{const n=calculatePurchaseNeed(p,APP.rules);return n.urgency==='critica'||n.urgency==='necesaria';}).length;
    const cotVencer=(APP.cotizaciones||[]).filter(c=>{const qs=calculateQuoteStatus(c,APP.rules);return qs.semaforo==='rojo'||qs.semaforo==='amarillo';}).length;
    const cotVencidas=(APP.cotizaciones||[]).filter(c=>{const qs=calculateQuoteStatus(c,APP.rules);return qs.vencida;}).length;
    return `<h1 class="section-title"><i class="fas fa-chart-line"></i> Resumen Ejecutivo</h1>
    <div class="grid-2">
        <div class="card"><div class="card-header"><h2><i class="fas fa-chart-pie"></i> Por estado</h2></div><div class="card-body">${renderEstadoChart()}</div></div>
        <div class="card"><div class="card-header"><h2><i class="fas fa-globe"></i> Variación costos por origen</h2></div><div class="card-body">${renderCostosChart()}</div></div>
    </div>
    <div class="card"><div class="card-header"><h2><i class="fas fa-table"></i> Últimas simulaciones</h2><button class="btn btn-primary btn-sm" onclick="navigateTo('nueva-simulacion')"><i class="fas fa-plus"></i> Nueva</button></div>
    <div class="card-body"><div class="table-container"><table><thead><tr><th>Código</th><th>Proveedor</th><th>País</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Incoterm</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Monto</th><th>Productos</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Utilización</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Recomendación</th><th>Estado</th><th>Llegada est.</th><th>Responsable</th><th></th></tr></thead><tbody>
    ${s.slice(0,6).map(x=>`<tr style="cursor:pointer" onclick="viewSimDetail('${x.id}')"><td><strong>${x.id}</strong></td><td>${x.proveedor}</td><td>${x.pais}</td><td>${x.incoterm}</td><td>$${fmt(x.totalCompra)}</td><td>${x.numProductos}</td><td><span class="semaphore ${x.utilizacion>=85?'green':x.utilizacion>=70?'yellow':'red'}">${x.utilizacion}%</span></td><td><span class="badge-status ${getRecBadge(x.recomendacion)}">${x.recomendacion}</span></td><td><span class="badge-status badge-${x.estado}">${ESTADOS_MAP[x.estado]||x.estado}</span></td><td>${x.fechaLlegada||'—'}</td><td>${x.responsable}</td><td class="action-btns"><button onclick="event.stopPropagation();viewSimDetail('${x.id}')"><i class="fas fa-eye"></i></button></td></tr>`).join('')}
    </tbody></table></div></div></div>
    <div style="text-align:right;margin-top:10px;"><button class="btn btn-outline btn-sm" onclick="resetData()"><i class="fas fa-redo"></i> Restaurar datos de demostración</button></div>`;
}
function renderEstadoChart(){const estados=Object.keys(ESTADOS_MAP);const counts=estados.map(e=>APP.simulaciones.filter(s=>s.estado===e).length).filter((_,i)=>estados[i]);const labels=Object.values(ESTADOS_MAP);const colors=['#a0aec0','#4299e1','#ecc94b','#ed8936','#48bb78','#fc8181','#9f7aea','#63b3ed','#4fd1c5','#f6ad55','#fc8181','#68d391','#cbd5e0'];const max=Math.max(...counts,1);return `<div class="chart-bar-container">${counts.slice(0,7).map((c,i)=>`<div class="chart-bar"><span class="bar-value">${c}</span><div class="bar" style="height:${(c/max)*100}%;background:${colors[i]};min-height:4px;"></div><span class="bar-label">${labels[i]?.split(' ')[0]||''}</span></div>`).join('')}</div>`;}
function renderCostosChart(){const r=['Europa','Asia','EEUU','Sudamérica'];const v=[6.5,18.3,12.5,22.0];const c=['#2980b9','#e74c3c','#27ae60','#f39c12'];const m=Math.max(...v);return `<div class="chart-bar-container">${v.map((val,i)=>`<div class="chart-bar"><span class="bar-value">${val}%</span><div class="bar" style="height:${(val/m)*100}%;background:${c[i]};"></div><span class="bar-label">${r[i]}</span></div>`).join('')}</div><p style="font-size:.72rem;color:var(--gray-400);text-align:center;margin-top:8px;">Variación promedio últimos 6 meses</p>`;}

// ===== VISTA 2: SIMULACIONES =====
function renderSimulaciones(){
    return `<h1 class="section-title"><i class="fas fa-list"></i> Simulaciones de Importación</h1>
    <div class="card"><div class="card-header"><h2>Listado</h2><button class="btn btn-primary btn-sm" onclick="navigateTo('nueva-simulacion')"><i class="fas fa-plus"></i> Nueva</button></div>
    <div class="card-body">
    <div class="filter-bar"><input type="text" id="sf-search" placeholder="Buscar..." oninput="filterSims()"><select id="sf-proveedor" onchange="filterSims()"><option value="">Todo proveedor</option>${PROVEEDORES.map(p=>`<option value="${p.nombre}">${p.nombre}</option>`).join('')}</select><select id="sf-estado" onchange="filterSims()"><option value="">Todo estado</option>${Object.entries(ESTADOS_MAP).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select><select id="sf-region" onchange="filterSims()"><option value="">Toda región</option><option>Europa</option><option>Asia</option><option>Estados Unidos</option><option>Sudamérica</option></select></div>
    <div class="table-container"><table><thead><tr><th>Código</th><th>Fecha</th><th>Proveedor</th><th>Tipo</th><th>Región</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Incoterm</th><th>Carga</th><th>Productos</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Total</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Costo CR</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Utilización</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Recom.</th><th>Estado</th><th>Llegada</th><th></th></tr></thead><tbody id="sim-tbody">${renderSimRows(APP.simulaciones)}</tbody></table></div></div></div>`;
}
function renderSimRows(sims){return sims.map(s=>`<tr><td><strong>${s.id}</strong></td><td>${s.fecha}</td><td>${s.proveedor}</td><td>${s.tipoProveedor}</td><td>${s.region}</td><td>${s.incoterm}</td><td>${s.tipoCarga}</td><td>${s.numProductos}</td><td>$${fmt(s.totalCompra)}</td><td>$${fmt(s.costoCR)}</td><td><span class="semaphore ${s.utilizacion>=85?'green':s.utilizacion>=70?'yellow':'red'}">${s.utilizacion}%</span></td><td><span class="badge-status ${getRecBadge(s.recomendacion)}">${s.recomendacion}</span></td><td><span class="badge-status badge-${s.estado}">${ESTADOS_MAP[s.estado]||s.estado}</span></td><td>${s.fechaLlegada||'—'}</td><td class="action-btns"><button title="Ver" onclick="viewSimDetail('${s.id}')"><i class="fas fa-eye"></i></button>${s.estado==='borrador'?`<button title="Editar" onclick="editarSim('${s.id}')"><i class="fas fa-edit" style="color:var(--primary)"></i></button>`:''}<button title="Duplicar" onclick="duplicarSim('${s.id}')"><i class="fas fa-copy"></i></button>${s.estado==='borrador'?`<button title="Eliminar" onclick="eliminarSim('${s.id}')"><i class="fas fa-trash"></i></button>`:''}</td></tr>`).join('');}
function filterSims(){const q=(document.getElementById('sf-search')?.value||'').toLowerCase();const e=document.getElementById('sf-estado')?.value||'';const r=document.getElementById('sf-region')?.value||'';const pv=document.getElementById('sf-proveedor')?.value||'';const f=APP.simulaciones.filter(s=>(!q||s.id.toLowerCase().includes(q)||s.proveedor.toLowerCase().includes(q))&&(!e||s.estado===e)&&(!r||s.region===r)&&(!pv||s.proveedor===pv));document.getElementById('sim-tbody').innerHTML=renderSimRows(f);}

// ===== VISTA 3: NUEVA SIMULACIÓN (WIZARD) =====
function renderNuevaSimulacion(){
    if(!APP.wizardData.productos){initWizard();APP.wizardStep=1;}
    const steps=['Origen','Proveedor','Catálogo y Mix','Logística','Análisis','Decisión'];
    return `<h1 class="section-title"><i class="fas fa-plus-circle"></i> Nueva Simulación</h1>
    <div class="card" style="margin-bottom:14px;border-left:3px solid var(--accent);"><div class="card-body" style="padding:12px 18px;"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;"><span style="font-size:.83rem;font-weight:600;color:var(--gray-500);"><i class="fas fa-flask"></i> Ejemplos:</span>
    <button class="btn btn-success btn-sm" onclick="loadPreset('comprar')"><i class="fas fa-check-circle"></i> COMPRAR</button>
    <button class="btn btn-danger btn-sm" onclick="loadPreset('no-comprar')"><i class="fas fa-times-circle"></i> NO COMPRAR</button>
    <button class="btn btn-warning btn-sm" onclick="loadPreset('ajustes')"><i class="fas fa-exclamation-circle"></i> CON AJUSTES</button></div></div></div>
    <div class="card"><div class="card-body">
    <div class="wizard-progress">${steps.map((s,i)=>`<div class="wizard-step ${i+1<APP.wizardStep?'completed':''} ${i+1===APP.wizardStep?'active':''}"><div class="step-circle">${i+1<APP.wizardStep?'<i class="fas fa-check"></i>':(i+1)}</div><span class="step-label">${s}</span>${i<steps.length-1?'<div class="wizard-line"></div>':''}</div>`).join('')}</div>
    ${renderWizStep()}</div></div>`;
}
function initWizard(){APP.wizardData={tipoImportacion:'regular',tipoAnalisis:'Compra completa por proveedor',motivo:'',area:'Comercial',responsable:'Carlos Méndez',fechaRequerida:'2026-09-01',observaciones:'',proveedorId:1,incoterm:'CIF',tipoCarga:'40 pies',productos:[],selectedProducts:[],
// Consolidado multi-proveedor
suppliers:[],consolidationPoint:'Miami',excepcionAprobada:false,
// Costos
flete:0,seguro:0,operador:850,agencia:620,aranceles:2100,impuestos:1800,tratado:true,descuentoTratado:420,transporteLocal:750,otrosCostos:200,
// Costos consolidado
transporteConsolidacion:0,recepcionConsolidacion:0,handling:0,bodega:0,consolidacion:0,documentacion:0,
tiempoTransito:35,metodoDistribucion:'valor',escenario:'A',margenObjetivo:APP.rules.margenObjetivo,mixApplied:false,optimizacionResult:null};}
function renderWizStep(){switch(APP.wizardStep){case 1:return renderWS1();case 2:return renderWS2();case 3:return renderWS3();case 4:return renderWS4();case 5:return renderWS5();case 6:return renderWS6();default:return renderWS1();}}
function wizNav(){return `<div class="wizard-nav">${APP.wizardStep>1?`<button class="btn btn-outline" onclick="APP.wizardStep--;renderView('nueva-simulacion')"><i class="fas fa-arrow-left"></i> Anterior</button>`:'<div></div>'}${APP.wizardStep<6?`<button class="btn btn-primary" onclick="APP.wizardStep++;renderView('nueva-simulacion')">Siguiente <i class="fas fa-arrow-right"></i></button>`:'<div></div>'}</div>`;}

function renderWS1(){const d=APP.wizardData;return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 1: Origen de la necesidad</h2></div><div class="card-body">
<div class="form-row"><div class="form-group"><label>Tipo de importación</label><select onchange="APP.wizardData.tipoImportacion=this.value;renderView('nueva-simulacion')"><option value="regular" ${d.tipoImportacion==='regular'?'selected':''}>Regular</option><option value="consolidada" ${d.tipoImportacion==='consolidada'?'selected':''}>Consolidada</option></select></div>
<div class="form-group"><label>Tipo de análisis</label><select onchange="APP.wizardData.tipoAnalisis=this.value"><option ${d.tipoAnalisis==='Compra completa por proveedor'?'selected':''}>Compra completa por proveedor</option><option ${d.tipoAnalisis==='Reposición de productos'?'selected':''}>Reposición de productos</option><option ${d.tipoAnalisis==='Producto nuevo'?'selected':''}>Producto nuevo</option><option ${d.tipoAnalisis==='Necesidad comercial'?'selected':''}>Necesidad comercial</option><option ${d.tipoAnalisis==='Proyecto específico'?'selected':''}>Proyecto específico</option></select></div></div>
<div class="form-row"><div class="form-group"><label>Área solicitante</label><select onchange="APP.wizardData.area=this.value"><option ${d.area==='Comercial'?'selected':''}>Comercial</option><option ${d.area==='Operaciones'?'selected':''}>Operaciones</option><option ${d.area==='Proyectos'?'selected':''}>Proyectos</option></select></div>
<div class="form-group"><label>Responsable</label><input value="${d.responsable}" onchange="APP.wizardData.responsable=this.value"></div></div>
<div class="form-row"><div class="form-group"><label>Fecha requerida</label><input type="date" value="${d.fechaRequerida}" onchange="APP.wizardData.fechaRequerida=this.value"></div><div class="form-group"><label>&nbsp;</label></div></div>
${d.tipoImportacion==='consolidada'?`<div class="alert-item info" style="margin-top:12px;"><i class="fas fa-info-circle"></i><span><strong>Importación consolidada:</strong> En el paso 2 podrá seleccionar múltiples proveedores que converjan en un mismo punto de consolidación.</span></div>`:''}
<div class="form-group" style="margin-top:12px;"><label>Observaciones</label><textarea rows="2" onchange="APP.wizardData.observaciones=this.value">${d.observaciones||'Compra programada Q3 2026.'}</textarea></div>
</div></div>${wizNav()}`;}

function renderWS2(){const d=APP.wizardData;const isConsolidada=d.tipoImportacion==='consolidada';
if(isConsolidada) return renderWS2Consolidada(d);
const prov=PROVEEDORES.find(p=>p.id===d.proveedorId)||PROVEEDORES[0];
const isNew=!prov.recurrente;const combos=HISTORICAL_COMBOS[prov.id]||[];
// Auto-cargar regla logística del proveedor al seleccionarlo
if(!d._provLoaded||d._provLoaded!==prov.id){d.incoterm=prov.usualIncoterm||prov.incoterm;d.tipoCarga=prov.usualContainer==='No aplica'?'Consolidado':prov.usualContainer;d.tiempoTransito=prov.averageTransitDays||prov.tiempoEntrega;d._provLoaded=prov.id;}
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 2: Proveedor y regla logística</h2></div><div class="card-body">
<div class="form-row"><div class="form-group"><label>Proveedor</label><select onchange="APP.wizardData.proveedorId=parseInt(this.value);APP.wizardData.productos=[];APP.wizardData.selectedProducts=[];APP.wizardData.proformaLoaded=false;APP.wizardData._provLoaded=null;renderView('nueva-simulacion')">${PROVEEDORES.map(p=>`<option value="${p.id}" ${p.id===d.proveedorId?'selected':''}>${p.nombre} ${p.recurrente?'':'(Nuevo)'}</option>`).join('')}</select></div>
<div class="form-group"><label>Modo habitual</label><input value="${prov.defaultImportMode==='contenedor_completo'?'Contenedor completo':'Consolidado'}" disabled style="background:var(--gray-50);font-weight:600;"></div>
<div class="form-group"><label>Contenedor habitual</label><input value="${prov.usualContainer}" disabled style="background:var(--gray-50);font-weight:600;"></div></div>
<div class="form-row"><div class="form-group"><label>Incoterm</label><select onchange="APP.wizardData.incoterm=this.value;renderView('nueva-simulacion')"><option ${d.incoterm==='CIF'?'selected':''}>CIF</option><option ${d.incoterm==='FOB'?'selected':''}>FOB</option><option ${d.incoterm==='FCA'?'selected':''}>FCA</option><option ${d.incoterm==='EXW'?'selected':''}>EXW</option></select></div>
<div class="form-group"><label>Tipo de carga</label><select onchange="APP.wizardData.tipoCarga=this.value;renderView('nueva-simulacion')"><option ${d.tipoCarga==='40 pies'?'selected':''}>40 pies</option><option ${d.tipoCarga==='20 pies'?'selected':''}>20 pies</option><option ${d.tipoCarga==='Consolidado'?'selected':''}>Consolidado</option></select></div>
<div class="form-group"><label>Tiempo tránsito (días)</label><input type="number" value="${d.tiempoTransito}" onchange="APP.wizardData.tiempoTransito=parseInt(this.value)"></div></div>
<div class="card" style="border:1px solid var(--primary-light);margin-top:14px;box-shadow:none;background:rgba(41,128,185,.02);"><div class="card-body" style="padding:12px 16px;">
<h3 style="font-size:.85rem;color:var(--primary);margin-bottom:10px;"><i class="fas fa-ruler-combined"></i> Regla logística del proveedor</h3>
<div style="display:flex;gap:16px;flex-wrap:wrap;font-size:.82rem;">
<span><strong>Monto mínimo:</strong> $${fmt(prov.minimumOrderValue||0)}</span>
<span><strong>Monto objetivo:</strong> $${fmt(prov.targetOrderValue||0)}</span>
<span><strong>Utilización mín.:</strong> ${prov.utilizacionMinRec||80}%</span>
<span><strong>Vigencia cotización:</strong> ${prov.quoteValidityDays||30}d</span>
${prov.consolidationPoint?`<span><strong>Pto. consolidación:</strong> ${prov.consolidationPoint}</span>`:''}
<span><strong>Marcas:</strong> ${(prov.brands||[]).join(', ')}</span>
</div></div></div>

<div class="card" style="border:2px dashed ${d.proformaLoaded?'var(--success)':'var(--gray-300)'};margin-top:16px;box-shadow:none;">
<div class="card-header"><h2><i class="fas fa-file-invoice-dollar"></i> Proforma / Cotización del proveedor</h2></div>
<div class="card-body">
${d.proformaLoaded?`
<div class="alert-item success"><i class="fas fa-check-circle"></i><span><strong>Proforma cargada:</strong> ${d.proformaFile||'Cotización-'+prov.nombre.replace(/\s/g,'')+'.pdf'}</span></div>
<div style="margin:12px 0;padding:12px;background:var(--gray-50);border-radius:6px;">
<p style="font-size:.82rem;color:var(--gray-500);margin-bottom:8px;"><strong>Datos extraídos de la proforma:</strong></p>
<div style="display:flex;gap:16px;flex-wrap:wrap;font-size:.8rem;">
<span><i class="fas fa-hashtag"></i> N° Cotización: <strong>${d.proformaNum||'COT-'+prov.nombre.substring(0,3).toUpperCase()+'-2026-0'+Math.floor(Math.random()*900+100)}</strong></span>
<span><i class="fas fa-calendar"></i> Fecha: <strong>${d.proformaFecha||new Date().toISOString().split('T')[0]}</strong></span>
<span><i class="fas fa-box"></i> Productos: <strong>${d.proformaProductCount||'—'}</strong></span>
<span><i class="fas fa-dollar-sign"></i> Moneda: <strong>${prov.moneda}</strong></span>
</div>
</div>
<div class="table-container" style="max-height:200px;overflow-y:auto;">
<table style="font-size:.78rem;"><thead><tr><th>SKU</th><th>Producto</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Último costo SAP</th><th>Costo cotizado</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Variación</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Estado</th></tr></thead><tbody>
${(d.proformaItems||[]).map(item=>{const comp=compareCosts(item.costoAnterior,item.nuevoCosto,APP.rules);return `<tr><td>${item.sku}</td><td>${item.descripcion}</td><td>$${item.costoAnterior.toFixed(2)}</td><td style="font-weight:600;color:${comp.estado==='Incremento crítico'?'var(--danger)':comp.estado==='Incremento moderado'?'var(--warning)':comp.estado==='Disminución'?'var(--success)':'var(--gray-600)'}">$${item.nuevoCosto.toFixed(2)}</td><td style="color:${comp.variacionPct>15?'var(--danger)':comp.variacionPct>0?'var(--warning)':'var(--success)'}">${comp.variacionPct>0?'+':''}${comp.variacionPct.toFixed(1)}%</td><td><span class="badge-status ${comp.estado==='Incremento crítico'?'badge-rechazado':comp.estado==='Incremento moderado'?'badge-ajustes':comp.estado==='Disminución'?'badge-aprobado':'badge-borrador'}">${comp.estado}</span></td></tr>`;}).join('')}
</tbody></table></div>
<div style="margin-top:12px;display:flex;gap:8px;">
<button class="btn btn-sm btn-success" onclick="applyProformaCosts()"><i class="fas fa-check"></i> Aplicar costos al catálogo</button>
<button class="btn btn-sm btn-outline" onclick="removeProforma()"><i class="fas fa-trash"></i> Quitar proforma</button>
</div>
`:`
<div class="drop-zone" id="proforma-drop" onclick="document.getElementById('proforma-input').click()" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="event.preventDefault();this.classList.remove('dragover');handleProformaUpload()">
<i class="fas fa-cloud-upload-alt" style="font-size:2.2rem;margin-bottom:10px;color:var(--primary-light);"></i>
<p style="font-weight:500;color:var(--gray-600);">Arrastre la proforma aquí o haga clic para seleccionar</p>
<small style="color:var(--gray-400);">PDF, Excel o imagen — Se compararán costos con último costo SAP</small>
</div>
<input type="file" id="proforma-input" style="display:none" accept=".pdf,.xlsx,.xls,.csv,.png,.jpg" onchange="handleProformaUpload()">
`}
</div></div>

${isNew?'<div class="alert-item warning" style="margin-top:12px;"><i class="fas fa-exclamation-triangle"></i><span>Proveedor nuevo sin histórico. Confianza: Baja. Ingrese manualmente las condiciones.</span></div>':''}
${!isNew?`<div class="card" style="border:1px solid var(--primary-light);margin-top:16px;"><div class="card-header" style="background:rgba(41,128,185,.05);"><h2><i class="fas fa-history"></i> Resumen histórico del proveedor</h2></div><div class="card-body">
<div class="kpi-grid" style="margin-bottom:0;">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-file-invoice"></i></div><div class="kpi-info"><h3>${prov.importaciones}</h3><p>Importaciones</p></div></div>
<div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-layer-group"></i></div><div class="kpi-info"><h3>${combos.length}</h3><p>Combos recurrentes</p></div></div>
<div class="kpi-card"><div class="kpi-icon teal"><i class="fas fa-box"></i></div><div class="kpi-info"><h3>${prov.usualContainer}</h3><p>Contenedor habitual</p></div></div>
<div class="kpi-card"><div class="kpi-icon purple"><i class="fas fa-percentage"></i></div><div class="kpi-info"><h3>${prov.utilizacionProm}%</h3><p>Utilización prom.</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-calendar"></i></div><div class="kpi-info"><h3>${prov.averageTransitDays||prov.tiempoEntrega}d</h3><p>Tiempo tránsito</p></div></div>
</div><p style="font-size:.8rem;color:var(--gray-400);margin-top:12px;">Última importación: ${prov.ultimaCompra} · Frecuencia: ${prov.frecuenciaCompra} · Tratado: ${prov.tratado?'Sí':'No'} · Moneda: ${prov.moneda}</p>
</div></div>`:''}
</div></div>${wizNav()}`;}

// === WIZARD PASO 2 CONSOLIDADA ===
function renderWS2Consolidada(d){
const suppliers=d.suppliers||[];
const availableProvs=PROVEEDORES.filter(p=>p.allowsConsolidation);
const consolidationPoints=[...new Set(availableProvs.filter(p=>p.consolidationPoint).map(p=>p.consolidationPoint))];
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 2: Proveedores del consolidado</h2><button class="btn btn-sm btn-primary" onclick="openSupplierSearchModal()"><i class="fas fa-plus"></i> Agregar proveedor</button></div><div class="card-body">
<div class="form-row"><div class="form-group"><label>Punto de consolidación</label><select onchange="APP.wizardData.consolidationPoint=this.value;renderView('nueva-simulacion')"><option value="Miami" ${d.consolidationPoint==='Miami'?'selected':''}>Miami</option><option value="Houston" ${d.consolidationPoint==='Houston'?'selected':''}>Houston</option><option value="Otro" ${d.consolidationPoint==='Otro'?'selected':''}>Otro</option></select></div>
<div class="form-group"><label>Incoterm consolidado</label><select onchange="APP.wizardData.incoterm=this.value"><option ${d.incoterm==='FCA'?'selected':''}>FCA</option><option ${d.incoterm==='FOB'?'selected':''}>FOB</option><option ${d.incoterm==='CIF'?'selected':''}>CIF</option><option ${d.incoterm==='EXW'?'selected':''}>EXW</option></select></div>
<div class="form-group"><label>Tiempo estimado tránsito</label><input type="number" value="${d.tiempoTransito}" onchange="APP.wizardData.tiempoTransito=parseInt(this.value)"></div></div>

${suppliers.length===0?'<div class="alert-item info" style="margin-top:12px;"><i class="fas fa-info-circle"></i><span>Agregue proveedores al consolidado. Todos deben converger en el mismo punto de consolidación.</span></div>':''}

${suppliers.map((s,idx)=>{const sp=PROVEEDORES.find(p=>p.id===s.supplierId);if(!sp)return '';
const cat=SUPPLIER_CATALOGS[s.supplierId]||[];const incompatible=sp.consolidationPoint&&sp.consolidationPoint!==d.consolidationPoint;const noConsolida=!sp.allowsConsolidation;
const proformaKey='proforma_'+s.supplierId;const hasProforma=d[proformaKey+'_loaded'];
return `<div class="card" style="border:1px solid ${incompatible||noConsolida?'var(--warning)':'var(--primary-light)'};margin-top:12px;box-shadow:none;">
<div class="card-header" style="background:${incompatible||noConsolida?'rgba(243,156,18,.05)':'rgba(41,128,185,.03)'};">
<h2 style="font-size:.9rem;"><i class="fas fa-truck"></i> ${sp.nombre} <span style="font-size:.75rem;color:var(--gray-400);">(${sp.pais})</span></h2>
<button class="btn btn-sm btn-outline" onclick="removeSupplierFromConsolidated(${idx})" style="color:var(--danger);border-color:var(--danger);"><i class="fas fa-times"></i></button>
</div><div class="card-body" style="padding:12px 16px;">
<div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.8rem;margin-bottom:8px;">
<span><i class="fas fa-map-marker-alt"></i> <strong>${sp.consolidationPoint||'Sin punto'}</strong> → ${d.consolidationPoint}</span>
<span><i class="fas fa-box"></i> ${cat.length} productos</span>
<span><i class="fas fa-dollar-sign"></i> Mín: $${fmt(sp.minimumOrderValue||0)}</span>
<span><i class="fas fa-bullseye"></i> Obj: $${fmt(sp.targetOrderValue||0)}</span>
</div>
${incompatible?`<div class="alert-item warning" style="margin:8px 0;"><i class="fas fa-exclamation-triangle"></i><span>Punto diferente (${sp.consolidationPoint} vs ${d.consolidationPoint}). <label style="cursor:pointer;"><input type="checkbox" ${d.excepcionAprobada?'checked':''} onchange="APP.wizardData.excepcionAprobada=this.checked"> Excepción aprobada</label></span></div>`:''}
<div style="margin-top:10px;padding:10px;border:1px dashed ${hasProforma?'var(--success)':'var(--gray-300)'};border-radius:6px;">
${hasProforma?`<div style="display:flex;align-items:center;gap:8px;"><i class="fas fa-check-circle" style="color:var(--success);"></i><span style="font-size:.8rem;"><strong>Proforma cargada</strong> — ${(d[proformaKey+'_items']||[]).length} productos extraídos</span><button class="btn btn-sm btn-outline" onclick="removeConsolProforma(${s.supplierId})" style="padding:2px 6px;font-size:.7rem;"><i class="fas fa-times"></i></button></div>
<div class="table-container" style="max-height:120px;overflow-y:auto;margin-top:8px;"><table style="font-size:.74rem;"><thead><tr><th>SKU</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo SAP</th><th>Costo cotiz.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Var.</th></tr></thead><tbody>
${(d[proformaKey+'_items']||[]).map(item=>{const v=((item.nuevoCosto-item.costoAnterior)/item.costoAnterior*100).toFixed(1);return `<tr><td>${item.sku}</td><td>$${item.costoAnterior.toFixed(2)}</td><td>$${item.nuevoCosto.toFixed(2)}</td><td style="color:${v>15?'var(--danger)':v>0?'var(--warning)':'var(--success)'}">${v>0?'+':''}${v}%</td></tr>`;}).join('')}
</tbody></table></div>`:`<div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="handleConsolProformaUpload(${s.supplierId})">
<i class="fas fa-cloud-upload-alt" style="color:var(--primary-light);font-size:1.2rem;"></i>
<span style="font-size:.8rem;color:var(--gray-500);">Cargar proforma de ${sp.nombre}</span>
</div>`}
</div>
</div></div>`;}).join('')}

<div style="margin-top:16px;padding:14px;background:var(--gray-50);border-radius:var(--border-radius);">
<h3 style="font-size:.88rem;color:var(--primary);margin-bottom:10px;"><i class="fas fa-route"></i> Flujo de consolidación</h3>
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.82rem;">
${suppliers.map(s=>{const sp=PROVEEDORES.find(p=>p.id===s.supplierId);return sp?`<span style="padding:4px 10px;background:var(--white);border:1px solid var(--gray-200);border-radius:12px;">${sp.nombre}</span><i class="fas fa-arrow-right" style="color:var(--gray-300);font-size:.7rem;"></i>`:''}).join('')}
<span style="padding:4px 10px;background:rgba(230,126,34,.1);border:1px solid var(--accent);border-radius:12px;font-weight:600;color:var(--accent);">${d.consolidationPoint}</span>
<i class="fas fa-arrow-right" style="color:var(--gray-300);font-size:.7rem;"></i>
<span style="padding:4px 10px;background:rgba(39,174,96,.1);border:1px solid var(--success);border-radius:12px;font-weight:600;color:var(--success);">Costa Rica</span>
</div></div>

<div style="margin-top:14px;padding:12px;background:var(--white);border:1px solid var(--gray-200);border-radius:6px;">
<h4 style="font-size:.84rem;color:var(--gray-500);margin-bottom:8px;">Resumen consolidado</h4>
<div style="display:flex;gap:20px;flex-wrap:wrap;font-size:.82rem;">
<span><strong>Proveedores:</strong> ${suppliers.length}</span>
<span><strong>Punto:</strong> ${d.consolidationPoint}</span>
<span><strong>Productos:</strong> ${suppliers.reduce((sum,s)=>{const cat=SUPPLIER_CATALOGS[s.supplierId]||[];return sum+cat.length;},0)}</span>
<span><strong>Proformas:</strong> ${suppliers.filter(s=>d['proforma_'+s.supplierId+'_loaded']).length}/${suppliers.length}</span>
</div></div>
</div></div>${wizNav()}`;}

function handleConsolProformaUpload(supplierId){
const d=APP.wizardData;const sp=PROVEEDORES.find(p=>p.id===supplierId);
const catalog=SUPPLIER_CATALOGS[supplierId]||[];
const variacionBase=(sp.variacionReciente||5)/100;
const items=catalog.map(p=>{
const factor=1+(variacionBase*(0.6+Math.random()*0.8));
const nuevoCosto=Math.round(p.costoActual*factor*100)/100;
return {sku:p.sku,descripcion:p.descripcion,costoAnterior:p.costoActual,nuevoCosto};});
d['proforma_'+supplierId+'_loaded']=true;
d['proforma_'+supplierId+'_items']=items;
renderView('nueva-simulacion');showToast(`Proforma de ${sp.nombre} cargada (${items.length} productos)`,'success');}

function removeConsolProforma(supplierId){
const d=APP.wizardData;
d['proforma_'+supplierId+'_loaded']=false;
d['proforma_'+supplierId+'_items']=[];
renderView('nueva-simulacion');showToast('Proforma eliminada','info');}
function addSupplierToConsolidated(){
const d=APP.wizardData;if(!d.suppliers)d.suppliers=[];
const usedIds=d.suppliers.map(s=>s.supplierId);
const available=PROVEEDORES.filter(p=>!usedIds.includes(p.id)&&p.allowsConsolidation);
if(available.length===0){showToast('No hay más proveedores disponibles para consolidar','warning');return;}
const next=available[0];
d.suppliers.push({supplierId:next.id,supplierName:next.nombre,country:next.pais,consolidationPoint:next.consolidationPoint,incoterm:next.usualIncoterm||next.incoterm,products:[],subtotal:0,weight:0,volume:0});
renderView('nueva-simulacion');showToast(`${next.nombre} agregado al consolidado`,'success');}

function openSupplierSearchModal(){
const d=APP.wizardData;if(!d.suppliers)d.suppliers=[];
const usedIds=d.suppliers.map(s=>s.supplierId);
const available=PROVEEDORES.filter(p=>!usedIds.includes(p.id));
if(available.length===0){showToast('No hay más proveedores disponibles','warning');return;}
const content=`<div style="text-align:left;">
<div class="form-group"><label>Buscar proveedor</label><input type="text" id="supplier-search-input" placeholder="Nombre, país, región..." oninput="filterSupplierModal()" autofocus></div>
<div id="supplier-search-results" class="table-container" style="max-height:300px;overflow-y:auto;">
${renderSupplierSearchTable(available)}
</div>
<p style="font-size:.74rem;color:var(--gray-400);margin-top:10px;"><i class="fas fa-info-circle"></i> Seleccione uno o varios proveedores para agregar al consolidado.</p>
</div>`;
showModal('Buscar y agregar proveedores',content,[{text:'Cerrar',cls:'btn-outline',action:'closeModal()'}]);}

function renderSupplierSearchTable(list){
return `<table style="font-size:.8rem;"><thead><tr><th></th><th>Proveedor</th><th>País</th><th>Región</th><th>Pto. consolidación</th><th>Modo</th><th>Consolidable</th></tr></thead><tbody>
${list.map(p=>`<tr><td><button class="btn btn-sm btn-success" onclick="selectSupplierFromModal(${p.id})"><i class="fas fa-plus"></i></button></td><td><strong>${p.nombre}</strong></td><td>${p.pais}</td><td>${p.region}</td><td>${p.consolidationPoint||'—'}</td><td>${p.defaultImportMode==='consolidado'?'Consolidado':'Contenedor'}</td><td>${p.allowsConsolidation?'<i class="fas fa-check" style="color:var(--success)"></i>':'<i class="fas fa-times" style="color:var(--gray-300)"></i>'}</td></tr>`).join('')}
</tbody></table>`;}

function filterSupplierModal(){
const q=(document.getElementById('supplier-search-input')?.value||'').toLowerCase();
const d=APP.wizardData;const usedIds=(d.suppliers||[]).map(s=>s.supplierId);
const available=PROVEEDORES.filter(p=>!usedIds.includes(p.id));
const filtered=available.filter(p=>!q||p.nombre.toLowerCase().includes(q)||p.pais.toLowerCase().includes(q)||p.region.toLowerCase().includes(q)||(p.consolidationPoint||'').toLowerCase().includes(q));
const container=document.getElementById('supplier-search-results');
if(container)container.innerHTML=renderSupplierSearchTable(filtered);}

function selectSupplierFromModal(provId){
const d=APP.wizardData;if(!d.suppliers)d.suppliers=[];
const prov=PROVEEDORES.find(p=>p.id===provId);if(!prov)return;
d.suppliers.push({supplierId:prov.id,supplierName:prov.nombre,country:prov.pais,consolidationPoint:prov.consolidationPoint,incoterm:prov.usualIncoterm||prov.incoterm,products:[],subtotal:0,weight:0,volume:0});
closeModal();renderView('nueva-simulacion');showToast(`${prov.nombre} agregado al consolidado`,'success');}

function removeSupplierFromConsolidated(idx){
APP.wizardData.suppliers.splice(idx,1);APP.wizardData.productos=[];
renderView('nueva-simulacion');showToast('Proveedor removido','info');}

function handleProformaUpload(){
const d=APP.wizardData;const prov=PROVEEDORES.find(p=>p.id===d.proveedorId)||PROVEEDORES[0];
const catalog=SUPPLIER_CATALOGS[d.proveedorId]||[];
// Simular extracción de datos de la proforma
const variacionBase=prov.variacionReciente/100;
const items=catalog.map(p=>{
const factor=1+(variacionBase*(0.6+Math.random()*0.8));
const nuevoCosto=Math.round(p.costoActual*factor*100)/100;
return {sku:p.sku,descripcion:p.descripcion,costoAnterior:p.costoActual,nuevoCosto};});
d.proformaLoaded=true;
d.proformaFile='Proforma-'+prov.nombre.replace(/\s+/g,'-')+'-2026.pdf';
d.proformaNum='COT-'+prov.nombre.substring(0,3).toUpperCase()+'-2026-'+String(Math.floor(Math.random()*900)+100);
d.proformaFecha=new Date().toISOString().split('T')[0];
d.proformaProductCount=items.length;
d.proformaItems=items;
renderView('nueva-simulacion');
showToast('Proforma cargada. Costos extraídos de '+items.length+' productos.','success');}

function applyProformaCosts(){
const d=APP.wizardData;if(!d.proformaItems||!d.proformaItems.length)return;
const catalog=SUPPLIER_CATALOGS[d.proveedorId]||[];
// Si los productos ya están cargados en el wizard, actualizar sus costos cotizados
if(d.productos.length>0){
d.productos.forEach(p=>{const item=d.proformaItems.find(i=>i.sku===p.sku);if(item)p.costoCotizado=item.nuevoCosto;});
}else{
// Pre-cargar productos con los costos de la proforma
d.productos=catalog.map(p=>{const item=d.proformaItems.find(i=>i.sku===p.sku);
return {...p,selected:true,cantidad:p.cantidadPromedio||50,costoCotizado:item?item.nuevoCosto:p.costoActual,accionRecomendada:getRecommendedAction(p)};});}
d.proformaCostsApplied=true;
showToast('Costos de proforma aplicados al catálogo. Avance al paso 3 para ver el detalle.','success');
renderView('nueva-simulacion');}

function removeProforma(){APP.wizardData.proformaLoaded=false;APP.wizardData.proformaItems=[];APP.wizardData.proformaFile=null;APP.wizardData.proformaCostsApplied=false;renderView('nueva-simulacion');showToast('Proforma eliminada','info');}

function renderWS3(){const d=APP.wizardData;const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);const catalog=SUPPLIER_CATALOGS[d.proveedorId]||[];const combos=HISTORICAL_COMBOS[d.proveedorId]||[];
if(d.productos.length===0){
d.productos=catalog.map(p=>{
const need=calculatePurchaseNeed(p,APP.rules);
const costoCot=p.costoActual*(1+(prov.variacionReciente||0)/100);
return {...p,selected:need.needsPurchase,cantidad:need.finalSuggestedQty||p.cantidadPromedio||50,costoCotizado:costoCot,
needData:need,accionRecomendada:need.urgency==='critica'?'Aumentar':need.urgency==='necesaria'?'Comprar':need.finalSuggestedQty>0?'Mantener':'Opcional'};});}
// Calcular optimización
const selProds=d.productos.filter(p=>p.selected);
const optResult=optimizeOrder(selProds,catalog,prov,APP.rules,d.tipoCarga);
d.optimizacionResult=optResult;
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 3: Necesidad y optimización del pedido</h2>
<div style="display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-sm btn-primary" onclick="selectRecommended()"><i class="fas fa-magic"></i> Necesarios</button><button class="btn btn-sm btn-outline" onclick="clearSelection()"><i class="fas fa-eraser"></i> Limpiar</button><button class="btn btn-sm btn-accent" onclick="generateMix()"><i class="fas fa-brain"></i> Optimizar pedido</button><button class="btn btn-sm btn-success" onclick="openProductSearchModal()"><i class="fas fa-search-plus"></i> Buscar producto</button></div></div>
<div class="card-body">
<div class="kpi-grid" style="margin-bottom:16px;">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>$${fmt(optResult.pedidoBase)}</h3><p>Pedido base</p></div></div>
<div class="kpi-card"><div class="kpi-icon ${optResult.alcanzaMinimo?'green':'red'}"><i class="fas fa-exclamation-circle"></i></div><div class="kpi-info"><h3>$${fmt(prov.minimumOrderValue||0)}</h3><p>Monto mínimo ${optResult.alcanzaMinimo?'✓':'✗'}</p></div></div>
<div class="kpi-card"><div class="kpi-icon ${optResult.alcanzaObjetivo?'green':'orange'}"><i class="fas fa-bullseye"></i></div><div class="kpi-info"><h3>$${fmt(prov.targetOrderValue||0)}</h3><p>Monto objetivo ${optResult.alcanzaObjetivo?'✓':'✗'}</p></div></div>
<div class="kpi-card"><div class="kpi-icon ${optResult.utilizacionActual>=85?'green':optResult.utilizacionActual>=70?'orange':'red'}"><i class="fas fa-box"></i></div><div class="kpi-info"><h3>${optResult.utilizacionActual}%</h3><p>Utilización</p></div></div>
</div>
${!optResult.alcanzaObjetivo?`<div class="alert-item warning" style="margin-bottom:14px;"><i class="fas fa-info-circle"></i><span><strong>Faltante para objetivo:</strong> $${fmt(optResult.faltanteObjetivo)} · ${optResult.candidatosRecomendados.length} producto(s) candidato(s) disponible(s).</span></div>`:''}
${!optResult.alcanzaMinimo?`<div class="alert-item danger" style="margin-bottom:14px;"><i class="fas fa-exclamation-triangle"></i><span><strong>Pedido por debajo del mínimo</strong> ($${fmt(optResult.faltanteMinimo)} faltante). El proveedor podría no aceptar el pedido.</span></div>`:''}

${combos.length?`<h3 style="font-size:.88rem;color:var(--primary);margin-bottom:10px;"><i class="fas fa-layer-group"></i> Combos históricos (referencia)</h3>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">${combos.map(c=>`<button class="btn btn-sm btn-outline" onclick="applyCombo('${c.id}')">${c.nombre.substring(0,30)} (${c.utilizacion}%)</button>`).join('')}</div>`:''}

<div class="alert-item info" style="margin-bottom:10px;font-size:.75rem;padding:8px 12px;"><i class="fas fa-database" style="color:var(--primary)"></i> SAP &nbsp;&nbsp; <i class="fas fa-calculator" style="color:var(--accent)"></i> Cálculo &nbsp;&nbsp; <i class="fas fa-robot" style="color:var(--success)"></i> IA</div>
<div class="table-container"><table class="editable-table"><thead><tr><th><input type="checkbox" onchange="toggleAllProducts(this.checked)" checked></th><th>SKU</th><th>Descripción</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Cant.</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Stock</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Reserv.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Disp.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cons.mes</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cobert.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> P.Reorden</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo SAP</th><th>Costo cot.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Var.%</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Necesidad</th></tr></thead><tbody>
${d.productos.map((p,i)=>{const need=p.needData||calculatePurchaseNeed(p,APP.rules);const comp=compareCosts(p.costoActual,p.costoCotizado||p.costoActual,APP.rules);
return `<tr style="${!p.selected?'opacity:.5':''}${need.urgency==='critica'?';background:rgba(231,76,60,.05);border-left:3px solid var(--danger)':need.urgency==='necesaria'?';background:rgba(243,156,18,.05);border-left:3px solid var(--warning)':''}"><td><input type="checkbox" ${p.selected?'checked':''} onchange="APP.wizardData.productos[${i}].selected=this.checked;renderView('nueva-simulacion')"></td><td>${p.sku}</td><td style="font-size:.74rem;">${p.descripcion}</td><td><input type="number" value="${p.cantidad}" style="width:55px" onchange="APP.wizardData.productos[${i}].cantidad=parseInt(this.value)||0;renderView('nueva-simulacion')"></td><td>${p.stockTotal||p.stockActual}</td><td>${p.stockReservado||0}</td><td style="font-weight:600;${need.availableStock<need.reorderPoint?'color:var(--danger)':''}">${need.availableStock}</td><td>${need.averageMonthlyConsumption.toFixed(1)}</td><td><span class="semaphore ${need.currentCoverageMonths<2?'red':need.currentCoverageMonths<4?'yellow':'green'}">${need.currentCoverageMonths.toFixed(1)}m</span></td><td>${need.reorderPoint}</td><td>$${p.costoActual.toFixed(2)}</td><td><input type="number" step="0.01" value="${(p.costoCotizado||p.costoActual).toFixed(2)}" style="width:65px" onchange="APP.wizardData.productos[${i}].costoCotizado=parseFloat(this.value);renderView('nueva-simulacion')"></td><td style="color:${comp.variacionPct>15?'var(--danger)':comp.variacionPct>5?'var(--warning)':'var(--success)'}">${comp.variacionPct>0?'+':''}${comp.variacionPct.toFixed(1)}%</td><td><span class="badge-status ${need.urgency==='critica'?'badge-rechazado':need.urgency==='necesaria'?'badge-ajustes':'badge-aprobado'}">${need.urgency==='critica'?'Crítico':need.urgency==='necesaria'?'Necesario':'Opcional'}</span></td></tr>`;}).join('')}
</tbody></table></div>

${optResult.candidatosRecomendados.length?`
<h3 style="font-size:.88rem;color:var(--accent);margin:18px 0 10px;"><i class="fas fa-lightbulb"></i> Productos candidatos adicionales (${optResult.candidatosRecomendados.length})</h3>
<p style="font-size:.78rem;color:var(--gray-400);margin-bottom:10px;">Productos que podrían agregarse para alcanzar monto objetivo o mejorar utilización.</p>
<div class="table-container"><table><thead><tr><th>SKU</th><th>Producto</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Cant. sug.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Valor</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cob. antes</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cob. después</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Rotación est.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Clasificación</th><th>Motivo</th><th></th></tr></thead><tbody>
${optResult.candidatosRecomendados.slice(0,5).map(c=>`<tr><td>${c.sku}</td><td style="font-size:.74rem;">${c.descripcion}</td><td>${c.cantidadSugerida}</td><td>$${fmt(Math.round(c.valorAdicional))}</td><td>${c.coberturaAntes.toFixed(1)}m</td><td>${c.coberturaDespues.toFixed(1)}m</td><td>${c.tiempoRotacion.toFixed(1)}m</td><td><span class="badge-status ${c.clasificacionRotacion==='Excelente'?'badge-aprobado':c.clasificacionRotacion==='Aceptable'?'badge-ajustes':'badge-rechazado'}">${c.clasificacionRotacion}</span></td><td style="font-size:.72rem;">${c.motivo}</td><td><button class="btn btn-sm btn-success" onclick="addCandidateProduct('${c.sku}',${c.cantidadSugerida})"><i class="fas fa-plus"></i></button></td></tr>`).join('')}
</tbody></table></div>`:''}

${optResult.candidatosNoRecomendados.length?`
<details style="margin-top:12px;"><summary style="font-size:.82rem;color:var(--gray-400);cursor:pointer;"><i class="fas fa-ban"></i> Productos no recomendados (${optResult.candidatosNoRecomendados.length}) — riesgo de sobre-stock</summary>
<div class="table-container" style="margin-top:8px;"><table style="font-size:.76rem;"><thead><tr><th>SKU</th><th>Producto</th><th>Cob. resultante</th><th>Razón</th></tr></thead><tbody>
${optResult.candidatosNoRecomendados.map(c=>`<tr style="opacity:.7;"><td>${c.sku}</td><td>${c.descripcion}</td><td style="color:var(--danger);">${c.coberturaDespues.toFixed(1)}m</td><td style="font-size:.72rem;">${c.razonNoRecomendado}</td></tr>`).join('')}
</tbody></table></div></details>`:''}

${d.mixApplied?renderMixComparison():''}
</div></div>${wizNav()}`;}

function addCandidateProduct(sku,qty){const d=APP.wizardData;const existing=d.productos.find(p=>p.sku===sku);
if(existing){existing.selected=true;existing.cantidad=qty;}
else{const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);const catalog=SUPPLIER_CATALOGS[d.proveedorId]||[];const p=catalog.find(x=>x.sku===sku);
if(p){const need=calculatePurchaseNeed(p,APP.rules);d.productos.push({...p,selected:true,cantidad:qty,costoCotizado:p.costoActual*(1+(prov.variacionReciente||0)/100),needData:need,accionRecomendada:'Agregar'});}}
renderView('nueva-simulacion');showToast(`${sku} agregado al pedido`,'success');}

function openProductSearchModal(){
const d=APP.wizardData;
const currentSkus=d.productos.map(p=>p.sku);
// Obtener todos los productos de todos los catálogos
let allProducts=[];
Object.keys(SUPPLIER_CATALOGS).forEach(provId=>{
const prov=PROVEEDORES.find(p=>p.id===parseInt(provId));
const cat=SUPPLIER_CATALOGS[provId]||[];
cat.forEach(p=>{if(!currentSkus.includes(p.sku))allProducts.push({...p,proveedorId:parseInt(provId),proveedorNombre:prov?prov.nombre:'—'});});
});
const content=`<div style="text-align:left;">
<div class="form-group"><label>Buscar producto</label><input type="text" id="product-search-input" placeholder="SKU, nombre, categoría, proveedor..." oninput="filterProductModal()" autofocus></div>
<div id="product-search-results" class="table-container" style="max-height:350px;overflow-y:auto;">
${renderProductSearchTable(allProducts)}
</div>
<p style="font-size:.74rem;color:var(--gray-400);margin-top:10px;"><i class="fas fa-info-circle"></i> Seleccione productos para agregarlos a la simulación actual.</p>
</div>`;
showModal('Buscar y agregar productos',content,[{text:'Cerrar',cls:'btn-outline',action:'closeModal()'}]);}

function renderProductSearchTable(list){
return `<table style="font-size:.78rem;"><thead><tr><th></th><th>SKU</th><th>Producto</th><th>Categoría</th><th>Proveedor</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Stock disp.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cobert.</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Precio</th></tr></thead><tbody>
${list.slice(0,30).map(p=>{const need=calculatePurchaseNeed(p,APP.rules);
return `<tr><td><button class="btn btn-sm btn-success" onclick="selectProductFromModal('${p.sku}',${p.proveedorId})"><i class="fas fa-plus"></i></button></td><td><strong>${p.sku}</strong></td><td>${p.descripcion}</td><td>${p.categoria}</td><td>${p.proveedorNombre}</td><td>${need.availableStock}</td><td><span class="semaphore ${need.currentCoverageMonths<2?'red':need.currentCoverageMonths<4?'yellow':'green'}">${need.currentCoverageMonths.toFixed(1)}m</span></td><td>$${p.costoActual.toFixed(2)}</td><td>$${p.precioVenta.toFixed(2)}</td></tr>`;}).join('')}
</tbody></table>${list.length>30?`<p style="font-size:.72rem;color:var(--gray-400);margin-top:6px;">Mostrando 30 de ${list.length} resultados. Refine la búsqueda.</p>`:''}`;}

function filterProductModal(){
const q=(document.getElementById('product-search-input')?.value||'').toLowerCase();
const d=APP.wizardData;const currentSkus=d.productos.map(p=>p.sku);
let allProducts=[];
Object.keys(SUPPLIER_CATALOGS).forEach(provId=>{
const prov=PROVEEDORES.find(p=>p.id===parseInt(provId));
const cat=SUPPLIER_CATALOGS[provId]||[];
cat.forEach(p=>{if(!currentSkus.includes(p.sku))allProducts.push({...p,proveedorId:parseInt(provId),proveedorNombre:prov?prov.nombre:'—'});});
});
const filtered=allProducts.filter(p=>!q||p.sku.toLowerCase().includes(q)||p.descripcion.toLowerCase().includes(q)||p.categoria.toLowerCase().includes(q)||p.proveedorNombre.toLowerCase().includes(q));
const container=document.getElementById('product-search-results');
if(container)container.innerHTML=renderProductSearchTable(filtered);}

function selectProductFromModal(sku,provId){
const d=APP.wizardData;
const catalog=SUPPLIER_CATALOGS[provId]||[];
const p=catalog.find(x=>x.sku===sku);if(!p)return;
const prov=PROVEEDORES.find(x=>x.id===provId);
const need=calculatePurchaseNeed(p,APP.rules);
d.productos.push({...p,selected:true,cantidad:need.finalSuggestedQty||p.cantidadPromedio||50,costoCotizado:p.costoActual*(1+(prov?.variacionReciente||0)/100),needData:need,accionRecomendada:'Agregar',proveedorId:provId,proveedorNombre:prov?.nombre||'—'});
closeModal();renderView('nueva-simulacion');showToast(`${p.descripcion} (${sku}) agregado al pedido`,'success');}

function getRecommendedAction(p){const need=calculatePurchaseNeed(p,APP.rules);if(need.urgency==='critica')return 'Aumentar';if(need.urgency==='necesaria')return 'Comprar';if(p.concentracion>70)return 'Revisar';if((p.ventas3m||0)===0)return 'Retirar';return 'Mantener';}
function selectRecommended(){APP.wizardData.productos.forEach(p=>{const need=p.needData||calculatePurchaseNeed(p,APP.rules);p.selected=need.needsPurchase;if(need.needsPurchase&&p.cantidad<need.finalSuggestedQty)p.cantidad=need.finalSuggestedQty;});renderView('nueva-simulacion');showToast('Productos con necesidad de compra seleccionados','info');}
function clearSelection(){APP.wizardData.productos.forEach(p=>p.selected=false);renderView('nueva-simulacion');}
function toggleAllProducts(checked){APP.wizardData.productos.forEach(p=>p.selected=checked);renderView('nueva-simulacion');}
function applyCombo(comboId){const prov=APP.wizardData.proveedorId;const combos=HISTORICAL_COMBOS[prov]||[];const combo=combos.find(c=>c.id===comboId);if(!combo)return;APP.wizardData.productos.forEach(p=>{if(combo.productos.includes(p.sku)){p.selected=true;if(combo.cantidades[p.sku])p.cantidad=combo.cantidades[p.sku];}else{p.selected=false;}});APP.wizardData.tipoCarga=combo.contenedor;APP.wizardData.mixApplied=true;renderView('nueva-simulacion');showToast(`Combo "${combo.nombre}" aplicado`,'success');}

function generateMix(){const d=APP.wizardData;const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);const catalog=SUPPLIER_CATALOGS[d.proveedorId]||[];
let recommendations=[];
// Paso 1: Ajustar cantidades según necesidad real
d.productos.forEach(p=>{
const need=calculatePurchaseNeed(p,APP.rules);p.needData=need;
let action='Mantener',justif='Cobertura adecuada.',newQty=p.cantidad;
if(need.urgency==='critica'&&p.selected){action='Aumentar';newQty=Math.max(p.cantidad,need.finalSuggestedQty);justif=`Cobertura crítica (${need.currentCoverageMonths.toFixed(1)}m). Se ajusta a cantidad sugerida.`;}
else if(need.urgency==='necesaria'&&p.selected&&p.cantidad<need.finalSuggestedQty){action='Aumentar';newQty=need.finalSuggestedQty;justif=`Stock bajo punto de reorden. Ajuste a cobertura objetivo.`;}
else if(!p.selected&&need.urgency==='critica'){action='Agregar';p.selected=true;newQty=need.finalSuggestedQty;justif='Producto requiere reposición urgente.';}
else if(p.selected&&p.ordenesTransito>0&&p.ordenesTransito>=need.averageMonthlyConsumption*2){action='Reducir';newQty=Math.max(0,Math.ceil(p.cantidad*0.5));justif='Orden en tránsito cubre necesidad parcialmente.';}
else if(p.selected){
const rotacion=calculateProjectedRotation(p,p.cantidad,APP.rules);
if(rotacion.esSobreStock){action='Reducir';newQty=Math.ceil(need.averageMonthlyConsumption*(APP.rules.coberturaMaxima||9)-need.availableStock);if(newQty<0)newQty=0;justif=`Cantidad original generaría ${rotacion.coberturaPosterior.toFixed(1)}m de cobertura. Reducido.`;}
}
if(action!=='Mantener')recommendations.push({sku:p.sku,desc:p.descripcion,cantActual:p.cantidad,cantSugerida:newQty,accion:action,justif});
p.accionRecomendada=action;if(newQty!==p.cantidad)p.cantidad=newQty;});

// Paso 2: Si no alcanza monto objetivo, sugerir agregar con validación de rotación
const selProds=d.productos.filter(p=>p.selected);
const pedidoActual=selProds.reduce((sum,p)=>sum+(p.cantidad||0)*(p.costoCotizado||p.costoActual),0);
const faltante=(prov.targetOrderValue||0)-pedidoActual;
if(faltante>0){
const noSeleccionados=d.productos.filter(p=>!p.selected);
noSeleccionados.forEach(p=>{
const need=calculatePurchaseNeed(p,APP.rules);
if(!need.needsPurchase)return;
const rotacion=calculateProjectedRotation(p,need.finalSuggestedQty,APP.rules);
if(rotacion.esSobreStock)return;
p.selected=true;p.cantidad=need.finalSuggestedQty;p.accionRecomendada='Agregar';
recommendations.push({sku:p.sku,desc:p.descripcion,cantActual:0,cantSugerida:need.finalSuggestedQty,accion:'Agregar',justif:`Necesita reposición y ayuda a alcanzar monto objetivo. Rotación: ${rotacion.mesesRotacionAdicional.toFixed(1)}m.`});
});}

// Paso 3: Llenar contenedor — agregar productos y subir cantidades hasta 100% utilización
const caps=getCaps(d.tipoCarga);
const selAfter=d.productos.filter(p=>p.selected);
let pesoActual=selAfter.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);
let volActual=selAfter.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
let utilActual=Math.max(pesoActual/caps.peso*100,volActual/caps.vol*100);

// 3a: Agregar productos no seleccionados con buena rotación
if(utilActual<100){
const candidatosFill=d.productos.filter(p=>!p.selected&&(p.ventas3m||0)>0).sort((a,b)=>(b.ventas3m||0)-(a.ventas3m||0));
for(const p of candidatosFill){
if(utilActual>=100)break;
const consumo=p.consumoMensual||(p.ventas3m/3)||1;
// Para llenar contenedor: usar cantidad promedio histórica o hasta 6 meses de consumo
const addQty=Math.max(p.cantidadPromedio||Math.ceil(consumo*4),Math.ceil(consumo*6));
const nuevoPeso=pesoActual+addQty*p.pesoUnitario;
const nuevoVol=volActual+addQty*p.volumenUnitario;
if(nuevoPeso>caps.peso||nuevoVol>caps.vol){
// Intentar con cantidad reducida que quepa
const maxByPeso=Math.floor((caps.peso-pesoActual)/p.pesoUnitario);
const maxByVol=Math.floor((caps.vol-volActual)/p.volumenUnitario);
const fitQty=Math.min(maxByPeso,maxByVol);
if(fitQty<5)continue;
p.selected=true;p.cantidad=fitQty;p.accionRecomendada='Agregar';
pesoActual+=fitQty*p.pesoUnitario;volActual+=fitQty*p.volumenUnitario;
}else{
p.selected=true;p.cantidad=addQty;p.accionRecomendada='Agregar';
pesoActual=nuevoPeso;volActual=nuevoVol;
}
utilActual=Math.max(pesoActual/caps.peso*100,volActual/caps.vol*100);
const rotacion=calculateProjectedRotation(p,p.cantidad,APP.rules);
recommendations.push({sku:p.sku,desc:p.descripcion,cantActual:0,cantSugerida:p.cantidad,accion:'Agregar',justif:`Rotación ${consumo.toFixed(0)} u/mes. Contenedor a ${utilActual.toFixed(0)}%. Cobertura: ${rotacion.coberturaPosterior.toFixed(1)}m.`});
}}

// 3b: Aumentar cantidades de productos ya seleccionados hasta llenar
if(utilActual<100){
const selFill=d.productos.filter(p=>p.selected).sort((a,b)=>(b.ventas3m||0)-(a.ventas3m||0));
let iteraciones=0;
while(utilActual<100&&iteraciones<20){
iteraciones++;let avance=false;
for(const p of selFill){
if(utilActual>=100)break;
const consumo=p.consumoMensual||(p.ventas3m/3)||1;
// Agregar lotes proporcionales al consumo
const addMore=Math.max(Math.ceil(consumo*2),20);
const nuevoPeso=pesoActual+addMore*p.pesoUnitario;
const nuevoVol=volActual+addMore*p.volumenUnitario;
if(nuevoPeso>caps.peso||nuevoVol>caps.vol){
const maxByPeso=Math.floor((caps.peso-pesoActual)/p.pesoUnitario);
const maxByVol=Math.floor((caps.vol-volActual)/p.volumenUnitario);
const fitQty=Math.min(maxByPeso,maxByVol);
if(fitQty<2)continue;
const oldQty=p.cantidad;p.cantidad+=fitQty;
pesoActual+=fitQty*p.pesoUnitario;volActual+=fitQty*p.volumenUnitario;
utilActual=Math.max(pesoActual/caps.peso*100,volActual/caps.vol*100);
recommendations.push({sku:p.sku,desc:p.descripcion,cantActual:oldQty,cantSugerida:p.cantidad,accion:'Aumentar',justif:`Completa contenedor (${utilActual.toFixed(0)}%).`});
avance=true;break;
}else{
const oldQty=p.cantidad;p.cantidad+=addMore;
pesoActual=nuevoPeso;volActual=nuevoVol;
utilActual=Math.max(pesoActual/caps.peso*100,volActual/caps.vol*100);
avance=true;
// Solo agregar al reporte si es significativo
if(addMore>=10)recommendations.push({sku:p.sku,desc:p.descripcion,cantActual:oldQty,cantSugerida:p.cantidad,accion:'Aumentar',justif:`Incremento para llenar contenedor (${utilActual.toFixed(0)}%).`});
}}
if(!avance)break;
}}

APP.wizardData.mixRecommendations=recommendations;APP.wizardData.mixApplied=true;
renderView('nueva-simulacion');showToast(`Optimización completada: ${recommendations.length} ajustes — utilización ${utilActual.toFixed(0)}%`,'success');}

function renderMixComparison(){const d=APP.wizardData;const recs=d.mixRecommendations||[];if(!recs.length)return '';
const sel=d.productos.filter(p=>p.selected);const caps=getCaps(d.tipoCarga);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
const utilP=(peso/caps.peso*100).toFixed(1);const utilV=(vol/caps.vol*100).toFixed(1);const util=Math.max(parseFloat(utilP),parseFloat(utilV)).toFixed(1);
return `<h3 style="font-size:.9rem;color:var(--primary);margin:20px 0 12px;"><i class="fas fa-exchange-alt"></i> Resultado del mix inteligente</h3>
<div class="comparison-grid"><div class="comparison-box recommended"><h4><i class="fas fa-magic"></i> Mix recomendado</h4>
<div class="metric"><span class="label">Productos</span><span class="value">${sel.length}</span></div>
<div class="metric"><span class="label">Peso total</span><span class="value">${fmt(Math.round(peso))} kg</span></div>
<div class="metric"><span class="label">Volumen</span><span class="value">${vol.toFixed(2)} m³</span></div>
<div class="metric"><span class="label">Utilización</span><span class="value"><span class="semaphore ${util>=85?'green':util>=70?'yellow':'red'}">${util}%</span></span></div>
</div><div class="comparison-box"><h4><i class="fas fa-list"></i> Cambios sugeridos (${recs.length})</h4>
${recs.map(r=>`<div class="metric"><span class="label">${r.sku}: ${r.accion}</span><span class="value">${r.cantActual}→${r.cantSugerida}</span></div>`).join('')}
</div></div>
<div class="table-container" style="margin-top:12px;"><table><thead><tr><th>Producto</th><th>Cant. anterior</th><th>Cant. sugerida</th><th>Acción</th><th>Justificación</th></tr></thead><tbody>
${recs.map(r=>`<tr><td>${r.desc}</td><td>${r.cantActual}</td><td><strong>${r.cantSugerida}</strong></td><td><span class="badge-status ${r.accion==='Agregar'?'badge-aprobado':r.accion==='Retirar'?'badge-rechazado':'badge-ajustes'}">${r.accion}</span></td><td style="font-size:.78rem;">${r.justif}</td></tr>`).join('')}
</tbody></table></div>`;}

function renderWS4(){const d=APP.wizardData;const isCIF=d.incoterm==='CIF';const isEXW=d.incoterm==='EXW';const isConsolidada=d.tipoImportacion==='consolidada';
const sel=d.productos.filter(p=>p.selected);const caps=getCaps(d.tipoCarga);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
const utilP=(peso/caps.peso*100).toFixed(1);const utilV=(vol/caps.vol*100).toFixed(1);const util=Math.max(parseFloat(utilP),parseFloat(utilV)).toFixed(1);
const sem=v=>v>=85?'green':v>=70?'yellow':'red';
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 4: Logística y costos</h2></div><div class="card-body">
${isCIF?'<div class="alert-item info"><i class="fas fa-info-circle"></i><span>Incoterm CIF: el costo del producto incluye flete y seguro hasta el puerto de destino. Estos campos están desactivados.</span></div>':''}
${isEXW?'<div class="alert-item warning"><i class="fas fa-exclamation-triangle"></i><span>Incoterm EXW: incluya todos los costos desde la planta del proveedor.</span></div>':''}

${isConsolidada?`<h3 style="font-size:.9rem;color:var(--accent);margin-bottom:12px;"><i class="fas fa-boxes"></i> Costos de consolidación</h3>
<div class="form-row">
<div class="form-group"><label>Transporte proveedor → ${d.consolidationPoint} ($)</label><input type="number" value="${d.transporteConsolidacion||0}" onchange="APP.wizardData.transporteConsolidacion=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Recepción en consolidación ($)</label><input type="number" value="${d.recepcionConsolidacion||0}" onchange="APP.wizardData.recepcionConsolidacion=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Handling ($)</label><input type="number" value="${d.handling||0}" onchange="APP.wizardData.handling=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
</div><div class="form-row">
<div class="form-group"><label>Bodega / almacenaje ($)</label><input type="number" value="${d.bodega||0}" onchange="APP.wizardData.bodega=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Consolidación ($)</label><input type="number" value="${d.consolidacion||0}" onchange="APP.wizardData.consolidacion=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Documentación ($)</label><input type="number" value="${d.documentacion||0}" onchange="APP.wizardData.documentacion=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
</div><hr style="margin:14px 0;border:none;border-top:1px solid var(--gray-200);">
<h3 style="font-size:.9rem;color:var(--primary);margin-bottom:12px;"><i class="fas fa-ship"></i> Costos internacionales</h3>`:''}

<div class="form-row">
<div class="form-group"><label>Flete internacional ($)</label><input type="number" value="${d.flete}" ${isCIF?'disabled':''} onchange="APP.wizardData.flete=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Seguro ($)</label><input type="number" value="${d.seguro}" ${isCIF?'disabled':''} onchange="APP.wizardData.seguro=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Operador logístico ($)</label><input type="number" value="${d.operador}" onchange="APP.wizardData.operador=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
</div><div class="form-row">
<div class="form-group"><label>Agencia aduanal ($)</label><input type="number" value="${d.agencia}" onchange="APP.wizardData.agencia=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Aranceles ($)</label><input type="number" value="${d.aranceles}" onchange="APP.wizardData.aranceles=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Impuestos ($)</label><input type="number" value="${d.impuestos}" onchange="APP.wizardData.impuestos=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
</div><div class="form-row">
<div class="form-group"><label>Tratado comercial</label><select onchange="APP.wizardData.tratado=this.value==='si';renderView('nueva-simulacion')"><option value="si" ${d.tratado?'selected':''}>Sí</option><option value="no" ${!d.tratado?'selected':''}>No</option></select></div>
<div class="form-group"><label>Descuento tratado ($)</label><input type="number" value="${d.descuentoTratado}" ${!d.tratado?'disabled':''} onchange="APP.wizardData.descuentoTratado=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Transporte local ($)</label><input type="number" value="${d.transporteLocal}" onchange="APP.wizardData.transporteLocal=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
</div><div class="form-row">
<div class="form-group"><label>Otros costos ($)</label><input type="number" value="${d.otrosCostos}" onchange="APP.wizardData.otrosCostos=parseFloat(this.value)||0;renderView('nueva-simulacion')"></div>
<div class="form-group"><label>Tiempo tránsito (días)</label><input type="number" value="${d.tiempoTransito}" onchange="APP.wizardData.tiempoTransito=parseInt(this.value)"></div>
<div class="form-group"><label>Método distribución</label><select onchange="APP.wizardData.metodoDistribucion=this.value"><option value="valor" ${d.metodoDistribucion==='valor'?'selected':''}>Por valor</option><option value="peso" ${d.metodoDistribucion==='peso'?'selected':''}>Por peso</option><option value="volumen" ${d.metodoDistribucion==='volumen'?'selected':''}>Por volumen</option><option value="hibrido" ${d.metodoDistribucion==='hibrido'?'selected':''}>Híbrido (40% valor, 30% peso, 30% vol)</option></select></div>
</div>
${d.metodoDistribucion==='hibrido'?`<div class="alert-item info" style="margin-top:8px;"><i class="fas fa-balance-scale"></i><span>Distribución híbrida: ${(APP.rules.distribucionHibrida?.valor||0.4)*100}% por valor, ${(APP.rules.distribucionHibrida?.peso||0.3)*100}% por peso, ${(APP.rules.distribucionHibrida?.volumen||0.3)*100}% por volumen. Configurable en Reglas.</span></div>`:''}
<h3 style="margin-top:18px;font-size:.92rem;color:var(--primary);">Utilización del contenedor (${d.tipoCarga})</h3>
<div class="util-display">
<div class="util-item"><label>Peso total</label><span class="util-value">${fmt(Math.round(peso))} kg</span><div class="progress-bar" style="margin-top:5px;"><div class="fill ${sem(utilP)}" style="width:${Math.min(utilP,100)}%"></div></div></div>
<div class="util-item"><label>Volumen</label><span class="util-value">${vol.toFixed(2)} m³</span><div class="progress-bar" style="margin-top:5px;"><div class="fill ${sem(utilV)}" style="width:${Math.min(utilV,100)}%"></div></div></div>
<div class="util-item"><label>Utilización efectiva</label><span class="semaphore ${sem(util)}">${util}%</span></div>
</div>
${parseFloat(util)<70?'<div class="alert-item danger"><i class="fas fa-exclamation-circle"></i><span>Utilización inferior al 70%. Considere agregar productos o cambiar contenedor.</span></div>':''}
</div></div>${wizNav()}`;}

function renderWS5(){const d=APP.wizardData;const calc=calcAnalysis(d);
const prov=PROVEEDORES.find(p=>p.id===d.proveedorId)||PROVEEDORES[0];
const tcActual=APP.rules.tipoCambio||530;
const diasEntrega=d.tiempoTransito||prov.tiempoEntrega||35;
const variacionTC=((diasEntrega/30)*0.8).toFixed(1);// ~0.8% por mes de variación estimada
const tcProyectado=(tcActual*(1+parseFloat(variacionTC)/100)).toFixed(2);
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 5: Análisis y escenarios</h2></div><div class="card-body">
<div class="kpi-grid" style="margin-bottom:16px;">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>$${fmt(calc.montoCompra)}</h3><p>Monto compra</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-truck-loading"></i></div><div class="kpi-info"><h3>$${fmt(calc.costosAd)}</h3><p>Costos adicionales</p></div></div>
<div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-flag-checkered"></i></div><div class="kpi-info"><h3>$${fmt(calc.costoTotalCR)}</h3><p>Costo puesto en CR</p></div></div>
</div>

<div class="card" style="border:1px solid var(--gray-200);margin-bottom:16px;box-shadow:none;"><div class="card-header" style="background:var(--gray-50);"><h2><i class="fas fa-exchange-alt"></i> Tipo de cambio y proyección</h2></div><div class="card-body" style="padding:14px 18px;">
<div class="form-row">
<div class="form-group"><label>Tipo de cambio actual (₡/USD)</label><div style="font-size:1.2rem;font-weight:700;color:var(--primary);">₡${tcActual.toFixed?tcActual.toFixed(2):tcActual}</div><p style="font-size:.72rem;color:var(--gray-400);margin-top:2px;">Configurado en el sistema</p></div>
<div class="form-group"><label>Tiempo máx. entrega (${prov.nombre})</label><div style="font-size:1.2rem;font-weight:700;color:var(--accent);">${diasEntrega} días</div><p style="font-size:.72rem;color:var(--gray-400);margin-top:2px;">Según histórico del proveedor</p></div>
<div class="form-group"><label>TC proyectado a ${diasEntrega} días</label><div style="font-size:1.2rem;font-weight:700;color:${parseFloat(variacionTC)>1?'var(--danger)':'var(--gray-600)'};">₡${tcProyectado}</div><p style="font-size:.72rem;color:var(--gray-400);margin-top:2px;">Variación estimada: +${variacionTC}%</p></div>
</div>
<div style="display:flex;gap:16px;margin-top:10px;font-size:.82rem;flex-wrap:wrap;">
<div style="padding:8px 14px;background:var(--gray-50);border-radius:6px;"><strong>Costo total (TC actual):</strong> ₡${fmt(Math.round(calc.costoTotalCR*tcActual))}</div>
<div style="padding:8px 14px;background:rgba(230,126,34,0.08);border-radius:6px;border:1px solid rgba(230,126,34,0.2);"><strong>Costo total (TC proyectado):</strong> ₡${fmt(Math.round(calc.costoTotalCR*parseFloat(tcProyectado)))}</div>
<div style="padding:8px 14px;background:var(--gray-50);border-radius:6px;"><strong>Diferencia:</strong> ₡${fmt(Math.round(calc.costoTotalCR*(parseFloat(tcProyectado)-tcActual)))}</div>
</div>
<p style="font-size:.72rem;color:var(--gray-400);margin-top:8px;"><i class="fas fa-info-circle"></i> La proyección es estimada. El tipo de cambio puede variar durante los ${diasEntrega} días de tránsito de la mercancía.</p>
</div></div>

<h3 style="font-size:.9rem;color:var(--primary);margin-bottom:10px;">Escenario de precios</h3>
<div class="scenario-tabs">
<div class="scenario-tab ${d.escenario==='A'?'active':''}" onclick="APP.wizardData.escenario='A';renderView('nueva-simulacion')">A. Precio actual</div>
<div class="scenario-tab ${d.escenario==='B'?'active':''}" onclick="APP.wizardData.escenario='B';renderView('nueva-simulacion')">B. Mantener margen</div>
<div class="scenario-tab ${d.escenario==='C'?'active':''}" onclick="APP.wizardData.escenario='C';renderView('nueva-simulacion')">C. Margen objetivo</div>
</div>
<div class="table-container"><table><thead><tr><th>SKU</th><th>Producto</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo SAP</th><th>Costo cot.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Costos logíst.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Costo CR</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Var.%</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Precio</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Margen act.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Margen proy.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Precio sug.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Estado</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Acción</th></tr></thead><tbody>
${calc.productos.map(p=>`<tr><td>${p.sku}</td><td style="font-size:.75rem;">${p.descripcion}</td><td>$${p.costoActual.toFixed(2)}</td><td>$${p.costoCotizado.toFixed(2)}</td><td>$${p.costoLogDist.toFixed(2)}</td><td>$${p.costoProyectado.toFixed(2)}</td><td style="color:${p.aumento>15?'var(--danger)':p.aumento>10?'var(--warning)':'var(--gray-600)'}">${p.aumento.toFixed(1)}%</td><td>$${p.precioVenta.toFixed(2)}</td><td>${p.margenActual.toFixed(1)}%</td><td style="color:${p.margenProy<APP.rules.margenMinimo?'var(--danger)':'inherit'}">${p.margenProy.toFixed(1)}%</td><td><strong>$${p.precioSugerido.toFixed(2)}</strong></td><td><span class="badge-status ${p.estadoMargen==='Saludable'?'badge-aprobado':p.estadoMargen==='En riesgo'?'badge-ajustes':p.estadoMargen==='Negativo'?'badge-rechazado':'badge-pendiente'}">${p.estadoMargen}</span></td><td><span class="badge-status ${p.accionRecomendada==='Mantener'?'badge-aprobado':p.accionRecomendada==='Retirar'?'badge-rechazado':'badge-ajustes'}">${p.accionRecomendada}</span></td></tr>`).join('')}
</tbody></table></div>
<div style="display:flex;gap:16px;margin-top:14px;flex-wrap:wrap;">
<div class="alert-item success" style="flex:1;"><i class="fas fa-check"></i><span>Saludables: ${calc.productos.filter(p=>p.estadoMargen==='Saludable').length}</span></div>
<div class="alert-item warning" style="flex:1;"><i class="fas fa-exclamation"></i><span>En riesgo: ${calc.productos.filter(p=>p.estadoMargen==='En riesgo'||p.estadoMargen==='Bajo observación').length}</span></div>
<div class="alert-item danger" style="flex:1;"><i class="fas fa-times"></i><span>Negativos: ${calc.productos.filter(p=>p.estadoMargen==='Negativo').length}</span></div>
</div>
<h3 style="font-size:.9rem;color:var(--primary);margin:18px 0 10px;">Análisis inteligente</h3>
<div class="analysis-box">${calc.insights.map(i=>`<p><i class="fas ${i.icon}"></i> ${i.text}</p>`).join('')}</div>
<div class="rec-card ${calc.rec.clase}"><i class="fas ${calc.rec.icon}" style="font-size:2rem;margin-bottom:8px;color:${calc.rec.color};"></i><h3 style="color:${calc.rec.color};">${calc.rec.texto}</h3><p class="confidence">Confianza: <strong>${calc.rec.confianza}</strong></p><p style="font-size:.84rem;margin-top:8px;color:var(--gray-500);">${calc.rec.razon}</p></div>
</div></div>${wizNav()}`;}

function renderWS6(){const d=APP.wizardData;const calc=calcAnalysis(d);const sel=d.productos.filter(p=>p.selected);const caps=getCaps(d.tipoCarga);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
const util=Math.max(peso/caps.peso*100,vol/caps.vol*100).toFixed(1);const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);
const roleActions={comercial:`<button class="btn btn-outline" onclick="guardarSim('borrador')"><i class="fas fa-save"></i> Guardar borrador</button><button class="btn btn-success" onclick="guardarSim('aprobado')"><i class="fas fa-check"></i> Aprobar</button><button class="btn btn-accent" onclick="aprobarYCrearOC()"><i class="fas fa-database"></i> Aprobar y crear OC en SAP</button><button class="btn btn-danger" onclick="confirmReject()"><i class="fas fa-times"></i> Rechazar</button>`,
importaciones:`<button class="btn btn-outline" onclick="guardarSim('borrador')"><i class="fas fa-save"></i> Borrador</button><button class="btn btn-success" onclick="guardarSim('aprobado')"><i class="fas fa-check"></i> Aprobar</button><button class="btn btn-accent" onclick="aprobarYCrearOC()"><i class="fas fa-database"></i> Aprobar y crear OC en SAP</button><button class="btn btn-danger" onclick="confirmReject()"><i class="fas fa-times"></i> Rechazar</button>`,
aprobador:`<button class="btn btn-outline" onclick="guardarSim('borrador')"><i class="fas fa-save"></i> Borrador</button><button class="btn btn-success" onclick="guardarSim('aprobado')"><i class="fas fa-check"></i> Aprobar</button><button class="btn btn-accent" onclick="aprobarYCrearOC()"><i class="fas fa-database"></i> Aprobar y crear OC en SAP</button><button class="btn btn-danger" onclick="confirmReject()"><i class="fas fa-times"></i> Rechazar</button>`,
admin:`<button class="btn btn-outline" onclick="guardarSim('borrador')"><i class="fas fa-save"></i> Borrador</button><button class="btn btn-success" onclick="guardarSim('aprobado')"><i class="fas fa-check"></i> Aprobar</button><button class="btn btn-accent" onclick="aprobarYCrearOC()"><i class="fas fa-database"></i> Aprobar y crear OC en SAP</button><button class="btn btn-danger" onclick="confirmReject()"><i class="fas fa-times"></i> Rechazar</button>`};
return `<div class="card" style="box-shadow:none;border:1px solid var(--gray-100);"><div class="card-header"><h2>Paso 6: Decisión</h2></div><div class="card-body">
<div class="kpi-grid">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>$${fmt(calc.montoCompra)}</h3><p>Total compra</p></div></div>
<div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-flag-checkered"></i></div><div class="kpi-info"><h3>$${fmt(calc.costoTotalCR)}</h3><p>Costo puesto CR</p></div></div>
<div class="kpi-card"><div class="kpi-icon teal"><i class="fas fa-box"></i></div><div class="kpi-info"><h3>${util}%</h3><p>Utilización</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-calendar"></i></div><div class="kpi-info"><h3>${d.tiempoTransito}d</h3><p>Tiempo tránsito</p></div></div>
</div>
<div class="rec-card ${calc.rec.clase}" style="margin:16px 0;"><h3 style="color:${calc.rec.color};">${calc.rec.texto}</h3><p class="confidence">Confianza: ${calc.rec.confianza}</p></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:18px;">${roleActions[APP.currentRole]||roleActions.comercial}
<button class="btn btn-outline" onclick="showToast('Reporte exportado (simulado)','success')"><i class="fas fa-download"></i> Exportar</button></div>
<p style="font-size:.74rem;color:var(--gray-400);text-align:center;margin-top:14px;">Equivalencia CRC: ₡${fmt(Math.round(calc.costoTotalCR*APP.rules.tipoCambio))} (TC: ${APP.rules.tipoCambio})</p>
<div class="alert-item info" style="margin-top:16px;text-align:center;"><i class="fas fa-user-shield"></i><span style="font-weight:600;">Recomendación de apoyo. La decisión final corresponde al especialista de Importaciones.</span></div>
</div></div>${wizNav()}`;}

function guardarSim(estado){const d=APP.wizardData;const calc=calcAnalysis(d);const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);const sel=d.productos.filter(p=>p.selected);const caps=getCaps(d.tipoCarga);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);const util=Math.round(Math.max(peso/caps.peso*100,vol/caps.vol*100));
const ns={id:d.editingSimId||('SIM-2026-'+String(APP.simulaciones.length+1).padStart(3,'0')),fecha:new Date().toISOString().split('T')[0],motivo:d.tipoAnalisis,proveedor:prov.nombre,tipoProveedor:prov.recurrente?'Recurrente':'Nuevo',pais:prov.pais,region:prov.region,incoterm:d.incoterm,tipoCarga:d.tipoCarga,numProductos:sel.length,totalCompra:Math.round(calc.montoCompra),costoCR:Math.round(calc.costoTotalCR),utilizacion:util,recomendacion:calc.rec.texto,estado,fechaLlegada:null,responsable:d.responsable,sapOrder:null,tipoImportacion:d.tipoImportacion||'regular'};
if(d.editingSimId){const idx=APP.simulaciones.findIndex(x=>x.id===d.editingSimId);if(idx>=0)APP.simulaciones[idx]=ns;else APP.simulaciones.unshift(ns);}else{APP.simulaciones.unshift(ns);}
saveData();APP.wizardData={};APP.wizardStep=1;showToast(`${ns.id} guardada como "${ESTADOS_MAP[estado]}"`,`success`);navigateTo('simulaciones');}
function confirmReject(){showModal('Confirmar rechazo','¿Rechazar esta simulación?',[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Rechazar',cls:'btn-danger',action:"guardarSim('rechazado');closeModal()"}]);}

function aprobarYCrearOC(){const d=APP.wizardData;const calc=calcAnalysis(d);const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);const sel=d.productos.filter(p=>p.selected);const caps=getCaps(d.tipoCarga);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);const util=Math.round(Math.max(peso/caps.peso*100,vol/caps.vol*100));
const sapNum='4500'+String(Math.floor(Math.random()*9000)+1000);
const ns={id:'SIM-2026-'+String(APP.simulaciones.length+1).padStart(3,'0'),fecha:new Date().toISOString().split('T')[0],motivo:d.tipoAnalisis,proveedor:prov.nombre,tipoProveedor:prov.recurrente?'Recurrente':'Nuevo',pais:prov.pais,region:prov.region,incoterm:d.incoterm,tipoCarga:d.tipoCarga,numProductos:sel.length,totalCompra:Math.round(calc.montoCompra),costoCR:Math.round(calc.costoTotalCR),utilizacion:util,recomendacion:calc.rec.texto,estado:'oc_generada',fechaLlegada:null,responsable:d.responsable,sapOrder:sapNum};
APP.simulaciones.unshift(ns);
const po={id:'OC-2026-'+String(APP.purchaseOrders.length+50).padStart(3,'0'),simId:ns.id,proveedor:prov.nombre,fecha:ns.fecha,estado:'sap',sapOrder:sapNum,total:ns.totalCompra,productos:sel.length};
APP.purchaseOrders.push(po);
saveData();APP.wizardData={};APP.wizardStep=1;
showToast(`${ns.id} aprobada y orden SAP ${sapNum} creada (simulado)`,'success');navigateTo('simulaciones');}

// ===== CÁLCULOS =====
function calcAnalysis(d){
const sel=d.productos.filter(p=>p.selected);const montoCompra=sel.reduce((a,p)=>a+p.cantidad*p.costoCotizado,0);
// Costos de consolidación (solo si aplica)
const costosConsolidacion=(d.transporteConsolidacion||0)+(d.recepcionConsolidacion||0)+(d.handling||0)+(d.bodega||0)+(d.consolidacion||0)+(d.documentacion||0);
const costosAd=(d.flete||0)+(d.seguro||0)+(d.operador||0)+(d.agencia||0)+(d.aranceles||0)+(d.impuestos||0)+(d.transporteLocal||0)+(d.otrosCostos||0)-(d.tratado?(d.descuentoTratado||0):0)+costosConsolidacion;
const costoTotalCR=montoCompra+costosAd;const totalPeso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const totalVol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
const productos=sel.map(p=>{const val=p.cantidad*p.costoCotizado;let fd;
if(d.metodoDistribucion==='hibrido'){const h=APP.rules.distribucionHibrida||{valor:0.4,peso:0.3,volumen:0.3};const fdVal=val/(montoCompra||1);const fdPeso=(p.cantidad*p.pesoUnitario)/(totalPeso||1);const fdVol=(p.cantidad*p.volumenUnitario)/(totalVol||1);fd=fdVal*h.valor+fdPeso*h.peso+fdVol*h.volumen;}
else if(d.metodoDistribucion==='peso')fd=(p.cantidad*p.pesoUnitario)/(totalPeso||1);else if(d.metodoDistribucion==='volumen')fd=(p.cantidad*p.volumenUnitario)/(totalVol||1);else fd=val/(montoCompra||1);
const costoLogDist=(costosAd*fd)/p.cantidad;const costoProyectado=p.costoCotizado+costoLogDist;const aumento=((costoProyectado-p.costoActual)/p.costoActual)*100;
const margenActual=((p.precioVenta-p.costoActual)/p.precioVenta)*100;let margenProy,precioSugerido;
if(d.escenario==='B'){precioSugerido=costoProyectado/(1-margenActual/100);margenProy=margenActual;}
else if(d.escenario==='C'){precioSugerido=costoProyectado/(1-d.margenObjetivo/100);margenProy=d.margenObjetivo;}
else{margenProy=((p.precioVenta-costoProyectado)/p.precioVenta)*100;precioSugerido=p.precioVenta;}
let estadoMargen;if(margenProy>=APP.rules.margenObjetivo)estadoMargen='Saludable';else if(margenProy>=APP.rules.margenMinimo)estadoMargen='Bajo observación';else if(margenProy>=10)estadoMargen='En riesgo';else estadoMargen='Negativo';
let accionRecomendada='Mantener';if(estadoMargen==='Negativo')accionRecomendada='Retirar';else if(estadoMargen==='En riesgo')accionRecomendada='Ajustar precio';
// Rotación proyectada por producto
const rotacion=calculateProjectedRotation(p,p.cantidad,APP.rules);
return {...p,costoLogDist,costoProyectado,aumento,margenActual,margenProy,precioSugerido,estadoMargen,accionRecomendada,rotacion};});
const insights=genInsights(d,productos,costosAd);const rec=genRecommendation(d,productos);
return {montoCompra:Math.round(montoCompra),costosAd:Math.round(costosAd),costosConsolidacion:Math.round(costosConsolidacion),costoTotalCR:Math.round(costoTotalCR),productos,insights,rec};}

function genInsights(d,prods,costosAd){const ins=[];const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);
const margenProm=prods.reduce((a,p)=>a+p.margenProy,0)/prods.length;const margenActProm=prods.reduce((a,p)=>a+p.margenActual,0)/prods.length;
if(margenProm<margenActProm-5)ins.push({icon:'fa-arrow-down',text:`Margen promedio baja del ${margenActProm.toFixed(0)}% al ${margenProm.toFixed(0)}%. Considere ajustar precios.`});
const conc=prods.filter(p=>p.concentracion>APP.rules.maxConcentracionCliente);if(conc.length)ins.push({icon:'fa-user-clock',text:`${conc.length} producto(s) con concentración superior al ${APP.rules.maxConcentracionCliente}% en un solo cliente.`});
const caps=getCaps(d.tipoCarga);const sel=d.productos.filter(p=>p.selected);const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const util=Math.max(peso/caps.peso*100,(sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0)/caps.vol)*100);
if(util<APP.rules.utilizacionMinima)ins.push({icon:'fa-box-open',text:`Contenedor al ${util.toFixed(0)}% de utilización. Evalúe agregar productos o cambiar tipo.`});
if(d.tratado)ins.push({icon:'fa-handshake',text:`Tratado comercial aplicable. Reducción estimada: $${d.descuentoTratado}.`});
if(!prov?.recurrente)ins.push({icon:'fa-user-plus',text:'Proveedor nuevo sin histórico suficiente. Confianza media.'});
const combos=HISTORICAL_COMBOS[d.proveedorId]||[];if(combos.length&&d.mixApplied)ins.push({icon:'fa-history',text:'Mix basado en combinación histórica exitosa del proveedor.'});
const negat=prods.filter(p=>p.estadoMargen==='Negativo');if(negat.length)ins.push({icon:'fa-exclamation-triangle',text:`${negat.length} producto(s) con margen negativo. Se recomienda retirar o ajustar precio.`});
return ins;}

function genRecommendation(d,prods){let score=50;const prov=PROVEEDORES.find(p=>p.id===d.proveedorId);
const margenProm=prods.reduce((a,p)=>a+p.margenProy,0)/(prods.length||1);
const montoCompra=prods.reduce((a,p)=>a+p.cantidad*(p.costoCotizado||p.costoActual),0);
// === POSITIVOS ===
// Monto mínimo/objetivo
if(prov&&montoCompra>=(prov.minimumOrderValue||0))score+=10;
if(prov&&montoCompra>=(prov.targetOrderValue||0))score+=10;
// Utilización
const caps=getCaps(d.tipoCarga);const sel=d.productos.filter(p=>p.selected);
const peso=sel.reduce((a,p)=>a+p.cantidad*p.pesoUnitario,0);const vol=sel.reduce((a,p)=>a+p.cantidad*p.volumenUnitario,0);
const util=Math.max(peso/caps.peso*100,vol/caps.vol*100);
if(util>=85)score+=15;
// Cobertura posterior <=6 meses promedio
const cobProm=prods.reduce((a,p)=>a+(p.rotacion?p.rotacion.coberturaPosterior:4),0)/(prods.length||1);
if(cobProm<=6)score+=10;
// Productos críticos cubiertos
const criticos=prods.filter(p=>{const need=calculatePurchaseNeed(p,APP.rules);return need.urgency==='critica';});
if(criticos.length>0)score+=10;
// Proyección comercial respalda
const conProy=prods.filter(p=>p.proyeccionComercial&&p.proyeccionComercial.qty>0).length;
if(conProy>prods.length*0.3)score+=5;
// Costo estable
const aumProm=prods.reduce((a,p)=>a+(p.aumento||0),0)/(prods.length||1);
if(aumProm<=5)score+=5;
// Alta rotación
const altaRot=prods.filter(p=>(p.ventas3m||0)>30).length;
if(altaRot>prods.length*0.5)score+=10;

// === NEGATIVOS ===
// Cotización vencida
const cotProv=APP.cotizaciones.find(c=>c.proveedorId===d.proveedorId);
if(cotProv){const qs=calculateQuoteStatus(cotProv,APP.rules);if(qs.vencida)score-=25;}
// Pedido por debajo mínimo
if(prov&&montoCompra<(prov.minimumOrderValue||0))score-=15;
// Sobre-stock >9 meses
const sobreStock=prods.filter(p=>p.rotacion&&p.rotacion.esSobreStock).length;
if(sobreStock>0)score-=20;
// Baja rotación
const bajaRot=prods.filter(p=>(p.ventas3m||0)<10).length;if(bajaRot>prods.length*0.5)score-=15;
// Orden en tránsito cubre necesidad
const transitoCubre=prods.filter(p=>(p.ordenesTransito||0)>=(p.consumoMensual||1)*2).length;
if(transitoCubre>prods.length*0.3)score-=10;
// Concentración
const altaConc=prods.filter(p=>(p.concentracion||0)>APP.rules.maxConcentracionCliente);if(altaConc.length>prods.length*0.5)score-=10;
// Incremento costo >20%
if(aumProm>20)score-=15;
// Negativo margen
const negativos=prods.filter(p=>p.estadoMargen==='Negativo').length;if(negativos>0)score-=15;
// Proveedor no recurrente
if(!prov?.recurrente)score-=10;
// Utilización baja
if(util<70)score-=15;

// === CONSOLIDADO ===
if(d.tipoImportacion==='consolidada'){
const suppliers=d.suppliers||[];
const mismoConsolidation=suppliers.every(s=>{const sp=PROVEEDORES.find(p=>p.id===s.supplierId);return sp&&sp.consolidationPoint===d.consolidationPoint;});
if(mismoConsolidation&&suppliers.length>1)score+=5;
const incomp=suppliers.filter(s=>{const sp=PROVEEDORES.find(p=>p.id===s.supplierId);return sp&&!sp.allowsConsolidation;});
if(incomp.length>0)score-=15;
if(!d.excepcionAprobada&&incomp.length>0)score-=20;
}

// Narrativa de recomendación
let texto,clase,icon,color,confianza,razon,narrativa=[];
const pNombre=prov?prov.nombre:'Proveedor';
// Necesidad
const necesarios=prods.filter(p=>{const n=calculatePurchaseNeed(p,APP.rules);return n.needsPurchase;}).length;
narrativa.push(`Se requieren ${necesarios} de ${prods.length} productos para mantener cobertura objetivo.`);
// Optimización
if(prov)narrativa.push(`El pedido base alcanza $${fmt(Math.round(montoCompra))} de un objetivo de $${fmt(prov.targetOrderValue||0)}.`);
// Utilización
narrativa.push(`La utilización del contenedor es ${util.toFixed(0)}%.`);
// Riesgo
if(cobProm>6)narrativa.push(`La cobertura promedio resultante será ${cobProm.toFixed(1)} meses.`);
if(sobreStock>0)narrativa.push(`${sobreStock} producto(s) generarían sobre-stock.`);

if(score>=65){texto='COMPRAR';clase='comprar';icon='fa-check-circle';color='var(--success)';razon=narrativa.join(' ');}
else if(score>=45){texto='COMPRAR CON AJUSTES';clase='ajustes';icon='fa-exclamation-circle';color='var(--warning)';razon=narrativa.join(' ');}
else if(score>=30){texto='ESPERAR';clase='esperar';icon='fa-pause-circle';color='var(--accent)';razon=narrativa.join(' ');}
else{texto='NO COMPRAR';clase='no-comprar';icon='fa-times-circle';color='var(--danger)';razon=narrativa.join(' ');}
confianza=(!prov?.recurrente)?'Baja':(score>=60||score<30?'Alta':'Media');
return {texto,clase,icon,color,confianza,razon,score};}

// ===== PRESETS =====
function loadPreset(type){
const cat1=SUPPLIER_CATALOGS[1];const cat3=SUPPLIER_CATALOGS[3];
if(type==='comprar'){APP.wizardData={tipoImportacion:'regular',tipoAnalisis:'Compra completa por proveedor',motivo:'',area:'Comercial',responsable:'Carlos Méndez',fechaRequerida:'2026-09-15',observaciones:'Reposición programada. Stock crítico.',proveedorId:1,incoterm:'CIF',tipoCarga:'40 pies',
productos:cat1.map(p=>({...p,selected:true,cantidad:p.cantidadPromedio,costoCotizado:p.costoActual*0.97,accionRecomendada:'Mantener',stockActual:Math.min(p.stockActual,10),cobertura:1.5})),selectedProducts:[],
flete:0,seguro:0,operador:750,agencia:580,aranceles:1200,impuestos:900,tratado:true,descuentoTratado:600,transporteLocal:400,otrosCostos:100,tiempoTransito:35,metodoDistribucion:'valor',escenario:'A',margenObjetivo:35,mixApplied:true,mixRecommendations:[]};}
else if(type==='no-comprar'){APP.wizardData={tipoImportacion:'regular',tipoAnalisis:'Producto nuevo',motivo:'',area:'Proyectos',responsable:'Roberto Fallas',fechaRequerida:'2026-10-01',observaciones:'Proveedor nuevo. Evaluación inicial.',proveedorId:5,incoterm:'CIF',tipoCarga:'20 pies',
productos:(SUPPLIER_CATALOGS[5]||[]).map(p=>({...p,selected:true,cantidad:5,costoCotizado:p.costoActual*1.6,accionRecomendada:'Revisar',stockActual:200,cobertura:12,concentracion:72,ventas3m:3,ordenesTransito:0})),selectedProducts:[],
flete:0,seguro:0,operador:1400,agencia:1100,aranceles:4500,impuestos:3800,tratado:false,descuentoTratado:0,transporteLocal:1200,otrosCostos:800,tiempoTransito:12,metodoDistribucion:'valor',escenario:'A',margenObjetivo:35,mixApplied:false,mixRecommendations:[]};}
else{APP.wizardData={tipoImportacion:'regular',tipoAnalisis:'Reposición de productos',motivo:'',area:'Comercial',responsable:'Ana Solano',fechaRequerida:'2026-09-20',observaciones:'Costos subieron moderadamente. Evaluar ajustes de precio.',proveedorId:1,incoterm:'CIF',tipoCarga:'40 pies',
productos:cat1.map(p=>({...p,selected:true,cantidad:Math.round(p.cantidadPromedio*0.8),costoCotizado:p.costoActual*1.10,accionRecomendada:p.cobertura<3?'Aumentar':'Mantener',stockActual:Math.min(p.stockActual,12),cobertura:2.5})),selectedProducts:[],
flete:0,seguro:0,operador:900,agencia:680,aranceles:2200,impuestos:1700,tratado:true,descuentoTratado:350,transporteLocal:650,otrosCostos:180,tiempoTransito:35,metodoDistribucion:'valor',escenario:'A',margenObjetivo:35,mixApplied:true,mixRecommendations:[]};}
APP.wizardStep=5;renderView('nueva-simulacion');showToast(`Ejemplo "${type}" cargado`,'info');}

// ===== VISTA 4: PLANIFICACIÓN DE COMPRA =====
function renderPlanificacion(){
if(!APP.planProvId)APP.planProvId=1;
if(!APP.planProdIdx)APP.planProdIdx=0;
return `<h1 class="section-title"><i class="fas fa-clipboard-list"></i> Planificación de Compra</h1>
<div class="tabs" id="plan-tabs"><div class="tab active" onclick="showPlanTab('prov-tab')">Por proveedor</div><div class="tab" onclick="showPlanTab('prod-tab')">Por producto (Forecast)</div><div class="tab" onclick="showPlanTab('consol-tab')">Consolidada</div></div>
<div id="prov-tab" class="tab-content">${renderPlanProveedor()}</div>
<div id="prod-tab" class="tab-content hidden">${renderForecast()}</div>
<div id="consol-tab" class="tab-content hidden">${renderPlanConsolidada()}</div>`;}
function showPlanTab(id){const tabs=['prov-tab','prod-tab','consol-tab'];document.querySelectorAll('#plan-tabs .tab').forEach((t,i)=>t.classList.toggle('active',tabs[i]===id));tabs.forEach(t=>{const el=document.getElementById(t);if(el)el.classList.toggle('hidden',t!==id);});}

function renderPlanConsolidada(){
const consolidables=PROVEEDORES.filter(p=>p.allowsConsolidation&&p.recurrente);
const puntos=[...new Set(consolidables.map(p=>p.consolidationPoint).filter(Boolean))];
return `<div class="card"><div class="card-header"><h2><i class="fas fa-boxes"></i> Planificación Consolidada</h2></div><div class="card-body">
<div class="alert-item info" style="margin-bottom:14px;"><i class="fas fa-info-circle"></i><span>Seleccione proveedores que converjan en el mismo punto de consolidación para crear una simulación conjunta.</span></div>
<div class="form-group"><label>Punto de consolidación</label><div style="display:flex;gap:8px;">${puntos.map(pt=>`<span style="padding:6px 14px;background:rgba(230,126,34,.1);border:1px solid var(--accent);border-radius:12px;font-size:.82rem;font-weight:600;color:var(--accent);"><i class="fas fa-map-marker-alt"></i> ${pt}</span>`).join('')}</div></div>
<h3 style="font-size:.88rem;color:var(--primary);margin:16px 0 10px;">Proveedores consolidables (${consolidables.length})</h3>
<div class="table-container"><table><thead><tr><th>Proveedor</th><th>País</th><th>Punto</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Monto mín.</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Monto obj.</th><th>Productos</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Nec. reposición</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cotización</th></tr></thead><tbody>
${consolidables.map(p=>{const cat=SUPPLIER_CATALOGS[p.id]||[];const necesarios=cat.filter(pr=>{const n=calculatePurchaseNeed(pr,APP.rules);return n.needsPurchase;}).length;
const cot=APP.cotizaciones.find(c=>c.proveedorId===p.id);const cotStatus=cot?calculateQuoteStatus(cot,APP.rules):null;
return `<tr><td><strong>${p.nombre}</strong></td><td>${p.pais}</td><td><span style="padding:2px 8px;background:rgba(230,126,34,.1);border-radius:8px;font-size:.76rem;">${p.consolidationPoint}</span></td><td>$${fmt(p.minimumOrderValue||0)}</td><td>$${fmt(p.targetOrderValue||0)}</td><td>${cat.length}</td><td>${necesarios>0?`<span class="badge-status badge-ajustes">${necesarios}</span>`:'<span class="badge-status badge-aprobado">0</span>'}</td><td>${cotStatus?`<span class="semaphore ${cotStatus.semaforo==='verde'?'green':cotStatus.semaforo==='amarillo'?'yellow':'red'}">${cotStatus.diasRestantes}d</span>`:'—'}</td></tr>`;}).join('')}
</tbody></table></div>
<div style="margin-top:16px;"><button class="btn btn-primary" onclick="startConsolidatedSim()"><i class="fas fa-plus-circle"></i> Crear simulación consolidada</button></div>
</div></div>`;}

function startConsolidatedSim(){
APP.wizardData={};initWizard();APP.wizardData.tipoImportacion='consolidada';APP.wizardData.tipoCarga='Consolidado';
const consolidables=PROVEEDORES.filter(p=>p.allowsConsolidation&&p.recurrente);
APP.wizardData.suppliers=consolidables.slice(0,3).map(p=>({supplierId:p.id,supplierName:p.nombre,country:p.pais,consolidationPoint:p.consolidationPoint,incoterm:p.usualIncoterm||p.incoterm,products:[],subtotal:0,weight:0,volume:0}));
APP.wizardStep=2;navigateTo('nueva-simulacion');showToast('Simulación consolidada iniciada con proveedores de Miami','success');}

function changePlanProv(val){APP.planProvId=parseInt(val);renderView('planificacion');}

function renderPlanProveedor(){const provId=APP.planProvId||1;const prov=PROVEEDORES.find(p=>p.id===provId);if(!prov)return '';
const catalog=SUPPLIER_CATALOGS[provId]||[];const combos=HISTORICAL_COMBOS[provId]||[];
// Calcular necesidad y optimización
const needs=catalog.map(p=>({...p,need:calculatePurchaseNeed(p,APP.rules)}));
const necesarios=needs.filter(p=>p.need.needsPurchase);
const pedidoBase=necesarios.reduce((sum,p)=>sum+p.need.finalSuggestedQty*p.costoActual,0);
return `<div class="card"><div class="card-header"><h2>Planificación por proveedor</h2><select onchange="changePlanProv(this.value)">${PROVEEDORES.filter(p=>p.recurrente).map(p=>`<option value="${p.id}" ${p.id===provId?'selected':''}>${p.nombre}</option>`).join('')}</select></div>
<div class="card-body">
<div class="kpi-grid">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-boxes"></i></div><div class="kpi-info"><h3>${catalog.length}</h3><p>Productos catálogo</p></div></div>
<div class="kpi-card"><div class="kpi-icon red"><i class="fas fa-exclamation-triangle"></i></div><div class="kpi-info"><h3>${necesarios.length}</h3><p>Necesitan reposición</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>$${fmt(Math.round(pedidoBase))}</h3><p>Pedido base est.</p></div></div>
<div class="kpi-card"><div class="kpi-icon ${pedidoBase>=(prov.targetOrderValue||0)?'green':'orange'}"><i class="fas fa-bullseye"></i></div><div class="kpi-info"><h3>$${fmt(prov.targetOrderValue||0)}</h3><p>Monto objetivo</p></div></div>
<div class="kpi-card"><div class="kpi-icon teal"><i class="fas fa-calendar"></i></div><div class="kpi-info"><h3>${prov.averageTransitDays||prov.tiempoEntrega}d</h3><p>Tiempo tránsito</p></div></div>
</div>
<p style="font-size:.82rem;color:var(--gray-400);margin-bottom:12px;"><strong>Modo:</strong> ${prov.defaultImportMode==='contenedor_completo'?'Contenedor completo':'Consolidado'} · <strong>Contenedor:</strong> ${prov.usualContainer} · <strong>Monto mín:</strong> $${fmt(prov.minimumOrderValue||0)} · <strong>Última compra:</strong> ${prov.ultimaCompra||'N/A'} · <strong>Marcas:</strong> ${(prov.brands||[]).join(', ')}</p>

${pedidoBase<(prov.targetOrderValue||0)?`<div class="alert-item warning" style="margin-bottom:12px;"><i class="fas fa-info-circle"></i><span><strong>Faltante para objetivo:</strong> $${fmt(Math.round((prov.targetOrderValue||0)-pedidoBase))}. Considere agregar productos de buena rotación.</span></div>`:''}

${catalog.length?`<h3 style="font-size:.88rem;color:var(--primary);margin:14px 0 10px;"><i class="fas fa-th-list"></i> Necesidad de compra (${catalog.length} productos)</h3>
<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap;">
<button class="btn btn-sm btn-accent" onclick="selectLowStockPlan(${provId})"><i class="fas fa-magic"></i> Seleccionar por necesidad</button>
<button class="btn btn-sm btn-outline" onclick="clearPlanSelection()"><i class="fas fa-eraser"></i> Limpiar</button>
</div>
<div class="alert-item info" style="margin-bottom:10px;font-size:.75rem;padding:8px 12px;"><i class="fas fa-database" style="color:var(--primary)"></i> SAP &nbsp;&nbsp; <i class="fas fa-calculator" style="color:var(--accent)"></i> Cálculo &nbsp;&nbsp; <i class="fas fa-robot" style="color:var(--success)"></i> IA</div>
<div class="table-container" style="max-height:300px;overflow-y:auto;margin-bottom:16px;"><table><thead><tr><th><input type="checkbox" onchange="toggleAllPlan(this.checked,${provId})"></th><th>SKU</th><th>Producto</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Stock</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Reserv.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Disp.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cons.mes</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cobert.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> P.Reorden</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Cant.sug.</th><th>Proy.com.</th><th>Vencimiento</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Necesidad</th></tr></thead><tbody>
${needs.map((p,i)=>{const n=p.need;const checked=(APP.planSelectedProducts||[]).includes(p.sku);const critico=n.urgency==='critica';const necesario=n.urgency==='necesaria';const tieneVenc=p.fechaVencimiento&&p.stockPorVencer>0;const diasVenc=tieneVenc?Math.ceil((new Date(p.fechaVencimiento)-new Date())/(1000*60*60*24)):null;
return `<tr style="${critico?'background:rgba(231,76,60,.06);border-left:3px solid var(--danger)':necesario?'background:rgba(243,156,18,.06);border-left:3px solid var(--warning)':tieneVenc&&diasVenc<60?'background:rgba(142,68,173,.05);border-left:3px solid #8e44ad':''}"><td><input type="checkbox" ${checked?'checked':''} onchange="togglePlanProduct('${p.sku}')"></td><td>${p.sku}</td><td style="font-size:.74rem;">${p.descripcion}</td><td>${n.stockTotal}</td><td>${n.stockReservado}</td><td style="font-weight:600;${n.availableStock<n.reorderPoint?'color:var(--danger)':''}">${n.availableStock}</td><td>${n.averageMonthlyConsumption.toFixed(1)}</td><td><span class="semaphore ${n.currentCoverageMonths<2?'red':n.currentCoverageMonths<4?'yellow':'green'}">${n.currentCoverageMonths.toFixed(1)}m</span></td><td>${n.reorderPoint}</td><td style="font-weight:600;">${(APP.planOptimizedQtys&&APP.planOptimizedQtys[p.sku])?'<span style="color:var(--primary)">'+APP.planOptimizedQtys[p.sku]+'</span>':n.finalSuggestedQty}</td><td style="font-size:.72rem;">${p.proyeccionComercial?'+'+p.proyeccionComercial.qty:'—'}</td><td style="font-size:.72rem;">${tieneVenc?`<span style="${diasVenc<30?'color:var(--danger);font-weight:600':diasVenc<90?'color:var(--warning)':'color:var(--gray-500)'}">${p.fechaVencimiento} (${p.stockPorVencer}u)</span>`:'—'}</td><td><span class="badge-status ${critico?'badge-rechazado':necesario?'badge-ajustes':'badge-aprobado'}">${critico?'Crítico':necesario?'Necesario':'OK'}</span></td></tr>`;}).join('')}
</tbody></table></div>
${(APP.planSelectedProducts||[]).length?`<div class="alert-item success" style="margin-bottom:12px;"><i class="fas fa-check-circle"></i><span><strong>${(APP.planSelectedProducts||[]).length} producto(s) seleccionado(s).</strong></span></div>`:''}
`:''}

${combos.length?`<h3 style="font-size:.88rem;color:var(--primary);margin:14px 0 10px;"><i class="fas fa-layer-group"></i> Combinaciones históricas (referencia)</h3>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">${combos.map(c=>`<button class="btn btn-sm btn-outline" onclick="startSimFromCombo(${provId},'${c.id}')">${c.nombre.substring(0,25)} (${c.utilizacion}%)</button>`).join('')}</div>`:''}

<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
<button class="btn btn-primary" onclick="startSimFromProv(${provId})"><i class="fas fa-plus-circle"></i> Crear simulación</button>
${(APP.planSelectedProducts||[]).length?`<button class="btn btn-accent" onclick="startSimFromSelection(${provId})"><i class="fas fa-check-circle"></i> Simulación con selección (${(APP.planSelectedProducts||[]).length})</button>`:''}
<button class="btn btn-success" onclick="optimizePlanOrder(${provId})"><i class="fas fa-brain"></i> Optimizar pedido</button>
${(APP.planSelectedProducts||[]).length?`<button class="btn btn-warning" onclick="createPOFromPlan(${provId})"><i class="fas fa-file-invoice"></i> Crear orden de compra (${(APP.planSelectedProducts||[]).length})</button>`:''}
</div>
</div></div>`;}

function optimizePlanOrder(provId){
const prov=PROVEEDORES.find(p=>p.id===provId);const catalog=SUPPLIER_CATALOGS[provId]||[];
// Seleccionar productos que necesitan reposición + los de buena rotación para llenar
const caps=getCaps(prov.usualContainer||'40 pies');
let pesoAcum=0,volAcum=0;
const optimized=catalog.map(p=>{
const need=calculatePurchaseNeed(p,APP.rules);
const qty=need.finalSuggestedQty||0;
return {...p,needData:need,cantidadOptimizada:qty,seleccionado:need.needsPurchase};
});
// Agregar productos de buena rotación para llenar contenedor
let utilActual=Math.max(optimized.filter(p=>p.seleccionado).reduce((a,p)=>a+p.cantidadOptimizada*p.pesoUnitario,0)/caps.peso*100,
optimized.filter(p=>p.seleccionado).reduce((a,p)=>a+p.cantidadOptimizada*p.volumenUnitario,0)/caps.vol*100);
if(utilActual<100){
const noSel=optimized.filter(p=>!p.seleccionado&&(p.ventas3m||0)>0).sort((a,b)=>(b.ventas3m||0)-(a.ventas3m||0));
for(const p of noSel){if(utilActual>=100)break;
const consumo=p.consumoMensual||(p.ventas3m/3)||1;
p.cantidadOptimizada=Math.max(p.cantidadPromedio||Math.ceil(consumo*4),Math.ceil(consumo*6));
p.seleccionado=true;
pesoAcum=optimized.filter(x=>x.seleccionado).reduce((a,x)=>a+x.cantidadOptimizada*x.pesoUnitario,0);
volAcum=optimized.filter(x=>x.seleccionado).reduce((a,x)=>a+x.cantidadOptimizada*x.volumenUnitario,0);
utilActual=Math.max(pesoAcum/caps.peso*100,volAcum/caps.vol*100);
}
// Aumentar cantidades si aún no llega a 100%
if(utilActual<100){
const selFill=optimized.filter(p=>p.seleccionado).sort((a,b)=>(b.ventas3m||0)-(a.ventas3m||0));
let iter=0;while(utilActual<100&&iter<20){iter++;let avance=false;
for(const p of selFill){if(utilActual>=100)break;
const addMore=Math.max(Math.ceil((p.consumoMensual||10)*2),20);
const newPeso=pesoAcum+addMore*p.pesoUnitario;const newVol=volAcum+addMore*p.volumenUnitario;
if(newPeso>caps.peso||newVol>caps.vol)continue;
p.cantidadOptimizada+=addMore;pesoAcum=newPeso;volAcum=newVol;
utilActual=Math.max(pesoAcum/caps.peso*100,volAcum/caps.vol*100);avance=true;}
if(!avance)break;}}
}
// Guardar resultado y seleccionar en la UI
APP.planSelectedProducts=optimized.filter(p=>p.seleccionado).map(p=>p.sku);
APP.planOptimizedQtys={};optimized.filter(p=>p.seleccionado).forEach(p=>{APP.planOptimizedQtys[p.sku]=p.cantidadOptimizada;});
renderView('planificacion');
const totalSel=optimized.filter(p=>p.seleccionado).length;
const montoEst=optimized.filter(p=>p.seleccionado).reduce((a,p)=>a+p.cantidadOptimizada*p.costoActual,0);
showToast(`Pedido optimizado: ${totalSel} productos, $${fmt(Math.round(montoEst))}, utilización ${utilActual.toFixed(0)}%`,'success');}

function createPOFromPlan(provId){
const prov=PROVEEDORES.find(p=>p.id===provId);const catalog=SUPPLIER_CATALOGS[provId]||[];
const selectedSkus=APP.planSelectedProducts||[];if(selectedSkus.length===0){showToast('Seleccione productos primero','warning');return;}
const productos=catalog.filter(p=>selectedSkus.includes(p.sku));
const qtys=APP.planOptimizedQtys||{};
const totalQty=productos.reduce((a,p)=>a+(qtys[p.sku]||p.cantidadPromedio||50),0);
const ocNum='OC-2026-'+String(APP.purchaseOrders.length+60).padStart(3,'0');
const fecha=new Date().toISOString().split('T')[0];
const el=document.getElementById('print-overlay');el.classList.remove('hidden');
el.innerHTML=`<div class="po-document"><div style="margin-bottom:20px;">
<button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Exportar PDF</button>
<button class="btn btn-outline" style="margin-left:8px;" onclick="document.getElementById('print-overlay').classList.add('hidden')"><i class="fas fa-times"></i> Cerrar</button>
<button class="btn btn-success" style="margin-left:8px;" onclick="confirmPOFromPlan(${provId})"><i class="fas fa-check"></i> Confirmar y guardar OC</button>
</div>
<div class="po-header"><div class="po-logo"><i class="fas fa-building"></i> RENTECO</div><div class="po-info"><h2>ORDEN DE COMPRA</h2><p><strong>${ocNum}</strong></p><p>Fecha: ${fecha}</p></div></div>
<div class="grid-2" style="margin-bottom:20px;"><div><p><strong>Proveedor:</strong> ${prov.nombre}</p><p>${prov.direccion||''}</p><p>${prov.pais}</p><p><strong>Email:</strong> ${prov.email}</p></div><div><p><strong>Moneda:</strong> ${prov.moneda}</p><p><strong>Incoterm:</strong> ${prov.usualIncoterm||prov.incoterm}</p></div></div>
<table><thead><tr><th>#</th><th>SKU</th><th>Producto</th><th>Categoría</th><th>Cantidad</th></tr></thead><tbody>
${productos.map((p,i)=>{const qty=qtys[p.sku]||p.cantidadPromedio||50;return `<tr><td>${i+1}</td><td>${p.sku}</td><td>${p.descripcion}</td><td>${p.categoria}</td><td style="font-weight:600;text-align:center;">${qty}</td></tr>`;}).join('')}
</tbody></table>
<div class="po-total">TOTAL UNIDADES: ${fmt(totalQty)}</div>
<div style="margin-top:30px;display:flex;justify-content:space-between;">
<div><p><strong>Elaborado por:</strong> ${document.getElementById('user-name')?.textContent||'Usuario'}</p><p style="margin-top:30px;border-top:1px solid var(--gray-300);padding-top:4px;width:200px;">Firma</p></div>
<div><p><strong>Aprobado por:</strong></p><p style="margin-top:30px;border-top:1px solid var(--gray-300);padding-top:4px;width:200px;">Firma</p></div>
</div>
<div class="po-footer">RENTECO © 2026 · Torre Inteligente de Importaciones y Rentabilidad<br>Documento generado el ${fecha}</div>
</div>`;}

function confirmPOFromPlan(provId){
const prov=PROVEEDORES.find(p=>p.id===provId);
const ocNum='OC-2026-'+String(APP.purchaseOrders.length+60).padStart(3,'0');
const selectedSkus=APP.planSelectedProducts||[];
const catalog=SUPPLIER_CATALOGS[provId]||[];
const productos=catalog.filter(p=>selectedSkus.includes(p.sku));
const qtys=APP.planOptimizedQtys||{};
const total=productos.reduce((a,p)=>a+(qtys[p.sku]||p.cantidadPromedio||50)*p.costoActual,0);
APP.purchaseOrders.push({id:ocNum,simId:null,proveedor:prov.nombre,fecha:new Date().toISOString().split('T')[0],estado:'generada',sapOrder:null,total:Math.round(total),productos:productos.length});
saveData();document.getElementById('print-overlay').classList.add('hidden');
APP.planSelectedProducts=[];APP.planOptimizedQtys={};
renderView('planificacion');showToast(`Orden ${ocNum} creada exitosamente`,'success');}

function togglePlanProduct(sku){if(!APP.planSelectedProducts)APP.planSelectedProducts=[];const idx=APP.planSelectedProducts.indexOf(sku);if(idx>=0)APP.planSelectedProducts.splice(idx,1);else APP.planSelectedProducts.push(sku);renderView('planificacion');}
function toggleAllPlan(checked,provId){const catalog=SUPPLIER_CATALOGS[provId]||[];APP.planSelectedProducts=checked?catalog.map(p=>p.sku):[];renderView('planificacion');}
function selectLowStockPlan(provId){const catalog=SUPPLIER_CATALOGS[provId]||[];APP.planSelectedProducts=catalog.filter(p=>{const n=calculatePurchaseNeed(p,APP.rules);return n.needsPurchase;}).map(p=>p.sku);renderView('planificacion');showToast('Productos con necesidad de compra seleccionados','info');}
function clearPlanSelection(){APP.planSelectedProducts=[];renderView('planificacion');}
function startSimFromSelection(provId){APP.wizardData={};initWizard();APP.wizardData.proveedorId=provId;const catalog=SUPPLIER_CATALOGS[provId]||[];const prov=PROVEEDORES.find(p=>p.id===provId);
APP.wizardData.productos=catalog.map(p=>({...p,selected:(APP.planSelectedProducts||[]).includes(p.sku),cantidad:p.cantidadPromedio||50,costoCotizado:p.costoActual*(1+(prov.variacionReciente||0)/100),accionRecomendada:p.cobertura<3?'Aumentar':'Mantener'}));
APP.wizardStep=3;APP.planSelectedProducts=[];navigateTo('nueva-simulacion');showToast('Simulación creada con productos seleccionados','success');}

function startSimFromProv(provId){APP.wizardData={};APP.wizardStep=1;initWizard();APP.wizardData.proveedorId=provId;navigateTo('nueva-simulacion');showToast('Simulación iniciada desde planificación','info');}
function startSimFromCombo(provId,comboId){APP.wizardData={};initWizard();APP.wizardData.proveedorId=provId;APP.wizardStep=3;navigateTo('nueva-simulacion');setTimeout(()=>applyCombo(comboId),100);}

function changePlanProd(val){APP.planProdIdx=parseInt(val);document.getElementById('prod-tab').innerHTML=renderForecast();}
function toggleForecastProduct(sku){if(!APP.forecastSelectedProducts)APP.forecastSelectedProducts=[];const idx=APP.forecastSelectedProducts.indexOf(sku);if(idx>=0)APP.forecastSelectedProducts.splice(idx,1);else APP.forecastSelectedProducts.push(sku);document.getElementById('prod-tab').innerHTML=renderForecast();}

function renderForecast(){
const provId=APP.planProvId||1;
const allProducts=SUPPLIER_CATALOGS[provId]||SUPPLIER_CATALOGS[1]||[];
const idx=APP.planProdIdx||0;
const p=allProducts[idx]||allProducts[0];if(!p)return '<p>Sin productos</p>';
const ventas=VENTAS_MENSUALES[p.sku]||seeds.map(s=>Math.round((p.ventas3m/3)*(s/12)));
const last12=ventas.slice(12);const max=Math.max(...last12,1);
const pesos=[1,1,2,2,3,3];const ult6=ventas.slice(-6);const forecast=Math.round(ult6.reduce((a,v,i)=>a+v*pesos[i],0)/pesos.reduce((a,b)=>a+b));
const cobertura=(p.stockActual/(forecast||1)).toFixed(1);const compraSugerida=Math.max(0,Math.round(forecast*4-p.stockActual));
const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
if(!APP.forecastSelectedProducts)APP.forecastSelectedProducts=[];
const selCount=APP.forecastSelectedProducts.length;
return `<div class="card"><div class="card-header"><h2>Forecast individual</h2>
<select onchange="changePlanProd(this.value)">${allProducts.map((x,i)=>`<option value="${i}" ${i===idx?'selected':''}>${x.sku} — ${x.descripcion}</option>`).join('')}</select></div>
<div class="card-body">
<div class="alert-item info"><i class="fas fa-flask"></i><span>Módulo de apoyo. Seleccione varios productos para crear una simulación conjunta.</span></div>
<div class="kpi-grid">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-boxes"></i></div><div class="kpi-info"><h3>${p.stockActual}</h3><p>Stock actual</p></div></div>
<div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-chart-line"></i></div><div class="kpi-info"><h3>${forecast}</h3><p>Pronóstico mensual</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-calendar-alt"></i></div><div class="kpi-info"><h3>${cobertura}m</h3><p>Cobertura</p></div></div>
<div class="kpi-card"><div class="kpi-icon purple"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>${compraSugerida}</h3><p>Compra sugerida</p></div></div>
</div>
<div class="grid-2" style="margin-top:16px;">
<div>
<h3 style="font-size:.86rem;color:var(--gray-500);margin-bottom:8px;">Ventas últimos 12 meses</h3>
<div class="chart-bar-container" style="height:110px;">${last12.map((v,i)=>`<div class="chart-bar"><span class="bar-value">${v}</span><div class="bar" style="height:${(v/max)*100}%;background:${v>forecast*1.8?'var(--danger)':'var(--primary-light)'};"></div><span class="bar-label">${meses[i]||''}</span></div>`).join('')}</div>
</div>
<div>
<h3 style="font-size:.86rem;color:var(--gray-500);margin-bottom:8px;">Información del producto</h3>
<div style="font-size:.83rem;display:flex;flex-direction:column;gap:6px;">
<div style="display:flex;justify-content:space-between;"><span>Costo actual:</span><strong>$${p.costoActual.toFixed(2)}</strong></div>
<div style="display:flex;justify-content:space-between;"><span>Precio venta:</span><strong>$${p.precioVenta.toFixed(2)}</strong></div>
<div style="display:flex;justify-content:space-between;"><span>Margen actual:</span><strong>${(((p.precioVenta-p.costoActual)/p.precioVenta)*100).toFixed(1)}%</strong></div>
<div style="display:flex;justify-content:space-between;"><span>Ventas 3m / 6m / 12m:</span><strong>${p.ventas3m} / ${p.ventas6m} / ${p.ventas12m||'—'}</strong></div>
<div style="display:flex;justify-content:space-between;"><span>Cliente principal:</span><strong>${p.clientePrincipal||'Varios'} (${p.concentracion}%)</strong></div>
</div>
${parseFloat(cobertura)<2?'<div class="alert-item danger" style="margin-top:10px;"><i class="fas fa-exclamation-circle"></i><span>Cobertura crítica (< 2 meses). Se recomienda incluir en próxima importación.</span></div>':''}
${p.concentracion>60?`<div class="alert-item warning" style="margin-top:8px;"><i class="fas fa-user"></i><span>Concentración alta: ${p.concentracion}% en ${p.clientePrincipal}.</span></div>`:''}
</div>
</div>

<h3 style="font-size:.88rem;color:var(--primary);margin:20px 0 10px;"><i class="fas fa-check-square"></i> Selección de productos para simulación</h3>
<div class="table-container" style="max-height:200px;overflow-y:auto;"><table><thead><tr><th></th><th>SKU</th><th>Producto</th><th>Stock</th><th>Cobertura</th><th>Compra sug.</th><th>Estado</th></tr></thead><tbody>
${allProducts.map(pr=>{const fc=Math.round((pr.ventas3m/3)||10);const cob=(pr.stockActual/(fc||1)).toFixed(1);const sug=Math.max(0,Math.round(fc*4-pr.stockActual));const checked=APP.forecastSelectedProducts.includes(pr.sku);const lowStock=parseFloat(cob)<3;
return `<tr style="${lowStock?'background:rgba(230,126,34,0.08);':''}"><td><input type="checkbox" ${checked?'checked':''} onchange="toggleForecastProduct('${pr.sku}')"></td><td>${pr.sku}</td><td style="font-size:.76rem;">${pr.descripcion}</td><td style="${lowStock?'color:var(--danger);font-weight:600':''}">${pr.stockActual}</td><td style="${lowStock?'color:var(--accent);font-weight:600':''}">${cob}m</td><td>${sug}</td><td>${lowStock?'<span class="badge-status badge-ajustes">Comprar</span>':'<span class="badge-status badge-aprobado">OK</span>'}</td></tr>`;}).join('')}
</tbody></table></div>

<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
${selCount?`<button class="btn btn-accent" onclick="startSimFromForecastSelection(${provId})"><i class="fas fa-plus-circle"></i> Crear simulación con ${selCount} producto(s)</button>`:''}
<button class="btn btn-primary btn-sm" onclick="startSimFromProv(${provId})"><i class="fas fa-plus"></i> Crear simulación completa</button>
${selCount?`<span style="font-size:.8rem;color:var(--gray-400);">${selCount} seleccionado(s)</span>`:'<span style="font-size:.8rem;color:var(--gray-400);">Seleccione productos de la tabla</span>'}
</div>
</div></div>`;}

function startSimFromForecastSelection(provId){APP.wizardData={};initWizard();APP.wizardData.proveedorId=provId;const catalog=SUPPLIER_CATALOGS[provId]||[];const prov=PROVEEDORES.find(p=>p.id===provId);
APP.wizardData.productos=catalog.map(p=>({...p,selected:(APP.forecastSelectedProducts||[]).includes(p.sku),cantidad:p.cantidadPromedio||50,costoCotizado:p.costoActual*(1+(prov.variacionReciente||0)/100),accionRecomendada:p.cobertura<3?'Aumentar':'Mantener'}));
APP.wizardStep=3;APP.forecastSelectedProducts=[];navigateTo('nueva-simulacion');showToast('Simulación creada con productos seleccionados desde forecast','success');}
// ===== VISTA 5: PROVEEDORES =====
function renderProveedores(){return `<h1 class="section-title"><i class="fas fa-truck"></i> Proveedores e Historial</h1>
<div class="card"><div class="card-header"><h2>Directorio</h2></div><div class="card-body"><div class="table-container"><table><thead><tr><th>Proveedor</th><th>Región</th><th>País</th><th>Tipo</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Moneda</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Incoterm</th><th>Contenedor</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Tiempo prom.</th><th>Tratado</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Var.%</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Import.</th><th>Última</th><th></th></tr></thead><tbody>
${PROVEEDORES.map(p=>`<tr><td><strong>${p.nombre}</strong></td><td>${p.region}</td><td>${p.pais}</td><td><span class="badge-status ${p.recurrente?'badge-aprobado':'badge-ajustes'}">${p.recurrente?'Recurrente':'Nuevo'}</span></td><td>${p.moneda}</td><td>${p.incoterm}</td><td>${p.tipoContenedor}</td><td>${p.tiempoEntrega}d</td><td>${p.tratado?'<i class="fas fa-check" style="color:var(--success)"></i>':'<i class="fas fa-times" style="color:var(--danger)"></i>'}</td><td style="color:${p.variacionReciente>15?'var(--danger)':'inherit'}">${p.variacionReciente}%</td><td>${p.importaciones}</td><td>${p.ultimaCompra||'N/A'}</td><td class="action-btns"><button onclick="verFichaProveedor(${p.id})" title="Ver ficha"><i class="fas fa-eye"></i></button><button onclick="startSimFromProv(${p.id})" title="Crear simulación"><i class="fas fa-plus"></i></button></td></tr>`).join('')}
</tbody></table></div></div></div>`;}
function verFichaProveedor(id){const p=PROVEEDORES.find(x=>x.id===id);const cat=SUPPLIER_CATALOGS[id]||[];const combos=HISTORICAL_COMBOS[id]||[];
showModal(`${p.nombre}`,`<div style="text-align:left;"><p><strong>País:</strong> ${p.pais} · <strong>Región:</strong> ${p.region}</p><p><strong>Moneda:</strong> ${p.moneda} · <strong>Incoterm:</strong> ${p.incoterm}</p><p><strong>Tiempo entrega:</strong> ${p.tiempoEntrega} días · <strong>Tratado:</strong> ${p.tratado?'Sí':'No'}</p><p><strong>Importaciones:</strong> ${p.importaciones} · <strong>Frecuencia:</strong> ${p.frecuenciaCompra}</p><p><strong>Utilización prom.:</strong> ${p.utilizacionProm}% · <strong>Variación:</strong> ${p.variacionReciente}%</p><p><strong>Catálogo:</strong> ${cat.length} productos · <strong>Combos:</strong> ${combos.length} combinaciones</p><hr style="margin:10px 0;"><p style="font-size:.8rem;color:var(--gray-400);">${p.recurrente?'Proveedor confiable con historial positivo.':'Proveedor nuevo, requiere validación.'}</p></div>`,[{text:'Planificar compra',cls:'btn-primary',action:`closeModal();startSimFromProv(${id})`},{text:'Cerrar',cls:'btn-outline',action:'closeModal()'}]);}

// ===== VISTA: MAESTRO DE PRODUCTOS =====
function renderMaestroProductos(){
const filtroProvId=APP.productosFiltroProvId||0;
const filtroBusqueda=(APP.productosBusqueda||'').toLowerCase();
let allProducts=[];
Object.keys(SUPPLIER_CATALOGS).forEach(provId=>{
const prov=PROVEEDORES.find(p=>p.id===parseInt(provId));
const cat=SUPPLIER_CATALOGS[provId]||[];
cat.forEach(p=>allProducts.push({...p,proveedorId:parseInt(provId),proveedorNombre:prov?prov.nombre:'Desconocido'}));
});
if(filtroProvId>0)allProducts=allProducts.filter(p=>p.proveedorId===filtroProvId);
if(filtroBusqueda)allProducts=allProducts.filter(p=>p.sku.toLowerCase().includes(filtroBusqueda)||p.descripcion.toLowerCase().includes(filtroBusqueda)||p.categoria.toLowerCase().includes(filtroBusqueda)||p.proveedorNombre.toLowerCase().includes(filtroBusqueda));
return `<h1 class="section-title"><i class="fas fa-cubes"></i> Maestro de Productos</h1>
<div class="card"><div class="card-header"><h2>Catálogo general (${allProducts.length} productos)</h2></div>
<div class="card-body">
<div class="filter-bar">
<input type="text" placeholder="Buscar por SKU, nombre, categoría..." value="${APP.productosBusqueda||''}" oninput="APP.productosBusqueda=this.value;renderView('productos')">
<select onchange="APP.productosFiltroProvId=parseInt(this.value);renderView('productos')">
<option value="0" ${filtroProvId===0?'selected':''}>Todos los proveedores</option>
${PROVEEDORES.map(p=>`<option value="${p.id}" ${filtroProvId===p.id?'selected':''}>${p.nombre}</option>`).join('')}
</select>
</div>
<div class="alert-item info" style="margin-bottom:12px;"><i class="fas fa-info-circle"></i><span>Origen de datos: <i class="fas fa-database" style="color:var(--primary)"></i> SAP &nbsp; <i class="fas fa-calculator" style="color:var(--accent)"></i> Cálculo sistema &nbsp; <i class="fas fa-robot" style="color:var(--success)"></i> IA</span></div>
<div class="table-container" style="max-height:500px;overflow-y:auto;"><table><thead><tr><th>SKU</th><th>Producto</th><th>Categoría</th><th>Proveedor</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Stock</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Reserv.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Disp.</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cons.mes</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Cobert.</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> P.Reorden</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Precio</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Margen</th><th>Vencimiento</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Estado</th></tr></thead><tbody>
${allProducts.map(p=>{
const need=calculatePurchaseNeed(p,APP.rules);
const margen=((p.precioVenta-p.costoActual)/p.precioVenta*100).toFixed(1);
const tieneVenc=p.fechaVencimiento&&p.stockPorVencer>0;
const diasVenc=tieneVenc?Math.ceil((new Date(p.fechaVencimiento)-new Date())/(1000*60*60*24)):null;
return `<tr style="${need.urgency==='critica'?'background:rgba(231,76,60,.05);border-left:3px solid var(--danger)':need.urgency==='necesaria'?'background:rgba(243,156,18,.05);border-left:3px solid var(--warning)':tieneVenc&&diasVenc<60?'background:rgba(142,68,173,.05);border-left:3px solid #8e44ad':''}">
<td><strong>${p.sku}</strong></td><td style="font-size:.78rem;">${p.descripcion}</td><td style="font-size:.74rem;">${p.categoria}</td><td style="font-size:.78rem;">${p.proveedorNombre}</td><td>${p.stockTotal||p.stockActual}</td><td>${p.stockReservado||0}</td><td style="font-weight:600;${need.availableStock<need.reorderPoint?'color:var(--danger)':''}">${need.availableStock}</td><td>${need.averageMonthlyConsumption.toFixed(1)}</td><td><span class="semaphore ${need.currentCoverageMonths<2?'red':need.currentCoverageMonths<4?'yellow':'green'}">${need.currentCoverageMonths.toFixed(1)}m</span></td><td>${need.reorderPoint}</td><td>$${p.costoActual.toFixed(2)}</td><td>$${p.precioVenta.toFixed(2)}</td><td>${margen}%</td><td>${tieneVenc?`<span style="font-size:.74rem;${diasVenc<30?'color:var(--danger);font-weight:600':diasVenc<90?'color:var(--warning)':'color:var(--gray-500)'}">${p.fechaVencimiento} (${p.stockPorVencer}u)</span>`:'—'}</td><td><span class="badge-status ${need.urgency==='critica'?'badge-rechazado':need.urgency==='necesaria'?'badge-ajustes':'badge-aprobado'}">${need.urgency==='critica'?'Crítico':need.urgency==='necesaria'?'Necesario':'OK'}</span></td></tr>`;}).join('')}
</tbody></table></div>
</div></div>`;}

// ===== VISTA 6: REGLAS =====
function renderReglas(){if(APP.currentRole!=='admin')return '<div class="alert-item warning"><i class="fas fa-lock"></i><span>Solo Administrador puede gestionar reglas.</span></div>';
return `<h1 class="section-title"><i class="fas fa-cogs"></i> Reglas y Parámetros</h1>
<div class="grid-2"><div class="card"><div class="card-header"><h2>Parámetros generales</h2></div><div class="card-body">
<div class="form-group"><label>Margen mínimo (%)</label><input type="number" id="r-mm" value="${APP.rules.margenMinimo}"></div>
<div class="form-group"><label>Margen objetivo (%)</label><input type="number" id="r-mo" value="${APP.rules.margenObjetivo}"></div>
<div class="form-group"><label>Variación costo alerta (%)</label><input type="number" id="r-vc" value="${APP.rules.variacionCostoAlerta}"></div>
<div class="form-group"><label>Utilización mínima (%)</label><input type="number" id="r-um" value="${APP.rules.utilizacionMinima}"></div>
<div class="form-group"><label>Máx. concentración cliente (%)</label><input type="number" id="r-mc" value="${APP.rules.maxConcentracionCliente}"></div>
<div class="form-group"><label>Tipo de cambio USD/CRC</label><input type="number" id="r-tc" value="${APP.rules.tipoCambio}"></div>
<hr style="margin:12px 0;border:none;border-top:1px solid var(--gray-200);"><h3 style="font-size:.85rem;color:var(--primary);margin-bottom:10px;">Parámetros v3.0</h3>
<div class="form-group"><label>Cobertura objetivo (meses)</label><input type="number" id="r-co" value="${APP.rules.coberturaObjetivo||4}"></div>
<div class="form-group"><label>Cobertura máxima permitida (meses)</label><input type="number" id="r-cm" value="${APP.rules.coberturaMaxima||9}"></div>
<div class="form-group"><label>Umbral sobre-stock (meses)</label><input type="number" id="r-us" value="${APP.rules.umbralSobreStock||9}"></div>
<div class="form-group"><label>Meses máx. rotación adicional</label><input type="number" id="r-mr" value="${APP.rules.mesesMaxRotacion||9}"></div>
<div class="form-group"><label>Umbral cotización por vencer (días)</label><input type="number" id="r-ucv" value="${APP.rules.umbralCotizacionVencer||15}"></div>
<button class="btn btn-primary" onclick="saveRules()"><i class="fas fa-save"></i> Guardar</button>
</div></div>
<div class="card"><div class="card-header"><h2>Reglas avanzadas (${APP.advancedRules.length})</h2><button class="btn btn-sm btn-primary" onclick="addRule()"><i class="fas fa-plus"></i></button></div><div class="card-body">
<div class="filter-bar"><select id="rf-nivel" onchange="renderView('reglas')"><option value="">Todos los niveles</option><option>General</option><option>Región</option><option>Proveedor</option><option>Producto</option><option>Incoterm</option></select></div>
<div class="table-container"><table><thead><tr><th>ID</th><th>Nombre</th><th>Nivel</th><th>Condición</th><th>Estado</th><th></th></tr></thead><tbody>
${APP.advancedRules.map(r=>`<tr><td>${r.id}</td><td>${r.nombre}</td><td><span class="badge-status badge-analisis">${r.nivel}</span></td><td style="font-size:.76rem;">${r.condicion}</td><td>${r.activa?'<i class="fas fa-toggle-on" style="color:var(--success);font-size:1.2rem;cursor:pointer" onclick="toggleRule(\'${r.id}\')"></i>':'<i class="fas fa-toggle-off" style="color:var(--gray-300);font-size:1.2rem;cursor:pointer" onclick="toggleRule(\'${r.id}\')"></i>'}</td><td class="action-btns"><button onclick="deleteRule('${r.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
</tbody></table></div></div></div></div>`;}
function saveRules(){APP.rules.margenMinimo=parseFloat(document.getElementById('r-mm').value)||25;APP.rules.margenObjetivo=parseFloat(document.getElementById('r-mo').value)||35;APP.rules.variacionCostoAlerta=parseFloat(document.getElementById('r-vc').value)||15;APP.rules.utilizacionMinima=parseFloat(document.getElementById('r-um').value)||80;APP.rules.maxConcentracionCliente=parseFloat(document.getElementById('r-mc').value)||60;APP.rules.tipoCambio=parseFloat(document.getElementById('r-tc').value)||530;
APP.rules.coberturaObjetivo=parseFloat(document.getElementById('r-co').value)||4;APP.rules.coberturaMaxima=parseFloat(document.getElementById('r-cm').value)||9;APP.rules.umbralSobreStock=parseFloat(document.getElementById('r-us').value)||9;APP.rules.mesesMaxRotacion=parseFloat(document.getElementById('r-mr').value)||9;APP.rules.umbralCotizacionVencer=parseFloat(document.getElementById('r-ucv').value)||15;
saveData();showToast('Parámetros guardados','success');}
function toggleRule(id){const r=APP.advancedRules.find(x=>x.id===id);if(r)r.activa=!r.activa;saveData();renderView('reglas');}
function deleteRule(id){APP.advancedRules=APP.advancedRules.filter(x=>x.id!==id);saveData();renderView('reglas');showToast('Regla eliminada','success');}
function addRule(){APP.advancedRules.push({id:'R'+String(APP.advancedRules.length+10).padStart(3,'0'),nombre:'Nueva regla',descripcion:'',nivel:'General',region:'',proveedor:'',producto:'',incoterm:'',condicion:'',resultado:'',prioridad:5,activa:true,vigencia:'2026-12-31'});saveData();renderView('reglas');showToast('Regla creada','success');}

// ===== VISTA 7: REPORTES =====
function renderReportes(){const s=APP.simulaciones;const apr=s.filter(x=>x.estado==='aprobado'||x.estado==='oc_generada'||x.estado==='sap'||x.estado==='enviada'||x.estado==='transito'||x.estado==='recibida');
// Estado de filtros de reportes
if(!APP.reporteProvIds)APP.reporteProvIds=[1];
if(!APP.reporteProductoSkus)APP.reporteProductoSkus=[];
if(!APP.reporteMetrica)APP.reporteMetrica='precio';
// Catálogo combinado de los proveedores seleccionados
let productosDisponibles=[];
APP.reporteProvIds.forEach(pid=>{const prov=PROVEEDORES.find(p=>p.id===pid);const cat=SUPPLIER_CATALOGS[pid]||[];cat.forEach(p=>productosDisponibles.push({...p,proveedorId:pid,proveedorNombre:prov?prov.nombre:'—'}));});
// Si no hay productos seleccionados, tomar el primero disponible
if(APP.reporteProductoSkus.length===0&&productosDisponibles.length>0){APP.reporteProductoSkus=[productosDisponibles[0].sku];}
const productosSel=productosDisponibles.filter(p=>APP.reporteProductoSkus.includes(p.sku));

return `<h1 class="section-title"><i class="fas fa-chart-line"></i> Reportes — Tendencia de Precios</h1>
<div class="card"><div class="card-header"><h2><i class="fas fa-filter"></i> Filtros</h2></div><div class="card-body">
<div class="grid-2">
<div><label style="font-size:.78rem;font-weight:600;color:var(--gray-500);display:block;margin-bottom:6px;">Proveedores (selección múltiple)</label>
<div style="display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto;padding:8px;border:1px solid var(--gray-200);border-radius:6px;">
${PROVEEDORES.map(p=>`<label style="display:flex;align-items:center;gap:5px;font-size:.8rem;padding:4px 8px;background:${APP.reporteProvIds.includes(p.id)?'rgba(41,128,185,.1)':'var(--gray-50)'};border-radius:12px;cursor:pointer;"><input type="checkbox" ${APP.reporteProvIds.includes(p.id)?'checked':''} onchange="toggleReporteProv(${p.id})"> ${p.nombre}</label>`).join('')}
</div></div>
<div><label style="font-size:.78rem;font-weight:600;color:var(--gray-500);display:block;margin-bottom:6px;">Métrica a comparar</label>
<select onchange="APP.reporteMetrica=this.value;renderView('reportes')" style="width:100%;padding:9px 12px;border:1px solid var(--gray-200);border-radius:6px;">
<option value="precio" ${APP.reporteMetrica==='precio'?'selected':''}>Precio de venta</option>
<option value="costo" ${APP.reporteMetrica==='costo'?'selected':''}>Costo</option>
<option value="margen" ${APP.reporteMetrica==='margen'?'selected':''}>Margen %</option>
<option value="precioMercado" ${APP.reporteMetrica==='precioMercado'?'selected':''}>Precio de mercado</option>
</select>
<p style="font-size:.72rem;color:var(--gray-400);margin-top:8px;"><i class="fas fa-info-circle"></i> Seleccione la métrica para comparar la tendencia entre los productos elegidos.</p>
</div>
</div>
<label style="font-size:.78rem;font-weight:600;color:var(--gray-500);display:block;margin:14px 0 6px;">Productos (selección múltiple)</label>
<div style="display:flex;flex-wrap:wrap;gap:6px;max-height:150px;overflow-y:auto;padding:8px;border:1px solid var(--gray-200);border-radius:6px;">
${productosDisponibles.length?productosDisponibles.map(p=>`<label style="display:flex;align-items:center;gap:5px;font-size:.78rem;padding:4px 8px;background:${APP.reporteProductoSkus.includes(p.sku)?'rgba(39,174,96,.1)':'var(--gray-50)'};border-radius:12px;cursor:pointer;"><input type="checkbox" ${APP.reporteProductoSkus.includes(p.sku)?'checked':''} onchange="toggleReporteProducto('${p.sku}')"> ${p.sku} — ${p.descripcion} <span style="color:var(--gray-400);">(${p.proveedorNombre})</span></label>`).join(''):'<span style="font-size:.8rem;color:var(--gray-400);">Seleccione al menos un proveedor.</span>'}
</div>
<div style="margin-top:10px;display:flex;gap:8px;"><button class="btn btn-sm btn-outline" onclick="clearReporteProductos()"><i class="fas fa-eraser"></i> Limpiar productos</button></div>
</div></div>

${productosSel.length?`
<div class="card"><div class="card-header"><h2><i class="fas fa-chart-area"></i> Tendencia comparativa: ${metricaLabel(APP.reporteMetrica)} (${productosSel.length} producto${productosSel.length>1?'s':''})</h2></div><div class="card-body">
${renderMultiTrendChart(productosSel,APP.reporteMetrica)}
</div></div>

${productosSel.length===1?`
<div class="card"><div class="card-header"><h2><i class="fas fa-chart-area"></i> Detalle: Precio, Costo y Margen — ${productosSel[0].descripcion}</h2></div><div class="card-body">
${renderTrendChart(generatePriceHistory(productosSel[0]))}
</div></div>`:''}

<div class="card"><div class="card-header"><h2><i class="fas fa-table"></i> Tabla Histórica ${productosSel.length>1?'(comparativa)':''}</h2></div><div class="card-body">
${productosSel.map(prod=>{const historial=generatePriceHistory(prod);return `
<h3 style="font-size:.86rem;color:var(--primary);margin:14px 0 8px;">${prod.sku} — ${prod.descripcion} <span style="color:var(--gray-400);font-weight:400;">(${prod.proveedorNombre})</span></h3>
<div class="table-container"><table><thead><tr><th>Fecha</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Precio</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Markup</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Margen</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Precio Mercado</th><th>Acción</th><th>Usuario</th></tr></thead><tbody>
${historial.map(h=>`<tr><td>${h.fecha}</td><td>$${fmt(h.costo)}</td><td>$${fmt(h.precio)}</td><td>${h.markup.toFixed(1)}%</td><td>${h.margen.toFixed(1)}%</td><td>$${fmt(h.precioMercado)}</td><td>${h.accion}</td><td>${h.usuario}</td></tr>`).join('')}
</tbody></table></div>`;}).join('')}
<div style="display:flex;gap:10px;margin-top:14px;"><button class="btn btn-primary" onclick="showToast('Exportación a Excel simulada','success')"><i class="fas fa-file-excel"></i> Exportar Excel</button><button class="btn btn-accent" onclick="showToast('Exportación a PDF simulada','success')"><i class="fas fa-file-pdf"></i> Exportar PDF</button></div>
</div></div>
`:'<div class="card"><div class="card-body"><div class="alert-item info"><i class="fas fa-info-circle"></i><span>Seleccione uno o más productos para ver las tendencias.</span></div></div></div>'}

<div class="grid-2">
<div class="card"><div class="card-header"><h2>Simulaciones por estado</h2></div><div class="card-body">${renderEstadoChart()}</div></div>
<div class="card"><div class="card-header"><h2>Variación costos por proveedor</h2></div><div class="card-body">
<div class="table-container"><table><thead><tr><th>Proveedor</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Variación</th><th><i class="fas fa-robot" style="color:var(--success)" title="IA"></i> Estado</th></tr></thead><tbody>
${PROVEEDORES.filter(p=>p.recurrente).map(p=>`<tr><td>${p.nombre}</td><td style="color:${p.variacionReciente>15?'var(--danger)':'inherit'}">${p.variacionReciente}%</td><td><span class="badge-status ${p.variacionReciente>15?'badge-rechazado':p.variacionReciente>10?'badge-ajustes':'badge-aprobado'}">${p.variacionReciente>15?'Alerta':p.variacionReciente>10?'Moderado':'Normal'}</span></td></tr>`).join('')}
</tbody></table></div></div></div>
</div>`;}

function toggleReporteProv(id){if(!APP.reporteProvIds)APP.reporteProvIds=[];const i=APP.reporteProvIds.indexOf(id);if(i>=0){APP.reporteProvIds.splice(i,1);}else{APP.reporteProvIds.push(id);}
// Quitar productos de proveedores deseleccionados
const validSkus=[];APP.reporteProvIds.forEach(pid=>{(SUPPLIER_CATALOGS[pid]||[]).forEach(p=>validSkus.push(p.sku));});
APP.reporteProductoSkus=(APP.reporteProductoSkus||[]).filter(sku=>validSkus.includes(sku));
renderView('reportes');}
function toggleReporteProducto(sku){if(!APP.reporteProductoSkus)APP.reporteProductoSkus=[];const i=APP.reporteProductoSkus.indexOf(sku);if(i>=0){APP.reporteProductoSkus.splice(i,1);}else{if(APP.reporteProductoSkus.length>=6){showToast('Máximo 6 productos para comparar','warning');return;}APP.reporteProductoSkus.push(sku);}renderView('reportes');}
function clearReporteProductos(){APP.reporteProductoSkus=[];renderView('reportes');}
function metricaLabel(m){return {precio:'Precio de venta',costo:'Costo',margen:'Margen %',precioMercado:'Precio de mercado'}[m]||m;}

// Gráfico comparativo multi-producto (una línea por producto)
function renderMultiTrendChart(productos,metrica){
if(!productos.length)return '<p style="color:var(--gray-400);">Sin datos.</p>';
const W=900,H=340,padL=60,padR=30,padT=30,padB=40;
const chartW=W-padL-padR,chartH=H-padT-padB;
const colores=['#27ae60','#2980b9','#e67e22','#8e44ad','#e74c3c','#16a085'];
const series=productos.map((prod,idx)=>{const hist=generatePriceHistory(prod);return {nombre:prod.sku,desc:prod.descripcion,color:colores[idx%colores.length],valores:hist.map(h=>h[metrica]),fechas:hist.map(h=>h.fecha)};});
const allVals=series.flatMap(s=>s.valores);
const esPct=metrica==='margen';
const maxV=Math.max(...allVals)*(esPct?1.15:1.1);const minV=Math.min(...allVals)*(esPct?0.8:0.85);
const n=series[0].valores.length;
const xPos=i=>padL+(chartW*i/(n-1||1));
const yPos=v=>padT+chartH-((v-minV)/(maxV-minV||1)*chartH);
const buildLine=(vals)=>vals.map((v,i)=>`${i===0?'M':'L'}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ');
const buildDots=(vals,color)=>vals.map((v,i)=>`<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="4" fill="${color}"/>`).join('');
const fmtY=v=>esPct?v.toFixed(0)+'%':'$'+(v/1000).toFixed(0)+'k';
const gridLines=5;const gridY=[];for(let g=0;g<=gridLines;g++){const val=minV+(maxV-minV)*g/gridLines;const y=padT+chartH-(chartH*g/gridLines);gridY.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL-8}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="#7f8c8d">${fmtY(val)}</text>`);}
const xLabels=series[0].fechas.map((f,i)=>`<text x="${xPos(i).toFixed(1)}" y="${H-15}" text-anchor="middle" font-size="11" fill="#2980b9">${f.substring(5)}</text>`).join('');
const legend=series.map(s=>`<span style="display:flex;align-items:center;gap:6px;"><span style="width:20px;height:3px;background:${s.color};display:inline-block;"></span> ${s.nombre}</span>`).join('');
const paths=series.map(s=>`<path d="${buildLine(s.valores)}" fill="none" stroke="${s.color}" stroke-width="3"/>${buildDots(s.valores,s.color)}`).join('');
return `<div style="display:flex;gap:16px;align-items:center;margin-bottom:10px;font-size:.8rem;flex-wrap:wrap;">${legend}</div>
<div style="overflow-x:auto;"><svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:600px;height:auto;">
${gridY.join('')}
${paths}
${xLabels}
</svg></div>`;}

// Gráfico de líneas de tendencia individual (Precio, Costo, Margen)
function renderTrendChart(historial){
if(!historial.length)return '<p style="color:var(--gray-400);">Sin datos históricos.</p>';
const W=900,H=340,padL=60,padR=30,padT=30,padB=40;
const chartW=W-padL-padR,chartH=H-padT-padB;
const precios=historial.map(h=>h.precio);const costos=historial.map(h=>h.costo);const mercados=historial.map(h=>h.precioMercado);
const allVals=[...precios,...costos,...mercados];
const maxV=Math.max(...allVals)*1.1;const minV=Math.min(...allVals)*0.85;
const n=historial.length;
const xPos=i=>padL+(chartW*i/(n-1||1));
const yPos=v=>padT+chartH-((v-minV)/(maxV-minV)*chartH);
const buildLine=(vals)=>vals.map((v,i)=>`${i===0?'M':'L'}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ');
const buildDots=(vals,color)=>vals.map((v,i)=>`<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="5" fill="${color}"/>`).join('');
const gridLines=5;const gridY=[];for(let g=0;g<=gridLines;g++){const val=minV+(maxV-minV)*g/gridLines;const y=padT+chartH-(chartH*g/gridLines);gridY.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL-8}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="#7f8c8d">$${(val/1000).toFixed(0)}k</text>`);}
const xLabels=historial.map((h,i)=>`<text x="${xPos(i).toFixed(1)}" y="${H-15}" text-anchor="middle" font-size="11" fill="#2980b9">${h.fecha.substring(5)}</text>`).join('');
return `<div style="display:flex;gap:20px;align-items:center;margin-bottom:10px;font-size:.8rem;">
<span style="display:flex;align-items:center;gap:6px;"><span style="width:20px;height:3px;background:#27ae60;display:inline-block;"></span> Precio</span>
<span style="display:flex;align-items:center;gap:6px;"><span style="width:20px;height:3px;background:#f39c12;display:inline-block;"></span> Costo</span>
<span style="display:flex;align-items:center;gap:6px;"><span style="width:20px;height:3px;background:#e74c3c;display:inline-block;border-top:2px dashed #e74c3c;"></span> Precio Mercado</span>
</div>
<div style="overflow-x:auto;"><svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:600px;height:auto;">
${gridY.join('')}
<path d="${buildLine(costos)}" fill="none" stroke="#f39c12" stroke-width="3"/>
<path d="${buildLine(precios)}" fill="none" stroke="#27ae60" stroke-width="3"/>
<path d="${buildLine(mercados)}" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="6,4"/>
${buildDots(costos,'#f39c12')}
${buildDots(precios,'#27ae60')}
${buildDots(mercados,'#e74c3c')}
${xLabels}
</svg></div>`;}
function renderIncotermChart(){const ics=['CIF','FOB','FCA','EXW'];const counts=ics.map(ic=>APP.simulaciones.filter(s=>s.incoterm===ic).length);const max=Math.max(...counts,1);const colors=['#2980b9','#27ae60','#e67e22','#8e44ad'];return `<div class="chart-bar-container">${counts.map((c,i)=>`<div class="chart-bar"><span class="bar-value">${c}</span><div class="bar" style="height:${(c/max)*100}%;background:${colors[i]};min-height:4px;"></div><span class="bar-label">${ics[i]}</span></div>`).join('')}</div>`;}

// ===== VISTA 8: DETALLE SIMULACIÓN =====
function viewSimDetail(id){APP.currentSimDetail=APP.simulaciones.find(s=>s.id===id);if(!APP.currentSimDetail)return;APP.currentView='detalle-simulacion';renderView('detalle-simulacion');}
function renderDetalle(){const s=APP.currentSimDetail;if(!s)return '<p>No encontrada</p>';const tr=APP.transitRecords.find(t=>t.simId===s.id);const po=APP.purchaseOrders.find(o=>o.simId===s.id);
return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap;"><button class="btn btn-outline btn-sm" onclick="navigateTo('simulaciones')"><i class="fas fa-arrow-left"></i></button><h1 class="section-title" style="margin:0;">${s.id}</h1><span class="badge-status badge-${s.estado}">${ESTADOS_MAP[s.estado]}</span></div>
<div class="tabs" id="det-tabs"><div class="tab active" onclick="showDetTab('dt-res')">Resumen</div><div class="tab" onclick="showDetTab('dt-prod')">Productos</div><div class="tab" onclick="showDetTab('dt-mix')">Mix inteligente</div><div class="tab" onclick="showDetTab('dt-log')">Logística</div><div class="tab" onclick="showDetTab('dt-rec')">Recomendación</div>${po?'<div class="tab" onclick="showDetTab(\'dt-oc\')">Orden de compra</div>':''}<div class="tab" onclick="showDetTab('dt-track')">Seguimiento</div><div class="tab" onclick="showDetTab('dt-hist')">Historial</div></div>
<div id="dt-res" class="tab-content">${renderDetResumen(s)}</div>
<div id="dt-prod" class="tab-content hidden">${renderDetProductos(s)}</div>
<div id="dt-mix" class="tab-content hidden"><div class="card"><div class="card-body"><p style="color:var(--gray-400);">El mix inteligente se genera durante la creación de la simulación. Consulte el paso 3 del wizard para detalles de la optimización aplicada.</p><div class="alert-item info"><i class="fas fa-magic"></i><span>Mix aplicado: ${s.numProductos} productos seleccionados. Utilización: ${s.utilizacion}%.</span></div></div></div></div>
<div id="dt-log" class="tab-content hidden">${renderDetLogistica(s)}</div>
<div id="dt-rec" class="tab-content hidden"><div class="card"><div class="card-body"><div class="rec-card ${getRecClass(s.recomendacion)}"><h3>${s.recomendacion}</h3><p class="confidence">Confianza: ${s.tipoProveedor==='Nuevo'?'Baja':'Alta'}</p></div></div></div></div>
${po?`<div id="dt-oc" class="tab-content hidden">${renderOCTab(s,po)}</div>`:''}
<div id="dt-track" class="tab-content hidden">${tr?renderTracking(tr):'<div class="card"><div class="card-body"><p style="color:var(--gray-400);">Sin información de tránsito disponible para esta simulación.</p></div></div>'}</div>
<div id="dt-hist" class="tab-content hidden">${renderTimeline(s)}</div>
${renderDetActions(s)}`;}
function showDetTab(id){document.querySelectorAll('.tab-content').forEach(t=>t.classList.add('hidden'));document.getElementById(id)?.classList.remove('hidden');document.querySelectorAll('#det-tabs .tab').forEach(t=>t.classList.remove('active'));event.target.classList.add('active');}
function renderDetResumen(s){return `<div class="kpi-grid"><div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-shopping-cart"></i></div><div class="kpi-info"><h3>$${fmt(s.totalCompra)}</h3><p>Total compra</p></div></div><div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-flag-checkered"></i></div><div class="kpi-info"><h3>$${fmt(s.costoCR)}</h3><p>Costo CR</p></div></div><div class="kpi-card"><div class="kpi-icon teal"><i class="fas fa-box"></i></div><div class="kpi-info"><h3>${s.utilizacion}%</h3><p>Utilización</p></div></div><div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-globe"></i></div><div class="kpi-info"><h3>${s.incoterm}</h3><p>Incoterm</p></div></div></div>
<div class="grid-2"><div class="card"><div class="card-body"><p><strong>Motivo:</strong> ${s.motivo}</p><p><strong>Proveedor:</strong> ${s.proveedor} (${s.tipoProveedor})</p><p><strong>Región:</strong> ${s.region} · ${s.pais}</p><p><strong>Carga:</strong> ${s.tipoCarga}</p><p><strong>Responsable:</strong> ${s.responsable}</p></div></div><div class="card"><div class="card-body"><p><strong>Fecha:</strong> ${s.fecha}</p><p><strong>Llegada est.:</strong> ${s.fechaLlegada||'N/A'}</p><p><strong>Productos:</strong> ${s.numProductos}</p>${s.sapOrder?`<p><strong>Orden SAP:</strong> ${s.sapOrder}</p>`:''}<p><strong>Equivalencia CRC:</strong> ₡${fmt(Math.round(s.costoCR*APP.rules.tipoCambio))}</p></div></div></div>`;}
function renderDetProductos(s){const cat=SUPPLIER_CATALOGS[PROVEEDORES.find(p=>p.nombre===s.proveedor)?.id||1]||[];return `<div class="card"><div class="card-body"><div class="table-container"><table><thead><tr><th>SKU</th><th>Descripción</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Costo SAP</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Precio</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Margen</th><th><i class="fas fa-database" style="color:var(--primary)" title="SAP"></i> Stock</th></tr></thead><tbody>${cat.slice(0,s.numProductos).map(p=>`<tr><td>${p.sku}</td><td>${p.descripcion}</td><td>$${p.costoActual.toFixed(2)}</td><td>$${p.precioVenta.toFixed(2)}</td><td>${(((p.precioVenta-p.costoActual)/p.precioVenta)*100).toFixed(1)}%</td><td>${p.stockActual}</td></tr>`).join('')}</tbody></table></div></div></div>`;}
function renderDetLogistica(s){return `<div class="card"><div class="card-body"><div class="grid-2"><div><p><strong>Tipo carga:</strong> ${s.tipoCarga}</p><p><strong>Incoterm:</strong> ${s.incoterm}</p><p><strong>Región:</strong> ${s.region}</p></div><div><p><strong>Costo logístico est.:</strong> $${fmt(s.costoCR-s.totalCompra)}</p><p><strong>% sobre compra:</strong> ${(((s.costoCR-s.totalCompra)/s.totalCompra)*100).toFixed(1)}%</p><p><strong>Utilización:</strong> <span class="semaphore ${s.utilizacion>=85?'green':s.utilizacion>=70?'yellow':'red'}">${s.utilizacion}%</span></p></div></div></div></div>`;}

// ===== ORDEN DE COMPRA =====
function renderOCTab(s,po){return `<div class="card"><div class="card-body"><p><strong>Orden:</strong> ${po.id} · <strong>SAP:</strong> ${po.sapOrder||'Pendiente'} · <strong>Estado:</strong> ${po.estado}</p><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;"><button class="btn btn-primary btn-sm" onclick="printPO('${s.id}')"><i class="fas fa-print"></i> Imprimir / PDF</button><button class="btn btn-accent btn-sm" onclick="sendToSupplier('${s.id}')"><i class="fas fa-envelope"></i> Enviar al proveedor</button>${!po.sapOrder?`<button class="btn btn-sm btn-success" onclick="createSAPOrder('${s.id}')"><i class="fas fa-database"></i> Crear en SAP</button>`:''}</div></div></div>`;}
function renderDetActions(s){const canApprove=s.estado==='borrador';const canOC=s.estado==='aprobado'&&!APP.purchaseOrders.find(o=>o.simId===s.id);
return `<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">
${canApprove?`<button class="btn btn-success" onclick="changeEstado('${s.id}','aprobado')"><i class="fas fa-check"></i> Aprobar</button><button class="btn btn-danger" onclick="confirmRejectSim('${s.id}')"><i class="fas fa-times"></i> Rechazar</button>`:''} 
${canOC?`<button class="btn btn-primary" onclick="generarOC('${s.id}')"><i class="fas fa-file-invoice"></i> Generar orden de compra</button>`:''}
<button class="btn btn-outline" onclick="showToast('Reporte exportado','success')"><i class="fas fa-download"></i> Exportar</button></div>`;}

function generarOC(simId){const s=APP.simulaciones.find(x=>x.id===simId);if(!s)return;
const po={id:'OC-2026-'+String(APP.purchaseOrders.length+50).padStart(3,'0'),simId,proveedor:s.proveedor,fecha:new Date().toISOString().split('T')[0],estado:'generada',sapOrder:null,total:s.totalCompra,productos:s.numProductos};
APP.purchaseOrders.push(po);s.estado='oc_generada';saveData();showToast(`Orden ${po.id} generada`,'success');renderView('detalle-simulacion');}

function createSAPOrder(simId){const s=APP.simulaciones.find(x=>x.id===simId);const po=APP.purchaseOrders.find(o=>o.simId===simId);if(!po)return;
showModal('Crear orden en SAP','<p>¿Confirma la creación de la orden de compra en SAP Business One?</p><p style="font-size:.78rem;color:var(--accent);">⚠️ Integración simulada. No conectado a SAP real.</p>',[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Crear en SAP',cls:'btn-success',action:`doCreateSAP('${simId}')`}]);}
function doCreateSAP(simId){closeModal();const s=APP.simulaciones.find(x=>x.id===simId);const po=APP.purchaseOrders.find(o=>o.simId===simId);
const sapNum='4500'+String(Math.floor(Math.random()*9000)+1000);po.sapOrder=sapNum;po.estado='sap';s.estado='sap';s.sapOrder=sapNum;saveData();
showToast(`Orden SAP ${sapNum} creada correctamente. (Integración simulada)`,'success');renderView('detalle-simulacion');}

function sendToSupplier(simId){const s=APP.simulaciones.find(x=>x.id===simId);const prov=PROVEEDORES.find(p=>p.nombre===s.proveedor);
showModal('Enviar al proveedor',`<div class="form-group"><label>Correo</label><input value="${prov?.email||'proveedor@email.com'}" disabled></div><div class="form-group"><label>Asunto</label><input value="Orden de compra - RENTECO - ${s.id}" disabled></div><div class="form-group"><label>Mensaje</label><textarea rows="3" disabled>Adjunto orden de compra para su procesamiento. Favor confirmar recepción.</textarea></div><p style="font-size:.76rem;color:var(--accent);">⚠️ Envío simulado. No se enviará correo real.</p>`,[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Enviar',cls:'btn-primary',action:`doSendSupplier('${simId}')`}]);}
function doSendSupplier(simId){closeModal();const s=APP.simulaciones.find(x=>x.id===simId);const po=APP.purchaseOrders.find(o=>o.simId===simId);if(po)po.estado='enviada';s.estado='enviada';saveData();showToast('Orden enviada al proveedor (simulado)','success');renderView('detalle-simulacion');}

function printPO(simId){const s=APP.simulaciones.find(x=>x.id===simId);const po=APP.purchaseOrders.find(o=>o.simId===simId);const prov=PROVEEDORES.find(p=>p.nombre===s.proveedor);const cat=(SUPPLIER_CATALOGS[prov?.id||1]||[]).slice(0,s.numProductos);
const el=document.getElementById('print-overlay');el.classList.remove('hidden');
el.innerHTML=`<div class="po-document"><div style="margin-bottom:20px;"><button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Imprimir / PDF</button> <button class="btn btn-outline" onclick="document.getElementById('print-overlay').classList.add('hidden')"><i class="fas fa-times"></i> Cerrar</button></div>
<div class="po-header"><div class="po-logo"><i class="fas fa-building"></i> RENTECO</div><div class="po-info"><h2>ORDEN DE COMPRA</h2><p><strong>${po?.id||'OC-XXXX'}</strong></p><p>Fecha: ${po?.fecha||s.fecha}</p>${po?.sapOrder?`<p>SAP: ${po.sapOrder}</p>`:''}</div></div>
<div class="grid-2" style="margin-bottom:20px;"><div><p><strong>Proveedor:</strong> ${s.proveedor}</p><p>${prov?.direccion||''}</p><p>${prov?.pais||''}</p></div><div><p><strong>Moneda:</strong> ${prov?.moneda||'USD'}</p><p><strong>Incoterm:</strong> ${s.incoterm}</p><p><strong>Entrega esperada:</strong> ${s.fechaLlegada||'Por confirmar'}</p></div></div>
<table><thead><tr><th>SKU</th><th>Descripción</th><th>Cantidad</th><th>Costo unit.</th><th>Total</th></tr></thead><tbody>
${cat.map(p=>{const qty=p.cantidadPromedio||50;const cost=p.costoActual;return `<tr><td>${p.sku}</td><td>${p.descripcion}</td><td>${qty}</td><td>$${cost.toFixed(2)}</td><td>$${fmt(Math.round(qty*cost))}</td></tr>`;}).join('')}
</tbody></table><div class="po-total">TOTAL: $${fmt(s.totalCompra)}</div>
<div style="margin-top:30px;"><p><strong>Responsable:</strong> ${s.responsable}</p><p><strong>Aprobador:</strong> Roberto Fallas — Dirección</p></div>
<div class="po-footer">RENTECO © 2026 · Documento generado desde prototipo (datos simulados)</div></div>`;}

// ===== SEGUIMIENTO LOGÍSTICO =====
function renderTracking(tr){const nodes=['Proveedor','Puerto origen','En tránsito','Puerto interm.','Costa Rica','Aduana','Bodega'];
const milestoneMap={'preparando':0,'despachada':1,'puerto_origen':2,'transito':3,'puerto_intermedio':4,'proxima_llegada':5,'aduana':6,'recibida':7};
const currentIdx=tr.milestones.length;
return `<div class="card"><div class="card-header"><h2><i class="fas fa-ship"></i> Seguimiento logístico</h2><button class="btn btn-sm btn-accent" onclick="updateTracking('${tr.id}')"><i class="fas fa-sync"></i> Actualizar</button></div><div class="card-body">
<div class="grid-2" style="margin-bottom:20px;"><div><p><strong>OC:</strong> ${tr.ordenCompra}</p><p><strong>SAP:</strong> ${tr.ordenSAP}</p><p><strong>Embarque:</strong> ${tr.embarque}</p><p><strong>Contenedor:</strong> ${tr.contenedor}</p></div><div><p><strong>Naviera:</strong> ${tr.naviera}</p><p><strong>Operador:</strong> ${tr.operador}</p><p><strong>Puerto origen:</strong> ${tr.puertoOrigen}</p><p><strong>Salida:</strong> ${tr.fechaSalida}</p></div></div>
<div class="kpi-grid" style="margin-bottom:16px;"><div class="kpi-card"><div class="kpi-icon teal"><i class="fas fa-map-marker-alt"></i></div><div class="kpi-info"><h3 style="font-size:1rem;">${tr.ubicacionActual}</h3><p>Ubicación actual</p></div></div><div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-calendar"></i></div><div class="kpi-info"><h3>${tr.diasRestantes}d</h3><p>Días restantes</p></div></div><div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-clock"></i></div><div class="kpi-info"><h3>${tr.fechaEstimada}</h3><p>Llegada estimada</p></div></div></div>
<h3 style="font-size:.88rem;color:var(--primary);margin-bottom:12px;">Ruta</h3>
<div class="tracking-line">${nodes.map((n,i)=>`<div class="tracking-node ${i<currentIdx?'completed':i===currentIdx?'current':''}"><div class="node-dot"></div><span class="node-label">${n}</span></div>`).join('')}</div>
<p style="font-size:.76rem;color:var(--gray-400);margin-top:12px;text-align:right;">Última actualización: ${tr.ultimaActualizacion}</p>
</div></div>`;}

function updateTracking(trId){const tr=APP.transitRecords.find(t=>t.id===trId);if(!tr)return;
tr.diasRestantes=Math.max(0,tr.diasRestantes-2);tr.ultimaActualizacion=new Date().toISOString().split('T')[0];
if(tr.diasRestantes<=0){tr.ubicacionActual='Puerto Limón — Recibida';tr.estado='recibida';const s=APP.simulaciones.find(x=>x.id===tr.simId);if(s)s.estado='recibida';}
else if(tr.diasRestantes<=3){tr.ubicacionActual='Próximo a Puerto Limón';if(!tr.milestones.includes('proxima_llegada'))tr.milestones.push('proxima_llegada');}
saveData();showToast('Seguimiento actualizado (simulado)','success');renderView('detalle-simulacion');}

// ===== TIMELINE =====
function renderTimeline(s){const allSteps=['Solicitud creada','Cotización / proforma cargada','Datos SAP consultados','Históricos analizados','Mix recomendado','Análisis completado','Compra aprobada','Orden de compra generada','Orden creada en SAP'];
const stateIdx={borrador:1,aprobado:6,rechazado:6,oc_generada:7,sap:8};
const curr=stateIdx[s.estado]||1;
return `<div class="card"><div class="card-header"><h2><i class="fas fa-history"></i> Línea de tiempo</h2></div><div class="card-body"><div class="timeline">
${allSteps.map((step,i)=>{const done=i<curr;const isCurrent=i===curr;return `<div class="timeline-item ${done?'completed':isCurrent?'current':'pending'}"><span class="time-date">${done?s.fecha+' '+(9+i)+':'+String(i*7%60).padStart(2,'0'):''}</span><p class="time-text" style="color:${done?'var(--gray-600)':isCurrent?'var(--primary)':'var(--gray-300)'}">${step}</p></div>`;}).join('')}
</div>${s.estado==='rechazado'?'<div class="alert-item danger" style="margin-top:12px;"><i class="fas fa-times-circle"></i><span>Simulación rechazada. El flujo no continúa.</span></div>':''}</div></div>`;}

// ===== ACCIONES =====
function duplicarSim(id){const s=APP.simulaciones.find(x=>x.id===id);if(!s)return;const ns={...s,id:'SIM-2026-'+String(APP.simulaciones.length+1).padStart(3,'0'),fecha:new Date().toISOString().split('T')[0],estado:'borrador',sapOrder:null};APP.simulaciones.unshift(ns);saveData();showToast(`Duplicada como ${ns.id}`,'success');renderView('simulaciones');}
function editarSim(id){const s=APP.simulaciones.find(x=>x.id===id);if(!s||s.estado!=='borrador')return;
// Cargar datos de la simulación en el wizard para edición
const provId=PROVEEDORES.find(p=>p.nombre===s.proveedor)?.id||1;
const prov=PROVEEDORES.find(p=>p.id===provId);
const catalog=SUPPLIER_CATALOGS[provId]||[];
APP.wizardData={};initWizard();
APP.wizardData.tipoImportacion=s.tipoImportacion||'regular';
APP.wizardData.tipoAnalisis=s.motivo||'Compra completa por proveedor';
APP.wizardData.responsable=s.responsable;
APP.wizardData.proveedorId=provId;
APP.wizardData.incoterm=s.incoterm;
APP.wizardData.tipoCarga=s.tipoCarga;
APP.wizardData.editingSimId=id;// Marcar que estamos editando
APP.wizardData.productos=catalog.map(p=>{
const need=calculatePurchaseNeed(p,APP.rules);
return {...p,selected:need.needsPurchase,cantidad:need.finalSuggestedQty||p.cantidadPromedio||50,costoCotizado:p.costoActual*(1+(prov.variacionReciente||0)/100),needData:need,accionRecomendada:getRecommendedAction(p)};});
APP.wizardStep=1;navigateTo('nueva-simulacion');showToast(`Editando ${id}`,'info');}
function eliminarSim(id){showModal('Eliminar','¿Eliminar '+id+'?',[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Eliminar',cls:'btn-danger',action:`doEliminar('${id}')`}]);}
function doEliminar(id){APP.simulaciones=APP.simulaciones.filter(s=>s.id!==id);saveData();closeModal();showToast('Eliminada','success');renderView('simulaciones');}
function changeEstado(id,est){const s=APP.simulaciones.find(x=>x.id===id);if(s){s.estado=est;saveData();showToast(`${id} → ${ESTADOS_MAP[est]}`,'success');renderView('detalle-simulacion');}}
function confirmRejectSim(id){showModal('Confirmar rechazo','¿Rechazar '+id+'?',[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Rechazar',cls:'btn-danger',action:`changeEstado('${id}','rechazado');closeModal()`}]);}

// ===== UTILIDADES =====
function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function getCaps(tipo){return tipo==='20 pies'?{peso:APP.rules.capacidad20Peso,vol:APP.rules.capacidad20Volumen}:{peso:APP.rules.capacidad40Peso,vol:APP.rules.capacidad40Volumen};}
function getRecBadge(r){if(r==='COMPRAR')return'rec-comprar';if(r==='COMPRAR CON AJUSTES')return'rec-ajustes';if(r==='ESPERAR')return'rec-esperar';return'rec-no-comprar';}
function getRecClass(r){if(r==='COMPRAR')return'comprar';if(r==='COMPRAR CON AJUSTES')return'ajustes';if(r==='ESPERAR')return'esperar';return'no-comprar';}
function showToast(msg,type='info'){const c=document.getElementById('toast-container');const t=document.createElement('div');t.className=`toast ${type}`;const icons={success:'fa-check-circle',error:'fa-times-circle',warning:'fa-exclamation-triangle',info:'fa-info-circle'};t.innerHTML=`<i class="fas ${icons[type]||icons.info}"></i> ${msg}`;c.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(100%)';setTimeout(()=>t.remove(),300);},3500);}
function showModal(title,content,actions=[]){const m=document.getElementById('modal-content');m.innerHTML=`<h3>${title}</h3><div>${content}</div><div class="modal-actions">${actions.map(a=>`<button class="btn ${a.cls}" onclick="${a.action}">${a.text}</button>`).join('')}</div>`;document.getElementById('modal-overlay').classList.remove('hidden');}
function closeModal(){document.getElementById('modal-overlay').classList.add('hidden');}

// ===== VISTA: USUARIOS =====
function renderUsuarios(){
const usuarios=APP.usuarios||[];
const totalSims=usuarios.reduce((a,u)=>a+u.simulacionesUsadas,0);
const totalMax=usuarios.reduce((a,u)=>a+u.maxSimulaciones,0);
return `<h1 class="section-title"><i class="fas fa-users-cog"></i> Configuración de Usuarios</h1>
<div class="kpi-grid" style="margin-bottom:20px;">
<div class="kpi-card"><div class="kpi-icon blue"><i class="fas fa-users"></i></div><div class="kpi-info"><h3>${usuarios.length}</h3><p>Usuarios registrados</p></div></div>
<div class="kpi-card"><div class="kpi-icon green"><i class="fas fa-user-check"></i></div><div class="kpi-info"><h3>${usuarios.filter(u=>u.activo).length}</h3><p>Activos</p></div></div>
<div class="kpi-card"><div class="kpi-icon orange"><i class="fas fa-chart-bar"></i></div><div class="kpi-info"><h3>${totalSims}</h3><p>Simulaciones usadas (total)</p></div></div>
<div class="kpi-card"><div class="kpi-icon purple"><i class="fas fa-database"></i></div><div class="kpi-info"><h3>${totalMax}</h3><p>Capacidad asignada (total)</p></div></div>
</div>
<div class="card"><div class="card-header"><h2>Usuarios y límites de simulaciones</h2><button class="btn btn-sm btn-primary" onclick="addUsuario()"><i class="fas fa-plus"></i> Nuevo usuario</button></div>
<div class="card-body"><div class="table-container"><table><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Máx. simulaciones</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Usadas</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Disponibles</th><th><i class="fas fa-calculator" style="color:var(--accent)" title="Cálculo"></i> Uso %</th><th>Último acceso</th><th></th></tr></thead><tbody>
${usuarios.map((u,i)=>{const disp=u.maxSimulaciones-u.simulacionesUsadas;const usoPct=u.maxSimulaciones>0?Math.round(u.simulacionesUsadas/u.maxSimulaciones*100):0;
return `<tr><td><strong>${u.nombre}</strong></td><td style="font-size:.78rem;">${u.email}</td><td><span class="badge-status badge-analisis">${u.rol}</span></td><td>${u.activo?'<span class="badge-status badge-aprobado">Activo</span>':'<span class="badge-status badge-rechazado">Inactivo</span>'}</td><td><input type="number" value="${u.maxSimulaciones}" style="width:70px;padding:4px 6px;border:1px solid var(--gray-200);border-radius:4px;font-size:.8rem;text-align:center;" onchange="updateUserLimit(${i},parseInt(this.value))"></td><td>${u.simulacionesUsadas}</td><td style="font-weight:600;color:${disp<=5?'var(--danger)':disp<=20?'var(--warning)':'var(--success)'}">${disp}</td><td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle;"><div class="fill ${usoPct>=90?'red':usoPct>=70?'yellow':'green'}" style="width:${usoPct}%"></div></div> <span style="font-size:.72rem;">${usoPct}%</span></td><td style="font-size:.76rem;">${u.ultimoAcceso}</td><td class="action-btns"><button onclick="toggleUserActive(${i})" title="${u.activo?'Desactivar':'Activar'}"><i class="fas fa-${u.activo?'ban':'check'}" style="color:${u.activo?'var(--danger)':'var(--success)'}"></i></button><button onclick="deleteUsuario(${i})" title="Eliminar"><i class="fas fa-trash"></i></button></td></tr>`;}).join('')}
</tbody></table></div>
<p style="font-size:.74rem;color:var(--gray-400);margin-top:12px;"><i class="fas fa-info-circle"></i> El límite de simulaciones se aplica por usuario por mes. Al inicio de cada mes se reinicia el contador de usadas.</p>
</div></div>`;
}

function updateUserLimit(idx,val){if(val<0)val=0;APP.usuarios[idx].maxSimulaciones=val;saveData();renderView('usuarios');showToast('Límite actualizado','success');}
function toggleUserActive(idx){APP.usuarios[idx].activo=!APP.usuarios[idx].activo;saveData();renderView('usuarios');showToast(APP.usuarios[idx].activo?'Usuario activado':'Usuario desactivado','info');}
function deleteUsuario(idx){showModal('Eliminar usuario','¿Eliminar a '+APP.usuarios[idx].nombre+'?',[{text:'Cancelar',cls:'btn-outline',action:'closeModal()'},{text:'Eliminar',cls:'btn-danger',action:`doDeleteUsuario(${idx})`}]);}
function doDeleteUsuario(idx){APP.usuarios.splice(idx,1);saveData();closeModal();renderView('usuarios');showToast('Usuario eliminado','success');}
function addUsuario(){APP.usuarios.push({id:APP.usuarios.length+10,nombre:'Nuevo Usuario',email:'nuevo@renteco.com',rol:'comercial',activo:true,maxSimulaciones:50,simulacionesUsadas:0,ultimoAcceso:'—'});saveData();renderView('usuarios');showToast('Usuario creado','success');}

// ===== VISTA: CONTROL DE CONSUMO =====
function renderControlConsumo(){
const c=APP.consumo||DEFAULT_CONSUMO;
const simPct=Math.round(c.simulaciones.usadas/c.simulaciones.limite*100);
const iaPct=Math.round(c.extractorIA.usadas/c.extractorIA.limite*100);
const simDisp=c.simulaciones.limite-c.simulaciones.usadas;
const iaDisp=c.extractorIA.limite-c.extractorIA.usadas;
return `<h1 class="section-title"><i class="fas fa-tachometer-alt"></i> Control de Consumo</h1>
<div class="alert-item info" style="margin-bottom:20px;"><i class="fas fa-calendar"></i><span><strong>Período actual:</strong> ${c.mesActual} · Los contadores se reinician al inicio de cada mes.</span></div>
<div class="grid-2">
<div class="card"><div class="card-header"><h2><i class="fas fa-flask"></i> Simulaciones nuevas</h2></div><div class="card-body">
<div style="text-align:center;margin-bottom:16px;">
<div style="font-size:2.5rem;font-weight:700;color:${simPct>=90?'var(--danger)':simPct>=70?'var(--warning)':'var(--primary)'}">${c.simulaciones.usadas} <span style="font-size:1rem;color:var(--gray-400);">/ ${c.simulaciones.limite}</span></div>
<p style="font-size:.82rem;color:var(--gray-400);margin-top:4px;">simulaciones este mes</p>
</div>
<div class="progress-bar" style="height:12px;margin-bottom:12px;"><div class="fill ${simPct>=90?'red':simPct>=70?'yellow':'green'}" style="width:${simPct}%"></div></div>
<div style="display:flex;justify-content:space-between;font-size:.82rem;">
<span><strong>Usadas:</strong> ${c.simulaciones.usadas}</span>
<span><strong>Disponibles:</strong> <span style="color:${simDisp<=50?'var(--danger)':simDisp<=150?'var(--warning)':'var(--success)'};">${simDisp}</span></span>
<span><strong>Límite:</strong> ${c.simulaciones.limite}/mes</span>
</div>
${simPct>=80?`<div class="alert-item ${simPct>=90?'danger':'warning'}" style="margin-top:12px;"><i class="fas fa-exclamation-triangle"></i><span>${simPct>=90?'Consumo crítico':'Consumo alto'}: ${simPct}% del límite mensual de simulaciones.</span></div>`:''}
<h3 style="font-size:.86rem;color:var(--primary);margin:18px 0 10px;">Historial mensual</h3>
<div class="chart-bar-container" style="height:100px;">${c.simulaciones.historial.map(h=>{const pct=Math.round(h.usadas/c.simulaciones.limite*100);return `<div class="chart-bar"><span class="bar-value">${h.usadas}</span><div class="bar" style="height:${pct}%;background:${pct>=90?'var(--danger)':pct>=70?'var(--warning)':'var(--primary-light)'};"></div><span class="bar-label">${h.mes.split('-')[1]}</span></div>`;}).join('')}</div>
</div></div>

<div class="card"><div class="card-header"><h2><i class="fas fa-robot"></i> Extractor IA (páginas)</h2></div><div class="card-body">
<div style="text-align:center;margin-bottom:16px;">
<div style="font-size:2.5rem;font-weight:700;color:${iaPct>=90?'var(--danger)':iaPct>=70?'var(--warning)':'var(--primary)'}">${fmt(c.extractorIA.usadas)} <span style="font-size:1rem;color:var(--gray-400);">/ ${fmt(c.extractorIA.limite)}</span></div>
<p style="font-size:.82rem;color:var(--gray-400);margin-top:4px;">páginas procesadas este mes</p>
</div>
<div class="progress-bar" style="height:12px;margin-bottom:12px;"><div class="fill ${iaPct>=90?'red':iaPct>=70?'yellow':'blue'}" style="width:${iaPct}%"></div></div>
<div style="display:flex;justify-content:space-between;font-size:.82rem;">
<span><strong>Usadas:</strong> ${fmt(c.extractorIA.usadas)}</span>
<span><strong>Disponibles:</strong> <span style="color:${iaDisp<=500?'var(--danger)':iaDisp<=1500?'var(--warning)':'var(--success)'};">${fmt(iaDisp)}</span></span>
<span><strong>Límite:</strong> ${fmt(c.extractorIA.limite)}/mes</span>
</div>
${iaPct>=80?`<div class="alert-item ${iaPct>=90?'danger':'warning'}" style="margin-top:12px;"><i class="fas fa-exclamation-triangle"></i><span>${iaPct>=90?'Consumo crítico':'Consumo alto'}: ${iaPct}% del límite mensual de extractor IA.</span></div>`:''}
<h3 style="font-size:.86rem;color:var(--primary);margin:18px 0 10px;">Historial mensual</h3>
<div class="chart-bar-container" style="height:100px;">${c.extractorIA.historial.map(h=>{const pct=Math.round(h.usadas/c.extractorIA.limite*100);return `<div class="chart-bar"><span class="bar-value">${fmt(h.usadas)}</span><div class="bar" style="height:${pct}%;background:${pct>=90?'var(--danger)':pct>=70?'var(--warning)':'var(--info)'};"></div><span class="bar-label">${h.mes.split('-')[1]}</span></div>`;}).join('')}</div>
</div></div>
</div>

<div class="card" style="margin-top:20px;"><div class="card-header"><h2><i class="fas fa-cog"></i> Configuración de límites</h2></div><div class="card-body">
<div class="form-row">
<div class="form-group"><label>Límite simulaciones mensuales</label><input type="number" id="consumo-sim-limite" value="${c.simulaciones.limite}"></div>
<div class="form-group"><label>Límite páginas extractor IA mensuales</label><input type="number" id="consumo-ia-limite" value="${c.extractorIA.limite}"></div>
<div class="form-group"><label>&nbsp;</label><button class="btn btn-primary" onclick="saveConsumoLimites()"><i class="fas fa-save"></i> Guardar límites</button></div>
</div>
<div class="form-row" style="margin-top:12px;">
<div class="form-group"><label>Simulaciones usadas este mes (demo)</label><input type="number" id="consumo-sim-usadas" value="${c.simulaciones.usadas}"></div>
<div class="form-group"><label>Páginas IA usadas este mes (demo)</label><input type="number" id="consumo-ia-usadas" value="${c.extractorIA.usadas}"></div>
<div class="form-group"><label>&nbsp;</label><button class="btn btn-outline" onclick="saveConsumoUsadas()"><i class="fas fa-edit"></i> Actualizar (demo)</button></div>
</div>
</div></div>`;
}

function saveConsumoLimites(){
APP.consumo.simulaciones.limite=parseInt(document.getElementById('consumo-sim-limite').value)||500;
APP.consumo.extractorIA.limite=parseInt(document.getElementById('consumo-ia-limite').value)||4500;
saveData();renderView('consumo');showToast('Límites actualizados','success');}

function saveConsumoUsadas(){
APP.consumo.simulaciones.usadas=parseInt(document.getElementById('consumo-sim-usadas').value)||0;
APP.consumo.extractorIA.usadas=parseInt(document.getElementById('consumo-ia-usadas').value)||0;
saveData();renderView('consumo');showToast('Consumo actualizado (demo)','success');}

// ===== VISTA: CONFIGURACIÓN =====
function renderConfiguracion(){
const tc=APP.rules.tipoCambio||530;
const historial=JSON.parse(localStorage.getItem('renteco_tc_historial'))||[
{fecha:'2026-07-29',valor:530,usuario:'Admin'},
{fecha:'2026-07-15',valor:528,usuario:'Admin'},
{fecha:'2026-07-01',valor:525,usuario:'Admin'},
{fecha:'2026-06-15',valor:522,usuario:'Admin'},
{fecha:'2026-06-01',valor:520,usuario:'Admin'}
];
return `<h1 class="section-title"><i class="fas fa-sliders-h"></i> Configuración General</h1>
<div class="grid-2">
<div class="card">
<div class="card-header"><h2><i class="fas fa-exchange-alt"></i> Tipo de Cambio USD / CRC</h2></div>
<div class="card-body">
<div class="alert-item info" style="margin-bottom:16px;"><i class="fas fa-info-circle"></i><span>Configure el tipo de cambio utilizado para mostrar equivalencias en colones costarricenses en todas las vistas del sistema.</span></div>
<div class="form-row">
<div class="form-group">
<label>Tipo de cambio actual (₡ por $1 USD)</label>
<input type="number" id="cfg-tc" value="${tc}" step="0.01" style="font-size:1.2rem;font-weight:700;text-align:center;">
</div>
<div class="form-group">
<label>Fecha de actualización</label>
<input type="date" id="cfg-tc-fecha" value="${new Date().toISOString().split('T')[0]}">
</div>
</div>
<div class="form-group">
<label>Fuente</label>
<select id="cfg-tc-fuente">
<option value="manual" selected>Ingreso manual</option>
<option value="bccr">Referencia BCCR (ingreso manual)</option>
<option value="proveedor">Tipo de cambio del proveedor</option>
</select>
</div>
<div class="form-group">
<label>Notas (opcional)</label>
<input type="text" id="cfg-tc-notas" placeholder="Ej: Tipo de cambio de venta BCCR al 29/07/2026">
</div>
<div style="display:flex;gap:10px;margin-top:16px;">
<button class="btn btn-primary" onclick="saveTipoCambio()"><i class="fas fa-save"></i> Guardar tipo de cambio</button>
</div>
<div style="margin-top:16px;padding:12px;background:var(--gray-50);border-radius:6px;">
<p style="font-size:.82rem;color:var(--gray-500);"><strong>Equivalencia actual:</strong></p>
<p style="font-size:1.1rem;font-weight:600;color:var(--primary);margin-top:4px;">$1,000 USD = ₡${fmt(Math.round(1000*tc))} CRC</p>
<p style="font-size:.78rem;color:var(--gray-400);margin-top:4px;">$10,000 USD = ₡${fmt(Math.round(10000*tc))} CRC</p>
</div>
</div>
</div>
<div class="card">
<div class="card-header"><h2><i class="fas fa-history"></i> Historial de actualizaciones</h2></div>
<div class="card-body">
<div class="table-container">
<table>
<thead><tr><th>Fecha</th><th>Tipo de cambio</th><th>Usuario</th><th>Variación</th></tr></thead>
<tbody>
${historial.map((h,i)=>{const prev=historial[i+1];const variac=prev?((h.valor-prev.valor)/prev.valor*100).toFixed(2):'—';
return `<tr><td>${h.fecha}</td><td><strong>₡${h.valor.toFixed(2)}</strong></td><td>${h.usuario}</td><td style="color:${parseFloat(variac)>0?'var(--danger)':parseFloat(variac)<0?'var(--success)':'inherit'}">${variac!=='—'?(parseFloat(variac)>0?'+':'')+variac+'%':variac}</td></tr>`;}).join('')}
</tbody>
</table>
</div>
<p style="font-size:.74rem;color:var(--gray-400);margin-top:12px;"><i class="fas fa-lightbulb"></i> El tipo de cambio se aplica a todas las equivalencias CRC mostradas en simulaciones, órdenes de compra y reportes.</p>
</div>
</div>
</div>
<div class="card">
<div class="card-header"><h2><i class="fas fa-info-circle"></i> Información del sistema</h2></div>
<div class="card-body">
<div class="grid-3">
<div><p style="font-size:.82rem;color:var(--gray-400);">Versión</p><p style="font-weight:600;">2.0.0 — Prototipo</p></div>
<div><p style="font-size:.82rem;color:var(--gray-400);">Integración SAP</p><p style="font-weight:600;color:var(--accent);">Simulada</p></div>
<div><p style="font-size:.82rem;color:var(--gray-400);">Moneda base</p><p style="font-weight:600;">USD (Dólar estadounidense)</p></div>
</div>
<div class="alert-item warning" style="margin-top:16px;"><i class="fas fa-exclamation-triangle"></i><span>Este es un prototipo con datos simulados. En producción, el sistema se conectará a SAP Business One para obtener costos, stock y precios en tiempo real.</span></div>
</div>
</div>`;
}

function saveTipoCambio(){
const nuevoTC=parseFloat(document.getElementById('cfg-tc').value);
if(!nuevoTC||nuevoTC<=0){showToast('Ingrese un tipo de cambio válido','error');return;}
const fecha=document.getElementById('cfg-tc-fecha').value||new Date().toISOString().split('T')[0];
APP.rules.tipoCambio=nuevoTC;
// Guardar en historial
let historial=JSON.parse(localStorage.getItem('renteco_tc_historial'))||[];
historial.unshift({fecha,valor:nuevoTC,usuario:document.getElementById('user-name').textContent||'Admin'});
if(historial.length>20)historial=historial.slice(0,20);
localStorage.setItem('renteco_tc_historial',JSON.stringify(historial));
saveData();
showToast(`Tipo de cambio actualizado: ₡${nuevoTC} por $1 USD`,'success');
renderView('configuracion');}
