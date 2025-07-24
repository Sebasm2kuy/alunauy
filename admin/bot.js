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
        this.showNotification('Función en desarrollo', 'info');
    }

    editTexts() {
        this.showNotification('Función en desarrollo', 'info');
    }

    changeColors() {
        this.showNotification('Función en desarrollo', 'info');
    }

    modifyLayout() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showGitHubConfig() {
        this.showNotification('Función en desarrollo', 'info');
    }

    previewChanges() {
        this.showNotification('Función en desarrollo', 'info');
    }

    publishChanges() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showHistory() {
        this.showNotification('Función en desarrollo', 'info');
    }
}

// Inicializar bot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.adminBot === 'undefined') {
        window.adminBot = new AdminBot();
    }
});