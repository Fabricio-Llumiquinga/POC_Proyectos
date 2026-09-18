// ============================================================
// MORPHO SMART SCHEDULING - Main Application
// ============================================================
// ===== STATE =====
let APP = {
    currentView: 'dashboard',
    currentRole: 'admin_regional',
    currentCountry: 'costa_rica',
    currentUser: null,
    currentWeek: getMonday(new Date())
};
function getMonday(d) {
    d = new Date(d); const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}
function formatDate(d) { return d.toISOString().split('T')[0]; }
function formatDateShort(d) {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return d.getDate() + ' ' + months[d.getMonth()];
}

// ===== DATA: COUNTRIES =====
const DATA_COUNTRIES = [
    { id: 'costa_rica', name: 'Costa Rica', flag: '🇨🇷', status: 'Piloto activo - Puntos de Venta', phase: 'Fase 1', currency: 'CRC', timezone: 'America/Costa_Rica', estimatedCollabs: 45, planningStatus: 'Activo' }
];
// ===== DATA: STORES =====
const DATA_STORES = [
    { id: 'CR-SJO-RPV', name: 'Rumbo Pura Vida SJO', country: 'costa_rica', type: 'Airport Retail', location: 'Aeropuerto Juan Santamaria', hours: '00:00-23:59', is24h: true, costCenter: 'CR-SJO-RPV', geoCode: 'GV-CR-SJO-RPV', peakHours: ['05:00-08:00','12:00-15:00','20:00-23:00'], roles: ['Vendedor','Cajero','Anfitrion Cultural','Bodega','Supervisor'], minStaff: 3, maxStaff: 8, active: true },
    { id: 'CR-SJO-TES', name: 'Travel Essentials SJO', country: 'costa_rica', type: 'Travel Essentials', location: 'Aeropuerto Juan Santamaria', hours: '05:00-23:00', is24h: false, costCenter: 'CR-SJO-TES', geoCode: 'GV-CR-SJO-TES', peakHours: ['06:00-09:00','17:00-20:00'], roles: ['Vendedor','Cajero','Reposicion'], minStaff: 2, maxStaff: 5, active: true },
    { id: 'CR-SJO-GGO', name: 'Grab & Go SJO', country: 'costa_rica', type: 'Food & Beverage', location: 'Aeropuerto Juan Santamaria', hours: '04:30-22:30', is24h: false, costCenter: 'CR-SJO-GGO', geoCode: 'GV-CR-SJO-GGO', peakHours: ['06:00-08:00','12:00-14:00','18:00-20:00'], roles: ['Cajero','Barista','Cocina','Reposicion','Supervisor'], minStaff: 3, maxStaff: 7, active: true },
    { id: 'CR-LIR-RUMBO', name: 'Rumbo Liberia LIR', country: 'costa_rica', type: 'Airport Retail', location: 'Guanacaste International Airport', hours: '05:00-22:00', is24h: false, costCenter: 'CR-LIR-RUMBO', geoCode: 'GV-CR-LIR-RUMBO', peakHours: ['07:00-10:00','16:00-19:00'], roles: ['Vendedor','Cajero','Anfitrion Cultural','Supervisor'], minStaff: 2, maxStaff: 5, active: true },
    { id: 'CR-SJ-MULTI', name: 'Rumbo Pura Vida Multiplaza Escazu', country: 'costa_rica', type: 'Street Location', location: 'San Jose', hours: '10:00-21:00', is24h: false, costCenter: 'CR-SJ-MULTI', geoCode: 'GV-CR-SJ-MULTI', peakHours: ['12:00-14:00','17:00-20:00'], roles: ['Vendedor','Cajero','Encargado de tienda'], minStaff: 2, maxStaff: 4, active: true },
    { id: 'CR-GUA-FLAM', name: 'Marina Flamingo Shop', country: 'costa_rica', type: 'Street Location / Turismo', location: 'Guanacaste', hours: '09:00-20:00', is24h: false, costCenter: 'CR-GUA-FLAM', geoCode: 'GV-CR-GUA-FLAM', peakHours: ['10:00-13:00','16:00-18:00'], roles: ['Vendedor','Cajero','Supervisor'], minStaff: 2, maxStaff: 4, active: true },
    { id: 'CR-DOKA-SHOP', name: 'Doka Estate Coffee Tour Shop', country: 'costa_rica', type: 'Attraction', location: 'Coffee Tour', hours: '08:00-17:00', is24h: false, costCenter: 'CR-DOKA-SHOP', geoCode: 'GV-CR-DOKA-SHOP', peakHours: ['10:00-14:00'], roles: ['Vendedor','Barista','Guia/Anfitrion','Cajero'], minStaff: 2, maxStaff: 5, active: true },
    { id: 'CR-LAPAZ-SHOP', name: 'La Paz Waterfall Gardens Shop', country: 'costa_rica', type: 'Attraction', location: 'Alajuela', hours: '08:00-17:00', is24h: false, costCenter: 'CR-LAPAZ-SHOP', geoCode: 'GV-CR-LAPAZ-SHOP', peakHours: ['10:00-14:00'], roles: ['Vendedor','Cajero','Anfitrion'], minStaff: 2, maxStaff: 4, active: true },
    { id: 'CR-TABACON', name: 'Tabacon Hot Springs Shop', country: 'costa_rica', type: 'Hotel / Attraction', location: 'La Fortuna', hours: '09:00-21:00', is24h: false, costCenter: 'CR-TABACON', geoCode: 'GV-CR-TABACON', peakHours: ['10:00-13:00','16:00-19:00'], roles: ['Vendedor','Cajero','Anfitrion','Supervisor'], minStaff: 2, maxStaff: 5, active: true },
    { id: 'CR-DIAMANTE', name: 'Diamante Eco Adventure Park Shop', country: 'costa_rica', type: 'Attraction', location: 'Guanacaste', hours: '08:00-18:00', is24h: false, costCenter: 'CR-DIAMANTE', geoCode: 'GV-CR-DIAMANTE', peakHours: ['10:00-14:00'], roles: ['Vendedor','Cajero','Anfitrion'], minStaff: 2, maxStaff: 4, active: true }
];

// ===== DATA: SHIFTS =====
const DATA_SHIFTS = [
    { id: 'apertura', name: 'Apertura', start: '05:00', end: '13:00', break: 60, type: 'Fijo', country: 'costa_rica', active: true },
    { id: 'manana', name: 'Manana', start: '07:00', end: '15:00', break: 60, type: 'Fijo', country: 'costa_rica', active: true },
    { id: 'intermedio', name: 'Intermedio', start: '10:00', end: '18:00', break: 60, type: 'Fijo', country: 'costa_rica', active: true },
    { id: 'tarde', name: 'Tarde', start: '14:00', end: '22:00', break: 60, type: 'Fijo', country: 'costa_rica', active: true },
    { id: 'cierre', name: 'Cierre', start: '16:00', end: '00:00', break: 60, type: 'Fijo', country: 'costa_rica', active: true },
    { id: 'nocturno', name: 'Nocturno SJO', start: '22:00', end: '06:00', break: 60, type: 'Nocturno', country: 'costa_rica', active: true },
    { id: 'medio_am', name: 'Medio tiempo AM', start: '08:00', end: '12:00', break: 0, type: 'Medio tiempo', country: 'costa_rica', active: true },
    { id: 'medio_pm', name: 'Medio tiempo PM', start: '17:00', end: '21:00', break: 0, type: 'Medio tiempo', country: 'costa_rica', active: true },
    { id: 'atraccion_am', name: 'Atraccion AM', start: '08:00', end: '16:00', break: 60, type: 'Atraccion', country: 'costa_rica', active: true },
    { id: 'atraccion_pm', name: 'Atraccion PM', start: '10:00', end: '18:00', break: 60, type: 'Atraccion', country: 'costa_rica', active: true }
];
// ===== DATA: SUPERVISORS =====
const DATA_SUPERVISORS = [
    { id: 'sup1', name: 'Karen Solano', email: 'karen.solano@morphotravel.com', country: 'costa_rica', stores: ['CR-SJO-RPV','CR-SJO-TES'] },
    { id: 'sup2', name: 'Meylin Vargas', email: 'meylin.vargas@morphotravel.com', country: 'costa_rica', stores: ['CR-SJO-GGO'] },
    { id: 'sup3', name: 'Carolina Rojas', email: 'carolina.rojas@morphotravel.com', country: 'costa_rica', stores: ['CR-LIR-RUMBO','CR-GUA-FLAM'] },
    { id: 'sup4', name: 'Adriana Mora', email: 'adriana.mora@morphotravel.com', country: 'costa_rica', stores: ['CR-SJ-MULTI'] },
    { id: 'sup5', name: 'Luis Fernandez', email: 'luis.fernandez@morphotravel.com', country: 'costa_rica', stores: ['CR-DOKA-SHOP','CR-LAPAZ-SHOP'] },
    { id: 'sup6', name: 'Paola Jimenez', email: 'paola.jimenez@morphotravel.com', country: 'costa_rica', stores: ['CR-TABACON'] },
    { id: 'sup7', name: 'Marco Herrera', email: 'marco.herrera@morphotravel.com', country: 'costa_rica', stores: ['CR-DIAMANTE'] },
    { id: 'sup8', name: 'Fabiola Castro', email: 'fabiola.castro@morphotravel.com', country: 'costa_rica', stores: ['CR-SJO-RPV'] }
];

