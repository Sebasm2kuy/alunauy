import React, { useState, useEffect } from 'react';
import { Truck, Shield, Award, Star, Heart, ShoppingCart, ChevronDown } from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const slides = [
    {
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Nueva Colección",
      subtitle: "Descubre nuestra línea de productos naturales para realzar tu belleza"
    },
    {
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Cuidado Natural",
      subtitle: "Fórmulas desarrolladas con los mejores ingredientes naturales"
    },
    {
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Belleza Sostenible",
      subtitle: "Productos eco-friendly que cuidan tu piel y el planeta"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Sérum Vitamina C",
      price: "$89.99",
      originalPrice: "$120",
      image: "https://images.pexels.com/photos/7755515/pexels-photo-7755515.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 124,
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Crema Hidratante Nocturna",
      price: "$65.99",
      originalPrice: "$85",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 89,
      badge: "NUEVO"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsExploreOpen(false);
  };

  return (
    <div>
      {/* Floating Explore Button */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="relative">
          <button 
            onClick={() => setIsExploreOpen(!isExploreOpen)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Explorar Colección</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isExploreOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <button
                onClick={scrollToProducts}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
              >
                Ver Productos
              </button>
            </div>
          )}
        </div>
      </div>

      <main>
        {/* Hero Carousel */}
        <section className="relative h-screen overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-400">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
                <p className="text-gray-600">En compras superiores a $50.000</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Garantía Total</h3>
                <p className="text-gray-600">30 días de garantía en todos los productos</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
                <p className="text-gray-600">Productos certificados y dermatológicamente probados</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="products-section" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Productos Destacados</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre nuestra selección de productos más populares, formulados con ingredientes naturales de la más alta calidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Agregar al Carrito
                      </button>
                      <button className="bg-white text-gray-900 p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-pink-500 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-pink-500">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Galería de Productos</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explora nuestra colección completa de productos de belleza y cuidado personal
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
                Todos los Productos (2)
              </button>
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Sérums (1)
              </button>
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Cremas (1)
              </button>
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Maquillaje (0)
              </button>
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Cuidado Corporal (0)
              </button>
              <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200">
                Tratamientos (0)
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      Sérum concentrado con vitamina C para iluminar y proteger la piel
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
                        <span className="text-xl font-bold text-pink-500">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      </div>
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300">
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Nuestra Historia</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Aluna nació de la pasión por crear productos de belleza que respeten tanto tu piel como el medio ambiente. 
                  Desde 2018, hemos estado comprometidos con la investigación y desarrollo de fórmulas innovadoras que combinan 
                  la sabiduría ancestral con la ciencia moderna.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Cada producto es cuidadosamente formulado con ingredientes naturales de origen sostenible, 
                  sin comprometer la eficacia ni la calidad que mereces.
                </p>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Conoce Más
                </button>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Sobre Aluna"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl opacity-20"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Mantente al Día</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Suscríbete a nuestro newsletter y recibe las últimas novedades, tips de belleza y ofertas exclusivas
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-pink-500 px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;