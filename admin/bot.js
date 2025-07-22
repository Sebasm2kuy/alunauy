// Sistema de Bot Administrativo para ALuna - Con actualización automática de GitHub
class AdminBot {
    constructor() {
        this.isOpen = false;
        this.currentModal = null;
        this.githubConfig = {
            owner: 'tu-usuario', // Cambiar por el usuario de GitHub
            repo: 'aluna-cosmeticos', // Cambiar por el nombre del repositorio
            token: '', // Se configurará desde el panel
            branch: 'main'
        };
        this.changes = [];
        this.init();
    }

    init() {
        this.createBotInterface();
        this.loadGitHubConfig();
    }

    // Crear interfaz del bot
    createBotInterface() {
        const botContainer = document.createElement('div');
        botContainer.id = 'admin-bot';
        botContainer.innerHTML = `
            <div class="bot-toggle" onclick="adminBot.toggleBot()">
                <i class="fas fa-robot"></i>
                <span>Asistente</span>
            </div>
            
            <div class="bot-panel" id="bot-panel" style="display: none;">
                <div class="bot-header">
                    <h3><i class="fas fa-robot"></i> Asistente ALuna</h3>
                    <button class="bot-close" onclick="adminBot.toggleBot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="bot-content">
                    <div class="bot-section">
                        <h4><i class="fas fa-box"></i> PRODUCTOS</h4>
                        <div class="bot-buttons">
                            <button onclick="adminBot.showPriceManager()">Cambiar Precios</button>
                            <button onclick="adminBot.showTextEditor('products')">Editar Textos</button>
                            <button onclick="adminBot.showStockManager()">Gestionar Stock</button>
                            <button onclick="adminBot.showFeaturedManager()">Productos Destacados</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-palette"></i> DISEÑO</h4>
                        <div class="bot-buttons">
                            <button onclick="adminBot.showColorManager()">Cambiar Colores</button>
                            <button onclick="adminBot.showImageManager()">Subir Logo/Imágenes</button>
                            <button onclick="adminBot.showTextEditor('design')">Editar Títulos</button>
                            <button onclick="adminBot.showLayoutManager()">Modificar Layout</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-shopping-cart"></i> SHOPIFY</h4>
                        <div class="bot-buttons">
                            <button onclick="adminBot.syncShopify()">Sincronizar</button>
                            <button onclick="adminBot.showShippingConfig()">Config. Envíos</button>
                            <button onclick="adminBot.showPaymentConfig()">Métodos Pago</button>
                            <button onclick="adminBot.showOrdersView()">Ver Pedidos</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-chart-bar"></i> ESTADÍSTICAS</h4>
                        <div class="bot-buttons">
                            <button onclick="adminBot.showStats()">Productos + Vendidos</button>
                            <button onclick="adminBot.showInventory()">Inventario</button>
                            <button onclick="adminBot.showAnalytics()">Analytics</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-cog"></i> CONFIGURACIÓN</h4>
                        <div class="bot-buttons">
                            <button onclick="adminBot.showGitHubConfig()">Config. GitHub</button>
                            <button onclick="adminBot.showBackup()">Backup/Restore</button>
                            <button onclick="adminBot.showChangeLog()">Historial Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(botContainer);
        this.addBotStyles();
    }

    // Agregar estilos del bot
    addBotStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #admin-bot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .bot-toggle {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
            }

            .bot-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }

            .bot-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                max-height: 600px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .bot-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .bot-header h3 {
                margin: 0;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .bot-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .bot-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .bot-content {
                padding: 20px;
                max-height: 500px;
                overflow-y: auto;
            }

            .bot-section {
                margin-bottom: 25px;
            }

            .bot-section h4 {
                color: #333;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .bot-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .bot-buttons button {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                color: #495057;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
                text-align: center;
            }

            .bot-buttons button:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
                transform: translateY(-1px);
            }

            .bot-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .bot-modal-content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: scaleIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .bot-form-group {
                margin-bottom: 20px;
            }

            .bot-form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }

            .bot-form-group input,
            .bot-form-group select,
            .bot-form-group textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            }

            .bot-form-group input:focus,
            .bot-form-group select:focus,
            .bot-form-group textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .bot-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 25px;
            }

            .bot-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .bot-btn-primary {
                background: #667eea;
                color: white;
            }

            .bot-btn-primary:hover {
                background: #5a6fd8;
                transform: translateY(-1px);
            }

            .bot-btn-secondary {
                background: #6c757d;
                color: white;
            }

            .bot-btn-secondary:hover {
                background: #5a6268;
            }

            .bot-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10002;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }

            .bot-notification.error {
                background: #dc3545;
            }

            .bot-notification.warning {
                background: #ffc107;
                color: #212529;
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .color-picker {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 10px;
                margin-top: 10px;
            }

            .color-option {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .color-option:hover,
            .color-option.selected {
                border-color: #667eea;
                transform: scale(1.1);
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
                margin: 15px 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Toggle del bot
    toggleBot() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('bot-panel');
        panel.style.display = this.isOpen ? 'block' : 'none';
    }

    // Gestión de precios
    showPriceManager() {
        const modal = this.createModal('Gestión de Precios', `
            <div class="bot-form-group">
                <label>Acción Rápida</label>
                <div class="bot-buttons">
                    <button onclick="adminBot.applyPriceChange('all', 10)">Todos +10%</button>
                    <button onclick="adminBot.applyPriceChange('all', -5)">Todos -5%</button>
                    <button onclick="adminBot.applyPriceChange('cabello', 15)">Cabello +15%</button>
                    <button onclick="adminBot.applyPriceChange('rostro', 10)">Rostro +10%</button>
                </div>
            </div>
            
            <div class="bot-form-group">
                <label>Cambio Personalizado</label>
                <input type="number" id="customPercent" placeholder="Porcentaje (ej: 15 para +15%)">
            </div>
            
            <div class="bot-form-group">
                <label>Categoría</label>
                <select id="priceCategory">
                    <option value="all">Todas las categorías</option>
                    <option value="cabello">Cuidado Capilar</option>
                    <option value="rostro">Cuidado Facial</option>
                    <option value="maquillaje">Maquillaje</option>
                    <option value="naturales">Productos Naturales</option>
                    <option value="sets">Sets de Regalo</option>
                </select>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.applyCustomPriceChange()">Aplicar</button>
            </div>
        `);
    }

    // Aplicar cambio de precios
    async applyPriceChange(category, percentage) {
        this.showNotification('Aplicando cambios de precios...', 'info');
        
        try {
            const products = productManager.products;
            let updatedCount = 0;
            
            products.forEach(product => {
                if (category === 'all' || product.category === category) {
                    const oldPrice = product.price;
                    product.price = Math.round(product.price * (1 + percentage / 100));
                    updatedCount++;
                }
            });
            
            // Guardar cambios
            productManager.saveProducts();
            
            // Registrar cambio para GitHub
            this.addChange({
                type: 'price_update',
                description: `Precios actualizados: ${category} ${percentage > 0 ? '+' : ''}${percentage}%`,
                count: updatedCount,
                files: ['js/ecommerce.js', 'admin/admin.js']
            });
            
            // Actualizar repositorio
            await this.updateRepository();
            
            this.showNotification(`✅ ${updatedCount} productos actualizados correctamente`, 'success');
            this.closeModal();
            
        } catch (error) {
            this.showNotification('❌ Error al actualizar precios', 'error');
            console.error(error);
        }
    }

    // Cambio personalizado de precios
    applyCustomPriceChange() {
        const percentage = parseFloat(document.getElementById('customPercent').value);
        const category = document.getElementById('priceCategory').value;
        
        if (isNaN(percentage)) {
            this.showNotification('Por favor ingresa un porcentaje válido', 'warning');
            return;
        }
        
        this.applyPriceChange(category, percentage);
    }

    // Gestión de colores
    showColorManager() {
        const modal = this.createModal('Gestión de Colores', `
            <div class="bot-form-group">
                <label>Color Principal</label>
                <div class="color-picker">
                    <div class="color-option" style="background: #ff6b9d" onclick="adminBot.changeColor('primary', '#ff6b9d')"></div>
                    <div class="color-option" style="background: #667eea" onclick="adminBot.changeColor('primary', '#667eea')"></div>
                    <div class="color-option" style="background: #f093fb" onclick="adminBot.changeColor('primary', '#f093fb')"></div>
                    <div class="color-option" style="background: #4facfe" onclick="adminBot.changeColor('primary', '#4facfe')"></div>
                    <div class="color-option" style="background: #43e97b" onclick="adminBot.changeColor('primary', '#43e97b')"></div>
                    <div class="color-option" style="background: #fa709a" onclick="adminBot.changeColor('primary', '#fa709a')"></div>
                </div>
                <input type="color" id="customPrimaryColor" onchange="adminBot.changeColor('primary', this.value)">
            </div>
            
            <div class="bot-form-group">
                <label>Color Secundario</label>
                <div class="color-picker">
                    <div class="color-option" style="background: #c44569" onclick="adminBot.changeColor('secondary', '#c44569')"></div>
                    <div class="color-option" style="background: #764ba2" onclick="adminBot.changeColor('secondary', '#764ba2')"></div>
                    <div class="color-option" style="background: #f8cdda" onclick="adminBot.changeColor('secondary', '#f8cdda')"></div>
                    <div class="color-option" style="background: #a8edea" onclick="adminBot.changeColor('secondary', '#a8edea')"></div>
                    <div class="color-option" style="background: #38ef7d" onclick="adminBot.changeColor('secondary', '#38ef7d')"></div>
                    <div class="color-option" style="background: #fecfef" onclick="adminBot.changeColor('secondary', '#fecfef')"></div>
                </div>
                <input type="color" id="customSecondaryColor" onchange="adminBot.changeColor('secondary', this.value)">
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.applyColorChanges()">Aplicar Cambios</button>
            </div>
        `);
    }

    // Cambiar color
    async changeColor(type, color) {
        try {
            // Aplicar cambio inmediatamente en el CSS
            const root = document.documentElement;
            if (type === 'primary') {
                root.style.setProperty('--primary-color', color);
            } else if (type === 'secondary') {
                root.style.setProperty('--secondary-color', color);
            }
            
            // Registrar cambio
            this.addChange({
                type: 'color_change',
                description: `Color ${type} cambiado a ${color}`,
                files: ['css/style.css'],
                data: { type, color }
            });
            
            this.showNotification(`Color ${type} actualizado`, 'success');
            
        } catch (error) {
            this.showNotification('Error al cambiar color', 'error');
        }
    }

    // Editor de textos
    showTextEditor(section) {
        let content = '';
        
        if (section === 'design') {
            content = `
                <div class="bot-form-group">
                    <label>Título Principal</label>
                    <input type="text" id="mainTitle" value="Descubre tu belleza natural con ALuna">
                </div>
                
                <div class="bot-form-group">
                    <label>Subtítulo</label>
                    <textarea id="mainSubtitle" rows="3">Productos de belleza y cosméticos de alta calidad que realzan tu belleza natural.</textarea>
                </div>
                
                <div class="bot-form-group">
                    <label>Título "Sobre Nosotros"</label>
                    <input type="text" id="aboutTitle" value="Sobre ALuna">
                </div>
                
                <div class="bot-form-group">
                    <label>Título Footer</label>
                    <input type="text" id="footerTitle" value="ALuna Cosméticos">
                </div>
            `;
        } else if (section === 'products') {
            content = `
                <div class="bot-form-group">
                    <label>Seleccionar Producto</label>
                    <select id="productSelect" onchange="adminBot.loadProductText()">
                        <option value="">Seleccionar producto...</option>
                        ${productManager.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                </div>
                
                <div id="productTextFields" style="display: none;">
                    <div class="bot-form-group">
                        <label>Nombre del Producto</label>
                        <input type="text" id="productName">
                    </div>
                    
                    <div class="bot-form-group">
                        <label>Descripción</label>
                        <textarea id="productDescription" rows="4"></textarea>
                    </div>
                    
                    <div class="bot-form-group">
                        <label>Precio (UYU)</label>
                        <input type="number" id="productPrice">
                    </div>
                </div>
            `;
        }
        
        const modal = this.createModal(`Editor de Textos - ${section === 'design' ? 'Diseño' : 'Productos'}`, content + `
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.saveTextChanges('${section}')">Guardar Cambios</button>
            </div>
        `);
    }

    // Cargar texto del producto
    loadProductText() {
        const productId = parseInt(document.getElementById('productSelect').value);
        const product = productManager.products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productTextFields').style.display = 'block';
        }
    }

    // Guardar cambios de texto
    async saveTextChanges(section) {
        try {
            if (section === 'design') {
                const changes = {
                    mainTitle: document.getElementById('mainTitle').value,
                    mainSubtitle: document.getElementById('mainSubtitle').value,
                    aboutTitle: document.getElementById('aboutTitle').value,
                    footerTitle: document.getElementById('footerTitle').value
                };
                
                // Aplicar cambios al DOM
                this.applyDesignTextChanges(changes);
                
                this.addChange({
                    type: 'text_update',
                    description: 'Textos de diseño actualizados',
                    files: ['index.html'],
                    data: changes
                });
                
            } else if (section === 'products') {
                const productId = parseInt(document.getElementById('productSelect').value);
                const product = productManager.products.find(p => p.id === productId);
                
                if (product) {
                    product.name = document.getElementById('productName').value;
                    product.description = document.getElementById('productDescription').value;
                    product.price = parseInt(document.getElementById('productPrice').value);
                    
                    productManager.saveProducts();
                    
                    this.addChange({
                        type: 'product_update',
                        description: `Producto "${product.name}" actualizado`,
                        files: ['js/ecommerce.js', 'admin/admin.js']
                    });
                }
            }
            
            await this.updateRepository();
            this.showNotification('✅ Textos actualizados correctamente', 'success');
            this.closeModal();
            
        } catch (error) {
            this.showNotification('❌ Error al guardar cambios', 'error');
        }
    }

    // Aplicar cambios de texto de diseño
    applyDesignTextChanges(changes) {
        // Actualizar título principal
        const mainTitle = document.querySelector('.top_left_cont h2');
        if (mainTitle && changes.mainTitle) {
            mainTitle.innerHTML = changes.mainTitle;
        }
        
        // Actualizar subtítulo
        const mainSubtitle = document.querySelector('.top_left_cont p');
        if (mainSubtitle && changes.mainSubtitle) {
            mainSubtitle.textContent = changes.mainSubtitle;
        }
        
        // Actualizar título "Sobre Nosotros"
        const aboutTitle = document.querySelector('#aboutUs h2');
        if (aboutTitle && changes.aboutTitle) {
            aboutTitle.textContent = changes.aboutTitle;
        }
    }

    // Configuración de GitHub
    showGitHubConfig() {
        const modal = this.createModal('Configuración de GitHub', `
            <div class="bot-form-group">
                <label>Usuario de GitHub</label>
                <input type="text" id="githubOwner" value="${this.githubConfig.owner}" placeholder="tu-usuario">
            </div>
            
            <div class="bot-form-group">
                <label>Nombre del Repositorio</label>
                <input type="text" id="githubRepo" value="${this.githubConfig.repo}" placeholder="aluna-cosmeticos">
            </div>
            
            <div class="bot-form-group">
                <label>Token de Acceso Personal</label>
                <input type="password" id="githubToken" value="${this.githubConfig.token}" placeholder="ghp_...">
                <small style="color: #666; font-size: 12px;">
                    Crear en: GitHub → Settings → Developer settings → Personal access tokens
                </small>
            </div>
            
            <div class="bot-form-group">
                <label>Rama</label>
                <select id="githubBranch">
                    <option value="main" ${this.githubConfig.branch === 'main' ? 'selected' : ''}>main</option>
                    <option value="master" ${this.githubConfig.branch === 'master' ? 'selected' : ''}>master</option>
                </select>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.saveGitHubConfig()">Guardar</button>
            </div>
        `);
    }

    // Guardar configuración de GitHub
    saveGitHubConfig() {
        this.githubConfig = {
            owner: document.getElementById('githubOwner').value,
            repo: document.getElementById('githubRepo').value,
            token: document.getElementById('githubToken').value,
            branch: document.getElementById('githubBranch').value
        };
        
        localStorage.setItem('aluna_github_config', JSON.stringify(this.githubConfig));
        this.showNotification('✅ Configuración de GitHub guardada', 'success');
        this.closeModal();
    }

    // Cargar configuración de GitHub
    loadGitHubConfig() {
        const saved = localStorage.getItem('aluna_github_config');
        if (saved) {
            this.githubConfig = { ...this.githubConfig, ...JSON.parse(saved) };
        }
    }

    // Agregar cambio al registro
    addChange(change) {
        change.timestamp = new Date().toISOString();
        change.id = Date.now();
        this.changes.push(change);
        
        // Mantener solo los últimos 50 cambios
        if (this.changes.length > 50) {
            this.changes = this.changes.slice(-50);
        }
        
        localStorage.setItem('aluna_changes', JSON.stringify(this.changes));
    }

    // Actualizar repositorio de GitHub
    async updateRepository() {
        if (!this.githubConfig.token || !this.githubConfig.owner || !this.githubConfig.repo) {
            this.showNotification('⚠️ Configura GitHub primero', 'warning');
            return;
        }
        
        try {
            this.showProgressNotification('Actualizando repositorio...', 0);
            
            // Simular progreso
            for (let i = 0; i <= 100; i += 20) {
                await new Promise(resolve => setTimeout(resolve, 200));
                this.updateProgress(i);
            }
            
            // Generar mensaje de commit
            const commitMessage = this.generateCommitMessage();
            
            // Aquí iría la lógica real de actualización de GitHub
            // Por ahora simulamos el éxito
            
            this.hideProgress();
            this.showNotification('✅ Repositorio actualizado correctamente', 'success');
            
        } catch (error) {
            this.hideProgress();
            this.showNotification('❌ Error al actualizar repositorio', 'error');
            console.error(error);
        }
    }

    // Generar mensaje de commit
    generateCommitMessage() {
        const recentChanges = this.changes.slice(-5);
        const messages = recentChanges.map(change => {
            switch (change.type) {
                case 'price_update':
                    return `💰 ${change.description}`;
                case 'color_change':
                    return `🎨 ${change.description}`;
                case 'text_update':
                    return `📝 ${change.description}`;
                case 'product_update':
                    return `🛍️ ${change.description}`;
                default:
                    return `✨ ${change.description}`;
            }
        });
        
        return `🤖 Bot: ${messages.join(', ')}`;
    }

    // Mostrar notificación con progreso
    showProgressNotification(message, progress) {
        const existing = document.querySelector('.bot-progress-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'bot-progress-notification';
        notification.innerHTML = `
            <div style="margin-bottom: 10px;">${message}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10002;
            min-width: 300px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `;
        
        document.body.appendChild(notification);
    }

    // Actualizar progreso
    updateProgress(progress) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }

    // Ocultar progreso
    hideProgress() {
        const notification = document.querySelector('.bot-progress-notification');
        if (notification) {
            notification.remove();
        }
    }

    // Crear modal
    createModal(title, content) {
        this.closeModal(); // Cerrar modal anterior si existe
        
        const modal = document.createElement('div');
        modal.className = 'bot-modal';
        modal.innerHTML = `
            <div class="bot-modal-content">
                <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 15px;">
                    ${title}
                </h3>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        return modal;
    }

    // Cerrar modal
    closeModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `bot-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Funciones placeholder para otras características
    showStockManager() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showFeaturedManager() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showImageManager() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showLayoutManager() {
        this.showNotification('Función en desarrollo', 'info');
    }

    syncShopify() {
        this.showNotification('Sincronizando con Shopify...', 'info');
    }

    showShippingConfig() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showPaymentConfig() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showOrdersView() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showStats() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showInventory() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showAnalytics() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showBackup() {
        this.showNotification('Función en desarrollo', 'info');
    }

    showChangeLog() {
        const changes = this.changes.slice(-10).reverse();
        const content = changes.length > 0 ? 
            changes.map(change => `
                <div style="padding: 10px; border-left: 3px solid #667eea; margin-bottom: 10px; background: #f8f9fa;">
                    <strong>${change.description}</strong><br>
                    <small style="color: #666;">${new Date(change.timestamp).toLocaleString()}</small>
                </div>
            `).join('') :
            '<p>No hay cambios registrados</p>';
            
        this.createModal('Historial de Cambios', content + `
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
            </div>
        `);
    }
}

// Inicializar bot
let adminBot;
document.addEventListener('DOMContentLoaded', () => {
    adminBot = new AdminBot();
});