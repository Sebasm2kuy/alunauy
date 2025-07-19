import React, { useState, useEffect } from 'react';
import { Truck, Shield, Award, Star, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCMSStore, Product } from '../store/cmsStore'; // CORREGIDO: Cambiado 'useStore' a 'useCMSStore'

interface HomePageProps {
  onPageChange: (page: string) => void;
  onAddToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange, onAddToCart }) => {
  const { products } = useCMSStore(); // Usar useCMSStore
  const featuredProducts = products.filter(p => p.featured && p.active).slice(0, 4);
  const newArrivals = products.filter(p => p.active).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="30" fill="url(#grad1)" />
            <circle cx="80" cy="80" r="40" fill="url(#grad1)" />
            <circle cx="50" cy="0" r="25" fill="url(#grad1)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-in-up">
              Descubre tu Belleza Natural
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
              Productos de cuidado de la piel y cabello que realzan tu esencia.
            </p>
            <button
              onClick={() => onPageChange('products')}
              className="bg-white text-pink-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up animation-delay-400"
            >
              Comprar Ahora
            </button>
          </div>
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0 animate-fade-in-right">
            <img
              src="https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Productos de belleza"
              className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
            />
            <div className="absolute -bottom-4 -left-4 bg-yellow-300 text-yellow-800 text-sm font-bold px-4 py-2 rounded-full transform rotate-3 shadow-md">
              ¡Nuevas Ofertas!
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Truck className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Envío Rápido</h3>
            <p className="text-gray-600">Entregas en 24-48 horas en todo el país.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Compra Segura</h3>
            <p className="text-gray-600">Tus datos protegidos con la última tecnología.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Calidad Garantizada</h3>
            <p className="text-gray-600">Productos seleccionados por expertos en belleza.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Productos Destacados</h2>
          {featuredProducts.length === 0 ? (
            <p className="text-center text-gray-600">No hay productos destacados disponibles en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <button
              onClick={() => onPageChange('products')}
              className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors duration-300 shadow-md"
            >
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Novedades</h2>
          {newArrivals.length === 0 ? (
            <p className="text-center text-gray-600">No hay novedades disponibles en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Lo que dicen nuestros clientes</h2>
          <div className="bg-white p-8 rounded-lg shadow-xl relative">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="currentColor" />
            <p className="text-lg text-gray-700 italic mb-6">
              "¡Absolutamente encantada con los productos de Aluna! Mi piel nunca se había sentido tan bien. El envío fue súper rápido y la atención al cliente, impecable."
            </p>
            <p className="font-semibold text-gray-800">- Sofía G.</p>
            <p className="text-gray-500 text-sm">Clienta Satisfecha</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente ProductCard (puede estar en un archivo separado, pero lo incluyo aquí para contexto)
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {product.badge}
        </span>
      )}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/FFC0CB/FFFFFF?text=${product.name.replace(/ /g, '+')}`; }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 capitalize">{product.category.replace(/-/g, ' ')}</p>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">({product.reviews} reseñas)</span>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="text-pink-600 font-bold text-xl">${product.price}</span>
          {product.originalPrice > 0 && (
            <span className="text-gray-400 text-sm line-through ml-2">${product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className={`w-full bg-pink-500 text-white py-2 rounded-lg font-semibold transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } absolute bottom-0 left-0 right-0 transform group-hover:opacity-100 group-hover:translate-y-0`}
          style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(8px)' }}
        >
          <ShoppingCart className="inline-block w-5 h-5 mr-2" />
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}; // Cierre del componente ProductCard

export default HomePage;

