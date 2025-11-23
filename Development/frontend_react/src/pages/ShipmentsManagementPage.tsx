import React, { useState, useEffect } from 'react';
import { useShipments, Shipment } from '../hooks/useShipments';

const ShipmentsManagementPage: React.FC = () => {
  const { 
    shipments, 
    loading, 
    error, 
    fetchShipments, 
    updateShipment,
    updateShipmentStatus,
    createShipment 
  } = useShipments();

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    order_id: 0,
    tracking_number: '',
    carrier: '',
    vehicle_info: '',
    status: 'pending' as 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled'
  });

  useEffect(() => {
    fetchShipments(statusFilter || undefined);
  }, [statusFilter]);

  const handleEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setFormData({
      order_id: shipment.order_id,
      tracking_number: shipment.tracking_number || '',
      carrier: shipment.carrier || '',
      vehicle_info: shipment.vehicle_info || '',
      status: shipment.status as any
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedShipment(null);
    setFormData({
      order_id: 0,
      tracking_number: '',
      carrier: '',
      vehicle_info: '',
      status: 'pending'
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreating) {
      // Create new shipment
      const result = await createShipment({
        order_id: formData.order_id,
        tracking_number: formData.tracking_number,
        carrier: formData.carrier,
        vehicle_info: formData.vehicle_info
      });
      
      if (result) {
        alert('Envío creado exitosamente');
        setIsCreating(false);
        fetchShipments(statusFilter || undefined);
      }
    } else if (isEditing && selectedShipment) {
      // Update existing shipment
      const result = await updateShipment(selectedShipment.id, {
        tracking_number: formData.tracking_number,
        carrier: formData.carrier,
        vehicle_info: formData.vehicle_info,
        status: formData.status
      });
      
      if (result) {
        alert('Envío actualizado exitosamente');
        setIsEditing(false);
        setSelectedShipment(null);
        fetchShipments(statusFilter || undefined);
      }
    }
  };

  const handleStatusUpdate = async (shipmentId: number, newStatus: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled') => {
    const vehicleInfo = prompt('Información del vehículo (opcional):');
    
    const result = await updateShipmentStatus(shipmentId, {
      status: newStatus,
      vehicle_info: vehicleInfo || undefined
    });

    if (result) {
      alert(`Estado actualizado a: ${newStatus}`);
      fetchShipments(statusFilter || undefined);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      shipped: 'Enviado',
      in_transit: 'En Tránsito',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Envíos</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          + Nuevo Envío
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64"
        >
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="shipped">Enviado</option>
          <option value="in_transit">En Tránsito</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Edit/Create Form */}
      {(isEditing || isCreating) && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? 'Crear Nuevo Envío' : 'Editar Envío'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isCreating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Orden *
                </label>
                <input
                  type="number"
                  required
                  value={formData.order_id || ''}
                  onChange={(e) => setFormData({ ...formData, order_id: parseInt(e.target.value) })}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Seguimiento
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="TRK-123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportista
              </label>
              <input
                type="text"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="DHL, FedEx, UPS, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información del Vehículo
              </label>
              <textarea
                value={formData.vehicle_info}
                onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                rows={3}
                placeholder="Modelo, placa, conductor, etc."
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                >
                  <option value="pending">Pendiente</option>
                  <option value="shipped">Enviado</option>
                  <option value="in_transit">En Tránsito</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                {isCreating ? 'Crear' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setSelectedShipment(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shipments Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando envíos...</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transportista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{shipment.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {shipment.tracking_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.carrier || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(shipment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(shipment)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </button>
                    <select
                      onChange={(e) => handleStatusUpdate(shipment.id, e.target.value as any)}
                      value=""
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Cambiar Estado...</option>
                      <option value="shipped">Marcar Enviado</option>
                      <option value="in_transit">Marcar En Tránsito</option>
                      <option value="delivered">Marcar Entregado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {shipments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay envíos para mostrar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentsManagementPage;
