/* ============================================
   BACKOFFICE.JS - Vista principal Backoffice
   ============================================ */

const Backoffice = {
    currentModule: 'dashboard',

    render() {
        const session = getSession();
        const app = document.getElementById('app');
        app.innerHTML = `
        <div class="app-layout">
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h3>Torre de Control</h3>
                    <span>Sistema de Trámites</span>
                </div>
                <nav class="sidebar-nav">
                    ${this.renderNav()}
                </nav>
            </aside>
            <div class="main-content">
                <header class="top-header">
                    <div class="header-left">
                        <div class="breadcrumbs" id="breadcrumbs">
                            <a href="#" onclick="Backoffice.navigate('dashboard')">Inicio</a>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="user-info">
                            <div class="user-avatar">${session.name.split(' ').map(n=>n[0]).join('')}</div>
                            <div class="user-details">
                                <div class="name">${session.name}</div>
                                <div class="role">${session.role}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="App.showWelcome();clearSession();">Cambiar acceso</button>
                        <button class="btn btn-sm btn-danger" onclick="logout()">Salir</button>
                    </div>
                </header>
                <div class="page-content" id="page-content">
                </div>
            </div>
        </div>`;
        this.navigate(this.currentModule);
    },

    renderNav() {
        const items = [
            { id: 'dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z', label: 'Resumen Ejecutivo' },
            { id: 'tramites', icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z', label: 'Gestión de Trámites' },
            { id: 'create', icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', label: 'Crear Nuevo Trámite' },
            { id: 'workflow', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', label: 'Workflow y Seguimiento' },
            { id: 'email', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', label: 'Recepción por Correo' },
            { id: 'exceptions', icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z', label: 'Excepciones' },
            { id: 'sla', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z', label: 'Monitoreo de SLA' },
            { id: 'alerts', icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', label: 'Alertas y Seguimiento' },
            { id: 'reassign', icon: 'M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z', label: 'Reasignación' },
            { id: 'reports', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', label: 'Reportes y KPI' },
            { id: 'integrations', icon: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H4c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z', label: 'Integraciones' },
            { id: 'admin', icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', label: 'Administración' },
            { id: 'audit', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z', label: 'Auditoría' }
        ];
        return items.map(item => `
            <div class="nav-item ${this.currentModule === item.id ? 'active' : ''}" onclick="Backoffice.navigate('${item.id}')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="${item.icon}"/></svg>
                <span>${item.label}</span>
            </div>`).join('');
    },

    navigate(module) {
        this.currentModule = module;
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const navItems = document.querySelectorAll('.nav-item');
        const modules = ['dashboard','tramites','create','workflow','email','exceptions','sla','alerts','reassign','reports','integrations','admin','audit'];
        const idx = modules.indexOf(module);
        if (idx >= 0 && navItems[idx]) navItems[idx].classList.add('active');

        const content = document.getElementById('page-content');
        App.data = loadData();

        switch(module) {
            case 'dashboard': this.renderDashboard(content); break;
            case 'tramites': this.renderTramites(content); break;
            case 'create': this.renderCreateTramite(content); break;
            case 'workflow': this.renderWorkflow(content); break;
            case 'email': this.renderEmail(content); break;
            case 'exceptions': this.renderExceptions(content); break;
            case 'sla': this.renderSLA(content); break;
            case 'alerts': this.renderAlerts(content); break;
            case 'reassign': this.renderReassign(content); break;
            case 'reports': this.renderReports(content); break;
            case 'integrations': this.renderIntegrations(content); break;
            case 'admin': this.renderAdmin(content); break;
            case 'audit': this.renderAudit(content); break;
            default: this.renderDashboard(content);
        }
    },

    renderDashboard(el) {
        const d = App.data;
        const active = d.tramites.filter(t => t.status !== 'Cerrado').length;
        const newMonth = d.tramites.filter(t => t.startDate >= '2026-07-01').length;
        const pendClient = d.tramites.filter(t => t.status === 'Pendiente cliente').length;
        const inReview = d.tramites.filter(t => t.currentStage === 2).length;
        const slaOk = d.tramites.filter(t => t.slaUsed <= t.slaTotal && t.status !== 'Cerrado').length;
        const slaWarn = d.tramites.filter(t => t.slaUsed > t.slaTotal * 0.8 && t.slaUsed <= t.slaTotal && t.status !== 'Cerrado').length;
        const slaLate = d.tramites.filter(t => t.slaUsed > t.slaTotal && t.status !== 'Cerrado').length;
        const exceptions = d.tramites.filter(t => t.status === 'Excepción').length;
        const pendDocs = d.documents.filter(doc => doc.state === 'Pendiente').length;
        const closed = d.tramites.filter(t => t.status === 'Cerrado').length;
        const intErrors = d.integrations.filter(i => i.status === 'Error').length;
        const pendProf = d.proformas.filter(p => p.status === 'Pendiente').length;

        el.innerHTML = `
        <h1 class="page-title">Resumen Ejecutivo</h1>
        <p class="page-subtitle">Vista general del estado de operaciones</p>
        <div class="kpi-grid">
            <div class="kpi-card info"><div class="kpi-value">${active}</div><div class="kpi-label">Trámites Activos</div></div>
            <div class="kpi-card"><div class="kpi-value">${newMonth}</div><div class="kpi-label">Nuevos del Mes</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendClient}</div><div class="kpi-label">Pendientes Cliente</div></div>
            <div class="kpi-card"><div class="kpi-value">${inReview}</div><div class="kpi-label">En Revisión</div></div>
            <div class="kpi-card success"><div class="kpi-value">${slaOk}</div><div class="kpi-label">SLA al Día</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${slaWarn}</div><div class="kpi-label">SLA por Vencer</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${slaLate}</div><div class="kpi-label">Trámites Atrasados</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${exceptions}</div><div class="kpi-label">Excepciones Abiertas</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendDocs}</div><div class="kpi-label">Docs Pendientes</div></div>
            <div class="kpi-card success"><div class="kpi-value">${closed}</div><div class="kpi-label">Cerrados</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${intErrors}</div><div class="kpi-label">Integraciones Error</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendProf}</div><div class="kpi-label">Proformas Pendientes</div></div>
        </div>
        <div class="charts-grid">
            ${this.renderChartByType(d)}
            ${this.renderChartByStage(d)}
            ${this.renderChartByResponsible(d)}
            ${this.renderChartSLACompliance(d)}
        </div>
        <div class="flex-between mb-1">
            <h3>Trámites Recientes</h3>
            <button class="btn btn-sm btn-secondary" onclick="Backoffice.navigate('tramites')">Ver todos</button>
        </div>
        ${this.renderTramiteTable(d.tramites.slice(0, 8))}
        <div style="text-align:right;margin-top:1rem;">
            <button class="btn btn-sm btn-outline" onclick="App.confirm('¿Restaurar datos de demostración? Se perderán los cambios actuales.', ()=>{resetDemoData();App.data=loadData();Backoffice.navigate(Backoffice.currentModule);App.toast('Datos restaurados','success')})">Restaurar datos demo</button>
        </div>`;
    },

    renderChartByType(d) {
        const counts = {};
        TRAMITE_TYPES.forEach(t => counts[t.name] = 0);
        d.tramites.forEach(t => { const type = TRAMITE_TYPES.find(tt => tt.id === t.type); if(type) counts[type.name]++; });
        const max = Math.max(...Object.values(counts), 1);
        const bars = Object.entries(counts).map(([k,v]) => `<div class="bar-row"><span class="bar-label">${k}</span><div class="bar-track"><div class="bar-fill" style="width:${v/max*100}%">${v}</div></div></div>`).join('');
        return `<div class="chart-card"><h4>Trámites por Tipo</h4><div class="bar-chart">${bars}</div></div>`;
    },

    renderChartByStage(d) {
        const counts = {};
        WORKFLOW_STAGES.forEach(s => counts[s.short] = 0);
        d.tramites.filter(t=>t.status!=='Cerrado').forEach(t => { const s = WORKFLOW_STAGES.find(s=>s.id===t.currentStage); if(s) counts[s.short]++; });
        const max = Math.max(...Object.values(counts), 1);
        const bars = Object.entries(counts).map(([k,v]) => `<div class="bar-row"><span class="bar-label">${k}</span><div class="bar-track"><div class="bar-fill info" style="width:${v/max*100}%">${v}</div></div></div>`).join('');
        return `<div class="chart-card"><h4>Trámites por Etapa</h4><div class="bar-chart">${bars}</div></div>`;
    },

    renderChartByResponsible(d) {
        const counts = {};
        d.tramites.filter(t=>t.status!=='Cerrado').forEach(t => {
            const u = App.data.users.find(u=>u.id===t.responsible);
            const name = u ? u.name.split(' ')[0] : 'Sin asignar';
            counts[name] = (counts[name]||0) + 1;
        });
        const max = Math.max(...Object.values(counts), 1);
        const bars = Object.entries(counts).map(([k,v]) => `<div class="bar-row"><span class="bar-label">${k}</span><div class="bar-track"><div class="bar-fill success" style="width:${v/max*100}%">${v}</div></div></div>`).join('');
        return `<div class="chart-card"><h4>Carga por Responsable</h4><div class="bar-chart">${bars}</div></div>`;
    },

    renderChartSLACompliance(d) {
        const active = d.tramites.filter(t=>t.status!=='Cerrado');
        const ok = active.filter(t=>t.slaUsed<=t.slaTotal*0.8).length;
        const warn = active.filter(t=>t.slaUsed>t.slaTotal*0.8&&t.slaUsed<=t.slaTotal).length;
        const late = active.filter(t=>t.slaUsed>t.slaTotal).length;
        const total = Math.max(active.length, 1);
        return `<div class="chart-card"><h4>Cumplimiento SLA</h4><div class="bar-chart">
            <div class="bar-row"><span class="bar-label">Al día</span><div class="bar-track"><div class="bar-fill success" style="width:${ok/total*100}%">${ok}</div></div></div>
            <div class="bar-row"><span class="bar-label">Por vencer</span><div class="bar-track"><div class="bar-fill warning" style="width:${warn/total*100}%">${warn}</div></div></div>
            <div class="bar-row"><span class="bar-label">Atrasados</span><div class="bar-track"><div class="bar-fill danger" style="width:${late/total*100}%">${late}</div></div></div>
        </div></div>`;
    },

    renderTramiteTable(tramites) {
        const rows = tramites.map(t => {
            const client = App.data.clients.find(c=>c.id===t.clientId);
            const user = App.data.users.find(u=>u.id===t.responsible);
            const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
            const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
            const slaClass = t.slaUsed > t.slaTotal ? 'red' : t.slaUsed > t.slaTotal*0.8 ? 'yellow' : 'green';
            const slaPct = Math.min(100, Math.round(t.slaUsed/t.slaTotal*100));
            const statusBadge = this.getStatusBadge(t.status);
            return `<tr onclick="Workflow.showDetail('${t.id}')" style="cursor:pointer">
                <td><strong>${t.id}</strong></td>
                <td>${client ? client.company : '-'}</td>
                <td><span class="badge badge-info">${type ? type.name : t.type}</span></td>
                <td>${stage ? stage.short : '-'}</td>
                <td>${statusBadge}</td>
                <td>${user ? user.name.split(' ')[0]+' '+user.name.split(' ')[1][0]+'.' : '-'}</td>
                <td><div class="sla-bar"><div class="sla-fill ${slaClass}" style="width:${slaPct}%"></div></div><span style="font-size:0.7rem">${slaPct}%</span></td>
                <td>${t.progress}%</td>
                <td>${formatDate(t.lastUpdate)}</td>
            </tr>`;
        }).join('');
        return `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Cliente</th><th>Tipo</th><th>Etapa</th><th>Estado</th><th>Responsable</th><th>SLA</th><th>Avance</th><th>Actualización</th></tr></thead>
            <tbody>${rows}</tbody></table></div></div>`;
    },

    getStatusBadge(status) {
        const map = { 'En proceso': 'badge-info', 'Nuevo': 'badge-purple', 'Pendiente cliente': 'badge-warning', 'Cerrado': 'badge-success', 'Excepción': 'badge-danger' };
        return `<span class="badge ${map[status]||'badge-gray'}">${status}</span>`;
    },

    renderTramites(el) {
        const d = App.data;
        el.innerHTML = `
        <h1 class="page-title">Gestión de Trámites</h1>
        <p class="page-subtitle">Bandeja completa de trámites</p>
        <div class="filters-bar">
            <div class="filter-group"><label>Buscar</label><input type="text" id="filter-text" placeholder="N° trámite, cliente..." oninput="Backoffice.applyFilters()"></div>
            <div class="filter-group"><label>Tipo</label><select id="filter-type" onchange="Backoffice.applyFilters()"><option value="">Todos</option>${TRAMITE_TYPES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Estado</label><select id="filter-status" onchange="Backoffice.applyFilters()"><option value="">Todos</option><option>En proceso</option><option>Nuevo</option><option>Pendiente cliente</option><option>Cerrado</option><option>Excepción</option></select></div>
            <div class="filter-group"><label>Etapa</label><select id="filter-stage" onchange="Backoffice.applyFilters()"><option value="">Todas</option>${WORKFLOW_STAGES.map(s=>`<option value="${s.id}">${s.short}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Prioridad</label><select id="filter-priority" onchange="Backoffice.applyFilters()"><option value="">Todas</option>${PRIORITIES.map(p=>`<option>${p}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Responsable</label><select id="filter-responsible" onchange="Backoffice.applyFilters()"><option value="">Todos</option>${d.users.map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}</select></div>
            <button class="btn btn-sm btn-secondary" onclick="Backoffice.clearFilters()">Limpiar</button>
            <button class="btn btn-sm btn-success" onclick="Backoffice.exportCSV()">Exportar CSV</button>
        </div>
        <div id="tramites-table">${this.renderTramiteTable(d.tramites)}</div>
        <div class="pagination"><span>Mostrando ${d.tramites.length} trámites</span></div>`;
    },

    applyFilters() {
        const text = (document.getElementById('filter-text')?.value || '').toLowerCase();
        const type = document.getElementById('filter-type')?.value || '';
        const status = document.getElementById('filter-status')?.value || '';
        const stage = document.getElementById('filter-stage')?.value || '';
        const priority = document.getElementById('filter-priority')?.value || '';
        const responsible = document.getElementById('filter-responsible')?.value || '';

        let filtered = App.data.tramites.filter(t => {
            const client = App.data.clients.find(c=>c.id===t.clientId);
            const matchText = !text || t.id.toLowerCase().includes(text) || (client && client.company.toLowerCase().includes(text));
            const matchType = !type || t.type === type;
            const matchStatus = !status || t.status === status;
            const matchStage = !stage || t.currentStage === parseInt(stage);
            const matchPriority = !priority || t.priority === priority;
            const matchResp = !responsible || t.responsible === responsible;
            return matchText && matchType && matchStatus && matchStage && matchPriority && matchResp;
        });

        document.getElementById('tramites-table').innerHTML = this.renderTramiteTable(filtered);
    },

    clearFilters() {
        ['filter-text','filter-type','filter-status','filter-stage','filter-priority','filter-responsible'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = '';
        });
        this.applyFilters();
    },

    exportCSV() {
        const d = App.data;
        let csv = 'Trámite,Cliente,Tipo,Régimen,Prioridad,Etapa,Estado,Responsable,SLA Usado,Avance,Inicio,ETA\n';
        d.tramites.forEach(t => {
            const client = d.clients.find(c=>c.id===t.clientId);
            const user = d.users.find(u=>u.id===t.responsible);
            const type = TRAMITE_TYPES.find(tt=>tt.id===t.type);
            const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
            csv += `${t.id},${client?client.company:''},${type?type.name:''},${t.regime},${t.priority},${stage?stage.short:''},${t.status},${user?user.name:''},${t.slaUsed}/${t.slaTotal},${t.progress}%,${t.startDate},${t.eta}\n`;
        });
        const blob = new Blob([csv], {type:'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'tramites_export.csv';
        a.click();
        App.toast('Archivo CSV exportado', 'success');
    },

    renderCreateTramite(el) {
        const d = App.data;
        el.innerHTML = `
        <h1 class="page-title">Crear Nuevo Trámite</h1>
        <p class="page-subtitle">Registrar un nuevo trámite en el sistema</p>
        <div class="card"><div class="card-body">
            <div class="form-row">
                <div class="form-group"><label>Cliente *</label><select id="new-client"><option value="">Seleccionar...</option>${d.clients.filter(c=>c.status==='Activo').map(c=>`<option value="${c.id}">${c.company}</option>`).join('')}</select></div>
                <div class="form-group"><label>Tipo de trámite *</label><select id="new-type">${TRAMITE_TYPES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Régimen *</label><select id="new-regime"><option>Definitivo</option><option>Temporal</option><option>Internacional</option><option>Nacional</option><option>PA Activo</option><option>Zona Franca</option></select></div>
                <div class="form-group"><label>Prioridad</label><select id="new-priority">${PRIORITIES.map(p=>`<option>${p}</option>`).join('')}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>N° Recibo / Referencia</label><input type="text" id="new-receipt" placeholder="REC-XXXX"></div>
                <div class="form-group"><label>ETA</label><input type="date" id="new-eta"></div>
            </div>
            <div class="form-group"><label>Descripción del servicio</label><textarea id="new-desc" placeholder="Descripción del trámite solicitado..."></textarea></div>
            <div class="form-group"><label>Observaciones</label><textarea id="new-obs" placeholder="Observaciones adicionales..."></textarea></div>
            <div style="margin-top:1rem;display:flex;gap:0.5rem;">
                <button class="btn btn-primary" onclick="Backoffice.createTramite()">Crear Trámite</button>
                <button class="btn btn-secondary" onclick="Backoffice.navigate('tramites')">Cancelar</button>
            </div>
        </div></div>`;
    },

    createTramite() {
        const clientId = document.getElementById('new-client').value;
        const type = document.getElementById('new-type').value;
        const regime = document.getElementById('new-regime').value;
        const priority = document.getElementById('new-priority').value;
        const receipt = document.getElementById('new-receipt').value || 'REC-' + Math.floor(Math.random()*9000+1000);
        const eta = document.getElementById('new-eta').value || '2026-08-01';

        if (!clientId) { App.toast('Seleccione un cliente', 'error'); return; }

        const d = App.data;
        const newId = getNextTramiteId(d.tramites);
        const session = getSession();
        const tramite = {
            id: newId, receipt: receipt, otSolser: null, clientId: clientId,
            type: type, regime: regime, priority: priority,
            startDate: getNow().split(' ')[0], eta: eta,
            currentStage: 1, status: 'Nuevo', responsible: session.userId,
            slaTotal: 7, slaUsed: 0, progress: 5, lastUpdate: getNow(),
            integration: 'Pendiente de envío', omega: TRAMITE_TYPES.find(t=>t.id===type).omega
        };

        d.tramites.push(tramite);
        // Create stage details
        WORKFLOW_STAGES.forEach(stage => {
            d.stageDetails.push({
                id: `STG-${newId}-${stage.id}`, tramiteId: newId, stageId: stage.id,
                stageName: stage.name, state: stage.id === 1 ? 'En progreso' : 'No iniciada',
                responsible: session.userId, startDate: stage.id === 1 ? getNow().split(' ')[0] : null,
                endDate: null, slaAssigned: 1, comments: [], tasks: []
            });
        });
        // Add initial comment
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: newId, author: session.userId,
            role: session.role, date: getNow(), text: 'Trámite creado manualmente desde Backoffice.',
            type: 'system', visibility: 'interno', stage: 1
        });

        saveData(d);
        App.toast(`Trámite ${newId} creado exitosamente`, 'success');
        this.navigate('tramites');
    },

    renderWorkflow(el) {
        const d = App.data;
        const active = d.tramites.filter(t => t.status !== 'Cerrado');
        const late = active.filter(t => t.slaUsed > t.slaTotal).length;
        const pendClient = active.filter(t => t.status === 'Pendiente cliente').length;
        const inProgress = active.filter(t => t.status === 'En proceso').length;

        el.innerHTML = `
        <h1 class="page-title">Workflow y Seguimiento</h1>
        <p class="page-subtitle">Seguimiento completo del ciclo de vida de cada trámite. Seleccione un trámite para ver el detalle de sus etapas.</p>
        <div class="kpi-grid" style="margin-bottom:1rem;">
            <div class="kpi-card info"><div class="kpi-value">${active.length}</div><div class="kpi-label">Trámites Activos</div></div>
            <div class="kpi-card success"><div class="kpi-value">${inProgress}</div><div class="kpi-label">En Proceso</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${pendClient}</div><div class="kpi-label">Pendientes Cliente</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${late}</div><div class="kpi-label">SLA Vencido</div></div>
        </div>
        <div class="filters-bar">
            <div class="filter-group"><label>Buscar</label><input type="text" id="wf-filter" placeholder="N° trámite, cliente, OT..." oninput="Backoffice.filterWorkflow()"></div>
            <div class="filter-group"><label>Tipo</label><select id="wf-type" onchange="Backoffice.filterWorkflow()"><option value="">Todos</option>${TRAMITE_TYPES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Etapa</label><select id="wf-stage" onchange="Backoffice.filterWorkflow()"><option value="">Todas</option>${WORKFLOW_STAGES.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Estado</label><select id="wf-status" onchange="Backoffice.filterWorkflow()"><option value="">Todos</option><option>En proceso</option><option>Nuevo</option><option>Pendiente cliente</option><option>Excepción</option></select></div>
            <div class="filter-group"><label>Prioridad</label><select id="wf-priority" onchange="Backoffice.filterWorkflow()"><option value="">Todas</option>${PRIORITIES.map(p=>`<option>${p}</option>`).join('')}</select></div>
            <div class="filter-group"><label>Responsable</label><select id="wf-responsible" onchange="Backoffice.filterWorkflow()"><option value="">Todos</option>${d.users.map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}</select></div>
            <div class="filter-group"><label>SLA</label><select id="wf-sla" onchange="Backoffice.filterWorkflow()"><option value="">Todos</option><option value="ok">Al día</option><option value="warn">Por vencer</option><option value="late">Vencido</option></select></div>
            <button class="btn btn-sm btn-secondary" onclick="Backoffice.clearWorkflowFilters()">Limpiar</button>
        </div>
        <div id="workflow-list">${this.renderWorkflowTable(active)}</div>`;
    },

    renderWorkflowTable(tramites) {
        if (!tramites.length) return '<div class="empty-state"><p>No hay trámites para mostrar con los filtros actuales.</p></div>';
        const rows = tramites.map(t => {
            const client = App.data.clients.find(c => c.id === t.clientId);
            const user = App.data.users.find(u => u.id === t.responsible);
            const type = TRAMITE_TYPES.find(tt => tt.id === t.type);
            const stage = WORKFLOW_STAGES.find(s => s.id === t.currentStage);
            const slaPct = Math.min(100, Math.round(t.slaUsed / t.slaTotal * 100));
            const slaColor = t.slaUsed > t.slaTotal ? 'red' : t.slaUsed > t.slaTotal * 0.8 ? 'yellow' : 'green';
            const pendDocs = App.data.documents.filter(dc => dc.tramiteId === t.id && dc.state === 'Pendiente').length;
            const totalDocs = App.data.documents.filter(dc => dc.tramiteId === t.id).length;
            const recvDocs = totalDocs - pendDocs;
            const nextAction = t.status === 'Pendiente cliente' ? 'Esperar cliente' : stage ? stage.name : '-';
            const priorityClass = t.priority === 'Crítica' || t.priority === 'Urgente' ? 'badge-danger' : t.priority === 'Alta' ? 'badge-warning' : 'badge-gray';

            return `<tr class="wf-row" onclick="Workflow.showDetail('${t.id}')" style="cursor:pointer;">
                <td><strong style="color:var(--accent)">${t.id}</strong><br><span style="font-size:0.7rem;color:var(--gray-400)">${t.receipt}</span></td>
                <td>${t.otSolser || '<span class="text-muted">—</span>'}</td>
                <td><strong>${client ? client.company : '-'}</strong></td>
                <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${type?type.color:'#ccc'};margin-right:4px;"></span>${type ? type.name : t.type}</td>
                <td><span class="badge ${priorityClass}">${t.priority}</span></td>
                <td>${formatDate(t.startDate)}</td>
                <td>${formatDate(t.eta)}</td>
                <td><span style="font-weight:600;color:var(--primary)">${stage ? stage.short : '-'}</span><br><span style="font-size:0.7rem;color:var(--gray-500)">${stage ? stage.name : ''}</span></td>
                <td>${this.getStatusBadge(t.status)}</td>
                <td>${user ? user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0] + '.' : '-'}</td>
                <td style="min-width:100px">
                    <div class="sla-bar" style="margin-bottom:2px"><div class="sla-fill ${slaColor}" style="width:${slaPct}%"></div></div>
                    <span style="font-size:0.7rem;color:var(--gray-500)">${t.slaUsed}d / ${t.slaTotal}d</span>
                </td>
                <td>
                    <div style="display:flex;align-items:center;gap:4px;">
                        <div style="flex:1;height:6px;background:var(--gray-200);border-radius:3px;overflow:hidden;"><div style="height:100%;width:${t.progress}%;background:var(--accent);border-radius:3px;"></div></div>
                        <span style="font-size:0.7rem;font-weight:600;">${t.progress}%</span>
                    </div>
                </td>
                <td><span style="font-size:0.75rem">${recvDocs}/${totalDocs}</span>${pendDocs > 0 ? ` <span class="badge badge-warning" style="font-size:0.6rem">${pendDocs} pend.</span>` : ''}</td>
                <td style="font-size:0.75rem;color:var(--gray-600);max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${nextAction}</td>
                <td style="font-size:0.7rem;color:var(--gray-400)">${t.lastUpdate}</td>
            </tr>`;
        }).join('');

        return `<div class="card"><div class="table-container"><table class="workflow-table">
            <thead><tr>
                <th>Trámite</th><th>OT</th><th>Cliente</th><th>Tipo</th><th>Prioridad</th>
                <th>Inicio</th><th>ETA</th><th>Etapa Actual</th><th>Estado</th><th>Responsable</th>
                <th>SLA</th><th>Avance</th><th>Docs</th><th>Próx. Acción</th><th>Actualización</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table></div>
        <div class="pagination"><span>Mostrando ${tramites.length} trámites activos</span></div>
        </div>`;
    },

    filterWorkflow() {
        const text = (document.getElementById('wf-filter')?.value || '').toLowerCase();
        const type = document.getElementById('wf-type')?.value || '';
        const stage = document.getElementById('wf-stage')?.value || '';
        const status = document.getElementById('wf-status')?.value || '';
        const priority = document.getElementById('wf-priority')?.value || '';
        const responsible = document.getElementById('wf-responsible')?.value || '';
        const sla = document.getElementById('wf-sla')?.value || '';

        let filtered = App.data.tramites.filter(t => {
            if (t.status === 'Cerrado') return false;
            const client = App.data.clients.find(c => c.id === t.clientId);
            const matchText = !text || t.id.toLowerCase().includes(text) || (client && client.company.toLowerCase().includes(text)) || (t.otSolser && t.otSolser.toLowerCase().includes(text));
            const matchType = !type || t.type === type;
            const matchStage = !stage || t.currentStage === parseInt(stage);
            const matchStatus = !status || t.status === status;
            const matchPriority = !priority || t.priority === priority;
            const matchResp = !responsible || t.responsible === responsible;
            let matchSla = true;
            if (sla === 'ok') matchSla = t.slaUsed <= t.slaTotal * 0.8;
            else if (sla === 'warn') matchSla = t.slaUsed > t.slaTotal * 0.8 && t.slaUsed <= t.slaTotal;
            else if (sla === 'late') matchSla = t.slaUsed > t.slaTotal;
            return matchText && matchType && matchStage && matchStatus && matchPriority && matchResp && matchSla;
        });
        document.getElementById('workflow-list').innerHTML = this.renderWorkflowTable(filtered);
    },

    clearWorkflowFilters() {
        ['wf-filter','wf-type','wf-stage','wf-status','wf-priority','wf-responsible','wf-sla'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this.filterWorkflow();
    },

    renderEmail(el) {
        const d = App.data;
        el.innerHTML = `
        <h1 class="page-title">Recepción por Correo</h1>
        <p class="page-subtitle">Bandeja de correos procesados por el agente automático</p>
        <div class="card"><div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Remitente</th><th>Asunto</th><th>Cliente</th><th>Tipo</th><th>Adjuntos</th><th>Confianza</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>${d.emailInbox.map(m => {
                const client = m.clientDetected ? d.clients.find(c=>c.id===m.clientDetected) : null;
                const confClass = m.confidence >= 85 ? 'badge-success' : m.confidence >= 70 ? 'badge-warning' : 'badge-danger';
                const statusClass = m.status === 'Trámite creado' ? 'badge-success' : m.status === 'Excepción' ? 'badge-danger' : 'badge-info';
                return `<tr>
                    <td>${formatDateTime(m.date)}</td>
                    <td>${m.sender}</td>
                    <td>${m.subject}</td>
                    <td>${client ? client.company : '<em class="text-muted">No identificado</em>'}</td>
                    <td>${m.typeDetected ? TRAMITE_TYPES.find(t=>t.id===m.typeDetected)?.name||'' : '-'}</td>
                    <td>${m.attachments}</td>
                    <td><span class="badge ${confClass}">${m.confidence}%</span></td>
                    <td><span class="badge ${statusClass}">${m.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="Backoffice.processEmail('${m.id}')">Procesar</button>
                    </td>
                </tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    processEmail(emailId) {
        const d = App.data;
        const email = d.emailInbox.find(e=>e.id===emailId);
        if (!email) return;
        if (email.status === 'Trámite creado') { App.toast('Este correo ya fue procesado', 'warning'); return; }
        if (!email.clientDetected) { App.toast('No se puede procesar: cliente no identificado. Requiere revisión manual.', 'warning'); return; }

        // Create tramite from email
        const newId = getNextTramiteId(d.tramites);
        const session = getSession();
        d.tramites.push({
            id: newId, receipt: 'REC-' + Math.floor(Math.random()*9000+1000), otSolser: null,
            clientId: email.clientDetected, type: email.typeDetected || 'IMP', regime: 'Definitivo',
            priority: 'Normal', startDate: getNow().split(' ')[0], eta: '2026-08-05',
            currentStage: 1, status: 'Nuevo', responsible: session.userId,
            slaTotal: 7, slaUsed: 0, progress: 5, lastUpdate: getNow(),
            integration: 'Pendiente de envío', omega: TRAMITE_TYPES.find(t=>t.id===(email.typeDetected||'IMP'))?.omega || 'DELIMP'
        });
        WORKFLOW_STAGES.forEach(stage => {
            d.stageDetails.push({ id: `STG-${newId}-${stage.id}`, tramiteId: newId, stageId: stage.id, stageName: stage.name, state: stage.id===1?'En progreso':'No iniciada', responsible: session.userId, startDate: stage.id===1?getNow().split(' ')[0]:null, endDate: null, slaAssigned: 1, comments: [], tasks: [] });
        });
        email.status = 'Trámite creado';
        d.comments.push({ id: getNextId('COM', d.comments), tramiteId: newId, author: 'USR-009', role: 'Robot / Agente automático', date: getNow(), text: `Trámite creado desde correo: ${email.subject}`, type: 'system', visibility: 'interno', stage: 1 });
        saveData(d);
        App.toast(`Trámite ${newId} creado desde correo`, 'success');
        this.renderEmail(document.getElementById('page-content'));
    },

    renderExceptions(el) {
        const d = App.data;
        const exceptions = d.tramites.filter(t => t.status === 'Excepción' || t.integration === 'Error');
        const emails = d.emailInbox.filter(e => e.status === 'Excepción');
        el.innerHTML = `
        <h1 class="page-title">Excepciones de Automatización</h1>
        <p class="page-subtitle">Casos que requieren intervención manual</p>
        <div class="kpi-grid">
            <div class="kpi-card danger"><div class="kpi-value">${exceptions.length}</div><div class="kpi-label">Trámites con excepción</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${emails.length}</div><div class="kpi-label">Correos no procesados</div></div>
            <div class="kpi-card info"><div class="kpi-value">${d.integrations.filter(i=>i.status==='Error').length}</div><div class="kpi-label">Integraciones fallidas</div></div>
        </div>
        <div class="card"><div class="card-header"><h3>Trámites con Excepción</h3></div><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Cliente</th><th>Tipo</th><th>Error</th><th>Acciones</th></tr></thead>
            <tbody>${exceptions.map(t => {
                const client = d.clients.find(c=>c.id===t.clientId);
                return `<tr><td>${t.id}</td><td>${client?client.company:''}</td><td>${t.type}</td><td><span class="badge badge-danger">${t.integration}</span></td>
                <td><button class="btn btn-sm btn-primary" onclick="Integrations.retry('${t.id}')">Reintentar</button>
                <button class="btn btn-sm btn-secondary" onclick="Workflow.showDetail('${t.id}')">Ver</button></td></tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    renderSLA(el) {
        const d = App.data;
        const active = d.tramites.filter(t=>t.status!=='Cerrado');
        const late = active.filter(t=>t.slaUsed>t.slaTotal);
        const warning = active.filter(t=>t.slaUsed>t.slaTotal*0.8&&t.slaUsed<=t.slaTotal);
        const ok = active.filter(t=>t.slaUsed<=t.slaTotal*0.8);

        el.innerHTML = `
        <h1 class="page-title">Monitoreo de SLA</h1>
        <p class="page-subtitle">Control de acuerdos de nivel de servicio</p>
        <div class="kpi-grid">
            <div class="kpi-card success"><div class="kpi-value">${ok.length}</div><div class="kpi-label">Al Día (Verde)</div></div>
            <div class="kpi-card warning"><div class="kpi-value">${warning.length}</div><div class="kpi-label">Por Vencer (Amarillo)</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${late.length}</div><div class="kpi-label">Atrasados (Rojo)</div></div>
        </div>
        <div class="card"><div class="card-header"><h3>Trámites Atrasados</h3></div><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Cliente</th><th>SLA Total</th><th>Consumido</th><th>Exceso</th><th>Etapa</th><th>Responsable</th></tr></thead>
            <tbody>${late.map(t => {
                const client = d.clients.find(c=>c.id===t.clientId);
                const user = d.users.find(u=>u.id===t.responsible);
                const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
                return `<tr><td><a href="#" onclick="Workflow.showDetail('${t.id}')">${t.id}</a></td><td>${client?client.company:''}</td><td>${t.slaTotal}d</td><td>${t.slaUsed}d</td><td class="text-danger">${(t.slaUsed-t.slaTotal).toFixed(1)}d</td><td>${stage?stage.short:''}</td><td>${user?user.name:''}</td></tr>`;
            }).join('')}</tbody></table></div></div>
        <div class="card"><div class="card-header"><h3>Por Vencer</h3></div><div class="table-container"><table>
            <thead><tr><th>Trámite</th><th>Cliente</th><th>SLA</th><th>Restante</th><th>Etapa</th><th>Responsable</th></tr></thead>
            <tbody>${warning.map(t => {
                const client = d.clients.find(c=>c.id===t.clientId);
                const user = d.users.find(u=>u.id===t.responsible);
                const stage = WORKFLOW_STAGES.find(s=>s.id===t.currentStage);
                return `<tr><td><a href="#" onclick="Workflow.showDetail('${t.id}')">${t.id}</a></td><td>${client?client.company:''}</td><td>${t.slaTotal}d</td><td class="text-warning">${(t.slaTotal-t.slaUsed).toFixed(1)}d</td><td>${stage?stage.short:''}</td><td>${user?user.name:''}</td></tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    renderAlerts(el) {
        const d = App.data;
        el.innerHTML = `
        <h1 class="page-title">Alertas y Seguimientos</h1>
        <p class="page-subtitle">Centro de notificaciones y seguimiento</p>
        <div class="card"><div class="card-header"><h3>Alertas Activas</h3><button class="btn btn-sm btn-primary" onclick="Backoffice.createAlert()">Nueva Alerta</button></div>
        <div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Trámite</th><th>Tipo</th><th>Destino</th><th>Medio</th><th>Estado</th><th>Próxima acción</th><th>Seguimiento</th></tr></thead>
            <tbody>${d.alerts.map(a => `<tr>
                <td>${formatDateTime(a.date)}</td>
                <td><a href="#" onclick="Workflow.showDetail('${a.tramiteId}')">${a.tramiteId}</a></td>
                <td><span class="badge ${a.type.includes('vencido')?'badge-danger':a.type.includes('vencer')?'badge-warning':'badge-info'}">${a.type}</span></td>
                <td>${a.destination}</td>
                <td>${a.medium}</td>
                <td><span class="badge ${a.status==='Activa'?'badge-warning':'badge-gray'}">${a.status}</span></td>
                <td>${a.nextAction}</td>
                <td>${a.followUpDate}</td>
            </tr>`).join('')}</tbody></table></div></div>`;
    },

    createAlert() {
        const d = App.data;
        App.showModal('Crear Nueva Alerta', `
            <div class="form-group"><label>Trámite</label><select id="alert-tramite">${d.tramites.filter(t=>t.status!=='Cerrado').map(t=>`<option value="${t.id}">${t.id}</option>`).join('')}</select></div>
            <div class="form-group"><label>Tipo de alerta</label><select id="alert-type"><option>Documento pendiente</option><option>SLA por vencer</option><option>Visto bueno pendiente</option><option>Error de integración</option><option>Trámite sin movimiento</option><option>Costo adicional pendiente</option></select></div>
            <div class="form-group"><label>Medio</label><select id="alert-medium"><option>Correo</option><option>Teams</option></select></div>
            <div class="form-group"><label>Próxima acción</label><input type="text" id="alert-action" placeholder="Acción requerida..."></div>
            <div class="form-group"><label>Fecha seguimiento</label><input type="date" id="alert-date"></div>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="Backoffice.saveAlert()">Crear Alerta</button>`
        );
    },

    saveAlert() {
        const d = App.data;
        const tramiteId = document.getElementById('alert-tramite').value;
        const t = d.tramites.find(tr=>tr.id===tramiteId);
        d.alerts.push({
            id: getNextId('ALR', d.alerts), tramiteId: tramiteId, clientId: t?t.clientId:'',
            type: document.getElementById('alert-type').value, date: getNow(),
            responsible: getSession().userId, destination: t?t.responsible:'',
            medium: document.getElementById('alert-medium').value, status: 'Activa',
            nextAction: document.getElementById('alert-action').value || 'Pendiente',
            followUpDate: document.getElementById('alert-date').value || getNow().split(' ')[0]
        });
        saveData(d);
        App.closeModal();
        App.toast('Alerta creada', 'success');
        this.renderAlerts(document.getElementById('page-content'));
    },

    renderReassign(el) {
        const d = App.data;
        const users = d.users.filter(u=>u.role!=='Robot / Agente automático'&&u.role!=='Usuario de consulta');
        el.innerHTML = `
        <h1 class="page-title">Reasignación de Trámites</h1>
        <p class="page-subtitle">Reasignar trámites y consultar capacidad del equipo</p>
        <h3 class="mb-1">Capacidad del Equipo</h3>
        <div class="card"><div class="table-container"><table>
            <thead><tr><th>Usuario</th><th>Rol</th><th>Asignados</th><th>Capacidad</th><th>Ocupación</th><th>Atrasados</th><th>Estado</th></tr></thead>
            <tbody>${users.map(u => {
                const assigned = d.tramites.filter(t=>t.responsible===u.id&&t.status!=='Cerrado').length;
                const pct = Math.round(assigned/u.capacity*100);
                const late = d.tramites.filter(t=>t.responsible===u.id&&t.slaUsed>t.slaTotal&&t.status!=='Cerrado').length;
                const capClass = pct > 90 ? 'high' : pct > 70 ? 'mid' : '';
                return `<tr><td>${u.name}</td><td>${u.role}</td><td>${assigned}</td><td>${u.capacity}</td>
                <td><div class="capacity-bar"><div class="capacity-track"><div class="capacity-fill ${capClass}" style="width:${pct}%"></div></div><span style="font-size:0.75rem">${pct}%</span></div></td>
                <td>${late > 0 ? `<span class="text-danger">${late}</span>` : '0'}</td>
                <td><span class="badge badge-success">Activo</span></td></tr>`;
            }).join('')}</tbody></table></div></div>
        <h3 class="mb-1 mt-2">Reasignar Trámite</h3>
        <div class="card"><div class="card-body">
            <div class="form-row">
                <div class="form-group"><label>Trámite</label><select id="reassign-tramite">${d.tramites.filter(t=>t.status!=='Cerrado').map(t=>`<option value="${t.id}">${t.id} - ${d.clients.find(c=>c.id===t.clientId)?.company||''}</option>`).join('')}</select></div>
                <div class="form-group"><label>Nuevo responsable</label><select id="reassign-user">${users.map(u=>`<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}</select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Motivo *</label><select id="reassign-reason"><option>Sobrecarga operativa</option><option>Vacaciones</option><option>Permiso</option><option>Especialidad requerida</option><option>Cambio de etapa</option><option>Ausencia temporal</option><option>Prioridad</option></select></div>
                <div class="form-group"><label>Fecha efectiva</label><input type="date" id="reassign-date" value="${getNow().split(' ')[0]}"></div>
            </div>
            <div class="form-group"><label>Observación</label><textarea id="reassign-obs" placeholder="Instrucciones o notas..."></textarea></div>
            <button class="btn btn-primary" onclick="Backoffice.doReassign()">Reasignar</button>
        </div></div>`;
    },

    doReassign() {
        const d = App.data;
        const tramiteId = document.getElementById('reassign-tramite').value;
        const newUser = document.getElementById('reassign-user').value;
        const reason = document.getElementById('reassign-reason').value;
        const obs = document.getElementById('reassign-obs').value;
        const t = d.tramites.find(tr=>tr.id===tramiteId);
        if (!t) return;
        const oldResp = t.responsible;
        t.responsible = newUser;
        t.lastUpdate = getNow();
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: tramiteId, author: getSession().userId,
            role: getSession().role, date: getNow(),
            text: `Reasignación: ${d.users.find(u=>u.id===oldResp)?.name||oldResp} → ${d.users.find(u=>u.id===newUser)?.name||newUser}. Motivo: ${reason}. ${obs}`,
            type: 'system', visibility: 'interno', stage: t.currentStage
        });
        saveData(d);
        App.toast('Trámite reasignado exitosamente', 'success');
        this.renderReassign(document.getElementById('page-content'));
    },

    renderReports(el) {
        const d = App.data;
        const active = d.tramites.filter(t=>t.status!=='Cerrado');
        const closed = d.tramites.filter(t=>t.status==='Cerrado');
        const avgSla = closed.length ? (closed.reduce((a,t)=>a+t.slaUsed,0)/closed.length).toFixed(1) : 0;
        
        el.innerHTML = `
        <h1 class="page-title">Reportes y KPI</h1>
        <p class="page-subtitle">Indicadores de rendimiento y productividad</p>
        <div class="kpi-grid">
            <div class="kpi-card info"><div class="kpi-value">${d.tramites.length}</div><div class="kpi-label">Total Trámites</div></div>
            <div class="kpi-card success"><div class="kpi-value">${closed.length}</div><div class="kpi-label">Cerrados</div></div>
            <div class="kpi-card"><div class="kpi-value">${avgSla}d</div><div class="kpi-label">Tiempo Promedio</div></div>
            <div class="kpi-card success"><div class="kpi-value">${closed.filter(t=>t.slaUsed<=t.slaTotal).length}/${closed.length}</div><div class="kpi-label">Cumplimiento SLA</div></div>
        </div>
        <div class="charts-grid">
            ${this.renderChartByType(d)}
            ${this.renderChartByStage(d)}
            ${this.renderChartByResponsible(d)}
            ${this.renderChartSLACompliance(d)}
        </div>
        <div class="flex-between"><h3>Productividad por Responsable</h3><button class="btn btn-sm btn-success" onclick="Backoffice.exportCSV()">Exportar CSV</button></div>
        <div class="card mt-1"><div class="table-container"><table>
            <thead><tr><th>Responsable</th><th>Activos</th><th>Cerrados</th><th>Atrasados</th><th>Promedio SLA</th></tr></thead>
            <tbody>${d.users.filter(u=>u.role!=='Robot / Agente automático'&&u.role!=='Usuario de consulta').map(u => {
                const uActive = d.tramites.filter(t=>t.responsible===u.id&&t.status!=='Cerrado').length;
                const uClosed = d.tramites.filter(t=>t.responsible===u.id&&t.status==='Cerrado').length;
                const uLate = d.tramites.filter(t=>t.responsible===u.id&&t.slaUsed>t.slaTotal&&t.status!=='Cerrado').length;
                const uClosedList = d.tramites.filter(t=>t.responsible===u.id&&t.status==='Cerrado');
                const uAvg = uClosedList.length ? (uClosedList.reduce((a,t)=>a+t.slaUsed,0)/uClosedList.length).toFixed(1) : '-';
                return `<tr><td>${u.name}</td><td>${uActive}</td><td>${uClosed}</td><td>${uLate}</td><td>${uAvg}d</td></tr>`;
            }).join('')}</tbody></table></div></div>`;
    },

    renderIntegrations(el) {
        const d = App.data;
        el.innerHTML = `
        <h1 class="page-title">Integraciones</h1>
        <p class="page-subtitle">Estado de conexiones con SOLSER y módulos OMEGA</p>
        <div class="kpi-grid">
            <div class="kpi-card success"><div class="kpi-value">${d.integrations.filter(i=>i.status==='Exitosa').length}</div><div class="kpi-label">Exitosas</div></div>
            <div class="kpi-card danger"><div class="kpi-value">${d.integrations.filter(i=>i.status==='Error').length}</div><div class="kpi-label">Con Error</div></div>
            <div class="kpi-card info"><div class="kpi-value">${d.tramites.filter(t=>t.integration==='Pendiente de envío').length}</div><div class="kpi-label">Pendientes</div></div>
        </div>
        <div class="card"><div class="card-header"><h3>Registro de Integraciones</h3></div><div class="table-container"><table>
            <thead><tr><th>Fecha</th><th>Trámite</th><th>Sistema</th><th>Acción</th><th>Respuesta</th><th>Código</th><th>Estado</th><th>Reintentos</th><th>Acciones</th></tr></thead>
            <tbody>${d.integrations.map(i => `<tr>
                <td>${formatDateTime(i.date)}</td><td>${i.tramiteId}</td><td><span class="badge badge-info">${i.system}</span></td>
                <td>${i.action}</td><td>${i.response}</td><td>${i.responseCode}</td>
                <td><span class="badge ${i.status==='Exitosa'?'badge-success':'badge-danger'}">${i.status}</span></td>
                <td>${i.retries}</td>
                <td>${i.status==='Error'?`<button class="btn btn-sm btn-warning" onclick="Integrations.retry('${i.tramiteId}')">Reintentar</button>`:'-'}</td>
            </tr>`).join('')}</tbody></table></div></div>`;
    },

    renderAdmin(el) {
        el.innerHTML = `
        <h1 class="page-title">Administración</h1>
        <p class="page-subtitle">Gestión de parámetros del sistema</p>
        <div class="tabs" id="admin-tabs">
            <div class="tab active" onclick="Backoffice.adminTab('users')">Usuarios</div>
            <div class="tab" onclick="Backoffice.adminTab('clients')">Clientes</div>
            <div class="tab" onclick="Backoffice.adminTab('params')">Parámetros</div>
            <div class="tab" onclick="Backoffice.adminTab('sla-config')">SLA</div>
            <div class="tab" onclick="Backoffice.adminTab('automation')">Automatización</div>
        </div>
        <div id="admin-content"></div>`;
        this.adminTab('users');
    },

    adminTab(tab) {
        document.querySelectorAll('#admin-tabs .tab').forEach(t=>t.classList.remove('active'));
        const tabNames = ['users','clients','params','sla-config','automation'];
        const idx = tabNames.indexOf(tab);
        const tabs = document.querySelectorAll('#admin-tabs .tab');
        if (tabs[idx]) tabs[idx].classList.add('active');
        const d = App.data;
        const el = document.getElementById('admin-content');

        if (tab === 'users') {
            el.innerHTML = `<div class="card"><div class="table-container"><table>
                <thead><tr><th>ID</th><th>Usuario</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Capacidad</th><th>Especialidad</th><th>Estado</th></tr></thead>
                <tbody>${d.users.map(u=>`<tr><td>${u.id}</td><td>${u.username}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.capacity}</td><td>${u.specialty}</td><td><span class="badge badge-success">${u.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
        } else if (tab === 'clients') {
            el.innerHTML = `<div class="card"><div class="table-container"><table>
                <thead><tr><th>Código</th><th>Empresa</th><th>Contacto</th><th>Correo</th><th>País</th><th>SLA</th><th>Portal</th><th>Estado</th></tr></thead>
                <tbody>${d.clients.map(c=>`<tr><td>${c.id}</td><td>${c.company}</td><td>${c.name}</td><td>${c.email}</td><td>${c.country}</td><td>${c.sla}d</td><td>${c.portalAccess?'<span class="badge badge-success">Sí</span>':'<span class="badge badge-gray">No</span>'}</td><td><span class="badge ${c.status==='Activo'?'badge-success':'badge-gray'}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
        } else if (tab === 'params') {
            el.innerHTML = `<div class="card"><div class="card-body">
                <h4 class="mb-1">Tipos de Trámite</h4>
                <table><thead><tr><th>Código</th><th>Nombre</th><th>OMEGA</th><th>Color</th></tr></thead>
                <tbody>${TRAMITE_TYPES.map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${t.omega}</td><td><span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:${t.color}"></span></td></tr>`).join('')}</tbody></table>
                <h4 class="mb-1 mt-2">Etapas del Workflow</h4>
                <table><thead><tr><th>N°</th><th>Nombre</th><th>Código</th></tr></thead>
                <tbody>${WORKFLOW_STAGES.map(s=>`<tr><td>${s.id}</td><td>${s.name}</td><td>${s.short}</td></tr>`).join('')}</tbody></table>
            </div></div>`;
        } else if (tab === 'sla-config') {
            el.innerHTML = `<div class="card"><div class="card-body">
                <h4 class="mb-1">Configuración SLA por Cliente</h4>
                <table><thead><tr><th>Cliente</th><th>SLA Estándar (días)</th><th>Prioridad Alta</th><th>Urgente</th></tr></thead>
                <tbody>${d.clients.map(c=>`<tr><td>${c.company}</td><td>${c.sla}</td><td>${Math.max(2,c.sla-2)}</td><td>${Math.max(1,c.sla-3)}</td></tr>`).join('')}</tbody></table>
            </div></div>`;
        } else if (tab === 'automation') {
            el.innerHTML = `<div class="card"><div class="card-body">
                <h4 class="mb-1">Parámetros de Automatización RPA</h4>
                <div class="form-row">
                    <div class="form-group"><label>Confianza mínima automática</label><input type="number" value="85" disabled> <small>%</small></div>
                    <div class="form-group"><label>Reintentos de lectura</label><input type="number" value="3" disabled></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Creación automática</label><div class="toggle-switch active"></div></div>
                    <div class="form-group"><label>Tamaño máximo archivo</label><input type="text" value="25 MB" disabled></div>
                </div>
                <div class="form-group"><label>Tipos de archivo permitidos</label><input type="text" value="PDF, XLS, XLSX, DOC, DOCX, JPG, PNG, XML" disabled></div>
            </div></div>`;
        }
    },

    renderAudit(el) {
        const d = App.data;
        // Build unified timeline from comments
        const entries = d.comments.slice().sort((a,b) => b.date.localeCompare(a.date));
        el.innerHTML = `
        <h1 class="page-title">Auditoría</h1>
        <p class="page-subtitle">Registro cronológico de todas las acciones del sistema</p>
        <div class="card"><div class="card-body">
            <div class="timeline">
                ${entries.slice(0, 30).map(c => {
                    const user = d.users.find(u=>u.id===c.author);
                    return `<div class="timeline-item">
                        <div class="timeline-dot ${c.type==='system'?'system':c.type==='client'?'alert':'user'}">
                            ${c.type==='system'?'S':c.type==='client'?'C':'U'}
                        </div>
                        <div class="timeline-content">
                            <div class="time">${c.date}</div>
                            <div class="desc">${c.text}</div>
                            <div class="author">${user?user.name:c.author} · ${c.role} · Trámite: ${c.tramiteId}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div></div>`;
    }
};
