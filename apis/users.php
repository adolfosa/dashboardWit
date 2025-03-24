<?php
$conn = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Obtener todos los usuarios
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $result = $conn->query("SELECT id, username, role FROM users");
        if (!$result) {
            throw new Exception("Error al obtener usuarios");
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
        if (!isset($data->username) || !isset($data->password) || !isset($data->role)) {
            throw new Exception("Datos incompletos para crear usuario", 400);
        }

        $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $username = trim($data->username);
        $password = md5(trim($data->password));
        $role = trim($data->role);
        
        $stmt->bind_param("sss", $username, $password, $role);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Usuario creado exitosamente"]);
        exit;
    }

    // Editar usuario
    if (isset($_GET["update"])) {
        if (!isset($data->id) || !isset($data->username) || !isset($data->role)) {
            throw new Exception("Datos incompletos para actualizar usuario", 400);
        }

        if (!empty($data->password)) {
            $stmt = $conn->prepare("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?");
            $password = md5(trim($data->password));
            $stmt->bind_param("sssi", $data->username, $password, $data->role, $data->id);
        } else {
            $stmt = $conn->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
            $stmt->bind_param("ssi", $data->username, $data->role, $data->id);
        }
        
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Usuario actualizado exitosamente"]);
        exit;
    }

    // Eliminar usuario
    if (isset($_GET["delete"])) {
        if (!isset($data->id)) {
            throw new Exception("ID de usuario requerido", 400);
        }

        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $data->id);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "message" => "Usuario eliminado exitosamente"]);
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