import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface Order {
  id: number;
  user_id: string;
  total: number;
  status: string;
  shipping_address?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderCreate {
  user_id: string;
  total: number;
  shipping_address?: string;
}

export interface OrderUpdate {
  status?: string;
  shipping_address?: string;
  total?: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = userId 
        ? `${API_ENDPOINTS.ORDERS.LIST}?user_id=${userId}`
        : API_ENDPOINTS.ORDERS.LIST;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar las órdenes');
      }

      const data: Order[] = await response.json();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: number): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.ORDERS.GET(orderId));
      
      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }

      const data: Order = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: OrderCreate, token: string): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al crear la orden');
      }

      const newOrder: Order = await response.json();
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (
    orderId: number, 
    updates: OrderUpdate
  ): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.ORDERS.UPDATE(orderId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la orden');
      }

      const updatedOrder: Order = await response.json();
      setOrders(prev => 
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.ORDERS.DELETE(orderId), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la orden');
      }

      setOrders(prev => prev.filter(order => order.id !== orderId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting order:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
