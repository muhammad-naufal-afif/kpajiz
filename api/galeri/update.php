<?php
include '../../config/database.php';

$id = $_POST['id'];
$judul = $_POST['judul'];
$kategori = $_POST['kategori'];

// Cek apakah ada file gambar baru yang diupload
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/galeri/";
    $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $new_name = time() . "." . $ext;
    move_uploaded_file($_FILES['file']['tmp_name'], $target_dir . $new_name);
    
    // Update data BESERTA gambar baru
    $stmt = $conn->prepare("UPDATE galeri SET judul=?, kategori=?, file_gambar=? WHERE id=?");
    $stmt->bind_param("sssi", $judul, $kategori, $new_name, $id);
} else {
    // Update data TULISAN saja (gambar lama tetap)
    $stmt = $conn->prepare("UPDATE galeri SET judul=?, kategori=? WHERE id=?");
    $stmt->bind_param("ssi", $judul, $kategori, $id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Info foto berhasil diperbarui"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>