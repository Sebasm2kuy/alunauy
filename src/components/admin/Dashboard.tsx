import React from 'react';
import { 
  Package, 
  FileText, 
  Users, 
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  Settings as SettingsIcon
} from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  const { products, pages, adminUsers, loading } = useFirestore();

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Páginas Publicadas',
      value: pages.filter(p => p.published).length,
      icon: FileText,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Usuarios Admin',
      value: adminUsers.filter(u => u.active).length,
      icon: Users,
      color: 'bg-purple-500',
      change: '+2%'
    },
    {
      title: 'Productos Activos',
      value: products.filter(p => p.active).length,
      icon: Eye,
      color: 'bg-orange-500',
      change: '+8%'
    }
  ];

  const quickActions = [
    {
      title: 'Nuevo Producto',
      description: 'Agregar producto al catálogo',
      icon: Package,
      color: 'bg-pink-500',
      action: () => onSectionChange('products')
    },
    {
      title: 'Nuevo Artículo',
      description: 'Crear nueva página o artículo',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => onSectionChange('pages')
    },
    {
      title: 'Ver Pedidos',
      description: 'Gestionar pedidos pendientes',
      icon: ShoppingCart,
      color: 'bg-green-500',
      action: () => alert('Funcionalidad de pedidos próximamente')
    },
    {
      title: 'Configuración',
      description: 'Ajustar configuración del sitio',
      icon: SettingsIcon,
      color: 'bg-blue-500',
      action: () => onSectionChange('settings')
    }
  ];

  const recentProducts = products.slice(0, 5);
  const recentPages = pages.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h2>
        <p className="text-pink-100">
          Gestiona tu tienda de forma eficiente desde este panel de control centralizado.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group"
              >
                <div className={`${action.color} p-3 rounded-lg inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Productos Recientes</h3>
              <button
                onClick={() => onSectionChange('products')}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Ver todos
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${product.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay productos aún</p>
                <button
                  onClick={() => onSectionChange('products')}
                  className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Crear primer producto
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Páginas Recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Páginas Recientes</h3>
              <button
                onClick={() => onSectionChange('pages')}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Ver todas
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentPages.length > 0 ? (
              <div className="space-y-4">
                {recentPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {page.title}
                      </p>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        page.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.published ? 'Publicada' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay páginas aún</p>
                <button
                  onClick={() => onSectionChange('pages')}
                  className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  Crear primera página
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;