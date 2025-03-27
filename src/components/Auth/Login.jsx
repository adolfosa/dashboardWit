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
      // 1. Primero hacer login para establecer la sesión
      const authResponse = await axios.post('/api/apis/auth.php', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Esto es crucial para mantener la sesión
      });

      if (authResponse.data.status === "success") {
        // 2. Ahora obtener los roles y permisos
        // Usamos el mismo axios instance para mantener las cookies
        const rolesResponse = await axios.get('/api/apis/get_roles.php', {
          withCredentials: true // Mantener credenciales
        });

        if (rolesResponse.data.status === "success") {
          // Almacenar toda la información necesaria
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userRole", authResponse.data.rol_id);
          localStorage.setItem("roleName", authResponse.data.rol);
          localStorage.setItem("empresa", authResponse.data.empresa);
          localStorage.setItem("permissions", JSON.stringify(rolesResponse.data.permissions));
          
          // Redirigir al dashboard
          navigate('/dashboard');
        } else {
          setError('Error al obtener permisos de usuario');
        }
      } else {
        setError(authResponse.data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      // Mensaje más descriptivo para error 403
      if (err.response?.status === 403) {
        setError('No tienes permiso para acceder a estos recursos');
      } else {
        setError(err.response?.data?.message || 'Error al conectar con el servidor');
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