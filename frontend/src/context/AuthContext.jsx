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
            const parsedRoles = JSON.parse(roles);
            
            // Ensure roles are strings - handle both old format (strings) and new format (objects)
            const roleStrings = parsedRoles.map(role => {
                if (typeof role === 'string') {
                    return role;
                } else if (role && role.role) {
                    return role.role; // Extract role from {role: "ROOT", project: "GLOBAL"} format
                } else {
                    return String(role);
                }
            });
            
            // Para compatibilidad, usar el primer rol como rol principal
            const primaryRole = roleStrings.length > 0 ? roleStrings[0] : null;
            
            setUser({ 
                name, 
                roles: roleStrings, 
                role: primaryRole, // Mantener compatibilidad con código que espera 'role'
                id: userId 
            });
        }
    }, []);

    const login = (userData) => {
        console.log('🔐 AuthContext: Setting user data:', userData);
        setUser(userData);
    };

    const logout = async () => {
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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
