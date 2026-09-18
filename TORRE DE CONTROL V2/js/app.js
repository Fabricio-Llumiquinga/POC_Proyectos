/* ============================================
   APP.JS - Controlador principal SPA
   ============================================ */

const App = {
    currentView: 'welcome',
    currentModule: 'dashboard',
    data: null,

    init() {
        this.data = loadData();
        const session = getSession();
        if (session) {
            if (session.type === 'backoffice') {
                this.showBackoffice();
            } else {
                this.showClientPortal();
            }
        } else {
            this.showWelcome();
        }
    },

    showWelcome() {
        const app = document.getElementById('app');
        app.innerHTML = `
        <div class="welcome-screen">
            <div class="welcome-container">
                <h1>Torre de Control de Trámites</h1>
                <p class="subtitle">Seleccione el tipo de acceso para iniciar sesión</p>
                <div class="access-cards">
                    <div class="access-card" onclick="App.showLogin('backoffice')">
                        <div class="card-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        </div>
                        <h2>Backoffice Interno</h2>
                        <p>Acceso para coordinadores, ejecutivos, pedimentadores, gestión técnica, operaciones, contabilidad y administradores.</p>
                        <button class="btn btn-primary btn-lg">Ingresar como Backoffice</button>
                    </div>
                    <div class="access-card" onclick="App.showLogin('client')">
                        <div class="card-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <h2>Cliente Externo</h2>
                        <p>Acceso para registrar, consultar y dar seguimiento a los trámites de su empresa.</p>
                        <button class="btn btn-primary btn-lg">Ingresar como Cliente</button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    showLogin(type) {
        const app = document.getElementById('app');
        if (type === 'backoffice') {
            app.innerHTML = `
            <div class="login-screen">
                <div class="login-container">
                    <h2>Backoffice Interno</h2>
                    <p class="login-subtitle">Ingrese sus credenciales para acceder al sistema</p>
                    <div id="login-error" style="display:none;padding:0.6rem;background:#fed7d7;color:#742a2a;border-radius:6px;font-size:0.85rem;margin-bottom:1rem;"></div>
                    <div class="form-group">
                        <label>Usuario o correo</label>
                        <input type="text" id="login-user" placeholder="sebastian.alfaro" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" id="login-pass" placeholder="••••••">
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="login-remember"> <label for="login-remember" style="margin:0;font-size:0.8rem;">Recordar sesión</label>
                    </div>
                    <div class="login-actions">
                        <button class="btn btn-primary btn-block" onclick="App.doLogin('backoffice')">Iniciar sesión</button>
                    </div>
                    <button class="btn btn-secondary btn-block mt-2" onclick="App.showWelcome()">← Volver</button>
                    <div class="login-demo">
                        <strong>Demo:</strong> Usuario: sebastian.alfaro | Contraseña: demo123
                    </div>
                </div>
            </div>`;
            document.getElementById('login-pass').addEventListener('keypress', e => { if(e.key==='Enter') App.doLogin('backoffice'); });
        } else {
            app.innerHTML = `
            <div class="login-screen">
                <div class="login-container">
                    <h2>Portal de Clientes</h2>
                    <p class="login-subtitle">Ingrese su código de cliente para acceder</p>
                    <div id="login-error" style="display:none;padding:0.6rem;background:#fed7d7;color:#742a2a;border-radius:6px;font-size:0.85rem;margin-bottom:1rem;"></div>
                    <div class="form-group">
                        <label>Código de cliente</label>
                        <input type="text" id="login-code" placeholder="CLI-1001" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" id="login-pass" placeholder="••••••">
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="login-remember"> <label for="login-remember" style="margin:0;font-size:0.8rem;">Recordar sesión</label>
                    </div>
                    <div class="login-actions">
                        <button class="btn btn-primary btn-block" onclick="App.doLogin('client')">Iniciar sesión</button>
                    </div>
                    <button class="btn btn-secondary btn-block mt-2" onclick="App.showWelcome()">← Volver</button>
                    <div class="login-demo">
                        <strong>Demo:</strong> Código: CLI-1001 | Contraseña: demo123
                    </div>
                </div>
            </div>`;
            document.getElementById('login-pass').addEventListener('keypress', e => { if(e.key==='Enter') App.doLogin('client'); });
        }
    },

    doLogin(type) {
        const errEl = document.getElementById('login-error');
        errEl.style.display = 'none';
        let result;
        if (type === 'backoffice') {
            const user = document.getElementById('login-user').value.trim();
            const pass = document.getElementById('login-pass').value;
            if (!user || !pass) { errEl.textContent = 'Complete todos los campos'; errEl.style.display = 'block'; return; }
            result = loginBackoffice(user, pass);
        } else {
            const code = document.getElementById('login-code').value.trim().toUpperCase();
            const pass = document.getElementById('login-pass').value;
            if (!code || !pass) { errEl.textContent = 'Complete todos los campos'; errEl.style.display = 'block'; return; }
            result = loginClient(code, pass);
        }
        if (result.success) {
            this.data = loadData();
            if (type === 'backoffice') this.showBackoffice();
            else this.showClientPortal();
        } else {
            errEl.textContent = result.error;
            errEl.style.display = 'block';
        }
    },

    showBackoffice() {
        this.currentView = 'backoffice';
        this.currentModule = 'dashboard';
        Backoffice.render();
    },

    showClientPortal() {
        this.currentView = 'client';
        ClientPortal.render();
    },

    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    showModal(title, content, footer = '', size = '') {
        const container = document.getElementById('modal-container');
        container.innerHTML = `
        <div class="modal-overlay" onclick="App.closeModal(event)">
            <div class="modal ${size}" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="App.closeModal()">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        </div>`;
    },

    closeModal(e) {
        if (e && e.target !== e.currentTarget) return;
        document.getElementById('modal-container').innerHTML = '';
    },

    confirm(message, onConfirm) {
        this.showModal('Confirmar acción', `<p>${message}</p>`,
            `<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="App.closeModal();(${onConfirm.toString()})()">Confirmar</button>`);
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => App.init());
