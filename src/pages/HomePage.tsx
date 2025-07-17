import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductGallery from '../components/ProductGallery';

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
      image: "https://images.pexels.com/photos/2720134/pexels-photo-2720134.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
  ];

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
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mt-[160px]">
        <img
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 max-w-xl">
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

      {/* Product Gallery */}
      <section id="productos" className="px-4 md:px-16 py-12">
        <ProductGallery onAddToCart={onAddToCart} />
      </section>
    </div>
  );
};

export default HomePage;
