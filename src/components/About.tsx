import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-white py-16 px-4 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
        <p className="text-gray-700 text-lg">
          Somos una tienda comprometida con ofrecer productos importados de alta calidad,
          cuidadosamente seleccionados para nuestros clientes. Nos especializamos en cosmética
          capilar y cuidado personal, trayendo lo mejor directamente a tu hogar.
        </p>
      </div>
    </section>
  );
};

export default About;
