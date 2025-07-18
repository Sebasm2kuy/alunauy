import React from 'react';
import ProductGallery from '../components/ProductGallery';

interface ProductsPageProps {
  onAddToCart?: (product: any) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onAddToCart }) => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestros Productos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra completa gama de productos de belleza y cuidado personal, 
            formulados con ingredientes naturales de la más alta calidad para realzar tu belleza natural.
          </p>
        </div>
      </section>

      {/* Product Gallery */}
      <ProductGallery onAddToCart={onAddToCart} />

      {/* Categories Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestras Categorías</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestras diferentes líneas de productos diseñadas para cada necesidad de tu rutina de belleza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sérums</h3>
              <p className="text-gray-600">Tratamientos concentrados para necesidades específicas de tu piel</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cremas</h3>
              <p className="text-gray-600">Hidratación y nutrición profunda para todo tipo de piel</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Maquillaje</h3>
              <p className="text-gray-600">Productos de maquillaje que realzan tu belleza natural</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🧴</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cuidado Corporal</h3>
              <p className="text-gray-600">Productos para el cuidado integral de tu cuerpo</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tratamientos</h3>
              <p className="text-gray-600">Mascarillas y tratamientos especializados para tu piel</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accesorios</h3>
              <p className="text-gray-600">Herramientas y accesorios para tu rutina de belleza</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;