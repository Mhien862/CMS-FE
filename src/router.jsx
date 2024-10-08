import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/AuthContext";
import CreateUser from "./admin/User/createUser";
import ListUser from "./admin/User/listUser";
import EditUserForm from "./admin/User/editUser";
import ListClass from "./admin/Class/listClass";
import CreateClass from "./admin/Class/createClass";
import EditClassForm from "./admin/Class/editClass";
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
      {
        path: "list-class",
        element: <ListClass />,
      },
      {
        path: "create-class",
        element: <CreateClass />,
      },
      {
        path: "edit-class/:id",
        element: <EditClassForm />,
      },
    ],
  },
]);

export default router;
