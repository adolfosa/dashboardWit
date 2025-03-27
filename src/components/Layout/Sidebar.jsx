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
      await axios.post('/api/apis/logout.php');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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