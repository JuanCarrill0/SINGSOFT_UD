import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders, Order } from '../hooks/useOrders';
import { useShipments } from '../hooks/useShipments';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Loader2, Package, Calendar, MapPin, DollarSign, ArrowLeft, User, Search } from 'lucide-react';

export default function OrderManagementPage() {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrders();
  const { getShipmentByOrder } = useShipments();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shipmentData, setShipmentData] = useState<Record<number, any>>({});

  // Fetch all orders on mount and poll every 15 seconds
  useEffect(() => {
    fetchOrders(''); // Empty string = all orders
    
    const interval = setInterval(() => {
      fetchOrders('');
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Load shipment data for orders
  useEffect(() => {
    const loadShipments = async () => {
      const shipments: Record<number, any> = {};
      for (const order of orders) {
        const shipment = await getShipmentByOrder(order.id);
        if (shipment) {
          shipments[order.id] = shipment;
        }
      }
      setShipmentData(shipments);
    };

    if (orders.length > 0) {
      loadShipments();
    }
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
      case 'in_transit':
        return 'bg-purple-500';
      case 'delivered':
      case 'completed':
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
      case 'in_transit':
        return 'En Tránsito';
      case 'delivered':
        return 'Entregado';
      case 'completed':
        return 'Completado';
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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shipping_address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group orders by status
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => ['shipped', 'in_transit'].includes(o.status)).length,
    completed: orders.filter(o => ['delivered', 'completed'].includes(o.status)).length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h1>
          <p className="text-gray-600 mt-2">Vista de operador - Todas las órdenes del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">{orderStats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Procesando</p>
            <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Enviadas</p>
            <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Canceladas</p>
            <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por ID, usuario, dirección..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full p-2 border rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="shipped">Enviado</option>
                <option value="in_transit">En Tránsito</option>
                <option value="delivered">Entregado</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No se encontraron órdenes</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: Order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Usuario</p>
                        <p className="text-sm text-gray-600 font-mono">
                          {order.user_id.substring(0, 24)}...
                        </p>
                      </div>
                    </div>

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

                  {/* Shipment Info */}
                  {shipmentData[order.id] && (
                    <div className="mt-2 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">Tracking:</span>{' '}
                          <span className="text-blue-600">{shipmentData[order.id].tracking_number}</span>
                        </div>
                        <div>
                          <span className="font-medium">Transportista:</span>{' '}
                          <span>{shipmentData[order.id].carrier}</span>
                        </div>
                        {shipmentData[order.id].vehicle_info && (
                          <div>
                            <span className="font-medium">Vehículo:</span>{' '}
                            <span>{shipmentData[order.id].vehicle_info}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    {!shipmentData[order.id] && ['pending', 'processing'].includes(order.status) && (
                      <Button 
                        size="sm"
                        onClick={() => navigate('/shipments')}
                      >
                        Crear Envío
                      </Button>
                    )}
                    {shipmentData[order.id] && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/shipments')}
                      >
                        Gestionar Envío
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {filteredOrders.length > 0 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </div>
        )}
      </div>
    </div>
  );
}
