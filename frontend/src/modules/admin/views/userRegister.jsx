import { useState } from "react"
import { Eye, EyeOff, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from '../../../kernel/alerts'
import { createUser } from '../adapters/user.controller'
import { validateName, validateEmail, validatePhoneNumber, validatePassword } from '../../../kernel/validations'

const UserRegister = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    // Validar formulario
    const validateForm = () => {
        const newErrors = {}

        // Validar nombre
        const nameError = validateName(formData.nombre, 'El nombre')
        if (nameError) newErrors.nombre = nameError

        // Validar apellidos
        const lastnameError = validateName(formData.apellidos, 'Los apellidos')
        if (lastnameError) newErrors.apellidos = lastnameError

        // Validar email
        const emailError = validateEmail(formData.email)
        if (emailError) newErrors.email = emailError

        // Validar teléfono
        const phoneError = validatePhoneNumber(formData.telefono)
        if (phoneError) newErrors.telefono = phoneError

        // Validar contraseña
        const passwordError = validatePassword(formData.password)
        if (passwordError) newErrors.password = passwordError

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            showErrorToast({
                title: 'Error de validación',
                text: 'Por favor, corrija los errores en el formulario'
            })
            return
        }

        setLoading(true)
        
        try {
            console.log('Enviando datos del usuario:', {
                name: formData.nombre,
                lastname: formData.apellidos,
                email: formData.email,
                phoneNumber: formData.telefono,
                password: formData.password
            })

            const response = await createUser(
                formData.nombre.trim(),
                formData.apellidos.trim(),
                formData.email.trim(),
                formData.telefono.trim(),
                formData.password
            )

            console.log('Respuesta del servidor:', response)

            showSuccessToast({
                title: 'Usuario registrado',
                text: 'El usuario se ha registrado exitosamente'
            })

            // Limpiar formulario
            setFormData({
                nombre: '',
                apellidos: '',
                email: '',
                telefono: '',
                password: ''
            })

            // Navegar de vuelta a la lista después de 2 segundos
            setTimeout(() => {
                navigate('/admin/usuarios')
            }, 2000)

        } catch (error) {
            console.error('Error al registrar usuario:', error)
            showErrorToast({
                title: 'Error al registrar',
                text: error.message || 'Ocurrió un error al registrar el usuario'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro de Nuevo Usuario</h1>
                    <p className="text-gray-600">Complete todos los campos para registrar un nuevo usuario en el sistema.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder="Ej. Mario Alonso"
                                className={`text-sm w-full px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                    errors.nombre 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-cyan-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.nombre ? (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">Ingrese su nombre</p>
                            )}
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
                                value={formData.apellidos}
                                onChange={handleInputChange}
                                placeholder="Ej. Diaz Ortiz"
                                className={`text-sm w-full px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                    errors.apellidos 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-cyan-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.apellidos ? (
                                <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">Ingrese sus apellidos</p>
                            )}
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
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="correo@ejemplo.com"
                                className={`text-sm w-full px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                    errors.email 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-cyan-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.email ? (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">Ingrese su correo electrónico</p>
                            )}
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
                                value={formData.telefono}
                                onChange={handleInputChange}
                                placeholder="777 123 4567"
                                className={`text-sm w-full px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                    errors.telefono 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-cyan-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.telefono ? (
                                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">Ingrese su teléfono</p>
                            )}
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
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2 pr-12 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                        errors.password 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-cyan-500'
                                    }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password ? (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">Ingrese su contraseña (mínimo 6 caracteres)</p>
                            )}
                        </div>

                        {/* Botón de envío */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/usuarios")}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
                                    loading 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-300 hover:bg-gray-400 text-black'
                                }`}
                            >
                                Regresar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
                                    loading 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                        : 'bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Registrar Usuario
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserRegister
