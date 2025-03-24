<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$server = "ls-ac361eb6981fc8da3000dad63b382c39e5f1f3cd.cylsiewx0zgx.us-east-1.rds.amazonaws.com";
$user = "dbmasteruser";
$pass = "CP7>2fobZp<7Kja!Efy3Q+~g:as2]rJD";
$db = "miapp";

try {
    $conn = new mysqli($server, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos");
    }
    
    // Retornamos la conexión para usarla en otros archivos
    return $conn;
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    exit;
}
?>