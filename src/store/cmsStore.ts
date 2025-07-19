import { create } from 'zustand'

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

interface CMSStore {
  products: Product[]
  selectedCategory: string | null
  setProducts: (products: Product[]) => void
  setSelectedCategory: (category: string | null) => void
}

export const useCMSStore = create<CMSStore>((set) => ({
  products: [],
  selectedCategory: null,
  setProducts: (products) => set({ products }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}))
