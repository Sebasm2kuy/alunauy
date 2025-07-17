import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Truck, Shield, Award, Heart } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
}

interface HomePageProps {
  onAddToCart: (product: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const products: Product[] = [
    {
      id: 1,
      name: "Sérum Vitamina C",
      price: 89.99,
      originalPrice: 120.00,
      image: "https://images.pexels.com/photos/7755515/pexels-photo-7755515.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviews: 124,
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Crema Hidratante Nocturna",
      price: 65.99,
      originalPrice: 85.00,
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 89,
      badge: "NUEVO"
    },
    {
      id: 3,
      name: "Mascarilla Purificante",
      price: 45.99,
      originalPrice: 60.00,
      image: "https://images.pexels.com/photos/7755501/pexels-photo-7755501.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7,
      reviews: 156,
      badge: "OFERTA"
    },
    {
      id: 4,
      name: "Aceite Facial Regenerador",
      price: 95.99,
      originalPrice: 125.00,
      image: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      reviews: 203,
      badge: "PREMIUM"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
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

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de productos más populares, formulados con ingredientes naturales de la más alta calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
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
                    <span className="text-xl font-bold text-pink-500">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <ProductGallery />

      {/* About Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nuestra Historia
              </h2>
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mantente al Día
          </h2>
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
  );
};

export default HomePage;