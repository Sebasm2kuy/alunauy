// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-scroll";
import logo from "/logo192.png"; // Asegúrate de que esté en public o usa otro que tengas

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer">
          <img src={logo} alt="Aluna UY" className="h-8 w-8" />
          <span className="text-lg font-semibold text-gray-800">Aluna UY</span>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="hero" smooth duration={500} className="cursor-pointer text-gray-600 hover:text-blue-600">Inicio</Link>
          <Link to="productos" smooth duration={500} className="cursor-pointer text-gray-600 hover:text-blue-600">Productos</Link>
          <Link to="about" smooth duration={500} className="cursor-pointer text-gray-600 hover:text-blue-600">Sobre Nosotros</Link>
          <Link to="contact" smooth duration={500} className="cursor-pointer text-gray-600 hover:text-blue-600">Contacto</Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          <Link to="hero" smooth duration={500} className="block text-gray-600 hover:text-blue-600">Inicio</Link>
          <Link to="productos" smooth duration={500} className="block text-gray-600 hover:text-blue-600">Productos</Link>
          <Link to="about" smooth duration={500} className="block text-gray-600 hover:text-blue-600">Sobre Nosotros</Link>
          <Link to="contact" smooth duration={500} className="block text-gray-600 hover:text-blue-600">Contacto</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
