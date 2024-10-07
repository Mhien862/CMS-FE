import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/AuthContext";
import CreateUser from "./admin/User/createUser";
import ListUser from "./admin/User/listUser";
import EditUserForm from "./admin/User/editUser";
import Layout from "./layout";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "create-user",
        element: <CreateUser />,
      },
      {
        path: "list-user",
        element: <ListUser />,
      },
      {
        path: "edit-user/:id",
        element: <EditUserForm />,
      },
    ],
  },
]);

export default router;
