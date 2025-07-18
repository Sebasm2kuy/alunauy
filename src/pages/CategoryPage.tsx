import React, { useState } from 'react';
import { Search, Eye, ShoppingCart, Heart, Filter } from 'lucide-react';
import { useStore, Product } from '../store/cmsStore';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  onAddToCart?: (product: Product) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, title, description, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Todos los productos disponibles
  const { products } = useStore();
  const allProducts = products.filter(p => p.active);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(price);
  };

  // Filtrar productos según la categoría
  const getFilteredProducts = () => {
    let categoryProducts = [];
    
    if (category === 'cuidado-facial') {
      categoryProducts = allProducts.filter(p => p.category === 'serums' || p.category === 'cremas');
    } else if (category === 'maquillaje') {
      categoryProducts = allProducts.filter(p => p.category === 'maquillaje');
    } else if (category === 'cuidado-corporal') {
      categoryProducts = allProducts.filter(p => p.category === 'corporal');
    } else if (category === 'tratamientos') {
      categoryProducts = allProducts.filter(p => p.category === 'tratamientos');
    } else if (category === 'ofertas') {
      categoryProducts = allProducts.filter(p => p.badge === 'OFERTA' || p.badge === 'BESTSELLER');
    } else if (category === 'otros') {
      categoryProducts = allProducts.filter(p => p.category === 'otros');
    }

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      categoryProducts = categoryProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return categoryProducts;
  };

  const filteredProducts = getFilteredProducts();

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button
                      onClick={() => openProductModal(product)}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onAddToCart?.(product)}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-pink-500">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => onAddToCart?.(product)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeProductModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800";
                }}
              />
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">({selectedProduct.reviews} reseñas)</span>
                  </div>
                </div>
                {selectedProduct.badge && (
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-pink-500">{formatPrice(selectedProduct.price)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Favoritos</span>
                  </button>
                  <button 
                    onClick={() => onAddToCart?.(selectedProduct)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;