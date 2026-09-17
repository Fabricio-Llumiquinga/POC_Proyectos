/* ============================================
   LA GUACA CR - Búsqueda Inteligente de Repuestos
   Script principal - Datos simulados y lógica
   ============================================ */

// ============ DATOS SIMULADOS ============

// --- Vehículos registrados ---
const vehiculos = [
    { placa: 'ABC123', marca: 'Toyota', modelo: 'Corolla', version: 'XEI', anio: 2018, vin: '1NXBR32E08Z123456' },
    { placa: 'HIL2020', marca: 'Toyota', modelo: 'Hilux', version: 'SRV', anio: 2020, vin: '8AJSA8CD5L1234567' },
    { placa: 'TUC919', marca: 'Hyundai', modelo: 'Tucson', version: 'GLS', anio: 2019, vin: 'KM8J33A20KU987654' },
    { placa: 'SEN616', marca: 'Nissan', modelo: 'Sentra', version: 'Advance', anio: 2016, vin: '3N1AB7AP6GL654321' },
    { placa: 'CIV717', marca: 'Honda', modelo: 'Civic', version: 'EX', anio: 2017, vin: '2HGFC2F53HH112233' },
    { placa: 'SWI818', marca: 'Suzuki', modelo: 'Swift', version: 'GL', anio: 2018, vin: 'TSMMCA21S00334455' },
    { placa: 'L2021', marca: 'Mitsubishi', modelo: 'L200', version: 'GLS', anio: 2021, vin: 'MMBGRKC30MH556677' },
    { placa: 'KIA2020', marca: 'Kia', modelo: 'Sportage', version: 'EX', anio: 2020, vin: 'KNDPM3AC5L7889900' }
];

// --- Tiendas ---
const tiendas = [
    'Tibás', 'Desamparados', 'Alajuela', 'Heredia', 'Cartago',
    'Liberia', 'Pérez Zeledón', 'Puntarenas', 'Limón', 'Escazú',
    'San Carlos', 'Guápiles', 'Nicoya', 'Curridabat', 'Grecia',
    'San Ramón', 'Ciudad Quesada', 'Call Center'
];

// --- Sinónimos para búsqueda inteligente ---
const sinonimos = {
    'compensador': ['amortiguador', 'shock', 'suspensión', 'absorber'],
    'amortiguador': ['compensador', 'shock', 'suspensión', 'absorber'],
    'pastillas': ['frenos', 'tacos de freno', 'brake pads', 'pastilla'],
    'frenos': ['pastillas', 'tacos de freno', 'brake'],
    'filtro aceite': ['filtro de aceite', 'filtro motor', 'oil filter'],
    'filtro de aceite': ['filtro aceite', 'filtro motor', 'oil filter'],
    'bujía': ['candela', 'spark plug', 'bujias'],
    'candela': ['bujía', 'spark plug'],
    'terminal': ['terminal dirección', 'rótula', 'tie rod'],
    'radiador': ['enfriamiento', 'cooling', 'radiators'],
    'bomba agua': ['bomba de agua', 'water pump'],
    'bomba de agua': ['bomba agua', 'water pump'],
    'faja': ['correa', 'banda', 'belt'],
    'correa': ['faja', 'banda', 'belt'],
    'sensor': ['sensor abs', 'sensor velocidad'],
    'disco': ['disco de freno', 'rotor', 'brake disc'],
    'disco de freno': ['disco', 'rotor', 'brake disc'],
    'aceite': ['lubricante', 'oil'],
    'lubricante': ['aceite', 'oil'],
    'alternador': ['generador', 'alternator'],
    'embrague': ['clutch', 'cloche']
};

// --- Categorías de iconos ---
const categoriaIconos = {
    'Frenos': '🛑',
    'Suspensión': '🔩',
    'Filtros': '🔬',
    'Motor': '⚙️',
    'Eléctrico': '⚡',
    'Dirección': '🎯',
    'Transmisión': '🔄',
    'Enfriamiento': '❄️',
    'Lubricantes': '🛢️',
    'Accesorios': '🔧'
};

// --- Función para generar stock aleatorio por tienda ---
function generarStock() {
    const stock = {};
    tiendas.forEach(t => {
        stock[t] = Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : 0;
    });
    return stock;
}

// --- Productos simulados (25+) ---
const productos = [
    {
        skuGuaca: 'GUA-FRE-001', skuFabricante: 'AKE-7788',
        nombre: 'Pastillas de Freno Delanteras',
        categoria: 'Frenos', descripcion: 'Pastillas de freno cerámicas delanteras alta durabilidad',
        precioCRC: 28500, marcaRepuesto: 'Akebono',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Toyota Corolla XEI 2017', 'Toyota Corolla XEI 2019'],
        stockPorTienda: generarStock(),
        sinonimos: ['pastillas', 'frenos', 'tacos de freno', 'brake pads'],
        confianzaBase: 0.96
    },
    {
        skuGuaca: 'GUA-FRE-002', skuFabricante: 'BRE-4421',
        nombre: 'Disco de Freno Delantero',
        categoria: 'Frenos', descripcion: 'Disco de freno ventilado delantero',
        precioCRC: 42000, marcaRepuesto: 'Brembo',
        compatibilidades: ['Hyundai Tucson GLS 2019', 'Hyundai Tucson GLS 2018', 'Kia Sportage EX 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['disco', 'disco de freno', 'rotor', 'brake disc'],
        confianzaBase: 0.94
    },
    {
        skuGuaca: 'GUA-FRE-003', skuFabricante: 'TRW-9901',
        nombre: 'Pastillas de Freno Traseras',
        categoria: 'Frenos', descripcion: 'Pastillas de freno traseras semi-metálicas',
        precioCRC: 22000, marcaRepuesto: 'TRW',
        compatibilidades: ['Honda Civic EX 2017', 'Honda Civic EX 2018'],
        stockPorTienda: generarStock(),
        sinonimos: ['pastillas', 'frenos', 'tacos de freno'],
        confianzaBase: 0.92
    },
    {
        skuGuaca: 'GUA-SUS-004', skuFabricante: 'KYB-3344',
        nombre: 'Amortiguador Delantero',
        categoria: 'Suspensión', descripcion: 'Amortiguador delantero gas presurizado',
        precioCRC: 65000, marcaRepuesto: 'KYB',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Toyota Corolla XEI 2017'],
        stockPorTienda: generarStock(),
        sinonimos: ['compensador', 'amortiguador', 'shock', 'suspensión'],
        confianzaBase: 0.95
    },
    {
        skuGuaca: 'GUA-SUS-005', skuFabricante: 'MON-2211',
        nombre: 'Amortiguador Trasero',
        categoria: 'Suspensión', descripcion: 'Amortiguador trasero tipo cartucho',
        precioCRC: 55000, marcaRepuesto: 'Monroe',
        compatibilidades: ['Hyundai Tucson GLS 2019', 'Kia Sportage EX 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['compensador', 'amortiguador', 'shock', 'absorber'],
        confianzaBase: 0.93
    },
    {
        skuGuaca: 'GUA-SUS-006', skuFabricante: 'KYB-5567',
        nombre: 'Espiral de Suspensión Delantera',
        categoria: 'Suspensión', descripcion: 'Espiral delantera reforzada para carga',
        precioCRC: 38000, marcaRepuesto: 'KYB',
        compatibilidades: ['Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021'],
        stockPorTienda: generarStock(),
        sinonimos: ['espiral', 'resorte', 'spring', 'suspensión'],
        confianzaBase: 0.91
    },
    {
        skuGuaca: 'GUA-FIL-007', skuFabricante: 'MAN-1122',
        nombre: 'Filtro de Aceite',
        categoria: 'Filtros', descripcion: 'Filtro de aceite motor alta eficiencia',
        precioCRC: 8500, marcaRepuesto: 'Mann Filter',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Toyota Hilux SRV 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['filtro aceite', 'filtro de aceite', 'filtro motor', 'oil filter'],
        confianzaBase: 0.97
    },
    {
        skuGuaca: 'GUA-FIL-008', skuFabricante: 'WIX-3344',
        nombre: 'Filtro de Aire Motor',
        categoria: 'Filtros', descripcion: 'Filtro de aire para motor combustión',
        precioCRC: 12000, marcaRepuesto: 'Wix',
        compatibilidades: ['Honda Civic EX 2017', 'Suzuki Swift GL 2018', 'Nissan Sentra Advance 2016'],
        stockPorTienda: generarStock(),
        sinonimos: ['filtro aire', 'filtro de aire', 'air filter'],
        confianzaBase: 0.95
    },
    {
        skuGuaca: 'GUA-FIL-009', skuFabricante: 'BOC-7788',
        nombre: 'Filtro de Combustible',
        categoria: 'Filtros', descripcion: 'Filtro de combustible inyección directa',
        precioCRC: 15500, marcaRepuesto: 'Bosch',
        compatibilidades: ['Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021'],
        stockPorTienda: generarStock(),
        sinonimos: ['filtro combustible', 'filtro gasolina', 'fuel filter'],
        confianzaBase: 0.94
    },
    {
        skuGuaca: 'GUA-MOT-010', skuFabricante: 'NGK-5544',
        nombre: 'Bujía de Encendido Iridium',
        categoria: 'Motor', descripcion: 'Bujía iridium larga vida útil',
        precioCRC: 7800, marcaRepuesto: 'NGK',
        compatibilidades: ['Honda Civic EX 2017', 'Suzuki Swift GL 2018', 'Toyota Corolla XEI 2018'],
        stockPorTienda: generarStock(),
        sinonimos: ['bujía', 'candela', 'spark plug', 'bujias'],
        confianzaBase: 0.96
    },
    {
        skuGuaca: 'GUA-MOT-011', skuFabricante: 'GAT-2233',
        nombre: 'Faja de Distribución',
        categoria: 'Motor', descripcion: 'Kit de distribución con tensor y guía',
        precioCRC: 85000, marcaRepuesto: 'Gates',
        compatibilidades: ['Hyundai Tucson GLS 2019', 'Kia Sportage EX 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['faja', 'correa', 'distribución', 'timing belt'],
        confianzaBase: 0.93
    },
    {
        skuGuaca: 'GUA-ELE-012', skuFabricante: 'BOS-9988',
        nombre: 'Sensor ABS Delantero',
        categoria: 'Eléctrico', descripcion: 'Sensor de velocidad ABS rueda delantera',
        precioCRC: 35000, marcaRepuesto: 'Bosch',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Toyota Hilux SRV 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['sensor', 'sensor abs', 'abs', 'sensor velocidad'],
        confianzaBase: 0.91
    },
    {
        skuGuaca: 'GUA-ELE-013', skuFabricante: 'DEN-4455',
        nombre: 'Alternador Remanufacturado',
        categoria: 'Eléctrico', descripcion: 'Alternador 12V 90A remanufacturado',
        precioCRC: 125000, marcaRepuesto: 'Denso',
        compatibilidades: ['Nissan Sentra Advance 2016', 'Honda Civic EX 2017'],
        stockPorTienda: generarStock(),
        sinonimos: ['alternador', 'generador', 'alternator', 'carga'],
        confianzaBase: 0.89
    },
    {
        skuGuaca: 'GUA-ELE-014', skuFabricante: 'BOS-1177',
        nombre: 'Bobina de Encendido',
        categoria: 'Eléctrico', descripcion: 'Bobina de encendido directa',
        precioCRC: 45000, marcaRepuesto: 'Bosch',
        compatibilidades: ['Suzuki Swift GL 2018', 'Honda Civic EX 2017'],
        stockPorTienda: generarStock(),
        sinonimos: ['bobina', 'ignición', 'coil', 'encendido'],
        confianzaBase: 0.92
    },
    {
        skuGuaca: 'GUA-DIR-015', skuFabricante: 'MG-6677',
        nombre: 'Terminal de Dirección',
        categoria: 'Dirección', descripcion: 'Terminal exterior de dirección',
        precioCRC: 18500, marcaRepuesto: 'Moog',
        compatibilidades: ['Nissan Sentra Advance 2016', 'Nissan Sentra Advance 2017'],
        stockPorTienda: generarStock(),
        sinonimos: ['terminal', 'terminal dirección', 'rótula', 'tie rod'],
        confianzaBase: 0.94
    },
    {
        skuGuaca: 'GUA-DIR-016', skuFabricante: 'MG-8899',
        nombre: 'Rótula de Suspensión Inferior',
        categoria: 'Dirección', descripcion: 'Rótula inferior brazo de suspensión',
        precioCRC: 22000, marcaRepuesto: 'Moog',
        compatibilidades: ['Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021'],
        stockPorTienda: generarStock(),
        sinonimos: ['rótula', 'ball joint', 'suspensión', 'articulación'],
        confianzaBase: 0.93
    },
    {
        skuGuaca: 'GUA-TRA-017', skuFabricante: 'LUK-4455',
        nombre: 'Kit de Embrague Completo',
        categoria: 'Transmisión', descripcion: 'Kit embrague: disco, prensa y rodamiento',
        precioCRC: 145000, marcaRepuesto: 'LUK',
        compatibilidades: ['Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021'],
        stockPorTienda: generarStock(),
        sinonimos: ['embrague', 'clutch', 'cloche', 'disco embrague'],
        confianzaBase: 0.90
    },
    {
        skuGuaca: 'GUA-TRA-018', skuFabricante: 'AIS-7722',
        nombre: 'Aceite Transmisión ATF',
        categoria: 'Transmisión', descripcion: 'Aceite transmisión automática ATF Dexron VI',
        precioCRC: 12500, marcaRepuesto: 'Aisin',
        compatibilidades: ['Kia Sportage EX 2020', 'Hyundai Tucson GLS 2019', 'Toyota Corolla XEI 2018'],
        stockPorTienda: generarStock(),
        sinonimos: ['aceite transmisión', 'atf', 'transmission fluid'],
        confianzaBase: 0.95
    },
    {
        skuGuaca: 'GUA-ENF-019', skuFabricante: 'DEN-3322',
        nombre: 'Radiador de Motor',
        categoria: 'Enfriamiento', descripcion: 'Radiador de aluminio motor completo',
        precioCRC: 95000, marcaRepuesto: 'Denso',
        compatibilidades: ['Kia Sportage EX 2020', 'Hyundai Tucson GLS 2019'],
        stockPorTienda: generarStock(),
        sinonimos: ['radiador', 'enfriamiento', 'cooling', 'radiators'],
        confianzaBase: 0.92
    },
    {
        skuGuaca: 'GUA-ENF-020', skuFabricante: 'GMB-1199',
        nombre: 'Bomba de Agua',
        categoria: 'Enfriamiento', descripcion: 'Bomba de agua motor con junta',
        precioCRC: 38000, marcaRepuesto: 'GMB',
        compatibilidades: ['Mitsubishi L200 GLS 2021', 'Toyota Hilux SRV 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['bomba agua', 'bomba de agua', 'water pump', 'enfriamiento'],
        confianzaBase: 0.94
    },
    {
        skuGuaca: 'GUA-ENF-021', skuFabricante: 'GAT-5566',
        nombre: 'Termostato Motor',
        categoria: 'Enfriamiento', descripcion: 'Termostato regulador temperatura motor',
        precioCRC: 15000, marcaRepuesto: 'Gates',
        compatibilidades: ['Honda Civic EX 2017', 'Suzuki Swift GL 2018', 'Toyota Corolla XEI 2018'],
        stockPorTienda: generarStock(),
        sinonimos: ['termostato', 'temperatura', 'thermostat'],
        confianzaBase: 0.93
    },
    {
        skuGuaca: 'GUA-LUB-022', skuFabricante: 'CAS-0W20',
        nombre: 'Aceite Motor 0W-20 Sintético',
        categoria: 'Lubricantes', descripcion: 'Aceite motor sintético 0W-20 4 litros',
        precioCRC: 32000, marcaRepuesto: 'Castrol',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Honda Civic EX 2017', 'Suzuki Swift GL 2018'],
        stockPorTienda: generarStock(),
        sinonimos: ['aceite', 'lubricante', 'oil', 'aceite motor'],
        confianzaBase: 0.97
    },
    {
        skuGuaca: 'GUA-LUB-023', skuFabricante: 'MOB-5W30',
        nombre: 'Aceite Motor 5W-30 Sintético',
        categoria: 'Lubricantes', descripcion: 'Aceite motor sintético 5W-30 4 litros',
        precioCRC: 28000, marcaRepuesto: 'Mobil',
        compatibilidades: ['Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021', 'Kia Sportage EX 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['aceite', 'lubricante', 'oil', 'aceite motor'],
        confianzaBase: 0.96
    },
    {
        skuGuaca: 'GUA-ACC-024', skuFabricante: 'BOS-LP01',
        nombre: 'Limpiaparabrisas Par',
        categoria: 'Accesorios', descripcion: 'Par de plumillas limpiaparabrisas 22" y 18"',
        precioCRC: 14000, marcaRepuesto: 'Bosch',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Nissan Sentra Advance 2016', 'Hyundai Tucson GLS 2019'],
        stockPorTienda: generarStock(),
        sinonimos: ['limpiaparabrisas', 'plumillas', 'wiper', 'limpia vidrio'],
        confianzaBase: 0.90
    },
    {
        skuGuaca: 'GUA-ACC-025', skuFabricante: 'PHI-H7',
        nombre: 'Bombillo H7 Halógeno',
        categoria: 'Accesorios', descripcion: 'Bombillo halógeno H7 12V 55W par',
        precioCRC: 9500, marcaRepuesto: 'Philips',
        compatibilidades: ['Kia Sportage EX 2020', 'Hyundai Tucson GLS 2019', 'Honda Civic EX 2017'],
        stockPorTienda: generarStock(),
        sinonimos: ['bombillo', 'foco', 'luz', 'headlight', 'halógeno'],
        confianzaBase: 0.88
    },
    {
        skuGuaca: 'GUA-MOT-026', skuFabricante: 'GAT-ALT1',
        nombre: 'Faja de Alternador',
        categoria: 'Motor', descripcion: 'Correa de alternador serpentina',
        precioCRC: 18000, marcaRepuesto: 'Gates',
        compatibilidades: ['Suzuki Swift GL 2018', 'Honda Civic EX 2017', 'Nissan Sentra Advance 2016'],
        stockPorTienda: generarStock(),
        sinonimos: ['faja', 'correa', 'banda', 'belt', 'alternador', 'faja alternador'],
        confianzaBase: 0.92
    },
    {
        skuGuaca: 'GUA-FRE-027', skuFabricante: 'BOS-LF01',
        nombre: 'Líquido de Frenos DOT4',
        categoria: 'Frenos', descripcion: 'Líquido de frenos DOT4 500ml',
        precioCRC: 6500, marcaRepuesto: 'Bosch',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Honda Civic EX 2017', 'Suzuki Swift GL 2018', 'Nissan Sentra Advance 2016', 'Toyota Hilux SRV 2020', 'Mitsubishi L200 GLS 2021', 'Hyundai Tucson GLS 2019', 'Kia Sportage EX 2020'],
        stockPorTienda: generarStock(),
        sinonimos: ['líquido frenos', 'brake fluid', 'dot4', 'fluido freno'],
        confianzaBase: 0.98
    },
    {
        skuGuaca: 'GUA-FIL-028', skuFabricante: 'MAN-CF01',
        nombre: 'Filtro de Cabina (Habitáculo)',
        categoria: 'Filtros', descripcion: 'Filtro de aire habitáculo con carbón activado',
        precioCRC: 11000, marcaRepuesto: 'Mann Filter',
        compatibilidades: ['Toyota Corolla XEI 2018', 'Kia Sportage EX 2020', 'Hyundai Tucson GLS 2019'],
        stockPorTienda: generarStock(),
        sinonimos: ['filtro cabina', 'filtro habitáculo', 'cabin filter', 'filtro aire acondicionado'],
        confianzaBase: 0.94
    }
];

// ============ ESTADO DE LA APLICACIÓN ============

let currentRole = 'landing';
let searchLog = JSON.parse(localStorage.getItem('guaca_searchLog') || '[]');
let failedSearches = JSON.parse(localStorage.getItem('guaca_failedSearches') || '[]');
let cachedPlates = JSON.parse(localStorage.getItem('guaca_cachedPlates') || '{}');
let productViews = JSON.parse(localStorage.getItem('guaca_productViews') || '{}');
let termFrequency = JSON.parse(localStorage.getItem('guaca_termFrequency') || '{}');
let cachedPlateHits = parseInt(localStorage.getItem('guaca_cachedPlateHits') || '0');

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
    initRoleButtons();
    initTabs();
    initGarageSelects();
    initMobileMenu();
    initEnterKeys();
    updateDashboard();
});

// --- Botones de rol ---
function initRoleButtons() {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setRole(btn.dataset.role);
        });
    });
}

