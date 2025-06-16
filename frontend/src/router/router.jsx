import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import AdminLayout from "../components/Layouts/AdminLayout";
import UserList from "../modules/users/views/userList";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>

        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="usuarios" element={<UserList />} />
        </Route>

        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;