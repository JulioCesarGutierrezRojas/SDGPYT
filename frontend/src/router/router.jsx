import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";
import Login from "../modules/auth/views/Login";
import AdminLayout from "../components/Layouts/AdminLayout";
import UserList from "../modules/admin/views/userList";
import UserRegister from "../modules/admin/views/userRegister";
import ForgotPassword from "../modules/auth/views/ForgotPassword";
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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios" element={<UserList />} />
          <Route path="registroUsuario" element={<UserRegister />} />
          <Route path="perfil" element={<UserProfile />} />
          <Route path="proyectos" element={<ProjectsAdmin />} />
          <Route path="categorias/:proyectoId" element={<ListarCategoriasTotales />} />
          <Route path="bitacora" element={<BitacoraAcciones />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="misProyectos" replace />} />
          <Route path="misProyectos" element={<ProjectsUser />} />
          <Route path="misCategorias/:proyectoId" element={<Categorias />} />
          <Route path="adminCategorias/:proyectoId" element={<AdminCategories />} />
          <Route path="perfil" element={<MyUserProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;