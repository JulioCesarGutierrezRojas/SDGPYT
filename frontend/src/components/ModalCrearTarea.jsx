import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { userService } from '../services/userService';

const ModalCrearTarea = ({ visible, onClose, onGuardar, proyectos, usuarios, proyectoId }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    usuario: "",
  });
  const [usuariosProyecto, setUsuariosProyecto] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    if (visible && proyectoId) {
      obtenerUsuariosProyecto();
      setForm({
        nombre: "",
        descripcion: "",
        usuario: "",
      });
    }
  }, [visible, proyectoId]);

  const obtenerUsuariosProyecto = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await userService.getUsersByProject(proyectoId);
      if (response.type === 'SUCCESS' && response.result) {
        setUsuariosProyecto(response.result);
        if (response.result.length > 0) {
          setForm(prev => ({ ...prev, usuario: response.result[0].userId }));
        }
      } else {
        setUsuariosProyecto([]);
      }
    } catch (error) {
      console.error('Error al obtener usuarios del proyecto:', error);
      setUsuariosProyecto([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

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
            <label className="block text-sm font-medium text-gray-700">Responsable</label>
            <select
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              disabled={loadingUsuarios}
              required
              className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)] disabled:opacity-50"
            >
              <option value="">Seleccionar responsable</option>
              {usuariosProyecto.map((usuario) => (
                <option key={usuario.userId} value={usuario.userId}>
                  {usuario.name} {usuario.lastname}
                </option>
              ))}
            </select>
            {loadingUsuarios && (
              <p className="text-xs text-gray-500 mt-1">Cargando usuarios...</p>
            )}
            {!loadingUsuarios && usuariosProyecto.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No hay usuarios asignados a este proyecto</p>
            )}
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
