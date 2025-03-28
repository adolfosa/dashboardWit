<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Configuración CORS completa
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require '../vendor/autoload.php';

// Configuración del servidor de correo
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_USER', 'mailer.wit@gmail.com');
define('MAIL_PASS', 'rqcsywcmsuvhzyqt');
define('MAIL_SECURE', 'tls');
define('MAIL_PORT', 587);

// Configuración de seguridad adicional para SMTP
$smtpOptions = [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    ]
];

$conn = require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

if ($_SERVER['HTTP_ORIGIN'] === 'http://localhost:5174') {
    header("Access-Control-Allow-Origin: http://localhost:5174");
}

$data = json_decode(file_get_contents("php://input"));

// Verificar si se recibieron datos JSON
$json = file_get_contents('php://input');
$data = json_decode($json);

if (json_last_error() !== JSON_ERROR_NONE || !isset($data->email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos inválidos o correo electrónico requerido"]);
    exit;
}

$email = $conn->real_escape_string(trim($data->email));

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato de correo electrónico inválido"]);
    exit;
}

// Verificar si el correo existe en la base de datos
$stmt = $conn->prepare("SELECT id, username FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Respuesta genérica por seguridad (no revelar si el email existe)
if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "success", 
        "message" => "Si el correo existe en nuestros registros, recibirás un enlace para restablecer tu contraseña"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Generar token único con expiración (1 hora)
$token = bin2hex(random_bytes(50));
$expiry = date("Y-m-d H:i:s", time() + 3600);

// Guardar token en la base de datos
$updateStmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
$updateStmt->bind_param("sss", $token, $expiry, $email);

if (!$updateStmt->execute()) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al procesar la solicitud"]);
    exit;
}

// Configurar PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = MAIL_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_USER;
    $mail->Password   = MAIL_PASS;
    $mail->SMTPSecure = MAIL_SECURE;
    $mail->Port       = MAIL_PORT;
    $mail->SMTPOptions = $smtpOptions;
    $mail->CharSet = 'UTF-8';

    // Configuración del correo
    $mail->setFrom(MAIL_USER, 'Soporte WIT');
    $mail->addAddress($email, $user['username']);
    $mail->addReplyTo(MAIL_USER, 'Soporte WIT');

    // Generar enlace de reset dinámico y seguro
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $resetLink = $protocol . $host . "/reset-password?token=" . urlencode($token);

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Restablecimiento de contraseña - WIT';
    
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #2c3e50;'>Restablecer contraseña</h2>
            <p>Hola {$user['username']},</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña en WIT. Haz clic en el siguiente botón para continuar:</p>
            
            <div style='text-align: center; margin: 25px 0;'>
                <a href='$resetLink' style='background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;'>
                    Restablecer contraseña
                </a>
            </div>
            
            <p>O copia y pega esta URL en tu navegador:</p>
            <p style='word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;'>$resetLink</p>
            
            <p style='color: #7f8c8d; font-size: 0.9em;'>
                <strong>Nota:</strong> Si no solicitaste este cambio, puedes ignorar este mensaje. 
                El enlace expirará en 1 hora.
            </p>
            
            <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
            <p style='font-size: 0.8em; color: #7f8c8d;'>
                Este es un mensaje automático, por favor no respondas directamente a este correo.
            </p>
        </div>
    ";
    
    $mail->AltBody = "Restablecimiento de contraseña - WIT\n\n" .
                     "Hola {$user['username']},\n\n" .
                     "Para restablecer tu contraseña, visita el siguiente enlace:\n" .
                     "$resetLink\n\n" .
                     "Si no solicitaste este cambio, ignora este mensaje.\n" .
                     "El enlace expirará en 1 hora.\n\n" .
                     "Este es un mensaje automático, por favor no respondas directamente a este correo.";

    $mail->send();
    
    // Respuesta exitosa
    echo json_encode([
        "status" => "success", 
        "message" => "Correo enviado con éxito. Por favor revisa tu bandeja de entrada (y la carpeta de spam si no lo encuentras)."
    ]);
    
} catch (Exception $e) {
    error_log("Error al enviar correo: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Error al enviar el correo. Por favor intenta nuevamente más tarde."
    ]);
} finally {
    if (isset($updateStmt)) $updateStmt->close();
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>