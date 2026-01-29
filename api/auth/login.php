<?php
session_start();
include '../../config/database.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Cek user di database
$stmt = $conn->prepare("SELECT id, password, role, nama_lengkap, foto FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Verifikasi Password (Hash)
    if (password_verify($password, $row['password'])) {
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = $row['role'];
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "nama" => $row['nama_lengkap'],
                "role" => $row['role'],
                "foto" => $row['foto']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Password salah!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Username tidak ditemukan!"]);
}
?>