import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
  content: any;
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

