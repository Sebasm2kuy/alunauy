import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useStore, Product, CartItem } from './store/cmsStore';
import AdminApp from './components/admin/AdminApp';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import CMSEditor from './components/admin/CMSEditor';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import Footer from './components/Footer';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
};

const MainApp: React.FC = () => {
  const { 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    siteSettings, 
    createOrder 
  } = useStore();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddToCart = (product: Product, quantity: number = 1, variants?: Record<string, string>) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '',
      variants
    });
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Forzar re-render cuando se cambia de página
    setRefreshKey(prev => prev + 1);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
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
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { title: string; description: string } } = {
      'cuidado-facial': {
        title: 'Cuidado Facial',
        description: 'Descubre nuestra línea completa de productos para el cuidado facial, desde sérums hasta cremas hidratantes.'
      },
      'maquillaje': {
        title: 'Maquillaje',
        description: 'Productos de maquillaje de alta calidad para realzar tu belleza natural con acabados profesionales.'
      },
      'cuidado-corporal': {
        title: 'Cuidado Corporal',
        description: 'Cuida tu piel de pies a cabeza con nuestra selección de productos corporales nutritivos e hidratantes.'
      },
      'tratamientos': {
        title: 'Tratamientos',
        description: 'Tratamientos especializados y mascarillas para necesidades específicas de tu piel.'
      },
      'ofertas': {
        title: 'Ofertas Especiales',
        description: 'Aprovecha nuestras mejores ofertas y descuentos en productos seleccionados.'
      },
      'otros': {
        title: 'Otros Productos',
        description: 'Accesorios y herramientas complementarias para tu rutina de belleza.'
      }
    };
    return categoryMap[category] || { title: 'Productos', description: 'Explora nuestra colección de productos.' };
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} onAddToCart={handleAddToCart} />;
      case 'products':
        return <ProductsPage key={refreshKey} onAddToCart={handleAddToCart} />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        setIsCMSOpen(true);
        return null;
      case 'cuidado-facial':
      case 'maquillaje':
      case 'cuidado-corporal':
      case 'tratamientos':
      case 'ofertas':
      case 'otros':
        const categoryInfo = getCategoryInfo(currentPage);
        return (
          <CategoryPage
            key={refreshKey}
            category={currentPage}
            title={categoryInfo.title}
            description={categoryInfo.description}
            onAddToCart={handleAddToCart}
          />
        );
      default:
        return <HomePage key={refreshKey} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          {!isCMSOpen && (
            <>
              <Header
                currentPage={currentPage}
                onPageChange={handlePageChange}
                cartItems={getTotalItems()}
                onCartClick={handleCartClick}
                onSearch={(term) => {
                  // Implementar búsqueda global
                  console.log('Búsqueda global:', term);
                }}
              />
              
              <main>
                {renderCurrentPage()}
              </main>

              <Footer onPageChange={handlePageChange} />
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
            siteSettings={siteSettings}
            createOrder={createOrder}
            clearCart={clearCart}
          />
        </div>
      </AuthProvider>
    </DndProvider>
  );
};

export default App;