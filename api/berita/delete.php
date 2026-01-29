<?php
include '../../config/database.php';

$id = $_POST['id'];

// Hapus file gambar dulu jika ada (opsional tapi disarankan agar hemat storage)
$cek = $conn->query("SELECT thumbnail FROM berita WHERE id = $id");
$row = $cek->fetch_assoc();
if ($row && $row['thumbnail']) {
    unlink("../../uploads/berita/" . $row['thumbnail']);
}

$stmt = $conn->prepare("DELETE FROM berita WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>