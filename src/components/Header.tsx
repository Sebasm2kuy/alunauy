import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <h1 className="text-2xl font-semibold text-pink-600">Aluna</h1>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-xl text-gray-700">
          <Search className="cursor-pointer" />
          <User className="cursor-pointer" />
          <ShoppingCart className="cursor-pointer" />
        </div>
      </div>

      {/* Fixed Menu */}
      <nav className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm">
        <ul className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex gap-6 overflow-x-auto whitespace-nowrap">
          <li className="group relative cursor-pointer hover:underline">
            Cuidado Facial
            <ul className="absolute left-0 top-full hidden group-hover:block bg-white text-black mt-1 shadow-md rounded-md w-40">
              <li className="px-4 py-2 hover:bg-gray-100">Cremas</li>
              <li className="px-4 py-2 hover:bg-gray-100">Sérums</li>
              <li className="px-4 py-2 hover:bg-gray-100">Mascarillas</li>
            </ul>
          </li>
          <li className="group relative cursor-pointer hover:underline">
            Maquillaje
            <ul className="absolute left-0 top-full hidden group-hover:block bg-white text-black mt-1 shadow-md rounded-md w-40">
              <li className="px-4 py-2 hover:bg-gray-100">Bases</li>
              <li className="px-4 py-2 hover:bg-gray-100">Labiales</li>
              <li className="px-4 py-2 hover:bg-gray-100">Sombras</li>
            </ul>
          </li>
          <li className="hover:underline cursor-pointer">Cuidado Capilar</li>
          <li className="hover:underline cursor-pointer">Higiene</li>
          <li className="hover:underline cursor-pointer">Ofertas</li>
          <li className="hover:underline cursor-pointer">Novedades</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
