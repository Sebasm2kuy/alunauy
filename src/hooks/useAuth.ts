import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [warningTimeout, setWarningTimeout] = useState<NodeJS.Timeout | null>(null);

  // Configurar timeout de sesión (2 horas)
  const setupSessionTimeout = () => {
    // Limpiar timeouts existentes
    if (sessionTimeout) clearTimeout(sessionTimeout);
    if (warningTimeout) clearTimeout(warningTimeout);

    // Aviso 5 minutos antes del timeout
    const warning = setTimeout(() => {
      const shouldExtend = window.confirm(
        'Tu sesión expirará pronto. ¿Deseas mantenerla activa?'
      );
      if (shouldExtend) {
        setupSessionTimeout(); // Reiniciar timeout
      }
    }, 115 * 60 * 1000); // 115 minutos

    // Logout automático después de 2 horas
    const timeout = setTimeout(() => {
      logout();
      alert('Tu sesión ha expirado por inactividad.');
    }, 120 * 60 * 1000); // 120 minutos

    setWarningTimeout(warning);
    setSessionTimeout(timeout);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          role: 'admin' // Por defecto, todos los usuarios autenticados son admin
        };
        setUser(authUser);
        setupSessionTimeout();
      } else {
        setUser(null);
        if (sessionTimeout) clearTimeout(sessionTimeout);
        if (warningTimeout) clearTimeout(warningTimeout);
      }
      setLoading(false);
    });

    // Aplicar token inicial si existe
    if (globalThis.__initial_auth_token) {
      // Aquí podrías usar el token inicial para autenticación
      console.log('Token inicial disponible:', globalThis.__initial_auth_token);
    }

    // Limpiar al cerrar pestaña/navegador
    const handleBeforeUnload = () => {
      if (user) {
        signOut(auth);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (sessionTimeout) clearTimeout(sessionTimeout);
      if (warningTimeout) clearTimeout(warningTimeout);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (sessionTimeout) clearTimeout(sessionTimeout);
      if (warningTimeout) clearTimeout(warningTimeout);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user || !auth.currentUser) return false;

    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Cambiar contraseña
      await updatePassword(auth.currentUser, newPassword);
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};