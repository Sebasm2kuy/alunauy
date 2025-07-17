
import React, { useState } from 'react';
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-16 py-12 gap-8">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">
            {heroSlides[currentSlide].description}
          </p>
          <button
            onClick={nextSlide}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Ver siguiente
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src={heroSlides[currentSlide].image}
            alt="Hero"
            className="w-full h-auto rounded-xl object-cover max-h-[400px]"
          />
        </div>
      </section>

      {/* Product Gallery */}
      <section className="px-4 md:px-16 pb-12">
        <ProductGallery onAddToCart={onAddToCart} />
      </section>
    </div>
  );
};

export default HomePage;
