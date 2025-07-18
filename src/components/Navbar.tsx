import React from "react";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-800">
          ALUNA
        </a>
        <div className="space-x-4 hidden md:flex">
          <Link to="hero" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-pink-500">
            Inicio
          </Link>
          <Link to="productos" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-pink-500">
            Productos
          </Link>
          <Link to="about" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-pink-500">
            Sobre Nosotros
          </Link>
          <Link to="contact" smooth duration={500} className="cursor-pointer text-gray-700 hover:text-pink-500">
            Contacto
          </Link>
        </div>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300">
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
