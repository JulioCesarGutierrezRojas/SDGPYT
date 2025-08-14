import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Download } from "lucide-react";
import { showConfirmation, showSuccessToast, showErrorToast } from "../../../kernel/alerts";
import ModalCrearProyecto from "../../../components/ModalCrearProyecto";
import ModalEditarProyecto from "../components/ModalEditarProyecto";
import { getAllProjects, createProject, updateProject, changeProjectStatus } from "../adapters/project.controller";

export default function ProjectsAdmin() {
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const proyectosPorPagina = 5;

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects();
      if (response.result && Array.isArray(response.result)) {
        // Mapear los campos del backend a los del frontend
        const mappedProjects = response.result.map(project => ({
          id: project.id,
          nombre: project.name,
          abreviacion: project.abbreviation,
          descripcion: project.description,
          estatus: project.status ? "Habilitado" : "Deshabilitado",
          administrador: project.adminName || "Sin asignar",
          adminEmail: project.adminEmail
        }));
        setProyectos(mappedProjects);
      } else {
        setProyectos([]);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar los proyectos'
      });
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  const proyectosFiltrados = proyectos.filter((proyecto) =>
    proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);
  const proyectosPaginados = proyectosFiltrados.slice(
    (paginaActual - 1) * proyectosPorPagina,
    paginaActual * proyectosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleGuardarProyecto = async (nuevoProyecto) => {
    try {
      const response = await createProject(
        nuevoProyecto.nombre,
        nuevoProyecto.abreviacion,
        nuevoProyecto.descripcion,
        nuevoProyecto.adminUserId
      );
      
      showSuccessToast({
        title: 'Proyecto creado',
        text: 'El proyecto se ha creado correctamente'
      });
      
      setModalAbierto(false);
      await loadProjects(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo crear el proyecto'
      });
    }
  };

  const handleEditar = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setMostrarModal(true);
  };

  const guardarCambios = async (proyectoEditado) => {
    try {
      // Preparar los datos para enviar al backend
      const response = await updateProject(
        proyectoSeleccionado.id,
        proyectoEditado.nombre,
        proyectoEditado.abreviacion,
        proyectoEditado.descripcion,
        proyectoEditado.adminUserId
      );

      showSuccessToast({
        title: 'Proyecto actualizado',
        text: 'Los datos del proyecto se han actualizado correctamente'
      });
      
      setMostrarModal(false);
      await loadProjects(); // Recargar la lista
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo actualizar el proyecto'
      });
    }
  };

  const handleCambiarEstatus = async (proyecto) => {
    try {
      await changeProjectStatus(proyecto.id);
      
      showSuccessToast({
        title: 'Estado actualizado',
        text: `El estado de ${proyecto.nombre} ha sido actualizado correctamente`
      });
      
      await loadProjects(); // Recargar la lista
    } catch (error) {
      console.error('Error al cambiar estado del proyecto:', error);
      showErrorToast({
        title: 'Error',
        text: error.message || 'No se pudo cambiar el estado del proyecto'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Proyectos</h1>
        <p className="text-gray-600">
          Visualiza, busca y administra los proyectos registrados en la plataforma.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar proyectos por nombre"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Abreviación</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Administrador</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estatus</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-azul-600)]"></div>
                    <span className="ml-3 text-sm text-gray-600">Cargando proyectos...</span>
                  </div>
                </td>
              </tr>
            ) : proyectosPaginados.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-base font-medium">No hay datos</p>
                    <p className="text-sm mt-1">
                      {proyectosFiltrados.length === 0 && proyectos.length > 0 
                        ? "No se encontraron proyectos que coincidan con la búsqueda" 
                        : "No hay proyectos registrados en el sistema"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              proyectosPaginados.map((proyecto) => (
                <tr key={proyecto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-[var(--color-azul-900)] hover:underline">
                    <Link to={`/admin/categorias/${proyecto.id}`}>
                      {proyecto.nombre}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{proyecto.abreviacion}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{proyecto.descripcion}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{proyecto.administrador}</td>
                  <td className="px-6 py-4">
                    <span className={`justify-center items-center inline-flex w-24 px-3 py-1 text-xs font-medium rounded-full
                      ${proyecto.estatus === "Habilitado"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"}`}>
                      {proyecto.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditar(proyecto)}
                      className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors"
                      title="Editar proyecto"
                    >
                      <Pencil size={16} />
                    </button>

                    <button 
                      onClick={() => {
                        const nuevoEstado = proyecto.estatus === "Habilitado" ? "Deshabilitado" : "Habilitado";
                        showConfirmation(
                          "Cambiar estado",
                          `¿Deseas cambiar el estado de ${proyecto.nombre} a ${nuevoEstado}?`,
                          "question",
                          () => handleCambiarEstatus(proyecto),
                          () => console.log("Cambio cancelado")
                        );
                      }}
                      className="bg-[var(--color-azul-400)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors"
                      title="Cambiar estado"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación - Solo mostrar si hay proyectos y más de una página */}
      {!loading && totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => cambiarPagina(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs 
                ${paginaActual === i + 1
                  ? "bg-[var(--color-azul-600)] text-white"
                  : "border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Modal Crear Proyecto */}
      {modalAbierto && (
        <ModalCrearProyecto
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarProyecto}
        />
      )}

      {/* Modal Editar Proyecto */}
      {mostrarModal && (
        <ModalEditarProyecto
          proyecto={proyectoSeleccionado}
          onClose={() => setMostrarModal(false)}
          onGuardar={guardarCambios}
        />
      )}
    </div>
  );
}
