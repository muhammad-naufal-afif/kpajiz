<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../../config/database.php';

$limit_clause = "";
if (isset($_GET['limit'])) {
    $limit = intval($_GET['limit']);
    $limit_clause = "LIMIT $limit";
}

// PERBAIKAN DISINI: Kita pakai 'AS' supaya namanya diganti pas dikirim ke JS
// nama_lomba -> judul
// foto_bukti -> foto
$sql = "SELECT id, nama_lomba as judul, peringkat, tingkat, tanggal, foto_bukti as foto 
        FROM prestasi ORDER BY tanggal DESC $limit_clause";

$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>