import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import './App.css';
import SideNav from './Components/SideNav';
import { AppProvider } from './Components/context/AppContext';
import { ToastContainer } from 'react-toastify';
import NotificationTab from './Components/NotificationTab';

function App() {
  return (
    <>
      <AppProvider>
        <Header />
        <SideNav />
        <Outlet />
        <ToastContainer />
        <NotificationTab />
      </AppProvider>
    </>
  );
}

export default App;
