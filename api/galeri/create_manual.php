<?php
include '../../config/database.php';

$judul = $_POST['judul'];
$kategori = $_POST['kategori'];

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $target_dir = "../../uploads/galeri/";
    if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
    
    $file_ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
    $new_name = time() . "_" . rand(100,999) . "." . $file_ext;
    
    if(move_uploaded_file($_FILES["file"]["tmp_name"], $target_dir . $new_name)) {
        
        $stmt = $conn->prepare("INSERT INTO galeri (judul, kategori, file_gambar) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $judul, $kategori, $new_name);
        
        if($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Foto berhasil diupload"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal upload file"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Tidak ada file dipilih"]);
}
?>