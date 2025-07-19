import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  badge?: string;
  originalPrice?: number;
  variants?: ProductVariant[];
  customFields?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
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

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  type: 'text' | 'image' | 'slider' | 'html' | 'block';
  content: any;
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
  currency: {
    primary: 'UYU' | 'USD';
    showBoth: boolean;
    exchangeRate: number;
  };
  shipping: {
    shippingCost: number;
    freeShippingThreshold: number;
    deliveryTime: string;
  };
  paymentMethods: {
    creditCard: boolean;
    mercadoPago: boolean;
    bankTransfer: boolean;
    abitab: boolean;
    bankDetails?: string;
    abitabInstructions?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  blogPosts: BlogPost[];
  pageContent: PageContent[];
  siteSettings: SiteSettings;
  orders: Order[];

  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (productIds: string[]) => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Blog actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  reorderBlogPosts: (postIds: string[]) => void;

  // Page content actions
  addPageContent: (content: Omit<PageContent, 'id'>) => void;
  updatePageContent: (id: string, updated: any) => void;
  deletePageContent: (id: string) => void;
  reorderPageContent: (page: string, section: string, contentIds: string[]) => void;
  
  // Site settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Order actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createOrder: (customer: Order['customerInfo'], paymentMethod: string) => string;
  updateOrderStatus: (id: string, status: string) => void;

  // Data management
  importData: (data: string) => void;
  exportData: () => string;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      blogPosts: [],
      pageContent: [],
      siteSettings: {
        siteName: 'Aluna Cosméticos',
        siteDescription: 'Belleza natural y sostenible para realzar tu esencia única',
        logo: '/logo.png',
        favicon: '/favicon.svg',
        primaryColor: '#ec4899',
        secondaryColor: '#a855f7',
        accentColor: '#f97316',
        fontFamily: 'Inter',
        contactEmail: 'contacto@aluna.com',
        contactPhone: '+598 XX XXX XXX',
        contactAddress: 'Av. Principal 123, Montevideo, Uruguay',
        socialMedia: {
          instagram: 'https://www.instagram.com/aluna.auy',
          facebook: '',
          twitter: '',
          whatsapp: '+598XXXXXXXXX',
        },
        currency: {
          primary: 'UYU',
          showBoth: false,
          exchangeRate: 40,
        },
        shipping: {
          shippingCost: 200,
          freeShippingThreshold: 2000,
          deliveryTime: '3-5 días hábiles',
        },
        paymentMethods: {
          creditCard: true,
          mercadoPago: true,
          bankTransfer: true,
          abitab: true,
          bankDetails: 'Banco: BROU - Cuenta: 123456789 - Titular: Aluna Cosméticos',
          abitabInstructions: 'Presenta este código en cualquier sucursal Abitab o RedPagos',
        },
        seo: {
          defaultTitle: 'Aluna Cosméticos - Belleza Natural y Sostenible',
          defaultDescription: 'Descubre productos de belleza naturales y sostenibles. Cuidado facial, corporal y maquillaje de alta calidad.',
          ogImage: '',
        },
      },
      orders: [],

      // Product actions
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
        products: [...state.products, { 
          ...product, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }] 
        set((state) => ({
          products: state.products.map((p) => 
            p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      reorderProducts: (productIds) =>
        set((state) => {
          const reorderedProducts = productIds.map((id, index) => {
            const product = state.products.find(p => p.id === id);
            return product ? { ...product, order: index } : null;
          }).filter(Boolean) as Product[];
          
          const otherProducts = state.products.filter(p => !productIds.includes(p.id));
          return { products: [...reorderedProducts, ...otherProducts] };
        }),

      // Cart actions
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.productId === item.productId
          );
          
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...item, id: Date.now().toString() }],
            };
          }
        }),

      updateCartItem: (id, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((item) => item.id !== id)
            : state.cart.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      // Blog actions
      addBlogPost: (post) => set((state) => ({ blogPosts: [...state.blogPosts, post] })),
        blogPosts: [...state.blogPosts, { 
          ...post, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }] 
        set((state) => ({
          blogPosts: state.blogPosts.map((p) => 
            p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({ blogPosts: state.blogPosts.filter((p) => p.id !== id) })),
      reorderBlogPosts: (postIds) =>
        set((state) => {
          const reorderedPosts = postIds.map((id, index) => {
            const post = state.blogPosts.find(p => p.id === id);
            return post ? { ...post, order: index } : null;
          }).filter(Boolean) as BlogPost[];
          
          const otherPosts = state.blogPosts.filter(p => !postIds.includes(p.id));
          return { blogPosts: [...reorderedPosts, ...otherPosts] };
        }),

      // Page content actions
      addPageContent: (content) => set((state) => ({
        pageContent: [...state.pageContent, { 
          ...content, 
          id: Date.now().toString() 
        }]
      })),
      updatePageContent: (id, updated) =>
        set((state) => ({
          pageContent: state.pageContent.map((c) => 
            c.id === id ? { ...c, content: updated } : c
          ),
        })),
      deletePageContent: (id) =>
        set((state) => ({ 
          pageContent: state.pageContent.filter((c) => c.id !== id) 
        })),
      reorderPageContent: (page, section, contentIds) =>
        set((state) => {
          const sectionContent = state.pageContent.filter(c => 
            c.page === page && c.section === section
          );
          const reorderedContent = contentIds.map((id, index) => {
            const content = sectionContent.find(c => c.id === id);
            return content ? { ...content, order: index } : null;
          }).filter(Boolean) as PageContent[];
          
          const otherContent = state.pageContent.filter(c => 
            !(c.page === page && c.section === section)
          );
          return { pageContent: [...otherContent, ...reorderedContent] };
        }),

      updateSiteSettings: (settings) =>
        set((state) => ({
          siteSettings: {
            ...state.siteSettings,
            ...settings,
          },
        })),

      // Order actions
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, { 
          ...order, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }] 
      })),
      
      createOrder: (customer, paymentMethod) => {
        const state = get();
        const orderId = `ORD-${Date.now()}`;
        const newOrder: Order = {
          id: orderId,
          items: [...state.cart],
          customerInfo: customer,
          paymentMethod,
          total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
        
        return orderId;
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => 
            o.id === id ? { ...o, status: status as Order['status'], updatedAt: new Date().toISOString() } : o
          ),
        })),

      // Data management
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            products: parsed.products ?? state.products,
            cart: parsed.cart ?? state.cart,
            blogPosts: parsed.blogPosts ?? state.blogPosts,
            pageContent: parsed.pageContent ?? state.pageContent,
            siteSettings: parsed.siteSettings ?? state.siteSettings,
            orders: parsed.orders ?? state.orders,
          }));
        } catch (error) {
          console.error('Error importing data:', error);
        }
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          products: state.products,
          cart: state.cart,
          blogPosts: state.blogPosts,
          pageContent: state.pageContent,
          siteSettings: state.siteSettings,
          orders: state.orders,
        });
      },
    }),
    {
      name: 'aluna-cms-store',
      version: 2,
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined,
    }
  )
);