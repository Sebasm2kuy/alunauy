import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Settings, 
  Package, 
  FileText, 
  Image, 
  Palette, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Download,
  Upload,
  Save,
  Eye,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useCMSStore } from '../../store/cmsStore';
import ProductManager from './ProductManager';
import BlogManager from './BlogManager';
import PageEditor from './PageEditor';
import SiteSettings from './SiteSettings';
import OrderManager from './OrderManager';
import MediaLibrary from './MediaLibrary';
import ThemeCustomizer from './ThemeCustomizer';
import Analytics from './Analytics';

interface CMSEditorProps {
  onClose: () => void;
}

const CMSEditor: React.FC<CMSEditorProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const { exportData, importData, products, blogPosts, orders } = useCMSStore();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Productos', icon: Package },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'pages', name: 'Páginas', icon: Image },
    { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
    { id: 'media', name: 'Medios', icon: Image },
    { id: 'theme', name: 'Tema', icon: Palette },
    { id: 'settings', name: 'Configuración', icon: Settings },
  ];

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aluna-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        importData(data);
        alert('Datos importados correctamente');
      };
      reader.readAsText(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics />;
      case 'products':
        return <ProductManager searchTerm={searchTerm} />;
      case 'blog':
        return <BlogManager searchTerm={searchTerm} />;
      case 'pages':
        return <PageEditor />;
      case 'orders':
        return <OrderManager searchTerm={searchTerm} />;
      case 'media':
        return <MediaLibrary />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'settings':
        return <SiteSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 bg-gray-100 z-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">CMS Admin</h1>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
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
            </div>
          </nav>

          <div className="p-4 border-t space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <label className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {tabs.find(t => t.id === activeTab)?.name}
                </h2>
                {(activeTab === 'products' || activeTab === 'blog' || activeTab === 'orders') && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {activeTab === 'products' && `${products.length} productos`}
                  {activeTab === 'blog' && `${blogPosts.length} artículos`}
                  {activeTab === 'orders' && `${orders.length} pedidos`}
                </div>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CMSEditor;