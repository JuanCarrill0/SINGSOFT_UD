import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';
import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  requireAuth = true 
}) => {
  const navigate = useNavigate();
  
  // Check authentication
  const authToken = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  
  if (requireAuth && !authToken) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, just check auth
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check roles
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = user.role || 'CUSTOMER';
      
      if (allowedRoles.includes(userRole)) {
        return <>{children}</>;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }

  // Access denied
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Alert className="bg-red-50 border-red-200">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Acceso Denegado:</strong> No tienes permisos para acceder a esta sección.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => navigate('/dashboard')}>
            Ir al Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
};
