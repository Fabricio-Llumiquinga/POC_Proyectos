function renderPool() {
    const poolCandidatos = CANDIDATOS.filter(c => c.estado === 'En pool futuro' || c.estado === 'Descartado');
    return `
    <div class="filters-bar">
        <div class="filter-group"><label>Nombre</label><input type="text" id="fp-nombre" placeholder="Buscar..." oninput="filtrarPool()"></div>
        <div class="filter-group"><label>Habilidad</label><select id="fp-habilidad" onchange="filtrarPool()"><option value="">Todas</option>${HABILIDADES_POOL.map(h=>`<option>${h}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Score mínimo</label><input type="number" id="fp-score" placeholder="0" min="0" max="100" onchange="filtrarPool()"></div>
        <div class="filter-group"><label>Formación</label><select id="fp-formacion" onchange="filtrarPool()"><option value="">Todas</option>${FORMACIONES.map(f=>`<option>${f}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Fuente</label><select id="fp-fuente" onchange="filtrarPool()"><option value="">Todas</option>${FUENTES.map(f=>`<option>${f}</option>`).join('')}</select></div>
    </div>
    <div class="table-container">
        <div class="table-header"><h3>Pool de Candidatos</h3><span id="pool-count">${poolCandidatos.length} candidatos</span></div>
        <div class="table-responsive">
            <table>
                <thead><tr><th>Nombre</th><th>Última vacante</th><th>Score</th><th>Recomendación</th><th>Estado</th><th>Habilidades</th><th>Acciones</th></tr></thead>
                <tbody id="tabla-pool">${renderTablaPool(poolCandidatos)}</tbody>
            </table>
        </div>
    </div>`;
}

function renderTablaPool(lista) {
    return lista.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>${c.vacante_nombre}</td>
            <td><span class="score-badge ${getScoreClass(c.score)}">${c.score}%</span></td>
            <td>${c.recomendacion}</td>
            <td><span class="badge ${getEstadoBadge(c.estado)}">${c.estado}</span></td>
            <td><div class="tags-container">${c.habilidades.slice(0,3).map(h=>`<span class="tag">${h}</span>`).join('')}</div></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalleCandidato(${c.id})" title="Ver"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-success" onclick="reprocesarCandidato(${c.id})" title="Reprocesar"><i class="fas fa-redo"></i></button>
                <button class="btn btn-sm btn-secondary" onclick="asociarNuevaVacante(${c.id})" title="Asociar"><i class="fas fa-link"></i></button>
            </td>
        </tr>`).join('');
}

function filtrarPool() {
    let pool = CANDIDATOS.filter(c => c.estado === 'En pool futuro' || c.estado === 'Descartado');
    const nombre = (document.getElementById('fp-nombre').value||'').toLowerCase();
    const habilidad = document.getElementById('fp-habilidad').value;
    const scoreMin = parseInt(document.getElementById('fp-score').value) || 0;
    const formacion = document.getElementById('fp-formacion').value;
    const fuente = document.getElementById('fp-fuente').value;
    if (nombre) pool = pool.filter(c => c.nombre.toLowerCase().includes(nombre));
    if (habilidad) pool = pool.filter(c => c.habilidades.includes(habilidad));
    if (scoreMin) pool = pool.filter(c => c.score >= scoreMin);
    if (formacion) pool = pool.filter(c => c.formacion === formacion);
    if (fuente) pool = pool.filter(c => c.fuente === fuente);
    document.getElementById('tabla-pool').innerHTML = renderTablaPool(pool);
    document.getElementById('pool-count').textContent = `${pool.length} candidatos`;
}

function reprocesarCandidato(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const nuevoScore = Math.floor(40 + Math.random() * 55);
    c.score = nuevoScore;
    c.evaluacion_filtro = null;
    if (nuevoScore >= 90) c.recomendacion = 'Altamente recomendado';
    else if (nuevoScore >= 75) c.recomendacion = 'Recomendado';
    else if (nuevoScore >= 60) c.recomendacion = 'Revisar manualmente';
    else c.recomendacion = 'Bajo ajuste';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: 'Sistema', tipo: 'IA', descripcion: `Candidato reprocesado - Nuevo score: ${nuevoScore}%`, entidad: c.nombre, estado_anterior: c.estado, estado_nuevo: 'Procesado por IA' });
    c.estado = 'Procesado por IA';
    showToast(`${c.nombre} reprocesado. Nuevo score: ${nuevoScore}%`, 'success');
    navigateTo('pool');
}

function asociarNuevaVacante(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const vacantesDisponibles = VACANTES.filter(v => v.disponibilidad === 'Disponible' && v.estado !== 'Cerrada' && v.estado !== 'Finalizada');
    openModal(`
        <div class="modal-header"><h3>Asociar a Nueva Vacante - ${c.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="form-group">
                <label>Seleccionar vacante</label>
                <select id="anv-vacante">${vacantesDisponibles.map(v=>`<option value="${v.id}">${v.nombre} - ${v.area}</option>`).join('')}</select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="iniciarProcesoAsociacion(${c.id})">Asociar</button>
        </div>
    `);
}

function iniciarProcesoAsociacion(id) {
    const c = CANDIDATOS.find(can => can.id === id);
    const vacanteId = parseInt(document.getElementById('anv-vacante').value);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    // Show processing animation
    openModal(`
        <div class="modal-header"><h3>Procesando Asociación</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body" style="text-align:center;padding:40px">
            <div class="loader" style="width:48px;height:48px;border-width:5px;margin:0 auto 20px"></div>
            <p style="font-size:16px;font-weight:600;color:var(--primary)">Calculando nuevo score para ${c.nombre}...</p>
            <p style="font-size:13px;color:var(--gray-600);margin-top:8px">Evaluando perfil contra requisitos de "${vacante.nombre}"</p>
        </div>
    `);
    // Simulate processing delay, then show new score
    setTimeout(() => {
        const nuevoScore = Math.floor(50 + Math.random() * 46); // 50-95
        mostrarConfirmacionAsociacion(id, vacanteId, nuevoScore);
    }, 1800);
}

function mostrarConfirmacionAsociacion(candidatoId, vacanteId, nuevoScore) {
    const c = CANDIDATOS.find(can => can.id === candidatoId);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    let recomendacion;
    if (nuevoScore >= 90) recomendacion = 'Altamente recomendado';
    else if (nuevoScore >= 75) recomendacion = 'Recomendado';
    else if (nuevoScore >= 60) recomendacion = 'Revisar manualmente';
    else recomendacion = 'Bajo ajuste';
    openModal(`
        <div class="modal-header"><h3><i class="fas fa-link" style="color:var(--accent)"></i> Confirmar Asociación</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#f0f8ff,#e8f4fd);border-radius:12px;margin-bottom:20px">
                <p style="font-size:14px;color:var(--gray-700);margin-bottom:8px"><strong>${c.nombre}</strong> → <strong>${vacante.nombre}</strong></p>
                <div style="font-size:48px;font-weight:700;color:var(--accent);margin:12px 0">${nuevoScore}%</div>
                <p style="font-size:13px;color:var(--gray-600)">Nuevo score calculado por IA</p>
                <p style="font-size:13px;margin-top:8px"><span class="badge ${nuevoScore>=75?'badge-green':nuevoScore>=60?'badge-yellow':'badge-orange'}">${recomendacion}</span></p>
            </div>
            <p style="font-size:14px;text-align:center;color:var(--gray-700)">¿Confirmar asociación? Nuevo score: <strong>${nuevoScore}%</strong></p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="confirmarAsociacion(${candidatoId},${vacanteId},${nuevoScore})"><i class="fas fa-check"></i> Confirmar Asociación</button>
        </div>
    `);
}

function confirmarAsociacion(id, vacanteId, nuevoScore) {
    const c = CANDIDATOS.find(can => can.id === id);
    const vacante = VACANTES.find(v => v.id === vacanteId);
    c.vacante_id = vacanteId;
    c.vacante_nombre = vacante.nombre;
    c.estado = 'Nuevo';
    c.es_historico = false;
    c.score = nuevoScore;
    if (nuevoScore >= 90) c.recomendacion = 'Altamente recomendado';
    else if (nuevoScore >= 75) c.recomendacion = 'Recomendado';
    else if (nuevoScore >= 60) c.recomendacion = 'Revisar manualmente';
    else c.recomendacion = 'Bajo ajuste';
    TRAZABILIDAD.unshift({ id: TRAZABILIDAD.length+1, fecha: new Date().toLocaleString(), usuario: currentUser.nombre, tipo: 'Asociación', descripcion: `Candidato asociado a vacante "${vacante.nombre}" con score ${nuevoScore}%`, entidad: c.nombre, estado_anterior: 'En pool futuro', estado_nuevo: 'Nuevo' });
    closeModal();
    showToast(`${c.nombre} asociado a "${vacante.nombre}" con score ${nuevoScore}%`, 'success');
    navigateTo('pool');
}
