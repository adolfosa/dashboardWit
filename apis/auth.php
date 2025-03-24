<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$server = "ls-ac361eb6981fc8da3000dad63b382c39e5f1f3cd.cylsiewx0zgx.us-east-1.rds.amazonaws.com";
$user = "dbmasteruser";
$pass = "CP7>2fobZp<7Kja!Efy3Q+~g:as2]rJD";
$db = "miapp";

// Conexión segura
try {
    $conn = new mysqli($server, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Solo aceptar métodos POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->username) || !isset($data->password)) {
        throw new Exception("Datos incompletos", 400);
    }

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
    if (isset($conn)) $conn->close();
    if (isset($stmt)) $stmt->close();
}
?>