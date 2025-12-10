import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Phone, 
  Edit, 
  Save,
  X,
  Lock,
  CheckCircle,
  AlertCircle,
  Settings,
  Package,
  LayoutDashboard,
  ClipboardList,
  Truck,
  Users
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface UserData {
  userid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setProfileForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || ''
      });
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.USERS.BASE}/${user.userid}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditingProfile(false);
        setMessage({ type: 'success', text: t('profile.updateProfile') + ' ' + t('common.success').toLowerCase() });
      } else {
        setMessage({ type: 'error', text: data.error || t('common.error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    // Validations
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: t('common.error') });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('profile.newPassword') + ' mínimo 6 caracteres' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: t('common.error') });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.USERS.BASE}/${user.userid}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
        setMessage({ type: 'success', text: t('profile.updatePassword') + ' ' + t('common.success').toLowerCase() });
      } else {
        setMessage({ type: 'error', text: data.error || t('common.error') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: { [key: string]: string } = {
      'SYSTEM_ADMIN': '#3b82f6',
      'STORE_ADMIN': '#a855f7',
      'LOGISTICS_OPERATOR': '#22c55e',
      'FINANCE_MANAGER': '#f97316',
      'CUSTOMER': '#6b7280'
    };

    const roleNames: { [key: string]: string } = {
      'SYSTEM_ADMIN': t('roles.SYSTEM_ADMIN'),
      'STORE_ADMIN': t('roles.STORE_ADMIN'),
      'LOGISTICS_OPERATOR': t('roles.LOGISTICS_OPERATOR'),
      'FINANCE_MANAGER': t('roles.FINANCE_MANAGER'),
      'CUSTOMER': 'Cliente'
    };

    return (
      <Badge style={{ backgroundColor: roleColors[role] || '#6b7280', color: 'white' }}>
        <Shield className="h-3 w-3 mr-1" />
        {roleNames[role] || role}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600 mt-2">{t('profile.personalInfo')}</p>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* User Header Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="mt-3">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Information Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{t('profile.personalInfo')}</h3>
            {!isEditingProfile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditingProfile(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('profile.edit')}
              </Button>
            )}
          </div>

          {!isEditingProfile ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('profile.firstName')}</p>
                <p className="text-base text-gray-900">{user.firstName || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('profile.lastName')}</p>
                <p className="text-base text-gray-900">{user.lastName || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('profile.phone')}</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-base text-gray-900">{user.phoneNumber || 'No especificado'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('profile.dateOfBirth')}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base text-gray-900">{formatDate(user.dateOfBirth)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Miembro desde</p>
                <p className="text-base text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {user.status === 'ACTIVE' ? 'Activo' : user.status}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('profile.firstName')} *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileInputChange}
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('profile.lastName')} *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileInputChange}
                    placeholder="Ingresa tu apellido"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">{t('profile.phone')}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileInputChange}
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">{t('profile.dateOfBirth')}</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t('common.loading') : t('common.save')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditingProfile(false);
                    loadUserData();
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Change Password Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{t('profile.changePassword')}</h3>
              <p className="text-sm text-gray-600 mt-1">Cambia tu contraseña para mantener tu cuenta segura</p>
            </div>
            {!isChangingPassword && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                {t('profile.changePassword')}
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t('profile.currentPassword')} *</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">{t('profile.newPassword')} *</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Mínimo 6 caracteres"
                />
                {passwordForm.newPassword && passwordForm.newPassword.length < 6 && (
                  <p className="text-sm text-red-600 mt-1">La contraseña debe tener al menos 6 caracteres</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">{t('profile.confirmPassword')} *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirma tu nueva contraseña"
                />
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleChangePassword} 
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Admin Quick Access Section */}
        {(user.role === 'SYSTEM_ADMIN' || user.role === 'STORE_ADMIN') && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Panel de Administración</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Accede rápidamente a las funciones administrativas del sistema.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/admin/dashboard')} 
                className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard Administrativo
              </Button>
              <Button 
                onClick={() => navigate('/admin/products')} 
                className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Gestión de Productos
              </Button>
              {user.role === 'SYSTEM_ADMIN' && (
                <Button 
                  onClick={() => navigate('/admin/users')} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gestión de Usuarios
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Operator Quick Access Section */}
        {user.role === 'LOGISTICS_OPERATOR' && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Panel de Operador Logística</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Accede a tus herramientas de gestión de órdenes y envíos.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/admin/orders')} 
                className="w-full bg-green-600 hover:bg-green-700 justify-start"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Gestión de Órdenes
              </Button>
              <Button 
                onClick={() => navigate('/shipments')} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 justify-start"
              >
                <Truck className="h-4 w-4 mr-2" />
                Gestión de Envíos
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            Ver Mis Órdenes
          </Button>
        </div>
      </div>
    </div>
  );
}
