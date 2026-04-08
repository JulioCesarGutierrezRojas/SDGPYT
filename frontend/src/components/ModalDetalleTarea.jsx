import { useState, useEffect } from "react";
import { X, Trash2, Save, Edit3, User, AlertTriangle } from "lucide-react";
import { userService } from '../services/userService';

const ModalDetalleTarea = ({ tarea, onClose, onEliminar, onGuardar, usuarios = [], proyectoId }) => {
  const [tareaEditable, setTareaEditable] = useState({ ...tarea });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usuariosProyecto, setUsuariosProyecto] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    setTareaEditable({ ...tarea });
    setIsEditing(false);
    setShowDeleteConfirm(false);
    if (proyectoId) {
      obtenerUsuariosProyecto();
    }
  }, [tarea, proyectoId]);

  const obtenerUsuariosProyecto = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await userService.getUsersByProject(proyectoId);
      if (response.type === 'SUCCESS' && response.result) {
        setUsuariosProyecto(response.result);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTareaEditable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickChange = (e) => {
    const { name, value } = e.target;
    const updatedTarea = {
      ...tareaEditable,
      [name]: value,
    };
    setTareaEditable(updatedTarea);
    // Auto-guardar cambios inmediatamente
    onGuardar(updatedTarea);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tareaEditable.titulo || !tareaEditable.titulo.trim()) return;
    
    onGuardar(tareaEditable);
    setIsEditing(false);
  };

  const handleEliminar = () => {
    onEliminar(tarea.id);
    setShowDeleteConfirm(false);
  };

  const hasChanges = JSON.stringify(tareaEditable) !== JSON.stringify(tarea);

  if (!tarea) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg border border-[var(--color-azul-300)] w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[var(--color-azul-950)]">
          {isEditing ? "Editar tarea" : "Detalle de tarea"}
        </h2>

        {!showDeleteConfirm ? (
          <>
            {isEditing ? (
              /* Modo Edición - Formulario */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    name="titulo"
                    value={tareaEditable.titulo || ''}
                    onChange={handleChange}
                    required
                    className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={tareaEditable.descripcion || ''}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-[var(--color-gris-600)] rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-600)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsable
                  </label>
                  <select
                    name="usuario"
                    value={tareaEditable.usuario || ''}
                    onChange={handleChange}
                    required
                    disabled={loadingUsuarios}
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


                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTareaEditable({ ...tarea });
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[var(--color-azul-600)] text-white py-2 rounded hover:bg-[var(--color-azul-800)] transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            ) : (
              /* Modo Vista - Solo lectura */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-[var(--color-gris-600)] rounded text-gray-900">
                    {tarea.titulo}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-[var(--color-gris-600)] rounded text-gray-900 min-h-[80px]">
                    {tarea.descripcion || 'Sin descripción'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsable
                  </label>
                  <select
                    name="usuario"
                    value={tareaEditable.usuario || ''}
                    onChange={handleQuickChange}
                    required
                    disabled={loadingUsuarios}
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


                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-[var(--color-azul-600)] text-white py-2 rounded hover:bg-[var(--color-azul-800)] transition-colors"
                  >
                    Editar tarea
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Eliminar tarea
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Confirmación de eliminación */
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-medium">¿Eliminar esta tarea?</h3>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetalleTarea;
