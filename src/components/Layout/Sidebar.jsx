import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUsers, faSignOutAlt, faChartBar, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

// Componente para items del menú
const MenuItem = ({ to, icon, label, hasPermission }) => {
  if (!hasPermission) return null;
  
  return (
    <Link to={to} className="sidebar-link">
      <FontAwesomeIcon icon={icon} className="sidebar-icon" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const roleName = localStorage.getItem("roleName");

  useEffect(() => {
    // Cargar permisos desde localStorage
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, []);

  const hasPermission = (itemName) => {
    return permissions.some(p => p.item_nombre === itemName);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/apis/logout.php', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Añadir si usas JWT
        }
      });
  
      if (response.data.status === "success") {
        // Limpiar localStorage selectivamente
        ['loggedIn', 'userRole', 'roleName', 'empresa', 'permissions', 'token'].forEach(item => {
          localStorage.removeItem(item);
        });
  
        // Redirigir y forzar recarga para limpiar estado
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if (error.response?.status === 403) {
        // Forzar limpieza si el servidor rechazó la petición
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert('Error al cerrar sesión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="sidebar" style={{ left: isOpen ? '0' : '-250px' }}>
      <div className="menu-content">
        {/* Menú dinámico basado en permisos */}
        <MenuItem 
          to="/configuracion" 
          icon={faCog} 
          label="Configuración" 
          hasPermission={hasPermission('configuracion') || roleName === 'SuperUser'} 
        />
        
        <MenuItem 
          to="/users" 
          icon={faUsers} 
          label="Usuarios" 
          hasPermission={hasPermission('usuarios') || roleName === 'SuperUser'} 
        />
        
        <MenuItem 
          to="/reportes" 
          icon={faChartBar} 
          label="Reportes" 
          hasPermission={hasPermission('reportes')} 
        />
        
        <MenuItem 
          to="/inventario" 
          icon={faBoxes} 
          label="Inventario" 
          hasPermission={hasPermission('inventario')} 
        />
      </div>
      
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;