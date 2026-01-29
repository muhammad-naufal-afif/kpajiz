<?php
include '../../config/database.php';

$kategori = $_POST['kategori'] ?? 'kegiatan'; // Default
$uploaded = 0;

if (isset($_FILES['files'])) {
    $total_files = count($_FILES['files']['name']);
    $target_dir = "../../uploads/galeri/";
    if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);

    for ($i = 0; $i < $total_files; $i++) {
        $file_name = $_FILES['files']['name'][$i];
        $tmp_name = $_FILES['files']['tmp_name'][$i];
        
        $new_name = time() . "_" . $i . ".jpg"; // Rename biar unik
        
        if (move_uploaded_file($tmp_name, $target_dir . $new_name)) {
            // Masuk database
            $stmt = $conn->prepare("INSERT INTO galeri (kategori, file_gambar) VALUES (?, ?)");
            $stmt->bind_param("ss", $kategori, $new_name);
            $stmt->execute();
            $uploaded++;
        }
    }
}

if ($uploaded > 0) {
    echo json_encode(["status" => "success", "count" => $uploaded]);
} else {
    echo json_encode(["status" => "error", "message" => "Tidak ada file yang terupload"]);
}
?>