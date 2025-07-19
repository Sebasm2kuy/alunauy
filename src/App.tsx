import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './contexts/AuthContext';
import { useCMSStore } from './store/cmsStore';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage'; // Asegúrate de que CategoryPage esté importado
import CMSEditor from './components/admin/CMSEditor';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { Product } from './store/cmsStore';
import './index.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { cart, addToCart, updateCartItem, removeFromCart, products } = useCMSStore();

  const handleAddToCart = (product: Product, quantity: number = 1, variants?: Record<string, string>) => {
    addToCart(product, quantity, variants);
    setIsCartOpen(true); // Abrir el carrito al añadir un producto
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateCartItem(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const renderCurrentPage = () => {
    // Lista de categorías conocidas para el enrutamiento
    const knownCategories = [
      'serums', 'cremas', 'maquillaje', 'corporal', 'tratamientos', 'ofertas', 'accesorios', 'cuidado-facial'
    ];

    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} onAddToCart={handleAddToCart} />;
      case 'products':
        return <ProductsPage onAddToCart={handleAddToCart} />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <CMSEditor onClose={() => { setIsCMSOpen(false); setCurrentPage('home'); }} />;
      // Si currentPage es una categoría conocida, renderiza CategoryPage
      case knownCategories.find(cat => cat === currentPage): // Esto permitirá que 'cuidado-facial', 'maquillaje', etc. funcionen
        const categoryTitle = currentPage.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const categoryDescription = `Explora nuestros productos de ${categoryTitle.toLowerCase()}.`;
        return <CategoryPage category={currentPage} title={categoryTitle} description={categoryDescription} onAddToCart={handleAddToCart} />;
      default:
        // Si no es una página conocida ni una categoría, por defecto vuelve a Home
        return <HomePage onPageChange={setCurrentPage} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {!isCMSOpen && (
            <>
              <Header
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                cartItems={getTotalItems()}
                onCartClick={handleCartClick}
                onSearch={(term) => {
                  // Implementar búsqueda global
                  console.log('Búsqueda global:', term);
                  // Podrías redirigir a la página de productos y aplicar el filtro de búsqueda
                  setCurrentPage('products');
                  // Necesitarías una forma de pasar el término de búsqueda a ProductsPage
                  // Por ahora, solo logeamos.
                }}
              />

              <main className="flex-grow pt-16"> {/* Añadido pt-16 para compensar el header fijo */}
                {renderCurrentPage()}
              </main>

              <Footer onPageChange={setCurrentPage} />
            </>
          )}

          {/* CMS Editor */}
          {isCMSOpen && (
            <CMSEditor onClose={() => {
              setIsCMSOpen(false);
              setCurrentPage('home');
            }} />
          )}

          {/* Product Detail Modal */}
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Cart */}
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />

          {/* Checkout */}
          <Checkout
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cart}
            total={getTotalPrice()}
          />
        </div>
      </AuthProvider>
    </DndProvider>
  );
};

export default App;

      </AuthProvider>
    </DndProvider>
  );
};

export default App;
