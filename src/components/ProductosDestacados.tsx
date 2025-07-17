import React from 'react';

const productos = [
  {
    nombre: 'Pack Shampoo + Crema Karseell',
    precio: '$1290',
    imagen: '/PackshampooycremaKarseell1290.jpg',
  },
  {
    nombre: 'Mascarilla Karseell',
    precio: '$1190',
    imagen: '/MascarillaKarseell1190.jpg',
  },
  {
    nombre: 'Producto destacado 3',
    precio: '$990',
    imagen: '/producto3.jpg',
  },
];

const ProductosDestacados = () => {
  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Productos Importados Destacados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {productos.map((producto, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
            <p className="text-lg font-bold text-green-600">{producto.precio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosDestacados;
