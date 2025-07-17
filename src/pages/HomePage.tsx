import React from 'react';

const HomePage: React.FC = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-cover bg-center h-[70vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url('/hero.jpg')`,
        }}
      >
        <div className="bg-black/50 w-full h-full absolute top-0 left-0" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenidos a Aluna</h1>
          <p className="text-lg md:text-xl mb-6">
            Productos de belleza importados directamente para ti.
          </p>
          <a
            href="#productos"
            className="bg-pink-600 hover:bg-pink-700 transition px-6 py-3 rounded text-white font-medium"
          >
            Ver Productos
          </a>
        </div>
      </section>

      {/* Productos destacados */}
      <section id="productos" className="py-12 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-pink-600">Destacados</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Producto 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
              <img src="/MascarillaKarseell1190.jpg" alt="Mascarilla" className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Mascarilla Karseell</h3>
                <p className="text-pink-600 text-lg font-bold mt-2">$1190</p>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
              <img src="/PackshampooycremaKarseell1290.jpg" alt="Pack Shampoo y Crema" className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Pack Shampoo y Crema Karseell</h3>
                <p className="text-pink-600 text-lg font-bold mt-2">$1290</p>
              </div>
            </div>

            {/* Producto 3 (placeholder) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
              <img src="/producto3.jpg" alt="Producto 3" className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">Producto 3</h3>
                <p className="text-pink-600 text-lg font-bold mt-2">$990</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
