import React from 'react';
import hero from '../assets/hero.jpg';
import producto1 from '../assets/MascarillaKarseell1190.jpg';
import producto2 from '../assets/PackshampooycremaKarseell1290.jpg';
import producto3 from '../assets/producto3.jpg';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-cover bg-center h-[400px]" style={{ backgroundImage: `url(${hero})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenidos a Aluna</h1>
            <p className="text-lg md:text-xl">Belleza y cuidado personal en un solo lugar</p>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ src: producto1, nombre: 'Mascarilla Karseell', precio: '1190' },
            { src: producto2, nombre: 'Pack Shampoo + Crema', precio: '1290' },
            { src: producto3, nombre: 'Producto Especial', precio: 'Consultar' }
          ].map((prod, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 duration-300">
              <img src={prod.src} alt={prod.nombre} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{prod.nombre}</h3>
                <p className="text-pink-500 text-lg">${prod.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
