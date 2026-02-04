<?php
session_start();
// Header ini penting biar browser tahu ini JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../../config/database.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// PERBAIKAN DISINI: 
// 1. Ganti 'nama_lengkap' jadi 'nama' (sesuai database)
// 2. Hapus 'foto' (biar ga error kalau kolomnya belum ada)
$stmt = $conn->prepare("SELECT id, password, role, nama FROM users WHERE username = ?");

// Cek jika query gagal disiapkan (misal salah nama tabel)
if(!$stmt) {
    echo json_encode(["status" => "error", "message" => "Query Error: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Verifikasi Password
    if (password_verify($password, $row['password'])) {
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['role'] = $row['role'];
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "id" => $row['id'],       // Penting buat localStorage
                "nama" => $row['nama'],   // Sudah diperbaiki (bukan nama_lengkap)
                "role" => $row['role']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Password salah!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Username tidak ditemukan!"]);
}
?>