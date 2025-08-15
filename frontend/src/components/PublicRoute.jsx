import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    // Función para obtener la ruta del dashboard según el rol
    const getDashboardRoute = (userRoles) => {
        if (!userRoles || userRoles.length === 0) return '/';
        
        // Si el usuario tiene múltiples roles, usar el primero como principal
        const primaryRole = typeof userRoles[0] === 'string' 
            ? userRoles[0].toLowerCase() 
            : String(userRoles[0]).toLowerCase();
        
        switch (primaryRole) {
            case 'root': // Only ROOT role goes to admin dashboard
                return '/admin';
            case 'admin':
            case 'project_admin': // PROJECT_ADMIN goes to user dashboard
            case 'user':
                return '/user';
            default:
                return '/';
        }
    };

    // Si el usuario está autenticado, redirigir a su dashboard
    if (user) {
        const dashboardRoute = getDashboardRoute(user.roles);
        return <Navigate to={dashboardRoute} replace />;
    }

    // Si no está autenticado, mostrar el componente público
    return children;
};

export default PublicRoute;
