import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import Projects from './Pages/Projects.jsx';
import TaskDetail from './Pages/TaskDetail.jsx';
import { AuthProvider } from './Components/context/AuthContext.jsx';
import Teams from './Pages/Teams.jsx';
import ProjectDetail from './Pages/ProjectDetail.jsx';
import Login from './Pages/Login.jsx';
import PrivateRoute from './Components/PrivateRoute .jsx';
import { AppProvider } from '../src/Components/context/AppContext.jsx';
import AddProjectPage from './Pages/AddProjectPage.jsx';
import AddTaskPage from './Pages/AddTaskPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
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
        path: "/add-project",
        element: (
          <PrivateRoute>
            <AddProjectPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-task",
        element: (
          <PrivateRoute>
            <AddTaskPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
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
