import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full bg-black text-white overflow-hidden">
      <img
        src={heroImage}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenido a Aluna
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Belleza natural, directamente de la India a Uruguay.
        </p>
        <Link
          to="/productos"
          className="bg-white text-black px-6 py-3 rounded-full text-lg hover:bg-gray-200 transition"
        >
          Ver productos
        </Link>
      </div>
    </section>
  );
};

export default Hero;
