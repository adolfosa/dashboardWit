import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import $ from 'jquery';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: '',
    password: '',
    role: 'user1'
  });

  // Elimina todas las importaciones de DataTables
    useEffect(() => {
      if (window.$) { // Verifica que jQuery esté disponible
        $('#usersTable').DataTable({
          language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
          }
        });
      }
    }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/apis/users.php');
      setUsers(response.data);
      initializeDataTable();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const initializeDataTable = () => {
    $(document).ready(function() {
      $('#usersTable').DataTable({
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentUser.id 
        ? '/api/apis/users.php?update' 
        : '/api/apis/users.php?create';
      
      await axios.post(url, currentUser);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      try {
        await axios.post('/api/apis/users.php?delete', { id });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Administración de Usuarios</h2>
      <Button variant="dark" className="mb-3" onClick={() => {
        setCurrentUser({
          id: null,
          username: '',
          password: '',
          role: 'user1'
        });
        setShowModal(true);
      }}>
        Agregar Usuario
      </Button>
      
      <Table id="usersTable" striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="dark" size="sm" onClick={() => {
                  setCurrentUser({
                    id: user.id,
                    username: user.username,
                    password: '',
                    role: user.role
                  });
                  setShowModal(true);
                }}>
                  Editar
                </Button>
                <Button variant="secondary" size="sm" className="ms-2" 
                  onClick={() => deleteUser(user.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Editar' : 'Agregar'} Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="hidden" value={currentUser.id || ''} />
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input 
                type="text" 
                className="form-control"
                value={currentUser.username}
                onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-control"
                value={currentUser.password}
                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                placeholder={currentUser.id ? "Dejar vacío para no cambiar" : ""}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select 
                className="form-select"
                value={currentUser.role}
                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
              >
                <option value="admin">Admin</option>
                <option value="user1">User1</option>
                <option value="user2">User2</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSubmit}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;