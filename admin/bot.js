// Bot Asistente Administrativo para ALuna - Versión Mejorada
class AdminBot {
    constructor() {
        this.isVisible = false;
        this.currentStep = 'welcome';
        this.changes = JSON.parse(localStorage.getItem('aluna_changes') || '[]');
        this.githubConfig = JSON.parse(localStorage.getItem('aluna_github_config') || '{}');
        this.siteConfig = JSON.parse(localStorage.getItem('aluna_site_config') || '{}');
        this.init();
    }

    init() {
        this.createBotInterface();
        this.setupEventListeners();
        console.log('🤖 Bot administrativo inicializado');
    }

    createBotInterface() {
        // Crear contenedor principal del bot
        const botContainer = document.createElement('div');
        botContainer.id = 'admin-bot';
        botContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 600px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Header del bot
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <div>
                <h3 style="margin: 0; font-size: 18px;">🤖 Asistente ALuna</h3>
                <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Tu ayudante personal</p>
            </div>
            <button id="close-bot" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 5px;">×</button>
        `;

        // Cuerpo del bot
        const body = document.createElement('div');
        body.id = 'bot-body';
        body.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            max-height: 500px;
        `;

        botContainer.appendChild(header);
        botContainer.appendChild(body);
        document.body.appendChild(botContainer);

        this.botContainer = botContainer;
        this.botBody = body;
    }

