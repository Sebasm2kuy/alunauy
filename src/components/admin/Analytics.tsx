import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useCMSStore } from '../../store/cmsStore';

const Analytics: React.FC = () => {
  const { products, blogPosts, orders, cart } = useCMSStore();

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;

  const totalBlogPosts = blogPosts.length;
  const publishedPosts = blogPosts.filter(p => p.published).length;
  const featuredPosts = blogPosts.filter(p => p.featured).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const cartItems = cart.length;
  const cartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Mock data for trends (in a real app, this would come from analytics)
  const trends = {
    products: { value: 12, isPositive: true },
    orders: { value: 8, isPositive: true },
    revenue: { value: 15, isPositive: true },
    visitors: { value: -3, isPositive: false }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(trend.value)}% vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido al Panel de Control!</h1>
        <p className="text-white/90">
          Aquí tienes un resumen de tu tienda. Gestiona productos, pedidos y contenido desde un solo lugar.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Productos Totales"
          value={totalProducts}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          trend={trends.products}
          color="bg-blue-100"
        />
        
        <StatCard
          title="Pedidos Totales"
          value={totalOrders}
          icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
          trend={trends.orders}
          color="bg-green-100"
        />
        
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          trend={trends.revenue}
          color="bg-yellow-100"
        />
        
        <StatCard
          title="Artículos del Blog"
          value={totalBlogPosts}
          icon={<Eye className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>Resumen de Productos</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Productos Activos</span>
              <span className="font-semibold">{activeProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Productos Destacados</span>
              <span className="font-semibold">{featuredProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Stock Bajo (≤5)</span>
              <span className={`font-semibold ${lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {lowStockProducts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Productos Inactivos</span>
              <span className="font-semibold">{totalProducts - activeProducts}</span>
            </div>
          </div>
        </div>

        {/* Orders Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span>Resumen de Pedidos</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pedidos Pendientes</span>
              <span className={`font-semibold ${pendingOrders > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                {pendingOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pedidos Completados</span>
              <span className="font-semibold text-green-600">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tasa de Conversión</span>
              <span className="font-semibold">
                {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ticket Promedio</span>
              <span className="font-semibold">
                {totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog & Content Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <span>Contenido del Blog</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Artículos Publicados</span>
              <span className="font-semibold text-green-600">{publishedPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Borradores</span>
              <span className="font-semibold text-yellow-600">{totalBlogPosts - publishedPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Artículos Destacados</span>
              <span className="font-semibold">{featuredPosts}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Carrito Actual</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Productos en Carrito</span>
              <span className="font-semibold">{cartItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Valor del Carrito</span>
              <span className="font-semibold text-green-600">{formatCurrency(cartValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estado</span>
              <span className={`font-semibold ${cartItems > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                {cartItems > 0 ? 'Con productos' : 'Vacío'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-left">
            <Package className="w-8 h-8 text-pink-500 mb-2" />
            <h4 className="font-medium mb-1">Nuevo Producto</h4>
            <p className="text-sm text-gray-600">Agregar producto al catálogo</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
            <Eye className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium mb-1">Nuevo Artículo</h4>
            <p className="text-sm text-gray-600">Escribir entrada del blog</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
            <ShoppingCart className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-medium mb-1">Ver Pedidos</h4>
            <p className="text-sm text-gray-600">Gestionar pedidos pendientes</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-medium mb-1">Configuración</h4>
            <p className="text-sm text-gray-600">Ajustar configuración del sitio</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span>Actividad Reciente</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Sistema iniciado correctamente</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 2 minutos</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">CMS listo para usar</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 5 minutos</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Base de datos inicializada</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 10 minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;