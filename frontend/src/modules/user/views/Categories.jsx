import { useState, useEffect } from "react";
import { User2, FolderKanban, CheckCircle } from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { showErrorToast } from "../../../kernel/alerts";

// Importar controladores del usuario para funcionalidad básica
import { getCategoriesByProject } from "../adapters/category.controller";
import { getTasksByUserAndProject, updateTaskCategory } from "../adapters/task.controller";
import { getProjectById } from "../adapters/project.controller";

// Modal para ver detalles de tarea (solo lectura para usuarios normales)
import ModalDetalleTarea from "../../../components/ModalDetalleTarea";

const ListarCategoriasUsuario = () => {
  const { proyectoId } = useParams();
  
  // Obtener información del usuario actual con validación segura
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return {};
      
      // Si es un JSON válido, parsearlo
      if (userString.startsWith('{') || userString.startsWith('[')) {
        return JSON.parse(userString);
      }
      
      // Si es un string simple (como "Julio Cesar"), crear un objeto básico
      return { name: userString };
    } catch (error) {
      console.warn('Error al parsear usuario del localStorage:', error);
      return {};
    }
  };
  
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.userId;
  const currentUserRole = 'USER'; // Siempre USER en este componente
  
  // Estados principales
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [administradorProyecto, setAdministradorProyecto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  
  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [categoriaAnimada, setCategoriaAnimada] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [proyectoId, currentUserId]);

  useEffect(() => {
    document.body.style.overflow = tareaSeleccionada ? "hidden" : "auto";
  }, [tareaSeleccionada]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCategorias(),
        loadTareas(),
        loadProjectName()
      ]);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar los datos del proyecto'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await getCategoriesByProject(parseInt(proyectoId));
      if (response.result && Array.isArray(response.result)) {
        const mappedCategories = response.result.map(cat => ({
          id: cat.categoryId,
          nombre: cat.name,
          descripcion: cat.description,
          estatus: cat.status ? "Habilitado" : "Deshabilitado"
        }));
        setCategorias(mappedCategories);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar las categorías'
      });
      setCategorias([]);
    }
  };

  const loadTareas = async () => {
    try {
      // Usuario normal, obtener solo sus tareas asignadas del proyecto
      if (!currentUserId) {
        console.warn('No se pudo obtener el ID del usuario actual');
        setTareas([]);
        return;
      }
      
      const response = await getTasksByUserAndProject(currentUserId, parseInt(proyectoId));
      
      if (response.result && Array.isArray(response.result)) {
        const mappedTasks = response.result.map(task => ({
          id: task.taskId,
          titulo: task.name,
          descripcion: task.description,
          categoria: task.categoryId,
          responsable: task.userName || "Sin asignar",
          estatus: task.status ? "activo" : "inactivo",
          proyecto: task.projectId,
          usuario: task.userId
        }));
        setTareas(mappedTasks);
      } else {
        setTareas([]);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar las tareas'
      });
      setTareas([]);
    }
  };

  const loadProjectName = async () => {
    try {
      const response = await getProjectById(parseInt(proyectoId));
      if (response.result) {
        setNombreProyecto(response.result.name);
        
        // Cargar información del administrador si está disponible
        if (response.result.adminName && response.result.adminName !== "Sin asignar") {
          setAdministradorProyecto({
            name: response.result.adminName,
            email: response.result.adminEmail
          });
        } else {
          setAdministradorProyecto(null);
        }
      }
    } catch (error) {
      console.error('Error al cargar nombre del proyecto:', error);
    }
  };

  // Funciones para usuarios normales

  const abrirModalDetalleTarea = (tarea) => {
    setTareaSeleccionada({
      ...tarea,
      nombre: tarea.titulo,
    });
  };

  const cerrarModalDetalleTarea = () => {
    setTareaSeleccionada(null);
  };

  // Función para actualizar categoría de tarea sin mostrar toasts (para drag and drop)
  const updateTaskCategorySilently = async (taskId, newCategoryId) => {
    try {
      await updateTaskCategory(taskId, newCategoryId);
    } catch (error) {
      console.error('Error al actualizar categoría de tarea:', error);
      // No mostrar toast, solo loggear el error
    }
  };

  // Manejo de drag and drop (solo para tareas propias)
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return;
    }

    const tareasFiltradas = tareas.filter(t => t.categoria === source.droppableId);
    const [tareaMovida] = tareasFiltradas.splice(source.index, 1);
    const nuevaCategoriaId = destination.droppableId;
    
    // Verificar si el usuario tiene permisos para mover esta tarea (solo sus propias tareas)
    if (tareaMovida.usuario !== currentUserId) {
      showErrorToast({
        title: 'Sin permisos',
        text: 'Solo puedes mover tus propias tareas'
      });
      return;
    }
    
    // Actualizar estado local inmediatamente para UX responsiva
    tareaMovida.categoria = nuevaCategoriaId;
    const nuevasTareas = tareas
      .filter(t => t.id !== tareaMovida.id)
      .concat(tareaMovida);
    setTareas(nuevasTareas);

    // Si la tarea va a la categoría "done" (completada), animamos
    const categoriaDestino = categorias.find(c => c.id == nuevaCategoriaId);
    if (categoriaDestino && categoriaDestino.nombre.toLowerCase().includes('done')) {
      setCategoriaAnimada(nuevaCategoriaId);
      setTimeout(() => setCategoriaAnimada(null), 1000);
    }

    // Actualizar en base de datos en segundo plano
    await updateTaskCategorySilently(
      tareaMovida.id,
      parseInt(nuevaCategoriaId)
    );
  };

  return (
    <div className="p-3 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-azul-900)]">
            Categorías de proyecto: {nombreProyecto || proyectoId}
          </h2>
          <div className="space-y-1">
            <p className="text-gray-600">Visualiza las fases y tareas de tu proyecto</p>
            {administradorProyecto && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User2 className="w-4 h-4" />
                <span className="font-medium">Administrador:</span>
                <span>{administradorProyecto.name}</span>
                {administradorProyecto.email && (
                  <span className="text-gray-500">({administradorProyecto.email})</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Usuario Colaborador
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-azul-600)]"></div>
          <span className="ml-3 text-lg text-gray-600">Cargando proyecto...</span>
        </div>
      ) : (
        <div className={`${tareaSeleccionada ? "blur-md" : ""}`}>
          {categorias.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500">
                <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium mb-2">No hay categorías en este proyecto</p>
                <p className="text-sm mb-6">
                  El administrador del proyecto debe crear las categorías
                </p>
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="overflow-x-auto scroll-cyan">
                <div className="flex gap-6 w-max pb-4">
                  {categorias.map((categoria) => (
                    <Droppable key={categoria.id} droppableId={categoria.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-w-[280px] max-w-xs min-h-[300px] bg-[var(--color-azul-100)] border rounded-xl shadow-sm p-4 flex flex-col transition-all duration-300 ${
                            categoriaAnimada === categoria.id ? "border-green-500 ring-2 ring-green-300" : "border-[var(--color-azul-300)]"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
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
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 mb-4">
                            {tareas.filter((t) => t.categoria === categoria.id).length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                <User2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-xs">
                                  No tienes tareas asignadas en esta categoría
                                </p>
                              </div>
                            ) : (
                              tareas
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
                                          <div className="flex items-center gap-1">
                                            <button onClick={() => abrirModalDetalleTarea(tarea)} className="text-gray-500 hover:text-gray-800 p-1">
                                              <FaEllipsisV />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600 mb-1">
                                          <FolderKanban className="w-3 h-3 mr-1 text-[var(--color-azul-950)]" />
                                          <span>Proyecto: {nombreProyecto}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600 mb-1">
                                          <User2 className="w-3 h-3 mr-1 text-[var(--color-azul-950)]" />
                                          <span>Responsable: {tarea.responsable}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className={`text-xs px-2 py-1 rounded-full ${tarea.estatus === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {tarea.estatus === "activo" ? "Activa" : "Inactiva"}
                                          </span>
                                          {tarea.usuario === currentUserId && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                              Tu tarea
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                            )}
                            {provided.placeholder}
                          </div>

                        </div>
                      )}
                    </Droppable>
                  ))}

                </div>
              </div>
            </DragDropContext>
          )}
        </div>
      )}

      {/* Modal de detalle de tarea (solo lectura para usuarios normales) */}
      {tareaSeleccionada && (
        <ModalDetalleTarea
          tarea={tareaSeleccionada}
          onClose={cerrarModalDetalleTarea}
          onEliminar={null}
          onGuardar={null}
          usuarios={[]}
          proyectoId={proyectoId}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default ListarCategoriasUsuario;
