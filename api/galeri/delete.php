<?php
include '../../config/database.php';

$id = $_POST['id'] ?? null;

if ($id) {
    // 1. Ambil nama file dulu untuk dihapus dari folder
    $query = $conn->prepare("SELECT file_gambar FROM galeri WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $file_path = "../../uploads/galeri/" . $row['file_gambar'];
        if (file_exists($file_path)) {
            unlink($file_path); // Hapus file fisik
        }
    }

    // 2. Hapus data dari database
    $stmt = $conn->prepare("DELETE FROM galeri WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus database"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
}
?>