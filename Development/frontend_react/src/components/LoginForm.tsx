import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { API_ENDPOINTS } from "../config/api";

interface LoginFormProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? API_ENDPOINTS.AUTH.REGISTER : API_ENDPOINTS.AUTH.LOGIN;
      const body = isRegister
        ? {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Persist session
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dateOfBirth: "",
        });
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full px-6">
      <div className="mb-4">
        <h1 className="text-3xl mb-1">
          {isRegister ? t('auth.register') : t('auth.login')}
        </h1>
        <p className="text-gray-600">
          {isRegister 
            ? (t('auth.noAccount') || "Completa tus datos para registrarte")
            : (t('auth.hasAccount') || "Ingresa tus credenciales para acceder")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="firstName">{t('profile.firstName')}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Juan"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">{t('profile.lastName')}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Pérez"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">{t('profile.phone')}</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+57 300 123 4567"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">{t('profile.dateOfBirth')}</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="tu@email.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="••••••••"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            <strong className="font-semibold">{t('common.error')}: </strong>
            <span>{error}</span>
          </div>
        )}
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? t('common.loading') : isRegister ? t('auth.register') : t('auth.login')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
        </Button>
      </form>
    </div>
  );
}
