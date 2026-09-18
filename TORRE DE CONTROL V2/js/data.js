/* ============================================
   DATA.JS - Torre de Control de Trámites
   Datos de demostración y gestión de localStorage
   ============================================ */

const DATA_KEY = 'torre_control_data';

const WORKFLOW_STAGES = [
    { id: 1, name: 'Solicitud Recibida', short: 'Recepción' },
    { id: 2, name: 'Validación Documental', short: 'Validación' },
    { id: 3, name: 'Asignación del Trámite', short: 'Asignación' },
    { id: 4, name: 'Revisión de Ítems y Partidas', short: 'Ítems' },
    { id: 5, name: 'Proforma y Visto Bueno', short: 'Proforma' },
    { id: 6, name: 'Declaración, DUA y Aforo', short: 'DUA' },
    { id: 7, name: 'Operación y Liberación', short: 'Liberación' },
    { id: 8, name: 'Entrega a Facturación', short: 'Pre-Fact.' },
    { id: 9, name: 'Facturación', short: 'Facturación' },
    { id: 10, name: 'Cierre y Archivo', short: 'Cierre' }
];

const TRAMITE_TYPES = [
    { id: 'IMP', name: 'Importación', color: '#3182ce', omega: 'DELIMP' },
    { id: 'EXP', name: 'Exportación', color: '#38a169', omega: 'DELEXP' },
    { id: 'TRA', name: 'Tránsito', color: '#d69e2e', omega: 'DELTRA' },
    { id: 'PA', name: 'Perfeccionamiento Activo', color: '#805ad5', omega: 'DELPAC' },
    { id: 'ZF', name: 'Zona Franca', color: '#e53e3e', omega: 'DELZOF' }
];

const PRIORITIES = ['Baja', 'Normal', 'Alta', 'Urgente', 'Crítica'];

const STAGE_STATES = [
    'No iniciada', 'Lista para iniciar', 'En progreso', 'Pendiente cliente',
    'Pendiente interno', 'En revisión', 'Completada', 'Atrasada', 'Bloqueada',
    'Con excepción', 'No aplica'
];

const DOC_TYPES = [
    'BL / Documento de transporte', 'Factura comercial', 'Lista de empaque',
    'Traducción', 'Certificado de origen', 'Fichas técnicas', 'Originales',
    'Tratado', 'Nota aclaratoria', 'Requerimiento FAD', 'Exoneración',
    'Pólizas', 'Certificado de análisis', 'Examen previo', 'Análisis de laboratorio',
    'Documentos parciales', 'Permisos', 'Declaración', 'DUA', 'Proforma', 'Factura final'
];

const DOC_STATES = ['Pendiente', 'Recibido', 'En revisión', 'Validado', 'Rechazado', 'Reemplazado', 'No aplica'];

const ROLES = [
    'Administrador', 'Coordinador operativo', 'Ejecutivo de Servicio al Cliente',
    'Coordinador de Pedimentación', 'Pedimentador', 'Gestión Técnica',
    'Operaciones', 'Contabilidad', 'Analista Backoffice', 'Usuario de consulta',
    'Robot / Agente automático'
];

const SOLSER_STATES = ['Pendiente de envío', 'Enviando', 'OT creada', 'Rechazada', 'Error', 'Reintento pendiente'];

const OMEGA_MODULES = ['DELIMP', 'DELEXP', 'DELTRA', 'DELVIA', 'DELPAC', 'DELZOF', 'FACSER', 'DELMAN', 'DELCO', 'DELMAN-ER'];

