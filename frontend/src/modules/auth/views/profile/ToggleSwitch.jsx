const Toggle = ({ isOn, handleToggle }) => {
    return (
        <div
            onClick={handleToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors 
                ${isOn ? "bg-[var(--color-azul-600)]" : "bg-gray-300"} hover:bg-cyan-300`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isOn ? "translate-x-6" : "translate-x-0"}`}
            />
        </div>
    );
};

export default Toggle;
