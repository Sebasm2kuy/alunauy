import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCMSStore, CartItem } from '../store/cmsStore';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, total }) => {
  const { siteSettings, createOrder, clearCart } = useCMSStore();
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

  const shippingCost = total >= siteSettings.shipping.freeShippingThreshold ? 0 : siteSettings.shipping.shippingCost;
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
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="font-medium">Información</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="font-medium">Pago</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="font-medium">Confirmación</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Información de Contacto</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Tu nombre completo"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="tu@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="+598 XX XXX XXX"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Montevideo"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Calle y número"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="11000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas del Pedido (Opcional)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Método de Pago</span>
                  </h3>

                  <div className="space-y-4">
                    {siteSettings.paymentMethods.creditCard && (
                      <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'credit-card' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={paymentMethod === 'credit-card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                          <div>
                            <h4 className="font-medium">Tarjeta de Crédito/Débito</h4>
                            <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                      </label>
                    )}

                    {siteSettings.paymentMethods.mercadoPago && (
                      <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'mercado-pago' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mercado-pago"
                          checked={paymentMethod === 'mercado-pago'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MP</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Mercado Pago</h4>
                            <p className="text-sm text-gray-500">Pago seguro con Mercado Pago</p>
                          </div>
                        </div>
                      </label>
                    )}

                    {siteSettings.paymentMethods.bankTransfer && (
                      <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'bank-transfer' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank-transfer"
                          checked={paymentMethod === 'bank-transfer'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">$</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Transferencia Bancaria</h4>
                            <p className="text-sm text-gray-500">Transferencia directa a nuestra cuenta</p>
                          </div>
                        </div>
                      </label>
                    )}

                    {siteSettings.paymentMethods.abitab && (
                      <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'abitab' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="abitab"
                          checked={paymentMethod === 'abitab'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Abitab/RedPagos</h4>
                            <p className="text-sm text-gray-500">Pago en efectivo en sucursales</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>

                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
                  )}

                  {/* Credit Card Form */}
                  {paymentMethod === 'credit-card' && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h4 className="font-medium">Información de la Tarjeta</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Tarjeta *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.number}
                            onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                              errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de Vencimiento *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                              errors.cardExpiry ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="MM/AA"
                          />
                          {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                              errors.cardCvv ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="123"
                          />
                          {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre en la Tarjeta *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.name}
                            onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                              errors.cardName ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="Nombre como aparece en la tarjeta"
                          />
                          {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Instructions */}
                  {paymentMethod === 'bank-transfer' && siteSettings.paymentMethods.bankDetails && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <span>Datos para Transferencia</span>
                      </h4>
                      <p className="text-sm text-gray-700">{siteSettings.paymentMethods.bankDetails}</p>
                    </div>
                  )}

                  {paymentMethod === 'abitab' && siteSettings.paymentMethods.abitabInstructions && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span>Instrucciones Abitab</span>
                      </h4>
                      <p className="text-sm text-gray-700">{siteSettings.paymentMethods.abitabInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Confirmar Pedido</h3>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Información de Entrega</h4>
                      <p className="text-sm text-gray-700">{customerInfo.name}</p>
                      <p className="text-sm text-gray-700">{customerInfo.email}</p>
                      <p className="text-sm text-gray-700">{customerInfo.phone}</p>
                      <p className="text-sm text-gray-700">
                        {customerInfo.address}, {customerInfo.city}
                        {customerInfo.postalCode && `, ${customerInfo.postalCode}`}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Método de Pago</h4>
                      <p className="text-sm text-gray-700">{getPaymentMethodName(paymentMethod)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

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

                <div className="mt-6 space-y-3">
                  {step === 1 && (
                    <button
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Continuar al Pago
                    </button>
                  )}

                  {step === 2 && (
                    <>
                      <button
                        onClick={handleNextStep}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Revisar Pedido
                      </button>
                      <button
                        onClick={handlePreviousStep}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Volver
                      </button>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <button
                        onClick={handleCompleteOrder}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Confirmar Pedido
                      </button>
                      <button
                        onClick={handlePreviousStep}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Volver
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;