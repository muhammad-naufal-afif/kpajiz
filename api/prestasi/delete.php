<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include '../../config/database.php';

$id = $_POST['id'];

// PERBAIKAN: Ganti 'foto' jadi 'foto_bukti'
$q = $conn->query("SELECT foto_bukti FROM prestasi WHERE id = $id");
$row = $q->fetch_assoc();

if ($row && $row['foto_bukti']) {
    $path = "../../uploads/prestasi/" . $row['foto_bukti'];
    if (file_exists($path)) unlink($path);
}

$del = $conn->query("DELETE FROM prestasi WHERE id = $id");

if ($del) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>