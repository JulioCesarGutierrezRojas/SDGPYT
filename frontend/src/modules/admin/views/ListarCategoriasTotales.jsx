import { useState, useEffect } from "react";
import { PencilLine, Trash, PlusCircle, User2, FolderKanban } from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";
import ModalCrearCategoria from "../../../components/ModalCrearCategoria";
import ModalCrearTarea from "../../../components/ModalCrearTarea";
import ModalDetalleTarea from "../../../components/ModalDetalleTarea";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminCategories = () => {
  const { proyectoId } = useParams();
  const nombreProyecto = "IMG";

  const [categorias, setCategorias] = useState([
    { id: "backlog", nombre: "Backlog", descripcion: "Tareas iniciales", estatus: "Habilitado" },
    { id: "definition", nombre: "Definition", descripcion: "Definir requerimientos", estatus: "Habilitado" },
    { id: "inProgress", nombre: "In Progress", descripcion: "Tareas en desarrollo", estatus: "Deshabilitado" },
    { id: "inReview", nombre: "In Review", descripcion: "Revisión y feedback", estatus: "Habilitado" },
    { id: "done", nombre: "Done", descripcion: "Tareas completadas", estatus: "Deshabilitado" },
  ]);

  const [tareas, setTareas] = useState([
    { id: 1, titulo: "Análisis de café", responsable: "Aurora Núñez", categoria: "backlog", descripcion: "", estatus: "activo", proyecto: "p1", usuario: "u1" },
    { id: 2, titulo: "Diseño UX", responsable: "Lucía Pérez", categoria: "definition", descripcion: "", estatus: "activo", proyecto: "p1", usuario: "u2" },
    { id: 3, titulo: "Revisión interna", responsable: "Mario Salgado", categoria: "inReview", descripcion: "", estatus: "activo", proyecto: "p1", usuario: "u3" },
    { id: 4, titulo: "Código Frontend", responsable: "Carlos Ramos", categoria: "inProgress", descripcion: "", estatus: "activo", proyecto: "p1", usuario: "u4" },
    { id: 5, titulo: "Pruebas QA", responsable: "Sandra Ruiz", categoria: "done", descripcion: "", estatus: "inactivo", proyecto: "p1", usuario: "u5" },
  ]);

  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mostrarModalTarea, setMostrarModalTarea] = useState(false);
  const [categoriaParaNuevaTarea, setCategoriaParaNuevaTarea] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const usuarios = [
    { id: "u1", nombre: "Aurora Núñez" },
    { id: "u2", nombre: "Lucía Pérez" },
    { id: "u3", nombre: "Mario Salgado" },
    { id: "u4", nombre: "Carlos Ramos" },
    { id: "u5", nombre: "Sandra Ruiz" },
  ];

  const proyectos = [{ id: "p1", nombre: "IMG" }];

  useEffect(() => {
    document.body.style.overflow = (mostrarModalCategoria || mostrarModalTarea || tareaSeleccionada) ? "hidden" : "auto";
  }, [mostrarModalCategoria, mostrarModalTarea, tareaSeleccionada]);

  const abrirModalNuevaCategoria = () => {
    setCategoriaEditando(null);
    setMostrarModalCategoria(true);
  };

  const handleAgregarEditarCategoria = (categoria) => {
    if (categoria.id && categorias.some((c) => c.id === categoria.id)) {
      setCategorias((prev) =>
        prev.map((cat) => (cat.id === categoria.id ? categoria : cat))
      );
    } else {
      setCategorias((prev) => [...prev, { ...categoria, id: Date.now().toString() }]);
    }
    setMostrarModalCategoria(false);
    setCategoriaEditando(null);
  };

  const handleEliminarCategoria = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
      setTareas((prev) => prev.filter((t) => t.categoria !== id));
    }
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarModalCategoria(true);
  };

  const abrirModalNuevaTarea = (categoriaId) => {
    setCategoriaParaNuevaTarea(categoriaId);
    setMostrarModalTarea(true);
  };

  const handleAgregarTarea = (nuevaTarea) => {
    const responsable = usuarios.find(u => u.id === nuevaTarea.usuario)?.nombre || "Pendiente";

    if (!nuevaTarea.nombre || nuevaTarea.nombre.trim() === "") {
      alert("La tarea debe tener un nombre.");
      return;
    }

    const tareaFormateada = {
      ...nuevaTarea,
      id: Date.now(),
      categoria: categoriaParaNuevaTarea,
      responsable,
      titulo: nuevaTarea.nombre,
    };

    setTareas((prev) => [...prev, tareaFormateada]);
    setMostrarModalTarea(false);
    setCategoriaParaNuevaTarea(null);
  };

  const abrirModalDetalleTarea = (tarea) => {
    setTareaSeleccionada({
      ...tarea,
      nombre: tarea.titulo,
    });
  };

  const cerrarModalDetalleTarea = () => {
    setTareaSeleccionada(null);
  };

  const handleEliminarTarea = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      setTareas((prev) => prev.filter((t) => t.id !== id));
      cerrarModalDetalleTarea();
    }
  };

  const handleGuardarCambiosTarea = (tareaActualizada) => {
    setTareas((prevTareas) =>
      prevTareas.map((t) =>
        t.id === tareaActualizada.id ? tareaActualizada : t
      )
    );
    cerrarModalDetalleTarea();
  };

  // Manejo de drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return;
    }

    const tareasFiltradas = tareas.filter(t => t.categoria === source.droppableId);
    const [tareaMovida] = tareasFiltradas.splice(source.index, 1);
    tareaMovida.categoria = destination.droppableId;

    const nuevasTareas = tareas
      .filter(t => t.id !== tareaMovida.id)
      .concat(tareaMovida);

    setTareas(nuevasTareas);
  };

  return (
    <div className="p-3 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-azul-900)]">Categorías de proyecto: {proyectoId}</h2>
          <p className="text-gray-600">Visualiza las fases y tareas de tu proyecto</p>
        </div>
      </div>

      <div className={`${(mostrarModalCategoria || mostrarModalTarea || tareaSeleccionada) ? "blur-md" : ""}`}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto scroll-cyan">
            <div className="flex gap-6 w-max pb-4 overflow-x-auto">
              {categorias.map((categoria) => (
                <Droppable key={categoria.id} droppableId={categoria.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-w-[280px] max-w-xs min-h-[300px] bg-[var(--color-azul-100)] border border-[var(--color-azul-300)] rounded-xl shadow-sm p-4 flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">{categoria.nombre}</h3>
                          <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                          <p className="text-xs font-semibold mt-1">
                            Estatus:{" "}
                            <span className={categoria.estatus === "Habilitado" ? "text-green-600" : "text-red-600"}>
                              {categoria.estatus}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditarCategoria(categoria)} className="text-gray-600 hover:text-gray-800">
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEliminarCategoria(categoria.id)} className="text-gray-600 hover:text-red-600">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mb-4">
                        {tareas
                          .filter((t) => t.categoria === categoria.id)
                          .map((tarea, index) => (
                            <Draggable key={tarea.id} draggableId={tarea.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white border border-[var(--color-azul-400)] rounded-md p-3 shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-bold text-gray-800">{tarea.titulo}</h4>
                                    <button onClick={() => abrirModalDetalleTarea(tarea)} className="text-gray-500 hover:text-gray-800">
                                      <FaEllipsisV />
                                    </button>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600 mb-1">
                                    <FolderKanban className="w-3 h-3 mr-1 text-[var(--color-azul-950)]" />
                                    <span>Proyecto: {nombreProyecto}</span>
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

                      <button
                        onClick={() => abrirModalNuevaTarea(categoria.id)}
                        className="flex items-center gap-1 text-sm text-[var(--color-azul-800)] hover:underline mt-auto"
                      >
                        <PlusCircle className="w-4 h-4" /> Agregar tarea
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}

              <div
                className="min-w-[40px] h-10 bg-[var(--color-azul-100)] border border-[var(--color-azul-300)] rounded-xl shadow-sm flex items-center justify-center cursor-pointer hover:bg-[var(--color-azul-200)]"
                onClick={abrirModalNuevaCategoria}
                title="Agregar categoría"
              >
                <PlusCircle className="w-6 h-6 text-[var(--color-azul-800)]" />
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>

      <ModalCrearCategoria
        visible={mostrarModalCategoria}
        onClose={() => {
          setMostrarModalCategoria(false);
          setCategoriaEditando(null);
        }}
        onGuardar={handleAgregarEditarCategoria}
        categoriaEditar={categoriaEditando}
      />

      <ModalCrearTarea
        visible={mostrarModalTarea}
        onClose={() => {
          setMostrarModalTarea(false);
          setCategoriaParaNuevaTarea(null);
        }}
        onGuardar={handleAgregarTarea}
        proyectos={proyectos}
        usuarios={usuarios}
      />

      {tareaSeleccionada && (
        <ModalDetalleTarea
          tarea={tareaSeleccionada}
          onClose={cerrarModalDetalleTarea}
          onEliminar={handleEliminarTarea}
          onGuardar={handleGuardarCambiosTarea}
        />
      )}
    </div>
  );
};

export default AdminCategories;
