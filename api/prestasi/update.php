<?php
include '../../config/database.php';

$id = $_POST['id'];
$judul = $_POST['judul'];
$peringkat = $_POST['peringkat'];
$tingkat = $_POST['tingkat'];
$tanggal = $_POST['tanggal'];

// Cek apakah ada upload foto baru
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/prestasi/";
    $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $new_name = time() . "." . $ext;
    move_uploaded_file($_FILES['foto']['tmp_name'], $target_dir . $new_name);
    
    // Update data + foto
    $stmt = $conn->prepare("UPDATE prestasi SET judul=?, peringkat=?, tingkat=?, tanggal=?, foto=? WHERE id=?");
    $stmt->bind_param("sssssi", $judul, $peringkat, $tingkat, $tanggal, $new_name, $id);
} else {
    // Update data saja (foto lama tetap)
    $stmt = $conn->prepare("UPDATE prestasi SET judul=?, peringkat=?, tingkat=?, tanggal=? WHERE id=?");
    $stmt->bind_param("ssssi", $judul, $peringkat, $tingkat, $tanggal, $id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Data prestasi berhasil diperbarui"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>