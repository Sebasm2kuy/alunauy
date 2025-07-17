import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductGallery from '../components/ProductGallery';

interface HomePageProps {
  onAddToCart: (prod: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const [page, setPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const heroSlides = [
    { title: "Nueva Colección", desc: "Descubre nuestra línea...", img: "https://images.pexels.com/photos/3762879.jpeg" },
    { title: "Cuidado Natural", desc: "Fórmulas desarrolladas...", img: "https://images.pexels.com/photos/4041392.jpeg" },
    { title: "Belleza Sostenible", desc: "Productos eco-friendly...", img: "https://images.pexels.com/photos/2720134.jpeg" }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setCurrentSlide((s)=> (s+1)%heroSlides.length),5000);
    return ()=>clearInterval(iv);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <div id="top"></div>
      <Header currentPage={page} onPageChange={setPage} cartItems={cartCount} onCartClick={()=>{}} />

      {/* Hero */}
      <section className="relative w-full h-[400px] md:h-[500px] mt-16 overflow-hidden">
        {heroSlides.map((s,i)=>(
          <img key={i} src={s.img} alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i===currentSlide?'opacity-100':'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">{heroSlides[currentSlide].title}</h1>
          <p className="text-lg text-white mb-6">{heroSlides[currentSlide].desc}</p>
          <button onClick={()=>document.getElementById('destacados')?.scrollIntoView({behavior:'smooth'})}
            className="bg-white text-black px-6 py-3 rounded-lg">Explorar colección</button>
        </div>
      </section>

      {/* Sección productos destacados */}
      <section id="destacados" className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Productos Recomendados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <img src="/images/PackshampooycremaKarseell1290.jpg" alt="Pack Shampoo y Acondicionador" className="w-full h-64 object-contain mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Pack Shampoo y Acondicionador</h3>
              <p className="text-pink-600 font-bold text-xl mb-2">$1290</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Ver producto</button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <img src="/images/MascarillaKarseell1190.jpg" alt="Mascarilla Karseell Colágeno" className="w-full h-64 object-contain mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Mascarilla Karseell Colágeno</h3>
              <p className="text-pink-600 font-bold text-xl mb-2">$1190</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Ver producto</button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <img src="/images/producto3.jpg" alt="Producto destacado" className="w-full h-64 object-contain mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Producto Destacado</h3>
              <p className="text-pink-600 font-bold text-xl mb-2">$990</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Ver producto</button>
            </div>
          </div>
        </div>
      </section>

      {/* Galería productos */}
      <section className="px-4 md:px-16 py-12">
        <ProductGallery onAddToCart={onAddToCart} />
      </section>
    </div>
  );
};

export default HomePage;
