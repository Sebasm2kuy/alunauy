// API de GitHub para actualización automática del repositorio - VERSIÓN CORREGIDA
class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.baseURL = 'https://api.github.com';
        this.validateConfig();
    }

    // Validar configuración
    validateConfig() {
        if (!this.config.token) {
            throw new Error('Token de GitHub requerido');
        }
        if (!this.config.owner) {
            throw new Error('Owner del repositorio requerido');
        }
        if (!this.config.repo) {
            throw new Error('Nombre del repositorio requerido');
        }
        this.config.branch = this.config.branch || 'main';
    }

    // Obtener información del repositorio
    async getRepo() {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error ${response.status}: ${error.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo repositorio:', error);
            throw error;
        }
    }

    // Obtener contenido de un archivo
    async getFileContent(path) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
            if (response.status === 404) {
                return null; // Archivo no existe
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error ${response.status}: ${error.message || response.statusText}`);
            }
            
            const data = await response.json();
            return {
                content: atob(data.content.replace(/\n/g, '')),
                sha: data.sha
            };
        } catch (error) {
            console.error(`Error obteniendo archivo ${path}:`, error);
            throw error;
        }
    }

    // Actualizar o crear archivo
    async updateFile(path, content, message, sha = null) {
        try {
            const body = {
                message: message,
                content: btoa(unescape(encodeURIComponent(content))),
                branch: this.config.branch
            };
            
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error ${response.status}: ${error.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error actualizando archivo ${path}:`, error);
            throw error;
        }
    }

    // Verificar permisos del token
    async checkPermissions() {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
            if (!response.ok) {
                return false;
            }
            
            const repo = await response.json();
            return repo.permissions && (repo.permissions.push || repo.permissions.admin);
            
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return false;
        }
    }

    // Obtener commits recientes
    async getRecentCommits(limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/commits?per_page=${limit}&sha=${this.config.branch}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error ${response.status}: ${error.message || response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo commits:', error);
            throw error;
        }
    }
}

