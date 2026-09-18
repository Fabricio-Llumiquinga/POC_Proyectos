// MarcaControl COMECA - App.js v2 - Sin RPA - Kiosco + Marcación Web
// =====================================================================

var rolActual = 'Administrador Nómina';
var roles = ['Administrador Nómina', 'Supervisor', 'Administrador Sistema'];
var moduloActual = 'dashboard';
var permisosPorRol = {
    'Administrador Nómina': ['dashboard','fuentes','empleados','biometrico','marcacionweb','supervisores','incidencias','seguimiento','cierre','reportes','politicas','documentos','plantillas'],
    'Supervisor': ['empleados','incidencias','documentos','marcacionweb','reportes'],
    'Administrador Sistema': ['dashboard','fuentes','empleados','biometrico','marcacionweb','supervisores','incidencias','seguimiento','cierre','reportes','politicas','documentos','plantillas']
};

var empresas = [
    {codigo:'CR001',nombre:'Envases COMECA',pais:'Costa Rica',planillas:['Semanal','Quincenal','Mensual']},
    {codigo:'CR002',nombre:'Unican',pais:'Costa Rica',planillas:['Semanal','Mensual']},
    {codigo:'CR003',nombre:'Technoends',pais:'Costa Rica',planillas:['Quincenal']},
    {codigo:'CR004',nombre:'Empaque Santana',pais:'Costa Rica',planillas:['Semanal','Mensual']},
    {codigo:'CR005',nombre:'Metales Flix',pais:'Costa Rica',planillas:['Semanal']},
    {codigo:'CR006',nombre:'Impresora Delta',pais:'Costa Rica',planillas:['Quincenal','Mensual']}
];
var tiposPlanilla=['Semanal','Quincenal','Mensual'];

var supervisores = [
    {id:'SUP001',nombre:'Carlos Méndez',correo:'cmendez@comeca.cr',departamento:'Producción',grupo:'Grupo A',empresa:'CR001',empleadosAsignados:4,tiempoPromedio:'1.2 días',incidenciasPendientes:0,estado:'Activo'},
    {id:'SUP002',nombre:'María Fernández',correo:'mfernandez@comeca.cr',departamento:'Administración',grupo:'Grupo B',empresa:'CR001',empleadosAsignados:3,tiempoPromedio:'0.8 días',incidenciasPendientes:0,estado:'Activo'},
    {id:'SUP003',nombre:'Roberto Jiménez',correo:'rjimenez@comeca.cr',departamento:'Logística',grupo:'Grupo A',empresa:'CR001',empleadosAsignados:3,tiempoPromedio:'1.5 días',incidenciasPendientes:0,estado:'Activo'},
    {id:'SUP004',nombre:'Ana Solís',correo:'asolis@comeca.cr',departamento:'Mantenimiento',grupo:'Grupo C',empresa:'CR002',empleadosAsignados:3,tiempoPromedio:'0.5 días',incidenciasPendientes:0,estado:'Activo'},
    {id:'SUP005',nombre:'Jorge Vargas',correo:'jvargas@comeca.cr',departamento:'Operaciones',grupo:'Grupo A',empresa:'CR002',empleadosAsignados:3,tiempoPromedio:'0.3 días',incidenciasPendientes:0,estado:'Activo'}
];

var grupos = [
    {id:'GRP-A',nombre:'Grupo A',departamento:'Producción',empresa:'CR001',ubicacion:'Oficina',direccion:'Planta Central, La Uruca, San José',latitud:'9.9521',longitud:'-84.0825',descripcion:'Planta de producción principal'},
    {id:'GRP-B',nombre:'Grupo B',departamento:'Administración',empresa:'CR001',ubicacion:'Oficina',direccion:'Edificio Administrativo, Sabana Norte',latitud:'9.9375',longitud:'-84.1024',descripcion:'Oficinas administrativas'},
    {id:'GRP-C',nombre:'Grupo C',departamento:'Mantenimiento',empresa:'CR002',ubicacion:'Campo',direccion:'Zona Industrial Pavas',latitud:'9.9412',longitud:'-84.1301',descripcion:'Área de mantenimiento y campo'}
];

