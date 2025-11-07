import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  method: string;
  status: string;
}

export interface PaymentCreate {
  order_id: number;
  amount: number;
  method: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.PAYMENTS.LIST);
      
      if (!response.ok) {
        throw new Error('Error al cargar los pagos');
      }

      const data: Payment[] = await response.json();
      setPayments(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching payments:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPayment = async (paymentId: number): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.PAYMENTS.GET(paymentId));
      
      if (!response.ok) {
        throw new Error('Pago no encontrado');
      }

      const data: Payment = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: PaymentCreate): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.PAYMENTS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al procesar el pago');
      }

      const newPayment: Payment = await response.json();
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.PAYMENTS.DELETE(paymentId), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el pago');
      }

      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting payment:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    fetchPayments,
    getPayment,
    createPayment,
    deletePayment,
  };
}
