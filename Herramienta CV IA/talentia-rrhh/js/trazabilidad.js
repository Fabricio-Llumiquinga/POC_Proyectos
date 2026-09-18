function renderTrazabilidad() {
    return `
    <div class="filters-bar">
        <div class="filter-group"><label>Fecha desde</label><input type="date" id="ft-desde" value="2026-06-01"></div>
        <div class="filter-group"><label>Fecha hasta</label><input type="date" id="ft-hasta" value="2026-07-01"></div>
        <div class="filter-group"><label>Usuario</label><select id="ft-usuario" onchange="filtrarTrazabilidad()"><option value="">Todos</option><option>Sistema</option><option>Ana García</option><option>Carlos Méndez</option></select></div>
        <div class="filter-group">
            <label>Tipo de evento</label>
            <select id="ft-tipo" onchange="filtrarTrazabilidad()">
                <option value="">Todos</option>
                <option>Importación</option><option>Procesamiento</option><option>Cambio de estado</option>
                <option>Correo</option><option>IA</option><option>Carga manual</option>
                <option>Selección</option><option>Descarte</option><option>Entrevista</option>
                <option>Contratación</option><option>Pool</option><option>Asociación</option>
                <option>Baja</option><option>Ocultar</option><option>Consulta IA</option>
                <option>Vacante cerrada</option><option>Vacante reactivada</option>
                <option>Vacante reabierta</option><option>Vacante clonada</option>
                <option>Cargo disponible</option><option>Cargo no disponible</option>
                <option>Primer filtro</option><option>Error</option>
            </select>
        </div>
        <div class="filter-group"><label>Buscar</label><input type="text" id="ft-buscar" placeholder="Entidad..." oninput="filtrarTrazabilidad()"></div>
    </div>
    <div class="table-container">
        <div class="table-header"><h3>Registro de Trazabilidad</h3><span id="traz-count">${TRAZABILIDAD.length} eventos</span></div>
        <div class="table-responsive">
            <table>
                <thead><tr><th>Fecha y Hora</th><th>Usuario</th><th>Tipo</th><th>Descripción</th><th>Entidad</th><th>Estado Anterior</th><th>Estado Nuevo</th></tr></thead>
                <tbody id="tabla-trazabilidad">${renderTablaTrazabilidad(TRAZABILIDAD)}</tbody>
            </table>
        </div>
    </div>`;
}

function renderTablaTrazabilidad(lista) {
    const tipoIcono = {
        'Importación':'fa-cloud-download-alt','Procesamiento':'fa-cog','Cambio de estado':'fa-exchange-alt',
        'Correo':'fa-envelope','IA':'fa-robot','Carga manual':'fa-upload',
        'Selección':'fa-check-circle','Descarte':'fa-times-circle','Entrevista':'fa-user-tie',
        'Contratación':'fa-trophy','Pool':'fa-database','Asociación':'fa-link',
        'Baja':'fa-user-slash','Ocultar':'fa-eye-slash','Consulta IA':'fa-comments',
        'Vacante cerrada':'fa-lock','Vacante reactivada':'fa-redo','Vacante reabierta':'fa-folder-open',
        'Vacante clonada':'fa-copy','Cargo disponible':'fa-toggle-on','Cargo no disponible':'fa-toggle-off',
        'Primer filtro':'fa-clipboard-check','Error':'fa-exclamation-triangle','Observación':'fa-comment'
    };
    const tipoBadge = {
        'Importación':'badge-blue','Procesamiento':'badge-purple','Cambio de estado':'badge-yellow',
        'Correo':'badge-blue','IA':'badge-purple','Carga manual':'badge-gray',
        'Selección':'badge-green','Descarte':'badge-red','Entrevista':'badge-blue',
        'Contratación':'badge-green','Pool':'badge-orange','Asociación':'badge-blue',
        'Baja':'badge-red','Ocultar':'badge-gray','Consulta IA':'badge-purple',
        'Vacante cerrada':'badge-gray','Vacante reactivada':'badge-green','Vacante reabierta':'badge-blue',
        'Vacante clonada':'badge-purple','Cargo disponible':'badge-green','Cargo no disponible':'badge-red',
        'Primer filtro':'badge-orange','Error':'badge-red','Observación':'badge-yellow'
    };
    return lista.map(t => `
        <tr>
            <td style="white-space:nowrap">${t.fecha}</td>
            <td>${t.usuario}</td>
            <td><span class="badge ${tipoBadge[t.tipo]||'badge-gray'}"><i class="fas ${tipoIcono[t.tipo]||'fa-info-circle'}" style="margin-right:4px"></i>${t.tipo}</span></td>
            <td>${t.descripcion}</td>
            <td><strong>${t.entidad}</strong></td>
            <td>${t.estado_anterior}</td>
            <td>${t.estado_nuevo}</td>
        </tr>`).join('');
}

function filtrarTrazabilidad() {
    let filtered = [...TRAZABILIDAD];
    const usuario = document.getElementById('ft-usuario').value;
    const tipo = document.getElementById('ft-tipo').value;
    const buscar = (document.getElementById('ft-buscar').value||'').toLowerCase();
    if (usuario) filtered = filtered.filter(t => t.usuario === usuario);
    if (tipo) filtered = filtered.filter(t => t.tipo === tipo);
    if (buscar) filtered = filtered.filter(t => t.entidad.toLowerCase().includes(buscar) || t.descripcion.toLowerCase().includes(buscar));
    document.getElementById('tabla-trazabilidad').innerHTML = renderTablaTrazabilidad(filtered);
    document.getElementById('traz-count').textContent = `${filtered.length} eventos`;
}
