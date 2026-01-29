<?php
include '../../config/database.php';

$nama = $_POST['nama'];
$nip = $_POST['nip'];
$posisi = $_POST['posisi']; // Misal: Guru PJOK, Guru Mapel

$foto_nama = null;

if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/guru/";
    if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
    
    $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $new_name = time() . "." . $ext;
    
    if (move_uploaded_file($_FILES['foto']['tmp_name'], $target_dir . $new_name)) {
        $foto_nama = $new_name;
    }
}

$stmt = $conn->prepare("INSERT INTO guru (nama, nip, posisi_default, foto, lokasi_slot) VALUES (?, ?, ?, ?, 'pool')");
$stmt->bind_param("ssss", $nama, $nip, $posisi, $foto_nama);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Guru berhasil ditambahkan"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>