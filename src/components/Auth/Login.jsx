import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
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
        withCredentials: true
      });

      if (response.data.status === "success") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userRole", response.data.rol_id);
        localStorage.setItem("roleName", response.data.rol);
        localStorage.setItem("empresa", response.data.empresa);
        
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage('');
    
    try {
      const response = await axios.post('/api/apis/forgot_password.php', {
        email: forgotPasswordEmail
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true  // <-- Aquí es donde va
      });
      
      setForgotPasswordMessage(response.data.message);
      if (response.data.status === "success") {
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setForgotPasswordMessage(
        error.response?.data?.message || 
        'Error al procesar la solicitud. Por favor intente más tarde.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src="src/assets/wit.png" alt="Logo" className="logo" />
        </div>
        
        {!showForgotPassword ? (
          <>
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
              
              <div className="text-center mt-3">
                <button 
                  type="button" 
                  className="btn-link"
                  onClick={() => setShowForgotPassword(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Recuperar Contraseña</h2>
            
            {forgotPasswordMessage && (
              <div className={`alert ${forgotPasswordMessage.includes('éxito') ? 'alert-success' : 'alert-danger'}`}>
                {forgotPasswordMessage}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="forgot-email">Correo Electrónico</label>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-control"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-custom"
              >
                Enviar enlace de recuperación
              </button>
              
              <div className="text-center mt-3">
                <button 
                  type="button" 
                  className="btn-link"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordMessage('');
                  }}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}