// Extender ProductManager con funcionalidad real de GitHub
if (typeof ProductManager !== 'undefined') {
    // Configuración de GitHub
    ProductManager.prototype.setupGitHub = function() {
        const savedConfig = localStorage.getItem('aluna_github_config');
        if (savedConfig) {
            try {
                this.githubConfig = JSON.parse(savedConfig);
                this.githubAPI = new GitHubAPI(this.githubConfig);
                console.log('✅ GitHub configurado correctamente');
                return true;
            } catch (error) {
                console.error('❌ Error en configuración de GitHub:', error);
                return false;
            }
        }
        return false;
    };

    // Mostrar modal de configuración de GitHub
    ProductManager.prototype.showGitHubConfig = function() {
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fab fa-github"></i> Configurar GitHub
                        </h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <h6><i class="fas fa-info-circle"></i> Instrucciones:</h6>
                            <ol>
                                <li>Ve a <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings > Developer settings > Personal access tokens</a></li>
                                <li>Crea un nuevo token con permisos de <strong>repo</strong></li>
                                <li>Copia el token y pégalo aquí</li>
                            </ol>
                        </div>
                        
                        <form id="githubConfigForm">
                            <div class="mb-3">
                                <label class="form-label">Token de GitHub *</label>
                                <input type="password" class="form-control" id="githubToken" required 
                                       placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
                                <small class="form-text text-muted">Token con permisos de repositorio</small>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Usuario/Organización *</label>
                                        <input type="text" class="form-control" id="githubOwner" required 
                                               placeholder="tu-usuario">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre del Repositorio *</label>
                                        <input type="text" class="form-control" id="githubRepo" required 
                                               placeholder="aluna-cosmeticos">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Rama</label>
                                <input type="text" class="form-control" id="githubBranch" value="main" 
                                       placeholder="main">
                            </div>
                        </form>
                        
                        <div id="githubStatus" class="mt-3"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-primary" onclick="productManager.saveGitHubConfig()">
                            <i class="fas fa-save"></i> Guardar y Probar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cargar configuración existente
        const savedConfig = localStorage.getItem('aluna_github_config');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                document.getElementById('githubToken').value = config.token || '';
                document.getElementById('githubOwner').value = config.owner || '';
                document.getElementById('githubRepo').value = config.repo || '';
                document.getElementById('githubBranch').value = config.branch || 'main';
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        }
    };

    // Guardar configuración de GitHub
    ProductManager.prototype.saveGitHubConfig = async function() {
        const token = document.getElementById('githubToken').value.trim();
        const owner = document.getElementById('githubOwner').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();
        const branch = document.getElementById('githubBranch').value.trim() || 'main';
        
        if (!token || !owner || !repo) {
            this.showNotification('❌ Todos los campos son requeridos', 'danger');
            return;
        }
        
        const config = { token, owner, repo, branch };
        const statusDiv = document.getElementById('githubStatus');
        
        try {
            statusDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Probando conexión...</div>';
            
            // Probar la configuración
            const githubAPI = new GitHubAPI(config);
            const repoInfo = await githubAPI.getRepo();
            const hasPermissions = await githubAPI.checkPermissions();
            
            if (!hasPermissions) {
                throw new Error('El token no tiene permisos suficientes para el repositorio');
            }
            
            // Guardar configuración
            localStorage.setItem('aluna_github_config', JSON.stringify(config));
            this.githubConfig = config;
            this.githubAPI = githubAPI;
            
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> 
                    <strong>¡Conexión exitosa!</strong><br>
                    Repositorio: ${repoInfo.full_name}<br>
                    Rama: ${branch}
                </div>
            `;
            
            this.showNotification('✅ GitHub configurado correctamente', 'success');
            
            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                document.querySelector('.modal').remove();
            }, 2000);
            
        } catch (error) {
            console.error('Error configurando GitHub:', error);
            statusDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> 
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    };

    // Actualizar repositorio con cambios reales
    ProductManager.prototype.updateRepository = async function() {
        if (!this.githubAPI) {
            if (!this.setupGitHub()) {
                this.showGitHubConfig();
                return;
            }
        }
        
        try {
            this.showProgressNotification('Subiendo cambios a GitHub...', 10);
            
            // 1. Actualizar productos en formato JSON
            this.updateProgress(30);
            const productsJSON = JSON.stringify(this.products, null, 2);
            
            // Obtener archivo actual de productos
            let productsSha = null;
            try {
                const currentFile = await this.githubAPI.getFileContent('js/products.json');
                if (currentFile) {
                    productsSha = currentFile.sha;
                }
            } catch (error) {
                console.log('Archivo products.json no existe, se creará nuevo');
            }
            
            // Subir archivo de productos
            this.updateProgress(60);
            await this.githubAPI.updateFile(
                'js/products.json',
                productsJSON,
                `Actualizar productos - ${new Date().toLocaleString('es-ES')}`,
                productsSha
            );
            
            // 2. Actualizar el HTML principal con los nuevos productos
            this.updateProgress(80);
            await this.updateIndexHTML();
            
            this.updateProgress(100);
            this.hideProgress();
            
            this.showNotification('✅ Cambios subidos correctamente a GitHub', 'success');
            
            // Mostrar URL del sitio
            setTimeout(() => {
                this.showSiteUrl();
            }, 1000);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error actualizando repositorio:', error);
            this.showNotification(`❌ Error: ${error.message}`, 'danger');
        }
    };

    // Actualizar index.html con los productos
    ProductManager.prototype.updateIndexHTML = async function() {
        try {
            // Obtener el HTML actual
            const currentHTML = await this.githubAPI.getFileContent('index.html');
            if (!currentHTML) {
                throw new Error('No se pudo obtener index.html');
            }
            
            let htmlContent = currentHTML.content;
            
            // Actualizar la sección de productos destacados en el portafolio
            const portfolioSection = this.generatePortfolioHTML();
            
            // Buscar y reemplazar la sección del portafolio
            const portfolioStart = htmlContent.indexOf('<!-- Portfolio Wrapper -->');
            const portfolioEnd = htmlContent.indexOf('<!--/Portfolio Wrapper -->');
            
            if (portfolioStart !== -1 && portfolioEnd !== -1) {
                const beforePortfolio = htmlContent.substring(0, portfolioStart);
                const afterPortfolio = htmlContent.substring(portfolioEnd + '<!--/Portfolio Wrapper -->'.length);
                
                htmlContent = beforePortfolio + portfolioSection + afterPortfolio;
            }
            
            // Subir el HTML actualizado
            await this.githubAPI.updateFile(
                'index.html',
                htmlContent,
                `Actualizar productos en index.html - ${new Date().toLocaleString('es-ES')}`,
                currentHTML.sha
            );
            
        } catch (error) {
            console.error('Error actualizando index.html:', error);
            throw error;
        }
    };

    // Generar HTML del portafolio
    ProductManager.prototype.generatePortfolioHTML = function() {
        const featuredProducts = this.products.filter(p => p.featured).slice(0, 8);
        
        let html = '<!-- Portfolio Wrapper -->\n';
        html += '<div class="isotope fadeInLeft animated wow" style="position: relative; overflow: hidden; height: 480px;" id="portfolio_wrapper">\n';
        
        featuredProducts.forEach((product, index) => {
            const leftPos = (index % 4) * 337;
            const topPos = Math.floor(index / 4) * 240;
            
            html += `
      <!-- Portfolio Item -->
      <div style="position: absolute; left: ${leftPos}px; top: ${topPos}px; transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); width: 337px; opacity: 1;" class="portfolio-item one-four isotope-item">
        <div class="portfolio_img"> 
          <img src="${product.image}" alt="${product.name}"> 
          <div class="product-price-overlay">$${product.price} UYU</div>
        </div>        
        <div class="item_overlay">
          <div class="item_info"> 
            <h4 class="project_name">${product.name}</h4>
            <p class="project_description">${product.description}</p>
            <div class="product-actions">
              <button class="btn-add-cart" onclick="ecommerce.addToCart(${product.id})">
                <i class="fa fa-shopping-cart"></i> Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--/Portfolio Item -->
`;
        });
        
        html += '</div>\n<!--/Portfolio Wrapper -->';
        return html;
    };

    // Mostrar progreso
    ProductManager.prototype.showProgressNotification = function(message, progress) {
        let notification = document.getElementById('progress-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'progress-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                min-width: 300px;
            `;
            document.body.appendChild(notification);
        }
        
        notification.innerHTML = `
            <div style="margin-bottom: 10px;">
                <i class="fas fa-cloud-upload-alt"></i> ${message}
            </div>
            <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-primary" style="width: ${progress}%"></div>
            </div>
            <small class="text-muted">${progress}% completado</small>
        `;
    };

    // Actualizar progreso
    ProductManager.prototype.updateProgress = function(progress) {
        const notification = document.getElementById('progress-notification');
        if (notification) {
            const progressBar = notification.querySelector('.progress-bar');
            const progressText = notification.querySelector('small');
            if (progressBar) progressBar.style.width = progress + '%';
            if (progressText) progressText.textContent = progress + '% completado';
        }
    };

    // Ocultar progreso
    ProductManager.prototype.hideProgress = function() {
        const notification = document.getElementById('progress-notification');
        if (notification) {
            notification.remove();
        }
    };

    // Mostrar URL del sitio
    ProductManager.prototype.showSiteUrl = function() {
        if (!this.githubConfig) return;
        
        const siteUrl = `https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}`;
        
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-rocket"></i> ¡Sitio Actualizado!
                        </h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">🚀</div>
                        <h4>¡Los cambios están en línea!</h4>
                        <p class="text-muted">Tu sitio web se ha actualizado correctamente</p>
                        
                        <div class="alert alert-info">
                            <strong>URL del sitio:</strong><br>
                            <a href="${siteUrl}" target="_blank" class="btn btn-link">${siteUrl}</a>
                        </div>
                        
                        <p><small class="text-muted">Los cambios pueden tardar unos minutos en aparecer</small></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="window.open('${siteUrl}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> Ver Sitio
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    };

    // Sobrescribir el método saveProducts para incluir GitHub
    const originalSaveProducts = ProductManager.prototype.saveProducts;
    ProductManager.prototype.saveProducts = function() {
        // Llamar al método original
        originalSaveProducts.call(this);
        
        // Si GitHub está configurado, preguntar si quiere subir cambios
        if (this.githubAPI) {
            this.showUploadPrompt();
        }
    };

    // Mostrar prompt para subir cambios
    ProductManager.prototype.showUploadPrompt = function() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 10px;">
                <i class="fas fa-cloud-upload-alt"></i> 
                <strong>¿Subir cambios a GitHub?</strong>
            </div>
            <p style="margin: 0 0 15px 0; font-size: 14px;">
                Los productos se han guardado localmente. ¿Quieres publicarlos en tu sitio web?
            </p>
            <div>
                <button onclick="productManager.updateRepository(); this.parentElement.parentElement.remove();" 
                        class="btn btn-light btn-sm me-2">
                    <i class="fas fa-upload"></i> Sí, Publicar
                </button>
                <button onclick="this.parentElement.parentElement.remove();" 
                        class="btn btn-outline-light btn-sm">
                    Ahora no
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    };
}