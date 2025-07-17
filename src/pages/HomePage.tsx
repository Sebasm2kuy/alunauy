
import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItems: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, cartItems, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const categories = [
    { name: 'Sérums', items: ['Vitamina C', 'Ácido Hialurónico', 'Retinol', 'Niacinamida'] },
    { name: 'Cremas', items: ['Hidratantes', 'Anti-edad', 'Nocturnas', 'Contorno de ojos'] },
    { name: 'Maquillaje', items: ['Bases', 'Correctores', 'Labiales', 'Sombras'] },
    { name: 'Cuidado Corporal', items: ['Aceites', 'Lociones', 'Exfoliantes'] }
  ];

  return (
    <header className="w-full bg-white shadow px-4 md:px-12 py-4 flex items-center justify-between">
      {/* Logo + Search */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Aluna</h1>
        <Search className="w-5 h-5 text-gray-600 ml-4" />
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-8 text-sm font-medium">
        {categories.map((cat) => (
          <div key={cat.name} className="group relative">
            <span className="cursor-pointer flex items-center gap-1">
              {cat.name} <ChevronDown className="w-4 h-4" />
            </span>
            <div className="absolute left-0 top-full mt-2 bg-white border shadow-md rounded-md hidden group-hover:block z-20 p-2">
              {cat.items.map((item) => (
                <div key={item} className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button onClick={() => setShowLoginModal(true)}>
          <User className="w-5 h-5" />
        </button>
        <button onClick={onCartClick} className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems}
            </span>
          )}
        </button>
        {/* Mobile menu icon */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
};

export default Header;

