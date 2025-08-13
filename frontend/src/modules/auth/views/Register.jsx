import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone } from "lucide-react";
import { register } from '../adapters/auth.controller';
import { showErrorToast, showSuccessToast } from '../../../kernel/alerts';
import { validateRegisterForm } from '../../../kernel/validations';

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Función para limpiar errores cuando el usuario empieza a escribir
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateRegisterForm(nombre, apellido, email, phoneNumber, password, confirmPassword);
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
      const response = await register(nombre, apellido, email, phoneNumber, password);
      
      showSuccessToast({
        title: 'Registro exitoso',
        text: response.text,
        timer: 3000
      });

      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      showErrorToast({
        title: 'Error en el registro',
        text: error.message,
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con medio círculo */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute bottom-0 left-1/2 w-full h-[200%] bg-[var(--color-azul-300)] rounded-full transform -translate-x-1/2 translate-y-[90%]"></div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100 min-h-[600px] flex flex-col justify-center">
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Registro
          </h1>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  clearFieldError('name');
                }}
                placeholder="Nombre"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Apellido */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  clearFieldError('lastname');
                }}
                placeholder="Apellido"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.lastname ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
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

            {/* Teléfono */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  clearFieldError('phoneNumber');
                }}
                placeholder="Número de teléfono"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                placeholder="Contraseña"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError('confirmPassword');
                }}
                placeholder="Confirmar contraseña"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
