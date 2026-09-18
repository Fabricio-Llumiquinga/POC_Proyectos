// ========== APP PRINCIPAL ==========
let currentUser = null;
let currentSection = 'dashboard';

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = USUARIOS.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('user-name').textContent = user.nombre;
        navigateTo('dashboard');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
        setTimeout(() => document.getElementById('login-error').classList.add('hidden'), 3000);
    }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', function() {
    currentUser = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        navigateTo(section);
    });
});

// Menu toggle
document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
});

function navigateTo(section) {
    currentSection = section;
    // Update nav
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`[data-section="${section}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update title
    const titles = {
        dashboard: 'Dashboard', vacantes: 'Vacantes', candidatos: 'Candidatos',
        centralizacion: 'Centralización de CVs', plantillas: 'Plantillas de Puesto',
        pool: 'Pool de Candidatos', trazabilidad: 'Trazabilidad',
        asistente: 'Asistente IA', configuracion: 'Configuración'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';

    // Render content
    const content = document.getElementById('content');
    switch(section) {
        case 'dashboard': content.innerHTML = renderDashboard(); setTimeout(initDashboardCharts, 100); break;
        case 'vacantes': content.innerHTML = renderVacantes(); break;
        case 'candidatos': content.innerHTML = renderCandidatos(); break;
        case 'centralizacion': content.innerHTML = renderCentralizacion(); break;
        case 'plantillas': content.innerHTML = renderPlantillas(); break;
        case 'pool': content.innerHTML = renderPool(); break;
        case 'trazabilidad': content.innerHTML = renderTrazabilidad(); break;
        case 'asistente': content.innerHTML = renderAsistente(); setTimeout(initAsistente, 100); break;
        case 'configuracion': content.innerHTML = renderConfiguracion(); break;
        default: content.innerHTML = renderDashboard(); setTimeout(initDashboardCharts, 100);
    }

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

function renderConfiguracion() {
    return `
    <div class="config-grid">
        <div class="config-card">
            <h4><i class="fas fa-users-cog" style="color:var(--accent)"></i> Gestión de Usuarios</h4>
            <p>Administra usuarios del sistema, asigna roles y permisos de acceso a la plataforma.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Gestionar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-user-tag" style="color:var(--purple)"></i> Roles y Permisos</h4>
            <p>Define roles personalizados y controla el acceso a módulos específicos del sistema.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Configurar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-plug" style="color:var(--green)"></i> Fuentes de Integración</h4>
            <p>Configura las fuentes de datos: APIs externas, correos electrónicos y portales de empleo.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Configurar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-sliders-h" style="color:var(--orange)"></i> Parámetros de Scoring</h4>
            <p>Ajusta los pesos y umbrales del motor de IA para el perfilamiento de candidatos.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Ajustar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-envelope-open-text" style="color:var(--accent)"></i> Plantillas de Notificación</h4>
            <p>Personaliza las plantillas de correo para comunicación con candidatos y reclutadores.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Editar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-globe" style="color:var(--blue)"></i> Países y Regiones</h4>
            <p>Administra los países y regiones disponibles para vacantes y candidatos.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Gestionar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-building" style="color:var(--gray-600)"></i> Áreas de RRHH</h4>
            <p>Configura las áreas organizacionales para clasificación de vacantes y plantillas.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Gestionar</button>
        </div>
        <div class="config-card">
            <h4><i class="fas fa-database" style="color:var(--primary)"></i> Respaldo de Datos</h4>
            <p>Genera respaldos del sistema y exporta información para auditorías.</p>
            <button class="btn btn-sm btn-secondary"><i class="fas fa-arrow-right"></i> Respaldar</button>
        </div>
    </div>`;
}

// Modal functions
function openModal(content) {
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Toast notifications
function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    toast.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}

// ============ ASISTENTE IA ============
function renderAsistente() {
    return `
    <div class="asistente-container">
        <div class="asistente-messages" id="asistente-messages">
            <div class="msg-ia"><i class="fas fa-robot"></i> ¡Hola! Soy el asistente de TalentIA. Puedo ayudarte a consultar información sobre vacantes, candidatos y el proceso de selección. ¿En qué puedo ayudarte?</div>
        </div>
        <div class="asistente-suggestions" id="asistente-suggestions">
            <button onclick="enviarMsgAsistente('Vacantes disponibles')">Vacantes disponibles</button>
            <button onclick="enviarMsgAsistente('¿Quién tiene Power BI?')">¿Quién tiene Power BI?</button>
            <button onclick="enviarMsgAsistente('Candidatos no contratados con Excel')">No contratados con Excel</button>
            <button onclick="enviarMsgAsistente('Resumen del proceso')">Resumen del proceso</button>
            <button onclick="enviarMsgAsistente('¿Quién tiene SAP?')">¿Quién tiene SAP?</button>
            <button onclick="enviarMsgAsistente('Candidatos en entrevista')">En entrevista</button>
            <button onclick="enviarMsgAsistente('Top 5 candidatos')">Top 5 candidatos</button>
            <button onclick="enviarMsgAsistente('Candidatos en el pool')">Pool de candidatos</button>
            <button onclick="enviarMsgAsistente('¿Cuántos candidatos hay por vacante?')">Candidatos por vacante</button>
            <button onclick="enviarMsgAsistente('Candidatos con más de 5 años de experiencia')">+5 años experiencia</button>
            <button onclick="enviarMsgAsistente('¿Quién habla inglés?')">¿Quién habla inglés?</button>
            <button onclick="enviarMsgAsistente('Candidatos descartados')">Descartados</button>
            <button onclick="enviarMsgAsistente('¿Quién tiene Liderazgo?')">Con Liderazgo</button>
            <button onclick="enviarMsgAsistente('Vacantes cerradas')">Vacantes cerradas</button>
            <button onclick="enviarMsgAsistente('Candidatos con score mayor a 85')">Score &gt; 85%</button>
            <button onclick="enviarMsgAsistente('¿Quién tiene certificaciones?')">Con certificaciones</button>
        </div>
        <div class="asistente-input-bar">
            <input type="text" id="asistente-input" placeholder="Escribe tu pregunta..." onkeydown="if(event.key==='Enter')enviarMsgAsistenteInput()">
            <button onclick="enviarMsgAsistenteInput()"><i class="fas fa-paper-plane"></i> Enviar</button>
        </div>
    </div>`;
}

function initAsistente() {
    const input = document.getElementById('asistente-input');
    if (input) input.focus();
}

function enviarMsgAsistenteInput() {
    const input = document.getElementById('asistente-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    enviarMsgAsistente(msg);
}

function enviarMsgAsistente(msg) {
    const container = document.getElementById('asistente-messages');
    // Add user message
    container.innerHTML += `<div class="msg-user">${msg}</div>`;
    // Generate IA response
    const respuesta = generarRespuestaAsistente(msg);
    setTimeout(() => {
        container.innerHTML += `<div class="msg-ia">${respuesta}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 600);
    container.scrollTop = container.scrollHeight;
}

