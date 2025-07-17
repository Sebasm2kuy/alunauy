import React from 'react';

const Home: React.FC = () => {
  return (
    <main className="pt-16"> {/* padding-top para evitar que el header lo tape */}
      {/* Hero Section */}
      <section className="w-full h-[60vh] md:h-[80vh] bg-pink-100 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600">Bienvenidos a Aluna</h1>
          <p className="text-lg text-gray-700 mt-4">Tu tienda de cosmética preferida</p>
        </div>
      </section>

      {/* Productos Importados Destacados */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Productos Importados Destacados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Producto 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
              <img
                src="/PackshampooycremaKarseell1290.jpg"
                alt="Pack Shampoo y Crema Karseell"
                className="w-full h-64 object-contain mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">Pack Shampoo y Crema Karseell</h3>
              <p className="text-pink-600 text-lg font-semibold mt-2">$1290</p>
            </div>

            {/* Producto 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
              <img
                src="/MascarillaKarseell1190.jpg"
                alt="Mascarilla Karseell"
                className="w-full h-64 object-contain mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">Mascarilla Karseell</h3>
              <p className="text-pink-600 text-lg font-semibold mt-2">$1190</p>
            </div>

            {/* Producto 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
              <img
                src="/producto3.jpg"
                alt="Producto Importado 3"
                className="w-full h-64 object-contain mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">Producto Importado 3</h3>
              <p className="text-pink-600 text-lg font-semibold mt-2">$X.XX</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
