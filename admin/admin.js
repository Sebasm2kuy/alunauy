// Sistema de administración para ALuna - Uruguay
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.shopifyConfig = {
            domain: 'aluna-uruguay.myshopify.com',
            storefrontToken: 'tu-storefront-token'
        };
        this.githubConfig = null;
        this.githubAPI = null;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.setupImagePreview();
    }

    // Placeholder for GitHub setup logic (removed as it's not needed for local CMS)
    setupGitHub() {
        console.log("GitHub setup method called.");
    }

    // Cargar productos desde _data/products.json
    async loadProducts() {
        try {
            const response = await fetch('../_data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.products = await response.json();
            console.log('✅ Productos cargados desde _data/products.json', this.products);
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            this.products = []; // Fallback a un array vacío si hay un error
        }
    }

    // Guardar productos en localStorage y en el archivo
    saveProducts() {
        localStorage.setItem('aluna_products', JSON.stringify(this.products));
        this.saveProductsToFile();
        this.renderProducts(); // Re-render after saving
    }

    // Guardar productos en _data/products.json
    async saveProductsToFile() {
        const productsJson = JSON.stringify(this.products, null, 2);
        try {
            print(default_api.write_file(file_path="C:/alunauy-main/_data/products.json", content=productsJson))
            this.showNotification('✅ Productos guardados correctamente en el archivo.', 'success');
        } catch (error) {
            console.error('❌ Error al guardar productos en el archivo:', error);
            this.showNotification('❌ Error al guardar productos en el archivo: ' + error.message, 'danger');
        }
    }

    // Renderizar lista de productos
    renderProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="../${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description.substring(0, 100)}...</p>
                        <span class="badge bg-secondary">${this.getCategoryName(product.category)}</span>
                        <p class="card-text mt-2"><strong>Precio:</strong> ${product.price} UYU</p>
                        <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
                        <p class="card-text"><strong>Peso:</strong> ${product.weight}g</p>
                        ${product.featured ? '<span class="badge bg-warning">Destacado</span>' : ''}
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary" onclick="productManager.editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="productManager.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Eliminar
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
                    });
                } else {
                    this.saveProducts();
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
                });
            } else {
                newProduct.image = '../img/default-product.jpg';
                this.products.push(newProduct);
                this.saveProducts();
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

    // Exportar productos (función de la rama remota)
    exportProducts() {
        // Implementación de exportProducts
        const products = JSON.parse(localStorage.getItem('aluna_products') || '[]');
        
        if (products.length === 0) {
            this.showNotification('No hay productos para exportar', 'info');
            return;
        }

        const csvContent = this.generateProductsCSV(products);
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `productos_aluna_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        this.showNotification('✅ Productos exportados correctamente', 'success');
    }

    // Generar CSV de productos (función de la rama remota)
    generateProductsCSV(products) {
        const headers = [
            'ID', 'Nombre', 'Precio', 'Descripción', 'Categoría', 'Stock', 'Peso', 'Destacado', 'Imagen'
        ];
        
        const rows = products.map(product => [
            product.id,
            product.name,
            product.price,
            product.description,
            product.category,
            product.stock,
            product.weight,
            product.featured ? 'Sí' : 'No',
            product.image
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }
}

class ContentManager {
    constructor() {
        this.content = {};
        this.init();
    }

    async init() {
        await this.loadContent();
        this.renderContentForm();
    }

    async loadContent() {
        try {
            const response = await fetch('../_data/content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.content = await response.json();
            console.log('✅ Contenido cargado desde _data/content.json', this.content);
        } catch (error) {
            console.error('❌ Error cargando contenido:', error);
            this.content = {}; // Fallback a un objeto vacío
        }
    }

    renderContentForm() {
        const container = document.getElementById('contentEditor');
        if (!container) return;

        let formHtml = '';

        // Hero Section
        formHtml += `
            <h3>Sección Principal (Hero)</h3>
            <div class="mb-3">
                <label for="heroTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="heroTitle" value="${this.content.hero_section.title}">
            </div>
            <div class="mb-3">
                <label for="heroDescription" class="form-label">Descripción</label>
                <textarea class="form-control" id="heroDescription" rows="3">${this.content.hero_section.description}</textarea>
            </div>
            <div class="mb-3">
                <label for="heroImage" class="form-label">Imagen (URL)</label>
                <input type="text" class="form-control" id="heroImage" value="${this.content.hero_section.image}">
            </div>
        `;

        // About Us Section
        formHtml += `
            <h3 class="mt-5">Sección Nosotros</h3>
            <div class="mb-3">
                <label for="aboutUsTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="aboutUsTitle" value="${this.content.about_us_section.title}">
            </div>
            <div class="mb-3">
                <label for="aboutUsImage" class="form-label">Imagen (URL)</label>
                <input type="text" class="form-control" id="aboutUsImage" value="${this.content.about_us_section.image}">
            </div>
            <div class="mb-3">
                <label for="aboutUsSubtitle" class="form-label">Subtítulo</label>
                <input type="text" class="form-control" id="aboutUsSubtitle" value="${this.content.about_us_section.subtitle}">
            </div>
            <div class="mb-3">
                <label for="aboutUsParagraph1" class="form-label">Párrafo 1</label>
                <textarea class="form-control" id="aboutUsParagraph1" rows="3">${this.content.about_us_section.paragraph1}</textarea>
            </div>
            <div class="mb-3">
                <label for="aboutUsParagraph2" class="form-label">Párrafo 2</label>
                <textarea class="form-control" id="aboutUsParagraph2" rows="3">${this.content.about_us_section.paragraph2}</textarea>
            </div>
            <div class="mb-3">
                <label for="aboutUsCta" class="form-label">Call to Action</label>
                <input type="text" class="form-control" id="aboutUsCta" value="${this.content.about_us_section.call_to_action}">
            </div>
            <div class="mb-3">
                <label for="aboutUsContactBtn" class="form-label">Texto Botón Contacto</label>
                <input type="text" class="form-control" id="aboutUsContactBtn" value="${this.content.about_us_section.contact_button_text}">
            </div>
        `;

        // Services Section
        formHtml += `
            <h3 class="mt-5">Sección Servicios</h3>
            <div id="services-items-container">
        `;
        this.content.services_section.items.forEach((service, index) => {
            formHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Servicio ${index + 1}</h5>
                        <div class="mb-3">
                            <label for="serviceIcon${index}" class="form-label">Icono (Font Awesome Class)</label>
                            <input type="text" class="form-control" id="serviceIcon${index}" value="${service.icon}">
                        </div>
                        <div class="mb-3">
                            <label for="serviceTitle${index}" class="form-label">Título</label>
                            <input type="text" class="form-control" id="serviceTitle${index}" value="${service.title}">
                        </div>
                        <div class="mb-3">
                            <label for="serviceDescription${index}" class="form-label">Descripción</label>
                            <textarea class="form-control" id="serviceDescription${index}" rows="3">${service.description}</textarea>
                        </div>
                    </div>
                </div>
            `;
        });
        formHtml += `</div>`;

        // Portfolio Section (Categories only)
        formHtml += `
            <h3 class="mt-5">Sección Catálogo (Categorías)</h3>
            <div class="mb-3">
                <label for="portfolioTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="portfolioTitle" value="${this.content.portfolio_section.title}">
            </div>
            <div id="portfolio-categories-container">
        `;
        this.content.portfolio_section.categories.forEach((category, index) => {
            formHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Categoría ${index + 1}</h5>
                        <div class="mb-3">
                            <label for="categoryName${index}" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="categoryName${index}" value="${category.name}">
                        </div>
                        <div class="mb-3">
                            <label for="categoryFilter${index}" class="form-label">Filtro (Clase CSS)</label>
                            <input type="text" class="form-control" id="categoryFilter${index}" value="${category.filter}">
                        </div>
                    </div>
                </div>
            `;
        });
        formHtml += `</div>`;

        // Benefits Section
        formHtml += `
            <h3 class="mt-5">Sección Beneficios</h3>
            <div class="mb-3">
                <label for="benefitsTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="benefitsTitle" value="${this.content.benefits_section.title}">
            </div>
            <div id="benefits-logos-container">
        `;
        this.content.benefits_section.logos.forEach((logo, index) => {
            formHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Logo ${index + 1}</h5>
                        <div class="mb-3">
                            <label for="benefitLogo${index}" class="form-label">Imagen (URL)</label>
                            <input type="text" class="form-control" id="benefitLogo${index}" value="${logo}">
                        </div>
                    </div>
                </div>
            `;
        });
        formHtml += `</div>`;

        // Testimonials Section
        formHtml += `
            <h3 class="mt-5">Sección Testimonios</h3>
            <div class="mb-3">
                <label for="testimonialsTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="testimonialsTitle" value="${this.content.testimonials_section.title}">
            </div>
            <div class="mb-3">
                <label for="testimonialsSubtitle" class="form-label">Subtítulo</label>
                <input type="text" class="form-control" id="testimonialsSubtitle" value="${this.content.testimonials_section.subtitle}">
            </div>
            <div id="testimonials-items-container">
        `;
        this.content.testimonials_section.items.forEach((testimonial, index) => {
            formHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Testimonio ${index + 1}</h5>
                        <div class="mb-3">
                            <label for="testimonialImage${index}" class="form-label">Imagen (URL)</label>
                            <input type="text" class="form-control" id="testimonialImage${index}" value="${testimonial.image}">
                        </div>
                        <div class="mb-3">
                            <label for="testimonialName${index}" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="testimonialName${index}" value="${testimonial.name}">
                        </div>
                        <div class="mb-3">
                            <label for="testimonialRole${index}" class="form-label">Rol</label>
                            <input type="text" class="form-control" id="testimonialRole${index}" value="${testimonial.role}">
                        </div>
                        <div class="mb-3">
                            <label for="testimonialText${index}" class="form-label">Texto</label>
                            <textarea class="form-control" id="testimonialText${index}" rows="3">${testimonial.text}</textarea>
                        </div>
                    </div>
                </div>
            `;
        });
        formHtml += `</div>`;

        // Contact Section
        formHtml += `
            <h3 class="mt-5">Sección Contacto</h3>
            <div class="mb-3">
                <label for="contactTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="contactTitle" value="${this.content.contact_section.title}">
            </div>
            <div class="mb-3">
                <label for="contactCompanyName" class="form-label">Nombre de la Compañía</label>
                <input type="text" class="form-control" id="contactCompanyName" value="${this.content.contact_section.company_name}">
            </div>
            <div class="mb-3">
                <label for="contactAddress" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="contactAddress" value="${this.content.contact_section.address}">
            </div>
            <div class="mb-3">
                <label for="contactPhone" class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="contactPhone" value="${this.content.contact_section.phone}">
            </div>
            <div class="mb-3">
                <label for="contactEmail" class="form-label">Email</label>
                <input type="text" class="form-control" id="contactEmail" value="${this.content.contact_section.email}">
            </div>
            <h5 class="mt-4">Redes Sociales</h5>
            <div id="social-links-container">
        `;
        for (const platform in this.content.contact_section.social_links) {
            formHtml += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${platform.charAt(0).toUpperCase() + platform.slice(1)}</h5>
                        <div class="mb-3">
                            <label for="socialLink${platform}" class="form-label">URL</label>
                            <input type="text" class="form-control" id="socialLink${platform}" value="${this.content.contact_section.social_links[platform]}">
                        </div>
                    </div>
                </div>
            `;
        }
        formHtml += `</div>`;

        formHtml += `
            <h5 class="mt-4">Formulario de Contacto</h5>
            <div class="mb-3">
                <label for="formPlaceholderName" class="form-label">Placeholder Nombre</label>
                <input type="text" class="form-control" id="formPlaceholderName" value="${this.content.contact_section.form_placeholder_name}">
            </div>
            <div class="mb-3">
                <label for="formPlaceholderEmail" class="form-label">Placeholder Email</label>
                <input type="text" class="form-control" id="formPlaceholderEmail" value="${this.content.contact_section.form_placeholder_email}">
            </div>
            <div class="mb-3">
                <label for="formPlaceholderPhone" class="form-label">Placeholder Teléfono</label>
                <input type="text" class="form-control" id="formPlaceholderPhone" value="${this.content.contact_section.form_placeholder_phone}">
            </div>
            <div class="mb-3">
                <label for="formPlaceholderMessage" class="form-label">Placeholder Mensaje</label>
                <input type="text" class="form-control" id="formPlaceholderMessage" value="${this.content.contact_section.form_placeholder_message}">
            </div>
            <div class="mb-3">
                <label for="formSubmitButton" class="form-label">Texto Botón Enviar</label>
                <input type="text" class="form-control" id="formSubmitButton" value="${this.content.contact_section.form_submit_button}">
            </div>
        `;

        // Footer Section
        formHtml += `
            <h3 class="mt-5">Sección Pie de Página (Footer)</h3>
            <div class="mb-3">
                <label for="footerCopyright" class="form-label">Copyright</label>
                <input type="text" class="form-control" id="footerCopyright" value="${this.content.footer_section.copyright}">
            </div>
        `;

        formHtml += `<button class="btn btn-success mt-3" onclick="contentManager.saveContent()">Guardar Contenido de la Web</button>`;

        container.innerHTML = formHtml;
    }

    async saveContent() {
        // Hero Section
        this.content.hero_section.title = document.getElementById('heroTitle').value;
        this.content.hero_section.description = document.getElementById('heroDescription').value;
        this.content.hero_section.image = document.getElementById('heroImage').value;

        // About Us Section
        this.content.about_us_section.title = document.getElementById('aboutUsTitle').value;
        this.content.about_us_section.image = document.getElementById('aboutUsImage').value;
        this.content.about_us_section.subtitle = document.getElementById('aboutUsSubtitle').value;
        this.content.about_us_section.paragraph1 = document.getElementById('aboutUsParagraph1').value;
        this.content.about_us_section.paragraph2 = document.getElementById('aboutUsParagraph2').value;
        this.content.about_us_section.call_to_action = document.getElementById('aboutUsCta').value;
        this.content.about_us_section.contact_button_text = document.getElementById('aboutUsContactBtn').value;

        // Services Section
        this.content.services_section.items.forEach((service, index) => {
            service.icon = document.getElementById(`serviceIcon${index}`).value;
            service.title = document.getElementById(`serviceTitle${index}`).value;
            service.description = document.getElementById(`serviceDescription${index}`).value;
        });

        // Portfolio Section (Categories only)
        this.content.portfolio_section.title = document.getElementById('portfolioTitle').value;
        this.content.portfolio_section.categories.forEach((category, index) => {
            category.name = document.getElementById(`categoryName${index}`).value;
            category.filter = document.getElementById(`categoryFilter${index}`).value;
        });

        // Benefits Section
        this.content.benefits_section.title = document.getElementById('benefitsTitle').value;
        this.content.benefits_section.logos.forEach((logo, index) => {
            this.content.benefits_section.logos[index] = document.getElementById(`benefitLogo${index}`).value;
        });

        // Testimonials Section
        this.content.testimonials_section.title = document.getElementById('testimonialsTitle').value;
        this.content.testimonials_section.subtitle = document.getElementById('testimonialsSubtitle').value;
        this.content.testimonials_section.items.forEach((testimonial, index) => {
            testimonial.image = document.getElementById(`testimonialImage${index}`).value;
            testimonial.name = document.getElementById(`testimonialName${index}`).value;
            testimonial.role = document.getElementById(`testimonialRole${index}`).value;
            testimonial.text = document.getElementById(`testimonialText${index}`).value;
        });

        // Contact Section
        this.content.contact_section.title = document.getElementById('contactTitle').value;
        this.content.contact_section.company_name = document.getElementById('contactCompanyName').value;
        this.content.contact_section.address = document.getElementById('contactAddress').value;
        this.content.contact_section.phone = document.getElementById('contactPhone').value;
        this.content.contact_section.email = document.getElementById('contactEmail').value;

        for (const platform in this.content.contact_section.social_links) {
            this.content.contact_section.social_links[platform] = document.getElementById(`socialLink${platform}`).value;
        }

        this.content.contact_section.form_placeholder_name = document.getElementById('formPlaceholderName').value;
        this.content.contact_section.form_placeholder_email = document.getElementById('formPlaceholderEmail').value;
        this.content.contact_section.form_placeholder_phone = document.getElementById('formPlaceholderPhone').value;
        this.content.contact_section.form_placeholder_message = document.getElementById('formPlaceholderMessage').value;
        this.content.contact_section.form_submit_button = document.getElementById('formSubmitButton').value;

        // Footer Section
        this.content.footer_section.copyright = document.getElementById('footerCopyright').value;

        const contentJson = JSON.stringify(this.content, null, 2);
        try {
            print(default_api.write_file(file_path="C:/alunauy-main/_data/content.json", content=contentJson))
            this.showNotification('✅ Contenido guardado correctamente en el archivo.', 'success');
        } catch (error) {
            console.error('❌ Error al guardar contenido en el archivo:', error);
            this.showNotification('❌ Error al guardar contenido en el archivo: ' + error.message, 'danger');
        }
    }

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
}

