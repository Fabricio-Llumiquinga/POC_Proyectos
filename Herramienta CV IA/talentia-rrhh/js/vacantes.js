function renderVacantes() {
    return `
    <div class="table-container">
        <div class="table-header">
            <h3>Gestión de Vacantes</h3>
            <div class="table-actions">
                <button class="btn btn-primary" onclick="openModalNuevaVacante()"><i class="fas fa-plus"></i> Nueva Vacante</button>
            </div>
        </div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Código</th><th>Puesto</th><th>Área</th><th>País</th>
                        <th>Reclutador</th><th>Apertura</th><th>Estado</th>
                        <th>Disponibilidad</th><th>Recibidos</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${VACANTES.map(v => `
                    <tr>
                        <td><strong>${v.codigo}</strong></td>
                        <td>${v.nombre}</td><td>${v.area}</td><td>${v.pais}</td>
                        <td>${v.reclutador}</td><td>${v.fecha_apertura}</td>
                        <td><span class="badge ${getEstadoBadge(v.estado)}">${v.estado}</span></td>
                        <td><span class="badge ${v.disponibilidad==='Disponible'?'badge-green':'badge-red'}">${v.disponibilidad}</span></td>
                        <td>${v.candidatos_recibidos}</td>
                        <td class="acciones-vacante">
                            <button class="btn btn-sm btn-secondary" onclick="verCandidatosVacante(${v.id})" title="Ver candidatos"><i class="fas fa-users"></i></button>
                            <button class="btn btn-sm btn-secondary" onclick="ejecutarAnalisisIA(${v.id})" title="Análisis IA"><i class="fas fa-robot"></i></button>
                            <button class="btn btn-sm btn-secondary" onclick="accionesVacante(${v.id})" title="Más acciones"><i class="fas fa-ellipsis-v"></i></button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function accionesVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const cerradaOFinalizada = v.estado === 'Cerrada' || v.estado === 'Finalizada';
    openModal(`
        <div class="modal-header"><h3>Acciones - ${v.nombre} (${v.codigo})</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <p style="margin-bottom:16px;color:var(--gray-600)">Estado actual: <span class="badge ${getEstadoBadge(v.estado)}">${v.estado}</span> | Disponibilidad: <span class="badge ${v.disponibilidad==='Disponible'?'badge-green':'badge-red'}">${v.disponibilidad}</span></p>
            <div class="config-grid" style="grid-template-columns:1fr 1fr">
                ${!cerradaOFinalizada?`<div class="config-card"><h4><i class="fas fa-lock" style="color:var(--red)"></i> Cerrar Vacante</h4><p>Cierra la vacante y envía candidatos activos al pool.</p><button class="btn btn-sm btn-danger" onclick="cerrarVacante(${v.id})">Cerrar</button></div>`:''}
                ${cerradaOFinalizada?`<div class="config-card"><h4><i class="fas fa-redo" style="color:var(--green)"></i> Reactivar Puesto</h4><p>Reactiva la vacante. Permite nuevos candidatos.</p><button class="btn btn-sm btn-success" onclick="reactivarVacante(${v.id})">Reactivar</button></div>`:''}
                ${cerradaOFinalizada?`<div class="config-card"><h4><i class="fas fa-folder-open" style="color:var(--accent)"></i> Reabrir Vacante</h4><p>Reabre manteniendo candidatos históricos.</p><button class="btn btn-sm btn-primary" onclick="reabrirVacante(${v.id})">Reabrir</button></div>`:''}
                <div class="config-card"><h4><i class="fas fa-copy" style="color:var(--purple)"></i> Clonar Puesto</h4><p>Crea nueva vacante con misma configuración.</p><button class="btn btn-sm btn-secondary" onclick="clonarVacante(${v.id})">Clonar</button></div>
                <div class="config-card"><h4><i class="fas fa-toggle-on" style="color:var(--orange)"></i> Cambiar Disponibilidad</h4><p>Actualmente: ${v.disponibilidad}</p><button class="btn btn-sm btn-warning" onclick="toggleDisponibilidad(${v.id})">${v.disponibilidad==='Disponible'?'No Disponible':'Disponible'}</button></div>
                <div class="config-card"><h4><i class="fas fa-edit" style="color:var(--gray-600)"></i> Cambiar Estado</h4><p>Cambiar estado manualmente.</p><button class="btn btn-sm btn-secondary" onclick="cambiarEstadoVacante(${v.id})">Cambiar</button></div>
            </div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
    `);
}

function cerrarVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const estadoAnterior = v.estado;
    v.estado = 'Cerrada'; v.disponibilidad = 'No disponible';
    const activos = CANDIDATOS.filter(c => c.vacante_id === id && !['Contratado','Dado de baja','Oculto','Descartado','En pool futuro'].includes(c.estado));
    activos.forEach(c => { c.estado = 'En pool futuro'; c.es_historico = true; });
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante cerrada', descripcion: `Vacante "${v.nombre}" cerrada. ${activos.length} candidatos enviados al pool.`, entidad: v.codigo, estado_anterior: estadoAnterior, estado_nuevo: 'Cerrada' });
    closeModal(); showToast(`Vacante cerrada. ${activos.length} candidatos movidos al pool.`, 'success'); navigateTo('vacantes');
}

function reactivarVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const ea = v.estado; v.estado = 'Reactivada'; v.disponibilidad = 'Disponible';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante reactivada', descripcion: `Vacante "${v.nombre}" reactivada`, entidad: v.codigo, estado_anterior: ea, estado_nuevo: 'Reactivada' });
    closeModal(); showToast(`Vacante "${v.nombre}" reactivada.`, 'success'); navigateTo('vacantes');
}

function reabrirVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const ea = v.estado; v.estado = 'Abierta'; v.disponibilidad = 'Disponible';
    CANDIDATOS.filter(c => c.vacante_id === id).forEach(c => { c.es_historico = true; });
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante reabierta', descripcion: `Vacante "${v.nombre}" reabierta.`, entidad: v.codigo, estado_anterior: ea, estado_nuevo: 'Abierta' });
    closeModal(); showToast(`Vacante reabierta. Candidatos anteriores marcados como históricos.`, 'success'); navigateTo('vacantes');
}

function clonarVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const nv = { id: VACANTES.length+1, codigo: `VAC-2026-${String(VACANTES.length+1).padStart(3,'0')}`, nombre: v.nombre, area: v.area, pais: v.pais, reclutador: v.reclutador, fecha_apertura: new Date().toISOString().split('T')[0], estado: 'Clonada', disponibilidad: 'Disponible', plantilla_id: v.plantilla_id, candidatos_recibidos: 0, candidatos_procesados: 0, preseleccionados: 0, pendientes: 0 };
    VACANTES.push(nv);
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante clonada', descripcion: `Vacante clonada como ${nv.codigo}`, entidad: nv.codigo, estado_anterior: '-', estado_nuevo: 'Clonada' });
    closeModal(); showToast(`Vacante clonada: ${nv.codigo}`, 'success'); navigateTo('vacantes');
}

function toggleDisponibilidad(id) {
    const v = VACANTES.find(vac => vac.id === id);
    const ant = v.disponibilidad;
    v.disponibilidad = ant === 'Disponible' ? 'No disponible' : 'Disponible';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: v.disponibilidad==='Disponible'?'Cargo disponible':'Cargo no disponible', descripcion: `Cargo "${v.nombre}" marcado como ${v.disponibilidad}`, entidad: v.codigo, estado_anterior: ant, estado_nuevo: v.disponibilidad });
    closeModal(); showToast(`Cargo: "${v.disponibilidad}"`, 'success'); navigateTo('vacantes');
}

function cambiarEstadoVacante(id) {
    const v = VACANTES.find(vac => vac.id === id);
    openModal(`
        <div class="modal-header"><h3>Cambiar Estado - ${v.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="form-group"><label>Estado actual: <span class="badge ${getEstadoBadge(v.estado)}">${v.estado}</span></label></div>
            <div class="form-group"><label>Nuevo estado</label><select id="cev-estado">${ESTADOS_VACANTE.map(e=>`<option ${e===v.estado?'selected':''}>${e}</option>`).join('')}</select></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="guardarEstadoVacante(${v.id})">Guardar</button></div>
    `);
}

