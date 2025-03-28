import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('Token no proporcionado');
      return;
    }

    const verifyToken = async () => {
        try {
          const response = await axios.get(`/api/apis/reset_password.php?token=${token}`, {
            withCredentials: true  // <-- Aquí
          });
          if (response.data.status === "success") {
            setTokenValid(true);
          }
        } catch (error) {
          setMessage(error.response?.data?.message || 'Error al verificar el token');
        }
      };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
        const response = await axios.post('/api/apis/reset_password.php', {
          token,
          password
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true  // <-- Y aquí
        });

      if (response.data.status === "success") {
        setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="alert alert-danger">
            {message || 'Token inválido o expirado'}
          </div>
          <button 
            className="btn-custom mt-3"
            onClick={() => navigate('/login')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Restablecer Contraseña</h2>
        
        {message && (
          <div className={`alert ${message.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-custom"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}