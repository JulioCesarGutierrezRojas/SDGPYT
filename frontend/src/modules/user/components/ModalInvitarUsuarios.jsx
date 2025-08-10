import { useState } from "react";

const ModalInvitarUsuarios = ({ visible, onClose, onInvitar }) => {
  const [correos, setCorreos] = useState("");

  if (!visible) return null;

  const handleEnviar = () => {
    const listaCorreos = correos.split(",").map(c => c.trim()).filter(Boolean);
    if (listaCorreos.length === 0) {
      alert("Agrega al menos un correo válido.");
      return;
    }
    onInvitar(listaCorreos);
    setCorreos("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Invitar usuarios al proyecto</h3>
        <textarea
          value={correos}
          onChange={(e) => setCorreos(e.target.value)}
          placeholder="Escribe los correos separados por comas"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            className="px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-700"
          >
            Enviar invitaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInvitarUsuarios;
