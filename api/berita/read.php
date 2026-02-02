<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../../config/database.php';

// Logika Limit Data
$limit_clause = "";
if (isset($_GET['limit'])) {
    $limit = intval($_GET['limit']);
    $limit_clause = "LIMIT $limit";
}

// Query Standar (Sesuai kolom tabel berita kamu: judul, kategori, status, dll)
$sql = "SELECT * FROM berita ORDER BY created_at DESC $limit_clause";
$result = $conn->query($sql);

$data = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>