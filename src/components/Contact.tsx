import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="bg-gray-100 py-16 px-4 md:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Contacto</h2>
        <p className="text-gray-700 text-lg mb-4">
          ¿Tenés dudas o querés comunicarte con nosotros? ¡Estamos para ayudarte!
        </p>
        <p className="text-gray-700 text-lg">📧 contacto@alunauy.es</p>
        <p className="text-gray-700 text-lg">📱 +598 91 234 567</p>
      </div>
    </section>
  );
};

export default Contact;
