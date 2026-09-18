function renderCandidatos() {
    return `
    <div class="filters-bar">
        <div class="filter-group">
            <label>Vacante</label>
            <select id="fc-vacante" onchange="filtrarCandidatos()">
                <option value="">Todas</option>${VACANTES.map(v=>`<option value="${v.id}">${v.nombre}</option>`).join('')}
            </select>
        </div>
        <div class="filter-group">
            <label>Estado</label>
            <select id="fc-estado" onchange="filtrarCandidatos()">
                <option value="">Todos (activos)</option>${ESTADOS_CANDIDATO.map(e=>`<option>${e}</option>`).join('')}
            </select>
        </div>
        <div class="filter-group">
            <label>Entrevista</label>
            <select id="fc-entrevista" onchange="filtrarCandidatos()">
                <option value="">Todos</option>
                <option value="En entrevista">En entrevista</option>
                <option value="No está en entrevista">No está en entrevista</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Fuente</label>
            <select id="fc-fuente" onchange="filtrarCandidatos()">
                <option value="">Todas</option>${FUENTES.map(f=>`<option>${f}</option>`).join('')}
            </select>
        </div>
        <div class="filter-group">
            <label>Score mínimo</label>
            <input type="number" id="fc-score" min="0" max="100" placeholder="0" onchange="filtrarCandidatos()">
        </div>
        <div class="filter-group">
            <label>Buscar</label>
            <input type="text" id="fc-buscar" placeholder="Nombre o correo" oninput="filtrarCandidatos()">
        </div>
        <div class="filter-group">
            <label>Mostrar</label>
            <select id="fc-visibilidad" onchange="filtrarCandidatos()">
                <option value="activos">Solo activos</option>
                <option value="ocultos">Ver ocultos</option>
                <option value="baja">Ver dados de baja</option>
                <option value="todos">Todos</option>
            </select>
        </div>
    </div>
    <div class="table-container">
        <div class="table-header">
            <h3>Bandeja de Candidatos</h3>
            <span id="candidatos-count">${CANDIDATOS.filter(c=>c.estado!=='Dado de baja'&&c.estado!=='Oculto').length} candidatos</span>
        </div>
        <div class="table-responsive">
            <table>
                <thead><tr><th>Nombre</th><th>Vacante</th><th>Fuente</th><th>Score IA</th><th>Recomendación</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody id="tabla-candidatos">${renderTablaCandidatos(CANDIDATOS.filter(c=>c.estado!=='Dado de baja'&&c.estado!=='Oculto'))}</tbody>
            </table>
        </div>
    </div>`;
}

