import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductGallery from '../components/ProductGallery';

interface HomePageProps {
  onAddToCart: (product: any) => void;
  onPageChange: (page: string) => void;
  cartItems: number;
  onCartClick: () => void;
  currentPage: string;
}

const heroSlides = [
  {
    image: '/hero1.jpg',
    title: 'Descubrí la belleza natural',
    description: 'Productos capilares profesionales importados directamente de fábrica.',
  },
  {
    image: '/hero2.jpg',
    title: 'Cuidá tu cabello como se merece',
    description: 'Tratamientos de alta calidad para todo tipo de cabello.',
  },
  {
    image: '/hero3.jpg',
    title: 'Ofertas exclusivas todo el año',
    description: 'Comprá ahora y recibí envío gratis en productos seleccionados.',
  },
];

const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  onPageChange,
  cartItems,
  onCartClick,
  currentPage,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    const section = document.getElementById('productos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <Header
        currentPage={currentPage}
        onPageChange={onPageChange}
        cartItems={cartItems}
        onCartClick={onCartClick}
      />

      {/* Hero */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mt-[160px]">
        <img
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-white text-lg max-w-xl mb-6">
            {heroSlides[currentSlide].description}
          </p>
          <button
            onClick={scrollToProducts}
            className="bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            Explorar colección
          </button>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-12 px-4 md:px-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Importados Exclusivos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Producto 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-transform transform hover:scale-105">
              <img
                src="/PackshampooycremaKarseell1290.jpg"
                alt="Pack Shampoo y Crema"
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-4">Pack Shampoo y Crema Karseell</h3>
              <p className="text-pink-600 font-bold mt-1">$1290</p>
            </div>

            {/* Producto 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-transform transform hover:scale-105">
              <img
                src="/MascarillaKarseell1190.jpg"
                alt="Mascarilla Karseell"
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-4">Mascarilla Karseell</h3>
              <p className="text-pink-600 font-bold mt-1">$1190</p>
            </div>

            {/* Producto 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-transform transform hover:scale-105">
              <img
                src="/producto3.jpg"
                alt="Producto 3"
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-4">Producto Importado</h3>
              <p className="text-pink-600 font-bold mt-1">$990</p>
            </div>
          </div>
        </div>
      </section>

      {/* Galería de productos */}
      <section id="productos" className="px-4 md:px-16 py-12 bg-gray-50">
        <ProductGallery onAddToCart={onAddToCart} />
      </section>
    </div>
  );
};

export default HomePage;

