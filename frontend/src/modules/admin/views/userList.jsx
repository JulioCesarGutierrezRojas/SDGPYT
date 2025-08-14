import { useState, useEffect } from "react"
import { Pencil, Trash2, Download, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router"
import { showConfirmation, showSuccessToast, showErrorToast } from "../../../kernel/alerts"
import EditUserModal from "../../admin/components/editUser"
import { getAllUsers, changeUserStatus, updateUser } from "../adapters/user.controller"

const UserList = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const usersPerPage = 7

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUsers()
            if (response.result && Array.isArray(response.result)) {
                // Mapear los campos del backend a los del frontend
                const mappedUsers = response.result.map(user => ({
                    id: user.userId,
                    nombre: user.name,
                    apellidos: user.lastname,
                    correo: user.email,
                    telefono: user.phoneNumber,
                    rol: user.email === 'admin@gmail.com' ? "Administrador" : "Usuario",
                    estado: user.status ? "Habilitado" : "Deshabilitado"
                }))
                setUsers(mappedUsers)
            } else {
                setUsers([])
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error)
            showErrorToast({
                title: 'Error',
                text: 'No se pudieron cargar los usuarios'
            })
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

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

    const handleEditClick = (user) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleSaveUser = async (updatedUser) => {
        try {
            // Preparar los datos para enviar al backend
            const updateData = {
                id: selectedUser.id,
                name: updatedUser.nombre,
                lastname: updatedUser.apellidos,
                email: updatedUser.email,
                phoneNumber: updatedUser.telefono
            }

            // Solo incluir la contraseña si se proporcionó una nueva
            if (updatedUser.password && updatedUser.password.trim() !== '') {
                updateData.password = updatedUser.password
            } else {
                // Si no hay contraseña nueva, usar una temporal (el backend la ignorará)
                updateData.password = 'temp'
            }

            console.log('Enviando datos de actualización:', updateData)

            // Llamar al endpoint de actualización
            const response = await updateUser(
                updateData.id,
                updateData.name,
                updateData.lastname,
                updateData.email,
                updateData.phoneNumber,
                updateData.password
            )

            showSuccessToast({
                title: 'Usuario actualizado',
                text: 'Los datos del usuario se han actualizado correctamente'
            })
            setShowEditModal(false)
            await loadUsers() // Recargar la lista
        } catch (error) {
            console.error('Error al actualizar usuario:', error)
            showErrorToast({
                title: 'Error',
                text: error.message || 'No se pudo actualizar el usuario'
            })
        }
    }

    const handleChangeUserStatus = async (user) => {
        try {
            await changeUserStatus(user.id)
            
            showSuccessToast({
                title: 'Estado actualizado',
                text: `El estado de ${user.nombre} ha sido actualizado correctamente`
            })
            
            await loadUsers() // Recargar la lista
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error)
            showErrorToast({
                title: 'Error',
                text: error.message || 'No se pudo cambiar el estado del usuario'
            })
        }
    }

    // Función para verificar si es el usuario root
    const isRootUser = (user) => {
        return user.correo === 'admin@gmail.com' || 
               (user.nombre === 'Administrador' && user.apellidos === 'Root')
    }

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
            {/* Header responsivo */}
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
                <p className="text-sm sm:text-base text-gray-600">
                    Gestionar todos los usuarios en la aplicación (visualiza, añade, edita o elimina un usuario)
                </p>
            </div>

            {/* Barra de búsqueda y botón crear responsiva */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre o correo"
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Validación básica: solo permitir letras, números, espacios, @ y .
                            if (/^[a-zA-Z0-9\s@.]*$/.test(value) || value === '') {
                                setSearchTerm(value);
                                setCurrentPage(1);
                            }
                        }}
                        maxLength={50}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                    />
                </div>
                <button 
                    onClick={() => navigate("/admin/registroUsuario")}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded-md transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Crear Usuario</span>
                    <span className="sm:hidden">Crear</span>
                </button>
            </div>

            {/* Tabla responsiva con scroll horizontal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Nombre</th>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Correo electrónico</th>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Teléfono</th>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Rol</th>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Estado</th>
                                <th className="px-3 sm:px-4 lg:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-azul-600)]"></div>
                                            <span className="ml-3 text-sm sm:text-base text-gray-600">Cargando usuarios...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <p className="text-base sm:text-lg font-medium">No hay datos</p>
                                            <p className="text-xs sm:text-sm mt-1">
                                                {filteredUsers.length === 0 && users.length > 0 
                                                    ? "No se encontraron usuarios que coincidan con la búsqueda" 
                                                    : "No hay usuarios registrados en el sistema"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                                            <div className="truncate max-w-[120px] sm:max-w-none">
                                                {user.nombre} {user.apellidos}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900">
                                            <div className="truncate max-w-[150px] sm:max-w-none">
                                                {user.correo}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{user.telefono}</td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">{user.rol}</td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-center">
                                            <span
                                                className={`justify-center items-center inline-flex w-16 sm:w-20 lg:w-24 px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${user.estado === "Habilitado"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                {user.estado}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-center">
                                            {isRootUser(user) ? (
                                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded cursor-not-allowed opacity-50"
                                                        title="No se puede editar el usuario administrador"
                                                    >
                                                        <Pencil size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded cursor-not-allowed opacity-50"
                                                        title="No se puede cambiar el estado del usuario administrador"
                                                    >
                                                        <Download size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded cursor-not-allowed opacity-50"
                                                        title="No se puede eliminar el usuario administrador"
                                                    >
                                                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded transition-colors"
                                                        title="Editar usuario"
                                                    >
                                                        <Pencil size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const nuevoEstado = user.estado === "Habilitado" ? "Deshabilitado" : "Habilitado";
                                                            showConfirmation(
                                                                "Cambiar estado",
                                                                `¿Deseas cambiar el estado de ${user.nombre} a ${nuevoEstado}?`,
                                                                "question",
                                                                () => handleChangeUserStatus(user),
                                                                () => console.log("Cambio cancelado")
                                                            );
                                                        }}
                                                        className="bg-[var(--color-azul-400)] hover:bg-cyan-300 text-black w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded transition-colors"
                                                        title="Cambiar estado"
                                                    >
                                                        <Download size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación - Solo mostrar si hay usuarios y más de una página */}
            {!loading && totalPages > 1 && (
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
            )}

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