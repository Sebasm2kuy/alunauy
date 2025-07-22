// Sistema E-commerce para ALuna Uruguay
class AlunaEcommerce {
    constructor() {
        this.cart = this.loadCart();
        this.products = this.loadProducts();
        this.config = {
            currency: 'UYU',
            location: 'Maldonado, Uruguay',
            freeShippingMin: 1500,
            paymentMethods: ['Tarjetas', 'Mercado Pago', 'Abitab', 'Red Pagos'],
            shopifyDomain: 'tu-tienda.myshopify.com' // Cambiar por tu dominio
        };
        this.init();
    }

    init() {
        this.loadWebsiteData();
        this.setupCartIcon();
        this.setupProductButtons();
        this.renderFeaturedProducts();
    }

    // Cargar datos del sitio web
    loadWebsiteData() {
        const data = localStorage.getItem('aluna_website_data');
        if (data) {
            const websiteData = JSON.parse(data);
            this.products = websiteData.products || [];
            this.config = { ...this.config, ...websiteData.config };
        }
    }

    // Cargar productos
    loadProducts() {
        return JSON.parse(localStorage.getItem('aluna_products') || '[]');
    }

    // Cargar carrito
    loadCart() {
        return JSON.parse(localStorage.getItem('aluna_cart') || '[]');
    }

    // Guardar carrito
    saveCart() {
        localStorage.setItem('aluna_cart', JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    // Configurar ícono del carrito
    setupCartIcon() {
        // Agregar ícono de carrito al header
        const nav = document.querySelector('.navStyle ul');
        if (nav) {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                <a href="#" onclick="ecommerce.showCart()" class="cart-icon">
                    <i class="fa fa-shopping-cart"></i>
                    <span class="cart-count">${this.getCartCount()}</span>
                </a>
            `;
            nav.appendChild(cartItem);
        }

        // Agregar estilos para el carrito
        const style = document.createElement('style');
        style.textContent = `
            .cart-icon {
                position: relative !important;
            }
            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff6b9d;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .product-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                transition: transform 0.3s ease;
            }
            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .product-price {
                color: #ff6b9d;
                font-size: 24px;
                font-weight: bold;
            }
            .btn-add-cart {
                background: #ff6b9d;
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            .btn-add-cart:hover {
                background: #c44569;
                transform: scale(1.05);
            }
            .cart-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
                display: none;
            }
            .cart-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .shipping-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Configurar botones de productos
    setupProductButtons() {
        // Agregar botones "Comprar" a productos existentes
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item, index) => {
            const overlay = item.querySelector('.item_overlay .item_info');
            if (overlay && this.products[index]) {
                const product = this.products[index];
                overlay.innerHTML += `
                    <div class="product-price">$${product.price} ${this.config.currency}</div>
                    <button class="btn-add-cart" onclick="ecommerce.addToCart(${product.id})">
                        Agregar al Carrito
                    </button>
                `;
            }
        });
    }

    // Renderizar productos destacados
    renderFeaturedProducts() {
        const featuredProducts = this.products.filter(p => p.featured);
        
        // Crear sección de productos destacados si no existe
        let featuredSection = document.getElementById('featured-products');
        if (!featuredSection && featuredProducts.length > 0) {
            featuredSection = document.createElement('section');
            featuredSection.id = 'featured-products';
            featuredSection.className = 'page_section';
            featuredSection.innerHTML = `
                <div class="container">
                    <h2>Productos Destacados</h2>
                    <div class="row" id="featured-products-container">
                    </div>
                </div>
            `;
            
            // Insertar después de la sección de productos
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.parentNode.insertBefore(featuredSection, productsSection.nextSibling);
            }
        }

        const container = document.getElementById('featured-products-container');
        if (container) {
            container.innerHTML = featuredProducts.map(product => `
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid mb-3" style="height: 200px; object-fit: cover; width: 100%;">
                        <h4>${product.name}</h4>
                        <p>${product.description}</p>
                        <div class="product-price">$${product.price} ${this.config.currency}</div>
                        <div class="mt-3">
                            <button class="btn-add-cart" onclick="ecommerce.addToCart(${product.id})">
                                <i class="fa fa-shopping-cart"></i> Agregar al Carrito
                            </button>
                        </div>
                        <small class="text-muted d-block mt-2">
                            <i class="fa fa-truck"></i> 
                            ${product.price >= this.config.freeShippingMin ? 'Envío gratis' : 'Envío: $200'}
                        </small>
                    </div>
                </div>
            `).join('');
        }
    }

