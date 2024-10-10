import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Login from "./auth/AuthContext";
import CreateUser from "./admin/User/createUser";
import ListUser from "./admin/User/listUser";
import EditUserForm from "./admin/User/editUser";
import ListClass from "./admin/Class/listClass";
import CreateClass from "./admin/Class/createClass";
import EditClassForm from "./admin/Class/editClass";
import Layout from "./layout";
import LayoutTeacher from "./layout/layoutTeacher";
import ClassTeacher from "./teacher/classTeacher";
import FacultyList from "./admin/Faculty/listfaculty";

// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!user;
  const userRole = user?.role_id;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const LoginRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <Navigate to={user.role_id === 1 ? "/" : "/teacher"} replace />;
  }

  return children ? children : <Outlet />;
};

LoginRoute.propTypes = {
  children: PropTypes.node,
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LoginRoute>
        <Login />
      </LoginRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <Layout />
      </ProtectedRoute>
    ),
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
      {
        path: "list-faculty",
        element: <FacultyList />,
      },
    ],
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <LayoutTeacher />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "class-teacher",
        element: <ClassTeacher />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <div>You are not authorized to access this page.</div>,
  },
]);

export default router;
