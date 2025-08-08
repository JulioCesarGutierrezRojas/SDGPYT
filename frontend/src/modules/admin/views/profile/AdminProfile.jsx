import { useState } from "react";
import { Pencil } from "lucide-react";
import EditFieldModal from "./EditFieldModal";
import EstatusBadge from "./EstatusBadge";

const UserProfile = () => {
    const [user, setUser] = useState({
        nombre: "Clara",
        apellido: "Bennett",
        correo: "clara.bennett@example.com",
        telefono: "123-456-7890",
        contraseña: "••••••••",
        rol: "Administrador",
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

    return (
        <>
            <div className={`max-w-4xl mx-auto px-4 py-4 transition-all duration-300 ${showModal ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Perfil</h1>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
                        📷
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-center">{`${user.nombre} ${user.apellido}`}</h2>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(fieldLabels).map(([key, label]) => (
                                <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{label}</td>
                                    <td className="px-4 py-3 text-gray-700">{key === "contraseña" ? "••••••••" : user[key]}</td>
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

export default UserProfile;
