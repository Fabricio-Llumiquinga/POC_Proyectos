// ===== MAIN APPLICATION =====
(function() {
    'use strict';

    var currentView = 'dashboard';

    // View map
    var views = {
        'dashboard': DashboardView,
        'maestro': MaestroView,
        'codigo-nuevo': CodigoNuevoView,
        'usado-nuevo': UsadoNuevoView,
        'cambio-costo': CambioCostoView,
        'homologacion': HomologacionView,
        'competencia': CompetenciaView,
        'investigacion': InvestigacionView,
        'ajustes': AjustesView,
        'aprobaciones': AprobacionesView,
        'api-pos': ApiPosView,
        'historico': HistoricoView,
        'reglas': ReglasView,
        'chatbot': ChatbotView,
        'arquitectura': ArquitecturaView,
        'motor-pricing': MotorPricingView
    };

    function navigate(viewName) {
        currentView = viewName;
        var contentArea = document.getElementById('contentArea');
        var viewObj = views[viewName];
        if (viewObj && viewObj.render) {
            contentArea.innerHTML = viewObj.render();
        }
        // Update nav
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            }
        });
        // Close mobile menu
        document.getElementById('sidebar').classList.remove('open');
    }

    function init() {
        // Set date
        var dateEl = document.getElementById('headerDate');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('es-CO', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });
        }

        // Nav clicks
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var view = this.getAttribute('data-view');
                navigate(view);
            });
        });

        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('open');
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', Utils.closeModal);
        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) Utils.closeModal();
        });

        // Initial view
        navigate('dashboard');
    }

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
