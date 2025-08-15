import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast } from '../kernel/alerts';
import { logout as logoutService } from '../modules/auth/adapters/auth.controller';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const name = localStorage.getItem("user");
        const roles = localStorage.getItem("roles");
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (name && roles && userId && token) {
            console.log('🔍 DEBUG - AuthContext loading user:', { name, roles, userId, token: token ? 'present' : 'missing' });
            
            const parsedRoles = JSON.parse(roles);
            console.log('🔍 DEBUG - Parsed roles:', parsedRoles);
            
            // Extract unique role strings from the backend format
            // Backend returns: [{role: "PROJECT_ADMIN", project: "Project Name"}, ...]
            const roleStrings = [...new Set(parsedRoles.map(role => {
                if (typeof role === 'string') {
                    return role; // Legacy format support
                } else if (role && role.role) {
                    return role.role; // New format: {role: "PROJECT_ADMIN", project: "Project Name"}
                } else {
                    return String(role);
                }
            }))];
            
            console.log('🔍 DEBUG - Final role strings:', roleStrings);
            
            // Para compatibilidad, usar el primer rol como rol principal
            const primaryRole = roleStrings.length > 0 ? roleStrings[0] : null;
            
            const userData = { 
                name, 
                roles: roleStrings, // Array of unique role strings
                roleDetails: parsedRoles, // Full role objects for future use
                role: primaryRole, // Mantener compatibilidad
                id: userId 
            };
            
            console.log('🔍 DEBUG - Setting user data:', userData);
            setUser(userData);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        // Marcar que el logout está en progreso para evitar toasts de error
        sessionStorage.setItem('logout_in_progress', 'true');
        
        const token = localStorage.getItem("token");
        
        // Si hay token, intentar invalidarlo en el backend usando el servicio
        if (token) {
            await logoutService();
        }
        
        // Limpiar estado local siempre
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");
        
        // Limpiar todas las claves de toast del sessionStorage
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('toast_shown_')) {
                sessionStorage.removeItem(key);
            }
        });
        
        showSuccessToast({
            title: 'Sesión cerrada',
            text: 'Sesión cerrada correctamente'
        });
        
        // Limpiar la bandera de logout en progreso después de un breve delay
        setTimeout(() => {
            sessionStorage.removeItem('logout_in_progress');
        }, 1000);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
