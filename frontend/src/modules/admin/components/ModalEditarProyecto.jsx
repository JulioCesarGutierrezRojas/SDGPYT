import { useState, useEffect } from "react";
import { X, User, Search } from "lucide-react";
import { getAllUsers } from "../adapters/user.controller";

export default function ModalEditarProyecto({ proyecto, onClose, onGuardar }) {
    const [proyectoEditado, setProyectoEditado] = useState({
        nombre: "",
        abreviacion: "",
        descripcion: "",
    });
    
    // Estados para gestión de administrador
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchAdmin, setSearchAdmin] = useState("");
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showUserList, setShowUserList] = useState(false);

    useEffect(() => {
        if (proyecto) {
            setProyectoEditado(proyecto);
        }
        loadUsers();
    }, [proyecto]);
    
    // Efecto separado para establecer el administrador después de cargar usuarios
    useEffect(() => {
        if (proyecto && users.length > 0 && proyecto.administrador && proyecto.administrador !== "Sin asignar") {
            // Buscar el usuario en la lista por nombre y apellido
            const adminUser = users.find(user => {
                const fullName = `${user.name} ${user.lastname}`;
                return fullName === proyecto.administrador;
            });
            
            if (adminUser) {
                setSelectedAdmin({
                    id: adminUser.userId,
                    name: proyecto.administrador,
                    email: proyecto.adminEmail || adminUser.email
                });
                setSearchAdmin(proyecto.administrador);
            } else {
                // Si no se encuentra en la lista, mantener la información del proyecto
                setSelectedAdmin({
                    name: proyecto.administrador,
                    email: proyecto.adminEmail || ""
                });
                setSearchAdmin(proyecto.administrador);
            }
        }
    }, [proyecto, users]);
    
    const loadUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response.result && Array.isArray(response.result)) {
                setUsers(response.result);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };
    
    // Filtrar usuarios basado en la búsqueda
    useEffect(() => {
        if (searchAdmin.trim() === "") {
            setFilteredUsers([]);
            setShowUserList(false);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchAdmin.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchAdmin.toLowerCase()) ||
                user.email.toLowerCase().includes(searchAdmin.toLowerCase())
            );
            setFilteredUsers(filtered);
            setShowUserList(true);
        }
    }, [searchAdmin, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProyectoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectAdmin = (user) => {
        setSelectedAdmin({
            id: user.userId,
            name: `${user.name} ${user.lastname}`,
            email: user.email
        });
        setSearchAdmin(`${user.name} ${user.lastname}`);
        setShowUserList(false);
    };
    
    const handleRemoveAdmin = () => {
        setSelectedAdmin(null);
        setSearchAdmin("");
    };
    
    const handleSubmit = () => {
        if (proyectoEditado.nombre.trim()) {
            const dataToSave = {
                ...proyectoEditado,
                adminUserId: selectedAdmin?.id || null
            };
            onGuardar(dataToSave);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg border border-[var(--color-azul-300)] w-full max-w-md p-6 relative">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-[var(--color-azul-950)] mb-4">
                    Editar Proyecto
                </h2>

                <div className="space-y-3 text-sm">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={proyectoEditado.nombre}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Abreviación</label>
                        <input
                            type="text"
                            name="abreviacion"
                            value={proyectoEditado.abreviacion}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={proyectoEditado.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    
                    {/* Selección de Administrador */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Administrador del Proyecto (Opcional)
                        </label>
                        
                        {selectedAdmin ? (
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedAdmin.name}</p>
                                        <p className="text-xs text-gray-500">{selectedAdmin.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveAdmin}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Quitar
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuario por nombre o email"
                                        value={searchAdmin}
                                        onChange={(e) => setSearchAdmin(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                
                                {/* Lista de usuarios filtrados */}
                                {showUserList && filteredUsers.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredUsers.map((user) => (
                                            <button
                                                key={user.userId}
                                                onClick={() => handleSelectAdmin(user)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.name} {user.lastname}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {showUserList && filteredUsers.length === 0 && searchAdmin.trim() !== "" && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                        <p className="text-sm text-gray-500">No se encontraron usuarios</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-white font-medium rounded"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}