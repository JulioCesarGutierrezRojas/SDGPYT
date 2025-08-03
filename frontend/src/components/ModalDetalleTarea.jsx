import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

const ModalDetalleTarea = ({ tarea, onClose, onEliminar, onGuardar }) => {
  const [tareaEditable, setTareaEditable] = useState({ ...tarea });

  useEffect(() => {
    setTareaEditable({ ...tarea });
  }, [tarea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTareaEditable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    onGuardar(tareaEditable);
  };

  if (!tarea) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-[var(--color-azul-300)]">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título editable */}
        <input
          type="text"
          name="titulo"
          value={tareaEditable.titulo}
          onChange={handleChange}
          className="text-xl font-bold text-[var(--color-azul-950)] mb-3 w-full bg-transparent border-b border-gray-300 focus:outline-none"
        />

        {/* Campos editables */}
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Descripción:</span>
            <textarea
              name="descripcion"
              value={tareaEditable.descripcion}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded resize-none"
              rows={3}
            />
          </div>
          <div>
            <span className="font-semibold">Responsable:</span>
            <input
              name="responsable"
              value={tareaEditable.responsable}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <span className="font-semibold">Proyecto:</span>
            <input
              name="proyecto"
              value={tareaEditable.proyecto}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <span className="font-semibold">Categoría:</span>
            <input
              name="categoria"
              value={tareaEditable.categoria}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <span className="font-semibold">Usuario:</span>
            <input
              name="usuario"
              value={tareaEditable.usuario}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <span className="font-semibold">Estatus:</span>
            <select
              name="estatus"
              value={tareaEditable.estatus}
              onChange={handleChange}
              className="w-full mt-1 p-1 border border-gray-300 rounded"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleGuardar}
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Guardar cambios
          </button>
          <button
            onClick={() => onEliminar(tarea.id)}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            <Trash2 className="w-4 h-4 inline-block mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleTarea;