    // Agregar al carrito
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                weight: product.weight
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} agregado al carrito`, 'success');
    }

    // Mostrar carrito
    showCart() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-content">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3><i class="fa fa-shopping-cart"></i> Tu Carrito</h3>
                    <button class="btn btn-sm btn-outline-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                
                ${this.cart.length === 0 ? 
                    '<p class="text-center">Tu carrito está vacío</p>' : 
                    this.renderCartItems()
                }
                
                ${this.cart.length > 0 ? this.renderCartSummary() : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    // Renderizar items del carrito
    renderCartItems() {
        return `
            <div class="cart-items">
                ${this.cart.map(item => `
                    <div class="d-flex align-items-center mb-3 p-3 border rounded">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3">
                        <div class="flex-grow-1">
                            <h6>${item.name}</h6>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="ecommerce.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="ecommerce.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold">$${item.price * item.quantity} ${this.config.currency}</div>
                            <button class="btn btn-sm btn-outline-danger" onclick="ecommerce.removeFromCart(${item.id})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Renderizar resumen del carrito
    renderCartSummary() {
        const subtotal = this.getCartTotal();
        const shipping = subtotal >= this.config.freeShippingMin ? 0 : 200;
        const total = subtotal + shipping;

        return `
            <div class="shipping-info">
                <h6><i class="fa fa-truck"></i> Información de Envío</h6>
                <p><strong>Desde:</strong> ${this.config.location}</p>
                <p><strong>Métodos de pago:</strong> ${this.config.paymentMethods.join(', ')}</p>
                ${shipping === 0 ? 
                    '<p class="text-success"><i class="fa fa-check"></i> ¡Envío gratis!</p>' : 
                    '<p>Envío: $200 UYU (Gratis en compras superiores a $1500)</p>'
                }
            </div>
            
            <div class="cart-summary">
                <div class="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>$${subtotal} ${this.config.currency}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span>Envío:</span>
                    <span>${shipping === 0 ? 'Gratis' : '$' + shipping + ' ' + this.config.currency}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>$${total} ${this.config.currency}</span>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-primary w-100" onclick="ecommerce.checkout()">
                        <i class="fa fa-credit-card"></i> Proceder al Pago
                    </button>
                </div>
            </div>
        `;
    }

    // Actualizar cantidad
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            // Recargar el carrito
            document.querySelector('.cart-modal').remove();
            this.showCart();
        }
    }

    // Remover del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        // Recargar el carrito
        document.querySelector('.cart-modal').remove();
        this.showCart();
    }

    // Obtener total del carrito
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener cantidad de items en el carrito
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Actualizar ícono del carrito
    updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getCartCount();
        }
    }

    // Checkout con Shopify
    checkout() {
        // Preparar datos para Shopify
        const checkoutData = {
            lineItems: this.cart.map(item => ({
                variantId: item.id,
                quantity: item.quantity
            })),
            shippingAddress: {
                country: 'Uruguay',
                province: 'Maldonado'
            }
        };

        // Redirigir a Shopify checkout
        const shopifyUrl = `https://${this.config.shopifyDomain}/cart/add`;
        const params = new URLSearchParams();
        
        this.cart.forEach(item => {
            params.append(`items[${item.id}][id]`, item.id);
            params.append(`items[${item.id}][quantity]`, item.quantity);
        });

        // Abrir Shopify checkout en nueva ventana
        window.open(`${shopifyUrl}?${params.toString()}`, '_blank');
        
        this.showNotification('Redirigiendo al checkout seguro...', 'info');
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 10000; min-width: 300px;';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar e-commerce
let ecommerce;
document.addEventListener('DOMContentLoaded', () => {
    ecommerce = new AlunaEcommerce();
});