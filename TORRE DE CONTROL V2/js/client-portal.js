/* ============================================
   CLIENT-PORTAL.JS - Portal de Clientes
   ============================================ */

const ClientPortal = {
    currentTab: 'resumen',

    render() {
        const session = getSession();
        const app = document.getElementById('app');
        app.innerHTML = `
        <div class="client-layout">
            <div class="main-content" style="margin-left:0">
                <div class="client-header">
                    <div style="display:flex;align-items:center;gap:1rem;">
                        <h3 style="color:var(--primary);font-size:1rem;">Torre de Control</h3>
                        <span style="font-size:0.8rem;color:var(--gray-500);">Portal de Clientes</span>
                    </div>
                    <div class="user-info">
                        <div class="user-avatar" style="background:var(--success)">${session.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div class="user-details">
                            <div class="name">${session.name}</div>
                            <div class="role">${session.company}</div>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="App.showWelcome();clearSession();">Cambiar</button>
                        <button class="btn btn-sm btn-danger" onclick="logout()">Salir</button>
                    </div>
                </div>
                <div class="client-nav" id="client-nav">
                    <div class="nav-tab active" onclick="ClientPortal.switchTab('resumen')">Resumen</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('kpis')">KPIs</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('crear')">Nuevo Trámite</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('historial')">Historial</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('documentos')">Documentos</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('proformas')">Proformas</div>
                    <div class="nav-tab" onclick="ClientPortal.switchTab('notificaciones')">Notificaciones</div>
                </div>
                <div class="client-content" id="client-content"></div>
            </div>
        </div>`;
        this.switchTab('resumen');
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('#client-nav .nav-tab').forEach(t => t.classList.remove('active'));
        const tabs = document.querySelectorAll('#client-nav .nav-tab');
        const tabNames = ['resumen','kpis','crear','historial','documentos','proformas','notificaciones'];
        const idx = tabNames.indexOf(tab);
        if (tabs[idx]) tabs[idx].classList.add('active');

        const el = document.getElementById('client-content');
        const session = getSession();
        const d = App.data = loadData();
        const myTramites = d.tramites.filter(t => t.clientId === session.clientId);

        switch(tab) {
            case 'resumen': this.renderResumen(el, myTramites, d); break;
            case 'kpis': this.renderKPIs(el, myTramites, d); break;
            case 'crear': this.renderCrear(el, d); break;
            case 'historial': this.renderHistorial(el, myTramites, d); break;
            case 'documentos': this.renderDocumentos(el, myTramites, d); break;
            case 'proformas': this.renderProformas(el, myTramites, d); break;
            case 'notificaciones': this.renderNotificaciones(el, myTramites, d); break;
        }
    },

    renderResumen(el, tramites, d) {
        const active = tramites.filter(t => t.status !== 'Cerrado');
        const pendDocs = d.documents.filter(dc => tramites.some(t=>t.id===dc.tramiteId) && dc.state === 'Pendiente' && dc.visibleClient).length;
        const closed = tramites.filter(t => t.status === 'Cerrado').length;
        const slaOk = active.filter(t => t.slaUsed <= t.slaTotal).length;

        el.innerHTML = `
        <h1 class="page-title">Bienvenido, ${getSession().name}</h1>
        <p class="page-subtitle">${getSession().company} · Resumen de sus trámites</p>
        <div class="kpi-grid">
            <div class="kpi-card info"><div class="kpi-value">${active.length}</div><div class="kpi-label">Trámites Activos</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendDocs}</div><div class="kpi-label">Documentos Pendientes</div></div>
            <div class="kpi-card success"><div class="kpi-value">${slaOk}/${active.length}</div><div class="kpi-label">En SLA</div></div>
            <div class="kpi-card"><div class="kpi-value">${closed}</div><div class="kpi-label">Cerrados</div></div>
        </div>
        <h3 class="mb-1">Trámites Recientes</h3>
        <div class="card"><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Tipo</th><th>Etapa</th><th>Estado</th><th>SLA</th><th>Avance</th><th>Acciones</th></tr></thead>
            <tbody>${active.slice(0,5).map(t => {
                const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
                const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
                const slaPct = Math.min(100, Math.round(t.slaUsed/t.slaTotal*100));
                const slaClass = t.slaUsed > t.slaTotal ? 'red' : t.slaUsed > t.slaTotal*0.8 ? 'yellow' : 'green';
                return `<tr>
                    <td><strong>${t.id}</strong></td><td>${type?type.name:''}</td><td>${stage?stage.short:''}</td>
                    <td>${Backoffice.getStatusBadge(t.status)}</td>
                    <td><div class="sla-bar"><div class="sla-fill ${slaClass}" style="width:${slaPct}%"></div></div></td>
                    <td>${t.progress}%</td>
                    <td><button class="btn btn-sm btn-primary" onclick="ClientPortal.viewDetail('${t.id}')">Ver</button></td>
                </tr>`;
            }).join('')}</tbody></table></div></div>
        ${d.comments.filter(c => tramites.some(t=>t.id===c.tramiteId) && c.visibility==='cliente').length ? `
        <h3 class="mb-1 mt-2">Mensajes Recientes</h3>
        <div class="card"><div class="card-body">
            ${d.comments.filter(c => tramites.some(t=>t.id===c.tramiteId) && c.visibility==='cliente').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(c => `
                <div style="padding:0.5rem 0;border-bottom:1px solid var(--gray-100);font-size:0.85rem;">
                    <div class="flex-between"><span><strong>${c.tramiteId}</strong> · ${c.text.substring(0,80)}</span><span class="text-muted">${c.date}</span></div>
                </div>`).join('')}
        </div></div>` : ''}`;
    },

    renderKPIs(el, tramites, d) {
        const active = tramites.filter(t => t.status !== 'Cerrado');
        const closed = tramites.filter(t => t.status === 'Cerrado');
        const slaCompliance = closed.length ? Math.round(closed.filter(t=>t.slaUsed<=t.slaTotal).length/closed.length*100) : 100;
        const avgTime = closed.length ? (closed.reduce((a,t)=>a+t.slaUsed,0)/closed.length).toFixed(1) : '-';
        const pendDocs = d.documents.filter(dc => tramites.some(t=>t.id===dc.tramiteId) && dc.state==='Pendiente' && dc.visibleClient).length;
        const critical = active.filter(t => t.slaUsed > t.slaTotal).length;

        // By type
        const byType = {};
        TRAMITE_TYPES.forEach(tt => byType[tt.name] = tramites.filter(t=>t.type===tt.id).length);
        const maxType = Math.max(...Object.values(byType), 1);

        // By status
        const byStatus = {};
        ['En proceso','Nuevo','Pendiente cliente','Cerrado','Excepción'].forEach(s => byStatus[s] = tramites.filter(t=>t.status===s).length);
        const maxStatus = Math.max(...Object.values(byStatus), 1);

        el.innerHTML = `
        <h1 class="page-title">KPIs de ${getSession().company}</h1>
        <p class="page-subtitle">Indicadores de rendimiento de sus trámites</p>
        <div class="kpi-grid">
            <div class="kpi-card info"><div class="kpi-value">${tramites.length}</div><div class="kpi-label">Total Trámites</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${active.filter(t=>t.status==='Pendiente cliente').length}</div><div class="kpi-label">Pendientes Suyas</div></div>
            <div class="kpi-card success"><div class="kpi-value">${slaCompliance}%</div><div class="kpi-label">Cumplimiento SLA</div></div>
            <div class="kpi-card"><div class="kpi-value">${avgTime}d</div><div class="kpi-label">Tiempo Promedio</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendDocs}</div><div class="kpi-label">Docs Pendientes</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${critical}</div><div class="kpi-label">Casos Críticos</div></div>
        </div>
        <div class="charts-grid">
            <div class="chart-card"><h4>Trámites por Tipo</h4><div class="bar-chart">
                ${Object.entries(byType).filter(([,v])=>v>0).map(([k,v]) => `<div class="bar-row"><span class="bar-label">${k}</span><div class="bar-track"><div class="bar-fill" style="width:${v/maxType*100}%">${v}</div></div></div>`).join('')}
            </div></div>
            <div class="chart-card"><h4>Trámites por Estado</h4><div class="bar-chart">
                ${Object.entries(byStatus).filter(([,v])=>v>0).map(([k,v]) => `<div class="bar-row"><span class="bar-label">${k}</span><div class="bar-track"><div class="bar-fill info" style="width:${v/maxStatus*100}%">${v}</div></div></div>`).join('')}
            </div></div>
        </div>
        <div style="text-align:right;margin-top:1rem;">
            <button class="btn btn-sm btn-success" onclick="ClientPortal.exportKPI()">Exportar KPIs a CSV</button>
        </div>`;
    },

    exportKPI() {
        const session = getSession();
        const d = App.data;
        const tramites = d.tramites.filter(t => t.clientId === session.clientId);
        let csv = 'Trámite,Tipo,Estado,Etapa,SLA Usado,SLA Total,Avance,Inicio,ETA\n';
        tramites.forEach(t => {
            const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
            const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
            csv += `${t.id},${type?type.name:''},${t.status},${stage?stage.short:''},${t.slaUsed},${t.slaTotal},${t.progress}%,${t.startDate},${t.eta}\n`;
        });
        const blob = new Blob([csv], {type:'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `kpi_${session.company.replace(/\s+/g,'_')}.csv`;
        a.click();
        App.toast('KPIs exportados', 'success');
    },

    renderCrear(el, d) {
        el.innerHTML = `
        <h1 class="page-title">Crear Nuevo Trámite</h1>
        <p class="page-subtitle">Registre una nueva solicitud de servicio</p>
        <div class="card"><div class="card-body">
            <div class="form-row">
                <div class="form-group"><label>Tipo de trámite *</label><select id="cli-type">${TRAMITE_TYPES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>Régimen</label><select id="cli-regime"><option>Definitivo</option><option>Temporal</option><option>Internacional</option><option>Nacional</option><option>PA Activo</option><option>Zona Franca</option></select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Prioridad</label><select id="cli-priority">${PRIORITIES.map(p=>`<option>${p}</option>`).join('')}</select></div>
                <div class="form-group"><label>N° Recibo / Referencia</label><input type="text" id="cli-receipt" placeholder="Referencia interna..."></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>ETA estimado</label><input type="date" id="cli-eta"></div>
                <div class="form-group"><label>Servicio solicitado</label><input type="text" id="cli-service" placeholder="Describa el servicio..."></div>
            </div>
            <div class="form-group"><label>Descripción</label><textarea id="cli-desc" placeholder="Detalle de la solicitud..."></textarea></div>
            <div class="form-group"><label>Observaciones</label><textarea id="cli-obs" placeholder="Notas adicionales..."></textarea></div>
            <button class="btn btn-primary" onclick="ClientPortal.createTramite()">Enviar Solicitud</button>
        </div></div>`;
    },

    createTramite() {
        const session = getSession();
        const d = App.data;
        const type = document.getElementById('cli-type').value;
        const regime = document.getElementById('cli-regime').value;
        const priority = document.getElementById('cli-priority').value;
        const receipt = document.getElementById('cli-receipt').value || 'REF-' + Math.floor(Math.random()*9000+1000);
        const eta = document.getElementById('cli-eta').value || '2026-08-10';
        const desc = document.getElementById('cli-desc').value;

        const newId = getNextTramiteId(d.tramites);
        d.tramites.push({
            id: newId, receipt: receipt, otSolser: null, clientId: session.clientId,
            type: type, regime: regime, priority: priority,
            startDate: getNow().split(' ')[0], eta: eta,
            currentStage: 1, status: 'Nuevo',
            responsible: 'USR-003', // Assigned to ESC
            slaTotal: 7, slaUsed: 0, progress: 5, lastUpdate: getNow(),
            integration: 'Pendiente de envío', omega: TRAMITE_TYPES.find(t=>t.id===type).omega
        });
        WORKFLOW_STAGES.forEach(stage => {
            d.stageDetails.push({ id: `STG-${newId}-${stage.id}`, tramiteId: newId, stageId: stage.id, stageName: stage.name, state: stage.id===1?'En progreso':'No iniciada', responsible: 'USR-003', startDate: stage.id===1?getNow().split(' ')[0]:null, endDate: null, slaAssigned: 1, comments: [], tasks: [] });
        });
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: newId, author: session.clientId, role: 'Cliente', date: getNow(), text: `Solicitud creada desde portal. ${desc}`, type: 'client', visibility: 'cliente', stage: 1 });
        saveData(d);
        App.toast(`Solicitud ${newId} creada exitosamente. Pendiente de validación documental.`, 'success');
        this.switchTab('historial');
    },

    renderHistorial(el, tramites, d) {
        el.innerHTML = `
        <h1 class="page-title">Historial de Trámites</h1>
        <p class="page-subtitle">Todos sus trámites registrados</p>
        <div class="filters-bar">
            <div class="filter-group"><label>Buscar</label><input type="text" id="cli-filter" oninput="ClientPortal.filterHistory()" placeholder="Buscar..."></div>
            <div class="filter-group"><label>Estado</label><select id="cli-status" onchange="ClientPortal.filterHistory()"><option value="">Todos</option><option>En proceso</option><option>Nuevo</option><option>Pendiente cliente</option><option>Cerrado</option></select></div>
        </div>
        <div id="cli-history-table">${this.renderHistoryTable(tramites, d)}</div>`;
    },

    renderHistoryTable(tramites, d) {
        return `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Tipo</th><th>Régimen</th><th>Inicio</th><th>ETA</th><th>Etapa</th><th>Estado</th><th>Avance</th><th>Acciones</th></tr></thead>
            <tbody>${tramites.map(t => {
                const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
                const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
                return `<tr>
                    <td><strong>${t.id}</strong></td><td>${type?type.name:''}</td><td>${t.regime}</td>
                    <td>${formatDate(t.startDate)}</td><td>${formatDate(t.eta)}</td>
                    <td>${stage?stage.short:''}</td><td>${Backoffice.getStatusBadge(t.status)}</td><td>${t.progress}%</td>
                    <td><button class="btn btn-sm btn-primary" onclick="ClientPortal.viewDetail('${t.id}')">Detalle</button></td>
                </tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    filterHistory() {
        const session = getSession();
        const d = App.data;
        const text = (document.getElementById('cli-filter')?.value||'').toLowerCase();
        const status = document.getElementById('cli-status')?.value||'';
        let filtered = d.tramites.filter(t => {
            if (t.clientId !== session.clientId) return false;
            const matchText = !text || t.id.toLowerCase().includes(text);
            const matchStatus = !status || t.status === status;
            return matchText && matchStatus;
        });
        document.getElementById('cli-history-table').innerHTML = this.renderHistoryTable(filtered, d);
    },

    renderDocumentos(el, tramites, d) {
        const pendDocs = d.documents.filter(dc => tramites.some(t=>t.id===dc.tramiteId) && dc.state==='Pendiente' && dc.visibleClient);
        el.innerHTML = `
        <h1 class="page-title">Documentos Pendientes</h1>
        <p class="page-subtitle">Documentos que requieren su atención</p>
        ${pendDocs.length ? `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Documento</th><th>Obligatorio</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>${pendDocs.map(dc => `<tr>
                <td>${dc.tramiteId}</td><td>${dc.type}</td><td>${dc.required?'Sí':'No'}</td>
                <td><span class="badge badge-warning">${dc.state}</span></td>
                <td><button class="btn btn-sm btn-primary" onclick="ClientPortal.uploadClientDoc('${dc.id}')">Cargar</button></td>
            </tr>`).join('')}</tbody></table></div></div>` : '<div class="card"><div class="card-body"><p class="text-muted text-center">No tiene documentos pendientes. ¡Todo al día!</p></div></div>'}`;
    },

    uploadClientDoc(docId) {
        App.showModal('Cargar Documento', `
            <p style="font-size:0.85rem;color:var(--gray-500);margin-bottom:1rem;">Simulación de carga de archivo.</p>
            <div class="form-group"><label>Nombre del archivo</label><input type="text" id="cli-doc-name" placeholder="archivo.pdf"></div>
            <div class="form-group"><label>Observación</label><input type="text" id="cli-doc-obs" placeholder="Nota opcional..."></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="ClientPortal.doUploadDoc('${docId}')">Cargar</button>`);
    },

    doUploadDoc(docId) {
        const d = App.data;
        const doc = d.documents.find(dc => dc.id === docId);
        if (doc) {
            doc.state = 'Recibido'; doc.uploadDate = getNow().split(' ')[0];
            doc.uploadedBy = getSession().clientId; doc.version = (doc.version||0) + 1;
            doc.size = Math.floor(Math.random()*500+50) + 'KB';
        }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: doc.tramiteId, author: getSession().clientId, role: 'Cliente', date: getNow(), text: `Documento cargado por cliente: ${doc.type}`, type: 'client', visibility: 'cliente', stage: 2 });
        saveData(d);
        App.closeModal();
        App.toast('Documento cargado exitosamente', 'success');
        this.switchTab('documentos');
    },

    renderProformas(el, tramites, d) {
        const proformas = d.proformas.filter(p => tramites.some(t=>t.id===p.tramiteId));
        const costs = d.costs.filter(c => tramites.some(t=>t.id===c.tramiteId) && c.visibleClient);
        el.innerHTML = `
        <h1 class="page-title">Proformas y Aprobaciones</h1>
        <p class="page-subtitle">Proformas y costos pendientes de aprobación</p>
        ${proformas.length ? `<div class="card"><div class="card-header"><h3>Proformas</h3></div><div class="table-container"><table>
            <thead><tr><th>ID</th><th>Trámite</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>${proformas.map(p => `<tr>
                <td>${p.id}</td><td>${p.tramiteId}</td><td>${p.date}</td><td>$${p.amount} ${p.currency}</td>
                <td><span class="badge ${p.status==='Aprobada'?'badge-success':'badge-warning'}">${p.status}</span></td>
                <td>${p.status==='Pendiente' ? `
                    <button class="btn btn-sm btn-success" onclick="ClientPortal.approveProforma('${p.id}')">Aprobar</button>
                    <button class="btn btn-sm btn-danger" onclick="ClientPortal.rejectProforma('${p.id}')">Rechazar</button>` : '✓ Aprobada'}
                </td>
            </tr>`).join('')}</tbody></table></div></div>` : '<div class="card"><div class="card-body"><p class="text-muted">No hay proformas pendientes.</p></div></div>'}
        ${costs.filter(c=>c.approvalStatus.includes('Pendiente')).length ? `
        <h3 class="mt-2 mb-1">Costos Adicionales Pendientes</h3>
        <div class="card"><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Concepto</th><th>Monto</th><th>Observación</th><th>Acciones</th></tr></thead>
            <tbody>${costs.filter(c=>c.approvalStatus.includes('Pendiente')).map(c => `<tr>
                <td>${c.tramiteId}</td><td>${c.concept}</td><td>$${c.amount} ${c.currency}</td><td>${c.observation}</td>
                <td><button class="btn btn-sm btn-success" onclick="ClientPortal.approveCost('${c.id}')">Aprobar</button></td>
            </tr>`).join('')}</tbody></table></div></div>` : ''}`;
    },

    approveProforma(profId) {
        const d = App.data;
        const p = d.proformas.find(pr => pr.id === profId);
        if (p) { p.status = 'Aprobada'; p.approvalDate = getNow(); }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: p.tramiteId, author: getSession().clientId, role: 'Cliente', date: getNow(), text: `Proforma ${profId} aprobada por el cliente`, type: 'client', visibility: 'cliente', stage: 5 });
        saveData(d);
        App.toast('Proforma aprobada', 'success');
        this.switchTab('proformas');
    },

    rejectProforma(profId) {
        App.showModal('Rechazar Proforma', `<div class="form-group"><label>Motivo del rechazo</label><textarea id="cli-reject-reason" placeholder="Indique el motivo..."></textarea></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-danger" onclick="ClientPortal.doRejectProforma('${profId}')">Rechazar</button>`);
    },

    doRejectProforma(profId) {
        const d = App.data;
        const p = d.proformas.find(pr => pr.id === profId);
        const reason = document.getElementById('cli-reject-reason')?.value || 'Sin motivo';
        if (p) { p.status = 'Rechazada'; p.clientComment = reason; }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: p.tramiteId, author: getSession().clientId, role: 'Cliente', date: getNow(), text: `Proforma ${profId} rechazada. Motivo: ${reason}`, type: 'client', visibility: 'cliente', stage: 5 });
        saveData(d);
        App.closeModal();
        App.toast('Proforma rechazada', 'warning');
        this.switchTab('proformas');
    },

    approveCost(costId) {
        const d = App.data;
        const cost = d.costs.find(c => c.id === costId);
        if (cost) { cost.approvalStatus = 'Aprobado'; }
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: cost.tramiteId, author: getSession().clientId, role: 'Cliente', date: getNow(), text: `Costo adicional aprobado: ${cost.concept} $${cost.amount}`, type: 'client', visibility: 'cliente', stage: cost.tramiteId ? 8 : 0 });
        saveData(d);
        App.toast('Costo aprobado', 'success');
        this.switchTab('proformas');
    },

    renderNotificaciones(el, tramites, d) {
        const alerts = d.alerts.filter(a => tramites.some(t=>t.id===a.tramiteId));
        const comments = d.comments.filter(c => tramites.some(t=>t.id===c.tramiteId) && c.visibility==='cliente').sort((a,b)=>b.date.localeCompare(a.date));
        el.innerHTML = `
        <h1 class="page-title">Notificaciones</h1>
        <p class="page-subtitle">Alertas y comunicaciones de sus trámites</p>
        ${alerts.length ? `<div class="card"><div class="card-header"><h3>Alertas</h3></div><div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Trámite</th><th>Tipo</th><th>Próxima Acción</th><th>Estado</th></tr></thead>
            <tbody>${alerts.map(a => `<tr><td>${a.date}</td><td>${a.tramiteId}</td><td>${a.type}</td><td>${a.nextAction}</td><td><span class="badge badge-warning">${a.status}</span></td></tr>`).join('')}</tbody></table></div></div>` : ''}
        <div class="card mt-2"><div class="card-header"><h3>Historial de Comunicaciones</h3></div><div class="card-body">
            <div class="timeline">
                ${comments.slice(0,15).map(c => `<div class="timeline-item">
                    <div class="timeline-dot ${c.type==='client'?'user':'system'}">${c.type==='client'?'C':'S'}</div>
                    <div class="timeline-content">
                        <div class="time">${c.date} · ${c.tramiteId}</div>
                        <div class="desc">${c.text}</div>
                        <div class="author">${c.role}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div></div>`;
    },

    viewDetail(tramiteId) {
        const d = App.data;
        const t = d.tramites.find(tr => tr.id === tramiteId);
        if (!t) return;
        const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
        const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
        const user = d.users.find(u=>u.id===t.responsible);
        const docs = d.documents.filter(dc => dc.tramiteId === t.id && dc.visibleClient);
        const comments = d.comments.filter(c => c.tramiteId === t.id && c.visibility === 'cliente').sort((a,b)=>b.date.localeCompare(a.date));
        const proformas = d.proformas.filter(p => p.tramiteId === t.id);
        const slaPct = Math.min(100, Math.round(t.slaUsed/t.slaTotal*100));
        const slaClass = t.slaUsed > t.slaTotal ? 'red' : t.slaUsed > t.slaTotal*0.8 ? 'yellow' : 'green';

        const el = document.getElementById('client-content');
        el.innerHTML = `
        <div class="breadcrumbs mb-1"><a href="#" onclick="ClientPortal.switchTab('historial')">Historial</a> <span>›</span> <strong>${t.id}</strong></div>
        <div class="detail-header">
            <div class="detail-title"><h2>${t.id}</h2><div>${Backoffice.getStatusBadge(t.status)} <span class="badge badge-info">${type?type.name:''}</span></div></div>
            <div class="detail-meta">
                <div class="meta-item"><div class="meta-label">Tipo</div><div class="meta-value">${type?type.name:''}</div></div>
                <div class="meta-item"><div class="meta-label">Inicio</div><div class="meta-value">${formatDate(t.startDate)}</div></div>
                <div class="meta-item"><div class="meta-label">ETA</div><div class="meta-value">${formatDate(t.eta)}</div></div>
                <div class="meta-item"><div class="meta-label">Responsable</div><div class="meta-value">${user?user.name:'-'}</div></div>
                <div class="meta-item"><div class="meta-label">Etapa</div><div class="meta-value">${stage?stage.name:'-'}</div></div>
                <div class="meta-item"><div class="meta-label">Avance</div><div class="meta-value">${t.progress}%</div></div>
                <div class="meta-item"><div class="meta-label">SLA</div><div class="meta-value"><div class="sla-bar"><div class="sla-fill ${slaClass}" style="width:${slaPct}%"></div></div>${slaPct}%</div></div>
            </div>
        </div>

        <div class="card"><div class="card-header"><h3>Workflow</h3></div><div class="card-body">
            <div class="workflow-timeline">
                ${WORKFLOW_STAGES.map(s => {
                    let cls = 'not-started';
                    if (s.id < t.currentStage) cls = 'completed';
                    else if (s.id === t.currentStage) cls = t.status==='Pendiente cliente' ? 'blocked' : 'in-progress';
                    if (t.status === 'Cerrado') cls = 'completed';
                    return `<div class="workflow-step ${cls}"><div class="step-circle">${s.id}</div><div class="step-label">${s.short}</div></div>`;
                }).join('')}
            </div>
        </div></div>

        <div class="charts-grid">
            <div class="card"><div class="card-header"><h3>Documentos</h3></div><div class="table-container"><table>
                <thead><tr><th>Documento</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>${docs.map(dc => `<tr><td>${dc.type}</td><td><span class="badge ${dc.state==='Validado'?'badge-success':dc.state==='Pendiente'?'badge-warning':'badge-info'}">${dc.state}</span></td>
                <td>${dc.state==='Pendiente'?`<button class="btn btn-sm btn-primary" onclick="ClientPortal.uploadClientDoc('${dc.id}')">Cargar</button>`:'-'}</td></tr>`).join('')}</tbody></table></div></div>
            <div class="card"><div class="card-header"><h3>Comentarios</h3><button class="btn btn-sm btn-primary" onclick="ClientPortal.addClientComment('${t.id}')">Agregar</button></div><div class="card-body">
                <div class="timeline">${comments.slice(0,5).map(c=>`<div class="timeline-item"><div class="timeline-dot ${c.type==='client'?'user':'system'}">${c.type==='client'?'C':'S'}</div><div class="timeline-content"><div class="time">${c.date}</div><div class="desc">${c.text}</div></div></div>`).join('')}</div>
            </div></div>
        </div>

        ${proformas.length ? `<div class="card"><div class="card-header"><h3>Proformas</h3></div><div class="table-container"><table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>${proformas.map(p=>`<tr><td>${p.id}</td><td>${p.date}</td><td>$${p.amount}</td><td><span class="badge ${p.status==='Aprobada'?'badge-success':'badge-warning'}">${p.status}</span></td><td>${p.status==='Pendiente'?`<button class="btn btn-sm btn-success" onclick="ClientPortal.approveProforma('${p.id}')">Aprobar</button><button class="btn btn-sm btn-danger" onclick="ClientPortal.rejectProforma('${p.id}')">Rechazar</button>`:'✓'}</td></tr>`).join('')}</tbody></table></div></div>` : ''}
        `;
    },

    addClientComment(tramiteId) {
        App.showModal('Agregar Observación', `
            <div class="form-group"><label>Comentario</label><textarea id="cli-comment" rows="4" placeholder="Escriba su observación..."></textarea></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="ClientPortal.saveClientComment('${tramiteId}')">Enviar</button>`);
    },

    saveClientComment(tramiteId) {
        const text = document.getElementById('cli-comment')?.value?.trim();
        if (!text) { App.toast('Escriba un comentario', 'error'); return; }
        const d = App.data;
        const session = getSession();
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: tramiteId,
            author: session.clientId, role: 'Cliente', date: getNow(),
            text: text, type: 'client', visibility: 'cliente', stage: 0
        });
        const t = d.tramites.find(tr=>tr.id===tramiteId);
        if (t) t.lastUpdate = getNow();
        saveData(d);
        App.closeModal();
        App.toast('Observación registrada', 'success');
        this.viewDetail(tramiteId);
    }
};
