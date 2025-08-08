import { useState, useEffect } from "react";
import { User2, FolderKanban} from "lucide-react";
import { FaExpand } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ListarCategoriasUsuario = () => {
  const { proyectoId } = useParams();
  const nombreProyecto = "IMG";

  const [categorias] = useState([
    { id: "backlog", nombre: "Backlog", descripcion: "Tareas iniciales", estatus: "Habilitado" },
    { id: "definition", nombre: "Definition", descripcion: "Definir requerimientos", estatus: "Habilitado" },
    { id: "inProgress", nombre: "In Progress", descripcion: "Tareas en desarrollo", estatus: "Deshabilitado" },
    { id: "inReview", nombre: "In Review", descripcion: "Revisión y feedback", estatus: "Habilitado" },
    { id: "done", nombre: "Done", descripcion: "Tareas completadas", estatus: "Deshabilitado" },
  ]);

  const [tareas] = useState([
    { id: 1, nombre: "Análisis de café", descripcion: "Revisión de calidad de granos", responsable: "Aurora Núñez", categoria: "backlog", estado: "Habilitado", proyecto: "IMG" },
    { id: 2, nombre: "Diseño UX", descripcion: "Prototipos y wireframes", responsable: "Lucía Pérez", categoria: "definition", estado: "Habilitado", proyecto: "IMG" },
    { id: 3, nombre: "Revisión interna", descripcion: "Control de calidad", responsable: "Mario Salgado", categoria: "inReview", estado: "Habilitado", proyecto: "IMG" },
    { id: 4, nombre: "Código Frontend", descripcion: "Desarrollo UI", responsable: "Carlos Ramos", categoria: "inProgress", estado: "Deshabilitado", proyecto: "IMG" },
    { id: 5, nombre: "Pruebas QA", descripcion: "Testing funcional", responsable: "Sandra Ruiz", categoria: "done", estado: "Deshabilitado", proyecto: "IMG" },
  ]);

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  useEffect(() => {
    document.body.style.overflow = tareaSeleccionada ? "hidden" : "auto";
  }, [tareaSeleccionada]);

  return (
    <div className="p-3 relative">
      <h2 className="text-2xl font-bold text-[var(--color-azul-900)] mb-2">
        Categorías de proyecto: {proyectoId}
      </h2>
      <p className="text-gray-600 mb-6">Visualiza las fases y tareas de tu proyecto</p>

      <div className="overflow-x-auto scroll-cyan">
        <div className="flex gap-6 w-max pb-4">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="min-w-[280px] max-w-xs h-[300px] bg-[var(--color-azul-100)] border border-[var(--color-azul-300)] rounded-xl shadow-sm p-4 flex flex-col"
            >
              <h3 className="text-base font-semibold text-gray-800">{categoria.nombre}</h3>
              <p className="text-sm text-gray-600">{categoria.descripcion}</p>
              <p className="text-xs font-semibold mt-1">
                Estatus:{" "}
                <span className={categoria.estatus === "Habilitado" ? "text-green-600" : "text-red-600"}>
                  {categoria.estatus}
                </span>
              </p>

              <div className="flex flex-col gap-3 mt-4">
                {tareas.filter((t) => t.categoria === categoria.id).length === 0 && (
                  <p className="text-sm text-gray-500">No hay tareas</p>
                )}

                {tareas
                  .filter((t) => t.categoria === categoria.id)
                  .map((tarea) => (
                    <div key={tarea.id} className="bg-white border border-[var(--color-azul-400)] rounded-md p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-800">{tarea.nombre}</h4>
                        <button
                          onClick={() => setTareaSeleccionada(tarea)}
                          className="text-gray-500 hover:text-gray-800"
                          title="Ver detalles"
                        >
                          <FaExpand />
                        </button>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <FolderKanban className="w-3 h-3 mr-1 text-[var(--color-azul-950)]" />
                        <span>Proyecto: {tarea.proyecto}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <User2 className="w-3 h-3 mr-1 text-[var(--color-azul-950)]" />
                        <span>Responsable: {tarea.responsable}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {tareaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-cyan-300">
            <h3 className="text-xl font-bold mb-4">{tareaSeleccionada.nombre}</h3>
            <p><strong>Descripción:</strong> {tareaSeleccionada.descripcion}</p>
            <p><strong>Categoría:</strong> {tareaSeleccionada.categoria}</p>
            <br></br>
            <p><strong>Proyecto:</strong> {tareaSeleccionada.proyecto}</p>
            <p><strong>Responsable:</strong> {tareaSeleccionada.responsable}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className={tareaSeleccionada.estado === "Habilitado" ? "text-green-600" : "text-red-600"}>
                {tareaSeleccionada.estado}
              </span>
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setTareaSeleccionada(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarCategoriasUsuario;
