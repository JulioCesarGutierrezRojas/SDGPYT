import { useState } from "react"
import { Eye, EyeOff, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();

    return (
        <div className="flex-1">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro de Nuevo Usuario</h1>
                    <p className="text-gray-600">Complete todos los campos para registrar un nuevo usuario en el sistema.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form className="space-y-6">
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
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese su nombre</p>
                        </div>

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
                                className="text-sm w-full px-4 py-2 border border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-sm text-gray-500">Ingrese sus apellidos</p>
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2" >
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="correo@ejemplo.com"
                                className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Ingrese su correo electrónico
                            </p>
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
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Ingrese su contraseña (mínimo 6 caracteres)
                            </p>
                        </div>

                        {/* Botón de envío */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/usuarios")}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg transition-colors "
                            >
                                Regresar
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black font-semibold rounded-lg transition-colors "
                            >
                                <Plus size={18} />
                                Registrar Usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserRegister
