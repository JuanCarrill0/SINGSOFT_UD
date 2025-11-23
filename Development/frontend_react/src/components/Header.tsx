import { ShoppingCart, Search, User, Menu, Heart, LogOut, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, KeyboardEvent } from "react";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ cartItemsCount, onCartClick, onLoginClick, isLoggedIn, userEmail, onLogout, onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top banner */}
      <div className="bg-black text-white py-2 px-4 text-center">
        <p className="text-sm">🔥 Envío gratis en compras superiores a $50.000</p>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <a href="/"><h1 className="text-xl tracking-tight text-blue-600">SportGear Online</h1></a>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar productos deportivos..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button onClick={handleSearch} size="sm">
                Buscar
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Hola, {userEmail?.split('@')[0]}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate('/orders')} title="Mis Órdenes">
                  <Package className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={onLoginClick}>
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Nuevo
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Hombre
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Mujer
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Calzado
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Equipamiento
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">
                Marcas
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-red-600 hover:text-red-700 transition-colors">
                Ofertas
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