function renderTablaCandidatos(lista) {
    return lista.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong><br><span style="font-size:11px;color:var(--gray-500)">${c.correo}</span></td>
            <td>${c.vacante_nombre}</td>
            <td>${c.fuente}</td>
            <td><span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></td>
            <td><span style="font-size:12px">${c.recomendacion}</span></td>
            <td><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalleCandidato(${c.id})" title="Ver detalle"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-secondary" onclick="menuAccionesCandidato(${c.id})" title="Acciones"><i class="fas fa-ellipsis-v"></i></button>
            </td>
        </tr>`).join('');
}

function filtrarCandidatos() {
    let filtered = [...CANDIDATOS];
    const vacante = document.getElementById('fc-vacante').value;
    const estado = document.getElementById('fc-estado').value;
    const entrevista = document.getElementById('fc-entrevista').value;
    const fuente = document.getElementById('fc-fuente').value;
    const scoreMin = parseInt(document.getElementById('fc-score').value) || 0;
    const buscar = document.getElementById('fc-buscar').value.toLowerCase();
    const visibilidad = document.getElementById('fc-visibilidad').value;

    if (visibilidad === 'activos') filtered = filtered.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
    else if (visibilidad === 'ocultos') filtered = filtered.filter(c => c.estado === 'Oculto');
    else if (visibilidad === 'baja') filtered = filtered.filter(c => c.estado === 'Dado de baja');

    if (vacante) filtered = filtered.filter(c => c.vacante_id === parseInt(vacante));
    if (estado) filtered = filtered.filter(c => c.estado === estado);
    if (entrevista) filtered = filtered.filter(c => c.estado === entrevista);
    if (fuente) filtered = filtered.filter(c => c.fuente === fuente);
    if (scoreMin) filtered = filtered.filter(c => c.score >= scoreMin);
    if (buscar) filtered = filtered.filter(c => c.nombre.toLowerCase().includes(buscar) || c.correo.toLowerCase().includes(buscar));

    document.getElementById('tabla-candidatos').innerHTML = renderTablaCandidatos(filtered);
    document.getElementById('candidatos-count').textContent = `${filtered.length} candidatos`;
}

function menuAccionesCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    openModal(`
        <div class="modal-header"><h3>Acciones - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <p style="margin-bottom:16px">Estado actual: <span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span> | Score: <span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></p>
            <div class="config-grid" style="grid-template-columns:1fr 1fr">
                <div class="config-card"><h4><i class="fas fa-check-circle" style="color:var(--green)"></i> Seleccionar</h4><p>Marcar candidato como seleccionado para avanzar en el proceso.</p><button class="btn btn-sm btn-success" onclick="seleccionarCandidato(${c.id})">Seleccionar</button></div>
                <div class="config-card"><h4><i class="fas fa-times-circle" style="color:var(--red)"></i> Descartar</h4><p>Descartar candidato con razón documentada.</p><button class="btn btn-sm btn-danger" onclick="descartarCandidato(${c.id})">Descartar</button></div>
                <div class="config-card"><h4><i class="fas fa-user-tie" style="color:var(--blue)"></i> Enviar a Entrevista</h4><p>Marcar candidato como en proceso de entrevista.</p><button class="btn btn-sm btn-primary" onclick="enviarEntrevista(${c.id})">Entrevista</button></div>
                <div class="config-card"><h4><i class="fas fa-trophy" style="color:var(--green)"></i> Marcar Contratado</h4><p>Registrar que el candidato fue contratado.</p><button class="btn btn-sm btn-success" onclick="marcarContratado(${c.id})">Contratado</button></div>
                <div class="config-card"><h4><i class="fas fa-exchange-alt" style="color:var(--gray-600)"></i> Cambiar Estado</h4><p>Cambiar estado manualmente.</p><button class="btn btn-sm btn-secondary" onclick="cambiarEstadoCandidato(${c.id})">Cambiar</button></div>
                <div class="config-card"><h4><i class="fas fa-database" style="color:var(--orange)"></i> Enviar a Pool</h4><p>Mover al pool de candidatos futuros.</p><button class="btn btn-sm btn-warning" onclick="enviarAPool(${c.id})">Pool</button></div>
                <div class="config-card"><h4><i class="fas fa-user-slash" style="color:var(--red)"></i> Dar de Baja</h4><p>Remover de la bandeja sin eliminar del sistema.</p><button class="btn btn-sm btn-danger" onclick="darDeBaja(${c.id})">Baja</button></div>
                <div class="config-card"><h4><i class="fas fa-eye-slash" style="color:var(--gray-500)"></i> Ocultar</h4><p>Ocultar de vistas operativas. Recuperable con filtros.</p><button class="btn btn-sm btn-secondary" onclick="ocultarCandidato(${c.id})">Ocultar</button></div>
            </div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
    `);
}

function seleccionarCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = 'Seleccionado';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Selección', descripcion: `Candidato seleccionado para avanzar en proceso`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Seleccionado' });
    closeModal(); showToast(`${c.nombre} seleccionado exitosamente`, 'success'); navigateTo('candidatos');
}

function descartarCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    openModal(`
        <div class="modal-header"><h3>Descartar - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="form-group"><label>Razón del descarte</label><select id="desc-razon">${RAZONES_DESCARTE.map(r=>`<option>${r}</option>`).join('')}</select></div>
            <div class="form-group"><label>Observación adicional</label><textarea id="desc-obs" placeholder="Detalles adicionales..."></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="confirmarDescarte(${c.id})">Confirmar Descarte</button></div>
    `);
}

function confirmarDescarte(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    const razon = document.getElementById('desc-razon').value;
    c.estado = 'Descartado';
    c.razon_descarte = razon;
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Descarte', descripcion: `Candidato descartado - ${razon}`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Descartado' });
    closeModal(); showToast(`${c.nombre} descartado`, 'success'); navigateTo('candidatos');
}

function enviarEntrevista(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = 'En entrevista';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Entrevista', descripcion: `Candidato enviado a entrevista`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'En entrevista' });
    closeModal(); showToast(`${c.nombre} enviado a entrevista`, 'success'); navigateTo('candidatos');
}

function marcarContratado(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = 'Contratado';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Contratación', descripcion: `Candidato marcado como contratado`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Contratado' });
    // Preguntar si finalizar vacante
    closeModal();
    showToast(`${c.nombre} marcado como contratado`, 'success');
    setTimeout(() => {
        if (confirm(`¿Desea marcar la vacante "${c.vacante_nombre}" como Finalizada?`)) {
            const vac = VACANTES.find(v => v.id === c.vacante_id);
            if (vac) { vac.estado = 'Finalizada'; vac.disponibilidad = 'No disponible'; }
            TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Vacante cerrada', descripcion: `Vacante finalizada por contratación`, entidad: vac.codigo, estado_anterior: 'Abierta', estado_nuevo: 'Finalizada' });
            showToast(`Vacante "${c.vacante_nombre}" finalizada`, 'info');
        }
        navigateTo('candidatos');
    }, 300);
}

function cambiarEstadoCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    openModal(`
        <div class="modal-header"><h3>Cambiar Estado - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="form-group"><label>Estado actual: <span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></label></div>
            <div class="form-group"><label>Nuevo estado</label><select id="ce-estado">${ESTADOS_CANDIDATO.map(e=>`<option ${e===c.estado?'selected':''}>${e}</option>`).join('')}</select></div>
            <div class="form-group"><label>Observación</label><textarea id="ce-obs" placeholder="Observación opcional..."></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="guardarCambioEstado(${c.id})">Guardar</button></div>
    `);
}

function guardarCambioEstado(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = document.getElementById('ce-estado').value;
    const obs = document.getElementById('ce-obs').value;
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Cambio de estado', descripcion: `Estado cambiado de "${anterior}" a "${c.estado}"${obs ? '. Obs: '+obs : ''}`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: c.estado });
    closeModal(); showToast(`Estado de ${c.nombre} actualizado`, 'success'); navigateTo('candidatos');
}

function enviarAPool(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = 'En pool futuro';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Pool', descripcion: `Candidato enviado a pool futuro`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'En pool futuro' });
    closeModal(); showToast(`${c.nombre} enviado al Pool`, 'success'); navigateTo('candidatos');
}

function darDeBaja(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    openModal(`
        <div class="modal-header"><h3>Dar de Baja - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="form-group"><label>Razón de baja</label><select id="baja-razon">${RAZONES_BAJA.map(r=>`<option>${r}</option>`).join('')}</select></div>
            <div class="form-group"><label>Observación</label><textarea id="baja-obs" placeholder="Detalles..."></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="confirmarBaja(${c.id})">Confirmar Baja</button></div>
    `);
}

function confirmarBaja(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    const razon = document.getElementById('baja-razon').value;
    c.estado = 'Dado de baja';
    c.razon_baja = razon;
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Baja', descripcion: `Candidato dado de baja - ${razon}`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Dado de baja' });
    closeModal(); showToast(`${c.nombre} dado de baja`, 'success'); navigateTo('candidatos');
}

function ocultarCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const anterior = c.estado;
    c.estado = 'Oculto';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Ocultar', descripcion: `Candidato ocultado de vistas operativas`, entidad: c.nombre, estado_anterior: anterior, estado_nuevo: 'Oculto' });
    closeModal(); showToast(`${c.nombre} ocultado`, 'info'); navigateTo('candidatos');
}

function verDetalleCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const obs = generarObservacionIA(c);
    // Generar evaluación de primer filtro si no existe
    if (!c.evaluacion_filtro) { c.evaluacion_filtro = evaluarPrimerFiltro(c); }
    const ef = c.evaluacion_filtro;

    openModal(`
        <div class="modal-header"><h3>Detalle del Candidato</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Datos Personales</h4>
                <div class="detail-grid">
                    <div class="detail-item"><div class="label">Nombre</div><div class="value">${c.nombre}</div></div>
                    <div class="detail-item"><div class="label">Correo</div><div class="value">${c.correo}</div></div>
                    <div class="detail-item"><div class="label">Teléfono</div><div class="value">${c.telefono}</div></div>
                    <div class="detail-item"><div class="label">Ubicación</div><div class="value">${c.ubicacion}</div></div>
                    <div class="detail-item"><div class="label">Vacante</div><div class="value">${c.vacante_nombre}</div></div>
                    <div class="detail-item"><div class="label">Estado</div><div class="value"><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></div></div>
                </div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-file-alt"></i> Información Extraída del CV</h4>
                <div class="detail-grid">
                    <div class="detail-item"><div class="label">Formación</div><div class="value">${c.formacion}</div></div>
                    <div class="detail-item"><div class="label">Experiencia</div><div class="value">${c.experiencia_anios} años</div></div>
                    <div class="detail-item"><div class="label">Última experiencia</div><div class="value">${c.ultima_experiencia}</div></div>
                    <div class="detail-item"><div class="label">Empresas</div><div class="value">${c.empresas_anteriores.join(', ')}</div></div>
                </div>
                <div style="margin-top:12px"><div class="label" style="margin-bottom:6px">Habilidades técnicas</div><div class="tags-container">${c.habilidades.map(h=>`<span class="tag">${h}</span>`).join('')}</div></div>
                <div style="margin-top:10px"><div class="label" style="margin-bottom:6px">Habilidades blandas</div><div class="tags-container">${c.habilidades_blandas.map(h=>`<span class="tag" style="background:rgba(40,167,69,0.1);color:#28a745">${h}</span>`).join('')}</div></div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-robot"></i> Análisis IA - Score: ${c.score}%</h4>
                <div class="ai-section">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
                        <div class="ai-score">${c.score}%</div>
                        <div><div style="font-weight:600;font-size:16px">${c.recomendacion}</div><div style="color:var(--gray-600);font-size:13px">Ajuste al perfil</div></div>
                    </div>
                    <div class="ai-recommendation">${obs.explicacion}</div>
                    <div class="ai-strengths"><strong style="font-size:13px">Fortalezas:</strong>${obs.fortalezas.map(f=>`<div class="ai-strength-item"><i class="fas fa-check-circle"></i>${f}</div>`).join('')}</div>
                    <div style="margin-top:10px"><strong style="font-size:13px">Brechas:</strong>${obs.brechas.map(b=>`<div class="ai-strength-item"><i class="fas fa-exclamation-circle" style="color:var(--yellow)"></i>${b}</div>`).join('')}</div>
                    ${obs.alertas.length?`<div class="ai-alerts" style="margin-top:10px"><strong style="font-size:13px">Alertas:</strong>${obs.alertas.map(a=>`<div class="ai-alert-item"><i class="fas fa-exclamation-triangle"></i>${a}</div>`).join('')}</div>`:''}
                </div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-clipboard-check"></i> Evaluación Primer Filtro - Score: ${ef.totalScore}%</h4>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Criterio</th><th>Peso</th><th>Resultado</th><th>Puntaje</th><th>Obs. IA</th></tr></thead>
                        <tbody>${ef.evaluacion.map(e=>`<tr><td><strong>${e.criterio}</strong><br><span style="font-size:11px;color:var(--gray-500)">${e.pregunta}</span></td><td>${e.peso}%</td><td><span class="badge ${e.resultado==='Cumple'?'badge-green':e.resultado==='Cumple parcialmente'?'badge-yellow':e.resultado==='No identificado'?'badge-orange':'badge-red'}">${e.resultado}</span></td><td>${e.puntaje}</td><td style="font-size:12px">${e.observacion_ia}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
                <div style="margin-top:12px;padding:12px;background:var(--gray-50);border-radius:8px"><strong>Score del primer filtro: ${ef.totalScore}%</strong></div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-comments"></i> Revisión Conversacional con IA</h4>
                <div class="chat-ia-container" id="chat-ia-${c.id}">
                    <div class="chat-ia-messages" id="chat-messages-${c.id}">
                        <div class="chat-msg-ia"><i class="fas fa-robot"></i> Hola, soy el asistente IA. Puedes preguntarme sobre el perfil de ${c.nombre}. Selecciona una pregunta o escribe la tuya.</div>
                    </div>
                    <div class="chat-ia-preguntas">
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'porcentaje')">¿Por qué este porcentaje?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'requisitos_cumple')">¿Qué requisitos cumple?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'requisitos_no')">¿Qué no se identificó?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'revision_manual')">¿Por qué revisar manualmente?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'otra_vacante')">¿Aplica a otra vacante?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'alertas')">¿Qué alertas considerar?</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'preguntas_entrevista')">Preguntas para entrevista</button>
                        <button class="btn btn-sm btn-secondary" onclick="preguntarIA(${c.id},'resumen_ejecutivo')">Resumen ejecutivo</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            <button class="btn btn-success btn-sm" onclick="seleccionarCandidato(${c.id})"><i class="fas fa-check"></i> Seleccionar</button>
            <button class="btn btn-danger btn-sm" onclick="descartarCandidato(${c.id})"><i class="fas fa-times"></i> Descartar</button>
            <button class="btn btn-primary btn-sm" onclick="enviarEntrevista(${c.id})"><i class="fas fa-user-tie"></i> Entrevista</button>
        </div>
    `);
}

function preguntarIA(candidatoId, tipo) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const container = document.getElementById(`chat-messages-${candidatoId}`);
    const preguntasMap = {
        porcentaje: '¿Por qué este candidato tiene este porcentaje?',
        requisitos_cumple: '¿Qué requisitos cumple?',
        requisitos_no: '¿Qué requisitos no se identificaron?',
        revision_manual: '¿Por qué fue marcado como revisar manualmente?',
        otra_vacante: '¿Este candidato podría aplicar a otra vacante?',
        alertas: '¿Qué alertas debo considerar?',
        preguntas_entrevista: '¿Qué preguntas puedo hacerle en entrevista?',
        resumen_ejecutivo: '¿Cuál es el resumen ejecutivo del candidato?'
    };
    // Agregar pregunta del usuario
    container.innerHTML += `<div class="chat-msg-user"><i class="fas fa-user"></i> ${preguntasMap[tipo]}</div>`;
    // Agregar respuesta IA
    const respuesta = RESPUESTAS_IA[tipo](c);
    container.innerHTML += `<div class="chat-msg-ia"><i class="fas fa-robot"></i> ${respuesta.replace(/\n/g,'<br>')}</div>`;
    container.scrollTop = container.scrollHeight;
    // Registrar en trazabilidad
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Consulta IA', descripcion: `Consulta conversacional: "${preguntasMap[tipo]}"`, entidad: c.nombre, estado_anterior: '-', estado_nuevo: '-' });
}

