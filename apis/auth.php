<?php
$conn = require 'db.php';

// Solo aceptar métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Datos incompletos"
    ]);
    exit;
}

try {
    // Consulta preparada para seguridad
    $stmt = $conn->prepare("SELECT role FROM users WHERE username = ? AND password = ?");
    $username = trim($data->username);
    $password = md5(trim($data->password)); // Asegúrate de usar el mismo hash que al crear usuarios
    
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "status" => "success", 
            "role" => $row["role"]
        ]);
    } else {
        throw new Exception("Usuario o contraseña incorrectos", 401);
    }
    
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