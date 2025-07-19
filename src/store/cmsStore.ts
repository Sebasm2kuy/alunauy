import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  // Agrega otros campos si son necesarios
}

interface StoreState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  selectProduct: (product: Product) => void;
  clearSelectedProduct: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulamos una llamada a una API
      const response = await fetch('/api/products');
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectProduct: (product) => {
    set({ selectedProduct: product });
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },

  addProduct: (product) => {
    set({ products: [...get().products, product] });
  },

  updateProduct: (updatedProduct) => {
    set({
      products: get().products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    });
  },

  deleteProduct: (productId) => {
    set({
      products: get().products.filter((p) => p.id !== productId),
    });
  },
}));

