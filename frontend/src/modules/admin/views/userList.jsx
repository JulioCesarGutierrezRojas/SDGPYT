import { useState } from "react"
import { Pencil, Trash2, Download, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router"
import { showConfirmation } from "../../../kernel/alerts"
import EditUserModal from "../../admin/components/editUser"

const UserList = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 7

    const users = [
        {
            id: 1,
            nombre: "Clara",
            apellidos: "Bennett",
            correo: "clara@example.com",
            telefono: "555-123-4567",
            rol: "Administrador",
            estado: "Habilitado"
        },
        {
            id: 2,
            nombre: "Laura",
            apellidos: "Smith",
            correo: "laurah@example.com",
            telefono: "555-987-6543",
            rol: "Usuario",
            estado: "Deshabilitado"
        },
        {
            id: 3,
            nombre: "Mike",
            apellidos: "Brown",
            correo: "mike@example.com",
            telefono: "555-456-7890",
            rol: "Usuario",
            estado: "Habilitado"
        },
    ]

    const filteredUsers = users.filter(
        (user) =>
            `${user.nombre} ${user.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.correo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    )

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    const [showEditModal, setShowEditModal] = useState(false)

    const handleEditClick = (user) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleSaveUser = (updatedUser) => {
        console.log("Usuario actualizado:", updatedUser)
        setShowEditModal(false)
    }

    return (
        <div className="max-w-7xl mx-auto p-3">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
                <p className="text-gray-600">
                    Gestionar todos los usuarios en la aplicación (visualiza, añade, edita o elimina un usuario)
                </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre o correo"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value), setCurrentPage(1) }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                </div>
                <button onClick={() => navigate("/admin/registroUsuario")}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    Crear
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo electrónico</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nombre} {user.apellidos}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.correo}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.telefono}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.rol}</td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`justify-center items-center inline-flex w-24 px-3 py-1 text-xs font-medium rounded-full ${user.estado === "Habilitado"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-gray-300 text-gray-700"
                                            }`}
                                    >
                                        {user.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const nuevoEstado = user.estado === "Habilitado" ? "Deshabilitado" : "Habilitado";
                                                setSelectedUser(user);
                                                showConfirmation(
                                                    "Cambiar estado",
                                                    `¿Deseas cambiar el estado de ${user.nombre} a ${nuevoEstado}?`,
                                                    "question",
                                                    () => {
                                                        console.log(`Estado de ${user.nombre} cambiado a ${nuevoEstado}`);
                                                    },
                                                    () => {
                                                        console.log("Cambio cancelado");
                                                    }
                                                );
                                            }}
                                            className="bg-[var(--color-azul-400)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                                            <Download size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                showConfirmation(
                                                    "¿Eliminar usuario?",
                                                    `¿Estás segura/o de que deseas eliminar a ${user.nombre}?`, "warning",
                                                    () => {
                                                        console.log("Usuario eliminado:", user);
                                                    },
                                                    () => {
                                                        console.log("Cancelado");
                                                    }
                                                );
                                            }}
                                            className="bg-[var(--color-azul-200)] hover:bg-cyan-300 text-black w-7 h-7 flex items-center justify-center rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50">
                    <ChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => changePage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${currentPage === i + 1
                                ? "bg-[var(--color-azul-600)] text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50">
                    <ChevronRight />
                </button>
            </div>

            {showEditModal && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    )
}

export default UserList