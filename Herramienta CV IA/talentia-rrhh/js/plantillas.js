function renderPlantillas() {
    return `
    <div class="table-container">
        <div class="table-header">
            <h3>Plantillas de Puesto</h3>
            <div class="table-actions"><button class="btn btn-primary" onclick="openModalNuevaPlantilla()"><i class="fas fa-plus"></i> Nueva Plantilla</button></div>
        </div>
        <div class="table-responsive">
            <table>
                <thead><tr><th>Nombre</th><th>Área</th><th>País</th><th>Nivel</th><th>Exp. mín.</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>${PLANTILLAS.map(p => `
                    <tr>
                        <td><strong>${p.nombre}</strong></td>
                        <td>${p.area}</td>
                        <td>${p.pais}</td>
                        <td>${p.nivel}</td>
                        <td>${p.experiencia} años</td>
                        <td><span class="badge ${getEstadoBadge(p.estado)}">${p.estado}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="verPlantilla(${p.id})" title="Ver criterios"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-secondary" onclick="verPonderacion(${p.id})" title="Ponderación"><i class="fas fa-balance-scale"></i></button>
                            <button class="btn btn-sm btn-secondary" onclick="duplicarPlantilla(${p.id})" title="Duplicar"><i class="fas fa-copy"></i></button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function verPlantilla(id) {
    const p = PLANTILLAS.find(pl => pl.id === id);
    openModal(`
        <div class="modal-header"><h3>${p.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="detail-section">
                <h4>Información General</h4>
                <div class="detail-grid">
                    <div class="detail-item"><div class="label">Área</div><div class="value">${p.area}</div></div>
                    <div class="detail-item"><div class="label">País</div><div class="value">${p.pais}</div></div>
                    <div class="detail-item"><div class="label">Nivel</div><div class="value">${p.nivel}</div></div>
                    <div class="detail-item"><div class="label">Experiencia mínima</div><div class="value">${p.experiencia} años</div></div>
                    <div class="detail-item"><div class="label">Formación</div><div class="value">${p.formacion}</div></div>
                </div>
                <div style="margin-top:12px"><div class="label">Descripción</div><div class="value" style="margin-top:4px">${p.descripcion}</div></div>
            </div>
            <div class="detail-section">
                <h4>Habilidades Requeridas</h4>
                <div class="tags-container">${p.habilidades_requeridas.map(h=>`<span class="tag">${h}</span>`).join('')}</div>
            </div>
            <div class="detail-section">
                <h4>Habilidades Deseables</h4>
                <div class="tags-container">${p.habilidades_deseables.map(h=>`<span class="tag" style="background:rgba(40,167,69,0.1);color:#28a745">${h}</span>`).join('')}</div>
            </div>
            ${p.certificaciones.length?`<div class="detail-section"><h4>Certificaciones</h4><div class="tags-container">${p.certificaciones.map(c=>`<span class="tag" style="background:rgba(111,66,193,0.1);color:#6f42c1">${c}</span>`).join('')}</div></div>`:''}
            <div class="detail-section">
                <h4>Pesos por Criterio</h4>
                <div class="detail-grid">
                    <div class="detail-item"><div class="label">Experiencia</div><div class="value">${p.pesos.experiencia}%</div></div>
                    <div class="detail-item"><div class="label">Formación</div><div class="value">${p.pesos.formacion}%</div></div>
                    <div class="detail-item"><div class="label">Habilidades</div><div class="value">${p.pesos.habilidades}%</div></div>
                    <div class="detail-item"><div class="label">Certificaciones</div><div class="value">${p.pesos.certificaciones}%</div></div>
                    <div class="detail-item"><div class="label">Idiomas</div><div class="value">${p.pesos.idiomas}%</div></div>
                    <div class="detail-item"><div class="label">Estabilidad</div><div class="value">${p.pesos.estabilidad}%</div></div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Preguntas del Primer Filtro</h4>
                <ol style="padding-left:20px">${(p.preguntas_filtro||[]).map(q=>`<li style="margin-bottom:6px;font-size:13px">${q}</li>`).join('')}</ol>
            </div>
            <div class="detail-section">
                <h4>Criterios Excluyentes</h4>
                <ul style="padding-left:20px">${p.criterios_excluyentes.map(c=>`<li style="margin-bottom:4px;font-size:13px">${c}</li>`).join('')}</ul>
            </div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
    `);
}

function verPonderacion(id) {
    const p = PLANTILLAS.find(pl => pl.id === id);
    openModal(`
        <div class="modal-header"><h3>Tabla de Ponderación - ${p.nombre}</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <p style="margin-bottom:16px;color:var(--gray-600)">Esta tabla define los criterios y pesos para la evaluación del primer filtro de candidatos.</p>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>Criterio</th><th>Pregunta de Validación</th><th>Peso %</th><th>Tipo</th></tr></thead>
                    <tbody>${p.ponderacion.map(item=>`
                        <tr>
                            <td><strong>${item.criterio}</strong></td>
                            <td>${item.pregunta}</td>
                            <td><span class="score-badge score-good">${item.peso}%</span></td>
                            <td><span class="badge badge-blue">${item.tipo}</span></td>
                        </tr>`).join('')}
                    </tbody>
                    <tfoot><tr><td colspan="2"><strong>Total</strong></td><td><strong>100%</strong></td><td></td></tr></tfoot>
                </table>
            </div>
            <div class="detail-section" style="margin-top:20px">
                <h4>Reglas de Puntuación</h4>
                <div class="detail-grid">
                    <div class="detail-item"><div class="label">Cumple</div><div class="value"><span class="badge badge-green">100% del peso</span></div></div>
                    <div class="detail-item"><div class="label">Cumple parcialmente</div><div class="value"><span class="badge badge-yellow">50% del peso</span></div></div>
                    <div class="detail-item"><div class="label">No cumple</div><div class="value"><span class="badge badge-red">0% del peso</span></div></div>
                    <div class="detail-item"><div class="label">No identificado</div><div class="value"><span class="badge badge-orange">0% + Alerta</span></div></div>
                </div>
            </div>
            ${p.preguntas_filtro && p.preguntas_filtro.length ? `
            <div class="detail-section" style="margin-top:20px">
                <h4>Preguntas Configuradas para este Puesto</h4>
                <ol style="padding-left:20px">${p.preguntas_filtro.map(q=>`<li style="margin-bottom:6px;font-size:13px">${q}</li>`).join('')}</ol>
            </div>` : ''}
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
    `);
}

function openModalNuevaPlantilla() {
    openModal(`
        <div class="modal-header"><h3>Nueva Plantilla de Puesto</h3><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">
            <div class="detail-section">
                <h4><i class="fas fa-upload"></i> Subir archivo de requisición (simula autocompletado)</h4>
                <div class="form-group">
                    <input type="file" id="np-archivo" accept=".pdf,.doc,.docx,.xls,.xlsx" onchange="procesarArchivoPlantilla()">
                    <p style="font-size:11px;color:var(--gray-500);margin-top:4px">Suba un archivo con la descripción del puesto y los campos se autocompletarán. Verifique y complete lo que falte.</p>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Nombre del puesto</label><input type="text" id="np-nombre" placeholder="Ej: Analista de Datos"></div>
                <div class="form-group"><label>Área</label><select id="np-area">${AREAS.map(a=>`<option>${a}</option>`).join('')}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>País</label><select id="np-pais">${PAISES.map(p=>`<option>${p}</option>`).join('')}</select></div>
                <div class="form-group"><label>Nivel</label><select id="np-nivel"><option>Operativo</option><option>Técnico</option><option>Profesional</option><option>Gerencial</option></select></div>
            </div>
            <div class="form-group"><label>Descripción</label><textarea id="np-desc" placeholder="Descripción del puesto..."></textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Formación requerida</label><input type="text" id="np-formacion" placeholder="Ej: Ingeniería Industrial"></div>
                <div class="form-group"><label>Experiencia mínima (años)</label><input type="number" id="np-exp" value="2" min="0"></div>
            </div>
            <div class="form-group"><label>Habilidades requeridas (separadas por coma)</label><input type="text" id="np-hab" placeholder="Excel, SAP, Liderazgo"></div>
            <div class="form-group"><label>Preguntas del primer filtro (una por línea)</label><textarea id="np-preguntas" rows="4" placeholder="¿Tiene experiencia en...?&#10;¿Maneja herramientas de...?"></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="guardarNuevaPlantilla()">Guardar</button></div>
    `);
}

function procesarArchivoPlantilla() {
    setTimeout(() => {
        document.getElementById('np-nombre').value = 'Coordinador de Logística Regional';
        document.getElementById('np-area').value = 'Logística';
        document.getElementById('np-pais').value = 'Guatemala';
        document.getElementById('np-nivel').value = 'Profesional';
        document.getElementById('np-desc').value = 'Coordinar operaciones logísticas regionales, supervisar despachos y garantizar el cumplimiento de indicadores de entrega. Gestión de equipo de 8 personas.';
        document.getElementById('np-formacion').value = 'Ingeniería Industrial o Administración de Empresas';
        document.getElementById('np-exp').value = '4';
        document.getElementById('np-hab').value = 'Gestión de inventarios, SAP, Excel avanzado, Liderazgo, KPIs logísticos';
        document.getElementById('np-preguntas').value = '¿Tiene experiencia coordinando operaciones logísticas?\n¿Ha manejado equipos de más de 5 personas?\n¿Tiene experiencia con SAP módulo MM o WM?\n¿Ha gestionado indicadores de desempeño logístico?\n¿Tiene disponibilidad para viajar a nivel regional?';
        showToast('Archivo procesado. Campos autocompletados. Verifique la información y complete lo que falte.', 'success');
    }, 800);
}

function guardarNuevaPlantilla() {
    const nombre = document.getElementById('np-nombre').value || 'Nueva Plantilla';
    const preguntas = document.getElementById('np-preguntas').value.split('\n').filter(p=>p.trim());
    PLANTILLAS.push({
        id: PLANTILLAS.length+1, nombre, area: document.getElementById('np-area').value,
        pais: document.getElementById('np-pais').value, nivel: document.getElementById('np-nivel').value,
        descripcion: document.getElementById('np-desc').value || 'Sin descripción',
        formacion: document.getElementById('np-formacion').value || 'Por definir',
        experiencia: parseInt(document.getElementById('np-exp').value) || 2,
        habilidades_requeridas: (document.getElementById('np-hab').value||'Por definir').split(',').map(h=>h.trim()),
        habilidades_deseables: [], certificaciones: [], idiomas: ['Español'],
        pesos: {experiencia:30,formacion:20,habilidades:25,certificaciones:10,idiomas:5,estabilidad:10},
        criterios_excluyentes: ['Por definir'], criterios_deseables: ['Por definir'],
        estado: 'Activa',
        ponderacion: JSON.parse(JSON.stringify(PONDERACION_BASE)),
        preguntas_filtro: preguntas.length ? preguntas : ['¿Cumple con el perfil básico?']
    });
    closeModal(); showToast('Plantilla creada exitosamente', 'success'); navigateTo('plantillas');
}

function duplicarPlantilla(id) {
    const p = PLANTILLAS.find(pl => pl.id === id);
    const copia = JSON.parse(JSON.stringify(p));
    copia.id = PLANTILLAS.length + 1;
    copia.nombre = p.nombre + ' (Copia)';
    PLANTILLAS.push(copia);
    showToast(`Plantilla "${p.nombre}" duplicada`, 'success'); navigateTo('plantillas');
}
