import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  onPageChange?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/logo.png" 
                alt="Aluna Logo" 
                className="w-10 h-10 object-contain" 
              />
              <span className="text-3xl font-light tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Aluna
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Belleza natural y sostenible para realzar tu esencia única.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/aluna.auy" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              </a>
              <Facebook className="w-6 h-6 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Productos</h3>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => onPageChange?.('cuidado-facial')} className="hover:text-white transition-colors">Cuidado Facial</button></li>
              <li><button onClick={() => onPageChange?.('cuidado-corporal')} className="hover:text-white transition-colors">Cuidado Corporal</button></li>
              <li><button onClick={() => onPageChange?.('maquillaje')} className="hover:text-white transition-colors">Maquillaje</button></li>
              <li><button onClick={() => onPageChange?.('otros')} className="hover:text-white transition-colors">Accesorios</button></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Ayuda</h3>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => onPageChange?.('contact')} className="hover:text-white transition-colors">Centro de Ayuda</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
              <li><button onClick={() => onPageChange?.('contact')} className="hover:text-white transition-colors">Contacto</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => onPageChange?.('about')} className="hover:text-white transition-colors">Sobre Nosotros</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              <li><button onClick={() => onPageChange?.('blog')} className="hover:text-white transition-colors">Blog</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Aluna Cosméticos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;