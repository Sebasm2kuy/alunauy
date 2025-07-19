import React, { useState } from 'react';
import { Filter, Search, Eye, ShoppingCart, Heart } from 'lucide-react';
import { useCMSStore, Product } from '../store/cmsStore'; // CORREGIDO: Cambiado 'useStore' a 'useCMSStore'

interface ProductGalleryProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ onAddToCart }) => {
  const { products } = useCMSStore(); // Usar useCMSStore
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-asc', 'price-desc', 'name-asc', 'name-desc'

  const availableCategories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
    return 0; // default order or by 'order' property if exists
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Nuestros Productos</h2>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-1/3">
          <select
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las Categorías</option>
            {availableCategories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category.replace(/-/g, ' ')}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>

        {/* Sort Order */}
        <div className="relative w-full md:w-1/3">
          <select
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

// ProductCard Component (assuming it's defined elsewhere or inline as in HomePage)
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
};

export default ProductGallery;
