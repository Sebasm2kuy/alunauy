import React, { useState } from 'react';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <img src={logo} alt="Aluna Logo" className="h-10 w-auto" />
          <span className="text-pink-600 font-bold text-xl">ALUNA</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => scrollToSection('hero')} className="text-gray-700 hover:text-pink-600">Inicio</button>
          <button onClick={() => scrollToSection('productos')} className="text-gray-700 hover:text-pink-600">Productos</button>
          <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-pink-600">Sobre Nosotros</button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-pink-600">Contacto</button>
          <FiSearch className="text-gray-700 hover:text-pink-600 cursor-pointer" />
          <a href="/login" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
            Iniciar Sesión
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-3">
          <button onClick={() => scrollToSection('hero')} className="block w-full text-left text-gray-700 hover:text-pink-600">Inicio</button>
          <button onClick={() => scrollToSection('productos')} className="block w-full text-left text-gray-700 hover:text-pink-600">Productos</button>
          <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-700 hover:text-pink-600">Sobre Nosotros</button>
          <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-700 hover:text-pink-600">Contacto</button>
          <a href="/login" className="block w-full text-left bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
            Iniciar Sesión
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
