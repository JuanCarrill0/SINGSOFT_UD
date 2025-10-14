import { ShoppingCart, Search, User, Menu, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
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
            <h1 className="text-xl tracking-tight text-blue-600">SportGear Online</h1>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos deportivos..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
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
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10 w-full"
            />
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
