// Sistema de administración para ALuna - Uruguay
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.shopifyConfig = {
            domain: 'tu-tienda.myshopify.com', // Cambiar por tu dominio de Shopify
            storefrontToken: 'tu-storefront-token' // Token de Shopify Storefront API
        };
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupImagePreview();
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
        
        localStorage.setItem('aluna_website_data', JSON.stringify(websiteData));
        
        // Mostrar mensaje de éxito
        this.showNotification('Productos actualizados correctamente', 'success');
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
            // Aquí implementarías la sincronización con Shopify
            // usando la Storefront API o Admin API
            console.log('Sincronizando con Shopify...');
            this.showNotification('Sincronización con Shopify completada', 'success');
        } catch (error) {
            console.error('Error sincronizando con Shopify:', error);
            this.showNotification('Error en la sincronización con Shopify', 'danger');
        }
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
});