// ====== CENTRALIZACIÓN DE CVS ======
function renderCentralizacion() {
    return `
    <div class="centralizacion-grid">
        <div class="source-block">
            <div class="source-block-header">
                <h3><i class="fas fa-plug" style="color:var(--accent)"></i> API Externa</h3>
                <span class="badge badge-green"><span class="status-dot green"></span> Conectado</span>
            </div>
            <div class="source-block-body">
                <div class="source-stats">
                    <div class="source-stat"><div class="stat-value">Activa</div><div class="stat-label">Estado</div></div>
                    <div class="source-stat"><div class="stat-value">Hoy 08:00</div><div class="stat-label">Última sync</div></div>
                    <div class="source-stat"><div class="stat-value">${CANDIDATOS.filter(c=>c.fuente==='API externa').length}</div><div class="stat-label">Importados</div></div>
                    <div class="source-stat"><div class="stat-value">1</div><div class="stat-label">Errores</div></div>
                </div>
                <button class="btn btn-primary" id="btn-sync" onclick="sincronizarAPI()"><i class="fas fa-sync-alt"></i> Sincronizar Candidatos</button>
            </div>
        </div>
        <div class="source-block">
            <div class="source-block-header">
                <h3><i class="fas fa-envelope" style="color:var(--green)"></i> Correo Electrónico</h3>
                <span class="badge badge-green"><span class="status-dot green"></span> Activo</span>
            </div>
            <div class="source-block-body">
                <div class="table-responsive"><table><thead><tr><th>Remitente</th><th>Asunto</th><th>Fecha</th><th>Vacante</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${CORREOS_SIMULADOS.map(c=>`<tr><td>${c.remitente}</td><td>${c.asunto}</td><td>${c.fecha}</td><td>${c.vacante_detectada}</td><td><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></td><td>${c.estado==='Pendiente'?`<button class="btn btn-sm btn-success" onclick="procesarCorreo(${c.id})"><i class="fas fa-cog"></i></button>`:'-'}</td></tr>`).join('')}</tbody></table></div>
            </div>
        </div>
        <div class="source-block">
            <div class="source-block-header"><h3><i class="fas fa-upload" style="color:var(--purple)"></i> Carga Manual</h3></div>
            <div class="source-block-body">
                <div class="form-row">
                    <div class="form-group"><label>Nombre</label><input type="text" id="cm-nombre" placeholder="Nombre completo"></div>
                    <div class="form-group"><label>Correo</label><input type="email" id="cm-correo" placeholder="correo@ejemplo.com"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Teléfono</label><input type="text" id="cm-telefono" placeholder="+502 0000-0000"></div>
                    <div class="form-group"><label>Vacante</label><select id="cm-vacante">${VACANTES.filter(v=>v.disponibilidad==='Disponible').map(v=>`<option value="${v.id}">${v.nombre}</option>`).join('')}</select></div>
                </div>
                <div class="form-group"><label>Archivo CV</label><input type="file" id="cm-cv" accept=".pdf,.docx"></div>
                <div class="form-group"><label>Observación</label><textarea id="cm-obs" placeholder="Notas..."></textarea></div>
                <button class="btn btn-primary" onclick="cargarManual()"><i class="fas fa-save"></i> Guardar Candidato</button>
            </div>
        </div>
    </div>`;
}

