import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert(`Registro exitoso para ${nombre} ${apellido}`);
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
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Apellido */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Email */}
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

            {/* Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
