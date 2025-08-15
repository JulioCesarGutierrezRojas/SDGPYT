import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { showErrorToast } from "../../../kernel/alerts";
import { getAllAuditLogs } from "../adapters/audit.controller";

const BitacoraAcciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const registrosPorPagina = 10;

  // Cargar registros de auditoría al montar el componente
  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllAuditLogs();
      if (response.result && Array.isArray(response.result)) {
        setAuditLogs(response.result);
      } else {
        setAuditLogs([]);
      }
    } catch (error) {
      console.error('Error al cargar registros de auditoría:', error);
      showErrorToast({
        title: 'Error',
        text: 'No se pudieron cargar los registros de auditoría'
      });
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Función para formatear la hora
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Función para mostrar detalles del registro
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  // Función para parsear JSON de forma segura
  const safeJsonParse = (jsonString) => {
    if (!jsonString) return null;
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (error) {
      return jsonString; // Devolver el string original si no es JSON válido
    }
  };

  const registrosFiltrados = auditLogs.filter(
    (registro) =>
      registro.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.move?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.tableName?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Usuario
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Tabla
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Operación
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Hora
                </th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-azul-600)]"></div>
                      <span className="ml-3 text-sm sm:text-base text-gray-600">Cargando registros...</span>
                    </div>
                  </td>
                </tr>
              ) : registrosPaginados.length > 0 ? (
                registrosPaginados.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                      <div className="truncate max-w-[120px] sm:max-w-none">
                        {registro.username || '-'}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      <div className="truncate max-w-[120px] sm:max-w-none">
                        {registro.tableName || '-'}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        registro.move === 'INSERT' ? 'bg-green-100 text-green-800' :
                        registro.move === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                        registro.move === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {registro.move || '-'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {formatDate(registro.eventTime)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {formatTime(registro.eventTime)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(registro)}
                        className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-base sm:text-lg font-medium">No hay datos</p>
                      <p className="text-xs sm:text-sm mt-1">
                        {registrosFiltrados.length === 0 && auditLogs.length > 0 
                          ? "No se encontraron registros que coincidan con la búsqueda" 
                          : "No hay registros de auditoría en el sistema"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación - Solo mostrar si hay registros y más de una página */}
      {!loading && totalPaginas > 1 && (
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
      )}

      {/* Modal de detalles */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Detalles del Registro de Auditoría</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">ID</h3>
                  <p className="text-sm text-gray-900">{selectedLog.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Usuario</h3>
                  <p className="text-sm text-gray-900">{selectedLog.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Tabla</h3>
                  <p className="text-sm text-gray-900">{selectedLog.tableName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Operación</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedLog.move === 'INSERT' ? 'bg-green-100 text-green-800' :
                    selectedLog.move === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                    selectedLog.move === 'DELETE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedLog.move}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</h3>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedLog.eventTime)} - {formatTime(selectedLog.eventTime)}
                  </p>
                </div>
              </div>

              {/* Datos antes y después */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Datos antes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Datos Antes</h3>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    {selectedLog.dataBefore ? (
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                        {safeJsonParse(selectedLog.dataBefore)}
                      </pre>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sin datos anteriores</p>
                    )}
                  </div>
                </div>

                {/* Datos después */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Datos Después</h3>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    {selectedLog.dataAfter ? (
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                        {safeJsonParse(selectedLog.dataAfter)}
                      </pre>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sin datos posteriores</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
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

export default BitacoraAcciones;
