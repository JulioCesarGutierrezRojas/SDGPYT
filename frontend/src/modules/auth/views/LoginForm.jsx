import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../adapters/auth.controller';
import { showErrorToast, showSuccessToast } from '../../../kernel/alerts';
import { validateLoginForm } from '../../../kernel/validations';
import { useAuth } from '../../../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showErrorToast({
        title: 'Error de validación',
        text: 'Por favor corrige los errores en el formulario',
        timer: 3000
      });
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      // Obtener datos del usuario del response
      const { id, fullName, roles } = response.result;
      
      // Extraer roles como strings desde el formato {role: "ROOT", project: "GLOBAL"}
      const roleStrings = roles.map(roleObj => roleObj.role);
      
      // Establecer usuario en el contexto de autenticación
      const userData = {
        id,
        name: fullName,
        roles: roleStrings, // Ahora son strings como ["ROOT"]
        role: roleStrings.length > 0 ? roleStrings[0] : null // Mantener compatibilidad
      };
      
      authLogin(userData);
      
      showSuccessToast({
        title: 'Inicio de sesión exitoso',
        text: response.text
      });

      // El AuthProvider y PublicRoute se encargarán de la redirección automática
      // No necesitamos redirigir manualmente aquí

    } catch (error) {
      showErrorToast({
        title: 'Error en el inicio de sesión',
        text: error.message
      });
    } finally {
      setIsLoading(false);
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
                placeholder="Correo electrónico"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Input de contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
                placeholder="Contraseña"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
