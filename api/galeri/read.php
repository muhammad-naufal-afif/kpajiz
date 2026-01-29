<?php
include '../../config/database.php';

// Ambil semua data galeri, urutkan dari yang terbaru
$sql = "SELECT * FROM galeri ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>