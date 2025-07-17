import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';

interface HomePageProps {
  onAddToCart: (product: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const heroSlides = [
    {
      title: "Nueva Colección",
      description: "Descubre nuestra línea de productos naturales para realzar tu belleza",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      title: "Cuidado Natural",
      description: "Fórmulas desarrolladas con los mejores ingredientes naturales",
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      title: "Belleza Sostenible",
      description: "Productos eco-friendly que cuidan tu piel y el planeta",
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
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
                onClick={() => { scrollToProducts(); setIsExploreOpen(false); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
              >
                Ver Productos
              </button>
              <button 
                onClick={() => { setIsExploreOpen(false); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
              >
                Ofertas Especiales
              </button>
              <button 
                onClick={() => { setIsExploreOpen(false); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
              >
                Novedades
              </button>
            </div>
          )}
        </div>
      </div>

      <main>
        <div>
          {/* Hero Section */}
          <section className="relative h-screen overflow-hidden">
            {heroSlides.map((slide, index) => (
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
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
              {heroSlides.map((_, index) => (
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                      <path d="M15 18H9"/>
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                      <circle cx="17" cy="18" r="2"/>
                      <circle cx="7" cy="18" r="2"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
                  <p className="text-gray-600">En compras superiores a $50.000</p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Garantía Total</h3>
                  <p className="text-gray-600">30 días de garantía en todos los productos</p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                      <circle cx="12" cy="8" r="6"/>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
                  <p className="text-gray-600">Productos certificados y dermatológicamente probados</p>
                </div>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section id="products-section" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Productos Destacados</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Descubre nuestra selección de productos más populares, formulados con ingredientes naturales de la más alta calidad
                </p>
              </div>
              <ProductGallery />
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;