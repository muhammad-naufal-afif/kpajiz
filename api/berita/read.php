<?php
include '../../config/database.php';

$sql = "SELECT * FROM berita ORDER BY created_at DESC";
$result = $conn->query($sql);

$berita = [];
while ($row = $result->fetch_assoc()) {
    $berita[] = $row;
}

echo json_encode($berita);
?>