function guardarEstadoVacante(id) {
    const v = VACANTES.find(vac => vac.id === id); const ant = v.estado;
    v.estado = document.getElementById('cev-estado').value;
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Cambio de estado', descripcion: `Vacante: "${ant}" → "${v.estado}"`, entidad: v.codigo, estado_anterior: ant, estado_nuevo: v.estado });
    closeModal(); showToast('Estado actualizado', 'success'); navigateTo('vacantes');
}

// ============ VER CANDIDATOS DE VACANTE ============
function getCumpleRequisitos(score) {
    return Math.min(100, Math.max(10, Math.round(score * 0.95 + (Math.random() * 5 - 2))));
}

function getPuntosMejora(score) {
    if (score >= 90) return 'Sin brechas significativas';
    if (score >= 75) return 'Reforzar certificaciones';
    if (score >= 60) return 'Experiencia insuficiente en área clave';
    if (score >= 40) return 'Formación y habilidades técnicas por desarrollar';
    return 'Perfil no alineado al puesto';
}

function verCandidatosVacante(vacanteId) {
    const vacante = VACANTES.find(v => v.id === vacanteId);
    const plantilla = PLANTILLAS.find(p => p.id === vacante.plantilla_id);
    const todos = CANDIDATOS.filter(c => c.vacante_id === vacanteId && c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
    const historicos = todos.filter(c => c.es_historico);
    const nuevos = todos.filter(c => !c.es_historico);
    openModal(`
        <div class="modal-header"><h3>Candidatos - ${vacante.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div style="margin-bottom:16px;padding:12px;background:var(--gray-50);border-radius:8px;display:flex;gap:16px;flex-wrap:wrap;align-items:center">
                <div><strong>Vacante:</strong> ${vacante.codigo}</div>
                <div><strong>Estado:</strong> <span class="badge ${getEstadoBadge(vacante.estado)}">${vacante.estado}</span></div>
                <div><strong>Plantilla:</strong> ${plantilla?plantilla.nombre:'N/A'}</div>
                <div><strong>Total:</strong> ${todos.length}</div>
            </div>
            ${historicos.length?`<h4 style="margin-bottom:8px;color:var(--gray-600)"><i class="fas fa-history"></i> Históricos (${historicos.length})</h4>
            <div class="table-responsive"><table style="margin-bottom:16px;opacity:0.7"><thead><tr><th>Nombre</th><th>Score</th><th>Estado</th></tr></thead>
            <tbody>${historicos.sort((a,b)=>b.score-a.score).map(c=>`<tr><td>${c.nombre}</td><td><span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></td><td><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></td></tr>`).join('')}</tbody></table></div>`:''}
            <h4 style="margin-bottom:8px"><i class="fas fa-users"></i> Candidatos Activos (${nuevos.length})</h4>
            <div class="table-responsive"><table>
                <thead><tr><th>Nombre</th><th>Educación</th><th>Habilidades</th><th>Score</th><th>Cumple Requisitos</th><th>Puntos de Mejora</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>${nuevos.sort((a,b)=>b.score-a.score).map(c => {
                    const cumple = getCumpleRequisitos(c.score);
                    const mejora = getPuntosMejora(c.score);
                    return `<tr>
                        <td><strong>${c.nombre}</strong></td>
                        <td style="font-size:12px">${c.formacion}</td>
                        <td><div class="tags-container">${c.habilidades.slice(0,3).map(h=>`<span class="tag">${h}</span>`).join('')}</div></td>
                        <td><span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></td>
                        <td><span class="score-badge ${getScoreClass(cumple)}">${cumple}%</span></td>
                        <td style="font-size:11px;color:var(--gray-600)">${mejora}</td>
                        <td><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></td>
                        <td style="white-space:nowrap">
                            ${c.estado==='En entrevista'?`<span class="badge badge-blue"><i class="fas fa-check"></i> En entrevista</span> <button class="btn btn-sm btn-success" onclick="marcarContratadoVacante(${c.id},${vacanteId})" title="Marcar contratado"><i class="fas fa-trophy"></i></button>`:`<button class="btn btn-sm btn-primary" onclick="enviarPrimeraEntrevista(${c.id},${vacanteId})" title="1ra Entrevista"><i class="fas fa-user-tie"></i></button>`}
                            ${c.estado==='Contratado'?`<span class="badge badge-green"><i class="fas fa-trophy"></i> Contratado</span>`:''}
                            <button class="btn btn-sm btn-secondary" onclick="verDetalleCandidato(${c.id})" title="Ver"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>`;
                }).join('')}
                </tbody>
            </table></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
    `);
}

// ============ MARCAR CONTRATADO DESDE VACANTE ============
function marcarContratadoVacante(candidatoId, vacanteId) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    openModal(`
        <div class="modal-header"><h3><i class="fas fa-trophy" style="color:var(--green)"></i> Confirmar Contratación</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div style="padding:16px;background:var(--green-light);border-radius:8px;margin-bottom:16px">
                <p style="font-size:14px"><strong>${c.nombre}</strong> será marcado como <span class="badge badge-green">Contratado</span> para la vacante <strong>${vacante.nombre}</strong>.</p>
            </div>
            <div class="form-group">
                <label><strong>¿Desea cerrar la vacante y enviar los demás candidatos al pool?</strong></label>
                <select id="mc-cerrar-vacante">
                    <option value="si">Sí - Cerrar vacante y enviar candidatos activos al pool</option>
                    <option value="no">No - Solo marcar contratado, vacante sigue abierta</option>
                </select>
            </div>
            <div class="form-group">
                <label>Observaciones</label>
                <textarea id="mc-obs" placeholder="Fecha de ingreso, condiciones acordadas, etc."></textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="verCandidatosVacante(${vacanteId})">Cancelar</button>
            <button class="btn btn-success" onclick="confirmarContratacion(${c.id},${vacanteId})"><i class="fas fa-check"></i> Confirmar Contratación</button>
        </div>
    `);
}

