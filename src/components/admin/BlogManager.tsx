import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Clock,
  Tag,
  Star,
  Copy
} from 'lucide-react';
import { useStore, BlogPost } from '../../store/cmsStore';
import BlogEditor from './BlogEditor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BlogManagerProps {
  searchTerm: string;
}

interface DragItem {
  id: string;
  index: number;
}

const BlogCard: React.FC<{
  post: BlogPost;
  index: number;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: BlogPost) => void;
  onTogglePublished: (id: string) => void;
  movePost: (dragIndex: number, hoverIndex: number) => void;
}> = ({ post, index, onEdit, onDelete, onDuplicate, onTogglePublished, movePost }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'blogpost',
    item: { id: post.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'blogpost',
    hover: (item: DragItem) => {
      if (item.index !== index) {
        movePost(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } ${!post.published ? 'opacity-60' : ''}`}
    >
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
          {post.featured && (
            <span className="bg-yellow-500 text-white p-1 rounded-full">
              <Star className="w-3 h-3" />
            </span>
          )}
          <button
            onClick={() => onTogglePublished(post.id)}
            className={`p-1 rounded-full ${
              post.published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{post.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.date), 'dd MMM yyyy', { locale: es })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(post)}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDuplicate(post)}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogManager: React.FC<BlogManagerProps> = ({ searchTerm }) => {
  const { 
    blogPosts, 
    addBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    reorderBlogPosts 
  } = useStore();
  
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  const filteredPosts = blogPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'published' && post.published) ||
                           (filter === 'draft' && !post.published) ||
                           (filter === 'featured' && post.featured);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'author':
          return a.author.localeCompare(b.author);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.order - b.order;
      }
    });

  const handleCreatePost = () => {
    setIsCreating(true);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      deleteBlogPost(id);
    }
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const duplicated = {
      ...post,
      title: `${post.title} (Copia)`,
      published: false,
      order: blogPosts.length
    };
    delete (duplicated as any).id;
    delete (duplicated as any).createdAt;
    delete (duplicated as any).updatedAt;
    addBlogPost(duplicated);
  };

  const handleTogglePublished = (id: string) => {
    const post = blogPosts.find(p => p.id === id);
    if (post) {
      updateBlogPost(id, { published: !post.published });
    }
  };

  const movePost = (dragIndex: number, hoverIndex: number) => {
    const draggedPost = filteredPosts[dragIndex];
    const newPosts = [...filteredPosts];
    newPosts.splice(dragIndex, 1);
    newPosts.splice(hoverIndex, 0, draggedPost);
    
    const reorderedIds = newPosts.map(p => p.id);
    reorderBlogPosts(reorderedIds);
  };

  const handleSavePost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPost) {
      updateBlogPost(editingPost.id, postData);
    } else {
      addBlogPost(postData);
    }
    setEditingPost(null);
    setIsCreating(false);
  };

  if (isCreating || editingPost) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setEditingPost(null);
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
            <option value="all">Todos los artículos</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="featured">Destacados</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="order">Orden personalizado</option>
            <option value="title">Título</option>
            <option value="date">Fecha de publicación</option>
            <option value="author">Autor</option>
            <option value="created">Fecha de creación</option>
          </select>
        </div>

        <button
          onClick={handleCreatePost}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Artículos</p>
              <p className="text-xl font-bold">{blogPosts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Publicados</p>
              <p className="text-xl font-bold">{blogPosts.filter(p => p.published).length}</p>
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
              <p className="text-xl font-bold">{blogPosts.filter(p => p.featured).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Borradores</p>
              <p className="text-xl font-bold">{blogPosts.filter(p => !p.published).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <BlogCard
            key={post.id}
            post={post}
            index={index}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onDuplicate={handleDuplicatePost}
            onTogglePublished={handleTogglePublished}
            movePost={movePost}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron artículos
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer artículo'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreatePost}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Crear Primer Artículo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogManager;