import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './components/AdminPanel';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onAddToCart={handleAddToCart} />;
      case 'products':
        return <ProductsPage />;
      case 'cuidado-facial':
        return <CategoryPage 
          category="cuidado-facial" 
          title="Cuidado Facial" 
          description="Descubre nuestra línea completa de productos para el cuidado facial, incluyendo sérums y cremas formulados con ingredientes naturales para todo tipo de piel."
        />;
      case 'maquillaje':
        return <CategoryPage 
          category="maquillaje" 
          title="Maquillaje" 
          description="Productos de maquillaje que realzan tu belleza natural con fórmulas suaves y colores vibrantes."
        />;
      case 'cuidado-corporal':
        return <CategoryPage 
          category="cuidado-corporal" 
          title="Cuidado Corporal" 
          description="Cuida tu cuerpo con nuestra selección de aceites, lociones y productos corporales nutritivos."
        />;
      case 'tratamientos':
        return <CategoryPage 
          category="tratamientos" 
          title="Tratamientos" 
          description="Mascarillas y tratamientos especializados para necesidades específicas de tu piel."
        />;
      case 'ofertas':
        return <CategoryPage 
          category="ofertas" 
          title="Ofertas Especiales" 
          description="Aprovecha nuestras mejores ofertas y productos bestseller con descuentos especiales."
        />;
      case 'otros':
        return <CategoryPage 
          category="otros" 
          title="Otros Productos" 
          description="Accesorios y herramientas complementarias para tu rutina de belleza."
        />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          cartItems={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <main>
          {renderCurrentPage()}
        </main>

        {currentPage !== 'admin' && <Footer onPageChange={setCurrentPage} />}

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </AuthProvider>
  );
}

export default App;