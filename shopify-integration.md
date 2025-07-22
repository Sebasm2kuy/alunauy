# 🛒 Integración con Shopify - ALuna Uruguay

## Configuración de Shopify para Uruguay

### 1. Crear cuenta Shopify
1. Ve a [shopify.com](https://www.shopify.com)
2. Crea tu tienda con el plan que prefieras
3. Configura tu tienda para Uruguay:
   - **Moneda**: Peso Uruguayo (UYU)
   - **Ubicación**: Maldonado, Uruguay
   - **Zona horaria**: America/Montevideo

### 2. Configurar métodos de pago para Uruguay

#### Mercado Pago
1. En Shopify Admin > Settings > Payments
2. Buscar "Mercado Pago" en payment providers
3. Conectar tu cuenta de Mercado Pago
4. Configurar para aceptar:
   - Tarjetas de crédito/débito
   - Mercado Pago wallet

#### Abitab y Red Pagos
1. Contactar con Shopify Support para habilitar pagos offline
2. O usar apps como "Manual Payment Methods"
3. Configurar instrucciones para:
   - Giros Abitab
   - Red Pagos

### 3. Configurar envíos

#### Zonas de envío
```
Zona 1: Maldonado (Local)
- Envío gratis: $0
- Envío express: $150

Zona 2: Montevideo
- Envío estándar: $200
- Envío express: $350

Zona 3: Interior del país
- Envío estándar: $250
- Envío express: $400
```

#### Envío gratis
- Configurar envío gratis para compras superiores a $1500 UYU

### 4. Obtener credenciales API

#### Storefront API (para mostrar productos)
1. Shopify Admin > Apps > Manage private apps
2. Create private app
3. Enable Storefront API
4. Copiar Storefront access token

#### Webhook (para sincronización)
1. Settings > Notifications
2. Create webhook para "Product creation/update"
3. URL: tu-sitio.github.io/webhook

### 5. Configurar el sistema

#### En admin/admin.js
```javascript
this.shopifyConfig = {
    domain: 'aluna-uruguay.myshopify.com', // Tu dominio
    storefrontToken: 'tu-storefront-token'
};
```

#### En js/ecommerce.js
```javascript
this.config = {
    shopifyDomain: 'aluna-uruguay.myshopify.com'
};
```

## 🔄 Flujo de trabajo

### Para tu cliente:
1. **Gestionar productos**: Usar el panel admin (`/admin/`)
2. **Ver cambios**: Los productos se actualizan automáticamente
3. **Procesar pedidos**: Los clientes pagan a través de Shopify
4. **Gestionar envíos**: Desde Shopify Admin

### Para los clientes:
1. **Navegar productos**: En tu sitio web
2. **Agregar al carrito**: Sistema local
3. **Checkout**: Redirige a Shopify (seguro)
4. **Pagar**: Métodos uruguayos disponibles
5. **Recibir**: Envío desde Maldonado

## 📱 Apps recomendadas para Shopify

### Pagos
- **Mercado Pago**: Pagos locales
- **Manual Payment Methods**: Para Abitab/Red Pagos

### Envíos
- **Advanced Shipping Rules**: Reglas complejas de envío
- **Local Delivery**: Para entregas locales en Maldonado

### Marketing
- **Klaviyo**: Email marketing
- **Judge.me**: Reviews de productos

## 💰 Costos estimados

### Shopify
- **Basic**: $29 USD/mes
- **Shopify**: $79 USD/mes (recomendado)

### Transacciones
- **Mercado Pago**: ~3.5% + IVA
- **Shopify Payments**: No disponible en Uruguay

## 🚀 Próximos pasos

1. **Crear cuenta Shopify**
2. **Configurar métodos de pago uruguayos**
3. **Subir productos iniciales**
4. **Configurar credenciales en el código**
5. **Probar flujo completo**
6. **Capacitar a tu cliente en el panel admin**

## 📞 Soporte

- **Shopify Support**: 24/7 en español
- **Mercado Pago**: Soporte local Uruguay
- **Documentación**: [shopify.dev](https://shopify.dev)