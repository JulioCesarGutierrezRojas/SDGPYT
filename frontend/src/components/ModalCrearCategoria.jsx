import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalCrearCategoria = ({ visible, onClose, onGuardar, categoriaEditar }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estatus: "activo",
  });

  // Carga datos al editar
  useEffect(() => {
    if (categoriaEditar) {
      setForm({
        nombre: categoriaEditar.nombre || "",
        descripcion: categoriaEditar.descripcion || "",
        estatus: categoriaEditar.estatus || "activo",
      });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        estatus: "activo",
      });
    }
  }, [categoriaEditar]);

  if (!visible) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;

    // Aquí mandas el form al padre, y también el id si es edición
    onGuardar({
      ...form,
      id: categoriaEditar?.id || Date.now().toString(),
    });

    // Limpiar y cerrar
    setForm({ nombre: "", descripcion: "", estatus: "activo" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[var(--color-azul-950)]">
          {categoriaEditar ? "Editar categoría" : "Crear nueva categoría"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estatus
            </label>
            <select
              name="estatus"
              value={form.estatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-azul-600)] text-white py-2 rounded hover:bg-[var(--color-azul-700)] transition-colors"
          >
            Guardar categoría
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearCategoria;
