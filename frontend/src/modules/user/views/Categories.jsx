import { useState } from "react";
import { User2, FolderKanban, ExternalLink, CheckCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";

const ListarCategoriasUsuario = () => {
  const { proyectoId } = useParams();
  const [nombreProyecto, setNombreProyecto] = useState(proyectoId);

  const [categorias] = useState([
    { id: "backlog", nombre: "Backlog", descripcion: "Tareas iniciales", estatus: "Habilitado" },
    { id: "definition", nombre: "Definition", descripcion: "Definir requerimientos", estatus: "Habilitado" },
    { id: "inProgress", nombre: "In Progress", descripcion: "Tareas en desarrollo", estatus: "Deshabilitado" },
    { id: "inReview", nombre: "In Review", descripcion: "Revisión y feedback", estatus: "Habilitado" },
    { id: "done", nombre: "Done", descripcion: "Tareas completadas", estatus: "Deshabilitado" },
  ]);

  const [tareas, setTareas] = useState([
    { id: "1", nombre: "Análisis de café", descripcion: "Revisión de calidad de granos", responsable: "Aurora Núñez", categoria: "backlog", estado: "Habilitado", proyecto: "IMG" },
    { id: "2", nombre: "Diseño UX", descripcion: "Prototipos y wireframes", responsable: "Lucía Pérez", categoria: "definition", estado: "Habilitado", proyecto: "IMG" },
    { id: "3", nombre: "Revisión interna", descripcion: "Control de calidad", responsable: "Mario Salgado", categoria: "inReview", estado: "Habilitado", proyecto: "IMG" },
    { id: "4", nombre: "Código Frontend", descripcion: "Desarrollo UI", responsable: "Carlos Ramos", categoria: "inProgress", estado: "Deshabilitado", proyecto: "IMG" },
    { id: "5", nombre: "Pruebas QA", descripcion: "Testing funcional", responsable: "Sandra Ruiz", categoria: "done", estado: "Deshabilitado", proyecto: "IMG" },
  ]);

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [categoriaAnimada, setCategoriaAnimada] = useState(null);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    setTareas((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, categoria: destination.droppableId } : t
      )
    );

    // Si la tarea va a la última categoría, animamos
    if (destination.droppableId === "done") {
      setCategoriaAnimada("done");
      setTimeout(() => setCategoriaAnimada(null), 1000);
    }
  };

  return (
    <div className="p-3 relative">
      <h2 className="text-2xl font-bold text-[var(--color-azul-900)] mb-2">
        Categorías de proyecto: {nombreProyecto}
      </h2>
      <p className="text-gray-600 mb-6">Visualiza las fases y tareas de tu proyecto</p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto scroll-cyan">
          <div className="flex gap-6 w-max pb-4">
            {categorias.map((categoria) => (
              <Droppable key={categoria.id} droppableId={categoria.id}>
                {(provided) => (
                  <div
                    className={`min-w-[280px] max-w-xs min-h-[300px] bg-[var(--color-azul-100)] border rounded-xl shadow-sm p-4 flex flex-col relative transition-all duration-300
                      ${categoriaAnimada === categoria.id ? "border-green-500 ring-2 ring-green-300" : "border-[var(--color-azul-300)]"}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      {categoria.nombre}
                      {categoriaAnimada === categoria.id && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                    <p className="text-xs font-semibold mt-1">
                      Estatus:{" "}
                      <span className={categoria.estatus === "Habilitado" ? "text-green-600" : "text-red-600"}>
                        {categoria.estatus}
                      </span>
                    </p>

                    <div className="flex flex-col gap-3 mt-4">
                      {tareas
                        .filter((t) => t.categoria === categoria.id)
                        .map((tarea, index) => (
                          <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                            {(provided) => (
                              <div
                                className="bg-white border border-[var(--color-azul-400)] rounded-md p-3 shadow-sm"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="text-sm font-bold text-gray-800">{tarea.nombre}</h4>
                                  <button
                                    onClick={() => setTareaSeleccionada(tarea)}
                                    className="text-gray-500 hover:text-gray-800"
                                    title="Ver detalles"
                                  >
                                    <ExternalLink className="w-4 h-4" />
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
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {tareaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-cyan-300">
            <h3 className="text-xl font-bold mb-4">{tareaSeleccionada.nombre}</h3>
            <p><strong>Descripción:</strong> {tareaSeleccionada.descripcion}</p>
            <p><strong>Categoría:</strong> {tareaSeleccionada.categoria}</p>
            <br />
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
