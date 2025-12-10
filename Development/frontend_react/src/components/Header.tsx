import { ShoppingCart, Search, User, Menu, Heart, LogOut, Package, Truck, ClipboardList, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, KeyboardEvent } from "react";
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
  
  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };
  
  // Get user role from localStorage
  const getUserRole = (): string => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 'CUSTOMER';
    try {
      const user = JSON.parse(userStr);
      return user.role || 'CUSTOMER';
    } catch (e) {
      return 'CUSTOMER';
    }
  };

  const userRole = getUserRole();
  const isOperator = userRole === 'LOGISTICS_OPERATOR' || userRole === 'SYSTEM_ADMIN';
  const isAdmin = userRole === 'SYSTEM_ADMIN' || userRole === 'STORE_ADMIN';
  
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
        <p className="text-sm">🔥 {i18n.language === 'es' ? 'Envío gratis en compras superiores a $50.000' : 'Free shipping on orders over $50,000'}</p>
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
                  placeholder={t('products.search')}
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button onClick={handleSearch} size="sm">
                {t('common.search')}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle Button - Llamativo */}
            <Button
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-black hover:text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
              title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Languages className="h-4 w-4" />
              <span className="uppercase font-bold">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
            </Button>
            
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="text-gray-600">{i18n.language === 'es' ? 'Hola' : 'Hello'}, {userEmail?.split('@')[0]}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} title={t('nav.profile')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/orders')} title={t('nav.orders')}>
                  <Package className="h-5 w-5" />
                </Button>
                {isOperator && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')} title={t('nav.orderManagement')}>
                      <ClipboardList className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/shipments')} title={t('nav.shipments')}>
                      <Truck className="h-5 w-5" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={onLogout} title={t('nav.logout')}>
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
            {/* Mobile Language Toggle */}
            <Button
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-black hover:text-white border-0 hover:from-blue-600 hover:to-purple-700 px-3 shadow-md hover:shadow-lg font-semibold"
              title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Languages className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t('products.search')}
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
