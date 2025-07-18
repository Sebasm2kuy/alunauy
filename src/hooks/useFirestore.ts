import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  rating: number;
  reviews: number;
  badge?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Page {
  id?: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AdminUser {
  id?: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

export interface SiteConfig {
  id?: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  updatedAt: Timestamp;
}

export const useFirestore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos
        const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);

        // Cargar páginas
        const pagesQuery = query(collection(db, 'pages'), orderBy('createdAt', 'desc'));
        const pagesSnapshot = await getDocs(pagesQuery);
        const pagesData = pagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Page[];
        setPages(pagesData);

        // Cargar usuarios admin
        const usersQuery = query(collection(db, 'adminUsers'), orderBy('createdAt', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdminUser[];
        setAdminUsers(usersData);

        // Cargar configuración del sitio
        const configDoc = await getDoc(doc(db, 'siteConfig', 'main'));
        if (configDoc.exists()) {
          setSiteConfig({ id: configDoc.id, ...configDoc.data() } as SiteConfig);
        }

      } catch (err) {
        setError('Error al cargar datos: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // CRUD Productos
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const newProduct = { id: docRef.id, ...productData, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      setProducts(prev => [newProduct, ...prev]);
      
      return docRef.id;
    } catch (err) {
      setError('Error al crear producto: ' + (err as Error).message);
      return null;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...productData,
        updatedAt: Timestamp.now()
      });
      
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, ...productData, updatedAt: Timestamp.now() } : p
      ));
      
      return true;
    } catch (err) {
      setError('Error al actualizar producto: ' + (err as Error).message);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar producto: ' + (err as Error).message);
      return false;
    }
  };

  // CRUD Páginas
  const addPage = async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    try {
      const docRef = await addDoc(collection(db, 'pages'), {
        ...pageData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const newPage = { id: docRef.id, ...pageData, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      setPages(prev => [newPage, ...prev]);
      
      return docRef.id;
    } catch (err) {
      setError('Error al crear página: ' + (err as Error).message);
      return null;
    }
  };

  const updatePage = async (id: string, pageData: Partial<Page>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'pages', id), {
        ...pageData,
        updatedAt: Timestamp.now()
      });
      
      setPages(prev => prev.map(p => 
        p.id === id ? { ...p, ...pageData, updatedAt: Timestamp.now() } : p
      ));
      
      return true;
    } catch (err) {
      setError('Error al actualizar página: ' + (err as Error).message);
      return false;
    }
  };

  const deletePage = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'pages', id));
      setPages(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar página: ' + (err as Error).message);
      return false;
    }
  };

  // CRUD Usuarios Admin
  const addAdminUser = async (userData: Omit<AdminUser, 'id' | 'createdAt'>): Promise<string | null> => {
    try {
      const docRef = await addDoc(collection(db, 'adminUsers'), {
        ...userData,
        createdAt: Timestamp.now()
      });
      
      const newUser = { id: docRef.id, ...userData, createdAt: Timestamp.now() };
      setAdminUsers(prev => [newUser, ...prev]);
      
      return docRef.id;
    } catch (err) {
      setError('Error al crear usuario: ' + (err as Error).message);
      return null;
    }
  };

  const updateAdminUser = async (id: string, userData: Partial<AdminUser>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'adminUsers', id), userData);
      setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
      return true;
    } catch (err) {
      setError('Error al actualizar usuario: ' + (err as Error).message);
      return false;
    }
  };

  const deleteAdminUser = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'adminUsers', id));
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar usuario: ' + (err as Error).message);
      return false;
    }
  };

  // Configuración del sitio
  const updateSiteConfig = async (configData: Partial<SiteConfig>): Promise<boolean> => {
    try {
      const configRef = doc(db, 'siteConfig', 'main');
      await updateDoc(configRef, {
        ...configData,
        updatedAt: Timestamp.now()
      });
      
      setSiteConfig(prev => prev ? { ...prev, ...configData, updatedAt: Timestamp.now() } : null);
      return true;
    } catch (err) {
      setError('Error al actualizar configuración: ' + (err as Error).message);
      return false;
    }
  };

  return {
    // Data
    products,
    pages,
    adminUsers,
    siteConfig,
    loading,
    error,
    
    // Products
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Pages
    addPage,
    updatePage,
    deletePage,
    
    // Admin Users
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    
    // Site Config
    updateSiteConfig,
    
    // Utils
    clearError: () => setError(null)
  };
};