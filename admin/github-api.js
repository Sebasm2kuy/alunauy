// API de GitHub para actualización automática del repositorio
class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.baseURL = 'https://api.github.com';
    }

    // Obtener información del repositorio
    async getRepo() {
        const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}`, {
            headers: {
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener repositorio: ${response.statusText}`);
        }
        
        return await response.json();
    }

    // Obtener contenido de un archivo
    async getFileContent(path) {
        const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                return null; // Archivo no existe
            }
            throw new Error(`Error al obtener archivo: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
            content: atob(data.content),
            sha: data.sha
        };
    }

    // Actualizar o crear archivo
    async updateFile(path, content, message, sha = null) {
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
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`Error al actualizar archivo: ${response.statusText}`);
        }
        
        return await response.json();
    }

    // Actualizar múltiples archivos en un solo commit
    async updateMultipleFiles(files, message) {
        try {
            // Obtener referencia de la rama
            const refResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!refResponse.ok) {
                throw new Error('Error al obtener referencia de la rama');
            }
            
            const refData = await refResponse.json();
            const baseSha = refData.object.sha;
            
            // Obtener el árbol base
            const treeResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/trees/${baseSha}`, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!treeResponse.ok) {
                throw new Error('Error al obtener árbol base');
            }
            
            // Crear blobs para cada archivo
            const tree = [];
            for (const file of files) {
                const blobResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/blobs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${this.config.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: btoa(unescape(encodeURIComponent(file.content))),
                        encoding: 'base64'
                    })
                });
                
                if (!blobResponse.ok) {
                    throw new Error(`Error al crear blob para ${file.path}`);
                }
                
                const blobData = await blobResponse.json();
                
                tree.push({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                });
            }
            
            // Crear nuevo árbol
            const newTreeResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base_tree: baseSha,
                    tree: tree
                })
            });
            
            if (!newTreeResponse.ok) {
                throw new Error('Error al crear nuevo árbol');
            }
            
            const newTreeData = await newTreeResponse.json();
            
            // Crear commit
            const commitResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    tree: newTreeData.sha,
                    parents: [baseSha]
                })
            });
            
            if (!commitResponse.ok) {
                throw new Error('Error al crear commit');
            }
            
            const commitData = await commitResponse.json();
            
            // Actualizar referencia
            const updateRefResponse = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sha: commitData.sha
                })
            });
            
            if (!updateRefResponse.ok) {
                throw new Error('Error al actualizar referencia');
            }
            
            return await updateRefResponse.json();
            
        } catch (error) {
            console.error('Error en updateMultipleFiles:', error);
            throw error;
        }
    }

    // Obtener commits recientes
    async getRecentCommits(limit = 10) {
        const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/commits?per_page=${limit}`, {
            headers: {
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener commits: ${response.statusText}`);
        }
        
        return await response.json();
    }

    // Verificar permisos del token
    async checkPermissions() {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}`, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                return false;
            }
            
            const repo = await response.json();
            return repo.permissions && (repo.permissions.push || repo.permissions.admin);
            
        } catch (error) {
            return false;
        }
    }

    // Crear webhook (opcional)
    async createWebhook(url, events = ['push', 'pull_request']) {
        const response = await fetch(`${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/hooks`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'web',
                active: true,
                events: events,
                config: {
                    url: url,
                    content_type: 'json'
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error al crear webhook: ${response.statusText}`);
        }
        
        return await response.json();
    }
}

