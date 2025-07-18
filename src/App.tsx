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

// Estado global para productos (en una app real esto estaría en un contexto o store)
let globalProducts = [
  {
    id: 1,
    name: "Sérum Regenerador Premium",
    category: "serums",
    price: "$125.99",
    originalPrice: "$159.99",
    image: "/IMG-20250716-WA0022.jpg",
    description: "Sérum concentrado con ingredientes activos para regeneración celular profunda",
    rating: 4.9,
    reviews: 156,
    badge: "BESTSELLER"
  },
  {
    id: 2,
    name: "Crema Hidratante Intensiva",
    category: "cremas",
    price: "$89.99",
    originalPrice: "$110.00",
    image: "/IMG-20250716-WA0023.jpg",
    description: "Hidratación profunda de 24 horas con ácido hialurónico y vitamina E",
    rating: 4.8,
    reviews: 203,
    badge: "NUEVO"
  },
  {
    id: 3,
    name: "Base Líquida Natural",
    category: "maquillaje",
    price: "$65.99",
    originalPrice: "$85.00",
    image: "/IMG-20250716-WA0024.jpg",
    description: "Cobertura natural con protección solar SPF 30 y acabado mate",
    rating: 4.7,
    reviews: 89,
    badge: "OFERTA"
  },
  {
    id: 4,
    name: "Aceite Corporal Nutritivo",
    category: "corporal",
    price: "$75.99",
    originalPrice: "$95.00",
    image: "/IMG-20250716-WA0025.jpg",
    description: "Aceite multifuncional con extractos naturales para piel suave y radiante",
    rating: 4.9,
    reviews: 134,
    badge: "PREMIUM"
  },
  {
    id: 5,
    name: "Mascarilla Purificante",
    category: "tratamientos",
    price: "$55.99",
    originalPrice: "$70.00",
    image: "/IMG-20250716-WA0026.jpg",
    description: "Mascarilla de arcilla con carbón activado para poros profundos",
    rating: 4.6,
    reviews: 98,
    badge: "POPULAR"
  },
  {
    id: 6,
    name: "Sérum Vitamina C",
    category: "serums",
    price: "$89.99",
    originalPrice: "$120.00",
    image: "https://images.pexels.com/photos/7755515/pexels-photo-7755515.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Sérum concentrado con vitamina C para iluminar y proteger la piel",
    rating: 4.8,
    reviews: 124,
    badge: "CLÁSICO"
  },
  {
    id: 7,
    name: "Crema Hidratante Nocturna",
    category: "cremas",
    price: "$65.99",
    originalPrice: "$85.00",
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Crema hidratante de noche con ácido hialurónico",
    rating: 4.9,
    reviews: 89,
    badge: "NOCTURNO"
  },
  {
    id: 8,
    name: "Mascarilla Facial Revitalizante",
    category: "tratamientos",
    price: "$45.99",
    originalPrice: "$60.00",
    image: "https://images.pexels.com/photos/7755501/pexels-photo-7755501.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Mascarilla revitalizante con extractos naturales",
    rating: 4.7,
    reviews: 156,
    badge: "NATURAL"
  },
  {
    id: 9,
    name: "Aceite Facial Regenerador",
    category: "serums",
    price: "$95.99",
    originalPrice: "$125.00",
    image: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Aceite facial con propiedades regeneradoras y anti-edad",
    rating: 4.9,
    reviews: 203,
    badge: "ANTI-EDAD"
  }
];

// Función para actualizar productos globalmente
export const updateGlobalProducts = (products: any[]) => {
  globalProducts = products;
};

// Función para obtener productos globalmente
export const getGlobalProducts = () => {
  return globalProducts;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      quantity: 1,
      image: product.image
    };
    
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, cartItem]);
    }
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
        return <HomePage onPageChange={handlePageChange} />;
      case 'products':
        return <ProductsPage key={refreshKey} onAddToCart={handleAddToCart} />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPanel key={refreshKey} />;
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
    <AuthProvider>
      <div className="min-h-screen bg-white">
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