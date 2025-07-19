import React, { useState, useEffect } from 'react';
import { Save, Palette, Globe, CreditCard, Truck, Mail, Shield } from 'lucide-react';
import { useStore } from '../../store/cmsStore';

const SiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(siteSettings);

  useEffect(() => {
    const handleSave = (event: CustomEvent) => {
      if (event.detail.tab === 'settings') {
        handleSubmit(new Event('submit') as any);
      }
    };

    window.addEventListener('cms-save', handleSave as EventListener);
    return () => window.removeEventListener('cms-save', handleSave as EventListener);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Configuración guardada correctamente';
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) document.body.removeChild(notification);
    }, 3000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'contact', name: 'Contacto', icon: Mail },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'shipping', name: 'Envíos', icon: Truck },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'security', name: 'Seguridad', icon: Shield }, // Agregamos la pestaña seguridad
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold">Configuración del Sitio</h2>
        <p className="text-gray-600 mt-1">Personaliza la configuración general de tu tienda</p>
      </div>
      <div className="flex">
        <div className="w-64 border-r bg-gray-50">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id ? 'bg-pink-100 text-pink-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="p-6">
            {/* ... aca van tus otras pestañas como general, appearance, contact, etc. */}
            
            {/* Pestaña Seguridad */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4">Usuario y Contraseña Admin</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario Admin</label>
                  <input
                    type="text"
                    value={formData.adminUser || ''}
                    onChange={(e) => setFormData({ ...formData, adminUser: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Usuario administrador"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Admin</label>
                  <input
                    type="password"
                    value={formData.adminPassword || ''}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Contraseña administrador"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="submit"
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
