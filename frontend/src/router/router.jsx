import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";
import Login from "../modules/auth/views/Login";
import AdminLayout from "../components/Layouts/AdminLayout";
import UserList from "../modules/admin/views/userList";
import UserRegister from "../modules/admin/views/userRegister";
import ForgotPassword from "../modules/auth/views/ForgotPassword";
import Register from "../modules/auth/views/Register"; 
import UserProfile from "../modules/auth/views/profile/UserProfile";
import ProjectsAdmin from "../modules/admin/views/projectsAdmin";
import ListarCategoriasTotales from "../modules/admin/views/ListarCategoriasTotales";
import UserLayout from "../components/Layouts/UserLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios" element={<UserList />} />
          <Route path="registroUsuario" element={<UserRegister />} />
          <Route path="perfil" element={<UserProfile />} />
          <Route path="proyectos" element={<ProjectsAdmin />} />
          <Route path="categorias/:proyectoId" element={<ListarCategoriasTotales />} />
        </Route>

        <Route path="/user" element={<UserLayout/>}></Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;