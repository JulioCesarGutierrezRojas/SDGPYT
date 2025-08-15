import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    
    console.log('🌐 PublicRoute: Current user:', user);

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

    // Si el usuario está autenticado, redirigir a su dashboard
    if (user) {
        const dashboardRoute = getDashboardRoute(user.roles);
        console.log('🌐 PublicRoute: Redirecting to dashboard:', dashboardRoute);
        return <Navigate to={dashboardRoute} replace />;
    }

    // Si no está autenticado, mostrar el componente público
    return children;
};

export default PublicRoute;