// ===== DATA: COLLABORATORS =====
const DATA_COLLABORATORS = [
    { id: 'c01', name: 'Maria Rodriguez', email: 'maria.rodriguez@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Atencion al cliente','Ingles'], status: 'activo', plannedHours: 40, realHours: 38, delays: 1, absences: 0, supervisor: 'sup1' },
    { id: 'c02', name: 'Carlos Mendez', email: 'carlos.mendez@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Caja','POS','Ingles'], status: 'activo', plannedHours: 42, realHours: 40, delays: 0, absences: 0, supervisor: 'sup1' },
    { id: 'c03', name: 'Valeria Solano', email: 'valeria.solano@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Anfitrion Cultural', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Atencion','Cultura','Ingles','Frances'], status: 'activo', plannedHours: 38, realHours: 37, delays: 0, absences: 0, supervisor: 'sup1' },
    { id: 'c04', name: 'Andrea Rojas', email: 'andrea.rojas@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'M-D', skills: ['Ventas','Visual merchandising'], status: 'activo', plannedHours: 40, realHours: 42, delays: 2, absences: 0, supervisor: 'sup1' },
    { id: 'c05', name: 'Diego Vargas', email: 'diego.vargas@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Bodega', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Inventario','Logistica'], status: 'activo', plannedHours: 44, realHours: 44, delays: 0, absences: 0, supervisor: 'sup8' },
    { id: 'c06', name: 'Lucia Herrera', email: 'lucia.herrera@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Supervisor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','Operaciones','Ingles'], status: 'activo', plannedHours: 46, realHours: 46, delays: 0, absences: 0, supervisor: 'sup1' },
    { id: 'c07', name: 'Jose Fernandez', email: 'jose.fernandez@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-TES', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Ingles'], status: 'activo', plannedHours: 40, realHours: 39, delays: 1, absences: 0, supervisor: 'sup1' },
    { id: 'c08', name: 'Natalia Castro', email: 'natalia.castro@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-TES', role: 'Cajero', contract: 'Medio tiempo', maxHours: 24, availability: 'L-V AM', skills: ['Caja','POS'], status: 'activo', plannedHours: 20, realHours: 20, delays: 0, absences: 0, supervisor: 'sup1' },
    { id: 'c09', name: 'Mauricio Arias', email: 'mauricio.arias@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-TES', role: 'Reposicion', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Inventario','Logistica'], status: 'activo', plannedHours: 40, realHours: 38, delays: 2, absences: 1, supervisor: 'sup1' },
    { id: 'c10', name: 'Sofia Morales', email: 'sofia.morales@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Barista', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Cafe','Atencion','Ingles'], status: 'activo', plannedHours: 42, realHours: 41, delays: 0, absences: 0, supervisor: 'sup2' },
    { id: 'c11', name: 'Daniel Vega', email: 'daniel.vega@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Cocina', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Cocina','Preparacion'], status: 'activo', plannedHours: 44, realHours: 44, delays: 1, absences: 0, supervisor: 'sup2' },
    { id: 'c12', name: 'Camila Pineda', email: 'camila.pineda@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'M-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup2' },
    { id: 'c13', name: 'Fernanda Gomez', email: 'fernanda.gomez@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Reposicion', contract: 'Medio tiempo', maxHours: 24, availability: 'L-V PM', skills: ['Logistica'], status: 'activo', plannedHours: 20, realHours: 18, delays: 0, absences: 1, supervisor: 'sup2' },
    { id: 'c14', name: 'Pablo Chaves', email: 'pablo.chaves@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Supervisor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','F&B','Ingles'], status: 'activo', plannedHours: 46, realHours: 45, delays: 0, absences: 0, supervisor: 'sup2' },
    { id: 'c15', name: 'Daniela Jimenez', email: 'daniela.jimenez@morphotravel.com', country: 'costa_rica', store: 'CR-LIR-RUMBO', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Ingles','Turismo'], status: 'activo', plannedHours: 40, realHours: 39, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c16', name: 'Esteban Mora', email: 'esteban.mora@morphotravel.com', country: 'costa_rica', store: 'CR-LIR-RUMBO', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Caja','Ingles'], status: 'activo', plannedHours: 42, realHours: 41, delays: 1, absences: 0, supervisor: 'sup3' },
    { id: 'c17', name: 'Laura Alvarado', email: 'laura.alvarado@morphotravel.com', country: 'costa_rica', store: 'CR-LIR-RUMBO', role: 'Anfitrion Cultural', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Cultura','Atencion','Ingles'], status: 'vacaciones', plannedHours: 0, realHours: 0, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c18', name: 'Sebastian Campos', email: 'sebastian.campos@morphotravel.com', country: 'costa_rica', store: 'CR-LIR-RUMBO', role: 'Supervisor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','Operaciones'], status: 'activo', plannedHours: 44, realHours: 44, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c19', name: 'Mariana Torres', email: 'mariana.torres@morphotravel.com', country: 'costa_rica', store: 'CR-SJ-MULTI', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Visual merchandising'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup4' },
    { id: 'c20', name: 'Andres Salas', email: 'andres.salas@morphotravel.com', country: 'costa_rica', store: 'CR-SJ-MULTI', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 42, realHours: 40, delays: 2, absences: 0, supervisor: 'sup4' },
    { id: 'c21', name: 'Gabriela Villalobos', email: 'gabriela.v@morphotravel.com', country: 'costa_rica', store: 'CR-SJ-MULTI', role: 'Encargado de tienda', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','Ventas','Operaciones'], status: 'activo', plannedHours: 46, realHours: 46, delays: 0, absences: 0, supervisor: 'sup4' },
    { id: 'c22', name: 'Ricardo Monge', email: 'ricardo.m@morphotravel.com', country: 'costa_rica', store: 'CR-GUA-FLAM', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Turismo','Ingles'], status: 'activo', plannedHours: 40, realHours: 38, delays: 1, absences: 0, supervisor: 'sup3' },
    { id: 'c23', name: 'Melissa Quesada', email: 'melissa.q@morphotravel.com', country: 'costa_rica', store: 'CR-GUA-FLAM', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'M-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c24', name: 'Alejandro Brenes', email: 'alejandro.b@morphotravel.com', country: 'costa_rica', store: 'CR-GUA-FLAM', role: 'Supervisor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','Ventas'], status: 'activo', plannedHours: 44, realHours: 44, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c25', name: 'Stephanie Vindas', email: 'stephanie.v@morphotravel.com', country: 'costa_rica', store: 'CR-DOKA-SHOP', role: 'Guia/Anfitrion', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Guia turistico','Cafe','Ingles','Aleman'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup5' },
    { id: 'c26', name: 'Kenneth Retana', email: 'kenneth.r@morphotravel.com', country: 'costa_rica', store: 'CR-DOKA-SHOP', role: 'Barista', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Cafe','Preparacion','Cata'], status: 'activo', plannedHours: 40, realHours: 39, delays: 1, absences: 0, supervisor: 'sup5' },
    { id: 'c27', name: 'Priscilla Madrigal', email: 'priscilla.m@morphotravel.com', country: 'costa_rica', store: 'CR-DOKA-SHOP', role: 'Vendedor', contract: 'Medio tiempo', maxHours: 24, availability: 'L-V AM', skills: ['Ventas','Artesania'], status: 'activo', plannedHours: 20, realHours: 20, delays: 0, absences: 0, supervisor: 'sup5' },
    { id: 'c28', name: 'Jonathan Araya', email: 'jonathan.a@morphotravel.com', country: 'costa_rica', store: 'CR-DOKA-SHOP', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup5' },
    { id: 'c29', name: 'Catalina Urena', email: 'catalina.u@morphotravel.com', country: 'costa_rica', store: 'CR-LAPAZ-SHOP', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Naturaleza','Ingles'], status: 'activo', plannedHours: 40, realHours: 38, delays: 0, absences: 1, supervisor: 'sup5' },
    { id: 'c30', name: 'Fabian Zuniga', email: 'fabian.z@morphotravel.com', country: 'costa_rica', store: 'CR-LAPAZ-SHOP', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 42, realHours: 42, delays: 1, absences: 0, supervisor: 'sup5' },
    { id: 'c31', name: 'Viviana Navarro', email: 'viviana.n@morphotravel.com', country: 'costa_rica', store: 'CR-LAPAZ-SHOP', role: 'Anfitrion', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Atencion','Naturaleza','Ingles'], status: 'permiso', plannedHours: 0, realHours: 0, delays: 0, absences: 0, supervisor: 'sup5' },
    { id: 'c32', name: 'Oscar Calderon', email: 'oscar.c@morphotravel.com', country: 'costa_rica', store: 'CR-TABACON', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Turismo','Ingles'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup6' },
    { id: 'c33', name: 'Karla Segura', email: 'karla.s@morphotravel.com', country: 'costa_rica', store: 'CR-TABACON', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'M-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 42, realHours: 41, delays: 0, absences: 0, supervisor: 'sup6' },
    { id: 'c34', name: 'Randall Espinoza', email: 'randall.e@morphotravel.com', country: 'costa_rica', store: 'CR-TABACON', role: 'Anfitrion', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Atencion','Bienestar','Ingles'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup6' },
    { id: 'c35', name: 'Tatiana Cordero', email: 'tatiana.c@morphotravel.com', country: 'costa_rica', store: 'CR-TABACON', role: 'Supervisor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Liderazgo','Operaciones','Ingles'], status: 'activo', plannedHours: 46, realHours: 45, delays: 0, absences: 0, supervisor: 'sup6' },
    { id: 'c36', name: 'Adrian Porras', email: 'adrian.p@morphotravel.com', country: 'costa_rica', store: 'CR-DIAMANTE', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Ventas','Aventura','Ingles'], status: 'activo', plannedHours: 40, realHours: 39, delays: 0, absences: 0, supervisor: 'sup7' },
    { id: 'c37', name: 'Monica Corrales', email: 'monica.c@morphotravel.com', country: 'costa_rica', store: 'CR-DIAMANTE', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Caja','Atencion'], status: 'activo', plannedHours: 42, realHours: 42, delays: 1, absences: 0, supervisor: 'sup7' },
    { id: 'c38', name: 'Hector Rojas', email: 'hector.r@morphotravel.com', country: 'costa_rica', store: 'CR-DIAMANTE', role: 'Anfitrion', contract: 'Medio tiempo', maxHours: 24, availability: 'V-D', skills: ['Atencion','Aventura'], status: 'activo', plannedHours: 20, realHours: 20, delays: 0, absences: 0, supervisor: 'sup7' },
    { id: 'c39', name: 'Ana Lucia Salazar', email: 'analucia.s@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Vendedor', contract: 'Tiempo completo', maxHours: 48, availability: 'M-D', skills: ['Ventas','Ingles','Portugues'], status: 'activo', plannedHours: 40, realHours: 40, delays: 0, absences: 0, supervisor: 'sup8' },
    { id: 'c40', name: 'Bryan Solis', email: 'bryan.s@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-RPV', role: 'Cajero', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Caja','POS','Ingles'], status: 'incapacidad', plannedHours: 0, realHours: 0, delays: 0, absences: 0, supervisor: 'sup8' },
    { id: 'c41', name: 'Irene Montero', email: 'irene.m@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Barista', contract: 'Tiempo completo', maxHours: 48, availability: 'L-S', skills: ['Cafe','Latte art','Ingles'], status: 'activo', plannedHours: 42, realHours: 42, delays: 0, absences: 0, supervisor: 'sup2' },
    { id: 'c42', name: 'Giovanni Montes', email: 'giovanni.m@morphotravel.com', country: 'costa_rica', store: 'CR-SJO-GGO', role: 'Cocina', contract: 'Tiempo completo', maxHours: 48, availability: 'L-D', skills: ['Cocina','Preparacion','Inventario'], status: 'activo', plannedHours: 44, realHours: 43, delays: 1, absences: 0, supervisor: 'sup2' },
    { id: 'c43', name: 'Jimena Cascante', email: 'jimena.c@morphotravel.com', country: 'costa_rica', store: 'CR-LIR-RUMBO', role: 'Vendedor', contract: 'Medio tiempo', maxHours: 24, availability: 'V-D', skills: ['Ventas','Turismo'], status: 'activo', plannedHours: 20, realHours: 20, delays: 0, absences: 0, supervisor: 'sup3' },
    { id: 'c44', name: 'Roberto Quiros', email: 'roberto.q@morphotravel.com', country: 'costa_rica', store: 'CR-SJ-MULTI', role: 'Vendedor', contract: 'Medio tiempo', maxHours: 24, availability: 'S-D', skills: ['Ventas','Moda'], status: 'activo', plannedHours: 16, realHours: 16, delays: 0, absences: 0, supervisor: 'sup4' },
    { id: 'c45', name: 'Paola Elizondo', email: 'paola.e@morphotravel.com', country: 'costa_rica', store: 'CR-TABACON', role: 'Vendedor', contract: 'Medio tiempo', maxHours: 24, availability: 'J-D', skills: ['Ventas','Bienestar'], status: 'activo', plannedHours: 20, realHours: 20, delays: 0, absences: 0, supervisor: 'sup6' }
];

// ===== DATA: RULES =====
const DATA_RULES = [
    { id: 'r1', name: 'Maximo horas semanales', value: 48, type: 'hours', country: 'costa_rica', active: true },
    { id: 'r2', name: 'Minimo horas semanales', value: 16, type: 'hours', country: 'costa_rica', active: true },
    { id: 'r3', name: 'Descanso minimo entre turnos (horas)', value: 12, type: 'rest', country: 'costa_rica', active: true },
    { id: 'r4', name: 'Maximo dias consecutivos', value: 6, type: 'days', country: 'costa_rica', active: true },
    { id: 'r5', name: 'No asignar en vacaciones', value: true, type: 'block', country: 'costa_rica', active: true },
    { id: 'r6', name: 'No asignar en permiso', value: true, type: 'block', country: 'costa_rica', active: true },
    { id: 'r7', name: 'No asignar en incapacidad', value: true, type: 'block', country: 'costa_rica', active: true },
    { id: 'r8', name: 'Validar rol requerido', value: true, type: 'validation', country: 'costa_rica', active: true },
    { id: 'r9', name: 'Alertar subdotacion', value: true, type: 'alert', country: 'costa_rica', active: true },
    { id: 'r10', name: 'Alertar sobredotacion', value: true, type: 'alert', country: 'costa_rica', active: true },
    { id: 'r11', name: 'Supervisor obligatorio franja critica', value: true, type: 'critical', country: 'costa_rica', active: true },
    { id: 'r12', name: 'Alertar horas extra', value: true, type: 'overtime', country: 'costa_rica', active: true }
];
// ===== DATA: AUDIT =====
let DATA_AUDIT = [
    { date: '2024-12-09 09:30', user: 'Sistema', role: 'Sistema', action: 'Actualizo ratios operativos por vertical', module: 'Configuracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: 'Ratios de aeropuertos y F&B recalculados' },
    { date: '2024-12-09 09:00', user: 'Admin Pais', role: 'Admin Pais', action: 'Cambio madurez del forecast a nivel 3', module: 'Motor Inteligente', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: 'Forecast basado en historico 12 semanas + temporada' },
    { date: '2024-12-09 08:45', user: 'Sistema', role: 'Sistema', action: 'Valido integracion GeoVictoria completa', module: 'Integracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: '9 endpoints verificados' },
    { date: '2024-12-09 08:15', user: 'Karen Solano', role: 'Supervisor', action: 'Publico horario semanal', module: 'Planificacion', country: 'Costa Rica', store: 'Rumbo Pura Vida SJO', result: 'Exitoso', detail: 'Semana 9-15 Dic publicada con 28 turnos' },
    { date: '2024-12-09 07:30', user: 'Sistema', role: 'Sistema', action: 'Genero horario inteligente', module: 'Motor Inteligente', country: 'Costa Rica', store: 'Todas', result: 'Exitoso', detail: 'Score optimizacion: 87/100' },
    { date: '2024-12-08 17:00', user: 'Admin Pais', role: 'Admin Pais', action: 'Confirmo datos base para planificacion', module: 'Configuracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: '45 colaboradores, 10 tiendas, 10 turnos confirmados' },
    { date: '2024-12-08 16:45', user: 'Sistema', role: 'Sistema', action: 'Valido 3 conflictos descanso minimo', module: 'Validacion', country: 'Costa Rica', store: 'Rumbo Pura Vida SJO', result: 'Advertencia', detail: 'Colaboradores: c01, c04, c05' },
    { date: '2024-12-08 16:00', user: 'Admin Pais', role: 'Admin Pais', action: 'Completo levantamiento de reglas operativas', module: 'Configuracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: '12 reglas generales + 5 reglas especiales por vertical' },
    { date: '2024-12-08 15:00', user: 'Karen Solano', role: 'Supervisor', action: 'Envio horario a GeoVictoria', module: 'Integracion', country: 'Costa Rica', store: 'Rumbo Pura Vida SJO', result: 'Exitoso', detail: 'Scheduling/SetSchedule HTTP 200' },
    { date: '2024-12-08 10:30', user: 'Maria Rodriguez', role: 'Colaborador', action: 'Solicito cambio de turno', module: 'Cambios Turno', country: 'Costa Rica', store: 'Rumbo Pura Vida SJO', result: 'Pendiente', detail: 'Solicita cambio con Carlos Mendez - Martes' },
    { date: '2024-12-07 14:20', user: 'Karen Solano', role: 'Supervisor', action: 'Aprobo cambio peer-to-peer', module: 'Cambios Turno', country: 'Costa Rica', store: 'Rumbo Pura Vida SJO', result: 'Aprobado', detail: 'Cambio Valeria Solano - Andrea Rojas' },
    { date: '2024-12-07 10:00', user: 'Sistema', role: 'Sistema', action: 'Levantamiento de reglas legales Costa Rica', module: 'Configuracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: 'Codigo de Trabajo: 48h max, descanso 12h, 6 dias consecutivos max' },
    { date: '2024-12-06 11:00', user: 'Admin Pais', role: 'Admin Pais', action: 'Configuro reglas Costa Rica', module: 'Configuracion', country: 'Costa Rica', store: '-', result: 'Exitoso', detail: 'Actualizo 12 reglas de planificacion' }
];
// ===== DATA: SHIFT REQUESTS =====
let DATA_SHIFT_REQUESTS = [
    { id: 'sr1', requester: 'c01', receiver: 'c04', date: '2024-12-10', shift: 'manana', store: 'CR-SJO-RPV', reason: 'Cita medica', status: 'pending_supervisor', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-08 10:30', supervisor: 'sup1', supportFile: null, rejectionNote: null },
    { id: 'sr2', requester: 'c10', receiver: 'c41', date: '2024-12-11', shift: 'apertura', store: 'CR-SJO-GGO', reason: 'Asunto personal', status: 'approved', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-07 08:00', supervisor: 'sup2', supportFile: null, rejectionNote: null },
    { id: 'sr3', requester: 'c15', receiver: 'c43', date: '2024-12-12', shift: 'intermedio', store: 'CR-LIR-RUMBO', reason: 'Estudio', status: 'rejected_rule', validations: { role: true, rest: false, hours: true, available: true, noLeave: true, minStaffing: false }, createdAt: '2024-12-07 14:00', supervisor: 'sup3', supportFile: null, rejectionNote: 'No cumple descanso minimo de 12 horas entre turnos' },
    { id: 'sr4', requester: 'c19', receiver: 'c20', date: '2024-12-13', shift: 'intermedio', store: 'CR-SJ-MULTI', reason: 'Compromiso familiar', status: 'pending_supervisor', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-09 09:15', supervisor: 'sup4', supportFile: null, rejectionNote: null },
    { id: 'sr5', requester: 'c32', receiver: 'c34', date: '2024-12-14', shift: 'manana', store: 'CR-TABACON', reason: 'Cita con especialista', status: 'pending_supervisor', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-09 11:00', supervisor: 'sup6', supportFile: null, rejectionNote: null },
    { id: 'sr6', requester: 'c25', receiver: 'c28', date: '2024-12-11', shift: 'atraccion_am', store: 'CR-DOKA-SHOP', reason: 'Tramite bancario', status: 'pending_supervisor', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-09 08:45', supervisor: 'sup5', supportFile: null, rejectionNote: null },
    { id: 'sr7', requester: 'c22', receiver: 'c23', date: '2024-12-10', shift: 'manana', store: 'CR-GUA-FLAM', reason: 'Capacitacion externa', status: 'pending_supervisor', validations: { role: true, rest: true, hours: true, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-09 07:30', supervisor: 'sup3', supportFile: null, rejectionNote: null },
    { id: 'sr8', requester: 'c07', receiver: 'c09', date: '2024-12-09', shift: 'tarde', store: 'CR-SJO-TES', reason: 'Emergencia personal', status: 'rejected_supervisor', validations: { role: true, rest: true, hours: false, available: true, noLeave: true, minStaffing: true }, createdAt: '2024-12-06 16:00', supervisor: 'sup1', supportFile: null, rejectionNote: 'El cambio generaria horas extra no autorizadas para el receptor' },
    { id: 'sr9', requester: 'c36', receiver: 'c38', date: '2024-12-08', shift: 'atraccion_am', store: 'CR-DIAMANTE', reason: 'Cita odontologica', status: 'rejected_rule', validations: { role: true, rest: true, hours: true, available: false, noLeave: true, minStaffing: true }, createdAt: '2024-12-05 10:00', supervisor: 'sup7', supportFile: null, rejectionNote: 'El companero receptor no tiene disponibilidad en esa fecha' },
    { id: 'sr10', requester: 'c12', receiver: 'c13', date: '2024-12-07', shift: 'apertura', store: 'CR-SJO-GGO', reason: 'Asunto academico', status: 'rejected_supervisor', validations: { role: false, rest: true, hours: true, available: true, noLeave: true, minStaffing: false }, createdAt: '2024-12-04 14:30', supervisor: 'sup2', supportFile: null, rejectionNote: 'Los roles no son compatibles y la tienda quedaria sin cobertura minima' }
];

// ===== DATA: PLANNING =====
let DATA_PLANNING = [];
function generateInitialPlanning() {
    const days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
    const activeCollabs = DATA_COLLABORATORS.filter(c => c.status === 'activo' && c.country === 'costa_rica');
    const shifts = DATA_SHIFTS.filter(s => s.active);
    DATA_PLANNING = [];
    activeCollabs.forEach(collab => {
        const numDays = collab.contract === 'Medio tiempo' ? 4 : 5 + Math.floor(Math.random() * 2);
        const startDay = Math.floor(Math.random() * 2);
        for (let i = startDay; i < startDay + numDays && i < 7; i++) {
            const possibleShifts = shifts.filter(s => {
                if (collab.contract === 'Medio tiempo') return s.type === 'Medio tiempo';
                const store = DATA_STORES.find(st => st.id === collab.store);
                if (store && store.type === 'Attraction') return s.type === 'Atraccion' || s.type === 'Fijo';
                return s.type === 'Fijo' || s.type === 'Nocturno';
            });
            const shift = possibleShifts[Math.floor(Math.random() * possibleShifts.length)] || shifts[1];
            DATA_PLANNING.push({ id:'plan-'+collab.id+'-'+i, collaborator:collab.id, day:i, dayName:days[i], shift:shift.id, shiftName:shift.name, shiftStart:shift.start, shiftEnd:shift.end, store:collab.store, role:collab.role, status: Math.random()>0.3?'published':'draft' });
        }
    });
}

// ===== INITIALIZATION =====
function initApp() {
    const DATA_VERSION = '3';
    if (localStorage.getItem('morpho_version') !== DATA_VERSION) {
        localStorage.removeItem('morpho_audit'); localStorage.removeItem('morpho_requests'); localStorage.removeItem('morpho_planning');
        localStorage.setItem('morpho_version', DATA_VERSION);
    }
    const saved = localStorage.getItem('morpho_audit');
    if (saved) DATA_AUDIT = JSON.parse(saved);
    const savedReq = localStorage.getItem('morpho_requests');
    if (savedReq) DATA_SHIFT_REQUESTS = JSON.parse(savedReq);
    const savedPlan = localStorage.getItem('morpho_planning');
    if (savedPlan) { DATA_PLANNING = JSON.parse(savedPlan); }
    else { generateInitialPlanning(); localStorage.setItem('morpho_planning', JSON.stringify(DATA_PLANNING)); }
}

// ===== LOGIN =====
function doLogin() {
    const role = document.getElementById('login-role').value;
    APP.currentRole = role;
    APP.currentUser = { email: document.getElementById('login-email').value, role: role };
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('header-role').value = role;
    updateUserDisplay(); updateSidebar(); initApp();
    navigateTo(getViewsForRole(role)[0]);
    showToast('Bienvenido a Morpho Smart Scheduling', 'info');
}
function quickLogin(role) {
    APP.currentRole = role;
    const names = { admin_regional:'Admin Regional', admin_pais:'Admin Pais CR', supervisor:'Karen Solano', colaborador:'Maria Rodriguez' };
    APP.currentUser = { email:'demo@morphotravel.com', role:role, name:names[role] };
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('header-role').value = role;
    updateUserDisplay(); updateSidebar(); initApp();
    navigateTo(getViewsForRole(role)[0]);
    showToast('Ingreso como '+names[role], 'info');
}
function doLogout() { document.getElementById('login-screen').classList.remove('hidden'); document.getElementById('app').classList.add('hidden'); APP.currentUser=null; showToast('Sesion cerrada','info'); }
function updateUserDisplay() { const names={admin_regional:'Admin Regional',admin_pais:'Admin Pais CR',supervisor:'Karen Solano',colaborador:'Maria Rodriguez'}; document.querySelector('.user-name').textContent=APP.currentUser?.name||names[APP.currentRole]||'Usuario'; }

// ===== NAVIGATION =====
function navigateTo(view) {
    APP.currentView = view;
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    const navItem = document.querySelector('[data-view="'+view+'"]');
    if(navItem) navItem.classList.add('active');
    const titles={dashboard:'Dashboard Ejecutivo',config:'Configuracion y Reglas',planning:'Planificacion Semanal',engine:'Motor Inteligente',shifts:'Cambios de Turno','planned-vs-real':'Planificado vs Real',geovictoria:'Integracion GeoVictoria',catalogs:'Catalogos',collaborator:'Vista Colaborador',audit:'Bitacora y Auditoria'};
    document.getElementById('page-title').textContent=titles[view]||'Morpho Smart';
    renderView(view);
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('collapsed');document.getElementById('sidebar').classList.toggle('mobile-open');}
function changeCountry(val){APP.currentCountry=val;renderView(APP.currentView);}
function changeRole(val){APP.currentRole=val;updateUserDisplay();updateSidebar();const allowed=getViewsForRole(val);if(!allowed.includes(APP.currentView))navigateTo(allowed[0]);else renderView(APP.currentView);}
function getViewsForRole(role){switch(role){case 'admin_regional':return['dashboard','config','planning','engine','shifts','planned-vs-real','geovictoria','catalogs','collaborator','audit'];case 'admin_pais':return['dashboard','config','planning','engine','shifts','planned-vs-real','geovictoria','catalogs','audit'];case 'supervisor':return['dashboard','planning','engine','shifts','planned-vs-real','catalogs','audit'];case 'colaborador':return['collaborator','shifts'];default:return['dashboard'];}}
function updateSidebar(){const allowed=getViewsForRole(APP.currentRole);document.querySelectorAll('.nav-item').forEach(item=>{item.style.display=allowed.includes(item.getAttribute('data-view'))?'':'none';});}

// ===== UTILITIES =====
function showToast(msg,type){type=type||'success';const container=document.getElementById('toast-container');const toast=document.createElement('div');toast.className='toast '+type;toast.innerHTML='<span>'+msg+'</span>';container.appendChild(toast);setTimeout(function(){toast.remove();},4000);}
function openModal(title,bodyHtml,footerHtml){document.getElementById('modal-title').textContent=title;document.getElementById('modal-body').innerHTML=bodyHtml;document.getElementById('modal-footer').innerHTML=footerHtml||'';document.getElementById('modal-overlay').classList.remove('hidden');}
function closeModal(event){if(event&&event.target!==document.getElementById('modal-overlay'))return;document.getElementById('modal-overlay').classList.add('hidden');}
function addAudit(action,module,store,result,detail){const now=new Date();const d=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');const rn={admin_regional:'Admin Regional',admin_pais:'Admin Pais',supervisor:'Supervisor',colaborador:'Colaborador'};const un={admin_regional:'Admin Regional',admin_pais:'Admin Pais',supervisor:'Karen Solano',colaborador:'Maria Rodriguez'};DATA_AUDIT.unshift({date:d,user:APP.currentUser?.name||un[APP.currentRole],role:rn[APP.currentRole],action:action,module:module,country:'Costa Rica',store:store||'-',result:result||'Exitoso',detail:detail||''});localStorage.setItem('morpho_audit',JSON.stringify(DATA_AUDIT));}
function exportCSV(headers,rows,filename){let csv=headers.join(',')+String.fromCharCode(10);rows.forEach(function(r){csv+=r.map(function(c){return '"'+c+'"';}).join(',')+String.fromCharCode(10);});const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);showToast('Exportado: '+filename,'success');addAudit('Exporto CSV',APP.currentView,'-','Exitoso',filename);}

// ===== RENDER VIEWS =====
function renderView(view){const content=document.getElementById('content');switch(view){case 'dashboard':content.innerHTML=renderDashboard();break;case 'config':content.innerHTML=renderConfig();break;case 'planning':content.innerHTML=renderPlanning();break;case 'engine':content.innerHTML=renderEngine();break;case 'shifts':content.innerHTML=renderShifts();break;case 'planned-vs-real':content.innerHTML=renderPlannedVsReal();break;case 'geovictoria':content.innerHTML=renderGeoVictoria();break;case 'catalogs':content.innerHTML=renderCatalogs();break;case 'collaborator':content.innerHTML=renderCollaborator();break;case 'audit':content.innerHTML=renderAudit();break;default:content.innerHTML=renderDashboard();}}

// ===== DASHBOARD =====
function renderDashboard(){
    const country=DATA_COUNTRIES.find(c=>c.id===APP.currentCountry);
    const stores=DATA_STORES.filter(s=>s.country===APP.currentCountry);
    const collabs=DATA_COLLABORATORS.filter(c=>c.country===APP.currentCountry);
    const activeCollabs=collabs.filter(c=>c.status==='activo');
    const totalPlanned=activeCollabs.reduce((s,c)=>s+c.plannedHours,0);
    const totalReal=activeCollabs.reduce((s,c)=>s+c.realHours,0);
    const pendingReq=DATA_SHIFT_REQUESTS.filter(r=>r.status==='pending_supervisor').length;
    return '<div class="kpi-grid">'+
    '<div class="kpi-card blue"><div class="kpi-label">Pais Activo</div><div class="kpi-value">'+(country?.name||'Costa Rica')+'</div><div class="kpi-sub">'+(country?.status||'Activo')+'</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Tiendas Activas</div><div class="kpi-value">'+stores.filter(s=>s.active).length+'</div><div class="kpi-sub">de '+stores.length+' registradas</div></div>'+
    '<div class="kpi-card green"><div class="kpi-label">Colaboradores</div><div class="kpi-value">'+collabs.length+'</div><div class="kpi-sub">'+activeCollabs.length+' activos</div></div>'+
    '<div class="kpi-card gold"><div class="kpi-label">Supervisores</div><div class="kpi-value">'+DATA_SUPERVISORS.filter(s=>s.country===APP.currentCountry).length+'</div><div class="kpi-sub">asignados</div></div>'+
    '</div><div class="kpi-grid">'+
    '<div class="kpi-card"><div class="kpi-label">Horas Planificadas/Sem</div><div class="kpi-value">'+totalPlanned+'</div><div class="kpi-sub">esta semana</div></div>'+
    '<div class="kpi-card green"><div class="kpi-label">Horas Reales</div><div class="kpi-value">'+totalReal+'</div><div class="kpi-sub">registradas</div></div>'+
    '<div class="kpi-card '+(totalPlanned-totalReal>20?'red':'gold')+'"><div class="kpi-label">Brecha Plan vs Real</div><div class="kpi-value">'+(totalPlanned-totalReal)+'h</div><div class="kpi-sub">'+((totalReal/totalPlanned)*100).toFixed(1)+'% cumplimiento</div></div>'+
    '<div class="kpi-card red"><div class="kpi-label">Solicitudes Pendientes</div><div class="kpi-value">'+pendingReq+'</div><div class="kpi-sub">cambios de turno</div></div>'+
    '</div>'+
    '<div class="grid-2"><div class="card"><div class="card-header"><h3>Demanda por Franja Horaria</h3></div><div class="chart-bar-container">'+
    '<div class="chart-bar-row"><div class="chart-bar-label">05:00-08:00</div><div class="chart-bar-track"><div class="chart-bar-fill gold" style="width:85%">Alta</div></div></div>'+
    '<div class="chart-bar-row"><div class="chart-bar-label">08:00-12:00</div><div class="chart-bar-track"><div class="chart-bar-fill celeste" style="width:60%">Media</div></div></div>'+
    '<div class="chart-bar-row"><div class="chart-bar-label">12:00-15:00</div><div class="chart-bar-track"><div class="chart-bar-fill gold" style="width:90%">Alta</div></div></div>'+
    '<div class="chart-bar-row"><div class="chart-bar-label">15:00-18:00</div><div class="chart-bar-track"><div class="chart-bar-fill celeste" style="width:55%">Media</div></div></div>'+
    '<div class="chart-bar-row"><div class="chart-bar-label">18:00-20:00</div><div class="chart-bar-track"><div class="chart-bar-fill green" style="width:45%">Baja</div></div></div>'+
    '<div class="chart-bar-row"><div class="chart-bar-label">20:00-23:00</div><div class="chart-bar-track"><div class="chart-bar-fill gold" style="width:80%">Alta</div></div></div>'+
    '</div></div>'+
    '<div class="card"><div class="card-header"><h3>Ranking Tiendas</h3></div><table><thead><tr><th>Tienda</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>'+
    stores.filter(s=>s.active).slice(0,6).map(s=>'<tr><td>'+s.name+'</td><td>'+s.type+'</td><td><span class="badge badge-active">OK</span></td></tr>').join('')+
    '</tbody></table></div></div>';
}

// ===== CONFIG VIEW =====
function renderConfig(){
    return '<div class="tabs" id="config-tabs">'+
    '<div class="tab active" onclick="switchConfigTab(\'countries\')">Paises</div>'+
    '<div class="tab" onclick="switchConfigTab(\'stores\')">Tiendas</div>'+
    '<div class="tab" onclick="switchConfigTab(\'verticals\')">Verticales y Ratios</div>'+
    '<div class="tab" onclick="switchConfigTab(\'roles\')">Roles</div>'+
    '<div class="tab" onclick="switchConfigTab(\'shifts\')">Turnos</div>'+
    '<div class="tab" onclick="switchConfigTab(\'rules\')">Reglas</div>'+
    '<div class="tab" onclick="switchConfigTab(\'demand\')">Franjas Demanda</div>'+
    '<div class="tab" onclick="switchConfigTab(\'holidays\')">Feriados</div>'+
    '<div class="tab" onclick="switchConfigTab(\'geo-config\')">Integracion GeoVictoria</div>'+
    '</div><div id="config-content">'+renderConfigCountries()+'</div>';
}
function switchConfigTab(tab){
    document.querySelectorAll('#config-tabs .tab').forEach(t=>t.classList.remove('active'));
    event.target.classList.add('active');
    const el=document.getElementById('config-content');
    switch(tab){
        case 'countries':el.innerHTML=renderConfigCountries();break;
        case 'stores':el.innerHTML=renderConfigStores();break;
        case 'verticals':el.innerHTML=renderConfigVerticals();break;
        case 'roles':el.innerHTML=renderConfigRoles();break;
        case 'shifts':el.innerHTML=renderConfigShifts();break;
        case 'rules':el.innerHTML=renderConfigRules();break;
        case 'demand':el.innerHTML=renderConfigDemand();break;
        case 'holidays':el.innerHTML=renderConfigHolidays();break;
        case 'geo-config':el.innerHTML=renderConfigGeo();break;
    }
}
function renderConfigCountries(){
    return '<div class="card"><div class="card-header"><h3>Paises Configurados</h3><button class="btn btn-primary btn-sm" onclick="openModal(\'Crear Pais\',\'<div class=form-group><label>Nombre</label><input placeholder=Nombre></div><div class=form-group><label>Moneda</label><input placeholder=USD></div>\',\'<button class=btn.btn-outline onclick=closeModal()>Cancelar</button><button class=btn.btn-primary onclick=closeModal();showToast(Pais.creado,success)>Crear</button>\')">+ Crear Pais</button></div>'+
    '<table><thead><tr><th>Pais</th><th>Fase</th><th>Estado</th><th>Moneda</th><th>Zona Horaria</th><th>Acciones</th></tr></thead><tbody>'+
    DATA_COUNTRIES.map(c=>'<tr><td>'+c.flag+' '+c.name+'</td><td><span class="badge badge-active">'+c.phase+'</span></td><td>'+c.status+'</td><td>'+c.currency+'</td><td>'+c.timezone+'</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Pais editado\',\'info\')">Editar</button></td></tr>').join('')+
    '</tbody></table></div>';
}
function renderConfigStores(){
    const stores=DATA_STORES.filter(s=>APP.currentRole==='admin_regional'||s.country===APP.currentCountry);
    return '<div class="card"><div class="card-header"><h3>Tiendas / Ubicaciones</h3><button class="btn btn-primary btn-sm" onclick="openCreateStoreModal()">+ Agregar Tienda</button></div>'+
    '<table><thead><tr><th>Tienda</th><th>Tipo</th><th>Horario</th><th>Centro Costo</th><th>Cod. GeoVictoria</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+
    stores.map(s=>'<tr><td>'+s.name+'</td><td>'+s.type+'</td><td>'+s.hours+(s.is24h?' (24h)':'')+'</td><td>'+s.costCenter+'</td><td>'+s.geoCode+'</td><td><span class="badge '+(s.active?'badge-active':'badge-future')+'">'+(s.active?'Activa':'Pendiente')+'</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Tienda editada\',\'info\')">Editar</button></td></tr>').join('')+
    '</tbody></table></div>';
}

function renderConfigVerticals(){
    return '<div class="card"><div class="card-header"><h3>Verticales y Ratios Operativos</h3><button class="btn btn-primary btn-sm" onclick="showToast(\'Vertical creada\',\'success\')">+ Agregar Vertical</button></div>'+
    '<p style="font-size:13px;color:var(--text-light);margin-bottom:16px">Configuracion de ratios de dotacion por tipo de operacion.</p>'+
    '<table><thead><tr><th>Vertical</th><th>Ratio Principal</th><th>Frecuencia</th><th>Tiendas</th><th>Acciones</th></tr></thead><tbody>'+
    '<tr><td>Aeropuertos</td><td>Personal por vuelos / transacciones</td><td>Variable por franja</td><td>4</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Vertical editada\',\'info\')">Configurar</button></td></tr>'+
    '<tr><td>Street Locations</td><td>Personal por ventas / visitantes</td><td>Semanal fija</td><td>2</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Vertical editada\',\'info\')">Configurar</button></td></tr>'+
    '<tr><td>Hoteles y Atracciones</td><td>Personal por huespedes / visitantes</td><td>Semanal variable</td><td>5</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Vertical editada\',\'info\')">Configurar</button></td></tr>'+
    '<tr><td>Alimentos y Bebidas</td><td>Personal por mesas / transacciones</td><td>Variable por franja</td><td>1</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Vertical editada\',\'info\')">Configurar</button></td></tr>'+
    '</tbody></table></div>'+
    '<div class="card"><div class="card-header"><h3>Ratios de Personal</h3><button class="btn btn-success btn-sm" onclick="showToast(\'Ratios guardados\',\'success\');addAudit(\'Guardo ratios operativos\',\'Configuracion\',\'-\',\'Exitoso\',\'Ratios actualizados\')">Guardar Ratios</button></div>'+
    '<table><thead><tr><th>Ratio</th><th>Vertical</th><th>Valor Base</th><th>Ajuste Temporada</th><th>Estado</th></tr></thead><tbody>'+
    '<tr><td>Personal por ventas</td><td>Street Locations</td><td>1 por cada 500K/dia</td><td>+20% temporada alta</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '<tr><td>Personal por transacciones</td><td>Aeropuertos, F&B</td><td>1 por cada 80 txn/turno</td><td>+30% alta temporada</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '<tr><td>Personal por visitantes</td><td>Atracciones</td><td>1 por cada 120 visitantes</td><td>+25% temporada</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '<tr><td>Personal por vuelos</td><td>Aeropuertos</td><td>1 adicional por cada 3 vuelos/hora</td><td>+15% temporada</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '<tr><td>Personal por huespedes</td><td>Hoteles</td><td>1 por cada 50 huespedes activos</td><td>+20% alta ocupacion</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '<tr><td>Personal por mesas/atencion</td><td>Alimentos y Bebidas</td><td>1 por cada 8 mesas activas</td><td>+30% horas pico</td><td><span class="badge badge-active">Activo</span></td></tr>'+
    '</tbody></table></div>'+
    '<div class="card"><div class="card-header"><h3>Reglas por Contexto</h3></div><div class="grid-3">'+
    '<div style="padding:12px;background:var(--bg);border-radius:8px"><h4 style="font-size:13px;margin-bottom:8px">Por Franja Horaria</h4><ul style="font-size:12px;padding-left:16px;color:var(--text-light)"><li>Madrugada (04:00-07:00): +50% aeropuerto</li><li>Pico AM (07:00-09:00): refuerzo F&B</li><li>Mediodia (11:00-14:00): refuerzo atracciones</li><li>Tarde (17:00-20:00): refuerzo street</li><li>Noche (20:00-23:00): +30% aeropuerto</li></ul></div>'+
    '<div style="padding:12px;background:var(--bg);border-radius:8px"><h4 style="font-size:13px;margin-bottom:8px">Por Temporada</h4><ul style="font-size:12px;padding-left:16px;color:var(--text-light)"><li>Alta (Dic-Abr): +30% todas</li><li>Semana Santa: +40% atracciones</li><li>Temporada verde (May-Nov): base</li><li>Black Friday: +20% street/aeropuerto</li></ul></div>'+
    '<div style="padding:12px;background:var(--bg);border-radius:8px"><h4 style="font-size:13px;margin-bottom:8px">Legales por Pais</h4><ul style="font-size:12px;padding-left:16px;color:var(--text-light)"><li>Costa Rica: max 48h/semana</li><li>Costa Rica: descanso min 12h entre turnos</li><li>Costa Rica: max 6 dias consecutivos</li><li>Costa Rica: recargo nocturno obligatorio</li><li>Costa Rica: dia libre semanal obligatorio</li></ul></div>'+
    '</div></div>';
}
function renderConfigRoles(){
    const roles=['Vendedor','Cajero','Anfitrion Cultural','Bodega','Supervisor','Barista','Cocina','Reposicion','Guia/Anfitrion','Encargado de tienda'];
    const compat={Supervisor:['Vendedor','Cajero'],Vendedor:['Cajero'],Barista:['Cajero'],'Anfitrion Cultural':['Vendedor'],Bodega:['Reposicion']};
    return '<div class="card"><div class="card-header"><h3>Roles Operativos</h3><button class="btn btn-primary btn-sm" onclick="showToast(\'Rol creado\',\'success\')">+ Crear Rol</button></div>'+
    '<table><thead><tr><th>Rol</th><th>Critico</th><th>Puede cubrir</th><th>Acciones</th></tr></thead><tbody>'+
    roles.map(r=>'<tr><td>'+r+'</td><td>'+(['Supervisor','Encargado de tienda'].includes(r)?'<span class="badge badge-conflict">Critico</span>':'-')+'</td><td>'+(compat[r]||[]).join(', ')||'N/A'+'</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Rol editado\',\'info\')">Editar</button></td></tr>').join('')+
    '</tbody></table></div>';
}
function renderConfigShifts(){
    return '<div class="card"><div class="card-header"><h3>Catalogo de Turnos</h3><button class="btn btn-primary btn-sm" onclick="showToast(\'Turno creado\',\'success\')">+ Crear Turno</button></div>'+
    '<table><thead><tr><th>Turno</th><th>Inicio</th><th>Fin</th><th>Descanso</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+
    DATA_SHIFTS.map(s=>'<tr><td>'+s.name+'</td><td>'+s.start+'</td><td>'+s.end+'</td><td>'+s.break+' min</td><td>'+s.type+'</td><td><span class="badge badge-active">Activo</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Turno editado\',\'info\')">Editar</button></td></tr>').join('')+
    '</tbody></table></div>';
}
function renderConfigRules(){
    return '<div class="card"><div class="card-header"><h3>Reglas de Planificacion</h3><button class="btn btn-success btn-sm" onclick="saveRules()">Guardar Configuracion</button></div>'+
    '<table><thead><tr><th>Regla</th><th>Valor</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+
    DATA_RULES.map(r=>'<tr><td>'+r.name+'</td><td>'+r.value+'</td><td>'+r.type+'</td><td><span class="badge '+(r.active?'badge-active':'badge-future')+'">'+(r.active?'Activa':'Inactiva')+'</span></td><td><button class="btn btn-sm btn-outline" onclick="toggleRule(\''+r.id+'\')">Toggle</button></td></tr>').join('')+
    '</tbody></table></div>';
}
function renderConfigDemand(){
    return '<div class="card"><div class="card-header"><h3>Franjas de Demanda</h3><button class="btn btn-primary btn-sm" onclick="showToast(\'Franja creada\',\'success\')">+ Crear Franja</button></div>'+
    '<table><thead><tr><th>Tienda</th><th>Horario</th><th>Demanda</th><th>Min</th><th>Max</th><th>Acciones</th></tr></thead><tbody>'+
    '<tr><td>Rumbo Pura Vida SJO</td><td>05:00-08:00</td><td><span class="badge badge-pending">Alta</span></td><td>4</td><td>8</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Rumbo Pura Vida SJO</td><td>12:00-15:00</td><td><span class="badge badge-pending">Alta</span></td><td>5</td><td>8</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Grab & Go SJO</td><td>06:00-08:00</td><td><span class="badge badge-conflict">Critica</span></td><td>3</td><td>6</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Doka Estate</td><td>10:00-14:00</td><td><span class="badge badge-pending">Alta</span></td><td>3</td><td>5</td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '</tbody></table></div>';
}
function renderConfigHolidays(){
    return '<div class="card"><div class="card-header"><h3>Feriados y Temporadas</h3><button class="btn btn-primary btn-sm" onclick="showToast(\'Feriado creado\',\'success\')">+ Crear</button></div>'+
    '<table><thead><tr><th>Nombre</th><th>Fecha</th><th>Tipo</th><th>Impacto</th><th>Acciones</th></tr></thead><tbody>'+
    '<tr><td>Navidad</td><td>25 Dic</td><td>Feriado</td><td><span class="badge badge-pending">+30%</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Semana Santa</td><td>Mar-Abr</td><td>Temporada Alta</td><td><span class="badge badge-conflict">Critico</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Temporada Alta Turismo</td><td>Dic-Abr</td><td>Temporada Alta</td><td><span class="badge badge-pending">+30%</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '<tr><td>Black Friday</td><td>Nov</td><td>Evento Especial</td><td><span class="badge badge-pending">+20%</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Editado\',\'info\')">Editar</button></td></tr>'+
    '</tbody></table></div>';
}
function renderConfigGeo(){
    return '<div class="card"><div class="card-header"><h3>Configuracion Integracion GeoVictoria</h3></div>'+
    '<div class="grid-2"><div class="form-group"><label>Ambiente</label><select><option>Pruebas</option><option>Produccion</option></select></div>'+
    '<div class="form-group"><label>URL Base</label><input value="https://pruebas.geovictoria.com" readonly></div>'+
    '<div class="form-group"><label>API Key</label><input value="************dk4F" readonly></div>'+
    '<div class="form-group"><label>Secret</label><input value="************s3cr" readonly></div>'+
    '<div class="form-group"><label>Estado Conexion</label><span class="badge badge-active">Conectado</span></div>'+
    '<div class="form-group"><label>Ultima Sincronizacion</label><span>2024-12-09 08:00</span></div></div>'+
    '<div style="margin-top:16px;display:flex;gap:8px">'+
    '<button class="btn btn-secondary" onclick="showToast(\'Conexion exitosa\',\'success\')">Probar Conexion</button>'+
    '<button class="btn btn-primary" onclick="showToast(\'Sincronizacion completa\',\'success\');addAudit(\'Sincronizo con GeoVictoria\',\'Integracion\',\'-\',\'Exitoso\',\'45 colaboradores sincronizados\')">Sincronizar Ahora</button>'+
    '<button class="btn btn-outline" onclick="showToast(\'Logs cargados\',\'info\')">Ver Logs</button></div></div>';
}
function saveRules(){localStorage.setItem('morpho_rules',JSON.stringify(DATA_RULES));showToast('Configuracion de reglas guardada','success');addAudit('Guardo reglas','Configuracion','-','Exitoso',DATA_RULES.length+' reglas');}
function toggleRule(id){const r=DATA_RULES.find(x=>x.id===id);if(r){r.active=!r.active;renderView('config');showToast('Regla '+(r.active?'activada':'desactivada'),'info');}}

// ===== PLANNING VIEW =====
function renderPlanning(){
    const days=['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
    const stores=DATA_STORES.filter(s=>s.country===APP.currentCountry&&s.active);
    const selectedStore=stores[0]?.id||'';
    const planForStore=DATA_PLANNING.filter(p=>p.store===selectedStore);
    return '<div class="filters">'+
    '<div class="form-group"><label>Tienda</label><select id="planning-store" onchange="renderView(\'planning\')">'+stores.map(s=>'<option value="'+s.id+'">'+s.name+'</option>').join('')+'</select></div>'+
    '<div class="form-group"><label>Semana</label><input type="week" value="2024-W50"></div>'+
    '<div class="form-group"><label>Supervisor</label><select><option value="">Todos</option>'+DATA_SUPERVISORS.filter(s=>s.country===APP.currentCountry).map(s=>'<option>'+s.name+'</option>').join('')+'</select></div></div>'+
    '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">'+
    '<button class="btn btn-secondary" onclick="generateSmartSchedule()">Generar Horario Inteligente</button>'+
    '<button class="btn btn-outline" onclick="validateRules()">Validar Reglas</button>'+
    '<button class="btn btn-success" onclick="publishSchedule()">Publicar Horario</button>'+
    '<button class="btn btn-primary" onclick="sendToGeoVictoria()">Enviar a GeoVictoria</button>'+
    '<button class="btn btn-outline" onclick="exportPlanningCSV()">Exportar CSV</button></div>'+
    '<div class="calendar-grid">'+
    days.map(function(day,i){
        const dayPlans=planForStore.filter(p=>p.day===i);
        return '<div class="calendar-day"><div class="calendar-day-header">'+day+'</div>'+
        dayPlans.map(function(p){
            const collab=DATA_COLLABORATORS.find(c=>c.id===p.collaborator);
            const sc=p.status==='conflict'?'conflict':p.status==='published'?'published':p.status==='sent'?'sent':'';
            return '<div class="shift-card '+sc+'" onclick="openEditShiftModal(\''+p.id+'\')"><div class="shift-name">'+(collab?.name?.split(' ')[0]||'N/A')+'</div><div class="shift-time">'+p.shiftStart+'-'+p.shiftEnd+'</div><div style="font-size:10px">'+p.role+'</div></div>';
        }).join('')+
        (dayPlans.length===0?'<div style="font-size:11px;color:#999;text-align:center">Sin asignaciones</div>':'')+
        '</div>';
    }).join('')+'</div>'+
    '<div class="card" style="margin-top:16px"><div class="card-header"><h3>Leyenda</h3></div><div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px"><span class="badge badge-draft">Borrador</span><span class="badge badge-validated">Validado</span><span class="badge badge-conflict">Conflicto</span><span class="badge badge-published">Publicado</span><span class="badge badge-sent">Enviado GeoVictoria</span></div></div>';
}

// ===== ENGINE VIEW =====
function renderEngine(){
    const suggestions=[
        {text:'Agregar 2 vendedores de 12:00 a 15:00 en Rumbo Pura Vida SJO',priority:'high'},
        {text:'Asignar barista adicional en Grab & Go SJO franja 06:00-08:00',priority:'high'},
        {text:'Reducir 1 cajero en franja 18:00-20:00 en Travel Essentials SJO',priority:'medium'},
        {text:'Reforzar anfitrion cultural en Doka Estate entre 10:00 y 14:00',priority:'medium'},
        {text:'Validar supervisor disponible para turno nocturno SJO',priority:'high'},
        {text:'Reforzar personal Multiplaza Escazu viernes-domingo',priority:'low'},
        {text:'Reasignar Bodega de turno Cierre a Manana por subdotacion AM',priority:'medium'}
    ];
    return '<div class="kpi-grid">'+
    '<div class="kpi-card blue"><div class="kpi-label">Score Optimizacion</div><div class="kpi-value">87/100</div><div class="kpi-sub">Semana actual</div></div>'+
    '<div class="kpi-card green"><div class="kpi-label">Riesgo Operativo</div><div class="kpi-value">Medio</div><div class="kpi-sub">2 tiendas con subdotacion</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Sugerencias Pendientes</div><div class="kpi-value">'+suggestions.length+'</div><div class="kpi-sub">para aplicar</div></div></div>'+
    '<div class="grid-2"><div class="card"><div class="card-header"><h3>Recomendaciones del Motor</h3><button class="btn btn-success btn-sm" onclick="applySuggestions()">Aplicar Todas</button></div>'+
    suggestions.map(s=>'<div class="suggestion-card"><div class="sug-text">'+s.text+'</div><span class="sug-priority '+s.priority+'">'+(s.priority==='high'?'Alta':s.priority==='medium'?'Media':'Baja')+'</span><button class="btn btn-sm btn-outline" onclick="showToast(\'Sugerencia aplicada\',\'success\')">Aplicar</button></div>').join('')+
    '</div><div class="card"><div class="card-header"><h3>Dotacion por Tienda</h3></div><div class="chart-bar-container">'+
    DATA_STORES.filter(s=>s.country===APP.currentCountry&&s.active).slice(0,6).map(function(s){
        const planned=DATA_PLANNING.filter(p=>p.store===s.id).length;
        const needed=s.minStaff*6;const pct=Math.min(100,(planned/Math.max(needed,1))*100);
        return '<div class="chart-bar-row"><div class="chart-bar-label" style="width:150px;font-size:11px">'+s.name.substring(0,18)+'</div><div class="chart-bar-track"><div class="chart-bar-fill '+(pct>=80?'green':pct>=60?'gold':'red')+'" style="width:'+pct+'%">'+Math.round(pct)+'%</div></div></div>';
    }).join('')+'</div></div></div>';
}

// ===== SHIFTS VIEW =====
function renderShifts(){
    if(APP.currentRole==='colaborador') return renderShiftsCollaborator();
    return renderShiftsSupervisor();
}
function renderShiftsSupervisor(){
    const statusLabels={pending_supervisor:'Pendiente Aprobacion',pending_collab:'Pendiente Aceptacion',approved:'Aprobado',rejected_rule:'Rechazado por Regla',rejected_supervisor:'Rechazado por Supervisor'};
    const statusBadge={pending_supervisor:'badge-pending',pending_collab:'badge-expansion',approved:'badge-active',rejected_rule:'badge-conflict',rejected_supervisor:'badge-conflict'};
    const pending=DATA_SHIFT_REQUESTS.filter(r=>r.status==='pending_supervisor'||r.status==='pending_collab');
    const approved=DATA_SHIFT_REQUESTS.filter(r=>r.status==='approved');
    const rejected=DATA_SHIFT_REQUESTS.filter(r=>r.status==='rejected_rule'||r.status==='rejected_supervisor');
    if(!window._shiftsTab) window._shiftsTab='pending';
    let list=[];
    if(window._shiftsTab==='pending') list=pending;
    else if(window._shiftsTab==='approved') list=approved;
    else list=rejected;
    const cards=list.map(function(req){
        const requester=DATA_COLLABORATORS.find(c=>c.id===req.requester);
        const receiver=DATA_COLLABORATORS.find(c=>c.id===req.receiver);
        const shift=DATA_SHIFTS.find(s=>s.id===req.shift);
        return '<div class="request-card"><div class="req-header"><span class="req-title">'+(requester?.name||'N/A')+' - '+(receiver?.name||'N/A')+'</span><span class="badge '+(statusBadge[req.status]||'')+'">'+(statusLabels[req.status]||req.status)+'</span></div>'+
        '<div class="req-details"><strong>Turno:</strong> '+(shift?.name||req.shift)+' | <strong>Fecha:</strong> '+req.date+' | <strong>Tienda:</strong> '+(DATA_STORES.find(s=>s.id===req.store)?.name||req.store)+'<br><strong>Motivo:</strong> '+req.reason+' | <strong>Solicitado:</strong> '+req.createdAt+
        (req.supportFile?'<br><span style="color:var(--celeste)">Archivo adjunto: <strong>'+req.supportFile.name+'</strong> ('+req.supportFile.size+')</span>':'')+
        (req.rejectionNote?'<br><span style="color:var(--red)">Observacion: <em>'+req.rejectionNote+'</em></span>':'')+'</div>'+
        '<div class="req-validations">'+
        '<span class="validation-tag '+(req.validations.role?'pass':'fail')+'">Rol compatible '+(req.validations.role?'SI':'NO')+'</span>'+
        '<span class="validation-tag '+(req.validations.rest?'pass':'fail')+'">Descanso min '+(req.validations.rest?'SI':'NO')+'</span>'+
        '<span class="validation-tag '+(req.validations.hours?'pass':'fail')+'">Sin H. Extra '+(req.validations.hours?'SI':'NO')+'</span>'+
        '<span class="validation-tag '+(req.validations.available?'pass':'fail')+'">Disponible '+(req.validations.available?'SI':'NO')+'</span>'+
        '<span class="validation-tag '+(req.validations.noLeave?'pass':'fail')+'">Legal OK '+(req.validations.noLeave?'SI':'NO')+'</span>'+
        '<span class="validation-tag '+(req.validations.minStaffing!==false?'pass':'fail')+'">Dotacion min '+(req.validations.minStaffing!==false?'SI':'NO')+'</span>'+
        '<span class="validation-tag pass">Notif. Supervisor SI</span></div>'+
        '<div style="display:flex;gap:8px">'+
        (req.status==='pending_supervisor'?'<button class="btn btn-success btn-sm" onclick="approveShiftRequest(\''+req.id+'\')">Aprobar</button><button class="btn btn-danger btn-sm" onclick="openRejectModal(\''+req.id+'\')">Rechazar</button>':'')+
        '<button class="btn btn-outline btn-sm" onclick="viewShiftRequestDetail(\''+req.id+'\')">Ver Detalle</button></div></div>';
    }).join('');
    return '<div class="tabs">'+
    '<div class="tab '+(window._shiftsTab==='pending'?'active':'')+'" onclick="window._shiftsTab=\'pending\';renderView(\'shifts\')">Pendientes ('+pending.length+')</div>'+
    '<div class="tab '+(window._shiftsTab==='approved'?'active':'')+'" onclick="window._shiftsTab=\'approved\';renderView(\'shifts\')">Aprobadas ('+approved.length+')</div>'+
    '<div class="tab '+(window._shiftsTab==='rejected'?'active':'')+'" onclick="window._shiftsTab=\'rejected\';renderView(\'shifts\')">Rechazadas ('+rejected.length+')</div></div>'+
    (cards||'<p style="text-align:center;color:var(--text-light);padding:24px">No hay solicitudes en esta categoria</p>');
}
function renderShiftsCollaborator(){
    const myShifts=DATA_PLANNING.filter(p=>p.collaborator==='c01').slice(0,5);
    const compatibles=DATA_COLLABORATORS.filter(c=>c.store==='CR-SJO-RPV'&&c.id!=='c01'&&c.status==='activo');
    const myReqs=DATA_SHIFT_REQUESTS.filter(r=>r.requester==='c01'||r.receiver==='c01');
    const statusLabels={pending_supervisor:'Pendiente',approved:'Aprobado',rejected_rule:'Rechazado por Regla',rejected_supervisor:'Rechazado por Supervisor'};
    const statusBadges={pending_supervisor:'badge-pending',approved:'badge-active',rejected_rule:'badge-conflict',rejected_supervisor:'badge-conflict'};
    return '<div class="card"><div class="card-header"><h3>Mis Proximos Turnos</h3><button class="btn btn-secondary btn-sm" onclick="openRequestShiftChange()">Solicitar Cambio</button></div>'+
    '<div class="collab-schedule">'+myShifts.map(s=>'<div class="collab-shift-card"><div class="day">'+s.dayName+'</div><div class="time">'+s.shiftStart+'-'+s.shiftEnd+'</div><div class="store">'+s.shiftName+' - '+s.role+'</div></div>').join('')+'</div></div>'+
    '<div class="card"><div class="card-header"><h3>Estado de Mis Solicitudes</h3></div>'+
    (myReqs.length>0?'<table><thead><tr><th>Fecha</th><th>Con</th><th>Turno</th><th>Motivo</th><th>Estado</th><th>Observacion</th></tr></thead><tbody>'+
    myReqs.map(function(r){const other=r.requester==='c01'?DATA_COLLABORATORS.find(c=>c.id===r.receiver):DATA_COLLABORATORS.find(c=>c.id===r.requester);return '<tr><td>'+r.date+'</td><td>'+(other?.name||'N/A')+'</td><td>'+r.shift+'</td><td>'+r.reason+'</td><td><span class="badge '+(statusBadges[r.status]||'badge-future')+'">'+(statusLabels[r.status]||r.status)+'</span></td><td style="font-size:12px;color:var(--text-light)">'+(r.rejectionNote||'-')+'</td></tr>';}).join('')+
    '</tbody></table>':'<p style="color:var(--text-light)">No tienes solicitudes</p>')+'</div>'+
    '<div class="card"><div class="card-header"><h3>Companeros Compatibles</h3></div><table><thead><tr><th>Nombre</th><th>Rol</th><th>Accion</th></tr></thead><tbody>'+
    compatibles.map(c=>'<tr><td>'+c.name+'</td><td>'+c.role+'</td><td><button class="btn btn-sm btn-outline" onclick="openRequestShiftChangeWith(\''+c.id+'\')">Solicitar</button></td></tr>').join('')+'</tbody></table></div>';
}

// ===== PLANNED VS REAL =====
function renderPlannedVsReal(){
    const stores=DATA_STORES.filter(s=>s.country===APP.currentCountry&&s.active);
    const storeData=stores.map(function(s){const req=s.minStaff*7*8;const plan=req-Math.floor(Math.random()*15);const real=plan-Math.floor(Math.random()*12);return{name:s.name,type:s.type,required:req,planned:plan,real:real,absences:Math.floor(Math.random()*3),delays:Math.floor(Math.random()*4),overtime:Math.floor(Math.random()*8),compliance:((real/plan)*100).toFixed(1)};});
    const t=storeData.reduce(function(a,s){return{req:a.req+s.required,plan:a.plan+s.planned,real:a.real+s.real,abs:a.abs+s.absences,del:a.del+s.delays,ot:a.ot+s.overtime};},{req:0,plan:0,real:0,abs:0,del:0,ot:0});
    return '<div class="kpi-grid">'+
    '<div class="kpi-card"><div class="kpi-label">Horas Requeridas</div><div class="kpi-value">'+t.req+'h</div></div>'+
    '<div class="kpi-card blue"><div class="kpi-label">Horas Planificadas</div><div class="kpi-value">'+t.plan+'h</div></div>'+
    '<div class="kpi-card green"><div class="kpi-label">Horas Reales</div><div class="kpi-value">'+t.real+'h</div></div>'+
    '<div class="kpi-card gold"><div class="kpi-label">Cumplimiento</div><div class="kpi-value">'+((t.real/t.plan)*100).toFixed(1)+'%</div></div></div>'+
    '<div class="kpi-grid">'+
    '<div class="kpi-card red"><div class="kpi-label">Ausencias</div><div class="kpi-value">'+t.abs+'</div></div>'+
    '<div class="kpi-card gold"><div class="kpi-label">Atrasos</div><div class="kpi-value">'+t.del+'</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Horas Extra</div><div class="kpi-value">'+t.ot+'h</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Diferencia</div><div class="kpi-value">'+(t.plan-t.real)+'h</div></div></div>'+
    '<div class="card"><div class="card-header"><h3>Detalle por Tienda</h3></div><table><thead><tr><th>Tienda</th><th>Tipo</th><th>Requerido</th><th>Planificado</th><th>Real</th><th>Ausencias</th><th>Atrasos</th><th>H.Extra</th><th>Cumplimiento</th><th>Estado</th></tr></thead><tbody>'+
    storeData.map(s=>'<tr><td>'+s.name+'</td><td>'+s.type+'</td><td>'+s.required+'h</td><td>'+s.planned+'h</td><td>'+s.real+'h</td><td>'+s.absences+'</td><td>'+s.delays+'</td><td>'+s.overtime+'h</td><td>'+s.compliance+'%</td><td><span class="badge '+(parseFloat(s.compliance)>=90?'badge-active':parseFloat(s.compliance)>=80?'badge-pending':'badge-conflict')+'">'+(parseFloat(s.compliance)>=90?'OK':parseFloat(s.compliance)>=80?'Alerta':'Critico')+'</span></td></tr>').join('')+
    '</tbody></table><p style="font-size:11px;color:var(--text-light);margin-top:8px">Datos simulados desde GeoVictoria - AttendanceBook/GetAttendance</p></div>';
}

// ===== GEOVICTORIA VIEW =====
function renderGeoVictoria(){
    const endpoints=[
        {name:'User/ListPaged',desc:'Sincronizar colaboradores',status:'success',records:45,code:200,lastSync:'2024-12-09 08:00'},
        {name:'Group/ListGroup',desc:'Sincronizar tiendas y centros de costo',status:'success',records:10,code:200,lastSync:'2024-12-09 08:00'},
        {name:'Position/List',desc:'Sincronizar cargos/roles',status:'success',records:12,code:200,lastSync:'2024-12-09 08:01'},
        {name:'Shift/List',desc:'Consultar turnos existentes',status:'success',records:10,code:200,lastSync:'2024-12-09 08:01'},
        {name:'Shift/Add',desc:'Crear turno si no existe',status:'pending',records:0,code:'-',lastSync:'Pendiente'},
        {name:'Scheduling/SetSchedule',desc:'Enviar horario aprobado',status:'success',records:28,code:201,lastSync:'2024-12-08 15:00'},
        {name:'AttendanceBook/GetAttendance',desc:'Consultar libro de asistencia',status:'success',records:45,code:200,lastSync:'2024-12-09 06:00'},
        {name:'Permit/getPermissions',desc:'Consultar permisos y vacaciones',status:'success',records:3,code:200,lastSync:'2024-12-09 07:00'},
        {name:'Punch/ListPendingCheckPoint',desc:'Consultar marcas recientes',status:'success',records:120,code:200,lastSync:'2024-12-09 08:05'}
    ];
    return '<div class="kpi-grid">'+
    '<div class="kpi-card green"><div class="kpi-label">Endpoints Activos</div><div class="kpi-value">'+endpoints.filter(e=>e.status==='success').length+'/'+endpoints.length+'</div></div>'+
    '<div class="kpi-card blue"><div class="kpi-label">Ultima Sincronizacion</div><div class="kpi-value">08:05</div><div class="kpi-sub">2024-12-09</div></div>'+
    '<div class="kpi-card gold"><div class="kpi-label">Registros Procesados</div><div class="kpi-value">'+endpoints.reduce((s,e)=>s+e.records,0)+'</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Ambiente</div><div class="kpi-value">Pruebas</div></div></div>'+
    '<div class="grid-3">'+endpoints.map(ep=>'<div class="endpoint-card"><div class="ep-title">'+ep.name+'</div><div class="ep-desc">'+ep.desc+'</div><div class="ep-meta"><span><span class="status-dot '+(ep.status==='success'?'active':'pending')+'"></span>'+(ep.status==='success'?'Exitoso':'Pendiente')+'</span><span>HTTP '+ep.code+'</span><span>'+ep.records+' reg.</span></div><div style="font-size:11px;color:var(--text-light);margin-bottom:8px">Ultima: '+ep.lastSync+'</div><div class="ep-actions"><button class="btn btn-sm btn-outline" onclick="showToast(\''+ep.name+' sincronizado\',\'success\')">Sync</button><button class="btn btn-sm btn-outline" onclick="viewPayload(\''+ep.name+'\')">Payload</button></div></div>').join('')+'</div>';
}

// ===== CATALOGS VIEW =====
function renderCatalogs(){
    const collabs=DATA_COLLABORATORS.filter(c=>APP.currentRole==='admin_regional'||c.country===APP.currentCountry);
    const statusBadge={activo:'badge-active',vacaciones:'badge-expansion',permiso:'badge-pending',incapacidad:'badge-conflict'};
    return '<div class="card"><div class="card-header"><h3>Colaboradores ('+collabs.length+')</h3><div style="display:flex;gap:8px"><input type="text" placeholder="Buscar..." style="width:200px" onkeyup="filterCatalogTable(this.value)"><button class="btn btn-primary btn-sm" onclick="showToast(\'Colaborador agregado\',\'success\')">+ Agregar</button><button class="btn btn-outline btn-sm" onclick="exportCollabsCSV()">Exportar CSV</button></div></div>'+
    '<div style="overflow-x:auto"><table id="collab-table"><thead><tr><th>Nombre</th><th>Tienda</th><th>Rol</th><th>Contrato</th><th>Max H</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+
    collabs.map(c=>'<tr><td>'+c.name+'</td><td style="font-size:11px">'+(DATA_STORES.find(s=>s.id===c.store)?.name||c.store)+'</td><td>'+c.role+'</td><td>'+c.contract+'</td><td>'+c.maxHours+'</td><td><span class="badge '+(statusBadge[c.status]||'badge-future')+'">'+c.status+'</span></td><td><button class="btn btn-sm btn-outline" onclick="showToast(\'Colaborador editado\',\'info\')">Editar</button></td></tr>').join('')+
    '</tbody></table></div></div>';
}
function filterCatalogTable(q){document.querySelectorAll('#collab-table tbody tr').forEach(function(row){row.style.display=row.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';});}
function exportCollabsCSV(){const c=DATA_COLLABORATORS.filter(x=>x.country===APP.currentCountry);exportCSV(['Nombre','Email','Tienda','Rol','Contrato','Estado','Horas Max'],c.map(x=>[x.name,x.email,x.store,x.role,x.contract,x.status,x.maxHours]),'colaboradores.csv');}

// ===== COLLABORATOR VIEW =====
function renderCollaborator(){
    const collab=DATA_COLLABORATORS.find(c=>c.id==='c01');
    const myShifts=DATA_PLANNING.filter(p=>p.collaborator==='c01');
    return '<div class="kpi-grid">'+
    '<div class="kpi-card blue"><div class="kpi-label">Colaborador</div><div class="kpi-value">'+collab.name+'</div><div class="kpi-sub">'+collab.role+' - '+(DATA_STORES.find(s=>s.id===collab.store)?.name||'')+'</div></div>'+
    '<div class="kpi-card"><div class="kpi-label">Horas Semana</div><div class="kpi-value">'+collab.plannedHours+'h</div><div class="kpi-sub">de '+collab.maxHours+'h max</div></div>'+
    '<div class="kpi-card green"><div class="kpi-label">Estado</div><div class="kpi-value">'+collab.status+'</div></div></div>'+
    '<div class="grid-2"><div class="card"><div class="card-header"><h3>Mis Proximos Turnos</h3></div><div class="collab-schedule">'+
    myShifts.slice(0,6).map(s=>'<div class="collab-shift-card"><div class="day">'+s.dayName+'</div><div class="time">'+s.shiftStart+'-'+s.shiftEnd+'</div><div class="store">'+s.shiftName+'</div><span class="badge '+(s.status==='published'?'badge-published':'badge-draft')+'">'+(s.status==='published'?'Publicado':'Borrador')+'</span></div>').join('')+
    '</div></div>'+
    '<div class="card"><div class="card-header"><h3>Notificaciones</h3></div>'+
    '<div class="notification-item"><span class="notif-icon">[ ]</span><span class="notif-text">Tu horario de la semana ha sido publicado</span><span class="notif-time">Hoy 08:15</span></div>'+
    '<div class="notification-item"><span class="notif-icon">[OK]</span><span class="notif-text">Cambio de turno aprobado (Martes)</span><span class="notif-time">Ayer 16:45</span></div>'+
    '<div class="notification-item"><span class="notif-icon">[!]</span><span class="notif-text">Valeria Solano te solicita cambio de turno</span><span class="notif-time">Ayer 10:30</span></div>'+
    '<div class="notification-item"><span class="notif-icon">[i]</span><span class="notif-text">Nuevo horario disponible para proxima semana</span><span class="notif-time">Lun 09:00</span></div>'+
    '</div></div>';
}

// ===== AUDIT VIEW =====
function renderAudit(){
    return '<div class="card"><div class="card-header"><h3>Bitacora de Auditoria</h3><button class="btn btn-outline btn-sm" onclick="exportAuditCSV()">Exportar CSV</button></div>'+
    '<div class="filters" style="margin-bottom:12px"><input type="text" placeholder="Buscar..." style="width:250px" onkeyup="filterAuditTable(this.value)"></div>'+
    '<div style="overflow-x:auto"><table id="audit-table"><thead><tr><th>Fecha/Hora</th><th>Usuario</th><th>Rol</th><th>Accion</th><th>Modulo</th><th>Pais</th><th>Tienda</th><th>Resultado</th><th>Detalle</th></tr></thead><tbody>'+
    DATA_AUDIT.map(a=>'<tr><td style="white-space:nowrap">'+a.date+'</td><td>'+a.user+'</td><td>'+a.role+'</td><td>'+a.action+'</td><td>'+a.module+'</td><td>'+a.country+'</td><td>'+a.store+'</td><td><span class="badge '+(a.result==='Exitoso'?'badge-active':a.result==='Advertencia'?'badge-pending':'badge-expansion')+'">'+a.result+'</span></td><td style="font-size:11px;max-width:200px;overflow:hidden;text-overflow:ellipsis">'+a.detail+'</td></tr>').join('')+
    '</tbody></table></div></div>';
}
function filterAuditTable(q){document.querySelectorAll('#audit-table tbody tr').forEach(function(row){row.style.display=row.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';});}
function exportAuditCSV(){exportCSV(['Fecha','Usuario','Rol','Accion','Modulo','Pais','Tienda','Resultado','Detalle'],DATA_AUDIT.map(a=>[a.date,a.user,a.role,a.action,a.module,a.country,a.store,a.result,a.detail]),'bitacora.csv');}

// ===== ACTIONS =====
function generateSmartSchedule(){
    showToast('Generando horario inteligente...','info');
    setTimeout(function(){
        generateInitialPlanning();
        DATA_PLANNING.forEach(function(p,i){if(i%15===0)p.status='conflict';else if(i%7===0)p.status='validated';else p.status='draft';});
        localStorage.setItem('morpho_planning',JSON.stringify(DATA_PLANNING));
        renderView('planning');
        showToast('Horario inteligente generado - Score: 87/100 - 3 alertas','success');
        addAudit('Genero horario inteligente','Motor Inteligente','Todas','Exitoso','Score: 87/100');
    },1500);
}
function validateRules(){
    showToast('Validando reglas...','info');
    setTimeout(function(){
        const conflicts=DATA_PLANNING.filter(p=>p.status==='conflict').length;
        openModal('Resultado Validacion',
        '<div class="kpi-grid"><div class="kpi-card green"><div class="kpi-label">Correctos</div><div class="kpi-value">'+(DATA_PLANNING.length-conflicts)+'</div></div><div class="kpi-card red"><div class="kpi-label">Conflictos</div><div class="kpi-value">'+conflicts+'</div></div></div>'+
        '<ul style="font-size:13px;padding-left:20px;margin-top:12px"><li>Diego Vargas: Descanso menor a 12h</li><li>Andrea Rojas: Excede 48h semanales</li><li>Grab & Go SJO: Sin barista franja 06:00-08:00</li></ul>',
        '<button class="btn btn-primary" onclick="closeModal()">Entendido</button>');
        addAudit('Valido reglas','Validacion','Todas','Advertencia',conflicts+' conflictos');
    },1000);
}
function publishSchedule(){
    DATA_PLANNING.forEach(function(p){if(p.status!=='conflict')p.status='published';});
    localStorage.setItem('morpho_planning',JSON.stringify(DATA_PLANNING));
    renderView('planning');
    showToast('Horario publicado exitosamente','success');
    addAudit('Publico horario semanal','Planificacion','Todas','Exitoso','Turnos publicados: '+DATA_PLANNING.filter(p=>p.status==='published').length);
}
function sendToGeoVictoria(){
    const payload={endpoint:'Scheduling/SetSchedule',method:'POST',environment:'pruebas.geovictoria.com',body:{countryCode:'CR',weekStart:'2024-12-09',schedules:DATA_PLANNING.filter(p=>p.status==='published').slice(0,3).map(p=>({userId:p.collaborator,shiftId:p.shift,date:'2024-12-'+(9+p.day),startTime:p.shiftStart,endTime:p.shiftEnd}))},response:{status:201,message:'Schedule created'}};
    DATA_PLANNING.forEach(function(p){if(p.status==='published')p.status='sent';});
    localStorage.setItem('morpho_planning',JSON.stringify(DATA_PLANNING));
    openModal('Envio a GeoVictoria - Scheduling/SetSchedule',
    '<p><span class="badge badge-active">HTTP 201 Created</span></p><div class="json-display">'+JSON.stringify(payload,null,2)+'</div>',
    '<button class="btn btn-primary" onclick="closeModal();renderView(\'planning\')">Cerrar</button>');
    showToast('Horario enviado a GeoVictoria','success');
    addAudit('Envio horario a GeoVictoria','Integracion','Todas','Exitoso','Scheduling/SetSchedule HTTP 201');
}
function exportPlanningCSV(){
    const store=DATA_STORES.find(s=>s.country===APP.currentCountry&&s.active);
    const rows=DATA_PLANNING.filter(p=>p.store===(store?.id||'')).map(function(p){const c=DATA_COLLABORATORS.find(co=>co.id===p.collaborator);return[c?.name||'',p.dayName,p.shiftName,p.shiftStart+'-'+p.shiftEnd,p.store,p.role,p.status];});
    exportCSV(['Colaborador','Dia','Turno','Horario','Tienda','Rol','Estado'],rows,'planificacion.csv');
}
function applySuggestions(){showToast('Aplicando sugerencias...','info');setTimeout(function(){showToast('7 sugerencias aplicadas','success');addAudit('Aplico sugerencias','Motor Inteligente','Todas','Exitoso','7 sugerencias');},1200);}
function approveShiftRequest(id){
    const req=DATA_SHIFT_REQUESTS.find(r=>r.id===id);
    if(req){req.status='approved';localStorage.setItem('morpho_requests',JSON.stringify(DATA_SHIFT_REQUESTS));showToast('Cambio de turno aprobado','success');addAudit('Aprobo cambio de turno','Cambios Turno',(DATA_STORES.find(s=>s.id===req.store)?.name||''),'Aprobado','');renderView('shifts');}
}
function openRejectModal(id){
    openModal('Rechazar Solicitud','<p style="margin-bottom:12px;font-size:13px">Ingresa una observacion para el colaborador:</p><div class="form-group"><label>Observacion (obligatoria)</label><textarea id="reject-note" rows="3" placeholder="Motivo del rechazo..."></textarea></div>',
    '<button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="closeModal();rejectShiftRequest(\''+id+'\')">Confirmar Rechazo</button>');
}
function rejectShiftRequest(id){
    const req=DATA_SHIFT_REQUESTS.find(r=>r.id===id);
    if(req){req.status='rejected_supervisor';req.rejectionNote=document.getElementById('reject-note')?.value||'Sin observacion';localStorage.setItem('morpho_requests',JSON.stringify(DATA_SHIFT_REQUESTS));showToast('Cambio de turno rechazado','warning');addAudit('Rechazo cambio de turno','Cambios Turno',(DATA_STORES.find(s=>s.id===req.store)?.name||''),'Rechazado','Obs: '+req.rejectionNote);renderView('shifts');}
}
function viewShiftRequestDetail(id){
    const req=DATA_SHIFT_REQUESTS.find(r=>r.id===id);if(!req)return;
    const requester=DATA_COLLABORATORS.find(c=>c.id===req.requester);
    const receiver=DATA_COLLABORATORS.find(c=>c.id===req.receiver);
    const fileHtml=req.supportFile?'<div class="form-group"><label>Archivo de Soporte</label><p><strong>'+req.supportFile.name+'</strong> ('+req.supportFile.size+')</p></div>':'<div class="form-group"><label>Archivo de Soporte</label><p style="color:var(--text-light)">No se adjunto archivo</p></div>';
    const noteHtml=req.rejectionNote?'<div class="form-group"><label>Observacion de Rechazo</label><p style="color:var(--red)">'+req.rejectionNote+'</p></div>':'';
    openModal('Detalle Solicitud de Cambio',
    '<div class="form-group"><label>Solicitante</label><p>'+(requester?.name||'N/A')+' ('+requester?.role+')</p></div>'+
    '<div class="form-group"><label>Receptor</label><p>'+(receiver?.name||'N/A')+' ('+receiver?.role+')</p></div>'+
    '<div class="form-group"><label>Fecha</label><p>'+req.date+'</p></div>'+
    '<div class="form-group"><label>Turno</label><p>'+req.shift+'</p></div>'+
    '<div class="form-group"><label>Tienda</label><p>'+(DATA_STORES.find(s=>s.id===req.store)?.name||'')+'</p></div>'+
    '<div class="form-group"><label>Motivo</label><p>'+req.reason+'</p></div>'+
    '<div class="form-group"><label>Creado</label><p>'+req.createdAt+'</p></div>'+fileHtml+noteHtml+
    '<h4 style="margin-top:12px">Validaciones Automaticas</h4><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+
    '<span class="validation-tag '+(req.validations.role?'pass':'fail')+'">Rol compatible</span>'+
    '<span class="validation-tag '+(req.validations.rest?'pass':'fail')+'">Descanso minimo</span>'+
    '<span class="validation-tag '+(req.validations.hours?'pass':'fail')+'">Sin horas extra</span>'+
    '<span class="validation-tag '+(req.validations.available?'pass':'fail')+'">Disponibilidad</span>'+
    '<span class="validation-tag '+(req.validations.noLeave?'pass':'fail')+'">Legal OK</span>'+
    '<span class="validation-tag '+(req.validations.minStaffing!==false?'pass':'fail')+'">Dotacion minima</span>'+
    '<span class="validation-tag pass">Notif. supervisor</span></div>',
    (req.status==='pending_supervisor'?'<button class="btn btn-success" onclick="approveShiftRequest(\''+id+'\');closeModal()">Aprobar</button><button class="btn btn-danger" onclick="closeModal();openRejectModal(\''+id+'\')">Rechazar</button>':'')+'<button class="btn btn-outline" onclick="closeModal()">Cerrar</button>');
}
function openRequestShiftChange(){
    const myShifts=DATA_PLANNING.filter(p=>p.collaborator==='c01');
    const compatibles=DATA_COLLABORATORS.filter(c=>c.store==='CR-SJO-RPV'&&c.id!=='c01'&&c.status==='activo');
    openModal('Solicitar Cambio de Turno',
    '<div class="form-group"><label>Mi turno</label><select id="req-shift">'+myShifts.map(s=>'<option value="'+s.id+'">'+s.dayName+' - '+s.shiftName+' ('+s.shiftStart+'-'+s.shiftEnd+')</option>').join('')+'</select></div>'+
    '<div class="form-group"><label>Companero</label><select id="req-partner">'+compatibles.map(c=>'<option value="'+c.id+'">'+c.name+' ('+c.role+')</option>').join('')+'</select></div>'+
    '<div class="form-group"><label>Motivo</label><textarea id="req-reason" rows="2" placeholder="Motivo del cambio..."></textarea></div>'+
    '<div class="form-group"><label>Archivo de soporte (opcional)</label><input type="file" id="req-file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSupportFile(this)"><small style="color:var(--text-light)">PDF, imagen o documento. Max 5MB</small></div><div id="req-file-preview"></div>',
    '<button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="submitShiftRequest()">Enviar Solicitud</button>');
}
function openRequestShiftChangeWith(collabId){
    const collab=DATA_COLLABORATORS.find(c=>c.id===collabId);
    openModal('Solicitar Cambio con '+(collab?.name||''),
    '<div class="form-group"><label>Companero</label><p><strong>'+collab?.name+'</strong> - '+collab?.role+'</p></div>'+
    '<div class="form-group"><label>Mi turno</label><select id="req-shift"><option>Lunes - Manana (07:00-15:00)</option><option>Martes - Intermedio (10:00-18:00)</option></select></div>'+
    '<div class="form-group"><label>Motivo</label><textarea id="req-reason" rows="2" placeholder="Motivo..."></textarea></div>'+
    '<div class="form-group"><label>Archivo de soporte (opcional)</label><input type="file" id="req-file" accept=".pdf,.jpg,.png" onchange="handleSupportFile(this)"><small style="color:var(--text-light)">Max 5MB</small></div><div id="req-file-preview"></div>',
    '<button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="submitShiftRequest()">Enviar</button>');
}
function submitShiftRequest(){
    const fileInput=document.getElementById('req-file');
    let supportFile=null;
    if(fileInput&&fileInput.files&&fileInput.files[0]){const f=fileInput.files[0];supportFile={name:f.name,size:(f.size/1024).toFixed(1)+' KB',type:f.type};}
    const newReq={id:'sr'+(DATA_SHIFT_REQUESTS.length+1),requester:'c01',receiver:'c04',date:'2024-12-13',shift:'manana',store:'CR-SJO-RPV',reason:document.getElementById('req-reason')?.value||'Motivo personal',status:'pending_supervisor',validations:{role:true,rest:true,hours:true,available:true,noLeave:true,minStaffing:true},createdAt:new Date().toLocaleString(),supervisor:'sup1',supportFile:supportFile,rejectionNote:null};
    DATA_SHIFT_REQUESTS.push(newReq);localStorage.setItem('morpho_requests',JSON.stringify(DATA_SHIFT_REQUESTS));
    closeModal();showToast('Solicitud de cambio enviada','success');addAudit('Solicito cambio de turno','Cambios Turno','Rumbo Pura Vida SJO','Pendiente','Solicitud peer-to-peer creada');renderView(APP.currentView);
}
function handleSupportFile(input){
    const preview=document.getElementById('req-file-preview');
    if(input.files&&input.files[0]){const f=input.files[0];if(f.size>5*1024*1024){showToast('El archivo excede 5MB','error');input.value='';preview.innerHTML='';return;}
    preview.innerHTML='<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg);border-radius:6px;font-size:12px;margin-top:8px"><span>Archivo: <strong>'+f.name+'</strong> ('+(f.size/1024).toFixed(1)+' KB)</span><button class="btn btn-sm btn-outline" onclick="clearSupportFile()">Quitar</button></div>';}else{preview.innerHTML='';}
}
function clearSupportFile(){const i=document.getElementById('req-file');if(i)i.value='';const p=document.getElementById('req-file-preview');if(p)p.innerHTML='';}
function openEditShiftModal(planId){
    const plan=DATA_PLANNING.find(p=>p.id===planId);if(!plan)return;
    const collab=DATA_COLLABORATORS.find(c=>c.id===plan.collaborator);
    openModal('Editar Turno',
    '<div class="form-group"><label>Colaborador</label><input value="'+(collab?.name||'')+'" readonly></div>'+
    '<div class="form-group"><label>Turno</label><select id="edit-shift-select">'+DATA_SHIFTS.map(s=>'<option value="'+s.id+'"'+(s.id===plan.shift?' selected':'')+'>'+s.name+' ('+s.start+'-'+s.end+')</option>').join('')+'</select></div>'+
    '<div class="form-group"><label>Motivo del cambio</label><textarea rows="2" placeholder="Motivo..."></textarea></div>',
    '<button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="saveEditShift(\''+planId+'\')">Guardar</button>');
}
function saveEditShift(planId){
    const plan=DATA_PLANNING.find(p=>p.id===planId);
    if(plan){const ns=DATA_SHIFTS.find(s=>s.id===document.getElementById('edit-shift-select').value);if(ns){plan.shift=ns.id;plan.shiftName=ns.name;plan.shiftStart=ns.start;plan.shiftEnd=ns.end;plan.status='draft';}localStorage.setItem('morpho_planning',JSON.stringify(DATA_PLANNING));}
    closeModal();showToast('Turno actualizado','success');addAudit('Edito turno','Planificacion',plan?.store||'-','Exitoso','');renderView('planning');
}
function openCreateStoreModal(){
    openModal('Crear Tienda',
    '<div class="form-group"><label>Nombre</label><input placeholder="Nombre de la tienda"></div>'+
    '<div class="form-group"><label>Tipo Operacion</label><select><option>Airport Retail</option><option>Travel Essentials</option><option>Food & Beverage</option><option>Street Location</option><option>Attraction</option><option>Hotel / Attraction</option></select></div>'+
    '<div class="form-group"><label>Centro de Costo</label><input placeholder="XX-XXX-XXX"></div>'+
    '<div class="form-group"><label>Codigo GeoVictoria</label><input placeholder="GV-XX-XXX"></div>',
    '<button class="btn btn-outline" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();showToast(\'Tienda creada\',\'success\');addAudit(\'Creo tienda\',\'Configuracion\',\'-\',\'Exitoso\',\'\')">Crear</button>');
}
function viewPayload(name){
    const payloads={'User/ListPaged':{endpoint:'/api/v1/User/ListPaged',method:'GET',response:{totalRecords:45,users:[{id:'GV-001',name:'Maria Rodriguez',position:'Vendedor'}]}},'Scheduling/SetSchedule':{endpoint:'/api/v1/Scheduling/SetSchedule',method:'POST',response:{status:201,message:'Schedule created',processed:28}}};
    const pl=payloads[name]||{endpoint:'/api/v1/'+name,method:'GET',response:{status:200}};
    openModal('Payload: '+name,'<p><span class="badge badge-active">HTTP 200</span> - Ambiente: pruebas.geovictoria.com</p><div class="json-display">'+JSON.stringify(pl,null,2)+'</div>','<button class="btn btn-primary" onclick="closeModal()">Cerrar</button>');
}

