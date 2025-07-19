// Zustand Store corregido completamente

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para IDs únicos

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  originalPrice: number;
  priceUSD: number;
  originalPriceUSD: number;
  images: string[];
  rating: number;
  reviews: number;
  badge: string;
  stock: number;
  variants: { name: string; options: string[] }[];
  customFields?: Record<string, any>;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PageContent {
  id: string;
  page: string;
  section: string;
  type: 'text' | 'image' | 'block';
  content: any; // Puede ser string para texto, objeto para imagen/bloque
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
  socialLinks: Record<string, string>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    schedule: string;
  };
  paymentMethods: {
    creditCard: boolean;
    mercadoPago: boolean;
    bankTransfer: boolean;
    cash: boolean;
  };
  shippingOptions: {
    montevideo: number;
    interior: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variants?: Record<string, string>;
}

interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  products: Product[];
  blogPosts: BlogPost[];
  pageContent: PageContent[]; // Cambiado a array para múltiples bloques
  siteSettings: SiteSettings;
  orders: Order[];
  cart: CartItem[];

  // Acciones para productos
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (startIndex: number, endIndex: number) => void;

  // Acciones para blog posts
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  reorderBlogPosts: (startIndex: number, endIndex: number) => void;

  // Acciones para contenido de páginas
  addPageContent: (content: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePageContent: (id: string, updated: Partial<PageContent>) => void;
  deletePageContent: (id: string) => void;
  reorderPageContent: (startIndex: number, endIndex: number) => void;

  // Acciones para configuración del sitio
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Acciones para pedidos
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Acciones para carrito
  addToCart: (product: Product, quantity: number, variants?: Record<string, string>) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Acciones de importación/exportación
  importData: (data: string) => void;
  exportData: () => string;
}