// --- Cambiar rol/vista activa ---
function setRole(role) {
    currentRole = role;
    // Actualizar botones
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.role-btn[data-role="${role}"]`).classList.add('active');
    // Actualizar vistas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${role}`).classList.add('active');
    // Cerrar menú móvil
    document.getElementById('roleNav').classList.remove('open');
    // Actualizar dashboard si admin
    if (role === 'admin') updateDashboard();
}

// --- Tabs de búsqueda ---
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ctx = btn.dataset.context;
            const tab = btn.dataset.tab;
            // Desactivar hermanos
            btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            // Mostrar contenido
            const parent = btn.closest('.view');
            parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(`tab-${tab}-${ctx}`).classList.add('active');
        });
    });
}

// --- Menú móvil ---
function initMobileMenu() {
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('roleNav').classList.toggle('open');
    });
}

// --- Enter para buscar ---
function initEnterKeys() {
    const enterInputs = [
        { id: 'placaInputCliente', fn: () => buscarPlaca('cliente') },
        { id: 'placaInputVendedor', fn: () => buscarPlaca('vendedor') },

        { id: 'skuInputCliente', fn: () => buscarSku('cliente') },
        { id: 'skuInputVendedor', fn: () => buscarSku('vendedor') },
    ];
    enterInputs.forEach(({ id, fn }) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keypress', e => { if (e.key === 'Enter') fn(); });
    });
}

// --- Inicializar selects de garage ---
function initGarageSelects() {
    const marcas = [...new Set(vehiculos.map(v => v.marca))];
    ['cliente', 'vendedor'].forEach(ctx => {
        const sel = document.getElementById(`garageMarca${cap(ctx)}`);
        marcas.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m; opt.textContent = m;
            sel.appendChild(opt);
        });
    });
}

// Capitalizar primera letra
function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ============ GARAGE: SELECTS DEPENDIENTES ============

function updateModelos(ctx) {
    const marca = document.getElementById(`garageMarca${cap(ctx)}`).value;
    const modeloSel = document.getElementById(`garageModelo${cap(ctx)}`);
    const versionSel = document.getElementById(`garageVersion${cap(ctx)}`);
    const anioSel = document.getElementById(`garageAnio${cap(ctx)}`);

    modeloSel.innerHTML = '<option value="">Seleccionar Modelo</option>';
    versionSel.innerHTML = '<option value="">Seleccionar Versión</option>';
    anioSel.innerHTML = '<option value="">Seleccionar Año</option>';
    versionSel.disabled = true;
    anioSel.disabled = true;

    if (!marca) { modeloSel.disabled = true; return; }
    modeloSel.disabled = false;

    const modelos = [...new Set(vehiculos.filter(v => v.marca === marca).map(v => v.modelo))];
    modelos.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        modeloSel.appendChild(opt);
    });
}

function updateVersiones(ctx) {
    const marca = document.getElementById(`garageMarca${cap(ctx)}`).value;
    const modelo = document.getElementById(`garageModelo${cap(ctx)}`).value;
    const versionSel = document.getElementById(`garageVersion${cap(ctx)}`);
    const anioSel = document.getElementById(`garageAnio${cap(ctx)}`);

    versionSel.innerHTML = '<option value="">Seleccionar Versión</option>';
    anioSel.innerHTML = '<option value="">Seleccionar Año</option>';
    anioSel.disabled = true;

    if (!modelo) { versionSel.disabled = true; return; }
    versionSel.disabled = false;

    const versiones = [...new Set(vehiculos.filter(v => v.marca === marca && v.modelo === modelo).map(v => v.version))];
    versiones.forEach(ver => {
        const opt = document.createElement('option');
        opt.value = ver; opt.textContent = ver;
        versionSel.appendChild(opt);
    });
}

function updateAnios(ctx) {
    const marca = document.getElementById(`garageMarca${cap(ctx)}`).value;
    const modelo = document.getElementById(`garageModelo${cap(ctx)}`).value;
    const version = document.getElementById(`garageVersion${cap(ctx)}`).value;
    const anioSel = document.getElementById(`garageAnio${cap(ctx)}`);

    anioSel.innerHTML = '<option value="">Seleccionar Año</option>';
    if (!version) { anioSel.disabled = true; return; }
    anioSel.disabled = false;

    const anios = [...new Set(vehiculos.filter(v => v.marca === marca && v.modelo === modelo && v.version === version).map(v => v.anio))];
    anios.sort((a, b) => b - a);
    anios.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a; opt.textContent = a;
        anioSel.appendChild(opt);
    });
}

// ============ BÚSQUEDA POR PLACA ============

function setPlaca(placa, ctx) {
    document.getElementById(`placaInput${cap(ctx)}`).value = placa;
    buscarPlaca(ctx);
}

function buscarPlaca(ctx) {
    const placa = document.getElementById(`placaInput${cap(ctx)}`).value.trim().toUpperCase();
    const resultDiv = document.getElementById(`placaResult${cap(ctx)}`);

    if (!placa) { showToast('Ingrese una placa válida', 'error'); return; }

    // Mostrar loading
    resultDiv.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Consultando Registro Público de Costa Rica…</p>
        </div>`;

    // Simular delay de consulta
    const isCached = cachedPlates[placa] !== undefined;
    const delay = isCached ? 400 : 1500;

    setTimeout(() => {
        const vehiculo = vehiculos.find(v => v.placa === placa);

        if (!vehiculo) {
            registrarBusqueda(placa, ctx, 'placa', false);
            resultDiv.innerHTML = renderNoResults(placa);
            return;
        }

        // Guardar en caché
        if (!isCached) {
            cachedPlates[placa] = vehiculo;
            localStorage.setItem('guaca_cachedPlates', JSON.stringify(cachedPlates));
        } else {
            cachedPlateHits++;
            localStorage.setItem('guaca_cachedPlateHits', String(cachedPlateHits));
        }

        registrarBusqueda(placa, ctx, 'placa', true);

        // Buscar productos compatibles
        const vehiculoStr = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version} ${vehiculo.anio}`;
        const productosCompat = buscarProductosCompatibles(vehiculoStr);

        resultDiv.innerHTML = `
            <div class="vehicle-card">
                <h3>✅ Vehículo Identificado ${isCached ? '<span class="badge badge-cache">Resultado en caché</span>' : ''}</h3>
                <div class="vehicle-info">
                    <span><strong>Placa:</strong> ${vehiculo.placa}</span>
                    <span><strong>Marca:</strong> ${vehiculo.marca}</span>
                    <span><strong>Modelo:</strong> ${vehiculo.modelo}</span>
                    <span><strong>Versión:</strong> ${vehiculo.version}</span>
                    <span><strong>Año:</strong> ${vehiculo.anio}</span>
                    <span><strong>VIN:</strong> ${vehiculo.vin}</span>
                </div>
            </div>
            ${renderResultados(productosCompat, ctx, vehiculoStr)}
        `;
    }, delay);
}

// ============ BÚSQUEDA POR GARAGE ============

function buscarGarage(ctx) {
    const marca = document.getElementById(`garageMarca${cap(ctx)}`).value;
    const modelo = document.getElementById(`garageModelo${cap(ctx)}`).value;
    const version = document.getElementById(`garageVersion${cap(ctx)}`).value;
    const anio = document.getElementById(`garageAnio${cap(ctx)}`).value;
    const resultDiv = document.getElementById(`garageResult${cap(ctx)}`);

    if (!marca || !modelo) {
        showToast('Seleccione al menos marca y modelo', 'error');
        return;
    }

    const vehiculoStr = `${marca} ${modelo}${version ? ' ' + version : ''}${anio ? ' ' + anio : ''}`;
    registrarBusqueda(vehiculoStr, ctx, 'garage', true);

    const productosCompat = buscarProductosCompatibles(vehiculoStr);

    if (productosCompat.length === 0) {
        registrarBusqueda(vehiculoStr, ctx, 'garage', false);
        resultDiv.innerHTML = renderNoResults(vehiculoStr);
        return;
    }

    resultDiv.innerHTML = renderResultados(productosCompat, ctx, vehiculoStr);
}

// ============ BÚSQUEDA POR LENGUAJE NATURAL ============

function setNatural(text, ctx) {
    document.getElementById(`naturalInput${cap(ctx)}`).value = text;
    buscarNatural(ctx);
}

function buscarNatural(ctx) {
    const query = document.getElementById(`naturalInput${cap(ctx)}`).value.trim();
    const resultDiv = document.getElementById(`naturalResult${cap(ctx)}`);

    if (!query) { showToast('Ingrese un texto de búsqueda', 'error'); return; }

    // Parsear lenguaje natural
    const parsed = parseNatural(query);
    registrarBusqueda(query, ctx, 'natural', true);

    // Buscar productos con scoring
    const resultados = buscarConScoring(parsed);

    let interpretationHtml = `
        <div class="interpretation-box">
            <h4>🤖 Interpretación del sistema</h4>
            <p><strong>Repuesto detectado:</strong> ${parsed.repuesto || 'No identificado'}</p>
            <p><strong>Vehículo:</strong> ${parsed.vehiculo || 'No especificado'}</p>
            <p><strong>Palabras clave:</strong> ${parsed.keywords.join(', ')}</p>
        </div>`;

    if (resultados.length === 0) {
        registrarBusqueda(query, ctx, 'natural', false);
        resultDiv.innerHTML = interpretationHtml + renderNoResults(query);
        return;
    }

    resultDiv.innerHTML = interpretationHtml + renderResultados(resultados, ctx, parsed.vehiculo);
}

// --- Parser de lenguaje natural ---
function parseNatural(query) {
    const lower = query.toLowerCase();
    const words = lower.split(/[\s,]+/).filter(w => w.length > 2);

    // Detectar marca/modelo/año
    let vehiculo = '';
    let marca = '';
    let modelo = '';
    let anio = '';

    const marcasConocidas = ['toyota', 'hyundai', 'nissan', 'honda', 'suzuki', 'mitsubishi', 'kia'];
    const modelosConocidos = ['corolla', 'hilux', 'tucson', 'sentra', 'civic', 'swift', 'l200', 'sportage'];

    marcasConocidas.forEach(m => { if (lower.includes(m)) marca = m; });
    modelosConocidos.forEach(m => { if (lower.includes(m)) modelo = m; });

    // Detectar año (4 dígitos entre 2000-2030)
    const anioMatch = query.match(/\b(20[0-2]\d)\b/);
    if (anioMatch) anio = anioMatch[1];

    if (marca || modelo || anio) {
        vehiculo = [marca, modelo, anio].filter(Boolean).join(' ');
    }

    // Detectar repuesto
    let repuesto = '';
    const repuestoKeywords = [
        'pastillas', 'freno', 'frenos', 'disco', 'amortiguador', 'compensador',
        'filtro', 'aceite', 'bujía', 'candela', 'terminal', 'radiador',
        'bomba', 'agua', 'faja', 'correa', 'sensor', 'alternador',
        'embrague', 'bobina', 'espiral', 'rótula', 'limpiaparabrisas',
        'bombillo', 'termostato', 'líquido'
    ];

    const foundRepuestos = words.filter(w => repuestoKeywords.some(rk => w.includes(rk) || rk.includes(w)));
    if (foundRepuestos.length > 0) repuesto = foundRepuestos.join(' ');

    // Keywords para búsqueda
    const stopwords = ['para', 'del', 'los', 'las', 'una', 'uno', 'con', 'por', 'que', 'necesito', 'busco', 'quiero'];
    const keywords = words.filter(w => !stopwords.includes(w) && !marcasConocidas.includes(w) && w !== anio);

    return { repuesto, vehiculo, marca, modelo, anio, keywords };
}

