import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer">
          <img src="/logo.png" alt="Aluna UY" className="h-8 w-8" />
          <span className="text-lg font-semibold text-gray-800">Aluna UY</span>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <a href="#hero" className="text-pink-500 font-medium hover:text-pink-600 transition-colors">
            Inicio
          </a>
          <div className="relative group">
            <button className="text-pink-500 font-medium flex items-center space-x-1 hover:text-pink-600 transition-colors">
              <span>Productos</span>
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="ml-1">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {/* Menú desplegable */}
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a href="#cuidado-facial" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Cuidado Facial</a>
              <a href="#maquillaje" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Maquillaje</a>
              <a href="#cuidado-corporal" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Cuidado Corporal</a>
              <a href="#tratamientos" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Tratamientos</a>
              <a href="#ofertas" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Ofertas</a>
              <a href="#accesorios" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors font-medium whitespace-nowrap">Accesorios</a>
            </div>
          </div>
          <a href="#about" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">
            Sobre Nosotros
          </a>
          <a href="#contact" className="text-gray-600 hover:text-pink-500 font-medium transition-colors">
            Contacto
          </a>
        </div>

        <div className="md:hidden">
          <button id="mobile-menu-button" className="text-gray-600 hover:text-pink-500 focus:outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div id="mobile-menu" className="hidden md:hidden bg-white px-4 pb-4 space-y-2">
        <a href="#hero" className="block text-pink-500 font-medium hover:text-pink-600 transition-colors">Inicio</a>
        <div className="border-t border-gray-200 pt-2">
          <span className="block text-gray-600 font-semibold">Productos</span>
          <a href="#cuidado-facial" className="block text-gray-600 hover:text-pink-500 ml-4">Cuidado Facial</a>
          <a href="#maquillaje" className="block text-gray-600 hover:text-pink-500 ml-4">Maquillaje</a>
          <a href="#cuidado-corporal" className="block text-gray-600 hover:text-pink-500 ml-4">Cuidado Corporal</a>
          <a href="#tratamientos" className="block text-gray-600 hover:text-pink-500 ml-4">Tratamientos</a>
          <a href="#ofertas" className="block text-gray-600 hover:text-pink-500 ml-4">Ofertas</a>
          <a href="#accesorios" className="block text-gray-600 hover:text-pink-500 ml-4">Accesorios</a>
        </div>
        <a href="#about" className="block text-gray-600 hover:text-pink-500 font-medium">Sobre Nosotros</a>
        <a href="#contact" className="block text-gray-600 hover:text-pink-500 font-medium">Contacto</a>
      </div>
    </nav>
  );
};

export default Navbar;
