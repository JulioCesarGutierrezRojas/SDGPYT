import { useState } from "react";
import { Pencil } from "lucide-react";
import EditFieldModal from "./EditFieldModal"; // Modal para editar campos
import Toggle from "./ToggleSwitch"; // Componente personalizado para el switch

const UserProfile = () => {
    const [user, setUser] = useState({
        nombre: "Clara",
        apellido: "Bennett",
        correo: "clara.bennett@example.com",
        telefono: "123-456-7890",
        contraseña: "••••••••",
        rol: "Administrador",
        status: true,
    });

    const [selectedField, setSelectedField] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleEditClick = (fieldKey) => {
        setSelectedField(fieldKey);
        setShowModal(true);
    };

    const handleSaveField = (newValue) => {
        setUser({ ...user, [selectedField]: newValue });
        setShowModal(false);
    };

    const fieldLabels = {
        nombre: "Nombre",
        apellido: "Apellido",
        correo: "Correo Electrónico",
        telefono: "Teléfono",
        contraseña: "Contraseña",
        rol: "Rol",
    };

    return (
        <>
            {/* Aquí aplicamos el blur y opacidad SOLO al fondo */}
            <div className={`max-w-3xl mx-auto mt-10 transition-all duration-300 ${showModal ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Perfil</h1>

                {/* Foto de perfil y nombre */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
                        {/* Podrías poner una imagen aquí */}
                        📷
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{`${user.nombre} ${user.apellido}`}</h2>
                </div>

                {/* Tabla de datos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(fieldLabels).map(([key, label]) => (
                                <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {key === "contraseña" ? "••••••••" : user[key]}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(key)}
                                            className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Status con switch */}
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">Status</td>
                                <td className="px-6 py-4">
                                    <Toggle
                                        isOn={user.status}
                                        handleToggle={() =>
                                            setUser({ ...user, status: !user.status })
                                        }
                                    />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal DEBE estar fuera del div anterior para no tomar el blur/opacidad */}
            {showModal && selectedField && (
                <EditFieldModal
                    fieldKey={selectedField}
                    label={fieldLabels[selectedField]}
                    value={user[selectedField]}
                    onSave={handleSaveField}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default UserProfile;