function generarRespuestaAsistente(msg) {
    const msgLower = msg.toLowerCase();
    
    // Vacantes disponibles
    if (msgLower.includes('vacantes disponibles') || msgLower.includes('vacantes abiertas') || msgLower.includes('puestos abiertos')) {
        const abiertas = VACANTES.filter(v => v.estado !== 'Cerrada' && v.estado !== 'Finalizada');
        let html = `<strong>📋 Vacantes disponibles (${abiertas.length}):</strong><br><br>`;
        abiertas.forEach(v => {
            html += `• <strong>${v.nombre}</strong> (${v.codigo}) - ${v.area}, ${v.pais} - Estado: ${v.estado}<br>`;
        });
        return html;
    }

    // Resumen del proceso
    if (msgLower.includes('resumen') || msgLower.includes('estadísticas') || msgLower.includes('stats')) {
        const activos = CANDIDATOS.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
        const procesados = activos.filter(c => c.estado !== 'Nuevo').length;
        const seleccionados = activos.filter(c => c.estado === 'Seleccionado' || c.estado === 'En entrevista' || c.estado === 'Contratado').length;
        const contratados = activos.filter(c => c.estado === 'Contratado').length;
        const vacActivas = VACANTES.filter(v => v.estado !== 'Cerrada' && v.estado !== 'Finalizada').length;
        const scorePromedio = Math.round(activos.reduce((a, c) => a + c.score, 0) / activos.length);
        let html = `<strong>📊 Resumen del proceso:</strong><br><br>`;
        html += `• Candidatos activos: <strong>${activos.length}</strong><br>`;
        html += `• Procesados por IA: <strong>${procesados}</strong><br>`;
        html += `• Seleccionados/Entrevista: <strong>${seleccionados}</strong><br>`;
        html += `• Contratados: <strong>${contratados}</strong><br>`;
        html += `• Vacantes activas: <strong>${vacActivas}</strong><br>`;
        html += `• Score promedio: <strong>${scorePromedio}%</strong><br>`;
        html += `<br>El proceso se encuentra en buen estado. Tiempo estimado ahorrado: <strong>72 horas</strong>.`;
        return html;
    }

    // Search by skill - candidates NOT hired with that skill
    const skillKeywords = ['power bi', 'excel', 'sap', 'python', 'sql', 'tableau', 'crm', 'salesforce', 
        'lean', 'six sigma', 'reclutamiento', 'negociación', 'liderazgo', 'soldadura', 'hidráulica',
        'mantenimiento', 'mapeo de procesos', 'linkedin', 'marketing'];
    
    let foundSkill = null;
    for (const skill of skillKeywords) {
        if (msgLower.includes(skill)) {
            foundSkill = skill;
            break;
        }
    }
    
    // Also check if message has "no contratados" or "no contratado" pattern
    const noContratados = msgLower.includes('no contratado') || msgLower.includes('no contratados');
    
    if (foundSkill) {
        let candidatosFiltrados;
        if (noContratados) {
            candidatosFiltrados = CANDIDATOS.filter(c => 
                c.estado !== 'Contratado' && c.estado !== 'Dado de baja' && c.estado !== 'Oculto' &&
                c.habilidades.some(h => h.toLowerCase().includes(foundSkill))
            );
        } else {
            candidatosFiltrados = CANDIDATOS.filter(c => 
                c.estado !== 'Dado de baja' && c.estado !== 'Oculto' && c.estado !== 'Contratado' &&
                c.habilidades.some(h => h.toLowerCase().includes(foundSkill))
            );
        }
        
        if (candidatosFiltrados.length === 0) {
            return `No encontré candidatos ${noContratados ? 'no contratados ' : ''}con la habilidad "<strong>${foundSkill}</strong>".`;
        }
        
        let html = `<strong>🔍 Candidatos ${noContratados ? 'no contratados ' : ''}con "${foundSkill}" (${candidatosFiltrados.length}):</strong><br><br>`;
        candidatosFiltrados.slice(0, 10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - Estado: ${c.estado}<br>`;
        });
        if (candidatosFiltrados.length > 10) {
            html += `<br><em>... y ${candidatosFiltrados.length - 10} más.</em>`;
        }
        return html;
    }

    // Search by candidate name
    if (msgLower.includes('candidato') || msgLower.includes('buscar') || msgLower.includes('quién es')) {
        const palabras = msgLower.split(' ').filter(p => p.length > 3 && !['candidato','buscar','quién','quien','tiene','como','está'].includes(p));
        if (palabras.length > 0) {
            const encontrados = CANDIDATOS.filter(c => 
                palabras.some(p => c.nombre.toLowerCase().includes(p))
            );
            if (encontrados.length > 0) {
                let html = `<strong>👤 Candidatos encontrados:</strong><br><br>`;
                encontrados.slice(0, 8).forEach(c => {
                    html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - ${c.vacante_nombre} - ${c.estado}<br>`;
                });
                return html;
            }
        }
    }

    // Candidatos en entrevista
    if (msgLower.includes('en entrevista')) {
        const enEntrevista = CANDIDATOS.filter(c => c.estado === 'En entrevista');
        if (enEntrevista.length === 0) return 'No hay candidatos en entrevista actualmente.';
        let html = `<strong>🎯 Candidatos en entrevista (${enEntrevista.length}):</strong><br><br>`;
        enEntrevista.forEach(c => { html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - ${c.vacante_nombre}<br>`; });
        return html;
    }

    // Top 5 candidatos
    if (msgLower.includes('top 5') || msgLower.includes('mejores candidatos') || msgLower.includes('mejores scores')) {
        const top = CANDIDATOS.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto').sort((a,b) => b.score - a.score).slice(0,5);
        let html = `<strong>🏆 Top 5 Candidatos por Score:</strong><br><br>`;
        top.forEach((c,i) => { html += `${i+1}. <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - <strong>${c.score}%</strong> - ${c.vacante_nombre} - ${c.estado}<br>`; });
        return html;
    }

    // Candidatos en pool
    if (msgLower.includes('pool') || msgLower.includes('inactivos')) {
        const pool = CANDIDATOS.filter(c => c.estado === 'En pool futuro');
        if (pool.length === 0) return 'No hay candidatos en el pool actualmente.';
        let html = `<strong>📦 Candidatos en Pool (${pool.length}):</strong><br><br>`;
        pool.slice(0,10).forEach(c => { html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - Última vacante: ${c.vacante_nombre}<br>`; });
        if (pool.length > 10) html += `<br><em>... y ${pool.length-10} más en el pool.</em>`;
        return html;
    }

    // Candidatos por vacante
    if (msgLower.includes('por vacante') || msgLower.includes('cuántos candidatos')) {
        let html = `<strong>📊 Distribución de candidatos por vacante:</strong><br><br>`;
        VACANTES.forEach(v => {
            const count = CANDIDATOS.filter(c => c.vacante_id === v.id && c.estado !== 'Dado de baja' && c.estado !== 'Oculto').length;
            html += `• <strong>${v.nombre}</strong> (${v.codigo}): ${count} candidatos - Estado: ${v.estado}<br>`;
        });
        return html;
    }

    // Experiencia mayor a X años
    const expMatch = msgLower.match(/(\d+)\s*años/);
    if (expMatch && (msgLower.includes('experiencia') || msgLower.includes('años'))) {
        const anios = parseInt(expMatch[1]);
        const conExp = CANDIDATOS.filter(c => c.experiencia_anios >= anios && c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
        if (conExp.length === 0) return `No encontré candidatos con más de ${anios} años de experiencia.`;
        let html = `<strong>💼 Candidatos con ${anios}+ años de experiencia (${conExp.length}):</strong><br><br>`;
        conExp.sort((a,b) => b.experiencia_anios - a.experiencia_anios).slice(0,10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - ${c.experiencia_anios} años - Score: ${c.score}% - ${c.estado}<br>`;
        });
        if (conExp.length > 10) html += `<br><em>... y ${conExp.length-10} más.</em>`;
        return html;
    }

    // Score mayor a X
    const scoreMatch = msgLower.match(/score\s*(?:mayor|más|>|de)\s*(?:a|de|que)?\s*(\d+)/);
    if (scoreMatch || (msgLower.includes('score') && msgLower.match(/\d+/))) {
        const scoreMin = parseInt(scoreMatch ? scoreMatch[1] : msgLower.match(/\d+/)[0]);
        const conScore = CANDIDATOS.filter(c => c.score >= scoreMin && c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
        if (conScore.length === 0) return `No encontré candidatos con score mayor a ${scoreMin}%.`;
        let html = `<strong>⭐ Candidatos con score ≥ ${scoreMin}% (${conScore.length}):</strong><br><br>`;
        conScore.sort((a,b) => b.score - a.score).slice(0,10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - <strong>${c.score}%</strong> - ${c.vacante_nombre} - ${c.estado}<br>`;
        });
        if (conScore.length > 10) html += `<br><em>... y ${conScore.length-10} más.</em>`;
        return html;
    }

    // Habla inglés
    if (msgLower.includes('inglés') || msgLower.includes('ingles') || msgLower.includes('idioma')) {
        const conIngles = CANDIDATOS.filter(c => c.idiomas.some(i => i.toLowerCase().includes('inglés')) && c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
        if (conIngles.length === 0) return 'No encontré candidatos con inglés registrado.';
        let html = `<strong>🌐 Candidatos con inglés (${conIngles.length}):</strong><br><br>`;
        conIngles.slice(0,10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - ${c.idiomas.join(', ')} - Score: ${c.score}% - ${c.estado}<br>`;
        });
        if (conIngles.length > 10) html += `<br><em>... y ${conIngles.length-10} más.</em>`;
        return html;
    }

    // Certificaciones
    if (msgLower.includes('certificacion') || msgLower.includes('certificado') || msgLower.includes('certificaciones')) {
        const conCert = CANDIDATOS.filter(c => c.certificaciones.length > 0 && c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
        if (conCert.length === 0) return 'No encontré candidatos con certificaciones registradas.';
        let html = `<strong>🎓 Candidatos con certificaciones (${conCert.length}):</strong><br><br>`;
        conCert.slice(0,10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - ${c.certificaciones.join(', ')} - Score: ${c.score}%<br>`;
        });
        return html;
    }

    // Candidatos descartados
    if (msgLower.includes('descartado') || msgLower.includes('descartados')) {
        const descartados = CANDIDATOS.filter(c => c.estado === 'Descartado');
        if (descartados.length === 0) return 'No hay candidatos descartados actualmente.';
        let html = `<strong>❌ Candidatos descartados (${descartados.length}):</strong><br><br>`;
        descartados.slice(0,10).forEach(c => {
            html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - ${c.vacante_nombre}${c.razon_descarte ? ' - Razón: '+c.razon_descarte : ''}<br>`;
        });
        return html;
    }

    // Vacantes cerradas
    if (msgLower.includes('vacantes cerradas') || msgLower.includes('vacantes finalizadas')) {
        const cerradas = VACANTES.filter(v => v.estado === 'Cerrada' || v.estado === 'Finalizada');
        if (cerradas.length === 0) return 'No hay vacantes cerradas actualmente.';
        let html = `<strong>🔒 Vacantes cerradas/finalizadas (${cerradas.length}):</strong><br><br>`;
        cerradas.forEach(v => { html += `• <strong>${v.nombre}</strong> (${v.codigo}) - ${v.area} - Estado: ${v.estado}<br>`; });
        return html;
    }

    // Contratados
    if (msgLower.includes('contratados') || msgLower.includes('quién fue contratado')) {
        const contratados = CANDIDATOS.filter(c => c.estado === 'Contratado');
        if (contratados.length === 0) return 'No hay candidatos contratados actualmente.';
        let html = `<strong>🏅 Candidatos contratados (${contratados.length}):</strong><br><br>`;
        contratados.forEach(c => { html += `• <a onclick="verDetalleCandidato(${c.id})">${c.nombre}</a> - Score: ${c.score}% - ${c.vacante_nombre}<br>`; });
        return html;
    }

    // Default response
    return `No estoy seguro de cómo responder a eso. Puedo ayudarte con:<br><br>
    • <strong>Vacantes disponibles / cerradas</strong><br>
    • <strong>Buscar por habilidad</strong> - ej: "¿Quién tiene Power BI?"<br>
    • <strong>Candidatos no contratados con [habilidad]</strong><br>
    • <strong>Candidatos en entrevista / descartados / en el pool</strong><br>
    • <strong>Top 5 candidatos</strong> - mejores scores<br>
    • <strong>Score mayor a X</strong> - ej: "score mayor a 85"<br>
    • <strong>Candidatos con más de X años de experiencia</strong><br>
    • <strong>¿Quién habla inglés?</strong><br>
    • <strong>¿Quién tiene certificaciones?</strong><br>
    • <strong>Candidatos por vacante</strong> - distribución<br>
    • <strong>Resumen del proceso</strong> - estadísticas generales<br><br>
    Intenta con alguna de estas opciones.`;
}
