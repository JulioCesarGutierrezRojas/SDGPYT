import { useState } from "react";

const EditFieldModal = ({ fieldKey, label, value, onSave, onClose }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onSave(inputValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-300 pointer-events-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Editar {label}</h2>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[var(--color-azul-600)] text-white rounded hover:bg-cyan-400"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;
