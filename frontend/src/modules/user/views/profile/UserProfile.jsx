import { useState } from "react";
import { Pencil } from "lucide-react";
import EditFieldModal from "./EditFieldModal";
import EstatusBadge from "./EstatusBadge";

const MyUserProfile = () => {
    const [user, setUser] = useState({
        nombre: "Clara",
        apellido: "Bennett",
        correo: "clara.bennett@example.com",
        telefono: "123-456-7890",
        contraseña: "••••••••",
        rol: "Usuario",
        estatus: "Habilitado",
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

    const toggleStatus = () => {
        const nuevo = user.estatus === "Habilitado" ? "Deshabilitado" : "Habilitado";
        setUser({ ...user, estatus: nuevo });
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
    const iniciales = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

    return (
        <>
            <div
                className={`max-w-4xl mx-auto px-4 py-4 transition-all duration-300 ${showModal ? "blur-sm opacity-60 pointer-events-none" : ""
                    }`}
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Perfil</h1>

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
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                        {label}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {key === "contraseña" ? "••••••••" : user[key]}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleEditClick(key)}
                                            className="bg-[var(--color-azul-600)] hover:bg-cyan-300 text-black w-8 h-8 flex items-center justify-center rounded transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Estatus con badge */}
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">Estatus</td>
                                <td className="px-4 py-3">
                                    <EstatusBadge estatus={user.estatus} onClick={toggleStatus} />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

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

export default MyUserProfile;