function confirmarContratacion(candidatoId, vacanteId) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    const anterior = c.estado;
    c.estado = 'Contratado';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Contratación', descripcion: `${c.nombre} contratado para ${vacante.nombre}`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Contratado' });
    const cerrar = document.getElementById('mc-cerrar-vacante').value;
    if (cerrar === 'si') {
        vacante.estado = 'Finalizada'; vacante.disponibilidad = 'No disponible';
        const otrosActivos = CANDIDATOS.filter(ca => ca.vacante_id === vacanteId && ca.id !== candidatoId && !['Contratado','Dado de baja','Oculto','Descartado','En pool futuro'].includes(ca.estado));
        otrosActivos.forEach(ca => { ca.estado = 'En pool futuro'; ca.es_historico = true; });
        TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante cerrada', descripcion: `Vacante finalizada. ${otrosActivos.length} candidatos enviados al pool.`, entidad: vacante.codigo, estado_anterior: 'Abierta', estado_nuevo: 'Finalizada' });
        showToast(`${c.nombre} contratado. Vacante finalizada. ${otrosActivos.length} candidatos movidos al pool.`, 'success');
    } else {
        showToast(`${c.nombre} marcado como contratado.`, 'success');
    }
    closeModal(); navigateTo('vacantes');
}

// ============ PRIMERA ENTREVISTA - GUÍA DE PREGUNTAS ============
function enviarPrimeraEntrevista(candidatoId, vacanteId) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    const plantilla = PLANTILLAS.find(p => p.id === vacante.plantilla_id);
    
    let preguntasEntrevista = [];
    if (plantilla) {
        preguntasEntrevista.push(`¿Puede describir su experiencia en el área de ${plantilla.area.toLowerCase()}?`);
        preguntasEntrevista.push(`El puesto requiere mínimo ${plantilla.experiencia} años de experiencia. ¿Cumple con este requisito?`);
        if (plantilla.habilidades_requeridas.length > 0) preguntasEntrevista.push(`¿Qué nivel de dominio tiene en ${plantilla.habilidades_requeridas[0]}?`);
        if (plantilla.habilidades_requeridas.length > 1) preguntasEntrevista.push(`¿Ha utilizado ${plantilla.habilidades_requeridas[1]} en sus roles anteriores?`);
        if (plantilla.idiomas.length > 1) preguntasEntrevista.push(`¿Cuál es su nivel de ${plantilla.idiomas[1]}? ¿Puede sostener conversaciones?`);
        if (plantilla.preguntas_filtro) plantilla.preguntas_filtro.forEach(p => preguntasEntrevista.push(p));
        preguntasEntrevista.push('¿Cuál ha sido su mayor logro profesional en los últimos 2 años?');
        preguntasEntrevista.push('¿Por qué está interesado en esta posición?');
        preguntasEntrevista.push('¿Cuál es su expectativa salarial?');
        preguntasEntrevista.push('¿Cuál es su disponibilidad de incorporación?');
        preguntasEntrevista.push('¿Tiene alguna pregunta sobre la empresa o el puesto?');
    } else {
        preguntasEntrevista = ['¿Cuéntenos sobre su experiencia profesional?','¿Por qué le interesa este puesto?','¿Cuál es su disponibilidad?','¿Cuál es su expectativa salarial?'];
    }

    openModal(`
        <div class="modal-header"><h3><i class="fas fa-clipboard-list" style="color:var(--accent)"></i> Guía de Entrevista - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div style="margin-bottom:16px;padding:14px;background:linear-gradient(135deg,#f0f8ff,#e8f4fd);border-radius:8px;border:1px solid rgba(77,168,218,0.2)">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
                    <div><strong>Candidato:</strong> ${c.nombre}</div>
                    <div><strong>Score IA:</strong> <span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></div>
                    <div><strong>Vacante:</strong> ${vacante.nombre} (${vacante.codigo})</div>
                    <div><strong>Plantilla:</strong> ${plantilla?plantilla.nombre:'N/A'}</div>
                    <div><strong>Formación:</strong> ${c.formacion}</div>
                    <div><strong>Experiencia:</strong> ${c.experiencia_anios} años</div>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <h4 style="margin:0"><i class="fas fa-print"></i> Preguntas para la Primera Entrevista</h4>
                <button class="btn btn-sm btn-secondary" onclick="copiarPreguntas()" title="Copiar preguntas"><i class="fas fa-copy"></i> Copiar</button>
            </div>
            <p style="font-size:12px;color:var(--gray-600);margin-bottom:16px">Guía generada según el cargo "${vacante.nombre}" y la plantilla "${plantilla?plantilla.nombre:''}". Use estas preguntas como referencia durante la entrevista.</p>
            <div id="preguntas-entrevista-lista" style="background:var(--white);border:1px solid var(--gray-200);border-radius:8px;padding:20px">
                ${preguntasEntrevista.map((p, idx) => `
                <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px dashed var(--gray-200)">
                    <div style="font-weight:600;font-size:13px;color:var(--primary)">${idx+1}. ${p}</div>
                    <div style="margin-top:6px;color:var(--gray-400);font-size:12px;font-style:italic">Respuesta: _______________________________________________</div>
                </div>`).join('')}
            </div>
            <div style="margin-top:20px;padding:14px;background:var(--yellow-light);border-radius:8px;border:1px solid rgba(255,193,7,0.3)">
                <strong style="font-size:13px"><i class="fas fa-lightbulb"></i> Tips para el entrevistador:</strong>
                <ul style="margin-top:8px;padding-left:20px;font-size:12px;color:var(--gray-700)">
                    <li>Observe puntualidad, presentación y actitud del candidato</li>
                    <li>Valide la información del CV durante la conversación</li>
                    <li>Profundice en las brechas identificadas por la IA (score: ${c.score}%)</li>
                    ${c.score<75?'<li style="color:var(--red)">⚠️ Score bajo - valide motivación y competencias transferibles</li>':''}
                    <li>Registre observaciones clave para compartir con el equipo</li>
                </ul>
            </div>
            <div class="form-group" style="margin-top:20px">
                <label><strong><i class="fas fa-envelope"></i> Enviar cuestionario por correo</strong></label>
                <input type="email" id="entrevista-email" placeholder="correo@ejemplo.com" value="${c.correo}">
                <p style="font-size:11px;color:var(--gray-500);margin-top:4px">Se enviará el cuestionario de entrevista al correo indicado.</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="verCandidatosVacante(${vacanteId})"><i class="fas fa-arrow-left"></i> Volver</button>
            <button class="btn btn-primary" onclick="confirmarEnvioEntrevista(${c.id},${vacanteId})"><i class="fas fa-check"></i> Confirmar: Enviar a Primera Entrevista</button>
        </div>
    `);
}

