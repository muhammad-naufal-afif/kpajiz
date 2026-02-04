<?php
include '../../config/database.php';

$id = $_POST['id'];
$judul = $_POST['judul'];
$kategori = $_POST['kategori'];
$status = $_POST['status'];
$konten = $_POST['konten'];

if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/berita/";
    $ext = pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION);
    $new_name = time() . "." . $ext;
    move_uploaded_file($_FILES['thumbnail']['tmp_name'], $target_dir . $new_name);

    $stmt = $conn->prepare("UPDATE berita SET judul=?, kategori=?, status=?, konten=?, thumbnail=? WHERE id=?");
    $stmt->bind_param("sssssi", $judul, $kategori, $status, $konten, $new_name, $id);
} else {
    $stmt = $conn->prepare("UPDATE berita SET judul=?, kategori=?, status=?, konten=? WHERE id=?");
    $stmt->bind_param("ssssi", $judul, $kategori, $status, $konten, $id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Berita diperbarui"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>