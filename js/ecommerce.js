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
            shopifyDomain: 'aluna-uruguay.myshopify.com'
        };
        this.init();
    }

    init() {
        this.loadWebsiteData();
        this.setupCartIcon();
        this.setupProductButtons();
        this.renderFeaturedProducts();
        this.setupMessageListener();
    }
    // Actualizar catálogo de productos en la página
    updateProductCatalog() {
        // Actualizar precios en el portafolio
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item, index) => {
            const priceOverlay = item.querySelector('.product-price-overlay');
            if (priceOverlay && this.products[index]) {
                priceOverlay.textContent = `${this.products[index].price} ${this.config.currency}`;
            }
        });
        
        // Actualizar productos destacados
        this.renderFeaturedProducts();
    }


    // Configurar listener para mensajes del admin
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'PRODUCTS_UPDATED') {
                console.log('📥 Productos actualizados desde admin');
                this.products = event.data.products;
                this.renderFeaturedProducts();
                this.updateProductCatalog();
                this.showNotification('Productos actualizados automáticamente', 'success');
            }
        });
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
        const defaultProducts = [
            {
                id: 1,
                name: 'Mascarilla Karseell',
                price: 1190,
                description: 'Tratamiento capilar intensivo que repara y nutre el cabello dañado.',
                category: 'cabello',
                image: 'img/MascarillaKarseell1190.jpg',
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
                image: 'img/PackshampooycremaKarseell1290.jpg',
                stock: 10,
                weight: 500,
                featured: true
            },
            {
                id: 3,
                name: 'Tratamiento Capilar Premium',
                price: 890,
                description: 'Tratamiento profesional para cabello dañado y sin brillo.',
                category: 'cabello',
                image: 'img/IMG-20250716-WA0039.jpg',
                stock: 8,
                weight: 200,
                featured: false
            },
            {
                id: 4,
                name: 'Serum Facial Hidratante',
                price: 750,
                description: 'Serum concentrado para hidratar y rejuvenecer la piel.',
                category: 'rostro',
                image: 'img/portfolio_pic4.jpg',
                stock: 12,
                weight: 50,
                featured: false
            },
            {
                id: 5,
                name: 'Crema Antiarrugas',
                price: 1450,
                description: 'Crema premium con ingredientes activos anti-edad.',
                category: 'rostro',
                image: 'img/portfolio_pic5.jpg',
                stock: 6,
                weight: 100,
                featured: true
            },
            {
                id: 6,
                name: 'Base de Maquillaje',
                price: 980,
                description: 'Base de larga duración con cobertura natural.',
                category: 'maquillaje',
                image: 'img/portfolio_pic6.jpg',
                stock: 20,
                weight: 75,
                featured: false
            },
            {
                id: 7,
                name: 'Kit de Labiales',
                price: 650,
                description: 'Set de 3 labiales en tonos naturales y vibrantes.',
                category: 'maquillaje',
                image: 'img/portfolio_pic7.jpg',
                stock: 15,
                weight: 30,
                featured: false
            },
            {
                id: 8,
                name: 'Set de Regalo Completo',
                price: 1850,
                description: 'Set premium con productos seleccionados para regalo.',
                category: 'sets',
                image: 'img/portfolio_pic8.jpg',
                stock: 5,
                weight: 800,
                featured: true
            }
        ];
        
        // Intentar cargar desde website_data primero, luego desde products
        const websiteData = localStorage.getItem('aluna_website_data');
        if (websiteData) {
            try {
                const data = JSON.parse(websiteData);
                if (data.products && data.products.length > 0) {
                    console.log('✅ Productos cargados desde website_data');
                    return data.products;
                }
            } catch (e) {
                console.error('Error parsing website_data:', e);
            }
        }
        
        const saved = localStorage.getItem('aluna_products');
        if (saved) {
            try {
                const products = JSON.parse(saved);
                console.log('✅ Productos cargados desde aluna_products');
                return products;
            } catch (e) {
                console.error('Error parsing aluna_products:', e);
            }
        }
        
        console.log('ℹ️ Usando productos por defecto');
        return defaultProducts;
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
                min-width: 20px;
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

    // Los botones ya están en el HTML, no necesitamos configurarlos aquí
    setupProductButtons() {
        // Los productos ya tienen los botones integrados en el HTML
        console.log('Productos configurados con botones integrados');
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
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

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
        // Mostrar modal de checkout
        this.showCheckoutModal();
    }

    // Mostrar modal de checkout
    showCheckoutModal() {
        const subtotal = this.getCartTotal();
        const shipping = subtotal >= this.config.freeShippingMin ? 0 : 200;
        const total = subtotal + shipping;

        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-content">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3><i class="fa fa-credit-card"></i> Finalizar Compra</h3>
                    <button class="btn btn-sm btn-outline-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h5>Resumen del Pedido</h5>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        ${this.cart.map(item => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${item.price * item.quantity} UYU</span>
                            </div>
                        `).join('')}
                        <hr>
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>$${subtotal} UYU</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Envío:</span>
                            <span>${shipping === 0 ? 'Gratis' : '$' + shipping + ' UYU'}</span>
                        </div>
                        <div class="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>$${total} UYU</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h5>Información de Contacto</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Nombre completo *</label>
                            <input type="text" id="customer-name" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Email *</label>
                            <input type="email" id="customer-email" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Teléfono *</label>
                            <input type="tel" id="customer-phone" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ciudad *</label>
                            <input type="text" id="customer-city" class="form-control" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label">Dirección completa *</label>
                            <textarea id="customer-address" class="form-control" rows="2" required></textarea>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h5>Método de Pago</h5>
                    <div class="payment-methods">
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="payment-method" id="mercadopago" value="mercadopago" checked>
                            <label class="form-check-label" for="mercadopago">
                                <strong>Mercado Pago</strong> - Tarjetas de crédito/débito
                            </label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="payment-method" id="abitab" value="abitab">
                            <label class="form-check-label" for="abitab">
                                <strong>Giros Abitab</strong> - Pago en efectivo
                            </label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="payment-method" id="redpagos" value="redpagos">
                            <label class="form-check-label" for="redpagos">
                                <strong>Red Pagos</strong> - Pago en efectivo
                            </label>
                        </div>
                    </div>
                </div>

                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" onclick="ecommerce.processOrder()">
                        <i class="fa fa-shopping-cart"></i> Confirmar Pedido - $${total} UYU
                    </button>
                </div>

                <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #666;">
                    <i class="fa fa-shield-alt"></i> Compra 100% segura - Datos protegidos
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    // Procesar pedido
    processOrder() {
        // Validar formulario
        const name = document.getElementById('customer-name').value.trim();
        const email = document.getElementById('customer-email').value.trim();
        const phone = document.getElementById('customer-phone').value.trim();
        const city = document.getElementById('customer-city').value.trim();
        const address = document.getElementById('customer-address').value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (!name || !email || !phone || !city || !address) {
            this.showNotification('Por favor, completa todos los campos requeridos', 'error');
            return;
        }

        // Crear objeto del pedido
        const order = {
            id: 'ALU-' + Date.now(),
            timestamp: new Date().toISOString(),
            customer: { name, email, phone, city, address },
            items: [...this.cart],
            subtotal: this.getCartTotal(),
            shipping: this.getCartTotal() >= this.config.freeShippingMin ? 0 : 200,
            total: this.getCartTotal() + (this.getCartTotal() >= this.config.freeShippingMin ? 0 : 200),
            paymentMethod,
            status: 'pending'
        };

        // Guardar pedido
        this.saveOrder(order);

        // Cerrar modal
        document.querySelector('.cart-modal').remove();

        // Mostrar confirmación
        this.showOrderConfirmation(order);

        // Limpiar carrito
        this.cart = [];
        this.saveCart();
    }

    // Guardar pedido
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        orders.push(order);
        localStorage.setItem('aluna_orders', JSON.stringify(orders));

        // También enviar por email (simulado)
        this.sendOrderEmail(order);
    }

    // Enviar email del pedido (simulado)
    sendOrderEmail(order) {
        console.log('Enviando email del pedido:', order);
        // En un entorno real, aquí se enviaría el email a través de un servicio
    }

    // Mostrar confirmación del pedido
    showOrderConfirmation(order) {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-content">
                <div class="text-center mb-4">
                    <div style="font-size: 64px; color: #28a745; margin-bottom: 20px;">✅</div>
                    <h3 style="color: #28a745;">¡Pedido Confirmado!</h3>
                    <p class="text-muted">Tu pedido ha sido recibido correctamente</p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h5>Detalles del Pedido</h5>
                    <p><strong>Número de pedido:</strong> ${order.id}</p>
                    <p><strong>Total:</strong> $${order.total} UYU</p>
                    <p><strong>Método de pago:</strong> ${this.getPaymentMethodName(order.paymentMethod)}</p>
                    <p><strong>Envío a:</strong> ${order.customer.city}</p>
                </div>

                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="color: #1976d2; margin-bottom: 10px;">📧 Próximos pasos</h6>
                    <ul style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 14px;">
                        <li>Recibirás un email de confirmación</li>
                        <li>Te contactaremos para coordinar el envío</li>
                        <li>El pedido se procesa en 24-48 horas</li>
                        ${order.paymentMethod !== 'mercadopago' ? '<li>Te enviaremos las instrucciones de pago</li>' : ''}
                    </ul>
                </div>

                <div class="d-grid gap-2">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fa fa-check"></i> Entendido
                    </button>
                    <button class="btn btn-outline-secondary" onclick="ecommerce.showOrderDetails('${order.id}')">
                        <i class="fa fa-eye"></i> Ver Detalles del Pedido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
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

    // Mostrar detalles del pedido
    showOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            this.showNotification('Pedido no encontrado', 'error');
            return;
        }

        // Cerrar modal actual
        document.querySelector('.cart-modal').remove();

        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-content">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3><i class="fa fa-receipt"></i> Pedido ${order.id}</h3>
                    <button class="btn btn-sm btn-outline-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fa fa-times"></i>
                    </button>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h5>Información del Cliente</h5>
                        <p><strong>Nombre:</strong> ${order.customer.name}</p>
                        <p><strong>Email:</strong> ${order.customer.email}</p>
                        <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
                        <p><strong>Ciudad:</strong> ${order.customer.city}</p>
                        <p><strong>Dirección:</strong> ${order.customer.address}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>Detalles del Pedido</h5>
                        <p><strong>Fecha:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                        <p><strong>Estado:</strong> <span class="badge bg-warning">Pendiente</span></p>
                        <p><strong>Método de pago:</strong> ${this.getPaymentMethodName(order.paymentMethod)}</p>
                        <p><strong>Total:</strong> $${order.total} UYU</p>
                    </div>
                </div>

                <h5>Productos</h5>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    ${order.items.map(item => `
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${item.price * item.quantity} UYU</span>
                        </div>
                    `).join('')}
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>$${order.subtotal} UYU</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Envío:</span>
                        <span>${order.shipping === 0 ? 'Gratis' : '$' + order.shipping + ' UYU'}</span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>$${order.total} UYU</span>
                    </div>
                </div>

                <div class="mt-3 d-grid">
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fa fa-arrow-left"></i> Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
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