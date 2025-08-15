import { useState, useEffect } from "react";
import { Pencil, Save, X, Check } from "lucide-react";
import { showSuccessToast, showErrorToast, showConfirmation } from "../../../../kernel/alerts";
import { validateName, validateEmail, validatePhoneNumber, validatePassword } from "../../../../kernel/validations";
import { getUserById, updateUser } from "../../adapters/user.controller";
import EditFieldModal from "./EditFieldModal";
import EstatusBadge from "./EstatusBadge";

const UserProfile = () => {
    const [user, setUser] = useState({
        id: null,
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        contraseña: "••••••••",
        rol: "Administrador",
        estatus: "Habilitado",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            // Obtener el ID del usuario logueado desde localStorage
            const userString = localStorage.getItem('user');
            let userData = {};
            
            if (userString) {
                try {
                    userData = JSON.parse(userString);
                } catch (parseError) {
                    // Si falla el parse, intentar obtener desde el token o usar datos por defecto
                    const token = localStorage.getItem('token');
                    if (token) {
                        // Decodificar token JWT si es necesario o usar un ID por defecto
                        userData = { id: 1 }; // ID por defecto para admin
                    }
                }
            }
            
            const userId = userData.id;
            
            if (!userId) {
                showErrorToast({
                    title: 'Error',
                    text: 'No se pudo obtener la información del usuario'
                });
                return;
            }

            const response = await getUserById(userId);
            if (response.result) {
                const userData = {
                    id: response.result.userId,
                    nombre: response.result.name,
                    apellido: response.result.lastname,
                    correo: response.result.email,
                    telefono: response.result.phoneNumber,
                    contraseña: "••••••••",
                    rol: "Administrador",
                    estatus: response.result.status ? "Habilitado" : "Deshabilitado"
                };
                setUser(userData);
                setOriginalUser({ ...userData });
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            showErrorToast({
                title: 'Error',
                text: 'No se pudo cargar la información del perfil'
            });
        } finally {
            setLoading(false);
        }
    };

    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const validateField = (fieldKey, value) => {
        let error = null;
        
        switch (fieldKey) {
            case 'nombre':
                error = validateName(value, 'El nombre');
                break;
            case 'apellido':
                error = validateName(value, 'El apellido');
                break;
            case 'correo':
                error = validateEmail(value);
                break;
            case 'telefono':
                error = validatePhoneNumber(value);
                break;
            case 'contraseña':
                if (value && value.trim() !== '') {
                    error = validatePassword(value);
                }
                break;
        }
        
        return error;
    };

    const handleEditClick = (fieldKey) => {
        setEditingField(fieldKey);
        setTempValue(fieldKey === 'contraseña' ? '' : user[fieldKey]);
        setFieldErrors(prev => ({ ...prev, [fieldKey]: null }));
    };

    const handleSaveField = () => {
        const error = validateField(editingField, tempValue);
        
        if (error) {
            setFieldErrors(prev => ({ ...prev, [editingField]: error }));
            return;
        }

        if (editingField === 'contraseña' && (!tempValue || tempValue.trim() === '')) {
            setEditingField(null);
            return;
        }

        setUser({ ...user, [editingField]: tempValue });
        setEditingField(null);
        setFieldErrors(prev => ({ ...prev, [editingField]: null }));
        setHasChanges(true);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setTempValue("");
        setFieldErrors(prev => ({ ...prev, [editingField]: null }));
    };

    const handleSaveChanges = async () => {
        if (!hasChanges) return;
        
        setSaving(true);
        try {
            let updateData = {
                id: user.id,
                name: user.nombre,
                lastname: user.apellido,
                email: user.correo,
                phoneNumber: user.telefono
            };

            if (user.contraseña && user.contraseña.trim() !== '' && user.contraseña !== '••••••••') {
                updateData.password = user.contraseña;
            } else {
                updateData.password = 'temp';
            }

            await updateUser(
                updateData.id,
                updateData.name,
                updateData.lastname,
                updateData.email,
                updateData.phoneNumber,
                updateData.password
            );

            showSuccessToast({
                title: 'Perfil actualizado',
                text: 'Los cambios se han guardado correctamente'
            });
            
            setHasChanges(false);
            setOriginalUser({ ...user });
            await loadUserProfile();
            
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            showErrorToast({
                title: 'Error',
                text: error.message || 'No se pudieron guardar los cambios'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        showConfirmation(
            '¿Descartar cambios?',
            'Se perderán todos los cambios no guardados',
            'warning',
            () => {
                setUser({ ...originalUser });
                setHasChanges(false);
                setEditingField(null);
                setFieldErrors({});
            }
        );
    };

    const fieldLabels = {
        nombre: "Nombre",
        apellido: "Apellido",
        correo: "Correo Electrónico",
        telefono: "Teléfono",
        contraseña: "Contraseña",
        rol: "Rol",
    };

    // Generar iniciales del usuario
    const iniciales = user.nombre && user.apellido ? 
        `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase() : 
        "AD";

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-azul-600)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mi Perfil</h1>

                {/* Encabezado con avatar e información */}
                <div className="flex items-center gap-4 mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-azul-600)] flex items-center justify-center text-lg font-bold text-white shadow">
                        {iniciales}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{`${user.nombre} ${user.apellido}`}</h2>
                        <p className="text-sm text-gray-500">{user.correo}</p>
                        <p className="text-sm text-gray-500">{user.rol}</p>
                    </div>
                </div>

                {/* Tabla de datos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(fieldLabels).map(([key, label]) => (
                                <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap w-1/4">
                                        {label}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 w-1/2">
                                        {editingField === key ? (
                                            <div className="space-y-1">
                                                <input
                                                    type={key === 'contraseña' ? 'password' : key === 'correo' ? 'email' : 'text'}
                                                    value={tempValue}
                                                    onChange={(e) => setTempValue(e.target.value)}
                                                    placeholder={key === 'contraseña' ? 'Nueva contraseña (opcional)' : ''}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                                                        fieldErrors[key] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    autoFocus
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSaveField();
                                                        } else if (e.key === 'Escape') {
                                                            handleCancelEdit();
                                                        }
                                                    }}
                                                />
                                                {fieldErrors[key] && (
                                                    <p className="text-red-500 text-xs">{fieldErrors[key]}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{key === "contraseña" ? "••••••••" : user[key]}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right w-1/4">
                                        {editingField === key ? (
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={handleSaveField}
                                                    className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded transition-colors"
                                                    title="Guardar"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white w-8 h-8 flex items-center justify-center rounded transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(key)}
                                                className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Botones de acción */}
                {hasChanges && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-yellow-800">Tienes cambios sin guardar</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDiscardChanges}
                                    className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-colors"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                    className="px-6 py-2 text-sm bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default UserProfile;
