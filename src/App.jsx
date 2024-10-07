import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import './App.css';
import SideNav from './Components/SideNav';
import { AppProvider } from './Components/config/AppContext';

function App() {
  return (
    <>
      <AppProvider>
        <Header />
        <SideNav />
        <Outlet />
      </AppProvider>
    </>
  );
}

export default App;
