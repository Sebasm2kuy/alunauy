import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import Footer from './components/Footer';
import './index.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
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
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPanel />;
      case 'cuidado-facial':
      case 'maquillaje':
      case 'cuidado-corporal':
      case 'tratamientos':
      case 'ofertas':
      case 'otros':
        const categoryInfo = getCategoryInfo(currentPage);
        return (
          <CategoryPage
            category={currentPage}
            title={categoryInfo.title}
            description={categoryInfo.description}
          />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          cartItems={getTotalItems()}
          onCartClick={handleCartClick}
        />
        
        <main>
          {renderCurrentPage()}
        </main>

        <Footer />

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
};

export default App;