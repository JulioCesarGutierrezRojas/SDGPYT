import { useState, useEffect } from "react";
import { User2, FolderKanban, PencilLine, Trash, PlusCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { showConfirmation, showSuccessToast, showErrorToast } from "../../../kernel/alerts";
import ModalCrearCategoria from "../../../components/ModalCrearCategoria";
import ModalCrearTarea from "../../../components/ModalCrearTarea";
import ModalDetalleTarea from "../../../components/ModalDetalleTarea";
import ModalInvitarUsuarios from "../components/ModalInvitarUsuarios";

// Importar controladores del usuario para funciones básicas
import { getCategoriesByProject, createCategory, updateCategory, changeCategoryStatus } from "../adapters/category.controller";
import { updateTaskCategory } from "../adapters/task.controller";
import { getProjectById } from "../adapters/project.controller";

// Importar controladores del admin para funciones completas de administrador
import { getTasksByProject, createTask, updateTask, changeTaskStatus, deleteTask } from "../../admin/adapters/task.controller";
import { getAllUsers } from "../../admin/adapters/user.controller";
import { sendProjectInvitations } from "../adapters/invitation.controller";

const AdminCategories = () => {
  console.log('🚀 ADMIN CATEGORIES - Component rendering started');
  
  const { proyectoId } = useParams();
  console.log('🚀 ADMIN CATEGORIES - proyectoId:', proyectoId);
  
  // Obtener información del usuario actual
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return {};
      
      if (userString.startsWith('{') || userString.startsWith('[')) {
        return JSON.parse(userString);
      }
      
      return { name: userString };
    } catch (error) {
      console.error('Error al parsear usuario del localStorage:', error);
      return {};
    }
  };
  
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.userId;
  
  // Estados principales
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [administradorProyecto, setAdministradorProyecto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados para modales
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mostrarModalTarea, setMostrarModalTarea] = useState(false);
  const [categoriaParaNuevaTarea, setCategoriaParaNuevaTarea] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [mostrarModalInvitar, setMostrarModalInvitar] = useState(false);
  
  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingTareas, setLoadingTareas] = useState(false);

  const proyectos = [{ id: proyectoId, nombre: nombreProyecto }];

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🔍 DEBUG - useEffect triggered with proyectoId:', proyectoId);
    
    const loadData = async () => {
      try {
        await loadInitialData();
      } catch (error) {
        console.error('❌ ERROR - useEffect loadInitialData failed:', error);
        // Check if this error is causing a redirect
        if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
          console.error('❌ CHUNK LOAD ERROR detected - this might cause page redirect');
        }
      }
    };
    
    loadData();
  }, [proyectoId]);

  useEffect(() => {
    document.body.style.overflow = (mostrarModalCategoria || mostrarModalTarea || tareaSeleccionada) ? "hidden" : "auto";
  }, [mostrarModalCategoria, mostrarModalTarea, tareaSeleccionada]);

  const loadInitialData = async () => {
    try {
      console.log('🔍 DEBUG - loadInitialData: Starting...');
      setLoading(true);
      console.log('🔍 DEBUG - loadInitialData: Loading promise all...');
      await Promise.all([
        loadCategorias(),
        loadTareas(),
        loadProjectName()
      ]);
      console.log('🔍 DEBUG - loadInitialData: All data loaded successfully');
    } catch (error) {
      console.error('❌ ERROR - loadInitialData failed:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar los datos del proyecto'
      });
      throw error; // Re-throw to see if this error is being caught somewhere else
    } finally {
      console.log('🔍 DEBUG - loadInitialData: Setting loading to false');
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true);
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
    } finally {
      setLoadingCategorias(false);
    }
  };

  const loadTareas = async () => {
    try {
      setLoadingTareas(true);
      // Como es administrador, obtener todas las tareas del proyecto
      const response = await getTasksByProject(parseInt(proyectoId));
      
      if (response.result && Array.isArray(response.result)) {
        const mappedTasks = response.result.map(task => ({
          id: task.taskId,
          titulo: task.name,
          descripcion: task.description,
          categoria: task.categoryId,
          responsable: task.assignedUserName || "Sin asignar",
          estatus: task.status ? "activo" : "inactivo",
          proyecto: task.projectId,
          usuario: task.assignedUserId
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
    } finally {
      setLoadingTareas(false);
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

  // Funciones de manejo de categorías
  const abrirModalNuevaCategoria = () => {
    setCategoriaEditando(null);
    setMostrarModalCategoria(true);
  };

  const handleAgregarEditarCategoria = async (categoria) => {
    try {
      if (categoriaEditando) {
        await updateCategory(
          categoriaEditando.id,
          categoria.nombre,
          categoria.descripcion
        );
        
        showSuccessToast({
          title: 'Categoría actualizada',
          text: 'La categoría se ha actualizado correctamente'
        });
      } else {
        await createCategory(
          categoria.nombre,
          categoria.descripcion,
          parseInt(proyectoId)
        );
        
        showSuccessToast({
          title: 'Categoría creada',
          text: 'La categoría se ha creado correctamente'
        });
      }
      
      setMostrarModalCategoria(false);
      setCategoriaEditando(null);
      await loadCategorias();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo guardar la categoría'
      });
    }
  };

  const handleCambiarEstatusCategoria = async (categoria) => {
    try {
      await changeCategoryStatus(categoria.id);
      
      showSuccessToast({
        title: 'Estado actualizado',
        text: `El estado de la categoría ${categoria.nombre} ha sido actualizado correctamente`
      });
      
      await loadCategorias();
    } catch (error) {
      console.error('Error al cambiar estado de categoría:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo cambiar el estado de la categoría'
      });
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

  const handleCambiarEstatusTarea = async (tarea) => {
    try {
      await changeTaskStatus(tarea.id);
      
      showSuccessToast({
        title: 'Estado actualizado',
        text: `El estado de la tarea ${tarea.titulo} ha sido actualizado correctamente`
      });
      
      await loadTareas(); // Recargar tareas
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo cambiar el estado de la tarea'
      });
    }
  };

  // Función para manejar invitaciones
  const handleInvitarUsuarios = async (correos) => {
    try {
      // Validar que hay correos
      if (!correos || correos.length === 0) {
        showErrorToast({
          title: 'Error',
          text: 'Debes agregar al menos un correo electrónico'
        });
        return;
      }

      // Validar formato de correos
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const correosInvalidos = correos.filter(email => !emailRegex.test(email));
      
      if (correosInvalidos.length > 0) {
        showErrorToast({
          title: 'Correos inválidos',
          text: `Los siguientes correos tienen formato inválido: ${correosInvalidos.join(', ')}`
        });
        return;
      }

      // Enviar las invitaciones
      await sendProjectInvitations(parseInt(proyectoId), correos);
      
      showSuccessToast({
        title: 'Invitaciones enviadas',
        text: `Se han enviado ${correos.length} invitación(es) correctamente`
      });
      
      setMostrarModalInvitar(false);
      
    } catch (error) {
      console.error('Error al enviar invitaciones:', error);
      showErrorToast({
        title: 'Error al enviar invitaciones',
        text: error.message || 'No se pudieron enviar las invitaciones'
      });
    }
  };

  // Función para actualizar categoría de tarea sin mostrar toasts (para drag and drop)
  const updateTaskCategorySilently = async (taskId, newCategoryId) => {
    try {
      await updateTaskCategory(taskId, newCategoryId);
    } catch (error) {
      console.error('Error al actualizar categoría de tarea:', error);
      // Mostrar un toast de error si falla
      showErrorToast({
        title: 'Error al mover tarea',
        text: 'No se pudo actualizar la tarea. Recarga la página.'
      });
    }
  };

  // Manejo de drag and drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return;
    }

    const tareasFiltradas = tareas.filter(t => t.categoria === source.droppableId);
    const [tareaMovida] = tareasFiltradas.splice(source.index, 1);
    const nuevaCategoriaId = destination.droppableId;
    
    // Actualizar estado local inmediatamente para UX responsiva
    tareaMovida.categoria = nuevaCategoriaId;
    const nuevasTareas = tareas
      .filter(t => t.id !== tareaMovida.id)
      .concat(tareaMovida);
    setTareas(nuevasTareas);

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
          <h2 className="text-2xl font-bold text-[var(--color-azul-900)]">Categorías de proyecto: {nombreProyecto}</h2>
          <p className="text-gray-600">Visualiza las fases y tareas de tu proyecto</p>
        </div>
        <button
          onClick={() => setMostrarModalInvitar(true)}
          className="bg-cyan-500 text-white px-4 py-2 rounded-md w-40 hover:bg-cyan-600 font-semibold"
        >
          Invitar usuarios
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-azul-600)]"></div>
          <span className="ml-3 text-lg text-gray-600">Cargando proyecto...</span>
        </div>
      ) : (
        <div className={`${(mostrarModalCategoria || mostrarModalTarea || tareaSeleccionada) ? "blur-md" : ""}`}>
        {categorias.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500">
              <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium mb-2">No hay categorías en este proyecto</p>
              <p className="text-sm mb-6">Crea la primera categoría para organizar las tareas de tu proyecto</p>
              <button
                onClick={abrirModalNuevaCategoria}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded-md transition-colors font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                Crear primera categoría
              </button>
            </div>
          </div>
        ) : (
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
                          <button 
                            onClick={() => handleEditarCategoria(categoria)} 
                            className="text-gray-600 hover:text-gray-800"
                            title="Editar categoría"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              const nuevoEstado = categoria.estatus === "Habilitado" ? "Deshabilitado" : "Habilitado";
                              showConfirmation(
                                "Cambiar estado",
                                `¿Deseas cambiar el estado de la categoría ${categoria.nombre} a ${nuevoEstado}?`,
                                "question",
                                () => handleCambiarEstatusCategoria(categoria),
                                () => console.log("Cambio cancelado")
                              );
                            }}
                            className={`${categoria.estatus === "Habilitado" ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"}`}
                            title={`${categoria.estatus === "Habilitado" ? "Deshabilitar" : "Habilitar"} categoría`}
                          >
                            {categoria.estatus === "Habilitado" ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mb-4">
                        {tareas.filter((t) => t.categoria === categoria.id).length === 0 ? (
                          <div className="text-center py-6 text-gray-400">
                            <User2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs">No hay tareas en esta categoría</p>
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
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCambiarEstatusTarea(tarea);
                                        }}
                                        className={`${tarea.estatus === "activo" ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"} p-1`}
                                        title={`${tarea.estatus === "activo" ? "Desactivar" : "Activar"} tarea`}
                                      >
                                        {tarea.estatus === "activo" ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                      </button>
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
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
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
        )}
        </div>
      )}

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
        proyectoId={proyectoId}
      />

      {tareaSeleccionada && (
        <ModalDetalleTarea
          tarea={tareaSeleccionada}
          onClose={cerrarModalDetalleTarea}
          onEliminar={handleEliminarTarea}
          onGuardar={handleGuardarCambiosTarea}
          usuarios={usuarios}
          proyectoId={proyectoId}
        />
      )}

      <ModalInvitarUsuarios
        visible={mostrarModalInvitar}
        onClose={() => setMostrarModalInvitar(false)}
        onInvitar={handleInvitarUsuarios}
      />
    </div>
  );
};

export default AdminCategories;
