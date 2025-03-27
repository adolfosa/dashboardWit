<?php
session_start();
header("Access-Control-Allow-Origin: *"); // Especifica tu origen exacto
header("Access-Control-Allow-Credentials: true"); // Permite cookies
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = require 'db.php';

try {
    // Verificar sesión
    if (!isset($_SESSION["user_id"])) {
        throw new Exception("No autorizado", 401);
    }

    // Obtener todos los roles (excepto SuperUser si no es admin)
    $query = "SELECT id, nombre FROM roles";
    if ($_SESSION["rol"] !== "SuperUser") {
        $query .= " WHERE nombre <> 'SuperUser'";
    }
    
    $result = $conn->query($query);
    $roles = $result->fetch_all(MYSQLI_ASSOC);

    // Obtener permisos (role_items) para el usuario actual
    $query = "SELECT ri.role_id, ri.item_id, i.nombre as item_nombre, i.url as item_url
              FROM role_items ri
              JOIN items i ON ri.item_id = i.id
              WHERE ri.role_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $_SESSION["role_id"]);
    $stmt->execute();
    $permissions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "status" => "success",
        "roles" => $roles,
        "permissions" => $permissions
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>