// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Pages/Dashboard';
import Users from './components/Pages/Users/Users';
import Configuracion from './components/Pages/Configuracion';
import Contacto from './components/Pages/Contacto';
import Nosotros from './components/Pages/Nosotros/Nosotros';
import Menu1 from './components/Pages/Menu1';
import Menu2 from './components/Pages/Menu2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
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