import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Users, 
  Search, 
  Shield, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  ArrowLeft,
  Info,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useUsers, UserData } from '../hooks/useUsers';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    updateUserRole, 
    updateUserStatus,
    getUserStats 
  } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState({ total: 0, roleStats: {}, statusStats: {} });

  // Check if user is admin
  const checkIfAdmin = (): boolean => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      const userEmail = user.email || '';
      const userRole = user.role || '';
      
      // Check if user is admin by email or role
      return userEmail === 'admin@sportgear.com' || 
             userEmail.includes('admin') || 
             userRole === 'SYSTEM_ADMIN' ||
             userRole === 'STORE_ADMIN';
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return false;
    }
  };

  const isAdmin = checkIfAdmin();

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      await fetchUsers({ search: searchQuery, role: roleFilter, status: statusFilter });
    } catch (err) {
      showMessage('error', 'Error cargando usuarios');
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEditRole = (user: UserData) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    try {
      await updateUserRole(selectedUser.userid, editRole);
      showMessage('success', 'Rol actualizado correctamente');
      setShowEditModal(false);
      loadUsers();
      loadStats();
    } catch (err) {
      showMessage('error', 'Error actualizando el rol');
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      await updateUserStatus(user.userid, newStatus);
      showMessage('success', `Usuario ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente`);
      loadUsers();
      loadStats();
    } catch (err) {
      showMessage('error', 'Error cambiando el estado del usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleStyles: Record<string, { bg: string; label: string }> = {
      'CUSTOMER': { bg: '#3b82f6', label: 'Cliente' }, // blue-500
      'LOGISTICS_OPERATOR': { bg: '#a855f7', label: 'Operador Logística' }, // purple-500
      'STORE_ADMIN': { bg: '#22c55e', label: 'Admin Tienda' }, // green-500
      'FINANCE_MANAGER': { bg: '#f97316', label: 'Gerente Finanzas' }, // orange-500
      'SYSTEM_ADMIN': { bg: '#ef4444', label: 'Admin Sistema' }, // red-500
    };

    const config = roleStyles[role] || { bg: '#6b7280', label: role }; // gray-500
    
    return (
      <span 
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white"
        style={{ backgroundColor: config.bg }}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; label: string; icon: React.ComponentType<any> }> = {
      'ACTIVE': { bg: '#22c55e', label: 'Activo', icon: UserCheck }, // green-500
      'INACTIVE': { bg: '#6b7280', label: 'Inactivo', icon: UserX }, // gray-500
      'PENDING': { bg: '#eab308', label: 'Pendiente', icon: Clock }, // yellow-500
      'SUSPENDED': { bg: '#ef4444', label: 'Suspendido', icon: XCircle }, // red-500
    };

    const config = statusStyles[status] || { bg: '#6b7280', label: status, icon: Info };
    const Icon = config.icon;
    
    return (
      <span 
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium gap-1 text-white"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Alert className="bg-red-50 border-red-200">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              No tienes permisos para acceder a esta sección.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel de Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-2">Administra usuarios y sus roles</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">{(stats.statusStats as any)?.ACTIVE || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold">{(stats.roleStats as any)?.SYSTEM_ADMIN || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operadores</p>
                <p className="text-2xl font-bold">{(stats.roleStats as any)?.LOGISTICS_OPERATOR || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por email, nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todos los roles</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="LOGISTICS_OPERATOR">Operador Logística</option>
                <option value="STORE_ADMIN">Admin Tienda</option>
                <option value="FINANCE_MANAGER">Gerente Finanzas</option>
                <option value="SYSTEM_ADMIN">Admin Sistema</option>
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="PENDING">Pendiente</option>
                <option value="SUSPENDED">Suspendido</option>
              </select>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('');
                setStatusFilter('');
                loadUsers();
              }}
            >
              Limpiar filtros
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadUsers}
            >
              <Filter className="h-4 w-4 mr-2" />
              Aplicar filtros
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Cargando usuarios...</p>
          </Card>
        ) : error ? (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        ) : users.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron usuarios</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Usuario</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Rol</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Estado</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Último Login</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userid} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">ID: {user.userid.substring(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(user)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(user)}
                            title="Editar rol"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            title={user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                          >
                            {user.status === 'ACTIVE' ? 
                              <ToggleRight className="h-4 w-4 text-green-600" /> : 
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            }
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Editar Rol de Usuario</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Usuario:</p>
                <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nuevo Rol</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="CUSTOMER">Cliente</option>
                  <option value="LOGISTICS_OPERATOR">Operador Logística</option>
                  <option value="STORE_ADMIN">Admin Tienda</option>
                  <option value="FINANCE_MANAGER">Gerente Finanzas</option>
                  <option value="SYSTEM_ADMIN">Admin Sistema</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveRole} disabled={loading}>
                  Guardar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Detalles del Usuario</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID de Usuario</p>
                  <p className="font-mono text-sm">{selectedUser.userid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{selectedUser.phoneNumber || 'No proporcionado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('es-ES') : 'No proporcionada'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Registro</p>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Último Login</p>
                  <p className="font-medium">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('es-ES') : 'Nunca'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-2">Acciones</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEditRole(selectedUser);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Rol
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleToggleStatus(selectedUser);
                    }}
                  >
                    {selectedUser.status === 'ACTIVE' ? 
                      <>
                        <ToggleLeft className="h-4 w-4 mr-2" />
                        Desactivar
                      </> : 
                      <>
                        <ToggleRight className="h-4 w-4 mr-2" />
                        Activar
                      </>
                    }
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Role Information */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Información de Roles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getRoleBadge('CUSTOMER')}
              </div>
              <p className="text-sm text-gray-600">Usuarios regulares con acceso básico a la tienda</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getRoleBadge('LOGISTICS_OPERATOR')}
              </div>
              <p className="text-sm text-gray-600">Gestión de órdenes y envíos</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getRoleBadge('STORE_ADMIN')}
              </div>
              <p className="text-sm text-gray-600">Administración de productos y tienda</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getRoleBadge('FINANCE_MANAGER')}
              </div>
              <p className="text-sm text-gray-600">Gestión de pagos y finanzas</p>
            </div>
            <div className="border rounded-lg p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                {getRoleBadge('SYSTEM_ADMIN')}
              </div>
              <p className="text-sm text-gray-600">Control total del sistema, gestión de usuarios y configuración</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
