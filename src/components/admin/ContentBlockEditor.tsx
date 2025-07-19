import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Image as ImageIcon, Type, Code } from 'lucide-react';
import { PageContent } from '../../store/cmsStore';

interface ContentBlockEditorProps {
  content: PageContent;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({ content, onSave, onCancel }) => {
  const [formData, setFormData] = useState(content.content);

  useEffect(() => {
    setFormData(content.content);
  }, [content]);

  useEffect(() => {
    const handleSave = (event: CustomEvent) => {
      if (event.detail.tab === 'pages') {
        handleSubmit(new Event('submit') as any);
      }
    };

    window.addEventListener('cms-save', handleSave as EventListener);
    return () => window.removeEventListener('cms-save', handleSave as EventListener);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderEditor = () => {
    switch (content.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Elemento
              </label>
              <select
                value={formData.tag || 'p'}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="h1">Título Principal (H1)</option>
                <option value="h2">Título Secundario (H2)</option>
                <option value="h3">Título Terciario (H3)</option>
                <option value="h4">Subtítulo (H4)</option>
                <option value="p">Párrafo</option>
                <option value="span">Texto en línea</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido del Texto
              </label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Escribe tu contenido aquí..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clases CSS (Opcional)
              </label>
              <input
                type="text"
                value={formData.className || ''}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="ej: text-center text-lg font-bold"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                value={formData.src || ''}
                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            {formData.src && (
              <div className="flex justify-center">
                <img
                  src={formData.src}
                  alt="Preview"
                  className="max-w-xs max-h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={formData.alt || ''}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Descripción de la imagen para accesibilidad"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clases CSS (Opcional)
              </label>
              <input
                type="text"
                value={formData.className || ''}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="ej: w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.autoplay || false}
                    onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Reproducción Automática</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo (ms)
                </label>
                <input
                  type="number"
                  value={formData.interval || 5000}
                  onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  min="1000"
                  step="1000"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Slides
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    slides: [...(formData.slides || []), { image: '', title: '', subtitle: '' }]
                  })}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Slide</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {(formData.slides || []).map((slide: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Slide {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newSlides = [...(formData.slides || [])];
                          newSlides.splice(index, 1);
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="url"
                        value={slide.image || ''}
                        onChange={(e) => {
                          const newSlides = [...(formData.slides || [])];
                          newSlides[index] = { ...slide, image: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="URL de la imagen"
                      />
                      
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const newSlides = [...(formData.slides || [])];
                          newSlides[index] = { ...slide, title: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Título del slide"
                      />
                      
                      <input
                        type="text"
                        value={slide.subtitle || ''}
                        onChange={(e) => {
                          const newSlides = [...(formData.slides || [])];
                          newSlides[index] = { ...slide, subtitle: e.target.value };
                          setFormData({ ...formData, slides: newSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Subtítulo del slide"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'html':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código HTML
              </label>
              <textarea
                value={formData.html || ''}
                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
                placeholder="<div>Tu código HTML aquí...</div>"
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Solo usa HTML si sabes lo que estás haciendo. 
                El código HTML incorrecto puede romper el diseño de la página.
              </p>
            </div>
          </div>
        );

      case 'block':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Bloque
              </label>
              <select
                value={formData.type || 'testimonial'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="testimonial">Testimonios</option>
                <option value="faq">Preguntas Frecuentes</option>
                <option value="team">Equipo</option>
                <option value="features">Características</option>
                <option value="cta">Llamada a la Acción</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Bloque
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Título de la sección"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Descripción de la sección"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Los elementos específicos de este bloque se configurarán automáticamente 
                según el tipo seleccionado. Puedes personalizarlos después de guardar.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Tipo de contenido no soportado</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Editar {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 mt-1">
          {content.page} / {content.section}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderEditor()}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t mt-6">
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
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentBlockEditor;