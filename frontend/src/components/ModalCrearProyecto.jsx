// src/modules/users/components/ModalCrearProyecto.jsx
import { useState, useEffect } from "react";
import { X, Search, User } from "lucide-react";
import { getAllUsers } from "../modules/admin/adapters/user.controller";

// Función para verificar si el usuario actual es ROOT
const isUserRoot = () => {
  try {
    const rolesString = localStorage.getItem('roles');
    const roles = JSON.parse(rolesString || '[]');
    
    // Verificar si el array incluye "ROOT"
    // Backend format: [{role: "ROOT", project: "GLOBAL"}, ...]
    const hasRootRole = roles.some(role => {
      // Si es string (legacy), comparar directamente
      if (typeof role === 'string') {
        return role === 'ROOT';
      }
      // Si es objeto (nuevo formato), verificar la propiedad role
      if (typeof role === 'object' && role.role) {
        return role.role === 'ROOT';
      }
      return false;
    });
    return hasRootRole;
  } catch (error) {
    console.error('Error al verificar rol ROOT:', error);
    return false;
  }
};

export default function ModalCrearProyecto({ onClose, onGuardar }) {
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: "",
    abreviacion: "",
    descripcion: "",
  });
  
  // Estados para la búsqueda y selección de administrador (solo para ROOT)
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busquedaAdmin, setBusquedaAdmin] = useState("");
  const [adminSeleccionado, setAdminSeleccionado] = useState(null);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  
  // Verificar si el usuario actual es ROOT
  const userIsRoot = isUserRoot();

  // Cargar usuarios al montar el componente (solo si es ROOT)
  useEffect(() => {
    if (userIsRoot) {
      loadUsuarios();
    }
  }, [userIsRoot]);

  const loadUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const response = await getAllUsers();
      if (response.result && Array.isArray(response.result)) {
        const mappedUsers = response.result.map(user => ({
          id: user.userId,
          nombre: `${user.name} ${user.lastname}`,
          email: user.email
        }));
        setUsuarios(mappedUsers);
        setUsuariosFiltrados(mappedUsers);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Filtrar usuarios basado en la búsqueda
  useEffect(() => {
    if (busquedaAdmin.trim() === "") {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()) ||
        usuario.email.toLowerCase().includes(busquedaAdmin.toLowerCase())
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [busquedaAdmin, usuarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProyecto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeleccionarAdmin = (usuario) => {
    setAdminSeleccionado(usuario);
    setMostrarBusqueda(false);
    setBusquedaAdmin("");
  };

  const handleRemoverAdmin = () => {
    setAdminSeleccionado(null);
  };

  const handleSubmit = () => {
    if (nuevoProyecto.nombre.trim()) {
      const proyectoCompleto = {
        ...nuevoProyecto,
        adminUserId: adminSeleccionado ? adminSeleccionado.id : null
      };
      onGuardar(proyectoCompleto);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg border border-[var(--color-azul-300)] w-full max-w-md p-6 relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[var(--color-azul-950)] mb-4">Crear Proyecto</h2>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={nuevoProyecto.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Abreviación</label>
            <input
              type="text"
              name="abreviacion"
              value={nuevoProyecto.abreviacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={nuevoProyecto.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Sección de Administrador - Solo visible para usuarios ROOT */}
          {userIsRoot && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">Administrador del Proyecto (Opcional)</label>
            
            {adminSeleccionado ? (
              // Usuario seleccionado
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{adminSeleccionado.nombre}</p>
                    <p className="text-xs text-blue-600">{adminSeleccionado.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoverAdmin}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Búsqueda de usuario
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar usuario por nombre o email..."
                    value={busquedaAdmin}
                    onChange={(e) => {
                      setBusquedaAdmin(e.target.value);
                      setMostrarBusqueda(true);
                    }}
                    onFocus={() => setMostrarBusqueda(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                {/* Dropdown de resultados */}
                {mostrarBusqueda && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                    {loadingUsuarios ? (
                      <div className="p-3 text-center text-gray-500">
                        Cargando usuarios...
                      </div>
                    ) : usuariosFiltrados.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        {busquedaAdmin.trim() === "" ? "Escribe para buscar usuarios" : "No se encontraron usuarios"}
                      </div>
                    ) : (
                      usuariosFiltrados.map((usuario) => (
                        <div
                          key={usuario.id}
                          onClick={() => handleSeleccionarAdmin(usuario)}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{usuario.nombre}</p>
                              <p className="text-xs text-gray-500">{usuario.email}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
              <p className="text-xs text-gray-500 mt-1">
                El administrador tendrá permisos completos sobre este proyecto
              </p>
            </div>
          )}

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-white font-medium rounded"
          >
            Guardar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