function generateDemoData() {
    const users = [
        { id: 'USR-001', username: 'sebastian.alfaro', password: 'demo123', name: 'Sebastian Alfaro', email: 'sebastian@torre.com', role: 'Coordinador operativo', status: 'Activo', capacity: 15, specialty: 'Importación', lastLogin: '2026-07-23 08:30' },
        { id: 'USR-002', username: 'kerin.blanco', password: 'demo123', name: 'Kerin Blanco', email: 'kerin@torre.com', role: 'Pedimentador', status: 'Activo', capacity: 12, specialty: 'Exportación', lastLogin: '2026-07-23 07:45' },
        { id: 'USR-003', username: 'valeria.soto', password: 'demo123', name: 'Valeria Soto', email: 'valeria@torre.com', role: 'Ejecutivo de Servicio al Cliente', status: 'Activo', capacity: 18, specialty: 'General', lastLogin: '2026-07-22 16:00' },
        { id: 'USR-004', username: 'adriana.mendez', password: 'demo123', name: 'Adriana Méndez', email: 'adriana@torre.com', role: 'Gestión Técnica', status: 'Activo', capacity: 10, specialty: 'Clasificación', lastLogin: '2026-07-23 09:00' },
        { id: 'USR-005', username: 'jafet.flores', password: 'demo123', name: 'Jafet Flores', email: 'jafet@torre.com', role: 'Operaciones', status: 'Activo', capacity: 14, specialty: 'Tránsito', lastLogin: '2026-07-22 17:30' },
        { id: 'USR-006', username: 'andrea.molina', password: 'demo123', name: 'Andrea Molina', email: 'andrea@torre.com', role: 'Contabilidad', status: 'Activo', capacity: 20, specialty: 'Facturación', lastLogin: '2026-07-23 08:00' },
        { id: 'USR-007', username: 'carlos.rivera', password: 'demo123', name: 'Carlos Rivera', email: 'carlos@torre.com', role: 'Administrador', status: 'Activo', capacity: 10, specialty: 'Administración', lastLogin: '2026-07-23 07:00' },
        { id: 'USR-008', username: 'lucia.vargas', password: 'demo123', name: 'Lucía Vargas', email: 'lucia@torre.com', role: 'Coordinador de Pedimentación', status: 'Activo', capacity: 12, specialty: 'Pedimentación', lastLogin: '2026-07-22 14:00' },
        { id: 'USR-009', username: 'robot.rpa', password: 'demo123', name: 'Agente RPA', email: 'rpa@torre.com', role: 'Robot / Agente automático', status: 'Activo', capacity: 100, specialty: 'Automatización', lastLogin: '2026-07-23 09:15' },
        { id: 'USR-010', username: 'mario.consulta', password: 'demo123', name: 'Mario Solano', email: 'mario@torre.com', role: 'Usuario de consulta', status: 'Activo', capacity: 0, specialty: 'Consulta', lastLogin: '2026-07-21 10:00' }
    ];

    const clients = [
        { id: 'CLI-1001', name: 'Mariana Castillo', company: 'LunaToon Studios', password: 'demo123', email: 'mariana@lunatoon.com', country: 'Costa Rica', sla: 5, status: 'Activo', portalAccess: true },
        { id: 'CLI-1002', name: 'Roberto Chen', company: 'ToonNova Factory', password: 'demo123', email: 'roberto@toonnova.com', country: 'Panamá', sla: 7, status: 'Activo', portalAccess: true },
        { id: 'CLI-1003', name: 'Diana Quirós', company: 'PixelRío Studio', password: 'demo123', email: 'diana@pixelrio.com', country: 'Costa Rica', sla: 4, status: 'Activo', portalAccess: true },
        { id: 'CLI-1004', name: 'Andrés Morales', company: 'Dragón Pixel Lab', password: 'demo123', email: 'andres@dragonpixel.com', country: 'México', sla: 6, status: 'Activo', portalAccess: true },
        { id: 'CLI-1005', name: 'Sofía Hernández', company: 'Estudio LunaLoop', password: 'demo123', email: 'sofia@lunaloop.com', country: 'Colombia', sla: 5, status: 'Activo', portalAccess: true },
        { id: 'CLI-1006', name: 'Fernando Araya', company: 'Nube Animada', password: 'demo123', email: 'fernando@nubeanimada.com', country: 'Costa Rica', sla: 3, status: 'Activo', portalAccess: true },
        { id: 'CLI-1007', name: 'Patricia Rojas', company: 'FrameWorks Media', password: 'demo123', email: 'patricia@frameworks.com', country: 'Guatemala', sla: 7, status: 'Inactivo', portalAccess: false },
        { id: 'CLI-1008', name: 'Miguel Sandoval', company: 'Prisma Motion', password: 'demo123', email: 'miguel@prismamotion.com', country: 'Costa Rica', sla: 5, status: 'Activo', portalAccess: true }
    ];

    const tramites = [
        { id: 'TRM-2026-001', receipt: 'REC-4501', otSolser: 'OT-88001', clientId: 'CLI-1001', type: 'IMP', regime: 'Definitivo', priority: 'Alta', startDate: '2026-07-01', eta: '2026-07-10', currentStage: 7, status: 'En proceso', responsible: 'USR-005', slaTotal: 5, slaUsed: 4.5, progress: 70, lastUpdate: '2026-07-23 08:00', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-002', receipt: 'REC-4502', otSolser: 'OT-88002', clientId: 'CLI-1001', type: 'EXP', regime: 'Definitivo', priority: 'Normal', startDate: '2026-07-05', eta: '2026-07-15', currentStage: 5, status: 'En proceso', responsible: 'USR-002', slaTotal: 7, slaUsed: 3, progress: 50, lastUpdate: '2026-07-22 16:30', integration: 'OT creada', omega: 'DELEXP' },
        { id: 'TRM-2026-003', receipt: 'REC-4503', otSolser: 'OT-88003', clientId: 'CLI-1002', type: 'IMP', regime: 'Temporal', priority: 'Urgente', startDate: '2026-07-10', eta: '2026-07-14', currentStage: 4, status: 'En proceso', responsible: 'USR-004', slaTotal: 4, slaUsed: 3.8, progress: 40, lastUpdate: '2026-07-23 09:00', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-004', receipt: 'REC-4504', otSolser: 'OT-88004', clientId: 'CLI-1003', type: 'TRA', regime: 'Internacional', priority: 'Normal', startDate: '2026-07-08', eta: '2026-07-18', currentStage: 6, status: 'En proceso', responsible: 'USR-005', slaTotal: 6, slaUsed: 4, progress: 60, lastUpdate: '2026-07-22 14:00', integration: 'OT creada', omega: 'DELTRA' },
        { id: 'TRM-2026-005', receipt: 'REC-4505', otSolser: 'OT-88005', clientId: 'CLI-1004', type: 'PA', regime: 'PA Activo', priority: 'Alta', startDate: '2026-07-03', eta: '2026-07-12', currentStage: 8, status: 'En proceso', responsible: 'USR-006', slaTotal: 5, slaUsed: 5.2, progress: 80, lastUpdate: '2026-07-23 07:30', integration: 'OT creada', omega: 'DELPAC' },
        { id: 'TRM-2026-006', receipt: 'REC-4506', otSolser: 'OT-88006', clientId: 'CLI-1005', type: 'ZF', regime: 'Zona Franca', priority: 'Normal', startDate: '2026-07-12', eta: '2026-07-22', currentStage: 3, status: 'En proceso', responsible: 'USR-001', slaTotal: 7, slaUsed: 2, progress: 30, lastUpdate: '2026-07-22 11:00', integration: 'OT creada', omega: 'DELZOF' },
        { id: 'TRM-2026-007', receipt: 'REC-4507', otSolser: 'OT-88007', clientId: 'CLI-1001', type: 'IMP', regime: 'Definitivo', priority: 'Crítica', startDate: '2026-07-15', eta: '2026-07-20', currentStage: 2, status: 'Pendiente cliente', responsible: 'USR-003', slaTotal: 3, slaUsed: 2.8, progress: 20, lastUpdate: '2026-07-23 09:15', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-008', receipt: 'REC-4508', otSolser: 'OT-88008', clientId: 'CLI-1006', type: 'EXP', regime: 'Definitivo', priority: 'Baja', startDate: '2026-07-01', eta: '2026-07-25', currentStage: 10, status: 'Cerrado', responsible: 'USR-002', slaTotal: 10, slaUsed: 8, progress: 100, lastUpdate: '2026-07-20 15:00', integration: 'OT creada', omega: 'DELEXP' },
        { id: 'TRM-2026-009', receipt: 'REC-4509', otSolser: 'OT-88009', clientId: 'CLI-1002', type: 'IMP', regime: 'Definitivo', priority: 'Normal', startDate: '2026-07-18', eta: '2026-07-28', currentStage: 1, status: 'Nuevo', responsible: 'USR-009', slaTotal: 7, slaUsed: 0.5, progress: 10, lastUpdate: '2026-07-23 08:45', integration: 'Pendiente de envío', omega: 'DELIMP' },
        { id: 'TRM-2026-010', receipt: 'REC-4510', otSolser: 'OT-88010', clientId: 'CLI-1003', type: 'TRA', regime: 'Nacional', priority: 'Alta', startDate: '2026-07-06', eta: '2026-07-13', currentStage: 9, status: 'En proceso', responsible: 'USR-006', slaTotal: 5, slaUsed: 5.5, progress: 90, lastUpdate: '2026-07-22 17:00', integration: 'OT creada', omega: 'DELTRA' },
        { id: 'TRM-2026-011', receipt: 'REC-4511', otSolser: null, clientId: 'CLI-1004', type: 'IMP', regime: 'Definitivo', priority: 'Normal', startDate: '2026-07-20', eta: '2026-07-30', currentStage: 1, status: 'Excepción', responsible: 'USR-003', slaTotal: 7, slaUsed: 0.2, progress: 5, lastUpdate: '2026-07-22 10:00', integration: 'Error', omega: 'DELIMP' },
        { id: 'TRM-2026-012', receipt: 'REC-4512', otSolser: 'OT-88012', clientId: 'CLI-1005', type: 'EXP', regime: 'Definitivo', priority: 'Alta', startDate: '2026-07-02', eta: '2026-07-09', currentStage: 10, status: 'Cerrado', responsible: 'USR-002', slaTotal: 5, slaUsed: 4, progress: 100, lastUpdate: '2026-07-09 16:00', integration: 'OT creada', omega: 'DELEXP' },
        { id: 'TRM-2026-013', receipt: 'REC-4513', otSolser: 'OT-88013', clientId: 'CLI-1006', type: 'PA', regime: 'PA Activo', priority: 'Normal', startDate: '2026-07-14', eta: '2026-07-24', currentStage: 5, status: 'Pendiente cliente', responsible: 'USR-002', slaTotal: 7, slaUsed: 3, progress: 50, lastUpdate: '2026-07-22 09:00', integration: 'OT creada', omega: 'DELPAC' },
        { id: 'TRM-2026-014', receipt: 'REC-4514', otSolser: 'OT-88014', clientId: 'CLI-1008', type: 'IMP', regime: 'Definitivo', priority: 'Urgente', startDate: '2026-07-19', eta: '2026-07-23', currentStage: 3, status: 'En proceso', responsible: 'USR-008', slaTotal: 3, slaUsed: 2.5, progress: 30, lastUpdate: '2026-07-23 07:00', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-015', receipt: 'REC-4515', otSolser: 'OT-88015', clientId: 'CLI-1001', type: 'ZF', regime: 'Zona Franca', priority: 'Normal', startDate: '2026-07-10', eta: '2026-07-20', currentStage: 6, status: 'En proceso', responsible: 'USR-004', slaTotal: 6, slaUsed: 5, progress: 60, lastUpdate: '2026-07-22 13:00', integration: 'OT creada', omega: 'DELZOF' },
        { id: 'TRM-2026-016', receipt: 'REC-4516', otSolser: 'OT-88016', clientId: 'CLI-1002', type: 'EXP', regime: 'Temporal', priority: 'Normal', startDate: '2026-07-11', eta: '2026-07-21', currentStage: 4, status: 'En proceso', responsible: 'USR-004', slaTotal: 7, slaUsed: 4, progress: 40, lastUpdate: '2026-07-21 16:00', integration: 'OT creada', omega: 'DELEXP' },
        { id: 'TRM-2026-017', receipt: 'REC-4517', otSolser: 'OT-88017', clientId: 'CLI-1003', type: 'IMP', regime: 'Definitivo', priority: 'Baja', startDate: '2026-06-28', eta: '2026-07-15', currentStage: 10, status: 'Cerrado', responsible: 'USR-005', slaTotal: 10, slaUsed: 9, progress: 100, lastUpdate: '2026-07-15 12:00', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-018', receipt: 'REC-4518', otSolser: 'OT-88018', clientId: 'CLI-1004', type: 'TRA', regime: 'Internacional', priority: 'Alta', startDate: '2026-07-16', eta: '2026-07-22', currentStage: 7, status: 'En proceso', responsible: 'USR-005', slaTotal: 4, slaUsed: 3.8, progress: 70, lastUpdate: '2026-07-23 06:30', integration: 'OT creada', omega: 'DELTRA' },
        { id: 'TRM-2026-019', receipt: 'REC-4519', otSolser: 'OT-88019', clientId: 'CLI-1008', type: 'IMP', regime: 'Definitivo', priority: 'Normal', startDate: '2026-07-17', eta: '2026-07-27', currentStage: 2, status: 'En proceso', responsible: 'USR-003', slaTotal: 7, slaUsed: 1.5, progress: 20, lastUpdate: '2026-07-22 15:00', integration: 'OT creada', omega: 'DELIMP' },
        { id: 'TRM-2026-020', receipt: 'REC-4520', otSolser: 'OT-88020', clientId: 'CLI-1006', type: 'IMP', regime: 'Definitivo', priority: 'Normal', startDate: '2026-07-13', eta: '2026-07-23', currentStage: 5, status: 'Pendiente cliente', responsible: 'USR-002', slaTotal: 6, slaUsed: 4.5, progress: 50, lastUpdate: '2026-07-22 12:00', integration: 'OT creada', omega: 'DELIMP' }
    ];

    // Generate documents for each tramite
    const documents = [];
    tramites.forEach(t => {
        const docsForType = DOC_TYPES.slice(0, 8 + Math.floor(Math.random() * 5));
        docsForType.forEach((docType, i) => {
            const states = ['Validado', 'Recibido', 'Pendiente', 'En revisión'];
            const state = t.currentStage > 3 ? states[Math.floor(Math.random() * 2)] : states[Math.floor(Math.random() * states.length)];
            documents.push({
                id: `DOC-${t.id}-${i+1}`,
                tramiteId: t.id,
                type: docType,
                name: `${docType} - ${t.id}`,
                required: i < 5,
                state: state,
                uploadDate: state !== 'Pendiente' ? '2026-07-' + String(Math.floor(Math.random()*20)+1).padStart(2,'0') : null,
                uploadedBy: state !== 'Pendiente' ? ['USR-003','USR-002','CLI-'+t.clientId.split('-')[1]][Math.floor(Math.random()*3)] : null,
                version: state !== 'Pendiente' ? 1 : 0,
                size: state !== 'Pendiente' ? (Math.floor(Math.random()*500)+50)+'KB' : null,
                observation: '',
                visibleClient: i < 6,
                validatedBy: state === 'Validado' ? 'USR-004' : null,
                validationDate: state === 'Validado' ? '2026-07-' + String(Math.floor(Math.random()*20)+5).padStart(2,'0') : null,
                rejectReason: ''
            });
        });
    });

    // Generate stage details for each tramite
    const stageDetails = [];
    tramites.forEach(t => {
        WORKFLOW_STAGES.forEach((stage, idx) => {
            let state = 'No iniciada';
            let startDate = null, endDate = null;
            if (idx + 1 < t.currentStage) {
                state = 'Completada';
                startDate = '2026-07-' + String(Math.min(idx * 2 + 1, 20)).padStart(2, '0');
                endDate = '2026-07-' + String(Math.min(idx * 2 + 3, 22)).padStart(2, '0');
            } else if (idx + 1 === t.currentStage) {
                state = t.status === 'Pendiente cliente' ? 'Pendiente cliente' : 'En progreso';
                startDate = '2026-07-' + String(Math.min(idx * 2 + 1, 21)).padStart(2, '0');
            }
            if (t.status === 'Cerrado') { state = 'Completada'; endDate = endDate || t.lastUpdate.split(' ')[0]; }
            stageDetails.push({
                id: `STG-${t.id}-${stage.id}`,
                tramiteId: t.id,
                stageId: stage.id,
                stageName: stage.name,
                state: state,
                responsible: t.responsible,
                startDate: startDate,
                endDate: endDate,
                slaAssigned: Math.max(1, Math.floor(t.slaTotal / 10 * 2)),
                comments: [],
                tasks: []
            });
        });
    });

    // Comments / Bitacora
    const comments = [
        { id: 'COM-001', tramiteId: 'TRM-2026-001', author: 'USR-001', role: 'Coordinador operativo', date: '2026-07-01 09:00', text: 'Trámite recibido y asignado. Prioridad alta por ETA cercano.', type: 'internal', visibility: 'interno', stage: 1 },
        { id: 'COM-002', tramiteId: 'TRM-2026-001', author: 'USR-003', role: 'Ejecutivo de Servicio al Cliente', date: '2026-07-02 10:30', text: 'Documentos validados. Se procede con asignación.', type: 'system', visibility: 'cliente', stage: 2 },
        { id: 'COM-003', tramiteId: 'TRM-2026-002', author: 'USR-002', role: 'Pedimentador', date: '2026-07-06 14:00', text: 'Pendiente certificado de origen. Se notifica al cliente.', type: 'internal', visibility: 'cliente', stage: 2 },
        { id: 'COM-004', tramiteId: 'TRM-2026-003', author: 'USR-004', role: 'Gestión Técnica', date: '2026-07-12 11:00', text: 'Clasificación arancelaria requiere revisión adicional. Fichas técnicas incompletas.', type: 'internal', visibility: 'interno', stage: 4 },
        { id: 'COM-005', tramiteId: 'TRM-2026-007', author: 'USR-003', role: 'Ejecutivo de Servicio al Cliente', date: '2026-07-22 09:00', text: 'Se requiere factura comercial original y lista de empaque actualizada.', type: 'internal', visibility: 'cliente', stage: 2 },
        { id: 'COM-006', tramiteId: 'TRM-2026-005', author: 'USR-006', role: 'Contabilidad', date: '2026-07-22 16:00', text: 'Costos adicionales de almacenaje registrados. Pendiente aprobación del cliente.', type: 'internal', visibility: 'cliente', stage: 8 },
        { id: 'COM-007', tramiteId: 'TRM-2026-013', author: 'CLI-1006', role: 'Cliente', date: '2026-07-21 10:00', text: 'La proforma tiene un error en la línea 3. Solicito corrección.', type: 'client', visibility: 'cliente', stage: 5 },
        { id: 'COM-008', tramiteId: 'TRM-2026-020', author: 'USR-002', role: 'Pedimentador', date: '2026-07-22 12:00', text: 'Proforma enviada al cliente. Esperando visto bueno.', type: 'system', visibility: 'cliente', stage: 5 }
    ];

    // Alerts
    const alerts = [
        { id: 'ALR-001', tramiteId: 'TRM-2026-007', clientId: 'CLI-1001', type: 'Documento pendiente', date: '2026-07-22 09:00', responsible: 'USR-003', destination: 'CLI-1001', medium: 'Correo', status: 'Enviada', nextAction: 'Esperar respuesta', followUpDate: '2026-07-24' },
        { id: 'ALR-002', tramiteId: 'TRM-2026-003', clientId: 'CLI-1002', type: 'SLA por vencer', date: '2026-07-22 14:00', responsible: 'USR-004', destination: 'USR-001', medium: 'Teams', status: 'Activa', nextAction: 'Revisar clasificación', followUpDate: '2026-07-23' },
        { id: 'ALR-003', tramiteId: 'TRM-2026-005', clientId: 'CLI-1004', type: 'SLA vencido', date: '2026-07-23 07:00', responsible: 'USR-006', destination: 'USR-001', medium: 'Teams', status: 'Activa', nextAction: 'Escalar a coordinador', followUpDate: '2026-07-23' },
        { id: 'ALR-004', tramiteId: 'TRM-2026-011', clientId: 'CLI-1004', type: 'Error de integración', date: '2026-07-22 10:00', responsible: 'USR-009', destination: 'USR-001', medium: 'Teams', status: 'Pendiente', nextAction: 'Reprocesar integración', followUpDate: '2026-07-23' },
        { id: 'ALR-005', tramiteId: 'TRM-2026-013', clientId: 'CLI-1006', type: 'Visto bueno pendiente', date: '2026-07-22 09:00', responsible: 'USR-002', destination: 'CLI-1006', medium: 'Correo', status: 'Enviada', nextAction: 'Esperar aprobación', followUpDate: '2026-07-24' },
        { id: 'ALR-006', tramiteId: 'TRM-2026-020', clientId: 'CLI-1006', type: 'Visto bueno pendiente', date: '2026-07-22 12:00', responsible: 'USR-002', destination: 'CLI-1006', medium: 'Correo', status: 'Enviada', nextAction: 'Seguimiento proforma', followUpDate: '2026-07-25' },
        { id: 'ALR-007', tramiteId: 'TRM-2026-010', clientId: 'CLI-1003', type: 'SLA vencido', date: '2026-07-23 08:00', responsible: 'USR-006', destination: 'USR-001', medium: 'Teams', status: 'Activa', nextAction: 'Cerrar facturación', followUpDate: '2026-07-23' }
    ];

    // Email inbox simulation
    const emailInbox = [
        { id: 'MAIL-001', date: '2026-07-23 08:45', sender: 'mariana@lunatoon.com', subject: 'Nueva importación equipos de animación', clientDetected: 'CLI-1001', typeDetected: 'IMP', attachments: 3, confidence: 92, status: 'Identificado', error: null, action: 'Crear trámite', responsible: 'USR-009' },
        { id: 'MAIL-002', date: '2026-07-23 07:30', sender: 'roberto@toonnova.com', subject: 'RE: Exportación material audiovisual lote 5', clientDetected: 'CLI-1002', typeDetected: 'EXP', attachments: 5, confidence: 88, status: 'Identificado', error: null, action: 'Crear trámite', responsible: 'USR-009' },
        { id: 'MAIL-003', date: '2026-07-22 16:00', sender: 'desconocido@empresa.com', subject: 'Consulta general', clientDetected: null, typeDetected: null, attachments: 0, confidence: 15, status: 'Excepción', error: 'Cliente no identificado', action: 'Revisión manual', responsible: 'USR-003' },
        { id: 'MAIL-004', date: '2026-07-22 14:30', sender: 'sofia@lunaloop.com', subject: 'Tránsito internacional materiales', clientDetected: 'CLI-1005', typeDetected: 'TRA', attachments: 2, confidence: 78, status: 'Pendiente de revisión', error: 'Confianza baja', action: 'Completar información', responsible: 'USR-003' },
        { id: 'MAIL-005', date: '2026-07-22 11:00', sender: 'fernando@nubeanimada.com', subject: 'Documentos complementarios TRM-2026-020', clientDetected: 'CLI-1006', typeDetected: null, attachments: 4, confidence: 95, status: 'Trámite creado', error: null, action: 'Adjuntar a trámite existente', responsible: 'USR-009' }
    ];

    // Integrations log
    const integrations = [
        { id: 'INT-001', tramiteId: 'TRM-2026-001', system: 'SOLSER', action: 'Crear OT', date: '2026-07-01 09:30', dataSent: 'Datos de trámite IMP', response: 'OT-88001 creada', responseCode: 200, status: 'Exitosa', retries: 0, lastError: null, executedBy: 'USR-009' },
        { id: 'INT-002', tramiteId: 'TRM-2026-001', system: 'DELIMP', action: 'Enviar datos importación', date: '2026-07-05 10:00', dataSent: 'Ítems y partidas', response: 'Procesado correctamente', responseCode: 200, status: 'Exitosa', retries: 0, lastError: null, executedBy: 'USR-009' },
        { id: 'INT-003', tramiteId: 'TRM-2026-011', system: 'SOLSER', action: 'Crear OT', date: '2026-07-20 10:30', dataSent: 'Datos de trámite IMP', response: 'Error de conexión', responseCode: 500, status: 'Error', retries: 2, lastError: 'Timeout en conexión', executedBy: 'USR-009' },
        { id: 'INT-004', tramiteId: 'TRM-2026-005', system: 'DELPAC', action: 'Enviar PA', date: '2026-07-10 14:00', dataSent: 'Declaración PA', response: 'Declaración registrada', responseCode: 200, status: 'Exitosa', retries: 0, lastError: null, executedBy: 'USR-009' },
        { id: 'INT-005', tramiteId: 'TRM-2026-010', system: 'FACSER', action: 'Enviar a facturación', date: '2026-07-22 17:00', dataSent: 'Conceptos facturables', response: 'Factura en proceso', responseCode: 200, status: 'Exitosa', retries: 0, lastError: null, executedBy: 'USR-006' }
    ];

    // Costs
    const costs = [
        { id: 'CST-001', tramiteId: 'TRM-2026-005', concept: 'Almacenaje', type: 'Recuperable', amount: 350, currency: 'USD', date: '2026-07-20', support: 'Factura almacén', visibleClient: true, requiresApproval: true, approvalStatus: 'Pendiente cliente', observation: '5 días adicionales' },
        { id: 'CST-002', tramiteId: 'TRM-2026-001', concept: 'Transporte', type: 'Servicio', amount: 200, currency: 'USD', date: '2026-07-08', support: 'Guía transporte', visibleClient: true, requiresApproval: false, approvalStatus: 'Aprobado', observation: '' },
        { id: 'CST-003', tramiteId: 'TRM-2026-010', concept: 'Inspección', type: 'Recuperable', amount: 150, currency: 'USD', date: '2026-07-19', support: 'Informe inspección', visibleClient: true, requiresApproval: true, approvalStatus: 'Aprobado', observation: 'Inspección física requerida' },
        { id: 'CST-004', tramiteId: 'TRM-2026-003', concept: 'Demora', type: 'Recuperable', amount: 500, currency: 'USD', date: '2026-07-22', support: 'Nota demora', visibleClient: true, requiresApproval: true, approvalStatus: 'Pendiente cliente', observation: 'Demora por documentos pendientes' }
    ];

    // Proformas
    const proformas = [
        { id: 'PRF-001', tramiteId: 'TRM-2026-013', date: '2026-07-20', amount: 2500, currency: 'USD', status: 'Pendiente', sentDate: '2026-07-20 09:00', approvalDate: null, clientComment: 'Error en línea 3', items: 12 },
        { id: 'PRF-002', tramiteId: 'TRM-2026-020', date: '2026-07-21', amount: 1800, currency: 'USD', status: 'Pendiente', sentDate: '2026-07-21 14:00', approvalDate: null, clientComment: '', items: 8 },
        { id: 'PRF-003', tramiteId: 'TRM-2026-001', date: '2026-07-04', amount: 3200, currency: 'USD', status: 'Aprobada', sentDate: '2026-07-04 10:00', approvalDate: '2026-07-04 16:00', clientComment: '', items: 15 },
        { id: 'PRF-004', tramiteId: 'TRM-2026-008', date: '2026-07-05', amount: 950, currency: 'USD', status: 'Aprobada', sentDate: '2026-07-05 11:00', approvalDate: '2026-07-06 09:00', clientComment: '', items: 5 }
    ];

    return { users, clients, tramites, documents, stageDetails, comments, alerts, emailInbox, integrations, costs, proformas };
}

// Data management functions
function loadData() {
    const stored = localStorage.getItem(DATA_KEY);
    if (stored) {
        try { return JSON.parse(stored); }
        catch(e) { console.warn('Error loading data, restoring demo'); }
    }
    return resetDemoData();
}

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function resetDemoData() {
    const data = generateDemoData();
    saveData(data);
    return data;
}

function getNextId(prefix, items) {
    const nums = items.map(i => parseInt(i.id.split('-').pop())).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}-${String(next).padStart(3, '0')}`;
}

function getNextTramiteId(tramites) {
    const nums = tramites.map(t => parseInt(t.id.split('-').pop())).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `TRM-2026-${String(next).padStart(3, '0')}`;
}

function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(date) {
    if (!date) return '-';
    return date;
}

function getNow() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
