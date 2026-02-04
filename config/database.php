<?php
// config/database.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$user = "root";       // User default XAMPP
$pass = "";           // Password default XAMPP (kosong)
$db   = "db_sekolah"; // <--- INI YANG BENAR (Sesuai database kamu)

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    // Kirim JSON error biar JS tidak bingung
    die(json_encode(["status" => "error", "message" => "Gagal Konek Database: " . $conn->connect_error]));
}
?>