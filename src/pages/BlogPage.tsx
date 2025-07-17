import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Los Beneficios del Ácido Hialurónico en tu Rutina de Belleza",
      excerpt: "Descubre por qué este ingrediente se ha convertido en el favorito de los expertos en cuidado de la piel y cómo incorporarlo correctamente en tu rutina diaria.",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dra. María González",
      date: "15 Enero 2025",
      readTime: "5 min",
      category: "Cuidado Facial"
    },
    {
      id: 2,
      title: "Rutina de Cuidado Nocturno: Pasos Esenciales",
      excerpt: "Una guía completa sobre cómo crear la rutina nocturna perfecta para regenerar tu piel mientras duermes y despertar con un rostro radiante.",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Ana Martínez",
      date: "12 Enero 2025",
      readTime: "7 min",
      category: "Rutinas"
    },
    {
      id: 3,
      title: "Ingredientes Naturales: La Revolución Verde en Cosmética",
      excerpt: "Exploramos los ingredientes naturales más efectivos y cómo están transformando la industria de la belleza hacia un futuro más sostenible.",
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Carlos Ruiz",
      date: "10 Enero 2025",
      readTime: "6 min",
      category: "Sostenibilidad"
    },
    {
      id: 4,
      title: "Maquillaje Natural: Técnicas para un Look Fresco",
      excerpt: "Aprende las técnicas profesionales para lograr un maquillaje natural que realce tu belleza sin parecer artificial.",
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Laura Fernández",
      date: "8 Enero 2025",
      readTime: "4 min",
      category: "Maquillaje"
    },
    {
      id: 5,
      title: "Cuidado de la Piel en Invierno: Consejos Esenciales",
      excerpt: "El frío puede ser duro con tu piel. Descubre cómo adaptar tu rutina de cuidado para mantener una piel saludable durante los meses de invierno.",
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Roberto Silva",
      date: "5 Enero 2025",
      readTime: "8 min",
      category: "Cuidado Estacional"
    },
    {
      id: 6,
      title: "DIY: Mascarillas Caseras con Ingredientes Naturales",
      excerpt: "Recetas fáciles y efectivas para crear mascarillas caseras usando ingredientes que probablemente ya tienes en tu cocina.",
      image: "https://images.pexels.com/photos/7755501/pexels-photo-7755501.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Isabel Torres",
      date: "3 Enero 2025",
      readTime: "5 min",
      category: "DIY"
    }
  ];

  const categories = ["Todos", "Cuidado Facial", "Rutinas", "Maquillaje", "Sostenibilidad", "DIY", "Cuidado Estacional"];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blog de Belleza
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre consejos de expertos, tendencias de belleza y guías completas para cuidar tu piel 
            y realzar tu belleza natural con productos Aluna.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-200 hover:border-pink-500 hover:text-pink-500 transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl overflow-hidden text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 lg:p-12">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  ARTÍCULO DESTACADO
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{blogPosts[0].date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{blogPosts[0].readTime}</span>
                  </div>
                </div>
                <button className="bg-white text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2">
                  <span>Leer Artículo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="h-96 lg:h-full">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimos Artículos</h2>
            <p className="text-xl text-gray-600">
              Mantente al día con nuestros consejos y novedades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <button className="text-pink-500 hover:text-purple-600 font-semibold inline-flex items-center space-x-1 transition-colors">
                      <span>Leer más</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            No te Pierdas Nuestros Consejos
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro blog y recibe los mejores consejos de belleza directamente en tu email
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-pink-500 px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;