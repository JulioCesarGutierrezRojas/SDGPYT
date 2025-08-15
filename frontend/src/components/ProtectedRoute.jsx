import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorToast, showWarningToast } from "../kernel/alerts";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    const hasShownToast = useRef(false);

    // Función para obtener la ruta del dashboard según el rol
    const getDashboardRoute = (userRoles) => {
        if (!userRoles || userRoles.length === 0) return '/';
        
        // Si el usuario tiene múltiples roles, usar el primero como principal
        const primaryRole = typeof userRoles[0] === 'string' 
            ? userRoles[0].toLowerCase() 
            : String(userRoles[0]).toLowerCase();
        
        switch (primaryRole) {
            case 'admin':
            case 'root': // Map ROOT role from backend to admin dashboard
                return '/admin';
            case 'user':
                return '/user';
            default:
                return '/';
        }
    };

    // Función para verificar si el usuario tiene el rol requerido
    const hasRequiredRole = (userRoles, requiredRole) => {
        if (!requiredRole || !userRoles) return true;
        return userRoles.some(userRole => {
            const roleString = typeof userRole === 'string' ? userRole : String(userRole);
            const userRoleLower = roleString.toLowerCase();
            const requiredRoleLower = requiredRole.toLowerCase();
            
            // Handle ROOT role mapping to admin
            if (requiredRoleLower === 'admin' && userRoleLower === 'root') {
                return true;
            }
            
            return userRoleLower === requiredRoleLower;
        });
    };

    useEffect(() => {
        // Generar una clave única para esta sesión de navegación y rol
        const toastKey = `toast_shown_${role || 'no-role'}_${user?.id || 'no-user'}`;
        const hasShownInSession = sessionStorage.getItem(toastKey);
        
        if (!hasShownToast.current && !hasShownInSession) {
            if (!user) {
                showErrorToast({
                    title: "Acceso denegado",
                    text: "Debes iniciar sesión para acceder.",
                });
                hasShownToast.current = true;
                sessionStorage.setItem(toastKey, 'true');
            } else if (role && !hasRequiredRole(user.roles, role)) {
                showWarningToast({
                    title: "Acceso restringido",
                    text: `No tienes permisos para acceder a esta sección. Serás redirigido a tu dashboard.`,
                });
                hasShownToast.current = true;
                sessionStorage.setItem(toastKey, 'true');
            }
        }
    }, [user, role]);

    // Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/" />;
    }

    // Si el usuario no tiene el rol requerido, redirigir a su dashboard
    if (role && !hasRequiredRole(user.roles, role)) {
        const dashboardRoute = getDashboardRoute(user.roles);
        return <Navigate to={dashboardRoute} />;
    }

    return children;
};

export default ProtectedRoute;
