<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Verificar conexión a la base de datos
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos", 500);
    }

    // Verificar si el usuario está autenticado
    if (!isset($_SESSION["empresa_id"]) || !isset($_SESSION["rol"])) {
        throw new Exception("No autorizado", 401);
    }

    $empresa_id = intval($_SESSION["empresa_id"]);
    $role = $_SESSION["rol"];

    // Consulta base para obtener usuarios
    $baseQuery = "
        SELECT users.id, users.username, users.rol_id, users.email, 
               users.empresa_id, empresas.nombre AS empresa, roles.nombre AS rol
        FROM users 
        LEFT JOIN empresas ON users.empresa_id = empresas.id
        LEFT JOIN roles ON users.rol_id = roles.id
        WHERE empresas.estado = 1 AND roles.nombre <> 'SuperUser'
    ";

    // Obtener todos los usuarios
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        // Si es SuperUser, puede ver todos los usuarios
        if ($role == "SuperUser") {
            $result = $conn->query($baseQuery);
        } else {
            // Restringir a usuarios de la misma empresa
            $query = $baseQuery . " AND users.empresa_id = $empresa_id";
            $result = $conn->query($query);
        }

        if (!$result) {
            throw new Exception("Error al obtener usuarios", 500);
        }

        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        exit;
    }

    // Verificar que sea POST para las demás operaciones
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    $data = json_decode(file_get_contents("php://input"));
    if (!$data) {
        throw new Exception("Datos JSON inválidos", 400);
    }

    // Agregar usuario
    if (isset($_GET["create"])) {
        if (!isset($data->username) || !isset($data->password) || !isset($data->role_id) || !isset($data->email)) {
            throw new Exception("Datos incompletos para crear usuario", 400);
        }

        $username = $conn->real_escape_string(trim($data->username));
        $password = md5(trim($data->password)); // Usando MD5 como en el original
        $rol_id = intval($data->role_id);
        $empresa_id = isset($data->empresa_id) ? intval($data->empresa_id) : $empresa_id;
        $email = $conn->real_escape_string(trim($data->email));

        $stmt = $conn->prepare("INSERT INTO users (username, password, rol_id, empresa_id, email) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiis", $username, $password, $rol_id, $empresa_id, $email);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Usuario agregado"]);
        exit;
    }

    // Editar usuario
    if (isset($_GET["update"])) {
        if (!isset($data->id) || !isset($data->username) || !isset($data->role_id) || !isset($data->email) || !isset($data->empresa_id)) {
            throw new Exception("Datos incompletos para actualizar usuario", 400);
        }

        $id = intval($data->id);
        $username = $conn->real_escape_string(trim($data->username));
        $rol_id = intval($data->role_id);
        $empresa_id = intval($data->empresa_id);
        $email = $conn->real_escape_string(trim($data->email));

        // Construir la consulta dinámicamente para incluir password solo si se proporciona
        $query = "UPDATE users SET username = ?, rol_id = ?, empresa_id = ?, email = ?";
        $params = [$username, $rol_id, $empresa_id, $email];
        $types = "siis";

        if (!empty($data->password)) {
            $query .= ", password = ?";
            $password = md5(trim($data->password));
            $params[] = $password;
            $types .= "s";
        }

        $query .= " WHERE id = ?";
        $params[] = $id;
        $types .= "i";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Usuario actualizado"]);
        exit;
    }

    // Eliminar usuario
    if (isset($_GET["delete"])) {
        if (!isset($data->id)) {
            throw new Exception("ID de usuario requerido", 400);
        }

        $id = intval($data->id);
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Usuario eliminado"]);
        exit;
    }

    // Si no coincide con ninguna operación conocida
    throw new Exception("Operación no válida", 400);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>