import React, { useState } from 'react';
import { Save, Upload, Palette, Globe, CreditCard, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../store/cmsStore';

const SiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(siteSettings);

  React.useEffect(() => {
    const handleSave = (event: CustomEvent) => {
      if (event.detail.tab === 'settings') {
        handleSubmit(new Event('submit') as any);
      }
    };

    window.addEventListener('cms-save', handleSave as EventListener);
    return () => window.removeEventListener('cms-save', handleSave as EventListener);
  }, [formData]);
  useEffect(() => {
    const handleSave = (event: CustomEvent) => {
      if (event.detail.tab === 'settings') {
        handleSubmit(new Event('submit') as any);
      }
    };

    window.addEventListener('cms-save', handleSave as EventListener);
    return () => window.removeEventListener('cms-save', handleSave as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Configuración guardada correctamente';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'contact', name: 'Contacto', icon: Mail },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'shipping', name: 'Envíos', icon: Truck },
    { id: 'seo', name: 'SEO', icon: Globe }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold">Configuración del Sitio</h2>
        <p className="text-gray-600 mt-1">Personaliza la configuración general de tu tienda</p>
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r bg-gray-50">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Sitio
                    </label>
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del Sitio
                    </label>
                    <textarea
                      value={formData.siteDescription}
                      onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo (URL)
                    </label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon (URL)
                    </label>
                    <input
                      type="url"
                      value={formData.favicon}
                      onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda Principal
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={formData.currency.primary}
                      onChange={(e) => setFormData({
                        ...formData,
                        currency: { ...formData.currency, primary: e.target.value as 'UYU' | 'USD' }
                      })}
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="UYU">Pesos Uruguayos (UYU)</option>
                      <option value="USD">Dólares Americanos (USD)</option>
                    </select>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.currency.showBoth}
                        onChange={(e) => setFormData({
                          ...formData,
                          currency: { ...formData.currency, showBoth: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mr-2"
                      />
                      <span className="text-sm">Mostrar ambas monedas</span>
                    </div>

                    <div>
                      <input
                        type="number"
                        value={formData.currency.exchangeRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          currency: { ...formData.currency, exchangeRate: parseFloat(e.target.value) || 1 }
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Tipo de cambio"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Primario
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Secundario
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color de Acento
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Familia de Fuente
                  </label>
                  <select
                    value={formData.fontFamily}
                    onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Vista Previa de Colores</h4>
                  <div className="flex space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg border"
                      style={{ backgroundColor: formData.primaryColor }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg border"
                      style={{ backgroundColor: formData.secondaryColor }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg border"
                      style={{ backgroundColor: formData.accentColor }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    value={formData.contactAddress}
                    onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Redes Sociales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.instagram}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="https://instagram.com/tu_usuario"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.facebook}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="https://facebook.com/tu_pagina"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.twitter}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="https://twitter.com/tu_usuario"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.socialMedia.whatsapp}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialMedia: { ...formData.socialMedia, whatsapp: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="+598XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">Métodos de Pago Disponibles</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.creditCard}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, creditCard: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span>Tarjeta de Crédito/Débito</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.mercadoPago}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, mercadoPago: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span>Mercado Pago</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.bankTransfer}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, bankTransfer: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span>Transferencia Bancaria</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.abitab}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, abitab: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span>Abitab/RedPagos</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Datos Bancarios
                  </label>
                  <textarea
                    value={formData.paymentMethods.bankDetails || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      paymentMethods: { ...formData.paymentMethods, bankDetails: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Información de cuenta bancaria para transferencias"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones Abitab
                  </label>
                  <textarea
                    value={formData.paymentMethods.abitabInstructions || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      paymentMethods: { ...formData.paymentMethods, abitabInstructions: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Instrucciones para pago por Abitab/RedPagos"
                  />
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Gratis desde ($)
                    </label>
                    <input
                      type="number"
                      value={formData.shipping.freeShippingThreshold}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipping: { ...formData.shipping, freeShippingThreshold: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Envío ($)
                    </label>
                    <input
                      type="number"
                      value={formData.shipping.shippingCost}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipping: { ...formData.shipping, shippingCost: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Entrega
                  </label>
                  <input
                    type="text"
                    value={formData.shipping.deliveryTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, deliveryTime: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="ej: 3-5 días hábiles"
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título SEO por Defecto
                  </label>
                  <input
                    type="text"
                    value={formData.seo.defaultTitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultTitle: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción SEO por Defecto
                  </label>
                  <textarea
                    value={formData.seo.defaultDescription}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultDescription: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen Open Graph por Defecto
                  </label>
                  <input
                    type="url"
                    value={formData.seo.ogImage}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, ogImage: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="URL de la imagen para redes sociales"
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