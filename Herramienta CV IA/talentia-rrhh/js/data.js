// ========== DATOS SIMULADOS ==========

const USUARIOS = [
    { email: 'admin@rrhh.com', password: 'admin123', nombre: 'Carlos Méndez', rol: 'Administrador RRHH' },
    { email: 'reclutador@rrhh.com', password: 'reclutador123', nombre: 'Ana García', rol: 'Reclutador' },
    { email: 'gerencia@rrhh.com', password: 'gerencia123', nombre: 'Roberto Silva', rol: 'Gerencia' }
];

const PAISES = ['Guatemala', 'Honduras', 'El Salvador', 'Costa Rica', 'Panamá'];
const AREAS = ['Operaciones', 'Comercial', 'Recursos Humanos', 'Tecnología', 'Logística', 'Finanzas'];
const FUENTES = ['API externa', 'Correo electrónico', 'Carga manual'];

const ESTADOS_CANDIDATO = [
    'Nuevo', 'Procesado por IA', 'Pendiente de revisión', 'En primer filtro',
    'Descartado', 'Seleccionado', 'En entrevista', 'No está en entrevista',
    'Contratado', 'En pool futuro', 'Dado de baja', 'Oculto'
];

const ESTADOS_VACANTE = [
    'Disponible', 'No disponible', 'Abierta', 'Cerrada', 'Reactivada',
    'Clonada', 'En evaluación', 'En entrevistas', 'Finalizada'
];

const RAZONES_DESCARTE = [
    'No cumple experiencia mínima', 'No cumple formación requerida',
    'No cumple habilidades clave', 'No se ajusta al perfil',
    'Información insuficiente en el CV', 'Candidato no disponible', 'Otro'
];

const RAZONES_BAJA = [
    'Candidato solicitó no continuar', 'Datos duplicados',
    'Información inválida', 'No desea ser contactado',
    'Proceso cerrado', 'Otro'
];

// Tabla de ponderación base para primer filtro
const PONDERACION_BASE = [
    { criterio: 'Experiencia laboral', pregunta: '¿El candidato tiene la experiencia mínima requerida para el puesto?', peso: 30, tipo: 'evaluacion' },
    { criterio: 'Formación académica', pregunta: '¿El candidato cumple con la formación solicitada?', peso: 20, tipo: 'evaluacion' },
    { criterio: 'Habilidades técnicas', pregunta: '¿El CV evidencia las habilidades técnicas necesarias?', peso: 20, tipo: 'evaluacion' },
    { criterio: 'Responsabilidades previas', pregunta: '¿Ha realizado funciones similares a las responsabilidades del cargo?', peso: 15, tipo: 'evaluacion' },
    { criterio: 'Estabilidad laboral', pregunta: '¿El historial laboral muestra permanencia razonable en sus empleos?', peso: 10, tipo: 'evaluacion' },
    { criterio: 'Ubicación / disponibilidad', pregunta: '¿La ubicación o disponibilidad del candidato se ajusta a la necesidad?', peso: 5, tipo: 'evaluacion' }
];

// Preguntas configurables por tipo de puesto
const PREGUNTAS_POR_PUESTO = {
    'Analista de Procesos': [
        '¿Tiene experiencia previa en análisis o mejora de procesos?',
        '¿Maneja herramientas de mapeo de procesos?',
        '¿Ha trabajado con metodologías Lean o Six Sigma?',
        '¿Tiene experiencia con herramientas de BI o analítica?',
        '¿Cuenta con formación en ingeniería o administración?',
        '¿Ha liderado proyectos de mejora continua?'
    ],
    'Auxiliar de Bodega': [
        '¿Tiene experiencia en bodega o inventarios?',
        '¿Ha trabajado con carga, despacho o recepción de mercadería?',
        '¿Tiene disponibilidad para horarios rotativos?',
        '¿Cuenta con licencia o certificación requerida?',
        '¿Tiene experiencia usando sistemas de inventario?'
    ],
    'Ejecutivo Comercial': [
        '¿Tiene experiencia previa en ventas B2B?',
        '¿Maneja herramientas CRM?',
        '¿Ha trabajado con metas comerciales mensuales?',
        '¿Tiene experiencia en atención al cliente?',
        '¿Cuenta con disponibilidad para visitas en campo?',
        '¿Tiene formación en mercadeo o administración?'
    ],
    'Mecánico Especializado': [
        '¿Tiene experiencia en mantenimiento de maquinaria pesada?',
        '¿Cuenta con formación técnica en mecánica industrial?',
        '¿Ha trabajado con diagnóstico de fallas?',
        '¿Tiene certificaciones en equipos específicos?',
        '¿Tiene disponibilidad para trabajo en campo?'
    ],
    'Coordinador de Reclutamiento': [
        '¿Tiene experiencia liderando equipos de reclutamiento?',
        '¿Ha gestionado procesos de selección masiva?',
        '¿Tiene experiencia con ATS o plataformas de reclutamiento?',
        '¿Ha trabajado con employer branding?',
        '¿Cuenta con formación en psicología o RRHH?',
        '¿Tiene experiencia en entrevistas por competencias?'
    ]
};

const PLANTILLAS = [
    {
        id: 1, nombre: 'Analista de Procesos', area: 'Operaciones', pais: 'Guatemala',
        nivel: 'Profesional', descripcion: 'Responsable de analizar y optimizar procesos operativos.',
        formacion: 'Ingeniería Industrial o Administración', experiencia: 3,
        habilidades_requeridas: ['Mapeo de procesos', 'Excel avanzado', 'Lean Six Sigma', 'Power BI'],
        habilidades_deseables: ['SAP', 'Python', 'Gestión de proyectos'],
        certificaciones: ['Lean Six Sigma Green Belt'], idiomas: ['Español', 'Inglés intermedio'],
        pesos: { experiencia: 30, formacion: 20, habilidades: 25, certificaciones: 10, idiomas: 5, estabilidad: 10 },
        criterios_excluyentes: ['Formación universitaria completa', 'Mínimo 3 años de experiencia'],
        criterios_deseables: ['Experiencia en manufactura', 'Certificación PMP'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: PREGUNTAS_POR_PUESTO['Analista de Procesos']
    },
    {
        id: 2, nombre: 'Auxiliar de Bodega', area: 'Logística', pais: 'Honduras',
        nivel: 'Operativo', descripcion: 'Encargado de recepción, despacho y control de inventario.',
        formacion: 'Bachiller en cualquier especialidad', experiencia: 1,
        habilidades_requeridas: ['Control de inventario', 'SAP básico', 'Excel básico', 'Trabajo en equipo'],
        habilidades_deseables: ['Licencia de montacargas', 'Manejo de WMS'],
        certificaciones: [], idiomas: ['Español'],
        pesos: { experiencia: 25, formacion: 15, habilidades: 30, certificaciones: 5, idiomas: 5, estabilidad: 20 },
        criterios_excluyentes: ['Bachillerato completo'],
        criterios_deseables: ['Experiencia en logística', 'Disponibilidad de horario'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: PREGUNTAS_POR_PUESTO['Auxiliar de Bodega']
    },
    {
        id: 3, nombre: 'Ejecutivo Comercial', area: 'Comercial', pais: 'Guatemala',
        nivel: 'Profesional', descripcion: 'Responsable de gestión de cartera y cierre de ventas.',
        formacion: 'Licenciatura en Mercadeo o Administración', experiencia: 2,
        habilidades_requeridas: ['Ventas consultivas', 'CRM', 'Negociación', 'Servicio al cliente'],
        habilidades_deseables: ['Salesforce', 'Marketing digital', 'Power BI'],
        certificaciones: [], idiomas: ['Español', 'Inglés avanzado'],
        pesos: { experiencia: 25, formacion: 20, habilidades: 25, certificaciones: 5, idiomas: 15, estabilidad: 10 },
        criterios_excluyentes: ['Licenciatura completa', 'Experiencia en ventas B2B'],
        criterios_deseables: ['Vehículo propio', 'Cartera de clientes'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: PREGUNTAS_POR_PUESTO['Ejecutivo Comercial']
    },
    {
        id: 4, nombre: 'Mecánico Especializado', area: 'Operaciones', pais: 'El Salvador',
        nivel: 'Técnico', descripcion: 'Técnico especializado en maquinaria pesada y mantenimiento preventivo.',
        formacion: 'Técnico en Mecánica Industrial', experiencia: 4,
        habilidades_requeridas: ['Mantenimiento preventivo', 'Diagnóstico de fallas', 'Soldadura', 'Hidráulica'],
        habilidades_deseables: ['CAT', 'Komatsu', 'Electromecánica'],
        certificaciones: ['Certificación en maquinaria pesada'], idiomas: ['Español'],
        pesos: { experiencia: 35, formacion: 15, habilidades: 30, certificaciones: 10, idiomas: 0, estabilidad: 10 },
        criterios_excluyentes: ['Técnico graduado', 'Experiencia en maquinaria pesada'],
        criterios_deseables: ['Disponibilidad para viajar', 'Licencia pesada'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: PREGUNTAS_POR_PUESTO['Mecánico Especializado']
    },
    {
        id: 5, nombre: 'Coordinador de Reclutamiento', area: 'Recursos Humanos', pais: 'Costa Rica',
        nivel: 'Profesional', descripcion: 'Coordina procesos de selección y atracción de talento.',
        formacion: 'Psicología o Administración de RRHH', experiencia: 3,
        habilidades_requeridas: ['Reclutamiento', 'Entrevista por competencias', 'ATS', 'Employer branding'],
        habilidades_deseables: ['LinkedIn Recruiter', 'Assessment center', 'Power BI'],
        certificaciones: ['SHRM-CP'], idiomas: ['Español', 'Inglés avanzado'],
        pesos: { experiencia: 25, formacion: 20, habilidades: 25, certificaciones: 10, idiomas: 10, estabilidad: 10 },
        criterios_excluyentes: ['Licenciatura completa', 'Experiencia en reclutamiento masivo'],
        criterios_deseables: ['Experiencia en headhunting', 'Conocimiento de derecho laboral'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: PREGUNTAS_POR_PUESTO['Coordinador de Reclutamiento']
    }
];

const VACANTES = [
    { id: 1, codigo: 'VAC-2026-001', nombre: 'Analista de Procesos', area: 'Operaciones', pais: 'Guatemala', reclutador: 'Ana García', fecha_apertura: '2026-05-15', estado: 'Abierta', disponibilidad: 'Disponible', plantilla_id: 1, candidatos_recibidos: 18, candidatos_procesados: 15, preseleccionados: 4, pendientes: 3 },
    { id: 2, codigo: 'VAC-2026-002', nombre: 'Auxiliar de Bodega', area: 'Logística', pais: 'Honduras', reclutador: 'Ana García', fecha_apertura: '2026-05-20', estado: 'Abierta', disponibilidad: 'Disponible', plantilla_id: 2, candidatos_recibidos: 12, candidatos_procesados: 10, preseleccionados: 3, pendientes: 2 },
    { id: 3, codigo: 'VAC-2026-003', nombre: 'Ejecutivo Comercial', area: 'Comercial', pais: 'Guatemala', reclutador: 'Carlos Méndez', fecha_apertura: '2026-06-01', estado: 'En entrevistas', disponibilidad: 'Disponible', plantilla_id: 3, candidatos_recibidos: 10, candidatos_procesados: 9, preseleccionados: 3, pendientes: 1 },
    { id: 4, codigo: 'VAC-2026-004', nombre: 'Mecánico Especializado', area: 'Operaciones', pais: 'El Salvador', reclutador: 'Carlos Méndez', fecha_apertura: '2026-06-10', estado: 'Abierta', disponibilidad: 'Disponible', plantilla_id: 4, candidatos_recibidos: 7, candidatos_procesados: 6, preseleccionados: 2, pendientes: 1 },
    { id: 5, codigo: 'VAC-2026-005', nombre: 'Coordinador de Reclutamiento', area: 'Recursos Humanos', pais: 'Costa Rica', reclutador: 'Ana García', fecha_apertura: '2026-06-15', estado: 'En evaluación', disponibilidad: 'Disponible', plantilla_id: 5, candidatos_recibidos: 3, candidatos_procesados: 2, preseleccionados: 1, pendientes: 1 }
];

const NOMBRES = ['María López', 'Juan Pérez', 'Andrea Martínez', 'Carlos Ramírez', 'Lucía Hernández', 'Pedro Morales', 'Sofía Castillo', 'Diego Rivera', 'Valentina Cruz', 'Fernando Aguilar', 'Camila Ortiz', 'Roberto Flores', 'Isabella Torres', 'Andrés Vega', 'Daniela Soto', 'Miguel Jiménez', 'Paula Rivas', 'Gabriel Navarro', 'Natalia Vargas', 'Sebastián Rojas', 'Laura Mendoza', 'Alejandro Pineda', 'Carolina Estrada', 'Javier Monroy', 'Mariana Solís', 'Ricardo Campos', 'Valeria Herrera', 'Eduardo Paredes', 'Mónica Lemus', 'Francisco Argueta', 'Adriana Paz', 'Óscar Sandoval', 'Renata Mejía', 'Héctor Barrios', 'Lorena Guzmán', 'Emilio Cordón', 'Fernanda Reyes', 'Tomás Salazar', 'Paola Girón', 'Arturo Velásquez', 'Sara Moreno', 'Iván Cáceres', 'Diana Portillo', 'Raúl Cifuentes', 'Catalina Alonzo', 'Sergio Bautista', 'Viviana Ponce', 'Manuel Tobar', 'Elena Dávila', 'Rodrigo Escobar'];

const HABILIDADES_POOL = [
    'Excel avanzado', 'Power BI', 'SAP', 'Python', 'Lean Six Sigma', 'Gestión de proyectos',
    'Reclutamiento', 'Servicio al cliente', 'Ventas consultivas', 'CRM', 'Negociación',
    'Liderazgo', 'Trabajo en equipo', 'Comunicación efectiva', 'SQL', 'Tableau',
    'Control de inventario', 'Soldadura', 'Hidráulica', 'Mantenimiento preventivo',
    'Entrevista por competencias', 'LinkedIn Recruiter', 'Marketing digital',
    'Mapeo de procesos', 'Employer branding', 'Salesforce', 'ATS'
];

const FORMACIONES = [
    'Ingeniería Industrial', 'Administración de Empresas', 'Psicología',
    'Licenciatura en Mercadeo', 'Técnico en Mecánica Industrial', 'Bachiller',
    'Ingeniería en Sistemas', 'Administración de RRHH', 'Contaduría Pública',
    'Ingeniería Mecánica'
];

const EMPRESAS = [
    'Grupo Terra', 'Cementos Progreso', 'BAC Credomatic', 'Walmart Centroamérica',
    'Pollo Campero', 'Cervecería Centro Americana', 'Tigo', 'Claro',
    'DHL', 'Nestlé', 'PriceSmart', 'Auto Mercado', 'Accenture', 'KPMG'
];

function generarCandidatos() {
    const candidatos = [];
    const scores = [95, 92, 91, 88, 86, 85, 82, 79, 77, 76, 75, 73, 71, 68, 66, 64, 62, 60, 58, 55, 53, 50, 48, 45, 42, 40, 38, 35, 33, 30, 94, 87, 83, 78, 72, 69, 65, 61, 56, 47, 93, 89, 84, 74, 67, 57, 44, 36, 90, 80];
    const recomendaciones = { high: 'Altamente recomendado', good: 'Recomendado', medium: 'Revisar manualmente', low: 'Bajo ajuste', veryLow: 'No priorizado' };

    for (let i = 0; i < 50; i++) {
        const score = scores[i];
        let recomendacion, estado;
        if (score >= 90) { recomendacion = recomendaciones.high; estado = 'Seleccionado'; }
        else if (score >= 75) { recomendacion = recomendaciones.good; estado = 'Procesado por IA'; }
        else if (score >= 60) { recomendacion = recomendaciones.medium; estado = 'Pendiente de revisión'; }
        else if (score >= 40) { recomendacion = recomendaciones.low; estado = 'En primer filtro'; }
        else { recomendacion = recomendaciones.veryLow; estado = 'Descartado'; }

        if (i === 3) estado = 'En entrevista';
        if (i === 7) estado = 'Contratado';
        if (i === 12) estado = 'Descartado';
        if (i === 15) estado = 'En pool futuro';
        if (i === 20) estado = 'Nuevo';
        if (i === 25) estado = 'En pool futuro';
        if (i === 28) estado = 'Dado de baja';
        if (i === 35) estado = 'Oculto';
        if (i === 38) estado = 'No está en entrevista';

        const vacanteIdx = i % 5;
        const fuenteIdx = i % 3;
        const habilidades = [];
        for (let h = 0; h < 4 + Math.floor(Math.random() * 4); h++) {
            const hab = HABILIDADES_POOL[Math.floor(Math.random() * HABILIDADES_POOL.length)];
            if (!habilidades.includes(hab)) habilidades.push(hab);
        }

        candidatos.push({
            id: i + 1, nombre: NOMBRES[i],
            correo: NOMBRES[i].toLowerCase().replace(/\s/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '@email.com',
            telefono: `+502 ${Math.floor(3000 + Math.random() * 7000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            vacante_id: vacanteIdx + 1, vacante_nombre: VACANTES[vacanteIdx].nombre,
            fuente: FUENTES[fuenteIdx],
            fecha_recepcion: `2026-06-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
            score: score, recomendacion: recomendacion, estado: estado,
            formacion: FORMACIONES[i % FORMACIONES.length],
            experiencia_anios: Math.floor(1 + Math.random() * 10),
            habilidades: habilidades,
            habilidades_blandas: ['Liderazgo', 'Trabajo en equipo', 'Comunicación efectiva', 'Resolución de conflictos'].slice(0, 2 + Math.floor(Math.random() * 3)),
            certificaciones: i % 4 === 0 ? ['Lean Six Sigma Green Belt'] : i % 5 === 0 ? ['PMP', 'SHRM-CP'] : [],
            idiomas: i % 3 === 0 ? ['Español', 'Inglés avanzado'] : ['Español'],
            empresas_anteriores: [EMPRESAS[i % EMPRESAS.length], EMPRESAS[(i + 3) % EMPRESAS.length]],
            puestos_anteriores: ['Analista Junior', 'Coordinador', 'Asistente', 'Supervisor', 'Especialista'][i % 5],
            ubicacion: PAISES[i % PAISES.length],
            resumen: `Profesional con ${Math.floor(1 + Math.random() * 10)} años de experiencia en el área. Orientado a resultados con habilidades demostradas en gestión y análisis.`,
            ultima_experiencia: `${['Analista', 'Coordinador', 'Supervisor', 'Ejecutivo', 'Asistente'][i % 5]} en ${EMPRESAS[i % EMPRESAS.length]}`,
            es_historico: false,
            razon_descarte: i === 12 ? 'No cumple experiencia mínima' : null,
            razon_baja: i === 28 ? 'Candidato solicitó no continuar' : null,
            evaluacion_filtro: null
        });
    }
    return candidatos;
}

let CANDIDATOS = generarCandidatos();

const CORREOS_SIMULADOS = [
    { id: 1, remitente: 'maria.lopez@gmail.com', asunto: 'Postulación Analista de Procesos', fecha: '2026-06-20', vacante_detectada: 'Analista de Procesos', archivo: 'CV_Maria_Lopez.pdf', estado: 'Procesado' },
    { id: 2, remitente: 'juan.perez@outlook.com', asunto: 'CV para vacante de bodega', fecha: '2026-06-21', vacante_detectada: 'Auxiliar de Bodega', archivo: 'CV_Juan_Perez.pdf', estado: 'Procesado' },
    { id: 3, remitente: 'andrea.mtz@yahoo.com', asunto: 'Aplicación puesto comercial', fecha: '2026-06-22', vacante_detectada: 'Ejecutivo Comercial', archivo: 'CV_Andrea_Martinez.docx', estado: 'Pendiente' },
    { id: 4, remitente: 'carlos.r@hotmail.com', asunto: 'Interesado en vacante mecánico', fecha: '2026-06-23', vacante_detectada: 'Mecánico Especializado', archivo: 'CV_Carlos_Ramirez.pdf', estado: 'Pendiente' },
    { id: 5, remitente: 'lucia.h@gmail.com', asunto: 'Mi hoja de vida adjunta', fecha: '2026-06-24', vacante_detectada: 'No detectada', archivo: 'HV_Lucia.pdf', estado: 'Pendiente' },
    { id: 6, remitente: 'pedro.m@empresa.com', asunto: 'Re: Información sobre empleo', fecha: '2026-06-24', vacante_detectada: 'No aplica', archivo: null, estado: 'Sin CV adjunto' },
    { id: 7, remitente: 'sofia.cast@gmail.com', asunto: 'Postulación Coordinador RRHH', fecha: '2026-06-25', vacante_detectada: 'Coordinador de Reclutamiento', archivo: 'CV_Sofia_Castillo.pdf', estado: 'Procesado' },
    { id: 8, remitente: 'diego.rv@outlook.com', asunto: 'CV Ejecutivo Comercial', fecha: '2026-06-25', vacante_detectada: 'Ejecutivo Comercial', archivo: 'CV_Diego_Rivera.pdf', estado: 'Pendiente' },
    { id: 9, remitente: 'val.cruz@gmail.com', asunto: 'Envío de curriculum', fecha: '2026-06-26', vacante_detectada: 'Analista de Procesos', archivo: 'CV_Valentina_Cruz.pdf', estado: 'Error' },
    { id: 10, remitente: 'fernando.ag@yahoo.com', asunto: 'Postulación operaciones', fecha: '2026-06-27', vacante_detectada: 'Mecánico Especializado', archivo: 'CV_Fernando_Aguilar.pdf', estado: 'Pendiente' }
];

let TRAZABILIDAD = [
    { id: 1, fecha: '2026-06-15 08:30', usuario: 'Sistema', tipo: 'Importación', descripcion: 'Candidatos importados desde API externa', entidad: 'API Externa', estado_anterior: '-', estado_nuevo: 'Importado' },
    { id: 2, fecha: '2026-06-15 09:00', usuario: 'Sistema', tipo: 'Procesamiento', descripcion: 'CV procesado automáticamente', entidad: 'María López', estado_anterior: 'Nuevo', estado_nuevo: 'Procesado por IA' },
    { id: 3, fecha: '2026-06-16 10:15', usuario: 'Ana García', tipo: 'Selección', descripcion: 'Candidato seleccionado por reclutador', entidad: 'María López', estado_anterior: 'Procesado por IA', estado_nuevo: 'Seleccionado' },
    { id: 4, fecha: '2026-06-16 14:30', usuario: 'Sistema', tipo: 'Correo', descripcion: 'Candidato recibido por correo electrónico', entidad: 'Juan Pérez', estado_anterior: '-', estado_nuevo: 'Nuevo' },
    { id: 5, fecha: '2026-06-17 08:45', usuario: 'Sistema', tipo: 'IA', descripcion: 'IA generó scoring: 88% - Recomendado', entidad: 'Juan Pérez', estado_anterior: 'Nuevo', estado_nuevo: 'Procesado por IA' },
    { id: 6, fecha: '2026-06-17 11:00', usuario: 'Carlos Méndez', tipo: 'Carga manual', descripcion: 'Candidato cargado manualmente al sistema', entidad: 'Andrea Martínez', estado_anterior: '-', estado_nuevo: 'Nuevo' },
    { id: 7, fecha: '2026-06-18 09:20', usuario: 'Ana García', tipo: 'Observación', descripcion: 'Reclutador agregó observación al candidato', entidad: 'Carlos Ramírez', estado_anterior: '-', estado_nuevo: '-' },
    { id: 8, fecha: '2026-06-18 15:00', usuario: 'Ana García', tipo: 'Pool', descripcion: 'Candidato fue enviado a pool futuro', entidad: 'Pedro Morales', estado_anterior: 'En primer filtro', estado_nuevo: 'En pool futuro' },
    { id: 9, fecha: '2026-06-19 10:30', usuario: 'Sistema', tipo: 'Error', descripcion: 'Error de lectura de documento - formato no soportado', entidad: 'CV_corrupto.xyz', estado_anterior: '-', estado_nuevo: 'Error' },
    { id: 10, fecha: '2026-06-19 16:45', usuario: 'Carlos Méndez', tipo: 'Vacante cerrada', descripcion: 'Vacante cerrada por llenado de posición', entidad: 'VAC-2026-003', estado_anterior: 'Abierta', estado_nuevo: 'Cerrada' },
    { id: 11, fecha: '2026-06-20 08:00', usuario: 'Sistema', tipo: 'Importación', descripcion: 'Sincronización API - 5 candidatos importados', entidad: 'API Externa', estado_anterior: '-', estado_nuevo: 'Importado' },
    { id: 12, fecha: '2026-06-20 11:30', usuario: 'Sistema', tipo: 'Primer filtro', descripcion: 'Evaluación de primer filtro ejecutada', entidad: 'Fernando Aguilar', estado_anterior: 'Nuevo', estado_nuevo: 'En primer filtro' },
    { id: 13, fecha: '2026-06-21 09:15', usuario: 'Ana García', tipo: 'Asociación', descripcion: 'Candidato fue asociado a otra vacante', entidad: 'Sofía Castillo', estado_anterior: 'Pool futuro', estado_nuevo: 'Nuevo' },
    { id: 14, fecha: '2026-06-22 14:00', usuario: 'Sistema', tipo: 'Error', descripcion: 'Error de integración con API externa - timeout', entidad: 'API Externa', estado_anterior: '-', estado_nuevo: 'Error' },
    { id: 15, fecha: '2026-06-23 10:00', usuario: 'Carlos Méndez', tipo: 'Entrevista', descripcion: 'Candidato enviado a entrevista', entidad: 'Diego Rivera', estado_anterior: 'Seleccionado', estado_nuevo: 'En entrevista' },
    { id: 16, fecha: '2026-06-24 09:00', usuario: 'Ana García', tipo: 'Descarte', descripcion: 'Candidato descartado - No cumple experiencia mínima', entidad: 'Isabella Torres', estado_anterior: 'En primer filtro', estado_nuevo: 'Descartado' },
    { id: 17, fecha: '2026-06-25 11:00', usuario: 'Ana García', tipo: 'Baja', descripcion: 'Candidato dado de baja - Solicitó no continuar', entidad: 'Mónica Lemus', estado_anterior: 'Pendiente de revisión', estado_nuevo: 'Dado de baja' }
];

// Funciones auxiliares
function getScoreClass(score) {
    if (score >= 90) return 'score-high';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-medium';
    if (score >= 40) return 'score-low';
    return 'score-very-low';
}

function getEstadoBadge(estado) {
    const map = {
        'Nuevo': 'badge-blue', 'Procesado por IA': 'badge-purple', 'Pendiente de revisión': 'badge-yellow',
        'En primer filtro': 'badge-orange', 'Descartado': 'badge-red', 'Seleccionado': 'badge-green',
        'En entrevista': 'badge-blue', 'No está en entrevista': 'badge-gray',
        'Contratado': 'badge-green', 'En pool futuro': 'badge-orange',
        'Dado de baja': 'badge-red', 'Oculto': 'badge-gray',
        'Disponible': 'badge-green', 'No disponible': 'badge-red',
        'Abierta': 'badge-green', 'Cerrada': 'badge-gray', 'Reactivada': 'badge-blue',
        'Clonada': 'badge-purple', 'En evaluación': 'badge-yellow',
        'En entrevistas': 'badge-blue', 'Finalizada': 'badge-gray',
        'Procesado': 'badge-green', 'Pendiente': 'badge-yellow', 'Error': 'badge-red',
        'Sin CV adjunto': 'badge-gray', 'Activa': 'badge-green', 'Inactiva': 'badge-gray'
    };
    return map[estado] || 'badge-gray';
}

function generarObservacionIA(candidato) {
    const score = candidato.score;
    if (score >= 90) {
        return { resumen: `${candidato.nombre} presenta un perfil excepcional con un ajuste del ${score}% al puesto.`, fortalezas: ['Experiencia superior a la requerida', 'Habilidades técnicas completas', 'Formación académica alineada', 'Estabilidad laboral demostrada'], brechas: ['Sin brechas significativas identificadas'], alertas: [], explicacion: `El candidato presenta un ajuste del ${score}% al perfil solicitado. Cumple con todos los requisitos críticos y varios deseables. Se recomienda avanzar directamente a entrevista.` };
    } else if (score >= 75) {
        return { resumen: `${candidato.nombre} muestra un buen ajuste del ${score}% al perfil.`, fortalezas: ['Experiencia relevante en el área', 'Habilidades técnicas principales cubiertas', 'Buena formación académica'], brechas: ['No se identificaron todas las certificaciones requeridas', 'Experiencia ligeramente inferior en un área'], alertas: ['Verificar certificaciones mencionadas'], explicacion: `El candidato presenta un ajuste del ${score}% al perfil solicitado. Cumple con la experiencia mínima requerida y posee habilidades técnicas relacionadas. No se identificaron certificaciones solicitadas. Se recomienda avanzar a revisión del reclutador.` };
    } else if (score >= 60) {
        return { resumen: `${candidato.nombre} presenta un ajuste moderado del ${score}%.`, fortalezas: ['Experiencia parcialmente relacionada', 'Algunas habilidades relevantes identificadas'], brechas: ['Formación no completamente alineada', 'Experiencia inferior a la requerida', 'Faltan habilidades técnicas clave'], alertas: ['Experiencia no relacionada directamente', 'Falta información clave en CV'], explicacion: `El candidato presenta un ajuste del ${score}% al perfil. Cumple parcialmente con los requisitos. Se sugiere revisión manual por el reclutador para evaluar potencial.` };
    } else if (score >= 40) {
        return { resumen: `${candidato.nombre} presenta un bajo ajuste del ${score}% al perfil.`, fortalezas: ['Disposición al aprendizaje inferida', 'Experiencia general en el mercado laboral'], brechas: ['Formación no alineada al puesto', 'Experiencia insuficiente', 'Habilidades técnicas requeridas no identificadas'], alertas: ['Alta rotación laboral', 'CV incompleto o poco estructurado'], explicacion: `El candidato presenta un ajuste del ${score}% al perfil. No cumple con varios requisitos críticos. Se recomienda no priorizar para esta vacante.` };
    } else {
        return { resumen: `${candidato.nombre} presenta un ajuste muy bajo del ${score}%.`, fortalezas: ['Experiencia laboral general'], brechas: ['No cumple formación requerida', 'Experiencia no relacionada', 'Sin habilidades técnicas requeridas'], alertas: ['Perfil fuerte para otra vacante', 'CV incompleto o poco estructurado'], explicacion: `El candidato presenta un ajuste del ${score}% al perfil. No se recomienda para esta vacante. Se sugiere enviar a pool para futuras oportunidades.` };
    }
}

// Simulación de evaluación de primer filtro
function evaluarPrimerFiltro(candidato) {
    const resultados = ['Cumple', 'Cumple parcialmente', 'No cumple', 'No identificado'];
    const pesos = [30, 20, 20, 15, 10, 5];
    let totalScore = 0;
    const evaluacion = PONDERACION_BASE.map((item, idx) => {
        let resultado;
        const score = candidato.score;
        if (score >= 85) resultado = Math.random() > 0.2 ? 'Cumple' : 'Cumple parcialmente';
        else if (score >= 65) resultado = resultados[Math.floor(Math.random() * 2)];
        else if (score >= 45) resultado = resultados[Math.floor(Math.random() * 3)];
        else resultado = resultados[1 + Math.floor(Math.random() * 3)];
        
        let puntaje = 0;
        if (resultado === 'Cumple') puntaje = item.peso;
        else if (resultado === 'Cumple parcialmente') puntaje = item.peso * 0.5;
        totalScore += puntaje;

        const obsIA = resultado === 'Cumple' ? 'Requisito identificado en CV' : resultado === 'Cumple parcialmente' ? 'Evidencia parcial encontrada' : resultado === 'No identificado' ? 'No se encontró información en el CV' : 'No cumple con el criterio';
        return { ...item, resultado, puntaje: puntaje.toFixed(1), observacion_ia: obsIA, observacion_reclutador: '' };
    });
    return { evaluacion, totalScore: totalScore.toFixed(1) };
}

// Respuestas conversacionales simuladas
const RESPUESTAS_IA = {
    porcentaje: (c) => `${c.nombre} obtiene un ${c.score}% porque ${c.score >= 75 ? 'cumple con la experiencia mínima y presenta habilidades técnicas relacionadas' : 'presenta brechas en formación y experiencia requerida'}. ${c.score < 75 ? 'No se identificaron certificaciones solicitadas y existe una brecha parcial en responsabilidades previas.' : 'Su perfil se alinea con los requisitos principales del puesto.'} Se recomienda ${c.score >= 75 ? 'entrevista inicial para validar profundidad técnica' : 'revisión manual o considerar para otras vacantes'}.`,
    requisitos_cumple: (c) => `Basado en la información del CV de ${c.nombre}, se identifican los siguientes requisitos cumplidos:\n• Experiencia laboral: ${c.experiencia_anios} años en el área\n• Habilidades detectadas: ${c.habilidades.slice(0,3).join(', ')}\n• Formación: ${c.formacion}\n• Idiomas: ${c.idiomas.join(', ')}`,
    requisitos_no: (c) => `Para ${c.nombre} no se identificaron los siguientes elementos:\n• ${c.certificaciones.length === 0 ? 'Certificaciones requeridas no encontradas' : 'Certificaciones verificadas'}\n• ${c.score < 70 ? 'Algunas habilidades técnicas específicas del puesto' : 'Brechas menores en habilidades deseables'}\n• ${c.idiomas.length < 2 ? 'Nivel de idioma adicional no identificado' : 'Idiomas cubiertos'}`,
    revision_manual: (c) => `${c.nombre} fue marcado como "Revisar manualmente" porque su score de ${c.score}% indica un ajuste parcial al perfil. Esto significa que cumple con algunos requisitos pero tiene brechas que requieren evaluación humana. El reclutador debe validar si las competencias transferibles compensan las brechas técnicas identificadas.`,
    otra_vacante: (c) => `Basado en las habilidades de ${c.nombre} (${c.habilidades.slice(0,3).join(', ')}), podría ser considerado para vacantes en áreas relacionadas. Su experiencia en ${c.ultima_experiencia} sugiere potencial para posiciones de ${c.experiencia_anios > 3 ? 'coordinación o supervisión' : 'nivel operativo o analista junior'} en departamentos afines.`,
    alertas: (c) => `Alertas para considerar antes de entrevistar a ${c.nombre}:\n• ${c.score < 60 ? 'Score bajo - validar motivación y disponibilidad' : 'Score aceptable - verificar datos específicos'}\n• ${c.experiencia_anios < 2 ? 'Experiencia limitada - evaluar curva de aprendizaje' : 'Experiencia suficiente'}\n• ${c.certificaciones.length === 0 ? 'Sin certificaciones - preguntar por formación complementaria' : 'Certificaciones presentes'}\n• Verificar disponibilidad de incorporación y expectativa salarial`,
    preguntas_entrevista: (c) => `Preguntas sugeridas para entrevista con ${c.nombre}:\n1. ¿Puede describir su experiencia más relevante para este puesto?\n2. ¿Qué herramientas o metodologías domina de las requeridas?\n3. ¿Cuál ha sido su mayor logro profesional en los últimos 2 años?\n4. ¿Qué motivación tiene para este cambio laboral?\n5. ¿Cuál es su disponibilidad de incorporación?\n6. ¿Tiene alguna expectativa salarial definida?`,
    resumen_ejecutivo: (c) => `RESUMEN EJECUTIVO - ${c.nombre}\n\nScore: ${c.score}% | Recomendación: ${c.recomendacion}\nFormación: ${c.formacion} | Experiencia: ${c.experiencia_anios} años\nÚltimo puesto: ${c.ultima_experiencia}\nHabilidades clave: ${c.habilidades.slice(0,4).join(', ')}\n\nConclusión: ${c.score >= 75 ? 'Candidato con potencial para avanzar en el proceso. Se sugiere entrevista técnica y validación de referencias.' : 'Candidato con ajuste parcial. Requiere evaluación adicional para determinar viabilidad.'}`
};
