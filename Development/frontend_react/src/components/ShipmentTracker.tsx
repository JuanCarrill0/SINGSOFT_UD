import React from 'react';

interface ShipmentTrackerProps {
  shipment: {
    id: number;
    tracking_number?: string;
    carrier?: string;
    vehicle_info?: string;
    status: string;
    shipped_at?: string;
    delivered_at?: string;
    created_at: string;
    updated_at: string;
  } | null;
  orderId: number;
}

const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ shipment, orderId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'shipped':
        return 'Enviado';
      case 'in_transit':
        return 'En Tránsito';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!shipment) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600">No hay información de envío disponible para esta orden.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Seguimiento de Envío</h3>
      
      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Estado:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
            {getStatusText(shipment.status)}
          </span>
        </div>

        {/* Tracking Number */}
        {shipment.tracking_number && (
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-medium min-w-[140px]">Número de Seguimiento:</span>
            <span className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded">
              {shipment.tracking_number}
            </span>
          </div>
        )}

        {/* Carrier */}
        {shipment.carrier && (
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium min-w-[140px]">Transportista:</span>
            <span className="text-gray-900">{shipment.carrier}</span>
          </div>
        )}

        {/* Vehicle Info */}
        {shipment.vehicle_info && (
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-medium min-w-[140px]">Información del Vehículo:</span>
            <span className="text-gray-900">{shipment.vehicle_info}</span>
          </div>
        )}

        {/* Timeline */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-gray-700 font-medium mb-3">Cronología</h4>
          <div className="space-y-2 pl-4 border-l-2 border-gray-300">
            
            <div className="relative pb-3">
              <div className="absolute -left-[17px] top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Envío creado</p>
              <p className="text-xs text-gray-500">{formatDate(shipment.created_at)}</p>
            </div>

            {shipment.shipped_at && (
              <div className="relative pb-3">
                <div className="absolute -left-[17px] top-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Enviado</p>
                <p className="text-xs text-gray-500">{formatDate(shipment.shipped_at)}</p>
              </div>
            )}

            {shipment.delivered_at && (
              <div className="relative pb-3">
                <div className="absolute -left-[17px] top-1 w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Entregado</p>
                <p className="text-xs text-gray-500">{formatDate(shipment.delivered_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
