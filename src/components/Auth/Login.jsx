import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/apis/auth.php', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Esto es crucial
      });

      if (response.data.status === "success") {
        // Almacena toda la información recibida
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userRole", response.data.rol_id);
        localStorage.setItem("roleName", response.data.rol);
        localStorage.setItem("empresa", response.data.empresa);
        
        // Almacena los permisos si existen
        if (response.data.permissions) {
          localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
        }
        
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      if (err.response?.status === 403) {
        setError('Acceso no autorizado. Por favor, contacte al administrador.');
      } else {
        setError(err.response?.data?.message || 'Error de conexión con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src="src/assets/wit.png" alt="Logo" className="logo" />
        </div>
        <h2>Iniciar Sesión</h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-custom"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}