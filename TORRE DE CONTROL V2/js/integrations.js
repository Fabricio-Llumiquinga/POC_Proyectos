/* ============================================
   INTEGRATIONS.JS - Simulación SOLSER y OMEGA
   ============================================ */

const Integrations = {
    sendToSolser(tramiteId) {
        App.confirm(`¿Enviar datos del trámite ${tramiteId} a SOLSER para crear Orden de Trabajo?`, () => {
            const d = App.data;
            const t = d.tramites.find(tr => tr.id === tramiteId);
            if (!t) return;

            // Simulate SOLSER response (90% success)
            const success = Math.random() > 0.1;
            const otNumber = 'OT-' + (88000 + Math.floor(Math.random() * 1000));

            if (success) {
                t.otSolser = otNumber;
                t.integration = 'OT creada';
                t.lastUpdate = getNow();
                d.integrations.push({
                    id: getNextId('INT', d.integrations), tramiteId: tramiteId,
                    system: 'SOLSER', action: 'Crear OT', date: getNow(),
                    dataSent: `Datos trámite ${t.type}: ${t.regime}`,
                    response: `${otNumber} creada exitosamente`,
                    responseCode: 200, status: 'Exitosa', retries: 0,
                    lastError: null, executedBy: getSession().userId || 'USR-009'
                });
                d.comments.push({
                    id: getNextId('COM', d.comments), tramiteId: tramiteId,
                    author: 'USR-009', role: 'Robot / Agente automático', date: getNow(),
                    text: `Integración SOLSER exitosa. OT creada: ${otNumber}`,
                    type: 'system', visibility: 'interno', stage: t.currentStage
                });
                saveData(d);
                App.toast(`OT ${otNumber} creada en SOLSER`, 'success');
                // Now send to OMEGA module
                setTimeout(() => this.sendToOmega(tramiteId), 500);
            } else {
                t.integration = 'Error';
                d.integrations.push({
                    id: getNextId('INT', d.integrations), tramiteId: tramiteId,
                    system: 'SOLSER', action: 'Crear OT', date: getNow(),
                    dataSent: `Datos trámite ${t.type}`,
                    response: 'Error de conexión con SOLSER',
                    responseCode: 500, status: 'Error', retries: 0,
                    lastError: 'Timeout en conexión',
                    executedBy: getSession().userId || 'USR-009'
                });
                saveData(d);
                App.toast('Error al conectar con SOLSER', 'error');
            }
            // Refresh view if in detail
            if (Workflow.currentTramite && Workflow.currentTramite.id === tramiteId) {
                Workflow.showDetail(tramiteId);
            }
        });
    },

    sendToOmega(tramiteId) {
        const d = App.data;
        const t = d.tramites.find(tr => tr.id === tramiteId);
        if (!t || !t.omega) return;

        d.integrations.push({
            id: getNextId('INT', d.integrations), tramiteId: tramiteId,
            system: t.omega, action: `Enviar datos a ${t.omega}`,
            date: getNow(),
            dataSent: `Datos de ${TRAMITE_TYPES.find(tt=>tt.id===t.type)?.name || t.type}`,
            response: `Datos recibidos correctamente en ${t.omega}`,
            responseCode: 200, status: 'Exitosa', retries: 0,
            lastError: null, executedBy: 'USR-009'
        });
        d.comments.push({
            id: getNextId('COM', d.comments), tramiteId: tramiteId,
            author: 'USR-009', role: 'Robot / Agente automático', date: getNow(),
            text: `Datos enviados a módulo OMEGA: ${t.omega}`,
            type: 'system', visibility: 'interno', stage: t.currentStage
        });
        saveData(d);
        App.toast(`Datos enviados a ${t.omega}`, 'info');
    },

    retry(tramiteId) {
        App.confirm(`¿Reintentar integración SOLSER para ${tramiteId}?`, () => {
            const d = App.data;
            const t = d.tramites.find(tr => tr.id === tramiteId);
            if (!t) return;

            // Find failed integration
            const failedInt = d.integrations.find(i => i.tramiteId === tramiteId && i.status === 'Error');
            if (failedInt) { failedInt.retries++; }

            // Retry with 95% success on retry
            const success = Math.random() > 0.05;
            const otNumber = 'OT-' + (88000 + Math.floor(Math.random() * 1000));

            if (success) {
                t.otSolser = otNumber;
                t.integration = 'OT creada';
                t.status = t.status === 'Excepción' ? 'En proceso' : t.status;
                t.lastUpdate = getNow();
                d.integrations.push({
                    id: getNextId('INT', d.integrations), tramiteId: tramiteId,
                    system: 'SOLSER', action: 'Crear OT (reintento)', date: getNow(),
                    dataSent: `Datos trámite ${t.type} (reintento)`,
                    response: `${otNumber} creada exitosamente`,
                    responseCode: 200, status: 'Exitosa',
                    retries: failedInt ? failedInt.retries : 1,
                    lastError: null, executedBy: getSession().userId || 'USR-009'
                });
                d.comments.push({
                    id: getNextId('COM', d.comments), tramiteId: tramiteId,
                    author: getSession().userId || 'USR-009', role: getSession().role || 'Sistema',
                    date: getNow(), text: `Reintento exitoso. OT creada: ${otNumber}`,
                    type: 'system', visibility: 'interno', stage: t.currentStage
                });
                saveData(d);
                App.toast(`Reintento exitoso. OT ${otNumber} creada`, 'success');
                setTimeout(() => this.sendToOmega(tramiteId), 500);
            } else {
                if (failedInt) { failedInt.lastError = 'Error persistente en reintento'; }
                saveData(d);
                App.toast('Reintento fallido. Contacte soporte técnico.', 'error');
            }

            // Refresh current view
            if (Workflow.currentTramite && Workflow.currentTramite.id === tramiteId) {
                Workflow.showDetail(tramiteId);
            } else {
                Backoffice.navigate(Backoffice.currentModule);
            }
        });
    },

    sendToFacser(tramiteId) {
        const d = App.data;
        const t = d.tramites.find(tr => tr.id === tramiteId);
        if (!t) return;

        d.integrations.push({
            id: getNextId('INT', d.integrations), tramiteId: tramiteId,
            system: 'FACSER', action: 'Enviar a facturación', date: getNow(),
            dataSent: 'Conceptos facturables del trámite',
            response: 'Factura en proceso de generación',
            responseCode: 200, status: 'Exitosa', retries: 0,
            lastError: null, executedBy: getSession().userId || 'USR-006'
        });
        saveData(d);
        App.toast('Datos enviados a FACSER', 'success');
    }
};
