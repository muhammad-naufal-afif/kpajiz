<?php
// api/pesan/read.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// GUNAKAN __DIR__ AGAR JALUR FILE PASTI KETEMU (ANTI-ERROR)
include_once __DIR__ . '/../../config/database.php';

// Cek koneksi database dari variabel $conn di database.php
if (!isset($conn)) {
    echo json_encode([]); // Kirim array kosong jika database gagal load
    exit();
}

$sql = "SELECT * FROM pesan ORDER BY created_at DESC";
$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>