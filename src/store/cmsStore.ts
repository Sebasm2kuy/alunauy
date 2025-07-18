// Zustand Store corregido completamente

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  customFields?: Record<string, any>;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface PageContent {
  home: string;
  about: string;
  contact: string;
  [key: string]: string;
}

interface SiteSettings {
  themeColor: string;
  logoUrl: string;
  socialLinks: Record<string, string>;
}

interface Order {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  status: string;
}

interface StoreState {
  products: Product[];
  blogPosts: BlogPost[];
  pageContent: PageContent;
  siteSettings: SiteSettings;
  orders: Order[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  updatePageContent: (page: string, content: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;

  importData: (data: string) => void;
  exportData: () => string;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      blogPosts: [],
      pageContent: {
        home: '',
        about: '',
        contact: '',
      },
      siteSettings: {
        themeColor: '#ffffff',
        logoUrl: '',
        socialLinks: {},
      },
      orders: [],

      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updated) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      addBlogPost: (post) => set((state) => ({ blogPosts: [...state.blogPosts, post] })),
      updateBlogPost: (id, updated) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({ blogPosts: state.blogPosts.filter((p) => p.id !== id) })),

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

      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      importData: (data: string) => {
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

      exportData: () => {
        const state = get();
        return JSON.stringify({
          products: state.products,
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