function copiarPreguntas() {
    const container = document.getElementById('preguntas-entrevista-lista');
    const textos = container.querySelectorAll('div[style*="font-weight:600"]');
    let texto = 'GUÍA DE PREGUNTAS - PRIMERA ENTREVISTA\n\n';
    textos.forEach(t => { texto += t.textContent + '\nRespuesta: \n\n'; });
    navigator.clipboard.writeText(texto).then(() => showToast('Preguntas copiadas al portapapeles', 'success')).catch(() => showToast('Use Ctrl+C para copiar manualmente', 'info'));
}

function confirmarEnvioEntrevista(candidatoId, vacanteId) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const emailField = document.getElementById('entrevista-email');
    const email = emailField ? emailField.value.trim() : '';
    const anterior = c.estado;
    c.estado = 'En entrevista';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Entrevista', descripcion: `Candidato enviado a primera entrevista`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'En entrevista' });
    if (email) {
        showToast(`Correo enviado a ${email} con el cuestionario de entrevista`, 'success');
    } else {
        showToast(`${c.nombre} marcado "En entrevista"`, 'success');
    }
    verCandidatosVacante(vacanteId);
}

// ============ NUEVA VACANTE CON BÚSQUEDA EN POOL Y PRECARGA ============
function openModalNuevaVacante() {
    openModal(`
        <div class="modal-header"><h3><i class="fas fa-plus-circle" style="color:var(--accent)"></i> Crear Nueva Vacante</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-sm btn-warning" onclick="precargarEjemplo()"><i class="fas fa-magic"></i> Precargar ejemplo</button>
                <span style="font-size:12px;color:var(--gray-500);align-self:center">Llena el formulario con datos de ejemplo para demostración</span>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-briefcase"></i> Información del Puesto</h4>
                <div class="form-row">
                    <div class="form-group"><label>Nombre del puesto *</label><input type="text" id="nv-nombre" placeholder="Ej: Analista de Datos Senior"></div>
                    <div class="form-group"><label>Código (auto)</label><input type="text" id="nv-codigo" value="VAC-2026-${String(VACANTES.length+1).padStart(3,'0')}" disabled></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Área *</label><select id="nv-area">${AREAS.map(a=>`<option>${a}</option>`).join('')}</select></div>
                    <div class="form-group"><label>País *</label><select id="nv-pais">${PAISES.map(p=>`<option>${p}</option>`).join('')}</select></div>
                </div>
                <div class="form-group"><label>Descripción del puesto</label><textarea id="nv-descripcion" rows="3" placeholder="Funciones y objetivo del puesto..."></textarea></div>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-user-tie"></i> Responsable y Configuración</h4>
                <div class="form-row">
                    <div class="form-group"><label>Reclutador *</label><select id="nv-reclutador"><option>Ana García</option><option>Carlos Méndez</option></select></div>
                    <div class="form-group"><label>Gerente solicitante</label><input type="text" id="nv-gerente" placeholder="Nombre del gerente"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Fecha apertura *</label><input type="date" id="nv-fecha" value="2026-07-01"></div>
                    <div class="form-group"><label>Fecha límite</label><input type="date" id="nv-fecha-cierre" value="2026-08-01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Posiciones</label><input type="number" id="nv-posiciones" value="1" min="1"></div>
                    <div class="form-group"><label>Prioridad</label><select id="nv-prioridad"><option>Alta</option><option selected>Media</option><option>Baja</option></select></div>
                </div>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-file-alt"></i> Plantilla y Requisitos</h4>
                <div class="form-row">
                    <div class="form-group"><label>Plantilla *</label><select id="nv-plantilla" onchange="previsualizarPlantilla();buscarEnPool()">${PLANTILLAS.map(p=>`<option value="${p.id}">${p.nombre} (${p.area})</option>`).join('')}</select></div>
                    <div class="form-group"><label>Estado inicial</label><select id="nv-estado"><option selected>Abierta</option><option>En evaluación</option><option>Disponible</option></select></div>
                </div>
                <div id="nv-plantilla-preview" class="ai-section" style="margin-top:12px">
                    <strong style="font-size:13px"><i class="fas fa-info-circle"></i> Plantilla seleccionada:</strong>
                    <div style="margin-top:8px;font-size:13px" id="nv-preview-content"></div>
                </div>
            </div>
            <div class="detail-section" id="nv-pool-section" style="display:none">
                <h4><i class="fas fa-database" style="color:var(--orange)"></i> Candidatos en Pool que se Adaptan al Perfil</h4>
                <p style="font-size:12px;color:var(--gray-600);margin-bottom:12px">Se encontraron candidatos inactivos en el pool que podrían ajustarse a esta vacante.</p>
                <div id="nv-pool-candidatos"></div>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-money-bill-wave"></i> Condiciones (Opcional)</h4>
                <div class="form-row">
                    <div class="form-group"><label>Salario mínimo</label><input type="text" id="nv-salario-min" placeholder="Ej: Q8,000"></div>
                    <div class="form-group"><label>Salario máximo</label><input type="text" id="nv-salario-max" placeholder="Ej: Q12,000"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Contrato</label><select id="nv-contrato"><option>Indefinido</option><option>Plazo fijo</option><option>Por proyecto</option><option>Temporal</option></select></div>
                    <div class="form-group"><label>Modalidad</label><select id="nv-modalidad"><option>Presencial</option><option>Híbrido</option><option>Remoto</option></select></div>
                </div>
                <div class="form-group"><label>Jornada</label><select id="nv-jornada"><option>Tiempo completo</option><option>Medio tiempo</option><option>Por turnos</option></select></div>
            </div>
            <div class="detail-section">
                <h4><i class="fas fa-comment-alt"></i> Observaciones</h4>
                <div class="form-group"><label>Notas internas</label><textarea id="nv-notas" rows="2" placeholder="Información adicional..."></textarea></div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarNuevaVacante()"><i class="fas fa-save"></i> Crear Vacante</button>
        </div>
    `);
    setTimeout(() => { previsualizarPlantilla(); buscarEnPool(); }, 100);
}

