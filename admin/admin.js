// Sistema de administración para ALuna - Uruguay
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.shopifyConfig = {
            domain: 'tu-tienda.myshopify.com', // Cambiar por tu dominio de Shopify
            storefrontToken: 'tu-storefront-token' // Token de Shopify Storefront API
        };
        this.githubConfig = null;
        this.githubAPI = null;
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupImagePreview();
        this.setupGitHub();
    }

    // Cargar productos desde localStorage
    loadProducts() {
        const saved = localStorage.getItem('aluna_products');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                name: 'Mascarilla Karseell',
                price: 1190,
                description: 'Tratamiento capilar intensivo que repara y nutre el cabello dañado.',
                category: 'cabello',
                image: '../img/MascarillaKarseell1190.jpg',
                stock: 15,
                weight: 250,
                featured: true
            },
            {
                id: 2,
                name: 'Pack Shampoo y Crema Karseell',
                price: 1290,
                description: 'Combo completo para el cuidado capilar diario.',
                category: 'cabello',
                image: '../img/PackshampooycremaKarseell1290.jpg',
                stock: 10,
                weight: 500,
                featured: true
            }
        ];
    }

    // Guardar productos en localStorage
    saveProducts() {
        localStorage.setItem('aluna_products', JSON.stringify(this.products));
        this.updateWebsite();
    }

    // Renderizar lista de productos
    renderProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                    </div>
                    <div class="col-md-4">
                        <h5>${product.name}</h5>
                        <p class="text-muted">${product.description.substring(0, 100)}...</p>
                        <span class="badge bg-secondary">${this.getCategoryName(product.category)}</span>
                    </div>
                    <div class="col-md-2">
                        <div class="currency">$${product.price} UYU</div>
                        <small class="text-muted">Stock: ${product.stock}</small>
                    </div>
                    <div class="col-md-2">
                        <div class="text-muted">
                            <i class="fas fa-weight"></i> ${product.weight}g
                        </div>
                        ${product.featured ? '<span class="badge bg-warning">Destacado</span>' : ''}
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="productManager.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="productManager.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Obtener nombre de categoría
    getCategoryName(category) {
        const categories = {
            'cabello': 'Cuidado Capilar',
            'rostro': 'Cuidado Facial',
            'maquillaje': 'Maquillaje',
            'naturales': 'Productos Naturales',
            'sets': 'Sets de Regalo'
        };
        return categories[category] || category;
    }

    // Mostrar modal para agregar producto
    showAddProduct() {
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        new bootstrap.Modal(document.getElementById('productModal')).show();
    }

    // Editar producto
    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productWeight').value = product.weight;
        document.getElementById('productFeatured').checked = product.featured;
        
        const preview = document.getElementById('imagePreview');
        preview.src = product.image;
        preview.style.display = 'block';

        new bootstrap.Modal(document.getElementById('productModal')).show();
    }

    // Eliminar producto
    deleteProduct(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderProducts();
        }
    }

    // Guardar producto
    saveProduct() {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const id = document.getElementById('productId').value;
        const imageFile = document.getElementById('productImage').files[0];
        
        const productData = {
            name: document.getElementById('productName').value,
            price: parseInt(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value),
            weight: parseInt(document.getElementById('productWeight').value),
            featured: document.getElementById('productFeatured').checked
        };

        if (id) {
            // Editar producto existente
            const index = this.products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
                
                if (imageFile) {
                    this.handleImageUpload(imageFile, (imagePath) => {
                        this.products[index].image = imagePath;
                        this.saveProducts();
                        this.renderProducts();
                    });
                } else {
                    this.saveProducts();
                    this.renderProducts();
                }
            }
        } else {
            // Agregar nuevo producto
            const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
            const newProduct = { id: newId, ...productData };
            
            if (imageFile) {
                this.handleImageUpload(imageFile, (imagePath) => {
                    newProduct.image = imagePath;
                    this.products.push(newProduct);
                    this.saveProducts();
                    this.renderProducts();
                });
            } else {
                newProduct.image = '../img/default-product.jpg';
                this.products.push(newProduct);
                this.saveProducts();
                this.renderProducts();
            }
        }

        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    }

    // Manejar subida de imagen
    handleImageUpload(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // En un entorno real, aquí subirías la imagen a un servicio
            // Por ahora, usamos data URL para demostración
            const imagePath = e.target.result;
            callback(imagePath);
        };
        reader.readAsDataURL(file);
    }

    // Configurar preview de imagen
    setupImagePreview() {
        const imageInput = document.getElementById('productImage');
        const preview = document.getElementById('imagePreview');
        
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Actualizar sitio web principal
    updateWebsite() {
        try {
            // Generar JSON para el sitio principal
            const websiteData = {
                products: this.products,
                lastUpdate: new Date().toISOString(),
                config: {
                    currency: 'UYU',
                    location: 'Maldonado, Uruguay',
                    freeShippingMin: 1500,
                    paymentMethods: ['Tarjetas', 'Mercado Pago', 'Abitab', 'Red Pagos']
                }
            };
            
            // Guardar en localStorage
            localStorage.setItem('aluna_website_data', JSON.stringify(websiteData));
            
            // También guardar los productos por separado para compatibilidad
            localStorage.setItem('aluna_products', JSON.stringify(this.products));
            
            // Verificar que se guardó correctamente
            const saved = localStorage.getItem('aluna_website_data');
            if (saved) {
                console.log('✅ Datos guardados correctamente:', JSON.parse(saved));
                this.showNotification('✅ Productos actualizados y guardados correctamente', 'success');
                
                // Actualizar la ventana principal si está abierta
                this.updateMainWindow();
            } else {
                throw new Error('No se pudieron guardar los datos');
            }
            
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            this.showNotification('❌ Error al guardar los cambios: ' + error.message, 'danger');
        }
    }

    // Actualizar ventana principal
    updateMainWindow() {
        try {
            // Intentar comunicarse con la ventana principal
            if (window.opener && !window.opener.closed) {
                // Enviar mensaje a la ventana principal para que recargue los productos
                window.opener.postMessage({
                    type: 'PRODUCTS_UPDATED',
                    products: this.products
                }, '*');
                console.log('📤 Mensaje enviado a ventana principal');
            }
        } catch (error) {
            console.log('ℹ️ No se pudo comunicar con la ventana principal:', error.message);
        }
    }

    // Exportar productos
    exportProducts() {
        const dataStr = JSON.stringify(this.products, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'aluna_productos_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Integración con Shopify
    async syncWithShopify() {
        try {
            this.showNotification('Iniciando sincronización con Shopify...', 'info');
            
            // Simular proceso de sincronización
            await this.simulateShopifySync();
            
            this.showNotification('✅ Sincronización con Shopify completada', 'success');
        } catch (error) {
            console.error('Error sincronizando con Shopify:', error);
            this.showNotification('❌ Error en la sincronización con Shopify: ' + error.message, 'danger');
        }
    }

    // Simular sincronización con Shopify
    async simulateShopifySync() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Actualizar productos con datos simulados de Shopify
                this.products.forEach(product => {
                    product.shopifyId = 'gid://shopify/Product/' + (Math.floor(Math.random() * 1000000));
                    product.shopifyHandle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    product.lastSynced = new Date().toISOString();
                });
                
                this.saveProducts();
                resolve();
            }, 2000);
        });
    }

    // Ver pedidos
    viewOrders() {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        
        // Crear modal para mostrar pedidos
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-shopping-bag"></i> Pedidos Recibidos</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        ${orders.length === 0 ? `
                            <div class="text-center py-5">
                                <i class="fas fa-shopping-bag" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
                                <h5>No hay pedidos aún</h5>
                                <p class="text-muted">Los pedidos de los clientes aparecerán aquí</p>
                            </div>
                        ` : `
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orders.reverse().map(order => `
                                            <tr>
                                                <td><strong>${order.id}</strong></td>
                                                <td>
                                                    ${order.customer.name}<br>
                                                    <small class="text-muted">${order.customer.email}</small>
                                                </td>
                                                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                                                <td><strong>${order.total} UYU</strong></td>
                                                <td><span class="badge bg-warning">Pendiente</span></td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary" onclick="productManager.viewOrderDetails('${order.id}')">
                                                        <i class="fas fa-eye"></i> Ver
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                        ${orders.length > 0 ? `
                            <button type="button" class="btn btn-primary" onclick="productManager.exportOrders()">
                                <i class="fas fa-download"></i> Exportar Pedidos
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Ver detalles del pedido
    viewOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            this.showNotification('Pedido no encontrado', 'danger');
            return;
        }

        // Cerrar modal actual
        document.querySelector('.modal').remove();

        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-receipt"></i> Pedido ${order.id}</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Información del Cliente</h6>
                                <p><strong>Nombre:</strong> ${order.customer.name}</p>
                                <p><strong>Email:</strong> ${order.customer.email}</p>
                                <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
                                <p><strong>Ciudad:</strong> ${order.customer.city}</p>
                                <p><strong>Dirección:</strong> ${order.customer.address}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Detalles del Pedido</h6>
                                <p><strong>Fecha:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                                <p><strong>Método de pago:</strong> ${this.getPaymentMethodName(order.paymentMethod)}</p>
                                <p><strong>Estado:</strong> <span class="badge bg-warning">Pendiente</span></p>
                            </div>
                        </div>
                        
                        <h6>Productos</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>${item.quantity}</td>
                                            <td>${item.price} UYU</td>
                                            <td>${item.price * item.quantity} UYU</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="3">Subtotal:</th>
                                        <th>${order.subtotal} UYU</th>
                                    </tr>
                                    <tr>
                                        <th colspan="3">Envío:</th>
                                        <th>${order.shipping === 0 ? 'Gratis' : order.shipping + ' UYU'}</th>
                                    </tr>
                                    <tr class="table-primary">
                                        <th colspan="3">Total:</th>
                                        <th>${order.total} UYU</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="productManager.viewOrders()">
                            <i class="fas fa-arrow-left"></i> Volver a Pedidos
                        </button>
                        <button type="button" class="btn btn-success" onclick="productManager.markOrderAsProcessed('${order.id}')">
                            <i class="fas fa-check"></i> Marcar como Procesado
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Obtener nombre del método de pago
    getPaymentMethodName(method) {
        const methods = {
            'mercadopago': 'Mercado Pago',
            'abitab': 'Giros Abitab',
            'redpagos': 'Red Pagos'
        };
        return methods[method] || method;
    }

    // Marcar pedido como procesado
    markOrderAsProcessed(orderId) {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'processed';
            orders[orderIndex].processedAt = new Date().toISOString();
            localStorage.setItem('aluna_orders', JSON.stringify(orders));
            
            this.showNotification('✅ Pedido marcado como procesado', 'success');
            
            // Actualizar vista
            document.querySelector('.modal').remove();
            this.viewOrders();
        }
    }

    // Exportar pedidos
    exportOrders() {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        
        if (orders.length === 0) {
            this.showNotification('No hay pedidos para exportar', 'info');
            return;
        }

        // Crear CSV
        const csvContent = this.generateOrdersCSV(orders);
        
        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `pedidos_aluna_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        this.showNotification('✅ Pedidos exportados correctamente', 'success');
    }

    // Generar CSV de pedidos
    generateOrdersCSV(orders) {
        const headers = [
            'Pedido', 'Fecha', 'Cliente', 'Email', 'Teléfono', 'Ciudad', 'Dirección',
            'Productos', 'Subtotal', 'Envío', 'Total', 'Método de Pago', 'Estado'
        ];
        
        const rows = orders.map(order => [
            order.id,
            new Date(order.timestamp).toLocaleString(),
            order.customer.name,
            order.customer.email,
            order.customer.phone,
            order.customer.city,
            order.customer.address,
            order.items.map(item => `${item.name} x${item.quantity}`).join('; '),
            order.subtotal,
            order.shipping,
            order.total,
            this.getPaymentMethodName(order.paymentMethod),
            order.status || 'Pendiente'
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }
}

// Funciones globales
let productManager;

function showAddProduct() {
    productManager.showAddProduct();
}

function saveProduct() {
    productManager.saveProduct();
}

function exportProducts() {
    productManager.exportProducts();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    productManager = new ProductManager();
    
    // Mostrar mensaje de bienvenida
    console.log('✅ Panel de administración cargado');
    console.log('🤖 Busca el botón del asistente en la esquina inferior derecha');
});