export const useCMSStore = create<StoreState>()( // Esta es la línea de exportación
  persist(
    (set, get) => ({
      // Estado inicial
      products: [
        // Productos de ejemplo para empezar
        {
          id: uuidv4(),
          name: 'Pack Shampoo + Crema Karseell',
          description: 'Pack completo para el cuidado capilar con shampoo y crema de la marca Karseell. Ideal para nutrición y reparación profunda.',
          shortDescription: 'Nutrición y reparación capilar.',
          category: 'serums',
          price: 1290,
          originalPrice: 1500,
          priceUSD: 32.25,
          originalPriceUSD: 37.50,
          images: ['/PackshampooycremaKarseell1290.jpg', 'https://placehold.co/600x400/FFC0CB/FFFFFF?text=Imagen+2'],
          rating: 4.8,
          reviews: 120,
          badge: 'Oferta',
          stock: 50,
          variants: [{ name: 'Tamaño', options: ['250ml', '500ml'] }],
          customFields: { 'Tipo de Cabello': 'Seco y Dañado', 'Ingredientes Clave': 'Colágeno, Aceite de Argán' },
          seoTitle: 'Pack Karseell Shampoo y Crema - Aluna',
          seoDescription: 'Compra el pack de shampoo y crema Karseell para cabello seco y dañado. Nutrición profunda y reparación.',
          featured: true,
          active: true,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: 'Mascarilla Karseell',
          description: 'Mascarilla capilar intensiva de Karseell para una hidratación profunda y brillo. Formulada con ingredientes naturales.',
          shortDescription: 'Hidratación profunda y brillo.',
          category: 'cremas',
          price: 1190,
          originalPrice: 1300,
          priceUSD: 29.75,
          originalPriceUSD: 32.50,
          images: ['/MascarillaKarseell1190.jpg', 'https://placehold.co/600x400/DDA0DD/FFFFFF?text=Imagen+2'],
          rating: 4.9,
          reviews: 95,
          badge: 'Nuevo',
          stock: 30,
          variants: [],
          customFields: { 'Frecuencia de Uso': '2-3 veces por semana', 'Beneficios': 'Suavidad, Anti-frizz' },
          seoTitle: 'Mascarilla Karseell - Hidratación Intensa',
          seoDescription: 'Mascarilla capilar Karseell para hidratación profunda. Cabello suave y brillante.',
          featured: false,
          active: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: 'Serum Facial Vitamina C',
          description: 'Serum de Vitamina C para iluminar la piel y reducir manchas. Antioxidante potente para una piel radiante.',
          shortDescription: 'Ilumina y protege tu piel.',
          category: 'serums',
          price: 850,
          originalPrice: 0,
          priceUSD: 21.25,
          originalPriceUSD: 0,
          images: ['https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://placehold.co/600x400/9370DB/FFFFFF?text=Imagen+2'],
          rating: 4.7,
          reviews: 70,
          badge: '',
          stock: 40,
          variants: [],
          customFields: { 'Tipo de Piel': 'Todo tipo', 'Aplicación': 'Mañana y Noche' },
          seoTitle: 'Serum Vitamina C - Piel Radiante',
          seoDescription: 'Serum facial con Vitamina C para una piel más luminosa y uniforme. Antioxidante.',
          featured: true,
          active: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      blogPosts: [
        {
          id: uuidv4(),
          title: "Los Beneficios del Ácido Hialurónico en tu Rutina de Belleza",
          excerpt: "Descubre por qué este ingrediente se ha convertido en el favorito de los expertos en cuidado de la piel y cómo incorporarlo correctamente en tu rutina diaria.",
          content: "<p>El ácido hialurónico es una molécula que se encuentra de forma natural en nuestra piel...</p>",
          image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600",
          author: "Dra. María González",
          date: "2025-01-15",
          readTime: "5 min",
          category: "Cuidado Facial",
          tags: ["ácido hialurónico", "hidratación", "skincare"],
          seoTitle: "Ácido Hialurónico: Beneficios y Uso en Skincare",
          seoDescription: "Guía completa sobre los beneficios del ácido hialurónico para la piel y cómo integrarlo en tu rutina de belleza.",
          published: true,
          featured: true,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: "Rutina de Cuidado Nocturno: Pasos Esenciales",
          excerpt: "Una guía completa sobre cómo crear la rutina nocturna perfecta para regenerar tu piel mientras duermes y despertar con un rostro radiante.",
          content: "<p>La noche es el momento ideal para que tu piel se repare y regenere...</p>",
          image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
          author: "Ana Martínez",
          date: "2025-01-12",
          readTime: "7 min",
          category: "Rutinas",
          tags: ["rutina nocturna", "skincare", "belleza"],
          seoTitle: "Rutina Nocturna de Skincare: Guía Completa",
          seoDescription: "Descubre los pasos esenciales para una rutina de cuidado nocturno que transformará tu piel.",
          published: true,
          featured: false,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      pageContent: [
        {
          id: uuidv4(),
          page: 'home',
          section: 'hero',
          type: 'text',
          content: { tag: 'h1', text: 'Bienvenidos a Aluna' },
          active: true,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          page: 'home',
          section: 'hero',
          type: 'text',
          content: { tag: 'p', text: 'Tu tienda de belleza profesional' },
          active: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          page: 'about',
          section: 'intro',
          type: 'text',
          content: { tag: 'h2', text: 'Nuestra Historia' },
          active: true,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          page: 'about',
          section: 'intro',
          type: 'text',
          content: { tag: 'p', text: 'Aluna nació de la pasión por la belleza natural y el compromiso con la sostenibilidad. Creemos en productos que cuidan tu piel y el planeta.' },
          active: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      siteSettings: {
        primaryColor: '#EC4899', // pink-500
        secondaryColor: '#A855F7', // purple-500
        accentColor: '#F472B6', // pink-400
        fontFamily: 'Inter, sans-serif',
        logoUrl: '/logo.png',
        socialLinks: {
          instagram: 'https://www.instagram.com/aluna.auy',
          facebook: 'https://www.facebook.com/aluna.uy',
          twitter: 'https://www.twitter.com/aluna.uy',
        },
        contactInfo: {
          email: 'contacto@alunauy.es',
          phone: '+598 91 234 567',
          address: 'Calle Ficticia 1234, Montevideo, Uruguay',
          schedule: 'Lunes a Viernes: 9:00 - 18:00',
        },
        paymentMethods: {
          creditCard: true,
          mercadoPago: true,
          bankTransfer: true,
          cash: true,
        },
        shippingOptions: {
          montevideo: 150,
          interior: 250,
        },
        seo: {
          metaTitle: 'Aluna - Belleza Natural y Sostenible',
          metaDescription: 'Descubre productos de belleza natural y sostenible para el cuidado capilar y personal. Calidad premium en Uruguay.',
          ogImage: 'https://placehold.co/1200x630/EC4899/FFFFFF?text=Aluna+UY',
        },
      },
      orders: [],
      cart: [],

      // Implementación de acciones de productos
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      })),
      updateProduct: (id, updated) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
        ),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),
      reorderProducts: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.products);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { products: result };
      }),

      // Implementación de acciones de blog posts
      addBlogPost: (post) => set((state) => ({
        blogPosts: [...state.blogPosts, { ...post, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      })),
      updateBlogPost: (id, updated) => set((state) => ({
        blogPosts: state.blogPosts.map((p) =>
          p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
        ),
      })),
      deleteBlogPost: (id) => set((state) => ({
        blogPosts: state.blogPosts.filter((p) => p.id !== id),
      })),
      reorderBlogPosts: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.blogPosts);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { blogPosts: result };
      }),

      // Implementación de acciones de contenido de páginas
      addPageContent: (content) => set((state) => ({
        pageContent: [...state.pageContent, { ...content, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      })),
      updatePageContent: (id, updated) => set((state) => ({
        pageContent: state.pageContent.map((pc) =>
          pc.id === id ? { ...pc, ...updated, updatedAt: new Date().toISOString() } : pc
        ),
      })),
      deletePageContent: (id) => set((state) => ({
        pageContent: state.pageContent.filter((pc) => pc.id !== id),
      })),
      reorderPageContent: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.pageContent);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { pageContent: result };
      }),

      // Implementación de acciones de configuración del sitio
      updateSiteSettings: (settings) => set((state) => ({
        siteSettings: {
          ...state.siteSettings,
          ...settings,
        },
      })),

      // Implementación de acciones de pedidos
      addOrder: (order) => set((state) => ({
        orders: [...state.orders, { ...order, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)),
      })),

      // Implementación de acciones de carrito
      addToCart: (product, quantity = 1, variants = {}) => set((state) => {
        const existingItem = state.cart.find(
          (item) => item.id === product.id &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id &&
                JSON.stringify(item.variants) === JSON.stringify(variants)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        } else {
          return {
            cart: [...state.cart, { id: product.id, name: product.name, price: product.price, quantity, image: product.images[0], variants }],
          };
        }
      }),
      updateCartItem: (id, quantity) => set((state) => ({
        cart: state.cart
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),
      clearCart: () => set({ cart: [] }),

      // Importación/Exportación de datos
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            products: parsed.products ?? state.products,
            blogPosts: parsed.blogPosts ?? state.blogPosts,
            pageContent: parsed.pageContent ?? state.pageContent,
            siteSettings: parsed.siteSettings ?? state.siteSettings,
            orders: parsed.orders ?? state.orders,
            cart: parsed.cart ?? state.cart, // Asegúrate de importar el carrito también
          }));
        } catch (error) {
          console.error('Error importing data:', error);
        }
      },
      exportData: () => {
        const state = get();
        return JSON.stringify({
          products: state.products,
          blogPosts: state.blogPosts,
          pageContent: state.pageContent,
          siteSettings: state.siteSettings,
          orders: state.orders,
          cart: state.cart,
        });
      },
    }),
    {
      name: 'aluna-cms-store',
      version: 1,
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined, // Usar localStorage solo en el navegador
    }
  )
);
