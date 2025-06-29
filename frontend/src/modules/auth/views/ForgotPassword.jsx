// src/modules/auth/views/ForgotPassword.jsx
import { useState } from "react";
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Se ha enviado un token a ${email}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con medio círculo */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute bottom-0 left-1/2 w-full h-[200%] bg-[var(--color-azul-300)] rounded-full transform -translate-x-1/2 translate-y-[90%]"></div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100 min-h-[520px] flex flex-col justify-center">
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            ¿Deseas recuperar tu contraseña?
          </h1>

          {/* Texto explicativo */}
          <p className="text-gray-600 text-center mb-10 leading-relaxed">
            Ingresa tu correo electrónico y enseguida recibirás un token.
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-azul-900)] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
              Restablecer contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
