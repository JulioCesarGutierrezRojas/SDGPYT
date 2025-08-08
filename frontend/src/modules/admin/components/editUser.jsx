import { useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    apellidos: user.apellidos || "",
    email: user.email || "",
    nombre: user.nombre || "",
    telefono: user.telefono || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return createPortal(
    <>
      {/* Fondo del modal */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6 w-full max-w-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Editar Usuario</h1>
            <p className="text-gray-600">Modifique los campos necesarios y guarde los cambios.</p>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Apellidos */}
            <div>
              <label htmlFor="apellidos" className="block text-sm font-semibold text-gray-700 mb-2">
                Apellidos *
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Ej. Díaz Ortiz"
                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="correo@ejemplo.com"
                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ej. Mario Alonso"
                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="777 123 4567"
                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--color-azul-600)] text-white font-semibold rounded-lg hover:bg-cyan-400 transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EditUserModal;