function sincronizarAPI() {
    const btn = document.getElementById('btn-sync');
    btn.innerHTML = '<span class="loader"></span> Sincronizando...'; btn.disabled = true;
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            CANDIDATOS.push({ id: CANDIDATOS.length+1, nombre: ['Patricia Flores','Luis Menéndez','Karen Villatoro'][i], correo: ['patricia.flores','luis.menendez','karen.villatoro'][i]+'@email.com', telefono: '+502 5555-0000', vacante_id: (i%5)+1, vacante_nombre: VACANTES[i%5].nombre, fuente: 'API externa', fecha_recepcion: '2026-07-01', score: [78,65,82][i], recomendacion: [78,65,82][i]>=75?'Recomendado':'Revisar manualmente', estado: 'Nuevo', formacion: FORMACIONES[i], experiencia_anios: 3, habilidades: HABILIDADES_POOL.slice(i*3,i*3+4), habilidades_blandas: ['Trabajo en equipo'], certificaciones: [], idiomas: ['Español'], empresas_anteriores: [EMPRESAS[i]], puestos_anteriores: 'Analista', ubicacion: PAISES[i], resumen: 'Profesional con experiencia.', ultima_experiencia: 'Analista en empresa', es_historico: false, razon_descarte: null, razon_baja: null, evaluacion_filtro: null });
        }
        TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: 'Sistema', tipo: 'Importación', descripcion: '3 candidatos importados desde API externa', entidad: 'API Externa', estado_anterior: '-', estado_nuevo: 'Importado' });
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Sincronizar Candidatos'; btn.disabled = false;
        showToast('3 candidatos importados correctamente', 'success');
    }, 2000);
}

