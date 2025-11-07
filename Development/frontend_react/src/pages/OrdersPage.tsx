import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders, Order } from '../hooks/useOrders';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Package, Calendar, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrders();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener userId del localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const id = user.userid || user.userId || user.id;
    
    if (!id) {
      alert('Error: No se pudo obtener el ID del usuario');
      navigate('/dashboard');
      return;
    }

    setUserId(id);
    fetchOrders(id);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Mis Órdenes</h1>
          <p className="text-gray-600 mt-2">Historial de tus compras</p>
        </div>

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <Button 
                variant="link" 
                className="ml-2"
                onClick={() => userId && fetchOrders(userId)}
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando órdenes...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tienes órdenes</h2>
            <p className="text-gray-600 mb-6">
              Aún no has realizado ninguna compra. ¡Empieza a comprar ahora!
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Ir a Comprar
            </Button>
          </Card>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">Orden #{order.id}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Dirección de Envío</p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address || 'No especificada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Ver Detalles
                  </Button>
                  {order.status === 'pending' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (confirm('¿Estás seguro de cancelar esta orden?')) {
                          // Aquí se podría implementar la cancelación
                          console.log('Cancelar orden', order.id);
                        }
                      }}
                    >
                      Cancelar Orden
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh button */}
        {!loading && orders.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              onClick={() => userId && fetchOrders(userId)}
            >
              Actualizar Lista
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
