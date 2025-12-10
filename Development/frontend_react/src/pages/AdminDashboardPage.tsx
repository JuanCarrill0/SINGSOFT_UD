import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Shield,
  ArrowRight,
  Settings,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Check if user is admin
      // For now, check based on email domain or specific email
      checkIfAdmin(userData);
    }
  }, []);

  const checkIfAdmin = (userData: any) => {
    // In production, this should come from the JWT token or API call
    // For now, we'll use email-based detection
    if (userData.email === 'admin@sportgear.com' || userData.email.includes('admin')) {
      setIsAdmin(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos de administrador para acceder a esta página.</p>
          <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <p className="text-gray-600">Bienvenido, {user.firstName || 'Administrador'}</p>
        </div>

        {/* Admin Badge */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Rol: Administrador del Sistema</h3>
                <p className="text-sm text-gray-600">Control total sobre productos, usuarios y configuración</p>
              </div>
            </div>
            <Badge className="bg-blue-600">Admin</Badge>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Órdenes</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold">$--</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Product Management */}
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/admin/products')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestión de Productos</h3>
            <p className="text-gray-600 mb-4">
              Crear, editar y eliminar productos del catálogo. Administrar inventario y precios.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">CRUD Completo</Badge>
              <Badge variant="secondary">Control de Stock</Badge>
              <Badge variant="secondary">Categorías</Badge>
            </div>
          </Card>

          {/* User Management */}
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate('/admin/users')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestión de Usuarios</h3>
            <p className="text-gray-600 mb-4">
              Administrar usuarios del sistema, asignar roles y gestionar permisos.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Ver Usuarios</Badge>
              <Badge variant="secondary">Asignar Roles</Badge>
              <Badge variant="secondary">Permisos</Badge>
            </div>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold">Reportes</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Análisis y métricas del negocio</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Próximamente
            </Button>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold">Configuración</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Ajustes del sistema</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Próximamente
            </Button>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold">Analytics</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Estadísticas avanzadas</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Próximamente
            </Button>
          </Card>
        </div>

        {/* Audit Log Preview */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Registro de Auditoría (Próximamente)</h3>
          <p className="text-gray-600 mb-4">
            Aquí se mostrarán los cambios realizados en productos y usuarios para mantener un registro completo de las acciones administrativas.
          </p>
          <div className="text-sm text-gray-500">
            <p>• Creación de productos</p>
            <p>• Modificaciones de inventario</p>
            <p>• Cambios en usuarios y roles</p>
            <p>• Eliminaciones</p>
          </div>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard Principal
          </Button>
        </div>
      </div>
    </div>
  );
}
