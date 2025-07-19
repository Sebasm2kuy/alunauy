import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  selectProduct: (product: Product) => void;
  clearSelectedProduct: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  selectProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
