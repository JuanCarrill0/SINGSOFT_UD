import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrders, Order } from '../hooks/useOrders';
import { useShipments, Shipment } from '../hooks/useShipments';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Package, Calendar, MapPin, DollarSign, ArrowLeft, Truck } from 'lucide-react';
import ShipmentTracker from '../components/ShipmentTracker';
import { API_ENDPOINTS } from '../config/api';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orders, loading, error, fetchOrders } = useOrders();
  const { getShipmentByOrder } = useShipments();
  const [userId, setUserId] = useState<string | null>(null);
  const [shipmentData, setShipmentData] = useState<Record<number, Shipment | null>>({});
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

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

  // Sync local orders with fetched orders
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Auto-refresh orders every 15 seconds to reflect shipment status changes
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing orders...');
      fetchOrders(userId);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const toggleOrderExpansion = async (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
        // Load shipment data only when expanding
        if (!shipmentData[orderId]) {
          getShipmentByOrder(orderId).then(shipment => {
            setShipmentData(prev => ({ ...prev, [orderId]: shipment }));
          });
        }
      }
      return newSet;
    });
  };

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
        {!loading && !error && localOrders.length === 0 && (
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
        {!loading && !error && localOrders.length > 0 && (
          <div className="space-y-4">
            {localOrders.map((order: Order) => (
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
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {expandedOrders.has(order.id) ? 'Ocultar' : 'Ver'} Detalles
                  </Button>
                  {shipmentData[order.id] && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Seguimiento
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={async () => {
                        if (!confirm('¿Estás seguro de cancelar esta orden?')) return;
                        
                        // Capture current state before optimistic update
                        const previousOrders = [...localOrders];
                        
                        // Optimistic UI update for immediate feedback
                        setLocalOrders(prev => prev.map(o => 
                          o.id === order.id ? { ...o, status: 'cancelled' } : o
                        ));
                        
                        try {
                          console.log('🚀 Attempting to cancel order:', order.id);
                          console.log('📍 Cancel endpoint:', API_ENDPOINTS.ORDERS.CANCEL(order.id));
                          
                          const res = await fetch(API_ENDPOINTS.ORDERS.CANCEL(order.id), {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          });
                          
                          console.log('📡 Response status:', res.status);
                          
                          if (!res.ok) {
                            const errText = await res.text();
                            console.error('❌ Error al cancelar orden:', errText);
                            // Revert optimistic update on error
                            setLocalOrders(previousOrders);
                            alert('No se pudo cancelar la orden: ' + errText);
                            return;
                          }
                          
                          const cancelledOrder = await res.json();
                          console.log('✅ Order cancelled successfully:', cancelledOrder);
                          
                          // Refetch to ensure sync with server
                          if (userId) {
                            console.log('🔄 Refetching orders...');
                            await fetchOrders(userId);
                          }
                        } catch (e) {
                          console.error('❌ Exception while cancelling order:', e);
                          // Revert optimistic update on error
                          setLocalOrders(previousOrders);
                          alert('No se pudo cancelar la orden: Error de conexión');
                        }
                      }}
                    >
                      Cancelar Orden
                    </Button>
                  )}
                </div>

                {/* Shipment Tracking Section */}
                {expandedOrders.has(order.id) && (
                  <div className="mt-4 pt-4 border-t">
                    <ShipmentTracker shipment={shipmentData[order.id]} orderId={order.id} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Refresh button */}
        {!loading && localOrders.length > 0 && (
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
