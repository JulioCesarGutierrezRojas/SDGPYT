import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Download } from "lucide-react";
import ModalCrearProyecto from "../../../components/ModalCrearProyecto";
import ModalEditarProyecto from "../components/ModalEditarProyecto";

const proyectosDummy = [
  {
    id: 1,
    nombre: "Restaurante café sin pan",
    abreviacion: "RCSP",
    descripcion: "Restaurante en proceso",
    estatus: "Habilitado",
  },
  {
    id: 2,
    nombre: "Sistema de Reservas",
    abreviacion: "SR",
    descripcion: "App para hoteles en Morelos",
    estatus: "Deshabilitado",
  },
];

export default function ProjectsAdmin() {
  const [proyectos, setProyectos] = useState(proyectosDummy);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const proyectosPorPagina = 5;

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

  const handleGuardarProyecto = (nuevoProyecto) => {
    setProyectos((prev) => [
      ...prev,
      { ...nuevoProyecto, id: Date.now() },
    ]);
    setModalAbierto(false);
  };

  const handleEditar = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setMostrarModal(true);
  };

  const guardarCambios = (proyectoEditado) => {
    console.log("Guardado en backend:", proyectoEditado);
    // Aquí iría tu lógica con Axios o fetch para actualizar en la BD
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
      setProyectos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCambiarEstatus = (id) => {
    setProyectos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estatus: p.estatus === "Habilitado" ? "Deshabilitado" : "Habilitado" }
          : p
      )
    );
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estatus</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proyectosPaginados.map((proyecto) => (
              <tr key={proyecto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-[var(--color-azul-900)] hover:underline">
                  <Link to={`/admin/categorias/${proyecto.id}`}>
                    {proyecto.nombre}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{proyecto.abreviacion}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{proyecto.descripcion}</td>
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
                    onClick={() =>
                      handleEditar({
                        nombre: "Proyecto X",
                        abreviacion: "PX",
                        descripcion: "Descripción ejemplo",
                        estatus: "Habilitado",
                      })
                    }
                    className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => handleCambiarEstatus(proyecto.id)}
                    className="bg-[var(--color-azul-400)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                    <Download size={16} />
                  </button>

                  <button onClick={() => handleEliminar(proyecto.id)}
                    className="bg-[var(--color-azul-200)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
