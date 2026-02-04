<?php
header("Access-Control-Allow-Origin: *");
include '../../config/database.php';

$nama = $_POST['nama'];
$nip = $_POST['nip'] ?? '-';
$jabatan = $_POST['jabatan'] ?? 'pool'; // Default ke pool
$kategori = 'Guru'; // Default

$foto_name = 'default.jpg';
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $foto_name = time() . '.' . $ext;
    move_uploaded_file($_FILES['foto']['tmp_name'], "../../uploads/guru/" . $foto_name);
}

$stmt = $conn->prepare("INSERT INTO guru (nama, nip, jabatan, kategori, foto) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nama, $nip, $jabatan, $kategori, $foto_name);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>