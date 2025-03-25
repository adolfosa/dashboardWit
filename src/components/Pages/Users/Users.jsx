import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: '',
    password: '',
    role: 'user1'
  });
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/apis/users.php');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy(true);
        dataTableRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      initializeDataTable();
    }
  }, [users]);

  const initializeDataTable = () => {
    if (!tableRef.current) return;

    if (dataTableRef.current) {
      // Actualizar datos existentes
      dataTableRef.current.clear();
      dataTableRef.current.rows.add(users);
      dataTableRef.current.draw();
      return;
    }

    // Inicialización inicial
    dataTableRef.current = $(tableRef.current).DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
      },
      responsive: true,
      destroy: true,
      data: users,
      columns: [
        { 
          data: 'id', 
          title: 'ID',
          className: 'text-center'
        },
        { 
          data: 'username', 
          title: 'Usuario',
          className: 'text-center'
        },
        { 
          data: 'role', 
          title: 'Rol',
          className: 'text-center',
          render: (data) => {
            const roles = {
              'admin': 'Administrador',
              'user1': 'Usuario Normal',
              'user2': 'Usuario Avanzado'
            };
            return roles[data] || data;
          }
        },
        { 
          data: null,
          title: 'Acciones',
          className: 'text-center',
          orderable: false,
          render: (data, type, row) => {
            return `
              <div class="d-flex justify-content-center">
                <button class="btn btn-primary btn-sm me-2 edit-btn" data-id="${row.id}">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">
                  <i class="fas fa-trash-alt"></i> Eliminar
                </button>
              </div>
            `;
          }
        }
      ],
      initComplete: function() {
        // Manejar eventos después de inicializar
        $(tableRef.current).on('click', '.edit-btn', function() {
          const id = $(this).data('id');
          const user = users.find(u => u.id == id);
          handleEdit(user);
        });

        $(tableRef.current).on('click', '.delete-btn', function() {
          const id = $(this).data('id');
          deleteUser(id);
        });
      }
    });
  };

  const handleEdit = (user) => {
    setCurrentUser({
      id: user.id,
      username: user.username,
      password: '',
      role: user.role
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentUser.id 
        ? '/api/apis/users.php?update' 
        : '/api/apis/users.php?create';
      
      await axios.post(url, currentUser);
      setShowModal(false);
      await fetchUsers();
      
      // Mostrar notificación de éxito
      alert(`Usuario ${currentUser.id ? 'actualizado' : 'creado'} correctamente`);
    } catch (error) {
      console.error("Error saving user:", error);
      alert('Error al guardar el usuario');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.post('/api/apis/users.php?delete', { id });
        await fetchUsers();
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administración de Usuarios</h2>
        <Button 
          className="btn-agregar" 
          onClick={() => {
            setCurrentUser({
              id: null,
              username: '',
              password: '',
              role: 'user1'
            });
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i> Agregar Usuario
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table 
            id="usersTable" 
            className="table table-striped table-bordered table-hover w-100" 
            ref={tableRef}
          ></table>
        </div>
      )}

      {/* Modal para agregar/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>
            {currentUser.id ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <form onSubmit={handleSubmit}>
            <input type="hidden" value={currentUser.id || ''} />
            
            <div className="mb-3">
              <label className="form-label">Nombre de Usuario</label>
              <input 
                type="text" 
                className="form-control"
                value={currentUser.username}
                onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                required
                minLength="3"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">
                {currentUser.id ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              </label>
              <input 
                type="password" 
                className="form-control"
                value={currentUser.password}
                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                required={!currentUser.id}
                minLength="6"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Tipo de Usuario</label>
              <select 
                className="form-select"
                value={currentUser.role}
                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                required
              >
                <option value="admin">Administrador</option>
                <option value="user1">Usuario Normal</option>
                <option value="user2">Usuario Avanzado</option>
              </select>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                className="btn-secondary me-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="btn-editar"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;