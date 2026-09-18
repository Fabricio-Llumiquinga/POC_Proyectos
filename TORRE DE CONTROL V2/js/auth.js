/* ============================================
   AUTH.JS - Autenticación y sesión
   ============================================ */

const AUTH_KEY = 'torre_control_session';

function getSession() {
    const s = localStorage.getItem(AUTH_KEY);
    return s ? JSON.parse(s) : null;
}

function setSession(session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(AUTH_KEY);
}

function loginBackoffice(username, password) {
    const data = loadData();
    const user = data.users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    if (user) {
        const session = {
            type: 'backoffice',
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
        };
        setSession(session);
        return { success: true, session };
    }
    return { success: false, error: 'Credenciales incorrectas' };
}

function loginClient(code, password) {
    const data = loadData();
    const client = data.clients.find(c => c.id === code && c.password === password);
    if (client) {
        if (!client.portalAccess) {
            return { success: false, error: 'Acceso al portal deshabilitado' };
        }
        const session = {
            type: 'client',
            clientId: client.id,
            name: client.name,
            company: client.company,
            email: client.email
        };
        setSession(session);
        return { success: true, session };
    }
    return { success: false, error: 'Código o contraseña incorrectos' };
}

function logout() {
    clearSession();
    App.init();
}