// Extender AdminBot con funcionalidad real de GitHub
if (typeof AdminBot !== 'undefined') {
    AdminBot.prototype.updateRepository = async function() {
        if (!this.githubConfig.token || !this.githubConfig.owner || !this.githubConfig.repo) {
            this.showNotification('⚠️ Configura GitHub primero', 'warning');
            return;
        }
        
        try {
            this.showProgressNotification('Conectando con GitHub...', 10);
            
            const github = new GitHubAPI(this.githubConfig);
            
            // Verificar permisos
            this.updateProgress(20);
            const hasPermissions = await github.checkPermissions();
            if (!hasPermissions) {
                throw new Error('Token sin permisos suficientes');
            }
            
            // Preparar archivos para actualizar
            this.updateProgress(40);
            const filesToUpdate = await this.prepareFilesForUpdate();
            
            if (filesToUpdate.length === 0) {
                this.hideProgress();
                this.showNotification('No hay cambios para actualizar', 'info');
                return;
            }
            
            // Generar mensaje de commit
            this.updateProgress(60);
            const commitMessage = this.generateCommitMessage();
            
            // Actualizar archivos
            this.updateProgress(80);
            await github.updateMultipleFiles(filesToUpdate, commitMessage);
            
            // Limpiar cambios pendientes
            this.updateProgress(100);
            this.changes = [];
            localStorage.removeItem('aluna_changes');
            
            this.hideProgress();
            this.showNotification('✅ Repositorio actualizado correctamente', 'success');
            
            // Mostrar URL correcta del sitio
            setTimeout(() => {
                this.showSiteUrl();
            }, 2000);
            
        } catch (error) {
            this.hideProgress();
            this.showNotification(`❌ Error: ${error.message}`, 'error');
            console.error('Error updating repository:', error);
        }
    };

    // Generar mensaje de commit
    AdminBot.prototype.generateCommitMessage = function() {
        const timestamp = new Date().toLocaleDateString('es-ES');
        return `Actualización automática del sitio ALuna - ${timestamp}`;
    };

    // Preparar archivos para actualización
    AdminBot.prototype.prepareFilesForUpdate = async function() {
        const files = [];
        const uniqueFiles = [...new Set(this.changes.flatMap(change => change.files || []))];
        
        for (const filePath of uniqueFiles) {
            try {
                let content = '';
                
                switch (filePath) {
                    case 'index.html':
                        content = await this.generateUpdatedHTML();
                        break;
                    case 'css/style.css':
                        content = await this.generateUpdatedCSS();
                        break;
                    case 'js/ecommerce.js':
                        content = await this.generateUpdatedEcommerce();
                        break;
                    case 'admin/admin.js':
                        content = await this.generateUpdatedAdmin();
                        break;
                    default:
                        continue;
                }
                
                files.push({
                    path: filePath,
                    content: content
                });
                
            } catch (error) {
                console.error(`Error preparing file ${filePath}:`, error);
            }
        }
        
        return files;
    };

    // Generar HTML actualizado
    AdminBot.prototype.generateUpdatedHTML = async function() {
        // Obtener el HTML actual del DOM
        const html = document.documentElement.outerHTML;
        
        // Aplicar cambios de texto pendientes
        let updatedHTML = html;
        
        this.changes.forEach(change => {
            if (change.type === 'text_update' && change.data) {
                // Aplicar cambios de texto específicos
                if (change.data.mainTitle) {
                    updatedHTML = updatedHTML.replace(
                        /<h2>Descubre tu <strong>belleza natural<\/strong> con ALuna<\/h2>/,
                        `<h2>${change.data.mainTitle}</h2>`
                    );
                }
                // Agregar más reemplazos según sea necesario
            }
        });
        
        return updatedHTML;
    };

    // Generar CSS actualizado
    AdminBot.prototype.generateUpdatedCSS = async function() {
        // Leer el CSS actual (esto sería más complejo en la implementación real)
        let css = `/* CSS actualizado por el bot */\n`;
        
        // Aplicar cambios de color
        this.changes.forEach(change => {
            if (change.type === 'color_change' && change.data) {
                if (change.data.type === 'primary') {
                    css += `:root { --primary-color: ${change.data.color}; }\n`;
                }
                if (change.data.type === 'secondary') {
                    css += `:root { --secondary-color: ${change.data.color}; }\n`;
                }
            }
        });
        
        return css;
    };

    // Generar JavaScript de ecommerce actualizado
    AdminBot.prototype.generateUpdatedEcommerce = async function() {
        const products = productManager.products;
        return `// Productos actualizados automáticamente\nconst updatedProducts = ${JSON.stringify(products, null, 2)};`;
    };

    // Generar JavaScript de admin actualizado
    AdminBot.prototype.generateUpdatedAdmin = async function() {
        const products = productManager.products;
        return `// Admin actualizado automáticamente\nconst adminProducts = ${JSON.stringify(products, null, 2)};`;
    };

    // Mostrar URL correcta del sitio
    AdminBot.prototype.showSiteUrl = function() {
        const correctUrl = `https://${this.githubConfig.owner}.github.io/${this.githubConfig.repo}`;
        
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 500px;
            text-align: center;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">🌐</div>
                <h3 style="color: #28a745; margin-bottom: 10px;">¡Sitio Web Actualizado!</h3>
                <p style="color: #666; margin-bottom: 20px;">Tu sitio web está disponible en:</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <a href="${correctUrl}" target="_blank" style="
                    color: #007bff; 
                    text-decoration: none; 
                    font-weight: bold;
                    word-break: break-all;
                ">${correctUrl}</a>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.open('${correctUrl}', '_blank')" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">🚀 Ver Sitio</button>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    };
}