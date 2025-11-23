import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  brand?: string;
  sport?: string;
  gender?: string;
  in_stock: boolean;
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductDisplay extends Product {
  image: string;
  rating: number;
  oldPrice?: number;
  inStock: boolean;
}

export interface ProductFilters {
  searchQuery?: string;
  category?: string;
  brand?: string;
  sport?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

// Mapa de imágenes por categoría
const categoryImages: Record<string, string> = {
  'Football': 'https://images.unsplash.com/photo-1587103365297-77661edc549d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbCUyMGJhbGx8ZW58MXx8fHwxNzYwNDA1NzY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Basketball': 'https://images.unsplash.com/photo-1751010942953-e48cb4b2ccf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc3BvcnRzfGVufDF8fHx8MTc2MDMzOTkwOHww&ixlib=rb-4.1.0&q=80&w=1080',
  'Footwear': 'https://images.unsplash.com/photo-1758646119420-12488edce72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYwNDA1NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Fitness': 'https://images.unsplash.com/photo-1649068618811-9f3547ef98fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDM3MDA0OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'Tennis': 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjByYWNrZXR8ZW58MXx8fHwxNzYwMzk5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'default': 'https://images.unsplash.com/photo-1587350866945-5aa311427deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwYmljeWNsZXxlbnwxfHx8fDE3NjA0MDU3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters?.searchQuery, filters?.category, filters?.brand, filters?.sport, filters?.gender, filters?.minPrice, filters?.maxPrice, filters?.inStockOnly]);

  const fetchProducts = async (searchFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros de búsqueda
      let url = API_ENDPOINTS.PRODUCTS.LIST;
      
      if (searchFilters && Object.keys(searchFilters).length > 0) {
        // Usar endpoint de búsqueda si hay filtros
        const params = new URLSearchParams();
        
        if (searchFilters.searchQuery) params.append('q', searchFilters.searchQuery);
        if (searchFilters.category) params.append('category', searchFilters.category);
        if (searchFilters.brand) params.append('brand', searchFilters.brand);
        if (searchFilters.sport) params.append('sport', searchFilters.sport);
        if (searchFilters.gender) params.append('gender', searchFilters.gender);
        if (searchFilters.minPrice !== undefined) params.append('min_price', searchFilters.minPrice.toString());
        if (searchFilters.maxPrice !== undefined) params.append('max_price', searchFilters.maxPrice.toString());
        if (searchFilters.inStockOnly) params.append('in_stock', 'true');
        
        url = `${API_ENDPOINTS.PRODUCTS.LIST}/search?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data: Product[] = await response.json();

      // Transformar los productos del backend al formato del frontend
      const transformedProducts: ProductDisplay[] = data.map((product) => ({
        ...product,
        // Asignar imagen según categoría
        image: categoryImages[product.category] || categoryImages['default'],
        // Convertir in_stock a inStock
        inStock: product.in_stock,
        // Rating aleatorio entre 4-5 estrellas (puedes agregarlo al backend después)
        rating: Math.random() > 0.5 ? 5 : 4,
        // Convertir precio de decimal a entero si es necesario
        price: Math.round(product.price),
      }));

      setProducts(transformedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = (newFilters?: ProductFilters) => {
    fetchProducts(newFilters);
  };

  const searchProducts = (searchFilters: ProductFilters) => {
    fetchProducts(searchFilters);
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
    searchProducts,
  };
}
