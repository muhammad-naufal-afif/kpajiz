<?php
include '../../config/database.php';

$id = $_GET['id'] ?? null;

if ($id) {
    // 1. Tambah jumlah views +1 setiap kali dibuka
    $conn->query("UPDATE berita SET views = views + 1 WHERE id = $id");

    // 2. Ambil data berita berdasarkan ID
    $stmt = $conn->prepare("SELECT * FROM berita WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["status" => "error", "message" => "Berita tidak ditemukan"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Parameter ID tidak ada"]);
}
?>