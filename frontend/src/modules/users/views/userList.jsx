import { useState } from "react"
import { Pencil, Trash2, Download, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"

const UserList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 7

    const users = [
        { id: 1, name: "Clara Bennett", email: "clara.bennett@example.com", status: "Active" },
        { id: 2, name: "Laura Smith", email: "laura.smith@example.com", status: "Inactive" },
        { id: 3, name: "Mike Brown", email: "mike.brown@example.com", status: "Active" },
        { id: 4, name: "Jane Doe", email: "jane.doe@example.com", status: "Active" },
        { id: 5, name: "John Appleseed", email: "john.apple@example.com", status: "Inactive" },
        { id: 6, name: "Leo Messi", email: "leo.messi@example.com", status: "Active" },
        { id: 7, name: "Cristina Hall", email: "cristina.hall@example.com", status: "Active" },
        { id: 8, name: "Tom Cruise", email: "tom.cruise@example.com", status: "Inactive" },
    ]

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
                <p className="text-gray-600">
                    Gestionar todos los usuarios en la aplicación, visualiza, añade, edita o eliminar un usuario
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
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    Crear
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors">
                                            <Pencil size={16} />
                                        </button>
                                        <button className="bg-[var(--color-azul-400)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors">
                                            <Download size={16} />
                                        </button>
                                        <button className="bg-[var(--color-azul-200)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors">
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
        </div>
    )
}

export default UserList
