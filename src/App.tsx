// src/App.tsx
import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductosDestacados from "./components/ProductosDestacados";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

const App: React.FC = () => {
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
};

export default App;
