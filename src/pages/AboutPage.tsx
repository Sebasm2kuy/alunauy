import React from 'react';
import { Heart, Leaf, Award, Users, Target, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Pasión por la Belleza",
      description: "Creemos que cada persona tiene una belleza única que merece ser realzada con productos de calidad excepcional."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Compromiso Natural",
      description: "Utilizamos ingredientes naturales y sostenibles, respetando tanto tu piel como el medio ambiente."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Calidad Premium",
      description: "Cada producto pasa por rigurosos controles de calidad para garantizar los mejores resultados."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidad",
      description: "Construimos una comunidad de personas que comparten la pasión por el cuidado personal y la belleza natural."
    }
  ];

  const team = [
    {
      name: "María González",
      role: "Fundadora & CEO",
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Química especializada en cosmética natural con más de 15 años de experiencia."
    },
    {
      name: "Carlos Ruiz",
      role: "Director de Investigación",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Experto en formulación de productos naturales y desarrollo de nuevas tecnologías."
    },
    {
      name: "Ana Martínez",
      role: "Directora de Marketing",
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Especialista en comunicación de marca y estrategias de belleza sostenible."
    },
    {
      name: "Laura Fernández",
      role: "Especialista en Cuidado de la Piel",
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Dermatóloga y consultora en rutinas de cuidado personalizado."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre Aluna
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde 2018, hemos estado comprometidos con crear productos de belleza que respeten 
            tanto tu piel como el medio ambiente, combinando la sabiduría ancestral con la ciencia moderna.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Nuestra Historia</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Aluna nació de un sueño: crear productos de belleza que no solo embellecieran, 
                  sino que también cuidaran la piel de manera natural y sostenible. Fundada en 2018 
                  por María González, una química apasionada por la cosmética natural.
                </p>
                <p>
                  Comenzamos en un pequeño laboratorio, experimentando con ingredientes naturales 
                  de origen local. Nuestra primera línea de sérums faciales fue un éxito inmediato, 
                  lo que nos motivó a expandir nuestra gama de productos.
                </p>
                <p>
                  Hoy, Aluna es reconocida como una marca líder en cosmética natural, con presencia 
                  en toda América Latina y un compromiso inquebrantable con la calidad, 
                  la sostenibilidad y la belleza auténtica.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Historia de Aluna"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed">
                Crear productos de belleza naturales y sostenibles que realcen la belleza única de cada persona, 
                mientras promovemos el cuidado responsable del medio ambiente y apoyamos a las comunidades locales.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
              <p className="text-gray-700 leading-relaxed">
                Ser la marca de cosmética natural líder en América Latina, reconocida por nuestra innovación, 
                calidad excepcional y compromiso inquebrantable con la sostenibilidad y la belleza auténtica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y cada producto que creamos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a las personas apasionadas que hacen posible la magia de Aluna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-pink-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Certificaciones y Reconocimientos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestro compromiso con la calidad y sostenibilidad está respaldado por certificaciones internacionales
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold">Certificado Orgánico</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold">Cruelty Free</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold">ISO 22716</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold">Comercio Justo</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Únete a la Familia Aluna
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre productos que no solo embellecen, sino que también cuidan tu piel y el planeta
          </p>
          <button className="bg-white text-pink-500 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
            Explorar Productos
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;