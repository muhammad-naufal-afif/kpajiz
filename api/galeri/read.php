<?php
// 1. Matikan pesan error text agar JSON tidak rusak
error_reporting(0);
ini_set('display_errors', 0);

// 2. Header wajib untuk JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../../config/database.php';

try {
    // Cek koneksi database
    if (!$conn) {
        throw new Exception("Koneksi Database Gagal");
    }

    $limit_clause = "";
    if (isset($_GET['limit'])) {
        $limit = intval($_GET['limit']);
        $limit_clause = "LIMIT $limit";
    }

    $sql = "SELECT * FROM galeri ORDER BY id DESC $limit_clause";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Gagal mengambil data: " . $conn->error);
    }

    $data = [];
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Kirim hasil bersih dalam format JSON
    echo json_encode($data);

} catch (Exception $e) {
    // Jika error, kirim array kosong agar loading berhenti
    echo json_encode([]);
}
?>