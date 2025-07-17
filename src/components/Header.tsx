// src/components/Header.tsx
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { onPageChange('home'); scrollToTop(); }}>
              <img 
                src="/a26435bc-013e-419b-87a3-2b914c588bac-removebg-preview.png" 
                alt="Aluna Logo" 
                className="h-16 w-auto object-contain"
              />
              <span className="text-4xl font-light tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: "'Playfair Display', serif"}}>
                Aluna
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => { onPageChange('home'); scrollToTop(); }} className={`font-medium ${currentPage === 'home' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}>Inicio</button>
              <button onClick={() => onPageChange('products')} className={`font-medium ${currentPage === 'products' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}>Productos</button>
              <button onClick={() => onPageChange('about')} className={`font-medium ${currentPage === 'about' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}>Sobre Nosotros</button>
              <button onClick={() => onPageChange('blog')} className={`font-medium ${currentPage === 'blog' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}>Blog</button>
              <button onClick={() => onPageChange('contact')} className={`font-medium ${currentPage === 'contact' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}>Contacto</button>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" onClick={() => alert("Función de búsqueda próximamente")} />
              
              <button onClick={handleUserClick} className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm font-medium">
                  {isAuthenticated ? (isAdmin ? 'Administrador' : user?.username) : 'Iniciar Sesión'}
                </span>
              </button>

              <div className="relative">
                <button onClick={onCartClick}>
                  <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItems}</span>
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
              <button onClick={() => { onPageChange('home'); setIsMobileMenuOpen(false); scrollToTop(); }} className="block w-full text-left py-2 text-gray-700 hover:text-pink-500">Inicio</button>
              <button onClick={() => { onPageChange('products'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-pink-500">Productos</button>
              <button onClick={() => { onPageChange('about'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-pink-500">Sobre Nosotros</button>
              <button onClick={() => { onPageChange('blog'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-pink-500">Blog</button>
              <button onClick={() => { onPageChange('contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-pink-500">Contacto</button>
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
