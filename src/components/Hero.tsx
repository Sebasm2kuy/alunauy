import React from 'react';
import heroImage from '../assets/hero.jpg'; // Asegurate de tener hero.jpg en src/assets

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenido a AlunaUY</h1>
        <p className="text-lg md:text-xl mb-6">Productos exclusivos importados directamente para vos</p>
        <a href="#productos" className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition">
          Ver productos
        </a>
      </div>
    </section>
  );
};

export default Hero;
