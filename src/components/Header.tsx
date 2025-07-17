import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" onClick={scrollToTop}>
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          <button onClick={scrollToTop} className="hover:text-pink-600">Inicio</button>
          <a href="#productos" className="hover:text-pink-600">Productos</a>
          <button onClick={scrollToTop} className="hover:text-pink-600">Sobre Nosotros</button>
          <button onClick={scrollToTop} className="hover:text-pink-600">Contacto</button>
          <Link to="/login" className="text-sm font-medium hover:text-pink-600">Iniciar Sesión</Link>
          <FiSearch className="text-xl hover:text-pink-600 cursor-pointer" />
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-md">
          <button onClick={scrollToTop} className="block w-full text-left hover:text-pink-600">Inicio</button>
          <a href="#productos" className="block hover:text-pink-600">Productos</a>
          <button onClick={scrollToTop} className="block w-full text-left hover:text-pink-600">Sobre Nosotros</button>
          <button onClick={scrollToTop} className="block w-full text-left hover:text-pink-600">Contacto</button>
          <Link to="/login" className="block hover:text-pink-600">Iniciar Sesión</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