var empleados = [
    {id:'EMP001',cedula:'1-1234-0567',nombre:'Juan Pérez',departamento:'Producción',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP001',estado:'Activo',correo:'jperez@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP002',cedula:'1-2345-0678',nombre:'María López',departamento:'Producción',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP001',estado:'Activo',correo:'mlopez@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP003',cedula:'1-3456-0789',nombre:'Pedro Ramírez',departamento:'Producción',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 14:00-22:00',horario:{lun:[{entrada:'14:00',salida:'22:00'}],mar:[{entrada:'14:00',salida:'22:00'}],mie:[{entrada:'14:00',salida:'22:00'}],jue:[{entrada:'14:00',salida:'22:00'}],vie:[{entrada:'14:00',salida:'22:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP001',estado:'Activo',correo:'pramirez@comeca.cr',clave:'123456',biometricoRegistrado:false,permiteWeb:true},
    {id:'EMP004',cedula:'1-4567-0890',nombre:'Lucía Mora',departamento:'Producción',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-S 09:00-12:00',horario:{lun:[{entrada:'09:00',salida:'12:00'}],mar:[{entrada:'09:00',salida:'12:00'}],mie:[{entrada:'09:00',salida:'12:00'}],jue:[{entrada:'09:00',salida:'12:00'}],vie:[{entrada:'09:00',salida:'12:00'}],sab:[{entrada:'09:00',salida:'12:00'}],dom:[]},empresa:'CR001',supervisor:'SUP001',estado:'Activo',correo:'lmora@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:false},
    {id:'EMP005',cedula:'1-5678-0901',nombre:'Carlos Arias',departamento:'Administración',grupo:'Grupo B',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP002',estado:'Activo',correo:'carias@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP006',cedula:'1-6789-0012',nombre:'Andrea Solano',departamento:'Administración',grupo:'Grupo B',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP002',estado:'Activo',correo:'asolano@comeca.cr',clave:'123456',biometricoRegistrado:false,permiteWeb:true},
    {id:'EMP007',cedula:'1-7890-0123',nombre:'Fernando Rojas',departamento:'Administración',grupo:'Grupo B',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP002',estado:'Activo',correo:'frojas@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP008',cedula:'1-8901-0234',nombre:'Ricardo Herrera',departamento:'Logística',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 06:00-14:00',horario:{lun:[{entrada:'06:00',salida:'14:00'}],mar:[{entrada:'06:00',salida:'14:00'}],mie:[{entrada:'06:00',salida:'14:00'}],jue:[{entrada:'06:00',salida:'14:00'}],vie:[{entrada:'06:00',salida:'14:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP003',estado:'Activo',correo:'rherrera@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP009',cedula:'1-9012-0345',nombre:'Sofía Calderón',departamento:'Logística',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 06:00-14:00',horario:{lun:[{entrada:'06:00',salida:'14:00'}],mar:[{entrada:'06:00',salida:'14:00'}],mie:[{entrada:'06:00',salida:'14:00'}],jue:[{entrada:'06:00',salida:'14:00'}],vie:[{entrada:'06:00',salida:'14:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP003',estado:'Activo',correo:'scalderon@comeca.cr',clave:'123456',biometricoRegistrado:false,permiteWeb:true},
    {id:'EMP010',cedula:'1-0123-0456',nombre:'Diego Navarro',departamento:'Logística',grupo:'Grupo A',tipoPlanilla:'Semanal',jornada:'L-V 22:00-06:00',horario:{lun:[{entrada:'22:00',salida:'06:00'}],mar:[{entrada:'22:00',salida:'06:00'}],mie:[{entrada:'22:00',salida:'06:00'}],jue:[{entrada:'22:00',salida:'06:00'}],vie:[{entrada:'22:00',salida:'06:00'}],sab:[],dom:[]},empresa:'CR001',supervisor:'SUP003',estado:'Activo',correo:'dnavarro@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:false},
    {id:'EMP011',cedula:'2-1234-0567',nombre:'Laura Montero',departamento:'Mantenimiento',grupo:'Grupo C',tipoPlanilla:'Semanal',jornada:'L-V 07:00-15:00',horario:{lun:[{entrada:'07:00',salida:'15:00'}],mar:[{entrada:'07:00',salida:'15:00'}],mie:[{entrada:'07:00',salida:'15:00'}],jue:[{entrada:'07:00',salida:'15:00'}],vie:[{entrada:'07:00',salida:'15:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP004',estado:'Activo',correo:'lmontero@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP012',cedula:'2-2345-0678',nombre:'Andrés Mora',departamento:'Mantenimiento',grupo:'Grupo C',tipoPlanilla:'Semanal',jornada:'L-V 07:00-15:00',horario:{lun:[{entrada:'07:00',salida:'15:00'}],mar:[{entrada:'07:00',salida:'15:00'}],mie:[{entrada:'07:00',salida:'15:00'}],jue:[{entrada:'07:00',salida:'15:00'}],vie:[{entrada:'07:00',salida:'15:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP004',estado:'Activo',correo:'amora@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP013',cedula:'2-3456-0789',nombre:'Natalia Brenes',departamento:'Mantenimiento',grupo:'Grupo C',tipoPlanilla:'Semanal',jornada:'L-V 07:00-15:00',horario:{lun:[{entrada:'07:00',salida:'15:00'}],mar:[{entrada:'07:00',salida:'15:00'}],mie:[{entrada:'07:00',salida:'15:00'}],jue:[{entrada:'07:00',salida:'15:00'}],vie:[{entrada:'07:00',salida:'15:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP004',estado:'Activo',correo:'nbrenes@comeca.cr',clave:'123456',biometricoRegistrado:false,permiteWeb:true},
    {id:'EMP014',cedula:'2-4567-0890',nombre:'Daniela Fallas',departamento:'Operaciones',grupo:'Grupo A',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP005',estado:'Activo',correo:'dfallas@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP015',cedula:'2-5678-0901',nombre:'Esteban Chaves',departamento:'Operaciones',grupo:'Grupo A',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP005',estado:'Activo',correo:'echaves@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true},
    {id:'EMP016',cedula:'2-6789-0012',nombre:'Alejandro Vindas',departamento:'Operaciones',grupo:'Grupo A',tipoPlanilla:'Mensual',jornada:'L-V 08:00-17:00',horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:'CR002',supervisor:'SUP005',estado:'Activo',correo:'avindas@comeca.cr',clave:'123456',biometricoRegistrado:true,permiteWeb:true}
];

// Asignar lugar de trabajo a empleados basado en grupo
empleados.forEach(function(emp){
    var grp=grupos.find(function(g){return g.nombre===emp.grupo&&g.empresa===emp.empresa;});
    if(grp){emp.lugarTrabajo=grp.ubicacion;emp.direccionTrabajo=grp.direccion;emp.latTrabajo=grp.latitud;emp.lonTrabajo=grp.longitud;}
    else{emp.lugarTrabajo='Oficina';emp.direccionTrabajo='No asignada';emp.latTrabajo='';emp.lonTrabajo='';}
});

var marcacionesBio = [
    {id:'BIO-001',fecha:'2024-01-15',hora:'07:58',cedula:'1-1234-0567',empleado:'Juan Pérez',empresa:'CR001',departamento:'Producción',tipoMarca:'Entrada',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'98.2%',estado:'OK'},
    {id:'BIO-002',fecha:'2024-01-15',hora:'17:03',cedula:'1-1234-0567',empleado:'Juan Pérez',empresa:'CR001',departamento:'Producción',tipoMarca:'Salida',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'97.5%',estado:'OK'},
    {id:'BIO-003',fecha:'2024-01-15',hora:'08:01',cedula:'1-2345-0678',empleado:'María López',empresa:'CR001',departamento:'Producción',tipoMarca:'Entrada',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'99.1%',estado:'OK'},
    {id:'BIO-004',fecha:'2024-01-15',hora:'17:00',cedula:'1-2345-0678',empleado:'María López',empresa:'CR001',departamento:'Producción',tipoMarca:'Salida',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'98.8%',estado:'OK'},
    {id:'BIO-005',fecha:'2024-01-15',hora:'07:55',cedula:'1-5678-0901',empleado:'Carlos Arias',empresa:'CR001',departamento:'Administración',tipoMarca:'Entrada',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'97.9%',estado:'OK'},
    {id:'BIO-006',fecha:'2024-01-15',hora:'18:20',cedula:'1-5678-0901',empleado:'Carlos Arias',empresa:'CR001',departamento:'Administración',tipoMarca:'Salida',origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:'98.4%',estado:'OK'}
];

var marcacionesWeb = [
    {id:'WEB-001',fecha:'2024-01-15',hora:'08:15',empleadoId:'EMP005',correo:'carias@comeca.cr',empresa:'CR001',departamento:'Administración',tipoMarca:'Entrada',motivo:'Visita a cliente',lugar:'Corporación ABC, Heredia',ubicacionConfirmada:true,latitud:'9.9981',longitud:'-84.1197',direccion:'Heredia, Costa Rica',precision:'18m',estado:'OK'},
    {id:'WEB-002',fecha:'2024-01-15',hora:'12:30',empleadoId:'EMP005',correo:'carias@comeca.cr',empresa:'CR001',departamento:'Administración',tipoMarca:'Salida',motivo:'Reunión externa',lugar:'Hotel Marriott, Belén',ubicacionConfirmada:true,latitud:'9.9765',longitud:'-84.1874',direccion:'Belén, Heredia',precision:'22m',estado:'OK'},
    {id:'WEB-003',fecha:'2024-01-15',hora:'07:00',empleadoId:'EMP008',correo:'rherrera@comeca.cr',empresa:'CR001',departamento:'Logística',tipoMarca:'Entrada',motivo:'Trabajo en campo',lugar:'Bodega Central, Alajuela',ubicacionConfirmada:true,latitud:'10.0159',longitud:'-84.2142',direccion:'Alajuela, Costa Rica',precision:'15m',estado:'OK'},
    {id:'WEB-004',fecha:'2024-01-15',hora:'09:30',empleadoId:'EMP007',correo:'frojas@comeca.cr',empresa:'CR001',departamento:'Administración',tipoMarca:'Entrada',motivo:'Gestión administrativa externa',lugar:'Municipalidad San José',ubicacionConfirmada:false,latitud:'',longitud:'',direccion:'',precision:'',estado:'En revisión'},
    {id:'WEB-005',fecha:'2024-01-15',hora:'14:00',empleadoId:'EMP014',correo:'dfallas@comeca.cr',empresa:'CR002',departamento:'Operaciones',tipoMarca:'Entrada',motivo:'Entrega de documentos',lugar:'Cliente TecnoSur',ubicacionConfirmada:true,latitud:'9.9281',longitud:'-84.0907',direccion:'San José, Costa Rica',precision:'25m',estado:'OK'},
    {id:'WEB-006',fecha:'2024-01-15',hora:'16:45',empleadoId:'EMP014',correo:'dfallas@comeca.cr',empresa:'CR002',departamento:'Operaciones',tipoMarca:'Salida',motivo:'Visita a cliente',lugar:'Cliente TecnoSur',ubicacionConfirmada:true,latitud:'9.9285',longitud:'-84.0910',direccion:'San José, Costa Rica',precision:'20m',estado:'OK'}
];


var incidencias = [
    {id:'INC001',empleadoId:'EMP001',supervisorId:'SUP001',empresa:'CR001',departamento:'Producción',tipoPlanilla:'Semanal',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'08:28',marcaSalida:'17:00',tipo:'Entrada tarde',horasAdicionales:0,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC002',empleadoId:'EMP001',supervisorId:'SUP001',empresa:'CR001',departamento:'Producción',tipoPlanilla:'Semanal',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'08:00',marcaSalida:'19:00',tipo:'Posible hora extra',horasAdicionales:2,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC003',empleadoId:'EMP004',supervisorId:'SUP001',empresa:'CR001',departamento:'Producción',tipoPlanilla:'Semanal',fecha:'2024-01-13',horarioEsp:'09:00-12:00',marcaEntrada:'09:00',marcaSalida:'14:00',tipo:'Posible hora extra',horasAdicionales:2,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC004',empleadoId:'EMP005',supervisorId:'SUP002',empresa:'CR001',departamento:'Administración',tipoPlanilla:'Mensual',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'08:00',marcaSalida:'18:20',tipo:'Posible hora extra',horasAdicionales:1.33,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC005',empleadoId:'EMP006',supervisorId:'SUP002',empresa:'CR001',departamento:'Administración',tipoPlanilla:'Mensual',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'08:00',marcaSalida:'15:45',tipo:'Salida anticipada',horasAdicionales:0,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC006',empleadoId:'EMP007',supervisorId:'SUP002',empresa:'CR001',departamento:'Administración',tipoPlanilla:'Mensual',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'09:30',marcaSalida:'17:00',tipo:'Entrada tarde',horasAdicionales:0,origen:'Marcación Web',estado:'En revisión',motivo:'',comentario:'Sin ubicación confirmada',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC007',empleadoId:'EMP008',supervisorId:'SUP003',empresa:'CR001',departamento:'Logística',tipoPlanilla:'Semanal',fecha:'2024-01-15',horarioEsp:'06:00-14:00',marcaEntrada:'06:00',marcaSalida:'16:00',tipo:'Posible hora extra',horasAdicionales:2,origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'INC008',empleadoId:'EMP003',supervisorId:'SUP001',empresa:'CR001',departamento:'Producción',tipoPlanilla:'Semanal',fecha:'2024-01-14',horarioEsp:'14:00-22:00',marcaEntrada:'14:00',marcaSalida:'23:00',tipo:'Posible hora extra',horasAdicionales:1,origen:'Kiosco Biométrico',estado:'Aprobada',motivo:'Turno extra autorizado',comentario:'Autorizado por jefatura',fechaResolucion:'2024-01-15',usuarioResolucion:'SUP001'},
    {id:'INC009',empleadoId:'EMP009',supervisorId:'SUP003',empresa:'CR001',departamento:'Logística',tipoPlanilla:'Semanal',fecha:'2024-01-14',horarioEsp:'06:00-14:00',marcaEntrada:'05:30',marcaSalida:'14:00',tipo:'Entrada anticipada',horasAdicionales:0.5,origen:'Kiosco Biométrico',estado:'Aprobada',motivo:'Descarga programada',comentario:'',fechaResolucion:'2024-01-15',usuarioResolucion:'SUP003'},
    {id:'INC010',empleadoId:'EMP007',supervisorId:'SUP002',empresa:'CR001',departamento:'Administración',tipoPlanilla:'Mensual',fecha:'2024-01-13',horarioEsp:'08:00-17:00',marcaEntrada:'10:00',marcaSalida:'17:00',tipo:'Entrada tarde',horasAdicionales:0,origen:'Kiosco Biométrico',estado:'Rechazada',motivo:'Sin justificación',comentario:'Reincidencia',fechaResolucion:'2024-01-14',usuarioResolucion:'SUP002'},
    {id:'INC011',empleadoId:'EMP014',supervisorId:'SUP005',empresa:'CR002',departamento:'Operaciones',tipoPlanilla:'Mensual',fecha:'2024-01-15',horarioEsp:'08:00-17:00',marcaEntrada:'08:00',marcaSalida:'18:00',tipo:'Posible hora extra',horasAdicionales:1,origen:'Marcación Web',estado:'Aprobada',motivo:'Reunión extendida',comentario:'',fechaResolucion:'2024-01-15',usuarioResolucion:'SUP005'},
    {id:'INC012',empleadoId:'EMP015',supervisorId:'SUP005',empresa:'CR002',departamento:'Operaciones',tipoPlanilla:'Mensual',fecha:'2024-01-14',horarioEsp:'08:00-17:00',marcaEntrada:'08:00',marcaSalida:'17:30',tipo:'Posible hora extra',horasAdicionales:0.5,origen:'Kiosco Biométrico',estado:'Aprobada',motivo:'Capacitación',comentario:'',fechaResolucion:'2024-01-14',usuarioResolucion:'SUP005'},
    {id:'INC013',empleadoId:'EMP016',supervisorId:'SUP005',empresa:'CR002',departamento:'Operaciones',tipoPlanilla:'Mensual',fecha:'2024-01-13',horarioEsp:'08:00-17:00',marcaEntrada:'07:45',marcaSalida:'17:00',tipo:'Entrada anticipada',horasAdicionales:0.25,origen:'Kiosco Biométrico',estado:'Aprobada',motivo:'Preparación sala',comentario:'',fechaResolucion:'2024-01-13',usuarioResolucion:'SUP005'}
];

var alertasTempranas = [
    {id:'ALT001',fecha:'2024-01-15',horaDeteccion:'08:28',empleadoId:'EMP001',departamento:'Producción',horarioEsp:'08:00',marcaReal:'08:28',diferencia:'28 min tarde',tipoAlerta:'Entrada tarde',prioridad:'Media',origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'ALT002',fecha:'2024-01-15',horaDeteccion:'09:15',empleadoId:'EMP003',departamento:'Producción',horarioEsp:'14:00',marcaReal:'Sin marca',diferencia:'Sin marca entrada',tipoAlerta:'Falta de marca',prioridad:'Alta',origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'ALT003',fecha:'2024-01-15',horaDeteccion:'15:45',empleadoId:'EMP006',departamento:'Administración',horarioEsp:'17:00',marcaReal:'15:45',diferencia:'1h 15min anticipada',tipoAlerta:'Salida anticipada',prioridad:'Alta',origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'ALT004',fecha:'2024-01-15',horaDeteccion:'18:20',empleadoId:'EMP005',departamento:'Administración',horarioEsp:'17:00',marcaReal:'18:20',diferencia:'1h 20min adicional',tipoAlerta:'Posible hora extra',prioridad:'Media',origen:'Kiosco Biométrico',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'ALT005',fecha:'2024-01-15',horaDeteccion:'09:30',empleadoId:'EMP007',departamento:'Administración',horarioEsp:'08:00',marcaReal:'09:30',diferencia:'Marca sin ubicación',tipoAlerta:'Marca sin ubicación confirmada',prioridad:'Alta',origen:'Marcación Web',estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null},
    {id:'ALT006',fecha:'2024-01-15',horaDeteccion:'07:02',empleadoId:'EMP008',departamento:'Logística',horarioEsp:'Día no laboral',marcaReal:'07:02',diferencia:'Visita fuera horario',tipoAlerta:'Visita fuera de horario',prioridad:'Media',origen:'Marcación Web',estado:'Justificada',motivo:'Actividad fuera de planta',comentario:'Descarga programada sábado',fechaResolucion:'2024-01-15 07:30',usuarioResolucion:'SUP003'}
];
var contadorAlertas = 7;

var documentosCargados = [
    {id:'DOC001',tipoCarga:'Asociada',cedula:'1-1234-0567',empleadoId:'EMP001',empleadoNombre:'Juan Pérez',empresa:'CR001',departamento:'Producción',tipoDocumento:'Permiso',fechaInicio:'2024-01-20',fechaFin:'2024-01-20',motivo:'Cita médica',archivo:'permiso_perez.pdf',estado:'Aprobado',cargadoPor:'SUP001',fechaCarga:'2024-01-15 09:00',incidenciaRelacionada:'',historial:[]},
    {id:'DOC002',tipoCarga:'Asociada',cedula:'1-2345-0678',empleadoId:'EMP002',empleadoNombre:'María López',empresa:'CR001',departamento:'Producción',tipoDocumento:'Vacaciones',fechaInicio:'2024-02-01',fechaFin:'2024-02-07',motivo:'Vacaciones',archivo:'vacaciones_lopez.pdf',estado:'Aprobado',cargadoPor:'SUP001',fechaCarga:'2024-01-10',incidenciaRelacionada:'',historial:[]},
    {id:'DOC003',tipoCarga:'Asociada',cedula:'1-8901-0234',empleadoId:'EMP008',empleadoNombre:'Ricardo Herrera',empresa:'CR001',departamento:'Logística',tipoDocumento:'Incapacidad',fechaInicio:'2024-01-18',fechaFin:'2024-01-22',motivo:'Incapacidad CCSS',archivo:'incapacidad_herrera.pdf',estado:'Pendiente de revisión',cargadoPor:'SUP003',fechaCarga:'2024-01-15',incidenciaRelacionada:'',historial:[]},
    {id:'DOC004',tipoCarga:'General',cedula:'',empleadoId:'',empleadoNombre:'',empresa:'CR001',departamento:'',tipoDocumento:'Comunicado',fechaInicio:'2024-01-15',fechaFin:'2024-01-15',motivo:'Ajuste horario',archivo:'comunicado.pdf',estado:'Pendiente de asociación',cargadoPor:'Administrador Nómina',fechaCarga:'2024-01-15',incidenciaRelacionada:'',historial:[]}
];
var contadorDocs = 5;

var politicasMarcacion = [
    {id:'POL001',empresa:'CR001',toleranciaEntrada:10,toleranciaSalida:15,minSalidaSinExtra:30,jornadaFlexible:false,turnoNocturno:true,requiereUbicacion:true,permiteMarcacionWeb:true,requiereMotivoVisita:true,requiereLugar:true,alertaSinUbicacion:true,alertaFueraHorario:true,estado:'Activa'},
    {id:'POL002',empresa:'CR002',toleranciaEntrada:5,toleranciaSalida:10,minSalidaSinExtra:20,jornadaFlexible:true,turnoNocturno:false,requiereUbicacion:true,permiteMarcacionWeb:true,requiereMotivoVisita:true,requiereLugar:true,alertaSinUbicacion:true,alertaFueraHorario:true,estado:'Activa'}
];

var plantillasHorario = [
    {id:'PLT001',nombre:'Diurna L-V 8:00-17:00',dias:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]}},
    {id:'PLT002',nombre:'Diurna L-S 6:00-14:00',dias:{lun:[{entrada:'06:00',salida:'14:00'}],mar:[{entrada:'06:00',salida:'14:00'}],mie:[{entrada:'06:00',salida:'14:00'}],jue:[{entrada:'06:00',salida:'14:00'}],vie:[{entrada:'06:00',salida:'14:00'}],sab:[{entrada:'06:00',salida:'12:00'}],dom:[]}},
    {id:'PLT003',nombre:'Mixta L-V 14:00-22:00',dias:{lun:[{entrada:'14:00',salida:'22:00'}],mar:[{entrada:'14:00',salida:'22:00'}],mie:[{entrada:'14:00',salida:'22:00'}],jue:[{entrada:'14:00',salida:'22:00'}],vie:[{entrada:'14:00',salida:'22:00'}],sab:[],dom:[]}},
    {id:'PLT004',nombre:'Nocturna L-V 22:00-06:00',dias:{lun:[{entrada:'22:00',salida:'06:00'}],mar:[{entrada:'22:00',salida:'06:00'}],mie:[{entrada:'22:00',salida:'06:00'}],jue:[{entrada:'22:00',salida:'06:00'}],vie:[{entrada:'22:00',salida:'06:00'}],sab:[],dom:[]}},
    {id:'PLT005',nombre:'Fines de Semana 8:00-16:00',dias:{lun:[],mar:[],mie:[],jue:[],vie:[],sab:[{entrada:'08:00',salida:'16:00'}],dom:[{entrada:'08:00',salida:'16:00'}]}}
];

var lotesLegadmi = [];
var recordatorios = [{id:'REC001',supervisorId:'SUP001',fecha:'2024-01-14'}];
var empleadoKioscoActual = null;
var webUsuarioActual = null;


// ===== UTILIDADES =====
function getNombreEmp(id){var e=empleados.find(function(x){return x.id===id;});return e?e.nombre:'Desconocido';}
function getNombreSup(id){var s=supervisores.find(function(x){return x.id===id;});return s?s.nombre:'Sin asignar';}
function getNombreEmpresa(c){var e=empresas.find(function(x){return x.codigo===c;});return e?e.nombre:c;}
function incPendEmpresa(c){return incidencias.filter(function(i){return i.empresa===c&&i.estado==='Pendiente';}).length;}
function showToast(msg,type){var c=document.getElementById('toastContainer'),t=document.createElement('div');t.className='toast toast-'+(type||'info');t.textContent=msg;c.appendChild(t);setTimeout(function(){t.remove();},3500);}
function openModal(html){document.getElementById('modalContent').innerHTML=html;document.getElementById('modalOverlay').classList.add('active');}
function closeModal(){document.getElementById('modalOverlay').classList.remove('active');}
function badge(estado){var m={'Pendiente':'badge-warning','Aprobada':'badge-success','Aprobado':'badge-success','Rechazada':'badge-danger','Rechazado':'badge-danger','OK':'badge-success','Error':'badge-danger','Activo':'badge-success','Activa':'badge-success','Inactivo':'badge-neutral','Completo':'badge-success','Con pendientes':'badge-warning','Justificada':'badge-info','En revisión':'badge-warning','Cargado':'badge-info','Pendiente de revisión':'badge-warning','Pendiente de asociación':'badge-warning','Asociado a empleado':'badge-info','Generado':'badge-info','Enviado':'badge-success','Validado':'badge-success'};return '<span class="badge '+(m[estado]||'badge-neutral')+'">'+estado+'</span>';}
function descargarCSV(datos,nombre){if(!datos||!datos.length){showToast('Sin datos','warning');return;}var h=Object.keys(datos[0]),csv=h.join(',')+'\n';datos.forEach(function(r){csv+=h.map(function(k){return '"'+String(r[k]!=null?r[k]:'').replace(/"/g,'""')+'"';}).join(',')+'\n';});var b=new Blob([csv],{type:'text/csv;charset=utf-8;'}),l=document.createElement('a');l.href=URL.createObjectURL(b);l.download=nombre+'.csv';l.click();showToast('CSV descargado','success');}
function actualizarSupervisores(){supervisores.forEach(function(s){s.incidenciasPendientes=incidencias.filter(function(i){return i.supervisorId===s.id&&i.estado==='Pendiente';}).length;s.empleadosAsignados=empleados.filter(function(e){return e.supervisor===s.id;}).length;});}

// ===== NAVEGACIÓN =====
function initNavigation(){
    document.querySelectorAll('.nav-item').forEach(function(item){
        item.addEventListener('click',function(e){
            e.preventDefault();
            var mod=this.getAttribute('data-module');
            if(permisosPorRol[rolActual].indexOf(mod)===-1)return;
            document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
            this.classList.add('active');
            moduloActual=mod;
            renderModule(mod);
        });
    });
    document.getElementById('btnChangeRole').addEventListener('click',function(){
        var idx=roles.indexOf(rolActual);
        rolActual=roles[(idx+1)%roles.length];
        document.getElementById('currentRole').textContent=rolActual;
        actualizarMenu();
        showToast('Rol: '+rolActual,'info');
    });
    document.getElementById('modalOverlay').addEventListener('click',function(e){if(e.target===this)closeModal();});
    actualizarMenu();
}
function actualizarMenu(){
    var p=permisosPorRol[rolActual];
    document.querySelectorAll('.nav-item').forEach(function(item){
        var mod=item.getAttribute('data-module');
        item.classList.toggle('hidden',p.indexOf(mod)===-1);
    });
    if(p.indexOf(moduloActual)===-1){
        moduloActual=p[0];
        document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
        var first=document.querySelector('[data-module="'+moduloActual+'"]');
        if(first)first.classList.add('active');
        renderModule(moduloActual);
    }
}
function renderModule(mod){
    actualizarSupervisores();
    var c=document.getElementById('mainContent');
    switch(mod){
        case 'dashboard':c.innerHTML=renderDashboard();break;
        case 'fuentes':c.innerHTML=renderFuentes();break;
        case 'empleados':c.innerHTML=renderEmpleados();break;
        case 'biometrico':c.innerHTML=renderBiometrico();break;
        case 'marcacionweb':c.innerHTML=renderMarcacionWeb();break;
        case 'supervisores':c.innerHTML=renderSupervisores();break;
        case 'incidencias':c.innerHTML=renderIncidencias();break;
        case 'seguimiento':c.innerHTML=renderSeguimiento();break;
        case 'cierre':c.innerHTML=renderCierre();break;
        case 'reportes':c.innerHTML=renderReportes();break;
        case 'politicas':c.innerHTML=renderPoliticas();break;
        case 'documentos':c.innerHTML=renderDocumentos();break;
        case 'plantillas':c.innerHTML=renderPlantillas();break;
        default:c.innerHTML='<p>Módulo no encontrado</p>';
    }
}


// ===== DASHBOARD =====
function renderDashboard(){
    var totalEmp=empleados.length,supAct=supervisores.filter(function(s){return s.estado==='Activo';}).length;
    var pend=incidencias.filter(function(i){return i.estado==='Pendiente';}).length;
    var aprob=incidencias.filter(function(i){return i.estado==='Aprobada';}).length;
    var rech=incidencias.filter(function(i){return i.estado==='Rechazada';}).length;
    var emp100=empresas.filter(function(e){return incPendEmpresa(e.codigo)===0;}).length;
    var marcasBio=marcacionesBio.length,marcasWeb=marcacionesWeb.length;
    var visitasWeb=marcacionesWeb.filter(function(m){return m.ubicacionConfirmada;}).length;
    var alertPend=alertasTempranas.filter(function(a){return a.estado==='Pendiente';}).length;

    var html='<div class="kpi-grid">';
    html+='<div class="kpi-card blue"><div class="kpi-value">'+totalEmp+'</div><div class="kpi-label">Total Empleados</div></div>';
    html+='<div class="kpi-card green"><div class="kpi-value">'+supAct+'</div><div class="kpi-label">Supervisores Activos</div></div>';
    html+='<div class="kpi-card yellow"><div class="kpi-value">'+pend+'</div><div class="kpi-label">Incidencias Pendientes</div></div>';
    html+='<div class="kpi-card green"><div class="kpi-value">'+aprob+'</div><div class="kpi-label">Aprobadas</div></div>';
    html+='<div class="kpi-card red"><div class="kpi-value">'+rech+'</div><div class="kpi-label">Rechazadas</div></div>';
    html+='<div class="kpi-card purple"><div class="kpi-value">'+emp100+'/'+empresas.length+'</div><div class="kpi-label">Empresas al 100%</div></div>';
    html+='<div class="kpi-card blue"><div class="kpi-value">'+marcasBio+'</div><div class="kpi-label">Marcas Kiosco Bio.</div></div>';
    html+='<div class="kpi-card green"><div class="kpi-value">'+marcasWeb+'</div><div class="kpi-label">Marcas Web</div></div>';
    html+='<div class="kpi-card"><div class="kpi-value">'+documentosCargados.length+'</div><div class="kpi-label">Documentos</div></div>';
    html+='<div class="kpi-card yellow"><div class="kpi-value">'+alertPend+'</div><div class="kpi-label">Alertas Tempranas</div></div>';
    html+='</div>';

    // Canales
    html+='<div class="section-title">Canales de Marcación Incluidos</div>';
    html+='<div class="charts-grid">';
    html+='<div class="channel-card"><h4>📷 Kiosco Biométrico Any2Cloud</h4><p>Registro presencial mediante reconocimiento facial simulado. Captura de entrada y salida desde pantalla física en empresa.</p></div>';
    html+='<div class="channel-card"><h4>🌎 Marcación Web / Visitas Fuera de Oficina</h4><p>Acceso por correo y contraseña. Confirmación de geolocalización. Registro de entrada o salida desde navegador web.</p></div>';
    html+='</div>';

    // Tabla empresas
    html+='<div class="section-title">Resumen por Empresa</div>';
    html+='<div class="table-container"><table><thead><tr><th>País</th><th>Empresa</th><th>Empleados</th><th>Pendientes</th><th>% Avance</th><th>Estado</th></tr></thead><tbody>';
    empresas.forEach(function(emp){
        var emps=empleados.filter(function(e){return e.empresa===emp.codigo;}).length;
        var p=incPendEmpresa(emp.codigo);
        var t=incidencias.filter(function(i){return i.empresa===emp.codigo;}).length;
        var av=t>0?Math.round(((t-p)/t)*100):100;
        html+='<tr><td>'+emp.pais+'</td><td><strong>'+emp.nombre+'</strong></td><td>'+emps+'</td><td>'+p+'</td><td><div class="d-flex align-center gap-1"><div class="progress-bar"><div class="progress-fill'+(av===100?' complete':'')+'" style="width:'+av+'%"></div></div><small>'+av+'%</small></div></td><td>'+badge(p===0?'Completo':'Con pendientes')+'</td></tr>';
    });
    html+='</tbody></table></div>';
    return html;
}

// ===== FUENTES DE MARCACIÓN =====
function renderFuentes(){
    var html='<div class="section-title">Fuentes de Marcación</div>';
    html+='<div class="tabs-section"><div class="tab-btn active" onclick="showFuentesTab(\'kiosco\')">📷 Kiosco Biométrico</div><div class="tab-btn" onclick="showFuentesTab(\'web\')">🌎 Marcación Web</div></div>';
    html+='<div id="fuentesTab">'+renderFuentesKiosco()+'</div>';
    return html;
}
function showFuentesTab(t){
    document.querySelectorAll('.tabs-section .tab-btn').forEach(function(b,i){b.classList.toggle('active',['kiosco','web'][i]===t);});
    var d=document.getElementById('fuentesTab');
    if(t==='kiosco')d.innerHTML=renderFuentesKiosco();
    else d.innerHTML=renderFuentesWeb();
}
function renderFuentesKiosco(){
    return '<div class="table-container"><table><thead><tr><th>Código</th><th>Empresa</th><th>Ubicación</th><th>Tipo</th><th>Método</th><th>Estado</th><th>Última Sinc.</th><th>Marcas Hoy</th></tr></thead><tbody><tr><td>KIO-001</td><td>Envases COMECA</td><td>Entrada principal planta</td><td>Kiosco</td><td>Reconocimiento facial</td><td>'+badge('Activo')+'</td><td>2024-01-15 17:05</td><td>'+marcacionesBio.length+'</td></tr><tr><td>KIO-002</td><td>Unican</td><td>Recepción oficinas</td><td>Tablet</td><td>Reconocimiento facial</td><td>'+badge('Activo')+'</td><td>2024-01-15 16:50</td><td>6</td></tr></tbody></table></div>';
}
function renderFuentesWeb(){
    var html='<div class="table-container"><table><thead><tr><th>Código</th><th>Fecha</th><th>Hora</th><th>Empleado</th><th>Empresa</th><th>Tipo Marca</th><th>Motivo</th><th>Lugar</th><th>Ubicación</th><th>Estado</th></tr></thead><tbody>';
    marcacionesWeb.forEach(function(m){
        html+='<tr><td>'+m.id+'</td><td>'+m.fecha+'</td><td>'+m.hora+'</td><td>'+getNombreEmp(m.empleadoId)+'</td><td>'+m.empresa+'</td><td>'+m.tipoMarca+'</td><td>'+m.motivo+'</td><td>'+m.lugar+'</td><td>'+(m.ubicacionConfirmada?'<span class="badge badge-success">Confirmada</span>':'<span class="badge badge-warning">No confirmada</span>')+'</td><td>'+badge(m.estado)+'</td></tr>';
    });
    html+='</tbody></table></div>';
    return html;
}

// ===== EMPLEADOS =====
function renderEmpleados(){
    var canEdit=rolActual!=='Supervisor';
    var lista=obtenerEmpleadosVisibles();
    var html='<div class="d-flex justify-between align-center mb-2"><div class="section-title" style="margin-bottom:0">Empleados</div><div class="btn-group">';
    if(canEdit){
        html+='<button class="btn btn-secondary" onclick="renderModule(\'plantillas\')">📋 Plantillas</button>';
        html+='<button class="btn btn-warning" onclick="modalCambioMasivo()">🔄 Cambio masivo plantilla</button>';
        html+='<button class="btn btn-primary" onclick="modalNuevoEmpleado()">+ Nuevo</button>';
    }
    html+='</div></div>';
    html+='<div class="filters-bar"><input type="text" id="fEB" placeholder="Buscar nombre/cédula..." oninput="filtE()">';
    html+='<select id="fED" onchange="filtE()"><option value="">Departamento</option><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option><option>Operaciones</option></select>';
    html+='<select id="fEE" onchange="filtE()"><option value="">Empresa</option>';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select>';
    if(canEdit){
        html+='<select id="fES" onchange="filtE()"><option value="">Supervisor</option>';
        supervisores.forEach(function(s){html+='<option value="'+s.id+'">'+s.nombre+'</option>';});
        html+='</select>';
    }
    html+='<select id="fEst" onchange="filtE()"><option value="">Estado</option><option>Activo</option><option>Inactivo</option></select>';
    html+='</div>';
    html+='<div class="table-container" id="tblEmpC">'+tablaEmpleados(lista)+'</div>';
    return html;
}
function obtenerEmpleadosVisibles(){
    if(rolActual==='Supervisor')return empleados.filter(function(e){return e.supervisor===supervisores[0].id;});
    return empleados;
}
function tablaEmpleados(l){
    var canEdit=rolActual!=='Supervisor';
    var html='<table><thead><tr><th><input type="checkbox" onchange="toggleAllEmp(this)"></th><th>Cédula</th><th>Nombre</th><th>Depto</th><th>Grupo</th><th>Planilla</th><th>Jornada</th><th>Lugar Trabajo</th><th>Empresa</th><th>Biométrico</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    l.forEach(function(e){
        html+='<tr><td><input type="checkbox" class="emp-chk" value="'+e.id+'"></td><td>'+e.cedula+'</td><td>'+e.nombre+'</td><td>'+e.departamento+'</td><td>'+e.grupo+'</td><td>'+e.tipoPlanilla+'</td><td style="font-size:.78rem">'+e.jornada+'</td><td><span class="badge '+(e.lugarTrabajo==='Campo'?'badge-warning':'badge-info')+'">'+(e.lugarTrabajo||'Oficina')+'</span></td><td>'+getNombreEmpresa(e.empresa)+'</td><td>'+(e.biometricoRegistrado?'<span class="badge badge-success">Sí</span>':'<span class="badge badge-neutral">No</span>')+'</td><td>'+badge(e.estado)+'</td><td class="btn-group">';
        if(canEdit)html+='<button class="btn btn-xs btn-outline" onclick="modalEditarEmpleado(\''+e.id+'\')">Editar</button>';
        html+='<button class="btn btn-xs btn-secondary" onclick="verHistEmp(\''+e.id+'\')">Histórico</button></td></tr>';
    });
    html+='</tbody></table>';return html;
}
function toggleAllEmp(el){document.querySelectorAll('.emp-chk').forEach(function(c){c.checked=el.checked;});}
function actualizarUbicGrupo(){
    var gruSel=document.getElementById('edGru').value;
    var grp=grupos.find(function(g){return g.nombre===gruSel;});
    if(grp){
        var lugarEl=document.getElementById('edLugar');if(lugarEl)lugarEl.value=grp.ubicacion;
        var dirEl=document.getElementById('edDir');if(dirEl)dirEl.value=grp.direccion;
    }
}
function filtE(){
    var b=(document.getElementById('fEB').value||'').toLowerCase(),d=document.getElementById('fED').value,emp=document.getElementById('fEE').value;
    var supEl=document.getElementById('fES'),sup=supEl?supEl.value:'';
    var est=document.getElementById('fEst').value;
    var base=obtenerEmpleadosVisibles();
    var f=base.filter(function(e){if(b&&e.nombre.toLowerCase().indexOf(b)===-1&&e.cedula.indexOf(b)===-1)return false;if(d&&e.departamento!==d)return false;if(emp&&e.empresa!==emp)return false;if(sup&&e.supervisor!==sup)return false;if(est&&e.estado!==est)return false;return true;});
    document.getElementById('tblEmpC').innerHTML=tablaEmpleados(f);
}
function modalNuevoEmpleado(){
    var html='<div class="modal-header"><h3>Nuevo Empleado</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarNuevoEmp(event)"><div class="form-row"><div class="form-group"><label>Cédula</label><input type="text" id="neCed" required placeholder="X-XXXX-XXXX"></div><div class="form-group"><label>Nombre completo</label><input type="text" id="neNom" required></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Departamento</label><select id="neDep"><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option><option>Operaciones</option></select></div><div class="form-group"><label>Tipo Planilla</label><select id="nePlan"><option>Semanal</option><option>Quincenal</option><option>Mensual</option></select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Empresa</label><select id="neEmp">';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div><div class="form-group"><label>Supervisor</label><select id="neSup">';
    supervisores.forEach(function(s){html+='<option value="'+s.id+'">'+s.nombre+'</option>';});
    html+='</select></div></div>';
    html+='<div class="form-group"><label>Jornada</label><input type="text" id="neJor" value="L-V 08:00-17:00"></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div></form>';
    openModal(html);
}
function guardarNuevoEmp(ev){
    ev.preventDefault();
    var id='EMP'+String(empleados.length+1).padStart(3,'0');
    empleados.push({id:id,cedula:document.getElementById('neCed').value,nombre:document.getElementById('neNom').value,departamento:document.getElementById('neDep').value,grupo:'Grupo A',tipoPlanilla:document.getElementById('nePlan').value,jornada:document.getElementById('neJor').value,horario:{lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]},empresa:document.getElementById('neEmp').value,supervisor:document.getElementById('neSup').value,estado:'Activo',correo:'nuevo@comeca.cr',clave:'123456',biometricoRegistrado:false,permiteWeb:true});
    closeModal();showToast('Empleado creado','success');renderModule('empleados');
}
function modalEditarEmpleado(id){
    var emp=empleados.find(function(e){return e.id===id;});if(!emp)return;
    var dias=['lun','mar','mie','jue','vie','sab','dom'];
    var diasNombres=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    var horario=emp.horario||{lun:[],mar:[],mie:[],jue:[],vie:[],sab:[],dom:[]};
    var html='<div class="modal-header"><h3>Editar - '+emp.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarEditEmp(event,\''+id+'\')">';
    html+='<div class="form-group"><label>Aplicar Plantilla de Horario</label><select id="selPlt" onchange="aplicarPlt(\''+id+'\',this.value)"><option value="">— Seleccionar plantilla —</option>';
    plantillasHorario.forEach(function(p){html+='<option value="'+p.id+'">'+p.nombre+'</option>';});
    html+='</select></div>';
    html+='<div class="form-row"><div class="form-group"><label>Departamento</label><select id="edDep">';
    ['Producción','Administración','Logística','Mantenimiento','Operaciones'].forEach(function(d){html+='<option'+(d===emp.departamento?' selected':'')+'>'+d+'</option>';});
    html+='</select></div><div class="form-group"><label>Tipo Planilla</label><select id="edPlan">';
    ['Semanal','Quincenal','Mensual'].forEach(function(t){html+='<option'+(t===emp.tipoPlanilla?' selected':'')+'>'+t+'</option>';});
    html+='</select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Supervisor</label><select id="edSup">';
    supervisores.forEach(function(s){html+='<option value="'+s.id+'"'+(s.id===emp.supervisor?' selected':'')+'>'+s.nombre+'</option>';});
    html+='</select></div><div class="form-group"><label>Grupo</label><select id="edGru" onchange="actualizarUbicGrupo()">';
    ['Grupo A','Grupo B','Grupo C'].forEach(function(g){html+='<option'+(g===emp.grupo?' selected':'')+'>'+g+'</option>';});
    html+='</select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Lugar de Trabajo</label><select id="edLugar"><option'+(emp.lugarTrabajo==='Oficina'?' selected':'')+'>Oficina</option><option'+(emp.lugarTrabajo==='Campo'?' selected':'')+'>Campo</option></select></div><div class="form-group"><label>Dirección / Coordenada</label><input type="text" id="edDir" value="'+(emp.direccionTrabajo||'')+'"></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Tipo de Jornada</label><select id="edJorTipo">';
    ['Diurna','Mixta','Nocturna','Rotativa'].forEach(function(j){html+='<option'+(emp.jornada.indexOf(j)>-1||j===emp.jornada?' selected':'')+'>'+j+'</option>';});
    html+='</select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Descripción Jornada</label><input type="text" id="edJor" value="'+emp.jornada+'"></div><div class="form-group"><label>Estado</label><select id="edEst"><option'+(emp.estado==='Activo'?' selected':'')+'>Activo</option><option'+(emp.estado==='Inactivo'?' selected':'')+'>Inactivo</option></select></div></div>';
    // Horario por día multi-turno
    html+='<hr class="section-divider"><div class="section-title" style="font-size:.95rem">Horario por Día (Multi-turno)</div>';
    html+='<p class="text-muted mb-1" style="font-size:.78rem">Configure turnos por día. Use + para agregar turnos adicionales.</p>';
    dias.forEach(function(dia,idx){
        var turnos=horario[dia]||[];
        html+='<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid #f0f0f0">';
        html+='<div style="min-width:36px;font-weight:600;font-size:.82rem;padding-top:6px">'+diasNombres[idx]+'</div>';
        html+='<div style="flex:1">';
        if(turnos.length===0){html+='<span class="text-muted" style="font-size:.8rem">Día libre</span>';}
        turnos.forEach(function(t,ti){
            html+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
            html+='<input type="time" id="ent_'+dia+'_'+ti+'" value="'+t.entrada+'" style="padding:4px 6px;border:1px solid #dee2e6;border-radius:4px;font-size:.82rem">';
            html+='<span>-</span>';
            html+='<input type="time" id="sal_'+dia+'_'+ti+'" value="'+t.salida+'" style="padding:4px 6px;border:1px solid #dee2e6;border-radius:4px;font-size:.82rem">';
            html+='<button type="button" class="btn btn-xs btn-danger" onclick="rmTurno(\''+dia+'\','+ti+',\''+id+'\')">✕</button>';
            html+='</div>';
        });
        html+='</div>';
        html+='<button type="button" class="btn btn-xs btn-outline" onclick="addTurno(\''+dia+'\',\''+id+'\')">+</button>';
        html+='</div>';
    });
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar Cambios</button></div></form>';
    openModal(html);
}
function addTurno(dia,empId){
    var emp=empleados.find(function(e){return e.id===empId;});
    if(!emp.horario[dia])emp.horario[dia]=[];
    emp.horario[dia].push({entrada:'08:00',salida:'17:00'});
    modalEditarEmpleado(empId);
}
function rmTurno(dia,idx,empId){
    var emp=empleados.find(function(e){return e.id===empId;});
    emp.horario[dia].splice(idx,1);
    modalEditarEmpleado(empId);
}
function aplicarPlt(empId,pltId){
    if(!pltId)return;var plt=plantillasHorario.find(function(p){return p.id===pltId;});if(!plt)return;
    var emp=empleados.find(function(e){return e.id===empId;});if(!emp)return;
    var nd={};['lun','mar','mie','jue','vie','sab','dom'].forEach(function(d){nd[d]=plt.dias[d].map(function(t){return{entrada:t.entrada,salida:t.salida};});});
    emp.horario=nd;showToast('Plantilla "'+plt.nombre+'" aplicada','success');modalEditarEmpleado(empId);
}
function guardarEditEmp(ev,id){
    ev.preventDefault();var emp=empleados.find(function(e){return e.id===id;});
    emp.departamento=document.getElementById('edDep').value;emp.tipoPlanilla=document.getElementById('edPlan').value;
    emp.supervisor=document.getElementById('edSup').value;emp.grupo=document.getElementById('edGru').value;
    emp.lugarTrabajo=document.getElementById('edLugar').value;emp.direccionTrabajo=document.getElementById('edDir').value;
    emp.jornada=document.getElementById('edJor').value;
    emp.estado=document.getElementById('edEst').value;
    // Guardar horarios desde inputs
    var dias=['lun','mar','mie','jue','vie','sab','dom'];
    var nuevoH={};
    dias.forEach(function(dia){
        nuevoH[dia]=[];var ti=0;
        while(true){var entI=document.getElementById('ent_'+dia+'_'+ti);var salI=document.getElementById('sal_'+dia+'_'+ti);if(!entI||!salI)break;nuevoH[dia].push({entrada:entI.value,salida:salI.value});ti++;}
    });
    emp.horario=nuevoH;
    closeModal();showToast('Empleado actualizado','success');renderModule('empleados');
}
function modalCambioMasivo(){
    var chks=document.querySelectorAll('.emp-chk:checked');
    if(!chks.length){showToast('Seleccione empleados con los checkboxes','warning');return;}
    var html='<div class="modal-header"><h3>Cambio Masivo de Plantilla</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<p>Se aplicará a <strong>'+chks.length+' empleado(s)</strong> seleccionados.</p>';
    html+='<div class="form-group"><label>Plantilla</label><select id="pltMas">';
    plantillasHorario.forEach(function(p){html+='<option value="'+p.id+'">'+p.nombre+'</option>';});
    html+='</select></div>';
    html+='<div class="d-flex justify-between mt-2"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmarCambioMasivo()">Aplicar</button></div>';
    openModal(html);
}
function confirmarCambioMasivo(){
    var pltId=document.getElementById('pltMas').value;
    var plt=plantillasHorario.find(function(p){return p.id===pltId;});if(!plt)return;
    var chks=document.querySelectorAll('.emp-chk:checked'),c=0;
    chks.forEach(function(ch){var emp=empleados.find(function(e){return e.id===ch.value;});if(emp){var nd={};['lun','mar','mie','jue','vie','sab','dom'].forEach(function(d){nd[d]=plt.dias[d].map(function(t){return{entrada:t.entrada,salida:t.salida};});});emp.horario=nd;c++;}});
    closeModal();showToast('Plantilla aplicada a '+c+' empleados','success');renderModule('empleados');
}
function verHistEmp(id){
    var e=empleados.find(function(x){return x.id===id;});if(!e)return;
    var incs=incidencias.filter(function(i){return i.empleadoId===id;});
    var bio=marcacionesBio.filter(function(m){return m.cedula===e.cedula;});
    var web=marcacionesWeb.filter(function(m){return m.empleadoId===id;});
    var docs=documentosCargados.filter(function(d){return d.empleadoId===id;});
    var html='<div class="modal-header"><h3>Histórico - '+e.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="detail-grid"><div class="detail-item"><label>Cédula</label><span>'+e.cedula+'</span></div><div class="detail-item"><label>Departamento</label><span>'+e.departamento+'</span></div><div class="detail-item"><label>Grupo</label><span>'+e.grupo+'</span></div><div class="detail-item"><label>Jornada</label><span>'+e.jornada+'</span></div><div class="detail-item"><label>Planilla</label><span>'+e.tipoPlanilla+'</span></div><div class="detail-item"><label>Lugar Trabajo</label><span>'+(e.lugarTrabajo||'Oficina')+' — '+(e.direccionTrabajo||'')+'</span></div><div class="detail-item"><label>Biométrico</label><span>'+(e.biometricoRegistrado?'Registrado':'No')+'</span></div><div class="detail-item"><label>Supervisor</label><span>'+getNombreSup(e.supervisor)+'</span></div></div>';
    if(bio.length>0){html+='<div class="section-title mt-2">Marcaciones Kiosco ('+bio.length+')</div><table><thead><tr><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Coincidencia</th></tr></thead><tbody>';bio.forEach(function(m){html+='<tr><td>'+m.fecha+'</td><td>'+m.hora+'</td><td>'+m.tipoMarca+'</td><td>'+m.coincidencia+'</td></tr>';});html+='</tbody></table>';}
    if(web.length>0){html+='<div class="section-title mt-2">Marcaciones Web ('+web.length+')</div><table><thead><tr><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Motivo</th><th>Ubicación</th></tr></thead><tbody>';web.forEach(function(m){html+='<tr><td>'+m.fecha+'</td><td>'+m.hora+'</td><td>'+m.tipoMarca+'</td><td>'+m.motivo+'</td><td>'+(m.ubicacionConfirmada?'✓':'✗')+'</td></tr>';});html+='</tbody></table>';}
    if(incs.length>0){html+='<div class="section-title mt-2">Incidencias ('+incs.length+')</div><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Origen</th><th>Estado</th><th>Motivo</th></tr></thead><tbody>';incs.forEach(function(i){html+='<tr><td>'+i.fecha+'</td><td>'+i.tipo+'</td><td>'+i.origen+'</td><td>'+badge(i.estado)+'</td><td>'+(i.motivo||'—')+'</td></tr>';});html+='</tbody></table>';}
    if(docs.length>0){html+='<div class="section-title mt-2">Documentos ('+docs.length+')</div><table><thead><tr><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Cargado por</th></tr></thead><tbody>';docs.forEach(function(d){html+='<tr><td>'+d.tipoDocumento+'</td><td>'+d.fechaInicio+'</td><td>'+badge(d.estado)+'</td><td>'+d.cargadoPor+'</td></tr>';});html+='</tbody></table>';}
    openModal(html);
}


// ===== BIOMÉTRICO / KIOSCO =====
function renderBiometrico(){
    var html='<div class="section-title">Biométrico / Kiosco Any2Cloud</div>';
    html+='<div class="bio-grid">';
    // Registro
    html+='<div class="bio-card"><div class="bio-title">📸 Registro Facial del Empleado</div>';
    html+='<div class="form-row"><div class="form-group"><label>Cédula del empleado</label><input type="text" id="bioCed" placeholder="Ej: 1-1234-0567"></div><div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="bioBuscar()">Buscar</button></div></div>';
    html+='<div id="bioRes"></div></div>';
    // Kiosco
    html+='<div><div class="kiosco-panel"><h2>🖥️ Kiosco de Marcación</h2><p>Colóquese frente a la cámara</p>';
    html+='<div class="camera-placeholder" id="bioCam">📷 Cámara simulada</div>';
    html+='<div class="kiosco-status waiting" id="bioStatus">⏳ Esperando rostro</div>';
    html+='<div id="bioMsg"></div>';
    html+='<div style="margin-top:10px"><label style="color:rgba(255,255,255,.8);font-size:.8rem"><input type="checkbox" id="bioAuto" checked> Modo automático</label></div>';
    html+='<div class="btn-group" style="justify-content:center;margin-top:12px">';
    html+='<button class="btn btn-primary" onclick="bioDemo()">Demo Reconocimiento</button>';
    html+='<button class="btn btn-success" id="btnBioEnt" onclick="bioMarcar(\'Entrada\')" disabled>Marcar Entrada</button>';
    html+='<button class="btn btn-warning" id="btnBioSal" onclick="bioMarcar(\'Salida\')" disabled>Marcar Salida</button>';
    html+='</div></div></div></div>';
    // Historial
    html+='<div class="section-title mt-2">Historial de Marcaciones Biométricas</div>';
    html+='<div class="filters-bar"><input type="text" id="fBioC" placeholder="Cédula..." oninput="filtBio()"><select id="fBioT" onchange="filtBio()"><option value="">Tipo</option><option>Entrada</option><option>Salida</option></select><button class="btn btn-sm btn-success" onclick="descargarCSV(marcacionesBio,\'marcaciones_biometricas\')">Exportar CSV</button></div>';
    html+='<div class="table-container" id="tblBioC">'+tablaBio(marcacionesBio)+'</div>';
    html+='<div class="bio-disclaimer">⚠️ Este módulo corresponde a una simulación para fines demostrativos. En una implementación productiva, el uso de reconocimiento facial requiere validación legal, consentimiento del colaborador, políticas de privacidad, hardware certificado y almacenamiento seguro.</div>';
    return html;
}
function tablaBio(l){
    var html='<table><thead><tr><th>Código</th><th>Fecha</th><th>Hora</th><th>Cédula</th><th>Empleado</th><th>Empresa</th><th>Tipo</th><th>Coincidencia</th><th>Estado</th></tr></thead><tbody>';
    l.forEach(function(m){html+='<tr><td>'+m.id+'</td><td>'+m.fecha+'</td><td>'+m.hora+'</td><td>'+m.cedula+'</td><td>'+m.empleado+'</td><td>'+m.empresa+'</td><td>'+m.tipoMarca+'</td><td><span class="match-badge high">'+m.coincidencia+'</span></td><td>'+badge(m.estado)+'</td></tr>';});
    if(!l.length)html+='<tr><td colspan="9" class="text-muted" style="text-align:center">Sin marcaciones</td></tr>';
    html+='</tbody></table>';return html;
}
function filtBio(){
    var c=(document.getElementById('fBioC').value||'').toLowerCase(),t=document.getElementById('fBioT').value;
    var f=marcacionesBio.filter(function(m){if(c&&m.cedula.toLowerCase().indexOf(c)===-1)return false;if(t&&m.tipoMarca!==t)return false;return true;});
    document.getElementById('tblBioC').innerHTML=tablaBio(f);
}
function bioBuscar(){
    var ced=document.getElementById('bioCed').value.trim();if(!ced){showToast('Ingrese cédula','warning');return;}
    var emp=empleados.find(function(e){return e.cedula===ced;});
    var c=document.getElementById('bioRes');
    if(!emp){c.innerHTML='<div class="mt-1" style="background:#f8d7da;padding:8px;border-radius:6px;color:#721c24">Empleado no encontrado</div>';return;}
    var html='<div class="detail-grid mt-1"><div class="detail-item"><label>Nombre</label><span>'+emp.nombre+'</span></div><div class="detail-item"><label>Empresa</label><span>'+getNombreEmpresa(emp.empresa)+'</span></div><div class="detail-item"><label>Departamento</label><span>'+emp.departamento+'</span></div><div class="detail-item"><label>Biométrico</label><span>'+(emp.biometricoRegistrado?'<span class="badge badge-success">Registrado</span>':'<span class="badge badge-warning">No registrado</span>')+'</span></div></div>';
    html+='<div class="btn-group mt-1"><button class="btn btn-sm btn-outline" onclick="showToast(\'Cámara simulada activada\',\'info\')">📷 Activar cámara</button><button class="btn btn-sm btn-primary" onclick="showToast(\'Foto capturada (simulación)\',\'success\')">📸 Tomar foto</button><button class="btn btn-sm btn-success" onclick="bioConfirmar(\''+emp.id+'\')">✓ Confirmar</button><button class="btn btn-sm btn-warning" onclick="bioGuardar(\''+emp.id+'\')">💾 Guardar registro</button></div>';
    c.innerHTML=html;
}
function bioConfirmar(id){var co=(95+Math.random()*4.5).toFixed(1);showToast(co+'% coincidencia facial confirmada','success');}
function bioGuardar(id){
    var emp=empleados.find(function(e){return e.id===id;});if(!emp)return;
    emp.biometricoRegistrado=true;showToast('Registro biométrico guardado para '+emp.nombre,'success');bioBuscar();
}
function bioDemo(){
    var st=document.getElementById('bioStatus'),msg=document.getElementById('bioMsg'),cam=document.getElementById('bioCam');
    st.className='kiosco-status detected';st.innerHTML='👁️ Rostro detectado';cam.className='camera-placeholder active';cam.innerHTML='👤 Rostro detectado';msg.innerHTML='';
    setTimeout(function(){st.className='kiosco-status validating';st.innerHTML='🔄 Validando identidad...';},1000);
    setTimeout(function(){
        st.className='kiosco-status confirmed';st.innerHTML='✓ Identidad confirmada';
        empleadoKioscoActual={cedula:'1-1234-0567',nombre:'Juan Pérez',empresa:'CR001',departamento:'Producción',coincidencia:'98.4%'};
        msg.innerHTML='<div class="detail-grid" style="text-align:left;color:#fff;margin-top:8px"><div class="detail-item"><label style="color:rgba(255,255,255,.7)">Nombre</label><span>'+empleadoKioscoActual.nombre+'</span></div><div class="detail-item"><label style="color:rgba(255,255,255,.7)">Cédula</label><span>'+empleadoKioscoActual.cedula+'</span></div><div class="detail-item"><label style="color:rgba(255,255,255,.7)">Coincidencia</label><span class="match-badge high">'+empleadoKioscoActual.coincidencia+'</span></div></div>';
        var auto=document.getElementById('bioAuto').checked;
        if(auto){
            var ultimaMarca=marcacionesBio.filter(function(m){return m.cedula===empleadoKioscoActual.cedula&&m.fecha==='2024-01-15';});
            var tipoAuto=ultimaMarca.length%2===0?'Entrada':'Salida';
            setTimeout(function(){bioMarcar(tipoAuto);},800);
        } else {
            document.getElementById('btnBioEnt').disabled=false;document.getElementById('btnBioSal').disabled=false;
        }
    },2000);
}
function bioMarcar(tipo){
    if(!empleadoKioscoActual){showToast('Ejecute demo primero','warning');return;}
    var hora=new Date().toTimeString().slice(0,5);
    marcacionesBio.unshift({id:'BIO-'+String(marcacionesBio.length+1).padStart(3,'0'),fecha:'2024-01-15',hora:hora,cedula:empleadoKioscoActual.cedula,empleado:empleadoKioscoActual.nombre,empresa:empleadoKioscoActual.empresa,departamento:empleadoKioscoActual.departamento,tipoMarca:tipo,origen:'Kiosco Biométrico Any2Cloud',metodo:'Reconocimiento facial',coincidencia:empleadoKioscoActual.coincidencia,estado:'OK'});
    var msg=document.getElementById('bioMsg');
    if(tipo==='Entrada')msg.innerHTML='<div class="kiosco-message welcome">Bienvenido/a '+empleadoKioscoActual.nombre+'<br>Hora de ingreso: '+hora+'</div>';
    else msg.innerHTML='<div class="kiosco-message goodbye">Hasta luego '+empleadoKioscoActual.nombre+'<br>Hora de salida: '+hora+'</div>';
    showToast(tipo+' registrada: '+empleadoKioscoActual.nombre,'success');
    var tbl=document.getElementById('tblBioC');if(tbl)tbl.innerHTML=tablaBio(marcacionesBio);
}

// ===== MARCACIÓN WEB / VISITAS =====
function renderMarcacionWeb(){
    var html='<div class="section-title">Marcación Web / Visitas Fuera de Oficina</div>';
    if(!webUsuarioActual){
        // Login
        html+='<div class="web-login"><h3>🌎 MarcaControl</h3><p>Marcación Web</p>';
        html+='<div class="form-group"><label>Correo electrónico</label><input type="email" id="webCorreo" placeholder="empleado@comeca.cr" value="carias@comeca.cr"></div>';
        html+='<div class="form-group"><label>Contraseña</label><input type="password" id="webClave" value="123456"></div>';
        html+='<button class="btn btn-primary w-100" onclick="webLogin()">Iniciar sesión</button></div>';
    } else {
        html+=renderWebMarcacion();
    }
    // Historial
    html+='<div class="section-title mt-3">Historial de Marcaciones Web</div>';
    html+='<div class="table-container"><table><thead><tr><th>Código</th><th>Fecha</th><th>Hora</th><th>Empleado</th><th>Tipo</th><th>Motivo</th><th>Lugar</th><th>Ubicación</th><th>Estado</th></tr></thead><tbody>';
    marcacionesWeb.forEach(function(m){html+='<tr><td>'+m.id+'</td><td>'+m.fecha+'</td><td>'+m.hora+'</td><td>'+getNombreEmp(m.empleadoId)+'</td><td>'+m.tipoMarca+'</td><td>'+m.motivo+'</td><td>'+m.lugar+'</td><td>'+(m.ubicacionConfirmada?'<span class="badge badge-success">✓</span>':'<span class="badge badge-warning">✗</span>')+'</td><td>'+badge(m.estado)+'</td></tr>';});
    html+='</tbody></table></div>';
    return html;
}
function webLogin(){
    var correo=document.getElementById('webCorreo').value,clave=document.getElementById('webClave').value;
    var emp=empleados.find(function(e){return e.correo===correo&&e.clave===clave;});
    if(!emp){showToast('Correo o contraseña incorrectos','error');return;}
    webUsuarioActual=emp;showToast('Sesión iniciada: '+emp.nombre,'success');renderModule('marcacionweb');
}
function renderWebMarcacion(){
    var emp=webUsuarioActual;
    var html='<div class="bio-card"><div class="bio-title">👤 '+emp.nombre+'</div>';
    html+='<div class="detail-grid"><div class="detail-item"><label>Cédula</label><span>'+emp.cedula+'</span></div><div class="detail-item"><label>Empresa</label><span>'+getNombreEmpresa(emp.empresa)+'</span></div><div class="detail-item"><label>Departamento</label><span>'+emp.departamento+'</span></div><div class="detail-item"><label>Supervisor</label><span>'+getNombreSup(emp.supervisor)+'</span></div></div>';
    html+='<button class="btn btn-sm btn-secondary" onclick="webUsuarioActual=null;renderModule(\'marcacionweb\')">Cerrar sesión</button></div>';
    // Ubicación
    html+='<div class="bio-card"><div class="bio-title">📍 Confirmar Ubicación</div>';
    html+='<div id="webGeoStatus" class="geo-card pending">📍 Pendiente de confirmación</div>';
    html+='<button class="btn btn-primary" onclick="webConfirmarUbicacion()">Confirmar ubicación actual</button>';
    html+='<div id="webGeoData"></div></div>';
    // Formulario marca
    html+='<div class="bio-card" id="webFormMarca" style="display:none"><div class="bio-title">📝 Registrar Marcación</div>';
    html+='<div class="form-row"><div class="form-group"><label>Tipo de marca</label><select id="webTipoMarca"><option>Entrada</option><option>Salida</option></select></div><div class="form-group"><label>Motivo de visita</label><select id="webMotivo"><option>Visita a cliente</option><option>Reunión externa</option><option>Trabajo en campo</option><option>Gestión administrativa externa</option><option>Entrega / recepción documentos</option><option>Otro</option></select></div></div>';
    html+='<div class="form-group"><label>Cliente / lugar visitado</label><input type="text" id="webLugar" placeholder="Nombre del lugar..."></div>';
    html+='<div class="form-group"><label>Comentario</label><textarea id="webComentario" placeholder="Opcional..."></textarea></div>';
    html+='<button class="btn btn-success" onclick="webRegistrarMarca()">Registrar marcación</button></div>';
    return html;
}
function webConfirmarUbicacion(){
    var geo=document.getElementById('webGeoStatus');
    geo.className='geo-card';geo.innerHTML='✓ Ubicación confirmada';
    document.getElementById('webGeoData').innerHTML='<div class="detail-grid mt-1"><div class="detail-item"><label>Latitud</label><span>9.9281</span></div><div class="detail-item"><label>Longitud</label><span>-84.0907</span></div><div class="detail-item"><label>Dirección</label><span>San José, Costa Rica</span></div><div class="detail-item"><label>Precisión</label><span>25 metros</span></div></div><div class="map-placeholder">📍 Ubicación confirmada en mapa</div>';
    document.getElementById('webFormMarca').style.display='block';
    showToast('Ubicación confirmada','success');
}
function webRegistrarMarca(){
    var lugar=document.getElementById('webLugar').value;
    if(!lugar){showToast('Indique el lugar visitado','warning');return;}
    var emp=webUsuarioActual,hora=new Date().toTimeString().slice(0,5),tipo=document.getElementById('webTipoMarca').value;
    marcacionesWeb.unshift({id:'WEB-'+String(marcacionesWeb.length+1).padStart(3,'0'),fecha:'2024-01-15',hora:hora,empleadoId:emp.id,correo:emp.correo,empresa:emp.empresa,departamento:emp.departamento,tipoMarca:tipo,motivo:document.getElementById('webMotivo').value,lugar:lugar,ubicacionConfirmada:true,latitud:'9.9281',longitud:'-84.0907',direccion:'San José, Costa Rica',precision:'25m',estado:'OK'});
    if(tipo==='Entrada')showToast('Bienvenido/a '+emp.nombre+', hora de ingreso: '+hora+'. Ubicación confirmada.','success');
    else showToast('Hasta luego '+emp.nombre+', hora de salida: '+hora+'. Ubicación confirmada.','success');
    renderModule('marcacionweb');
}

// ===== SUPERVISORES =====
function renderSupervisores(){
    var html='<div class="d-flex justify-between align-center mb-2"><div class="section-title" style="margin-bottom:0">Supervisores</div><div class="btn-group"><button class="btn btn-primary" onclick="modalNuevoSup()">+ Nuevo Supervisor</button><button class="btn btn-secondary" onclick="descargarPlantillaAsig()">📥 Plantilla Asignación</button></div></div>';
    html+='<div class="table-container"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Empresa</th><th>Depto</th><th>Grupo</th><th>Empleados</th><th>Pendientes</th><th>Tiempo Resp.</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    supervisores.forEach(function(s){
        html+='<tr><td><strong>'+s.nombre+'</strong></td><td>'+s.correo+'</td><td>'+getNombreEmpresa(s.empresa)+'</td><td>'+s.departamento+'</td><td>'+s.grupo+'</td><td>'+s.empleadosAsignados+'</td><td>'+(s.incidenciasPendientes>0?'<span class="badge badge-warning">'+s.incidenciasPendientes+'</span>':'<span class="badge badge-success">0</span>')+'</td><td>'+s.tiempoPromedio+'</td><td>'+badge(s.estado)+'</td><td class="btn-group"><button class="btn btn-xs btn-outline" onclick="verEmpSup(\''+s.id+'\')">Ver</button><button class="btn btn-xs btn-primary" onclick="asignarSup(\''+s.id+'\')">Asignar</button><button class="btn btn-xs btn-secondary" onclick="editarSup(\''+s.id+'\')">Editar</button></td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function modalNuevoSup(){
    var html='<div class="modal-header"><h3>Nuevo Supervisor</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarNuevoSup(event)"><div class="form-row"><div class="form-group"><label>Nombre</label><input type="text" id="nsNom" required></div><div class="form-group"><label>Correo</label><input type="email" id="nsCor" required></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Empresa</label><select id="nsEmp">';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div><div class="form-group"><label>Departamento</label><select id="nsDep"><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option><option>Operaciones</option></select></div></div>';
    html+='<div class="form-group"><label>Grupo</label><select id="nsGru"><option>Grupo A</option><option>Grupo B</option><option>Grupo C</option></select></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Crear</button></div></form>';
    openModal(html);
}
function guardarNuevoSup(ev){
    ev.preventDefault();
    supervisores.push({id:'SUP'+String(supervisores.length+1).padStart(3,'0'),nombre:document.getElementById('nsNom').value,correo:document.getElementById('nsCor').value,departamento:document.getElementById('nsDep').value,grupo:document.getElementById('nsGru').value,empresa:document.getElementById('nsEmp').value,empleadosAsignados:0,tiempoPromedio:'0 días',incidenciasPendientes:0,estado:'Activo'});
    closeModal();showToast('Supervisor creado','success');renderModule('supervisores');
}
function editarSup(id){
    var s=supervisores.find(function(x){return x.id===id;});
    var html='<div class="modal-header"><h3>Editar - '+s.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarEditSup(event,\''+id+'\')"><div class="form-row"><div class="form-group"><label>Nombre</label><input type="text" id="esNom" value="'+s.nombre+'" required></div><div class="form-group"><label>Correo</label><input type="email" id="esCor" value="'+s.correo+'" required></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Departamento</label><select id="esDep">';
    ['Producción','Administración','Logística','Mantenimiento','Operaciones'].forEach(function(d){html+='<option'+(d===s.departamento?' selected':'')+'>'+d+'</option>';});
    html+='</select></div><div class="form-group"><label>Estado</label><select id="esEst"><option'+(s.estado==='Activo'?' selected':'')+'>Activo</option><option'+(s.estado==='Inactivo'?' selected':'')+'>Inactivo</option></select></div></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div></form>';
    openModal(html);
}
function guardarEditSup(ev,id){
    ev.preventDefault();var s=supervisores.find(function(x){return x.id===id;});
    s.nombre=document.getElementById('esNom').value;s.correo=document.getElementById('esCor').value;
    s.departamento=document.getElementById('esDep').value;s.estado=document.getElementById('esEst').value;
    closeModal();showToast('Supervisor actualizado','success');renderModule('supervisores');
}
function descargarPlantillaAsig(){
    descargarCSV([{cedula_empleado:'1-1234-0567',cedula_supervisor:'SUP001',empresa:'CR001',departamento:'Producción',grupo:'Grupo A',tipo_planilla:'Semanal'}],'plantilla_asignacion');
}
function verEmpSup(id){
    var s=supervisores.find(function(x){return x.id===id;}),emps=empleados.filter(function(e){return e.supervisor===id;});
    var html='<div class="modal-header"><h3>Empleados de '+s.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<p class="text-muted mb-2">'+emps.length+' empleados asignados</p>';
    html+='<table><thead><tr><th>Cédula</th><th>Nombre</th><th>Depto</th><th>Jornada</th><th>Biométrico</th><th>Estado</th></tr></thead><tbody>';
    emps.forEach(function(e){html+='<tr><td>'+e.cedula+'</td><td>'+e.nombre+'</td><td>'+e.departamento+'</td><td>'+e.jornada+'</td><td>'+(e.biometricoRegistrado?'✓':'✗')+'</td><td>'+badge(e.estado)+'</td></tr>';});
    if(!emps.length)html+='<tr><td colspan="6" class="text-muted">Sin asignados</td></tr>';
    html+='</tbody></table>';openModal(html);
}
function asignarSup(id){
    var s=supervisores.find(function(x){return x.id===id;}),disp=empleados.filter(function(e){return e.supervisor!==id&&e.estado==='Activo';}),asig=empleados.filter(function(e){return e.supervisor===id;});
    var html='<div class="modal-header"><h3>Asignar Empleados a '+s.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    // Quick assign
    html+='<div style="background:#e8f4fd;border:1px solid #b8daff;border-radius:8px;padding:12px;margin-bottom:12px"><strong style="color:#004085">Asignación Rápida</strong><div class="form-row mt-1"><div class="form-group"><label>Empresa</label><select id="qaE"><option value="">Todas</option>';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div><div class="form-group"><label>Depto</label><select id="qaD"><option value="">Todos</option><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option><option>Operaciones</option></select></div><div class="form-group"><label>Grupo</label><select id="qaG"><option value="">Todos</option><option>Grupo A</option><option>Grupo B</option><option>Grupo C</option></select></div></div><button class="btn btn-sm btn-success" onclick="quickAssign(\''+id+'\')">Asignar todo el filtro</button></div>';
    // Buttons
    html+='<div class="d-flex gap-1 mb-2"><button class="btn btn-sm btn-primary" onclick="asignarChecked(\''+id+'\')">→ Asignar seleccionados</button><button class="btn btn-sm btn-danger" onclick="desasignarChecked(\''+id+'\')">← Quitar seleccionados</button></div>';
    // Dual panel
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
    html+='<div style="border:1px solid #dee2e6;border-radius:8px;max-height:250px;overflow-y:auto"><div style="padding:8px 10px;background:#f8f9fa;font-weight:600;font-size:.82rem;border-bottom:1px solid #dee2e6"><input type="checkbox" onchange="toggleAllDisp(this)"> Disponibles ('+disp.length+')</div>';
    disp.forEach(function(e){html+='<div style="padding:6px 10px;border-bottom:1px solid #f0f0f0;font-size:.84rem"><input type="checkbox" class="qa-chk" value="'+e.id+'"> '+e.nombre+' <small class="text-muted">'+e.departamento+'</small></div>';});
    html+='</div>';
    html+='<div style="border:1px solid #dee2e6;border-radius:8px;max-height:250px;overflow-y:auto"><div style="padding:8px 10px;background:#f8f9fa;font-weight:600;font-size:.82rem;border-bottom:1px solid #dee2e6"><input type="checkbox" onchange="toggleAllAsig(this)"> Asignados ('+asig.length+')</div>';
    asig.forEach(function(e){html+='<div style="padding:6px 10px;border-bottom:1px solid #f0f0f0;font-size:.84rem"><input type="checkbox" class="qa-asig" value="'+e.id+'"> '+e.nombre+' <small class="text-muted">'+e.departamento+'</small></div>';});
    html+='</div></div>';
    openModal(html);
}
function toggleAllDisp(el){document.querySelectorAll('.qa-chk').forEach(function(c){c.checked=el.checked;});}
function toggleAllAsig(el){document.querySelectorAll('.qa-asig').forEach(function(c){c.checked=el.checked;});}
function quickAssign(id){
    var emp=document.getElementById('qaE').value,dep=document.getElementById('qaD').value,gru=document.getElementById('qaG').value,c=0;
    if(!emp&&!dep&&!gru){showToast('Seleccione filtro','warning');return;}
    empleados.forEach(function(e){if(e.supervisor!==id&&e.estado==='Activo'){var ok=true;if(emp&&e.empresa!==emp)ok=false;if(dep&&e.departamento!==dep)ok=false;if(gru&&e.grupo!==gru)ok=false;if(ok){e.supervisor=id;c++;}}});
    showToast(c+' asignados','success');closeModal();renderModule('supervisores');
}
function asignarChecked(id){
    var chks=document.querySelectorAll('.qa-chk:checked'),c=0;
    chks.forEach(function(ch){var e=empleados.find(function(x){return x.id===ch.value;});if(e){e.supervisor=id;c++;}});
    if(!c){showToast('Seleccione empleados disponibles','warning');return;}
    showToast(c+' asignados','success');closeModal();renderModule('supervisores');
}
function desasignarChecked(id){
    var chks=document.querySelectorAll('.qa-asig:checked'),c=0;
    chks.forEach(function(ch){var e=empleados.find(function(x){return x.id===ch.value;});if(e){e.supervisor='';c++;}});
    if(!c){showToast('Seleccione empleados asignados','warning');return;}
    showToast(c+' desasignados','info');closeModal();renderModule('supervisores');
}


// ===== INCIDENCIAS =====
function renderIncidencias(){
    var html='<div class="section-title">Revisión de Incidencias</div>';
    html+='<div class="tabs-section"><div class="tab-btn active" onclick="showIncTab(\'alertas\')">🔔 Alertas Tempranas</div><div class="tab-btn" onclick="showIncTab(\'periodo\')">📋 Incidencias del Periodo</div></div>';
    html+='<div id="incTabC">'+renderAlertas()+'</div>';
    return html;
}
function showIncTab(t){document.querySelectorAll('.tabs-section .tab-btn').forEach(function(b,i){b.classList.toggle('active',['alertas','periodo'][i]===t);});document.getElementById('incTabC').innerHTML=t==='alertas'?renderAlertas():renderIncPeriodo();}

function renderAlertas(){
    var pend=alertasTempranas.filter(function(a){return a.estado==='Pendiente';}).length;
    var atend=alertasTempranas.filter(function(a){return a.estado!=='Pendiente';}).length;
    var html='<div class="d-flex justify-between align-center mb-2"><div class="alerta-monitor"><span class="dot"></span> Monitoreo activo — Validando marcaciones en tiempo real simulado</div><button class="btn btn-sm btn-warning" onclick="simAlerta()">⚡ Simular nueva alerta</button></div>';
    html+='<p class="text-muted mb-2" style="font-size:.8rem">Las alertas tempranas permiten al supervisor atender novedades durante el día, antes del cierre de nómina.</p>';
    html+='<div class="kpi-grid"><div class="kpi-card yellow"><div class="kpi-value">'+alertasTempranas.length+'</div><div class="kpi-label">Alertas hoy</div></div><div class="kpi-card red"><div class="kpi-value">'+pend+'</div><div class="kpi-label">Pendientes</div></div><div class="kpi-card green"><div class="kpi-value">'+atend+'</div><div class="kpi-label">Atendidas</div></div></div>';
    html+='<div class="filters-bar"><select id="fAE" onchange="filtAlertas()"><option value="">Estado</option><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option><option>Justificada</option></select><select id="fAT" onchange="filtAlertas()"><option value="">Tipo</option><option>Entrada tarde</option><option>Falta de marca</option><option>Salida anticipada</option><option>Posible hora extra</option><option>Marca sin ubicación confirmada</option><option>Visita fuera de horario</option></select><select id="fAO" onchange="filtAlertas()"><option value="">Origen</option><option>Kiosco Biométrico</option><option>Marcación Web</option></select></div>';
    html+='<div class="table-container" id="tblAltC">'+tablaAlertas(alertasTempranas)+'</div>';
    return html;
}
function tablaAlertas(l){
    var html='<table><thead><tr><th>Código</th><th>Hora</th><th>Empleado</th><th>Horario</th><th>Marca</th><th>Tipo</th><th>Prioridad</th><th>Origen</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    l.forEach(function(a){var pc=a.prioridad==='Alta'?'priority-alta':a.prioridad==='Media'?'priority-media':'priority-baja';
        html+='<tr><td>'+a.id+'</td><td>'+a.horaDeteccion+'</td><td>'+getNombreEmp(a.empleadoId)+'</td><td>'+a.horarioEsp+'</td><td>'+a.marcaReal+'</td><td>'+a.tipoAlerta+'</td><td><span class="'+pc+'">'+a.prioridad+'</span></td><td><span class="badge badge-info">'+a.origen+'</span></td><td>'+badge(a.estado)+'</td><td class="btn-group">';
        if(a.estado==='Pendiente'){html+='<div class="tooltip-wrapper"><button class="btn btn-xs btn-success" onclick="accionAlerta(\''+a.id+'\',\'Aprobada\')">✓</button><span class="tooltip-text">Aprobar</span></div><div class="tooltip-wrapper"><button class="btn btn-xs btn-danger" onclick="accionAlerta(\''+a.id+'\',\'Rechazada\')">✗</button><span class="tooltip-text">Rechazar</span></div><div class="tooltip-wrapper"><button class="btn btn-xs btn-primary" onclick="justAlerta(\''+a.id+'\')">📝</button><span class="tooltip-text">Justificar</span></div>';}
        html+='<div class="tooltip-wrapper"><button class="btn btn-xs btn-outline" onclick="detAlerta(\''+a.id+'\')">🔍</button><span class="tooltip-text">Detalle</span></div></td></tr>';});
    if(!l.length)html+='<tr><td colspan="10" class="text-muted" style="text-align:center">Sin alertas</td></tr>';
    html+='</tbody></table>';return html;
}
function filtAlertas(){var e=document.getElementById('fAE').value,t=document.getElementById('fAT').value,o=document.getElementById('fAO').value;var f=alertasTempranas.filter(function(a){if(e&&a.estado!==e)return false;if(t&&a.tipoAlerta!==t)return false;if(o&&a.origen!==o)return false;return true;});document.getElementById('tblAltC').innerHTML=tablaAlertas(f);}

function accionAlerta(id,accion){
    var a=alertasTempranas.find(function(x){return x.id===id;});
    var html='<div class="modal-header"><h3>'+(accion==='Aprobada'?'Aprobar':'Rechazar')+' Alerta '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="detail-grid"><div class="detail-item"><label>Empleado</label><span>'+getNombreEmp(a.empleadoId)+'</span></div><div class="detail-item"><label>Tipo</label><span>'+a.tipoAlerta+'</span></div></div>';
    html+='<div class="form-group"><label>Motivo *</label><select id="altMot"><option>Entrada autorizada</option><option>Apoyo operativo</option><option>Error de marcación</option><option>Turno especial</option><option>Sin justificación</option><option>Incumplimiento</option><option>Otro</option></select></div>';
    html+='<div class="form-group"><label>Comentario</label><textarea id="altCom"></textarea></div>';
    html+='<div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn '+(accion==='Aprobada'?'btn-success':'btn-danger')+'" onclick="confAlerta(\''+id+'\',\''+accion+'\')">Confirmar</button></div>';
    openModal(html);
}
function confAlerta(id,accion){
    var a=alertasTempranas.find(function(x){return x.id===id;});
    a.estado=accion;a.motivo=document.getElementById('altMot').value;a.comentario=document.getElementById('altCom').value;
    a.fechaResolucion=new Date().toISOString().slice(0,16).replace('T',' ');a.usuarioResolucion=rolActual;
    closeModal();showToast('Alerta '+id+' '+accion.toLowerCase(),'success');renderModule('incidencias');
}
function justAlerta(id){
    var html='<div class="modal-header"><h3>Justificar Alerta '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="form-group"><label>Tipo justificación *</label><select id="jTipo"><option>Permiso autorizado</option><option>Cita médica</option><option>Capacitación</option><option>Actividad fuera de planta</option><option>Error sistema</option><option>Otro</option></select></div>';
    html+='<div class="form-group"><label>Comentario *</label><textarea id="jCom" required></textarea></div>';
    html+='<div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="confJust(\''+id+'\')">Guardar</button></div>';
    openModal(html);
}
function confJust(id){
    var com=document.getElementById('jCom').value.trim();if(!com){showToast('Comentario obligatorio','warning');return;}
    var a=alertasTempranas.find(function(x){return x.id===id;});
    a.estado='Justificada';a.motivo=document.getElementById('jTipo').value;a.comentario=com;
    a.fechaResolucion=new Date().toISOString().slice(0,16).replace('T',' ');a.usuarioResolucion=rolActual;
    closeModal();showToast('Justificación registrada','success');renderModule('incidencias');
}
function detAlerta(id){
    var a=alertasTempranas.find(function(x){return x.id===id;});var emp=empleados.find(function(e){return e.id===a.empleadoId;});
    var html='<div class="modal-header"><h3>Detalle Alerta '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="detail-grid"><div class="detail-item"><label>Empleado</label><span>'+(emp?emp.nombre:'')+'</span></div><div class="detail-item"><label>Departamento</label><span>'+a.departamento+'</span></div><div class="detail-item"><label>Horario Esperado</label><span>'+a.horarioEsp+'</span></div><div class="detail-item"><label>Marca Real</label><span>'+a.marcaReal+'</span></div><div class="detail-item"><label>Diferencia</label><span style="color:#c62828">'+a.diferencia+'</span></div><div class="detail-item"><label>Tipo</label><span>'+a.tipoAlerta+'</span></div><div class="detail-item"><label>Prioridad</label><span>'+a.prioridad+'</span></div><div class="detail-item"><label>Origen</label><span>'+a.origen+'</span></div><div class="detail-item"><label>Estado</label><span>'+badge(a.estado)+'</span></div></div>';
    html+='<hr class="section-divider"><p style="font-size:.84rem"><strong>Regla:</strong> La alerta fue generada porque la marca '+a.marcaReal+' presenta diferencia de '+a.diferencia+' respecto al horario '+a.horarioEsp+', superando tolerancia configurada.</p>';
    if(a.estado!=='Pendiente'){html+='<hr class="section-divider"><div class="detail-grid"><div class="detail-item"><label>Resolución</label><span>'+a.estado+'</span></div><div class="detail-item"><label>Motivo</label><span>'+a.motivo+'</span></div><div class="detail-item"><label>Fecha</label><span>'+a.fechaResolucion+'</span></div><div class="detail-item"><label>Usuario</label><span>'+a.usuarioResolucion+'</span></div></div>';}
    if(a.estado==='Pendiente'){html+='<hr class="section-divider"><div class="btn-group"><button class="btn btn-success" onclick="closeModal();accionAlerta(\''+id+'\',\'Aprobada\')">✓ Aprobar</button><button class="btn btn-danger" onclick="closeModal();accionAlerta(\''+id+'\',\'Rechazada\')">✗ Rechazar</button><button class="btn btn-primary" onclick="closeModal();justAlerta(\''+id+'\')">📝 Justificar</button></div>';}
    openModal(html);
}
function simAlerta(){
    var tipos=['Entrada tarde','Falta de marca','Salida anticipada','Posible hora extra','Marca sin ubicación confirmada','Visita fuera de horario'];
    var origenes=['Kiosco Biométrico','Marcación Web'];var prios=['Alta','Media','Baja'];
    var empR=empleados[Math.floor(Math.random()*empleados.length)];
    contadorAlertas++;
    alertasTempranas.unshift({id:'ALT'+String(contadorAlertas).padStart(3,'0'),fecha:'2024-01-15',horaDeteccion:String(Math.floor(Math.random()*12)+6).padStart(2,'0')+':'+String(Math.floor(Math.random()*60)).padStart(2,'0'),empleadoId:empR.id,departamento:empR.departamento,horarioEsp:'08:00',marcaReal:'08:'+String(Math.floor(Math.random()*50)+10),diferencia:Math.floor(Math.random()*60+5)+' min',tipoAlerta:tipos[Math.floor(Math.random()*tipos.length)],prioridad:prios[Math.floor(Math.random()*3)],origen:origenes[Math.floor(Math.random()*3)],estado:'Pendiente',motivo:'',comentario:'',fechaResolucion:null,usuarioResolucion:null});
    showToast('⚡ Nueva alerta temprana detectada','warning');renderModule('incidencias');
}

// Incidencias del periodo
function renderIncPeriodo(){
    var html='<div class="filters-bar"><select id="fIE" onchange="filtInc()"><option value="">Estado</option><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option></select><select id="fIO" onchange="filtInc()"><option value="">Origen</option><option>Kiosco Biométrico</option><option>Marcación Web</option></select><input type="date" id="fID" onchange="filtInc()"></div>';
    html+='<div class="d-flex gap-1 mb-2"><button class="btn btn-sm btn-success" onclick="masInc(\'Aprobada\')">✓ Aprobar seleccionados</button><button class="btn btn-sm btn-danger" onclick="masInc(\'Rechazada\')">✗ Rechazar seleccionados</button></div>';
    html+='<div class="table-container" id="tblIncC">'+tablaInc(incidencias)+'</div>';
    return html;
}
function tablaInc(l){
    var html='<table><thead><tr><th><input type="checkbox" onchange="var c=document.querySelectorAll(\'.ic\');c.forEach(function(x){x.checked=this.checked;}.bind(this))"></th><th>Código</th><th>Empleado</th><th>Fecha</th><th>Horario</th><th>Tipo</th><th>Hrs+</th><th>Origen</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    l.forEach(function(i){html+='<tr><td>'+(i.estado==='Pendiente'?'<input type="checkbox" class="ic" value="'+i.id+'">':'')+'</td><td>'+i.id+'</td><td>'+getNombreEmp(i.empleadoId)+'</td><td>'+i.fecha+'</td><td>'+i.horarioEsp+'</td><td>'+i.tipo+'</td><td>'+i.horasAdicionales+'</td><td><span class="badge badge-info">'+i.origen+'</span></td><td>'+badge(i.estado)+'</td><td class="btn-group">';
        if(i.estado==='Pendiente'){html+='<div class="tooltip-wrapper"><button class="btn btn-xs btn-success" onclick="aprInc(\''+i.id+'\')">✓</button><span class="tooltip-text">Aprobar</span></div><div class="tooltip-wrapper"><button class="btn btn-xs btn-danger" onclick="recInc(\''+i.id+'\')">✗</button><span class="tooltip-text">Rechazar</span></div>';}
        html+='<div class="tooltip-wrapper"><button class="btn btn-xs btn-outline" onclick="detInc(\''+i.id+'\')">🔍</button><span class="tooltip-text">Detalle</span></div></td></tr>';});
    html+='</tbody></table>';return html;
}
function filtInc(){var e=document.getElementById('fIE').value,o=document.getElementById('fIO').value,d=document.getElementById('fID').value;var f=incidencias.filter(function(i){if(e&&i.estado!==e)return false;if(o&&i.origen!==o)return false;if(d&&i.fecha!==d)return false;return true;});document.getElementById('tblIncC').innerHTML=tablaInc(f);}
function aprInc(id){var i=incidencias.find(function(x){return x.id===id;});var html='<div class="modal-header"><h3>Aprobar '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="form-group"><label>Motivo *</label><textarea id="iMot" required></textarea></div><div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-success" onclick="confInc(\''+id+'\',\'Aprobada\')">Confirmar</button></div>';openModal(html);}
function recInc(id){var html='<div class="modal-header"><h3>Rechazar '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="form-group"><label>Motivo *</label><textarea id="iMot" required></textarea></div><div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="confInc(\''+id+'\',\'Rechazada\')">Confirmar</button></div>';openModal(html);}
function confInc(id,accion){var mot=document.getElementById('iMot').value.trim();if(!mot){showToast('Motivo obligatorio','warning');return;}var i=incidencias.find(function(x){return x.id===id;});i.estado=accion;i.motivo=mot;i.fechaResolucion=new Date().toISOString().slice(0,10);i.usuarioResolucion=rolActual;closeModal();showToast(id+' '+accion.toLowerCase(),'success');renderModule('incidencias');}
function detInc(id){var i=incidencias.find(function(x){return x.id===id;});var emp=empleados.find(function(e){return e.id===i.empleadoId;});var html='<div class="modal-header"><h3>Detalle '+id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="detail-grid"><div class="detail-item"><label>Empleado</label><span>'+(emp?emp.nombre:'')+'</span></div><div class="detail-item"><label>Fecha</label><span>'+i.fecha+'</span></div><div class="detail-item"><label>Horario</label><span>'+i.horarioEsp+'</span></div><div class="detail-item"><label>Marca</label><span>'+i.marcaEntrada+' / '+i.marcaSalida+'</span></div><div class="detail-item"><label>Tipo</label><span>'+i.tipo+'</span></div><div class="detail-item"><label>Origen</label><span>'+i.origen+'</span></div><div class="detail-item"><label>Estado</label><span>'+badge(i.estado)+'</span></div><div class="detail-item"><label>Motivo</label><span>'+(i.motivo||'—')+'</span></div></div>';if(i.estado==='Pendiente'){html+='<hr class="section-divider"><div class="form-group"><label>Observación</label><textarea id="iMot"></textarea></div><div class="btn-group"><button class="btn btn-success" onclick="confInc(\''+id+'\',\'Aprobada\')">✓ Aprobar</button><button class="btn btn-danger" onclick="confInc(\''+id+'\',\'Rechazada\')">✗ Rechazar</button></div>';}openModal(html);}
function masInc(accion){var chks=document.querySelectorAll('.ic:checked');if(!chks.length){showToast('Seleccione incidencias','warning');return;}var html='<div class="modal-header"><h3>'+accion+' '+chks.length+' incidencia(s)</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="form-group"><label>Observación *</label><textarea id="iMot" required></textarea></div><div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn '+(accion==='Aprobada'?'btn-success':'btn-danger')+'" onclick="confMasInc(\''+accion+'\')">Confirmar</button></div>';openModal(html);}
function confMasInc(accion){var mot=document.getElementById('iMot').value.trim();if(!mot){showToast('Observación obligatoria','warning');return;}document.querySelectorAll('.ic:checked').forEach(function(c){var i=incidencias.find(function(x){return x.id===c.value;});if(i){i.estado=accion;i.motivo=mot;i.fechaResolucion=new Date().toISOString().slice(0,10);i.usuarioResolucion=rolActual;}});closeModal();showToast('Incidencias '+accion.toLowerCase(),'success');renderModule('incidencias');}


// ===== SEGUIMIENTO NÓMINA =====
function renderSeguimiento(){
    var pend=incidencias.filter(function(i){return i.estado==='Pendiente';}).length;
    var altPend=alertasTempranas.filter(function(a){return a.estado==='Pendiente';}).length;
    var html='<div class="d-flex justify-between align-center mb-2"><div class="section-title" style="margin-bottom:0">Seguimiento Nómina</div><button class="btn btn-warning" onclick="recTodos()">📧 Recordatorio a todos</button></div>';
    html+='<div class="kpi-grid"><div class="kpi-card yellow"><div class="kpi-value">'+supervisores.filter(function(s){return s.incidenciasPendientes>0;}).length+'</div><div class="kpi-label">Sup. con Pendientes</div></div><div class="kpi-card red"><div class="kpi-value">'+pend+'</div><div class="kpi-label">Incidencias Pend.</div></div><div class="kpi-card yellow"><div class="kpi-value">'+altPend+'</div><div class="kpi-label">Alertas Tempranas Pend.</div></div><div class="kpi-card green"><div class="kpi-value">'+recordatorios.length+'</div><div class="kpi-label">Recordatorios</div></div></div>';
    html+='<div class="table-container"><table><thead><tr><th>Supervisor</th><th>Empresa</th><th>Empleados</th><th>Inc. Pendientes</th><th>Alertas Pend.</th><th>Marcas Web Rev.</th><th>Tiempo Resp.</th><th>Acciones</th></tr></thead><tbody>';
    supervisores.forEach(function(s){
        var altS=alertasTempranas.filter(function(a){return a.estado==='Pendiente'&&empleados.find(function(e){return e.id===a.empleadoId&&e.supervisor===s.id;});}).length;
        var webRev=marcacionesWeb.filter(function(m){return m.estado==='En revisión'&&empleados.find(function(e){return e.id===m.empleadoId&&e.supervisor===s.id;});}).length;
        html+='<tr><td><strong>'+s.nombre+'</strong></td><td>'+getNombreEmpresa(s.empresa)+'</td><td>'+s.empleadosAsignados+'</td><td>'+(s.incidenciasPendientes>0?'<span class="badge badge-warning">'+s.incidenciasPendientes+'</span>':'0')+'</td><td>'+(altS>0?'<span class="badge badge-warning">'+altS+'</span>':'0')+'</td><td>'+webRev+'</td><td>'+s.tiempoPromedio+'</td><td><button class="btn btn-xs btn-warning" onclick="envRec(\''+s.id+'\')">Recordatorio</button></td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function envRec(id){
    var s=supervisores.find(function(x){return x.id===id;});
    var pend=incidencias.filter(function(i){return i.supervisorId===id&&i.estado==='Pendiente';}).length;
    var altPend=alertasTempranas.filter(function(a){return a.estado==='Pendiente'&&empleados.find(function(e){return e.id===a.empleadoId&&e.supervisor===id;});}).length;
    var html='<div class="modal-header"><h3>Enviar Recordatorio</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;padding:18px;margin-bottom:14px">';
    html+='<div style="border-bottom:1px solid #dee2e6;padding-bottom:8px;margin-bottom:10px">';
    html+='<p style="font-size:.82rem;margin-bottom:3px"><strong>Para:</strong> '+s.correo+'</p>';
    html+='<p style="font-size:.82rem"><strong>Asunto:</strong> Recordatorio - Incidencias pendientes de revisión - '+getNombreEmpresa(s.empresa)+'</p>';
    html+='</div>';
    html+='<div style="font-size:.85rem;line-height:1.7;color:#333">';
    html+='<p>Estimado(a) <strong>'+s.nombre+'</strong>,</p><br>';
    html+='<p>Le informamos que tiene novedades pendientes de revisión para la empresa <strong>'+getNombreEmpresa(s.empresa)+'</strong>.</p><br>';
    html+='<p>Resumen:</p>';
    html+='<ul style="margin:6px 0 6px 20px">';
    html+='<li>Incidencias pendientes: <strong>'+pend+'</strong></li>';
    html+='<li>Alertas tempranas pendientes: <strong>'+altPend+'</strong></li>';
    html+='<li>Empleados asignados: <strong>'+s.empleadosAsignados+'</strong></li>';
    html+='</ul><br>';
    html+='<p>Le solicitamos ingresar a <strong>MarcaControl COMECA</strong> y completar la aprobación o rechazo de las novedades asignadas a la brevedad.</p><br>';
    html+='<p>Saludos cordiales,<br>Equipo de Nómina<br>Sistema MarcaControl COMECA</p>';
    html+='</div></div>';
    html+='<div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmarEnvRec(\''+id+'\')">Enviar Recordatorio</button></div>';
    openModal(html);
}
function confirmarEnvRec(id){
    var s=supervisores.find(function(x){return x.id===id;});
    recordatorios.push({id:'REC'+String(recordatorios.length+1).padStart(3,'0'),supervisorId:id,fecha:new Date().toISOString().slice(0,10)});
    closeModal();showToast('Recordatorio enviado a '+s.nombre,'success');renderModule('seguimiento');
}
function recTodos(){
    var conPend=supervisores.filter(function(s){return s.incidenciasPendientes>0;});
    if(!conPend.length){showToast('No hay supervisores con pendientes','info');return;}
    var html='<div class="modal-header"><h3>Recordatorio Masivo</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<p>Se enviará recordatorio a <strong>'+conPend.length+' supervisor(es)</strong> con pendientes:</p><ul style="margin:8px 0 12px 18px;font-size:.85rem">';
    conPend.forEach(function(s){html+='<li>'+s.nombre+' ('+s.correo+') - '+s.incidenciasPendientes+' pendientes</li>';});
    html+='</ul>';
    html+='<div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-warning" onclick="confirmarRecTodos()">Enviar a Todos</button></div>';
    openModal(html);
}
function confirmarRecTodos(){
    var conPend=supervisores.filter(function(s){return s.incidenciasPendientes>0;});
    conPend.forEach(function(s){recordatorios.push({id:'REC'+String(recordatorios.length+1).padStart(3,'0'),supervisorId:s.id,fecha:new Date().toISOString().slice(0,10)});});
    closeModal();showToast('Recordatorio enviado a '+conPend.length+' supervisores','success');renderModule('seguimiento');
}

// ===== CIERRE POR EMPRESA =====
function renderCierre(){
    var totalPend=incidencias.filter(function(i){return i.estado==='Pendiente';}).length;
    // Generar filas por empresa+planilla
    var filas=[];
    empresas.forEach(function(emp){
        emp.planillas.forEach(function(plan){
            var incEP=incidencias.filter(function(i){return i.empresa===emp.codigo&&i.tipoPlanilla===plan;});
            var empsP=empleados.filter(function(e){return e.empresa===emp.codigo&&e.tipoPlanilla===plan;}).length;
            var p=incEP.filter(function(i){return i.estado==='Pendiente';}).length;
            var a=incEP.filter(function(i){return i.estado==='Aprobada';}).length;
            var av=incEP.length>0?Math.round(((incEP.length-p)/incEP.length)*100):100;
            filas.push({emp:emp,plan:plan,emps:empsP,pend:p,aprob:a,total:incEP.length,avance:av});
        });
    });
    var completas=filas.filter(function(f){return f.avance===100&&f.total>0;}).length;

    var html='<div class="section-title">Cierre por Empresa y Planilla</div>';
    html+='<p class="text-muted mb-2" style="font-size:.82rem">El cierre se realiza por empresa y tipo de planilla en curso. Una planilla solo puede cerrarse al 100% cuando no tiene incidencias pendientes.</p>';
    html+='<div class="kpi-grid"><div class="kpi-card blue"><div class="kpi-value">'+filas.length+'</div><div class="kpi-label">Empresa + Planilla</div></div><div class="kpi-card green"><div class="kpi-value">'+completas+'</div><div class="kpi-label">Cerradas (100%)</div></div><div class="kpi-card red"><div class="kpi-value">'+totalPend+'</div><div class="kpi-label">Pendientes Total</div></div></div>';

    // Filtro
    html+='<div class="filters-bar"><select id="fCE" onchange="filtCierre()"><option value="">Todas las empresas</option>';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select><select id="fCP" onchange="filtCierre()"><option value="">Todas las planillas</option>';
    tiposPlanilla.forEach(function(t){html+='<option>'+t+'</option>';});
    html+='</select></div>';

    html+='<div class="table-container" id="tblCierreC">'+tablaCierre(filas)+'</div>';
    if(lotesLegadmi.length>0){html+='<div class="section-title mt-2">Lotes Legadmi Enviados</div><div class="table-container"><table><thead><tr><th>Lote</th><th>Empresa</th><th>Planilla</th><th>Empleados</th><th>Horas</th><th>Estado</th><th>Respuesta</th></tr></thead><tbody>';lotesLegadmi.forEach(function(l){html+='<tr><td>'+l.id+'</td><td>'+getNombreEmpresa(l.empresa)+'</td><td>'+l.planilla+'</td><td>'+l.totalEmp+'</td><td>'+l.totalHrs+'</td><td>'+badge(l.estado)+'</td><td>'+l.respuesta+'</td></tr>';});html+='</tbody></table></div>';}
    return html;
}
function tablaCierre(filas){
    var html='<table><thead><tr><th>País</th><th>Empresa</th><th>Planilla</th><th>Empleados</th><th>Pendientes</th><th>Aprobadas</th><th>% Avance</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    filas.forEach(function(f){
        html+='<tr><td>'+f.emp.pais+'</td><td><strong>'+f.emp.nombre+'</strong></td><td><span class="badge badge-info">'+f.plan+'</span></td><td>'+f.emps+'</td><td>'+f.pend+'</td><td>'+f.aprob+'</td><td><div class="d-flex align-center gap-1"><div class="progress-bar"><div class="progress-fill'+(f.avance===100?' complete':'')+'" style="width:'+f.avance+'%"></div></div><small>'+f.avance+'%</small></div></td><td>'+(f.pend===0?badge('Completo'):badge('Con pendientes'))+'</td><td class="btn-group">';
        if(f.avance===100&&f.total>0){html+='<button class="btn btn-xs btn-success" onclick="descargarCierre(\''+f.emp.codigo+'\',\''+f.plan+'\')">CSV</button><button class="btn btn-xs btn-primary" onclick="modalLegadmi(\''+f.emp.codigo+'\',\''+f.plan+'\')">Legadmi</button>';}
        else if(f.total===0){html+='<span class="text-muted" style="font-size:.78rem">Sin incidencias</span>';}
        else{html+='<span class="tooltip-wrapper"><button class="btn btn-xs btn-outline" disabled>CSV</button><span class="tooltip-text">Completar al 100%</span></span>';}
        html+='</td></tr>';
    });
    html+='</tbody></table>';return html;
}
function filtCierre(){
    var empF=document.getElementById('fCE').value,planF=document.getElementById('fCP').value;
    var filas=[];
    empresas.forEach(function(emp){
        emp.planillas.forEach(function(plan){
            if(empF&&emp.codigo!==empF)return;
            if(planF&&plan!==planF)return;
            var incEP=incidencias.filter(function(i){return i.empresa===emp.codigo&&i.tipoPlanilla===plan;});
            var empsP=empleados.filter(function(e){return e.empresa===emp.codigo&&e.tipoPlanilla===plan;}).length;
            var p=incEP.filter(function(i){return i.estado==='Pendiente';}).length;
            var a=incEP.filter(function(i){return i.estado==='Aprobada';}).length;
            var av=incEP.length>0?Math.round(((incEP.length-p)/incEP.length)*100):100;
            filas.push({emp:emp,plan:plan,emps:empsP,pend:p,aprob:a,total:incEP.length,avance:av});
        });
    });
    document.getElementById('tblCierreC').innerHTML=tablaCierre(filas);
}
function descargarCierre(emp,plan){var datos=incidencias.filter(function(i){return i.empresa===emp&&i.tipoPlanilla===plan&&i.estado!=='Pendiente';}).map(function(i){return{codigo:i.id,empleado:getNombreEmp(i.empleadoId),planilla:i.tipoPlanilla,fecha:i.fecha,tipo:i.tipo,horas:i.horasAdicionales,origen:i.origen,estado:i.estado,motivo:i.motivo};});descargarCSV(datos,'cierre_'+emp+'_'+plan);}
function modalLegadmi(emp,plan){
    var aprob=incidencias.filter(function(i){return i.empresa===emp&&i.tipoPlanilla===plan&&i.estado==='Aprobada';});
    var empObj=empresas.find(function(e){return e.codigo===emp;});
    var fechaHoy=new Date();var dd=String(fechaHoy.getDate()).padStart(2,'0');var mm=String(fechaHoy.getMonth()+1).padStart(2,'0');var yyyy=fechaHoy.getFullYear();
    var fechaCarga=dd+mm+yyyy;
    var loteNombre='LOTE_'+emp+'_'+plan.substring(0,3).toUpperCase()+'_'+dd+mm;

    var html='<div class="modal-header"><h3>API Legadmi - Temporal Asistencias</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="detail-grid"><div class="detail-item"><label>Empresa</label><span>'+getNombreEmpresa(emp)+'</span></div><div class="detail-item"><label>Planilla</label><span>'+plan+'</span></div><div class="detail-item"><label>Método</label><span>POST integracion/tmp_asistencias/</span></div><div class="detail-item"><label>Lote</label><span>'+loteNombre+'</span></div></div>';

    if(aprob.length>0){
        html+='<div class="section-title" style="font-size:.9rem">Preview JSON - listdetalle ('+aprob.length+' registros)</div>';
        html+='<div class="table-container" style="max-height:250px;overflow-y:auto"><table><thead><tr><th>ID</th><th>COD_EMPRESA</th><th>COD_TRABAJADOR</th><th>COD_CONCEPTO</th><th>FECHA</th><th>CANTIDAD</th><th>NU_LOTE</th><th>STATUS</th><th>FECHA_CARGA</th></tr></thead><tbody>';
        aprob.forEach(function(i,idx){
            var empE=empleados.find(function(e){return e.id===i.empleadoId;});
            var codTrab=empE?empE.cedula.replace(/-/g,''):'0';
            var fParts=i.fecha.split('-');var fechaApi=fParts[2]+fParts[1]+fParts[0];
            html+='<tr><td>'+(idx+1)+'</td><td>'+emp.replace('CR','')+'</td><td>'+codTrab+'</td><td>58</td><td>'+fechaApi+'</td><td>'+i.horasAdicionales+'</td><td>'+loteNombre+'</td><td>C</td><td>'+fechaCarga+'</td></tr>';
        });
        html+='</tbody></table></div>';

        // JSON preview
        html+='<div class="section-title mt-2" style="font-size:.9rem">Ejemplo JSON Request</div>';
        html+='<div style="background:#1a1a2e;border-radius:8px;padding:12px;font-family:monospace;font-size:.75rem;color:#00ff88;max-height:150px;overflow-y:auto;line-height:1.5">';
        var empE0=empleados.find(function(e){return e.id===aprob[0].empleadoId;});
        var codT0=empE0?empE0.cedula.replace(/-/g,''):'0';
        var fP0=aprob[0].fecha.split('-');var fApi0=fP0[2]+fP0[1]+fP0[0];
        html+='{ "listdetalle": [<br>';
        html+='&nbsp;&nbsp;{<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"ID": 1,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"COD_EMPRESA": '+emp.replace('CR','')+ ',<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"COD_TRABAJADOR": "'+codT0+'",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"COD_CONCEPTO": 58,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"FECHA": "'+fApi0+'",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"CANTIDAD": '+aprob[0].horasAdicionales+',<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"HORAS": NULL,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"MINUTOS": NULL,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"USUARIO_CARGA": "USUARIO",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"NU_LOTE": "'+loteNombre+'",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"STATUS": "C",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"USUARIO_APROBACION": NULL,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"FECHA_CARGA": "'+fechaCarga+'",<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"FECHA_APROBACION": NULL,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"COD_TRABAJADOR_RPS": NULL,<br>';
        html+='&nbsp;&nbsp;&nbsp;&nbsp;"RECHAZO": NULL<br>';
        html+='&nbsp;&nbsp;}'+(aprob.length>1?', ...('+aprob.length+' registros)':'')+'<br>';
        html+='] }</div>';

        html+='<div class="detail-grid mt-2"><div class="detail-item"><label>Total registros</label><span>'+aprob.length+'</span></div><div class="detail-item"><label>Total horas (CANTIDAD)</label><span>'+aprob.reduce(function(s,i){return s+i.horasAdicionales;},0)+'</span></div><div class="detail-item"><label>URL destino</label><span style="font-size:.78rem">https://cloud.legadmi.com:8181/apex/webservices/integracion/tmp_asistencias/</span></div><div class="detail-item"><label>Headers</label><span style="font-size:.78rem">Apikey: ******* | nesquema: [cliente] | Content-Type: application/json</span></div></div>';
        html+='<div class="d-flex justify-between mt-2"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="enviarLegadmi(\''+emp+'\',\''+plan+'\')">Confirmar Envío POST</button></div>';
    } else {
        html+='<p class="text-muted">Sin registros aprobados para esta planilla.</p>';
        html+='<button class="btn btn-secondary mt-2" onclick="closeModal()">Cerrar</button>';
    }
    openModal(html);
}
function enviarLegadmi(emp,plan){
    var aprob=incidencias.filter(function(i){return i.empresa===emp&&i.tipoPlanilla===plan&&i.estado==='Aprobada';});
    var fechaHoy=new Date();var dd=String(fechaHoy.getDate()).padStart(2,'0');var mm=String(fechaHoy.getMonth()+1).padStart(2,'0');var yyyy=fechaHoy.getFullYear();
    lotesLegadmi.push({id:'LOT-'+String(lotesLegadmi.length+1).padStart(3,'0'),empresa:emp,planilla:plan,fecha:dd+'/'+mm+'/'+yyyy,totalEmp:new Set(aprob.map(function(i){return i.empleadoId;})).size,totalHrs:aprob.reduce(function(s,i){return s+i.horasAdicionales;},0),estado:'Enviado',respuesta:'{"estatus":"0","error":"Registrado Insertado Satisfactoriamente"}'});
    closeModal();showToast('POST exitoso: estatus 0 - Registrado Insertado Satisfactoriamente','success');renderModule('cierre');
}


// ===== REPORTES =====
function renderReportes(){
    var tot=incidencias.length,pend=incidencias.filter(function(i){return i.estado==='Pendiente';}).length;
    var apr=incidencias.filter(function(i){return i.estado==='Aprobada';}).length;
    var rech=incidencias.filter(function(i){return i.estado==='Rechazada';}).length;
    var totalHrsApr=incidencias.filter(function(i){return i.estado==='Aprobada'&&i.horasAdicionales>0;}).reduce(function(s,i){return s+i.horasAdicionales;},0);
    var alertAtend=alertasTempranas.filter(function(a){return a.estado!=='Pendiente';}).length;
    var html='<div class="d-flex justify-between align-center mb-2"><div class="section-title" style="margin-bottom:0">📈 Reportes y Análisis</div><button class="btn btn-success" onclick="expRep()">📥 Exportar General</button></div>';
    html+='<div class="filters-bar"><select id="rE" onchange="filtRep()"><option value="">Todas empresas</option>';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select><select id="rO" onchange="filtRep()"><option value="">Origen</option><option>Kiosco Biométrico</option><option>Marcación Web</option></select><select id="rS" onchange="filtRep()"><option value="">Estado</option><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option></select><select id="rP" onchange="filtRep()"><option value="">Planilla</option>';
    tiposPlanilla.forEach(function(t){html+='<option>'+t+'</option>';});
    html+='</select><input type="date" id="rDesde" onchange="filtRep()"><input type="date" id="rHasta" onchange="filtRep()"></div>';
    html+='<div class="kpi-grid"><div class="kpi-card blue"><div class="kpi-value">'+tot+'</div><div class="kpi-label">Total Incidencias</div></div><div class="kpi-card yellow"><div class="kpi-value">'+pend+'</div><div class="kpi-label">Pendientes</div></div><div class="kpi-card green"><div class="kpi-value">'+apr+'</div><div class="kpi-label">Aprobadas</div></div><div class="kpi-card red"><div class="kpi-value">'+rech+'</div><div class="kpi-label">Rechazadas</div></div><div class="kpi-card green"><div class="kpi-value">'+totalHrsApr.toFixed(1)+'</div><div class="kpi-label">Hrs Extras Aprob.</div></div><div class="kpi-card blue"><div class="kpi-value">'+marcacionesBio.length+'</div><div class="kpi-label">Marcas Kiosco</div></div><div class="kpi-card"><div class="kpi-value">'+marcacionesWeb.length+'</div><div class="kpi-label">Marcas Web</div></div><div class="kpi-card green"><div class="kpi-value">'+alertAtend+'</div><div class="kpi-label">Alertas Atendidas</div></div><div class="kpi-card purple"><div class="kpi-value">'+lotesLegadmi.length+'</div><div class="kpi-label">Lotes Legadmi</div></div></div>';
    // Charts
    html+='<div class="charts-grid">';var maxE=Math.max(pend,apr,rech,1);
    html+='<div class="chart-container"><div class="chart-title">Incidencias por Estado</div><div class="bar-chart"><div class="bar-item"><div class="bar-value">'+pend+'</div><div class="bar bar-yellow" style="height:'+Math.round(pend/maxE*120)+'px"></div><div class="bar-label">Pendientes</div></div><div class="bar-item"><div class="bar-value">'+apr+'</div><div class="bar bar-green" style="height:'+Math.round(apr/maxE*120)+'px"></div><div class="bar-label">Aprobadas</div></div><div class="bar-item"><div class="bar-value">'+rech+'</div><div class="bar bar-red" style="height:'+Math.round(rech/maxE*120)+'px"></div><div class="bar-label">Rechazadas</div></div></div></div>';
    var byOrigen={};incidencias.forEach(function(i){byOrigen[i.origen]=(byOrigen[i.origen]||0)+1;});var maxO=Math.max.apply(null,Object.values(byOrigen).concat([1]));
    html+='<div class="chart-container"><div class="chart-title">Marcaciones por Canal</div><div class="bar-chart">';Object.keys(byOrigen).forEach(function(k,idx){var cols=['bar-blue','bar-green','bar-yellow'];html+='<div class="bar-item"><div class="bar-value">'+byOrigen[k]+'</div><div class="bar '+cols[idx%3]+'" style="height:'+Math.round(byOrigen[k]/maxO*120)+'px"></div><div class="bar-label">'+k.split(' ')[0]+'</div></div>';});html+='</div></div>';
    html+='<div class="chart-container"><div class="chart-title">Por Empresa</div><div class="bar-chart">';var maxEmp=1;empresas.forEach(function(emp){var c=incidencias.filter(function(i){return i.empresa===emp.codigo;}).length;if(c>maxEmp)maxEmp=c;});empresas.forEach(function(emp,idx){var c=incidencias.filter(function(i){return i.empresa===emp.codigo;}).length;if(c>0){var cols=['bar-blue','bar-green','bar-yellow','bar-red'];html+='<div class="bar-item"><div class="bar-value">'+c+'</div><div class="bar '+cols[idx%4]+'" style="height:'+Math.round(c/maxEmp*120)+'px"></div><div class="bar-label">'+emp.nombre.split(' ')[0]+'</div></div>';}});html+='</div></div>';
    html+='<div class="chart-container"><div class="chart-title">Pendientes por Supervisor</div><div class="bar-chart">';var maxSup=1;supervisores.forEach(function(s){if(s.incidenciasPendientes>maxSup)maxSup=s.incidenciasPendientes;});supervisores.forEach(function(s){if(s.incidenciasPendientes>0){html+='<div class="bar-item"><div class="bar-value">'+s.incidenciasPendientes+'</div><div class="bar bar-yellow" style="height:'+Math.round(s.incidenciasPendientes/maxSup*120)+'px"></div><div class="bar-label">'+s.nombre.split(' ')[0]+'</div></div>';}});html+='</div></div></div>';
    // Tablas
    var aprobH=incidencias.filter(function(i){return i.estado==='Aprobada'&&i.horasAdicionales>0;});
    html+='<div class="section-title mt-2">✅ Horas Aprobadas ('+aprobH.length+' | '+totalHrsApr.toFixed(1)+' hrs)</div><div class="filters-bar" style="margin-bottom:8px"><select id="fApEmp" multiple style="min-width:130px;height:50px"><option value="">Todas</option>';empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});html+='</select><input type="date" id="fApDesde"><input type="date" id="fApHasta"><button class="btn btn-sm btn-success" onclick="expAprob()">📥 Exportar</button></div>';
    html+='<div class="table-container"><table><thead><tr><th>Cédula</th><th>Empleado</th><th>Depto</th><th>Grupo</th><th>Empresa</th><th>Supervisor</th><th>Fecha</th><th>Horas</th><th>Origen</th><th>Motivo</th></tr></thead><tbody>';
    aprobH.forEach(function(i){var e=empleados.find(function(x){return x.id===i.empleadoId;});html+='<tr><td>'+(e?e.cedula:'')+'</td><td>'+getNombreEmp(i.empleadoId)+'</td><td>'+(e?e.departamento:'')+'</td><td>'+(e?e.grupo:'')+'</td><td>'+getNombreEmpresa(i.empresa)+'</td><td>'+getNombreSup(i.supervisorId)+'</td><td>'+i.fecha+'</td><td><strong>'+i.horasAdicionales+'</strong></td><td><span class="badge badge-info">'+i.origen+'</span></td><td>'+i.motivo+'</td></tr>';});
    if(!aprobH.length)html+='<tr><td colspan="10" class="text-muted" style="text-align:center">Sin registros</td></tr>';html+='</tbody></table></div>';
    var rechL=incidencias.filter(function(i){return i.estado==='Rechazada';});
    html+='<div class="section-title mt-2">❌ Rechazadas ('+rechL.length+')</div><div class="filters-bar" style="margin-bottom:8px"><select id="fReEmp" multiple style="min-width:130px;height:50px"><option value="">Todas</option>';empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});html+='</select><input type="date" id="fReDesde"><input type="date" id="fReHasta"><button class="btn btn-sm btn-danger" onclick="expRech()">📥 Exportar</button></div>';
    html+='<div class="table-container"><table><thead><tr><th>Cédula</th><th>Empleado</th><th>Depto</th><th>Empresa</th><th>Supervisor</th><th>Fecha</th><th>Tipo</th><th>Origen</th><th>Motivo</th></tr></thead><tbody>';
    rechL.forEach(function(i){var e=empleados.find(function(x){return x.id===i.empleadoId;});html+='<tr><td>'+(e?e.cedula:'')+'</td><td>'+getNombreEmp(i.empleadoId)+'</td><td>'+(e?e.departamento:'')+'</td><td>'+getNombreEmpresa(i.empresa)+'</td><td>'+getNombreSup(i.supervisorId)+'</td><td>'+i.fecha+'</td><td>'+i.tipo+'</td><td><span class="badge badge-info">'+i.origen+'</span></td><td>'+i.motivo+'</td></tr>';});
    if(!rechL.length)html+='<tr><td colspan="9" class="text-muted" style="text-align:center">Sin registros</td></tr>';html+='</tbody></table></div>';
    if(lotesLegadmi.length>0){html+='<div class="section-title mt-2">🔗 Lotes Legadmi</div><div class="table-container"><table><thead><tr><th>Lote</th><th>Empresa</th><th>Planilla</th><th>Fecha</th><th>Empleados</th><th>Horas</th><th>Estado</th><th>Respuesta</th></tr></thead><tbody>';lotesLegadmi.forEach(function(l){html+='<tr><td><strong>'+l.id+'</strong></td><td>'+getNombreEmpresa(l.empresa)+'</td><td>'+l.planilla+'</td><td>'+l.fecha+'</td><td>'+l.totalEmp+'</td><td>'+l.totalHrs+'</td><td>'+badge(l.estado)+'</td><td style="font-size:.76rem">'+l.respuesta+'</td></tr>';});html+='</tbody></table></div>';}
    return html;
}
function filtRep(){renderModule('reportes');}
function expRep(){var e=document.getElementById('rE').value,o=document.getElementById('rO').value,s=document.getElementById('rS').value,p=document.getElementById('rP').value,desde=document.getElementById('rDesde').value,hasta=document.getElementById('rHasta').value;var f=incidencias.filter(function(i){if(e&&i.empresa!==e)return false;if(o&&i.origen!==o)return false;if(s&&i.estado!==s)return false;if(p&&i.tipoPlanilla!==p)return false;if(desde&&i.fecha<desde)return false;if(hasta&&i.fecha>hasta)return false;return true;});descargarCSV(f.map(function(i){var emp=empleados.find(function(x){return x.id===i.empleadoId;});return{codigo:i.id,cedula:emp?emp.cedula:'',empleado:getNombreEmp(i.empleadoId),depto:emp?emp.departamento:'',grupo:emp?emp.grupo:'',planilla:i.tipoPlanilla,empresa:getNombreEmpresa(i.empresa),supervisor:getNombreSup(i.supervisorId),fecha:i.fecha,tipo:i.tipo,horas:i.horasAdicionales,origen:i.origen,estado:i.estado,motivo:i.motivo||''};}),'reporte_incidencias');}
function expAprob(){
    var empSel=document.getElementById('fApEmp');var emps=[];if(empSel){for(var i=0;i<empSel.options.length;i++){if(empSel.options[i].selected&&empSel.options[i].value)emps.push(empSel.options[i].value);}}
    var desde=document.getElementById('fApDesde')?document.getElementById('fApDesde').value:'';
    var hasta=document.getElementById('fApHasta')?document.getElementById('fApHasta').value:'';
    var d=incidencias.filter(function(i){
        if(i.estado!=='Aprobada'||i.horasAdicionales<=0)return false;
        if(emps.length>0&&emps.indexOf(i.empresa)===-1)return false;
        if(desde&&i.fecha<desde)return false;
        if(hasta&&i.fecha>hasta)return false;
        return true;
    }).map(function(i){var e=empleados.find(function(x){return x.id===i.empleadoId;});return{cedula:e?e.cedula:'',empleado:getNombreEmp(i.empleadoId),departamento:e?e.departamento:'',grupo:e?e.grupo:'',empresa:getNombreEmpresa(i.empresa),supervisor:getNombreSup(i.supervisorId),fecha:i.fecha,horas:i.horasAdicionales,origen:i.origen,motivo:i.motivo};});
    descargarCSV(d,'horas_aprobadas');
}
function expRech(){
    var empSel=document.getElementById('fReEmp');var emps=[];if(empSel){for(var i=0;i<empSel.options.length;i++){if(empSel.options[i].selected&&empSel.options[i].value)emps.push(empSel.options[i].value);}}
    var desde=document.getElementById('fReDesde')?document.getElementById('fReDesde').value:'';
    var hasta=document.getElementById('fReHasta')?document.getElementById('fReHasta').value:'';
    var d=incidencias.filter(function(i){
        if(i.estado!=='Rechazada')return false;
        if(emps.length>0&&emps.indexOf(i.empresa)===-1)return false;
        if(desde&&i.fecha<desde)return false;
        if(hasta&&i.fecha>hasta)return false;
        return true;
    }).map(function(i){var e=empleados.find(function(x){return x.id===i.empleadoId;});return{cedula:e?e.cedula:'',empleado:getNombreEmp(i.empleadoId),departamento:e?e.departamento:'',grupo:e?e.grupo:'',empresa:getNombreEmpresa(i.empresa),supervisor:getNombreSup(i.supervisorId),fecha:i.fecha,tipo:i.tipo,origen:i.origen,motivo:i.motivo};});
    descargarCSV(d,'rechazadas');
}


// ===== POLÍTICAS DE MARCACIÓN =====
function renderPoliticas(){
    var html='<div class="section-title">Políticas de Marcación</div>';
    html+='<div class="table-container"><table><thead><tr><th>Empresa</th><th>Tol. Entrada</th><th>Tol. Salida</th><th>Min Sin Extra</th><th>Flexible</th><th>Nocturno</th><th>Req. Ubicación Web</th><th>Permite Marcación Web</th><th>Alerta Sin Ubicación</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    politicasMarcacion.forEach(function(p){
        html+='<tr><td>'+getNombreEmpresa(p.empresa)+'</td><td>'+p.toleranciaEntrada+' min</td><td>'+p.toleranciaSalida+' min</td><td>'+p.minSalidaSinExtra+' min</td><td>'+(p.jornadaFlexible?'Sí':'No')+'</td><td>'+(p.turnoNocturno?'Sí':'No')+'</td><td>'+(p.requiereUbicacion?'Sí':'No')+'</td><td>'+(p.permiteMarcacionWeb?'Sí':'No')+'</td><td>'+(p.alertaSinUbicacion?'Sí':'No')+'</td><td>'+badge(p.estado)+'</td><td><button class="btn btn-xs btn-outline" onclick="editPol(\''+p.id+'\')">Editar</button></td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function editPol(id){
    var p=politicasMarcacion.find(function(x){return x.id===id;});
    var html='<div class="modal-header"><h3>Editar Política - '+getNombreEmpresa(p.empresa)+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="savePol(event,\''+id+'\')">';
    html+='<div class="form-row"><div class="form-group"><label>Tolerancia Entrada (min)</label><input type="number" id="pTE" value="'+p.toleranciaEntrada+'"></div><div class="form-group"><label>Tolerancia Salida (min)</label><input type="number" id="pTS" value="'+p.toleranciaSalida+'"></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Min Salida Sin Extra</label><input type="number" id="pMSE" value="'+p.minSalidaSinExtra+'"></div><div class="form-group"><label>Jornada Flexible</label><select id="pFlex"><option value="true"'+(p.jornadaFlexible?' selected':'')+'>Sí</option><option value="false"'+(!p.jornadaFlexible?' selected':'')+'>No</option></select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Requiere Ubicación Web</label><select id="pUbi"><option value="true"'+(p.requiereUbicacion?' selected':'')+'>Sí</option><option value="false"'+(!p.requiereUbicacion?' selected':'')+'>No</option></select></div><div class="form-group"><label>Permite Marcación Web</label><select id="pWeb"><option value="true"'+(p.permiteMarcacionWeb?' selected':'')+'>Sí</option><option value="false"'+(!p.permiteMarcacionWeb?' selected':'')+'>No</option></select></div></div>';
    html+='<div class="form-row"><div class="form-group"><label>Alerta Sin Ubicación</label><select id="pASU"><option value="true"'+(p.alertaSinUbicacion?' selected':'')+'>Sí</option><option value="false"'+(!p.alertaSinUbicacion?' selected':'')+'>No</option></select></div><div class="form-group"><label>Alerta Fuera Horario</label><select id="pAFH"><option value="true"'+(p.alertaFueraHorario?' selected':'')+'>Sí</option><option value="false"'+(!p.alertaFueraHorario?' selected':'')+'>No</option></select></div></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div></form>';
    openModal(html);
}
function savePol(e,id){
    e.preventDefault();var p=politicasMarcacion.find(function(x){return x.id===id;});
    p.toleranciaEntrada=+document.getElementById('pTE').value;p.toleranciaSalida=+document.getElementById('pTS').value;
    p.minSalidaSinExtra=+document.getElementById('pMSE').value;p.jornadaFlexible=document.getElementById('pFlex').value==='true';
    p.requiereUbicacion=document.getElementById('pUbi').value==='true';p.permiteMarcacionWeb=document.getElementById('pWeb').value==='true';
    p.alertaSinUbicacion=document.getElementById('pASU').value==='true';p.alertaFueraHorario=document.getElementById('pAFH').value==='true';
    closeModal();showToast('Política actualizada','success');renderModule('politicas');
}


// ===== DOCUMENTOS =====
function renderDocumentos(){
    var pend=documentosCargados.filter(function(d){return d.estado==='Pendiente de asociación';}).length;
    var html='<div class="section-title">Documentos / Permisos / Vacaciones</div>';
    html+='<div class="kpi-grid"><div class="kpi-card blue"><div class="kpi-value">'+documentosCargados.length+'</div><div class="kpi-label">Documentos</div></div><div class="kpi-card yellow"><div class="kpi-value">'+pend+'</div><div class="kpi-label">Pend. Asociación</div></div></div>';
    // Form
    html+='<div class="bio-card"><div class="bio-title">Nueva Carga Documental</div>';
    html+='<div class="filters-bar" style="box-shadow:none;padding:0;margin-bottom:10px"><label><input type="radio" name="dcT" value="asoc" checked onchange="toggleDocF()"> Asociada a empleado</label><label style="margin-left:12px"><input type="radio" name="dcT" value="gen" onchange="toggleDocF()"> Carga general</label></div>';
    html+='<div id="docFAsoc"><div class="form-row"><div class="form-group"><label>Buscar empleado</label><input type="text" id="docBusc" placeholder="Cédula o nombre"></div><div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="docBuscar()">Buscar</button></div></div><div id="docBRes"></div><div id="docFCampos" style="display:none"><div class="form-row"><div class="form-group"><label>Tipo documento</label><select id="docTD"><option>Permiso</option><option>Vacaciones</option><option>Incapacidad</option><option>Justificación de marca</option><option>Soporte de hora extra</option><option>Ausencia autorizada</option><option>Otro</option></select></div><div class="form-group"><label>Motivo</label><input type="text" id="docMot"></div></div><div class="form-row"><div class="form-group"><label>Fecha inicio</label><input type="date" id="docFI"></div><div class="form-group"><label>Fecha fin</label><input type="date" id="docFF"></div></div><div class="form-group"><label>Archivo</label><input type="file" class="w-100"></div><button class="btn btn-success" onclick="guardarDocAsoc()">Guardar</button></div></div>';
    html+='<div id="docFGen" style="display:none"><div class="form-row"><div class="form-group"><label>Empresa</label><select id="docGE">';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div><div class="form-group"><label>Tipo</label><select id="docGT"><option>Permiso general</option><option>Vacaciones</option><option>Comunicado</option><option>Justificación pendiente</option><option>Otro</option></select></div></div><div class="form-row"><div class="form-group"><label>Fecha inicio</label><input type="date" id="docGFI"></div><div class="form-group"><label>Fecha fin</label><input type="date" id="docGFF"></div></div><div class="form-group"><label>Motivo</label><input type="text" id="docGM"></div><div class="form-group"><label>Archivo</label><input type="file" class="w-100"></div><button class="btn btn-success" onclick="guardarDocGen()">Guardar general</button></div>';
    html+='</div>';
    // Tabla
    html+='<div class="section-title mt-2">Documentos Cargados</div>';
    html+='<div class="table-container"><table><thead><tr><th>Código</th><th>Tipo Carga</th><th>Empleado</th><th>Empresa</th><th>Tipo Doc.</th><th>Fecha</th><th>Estado</th><th>Cargado por</th><th>Acciones</th></tr></thead><tbody>';
    documentosCargados.forEach(function(d){
        html+='<tr><td>'+d.id+'</td><td>'+d.tipoCarga+'</td><td>'+(d.empleadoNombre||'<em class="text-muted">Sin asociar</em>')+'</td><td>'+getNombreEmpresa(d.empresa)+'</td><td>'+d.tipoDocumento+'</td><td>'+d.fechaInicio+'</td><td>'+badge(d.estado)+'</td><td>'+d.cargadoPor+'</td><td class="btn-group"><button class="btn btn-xs btn-outline" onclick="verDoc(\''+d.id+'\')">Ver</button>'+(d.estado==='Pendiente de asociación'?'<button class="btn btn-xs btn-primary" onclick="asocDoc(\''+d.id+'\')">Asociar</button>':'')+'</td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function toggleDocF(){var t=document.querySelector('input[name="dcT"]:checked').value;document.getElementById('docFAsoc').style.display=t==='asoc'?'block':'none';document.getElementById('docFGen').style.display=t==='gen'?'block':'none';}
function docBuscar(){
    var b=(document.getElementById('docBusc').value||'').toLowerCase();if(!b){showToast('Ingrese búsqueda','warning');return;}
    var res=empleados.filter(function(e){return e.nombre.toLowerCase().indexOf(b)>-1||e.cedula.indexOf(b)>-1;});
    var c=document.getElementById('docBRes');
    if(!res.length){c.innerHTML='<p class="text-muted mt-1">Sin resultados</p>';return;}
    var html='<table class="mt-1"><thead><tr><th>Cédula</th><th>Nombre</th><th>Depto</th><th></th></tr></thead><tbody>';
    res.forEach(function(e){html+='<tr><td>'+e.cedula+'</td><td>'+e.nombre+'</td><td>'+e.departamento+'</td><td><button class="btn btn-xs btn-primary" onclick="docSelEmp(\''+e.id+'\')">Seleccionar</button></td></tr>';});
    html+='</tbody></table>';c.innerHTML=html;
}
function docSelEmp(id){window._docEmp=empleados.find(function(e){return e.id===id;});document.getElementById('docBRes').innerHTML='<p class="text-success mt-1">✓ '+window._docEmp.nombre+' seleccionado</p>';document.getElementById('docFCampos').style.display='block';}
function guardarDocAsoc(){
    if(!window._docEmp){showToast('Seleccione empleado','warning');return;}
    var emp=window._docEmp;contadorDocs++;
    documentosCargados.unshift({id:'DOC'+String(contadorDocs).padStart(3,'0'),tipoCarga:'Asociada',cedula:emp.cedula,empleadoId:emp.id,empleadoNombre:emp.nombre,empresa:emp.empresa,departamento:emp.departamento,tipoDocumento:document.getElementById('docTD').value,fechaInicio:document.getElementById('docFI').value||'2024-01-15',fechaFin:document.getElementById('docFF').value||'2024-01-15',motivo:document.getElementById('docMot').value,archivo:'doc_'+contadorDocs+'.pdf',estado:'Cargado',cargadoPor:rolActual,fechaCarga:new Date().toISOString().slice(0,10),incidenciaRelacionada:'',historial:[]});
    window._docEmp=null;showToast('Documento cargado correctamente','success');renderModule('documentos');
}
function guardarDocGen(){
    contadorDocs++;
    documentosCargados.unshift({id:'DOC'+String(contadorDocs).padStart(3,'0'),tipoCarga:'General',cedula:'',empleadoId:'',empleadoNombre:'',empresa:document.getElementById('docGE').value,departamento:'',tipoDocumento:document.getElementById('docGT').value,fechaInicio:document.getElementById('docGFI').value||'2024-01-15',fechaFin:document.getElementById('docGFF').value||'2024-01-15',motivo:document.getElementById('docGM').value,archivo:'general_'+contadorDocs+'.pdf',estado:'Pendiente de asociación',cargadoPor:rolActual,fechaCarga:new Date().toISOString().slice(0,10),incidenciaRelacionada:'',historial:[]});
    showToast('Documento general cargado','success');renderModule('documentos');
}
function verDoc(id){var d=documentosCargados.find(function(x){return x.id===id;});var html='<div class="modal-header"><h3>Documento '+d.id+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="detail-grid"><div class="detail-item"><label>Tipo Carga</label><span>'+d.tipoCarga+'</span></div><div class="detail-item"><label>Empleado</label><span>'+(d.empleadoNombre||'Sin asociar')+'</span></div><div class="detail-item"><label>Empresa</label><span>'+getNombreEmpresa(d.empresa)+'</span></div><div class="detail-item"><label>Tipo</label><span>'+d.tipoDocumento+'</span></div><div class="detail-item"><label>Fecha</label><span>'+d.fechaInicio+' a '+d.fechaFin+'</span></div><div class="detail-item"><label>Motivo</label><span>'+(d.motivo||'—')+'</span></div><div class="detail-item"><label>Estado</label><span>'+badge(d.estado)+'</span></div><div class="detail-item"><label>Cargado por</label><span>'+d.cargadoPor+'</span></div></div>';openModal(html);}
function asocDoc(id){var html='<div class="modal-header"><h3>Asociar Empleado</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="form-group"><label>Buscar empleado</label><input type="text" id="asocB"></div><button class="btn btn-sm btn-primary mb-2" onclick="buscarAsoc(\''+id+'\')">Buscar</button><div id="asocRes"></div>';openModal(html);}
function buscarAsoc(docId){var b=(document.getElementById('asocB').value||'').toLowerCase();var res=empleados.filter(function(e){return e.nombre.toLowerCase().indexOf(b)>-1||e.cedula.indexOf(b)>-1;});var html='';res.forEach(function(e){html+='<div style="padding:6px;border-bottom:1px solid #eee"><button class="btn btn-xs btn-success" onclick="confAsoc(\''+docId+'\',\''+e.id+'\')">Asociar</button> '+e.nombre+' ('+e.cedula+')</div>';});document.getElementById('asocRes').innerHTML=html||'<p class="text-muted">Sin resultados</p>';}
function confAsoc(docId,empId){var d=documentosCargados.find(function(x){return x.id===docId;});var emp=empleados.find(function(e){return e.id===empId;});d.empleadoId=emp.id;d.empleadoNombre=emp.nombre;d.cedula=emp.cedula;d.departamento=emp.departamento;d.estado='Asociado a empleado';closeModal();showToast('Documento asociado a '+emp.nombre,'success');renderModule('documentos');}


// ===== PLANTILLAS DE HORARIO + GRUPOS + DEPARTAMENTOS =====
function renderPlantillas(){
    var html='<div class="d-flex justify-between align-center mb-2"><div class="section-title" style="margin-bottom:0">Plantillas, Grupos y Departamentos</div></div>';
    html+='<div class="tabs-section"><div class="tab-btn active" onclick="showPltTab(\'plantillas\')">📋 Plantillas</div><div class="tab-btn" onclick="showPltTab(\'grupos\')">👥 Grupos</div><div class="tab-btn" onclick="showPltTab(\'deptos\')">🏢 Departamentos</div></div>';
    html+='<div id="pltTabC">'+renderTabPlantillas()+'</div>';
    return html;
}
function showPltTab(t){document.querySelectorAll('.tabs-section .tab-btn').forEach(function(b,i){b.classList.toggle('active',['plantillas','grupos','deptos'][i]===t);});var c=document.getElementById('pltTabC');if(t==='plantillas')c.innerHTML=renderTabPlantillas();else if(t==='grupos')c.innerHTML=renderTabGrupos();else c.innerHTML=renderTabDeptos();}

function renderTabPlantillas(){
    var html='<div class="d-flex justify-between align-center mb-2"><span></span><button class="btn btn-primary" onclick="nuevaPlt()">+ Nueva Plantilla</button></div>';
    html+='<div class="table-container"><table><thead><tr><th>ID</th><th>Nombre</th><th>Resumen</th><th>Acciones</th></tr></thead><tbody>';
    plantillasHorario.forEach(function(p){
        var dias=['lun','mar','mie','jue','vie','sab','dom'],dn=['L','M','X','J','V','S','D'],res=[];
        dias.forEach(function(d,i){if(p.dias[d]&&p.dias[d].length>0){var t=p.dias[d];res.push(dn[i]+':'+t.length+'t');}});
        html+='<tr><td>'+p.id+'</td><td><strong>'+p.nombre+'</strong></td><td style="font-size:.78rem">'+(res.join(' | ')||'Sin horario')+'</td><td class="btn-group"><button class="btn btn-xs btn-outline" onclick="editPlt(\''+p.id+'\')">Editar</button><button class="btn btn-xs btn-danger" onclick="delPlt(\''+p.id+'\')">Eliminar</button></td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function nuevaPlt(){
    window._npTurnos={lun:[{entrada:'08:00',salida:'17:00'}],mar:[{entrada:'08:00',salida:'17:00'}],mie:[{entrada:'08:00',salida:'17:00'}],jue:[{entrada:'08:00',salida:'17:00'}],vie:[{entrada:'08:00',salida:'17:00'}],sab:[],dom:[]};
    var html='<div class="modal-header"><h3>Nueva Plantilla (Multi-turno)</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="form-group"><label>Nombre</label><input type="text" id="pltNom" required placeholder="Ej: Diurna L-V 8-17"></div>';
    html+='<div id="npTurnosC">'+renderNpTurnos()+'</div>';
    html+='<div class="d-flex justify-between mt-2"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="guardarPlt()">Guardar</button></div>';
    openModal(html);
}
function renderNpTurnos(){
    var dias=['lun','mar','mie','jue','vie','sab','dom'],dn=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],html='';
    dias.forEach(function(d,i){
        var turnos=window._npTurnos[d];
        html+='<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid #f0f0f0"><div style="min-width:36px;font-weight:600;font-size:.82rem;padding-top:5px">'+dn[i]+'</div><div style="flex:1">';
        if(!turnos.length)html+='<span class="text-muted" style="font-size:.78rem">Libre</span>';
        turnos.forEach(function(t,ti){html+='<div style="display:flex;gap:5px;align-items:center;margin-bottom:3px"><input type="time" value="'+t.entrada+'" style="padding:3px 5px;border:1px solid #dee2e6;border-radius:4px;font-size:.8rem" id="npe_'+d+'_'+ti+'"><span>-</span><input type="time" value="'+t.salida+'" style="padding:3px 5px;border:1px solid #dee2e6;border-radius:4px;font-size:.8rem" id="nps_'+d+'_'+ti+'"><button class="btn btn-xs btn-danger" onclick="npRmTurno(\''+d+'\','+ti+')">✕</button></div>';});
        html+='</div><button class="btn btn-xs btn-outline" onclick="npAddTurno(\''+d+'\')">+</button></div>';
    });
    return html;
}
function npAddTurno(d){npSaveDom();window._npTurnos[d].push({entrada:'08:00',salida:'17:00'});document.getElementById('npTurnosC').innerHTML=renderNpTurnos();}
function npRmTurno(d,i){npSaveDom();window._npTurnos[d].splice(i,1);document.getElementById('npTurnosC').innerHTML=renderNpTurnos();}
function npSaveDom(){var dias=['lun','mar','mie','jue','vie','sab','dom'];dias.forEach(function(d){window._npTurnos[d].forEach(function(t,ti){var e=document.getElementById('npe_'+d+'_'+ti);var s=document.getElementById('nps_'+d+'_'+ti);if(e)t.entrada=e.value;if(s)t.salida=s.value;});});}
function guardarPlt(){
    var nom=document.getElementById('pltNom').value;if(!nom){showToast('Nombre requerido','warning');return;}
    npSaveDom();var nd={};var dias=['lun','mar','mie','jue','vie','sab','dom'];
    dias.forEach(function(d){nd[d]=window._npTurnos[d].map(function(t){return{entrada:t.entrada,salida:t.salida};});});
    plantillasHorario.push({id:'PLT'+String(plantillasHorario.length+1).padStart(3,'0'),nombre:nom,dias:nd});
    closeModal();showToast('Plantilla creada','success');renderModule('plantillas');
}
function editPlt(id){
    var p=plantillasHorario.find(function(x){return x.id===id;});
    window._npTurnos={};var dias=['lun','mar','mie','jue','vie','sab','dom'];
    dias.forEach(function(d){window._npTurnos[d]=(p.dias[d]||[]).map(function(t){return{entrada:t.entrada,salida:t.salida};});});
    var html='<div class="modal-header"><h3>Editar - '+p.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<div class="form-group"><label>Nombre</label><input type="text" id="pltNom" value="'+p.nombre+'" required></div>';
    html+='<div id="npTurnosC">'+renderNpTurnos()+'</div>';
    html+='<div class="d-flex justify-between mt-2"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="savePltEdit(\''+id+'\')">Guardar</button></div>';
    openModal(html);
}
function savePltEdit(id){
    var p=plantillasHorario.find(function(x){return x.id===id;});
    p.nombre=document.getElementById('pltNom').value;npSaveDom();
    var dias=['lun','mar','mie','jue','vie','sab','dom'];
    dias.forEach(function(d){p.dias[d]=window._npTurnos[d].map(function(t){return{entrada:t.entrada,salida:t.salida};});});
    closeModal();showToast('Plantilla actualizada','success');renderModule('plantillas');
}
function delPlt(id){if(!confirm('¿Eliminar?'))return;plantillasHorario=plantillasHorario.filter(function(p){return p.id!==id;});showToast('Eliminada','success');renderModule('plantillas');}

// --- Tab Grupos ---
function renderTabGrupos(){
    var html='<div class="d-flex justify-between align-center mb-2"><span></span><div class="btn-group"><button class="btn btn-primary" onclick="modalNuevoGrupo()">+ Nuevo Grupo</button><button class="btn btn-warning" onclick="modalAsigGrupoMasivo()">🔄 Asignar grupo masivo</button></div></div>';
    html+='<div class="table-container"><table><thead><tr><th>ID</th><th>Nombre</th><th>Departamento</th><th>Empresa</th><th>Ubicación</th><th>Dirección</th><th>Acciones</th></tr></thead><tbody>';
    grupos.forEach(function(g){
        html+='<tr><td>'+g.id+'</td><td><strong>'+g.nombre+'</strong></td><td>'+g.departamento+'</td><td>'+getNombreEmpresa(g.empresa)+'</td><td><span class="badge '+(g.ubicacion==='Campo'?'badge-warning':'badge-info')+'">'+g.ubicacion+'</span></td><td style="font-size:.78rem">'+g.direccion+'</td><td><button class="btn btn-xs btn-outline" onclick="editGrupo(\''+g.id+'\')">Editar</button></td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function modalNuevoGrupo(){
    var html='<div class="modal-header"><h3>Nuevo Grupo</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarNuevoGrupo(event)"><div class="form-row"><div class="form-group"><label>Nombre</label><input type="text" id="ngNom" required placeholder="Ej: Grupo D"></div><div class="form-group"><label>Empresa</label><select id="ngEmp">';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div></div><div class="form-row"><div class="form-group"><label>Departamento</label><select id="ngDep"><option>Producción</option><option>Administración</option><option>Logística</option><option>Mantenimiento</option><option>Operaciones</option></select></div><div class="form-group"><label>Ubicación</label><select id="ngUbi"><option>Oficina</option><option>Campo</option></select></div></div>';
    html+='<div class="form-group"><label>Dirección / Coordenada</label><input type="text" id="ngDir" placeholder="Dirección física o coordenadas"></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Crear Grupo</button></div></form>';
    openModal(html);
}
function guardarNuevoGrupo(ev){
    ev.preventDefault();
    grupos.push({id:'GRP-'+String(grupos.length+1),nombre:document.getElementById('ngNom').value,departamento:document.getElementById('ngDep').value,empresa:document.getElementById('ngEmp').value,ubicacion:document.getElementById('ngUbi').value,direccion:document.getElementById('ngDir').value,latitud:'',longitud:'',descripcion:''});
    closeModal();showToast('Grupo creado','success');renderModule('plantillas');
}
function editGrupo(id){
    var g=grupos.find(function(x){return x.id===id;});
    var html='<div class="modal-header"><h3>Editar Grupo - '+g.nombre+'</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarEditGrupo(event,\''+id+'\')"><div class="form-row"><div class="form-group"><label>Nombre</label><input type="text" id="egNom" value="'+g.nombre+'" required></div><div class="form-group"><label>Departamento</label><select id="egDep">';
    ['Producción','Administración','Logística','Mantenimiento','Operaciones'].forEach(function(d){html+='<option'+(d===g.departamento?' selected':'')+'>'+d+'</option>';});
    html+='</select></div></div><div class="form-row"><div class="form-group"><label>Ubicación</label><select id="egUbi"><option'+(g.ubicacion==='Oficina'?' selected':'')+'>Oficina</option><option'+(g.ubicacion==='Campo'?' selected':'')+'>Campo</option></select></div><div class="form-group"><label>Dirección</label><input type="text" id="egDir" value="'+g.direccion+'"></div></div>';
    html+='<div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div></form>';
    openModal(html);
}
function guardarEditGrupo(ev,id){ev.preventDefault();var g=grupos.find(function(x){return x.id===id;});g.nombre=document.getElementById('egNom').value;g.departamento=document.getElementById('egDep').value;g.ubicacion=document.getElementById('egUbi').value;g.direccion=document.getElementById('egDir').value;closeModal();showToast('Grupo actualizado','success');renderModule('plantillas');}
function modalAsigGrupoMasivo(){
    var html='<div class="modal-header"><h3>Asignar Grupo Masivo</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<p class="mb-2">Seleccione el grupo destino y los empleados cambiarán de grupo.</p>';
    html+='<div class="form-row"><div class="form-group"><label>Grupo destino</label><select id="agGru">';
    grupos.forEach(function(g){html+='<option value="'+g.nombre+'">'+g.nombre+' ('+g.departamento+' - '+getNombreEmpresa(g.empresa)+')</option>';});
    html+='</select></div><div class="form-group"><label>Filtro empresa</label><select id="agEmp"><option value="">Todas</option>';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div></div>';
    html+='<div style="max-height:200px;overflow-y:auto;border:1px solid #dee2e6;border-radius:6px;margin-bottom:10px"><div style="padding:6px 10px;background:#f8f9fa;border-bottom:1px solid #dee2e6;font-weight:600;font-size:.82rem"><input type="checkbox" onchange="document.querySelectorAll(\'.ag-chk\').forEach(function(c){c.checked=this.checked}.bind(this))"> Seleccionar todos</div>';
    empleados.forEach(function(e){html+='<div style="padding:5px 10px;border-bottom:1px solid #f0f0f0;font-size:.84rem" data-emp="'+e.empresa+'"><input type="checkbox" class="ag-chk" value="'+e.id+'"> '+e.nombre+' <small class="text-muted">('+e.grupo+' | '+e.departamento+')</small></div>';});
    html+='</div>';
    html+='<div class="d-flex justify-between"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmarAsigGrupo()">Aplicar</button></div>';
    openModal(html);
}
function confirmarAsigGrupo(){
    var gruDest=document.getElementById('agGru').value;var chks=document.querySelectorAll('.ag-chk:checked');var c=0;
    var grp=grupos.find(function(g){return g.nombre===gruDest;});
    chks.forEach(function(ch){var emp=empleados.find(function(e){return e.id===ch.value;});if(emp){emp.grupo=gruDest;if(grp){emp.lugarTrabajo=grp.ubicacion;emp.direccionTrabajo=grp.direccion;}c++;}});
    closeModal();showToast(c+' empleados asignados a '+gruDest,'success');
}

// --- Tab Departamentos ---
function renderTabDeptos(){
    var deptos=[];empresas.forEach(function(emp){var deptosEmp=[...new Set(empleados.filter(function(e){return e.empresa===emp.codigo;}).map(function(e){return e.departamento;}))];deptosEmp.forEach(function(d){deptos.push({nombre:d,empresa:emp.codigo});});});
    var html='<div class="d-flex justify-between align-center mb-2"><span></span><button class="btn btn-primary" onclick="modalNuevoDepto()">+ Nuevo Departamento</button></div>';
    html+='<div class="table-container"><table><thead><tr><th>Departamento</th><th>Empresa</th><th>Empleados</th><th>Grupos</th></tr></thead><tbody>';
    deptos.forEach(function(d){
        var emps=empleados.filter(function(e){return e.empresa===d.empresa&&e.departamento===d.nombre;}).length;
        var grps=grupos.filter(function(g){return g.empresa===d.empresa&&g.departamento===d.nombre;}).length;
        html+='<tr><td><strong>'+d.nombre+'</strong></td><td>'+getNombreEmpresa(d.empresa)+'</td><td>'+emps+'</td><td>'+grps+'</td></tr>';
    });
    html+='</tbody></table></div>';return html;
}
function modalNuevoDepto(){
    var html='<div class="modal-header"><h3>Nuevo Departamento</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>';
    html+='<form onsubmit="guardarNuevoDepto(event)"><div class="form-row"><div class="form-group"><label>Nombre Departamento</label><input type="text" id="ndNom" required placeholder="Ej: Calidad"></div><div class="form-group"><label>Empresa</label><select id="ndEmp">';
    empresas.forEach(function(e){html+='<option value="'+e.codigo+'">'+e.nombre+'</option>';});
    html+='</select></div></div><div class="d-flex justify-between mt-2"><button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button type="submit" class="btn btn-primary">Crear</button></div></form>';
    openModal(html);
}
function guardarNuevoDepto(ev){
    ev.preventDefault();var nom=document.getElementById('ndNom').value;
    showToast('Departamento "'+nom+'" creado','success');closeModal();renderModule('plantillas');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    renderModule('dashboard');
});
