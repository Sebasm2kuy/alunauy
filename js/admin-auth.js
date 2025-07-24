// Sistema de autenticación para panel administrativo ALuna
class AdminAuth {
    constructor() {
        this.credentials = {
            username: 'admin',
            password: '1234'
        };
        this.sessionKey = 'aluna_admin_session';
        this.init();
    }

    init() {
        // Verificar si ya hay una sesión activa
        this.checkExistingSession();
        
        // Agregar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('adminLoginModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('adminLoginModal');
        modal.style.display = 'block';
        
        // Focus en el campo de usuario
        setTimeout(() => {
            document.getElementById('adminUser').focus();
        }, 100);
        
        // Limpiar campos y errores
        this.clearForm();
    }

    closeModal() {
        const modal = document.getElementById('adminLoginModal');
        modal.style.display = 'none';
        this.clearForm();
    }

    clearForm() {
        document.getElementById('adminLoginForm').reset();
        document.getElementById('adminLoginError').style.display = 'none';
    }

    validateLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('adminUser').value.trim();
        const password = document.getElementById('adminPass').value;
        const errorDiv = document.getElementById('adminLoginError');

        // Validar credenciales
        if (username === this.credentials.username && password === this.credentials.password) {
            // Login exitoso
            this.createSession();
            this.showSuccessMessage();
            
            setTimeout(() => {
                this.redirectToAdmin();
            }, 1500);
        } else {
            // Login fallido
            this.showError();
            this.shakeModal();
        }
    }

    createSession() {
        const sessionData = {
            username: this.credentials.username,
            loginTime: new Date().toISOString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    checkExistingSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date();
                const expires = new Date(sessionData.expires);
                
                if (now < expires) {
                    // Sesión válida - cambiar botón
                    this.updateLoginButton(true);
                } else {
                    // Sesión expirada
                    localStorage.removeItem(this.sessionKey);
                }
            } catch (e) {
                localStorage.removeItem(this.sessionKey);
            }
        }
    }

    updateLoginButton(isLoggedIn) {
        const loginBtn = document.querySelector('.admin-login-btn');
        if (isLoggedIn) {
            loginBtn.innerHTML = '<i class="fa fa-cog"></i> Panel';
            loginBtn.onclick = () => this.redirectToAdmin();
        } else {
            loginBtn.innerHTML = '<i class="fa fa-user-circle"></i> Admin';
            loginBtn.onclick = () => this.showModal();
        }
    }

    showError() {
        const errorDiv = document.getElementById('adminLoginError');
        errorDiv.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    shakeModal() {
        const modal = document.querySelector('.admin-modal-content');
        modal.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            modal.style.animation = 'slideIn 0.3s ease';
        }, 500);
        
        // Agregar animación shake al CSS si no existe
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showSuccessMessage() {
        const errorDiv = document.getElementById('adminLoginError');
        errorDiv.style.display = 'block';
        errorDiv.className = 'admin-success';
        errorDiv.innerHTML = '<i class="fa fa-check-circle"></i> ¡Acceso autorizado! Redirigiendo...';
        
        // Agregar estilos de éxito
        if (!document.querySelector('#success-styles')) {
            const style = document.createElement('style');
            style.id = 'success-styles';
            style.textContent = `
                .admin-success {
                    background: #d4edda !important;
                    color: #155724 !important;
                    border-left-color: #28a745 !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    redirectToAdmin() {
        this.closeModal();
        
        // Mostrar mensaje de carga
        this.showLoadingMessage();
        
        setTimeout(() => {
            window.open('admin/', '_blank');
        }, 1000);
    }

    showLoadingMessage() {
        // Crear overlay de carga
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'admin-loading';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 107, 157, 0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: 600;
        `;
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <div>Accediendo al Panel Administrativo...</div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Agregar animación de spinner
        if (!document.querySelector('#spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover overlay después de la redirección
        setTimeout(() => {
            loadingOverlay.remove();
        }, 2000);
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.updateLoginButton(false);
        this.showNotification('Sesión cerrada correctamente', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'info' ? '#17a2b8' : '#28a745'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fa fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Agregar animación slideInRight
        if (!document.querySelector('#slide-animation')) {
            const style = document.createElement('style');
            style.id = 'slide-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Funciones globales para el HTML
function showAdminLogin() {
    adminAuth.showModal();
}

function closeAdminLogin() {
    adminAuth.closeModal();
}

function validateAdminLogin(event) {
    adminAuth.validateLogin(event);
}

// Inicializar cuando el DOM esté listo
let adminAuth;
document.addEventListener('DOMContentLoaded', () => {
    adminAuth = new AdminAuth();
});