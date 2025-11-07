import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { usePayments } from '../hooks/usePayments';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, CreditCard, Truck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutPage({ cartItems, onClearCart }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { createOrder, loading: orderLoading, error: orderError } = useOrders();
  const { createPayment, loading: paymentLoading, error: paymentError } = usePayments();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Por favor ingresa una dirección de envío');
      return;
    }

    try {
      // Obtener datos del usuario del localStorage
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        alert('Por favor inicia sesión para continuar');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.userid || user.userId || user.id;

      if (!userId) {
        console.error('User object:', user);
        alert('Error: No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      console.log('Using userId:', userId);

      // 1. Crear la orden
      const order = await createOrder({
        user_id: userId,
        total: total,
        shipping_address: shippingAddress,
      }, token);

      if (!order) {
        throw new Error('Error al crear la orden');
      }

      setOrderId(order.id);

      // 2. Procesar el pago
      const payment = await createPayment({
        order_id: order.id,
        amount: total,
        method: paymentMethod,
      });

      if (!payment) {
        throw new Error('Error al procesar el pago');
      }

      // 3. Éxito - limpiar carrito y mostrar confirmación
      setSuccess(true);
      onClearCart();

      // Redirigir a órdenes después de 3 segundos
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (err) {
      console.error('Error during checkout:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4">¡Orden Completada!</h1>
          <p className="text-gray-600 mb-2">Tu orden #{orderId} ha sido procesada exitosamente.</p>
          <p className="text-sm text-gray-500 mb-6">
            Recibirás un correo de confirmación en breve.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/orders')} className="w-full">
              Ver Mis Órdenes
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
              Seguir Comprando
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito. Agrega algunos productos para continuar.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Ir a Comprar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        {(orderError || paymentError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {orderError || paymentError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulario de checkout */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Dirección de Envío</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección Completa</Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, ciudad, código postal"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Método de Pago</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-method">Selecciona un método</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="card-number">Número de Tarjeta</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Vencimiento</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" type="password" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Resumen de orden */}
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen de Orden</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="line-clamp-2">{item.name}</p>
                      <p className="text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full mt-6"
                disabled={orderLoading || paymentLoading}
              >
                {(orderLoading || paymentLoading) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar y Pagar'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, aceptas nuestros términos y condiciones
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
