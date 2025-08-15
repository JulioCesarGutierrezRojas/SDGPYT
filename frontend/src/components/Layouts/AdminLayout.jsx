import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { UserRound, FolderKanban, Settings, LogOut, Menu, DatabaseBackup } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserById } from '../../modules/admin/adapters/user.controller';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState({ name: 'Administrador', fullName: 'Cargando...' });
    const linkBaseClasses = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors";
    const linkInactive = "text-gray-800 hover:bg-cyan-300";
    const linkActive = "bg-cyan-300 text-gray-900 font-semibold";

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            // Intentar obtener datos del usuario desde localStorage
            const userString = localStorage.getItem('user');
            let userData = {};
            
            if (userString) {
                try {
                    userData = JSON.parse(userString);
                } catch (parseError) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        userData = { id: 1 };
                    }
                }
            }

            const userId = userData.id;
            if (userId) {
                // Obtener datos completos del usuario desde el backend
                const response = await getUserById(userId);
                if (response.result) {
                    setUserInfo({
                        name: 'Administrador',
                        fullName: `${response.result.name} ${response.result.lastname}`
                    });
                } else {
                    setUserInfo({ name: 'Administrador', fullName: 'Usuario Admin' });
                }
            } else {
                setUserInfo({ name: 'Administrador', fullName: 'Usuario Admin' });
            }
        } catch (error) {
            console.error('Error al cargar información del usuario:', error);
            setUserInfo({ name: 'Administrador', fullName: 'Usuario Admin' });
        }
    };

    const handleLogout = async () => {
        // Usar el logout del AuthContext que maneja tanto la limpieza local como la conexión con el backend
        await logout();
        
        // No necesitamos redirigir manualmente, el AuthContext y PublicRoute lo manejarán
    };

    return (
        <div className="flex min-h-screen relative overflow-visible">
            <div className={`${sidebarOpen ? "w-62" : "w-16"} bg-[var(--color-azul-200)] flex flex-col transition-all duration-300`}>
                <div className="p-6 text-center">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="absolute rounded-md top-4 left-4 bg-cyan-300 text-black p-1 hover:bg-cyan-400 transition-colors">
                        <Menu className="w-4 h-4 text-gray-800" />
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800 mb-4">SGPYT</h1>
                    <div className="w-16 h-16 bg-cyan-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <div className="w-12 h-12 bg-cyan-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="text-gray-800">
                        <div className="font-semibold">{userInfo.name}</div>
                        <div className="text-sm text-gray-600">{userInfo.fullName}</div>
                    </div>
                </div>

                <div className="flex-1 px-4">
                    <div className="mb-6">
                        <h3 className="text-gray-700 font-medium mb-3">Menú</h3>
                        <hr className="border-t border-[var(--color-gris-700)] mb-4" />
                        <nav className="space-y-2">
                            <NavLink to="/admin/usuarios" className={({ isActive }) => `${linkBaseClasses} ${isActive ? linkActive : linkInactive}`}>
                                <UserRound className="w-4 h-4" />Usuarios
                            </NavLink>

                            <NavLink to="/admin/proyectos" className={({ isActive }) => `${linkBaseClasses} ${isActive ? linkActive : linkInactive}`}>
                                <FolderKanban className="w-4 h-4" />Proyectos
                            </NavLink>

                            <NavLink to="/admin/perfil" className={({ isActive }) => `${linkBaseClasses} ${isActive ? linkActive : linkInactive}`}>
                                <Settings className="w-4 h-4" />Perfil
                            </NavLink>

                            <NavLink to="/admin/bitacora" className={({ isActive }) => `${linkBaseClasses} ${isActive ? linkActive : linkInactive}`}>
                                <DatabaseBackup className="w-4 h-4" />Historial de acciones
                            </NavLink>
                        </nav>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="text-gray-700 font-medium mb-3">Sesión</h3>
                    <hr className="border-t border-[var(--color-gris-700)] mb-4" />
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-azul-500)] border border-[var(--color-azul-400)] text-[var(--color-gris-950)] rounded-md hover:bg-[var(--color-azul-600)] transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div className={`flex-1 p-6 bg-white overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-0" : "ml-[-3rem]"}`}>
                <Outlet />
            </div>
        </div>
    );
}
