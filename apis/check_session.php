<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (isset($_SESSION["user_id"])) {
    echo json_encode([
        "loggedIn" => true,
        "user_id" => $_SESSION["user_id"],
        "role_id" => $_SESSION["role_id"],
        "empresa" => $_SESSION["empresa"],
        "rol" => $_SESSION["rol"]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>