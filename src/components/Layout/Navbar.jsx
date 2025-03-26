import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <div className="navbar-brand">
          <img src="src/assets/wit.png" alt="Logo" className="logonav" height="40" />
        </div>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">            
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>            
            
            {/* Mostrar Menu1 solo si no es user2 */}
            {userRole !== 'user2' && (
              <li className="nav-item">
                <Link className="nav-link" to="/menu1">Menu1</Link>
              </li>
            )}
            
            {/* Mostrar Menu2 solo si no es user1 */}
            {userRole !== 'user1' && (
              <li className="nav-item">
                <Link className="nav-link" to="/menu2">Menu2</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;