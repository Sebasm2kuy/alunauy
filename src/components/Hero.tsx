import React, { useEffect, useState } from 'react';
import './Hero.css';

const images = ['/hero1.png', '/hero2.png', '/hero3.png'];

const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          className={`hero-image ${index === currentImage ? 'active' : ''}`}
          alt={`Slide ${index + 1}`}
        />
      ))}
      <div className="hero-text">
        <h1>Bienvenidos a Aluna</h1>
        <p>Tu tienda de belleza profesional</p>
      </div>
    </section>
  );
};

export default Hero;