class OrderManager {
    // Constructor y métodos de OrderManager (copia de la rama remota)
    constructor() {
        this.orders = [];
        this.init();
    }

    async init() {
        await this.loadOrders();
        // No renderiza automáticamente, se llama desde viewOrders()
    }

    async loadOrders() {
        // Simula la carga de pedidos desde una API o localStorage
        this.orders = JSON.parse(localStorage.getItem('aluna_orders') || '[]');
        console.log('✅ Pedidos cargados:', this.orders);
    }

    viewOrders() {
        const container = document.getElementById('ordersList');
        if (!container) return;

        container.innerHTML = this.orders.map(order => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Pedido #${order.id}</h5>
                        <p class="card-text"><strong>Cliente:</strong> ${order.customer.name}</p>
                        <p class="card-text"><strong>Total:</strong> ${order.total} UYU</p>
                        <p class="card-text"><strong>Estado:</strong> <span class="badge bg-${order.status === 'processed' ? 'success' : 'warning'}">${order.status || 'Pendiente'}</span></p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-info" onclick="orderManager.showOrderDetails('${order.id}')">
                            <i class="fas fa-info-circle"></i> Detalles
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id == orderId);
        if (!order) return;

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
                        <button type="button" class="btn btn-secondary" onclick="orderManager.viewOrders()">
                            <i class="fas fa-arrow-left"></i> Volver a Pedidos
                        </button>
                        <button type="button" class="btn btn-success" onclick="orderManager.markOrderAsProcessed('${order.id}')">
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
let contentManager;
let orderManager; // Declarar orderManager globalmente

function showAddProduct() {
    productManager.showAddProduct();
}

function saveProduct() {
    productManager.saveProduct();
}

function showContentEditor() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'none'; // Ocultar sección de pedidos
    document.getElementById('contentSection').style.display = 'block';
    contentManager.renderContentForm();
}

function showProductManager() {
    document.getElementById('productsSection').style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'none'; // Ocultar sección de pedidos
    productManager.renderProducts();
}

function showOrderManager() {
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('contentSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'block'; // Mostrar sección de pedidos
    orderManager.viewOrders();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    productManager = new ProductManager();
    contentManager = new ContentManager();
    orderManager = new OrderManager(); // Inicializar OrderManager
    
    // Mostrar el gestor de productos por defecto
    showProductManager();

    // Mostrar mensaje de bienvenida
    console.log('✅ Panel de administración cargado');
    console.log('🤖 Busca el botón del asistente en la esquina inferior derecha');
});