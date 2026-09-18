/* ============================================
   WORKFLOW.JS - Detalle y gestión del workflow
   ============================================ */

const Workflow = {
    currentTramite: null,
    currentTab: 'resumen',

    showDetail(tramiteId) {
        const d = App.data;
        const t = d.tramites.find(tr => tr.id === tramiteId);
        if (!t) { App.toast('Trámite no encontrado', 'error'); return; }
        this.currentTramite = t;
        this.currentTab = 'resumen';

        const client = d.clients.find(c => c.id === t.clientId);
        const user = d.users.find(u => u.id === t.responsible);
        const type = TRAMITE_TYPES.find(tt => tt.id === t.type);
        const stage = WORKFLOW_STAGES.find(s => s.id === t.currentStage);
        const slaClass = t.slaUsed > t.slaTotal ? 'text-danger' : t.slaUsed > t.slaTotal*0.8 ? 'text-warning' : 'text-success';
        const slaPct = Math.min(100, Math.round(t.slaUsed / t.slaTotal * 100));

        const content = document.getElementById('page-content');
        content.innerHTML = `
        <div class="breadcrumbs mb-1">
            <a href="#" onclick="Backoffice.navigate('workflow')">Workflow</a> <span>›</span> <strong>${t.id}</strong>
        </div>
        <div class="detail-header">
            <div class="detail-title">
                <h2>${t.id} ${t.otSolser ? '· OT: '+t.otSolser : ''}</h2>
                <div>${Backoffice.getStatusBadge(t.status)} <span class="badge badge-info">${type?type.name:t.type}</span></div>
            </div>
            <div class="detail-meta">
                <div class="meta-item"><div class="meta-label">Cliente</div><div class="meta-value">${client?client.company:'-'}</div></div>
                <div class="meta-item"><div class="meta-label">Régimen</div><div class="meta-value">${t.regime}</div></div>
                <div class="meta-item"><div class="meta-label">Prioridad</div><div class="meta-value">${t.priority}</div></div>
                <div class="meta-item"><div class="meta-label">Responsable</div><div class="meta-value">${user?user.name:'-'}</div></div>
                <div class="meta-item"><div class="meta-label">Inicio</div><div class="meta-value">${formatDate(t.startDate)}</div></div>
                <div class="meta-item"><div class="meta-label">ETA</div><div class="meta-value">${formatDate(t.eta)}</div></div>
                <div class="meta-item"><div class="meta-label">SLA</div><div class="meta-value ${slaClass}">${t.slaUsed}d / ${t.slaTotal}d (${slaPct}%)</div></div>
                <div class="meta-item"><div class="meta-label">Avance</div><div class="meta-value">${t.progress}%</div></div>
                <div class="meta-item"><div class="meta-label">Etapa</div><div class="meta-value">${stage?stage.name:'-'}</div></div>
                <div class="meta-item"><div class="meta-label">OMEGA</div><div class="meta-value">${t.omega||'-'}</div></div>
                <div class="meta-item"><div class="meta-label">Integración</div><div class="meta-value">${t.integration}</div></div>
                <div class="meta-item"><div class="meta-label">Actualización</div><div class="meta-value">${t.lastUpdate}</div></div>
            </div>

            <div class="detail-actions">
                <button class="btn btn-sm btn-primary" onclick="Workflow.advanceStage()">Avanzar Etapa</button>
                <button class="btn btn-sm btn-secondary" onclick="Workflow.showAssignModal()">Reasignar</button>
                <button class="btn btn-sm btn-secondary" onclick="Workflow.addComment()">Comentario</button>
                <button class="btn btn-sm btn-secondary" onclick="Workflow.uploadDoc()">Adjuntar Doc.</button>
                <button class="btn btn-sm btn-warning" onclick="Backoffice.createAlert()">Alerta</button>
                ${t.integration==='Pendiente de envío'||t.integration==='Error'?`<button class="btn btn-sm btn-success" onclick="Integrations.sendToSolser('${t.id}')">Enviar SOLSER</button>`:''}
                ${t.status!=='Cerrado'?`<button class="btn btn-sm btn-danger" onclick="Workflow.closeTramite('${t.id}')">Cerrar</button>`:''}
                <button class="btn btn-sm btn-secondary" onclick="Workflow.printReport()">Imprimir</button>
            </div>
        </div>

        <div class="tabs" id="detail-tabs">
            <div class="tab active" onclick="Workflow.switchTab('resumen')">Resumen</div>
            <div class="tab" onclick="Workflow.switchTab('workflow')">Workflow</div>
            <div class="tab" onclick="Workflow.switchTab('documentos')">Documentos</div>
            <div class="tab" onclick="Workflow.switchTab('items')">Ítems</div>
            <div class="tab" onclick="Workflow.switchTab('proforma')">Proforma</div>
            <div class="tab" onclick="Workflow.switchTab('integraciones')">Integraciones</div>
            <div class="tab" onclick="Workflow.switchTab('costos')">Costos</div>
            <div class="tab" onclick="Workflow.switchTab('comentarios')">Comentarios</div>
            <div class="tab" onclick="Workflow.switchTab('alertas')">Alertas</div>
            <div class="tab" onclick="Workflow.switchTab('historial')">Historial</div>
        </div>
        <div id="detail-tab-content"></div>`;

        this.switchTab('resumen');
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('#detail-tabs .tab').forEach(t => t.classList.remove('active'));
        const tabs = document.querySelectorAll('#detail-tabs .tab');
        const tabNames = ['resumen','workflow','documentos','items','proforma','integraciones','costos','comentarios','alertas','historial'];
        const idx = tabNames.indexOf(tab);
        if (tabs[idx]) tabs[idx].classList.add('active');

        const el = document.getElementById('detail-tab-content');
        const t = this.currentTramite;
        const d = App.data;

        switch(tab) {
            case 'resumen': this.renderResumen(el, t, d); break;
            case 'workflow': this.renderWorkflowTab(el, t, d); break;
            case 'documentos': this.renderDocuments(el, t, d); break;
            case 'items': this.renderItems(el, t, d); break;
            case 'proforma': this.renderProforma(el, t, d); break;
            case 'integraciones': this.renderIntegraciones(el, t, d); break;
            case 'costos': this.renderCostos(el, t, d); break;
            case 'comentarios': this.renderComentarios(el, t, d); break;
            case 'alertas': this.renderAlertas(el, t, d); break;
            case 'historial': this.renderHistorial(el, t, d); break;
        }
    },

    renderResumen(el, t, d) {
        const stages = d.stageDetails.filter(s => s.tramiteId === t.id);
        const docs = d.documents.filter(dc => dc.tramiteId === t.id);
        const validDocs = docs.filter(dc => dc.state === 'Validado').length;
        const pendDocs = docs.filter(dc => dc.state === 'Pendiente').length;
        const recvDocs = docs.filter(dc => dc.state === 'Recibido' || dc.state === 'En revisión').length;
        const comments = d.comments.filter(c => c.tramiteId === t.id);
        const alerts = d.alerts.filter(a => a.tramiteId === t.id);
        const proformas = d.proformas.filter(p => p.tramiteId === t.id);
        const costs = d.costs.filter(c => c.tramiteId === t.id);

        el.innerHTML = `
        <div class="card"><div class="card-header"><h3>Progreso del Workflow</h3><span style="font-size:0.8rem;color:var(--gray-500)">Etapa ${t.currentStage} de 10</span></div><div class="card-body">
            <div class="workflow-timeline">
                ${WORKFLOW_STAGES.map(s => {
                    let cls = 'not-started';
                    if (s.id < t.currentStage) cls = 'completed';
                    else if (s.id === t.currentStage) cls = t.status === 'Pendiente cliente' ? 'blocked' : 'in-progress';
                    if (t.slaUsed > t.slaTotal && s.id === t.currentStage) cls = 'delayed';
                    if (t.status === 'Cerrado') cls = 'completed';
                    return `<div class="workflow-step ${cls}" onclick="Workflow.switchTab('workflow')" style="cursor:pointer" data-tooltip="${s.name}">
                        <div class="step-circle">${s.id}</div>
                        <div class="step-label">${s.short}</div>
                    </div>`;
                }).join('')}
            </div>
            <div style="display:flex;gap:1.5rem;margin-top:1rem;padding-top:0.8rem;border-top:1px solid var(--gray-200);font-size:0.75rem;color:var(--gray-500);flex-wrap:wrap;">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--success);margin-right:4px;"></span>Completada</span>
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent);margin-right:4px;"></span>En progreso</span>
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--warning);margin-right:4px;"></span>Bloqueada (cliente)</span>
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--danger);margin-right:4px;"></span>Atrasada</span>
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--gray-300);margin-right:4px;"></span>Pendiente</span>
            </div>
        </div></div>

        <div class="charts-grid">
            <div class="chart-card">
                <h4>Resumen del Trámite</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;font-size:0.83rem;">
                    <div><span style="color:var(--gray-500)">Documentos:</span> <strong>${validDocs + recvDocs}/${docs.length}</strong></div>
                    <div><span style="color:var(--gray-500)">Pendientes:</span> <strong class="${pendDocs>0?'text-warning':''}">${pendDocs}</strong></div>
                    <div><span style="color:var(--gray-500)">Comentarios:</span> <strong>${comments.length}</strong></div>
                    <div><span style="color:var(--gray-500)">Alertas:</span> <strong class="${alerts.length>0?'text-warning':''}">${alerts.length}</strong></div>
                    <div><span style="color:var(--gray-500)">Proformas:</span> <strong>${proformas.length}</strong></div>
                    <div><span style="color:var(--gray-500)">Costos:</span> <strong>${costs.length}</strong></div>
                    <div><span style="color:var(--gray-500)">Integración:</span> <strong>${t.integration}</strong></div>
                    <div><span style="color:var(--gray-500)">OMEGA:</span> <strong>${t.omega}</strong></div>
                </div>
            </div>
            <div class="chart-card">
                <h4>Estado Documental</h4>
                <div class="bar-chart">
                    <div class="bar-row"><span class="bar-label">Validados</span><div class="bar-track"><div class="bar-fill success" style="width:${validDocs/Math.max(docs.length,1)*100}%">${validDocs}</div></div></div>
                    <div class="bar-row"><span class="bar-label">Recibidos</span><div class="bar-track"><div class="bar-fill" style="width:${recvDocs/Math.max(docs.length,1)*100}%">${recvDocs}</div></div></div>
                    <div class="bar-row"><span class="bar-label">Pendientes</span><div class="bar-track"><div class="bar-fill warning" style="width:${pendDocs/Math.max(docs.length,1)*100}%">${pendDocs}</div></div></div>
                </div>
            </div>
            <div class="chart-card">
                <h4>Próximas Acciones</h4>
                <ul style="font-size:0.85rem;list-style:none;line-height:2;">
                    ${t.status === 'Pendiente cliente' ? '<li>⏳ Esperando respuesta del cliente</li>' : ''}
                    ${t.integration === 'Pendiente de envío' ? '<li>📤 Enviar datos a SOLSER para crear OT</li>' : ''}
                    ${t.integration === 'Error' ? '<li>⚠️ Reintentar integración SOLSER</li>' : ''}
                    ${pendDocs > 0 ? `<li>📎 ${pendDocs} documento(s) pendiente(s) de recibir</li>` : ''}
                    ${proformas.find(p => p.status === 'Pendiente') ? '<li>✅ Proforma pendiente de aprobación</li>' : ''}
                    ${costs.find(c => c.approvalStatus.includes('Pendiente')) ? '<li>💰 Costos pendientes de aprobación</li>' : ''}
                    <li>📋 Continuar: ${WORKFLOW_STAGES.find(s => s.id === t.currentStage)?.name || 'Siguiente etapa'}</li>
                </ul>
            </div>
            <div class="chart-card">
                <h4>Últimas Actividades</h4>
                <div style="font-size:0.82rem;">
                    ${comments.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 4).map(c => `
                        <div style="padding:0.4rem 0;border-bottom:1px solid var(--gray-100);">
                            <span style="color:var(--gray-400);font-size:0.7rem;">${c.date}</span><br>
                            ${c.text.substring(0, 60)}${c.text.length > 60 ? '...' : ''}
                        </div>`).join('')}
                    ${!comments.length ? '<p class="text-muted">Sin actividad registrada.</p>' : ''}
                </div>
            </div>
        </div>`;
    },

    renderWorkflowTab(el, t, d) {
        const stages = d.stageDetails.filter(s => s.tramiteId === t.id).sort((a, b) => a.stageId - b.stageId);
        const stageDescriptions = {
            1: { entradas: 'Correo/formulario, datos del cliente, adjuntos', salidas: 'N° trámite, OT SOLSER, expediente digital', acciones: 'Registrar solicitud, identificar cliente, crear expediente, enviar a SOLSER' },
            2: { entradas: 'Documentos recibidos, checklist por tipo', salidas: 'Checklist validado, lista de pendientes', acciones: 'Revisar documentos, marcar pendientes, rechazar incorrectos, solicitar adicionales' },
            3: { entradas: 'Tipo, régimen, prioridad, carga del equipo', salidas: 'Responsable asignado, fecha compromiso', acciones: 'Seleccionar responsable, consultar capacidad, asignar pedimentador' },
            4: { entradas: 'Factura, lista empaque, fichas técnicas', salidas: 'Ítems validados, partidas confirmadas', acciones: 'Revisar ítems, clasificación arancelaria, validar partidas, aplicar reglas' },
            5: { entradas: 'Ítems validados, tributos, costos', salidas: 'Proforma, aprobación del cliente', acciones: 'Generar proforma, enviar al cliente, registrar aprobación/rechazo' },
            6: { entradas: 'Datos aprobados, documentos validados', salidas: 'N° DUA, declaración, resultado de aforo', acciones: 'Enviar a OMEGA, generar declaración, registrar DUA y aforo' },
            7: { entradas: 'DUA, resultado aforo, pagos, autorizaciones', salidas: 'Mercancía liberada, evidencia operativa', acciones: 'Confirmar impuestos, registrar liberación, cargar evidencias' },
            8: { entradas: 'Trámite operativo, gastos, servicios', salidas: 'Solicitud facturación, conceptos facturables', acciones: 'Revisar conceptos, registrar gastos, enviar a FACSER' },
            9: { entradas: 'Datos FACSER, costos aprobados', salidas: 'Factura, notificación al cliente', acciones: 'Generar factura, adjuntar, notificar, registrar cobro' },
            10: { entradas: 'Workflow completado, factura generada', salidas: 'Trámite cerrado, expediente completo, informe final', acciones: 'Validar pendientes, calcular SLA, cerrar, bloquear edición' }
        };

        el.innerHTML = `
        <div class="card"><div class="card-header"><h3>Flujo del Trámite — Detalle de Etapas</h3>
            <div style="font-size:0.8rem;color:var(--gray-500);">Etapa actual: <strong style="color:var(--accent)">${WORKFLOW_STAGES.find(s=>s.id===t.currentStage)?.name||''}</strong></div>
        </div><div class="card-body" style="padding:0;">
            ${stages.map(s => {
                const isCurrent = s.stageId === t.currentStage;
                const isCompleted = s.state === 'Completada';
                const isBlocked = s.state === 'Pendiente cliente';
                const isDelayed = s.state === 'Atrasada' || (isCurrent && t.slaUsed > t.slaTotal);
                const user = d.users.find(u => u.id === s.responsible);
                const stageComments = d.comments.filter(c => c.tramiteId === t.id && c.stage === s.stageId);
                const stageDocs = d.documents.filter(dc => dc.tramiteId === t.id).slice(0, 3); // simplified
                const desc = stageDescriptions[s.stageId] || {};

                let borderColor = 'var(--gray-200)';
                let bgColor = 'transparent';
                let stateIcon = '○';
                let stateClass = 'badge-gray';

                if (isCompleted) { borderColor = 'var(--success)'; stateIcon = '✓'; stateClass = 'badge-success'; }
                else if (isCurrent && isDelayed) { borderColor = 'var(--danger)'; bgColor = '#fff5f5'; stateIcon = '⚠'; stateClass = 'badge-danger'; }
                else if (isCurrent && isBlocked) { borderColor = 'var(--warning)'; bgColor = '#fffff0'; stateIcon = '⏸'; stateClass = 'badge-warning'; }
                else if (isCurrent) { borderColor = 'var(--accent)'; bgColor = '#f0f7ff'; stateIcon = '▶'; stateClass = 'badge-info'; }

                return `<div class="wf-stage-detail" style="padding:1.2rem 1.5rem;border-left:4px solid ${borderColor};background:${bgColor};border-bottom:1px solid var(--gray-100);${isCurrent?'':''}">
                    <div class="flex-between" style="margin-bottom:0.6rem;">
                        <div style="display:flex;align-items:center;gap:0.6rem;">
                            <span style="font-size:1.1rem;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:${isCompleted?'var(--success)':isCurrent?'var(--accent)':'var(--gray-200)'};color:${isCompleted||isCurrent?'white':'var(--gray-500)'};font-size:0.75rem;font-weight:700;">${s.stageId}</span>
                            <div>
                                <strong style="font-size:0.95rem;color:var(--primary);">${s.stageName}</strong>
                                <span class="badge ${stateClass}" style="margin-left:0.5rem;">${s.state}</span>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:1rem;font-size:0.8rem;color:var(--gray-500);">
                            <span>📅 ${s.startDate || '—'} → ${s.endDate || (isCurrent ? 'En curso' : '—')}</span>
                            <span>👤 ${user ? user.name : '—'}</span>
                            <span>⏱ SLA: ${s.slaAssigned}d</span>
                        </div>
                    </div>
                    ${isCurrent || isCompleted ? `
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;font-size:0.8rem;padding:0.6rem 0 0.4rem 2.5rem;color:var(--gray-600);">
                        <div><span style="font-weight:600;color:var(--gray-500);display:block;margin-bottom:0.2rem;">Entradas</span>${desc.entradas || '-'}</div>
                        <div><span style="font-weight:600;color:var(--gray-500);display:block;margin-bottom:0.2rem;">Acciones</span>${desc.acciones || '-'}</div>
                        <div><span style="font-weight:600;color:var(--gray-500);display:block;margin-bottom:0.2rem;">Salidas</span>${desc.salidas || '-'}</div>
                    </div>
                    ${stageComments.length ? `<div style="padding:0.4rem 0 0 2.5rem;font-size:0.78rem;color:var(--gray-500);"><em>💬 ${stageComments.length} comentario(s) en esta etapa</em></div>` : ''}
                    ` : ''}
                    ${isCurrent && t.status !== 'Cerrado' ? `
                    <div style="padding:0.6rem 0 0 2.5rem;display:flex;gap:0.4rem;">
                        <button class="btn btn-sm btn-success" onclick="Workflow.advanceStage()">Completar y Avanzar</button>
                        <button class="btn btn-sm btn-secondary" onclick="Workflow.addComment()">Comentar</button>
                        <button class="btn btn-sm btn-secondary" onclick="Workflow.uploadDoc()">Adjuntar Doc.</button>
                    </div>` : ''}
                </div>`;
            }).join('')}
        </div></div>`;
    },

    renderDocuments(el, t, d) {
        const docs = d.documents.filter(dc => dc.tramiteId === t.id);
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Checklist Documental</h3><button class="btn btn-sm btn-primary" onclick="Workflow.uploadDoc()">Cargar Documento</button></div>
        <div class="table-container"><table>
            <thead><tr><th>Documento</th><th>Obligatorio</th><th>Estado</th><th>Fecha</th><th>Versión</th><th>Tamaño</th><th>Visible Cliente</th><th>Acciones</th></tr></thead>
            <tbody>${docs.map(dc => {
                const stCls = dc.state==='Validado'?'badge-success':dc.state==='Pendiente'?'badge-warning':dc.state==='Rechazado'?'badge-danger':'badge-info';
                return `<tr>
                    <td>${dc.type}</td><td>${dc.required?'Sí':'No'}</td>
                    <td><span class="badge ${stCls}">${dc.state}</span></td>
                    <td>${dc.uploadDate||'-'}</td><td>${dc.version}</td><td>${dc.size||'-'}</td>
                    <td>${dc.visibleClient?'Sí':'No'}</td>
                    <td>
                        ${dc.state==='Recibido'||dc.state==='En revisión'?`<button class="btn btn-sm btn-success" onclick="Workflow.validateDoc('${dc.id}')">Validar</button><button class="btn btn-sm btn-danger" onclick="Workflow.rejectDoc('${dc.id}')">Rechazar</button>`:''}
                        ${dc.state==='Pendiente'?`<button class="btn btn-sm btn-primary" onclick="Workflow.simulateUpload('${dc.id}')">Simular carga</button>`:''}
                    </td>
                </tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    renderItems(el, t, d) {
        const items = [
            { line: 1, desc: 'Equipo de producción audiovisual', qty: 2, unit: 'Unidad', weight: '45 kg', value: 1200, origin: 'China', brand: 'ProFrame', model: 'PF-500', tariff: '8525.80.90', status: 'Validado' },
            { line: 2, desc: 'Software de animación (licencia)', qty: 5, unit: 'Licencia', weight: '0.1 kg', value: 800, origin: 'USA', brand: 'AnimaX', model: 'Studio Pro', tariff: '8523.49.90', status: 'Validado' },
            { line: 3, desc: 'Tableta gráfica profesional', qty: 10, unit: 'Unidad', weight: '8 kg', value: 450, origin: 'Japón', brand: 'WacomPro', model: 'WP-2024', tariff: '8471.60.90', status: 'Pendiente' }
        ];
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Ítems y Partidas</h3></div>
        <div class="table-container"><table>
            <thead><tr><th>Línea</th><th>Descripción</th><th>Cant.</th><th>Unidad</th><th>Peso</th><th>Valor USD</th><th>Origen</th><th>Marca</th><th>Partida</th><th>Estado</th></tr></thead>
            <tbody>${items.map(i => `<tr>
                <td>${i.line}</td><td>${i.desc}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.weight}</td><td>$${i.value}</td><td>${i.origin}</td><td>${i.brand}</td><td><code>${i.tariff}</code></td>
                <td><span class="badge ${i.status==='Validado'?'badge-success':'badge-warning'}">${i.status}</span></td>
            </tr>`).join('')}</tbody></table></div></div>`;
    },

    renderProforma(el, t, d) {
        const proformas = d.proformas.filter(p => p.tramiteId === t.id);
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Proformas y Aprobaciones</h3>
            ${t.currentStage >= 5 && !proformas.find(p=>p.status==='Aprobada') ? `<button class="btn btn-sm btn-primary" onclick="Workflow.generateProforma()">Generar Proforma</button>` : ''}
        </div>
        ${proformas.length ? `<div class="table-container"><table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Monto</th><th>Ítems</th><th>Estado</th><th>Enviada</th><th>Aprobada</th><th>Comentario</th><th>Acciones</th></tr></thead>
            <tbody>${proformas.map(p => `<tr>
                <td>${p.id}</td><td>${p.date}</td><td>$${p.amount} ${p.currency}</td><td>${p.items}</td>
                <td><span class="badge ${p.status==='Aprobada'?'badge-success':'badge-warning'}">${p.status}</span></td>
                <td>${p.sentDate||'-'}</td><td>${p.approvalDate||'-'}</td><td>${p.clientComment||'-'}</td>
                <td>${p.status==='Pendiente'?`<button class="btn btn-sm btn-success" onclick="Workflow.approveProforma('${p.id}')">Aprobar</button>`:'✓'}</td>
            </tr>`).join('')}</tbody></table></div>` : '<div class="card-body"><p class="text-muted">No hay proformas generadas para este trámite.</p></div>'}
        </div>`;
    },

    renderIntegraciones(el, t, d) {
        const ints = d.integrations.filter(i => i.tramiteId === t.id);
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Integraciones</h3>
            ${t.integration==='Pendiente de envío'?`<button class="btn btn-sm btn-primary" onclick="Integrations.sendToSolser('${t.id}')">Enviar a SOLSER</button>`:''}
            ${t.integration==='Error'?`<button class="btn btn-sm btn-warning" onclick="Integrations.retry('${t.id}')">Reintentar</button>`:''}
        </div>
        <div class="card-body">
            <div class="detail-meta mb-2">
                <div class="meta-item"><div class="meta-label">OT SOLSER</div><div class="meta-value">${t.otSolser||'Pendiente'}</div></div>
                <div class="meta-item"><div class="meta-label">Estado Integración</div><div class="meta-value">${t.integration}</div></div>
                <div class="meta-item"><div class="meta-label">Módulo OMEGA</div><div class="meta-value">${t.omega}</div></div>
            </div>
        </div>
        ${ints.length ? `<div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Sistema</th><th>Acción</th><th>Respuesta</th><th>Código</th><th>Estado</th><th>Reintentos</th></tr></thead>
            <tbody>${ints.map(i => `<tr><td>${i.date}</td><td>${i.system}</td><td>${i.action}</td><td>${i.response}</td><td>${i.responseCode}</td>
                <td><span class="badge ${i.status==='Exitosa'?'badge-success':'badge-danger'}">${i.status}</span></td><td>${i.retries}</td></tr>`).join('')}</tbody></table></div>` : ''}
        </div>`;
    },

    renderCostos(el, t, d) {
        const costs = d.costs.filter(c => c.tramiteId === t.id);
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Costos y Aprobaciones</h3>
            <button class="btn btn-sm btn-primary" onclick="Workflow.addCost()">Registrar Costo</button></div>
        ${costs.length ? `<div class="table-container"><table>
            <thead><tr><th>Concepto</th><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Visible Cliente</th><th>Aprobación</th><th>Acciones</th></tr></thead>
            <tbody>${costs.map(c => `<tr><td>${c.concept}</td><td>${c.type}</td><td>$${c.amount} ${c.currency}</td><td>${c.date}</td>
                <td>${c.visibleClient?'Sí':'No'}</td>
                <td><span class="badge ${c.approvalStatus==='Aprobado'?'badge-success':c.approvalStatus.includes('Pendiente')?'badge-warning':'badge-gray'}">${c.approvalStatus}</span></td>
                <td>${c.approvalStatus.includes('Pendiente')?`<button class="btn btn-sm btn-success" onclick="Workflow.approveCost('${c.id}')">Aprobar</button>`:'-'}</td>
            </tr>`).join('')}</tbody></table></div>` : '<div class="card-body"><p class="text-muted">No hay costos registrados.</p></div>'}
        </div>`;
    },

    renderComentarios(el, t, d) {
        const comments = d.comments.filter(c => c.tramiteId === t.id).sort((a,b) => b.date.localeCompare(a.date));
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Comentarios</h3><button class="btn btn-sm btn-primary" onclick="Workflow.addComment()">Nuevo Comentario</button></div>
        <div class="card-body">
            ${comments.length ? `<div class="timeline">${comments.map(c => {
                const user = d.users.find(u=>u.id===c.author);
                return `<div class="timeline-item">
                    <div class="timeline-dot ${c.type==='system'?'system':c.type==='client'?'alert':'user'}">${(user?user.name[0]:c.author[0])}</div>
                    <div class="timeline-content">
                        <div class="time">${c.date} · <span class="badge ${c.visibility==='cliente'?'badge-info':'badge-gray'}">${c.visibility}</span></div>
                        <div class="desc">${c.text}</div>
                        <div class="author">${user?user.name:c.author} · ${c.role}</div>
                    </div>
                </div>`;
            }).join('')}</div>` : '<p class="text-muted">No hay comentarios.</p>'}
        </div></div>`;
    },

    renderAlertas(el, t, d) {
        const alerts = d.alerts.filter(a => a.tramiteId === t.id);
        el.innerHTML = `<div class="card"><div class="card-header"><h3>Alertas del Trámite</h3></div>
        ${alerts.length ? `<div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Destino</th><th>Estado</th><th>Próxima Acción</th></tr></thead>
            <tbody>${alerts.map(a => `<tr><td>${a.date}</td><td>${a.type}</td><td>${a.destination}</td><td><span class="badge badge-warning">${a.status}</span></td><td>${a.nextAction}</td></tr>`).join('')}</tbody></table></div>` : '<div class="card-body"><p class="text-muted">No hay alertas.</p></div>'}
        </div>`;
    },

    renderHistorial(el, t, d) {
        const comments = d.comments.filter(c => c.tramiteId === t.id).sort((a,b) => a.date.localeCompare(b.date));
        const ints = d.integrations.filter(i => i.tramiteId === t.id);
        // Merge into unified timeline
        let events = [];
        comments.forEach(c => events.push({ date: c.date, type: 'comment', text: c.text, author: c.author, role: c.role }));
        ints.forEach(i => events.push({ date: i.date, type: 'integration', text: `${i.system}: ${i.action} - ${i.response}`, author: i.executedBy, role: 'Sistema' }));
        events.sort((a,b) => a.date.localeCompare(b.date));

        el.innerHTML = `<div class="card"><div class="card-header"><h3>Historial y Auditoría</h3></div><div class="card-body">
            <div class="timeline">${events.map(e => {
                const user = d.users.find(u=>u.id===e.author);
                return `<div class="timeline-item">
                    <div class="timeline-dot ${e.type==='integration'?'system':'user'}">${e.type==='integration'?'I':'C'}</div>
                    <div class="timeline-content">
                        <div class="time">${e.date}</div>
                        <div class="desc">${e.text}</div>
                        <div class="author">${user?user.name:e.author} · ${e.role}</div>
                    </div>
                </div>`;
            }).join('')}</div>
        </div></div>`;
    },

    // Actions
    advanceStage() {
        const t = this.currentTramite;
        if (!t || t.status === 'Cerrado') { App.toast('No se puede avanzar', 'warning'); return; }
        if (t.currentStage >= 10) { App.toast('Ya está en la última etapa', 'warning'); return; }

        App.confirm(`¿Avanzar de "${WORKFLOW_STAGES[t.currentStage-1].name}" a "${WORKFLOW_STAGES[t.currentStage].name}"?`, () => {
            const d = App.data;
            const tr = d.tramites.find(x => x.id === t.id);
            // Complete current stage
            const currentSD = d.stageDetails.find(s => s.tramiteId === t.id && s.stageId === tr.currentStage);
            if (currentSD) { currentSD.state = 'Completada'; currentSD.endDate = getNow().split(' ')[0]; }
            // Advance
            tr.currentStage++;
            tr.progress = Math.min(100, Math.round(tr.currentStage / 10 * 100));
            tr.status = 'En proceso';
            tr.lastUpdate = getNow();
            // Start next stage
            const nextSD = d.stageDetails.find(s => s.tramiteId === t.id && s.stageId === tr.currentStage);
            if (nextSD) { nextSD.state = 'En progreso'; nextSD.startDate = getNow().split(' ')[0]; }
            // Log
            d.comments.push({
                id: getNextId('COM', d.comments), tramiteId: t.id, author: getSession().userId,
                role: getSession().role, date: getNow(),
                text: `Etapa avanzada a: ${WORKFLOW_STAGES[tr.currentStage-1].name}`,
                type: 'system', visibility: 'cliente', stage: tr.currentStage
            });
            saveData(d);
            App.toast('Etapa avanzada exitosamente', 'success');
            this.showDetail(t.id);
        });
    },

    showAssignModal() {
        const d = App.data;
        const users = d.users.filter(u=>u.role!=='Robot / Agente automático'&&u.role!=='Usuario de consulta');
        App.showModal('Reasignar Trámite', `
            <div class="form-group"><label>Nuevo responsable</label><select id="modal-assign-user">${users.map(u=>`<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}</select></div>
            <div class="form-group"><label>Motivo</label><select id="modal-assign-reason"><option>Sobrecarga operativa</option><option>Vacaciones</option><option>Especialidad requerida</option><option>Cambio de etapa</option></select></div>
            <div class="form-group"><label>Observación</label><textarea id="modal-assign-obs"></textarea></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="Workflow.doAssign()">Reasignar</button>`);
    },

    doAssign() {
        const d = App.data;
        const t = d.tramites.find(x => x.id === this.currentTramite.id);
        const newUser = document.getElementById('modal-assign-user').value;
        const reason = document.getElementById('modal-assign-reason').value;
        const obs = document.getElementById('modal-assign-obs').value;
        const oldResp = t.responsible;
        t.responsible = newUser;
        t.lastUpdate = getNow();
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: t.id, author: getSession().userId,
            role: getSession().role, date: getNow(),
            text: `Reasignado de ${d.users.find(u=>u.id===oldResp)?.name||''} a ${d.users.find(u=>u.id===newUser)?.name||''}. Motivo: ${reason}. ${obs}`,
            type: 'system', visibility: 'interno', stage: t.currentStage
        });
        saveData(d);
        App.closeModal();
        App.toast('Trámite reasignado', 'success');
        this.showDetail(t.id);
    },

    addComment() {
        App.showModal('Registrar Comentario', `
            <div class="form-group"><label>Comentario</label><textarea id="modal-comment" rows="4" placeholder="Escriba su comentario..."></textarea></div>
            <div class="form-group"><label>Visibilidad</label><select id="modal-comment-vis"><option value="interno">Solo interno</option><option value="cliente">Visible al cliente</option></select></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="Workflow.saveComment()">Guardar</button>`);
    },

    saveComment() {
        const text = document.getElementById('modal-comment').value.trim();
        if (!text) { App.toast('Escriba un comentario', 'error'); return; }
        const vis = document.getElementById('modal-comment-vis').value;
        const d = App.data;
        const session = getSession();
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: this.currentTramite.id,
            author: session.userId || session.clientId, role: session.role || 'Cliente',
            date: getNow(), text: text, type: session.type === 'client' ? 'client' : 'internal',
            visibility: vis, stage: this.currentTramite.currentStage
        });
        const t = d.tramites.find(x => x.id === this.currentTramite.id);
        if (t) t.lastUpdate = getNow();
        saveData(d);
        App.closeModal();
        App.toast('Comentario registrado', 'success');
        if (this.currentTab === 'comentarios') this.switchTab('comentarios');
    },

    uploadDoc() {
        App.showModal('Adjuntar Documento (Simulado)', `
            <p style="font-size:0.85rem;color:var(--gray-500);margin-bottom:1rem;">Esta es una simulación de carga de documento.</p>
            <div class="form-group"><label>Tipo de documento</label><select id="modal-doc-type">${DOC_TYPES.map(d=>`<option>${d}</option>`).join('')}</select></div>
            <div class="form-group"><label>Nombre del archivo</label><input type="text" id="modal-doc-name" placeholder="documento.pdf"></div>
            <div class="form-group"><label>Visible al cliente</label><select id="modal-doc-vis"><option value="true">Sí</option><option value="false">No</option></select></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="Workflow.saveUpload()">Cargar</button>`);
    },

    saveUpload() {
        const d = App.data;
        const docType = document.getElementById('modal-doc-type').value;
        const name = document.getElementById('modal-doc-name').value || 'documento.pdf';
        const visible = document.getElementById('modal-doc-vis').value === 'true';
        const session = getSession();
        // Check if doc exists
        let doc = d.documents.find(dc => dc.tramiteId === this.currentTramite.id && dc.type === docType);
        if (doc) {
            doc.state = 'Recibido'; doc.uploadDate = getNow().split(' ')[0];
            doc.uploadedBy = session.userId || session.clientId; doc.version++; doc.size = Math.floor(Math.random()*500+50)+'KB';
        } else {
            d.documents.push({
                id: `DOC-${this.currentTramite.id}-${d.documents.length+1}`, tramiteId: this.currentTramite.id,
                type: docType, name: name, required: false, state: 'Recibido',
                uploadDate: getNow().split(' ')[0], uploadedBy: session.userId || session.clientId,
                version: 1, size: Math.floor(Math.random()*500+50)+'KB', observation: '',
                visibleClient: visible, validatedBy: null, validationDate: null, rejectReason: ''
            });
        }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: this.currentTramite.id, author: session.userId||session.clientId, role: session.role||'Cliente', date: getNow(), text: `Documento cargado: ${docType} (${name})`, type: 'system', visibility: 'cliente', stage: this.currentTramite.currentStage });
        saveData(d);
        App.closeModal();
        App.toast('Documento cargado', 'success');
        if (this.currentTab === 'documentos') this.switchTab('documentos');
    },

    validateDoc(docId) {
        const d = App.data;
        const doc = d.documents.find(dc => dc.id === docId);
        if (doc) { doc.state = 'Validado'; doc.validatedBy = getSession().userId; doc.validationDate = getNow().split(' ')[0]; }
        saveData(d);
        App.toast('Documento validado', 'success');
        this.switchTab('documentos');
    },

    rejectDoc(docId) {
        App.showModal('Rechazar Documento', `<div class="form-group"><label>Motivo del rechazo</label><textarea id="modal-reject-reason" placeholder="Indique el motivo..."></textarea></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-danger" onclick="Workflow.doRejectDoc('${docId}')">Rechazar</button>`);
    },

    doRejectDoc(docId) {
        const d = App.data;
        const doc = d.documents.find(dc => dc.id === docId);
        if (doc) { doc.state = 'Rechazado'; doc.rejectReason = document.getElementById('modal-reject-reason')?.value || 'No cumple requisitos'; }
        saveData(d);
        App.closeModal();
        App.toast('Documento rechazado', 'warning');
        this.switchTab('documentos');
    },

    simulateUpload(docId) {
        const d = App.data;
        const doc = d.documents.find(dc => dc.id === docId);
        if (doc) { doc.state = 'Recibido'; doc.uploadDate = getNow().split(' ')[0]; doc.uploadedBy = getSession().userId || getSession().clientId; doc.version = 1; doc.size = Math.floor(Math.random()*500+50)+'KB'; }
        saveData(d);
        App.toast('Documento cargado (simulado)', 'success');
        this.switchTab('documentos');
    },

    generateProforma() {
        const d = App.data;
        const t = this.currentTramite;
        const newProf = {
            id: getNextId('PRF', d.proformas), tramiteId: t.id,
            date: getNow().split(' ')[0], amount: Math.floor(Math.random()*3000+500),
            currency: 'USD', status: 'Pendiente', sentDate: getNow(),
            approvalDate: null, clientComment: '', items: Math.floor(Math.random()*15+3)
        };
        d.proformas.push(newProf);
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: t.id, author: getSession().userId, role: getSession().role, date: getNow(), text: `Proforma ${newProf.id} generada por $${newProf.amount} USD`, type: 'system', visibility: 'cliente', stage: 5 });
        saveData(d);
        App.toast('Proforma generada', 'success');
        this.switchTab('proforma');
    },

    approveProforma(profId) {
        const d = App.data;
        const p = d.proformas.find(pr => pr.id === profId);
        if (p) { p.status = 'Aprobada'; p.approvalDate = getNow(); }
        const t = d.tramites.find(tr => tr.id === this.currentTramite.id);
        if (t && t.currentStage === 5) { /* Allow advance */ }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: this.currentTramite.id, author: getSession().userId||getSession().clientId, role: getSession().role||'Cliente', date: getNow(), text: `Proforma ${profId} aprobada`, type: 'system', visibility: 'cliente', stage: 5 });
        saveData(d);
        App.toast('Proforma aprobada', 'success');
        this.switchTab('proforma');
    },

    addCost() {
        App.showModal('Registrar Costo', `
            <div class="form-row">
                <div class="form-group"><label>Concepto</label><select id="modal-cost-concept"><option>Almacenaje</option><option>Demora</option><option>Transporte</option><option>Inspección</option><option>Gestión documental</option><option>Tributos</option><option>Otros</option></select></div>
                <div class="form-group"><label>Tipo</label><select id="modal-cost-type"><option>Recuperable</option><option>Servicio</option><option>Interno</option></select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Monto</label><input type="number" id="modal-cost-amount" placeholder="0.00"></div>
                <div class="form-group"><label>Moneda</label><select id="modal-cost-currency"><option>USD</option><option>CRC</option></select></div>
            </div>
            <div class="form-group"><label>Observación</label><input type="text" id="modal-cost-obs" placeholder="Descripción..."></div>
            <div class="checkbox-group"><input type="checkbox" id="modal-cost-visible" checked><label for="modal-cost-visible">Visible al cliente</label></div>
            <div class="checkbox-group"><input type="checkbox" id="modal-cost-approval"><label for="modal-cost-approval">Requiere aprobación del cliente</label></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="Workflow.saveCost()">Guardar</button>`);
    },

    saveCost() {
        const d = App.data;
        const amount = parseFloat(document.getElementById('modal-cost-amount').value);
        if (!amount || amount <= 0) { App.toast('Ingrese un monto válido', 'error'); return; }
        const requiresApproval = document.getElementById('modal-cost-approval').checked;
        d.costs.push({
            id: getNextId('CST', d.costs), tramiteId: this.currentTramite.id,
            concept: document.getElementById('modal-cost-concept').value,
            type: document.getElementById('modal-cost-type').value,
            amount: amount, currency: document.getElementById('modal-cost-currency').value,
            date: getNow().split(' ')[0], support: 'Soporte adjunto',
            visibleClient: document.getElementById('modal-cost-visible').checked,
            requiresApproval: requiresApproval,
            approvalStatus: requiresApproval ? 'Pendiente cliente' : 'Aprobado',
            observation: document.getElementById('modal-cost-obs').value
        });
        saveData(d);
        App.closeModal();
        App.toast('Costo registrado', 'success');
        this.switchTab('costos');
    },

    approveCost(costId) {
        const d = App.data;
        const cost = d.costs.find(c => c.id === costId);
        if (cost) { cost.approvalStatus = 'Aprobado'; }
        saveData(d);
        App.toast('Costo aprobado', 'success');
        this.switchTab('costos');
    },

    closeTramite(tramiteId) {
        App.confirm('¿Cerrar este trámite? Se bloqueará para modificaciones operativas.', () => {
            const d = App.data;
            const t = d.tramites.find(tr => tr.id === tramiteId);
            if (t) {
                t.status = 'Cerrado'; t.currentStage = 10; t.progress = 100; t.lastUpdate = getNow();
                d.stageDetails.filter(s => s.tramiteId === tramiteId).forEach(s => { if(s.state !== 'Completada') { s.state = 'Completada'; s.endDate = getNow().split(' ')[0]; } });
            }
            d.comments.push({ id: getNextId('COM', d.comments), tramiteId: tramiteId, author: getSession().userId, role: getSession().role, date: getNow(), text: 'Trámite cerrado. Expediente archivado.', type: 'system', visibility: 'cliente', stage: 10 });
            saveData(d);
            App.toast('Trámite cerrado exitosamente', 'success');
            this.showDetail(tramiteId);
        });
    },

    printReport() {
        window.print();
        App.toast('Preparando impresión...', 'info');
    }
};
