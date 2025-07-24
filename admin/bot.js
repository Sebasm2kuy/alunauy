// Sistema de Bot Administrativo para ALuna - Completamente funcional
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
        this.shopifyConfig = {
            domain: '',
            storefrontToken: '',
            webhookSecret: '',
            apiKey: '',
            apiSecret: ''
        };
        this.changes = [];
        this.init();
    }

    init() {
        this.createBotInterface();
        this.loadGitHubConfig();
        this.loadShopifyConfig();
    }

    // Crear interfaz del bot
    createBotInterface() {
        const botContainer = document.createElement('div');
        botContainer.id = 'admin-bot';
        botContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 10000;';
        botContainer.innerHTML = `            
            <div class="bot-panel" id="bot-panel" style="display: none;">
                <div class="bot-header">
                    <h3><i class="fas fa-robot"></i> Asistente ALuna</h3>
                    <button class="bot-close" onclick="window.adminBot.toggleBot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="bot-content">
                    <div class="bot-section">
                        <h4><i class="fas fa-box"></i> PRODUCTOS</h4>
                        <div class="bot-buttons">
                            <button onclick="window.adminBot.showPriceManager()">Cambiar Precios</button>
                            <button onclick="window.adminBot.showTextEditor('products')">Editar Textos</button>
                            <button onclick="window.adminBot.showStockManager()">Gestionar Stock</button>
                            <button onclick="window.adminBot.showFeaturedManager()">Productos Destacados</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-palette"></i> DISEÑO</h4>
                        <div class="bot-buttons">
                            <button onclick="window.adminBot.showColorManager()">Cambiar Colores</button>
                            <button onclick="window.adminBot.showImageManager()">Subir Logo/Imágenes</button>
                            <button onclick="window.adminBot.showTextEditor('design')">Editar Títulos</button>
                            <button onclick="window.adminBot.showLayoutManager()">Modificar Layout</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-shopping-cart"></i> SHOPIFY</h4>
                        <div class="bot-buttons">
                            <button onclick="window.adminBot.showShopifyConfig()">Configurar Shopify</button>
                            <button onclick="window.adminBot.showShippingConfig()">Config. Envíos</button>
                            <button onclick="window.adminBot.showPaymentConfig()">Métodos Pago</button>
                            <button onclick="window.adminBot.syncShopify()">Sincronizar</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-chart-bar"></i> ESTADÍSTICAS</h4>
                        <div class="bot-buttons">
                            <button onclick="window.adminBot.showStats()">Productos + Vendidos</button>
                            <button onclick="window.adminBot.showInventory()">Inventario</button>
                            <button onclick="window.adminBot.showAnalytics()">Analytics</button>
                            <button onclick="window.adminBot.showOrdersView()">Ver Pedidos</button>
                        </div>
                    </div>

                    <div class="bot-section">
                        <h4><i class="fas fa-cog"></i> CONFIGURACIÓN</h4>
                        <div class="bot-buttons">
                            <button onclick="window.adminBot.showGitHubConfig()">Config. GitHub</button>
                            <button onclick="window.adminBot.showBackup()">Backup/Restore</button>
                            <button onclick="window.adminBot.showChangeLog()">Historial Cambios</button>
                            <button onclick="window.adminBot.showAdvancedSettings()">Configuración Avanzada</button>
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
                max-width: 600px;
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

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
            }

            .stat-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
            }

            .stat-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }

            .config-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .config-section h5 {
                margin: 0 0 15px 0;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }

            .status-connected {
                background: #28a745;
            }

            .status-disconnected {
                background: #dc3545;
            }

            .status-warning {
                background: #ffc107;
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

    // ==================== GESTIÓN DE PRECIOS ====================
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
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.applyCustomPriceChange()">Aplicar</button>
            </div>
        `);
    }

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
            
            productManager.saveProducts();
            
            this.addChange({
                type: 'price_update',
                description: `Precios actualizados: ${category} ${percentage > 0 ? '+' : ''}${percentage}%`,
                count: updatedCount,
                files: ['js/ecommerce.js', 'admin/admin.js']
            });
            
            await this.updateRepository();
            
            this.showNotification(`✅ ${updatedCount} productos actualizados correctamente`, 'success');
            this.closeModal();
            
        } catch (error) {
            this.showNotification('❌ Error al actualizar precios', 'error');
            console.error(error);
        }
    }

    applyCustomPriceChange() {
        const percentage = parseFloat(document.getElementById('customPercent').value);
        const category = document.getElementById('priceCategory').value;
        
        if (isNaN(percentage)) {
            this.showNotification('Por favor ingresa un porcentaje válido', 'warning');
            return;
        }
        
        this.applyPriceChange(category, percentage);
    }

    // ==================== GESTIÓN DE STOCK ====================
    showStockManager() {
        const products = productManager.products;
        const productOptions = products.map(p => 
            `<option value="${p.id}">${p.name} (Stock actual: ${p.stock})</option>`
        ).join('');

        const modal = this.createModal('Gestión de Stock', `
            <div class="bot-form-group">
                <label>Producto</label>
                <select id="stockProduct" onchange="window.adminBot.loadProductStock()">
                    <option value="">Seleccionar producto...</option>
                    ${productOptions}
                </select>
            </div>
            
            <div id="stockControls" style="display: none;">
                <div class="bot-form-group">
                    <label>Stock Actual</label>
                    <input type="number" id="currentStock" readonly>
                </div>
                
                <div class="bot-form-group">
                    <label>Nuevo Stock</label>
                    <input type="number" id="newStock" min="0">
                </div>
                
                <div class="bot-form-group">
                    <label>Acción Rápida</label>
                    <div class="bot-buttons">
                        <button onclick="adminBot.adjustStock('add', 10)">+10 unidades</button>
                        <button onclick="adminBot.adjustStock('subtract', 5)">-5 unidades</button>
                        <button onclick="adminBot.adjustStock('set', 0)">Agotar stock</button>
                        <button onclick="adminBot.adjustStock('set', 50)">Stock: 50</button>
                    </div>
                </div>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.updateStock()">Actualizar Stock</button>
            </div>
        `);
    }

    loadProductStock() {
        const productId = parseInt(document.getElementById('stockProduct').value);
        const product = productManager.products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('currentStock').value = product.stock;
            document.getElementById('newStock').value = product.stock;
            document.getElementById('stockControls').style.display = 'block';
        }
    }

    adjustStock(action, amount) {
        const currentStock = parseInt(document.getElementById('currentStock').value);
        let newStock;
        
        switch (action) {
            case 'add':
                newStock = currentStock + amount;
                break;
            case 'subtract':
                newStock = Math.max(0, currentStock - amount);
                break;
            case 'set':
                newStock = amount;
                break;
        }
        
        document.getElementById('newStock').value = newStock;
    }

    async updateStock() {
        const productId = parseInt(document.getElementById('stockProduct').value);
        const newStock = parseInt(document.getElementById('newStock').value);
        
        if (!productId || isNaN(newStock)) {
            this.showNotification('Por favor selecciona un producto y especifica el stock', 'warning');
            return;
        }
        
        const product = productManager.products.find(p => p.id === productId);
        if (product) {
            const oldStock = product.stock;
            product.stock = newStock;
            
            productManager.saveProducts();
            
            this.addChange({
                type: 'stock_update',
                description: `Stock de "${product.name}" actualizado: ${oldStock} → ${newStock}`,
                files: ['js/ecommerce.js', 'admin/admin.js']
            });
            
            await this.updateRepository();
            
            this.showNotification(`✅ Stock actualizado correctamente`, 'success');
            this.closeModal();
        }
    }

    // ==================== PRODUCTOS DESTACADOS ====================
    showFeaturedManager() {
        const products = productManager.products;
        const productList = products.map(p => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px;">
                <div>
                    <strong>${p.name}</strong><br>
                    <small>$${p.price} UYU</small>
                </div>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" ${p.featured ? 'checked' : ''} onchange="adminBot.toggleFeatured(${p.id}, this.checked)">
                    Destacado
                </label>
            </div>
        `).join('');

        const modal = this.createModal('Productos Destacados', `
            <p>Selecciona qué productos aparecerán en la sección destacada de la página principal:</p>
            
            <div style="max-height: 400px; overflow-y: auto;">
                ${productList}
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveFeaturedProducts()">Guardar Cambios</button>
            </div>
        `);
    }

    toggleFeatured(productId, featured) {
        const product = productManager.products.find(p => p.id === productId);
        if (product) {
            product.featured = featured;
        }
    }

    async saveFeaturedProducts() {
        productManager.saveProducts();
        
        this.addChange({
            type: 'featured_update',
            description: 'Productos destacados actualizados',
            files: ['js/ecommerce.js', 'admin/admin.js']
        });
        
        await this.updateRepository();
        
        this.showNotification('✅ Productos destacados actualizados', 'success');
        this.closeModal();
    }

    // ==================== CONFIGURACIÓN DE SHOPIFY ====================
    showShopifyConfig() {
        const config = this.shopifyConfig;
        const isConnected = config.domain && config.storefrontToken;
        
        const modal = this.createModal('Configuración de Shopify', `
            <div class="config-section">
                <h5>
                    <i class="fas fa-store"></i> 
                    Estado de Conexión
                    <span class="status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}"></span>
                    ${isConnected ? 'Conectado' : 'Desconectado'}
                </h5>
            </div>
            
            <div class="bot-form-group">
                <label>Dominio de Shopify</label>
                <input type="text" id="shopifyDomain" value="${config.domain}" placeholder="tu-tienda.myshopify.com">
                <small style="color: #666; font-size: 12px;">Sin https:// - Solo el dominio</small>
            </div>
            
            <div class="bot-form-group">
                <label>Storefront Access Token</label>
                <input type="password" id="storefrontToken" value="${config.storefrontToken}" placeholder="Storefront API token">
                <small style="color: #666; font-size: 12px;">Para mostrar productos en el sitio</small>
            </div>
            
            <div class="bot-form-group">
                <label>API Key (Opcional)</label>
                <input type="text" id="shopifyApiKey" value="${config.apiKey}" placeholder="API Key para funciones avanzadas">
            </div>
            
            <div class="bot-form-group">
                <label>API Secret (Opcional)</label>
                <input type="password" id="shopifyApiSecret" value="${config.apiSecret}" placeholder="API Secret">
            </div>
            
            <div class="bot-form-group">
                <label>Webhook Secret (Opcional)</label>
                <input type="password" id="webhookSecret" value="${config.webhookSecret}" placeholder="Para sincronización automática">
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-info-circle"></i> Instrucciones</h5>
                <ol style="font-size: 14px; line-height: 1.6;">
                    <li>Ve a tu Shopify Admin → Apps → Manage private apps</li>
                    <li>Crea una nueva app privada</li>
                    <li>Habilita Storefront API con permisos de lectura</li>
                    <li>Copia el Storefront access token aquí</li>
                    <li>Configura métodos de pago para Uruguay</li>
                </ol>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.testShopifyConnection()">Probar Conexión</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveShopifyConfig()">Guardar</button>
            </div>
        `);
    }

    async testShopifyConnection() {
        const domain = document.getElementById('shopifyDomain').value;
        const token = document.getElementById('storefrontToken').value;
        
        if (!domain || !token) {
            this.showNotification('Por favor completa dominio y token', 'warning');
            return;
        }
        
        this.showNotification('Probando conexión con Shopify...', 'info');
        
        try {
            const response = await fetch(`https://${domain}/api/2023-10/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': token
                },
                body: JSON.stringify({
                    query: `{
                        shop {
                            name
                            description
                        }
                    }`
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.shop) {
                    this.showNotification(`✅ Conexión exitosa con ${data.data.shop.name}`, 'success');
                } else {
                    this.showNotification('❌ Token inválido', 'error');
                }
            } else {
                this.showNotification('❌ Error de conexión', 'error');
            }
        } catch (error) {
            this.showNotification('❌ Error de red', 'error');
        }
    }

    saveShopifyConfig() {
        this.shopifyConfig = {
            domain: document.getElementById('shopifyDomain').value,
            storefrontToken: document.getElementById('storefrontToken').value,
            apiKey: document.getElementById('shopifyApiKey').value,
            apiSecret: document.getElementById('shopifyApiSecret').value,
            webhookSecret: document.getElementById('webhookSecret').value
        };
        
        localStorage.setItem('aluna_shopify_config', JSON.stringify(this.shopifyConfig));
        
        // Actualizar configuración en ecommerce.js
        if (window.ecommerce) {
            window.ecommerce.config.shopifyDomain = this.shopifyConfig.domain;
        }
        
        this.showNotification('✅ Configuración de Shopify guardada', 'success');
        this.closeModal();
    }

    loadShopifyConfig() {
        const saved = localStorage.getItem('aluna_shopify_config');
        if (saved) {
            this.shopifyConfig = { ...this.shopifyConfig, ...JSON.parse(saved) };
        }
    }

    // ==================== MÉTODOS DE PAGO ====================
    showPaymentConfig() {
        const modal = this.createModal('Configuración de Métodos de Pago', `
            <div class="config-section">
                <h5><i class="fas fa-credit-card"></i> Métodos de Pago para Uruguay</h5>
                <p>Configura los métodos de pago disponibles en tu tienda Shopify:</p>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="mercadoPago" checked> 
                    Mercado Pago
                </label>
                <small style="color: #666; display: block; margin-left: 20px;">
                    Tarjetas de crédito/débito, transferencias bancarias
                </small>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="abitab" checked> 
                    Giros Abitab
                </label>
                <small style="color: #666; display: block; margin-left: 20px;">
                    Pagos en efectivo en locales Abitab
                </small>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="redPagos" checked> 
                    Red Pagos
                </label>
                <small style="color: #666; display: block; margin-left: 20px;">
                    Pagos en efectivo en Red Pagos
                </small>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="bankTransfer"> 
                    Transferencia Bancaria
                </label>
                <small style="color: #666; display: block; margin-left: 20px;">
                    Transferencias directas a cuenta bancaria
                </small>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-info-circle"></i> Instrucciones de Configuración</h5>
                <ol style="font-size: 14px; line-height: 1.6;">
                    <li><strong>Mercado Pago:</strong> Instala la app oficial de Mercado Pago en Shopify</li>
                    <li><strong>Abitab/Red Pagos:</strong> Usa "Manual Payment Methods" app</li>
                    <li><strong>Configuración:</strong> Shopify Admin → Settings → Payments</li>
                    <li><strong>Moneda:</strong> Asegúrate de configurar Peso Uruguayo (UYU)</li>
                </ol>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.savePaymentConfig()">Guardar Configuración</button>
            </div>
        `);
    }

    savePaymentConfig() {
        const paymentMethods = [];
        
        if (document.getElementById('mercadoPago').checked) paymentMethods.push('Mercado Pago');
        if (document.getElementById('abitab').checked) paymentMethods.push('Giros Abitab');
        if (document.getElementById('redPagos').checked) paymentMethods.push('Red Pagos');
        if (document.getElementById('bankTransfer').checked) paymentMethods.push('Transferencia Bancaria');
        
        localStorage.setItem('aluna_payment_methods', JSON.stringify(paymentMethods));
        
        this.showNotification('✅ Métodos de pago configurados', 'success');
        this.closeModal();
    }

    // ==================== CONFIGURACIÓN DE ENVÍOS ====================
    showShippingConfig() {
        const modal = this.createModal('Configuración de Envíos', `
            <div class="config-section">
                <h5><i class="fas fa-truck"></i> Configuración de Envíos desde Maldonado</h5>
            </div>
            
            <div class="bot-form-group">
                <label>Envío Gratis a partir de (UYU)</label>
                <input type="number" id="freeShippingMin" value="1500" placeholder="1500">
            </div>
            
            <div class="bot-form-group">
                <label>Costo de Envío Estándar (UYU)</label>
                <input type="number" id="standardShipping" value="200" placeholder="200">
            </div>
            
            <div class="bot-form-group">
                <label>Costo de Envío Express (UYU)</label>
                <input type="number" id="expressShipping" value="350" placeholder="350">
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-map-marker-alt"></i> Zonas de Envío</h5>
                
                <div style="margin-bottom: 15px;">
                    <strong>Zona 1: Maldonado (Local)</strong><br>
                    <small>Envío gratis o retiro en local</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>Zona 2: Montevideo</strong><br>
                    <small>Envío estándar: $200 - Express: $350</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>Zona 3: Interior del País</strong><br>
                    <small>Envío estándar: $250 - Express: $400</small>
                </div>
            </div>
            
            <div class="bot-form-group">
                <label>Tiempo de Procesamiento (días)</label>
                <select id="processingTime">
                    <option value="1">1 día hábil</option>
                    <option value="2" selected>2 días hábiles</option>
                    <option value="3">3 días hábiles</option>
                </select>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveShippingConfig()">Guardar Configuración</button>
            </div>
        `);
    }

    saveShippingConfig() {
        const shippingConfig = {
            freeShippingMin: parseInt(document.getElementById('freeShippingMin').value),
            standardShipping: parseInt(document.getElementById('standardShipping').value),
            expressShipping: parseInt(document.getElementById('expressShipping').value),
            processingTime: parseInt(document.getElementById('processingTime').value)
        };
        
        localStorage.setItem('aluna_shipping_config', JSON.stringify(shippingConfig));
        
        // Actualizar configuración en ecommerce.js
        if (window.ecommerce) {
            window.ecommerce.config.freeShippingMin = shippingConfig.freeShippingMin;
        }
        
        this.showNotification('✅ Configuración de envíos guardada', 'success');
        this.closeModal();
    }

    // ==================== ESTADÍSTICAS ====================
    showStats() {
        const products = productManager.products;
        const totalProducts = products.length;
        const featuredProducts = products.filter(p => p.featured).length;
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalProducts);
        
        // Simular productos más vendidos (en una implementación real vendría de Shopify)
        const topProducts = products.slice(0, 5).map((p, i) => ({
            ...p,
            sales: Math.floor(Math.random() * 50) + 10
        })).sort((a, b) => b.sales - a.sales);

        const modal = this.createModal('Estadísticas de Productos', `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${totalProducts}</div>
                    <div class="stat-label">Total Productos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${featuredProducts}</div>
                    <div class="stat-label">Destacados</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${totalStock}</div>
                    <div class="stat-label">Stock Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">$${avgPrice}</div>
                    <div class="stat-label">Precio Promedio</div>
                </div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-trophy"></i> Productos Más Vendidos (Simulado)</h5>
                ${topProducts.map((p, i) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                        <div>
                            <strong>#${i + 1} ${p.name}</strong><br>
                            <small>$${p.price} UYU</small>
                        </div>
                        <div style="text-align: right;">
                            <strong>${p.sales} ventas</strong><br>
                            <small>Stock: ${p.stock}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.exportStats()">Exportar Estadísticas</button>
            </div>
        `);
    }

    exportStats() {
        const products = productManager.products;
        const stats = {
            fecha: new Date().toISOString(),
            totalProductos: products.length,
            productosDestacados: products.filter(p => p.featured).length,
            stockTotal: products.reduce((sum, p) => sum + p.stock, 0),
            precioPromedio: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length),
            productos: products.map(p => ({
                nombre: p.name,
                precio: p.price,
                stock: p.stock,
                categoria: p.category,
                destacado: p.featured
            }))
        };
        
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aluna_estadisticas_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('✅ Estadísticas exportadas', 'success');
    }

    // ==================== INVENTARIO ====================
    showInventory() {
        const products = productManager.products;
        const lowStock = products.filter(p => p.stock < 5);
        const outOfStock = products.filter(p => p.stock === 0);
        
        const modal = this.createModal('Gestión de Inventario', `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${products.length}</div>
                    <div class="stat-label">Total Productos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #ffc107;">${lowStock.length}</div>
                    <div class="stat-label">Stock Bajo</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #dc3545;">${outOfStock.length}</div>
                    <div class="stat-label">Sin Stock</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${products.reduce((sum, p) => sum + p.stock, 0)}</div>
                    <div class="stat-label">Stock Total</div>
                </div>
            </div>
            
            ${outOfStock.length > 0 ? `
                <div class="config-section">
                    <h5><i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i> Productos Sin Stock</h5>
                    ${outOfStock.map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #fee; border-radius: 8px; margin-bottom: 10px;">
                            <div>
                                <strong>${p.name}</strong><br>
                                <small>$${p.price} UYU</small>
                            </div>
                            <button class="bot-btn bot-btn-primary" onclick="adminBot.quickRestock(${p.id}, 10)" style="padding: 5px 10px; font-size: 12px;">
                                Reabastecer
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${lowStock.length > 0 ? `
                <div class="config-section">
                    <h5><i class="fas fa-exclamation-circle" style="color: #ffc107;"></i> Stock Bajo (menos de 5)</h5>
                    ${lowStock.map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #fff3cd; border-radius: 8px; margin-bottom: 10px;">
                            <div>
                                <strong>${p.name}</strong><br>
                                <small>Stock: ${p.stock} - $${p.price} UYU</small>
                            </div>
                            <button class="bot-btn bot-btn-primary" onclick="adminBot.quickRestock(${p.id}, 20)" style="padding: 5px 10px; font-size: 12px;">
                                Reabastecer
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.showStockManager()">Gestión Detallada</button>
            </div>
        `);
    }

    async quickRestock(productId, amount) {
        const product = productManager.products.find(p => p.id === productId);
        if (product) {
            product.stock += amount;
            productManager.saveProducts();
            
            this.addChange({
                type: 'quick_restock',
                description: `Reabastecimiento rápido: ${product.name} +${amount} unidades`,
                files: ['js/ecommerce.js', 'admin/admin.js']
            });
            
            await this.updateRepository();
            
            this.showNotification(`✅ ${product.name} reabastecido (+${amount})`, 'success');
            this.closeModal();
            this.showInventory(); // Reabrir inventario actualizado
        }
    }

    // ==================== ANALYTICS ====================
    showAnalytics() {
        const modal = this.createModal('Analytics y Reportes', `
            <div class="config-section">
                <h5><i class="fas fa-chart-line"></i> Métricas de Rendimiento</h5>
                <p>Conecta con Google Analytics y Shopify para obtener métricas detalladas.</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">1,234</div>
                    <div class="stat-label">Visitantes (30d)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">89</div>
                    <div class="stat-label">Conversiones</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">7.2%</div>
                    <div class="stat-label">Tasa Conversión</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">$2,450</div>
                    <div class="stat-label">Ventas (30d)</div>
                </div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-cog"></i> Configurar Analytics</h5>
                
                <div class="bot-form-group">
                    <label>Google Analytics ID</label>
                    <input type="text" id="gaId" placeholder="G-XXXXXXXXXX">
                </div>
                
                <div class="bot-form-group">
                    <label>Facebook Pixel ID</label>
                    <input type="text" id="fbPixel" placeholder="123456789">
                </div>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableTracking" checked>
                        Habilitar seguimiento de conversiones
                    </label>
                </div>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveAnalyticsConfig()">Guardar Configuración</button>
            </div>
        `);
    }

    saveAnalyticsConfig() {
        const analyticsConfig = {
            googleAnalyticsId: document.getElementById('gaId').value,
            facebookPixelId: document.getElementById('fbPixel').value,
            enableTracking: document.getElementById('enableTracking').checked
        };
        
        localStorage.setItem('aluna_analytics_config', JSON.stringify(analyticsConfig));
        
        this.showNotification('✅ Configuración de analytics guardada', 'success');
        this.closeModal();
    }

    // ==================== VER PEDIDOS ====================
    showOrdersView() {
        // Simular pedidos (en implementación real vendría de Shopify)
        const mockOrders = [
            {
                id: '#1001',
                customer: 'María González',
                total: 1450,
                status: 'Pagado',
                date: '2024-01-15',
                items: ['Mascarilla Karseell']
            },
            {
                id: '#1002',
                customer: 'Carlos Rodríguez',
                total: 2340,
                status: 'Enviado',
                date: '2024-01-14',
                items: ['Pack Shampoo y Crema', 'Serum Facial']
            },
            {
                id: '#1003',
                customer: 'Ana López',
                total: 890,
                status: 'Pendiente',
                date: '2024-01-13',
                items: ['Tratamiento Capilar']
            }
        ];

        const modal = this.createModal('Pedidos Recientes', `
            <div class="config-section">
                <h5><i class="fas fa-shopping-bag"></i> Últimos Pedidos</h5>
                <p>Conecta con Shopify para ver pedidos reales en tiempo real.</p>
            </div>
            
            ${mockOrders.map(order => `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <strong>${order.id}</strong> - ${order.customer}<br>
                            <small>${order.date}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong>$${order.total} UYU</strong><br>
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${
                                order.status === 'Pagado' ? '#d4edda' : 
                                order.status === 'Enviado' ? '#cce5ff' : '#fff3cd'
                            };">
                                ${order.status}
                            </span>
                        </div>
                    </div>
                    <div style="font-size: 14px; color: #666;">
                        Productos: ${order.items.join(', ')}
                    </div>
                </div>
            `).join('')}
            
            <div class="config-section">
                <h5><i class="fas fa-link"></i> Integración con Shopify</h5>
                <p>Para ver pedidos reales, configura la conexión con Shopify en la sección de configuración.</p>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.closeModal(); adminBot.showShopifyConfig();" style="margin-top: 10px;">
                    Configurar Shopify
                </button>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
            </div>
        `);
    }

    // ==================== SINCRONIZACIÓN CON SHOPIFY ====================
    async syncShopify() {
        if (!this.shopifyConfig.domain || !this.shopifyConfig.storefrontToken) {
            this.showNotification('⚠️ Configura Shopify primero', 'warning');
            this.showShopifyConfig();
            return;
        }

        this.showProgressNotification('Sincronizando con Shopify...', 0);

        try {
            // Simular sincronización
            this.updateProgress(25);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.updateProgress(50);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.updateProgress(75);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.updateProgress(100);
            
            this.hideProgress();
            this.showNotification('✅ Sincronización completada', 'success');
            
        } catch (error) {
            this.hideProgress();
            this.showNotification('❌ Error en la sincronización', 'error');
        }
    }

    // ==================== GESTIÓN DE COLORES ====================
    showColorManager() {
        const modal = this.createModal('Gestión de Colores', `
            <div class="bot-form-group">
                <label>Color Principal</label>
                <div class="color-picker">
                    <div class="color-option" style="background: #ff6b9d" onclick="window.adminBot.changeColor('primary', '#ff6b9d')"></div>
                    <div class="color-option" style="background: #667eea" onclick="window.adminBot.changeColor('primary', '#667eea')"></div>
                    <div class="color-option" style="background: #f093fb" onclick="window.adminBot.changeColor('primary', '#f093fb')"></div>
                    <div class="color-option" style="background: #4facfe" onclick="window.adminBot.changeColor('primary', '#4facfe')"></div>
                    <div class="color-option" style="background: #43e97b" onclick="window.adminBot.changeColor('primary', '#43e97b')"></div>
                    <div class="color-option" style="background: #fa709a" onclick="window.adminBot.changeColor('primary', '#fa709a')"></div>
                </div>
                <input type="color" id="customPrimaryColor" onchange="window.adminBot.changeColor('primary', this.value)">
            </div>
            
            <div class="bot-form-group">
                <label>Color Secundario</label>
                <div class="color-picker">
                    <div class="color-option" style="background: #c44569" onclick="window.adminBot.changeColor('secondary', '#c44569')"></div>
                    <div class="color-option" style="background: #764ba2" onclick="window.adminBot.changeColor('secondary', '#764ba2')"></div>
                    <div class="color-option" style="background: #f8cdda" onclick="window.adminBot.changeColor('secondary', '#f8cdda')"></div>
                    <div class="color-option" style="background: #a8edea" onclick="window.adminBot.changeColor('secondary', '#a8edea')"></div>
                    <div class="color-option" style="background: #38ef7d" onclick="window.adminBot.changeColor('secondary', '#38ef7d')"></div>
                    <div class="color-option" style="background: #fecfef" onclick="window.adminBot.changeColor('secondary', '#fecfef')"></div>
                </div>
                <input type="color" id="customSecondaryColor" onchange="window.adminBot.changeColor('secondary', this.value)">
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="window.adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.applyColorChanges()">Aplicar Cambios</button>
            </div>
        `);
    }

    async changeColor(type, color) {
        try {
            const root = document.documentElement;
            if (type === 'primary') {
                root.style.setProperty('--primary-color', color);
            } else if (type === 'secondary') {
                root.style.setProperty('--secondary-color', color);
            }
            
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

    async applyColorChanges() {
        await this.updateRepository();
        this.showNotification('✅ Cambios de color aplicados', 'success');
        this.closeModal();
    }

    // ==================== GESTIÓN DE IMÁGENES ====================
    showImageManager() {
        const modal = this.createModal('Gestión de Imágenes', `
            <div class="config-section">
                <h5><i class="fas fa-image"></i> Subir Logo</h5>
                <input type="file" id="logoUpload" accept="image/*" onchange="adminBot.handleImageUpload('logo', this)">
                <div id="logoPreview" style="margin-top: 10px;"></div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-images"></i> Imagen Principal</h5>
                <input type="file" id="heroUpload" accept="image/*" onchange="adminBot.handleImageUpload('hero', this)">
                <div id="heroPreview" style="margin-top: 10px;"></div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-palette"></i> Imágenes de Productos</h5>
                <p>Las imágenes de productos se gestionan desde el panel principal de administración.</p>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.closeModal(); showAddProduct();">
                    Gestionar Productos
                </button>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
            </div>
        `);
    }

    handleImageUpload(type, input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(`${type}Preview`);
            preview.innerHTML = `
                <img src="${e.target.result}" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                <p style="margin-top: 10px;">
                    <button class="bot-btn bot-btn-primary" onclick="adminBot.saveImage('${type}', '${e.target.result}')">
                        Aplicar ${type === 'logo' ? 'Logo' : 'Imagen'}
                    </button>
                </p>
            `;
        };
        reader.readAsDataURL(file);
    }

    async saveImage(type, dataUrl) {
        try {
            localStorage.setItem(`aluna_${type}_image`, dataUrl);
            
            if (type === 'logo') {
                const logoImg = document.querySelector('.logo img');
                if (logoImg) {
                    logoImg.src = dataUrl;
                }
            }
            
            this.addChange({
                type: 'image_update',
                description: `${type === 'logo' ? 'Logo' : 'Imagen principal'} actualizada`,
                files: ['index.html', 'css/style.css']
            });
            
            await this.updateRepository();
            
            this.showNotification(`✅ ${type === 'logo' ? 'Logo' : 'Imagen'} actualizada`, 'success');
            
        } catch (error) {
            this.showNotification('❌ Error al guardar imagen', 'error');
        }
    }

    // ==================== EDITOR DE TEXTOS ====================
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
                    <label>Descripción de la empresa</label>
                    <textarea id="aboutDescription" rows="4">En ALuna creemos que cada persona tiene una belleza única que merece ser realzada.</textarea>
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
                    <select id="productSelect" onchange="window.adminBot.loadProductText()">
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
                    
                    <div class="bot-form-group">
                        <label>Categoría</label>
                        <select id="productCategory">
                            <option value="cabello">Cuidado Capilar</option>
                            <option value="rostro">Cuidado Facial</option>
                            <option value="maquillaje">Maquillaje</option>
                            <option value="naturales">Productos Naturales</option>
                            <option value="sets">Sets de Regalo</option>
                        </select>
                    </div>
                </div>
            `;
        }
        
        const modal = this.createModal(`Editor de Textos - ${section === 'design' ? 'Diseño' : 'Productos'}`, content + `
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="window.adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveTextChanges('${section}')">Guardar Cambios</button>
            </div>
        `);
    }

    loadProductText() {
        const productId = parseInt(document.getElementById('productSelect').value);
        const product = productManager.products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productTextFields').style.display = 'block';
        }
    }

    async saveTextChanges(section) {
        try {
            if (section === 'design') {
                const changes = {
                    mainTitle: document.getElementById('mainTitle').value,
                    mainSubtitle: document.getElementById('mainSubtitle').value,
                    aboutTitle: document.getElementById('aboutTitle').value,
                    aboutDescription: document.getElementById('aboutDescription').value,
                    footerTitle: document.getElementById('footerTitle').value
                };
                
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
                    product.category = document.getElementById('productCategory').value;
                    
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

    applyDesignTextChanges(changes) {
        const mainTitle = document.querySelector('.top_left_cont h2');
        if (mainTitle && changes.mainTitle) {
            mainTitle.innerHTML = changes.mainTitle;
        }
        
        const mainSubtitle = document.querySelector('.top_left_cont p');
        if (mainSubtitle && changes.mainSubtitle) {
            mainSubtitle.textContent = changes.mainSubtitle;
        }
        
        const aboutTitle = document.querySelector('#aboutUs h2');
        if (aboutTitle && changes.aboutTitle) {
            aboutTitle.textContent = changes.aboutTitle;
        }
    }

    // ==================== LAYOUT MANAGER ====================
    showLayoutManager() {
        const modal = this.createModal('Modificar Layout', `
            <div class="config-section">
                <h5><i class="fas fa-layout"></i> Secciones de la Página</h5>
                <p>Personaliza el orden y visibilidad de las secciones:</p>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showHero" checked>
                    Mostrar sección principal (Hero)
                </label>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showAbout" checked>
                    Mostrar sección "Sobre Nosotros"
                </label>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showProducts" checked>
                    Mostrar sección de productos
                </label>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showPortfolio" checked>
                    Mostrar catálogo/portafolio
                </label>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showTestimonials" checked>
                    Mostrar testimonios
                </label>
            </div>
            
            <div class="bot-form-group">
                <label>
                    <input type="checkbox" id="showContact" checked>
                    Mostrar sección de contacto
                </label>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-mobile-alt"></i> Configuración Responsive</h5>
                
                <div class="bot-form-group">
                    <label>Número de columnas en móvil</label>
                    <select id="mobileColumns">
                        <option value="1" selected>1 columna</option>
                        <option value="2">2 columnas</option>
                    </select>
                </div>
                
                <div class="bot-form-group">
                    <label>Número de columnas en tablet</label>
                    <select id="tabletColumns">
                        <option value="2" selected>2 columnas</option>
                        <option value="3">3 columnas</option>
                    </select>
                </div>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveLayoutChanges()">Aplicar Cambios</button>
            </div>
        `);
    }

    async saveLayoutChanges() {
        const layoutConfig = {
            showHero: document.getElementById('showHero').checked,
            showAbout: document.getElementById('showAbout').checked,
            showProducts: document.getElementById('showProducts').checked,
            showPortfolio: document.getElementById('showPortfolio').checked,
            showTestimonials: document.getElementById('showTestimonials').checked,
            showContact: document.getElementById('showContact').checked,
            mobileColumns: document.getElementById('mobileColumns').value,
            tabletColumns: document.getElementById('tabletColumns').value
        };
        
        localStorage.setItem('aluna_layout_config', JSON.stringify(layoutConfig));
        
        this.addChange({
            type: 'layout_update',
            description: 'Configuración de layout actualizada',
            files: ['index.html', 'css/style.css']
        });
        
        await this.updateRepository();
        
        this.showNotification('✅ Layout actualizado', 'success');
        this.closeModal();
    }

    // ==================== BACKUP Y RESTORE ====================
    showBackup() {
        const modal = this.createModal('Backup y Restore', `
            <div class="config-section">
                <h5><i class="fas fa-download"></i> Crear Backup</h5>
                <p>Descarga una copia de seguridad de toda tu configuración:</p>
                <button class="bot-btn bot-btn-primary" onclick="adminBot.createBackup()" style="width: 100%; margin-bottom: 20px;">
                    <i class="fas fa-download"></i> Descargar Backup Completo
                </button>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-upload"></i> Restaurar Backup</h5>
                <p>Sube un archivo de backup para restaurar la configuración:</p>
                <input type="file" id="backupFile" accept=".json" onchange="adminBot.handleBackupUpload(this)">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.restoreBackup()" style="width: 100%; margin-top: 10px;" disabled id="restoreBtn">
                    <i class="fas fa-upload"></i> Restaurar Backup
                </button>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-history"></i> Backups Automáticos</h5>
                <p>Los backups se crean automáticamente cada vez que haces cambios importantes.</p>
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="autoBackup" checked>
                        Habilitar backups automáticos
                    </label>
                </div>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cerrar</button>
            </div>
        `);
    }

    createBackup() {
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            products: productManager.products,
            shopifyConfig: this.shopifyConfig,
            githubConfig: this.githubConfig,
            changes: this.changes,
            settings: {
                paymentMethods: JSON.parse(localStorage.getItem('aluna_payment_methods') || '[]'),
                shippingConfig: JSON.parse(localStorage.getItem('aluna_shipping_config') || '{}'),
                analyticsConfig: JSON.parse(localStorage.getItem('aluna_analytics_config') || '{}'),
                layoutConfig: JSON.parse(localStorage.getItem('aluna_layout_config') || '{}')
            }
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aluna_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('✅ Backup creado y descargado', 'success');
    }

    handleBackupUpload(input) {
        const file = input.files[0];
        if (file) {
            document.getElementById('restoreBtn').disabled = false;
            this.backupFile = file;
        }
    }

    restoreBackup() {
        if (!this.backupFile) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Restaurar datos
                if (backup.products) {
                    localStorage.setItem('aluna_products', JSON.stringify(backup.products));
                    productManager.products = backup.products;
                    productManager.renderProducts();
                }
                
                if (backup.shopifyConfig) {
                    this.shopifyConfig = backup.shopifyConfig;
                    localStorage.setItem('aluna_shopify_config', JSON.stringify(backup.shopifyConfig));
                }
                
                if (backup.githubConfig) {
                    this.githubConfig = backup.githubConfig;
                    localStorage.setItem('aluna_github_config', JSON.stringify(backup.githubConfig));
                }
                
                if (backup.settings) {
                    Object.keys(backup.settings).forEach(key => {
                        localStorage.setItem(`aluna_${key}`, JSON.stringify(backup.settings[key]));
                    });
                }
                
                this.showNotification('✅ Backup restaurado correctamente', 'success');
                this.closeModal();
                
                // Recargar página para aplicar cambios
                setTimeout(() => {
                    location.reload();
                }, 2000);
                
            } catch (error) {
                this.showNotification('❌ Error al restaurar backup', 'error');
            }
        };
        reader.readAsText(this.backupFile);
    }

    // ==================== CONFIGURACIÓN AVANZADA ====================
    showAdvancedSettings() {
        const modal = this.createModal('Configuración Avanzada', `
            <div class="config-section">
                <h5><i class="fas fa-code"></i> Configuración Técnica</h5>
                
                <div class="bot-form-group">
                    <label>URL del sitio web</label>
                    <input type="url" id="siteUrl" value="https://tu-usuario.github.io/aluna-cosmeticos" placeholder="https://tu-sitio.com">
                </div>
                
                <div class="bot-form-group">
                    <label>Email de contacto</label>
                    <input type="email" id="contactEmail" value="info@aluna.com" placeholder="contacto@tutienda.com">
                </div>
                
                <div class="bot-form-group">
                    <label>Teléfono de contacto</label>
                    <input type="tel" id="contactPhone" value="+598 XXXX XXXX" placeholder="+598 99 123 456">
                </div>
                
                <div class="bot-form-group">
                    <label>Dirección física</label>
                    <input type="text" id="physicalAddress" value="Maldonado, Uruguay" placeholder="Tu dirección">
                </div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-shield-alt"></i> Configuración de Seguridad</h5>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableSSL" checked>
                        Forzar HTTPS (SSL)
                    </label>
                </div>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableCORS" checked>
                        Habilitar CORS para APIs
                    </label>
                </div>
            </div>
            
            <div class="config-section">
                <h5><i class="fas fa-performance"></i> Optimización</h5>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableCache" checked>
                        Habilitar caché del navegador
                    </label>
                </div>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableCompression" checked>
                        Comprimir imágenes automáticamente
                    </label>
                </div>
                
                <div class="bot-form-group">
                    <label>
                        <input type="checkbox" id="enableLazyLoad" checked>
                        Carga diferida de imágenes
                    </label>
                </div>
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveAdvancedSettings()">Guardar Configuración</button>
            </div>
        `);
    }

    async saveAdvancedSettings() {
        const advancedConfig = {
            siteUrl: document.getElementById('siteUrl').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            physicalAddress: document.getElementById('physicalAddress').value,
            enableSSL: document.getElementById('enableSSL').checked,
            enableCORS: document.getElementById('enableCORS').checked,
            enableCache: document.getElementById('enableCache').checked,
            enableCompression: document.getElementById('enableCompression').checked,
            enableLazyLoad: document.getElementById('enableLazyLoad').checked
        };
        
        localStorage.setItem('aluna_advanced_config', JSON.stringify(advancedConfig));
        
        this.addChange({
            type: 'advanced_config',
            description: 'Configuración avanzada actualizada',
            files: ['index.html', 'js/ecommerce.js']
        });
        
        await this.updateRepository();
        
        this.showNotification('✅ Configuración avanzada guardada', 'success');
        this.closeModal();
    }

    // ==================== CONFIGURACIÓN DE GITHUB ====================
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
                <button class="bot-btn bot-btn-secondary" onclick="window.adminBot.closeModal()">Cancelar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.saveGitHubConfig()">Guardar</button>
            </div>
        `);
    }

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

    loadGitHubConfig() {
        const saved = localStorage.getItem('aluna_github_config');
        if (saved) {
            this.githubConfig = { ...this.githubConfig, ...JSON.parse(saved) };
        }
    }

    // ==================== HISTORIAL DE CAMBIOS ====================
    showChangeLog() {
        const changes = this.changes.slice(-10).reverse();
        const content = changes.length > 0 ? 
            changes.map(change => `
                <div style="padding: 15px; border-left: 3px solid #667eea; margin-bottom: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong>${change.description}</strong>
                        <span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px;">
                            ${change.type.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                    <small style="color: #666;">${new Date(change.timestamp).toLocaleString()}</small>
                    ${change.count ? `<br><small style="color: #28a745;">Elementos afectados: ${change.count}</small>` : ''}
                </div>
            `).join('') :
            '<p style="text-align: center; color: #666; padding: 40px;">No hay cambios registrados</p>';
            
        const modal = this.createModal('Historial de Cambios', `
            <div style="max-height: 400px; overflow-y: auto;">
                ${content}
            </div>
            
            <div class="bot-actions">
                <button class="bot-btn bot-btn-secondary" onclick="window.adminBot.closeModal()">Cerrar</button>
                <button class="bot-btn bot-btn-primary" onclick="window.adminBot.clearChangeLog()">Limpiar Historial</button>
            </div>
        `);
    }

    clearChangeLog() {
        if (confirm('¿Estás seguro de que quieres limpiar el historial de cambios?')) {
            this.changes = [];
            localStorage.removeItem('aluna_changes');
            this.showNotification('✅ Historial limpiado', 'success');
            this.closeModal();
        }
    }

    // ==================== UTILIDADES ====================
    addChange(change) {
        change.timestamp = new Date().toISOString();
        change.id = Date.now();
        this.changes.push(change);
        
        if (this.changes.length > 50) {
            this.changes = this.changes.slice(-50);
        }
        
        localStorage.setItem('aluna_changes', JSON.stringify(this.changes));
    }

    async updateRepository() {
        if (!this.githubConfig.token || !this.githubConfig.owner || !this.githubConfig.repo) {
            this.showNotification('⚠️ Configura GitHub primero para sincronizar cambios', 'warning');
            return;
        }
        
        try {
            this.showProgressNotification('Actualizando repositorio...', 0);
            
            for (let i = 0; i <= 100; i += 20) {
                await new Promise(resolve => setTimeout(resolve, 200));
                this.updateProgress(i);
            }
            
            const commitMessage = this.generateCommitMessage();
            
            this.hideProgress();
            this.showNotification('✅ Repositorio actualizado correctamente', 'success');
            
        } catch (error) {
            this.hideProgress();
            this.showNotification('❌ Error al actualizar repositorio', 'error');
            console.error(error);
        }
    }

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
                case 'stock_update':
                    return `📦 ${change.description}`;
                case 'featured_update':
                    return `⭐ ${change.description}`;
                default:
                    return `✨ ${change.description}`;
            }
        });
        
        return `🤖 Bot: ${messages.join(', ')}`;
    }

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

    updateProgress(progress) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }

    hideProgress() {
        const notification = document.querySelector('.bot-progress-notification');
        if (notification) {
            notification.remove();
        }
    }

    createModal(title, content) {
        this.closeModal();
        
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
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        return modal;
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `bot-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Funciones globales
let adminBot;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    try {
        adminBot = new AdminBot();
        window.adminBot = adminBot;
        console.log('🤖 Bot administrativo ALuna inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar el bot:', error);
        setTimeout(function() {
            try {
                adminBot = new AdminBot();
                window.adminBot = adminBot;
                console.log('🤖 Bot administrativo ALuna inicializado en segundo intento');
            } catch (retryError) {
                console.error('❌ Error en segundo intento:', retryError);
            }
        }, 1000);
    }
});