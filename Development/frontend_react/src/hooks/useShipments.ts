import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export interface Shipment {
  id: number;
  order_id: number;
  tracking_number?: string;
  carrier?: string;
  vehicle_info?: string;
  status: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentCreate {
  order_id: number;
  tracking_number?: string;
  carrier?: string;
  vehicle_info?: string;
  estimated_delivery?: string;
  status?: 'pending' | 'dispatched' | 'shipped' | 'in_transit' | 'delivered';
}

export interface ShipmentUpdate {
  tracking_number?: string;
  carrier?: string;
  vehicle_info?: string;
  status?: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
}

export interface ShipmentStatusUpdate {
  status: 'pending' | 'dispatched' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  vehicle_info?: string;
}

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = status 
        ? `${API_BASE_URL}/api/v1/shipments?status=${status}`
        : `${API_BASE_URL}/api/v1/shipments`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar los envíos');
      
      const data = await response.json();
      setShipments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getShipmentByOrder = async (orderId: number): Promise<Shipment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shipments/order/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error al cargar el envío');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching shipment:', err);
      return null;
    }
  };

  const getShipmentByTracking = async (trackingNumber: string): Promise<Shipment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shipments/tracking/${trackingNumber}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error al buscar el envío');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const createShipment = async (shipmentData: ShipmentCreate): Promise<Shipment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear el envío');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  const updateShipment = async (
    shipmentId: number, 
    updateData: ShipmentUpdate
  ): Promise<Shipment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shipments/${shipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el envío');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  const updateShipmentStatus = async (
    shipmentId: number,
    statusUpdate: ShipmentStatusUpdate
  ): Promise<Shipment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el estado del envío');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  return {
    shipments,
    loading,
    error,
    fetchShipments,
    getShipmentByOrder,
    getShipmentByTracking,
    createShipment,
    updateShipment,
    updateShipmentStatus,
  };
};
