import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import './App.css';
import SideNav from './Components/SideNav';
import { AppProvider } from './Components/context/AppContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AppProvider>
        <Header />
        <SideNav />
        <Outlet />
        <ToastContainer />
      </AppProvider>
    </>
  );
}

export default App;
