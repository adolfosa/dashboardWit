// src/components/Welcome/Welcome.jsx
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <img src="/src/assets/wit.png" alt="Logo" className="welcome-logo" />
      <h1>Bienvenido a la Plataforma de...</h1>
      <p>Haz clic en el botón para iniciar sesión</p>
      <button 
        onClick={() => navigate('/login')} 
        className="btn-custom"
      >
        Ir al Login
      </button>
    </div>
  );
}