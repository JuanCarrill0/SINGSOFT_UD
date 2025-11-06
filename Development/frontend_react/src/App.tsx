import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from "./components/Header";
import { Cart } from "./components/Cart";
import { Footer } from "./components/Footer";
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const products = [
  {
    id: 1,
    name: "Zapatillas Running Pro Elite - Alta Performance",
    price: 89900,
    oldPrice: 129900,
    category: "Calzado",
    rating: 5,
    image: "https://images.unsplash.com/photo-1758646119420-12488edce72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYwNDA1NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 2,
    name: "Set Completo Equipamiento Gimnasio - Mancuernas Ajustables",
    price: 145000,
    category: "Fitness",
    rating: 5,
    image: "https://images.unsplash.com/photo-1649068618811-9f3547ef98fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2MDM3MDA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 3,
    name: "Balón Fútbol Profesional - Tamaño Oficial FIFA",
    price: 45000,
    oldPrice: 65000,
    category: "Deportes",
    rating: 4,
    image: "https://images.unsplash.com/photo-1587103365297-77661edc549d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbCUyMGJhbGx8ZW58MXx8fHwxNzYwNDA1NzY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 4,
    name: "Balón Basketball Premium - Material Sintético Duradero",
    price: 52000,
    category: "Deportes",
    rating: 5,
    image: "https://images.unsplash.com/photo-1751010942953-e48cb4b2ccf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc3BvcnRzfGVufDF8fHx8MTc2MDMzOTkwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: false,
  },
  {
    id: 5,
    name: "Raqueta de Tenis Profesional - Fibra de Carbono",
    price: 185000,
    oldPrice: 250000,
    category: "Deportes",
    rating: 5,
    image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjByYWNrZXR8ZW58MXx8fHwxNzYwMzk5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 6,
    name: "Conjunto Deportivo Completo - Ropa Activewear Premium",
    price: 75000,
    category: "Ropa",
    rating: 4,
    image: "https://images.unsplash.com/photo-1645207803533-e2cfe1382f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZyUyMGFjdGl2ZXdlYXJ8ZW58MXx8fHwxNzYwNDA1NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 7,
    name: "Bicicleta de Montaña - 21 Velocidades Todo Terreno",
    price: 450000,
    oldPrice: 600000,
    category: "Ciclismo",
    rating: 5,
    image: "https://images.unsplash.com/photo-1587350866945-5aa311427deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwYmljeWNsZXxlbnwxfHx8fDE3NjA0MDU3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 8,
    name: "Colchoneta de Yoga Premium - Antideslizante Ecológica",
    price: 35000,
    category: "Fitness",
    rating: 5,
    image: "https://images.unsplash.com/photo-1601925268030-e734cf5bdc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzcyUyMG1hdHxlbnwxfHx8fDE3NjA0MDU3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 9,
    name: "Set de Mancuernas Hexagonales - 5kg a 25kg",
    price: 125000,
    category: "Fitness",
    rating: 5,
    image: "https://images.unsplash.com/photo-1592494624782-b5bee232f156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW1iYmVsbHMlMjB3ZWlnaHRzfGVufDF8fHx8MTc2MDQwNTc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 10,
    name: "Gafas de Natación Profesionales - Anti-Fog UV Protection",
    price: 28000,
    oldPrice: 42000,
    category: "Natación",
    rating: 4,
    image: "https://images.unsplash.com/photo-1747494749148-c3f5018799c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMGdvZ2dsZXMlMjBwb29sfGVufDF8fHx8MTc2MDM5MDQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 11,
    name: "Guantes de Boxeo Profesionales - Cuero Sintético 12oz",
    price: 68000,
    category: "Deportes",
    rating: 5,
    image: "https://images.unsplash.com/photo-1622599518895-be813cc42628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3hpbmclMjBnbG92ZXMlMjBzcG9ydHN8ZW58MXx8fHwxNzYwNDA1NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
  {
    id: 12,
    name: "Zapatillas Training CrossFit - Máxima Estabilidad",
    price: 95000,
    category: "Calzado",
    rating: 4,
    image: "https://images.unsplash.com/photo-1758646119420-12488edce72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYwNDA1NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    inStock: true,
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartItemsCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => navigate('/login')}
        isLoggedIn={isLoggedIn}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
      <div className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onSuccess={({ token, user }) => handleLoginSuccess(token, user)} />}
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                viewMode={viewMode}
                setViewMode={setViewMode}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      {/* Legacy modal removed from routing version */}
    </div>
  );
}

