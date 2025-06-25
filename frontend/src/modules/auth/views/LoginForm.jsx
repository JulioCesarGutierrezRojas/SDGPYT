// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "1234") {
      navigate("/dashboard");
    } else {
      alert("Credenciales inválidas");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con medio círculo */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute bottom-0 left-1/2 w-[100%] h-[200%] bg-[var(--color-azul-300)] rounded-full transform -translate-x-1/2 translate-y-[90%]"></div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
          {/* Círculo para imagen de perfil */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-gris-500)] to-[var(--color-gris-500)] rounded-full flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Iniciar Sesión</h1>

          {/* Línea separadora */}
          <div className="w-95 h-1 bg-[var(--color-gris-500)] mx-auto mb-8 rounded-full"></div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input de correo electrónico */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Input de contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <span className="text-gray-600">¿No tienes cuenta? </span>
              <button
                onClick={handleRegisterClick}
                className="text-[var(--color-azul-900)] hover:text-[var(--color-azul-950)] font-semibold hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Regístrate
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={handleForgotPasswordClick}
                className="text-gray-500 hover:text-gray-700 text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
