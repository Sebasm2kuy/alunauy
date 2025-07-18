import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  EyeOff,
  X,
  Save,
  FileText
} from 'lucide-react';
import { useFirestore, Page } from '../../hooks/useFirestore';

interface PagesManagerProps {
  onSave?: () => void;
}

const PagesManager: React.FC<PagesManagerProps> = ({ onSave }) => {
  const { pages, addPage, updatePage, deletePage, loading } = useFirestore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    published: false
  });

  // Páginas predefinidas importantes
  const predefinedPages = [
    { slug: 'devoluciones', title: 'Política de Devoluciones' },
    { slug: 'carreras', title: 'Carreras' },
    { slug: 'sostenibilidad', title: 'Sostenibilidad' }
  ];

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Generar slug automáticamente si está vacío
    const slug = formData.slug || formData.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    try {
      if (editingPage) {
        await updatePage(editingPage.id!, { ...formData, slug });
        alert('Página actualizada correctamente');
      } else {
        await addPage({ ...formData, slug } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>);
        alert('Página creada correctamente');
      }
      
      resetForm();
      onSave?.();
    } catch (error) {
      alert('Error al guardar página');
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData(page);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta página?')) {
      await deletePage(id);
      alert('Página eliminada correctamente');
      onSave?.();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      published: false
    });
    setEditingPage(null);
    setShowForm(false);
  };

  const createPredefinedPage = (predefined: typeof predefinedPages[0]) => {
    setFormData({
      title: predefined.title,
      slug: predefined.slug,
      content: getDefaultContent(predefined.slug),
      published: false
    });
    setShowForm(true);
  };

  const getDefaultContent = (slug: string): string => {
    switch (slug) {
      case 'devoluciones':
        return `# Política de Devoluciones

## Condiciones Generales

En Aluna Cosméticos, queremos que estés completamente satisfecho con tu compra. Si por alguna razón no estás conforme con tu pedido, aceptamos devoluciones bajo las siguientes condiciones:

### Plazo para Devoluciones
- Tienes 30 días calendario desde la fecha de recepción del producto para solicitar una devolución.

### Condiciones del Producto
- El producto debe estar sin usar, en su empaque original y con todas las etiquetas.
- Los productos de higiene personal no pueden ser devueltos una vez abiertos por razones de salud.

### Proceso de Devolución
1. Contacta nuestro servicio al cliente
2. Proporciona el número de pedido y motivo de devolución
3. Empaca el producto de forma segura
4. Envía el producto a nuestra dirección

### Reembolsos
Los reembolsos se procesarán dentro de 5-10 días hábiles una vez recibido y verificado el producto.`;

      case 'carreras':
        return `# Únete a Nuestro Equipo

## Trabajar en Aluna Cosméticos

En Aluna, creemos que nuestro equipo es nuestro mayor activo. Buscamos personas apasionadas por la belleza natural y comprometidas con la excelencia.

### Oportunidades Actuales

#### Especialista en Atención al Cliente
- Experiencia en servicio al cliente
- Conocimientos en cosmética natural
- Disponibilidad horaria flexible

#### Desarrollador de Productos
- Formación en química o cosmética
- Experiencia en formulación de productos naturales
- Pasión por la innovación

### Beneficios
- Ambiente de trabajo colaborativo
- Oportunidades de crecimiento profesional
- Descuentos en productos
- Capacitación continua

### Cómo Aplicar
Envía tu CV y carta de presentación a carreras@aluna.com`;

      case 'sostenibilidad':
        return `# Nuestro Compromiso con la Sostenibilidad

## Belleza Responsable

En Aluna Cosméticos, la sostenibilidad no es solo una tendencia, es parte fundamental de nuestra filosofía empresarial.

### Ingredientes Sostenibles
- Sourcing responsable de materias primas
- Apoyo a comunidades locales
- Certificaciones orgánicas y naturales

### Packaging Eco-Friendly
- Envases reciclables y biodegradables
- Reducción de plásticos de un solo uso
- Programas de retorno de envases

### Impacto Social
- Comercio justo con proveedores
- Programas de educación ambiental
- Donaciones a organizaciones ambientales

### Certificaciones
- Cruelty Free International
- COSMOS Natural
- Fair Trade Certified

### Nuestras Metas 2025
- 100% packaging reciclable
- Neutralidad de carbono
- 50% ingredientes de origen local`;

      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar páginas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Página</span>
        </button>
      </div>

      {/* Páginas Predefinidas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-3">Páginas Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {predefinedPages.map((predefined) => {
            const exists = pages.find(p => p.slug === predefined.slug);
            return (
              <button
                key={predefined.slug}
                onClick={() => exists ? handleEdit(exists) : createPredefinedPage(predefined)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  exists 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                <div className="font-medium">{predefined.title}</div>
                <div className="text-xs opacity-75">
                  /{predefined.slug} {exists ? '(Creada)' : '(Crear)'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Páginas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Página
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {page.content.substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    /{page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {page.published ? (
                        <>
                          <Eye className="w-4 h-4 text-green-500 mr-2" />
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Publicada
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Borrador
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.updatedAt?.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay páginas</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'No se encontraron páginas con el término de búsqueda'
                : 'Comienza creando tu primera página'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Crear Página
            </button>
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingPage ? 'Editar Página' : 'Nueva Página'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Página *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .trim();
                      setFormData(prev => ({ ...prev, title, slug }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL (Slug) *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-1">/</span>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido de la Página *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                  placeholder="Puedes usar Markdown para formatear el contenido..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Usa Markdown para formatear el texto (# para títulos, ** para negrita, etc.)
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Publicar página</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPage ? 'Actualizar' : 'Crear'} Página</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManager;