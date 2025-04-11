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
import ClassPage from "./teacher/classPage";
import StudentAllClasses from "./student/allClassStudent";
import LayoutStudent from "./layout/layoutStudent";
import ClassFolders from "./student/myClass";
import SubmitAssignment from "./student/submitAssignment";
import FolderPage from "./teacher/folderPage";
import CreateAcademicYear from "./admin/AcademicYear/CreateAcademicYear";
import ManageSemesters from "./admin/AcademicYear/ManageSemesters";
import AcademicYearPage from "./admin/AcademicYear/ClassHierarchy";
import {Dashboard} from "./admin/Dashboard/index.jsx";

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
      {
        path: "academic-year-create",
        element: <CreateAcademicYear />,
      },
      {
        path: "academic-year/manage-semesters",
        element: <ManageSemesters />,
      },
      {
        path: "academic-year",
        element: <AcademicYearPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      }

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
      {
        path: "class/:classId",
        element: <ClassPage />,
      },
      {
        path: "class/:classId/folder/:folderId",
        element: <FolderPage />,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={[3]}>
        <LayoutStudent />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "class-student",
        element: <StudentAllClasses />,
      },
      {
        path: "class/:classId/folder",
        element: <ClassFolders />,
      },
      {
        path: "class/:classId/folder/:folderId/submit",
        element: <SubmitAssignment />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <div>You are not authorized to access this page.</div>,
  },
  {
    path: "*",
    element: <div>You are not authorized to access this page.</div>,
  },
]);

export default router;
