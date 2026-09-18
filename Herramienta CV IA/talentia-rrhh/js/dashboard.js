function renderDashboard() {
    const activos = CANDIDATOS.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
    const procesados = activos.filter(c => c.estado !== 'Nuevo').length;
    const seleccionados = activos.filter(c => c.estado === 'Seleccionado' || c.estado === 'En entrevista' || c.estado === 'Contratado').length;
    const pendientes = activos.filter(c => c.estado === 'Pendiente de revisión' || c.estado === 'Nuevo' || c.estado === 'En primer filtro').length;
    const contratados = activos.filter(c => c.estado === 'Contratado').length;
    const vacantesActivas = VACANTES.filter(v => v.estado !== 'Cerrada' && v.estado !== 'Finalizada').length;
    const vacantesCerradas = VACANTES.filter(v => v.estado === 'Cerrada' || v.estado === 'Finalizada').length;

    return `
    <div class="filters-bar">
        <div class="filter-group"><label>Fecha desde</label><input type="date" value="2026-06-01"></div>
        <div class="filter-group"><label>Fecha hasta</label><input type="date" value="2026-07-01"></div>
        <div class="filter-group"><label>Vacante</label><select><option value="">Todas</option>${VACANTES.map(v=>`<option>${v.nombre}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Fuente</label><select><option value="">Todas</option>${FUENTES.map(f=>`<option>${f}</option>`).join('')}</select></div>
        <div class="filter-group"><label>Estado</label><select><option value="">Todos</option>${ESTADOS_CANDIDATO.map(e=>`<option>${e}</option>`).join('')}</select></div>
        <div class="filter-group" style="justify-content:flex-end">
            <label>&nbsp;</label>
            <button class="btn btn-sm btn-success" onclick="exportarDashboardExcel()"><i class="fas fa-file-excel"></i> Exportar a Excel</button>
        </div>
    </div>
    <div class="cards-grid">
        <div class="card"><div class="card-icon blue"><i class="fas fa-users"></i></div><div class="card-value">${activos.length}</div><div class="card-label">Candidatos activos</div></div>
        <div class="card"><div class="card-icon purple"><i class="fas fa-robot"></i></div><div class="card-value">${procesados}</div><div class="card-label">Procesados por IA</div></div>
        <div class="card"><div class="card-icon green"><i class="fas fa-briefcase"></i></div><div class="card-value">${vacantesActivas}</div><div class="card-label">Vacantes activas</div></div>
        <div class="card"><div class="card-icon accent"><i class="fas fa-star"></i></div><div class="card-value">${seleccionados}</div><div class="card-label">Seleccionados</div></div>
        <div class="card"><div class="card-icon yellow"><i class="fas fa-clock"></i></div><div class="card-value">${pendientes}</div><div class="card-label">Pendientes revisión</div></div>
        <div class="card"><div class="card-icon green"><i class="fas fa-trophy"></i></div><div class="card-value">${contratados}</div><div class="card-label">Contratados</div></div>
        <div class="card"><div class="card-icon red"><i class="fas fa-lock"></i></div><div class="card-value">${vacantesCerradas}</div><div class="card-label">Vacantes cerradas</div></div>

    </div>
    <div class="charts-grid">
        <div class="chart-card"><h3>Candidatos por Semana (Últimas 4 semanas)</h3><canvas id="chart-semana-candidatos"></canvas></div>
        <div class="chart-card"><h3>Scoring Promedio por Semana (Últimas 4 semanas)</h3><canvas id="chart-semana-scoring"></canvas></div>
        <div class="chart-card"><h3>Candidatos por Fuente</h3><canvas id="chart-fuente"></canvas></div>
        <div class="chart-card"><h3>Candidatos por Estado</h3><canvas id="chart-estado"></canvas></div>
        <div class="chart-card"><h3>Distribución de Scoring</h3><canvas id="chart-scoring"></canvas></div>
        <div class="chart-card"><h3>Vacantes por Volumen</h3><canvas id="chart-vacantes"></canvas></div>
    </div>`;
}

function initDashboardCharts() {
    const activos = CANDIDATOS.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto');

    // --- LINE CHART: Candidatos por semana (últimas 4 semanas) ---
    const semanasLabels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const candidatosPorSemana = [
        Math.floor(activos.length * 0.18),
        Math.floor(activos.length * 0.27),
        Math.floor(activos.length * 0.30),
        activos.length - Math.floor(activos.length * 0.18) - Math.floor(activos.length * 0.27) - Math.floor(activos.length * 0.30)
    ];
    new Chart(document.getElementById('chart-semana-candidatos'), {
        type: 'line',
        data: {
            labels: semanasLabels,
            datasets: [{
                label: 'Candidatos recibidos',
                data: candidatosPorSemana,
                borderColor: '#4da8da',
                backgroundColor: 'rgba(77,168,218,0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#4da8da',
                pointRadius: 5
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });

    // --- LINE CHART: Scoring promedio por semana ---
    const scoringPorSemana = [
        Math.round(activos.slice(0, Math.floor(activos.length * 0.25)).reduce((a, c) => a + c.score, 0) / Math.floor(activos.length * 0.25)),
        Math.round(activos.slice(Math.floor(activos.length * 0.25), Math.floor(activos.length * 0.5)).reduce((a, c) => a + c.score, 0) / Math.floor(activos.length * 0.25)),
        Math.round(activos.slice(Math.floor(activos.length * 0.5), Math.floor(activos.length * 0.75)).reduce((a, c) => a + c.score, 0) / Math.floor(activos.length * 0.25)),
        Math.round(activos.slice(Math.floor(activos.length * 0.75)).reduce((a, c) => a + c.score, 0) / (activos.length - Math.floor(activos.length * 0.75)))
    ];
    new Chart(document.getElementById('chart-semana-scoring'), {
        type: 'line',
        data: {
            labels: semanasLabels,
            datasets: [{
                label: 'Scoring promedio (%)',
                data: scoringPorSemana,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40,167,69,0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#28a745',
                pointRadius: 5
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: false, min: 30, max: 100 } } }
    });

    // --- DOUGHNUT: Por fuente ---
    const fuenteData = FUENTES.map(f => activos.filter(c => c.fuente === f).length);
    new Chart(document.getElementById('chart-fuente'), {
        type: 'doughnut',
        data: { labels: FUENTES, datasets: [{ data: fuenteData, backgroundColor: ['#4da8da', '#28a745', '#ffc107'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // --- BAR: Por estado ---
    const estadoLabels = ['Nuevo', 'Procesado por IA', 'Pendiente de revisión', 'En primer filtro', 'Seleccionado', 'Descartado', 'En entrevista', 'Contratado', 'En pool futuro'];
    const estadoData = estadoLabels.map(e => activos.filter(c => c.estado === e).length);
    new Chart(document.getElementById('chart-estado'), {
        type: 'bar',
        data: { labels: estadoLabels, datasets: [{ label: 'Candidatos', data: estadoData, backgroundColor: '#4da8da' }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 45 } } } }
    });

    // --- PIE: Scoring ---
    const scoringRanges = ['90-100%', '75-89%', '60-74%', '40-59%', '<40%'];
    const scoringData = [
        activos.filter(c => c.score >= 90).length,
        activos.filter(c => c.score >= 75 && c.score < 90).length,
        activos.filter(c => c.score >= 60 && c.score < 75).length,
        activos.filter(c => c.score >= 40 && c.score < 60).length,
        activos.filter(c => c.score < 40).length
    ];
    new Chart(document.getElementById('chart-scoring'), {
        type: 'pie',
        data: { labels: scoringRanges, datasets: [{ data: scoringData, backgroundColor: ['#28a745', '#007bff', '#ffc107', '#fd7e14', '#dc3545'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // --- BAR horizontal: Vacantes ---
    new Chart(document.getElementById('chart-vacantes'), {
        type: 'bar',
        data: { labels: VACANTES.map(v => v.nombre), datasets: [{ label: 'Candidatos', data: VACANTES.map(v => v.candidatos_recibidos), backgroundColor: ['#1a2940', '#4da8da', '#28a745', '#ffc107', '#6f42c1'] }] },
        options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
    });
}

function exportarDashboardExcel() {
    const activos = CANDIDATOS.filter(c => c.estado !== 'Dado de baja' && c.estado !== 'Oculto');
    const procesados = activos.filter(c => c.estado !== 'Nuevo').length;
    const seleccionados = activos.filter(c => c.estado === 'Seleccionado' || c.estado === 'En entrevista' || c.estado === 'Contratado').length;
    const pendientes = activos.filter(c => c.estado === 'Pendiente de revisión' || c.estado === 'Nuevo' || c.estado === 'En primer filtro').length;
    const contratados = activos.filter(c => c.estado === 'Contratado').length;
    const vacantesActivas = VACANTES.filter(v => v.estado !== 'Cerrada' && v.estado !== 'Finalizada').length;
    const vacantesCerradas = VACANTES.filter(v => v.estado === 'Cerrada' || v.estado === 'Finalizada').length;

    const headers = 'Total Candidatos,Procesados,Seleccionados,Pendientes,Contratados,Vacantes Activas,Vacantes Cerradas';
    const row = `${activos.length},${procesados},${seleccionados},${pendientes},${contratados},${vacantesActivas},${vacantesCerradas}`;

    const csv = headers + '\n' + row;
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard_talentia_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Archivo CSV exportado exitosamente', 'success');
}