// ============ BÚSQUEDA POR SKU ============

function setSku(sku, ctx) {
    document.getElementById(`skuInput${cap(ctx)}`).value = sku;
    buscarSku(ctx);
}

function buscarSku(ctx) {
    const sku = document.getElementById(`skuInput${cap(ctx)}`).value.trim().toUpperCase();
    const resultDiv = document.getElementById(`skuResult${cap(ctx)}`);

    if (!sku) { showToast('Ingrese un SKU', 'error'); return; }

    registrarBusqueda(sku, ctx, 'sku', true);

    // Búsqueda exacta
    const exacto = productos.find(p => p.skuGuaca.toUpperCase() === sku || p.skuFabricante.toUpperCase() === sku);

    if (exacto) {
        registrarProductView(exacto.skuGuaca);
        resultDiv.innerHTML = renderResultados([{ ...exacto, score: 1.0 }], ctx, null);
        return;
    }

    // Sugerencias cercanas
    const sugerencias = productos.filter(p =>
        p.skuGuaca.toUpperCase().includes(sku.substring(0, 7)) ||
        sku.includes(p.skuGuaca.split('-')[1])
    ).map(p => ({ ...p, score: 0.6 }));

    if (sugerencias.length > 0) {
        resultDiv.innerHTML = `
            <div class="interpretation-box">
                <h4>🔍 SKU exacto no encontrado</h4>
                <p>No encontramos "${sku}" pero estas son sugerencias cercanas:</p>
            </div>
            ${renderResultados(sugerencias, ctx, null)}`;
    } else {
        registrarBusqueda(sku, ctx, 'sku', false);
        resultDiv.innerHTML = renderNoResults(sku);
    }
}

// ============ MOTOR DE BÚSQUEDA CON SCORING ============

function buscarProductosCompatibles(vehiculoStr) {
    const lower = vehiculoStr.toLowerCase();
    return productos
        .filter(p => p.compatibilidades.some(c => {
            const cl = c.toLowerCase();
            const parts = lower.split(' ');
            return parts.every(part => cl.includes(part));
        }))
        .map(p => {
            const totalStock = Object.values(p.stockPorTienda).reduce((a, b) => a + b, 0);
            let score = p.confianzaBase;
            if (totalStock > 10) score += 0.02;
            return { ...p, score: Math.min(score, 1.0) };
        })
        .sort((a, b) => b.score - a.score);
}

