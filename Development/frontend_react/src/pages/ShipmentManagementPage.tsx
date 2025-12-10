import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useShipments } from '../hooks/useShipments';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, Package, Truck, ArrowLeft, CheckCircle2, Clock, MapPin } from 'lucide-react';

type ShipmentStatus = 'pending' | 'dispatched' | 'in_transit' | 'delivered';

interface ShipmentFormData {
  orderId: number;
  trackingNumber: string;
  carrier: string;
  vehicleInfo: string;
  estimatedDelivery: string;
}

interface UpdateStatusData {
  shipmentId: number;
  status: ShipmentStatus;
  vehicleInfo?: string;
}

export default function ShipmentManagementPage() {
  const navigate = useNavigate();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const { shipments, loading: shipmentsLoading, createShipment, updateShipmentStatus, fetchShipments } = useShipments();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ShipmentFormData>({
    orderId: 0,
    trackingNumber: '',
    carrier: '',
    vehicleInfo: '',
    estimatedDelivery: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Poll for updates every 10 seconds and fetch ALL orders (operator view)
  useEffect(() => {
    // Fetch all orders without user_id filter (operator view)
    fetchOrders(''); // Empty string fetches all orders
    fetchShipments();
    
    const interval = setInterval(() => {
      fetchOrders('');
      fetchShipments();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const ordersWithoutShipment = orders.filter(order => 
    ['processing', 'pending'].includes(order.status) &&
    !shipments.some(s => s.order_id === order.id)
  );

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await createShipment({
        order_id: formData.orderId,
        tracking_number: formData.trackingNumber,
        carrier: formData.carrier,
        vehicle_info: formData.vehicleInfo,
        estimated_delivery: formData.estimatedDelivery,
        status: 'dispatched'
      });

      if (result) {
        setSuccessMessage('Envío creado exitosamente');
        setShowCreateForm(false);
        setFormData({
          orderId: 0,
          trackingNumber: '',
          carrier: '',
          vehicleInfo: '',
          estimatedDelivery: ''
        });
        fetchShipments();
        fetchOrders(''); // Refresh orders to update status
      }
    } catch (error) {
      setErrorMessage('Error al crear el envío');
      console.error(error);
    }
  };

  const handleUpdateStatus = async (shipmentId: number, newStatus: ShipmentStatus, vehicleInfo?: string) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateShipmentStatus(shipmentId, {
        status: newStatus,
        vehicle_info: vehicleInfo
      });

      if (result) {
        setSuccessMessage(`Estado actualizado a: ${getStatusText(newStatus)}`);
        fetchShipments();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage('Error al actualizar el estado del envío');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'dispatched':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'dispatched':
        return 'Despachado';
      case 'in_transit':
        return 'En Tránsito';
      case 'delivered':
        return 'Entregado';
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus: string): ShipmentStatus | null => {
    switch (currentStatus) {
      case 'pending':
      case 'dispatched':
        return 'in_transit';
      case 'in_transit':
        return 'delivered';
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Envíos</h1>
          <p className="text-gray-600 mt-2">Administra el estado de los envíos y asigna transportes</p>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Create Shipment Section */}
        {ordersWithoutShipment.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Crear Nuevo Envío</h2>
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancelar' : 'Nuevo Envío'}
              </Button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateShipment} className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Orden</Label>
                  <select
                    id="orderId"
                    className="w-full p-2 border rounded"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Seleccionar orden...</option>
                    {ordersWithoutShipment.map(order => (
                      <option key={order.id} value={order.id}>
                        Orden #{order.id} - Usuario: {order.user_id.substring(0, 8)}... - ${order.total} - {order.shipping_address}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="trackingNumber">Número de Seguimiento</Label>
                  <Input
                    id="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    placeholder="TRK-123456789"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carrier">Transportista</Label>
                  <Input
                    id="carrier"
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    placeholder="DHL, FedEx, UPS..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleInfo">Información del Vehículo</Label>
                  <Input
                    id="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                    placeholder="Camión ABC-123, Conductor: Juan Pérez"
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedDelivery">Fecha Estimada de Entrega</Label>
                  <Input
                    id="estimatedDelivery"
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Crear Envío
                </Button>
              </form>
            )}
          </Card>
        )}

        {/* Active Shipments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Envíos Activos</h2>
          
          {shipmentsLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : shipments.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hay envíos registrados</p>
            </Card>
          ) : (
            shipments.map(shipment => {
              const nextStatus = getNextStatus(shipment.status);
              const relatedOrder = orders.find(o => o.id === shipment.order_id);
              
              return (
                <Card key={shipment.id} className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Orden #{shipment.order_id}</h3>
                          {relatedOrder && (
                            <p className="text-sm text-gray-500">
                              Usuario: {relatedOrder.user_id.substring(0, 16)}...
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>
                          {getStatusText(shipment.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Tracking:</span>
                          <span className="text-blue-600">{shipment.tracking_number}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Transportista:</span>
                          <span>{shipment.carrier}</span>
                        </div>

                        {shipment.vehicle_info && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="font-medium">Vehículo:</span>
                              <p className="text-gray-600">{shipment.vehicle_info}</p>
                            </div>
                          </div>
                        )}

                        {shipment.estimated_delivery && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Entrega estimada:</span>
                            <span>{new Date(shipment.estimated_delivery).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="flex flex-col justify-center gap-3">
                      {nextStatus && shipment.status !== 'delivered' && (
                        <>
                          <Button
                            onClick={() => handleUpdateStatus(shipment.id, nextStatus)}
                            className="w-full"
                          >
                            Actualizar a: {getStatusText(nextStatus)}
                          </Button>

                          {nextStatus === 'in_transit' && (
                            <div className="space-y-2">
                              <Label>Asignar vehículo (opcional)</Label>
                              <Input
                                placeholder="Camión XYZ-789, Conductor: María García"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    handleUpdateStatus(shipment.id, nextStatus, target.value);
                                    target.value = '';
                                  }
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}

                      {shipment.status === 'delivered' && (
                        <div className="text-center text-green-600 font-medium">
                          <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                          Entregado
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
