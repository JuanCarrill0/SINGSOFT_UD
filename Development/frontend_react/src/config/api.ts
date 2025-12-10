// API Configuration
// Detect if we're running in Docker (nginx proxy) or local development
const isProduction = import.meta.env.PROD;

// In production (Docker with nginx), use window.location.origin
// In development, use localhost URLs
export const AUTH_API_BASE_URL = isProduction 
  ? window.location.origin 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

// In dev, use the host-mapped port (8001) for direct container access
// In production (Docker), use nginx proxy at window.location.origin
export const BUSINESS_API_BASE_URL = isProduction 
  ? window.location.origin 
  : (import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:8001');

// Export API_BASE_URL as alias for backward compatibility
export const API_BASE_URL = BUSINESS_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${AUTH_API_BASE_URL}/api/auth/login`,
    REGISTER: `${AUTH_API_BASE_URL}/api/auth/register`,
  },
  PRODUCTS: {
    LIST: `${BUSINESS_API_BASE_URL}/api/v1/products`,
    GET: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/products/${id}`,
  },
  ORDERS: {
    LIST: `${BUSINESS_API_BASE_URL}/api/v1/orders`,
    CREATE: `${BUSINESS_API_BASE_URL}/api/v1/orders`,
    GET: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/orders/${id}`,
    UPDATE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/orders/${id}`,
    DELETE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/orders/${id}`,
    CANCEL: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/orders/${id}/cancel`,
  },
  PAYMENTS: {
    LIST: `${BUSINESS_API_BASE_URL}/api/v1/payments`,
    CREATE: `${BUSINESS_API_BASE_URL}/api/v1/payments`,
    GET: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/payments/${id}`,
    DELETE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/payments/${id}`,
  },
  SHIPMENTS: {
    LIST: `${BUSINESS_API_BASE_URL}/api/v1/shipments`,
    CREATE: `${BUSINESS_API_BASE_URL}/api/v1/shipments`,
    GET: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/${id}`,
    GET_BY_ORDER: (orderId: number) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/order/${orderId}`,
    GET_BY_TRACKING: (trackingNumber: string) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/tracking/${trackingNumber}`,
    UPDATE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/${id}`,
    UPDATE_STATUS: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/${id}/status`,
    DELETE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/shipments/${id}`,
  },
  USERS: {
    BASE: `${AUTH_API_BASE_URL}/api/users`,
    GET: (id: string) => `${AUTH_API_BASE_URL}/api/users/${id}`,
    UPDATE_ROLE: (id: string) => `${AUTH_API_BASE_URL}/api/users/${id}/role`,
    UPDATE_STATUS: (id: string) => `${AUTH_API_BASE_URL}/api/users/${id}/status`,
    UPDATE_PROFILE: (id: string) => `${AUTH_API_BASE_URL}/api/users/${id}/profile`,
    UPDATE_PASSWORD: (id: string) => `${AUTH_API_BASE_URL}/api/users/${id}/password`,
    STATS: `${AUTH_API_BASE_URL}/api/users/stats`,
  },
};
