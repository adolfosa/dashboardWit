// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Pages/Dashboard'; 
import Users from './components/Pages/Users';
// Importa los demás componentes de la misma forma

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} /> {/* Uso correcto */}
          <Route path="users" element={<Users />} />
          {/* Otras rutas */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default App;