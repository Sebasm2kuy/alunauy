import React, { useState } from 'react';
import { Save, RefreshCw, Eye, Palette, Type, Layout, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useStore } from '../../store/cmsStore';

const ThemeCustomizer: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState('colors');

  const [customTheme, setCustomTheme] = useState({
    colors: {
      primary: siteSettings.primaryColor,
      secondary: siteSettings.secondaryColor,
      accent: siteSettings.accentColor,
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    typography: {
      fontFamily: siteSettings.fontFamily,
      headingFont: 'Playfair Display',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    spacing: {
      containerMaxWidth: '1200px',
      sectionPadding: '5rem',
      elementSpacing: '1.5rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  });

  const colorPresets = [
    {
      name: 'Rosa Elegante',
      colors: { primary: '#ec4899', secondary: '#a855f7', accent: '#f97316' }
    },
    {
      name: 'Azul Profesional',
      colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' }
    },
    {
      name: 'Verde Natural',
      colors: { primary: '#10b981', secondary: '#059669', accent: '#84cc16' }
    },
    {
      name: 'Púrpura Moderno',
      colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
    },
    {
      name: 'Naranja Vibrante',
      colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' }
    }
  ];

  const fontPairs = [
    { name: 'Clásico', body: 'Inter', heading: 'Playfair Display' },
    { name: 'Moderno', body: 'Roboto', heading: 'Montserrat' },
    { name: 'Elegante', body: 'Open Sans', heading: 'Lora' },
    { name: 'Minimalista', body: 'Lato', heading: 'Poppins' },
    { name: 'Creativo', body: 'Source Sans Pro', heading: 'Merriweather' }
  ];

  const handleSaveTheme = () => {
    updateSiteSettings({
      primaryColor: customTheme.colors.primary,
      secondaryColor: customTheme.colors.secondary,
      accentColor: customTheme.colors.accent,
      fontFamily: customTheme.typography.fontFamily
    });
    alert('Tema guardado correctamente');
  };

  const handleResetTheme = () => {
    if (confirm('¿Estás seguro de que quieres restablecer el tema por defecto?')) {
      setCustomTheme({
        ...customTheme,
        colors: {
          ...customTheme.colors,
          primary: '#ec4899',
          secondary: '#a855f7',
          accent: '#f97316'
        },
        typography: {
          ...customTheme.typography,
          fontFamily: 'Inter'
        }
      });
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setCustomTheme({
      ...customTheme,
      colors: {
        ...customTheme.colors,
        ...preset.colors
      }
    });
  };

  const applyFontPair = (pair: typeof fontPairs[0]) => {
    setCustomTheme({
      ...customTheme,
      typography: {
        ...customTheme.typography,
        fontFamily: pair.body,
        headingFont: pair.heading
      }
    });
  };

  const sections = [
    { id: 'colors', name: 'Colores', icon: Palette },
    { id: 'typography', name: 'Tipografía', icon: Type },
    { id: 'layout', name: 'Diseño', icon: Layout }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Controls Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold">Personalizar Tema</h2>
            <p className="text-gray-600 text-sm">Personaliza la apariencia de tu tienda</p>
          </div>

          {/* Section Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 space-y-6">
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Presets de Color</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyColorPreset(preset)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors"
                      >
                        <span className="font-medium">{preset.name}</span>
                        <div className="flex space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.primary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.secondary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: preset.colors.accent }}
                          ></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Colores Personalizados</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Primario
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customTheme.colors.primary}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, primary: e.target.value }
                          })}
                          className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customTheme.colors.primary}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, primary: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                          value={customTheme.colors.secondary}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, secondary: e.target.value }
                          })}
                          className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customTheme.colors.secondary}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, secondary: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                          value={customTheme.colors.accent}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, accent: e.target.value }
                          })}
                          className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customTheme.colors.accent}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            colors: { ...customTheme.colors, accent: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Combinaciones de Fuentes</h3>
                  <div className="space-y-3">
                    {fontPairs.map((pair, index) => (
                      <button
                        key={index}
                        onClick={() => applyFontPair(pair)}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          customTheme.typography.fontFamily === pair.body
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-500'
                        }`}
                      >
                        <div className="font-semibold mb-1" style={{ fontFamily: pair.heading }}>
                          {pair.name}
                        </div>
                        <div className="text-sm text-gray-600" style={{ fontFamily: pair.body }}>
                          Títulos: {pair.heading} • Texto: {pair.body}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Tamaños de Fuente</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño Base
                      </label>
                      <select
                        value={customTheme.typography.fontSize.base}
                        onChange={(e) => setCustomTheme({
                          ...customTheme,
                          typography: {
                            ...customTheme.typography,
                            fontSize: { ...customTheme.typography.fontSize, base: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="0.875rem">14px (Pequeño)</option>
                        <option value="1rem">16px (Normal)</option>
                        <option value="1.125rem">18px (Grande)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Espaciado</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ancho Máximo del Contenedor
                      </label>
                      <select
                        value={customTheme.spacing.containerMaxWidth}
                        onChange={(e) => setCustomTheme({
                          ...customTheme,
                          spacing: { ...customTheme.spacing, containerMaxWidth: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="1024px">1024px (Compacto)</option>
                        <option value="1200px">1200px (Normal)</option>
                        <option value="1400px">1400px (Amplio)</option>
                        <option value="100%">100% (Completo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Espaciado de Secciones
                      </label>
                      <select
                        value={customTheme.spacing.sectionPadding}
                        onChange={(e) => setCustomTheme({
                          ...customTheme,
                          spacing: { ...customTheme.spacing, sectionPadding: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="3rem">Compacto</option>
                        <option value="5rem">Normal</option>
                        <option value="7rem">Amplio</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Bordes Redondeados</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(customTheme.borderRadius).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setCustomTheme({
                            ...customTheme,
                            borderRadius: { ...customTheme.borderRadius, [key]: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t">
              <button
                onClick={handleSaveTheme}
                className="flex-1 bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Tema</span>
              </button>
              <button
                onClick={handleResetTheme}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border h-full">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vista Previa</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-lg ${previewMode === 'tablet' ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 h-full overflow-auto">
            <div 
              className={`mx-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-sm' : 
                previewMode === 'tablet' ? 'max-w-2xl' : 
                'max-w-full'
              }`}
              style={{
                fontFamily: customTheme.typography.fontFamily,
                fontSize: customTheme.typography.fontSize.base
              }}
            >
              {/* Preview Header */}
              <div 
                className="p-4 rounded-lg mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`,
                  borderRadius: customTheme.borderRadius.lg
                }}
              >
                <h1 
                  className="text-white text-2xl font-bold mb-2"
                  style={{ fontFamily: customTheme.typography.headingFont }}
                >
                  {siteSettings.siteName}
                </h1>
                <p className="text-white/90">{siteSettings.siteDescription}</p>
              </div>

              {/* Preview Content */}
              <div className="space-y-6">
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: customTheme.colors.surface,
                    borderRadius: customTheme.borderRadius.lg
                  }}
                >
                  <h2 
                    className="text-xl font-bold mb-4"
                    style={{ 
                      fontFamily: customTheme.typography.headingFont,
                      color: customTheme.colors.text
                    }}
                  >
                    Productos Destacados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div 
                        key={i}
                        className="bg-white p-4 rounded-lg shadow-sm border"
                        style={{ borderRadius: customTheme.borderRadius.md }}
                      >
                        <div 
                          className="w-full h-32 bg-gray-200 rounded mb-3"
                          style={{ borderRadius: customTheme.borderRadius.sm }}
                        ></div>
                        <h3 className="font-semibold mb-2" style={{ color: customTheme.colors.text }}>
                          Producto {i}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: customTheme.colors.textSecondary }}>
                          Descripción del producto de ejemplo
                        </p>
                        <button 
                          className="w-full py-2 px-4 text-white font-semibold rounded transition-colors"
                          style={{ 
                            backgroundColor: customTheme.colors.primary,
                            borderRadius: customTheme.borderRadius.md
                          }}
                        >
                          Agregar al Carrito
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="p-6 rounded-lg"
                  style={{ 
                    backgroundColor: customTheme.colors.accent + '20',
                    borderRadius: customTheme.borderRadius.lg
                  }}
                >
                  <h2 
                    className="text-xl font-bold mb-4"
                    style={{ 
                      fontFamily: customTheme.typography.headingFont,
                      color: customTheme.colors.text
                    }}
                  >
                    Sobre Nosotros
                  </h2>
                  <p style={{ color: customTheme.colors.textSecondary }}>
                    Este es un ejemplo de cómo se verá el contenido con el tema personalizado. 
                    Los colores, fuentes y espaciado se aplicarán automáticamente en toda la tienda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;