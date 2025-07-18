import React, { useState } from 'react';
import { 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar
} from 'lucide-react';
import { useStore, Order } from '../../store/cmsStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderManagerProps {
  searchTerm: string;
}

const OrderManager: React.FC<OrderManagerProps> = ({ searchTerm }) => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || order.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(price);
  };

  if (selectedOrder) {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Pedido #{selectedOrder.id}</h2>
              <p className="text-gray-600">
                {format(new Date(selectedOrder.createdAt), 'dd MMMM yyyy, HH:mm', { locale: es })}
              </p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(selectedOrder.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                {getStatusText(selectedOrder.status)}
              </span>
            </div>
            
            <select
              value={selectedOrder.status}
              onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Información del Cliente</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <span>{selectedOrder.customerInfo.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{selectedOrder.customerInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{selectedOrder.customerInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{selectedOrder.customerInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Método de Pago</span>
            </h3>
            <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <p className="text-sm text-gray-600">
                        {Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-pink-500">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">Todos los pedidos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="shipped">Enviados</option>
          <option value="delivered">Entregados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmados</p>
              <p className="text-xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Entregados</p>
              <p className="text-xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-xl font-bold">{orders.filter(o => o.status === 'cancelled').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items.length} productos</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-pink-600 hover:text-pink-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron pedidos
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los pedidos aparecerán aquí cuando los clientes realicen compras'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManager;