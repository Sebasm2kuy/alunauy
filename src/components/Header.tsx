import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItems: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, cartItems, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

  const categories = [
    { id: 'serums', name: 'Sérums', items: ['Vitamina C', 'Ácido Hialurónico', 'Retinol', 'Niacinamida'] },
    { id: 'cremas', name: 'Cremas', items: ['Hidratantes', 'Anti-edad', 'Nocturnas', 'Contorno de ojos'] },
    { id: 'maquillaje', name: 'Maquillaje', items: ['Bases', 'Correctores', 'Labiales', 'Sombras'] },
    { id: 'corporal', name: 'Cuidado Corporal', items: ['Aceites', 'Lociones', 'Exfoliantes', 'Protector solar'] },
    { id: 'tratamientos', name: 'Tratamientos', items: ['Mascarillas', 'Peeling', 'Ampollas', 'Parches'] },
    { id: 'accesorios', name: 'Accesorios', items: ['Brochas', 'Esponjas', 'Herramientas', 'Organizadores'] }
  ];

  const handleExploreCollection = () => {
    setShowCategoriesMenu(!showCategoriesMenu);
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
              />
              <span className="text-4xl font-light tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: "'Playfair Display', 'Georgia', serif"}}>
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
              <div className="relative">
                <button 
                  onClick={() => onPageChange('products')}
                  className={`font-medium transition-colors flex items-center space-x-1 ${currentPage === 'products' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
                >
                  <span>Productos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
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

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
              <User className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
              <div className="relative">
                <button onClick={onCartClick}>
                  <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-pink-500 cursor-pointer transition-colors" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <button 
                onClick={() => { onPageChange('home'); setIsMenuOpen(false); }}
                className="block text-gray-700 hover:text-pink-500 transition-colors font-medium"
              >
                Inicio
              </button>
              <button 
                onClick={() => { onPageChange('products'); setIsMenuOpen(false); }}
                className="block text-gray-700 hover:text-pink-500 transition-colors font-medium"
              >
                Productos
              </button>
              <button 
                onClick={() => { onPageChange('about'); setIsMenuOpen(false); }}
                className="block text-gray-700 hover:text-pink-500 transition-colors font-medium"
              >
                Sobre Nosotros
              </button>
              <button 
                onClick={() => { onPageChange('blog'); setIsMenuOpen(false); }}
                className="block text-gray-700 hover:text-pink-500 transition-colors font-medium"
              >
                Blog
              </button>
              <button 
                onClick={() => { onPageChange('contact'); setIsMenuOpen(false); }}
                className="block text-gray-700 hover:text-pink-500 transition-colors font-medium"
              >
                Contacto
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Categories Menu Overlay */}
      {showCategoriesMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20" onClick={() => setShowCategoriesMenu(false)}>
          <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Explorar Colección</h2>
                <button
                  onClick={() => setShowCategoriesMenu(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <div key={category.id} className="group">
                    <h3 className="text-xl font-semibold mb-4 text-pink-500 group-hover:text-purple-600 transition-colors cursor-pointer">
                      {category.name}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item, index) => (
                        <li key={index}>
                          <button 
                            onClick={() => {
                              onPageChange('products');
                              setShowCategoriesMenu(false);
                            }}
                            className="text-gray-600 hover:text-pink-500 transition-colors text-left"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    onPageChange('products');
                    setShowCategoriesMenu(false);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Ver Todos los Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Collection Button - Global */}
      <div className="fixed bottom-8 right-8 z-30">
        <button 
          onClick={handleExploreCollection}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
          <span>Explorar Colección</span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showCategoriesMenu ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
};

export default Header;