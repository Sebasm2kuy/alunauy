import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  customFields?: Record<string, any>;
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
  date: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}

export interface PageContent {
  home: string;
  about: string;
  contact: string;
  [key: string]: string;
}

export interface SiteSettings {
  themeColor: string;
  logoUrl: string;
  siteName: string;
  socialLinks: Record<string, string>;
  shipping: {
    shippingCost: number;
    freeShippingThreshold: number;
  };
  paymentMethods: {
    creditCard: boolean;
    mercadoPago: boolean;
    bankTransfer: boolean;
    abitab: boolean;
    bankDetails?: string;
    abitabInstructions?: string;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  total: number;
  status: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  blogPosts: BlogPost[];
  pageContent: PageContent;
  siteSettings: SiteSettings;
  orders: Order[];

  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Blog actions
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Page content actions
  updatePageContent: (page: string, content: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Order actions
  addOrder: (order: Order) => void;
  createOrder: (customer: Order['customer'], paymentMethod: string) => string;
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
      pageContent: {
        home: '',
        about: '',
        contact: '',
      },
      siteSettings: {
        themeColor: '#ec4899',
        logoUrl: '',
        siteName: 'Aluna Cosméticos',
        socialLinks: {},
        shipping: {
          shippingCost: 200,
          freeShippingThreshold: 2000,
        },
        paymentMethods: {
          creditCard: true,
          mercadoPago: true,
          bankTransfer: true,
          abitab: true,
          bankDetails: 'Banco: BROU - Cuenta: 123456789 - Titular: Aluna Cosméticos',
          abitabInstructions: 'Presenta este código en cualquier sucursal Abitab o RedPagos',
        },
      },
      orders: [],

      // Product actions
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updated) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

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
      updateBlogPost: (id, updated) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({ blogPosts: state.blogPosts.filter((p) => p.id !== id) })),

      // Page content actions
      updatePageContent: (page, content) =>
        set((state) => ({
          pageContent: {
            ...state.pageContent,
            [page]: content,
          },
        })),

      updateSiteSettings: (settings) =>
        set((state) => ({
          siteSettings: {
            ...state.siteSettings,
            ...settings,
          },
        })),

      // Order actions
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      
      createOrder: (customer, paymentMethod) => {
        const state = get();
        const orderId = `ORD-${Date.now()}`;
        const newOrder: Order = {
          id: orderId,
          items: [...state.cart],
          customer,
          paymentMethod,
          total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
        
        return orderId;
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
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
      version: 1,
      storage: typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined,
    }
  )
);