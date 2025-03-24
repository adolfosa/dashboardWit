// src/components/Layout/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="app-container">
      <button 
        className="menu-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      
      <Sidebar isOpen={sidebarOpen} userRole={userRole} />
      
      <div className="main-content">
        <Navbar userRole={userRole} />
        <div className="content-container">
          <Outlet /> {/* Aquí se renderizarán las páginas */}
        </div>
      </div>
    </div>
  );
}