import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-6">
      <p className="text-sm">&copy; {new Date().getFullYear()} AlunaUY. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
