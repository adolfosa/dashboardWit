import { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'
import $ from 'jquery'
import 'datatables.net'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: '',
    password: '',
    role: 'admin'
  })

  useEffect(() => {
    loadUsers()
    return () => {
      $('#usersTable').DataTable().destroy()
    }
  }, [])

  const loadUsers = () => {
    axios.get("/apis/users.php")
      .then(response => {
        setUsers(response.data)
        $('#usersTable').DataTable().destroy()
        $('#usersTable').DataTable({
          language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
          }
        })
      })
  }

  const handleSave = () => {
    const { id, username, password, role } = currentUser
    const url = id ? "/apis/users.php?update" : "/apis/users.php?create"
    
    axios.post(url, { id, username, password, role })
      .then(() => {
        setShowModal(false)
        loadUsers()
      })
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Administración de Usuarios</h2>
      <Button variant="dark" className="mb-3" onClick={() => setShowModal(true)}>
        Agregar Usuario
      </Button>
      
      <table id="usersTable" className="table table-striped">
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
                  })
                  setShowModal(true)
                }}>
                  Editar
                </Button>{' '}
                <Button variant="secondary" size="sm" onClick={() => {
                  if (window.confirm("¿Eliminar este usuario?")) {
                    axios.post("/apis/users.php?delete", { id: user.id })
                      .then(loadUsers)
                  }
                }}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="hidden" value={currentUser.id || ''} />
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={currentUser.username}
              onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={currentUser.password}
              onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
              placeholder={currentUser.id ? "Dejar en blanco para no cambiar" : ""}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              className="form-control"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="user1">User1</option>
              <option value="user2">User2</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}