function procesarCorreo(id) {
    const correo = CORREOS_SIMULADOS.find(c => c.id === id);
    correo.estado = 'Procesado';
    CANDIDATOS.push({ id: CANDIDATOS.length+1, nombre: correo.remitente.split('@')[0].replace(/\./g,' '), correo: correo.remitente, telefono: '+502 0000-0000', vacante_id: 1, vacante_nombre: correo.vacante_detectada, fuente: 'Correo electrónico', fecha_recepcion: correo.fecha, score: Math.floor(50+Math.random()*40), recomendacion: 'Revisar manualmente', estado: 'Nuevo', formacion: 'Por verificar', experiencia_anios: 0, habilidades: ['Por evaluar'], habilidades_blandas: ['Por evaluar'], certificaciones: [], idiomas: ['Español'], empresas_anteriores: ['Por verificar'], puestos_anteriores: 'Por verificar', ubicacion: 'Guatemala', resumen: 'CV recibido por correo.', ultima_experiencia: 'Por verificar', es_historico: false, razon_descarte: null, razon_baja: null, evaluacion_filtro: null });
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: 'Sistema', tipo: 'Correo', descripcion: `Correo procesado de ${correo.remitente}`, entidad: correo.remitente, estado_anterior: 'Pendiente', estado_nuevo: 'Procesado' });
    showToast(`Correo procesado exitosamente`, 'success'); navigateTo('centralizacion');
}

