import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductosDestacados from './components/ProductosDestacados';
import AboutSection from './components/About';
import ContactSection from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="pt-20"> {/* Espacio para el header fijo */}
      <Header />

      <section id="hero">
        <Hero />
      </section>

      <section id="productos">
        <ProductosDestacados />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
};

export default App;
