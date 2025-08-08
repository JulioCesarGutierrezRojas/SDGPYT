import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalEditarProyecto({ proyecto, onClose, onGuardar }) {
    const [proyectoEditado, setProyectoEditado] = useState({
        nombre: "",
        abreviacion: "",
        descripcion: "",
        estatus: "Habilitado",
    });

    useEffect(() => {
        if (proyecto) {
            setProyectoEditado(proyecto);
        }
    }, [proyecto]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProyectoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (proyectoEditado.nombre.trim()) {
            onGuardar(proyectoEditado);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg border border-[var(--color-azul-300)] w-full max-w-md p-6 relative">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-[var(--color-azul-950)] mb-4">
                    Editar Proyecto
                </h2>

                <div className="space-y-3 text-sm">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={proyectoEditado.nombre}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Abreviación</label>
                        <input
                            type="text"
                            name="abreviacion"
                            value={proyectoEditado.abreviacion}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={proyectoEditado.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Estatus</label>
                        <select
                            name="estatus"
                            value={proyectoEditado.estatus}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="Habilitado">Habilitado</option>
                            <option value="Deshabilitado">Deshabilitado</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-white font-medium rounded"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}