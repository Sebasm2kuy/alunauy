import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move,
  Eye,
  EyeOff,
  Type,
  Image as ImageIcon,
  Code,
  Layout,
  Star,
  MessageSquare,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { useStore, PageContent } from '../../store/cmsStore';
import ContentBlockEditor from './ContentBlockEditor';

interface DragItem {
  id: string;
  index: number;
}

const ContentBlock: React.FC<{
  content: PageContent;
  index: number;
  onEdit: (content: PageContent) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}> = ({ content, index, onEdit, onDelete, onToggleActive, moveBlock }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'content-block',
    item: { id: content.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'content-block',
    hover: (item: DragItem) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  const getIcon = () => {
    switch (content.type) {
      case 'text': return <Type className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'html': return <Code className="w-5 h-5" />;
      case 'slider': return <Layout className="w-5 h-5" />;
      default: return <Layout className="w-5 h-5" />;
    }
  };

  const getPreview = () => {
    switch (content.type) {
      case 'text':
        return content.content?.text?.substring(0, 100) + '...' || 'Texto vacío';
      case 'image':
        return content.content?.alt || content.content?.src || 'Imagen sin configurar';
      case 'html':
        return 'Contenido HTML personalizado';
      case 'slider':
        return `Slider con ${content.content?.slides?.length || 0} slides`;
      case 'block':
        return content.content?.title || 'Bloque personalizado';
      default:
        return 'Contenido';
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white border rounded-lg p-4 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${!content.active ? 'opacity-60' : ''} hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="text-gray-500">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </h4>
            <p className="text-sm text-gray-500">
              {content.page} / {content.section}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleActive(content.id)}
            className={`p-1 rounded ${
              content.active ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {content.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(content)}
            className="text-blue-600 hover:text-blue-700 p-1"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(content.id)}
            className="text-red-600 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2">
        {getPreview()}
      </p>
    </div>
  );
};

const PageEditor: React.FC = () => {
  const { pageContent, updatePageContent, addPageContent, deletePageContent, reorderPageContent } = useStore();
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedSection, setSelectedSection] = useState('hero');
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const pages = [
    { id: 'home', name: 'Página Principal' },
    { id: 'about', name: 'Sobre Nosotros' },
    { id: 'contact', name: 'Contacto' },
    { id: 'blog', name: 'Blog' },
    { id: 'products', name: 'Productos' }
  ];

  const sections = {
    home: [
      { id: 'hero', name: 'Hero/Banner Principal' },
      { id: 'features', name: 'Características' },
      { id: 'products', name: 'Productos Destacados' },
      { id: 'about', name: 'Sobre Nosotros' },
      { id: 'testimonials', name: 'Testimonios' },
      { id: 'newsletter', name: 'Newsletter' }
    ],
    about: [
      { id: 'hero', name: 'Hero' },
      { id: 'story', name: 'Nuestra Historia' },
      { id: 'mission', name: 'Misión y Visión' },
      { id: 'values', name: 'Valores' },
      { id: 'team', name: 'Equipo' },
      { id: 'certifications', name: 'Certificaciones' }
    ],
    contact: [
      { id: 'hero', name: 'Hero' },
      { id: 'form', name: 'Formulario' },
      { id: 'info', name: 'Información de Contacto' },
      { id: 'faq', name: 'Preguntas Frecuentes' }
    ],
    blog: [
      { id: 'hero', name: 'Hero' },
      { id: 'featured', name: 'Artículo Destacado' },
      { id: 'posts', name: 'Lista de Artículos' },
      { id: 'newsletter', name: 'Newsletter' }
    ],
    products: [
      { id: 'hero', name: 'Hero' },
      { id: 'filters', name: 'Filtros' },
      { id: 'gallery', name: 'Galería de Productos' },
      { id: 'categories', name: 'Categorías' }
    ]
  };

  const contentTypes = [
    { id: 'text', name: 'Texto', icon: Type, description: 'Párrafos, títulos y texto enriquecido' },
    { id: 'image', name: 'Imagen', icon: ImageIcon, description: 'Imágenes individuales con texto alternativo' },
    { id: 'slider', name: 'Slider', icon: Layout, description: 'Carrusel de imágenes o contenido' },
    { id: 'html', name: 'HTML', icon: Code, description: 'Código HTML personalizado' },
    { id: 'block', name: 'Bloque', icon: Star, description: 'Bloques predefinidos (testimonios, FAQs, etc.)' }
  ];

  const filteredContent = pageContent
    .filter(c => c.page === selectedPage && c.section === selectedSection)
    .sort((a, b) => a.order - b.order);

  const handleCreateContent = (type: string) => {
    const newContent: Omit<PageContent, 'id'> = {
      page: selectedPage,
      section: selectedSection,
      type: type as PageContent['type'],
      content: getDefaultContent(type),
      order: filteredContent.length,
      active: true
    };
    
    addPageContent(newContent);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: '', tag: 'p', className: '' };
      case 'image':
        return { src: '', alt: '', className: '' };
      case 'slider':
        return { slides: [], autoplay: true, interval: 5000 };
      case 'html':
        return { html: '' };
      case 'block':
        return { type: 'testimonial', title: '', items: [] };
      default:
        return {};
    }
  };

  const handleEditContent = (content: PageContent) => {
    setEditingContent(content);
    setIsCreating(false);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      deletePageContent(id);
    }
  };

  const handleToggleActive = (id: string) => {
    const content = pageContent.find(c => c.id === id);
    if (content) {
      updatePageContent(id, { ...content.content, active: !content.active });
    }
  };

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const draggedContent = filteredContent[dragIndex];
    const newContent = [...filteredContent];
    newContent.splice(dragIndex, 1);
    newContent.splice(hoverIndex, 0, draggedContent);
    
    const reorderedIds = newContent.map(c => c.id);
    reorderPageContent(selectedPage, selectedSection, reorderedIds);
  };

  const handleSaveContent = (contentData: any) => {
    if (editingContent) {
      updatePageContent(editingContent.id, contentData);
    }
    setEditingContent(null);
    setIsCreating(false);
  };

  if (editingContent) {
    return (
      <ContentBlockEditor
        content={editingContent}
        onSave={handleSaveContent}
        onCancel={() => setEditingContent(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page and Section Selectors */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Página
            </label>
            <select
              value={selectedPage}
              onChange={(e) => {
                setSelectedPage(e.target.value);
                setSelectedSection(sections[e.target.value as keyof typeof sections][0].id);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sección
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {sections[selectedPage as keyof typeof sections]?.map(section => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Types */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Agregar Contenido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleCreateContent(type.id)}
                className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-pink-100 p-2 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <Icon className="w-5 h-5 text-pink-600" />
                  </div>
                  <h4 className="font-medium">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Contenido de {pages.find(p => p.id === selectedPage)?.name} / {sections[selectedPage as keyof typeof sections]?.find(s => s.id === selectedSection)?.name}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredContent.length} elementos
          </span>
        </div>

        {filteredContent.length > 0 ? (
          <div className="space-y-4">
            {filteredContent.map((content, index) => (
              <ContentBlock
                key={content.id}
                content={content}
                index={index}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onToggleActive={handleToggleActive}
                moveBlock={moveBlock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              No hay contenido en esta sección
            </h4>
            <p className="text-gray-500 mb-6">
              Comienza agregando algún tipo de contenido usando los botones de arriba
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCreateContent('block')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <MessageSquare className="w-8 h-8 text-pink-500 mb-2" />
            <h4 className="font-medium mb-1">Testimonios</h4>
            <p className="text-sm text-gray-600">Agregar sección de testimonios</p>
          </button>
          
          <button
            onClick={() => handleCreateContent('block')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Users className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium mb-1">Equipo</h4>
            <p className="text-sm text-gray-600">Mostrar miembros del equipo</p>
          </button>
          
          <button
            onClick={() => handleCreateContent('block')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Award className="w-8 h-8 text-yellow-500 mb-2" />
            <h4 className="font-medium mb-1">FAQs</h4>
            <p className="text-sm text-gray-600">Preguntas frecuentes</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;