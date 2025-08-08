import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalCrearTarea = ({ visible, onClose, onGuardar, proyectos, usuarios }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estatus: "activo",
    proyecto: proyectos?.[0]?.id || "",
    usuario: usuarios?.[0]?.id || "",
  });

  useEffect(() => {
    if (visible) {
      setForm({
        nombre: "",
        descripcion: "",
        estatus: "activo",
        proyecto: proyectos?.[0]?.id || "",
        usuario: usuarios?.[0]?.id || "",
      });
    }
  }, [visible, proyectos, usuarios]);

  if (!visible) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onGuardar(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg border border-[var(--color-azul-300)] w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[var(--color-azul-950)]">
          Crear nueva tarea
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estatus</label>
            <select
              name="estatus"
              value={form.estatus}
              onChange={handleChange}
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Proyecto</label>
            <select
              name="proyecto"
              value={form.proyecto}
              onChange={handleChange}
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            >
              {proyectos.map((proyecto) => (
                <option key={proyecto.id} value={proyecto.id}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <select
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-[var(--color-azul-600)] text-white px-4 py-2 rounded hover:bg-[var(--color-azul-700)]"
            >
              Guardar tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearTarea;
