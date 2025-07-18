import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItems: number;
  onCartClick: () => void;
  onSearch?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, cartItems, onCartClick, onSearch }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [productsTimeout, setProductsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    onPageChange('home');
  };

  const handleAdminClick = () => {
    onPageChange('admin');
    setIsUserMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    } else if (searchTerm.trim()) {
      // Si no hay función onSearch, navegar a productos
      onPageChange('products');
      setSearchTerm('');
    }
  };
  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={scrollToTop}>
              <img 
                src="/logo.png" 
                alt="Aluna Logo" 
                className="h-12 md:h-20 w-auto object-contain" 
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span className="text-2xl md:text-5xl font-light tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Aluna
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['home', 'blog', 'contact'].map(page => (
                <button 
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`font-medium transition-colors ${currentPage === page ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                >
                  {page === 'home' ? 'Inicio' : page === 'contact' ? 'Contacto' : page.charAt(0).toUpperCase() + page.slice(1)}
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
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                  >
                    {[
                      { id: 'cuidado-facial', name: 'Cuidado Facial' },
                      { id: 'maquillaje', name: 'Maquillaje' },
                      { id: 'cuidado-corporal', name: 'Cuidado Corporal' },
                      { id: 'tratamientos', name: 'Tratamientos' },
                      { id: 'ofertas', name: 'Ofertas' },
                      { id: 'otros', name: 'Accesorios' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => onPageChange(cat.id)}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              <div className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit} className="flex">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </form>
              </div>
              
              {/* Mobile Search Icon */}
              <Search className="w-6 h-6 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors md:hidden" />
              
              <div className="relative">
                <button onClick={handleUserClick} className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors">
                  <User className="w-6 h-6 md:w-5 md:h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {isAuthenticated ? (isAdmin ? 'Administrador' : user?.username) : 'Iniciar Sesión'}
                  </span>
                </button>
                {isAuthenticated && isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {isAdmin && (
                      <button
                        onClick={handleAdminClick}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                      >
                        Panel Admin
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={onCartClick}>
                  <ShoppingBag className="w-6 h-6 md:w-5 md:h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {['home', 'products', 'blog', 'contact'].map(page => (
                <button
                  key={page}
                  onClick={() => { onPageChange(page); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-3 px-2 rounded-lg font-medium transition-colors ${
                    currentPage === page ? 'text-pink-500 bg-pink-50' : 'text-gray-700 hover:text-pink-500 hover:bg-gray-50'
                  }`}
                >
                  {page === 'home' ? 'Inicio' : page === 'contact' ? 'Contacto' : page === 'products' ? 'Productos' : page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">Categorías</p>
                {[
                  { id: 'cuidado-facial', name: 'Cuidado Facial' },
                  { id: 'maquillaje', name: 'Maquillaje' },
                  { id: 'cuidado-corporal', name: 'Cuidado Corporal' },
                  { id: 'tratamientos', name: 'Tratamientos' },
                  { id: 'ofertas', name: 'Ofertas' },
                  { id: 'otros', name: 'Accesorios' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onPageChange(cat.id); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 px-2 text-sm text-gray-600 hover:text-pink-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              {/* Mobile User Actions */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">Cuenta</p>
                  {isAdmin && (
                    <button
                      onClick={() => { handleAdminClick(); setIsMobileMenuOpen(false); }}
                      className="block w-full text-left py-2 px-2 text-sm text-gray-600 hover:text-pink-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Panel Admin
                    </button>
                  )}
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 px-2 text-sm text-gray-600 hover:text-pink-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;