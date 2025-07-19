// src/store/cmsStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  date: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface PageContent {
  id: string
  page: string
  section: string
  type: 'text' | 'image' | 'block'
  content: any
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  logoUrl: string
  socialLinks: Record<string, string>
  contactInfo: {
    email: string
    phone: string
    address: string
    schedule: string
  }
  paymentMethods: {
    creditCard: boolean
    mercadoPago: boolean
    bankTransfer: boolean
    cash: boolean
  }
  shippingOptions: {
    montevideo: number
    interior: number
  }
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
  }
  adminUser?: string          // <-- agregado adminUser
  adminPassword?: string      // <-- agregado adminPassword
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variants?: Record<string, string>
}

export interface Order {
  id: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    notes: string
  }
  items: CartItem[]
  total: number
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface StoreState {
  products: Product[]
  blogPosts: BlogPost[]
  pageContent: PageContent[]
  siteSettings: SiteSettings
  orders: Order[]
  cart: CartItem[]

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, updated: Partial<Product>) => void
  deleteProduct: (id: string) => void
  reorderProducts: (startIndex: number, endIndex: number) => void

  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void
  deleteBlogPost: (id: string) => void
  reorderBlogPosts: (startIndex: number, endIndex: number) => void

  addPageContent: (content: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePageContent: (id: string, updated: Partial<PageContent>) => void
  deletePageContent: (id: string) => void
  reorderPageContent: (startIndex: number, endIndex: number) => void

  updateSiteSettings: (settings: Partial<SiteSettings>) => void

  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void

  addToCart: (product: Product, quantity: number, variants?: Record<string, string>) => void
  updateCartItem: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void

  importData: (data: string) => void
  exportData: () => string
}

export const useCMSStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      blogPosts: [],
      pageContent: [],
      siteSettings: {
        primaryColor: '#EC4899',
        secondaryColor: '#A855F7',
        accentColor: '#F472B6',
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
        adminUser: 'admin',           // <-- valor por defecto
        adminPassword: '1234',        // <-- valor por defecto
      },
      orders: [],
      cart: [],

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      updateProduct: (id, updated) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      reorderProducts: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.products)
          const [removed] = result.splice(startIndex, 1)
          result.splice(endIndex, 0, removed)
          return { products: result }
        }),

      addBlogPost: (post) =>
        set((state) => ({
          blogPosts: [
            ...state.blogPosts,
            { ...post, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      updateBlogPost: (id, updated) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        })),
      reorderBlogPosts: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.blogPosts)
          const [removed] = result.splice(startIndex, 1)
          result.splice(endIndex, 0, removed)
          return { blogPosts: result }
        }),

      addPageContent: (content) =>
        set((state) => ({
          pageContent: [
            ...state.pageContent,
            { ...content, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      updatePageContent: (id, updated) =>
        set((state) => ({
          pageContent: state.pageContent.map((pc) =>
            pc.id === id ? { ...pc, ...updated, updatedAt: new Date().toISOString() } : pc
          ),
        })),
      deletePageContent: (id) =>
        set((state) => ({
          pageContent: state.pageContent.filter((pc) => pc.id !== id),
        })),
      reorderPageContent: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.pageContent)
          const [removed] = result.splice(startIndex, 1)
          result.splice(endIndex, 0, removed)
          return { pageContent: result }
        }),

      updateSiteSettings: (settings) =>
        set((state) => ({
          siteSettings: {
            ...state.siteSettings,
            ...settings,
          },
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            { ...order, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)),
        })),

      addToCart: (product, quantity = 1, variants = {}) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) =>
              item.id === product.id && JSON.stringify(item.variants) === JSON.stringify(variants)
          )
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && JSON.stringify(item.variants) === JSON.stringify(variants)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          } else {
            return {
              cart: [
                ...state.cart,
                { id: product.id, name: product.title, price: product.price, quantity, image: product.image, variants },
              ],
            }
          }
        }),
      updateCartItem: (id, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),

      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          set((state) => ({
            products: parsed.products ?? state.products,
            blogPosts: parsed.blogPosts ?? state.blogPosts,
            pageContent: parsed.pageContent ?? state.pageContent,
            siteSettings: parsed.siteSettings ?? state.siteSettings,
            orders: parsed.orders ?? state.orders,
            cart: parsed.cart ?? state.cart,
          }))
        } catch (error) {
          console.error('Error importing data:', error)
        }
      },
      exportData: () => {
        const state = get()
        return JSON.stringify({
          products: state.products,
          blogPosts: state.blogPosts,
          pageContent: state.pageContent,
          siteSettings: state.siteSettings,
          orders: state.orders,
          cart: state.cart,
        })
      },
    }),
    {
      name: 'aluna-cms-store',
      version: 1,
      storage:
        typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)

// Export alias para compatibilidad con imports antiguos
export { useCMSStore as useStore }
