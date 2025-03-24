// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Pages/Dashboard';
import Users from './components/Pages/Users';
import Configuracion from './components/Pages/Configuracion';
import Contacto from './components/Pages/Contacto';
import Nosotros from './components/Pages/Nosotros';
import Menu1 from './components/Pages/Menu1';
import Menu2 from './components/Pages/Menu2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/menu1" element={<Menu1 />} />
            <Route path="/menu2" element={<Menu2 />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoute() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default App;