function cargarManual() {
    const nombre = document.getElementById('cm-nombre').value || 'Candidato Manual';
    const correo = document.getElementById('cm-correo').value || 'manual@email.com';
    const vacanteId = parseInt(document.getElementById('cm-vacante').value);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    CANDIDATOS.push({ id: CANDIDATOS.length+1, nombre, correo, telefono: document.getElementById('cm-telefono').value||'+502 0000-0000', vacante_id: vacanteId, vacante_nombre: vacante.nombre, fuente: 'Carga manual', fecha_recepcion: '2026-07-01', score: Math.floor(40+Math.random()*50), recomendacion: 'Pendiente de análisis', estado: 'Nuevo', formacion: 'Por verificar', experiencia_anios: 0, habilidades: ['Por evaluar'], habilidades_blandas: ['Por evaluar'], certificaciones: [], idiomas: ['Español'], empresas_anteriores: ['Por verificar'], puestos_anteriores: 'Por verificar', ubicacion: 'Guatemala', resumen: 'Candidato cargado manualmente.', ultima_experiencia: 'Por verificar', es_historico: false, razon_descarte: null, razon_baja: null, evaluacion_filtro: null });
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Carga manual', descripcion: `Candidato "${nombre}" cargado manualmente`, entidad: nombre, estado_anterior: '-', estado_nuevo: 'Nuevo' });
    showToast(`Candidato "${nombre}" cargado exitosamente`, 'success'); navigateTo('centralizacion');
}
