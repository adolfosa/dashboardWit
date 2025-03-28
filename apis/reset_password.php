<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar token
    if (!isset($_GET['token'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Token requerido"]);
        exit;
    }

    $token = $conn->real_escape_string($_GET['token']);
    
    $stmt = $conn->prepare("SELECT id, reset_token_expiry FROM users WHERE reset_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Token inválido o expirado"]);
        exit;
    }
    
    $user = $result->fetch_assoc();
    if (strtotime($user['reset_token_expiry']) < time()) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El token ha expirado"]);
        exit;
    }
    
    echo json_encode(["status" => "success", "message" => "Token válido"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Procesar cambio de contraseña
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->token) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        exit;
    }
    
    $token = $conn->real_escape_string($data->token);
    $password = md5(trim($data->password)); // Usando MD5 como en el sistema actual
    
    // Verificar token y actualizar contraseña
    $stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()");
    $stmt->bind_param("ss", $password, $token);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Token inválido o expirado"]);
        exit;
    }
    
    echo json_encode(["status" => "success", "message" => "Contraseña actualizada correctamente"]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Método no permitido"]);
?>