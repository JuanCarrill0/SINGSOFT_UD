// API Configuration
// Detect if we're running in Docker (nginx proxy) or local development
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// In production (Docker with nginx), use window.location.origin
// In development, use localhost URLs
export const AUTH_API_BASE_URL = isProduction 
  ? window.location.origin 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

export const BUSINESS_API_BASE_URL = isProduction 
  ? window.location.origin 
  : (import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:8000');

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
  },
  PAYMENTS: {
    LIST: `${BUSINESS_API_BASE_URL}/api/v1/payments`,
    CREATE: `${BUSINESS_API_BASE_URL}/api/v1/payments`,
    GET: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/payments/${id}`,
    DELETE: (id: number) => `${BUSINESS_API_BASE_URL}/api/v1/payments/${id}`,
  },
};
