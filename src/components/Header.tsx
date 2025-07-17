import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

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
    if (productsTimeout) {
      clearTimeout(productsTimeout);
      setProductsTimeout(null);
    }
    setIsProductsOpen(true);
  };

  const handleProductsMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsProductsOpen(false);
    }, 300);
    setProductsTimeout(timeout);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        onPageChange('admin');
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    onPageChange('home');
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('home')}>
              <img
                src="/a26435bc-013e-419b-87a3-2b914c588bac-removebg-preview.png"
                alt="Aluna Logo"
                className="h-16 w-auto object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span
                className="text-4xl font-light tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                Aluna
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onPageChange('home')}
                className={`font-medium transition-colors ${currentPage === 'home' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
              >
                Inicio
              </button>

              <div className="relative" onMouseEnter={handleProductsMouseEnter} onMouseLeave={handleProductsMouseLeave}>
                <button
                  onClick={() => onPageChange('products')}
                  className={`font-medium transition-colors flex items-center space-x-1 ${currentPage === 'products' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                >
                  <span>Productos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {['cuidado-facial', 'maquillaje', 'cuidado-corporal', 'tratamientos', 'ofertas', 'otros'].map((section) => (
                      <button
                        key={section}
                        onClick={() => onPageChange(section)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                      >
                        {section.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onPageChange('about')}
                className={`font-medium transition-colors ${currentPage === 'about' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
              >
                Sobre Nosotros
              </button>

              <button
                onClick={() => onPageChange('blog')}
                className={`font-medium transition-colors ${currentPage === 'blog' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
              >
                Blog
              </button>

              <button
                onClick={() => onPageChange('contact')}
                className={`font-medium transition-colors ${currentPage === 'contact' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
              >
                Contacto
              </button>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />

              <div className="relative group">
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {isAuthenticated ? (isAdmin ? 'Administrador' : user?.username) : 'Iniciar Sesión'}
                  </span>
                </button>

                {isAuthenticated && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 group-hover:block hidden">
                    {isAdmin && (
                      <button
                        onClick={() => onPageChange('admin')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                      >
                        Panel Admin
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
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

              {/* Mobile menu toggle */}
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
            {['home', 'products', 'about', 'blog', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-700 hover:text-pink-500"
              >
                {page === 'home'
                  ? 'Inicio'
                  : page === 'products'
                  ? 'Productos'
                  : page === 'about'
                  ? 'Sobre Nosotros'
                  : page === 'blog'
                  ? 'Blog'
                  : 'Contacto'}
              </button>
            ))}
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
