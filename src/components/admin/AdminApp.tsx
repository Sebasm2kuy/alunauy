import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import AdminLayout from './AdminLayout';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import PagesManager from './PagesManager';
import SettingsManager from './SettingsManager';

const AdminApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: firestoreLoading } = useFirestore();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [saveLoading, setSaveLoading] = useState(false);

  // Función de guardado global
  const handleGlobalSave = async () => {
    setSaveLoading(true);
    
    // Simular guardado (aquí podrías implementar lógica específica según la sección)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveLoading(false);
    
    // Mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Cambios guardados correctamente';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // Mostrar loading mientras se autentica
  if (authLoading || firestoreLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  // Mostrar login si no está autenticado
  if (!user) {
    return <LoginForm />;
  }

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setCurrentSection} />;
      case 'products':
        return <ProductsManager onSave={handleGlobalSave} />;
      case 'pages':
        return <PagesManager onSave={handleGlobalSave} />;
      case 'settings':
        return <SettingsManager onSave={handleGlobalSave} />;
      default:
        return <Dashboard onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onSave={currentSection !== 'dashboard' ? handleGlobalSave : undefined}
      saveLoading={saveLoading}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminApp;