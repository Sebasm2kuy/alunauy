import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Image, Tag, DollarSign, Upload, Camera } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'blog'>('products');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Sample data - in a real app, this would come from a database
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Sérum Regenerador Premium",
      category: "serums",
      price: "$125.99",
      originalPrice: "$159.99",
      image: "/IMG-20250716-WA0022.jpg",
      description: "Sérum concentrado con ingredientes activos para regeneración celular profunda",
      rating: 4.9,
      reviews: 156,
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Crema Hidratante Intensiva",
      category: "cremas",
      price: "$89.99",
      originalPrice: "$110.00",
      image: "/IMG-20250716-WA0023.jpg",
      description: "Hidratación profunda de 24 horas con ácido hialurónico y vitamina E",
      rating: 4.8,
      reviews: 203,
      badge: "NUEVO"
    },
    {
      id: 3,
      name: "Base Líquida Natural",
      category: "maquillaje",
      price: "$65.99",
      originalPrice: "$85.00",
      image: "/IMG-20250716-WA0024.jpg",
      description: "Cobertura natural con protección solar SPF 30 y acabado mate",
      rating: 4.7,
      reviews: 89,
      badge: "OFERTA"
    },
    {
      id: 4,
      name: "Aceite Corporal Nutritivo",
      category: "corporal",
      price: "$75.99",
      originalPrice: "$95.00",
      image: "/IMG-20250716-WA0025.jpg",
      description: "Aceite multifuncional con extractos naturales para piel suave y radiante",
      rating: 4.9,
      reviews: 134,
      badge: "PREMIUM"
    },
    {
      id: 5,
      name: "Mascarilla Purificante",
      category: "tratamientos",
      price: "$55.99",
      originalPrice: "$70.00",
      image: "/IMG-20250716-WA0026.jpg",
      description: "Mascarilla de arcilla con carbón activado para poros profundos",
      rating: 4.6,
      reviews: 98,
      badge: "POPULAR"
    },
    {
      id: 6,
      name: "Sérum Vitamina C",
      category: "serums",
      price: "$89.99",
      originalPrice: "$120.00",
      image: "https://images.pexels.com/photos/7755515/pexels-photo-7755515.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Sérum concentrado con vitamina C para iluminar y proteger la piel",
      rating: 4.8,
      reviews: 124,
      badge: "CLÁSICO"
    },
    {
      id: 7,
      name: "Crema Hidratante Nocturna",
      category: "cremas",
      price: "$65.99",
      originalPrice: "$85.00",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Crema hidratante de noche con ácido hialurónico",
      rating: 4.9,
      reviews: 89,
      badge: "NOCTURNO"
    },
    {
      id: 8,
      name: "Mascarilla Facial Revitalizante",
      category: "tratamientos",
      price: "$45.99",
      originalPrice: "$60.00",
      image: "https://images.pexels.com/photos/7755501/pexels-photo-7755501.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Mascarilla revitalizante con extractos naturales",
      rating: 4.7,
      reviews: 156,
      badge: "NATURAL"
    },
    {
      id: 9,
      name: "Aceite Facial Regenerador",
      category: "serums",
      price: "$95.99",
      originalPrice: "$125.00",
      image: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Aceite facial con propiedades regeneradoras y anti-edad",
      rating: 4.9,
      reviews: 203,
      badge: "ANTI-EDAD"
    }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Los Beneficios del Ácido Hialurónico",
      excerpt: "Descubre por qué este ingrediente se ha convertido en el favorito de los expertos",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dra. María González",
      date: "15 Enero 2025",
      readTime: "5 min",
      category: "Cuidado Facial"
    }
  ]);

  const handleEdit = (item: Product | BlogPost) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingItem) {
      if (activeTab === 'products') {
        setProducts(products.map(p => p.id === editingItem.id ? editingItem as Product : p));
      } else {
        setBlogPosts(blogPosts.map(b => b.id === editingItem.id ? editingItem as BlogPost : b));
      }
    }
    setIsEditing(false);
    setEditingItem(null);
    setImagePreview('');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      if (activeTab === 'products') {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setBlogPosts(blogPosts.filter(b => b.id !== id));
      }
    }
  };

  const handleAddNew = () => {
    const newId = Math.max(...(activeTab === 'products' ? products.map(p => p.id) : blogPosts.map(b => b.id))) + 1;
    
    if (activeTab === 'products') {
      const newProduct: Product = {
        id: newId,
        name: "Nuevo Producto",
        category: "serums",
        price: "$0.00",
        image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Descripción del producto",
        rating: 5,
        reviews: 0
      };
      setProducts([...products, newProduct]);
      setEditingItem(newProduct);
    } else {
      const newPost: BlogPost = {
        id: newId,
        title: "Nuevo Artículo",
        excerpt: "Descripción breve del artículo",
        image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600",
        author: "Admin",
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: "5 min",
        category: "General"
      };
      setBlogPosts([...blogPosts, newPost]);
      setEditingItem(newPost);
    }
    setIsEditing(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        if (editingItem) {
          setEditingItem({...editingItem, image: result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    if (editingItem) {
      setEditingItem({...editingItem, image: url});
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-white/90 mt-2">Gestiona productos y publicaciones del blog</p>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'blog'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Blog
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {activeTab === 'products' ? 'Gestión de Productos' : 'Gestión de Blog'}
              </h2>
              <button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar {activeTab === 'products' ? 'Producto' : 'Artículo'}</span>
              </button>
            </div>

            {/* Products Table */}
            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Blog Table */}
            {activeTab === 'blog' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-lg object-cover" src={post.image} alt={post.title} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{post.title}</div>
                              <div className="text-sm text-gray-500">{post.excerpt.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Editar {activeTab === 'products' ? 'Producto' : 'Artículo'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {activeTab === 'products' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={(editingItem as Product).name}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={(editingItem as Product).description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                      <input
                        type="text"
                        value={(editingItem as Product).price}
                        onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={(editingItem as Product).category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="serums">Sérums</option>
                        <option value="cremas">Cremas</option>
                        <option value="maquillaje">Maquillaje</option>
                        <option value="corporal">Cuidado Corporal</option>
                        <option value="tratamientos">Tratamientos</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={(editingItem as BlogPost).title}
                      onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extracto</label>
                    <textarea
                      value={(editingItem as BlogPost).excerpt}
                      onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <input
                        type="text"
                        value={(editingItem as BlogPost).category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de lectura</label>
                      <input
                        type="text"
                        value={(editingItem as BlogPost).readTime}
                        onChange={(e) => setEditingItem({...editingItem, readTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="flex justify-center">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {(imagePreview || editingItem.image) ? (
                        <img 
                          src={imagePreview || editingItem.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Upload Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subir desde PC
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Seleccionar archivo</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* URL Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O usar URL
                      </label>
                      <input
                        type="url"
                        value={editingItem.image}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        if (editingItem) {
                          setEditingItem({...editingItem, image: ''});
                        }
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpiar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultImage = "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400";
                        handleImageUrlChange(defaultImage);
                      }}
                      className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                    >
                      Imagen por defecto
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;