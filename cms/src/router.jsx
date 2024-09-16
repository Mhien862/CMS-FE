import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/AuthContext";
import CreateUser from "./admin/createUser";
import Layout from "./layout";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-user",
    element: <CreateUser />,
  },

  {
    path: "/",
    element: <Layout />,
  },
]);

export default router;
