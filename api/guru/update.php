<?php
include '../../config/database.php';

$id = $_POST['id']; // ID Guru yang mau diedit
$nama = $_POST['nama'];
$nip = $_POST['nip'];
$posisi = $_POST['posisi'];

// Cek apakah ada foto baru yang diupload
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/guru/";
    $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $new_name = time() . "." . $ext;
    move_uploaded_file($_FILES['foto']['tmp_name'], $target_dir . $new_name);
    
    // Update dengan foto
    $stmt = $conn->prepare("UPDATE guru SET nama=?, nip=?, posisi_default=?, foto=? WHERE id=?");
    $stmt->bind_param("ssssi", $nama, $nip, $posisi, $new_name, $id);
} else {
    // Update tanpa ganti foto
    $stmt = $conn->prepare("UPDATE guru SET nama=?, nip=?, posisi_default=? WHERE id=?");
    $stmt->bind_param("sssi", $nama, $nip, $posisi, $id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Data guru diperbarui"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>