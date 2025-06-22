import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const EditUserModal = ({ user, onClose, onSave }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        apellidos: user.apellidos || "",
        email: user.email || "",
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        password: "", 
    })

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <>
            {/* Fondo modal */}
            <div
                className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
                onClick={onClose}
            />
            
            <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
                <div
                    className="bg-white rounded-xl shadow-sm border border-cyan-400 p-6 w-[600px] mx-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Editar Usuario</h1>
                        <p className="text-gray-600">Modifique los campos necesarios y guarde los cambios.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Apellidos */}
                        <div>
                            <label htmlFor="apellidos" className="block text-sm font-semibold text-gray-700 mb-2">
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                id="apellidos"
                                name="apellidos"
                                placeholder="Ej. Diaz Ortiz"
                                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                value={formData.apellidos}
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese sus apellidos</p>
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="correo@ejemplo.com"
                                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese su correo electrónico</p>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Ej. Mario Alonso"
                                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese su nombre</p>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                placeholder="777 123 4567"
                                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese su teléfono</p>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Ingrese su contraseña (mínimo 6 caracteres)</p>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditUserModal
