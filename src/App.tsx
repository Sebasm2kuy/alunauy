import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductosDestacados from "./components/ProductosDestacados";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProductosDestacados />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
