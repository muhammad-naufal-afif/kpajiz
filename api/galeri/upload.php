<?php
// PENTING: Include helper yang baru dibuat
include '../helper_image.php'; 
include '../../config/database.php';

$kategori = $_POST['kategori'] ?? 'kegiatan'; 
$uploaded = 0;

if (isset($_FILES['files'])) {
    $total_files = count($_FILES['files']['name']);
    $target_dir = "../../uploads/galeri/";
    
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $stmt = $conn->prepare("INSERT INTO galeri (kategori, file_gambar) VALUES (?, ?)");

    for ($i = 0; $i < $total_files; $i++) {
        // Cek error upload bawaan PHP
        if ($_FILES['files']['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }

        $tmp_name = $_FILES['files']['tmp_name'][$i];
        
        // Ganti nama file dan paksa ekstensi jadi .jpg (karena helper kita outputnya jpg)
        $new_name = time() . "_" . $i . ".jpg"; 
        $target_file = $target_dir . $new_name;
        
        // --- BAGIAN INI YANG BIKIN RINGAN ---
        // Jangan pakai move_uploaded_file(), tapi pakai resizeImage()
        resizeImage($tmp_name, $target_file, 800); 
        
        // Cek apakah file berhasil dibuat di folder
        if (file_exists($target_file)) {
            $stmt->bind_param("ss", $kategori, $new_name);
            if($stmt->execute()) {
                $uploaded++;
            }
        }
    }
}

if ($uploaded > 0) {
    echo json_encode(["status" => "success", "count" => $uploaded, "message" => "Berhasil upload $uploaded foto."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal upload. Pastikan file gambar valid."]);
}
?>