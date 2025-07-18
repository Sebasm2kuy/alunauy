import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Package, 
  DollarSign,
  Image as ImageIcon,
  Tag,
  BarChart3,
  Copy,
  Archive
} from 'lucide-react';
import { useCMSStore, Product } from '../../store/cmsStore';
import ProductEditor from './ProductEditor';

interface ProductManagerProps {
  searchTerm: string;
}

interface DragItem {
  id: string;
  index: number;
}

const ProductCard: React.FC<{
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: Product) => void;
  onToggleActive: (id: string) => void;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
}> = ({ product, index, onEdit, onDelete, onDuplicate, onToggleActive, moveProduct }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'product',
    item: { id: product.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'product',
    hover: (item: DragItem) => {
      if (item.index !== index) {
        moveProduct(item.index, index);
        item.index = index;
      }
    },
  });

  const formatPrice = (price: number, currency = 'UYU') => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency === 'UYU' ? 'UYU' : 'USD',
    }).format(price);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } ${!product.active ? 'opacity-60' : ''}`}
    >
      <div className="relative">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </span>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          {product.featured && (
            <span className="bg-yellow-500 text-white p-1 rounded-full">
              <Star className="w-3 h-3" />
            </span>
          )}
          {product.stock <= 5 && (
            <span className="bg-red-500 text-white p-1 rounded-full">
              <Package className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <button
            onClick={() => onToggleActive(product.id)}
            className={`w-3 h-3 rounded-full ${
              product.active ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-pink-500">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDuplicate(product)}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductManager: React.FC<ProductManagerProps> = ({ searchTerm }) => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    reorderProducts 
  } = useCMSStore();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'active' && product.active) ||
                           (filter === 'inactive' && !product.active) ||
                           (filter === 'featured' && product.featured) ||
                           (filter === 'low-stock' && product.stock <= 5);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.order - b.order;
      }
    });

  const handleCreateProduct = () => {
    setIsCreating(true);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated = {
      ...product,
      name: `${product.name} (Copia)`,
      active: false,
      order: products.length
    };
    delete (duplicated as any).id;
    delete (duplicated as any).createdAt;
    delete (duplicated as any).updatedAt;
    addProduct(duplicated);
  };

  const handleToggleActive = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct(id, { active: !product.active });
    }
  };

  const moveProduct = (dragIndex: number, hoverIndex: number) => {
    const draggedProduct = filteredProducts[dragIndex];
    const newProducts = [...filteredProducts];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, draggedProduct);
    
    const reorderedIds = newProducts.map(p => p.id);
    reorderProducts(reorderedIds);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
    setIsCreating(false);
  };

  if (isCreating || editingProduct) {
    return (
      <ProductEditor
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setEditingProduct(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Todos los productos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="featured">Destacados</option>
            <option value="low-stock">Stock bajo</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="order">Orden personalizado</option>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="stock">Stock</option>
            <option value="created">Fecha de creación</option>
          </select>
        </div>

        <button
          onClick={handleCreateProduct}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-xl font-bold">{products.filter(p => p.active).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Destacados</p>
              <p className="text-xl font-bold">{products.filter(p => p.featured).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Archive className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-xl font-bold">{products.filter(p => p.stock <= 5).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onDuplicate={handleDuplicateProduct}
            onToggleActive={handleToggleActive}
            moveProduct={moveProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer producto'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateProduct}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Crear Primer Producto
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManager;