import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const BitacoraAcciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 7;

  const acciones = [ ];

  const registrosFiltrados = acciones.filter(
    (registro) =>
      registro.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.accion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
  const registrosPaginados = registrosFiltrados.slice(
    (currentPage - 1) * registrosPorPagina,
    currentPage * registrosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setCurrentPage(nuevaPagina);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bitácora de acciones
        </h1>
        <p className="text-gray-600">
          Historial de actividades realizadas en el sistema.
        </p>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por usuario o acción"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Hora
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrosPaginados.length > 0 ? (
              registrosPaginados.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {registro.usuario}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registro.accion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registro.fecha}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registro.hora}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => cambiarPagina(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${
              currentPage === i + 1
                ? "bg-[var(--color-azul-600)] text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => cambiarPagina(currentPage + 1)}
          disabled={currentPage === totalPaginas}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BitacoraAcciones;
