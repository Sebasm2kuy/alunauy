import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import logo from '../assets/logo.png';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItems: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, cartItems, onCartClick }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [productsTimeout, setProductsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleProductsMouseEnter = () => {
    if (productsTimeout) clearTimeout(productsTimeout);
    setIsProductsOpen(true);
  };

  const handleProductsMouseLeave = () => {
    const timeout = setTimeout(() => setIsProductsOpen(false), 300);
    setProductsTimeout(timeout);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      if (isAdmin) onPageChange('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    onPageChange('home');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange('home');
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={scrollToTop}>
              <img 
                src={logo} 
                alt="Aluna Logo" 
                className="h-16 w-auto object-contain" 
              />
              <span className="text-4xl font-light tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
                Aluna
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'blog', 'contact'].map(page => (
                <button 
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`font-medium transition-colors ${currentPage === page ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                >
                  {page === 'home' ? 'Inicio' : page === 'about' ? 'Sobre Nosotros' : page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
              <div className="relative">
                <button
                  onMouseEnter={handleProductsMouseEnter}
                  onMouseLeave={handleProductsMouseLeave}
                  onClick={() => onPageChange('products')}
                  className={`font-medium transition-colors flex items-center space-x-1 ${currentPage === 'products' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                >
                  <span>Productos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isProductsOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                  >
                    {['cuidado-facial', 'maquillaje', 'cuidado-corporal', 'tratamientos', 'ofertas', 'otros'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => onPageChange(cat)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                      >
                        {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
              <div className="relative">
                <button onClick={handleUserClick} className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {isAuthenticated ? (isAdmin ? 'Administrador' : user?.username) : 'Iniciar Sesión'}
                  </span>
                </button>
              </div>
              <div className="relative">
                <button onClick={onCartClick}>
                  <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              {['home', 'products', 'about', 'blog', 'contact'].map(page => (
                <button
                  key={page}
                  onClick={() => { onPageChange(page); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-pink-500"
                >
                  {page === 'home' ? 'Inicio' : page === 'about' ? 'Sobre Nosotros' : page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
