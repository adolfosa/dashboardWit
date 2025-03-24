import { Link } from 'react-router-dom';
import './Layout.css';

const Navbar = ({ userRole }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/wit.png" alt="Logo" height="40" />
        </Link>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;