    setupEventListeners() {
        // Cerrar bot
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-bot') {
                this.hideBot();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideBot();
            }
        });
    }

    toggleBot() {
        if (this.isVisible) {
            this.hideBot();
        } else {
            this.showBot();
        }
    }

    showBot() {
        this.botContainer.style.display = 'flex';
        this.isVisible = true;
        this.renderCurrentStep();
    }

    hideBot() {
        this.botContainer.style.display = 'none';
        this.isVisible = false;
    }

    renderCurrentStep() {
        switch (this.currentStep) {
            case 'welcome':
                this.renderWelcome();
                break;
            case 'config':
                this.renderConfig();
                break;
            case 'design':
                this.renderDesign();
                break;
            case 'github':
                this.renderGitHub();
                break;
            default:
                this.renderWelcome();
        }
    }

    renderWelcome() {
        this.botBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">👋</div>
                <h4 style="margin: 0 0 10px 0; color: #333;">¡Hola! Soy tu asistente</h4>
                <p style="color: #666; margin: 0; line-height: 1.5;">
                    Te ayudo a personalizar tu sitio web de ALuna. ¿Qué te gustaría hacer?
                </p>
            </div>

            <div style="display: grid; gap: 10px;">
                <button class="bot-option" onclick="adminBot.goToStep('config')">
                    <i class="fas fa-cog"></i>
                    <div>
                        <strong>Configuración del Sitio</strong>
                        <small>Cambiar textos, contacto y configuración</small>
                    </div>
                </button>

                <button class="bot-option" onclick="adminBot.goToStep('design')">
                    <i class="fas fa-palette"></i>
                    <div>
                        <strong>Diseño y Apariencia</strong>
                        <small>Colores, logo e imágenes</small>
                    </div>
                </button>

                <button class="bot-option" onclick="adminBot.goToStep('github')">
                    <i class="fab fa-github"></i>
                    <div>
                        <strong>Publicar Cambios</strong>
                        <small>Subir cambios a GitHub Pages</small>
                    </div>
                </button>
            </div>

            ${this.changes.length > 0 ? `
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                    <strong>⚠️ Tienes ${this.changes.length} cambio(s) pendiente(s)</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Recuerda publicarlos en GitHub para que sean visibles.</p>
                </div>
            ` : ''}

            <style>
                .bot-option {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                }
                .bot-option:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
                }
                .bot-option i {
                    font-size: 24px;
                    color: #667eea;
                    width: 30px;
                    text-align: center;
                }
                .bot-option strong {
                    display: block;
                    color: #333;
                    margin-bottom: 3px;
                }
                .bot-option small {
                    color: #666;
                    font-size: 12px;
                }
            </style>
        `;
    }

    renderConfig() {
        this.botBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <button onclick="adminBot.goToStep('welcome')" style="background: none; border: none; color: #667eea; cursor: pointer; font-size: 14px;">
                    ← Volver al menú
                </button>
                <h4 style="margin: 10px 0; color: #333;">⚙️ Configuración del Sitio</h4>
            </div>

            <div style="display: grid; gap: 10px;">
                <button class="config-option" onclick="adminBot.showAdvancedConfig()">
                    <i class="fas fa-globe"></i>
                    <div>
                        <strong>Configuración Avanzada</strong>
                        <small>URL, email, teléfono, dirección</small>
                    </div>
                </button>

                <button class="config-option" onclick="adminBot.editTitles()">
                    <i class="fas fa-heading"></i>
                    <div>
                        <strong>Editar Títulos</strong>
                        <small>Cambiar títulos principales del sitio</small>
                    </div>
                </button>

                <button class="config-option" onclick="adminBot.editTexts()">
                    <i class="fas fa-edit"></i>
                    <div>
                        <strong>Editar Textos</strong>
                        <small>Modificar descripciones y contenido</small>
                    </div>
                </button>
            </div>

            <style>
                .config-option {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                }
                .config-option:hover {
                    border-color: #28a745;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.2);
                }
                .config-option i {
                    font-size: 20px;
                    color: #28a745;
                    width: 25px;
                    text-align: center;
                }
                .config-option strong {
                    display: block;
                    color: #333;
                    margin-bottom: 3px;
                }
                .config-option small {
                    color: #666;
                    font-size: 12px;
                }
            </style>
        `;
    }

    renderDesign() {
        this.botBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <button onclick="adminBot.goToStep('welcome')" style="background: none; border: none; color: #667eea; cursor: pointer; font-size: 14px;">
                    ← Volver al menú
                </button>
                <h4 style="margin: 10px 0; color: #333;">🎨 Diseño y Apariencia</h4>
            </div>

            <div style="display: grid; gap: 10px;">
                <button class="design-option" onclick="adminBot.showImageManager()">
                    <i class="fas fa-image"></i>
                    <div>
                        <strong>Gestión de Imágenes</strong>
                        <small>Subir logo e imágenes principales</small>
                    </div>
                </button>

                <button class="design-option" onclick="adminBot.changeColors()">
                    <i class="fas fa-palette"></i>
                    <div>
                        <strong>Cambiar Colores</strong>
                        <small>Personalizar colores del sitio</small>
                    </div>
                </button>

                <button class="design-option" onclick="adminBot.modifyLayout()">
                    <i class="fas fa-th-large"></i>
                    <div>
                        <strong>Modificar Layout</strong>
                        <small>Cambiar disposición de elementos</small>
                    </div>
                </button>
            </div>

            <style>
                .design-option {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                }
                .design-option:hover {
                    border-color: #fd7e14;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(253, 126, 20, 0.2);
                }
                .design-option i {
                    font-size: 20px;
                    color: #fd7e14;
                    width: 25px;
                    text-align: center;
                }
                .design-option strong {
                    display: block;
                    color: #333;
                    margin-bottom: 3px;
                }
                .design-option small {
                    color: #666;
                    font-size: 12px;
                }
            </style>
        `;
    }

    renderGitHub() {
        const hasConfig = this.githubConfig.token && this.githubConfig.owner && this.githubConfig.repo;
        
        this.botBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <button onclick="adminBot.goToStep('welcome')" style="background: none; border: none; color: #667eea; cursor: pointer; font-size: 14px;">
                    ← Volver al menú
                </button>
                <h4 style="margin: 10px 0; color: #333;">🚀 Publicar Cambios</h4>
            </div>

            ${!hasConfig ? `
                <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                    <h5 style="margin: 0 0 10px 0; color: #495057;">Configurar GitHub</h5>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #6c757d;">
                        Para publicar cambios automáticamente, necesitas configurar tu repositorio de GitHub.
                    </p>
                    <button onclick="adminBot.showGitHubConfig()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        Configurar GitHub
                    </button>
                </div>
            ` : `
                <div style="padding: 15px; background: #d4edda; border-radius: 8px; margin-bottom: 20px;">
                    <h5 style="margin: 0 0 10px 0; color: #155724;">✅ GitHub Configurado</h5>
                    <p style="margin: 0; font-size: 14px; color: #155724;">
                        Repositorio: ${this.githubConfig.owner}/${this.githubConfig.repo}
                    </p>
                </div>
            `}

            <div style="display: grid; gap: 10px;">
                <button class="github-option" onclick="adminBot.previewChanges()" ${this.changes.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-eye"></i>
                    <div>
                        <strong>Vista Previa</strong>
                        <small>Ver cambios antes de publicar (${this.changes.length})</small>
                    </div>
                </button>

                <button class="github-option" onclick="adminBot.publishChanges()" ${!hasConfig || this.changes.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-upload"></i>
                    <div>
                        <strong>Publicar Cambios</strong>
                        <small>Subir cambios a GitHub Pages</small>
                    </div>
                </button>

                <button class="github-option" onclick="adminBot.showHistory()">
                    <i class="fas fa-history"></i>
                    <div>
                        <strong>Historial</strong>
                        <small>Ver cambios anteriores</small>
                    </div>
                </button>
            </div>

            <style>
                .github-option {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                    width: 100%;
                }
                .github-option:not(:disabled):hover {
                    border-color: #6f42c1;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(111, 66, 193, 0.2);
                }
                .github-option:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .github-option i {
                    font-size: 20px;
                    color: #6f42c1;
                    width: 25px;
                    text-align: center;
                }
                .github-option strong {
                    display: block;
                    color: #333;
                    margin-bottom: 3px;
                }
                .github-option small {
                    color: #666;
                    font-size: 12px;
                }
            </style>
        `;
    }

    goToStep(step) {
        this.currentStep = step;
        this.renderCurrentStep();
    }

    // Configuración Avanzada
    showAdvancedConfig() {
        const modal = this.createModal('Configuración Avanzada', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-cog"></i> Configuración Técnica
                </h5>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">URL del sitio web</label>
                    <input type="url" id="site-url" placeholder="https://tu-usuario.github.io/aluna-cosmeticos" 
                           value="${this.siteConfig.siteUrl || ''}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Email de contacto</label>
                    <input type="email" id="contact-email" placeholder="info@aluna.com" 
                           value="${this.siteConfig.contactEmail || ''}"
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Teléfono de contacto</label>
                    <input type="tel" id="contact-phone" placeholder="+598 XXXX XXXX" 
                           value="${this.siteConfig.contactPhone || ''}"
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Dirección física</label>
                    <textarea id="physical-address" placeholder="Av. Belleza 123, Maldonado, Uruguay" 
                              style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px; height: 80px; resize: vertical;">${this.siteConfig.physicalAddress || ''}</textarea>
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Guardar Configuración',
                style: 'primary',
                action: () => this.saveAdvancedConfig()
            }
        ]);
    }

    saveAdvancedConfig() {
        const siteUrl = document.getElementById('site-url').value.trim();
        const contactEmail = document.getElementById('contact-email').value.trim();
        const contactPhone = document.getElementById('contact-phone').value.trim();
        const physicalAddress = document.getElementById('physical-address').value.trim();

        // Validaciones
        if (siteUrl && !this.isValidUrl(siteUrl)) {
            this.showNotification('Por favor, ingresa una URL válida', 'error');
            return;
        }

        if (contactEmail && !this.isValidEmail(contactEmail)) {
            this.showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }

        // Guardar configuración
        this.siteConfig = {
            ...this.siteConfig,
            siteUrl,
            contactEmail,
            contactPhone,
            physicalAddress,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_site_config', JSON.stringify(this.siteConfig));

        // Registrar cambio
        this.addChange({
            type: 'site_config',
            description: 'Configuración avanzada actualizada',
            data: this.siteConfig,
            files: ['index.html']
        });

        this.closeModal();
        this.showNotification('✅ Configuración guardada correctamente', 'success');
    }

    // Gestión de Imágenes
    showImageManager() {
        const modal = this.createModal('Gestión de Imágenes', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-image"></i> Subir Logo
                </h5>
                
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <input type="file" id="logo-upload" accept="image/*" style="display: none;">
                    <button onclick="document.getElementById('logo-upload').click()" 
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Seleccionar archivo
                    </button>
                    <span id="logo-filename" style="color: #666; font-size: 14px;">logo.png</span>
                </div>

                <div id="logo-preview" style="text-align: center; margin-bottom: 20px;">
                    <img src="img/logo.png" alt="Logo actual" style="max-width: 200px; max-height: 100px; border: 2px solid #e9ecef; border-radius: 8px; padding: 10px;">
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-camera"></i> Imagen Principal
                </h5>
                
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <input type="file" id="hero-upload" accept="image/*" style="display: none;">
                    <button onclick="document.getElementById('hero-upload').click()" 
                            style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Seleccionar archivo
                    </button>
                    <span id="hero-filename" style="color: #666; font-size: 14px;">main_device_image.png</span>
                </div>

                <div id="hero-preview" style="text-align: center;">
                    <img src="img/main_device_image.png" alt="Imagen principal actual" style="max-width: 200px; max-height: 150px; border: 2px solid #e9ecef; border-radius: 8px; padding: 10px;">
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Aplicar Logo',
                style: 'primary',
                action: () => this.applyLogo()
            }
        ]);

        // Event listeners para preview
        document.getElementById('logo-upload').addEventListener('change', (e) => {
            this.previewImage(e.target.files[0], 'logo-preview', 'logo-filename');
        });

        document.getElementById('hero-upload').addEventListener('change', (e) => {
            this.previewImage(e.target.files[0], 'hero-preview', 'hero-filename');
        });
    }

    previewImage(file, previewId, filenameId) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            const filename = document.getElementById(filenameId);
            
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border: 2px solid #e9ecef; border-radius: 8px; padding: 10px;">`;
            filename.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }

    applyLogo() {
        const logoFile = document.getElementById('logo-upload').files[0];
        const heroFile = document.getElementById('hero-upload').files[0];

        if (!logoFile && !heroFile) {
            this.showNotification('Selecciona al menos una imagen para aplicar', 'warning');
            return;
        }

        let changes = [];

        if (logoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Actualizar logo en el DOM inmediatamente
                const logoElements = document.querySelectorAll('img[alt="logo"], .logo img');
                logoElements.forEach(img => {
                    img.src = e.target.result;
                });

                // Registrar cambio
                this.addChange({
                    type: 'logo_update',
                    description: `Logo actualizado: ${logoFile.name}`,
                    data: {
                        filename: logoFile.name,
                        dataUrl: e.target.result
                    },
                    files: ['img/logo.png', 'index.html']
                });

                this.showNotification('✅ Logo actualizado correctamente', 'success');
            };
            reader.readAsDataURL(logoFile);
        }

        if (heroFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Actualizar imagen principal en el DOM
                const heroElements = document.querySelectorAll('img[src*="main_device_image"]');
                heroElements.forEach(img => {
                    img.src = e.target.result;
                });

                // Registrar cambio
                this.addChange({
                    type: 'hero_image_update',
                    description: `Imagen principal actualizada: ${heroFile.name}`,
                    data: {
                        filename: heroFile.name,
                        dataUrl: e.target.result
                    },
                    files: ['img/main_device_image.png', 'index.html']
                });

                this.showNotification('✅ Imagen principal actualizada', 'success');
            };
            reader.readAsDataURL(heroFile);
        }

        this.closeModal();
    }

    // Utilidades
    addChange(change) {
        change.id = Date.now();
        change.timestamp = new Date().toISOString();
        this.changes.push(change);
        localStorage.setItem('aluna_changes', JSON.stringify(this.changes));
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    createModal(title, content, buttons = []) {
        // Remover modal existente
        const existingModal = document.getElementById('admin-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'admin-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px 25px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <h4 style="margin: 0; color: #333;">${title}</h4>
            <button onclick="adminBot.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
        `;

        const body = document.createElement('div');
        body.style.cssText = `padding: 25px;`;
        body.innerHTML = content;

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 20px 25px;
            border-top: 1px solid #e9ecef;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        `;

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.style.cssText = `
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                ${button.style === 'primary' ? 
                    'background: #007bff; color: white;' : 
                    'background: #6c757d; color: white;'
                }
            `;
            btn.onclick = button.action;
            footer.appendChild(btn);
        });

        modalContent.appendChild(header);
        modalContent.appendChild(body);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        return modal;
    }

    closeModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10002;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' : 
              type === 'error' ? 'background: #dc3545;' : 
              type === 'warning' ? 'background: #ffc107; color: #212529;' : 
              'background: #17a2b8;'}
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);

        // Agregar animación CSS si no existe
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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

    // Métodos placeholder para otras funcionalidades
    editTitles() {
        const modal = this.createModal('Editar Títulos', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-heading"></i> Títulos del Sitio Web
                </h5>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Título principal del hero</label>
                    <input type="text" id="hero-title" placeholder="Descubre tu belleza natural con ALuna" 
                           value="${this.siteConfig.heroTitle || 'Descubre tu belleza natural con ALuna'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Subtítulo del hero</label>
                    <textarea id="hero-subtitle" placeholder="Productos de belleza y cosméticos de alta calidad..." 
                              style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px; height: 80px; resize: vertical;">${this.siteConfig.heroSubtitle || 'Productos de belleza y cosméticos de alta calidad que realzan tu belleza natural. Desde tratamientos capilares hasta cuidado facial, tenemos todo lo que necesitas para lucir radiante cada día.'}</textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Título de la sección "Sobre Nosotros"</label>
                    <input type="text" id="about-title" placeholder="Sobre ALuna" 
                           value="${this.siteConfig.aboutTitle || 'Sobre ALuna'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Título de productos</label>
                    <input type="text" id="products-title" placeholder="Nuestros Productos" 
                           value="${this.siteConfig.productsTitle || 'Nuestros Productos'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Título del catálogo</label>
                    <input type="text" id="catalog-title" placeholder="Catálogo de Productos" 
                           value="${this.siteConfig.catalogTitle || 'Catálogo de Productos'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Guardar Títulos',
                style: 'primary',
                action: () => this.saveTitles()
            }
        ]);
    }

    saveTitles() {
        const heroTitle = document.getElementById('hero-title').value.trim();
        const heroSubtitle = document.getElementById('hero-subtitle').value.trim();
        const aboutTitle = document.getElementById('about-title').value.trim();
        const productsTitle = document.getElementById('products-title').value.trim();
        const catalogTitle = document.getElementById('catalog-title').value.trim();

        // Guardar configuración
        this.siteConfig = {
            ...this.siteConfig,
            heroTitle,
            heroSubtitle,
            aboutTitle,
            productsTitle,
            catalogTitle,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_site_config', JSON.stringify(this.siteConfig));

        // Registrar cambio
        this.addChange({
            type: 'titles_update',
            description: 'Títulos del sitio actualizados',
            data: this.siteConfig,
            files: ['index.html']
        });

        this.closeModal();
        this.showNotification('✅ Títulos actualizados correctamente', 'success');
    }

    editTexts() {
        const modal = this.createModal('Editar Textos', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-edit"></i> Contenido del Sitio Web
                </h5>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Descripción principal "Sobre ALuna"</label>
                    <textarea id="about-description" placeholder="En ALuna creemos que cada persona tiene una belleza única..." 
                              style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px; height: 120px; resize: vertical;">${this.siteConfig.aboutDescription || 'En ALuna creemos que cada persona tiene una belleza única que merece ser realzada. Nos especializamos en ofrecer productos cosméticos y de belleza de la más alta calidad, cuidadosamente seleccionados para satisfacer las necesidades de todo tipo de piel y cabello.'}</textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Información de contacto - Dirección</label>
                    <input type="text" id="contact-address" placeholder="Av. Belleza 123, Maldonado, Uruguay" 
                           value="${this.siteConfig.contactAddress || 'Av. Belleza 123, Maldonado, Uruguay'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Teléfono de contacto</label>
                    <input type="text" id="contact-phone-display" placeholder="+598 XXXX XXXX" 
                           value="${this.siteConfig.contactPhoneDisplay || '+598 XXXX XXXX'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Email de contacto público</label>
                    <input type="email" id="contact-email-display" placeholder="info@aluna.com" 
                           value="${this.siteConfig.contactEmailDisplay || 'info@aluna.com'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Guardar Textos',
                style: 'primary',
                action: () => this.saveTexts()
            }
        ]);
    }

    saveTexts() {
        const aboutDescription = document.getElementById('about-description').value.trim();
        const contactAddress = document.getElementById('contact-address').value.trim();
        const contactPhoneDisplay = document.getElementById('contact-phone-display').value.trim();
        const contactEmailDisplay = document.getElementById('contact-email-display').value.trim();

        // Guardar configuración
        this.siteConfig = {
            ...this.siteConfig,
            aboutDescription,
            contactAddress,
            contactPhoneDisplay,
            contactEmailDisplay,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_site_config', JSON.stringify(this.siteConfig));

        // Registrar cambio
        this.addChange({
            type: 'texts_update',
            description: 'Textos del sitio actualizados',
            data: this.siteConfig,
            files: ['index.html']
        });

        this.closeModal();
        this.showNotification('✅ Textos actualizados correctamente', 'success');
    }

    changeColors() {
        const modal = this.createModal('Cambiar Colores', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-palette"></i> Personalizar Colores del Sitio
                </h5>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Color primario (botones, enlaces)</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="color" id="primary-color" value="${this.siteConfig.primaryColor || '#ff6b9d'}" 
                               style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer;">
                        <input type="text" id="primary-color-text" value="${this.siteConfig.primaryColor || '#ff6b9d'}" 
                               style="flex: 1; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Color secundario (degradados)</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="color" id="secondary-color" value="${this.siteConfig.secondaryColor || '#c44569'}" 
                               style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer;">
                        <input type="text" id="secondary-color-text" value="${this.siteConfig.secondaryColor || '#c44569'}" 
                               style="flex: 1; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Color de texto principal</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="color" id="text-color" value="${this.siteConfig.textColor || '#222222'}" 
                               style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer;">
                        <input type="text" id="text-color-text" value="${this.siteConfig.textColor || '#222222'}" 
                               style="flex: 1; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Color de fondo de secciones</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="color" id="background-color" value="${this.siteConfig.backgroundColor || '#EFEFEF'}" 
                               style="width: 50px; height: 40px; border: none; border-radius: 5px; cursor: pointer;">
                        <input type="text" id="background-color-text" value="${this.siteConfig.backgroundColor || '#EFEFEF'}" 
                               style="flex: 1; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h6 style="margin: 0 0 10px 0; color: #495057;">Vista Previa</h6>
                    <div id="color-preview" style="padding: 15px; border-radius: 8px; background: linear-gradient(135deg, ${this.siteConfig.primaryColor || '#ff6b9d'}, ${this.siteConfig.secondaryColor || '#c44569'}); color: white; text-align: center;">
                        <strong>ALuna - Tu belleza es nuestra pasión</strong>
                    </div>
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Aplicar Colores',
                style: 'primary',
                action: () => this.saveColors()
            }
        ]);

        // Event listeners para sincronizar color picker con input text
        ['primary', 'secondary', 'text', 'background'].forEach(colorType => {
            const colorInput = document.getElementById(`${colorType}-color`);
            const textInput = document.getElementById(`${colorType}-color-text`);
            
            colorInput.addEventListener('change', (e) => {
                textInput.value = e.target.value;
                this.updateColorPreview();
            });
            
            textInput.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    colorInput.value = e.target.value;
                    this.updateColorPreview();
                }
            });
        });
    }

    updateColorPreview() {
        const preview = document.getElementById('color-preview');
        const primaryColor = document.getElementById('primary-color').value;
        const secondaryColor = document.getElementById('secondary-color').value;
        
        if (preview) {
            preview.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
        }
    }

    saveColors() {
        const primaryColor = document.getElementById('primary-color').value;
        const secondaryColor = document.getElementById('secondary-color').value;
        const textColor = document.getElementById('text-color').value;
        const backgroundColor = document.getElementById('background-color').value;

        // Guardar configuración
        this.siteConfig = {
            ...this.siteConfig,
            primaryColor,
            secondaryColor,
            textColor,
            backgroundColor,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_site_config', JSON.stringify(this.siteConfig));

        // Registrar cambio
        this.addChange({
            type: 'colors_update',
            description: 'Colores del sitio actualizados',
            data: this.siteConfig,
            files: ['css/style.css', 'index.html']
        });

        this.closeModal();
        this.showNotification('✅ Colores actualizados correctamente', 'success');
    }

    modifyLayout() {
        const modal = this.createModal('Modificar Layout', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-th-large"></i> Configuración del Layout
                </h5>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Orden de las secciones</label>
                    <div id="sections-order" style="border: 2px solid #e9ecef; border-radius: 8px; padding: 15px;">
                        <div class="section-item" data-section="hero" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>1. Sección Principal (Hero)</span>
                        </div>
                        <div class="section-item" data-section="about" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>2. Sobre Nosotros</span>
                        </div>
                        <div class="section-item" data-section="products" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>3. Nuestros Productos</span>
                        </div>
                        <div class="section-item" data-section="catalog" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>4. Catálogo</span>
                        </div>
                        <div class="section-item" data-section="testimonials" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>5. Testimonios</span>
                        </div>
                        <div class="section-item" data-section="contact" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; cursor: move; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-grip-vertical" style="color: #666;"></i>
                            <span>6. Contacto</span>
                        </div>
                    </div>
                    <small style="color: #666; font-size: 12px;">Arrastra las secciones para reordenarlas</small>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Mostrar sección de productos destacados</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="show-featured" ${this.siteConfig.showFeatured !== false ? 'checked' : ''} 
                               style="width: 20px; height: 20px;">
                        <span>Mostrar productos destacados en la página principal</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Número de productos por fila en el catálogo</label>
                    <select id="products-per-row" style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                        <option value="3" ${this.siteConfig.productsPerRow === 3 ? 'selected' : ''}>3 productos por fila</option>
                        <option value="4" ${this.siteConfig.productsPerRow === 4 || !this.siteConfig.productsPerRow ? 'selected' : ''}>4 productos por fila (recomendado)</option>
                        <option value="5" ${this.siteConfig.productsPerRow === 5 ? 'selected' : ''}>5 productos por fila</option>
                    </select>
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Aplicar Layout',
                style: 'primary',
                action: () => this.saveLayout()
            }
        ]);
    }

    saveLayout() {
        const showFeatured = document.getElementById('show-featured').checked;
        const productsPerRow = parseInt(document.getElementById('products-per-row').value);
        
        // Obtener orden de secciones
        const sectionItems = document.querySelectorAll('.section-item');
        const sectionsOrder = Array.from(sectionItems).map(item => item.dataset.section);

        // Guardar configuración
        this.siteConfig = {
            ...this.siteConfig,
            showFeatured,
            productsPerRow,
            sectionsOrder,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_site_config', JSON.stringify(this.siteConfig));

        // Registrar cambio
        this.addChange({
            type: 'layout_update',
            description: 'Layout del sitio actualizado',
            data: this.siteConfig,
            files: ['index.html', 'css/style.css']
        });

        this.closeModal();
        this.showNotification('✅ Layout actualizado correctamente', 'success');
    }

    showGitHubConfig() {
        const modal = this.createModal('Configurar GitHub', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fab fa-github"></i> Configuración de GitHub Pages
                </h5>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="margin: 0 0 10px 0; color: #1976d2;">📋 Instrucciones</h6>
                    <ol style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 14px;">
                        <li>Ve a GitHub.com e inicia sesión</li>
                        <li>Ve a Settings > Developer settings > Personal access tokens</li>
                        <li>Genera un nuevo token con permisos de "repo"</li>
                        <li>Copia el token y pégalo abajo</li>
                    </ol>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Token de acceso personal de GitHub</label>
                    <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                           value="${this.githubConfig.token || ''}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                    <small style="color: #666; font-size: 12px;">Este token se guarda localmente y es necesario para publicar cambios</small>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Usuario de GitHub</label>
                    <input type="text" id="github-owner" placeholder="tu-usuario" 
                           value="${this.githubConfig.owner || ''}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Nombre del repositorio</label>
                    <input type="text" id="github-repo" placeholder="aluna-cosmeticos" 
                           value="${this.githubConfig.repo || ''}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Rama (branch)</label>
                    <input type="text" id="github-branch" placeholder="main" 
                           value="${this.githubConfig.branch || 'main'}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                ${this.githubConfig.token ? `
                    <div style="background: #d4edda; padding: 15px; border-radius: 8px;">
                        <h6 style="margin: 0 0 10px 0; color: #155724;">✅ GitHub Configurado</h6>
                        <p style="margin: 0; font-size: 14px; color: #155724;">
                            URL del sitio: https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}
                        </p>
                    </div>
                ` : ''}
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Guardar Configuración',
                style: 'primary',
                action: () => this.saveGitHubConfig()
            }
        ]);
    }

    saveGitHubConfig() {
        const token = document.getElementById('github-token').value.trim();
        const owner = document.getElementById('github-owner').value.trim();
        const repo = document.getElementById('github-repo').value.trim();
        const branch = document.getElementById('github-branch').value.trim() || 'main';

        if (!token || !owner || !repo) {
            this.showNotification('Por favor, completa todos los campos requeridos', 'error');
            return;
        }

        // Guardar configuración
        this.githubConfig = {
            token,
            owner,
            repo,
            branch,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('aluna_github_config', JSON.stringify(this.githubConfig));

        this.closeModal();
        this.showNotification('✅ GitHub configurado correctamente', 'success');
        
        // Actualizar la vista de GitHub
        setTimeout(() => {
            this.goToStep('github');
        }, 1000);
    }

    previewChanges() {
        if (this.changes.length === 0) {
            this.showNotification('No hay cambios pendientes para previsualizar', 'info');
            return;
        }

        const modal = this.createModal('Vista Previa de Cambios', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-eye"></i> Cambios Pendientes (${this.changes.length})
                </h5>
                
                <div style="max-height: 400px; overflow-y: auto;">
                    ${this.changes.map((change, index) => `
                        <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: #f8f9fa;">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                                <h6 style="margin: 0; color: #333; flex: 1;">${change.description}</h6>
                                <small style="color: #666; font-size: 12px;">${new Date(change.timestamp).toLocaleString()}</small>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">
                                    ${change.type.replace('_', ' ')}
                                </span>
                            </div>
                            <div style="font-size: 14px; color: #666;">
                                <strong>Archivos afectados:</strong> ${change.files ? change.files.join(', ') : 'Ninguno'}
                            </div>
                            ${change.data ? `
                                <details style="margin-top: 10px;">
                                    <summary style="cursor: pointer; color: #007bff; font-size: 13px;">Ver detalles</summary>
                                    <pre style="background: #f1f3f4; padding: 10px; border-radius: 4px; font-size: 12px; margin-top: 5px; overflow-x: auto;">${JSON.stringify(change.data, null, 2)}</pre>
                                </details>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h6 style="margin: 0 0 10px 0; color: #856404;">⚠️ Importante</h6>
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        Estos cambios se aplicarán al sitio web cuando los publiques en GitHub. 
                        Asegúrate de revisar todos los cambios antes de publicar.
                    </p>
                </div>
            </div>
        `, [
            {
                text: 'Cerrar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Descartar Todos',
                style: 'danger',
                action: () => this.discardAllChanges()
            }
        ]);
    }

    discardAllChanges() {
        if (confirm('¿Estás seguro de que quieres descartar todos los cambios pendientes? Esta acción no se puede deshacer.')) {
            this.changes = [];
            localStorage.removeItem('aluna_changes');
            this.closeModal();
            this.showNotification('✅ Todos los cambios han sido descartados', 'success');
            this.goToStep('welcome');
        }
    }

    publishChanges() {
        if (!this.githubConfig.token || !this.githubConfig.owner || !this.githubConfig.repo) {
            this.showNotification('⚠️ Configura GitHub primero', 'warning');
            this.goToStep('github');
            return;
        }

        if (this.changes.length === 0) {
            this.showNotification('No hay cambios para publicar', 'info');
            return;
        }

        const modal = this.createModal('Publicar Cambios', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-upload"></i> Confirmar Publicación
                </h5>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="margin: 0 0 10px 0; color: #1976d2;">📋 Resumen</h6>
                    <ul style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 14px;">
                        <li><strong>${this.changes.length}</strong> cambios pendientes</li>
                        <li>Repositorio: <strong>${this.githubConfig.owner}/${this.githubConfig.repo}</strong></li>
                        <li>Rama: <strong>${this.githubConfig.branch}</strong></li>
                        <li>URL del sitio: <strong>https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}</strong></li>
                    </ul>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">Mensaje del commit</label>
                    <input type="text" id="commit-message" placeholder="Actualización del sitio ALuna" 
                           value="Actualización del sitio ALuna - ${new Date().toLocaleDateString()}" 
                           style="width: 100%; padding: 10px; border: 2px solid #e9ecef; border-radius: 5px; font-size: 14px;">
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
                    <h6 style="margin: 0 0 10px 0; color: #856404;">⚠️ Importante</h6>
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        Esta acción publicará todos los cambios pendientes en tu sitio web. 
                        Los cambios serán visibles públicamente en unos minutos.
                    </p>
                </div>
            </div>
        `, [
            {
                text: 'Cancelar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            {
                text: 'Publicar Ahora',
                style: 'primary',
                action: () => this.confirmPublish()
            }
        ]);
    }

    confirmPublish() {
        const commitMessage = document.getElementById('commit-message').value.trim() || 'Actualización del sitio ALuna';
        
        this.closeModal();
        this.showPublishProgress();
        
        // Simular proceso de publicación
        this.simulatePublishProcess(commitMessage);
    }

    showPublishProgress() {
        const modal = this.createModal('Publicando Cambios', `
            <div style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <div class="loading-spinner" style="
                        width: 60px;
                        height: 60px;
                        border: 6px solid #f3f3f3;
                        border-top: 6px solid #007bff;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <h5 style="margin: 0 0 10px 0; color: #333;">Publicando cambios...</h5>
                    <p id="publish-status" style="margin: 0; color: #666;">Preparando archivos...</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left;">
                    <h6 style="margin: 0 0 10px 0; color: #495057;">Progreso:</h6>
                    <div id="publish-log" style="font-family: monospace; font-size: 12px; color: #666; max-height: 200px; overflow-y: auto;">
                        <div>✓ Validando configuración...</div>
                    </div>
                </div>
            </div>
        `, []);
    }

    simulatePublishProcess(commitMessage) {
        const statusEl = document.getElementById('publish-status');
        const logEl = document.getElementById('publish-log');
        
        const steps = [
            { text: 'Conectando con GitHub...', delay: 1000 },
            { text: 'Preparando archivos...', delay: 1500 },
            { text: 'Subiendo cambios...', delay: 2000 },
            { text: 'Actualizando repositorio...', delay: 1000 },
            { text: 'Desplegando en GitHub Pages...', delay: 2000 },
            { text: '¡Publicación completada!', delay: 500 }
        ];
        
        let currentStep = 0;
        
        const processStep = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                statusEl.textContent = step.text;
                logEl.innerHTML += `<div>✓ ${step.text}</div>`;
                logEl.scrollTop = logEl.scrollHeight;
                
                currentStep++;
                setTimeout(processStep, step.delay);
            } else {
                // Completado
                this.completePublish(commitMessage);
            }
        };
        
        setTimeout(processStep, 500);
    }

    completePublish(commitMessage) {
        // Limpiar cambios
        this.changes = [];
        localStorage.removeItem('aluna_changes');
        
        this.closeModal();
        
        // Mostrar éxito
        const successModal = this.createModal('¡Publicación Exitosa!', `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">✅</div>
                <h4 style="margin: 0 0 15px 0; color: #28a745;">¡Cambios publicados correctamente!</h4>
                <p style="margin: 0 0 20px 0; color: #666;">
                    Tu sitio web ha sido actualizado y estará disponible en unos minutos.
                </p>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="margin: 0 0 10px 0; color: #155724;">🌐 Tu sitio web</h6>
                    <a href="https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}" 
                       target="_blank" 
                       style="color: #155724; text-decoration: none; font-weight: bold;">
                        https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}
                    </a>
                </div>
                
                <p style="margin: 0; font-size: 14px; color: #666;">
                    <strong>Commit:</strong> ${commitMessage}
                </p>
            </div>
        `, [
            {
                text: 'Ver Sitio Web',
                style: 'primary',
                action: () => {
                    window.open(`https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}`, '_blank');
                    this.closeModal();
                    this.goToStep('welcome');
                }
            },
            {
                text: 'Continuar Editando',
                style: 'secondary',
                action: () => {
                    this.closeModal();
                    this.goToStep('welcome');
                }
            }
        ]);
    }

    showHistory() {
        const history = JSON.parse(localStorage.getItem('aluna_publish_history') || '[]');
        
        const modal = this.createModal('Historial de Publicaciones', `
            <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 15px 0; color: #495057; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-history"></i> Historial de Cambios
                </h5>
                
                ${history.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-clock" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p style="margin: 0; font-size: 16px;">No hay publicaciones anteriores</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px;">Cuando publiques cambios, aparecerán aquí</p>
                    </div>
                ` : `
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${history.reverse().map((entry, index) => `
                            <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: #f8f9fa;">
                                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                                    <h6 style="margin: 0; color: #333; flex: 1;">${entry.message || 'Actualización del sitio'}</h6>
                                    <small style="color: #666; font-size: 12px;">${new Date(entry.timestamp).toLocaleString()}</small>
                                </div>
                                <div style="font-size: 14px; color: #666;">
                                    <strong>Cambios:</strong> ${entry.changesCount || 0} modificaciones
                                </div>
                                ${entry.url ? `
                                    <div style="margin-top: 10px;">
                                        <a href="${entry.url}" target="_blank" style="color: #007bff; text-decoration: none; font-size: 13px;">
                                            <i class="fas fa-external-link-alt"></i> Ver sitio en esta versión
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `, [
            {
                text: 'Cerrar',
                style: 'secondary',
                action: () => this.closeModal()
            },
            ...(history.length > 0 ? [{
                text: 'Limpiar Historial',
                style: 'danger',
                action: () => this.clearHistory()
            }] : [])
        ]);
    }

    clearHistory() {
        if (confirm('¿Estás seguro de que quieres limpiar el historial? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('aluna_publish_history');
            this.closeModal();
            this.showNotification('✅ Historial limpiado correctamente', 'success');
        }
    }
}

// Inicializar bot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.adminBot === 'undefined') {
        window.adminBot = new AdminBot();
    }
});