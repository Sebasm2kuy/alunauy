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
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [productsTimeout, setProductsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleProductsMouseEnter = () => {
    if (productsTimeout) clearTimeout(productsTimeout);
    setProductsOpen(true);
  };

  const handleProductsMouseLeave = () => {
    const timeout = setTimeout(() => setProductsOpen(false), 300);
    setProductsTimeout(timeout);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      if (isAdmin) onPageChange('admin');
    } else {
      setLoginModalOpen(true);
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
            {/* Logo - clic para volver arriba */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
              <img src="/logo.png" alt="Aluna" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-pink-600">Aluna</span>
            </button>

            {/* Menú escritorio */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onPageChange('home'); }} className={`font-medium ${currentPage==='home'?'text-pink-500':''}`}>Inicio</button>
              <div className="relative" onMouseEnter={handleProductsMouseEnter} onMouseLeave={handleProductsMouseLeave}>
                <button onClick={() => onPageChange('products')} className="font-medium flex items-center gap-1">
                  Productos <ChevronDown className="w-4 h-4" />
                </button>
                {isProductsOpen && (
                  <div className="absolute top-full bg-white rounded-lg shadow-lg py-2 z-50">
                    {['cuidado-facial','maquillaje','cuidado-corporal','tratamientos','ofertas','otros'].map(section => (
                      <button key={section} onClick={() => onPageChange(section)} className="block px-4 py-2 hover:bg-gray-100 text-left w-full">
                        {section.replace('-', ' ').replace(/\b\w/g,l=>l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => onPageChange('about')} className="font-medium">Sobre Nosotros</button>
              <button onClick={() => onPageChange('blog')} className="font-medium">Blog</button>
              <button onClick={() => onPageChange('contact')} className="font-medium">Contacto</button>
            </nav>

            {/* Iconos y menú móvil */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 cursor-pointer" />
              <div className="relative group">
                <button onClick={handleUserClick} className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">{isAuthenticated ? (isAdmin ? 'Admin' : user?.username) : 'Iniciar Sesión'}</span>
                </button>
                {isAuthenticated && (
                  <div className="absolute right-0 top-full bg-white rounded-lg shadow-lg py-2 group-hover:block hidden">
                    {isAdmin && <button onClick={() => onPageChange('admin')} className="block px-4 py-2">Panel Admin</button>}
                    <button onClick={handleLogout} className="block px-4 py-2">Cerrar Sesión</button>
                  </div>
                )}
              </div>
              <button onClick={onCartClick} className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItems > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full px-[6px] text-xs">{cartItems}</span>}
              </button>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4 px-4 space-y-2">
            {['home','products','about','blog','contact'].map(page => (
              <button key={page} onClick={() => { onPageChange(page); setMobileMenuOpen(false); }} className="block w-full text-left py-2">
                {page==='home'?'Inicio': page==='products'?'Productos': page==='about'?'Sobre Nosotros': page==='blog'?'Blog':'Contacto'}
              </button>
            ))}
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Header;