function buscarConScoring(parsed) {
    return productos.map(p => {
        let score = 0;
        const pText = (p.nombre + ' ' + p.descripcion + ' ' + p.sinonimos.join(' ') + ' ' + p.categoria).toLowerCase();

        // Coincidencia de vehículo
        if (parsed.vehiculo) {
            const vehiculoParts = parsed.vehiculo.toLowerCase().split(' ').filter(Boolean);
            const matchVehiculo = p.compatibilidades.some(c => {
                const cl = c.toLowerCase();
                return vehiculoParts.every(part => cl.includes(part));
            });
            if (matchVehiculo) score += 40;
        }

        // Coincidencia de keywords
        parsed.keywords.forEach(kw => {
            if (pText.includes(kw)) score += 15;
            // Buscar en sinónimos del diccionario
            Object.keys(sinonimos).forEach(key => {
                if (key.includes(kw) || kw.includes(key)) {
                    if (pText.includes(key)) score += 10;
                    sinonimos[key].forEach(syn => {
                        if (pText.includes(syn)) score += 8;
                    });
                }
            });
        });

        // Coincidencia por sinónimos del producto
        parsed.keywords.forEach(kw => {
            if (p.sinonimos.some(s => s.includes(kw) || kw.includes(s))) score += 12;
        });

        // Bonus por stock
        const totalStock = Object.values(p.stockPorTienda).reduce((a, b) => a + b, 0);
        if (totalStock > 0) score += 3;

        // Normalizar score a 0-1
        const normalizedScore = Math.min(score / 80, 1.0);
        return { ...p, score: normalizedScore };
    })
    .filter(p => p.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

// ============ RENDERIZADO DE RESULTADOS ============

function renderResultados(resultados, ctx, vehiculoStr) {
    if (resultados.length === 0) return renderNoResults('');

    const isVendedor = ctx === 'vendedor';
    let html = `<div class="filters-bar">
        <label>Filtrar:</label>
        <select onchange="filterResults(this, '${ctx}')">
            <option value="">Todas las categorías</option>
            ${[...new Set(resultados.map(r => r.categoria))].map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select onchange="sortResults(this, '${ctx}')">
            <option value="score">Mayor compatibilidad</option>
            <option value="price-asc">Precio menor</option>
            <option value="stock">Mayor disponibilidad</option>
        </select>
        <span style="margin-left:auto;color:var(--gray-500);font-size:0.85rem">${resultados.length} resultados</span>
    </div>`;

    html += `<div class="products-grid" id="productsGrid-${ctx}">`;
    resultados.forEach(p => {
        const totalStock = Object.values(p.stockPorTienda).reduce((a, b) => a + b, 0);
        const confianza = getConfianza(p.score);
        const icon = categoriaIconos[p.categoria] || '📦';

        registrarProductView(p.skuGuaca);

        html += `
        <div class="product-card" data-categoria="${p.categoria}" data-price="${p.precioCRC}" data-stock="${totalStock}" data-score="${p.score}">
            <div class="product-img">${icon}</div>
            <h4>${p.nombre}</h4>
            <p class="product-meta"><strong>SKU Guaca:</strong> ${p.skuGuaca}</p>
            <p class="product-meta"><strong>SKU Fab:</strong> ${p.skuFabricante}</p>
            <p class="product-meta"><strong>Categoría:</strong> ${p.categoria} | <strong>Marca:</strong> ${p.marcaRepuesto}</p>
            ${vehiculoStr ? '<span class="badge badge-compatible">✓ Compatible con el vehículo</span>' : ''}
            <span class="badge badge-confidence-${confianza.clase}">${confianza.texto}</span>
            <p class="product-price">₡${p.precioCRC.toLocaleString('es-CR')}</p>
            <p class="product-stock">📦 Stock total: ${totalStock} unidades</p>
            <div class="product-actions">
                <button class="btn btn-sm btn-outline" onclick="verDetalle('${p.skuGuaca}')">Ver detalle</button>
                <button class="btn btn-sm btn-secondary" onclick="copiarSku('${p.skuGuaca}')">📋 Copiar SKU</button>
                ${isVendedor ? `
                    <button class="btn btn-sm btn-info" onclick="enviarPOS('${p.skuGuaca}')">📤 Enviar POS</button>
                    <button class="btn btn-sm btn-secondary" onclick="verJsonApi('${p.skuGuaca}', '${vehiculoStr || ''}')">{ } JSON</button>
                ` : `
                    <button class="btn btn-sm btn-success" onclick="agregarCarrito('${p.skuGuaca}')">🛒 Agregar</button>
                `}
            </div>
        </div>`;
    });
    html += '</div>';
    return html;
}

function getConfianza(score) {
    if (score >= 0.9) return { texto: 'Confianza Alta', clase: 'alta' };
    if (score >= 0.7) return { texto: 'Confianza Media', clase: 'media' };
    return { texto: 'Confianza Baja', clase: 'baja' };
}

// --- Sin resultados ---
function renderNoResults(term) {
    return `
        <div class="no-results">
            <h3>❌ No encontramos repuestos compatibles</h3>
            <p>No hay resultados para: <strong>"${term}"</strong></p>
            <ul>
                <li>💡 Revise la placa o el término ingresado</li>
                <li>💡 Pruebe buscar por marca/modelo/año</li>
                <li>💡 Use un nombre diferente para el repuesto</li>
            </ul>
            <button class="btn btn-sm btn-outline" onclick="registrarSinResultado('${term.replace(/'/g, "\\'")}')">
                📝 Registrar búsqueda sin resultado
            </button>
        </div>`;
}

// ============ FILTROS Y ORDENAMIENTO ============

function filterResults(select, ctx) {
    const valor = select.value;
    const grid = select.closest('.result-area') || document.getElementById(`productsGrid-${ctx}`);
    const cards = grid.querySelectorAll ? grid.querySelectorAll('.product-card') :
                  document.querySelectorAll(`#productsGrid-${ctx} .product-card`);

    // Buscar en la sección actual de resultados
    const allCards = document.querySelectorAll('.product-card');
    allCards.forEach(card => {
        if (!valor || card.dataset.categoria === valor) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortResults(select, ctx) {
    const valor = select.value;
    const grid = document.querySelectorAll('.products-grid');
    grid.forEach(g => {
        const cards = Array.from(g.children);
        cards.sort((a, b) => {
            if (valor === 'price-asc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            if (valor === 'stock') return parseFloat(b.dataset.stock) - parseFloat(a.dataset.stock);
            return parseFloat(b.dataset.score) - parseFloat(a.dataset.score);
        });
        cards.forEach(c => g.appendChild(c));
    });
}

// ============ ACCIONES DE PRODUCTO ============

function copiarSku(sku) {
    navigator.clipboard.writeText(sku).then(() => {
        showToast(`📋 SKU copiado: ${sku}`, 'success');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = sku; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`📋 SKU copiado: ${sku}`, 'success');
    });
}

function enviarPOS(sku) {
    showToast(`📤 SKU ${sku} enviado al POS`, 'success');
}

function agregarCarrito(sku) {
    const p = productos.find(pr => pr.skuGuaca === sku);
    showToast(`🛒 ${p.nombre} agregado al carrito`, 'success');
}

function registrarSinResultado(term) {
    const entry = {
        termino: term,
        canal: currentRole,
        tipo: 'manual',
        fecha: new Date().toLocaleString('es-CR')
    };
    failedSearches.push(entry);
    localStorage.setItem('guaca_failedSearches', JSON.stringify(failedSearches));
    showToast('📝 Búsqueda sin resultado registrada', 'info');
    updateDashboard();
}

// ============ MODAL DETALLE ============

function verDetalle(sku) {
    const p = productos.find(pr => pr.skuGuaca === sku);
    if (!p) return;

    const totalStock = Object.values(p.stockPorTienda).reduce((a, b) => a + b, 0);
    const icon = categoriaIconos[p.categoria] || '📦';

    let stockHtml = '';
    Object.entries(p.stockPorTienda).forEach(([tienda, qty]) => {
        stockHtml += `<tr>
            <td>${tienda}</td>
            <td class="${qty > 0 ? 'stock-available' : 'stock-zero'}">${qty > 0 ? qty + ' unidades' : 'Sin stock'}</td>
        </tr>`;
    });

    document.getElementById('modalDetalleBody').innerHTML = `
        <div class="detail-header">
            <div class="detail-img">${icon}</div>
            <div class="detail-info">
                <h2>${p.nombre}</h2>
                <p><strong>SKU Guaca:</strong> ${p.skuGuaca}</p>
                <p><strong>SKU Fabricante:</strong> ${p.skuFabricante}</p>
                <p><strong>Categoría:</strong> ${p.categoria}</p>
                <p><strong>Marca Repuesto:</strong> ${p.marcaRepuesto}</p>
                <p><strong>Descripción:</strong> ${p.descripcion}</p>
                <p class="product-price">₡${p.precioCRC.toLocaleString('es-CR')}</p>
                <p><strong>Stock Total:</strong> ${totalStock} unidades</p>
            </div>
        </div>
        <div class="detail-section">
            <h4>🚗 Vehículos Compatibles</h4>
            <div class="compat-list">
                ${p.compatibilidades.map(c => `<span class="compat-chip">${c}</span>`).join('')}
            </div>
        </div>
        <div class="detail-section">
            <h4>🏪 Disponibilidad por Tienda</h4>
            <table class="stock-table">${stockHtml}</table>
        </div>
        <div class="detail-section">
            <h4>📡 Endpoint API</h4>
            <span class="endpoint-label">GET /v1/products/${p.skuGuaca}</span>
            <div class="json-block">${JSON.stringify({
                sku: p.skuGuaca,
                name: p.nombre,
                category: p.categoria,
                price: { amount: p.precioCRC, currency: 'CRC' },
                manufacturer: p.marcaRepuesto,
                manufacturerSku: p.skuFabricante,
                compatibility: p.compatibilidades,
                totalStock: totalStock
            }, null, 2)}</div>
        </div>
    `;
    openModal('modalDetalle');
}

// ============ MODAL JSON API ============

function verJsonApi(sku, vehiculoStr) {
    const p = productos.find(pr => pr.skuGuaca === sku);
    if (!p) return;

    const totalStock = Object.values(p.stockPorTienda).reduce((a, b) => a + b, 0);

    // Construir request/response simulado
    const request = {
        channel: 'POS',
        searchType: 'plate',
        plate: 'ABC123',
        vehicle: {
            brand: vehiculoStr ? vehiculoStr.split(' ')[0] || 'Toyota' : 'Toyota',
            model: vehiculoStr ? vehiculoStr.split(' ')[1] || 'Corolla' : 'Corolla',
            version: vehiculoStr ? vehiculoStr.split(' ')[2] || 'XEI' : 'XEI',
            year: vehiculoStr ? parseInt(vehiculoStr.match(/\d{4}/)?.[0]) || 2018 : 2018
        }
    };

    const response = {
        success: true,
        timestamp: new Date().toISOString(),
        endpoint: 'GET /v1/search/parts',
        request: request,
        results: [{
            skuGuaca: p.skuGuaca,
            manufacturerSku: p.skuFabricante,
            description: p.nombre,
            category: p.categoria,
            price: { amount: p.precioCRC, currency: 'CRC' },
            confidence: p.confianzaBase,
            availableStock: totalStock,
            stockByStore: p.stockPorTienda
        }],
        metadata: {
            totalResults: 1,
            queryTimeMs: Math.floor(Math.random() * 50) + 20,
            cacheHit: false,
            indexVersion: '2026-07-07'
        }
    };

    document.getElementById('modalJsonBody').innerHTML = `
        <p style="margin-bottom:0.5rem"><strong>Endpoint:</strong></p>
        <span class="endpoint-label">GET /v1/search/parts</span>
        <span class="endpoint-label" style="margin-left:0.5rem">GET /v1/plate/{placa}</span>
        <span class="endpoint-label" style="margin-left:0.5rem">GET /v1/products/{sku}</span>
        <h4 style="margin-top:1.5rem">Request:</h4>
        <div class="json-block">${JSON.stringify(request, null, 2)}</div>
        <h4 style="margin-top:1rem">Response:</h4>
        <div class="json-block">${JSON.stringify(response, null, 2)}</div>
    `;
    openModal('modalJson');
}

// ============ MODALES ============

function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => {
            m.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ============ TOASTS ============

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ REGISTRO DE BÚSQUEDAS (ANALÍTICA) ============

function registrarBusqueda(term, canal, tipo, exitosa) {
    const entry = {
        termino: term,
        canal: canal,
        tipo: tipo,
        exitosa: exitosa,
        fecha: new Date().toISOString()
    };
    searchLog.push(entry);
    localStorage.setItem('guaca_searchLog', JSON.stringify(searchLog));

    // Registrar frecuencia del término
    const key = term.toLowerCase().trim();
    termFrequency[key] = (termFrequency[key] || 0) + 1;
    localStorage.setItem('guaca_termFrequency', JSON.stringify(termFrequency));

    // Si no tiene resultado, agregar a fallidos
    if (!exitosa) {
        const fail = {
            termino: term,
            canal: canal,
            tipo: tipo,
            fecha: new Date().toLocaleString('es-CR')
        };
        failedSearches.push(fail);
        localStorage.setItem('guaca_failedSearches', JSON.stringify(failedSearches));
    }

    updateDashboard();
}

function registrarProductView(sku) {
    productViews[sku] = (productViews[sku] || 0) + 1;
    localStorage.setItem('guaca_productViews', JSON.stringify(productViews));
}

// ============ DASHBOARD DE ANALÍTICA ============

function updateDashboard() {
    // Estadísticas generales
    const total = searchLog.length;
    const exitosas = searchLog.filter(s => s.exitosa).length;
    const fallidas = searchLog.filter(s => !s.exitosa).length;

    document.getElementById('statTotalSearches').textContent = total;
    document.getElementById('statSuccessSearches').textContent = exitosas;
    document.getElementById('statFailedSearches').textContent = fallidas;
    document.getElementById('statCachedPlates').textContent = cachedPlateHits;

    // Top términos
    const topTermsDiv = document.getElementById('topTerms');
    const sortedTerms = Object.entries(termFrequency).sort((a, b) => b[1] - a[1]).slice(0, 8);
    topTermsDiv.innerHTML = sortedTerms.length === 0
        ? '<p style="color:var(--gray-500);font-size:0.9rem">Sin datos aún. Realice búsquedas para ver estadísticas.</p>'
        : sortedTerms.map(([term, count]) => `
            <div class="dash-list-item">
                <span>${term}</span>
                <strong>${count}</strong>
            </div>`).join('');

    // Top productos
    const topProductsDiv = document.getElementById('topProducts');
    const sortedProducts = Object.entries(productViews).sort((a, b) => b[1] - a[1]).slice(0, 8);
    topProductsDiv.innerHTML = sortedProducts.length === 0
        ? '<p style="color:var(--gray-500);font-size:0.9rem">Sin datos aún.</p>'
        : sortedProducts.map(([sku, count]) => {
            const p = productos.find(pr => pr.skuGuaca === sku);
            return `<div class="dash-list-item">
                <span>${p ? p.nombre : sku}</span>
                <strong>${count}</strong>
            </div>`;
        }).join('');

    // Tabla de búsquedas fallidas
    const tbody = document.getElementById('failedSearchesBody');
    tbody.innerHTML = failedSearches.length === 0
        ? '<tr><td colspan="4" style="text-align:center;color:var(--gray-500)">No hay búsquedas sin resultado</td></tr>'
        : failedSearches.slice(-20).reverse().map(f => `
            <tr>
                <td>${f.termino}</td>
                <td>${f.canal}</td>
                <td>${f.tipo}</td>
                <td>${f.fecha}</td>
            </tr>`).join('');
}
