import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Star, 
  Tag, 
  Package,
  DollarSign,
  Image as ImageIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product } from '../../store/cmsStore';

interface ProductEditorProps {
  product: Product | null;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    shortDescription: '',
    category: 'serums',
    price: 0,
    originalPrice: 0,
    priceUSD: 0,
    originalPriceUSD: 0,
    images: [''],
    rating: 5,
    reviews: 0,
    badge: '',
    stock: 0,
    variants: [],
    customFields: {},
    seoTitle: '',
    seoDescription: '',
    featured: false,
    active: true,
    order: 0
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newVariant, setNewVariant] = useState({ name: '', options: [''] });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        priceUSD: product.priceUSD || 0,
        originalPriceUSD: product.originalPriceUSD || 0,
        images: product.images.length > 0 ? product.images : [''],
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge || '',
        stock: product.stock,
        variants: product.variants || [],
        customFields: product.customFields || {},
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        featured: product.featured,
        active: product.active,
        order: product.order
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty images
    const cleanedImages = formData.images.filter(img => img.trim() !== '');
    
    onSave({
      ...formData,
      images: cleanedImages.length > 0 ? cleanedImages : ['https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'],
      seoTitle: formData.seoTitle || formData.name,
      seoDescription: formData.seoDescription || formData.shortDescription || formData.description.substring(0, 160)
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.options[0]) {
      setFormData({
        ...formData,
        variants: [...(formData.variants || []), { 
          id: Date.now().toString(),
          ...newVariant,
          options: newVariant.options.filter(opt => opt.trim() !== '')
        }]
      });
      setNewVariant({ name: '', options: [''] });
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariantOption = (variantIndex: number, optionIndex: number, value: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options[optionIndex] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariantOption = (variantIndex: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options.push('');
    setFormData({ ...formData, variants: newVariants });
  };

  const tabs = [
    { id: 'basic', name: 'Información Básica', icon: Package },
    { id: 'images', name: 'Imágenes', icon: ImageIcon },
    { id: 'pricing', name: 'Precios', icon: DollarSign },
    { id: 'variants', name: 'Variantes', icon: Tag },
    { id: 'seo', name: 'SEO', icon: Eye }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r bg-gray-50">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Descripción breve para listados"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Completa *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reseñas
                    </label>
                    <input
                      type="number"
                      value={formData.reviews}
                      onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="ej: BESTSELLER, NUEVO, OFERTA"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Producto Destacado</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Producto Activo</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Imágenes del Producto
                  </label>
                  <div className="space-y-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="URL de la imagen"
                          />
                        </div>
                        {image && (
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                        )}
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addImage}
                    className="mt-4 flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Imagen</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio en Pesos (UYU) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original en Pesos (UYU)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio en Dólares (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original en Dólares (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPriceUSD}
                      onChange={(e) => setFormData({ ...formData, originalPriceUSD: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Variantes del Producto
                  </label>
                  
                  {formData.variants && formData.variants.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {formData.variants.map((variant, variantIndex) => (
                        <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{variant.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeVariant(variantIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {variant.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateVariantOption(variantIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  placeholder="Opción"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addVariantOption(variantIndex)}
                              className="text-sm text-pink-600 hover:text-pink-700"
                            >
                              + Agregar opción
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Nueva Variante</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newVariant.name}
                        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nombre de la variante (ej: Tamaño, Color)"
                      />
                      {newVariant.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newVariant.options];
                            newOptions[index] = e.target.value;
                            setNewVariant({ ...newVariant, options: newOptions });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Opción"
                        />
                      ))}
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setNewVariant({ 
                            ...newVariant, 
                            options: [...newVariant.options, ''] 
                          })}
                          className="text-sm text-gray-600 hover:text-gray-700"
                        >
                          + Agregar opción
                        </button>
                        <button
                          type="button"
                          onClick={addVariant}
                          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                        >
                          Guardar Variante
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Si está vacío, se usará el nombre del producto"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Longitud recomendada: 50-60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Si está vacía, se usará la descripción corta o un extracto de la descripción"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Longitud recomendada: 150-160 caracteres
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{product ? 'Actualizar' : 'Crear'} Producto</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;