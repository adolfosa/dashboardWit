import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import './Layout.css';

const Sidebar = ({ isOpen, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="sidebar" style={{ left: isOpen ? '0' : '-250px' }}>
      {/* Contenido del menú */}
      <div className="menu-content">
        {userRole === 'admin' && (
          <>
            <Link to="/configuracion" className="sidebar-link">
              <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
              <span>Configuración</span>
            </Link>
            <Link to="/users" className="sidebar-link">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
              <span>Usuarios</span>
            </Link>
          </>
        )}
      </div>
      
      {/* Contenedor especial para el logout */}
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