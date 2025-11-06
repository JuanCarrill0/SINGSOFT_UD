import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

interface LoginSuccessPayload {
  token: string;
  user: any;
}

export default function LoginPage({ onSuccess }: { onSuccess?: (data: LoginSuccessPayload) => void }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string, user: any) => {
    onSuccess?.({ token, user });
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="container mx-auto px-10 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Branding header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🏃‍♂️</div>
              <h2 className="text-2xl mb-2">SportGear Online</h2>
              <p className="text-sm text-gray-600">Tu tienda de equipamiento deportivo</p>
            </div>
            
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
