import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Task from './Pages/Task.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Todo from './Pages/Todo.jsx';
import InProgress from './Pages/InProgress.jsx';
import Completed from './Pages/Completed.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Projects from './Pages/Projects.jsx';
import TaskDetail from './Pages/TaskDetail.jsx';
import { AppProvider } from './Components/context/AppContext.jsx';
import { AuthProvider } from './Components/context/AuthContext.jsx';
import Teams from './Pages/Teams.jsx';
import ProjectDetail from './Pages/ProjectDetail.jsx';
import Login from './Pages/Login.jsx';
import PrivateRoute from './Components/PrivateRoute .jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,  // Redirect from "/" to "/dashboard"
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute> {/* Wrap protected routes with PrivateRoute */}
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/projects",
        element: (
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        ),
      },
      {
        path: "/task",
        element: (
          <PrivateRoute>
            <Task />
          </PrivateRoute>
        ),
      },
      {
        path: "/todo",
        element: (
          <PrivateRoute>
            <Todo />
          </PrivateRoute>
        ),
      },
      {
        path: "/in-progress",
        element: (
          <PrivateRoute>
            <InProgress />
          </PrivateRoute>
        ),
      },
      {
        path: "/completed",
        element: (
          <PrivateRoute>
            <Completed />
          </PrivateRoute>
        ),
      },
      {
        path: "/task-detail",
        element: (
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/team",
        element: (
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        ),
      },
      {
        path: "/project-detail",
        element: (
          <PrivateRoute>
            <ProjectDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
