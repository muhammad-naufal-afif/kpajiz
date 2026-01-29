<?php
include '../../config/database.php';
$id = $_POST['id'];

// Ambil info foto dulu
$q = $conn->query("SELECT foto FROM guru WHERE id = $id");
$row = $q->fetch_assoc();

// Hapus File
if ($row && $row['foto']) {
    $path = "../../uploads/guru/" . $row['foto'];
    if (file_exists($path)) unlink($path);
}

// Hapus DB
$conn->query("DELETE FROM guru WHERE id = $id");
echo json_encode(["status" => "success"]);
?>