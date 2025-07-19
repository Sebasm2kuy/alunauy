import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  User, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CartItem, SiteSettings } from '../store/cmsStore';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  siteSettings: SiteSettings;
  createOrder: (customer: { name: string; email: string; phone: string; address: string }, paymentMethod: string) => string;
  clearCart: () => void;
}

// Valores por defecto para evitar undefined
const defaultSiteSettings: SiteSettings = {
  shipping: {
    freeShippingThreshold: Infinity,
    shippingCost: 0,
  },
  paymentMethods: {
    creditCard: false,
    mercadoPago: false,
    bankTransfer: false,
    abitab: false,
    bankDetails: '',
    abitabInstructions: '',
  }
};

const Checkout: React.FC<CheckoutProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  siteSettings, 
  createOrder, 
  clearCart 
}) => {
  // Combinar siteSettings con defaults para evitar undefined
  const mergedSiteSettings: SiteSettings = {
    ...defaultSiteSettings,
    ...siteSettings,
    shipping: {
      ...defaultSiteSettings.shipping,
      ...(siteSettings?.shipping || {}),
    },
    paymentMethods: {
      ...defaultSiteSettings.paymentMethods,
      ...(siteSettings?.paymentMethods || {}),
    },
  };

  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(price);
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!customerInfo.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!customerInfo.email.trim()) newErrors.email = 'El email es requerido';
      if (!customerInfo.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (!customerInfo.address.trim()) newErrors.address = 'La dirección es requerida';
      if (!customerInfo.city.trim()) newErrors.city = 'La ciudad es requerida';
    }

    if (stepNumber === 2) {
      if (!paymentMethod) newErrors.paymentMethod = 'Selecciona un método de pago';
      
      if (paymentMethod === 'credit-card') {
        if (!cardInfo.number.trim()) newErrors.cardNumber = 'Número de tarjeta requerido';
        if (!cardInfo.expiry.trim()) newErrors.cardExpiry = 'Fecha de vencimiento requerida';
        if (!cardInfo.cvv.trim()) newErrors.cardCvv = 'CVV requerido';
        if (!cardInfo.name.trim()) newErrors.cardName = 'Nombre en la tarjeta requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleCompleteOrder = () => {
    if (validateStep(2)) {
      const newOrderId = createOrder(
        {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}`
        },
        getPaymentMethodName(paymentMethod)
      );
      
      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit-card': return 'Tarjeta de Crédito';
      case 'mercado-pago': return 'Mercado Pago';
      case 'bank-transfer': return 'Transferencia Bancaria';
      case 'abitab': return 'Abitab/RedPagos';
      default: return method;
    }
  };

  // Aquí el cambio clave para usar mergedSiteSettings
  const shippingCost = total >= mergedSiteSettings.shipping.freeShippingThreshold
    ? 0
    : mergedSiteSettings.shipping.shippingCost;

  const finalTotal = total + shippingCost;

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-4">
            Tu pedido #{orderId} ha sido recibido y está siendo procesado.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Recibirás un email de confirmación en {customerInfo.email}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Finalizar Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* (El resto del renderizado sigue igual) */}
          {/* ... */}
          {/* En la parte de resumen del pedido se usa shippingCost y finalTotal */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-pink-500">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {shippingCost === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">¡Envío gratis!</span>
              </div>
            </div>
          )}

          {/* Botones para avanzar o retroceder pasos */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
