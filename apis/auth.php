<?php
session_start();
// Configuración CORS esencial
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT users.id, users.rol_id, users.empresa_id, empresas.nombre AS empresa, roles.nombre AS rol FROM users LEFT JOIN empresas ON users.empresa_id = empresas.id LEFT JOIN roles ON roles.id = users.rol_id WHERE users.email = ? AND users.password = ?");
    
    $email = trim($data->email);
    $password = md5(trim($data->password));
    
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        $_SESSION["user_id"] = $row["id"];
        $_SESSION["email"] = $email;
        $_SESSION["role_id"] = $row["rol_id"];
        $_SESSION["empresa_id"] = $row["empresa_id"];
        $_SESSION["empresa"] = $row["empresa"];
        $_SESSION["rol"] = $row["rol"];

        // Devuelve todos los datos necesarios para el frontend
        echo json_encode([
            "status" => "success", 
            "rol_id" => $row["rol_id"],
            "empresa" => $row["empresa"],
            "rol" => $row["rol"],
            // Incluye los permisos directamente aquí para evitar segunda llamada
            "permissions" => obtenerPermisos($conn, $row["rol_id"])
        ]);
    } else {
        throw new Exception("Correo o contraseña incorrectos", 401);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}

// Función auxiliar para obtener permisos
function obtenerPermisos($conn, $role_id) {
    $stmt = $conn->prepare("SELECT i.nombre FROM role_items ri JOIN items i ON ri.item_id = i.id WHERE ri.role_id = ?");
    $stmt->bind_param("i", $role_id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);
}
?>