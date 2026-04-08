import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";
import Login from "../modules/auth/views/Login";
import AdminLayout from "../components/Layouts/AdminLayout";
import UserList from "../modules/admin/views/userList";
import UserRegister from "../modules/admin/views/userRegister";
import PasswordRecoveryForm from "../modules/auth/views/PasswordRecoveryForm";
import Register from "../modules/auth/views/Register";
import UserProfile from "../modules/admin/views/profile/AdminProfile";
import ProjectsAdmin from "../modules/admin/views/projectsAdmin";
import ListarCategoriasTotales from "../modules/admin/views/ListarCategoriasTotales";
import UserLayout from "../components/Layouts/UserLayout";
import ProjectsUser from "../modules/user/views/projectsUser";
import MyUserProfile from "../modules/user/views/profile/UserProfile";
import Categorias from "../modules/user/views/Categories";
import AdminCategories from "../modules/user/views/AdminCategories.jsx";
import BitacoraAcciones from "../modules/admin/views/BitacoraAcciones.jsx";
import JoinProject from "../modules/user/views/JoinProject.jsx";
import ProjectInvitation from "../components/ProjectInvitation.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - redirigen al dashboard si el usuario ya está autenticado */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><PasswordRecoveryForm /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Rutas públicas para invitaciones - no requieren autenticación */}
        <Route path="/project/:id/join" element={<JoinProject />} />
        <Route path="/invitation/:projectId" element={<ProjectInvitation />} />

        {/* Rutas protegidas para admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios" element={<UserList />} />
          <Route path="registroUsuario" element={<UserRegister />} />
          <Route path="perfil" element={<UserProfile />} />
          <Route path="proyectos" element={<ProjectsAdmin />} />
          <Route path="categorias/:proyectoId" element={<ListarCategoriasTotales />} />
          <Route path="bitacora" element={<BitacoraAcciones />} />
        </Route>

        {/* Rutas protegidas para user */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="misProyectos" replace />} />
          <Route path="misProyectos" element={<ProjectsUser />} />
          <Route path="misCategorias/:proyectoId" element={<Categorias />} />
          <Route path="adminCategorias/:proyectoId" element={<AdminCategories />} />
          <Route path="perfil" element={<MyUserProfile />} />
        </Route>

        {/* Catch-all route for 404 errors - redirect to login for non-authenticated users */}
        <Route path="*" element={<PublicRoute><Login /></PublicRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;