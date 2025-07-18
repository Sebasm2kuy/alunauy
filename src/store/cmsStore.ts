import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  price: number;
  originalPrice?: number;
  priceUSD?: number;
  originalPriceUSD?: number;
  images: string[];
  rating: number;
  reviews: number;
  badge?: string;
  stock: number;
  variants?: Array<{
    id: string;
    name: string;
    options: string[];
    price?: number;
  }>;
  customFields?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
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
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  type: 'text' | 'image' | 'html' | 'slider' | 'block';
  content: unknown;
  order: number;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    whatsapp: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };
  paymentMethods: {
    creditCard: boolean;
    mercadoPago: boolean;
    bankTransfer: boolean;
    abitab: boolean;
    bankDetails?: string;
    abitabInstructions?: string;
  };
  shipping: {
    freeShippingThreshold: number;
    shippingCost: number;
    deliveryTime: string;
  };
  currency: {
    primary: 'UYU' | 'USD';
    showBoth: boolean;
    exchangeRate: number;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variants?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CMSState {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (productIds: string[]) => void;

  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  reorderBlogPosts: (postIds: string[]) => void;

  // Page Content
  pageContent: PageContent[];
  updatePageContent: (id: string, content: unknown) => void;
  addPageContent: (content: Omit<PageContent, 'id'>) => void;
  deletePageContent: (id: string) => void;
  reorderPageContent: (page: string, section: string, contentIds: string[]) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;

  // Cart & Orders
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  createOrder: (customerInfo: Order['customerInfo'], paymentMethod: string) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  // Utility
  exportData: () => string;
  importData: (data: string) => void;
  resetToDefaults: () => void;
}

const defaultSiteSettings: SiteSettings = {
  siteName: 'Aluna Cosméticos',
  siteDescription: 'Belleza natural y sostenible para realzar tu esencia única',
  logo: '/logo.png',
  favicon: '/favicon.svg',
  primaryColor: '#ec4899',
  secondaryColor: '#a855f7',
  accentColor: '#f97316',
  fontFamily: 'Inter',
  contactEmail: 'aluna@alunauy.es',
  contactPhone: '+598 91 331 476',
  contactAddress: 'Montevideo, Uruguay',
  socialMedia: {
    instagram: 'https://www.instagram.com/aluna.auy',
    facebook: '',
    twitter: '',
    whatsapp: '+59891331476'
  },
  seo: {
    defaultTitle: 'Aluna Cosméticos - Belleza Natural y Sostenible',
    defaultDescription: 'Descubre productos de belleza naturales y sostenibles. Cuidado facial, corporal y maquillaje de alta calidad.',
    ogImage: '/logo.png'
  },
  paymentMethods: {
    creditCard: true,
    mercadoPago: true,
    bankTransfer: true,
    abitab: true,
    bankDetails: 'Banco República - Cuenta: 123456789',
    abitabInstructions: 'Presentar código de pago en cualquier sucursal Abitab'
  },
  shipping: {
    freeShippingThreshold: 2000,
    shippingCost: 200,
    deliveryTime: '3-5 días hábiles'
  },
  currency: {
    primary: 'UYU',
    showBoth: true,
    exchangeRate: 40
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      blogPosts: [],
      pageContent: [],
      siteSettings: defaultSiteSettings,
      cart: [],
      orders: [],
      wishlist: [],

      // Products
      addProduct: (product) => set((state) => ({
        products: [...state.products, {
          ...product,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      reorderProducts: (productIds) => set((state) => ({
        products: productIds.map((id, index) => {
          const product = state.products.find(p => p.id === id);
          return product ? { ...product, order: index } : null;
        }).filter(Boolean) as Product[]
      })),

      // Blog
      addBlogPost: (post) => set((state) => ({
        blogPosts: [...state.blogPosts, {
          ...post,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),

      updateBlogPost: (id, updates) => set((state) => ({
        blogPosts: state.blogPosts.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),

      deleteBlogPost: (id) => set((state) => ({
        blogPosts: state.blogPosts.filter(p => p.id !== id)
      })),

      reorderBlogPosts: (postIds) => set((state) => ({
        blogPosts: postIds.map((id, index) => {
          const post = state.blogPosts.find(p => p.id === id);
          return post ? { ...post, order: index } : null;
        }).filter(Boolean) as BlogPost[]
      })),

      // Page Content
      updatePageContent: (id, content) => set((state) => ({
        pageContent: state.pageContent.map(c => 
          c.id === id ? { ...c, content } : c
        )
      })),

      addPageContent: (content) => set((state) => ({
        pageContent: [...state.pageContent, { ...content, id: generateId() }]
      })),

      deletePageContent: (id) => set((state) => ({
        pageContent: state.pageContent.filter(c => c.id !== id)
      })),

      reorderPageContent: (page, section, contentIds) => set((state) => ({
        pageContent: state.pageContent.map(c => {
          if (c.page === page && c.section === section) {
            const index = contentIds.indexOf(c.id);
            return index !== -1 ? { ...c, order: index } : c;
          }
          return c;
        })
      })),

      // Site Settings
      updateSiteSettings: (updates) => set((state) => ({
        siteSettings: { ...state.siteSettings, ...updates }
      })),

      // Cart & Orders
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(i => 
          i.productId === item.productId && 
          JSON.stringify(i.variants) === JSON.stringify(item.variants)
        );
        
        if (existingItem) {
          return {
            cart: state.cart.map(i => 
              i.id === existingItem.id 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          };
        }
        
        return {
          cart: [...state.cart, { ...item, id: generateId() }]
        };
      }),

      updateCartItem: (id, quantity) => set((state) => ({
        cart: quantity > 0 
          ? state.cart.map(i => i.id === id ? { ...i, quantity } : i)
          : state.cart.filter(i => i.id !== id)
      })),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(i => i.id !== id)
      })),

      clearCart: () => set({ cart: [] }),

      createOrder: (customerInfo, paymentMethod) => {
        const state = get();
        const orderId = generateId();
        const order: Order = {
          id: orderId,
          items: [...state.cart],
          total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          customerInfo,
          paymentMethod,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          orders: [...state.orders, order],
          cart: []
        }));
        
        return orderId;
      },

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => 
          o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
        )
      })),

      // Wishlist
      addToWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId) 
          ? state.wishlist 
          : [...state.wishlist, productId]
      })),

      removeFromWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.filter(id => id !== productId)
      })),

      // Utility
      exportData: () => {
        const state = get();
        return JSON.stringify({
          products: state.products,
          blogPosts: state.blogPosts,
          pageContent: state.pageContent,
          siteSettings: state.siteSettings,
          orders: state.orders
        }, null, 2);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            products: parsed.products ?? state.products,
            blogPosts: parsed.blogPosts ?? state.blogPosts,
            pageContent: parsed.pageContent ?? state.pageContent,
            siteSettings: parsed.siteSettings ?? state.siteSettings,
            orders: parsed.orders ?? state.orders,
          }));
        } catch (error) {
          console.error('Error importing data:', error);
        }
      },

      resetToDefaults: () => set({
        products: [],
        blogPosts: [],
        pageContent: [],
        siteSettings: defaultSiteSettings,
        cart: [],
        orders: [],
        wishlist: []
      })
    }),
    {
      name: 'aluna-cms-store',
      version: 1,
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined,
    }
  )
);
