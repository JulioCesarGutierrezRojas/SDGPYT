const EstatusBadge = ({ estatus, onClick }) => {
    const esActivo = estatus === "Habilitado";

    return (
        <span
            onClick={onClick}
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer select-none transition-colors
                ${esActivo
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
        >
            {estatus}
        </span>
    );
};

export default EstatusBadge;
