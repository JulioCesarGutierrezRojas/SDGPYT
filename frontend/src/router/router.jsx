import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import AdminLayout from "../components/Layouts/AdminLayout";
import UserList from "../modules/users/views/userList";
import UserRegister from "../modules/users/views/userRegister";
import ForgotPassword from "../modules/auth/views/ForgotPassword";
import Register from "../modules/auth/views/Register"; 

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="usuarios" element={<UserList />} />
          <Route path="registroUsuario" element={<UserRegister />} />
        </Route>

        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;