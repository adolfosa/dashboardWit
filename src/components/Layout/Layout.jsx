import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="app-container">
      {/* Botón del menú hamburguesa */}
      <button 
        className="menu-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} userRole={userRole} />
      
      {/* Área principal */}
      <div className="main-content">
        {/* Navbar superior */}
        <Navbar userRole={userRole} />
        
        {/* Contenido de las páginas */}
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;