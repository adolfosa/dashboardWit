import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css' // Crea este archivo para los estilos

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("/apis/auth.php", { username, password })
      .then(response => {
        if (response.data.status === "success") {
          localStorage.setItem("loggedIn", "true")
          localStorage.setItem("userRole", response.data.role)
          navigate('/')
        } else {
          alert(response.data.message)
        }
      })
      .catch(error => {
        console.error("Error:", error)
        alert("Hubo un problema con el servidor.")
      })
  }
  
  return (
    <div className="login-container">
      <div className="login-box">
        <img src="src/assets/wit.png" alt="Logo" className="logo" />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-custom">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}