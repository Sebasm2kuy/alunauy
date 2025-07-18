import React from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductosDestacados from './components/ProductosDestacados';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductosDestacados />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