function precargarEjemplo() {
    document.getElementById('nv-nombre').value = 'Supervisor de Operaciones Logísticas';
    document.getElementById('nv-area').value = 'Logística';
    document.getElementById('nv-pais').value = 'Guatemala';
    document.getElementById('nv-descripcion').value = 'Supervisar operaciones de bodega, controlar inventarios y coordinar despachos. Responsable de un equipo de 12 personas en el centro de distribución principal.';
    document.getElementById('nv-reclutador').value = 'Ana García';
    document.getElementById('nv-gerente').value = 'Ing. Roberto Méndez';
    document.getElementById('nv-posiciones').value = '2';
    document.getElementById('nv-prioridad').value = 'Alta';
    document.getElementById('nv-salario-min').value = 'Q12,000';
    document.getElementById('nv-salario-max').value = 'Q18,000';
    document.getElementById('nv-contrato').value = 'Indefinido';
    document.getElementById('nv-modalidad').value = 'Presencial';
    document.getElementById('nv-jornada').value = 'Tiempo completo';
    document.getElementById('nv-notas').value = 'Urgente: posición por crecimiento. Se requiere experiencia en WMS. Reemplaza a supervisor que fue promovido.';
    showToast('Formulario precargado con datos de ejemplo', 'info');
}

function previsualizarPlantilla() {
    const plantillaId = parseInt(document.getElementById('nv-plantilla').value);
    const p = PLANTILLAS.find(pl => pl.id === plantillaId);
    const preview = document.getElementById('nv-preview-content');
    if (p && preview) {
        preview.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
                <div><strong>Nivel:</strong> ${p.nivel}</div>
                <div><strong>Experiencia:</strong> ${p.experiencia} años mín.</div>
                <div><strong>Formación:</strong> ${p.formacion}</div>
                <div><strong>Idiomas:</strong> ${p.idiomas.join(', ')}</div>
            </div>
            <div><strong>Habilidades:</strong> <span style="color:var(--accent)">${p.habilidades_requeridas.join(', ')}</span></div>
            ${p.certificaciones.length?`<div style="margin-top:4px"><strong>Certificaciones:</strong> ${p.certificaciones.join(', ')}</div>`:''}`;
    }
}

function buscarEnPool() {
    const plantillaId = parseInt(document.getElementById('nv-plantilla').value);
    const plantilla = PLANTILLAS.find(p => p.id === plantillaId);
    if (!plantilla) return;
    const enPool = CANDIDATOS.filter(c => c.estado === 'En pool futuro' || (c.es_historico && c.estado !== 'Contratado' && c.estado !== 'Dado de baja'));
    const coincidencias = enPool.filter(c => {
        const habsComunes = c.habilidades.filter(h => plantilla.habilidades_requeridas.some(r => h.toLowerCase().includes(r.toLowerCase().split(' ')[0])));
        const tieneExp = c.experiencia_anios >= plantilla.experiencia;
        return habsComunes.length >= 1 || tieneExp || c.score >= 60;
    }).slice(0, 8);
    const section = document.getElementById('nv-pool-section');
    const container = document.getElementById('nv-pool-candidatos');
    if (coincidencias.length > 0) {
        section.style.display = 'block';
        container.innerHTML = `
            <div class="table-responsive"><table>
                <thead><tr><th>Nombre</th><th>Score anterior</th><th>Experiencia</th><th>Habilidades</th><th>Estado</th></tr></thead>
                <tbody>${coincidencias.map(c => `
                    <tr>
                        <td><strong>${c.nombre}</strong><br><span style="font-size:11px;color:var(--gray-500)">${c.correo}</span></td>
                        <td><span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></td>
                        <td>${c.experiencia_anios} años</td>
                        <td><div class="tags-container">${c.habilidades.slice(0,3).map(h=>`<span class="tag">${h}</span>`).join('')}</div></td>
                        <td><span class="badge badge-orange">Pool</span></td>
                    </tr>`).join('')}
                </tbody>
            </table></div>
            <p style="margin-top:8px;font-size:12px;color:var(--gray-600)"><i class="fas fa-info-circle"></i> Estos candidatos podrán ser asociados a la nueva vacante desde el módulo Pool después de crearla.</p>`;
    } else {
        section.style.display = 'none';
    }
}

function guardarNuevaVacante() {
    const nombre = document.getElementById('nv-nombre').value;
    if (!nombre) { showToast('El nombre del puesto es obligatorio', 'error'); return; }
    const nv = {
        id: VACANTES.length+1, codigo: `VAC-2026-${String(VACANTES.length+1).padStart(3,'0')}`, nombre,
        area: document.getElementById('nv-area').value, pais: document.getElementById('nv-pais').value,
        reclutador: document.getElementById('nv-reclutador').value,
        fecha_apertura: document.getElementById('nv-fecha').value,
        estado: document.getElementById('nv-estado').value, disponibilidad: 'Disponible',
        plantilla_id: parseInt(document.getElementById('nv-plantilla').value),
        candidatos_recibidos: 0, candidatos_procesados: 0, preseleccionados: 0, pendientes: 0
    };
    VACANTES.push(nv);
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Cambio de estado', descripcion: `Vacante "${nombre}" creada`, entidad: nv.codigo, estado_anterior: '-', estado_nuevo: nv.estado });
    closeModal(); showToast('Vacante creada exitosamente', 'success'); navigateTo('vacantes');
}

function ejecutarAnalisisIA(vacanteId) {
    const vacante = VACANTES.find(v => v.id === vacanteId);
    showToast(`Ejecutando análisis IA para "${vacante.nombre}"...`, 'info');
    setTimeout(() => {
        showToast(`Análisis IA completado. ${vacante.candidatos_recibidos} candidatos procesados.`, 'success');
        TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: 'Sistema', tipo: 'IA', descripcion: `IA procesó candidatos de ${vacante.nombre}`, entidad: vacante.codigo, estado_anterior: '-', estado_nuevo: 'Procesado' });
    }, 1500);
}
