<?php
// GANTI 'kpajiz' JADI 'db_sekolah'
$conn = new mysqli("127.0.0.1", "root", "", "db_sekolah");

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>