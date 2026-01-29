<?php
include '../../config/database.php';

$judul = $_POST['judul'];
$kategori = $_POST['kategori']; // Contoh: 'prestasi', 'kegiatan'
$konten = $_POST['konten'];
$status = $_POST['status'];
$slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));

$thumbnail = null;
$upload_success = false;

// 1. UPLOAD KE BERITA
if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
    $target_dir_berita = "../../uploads/berita/";
    if (!file_exists($target_dir_berita)) mkdir($target_dir_berita, 0777, true);
    
    $file_ext = pathinfo($_FILES["thumbnail"]["name"], PATHINFO_EXTENSION);
    $new_name = time() . "." . $file_ext;
    
    if(move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $target_dir_berita . $new_name)) {
        $thumbnail = $new_name;
        $upload_success = true;
    }
}

// 2. INSERT BERITA
$stmt = $conn->prepare("INSERT INTO berita (judul, slug, kategori, konten, status, thumbnail) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $judul, $slug, $kategori, $konten, $status, $thumbnail);

if ($stmt->execute()) {
    
    // 3. COPY KE GALERI (SESUAI KATEGORI BERITA)
    if ($upload_success && $thumbnail) {
        $target_dir_galeri = "../../uploads/galeri/";
        if (!file_exists($target_dir_galeri)) mkdir($target_dir_galeri, 0777, true);

        if (copy($target_dir_berita . $thumbnail, $target_dir_galeri . $thumbnail)) {
            // Perhatikan: Kita menggunakan variabel $kategori dari input berita
            $stmt_galeri = $conn->prepare("INSERT INTO galeri (judul, kategori, file_gambar) VALUES (?, ?, ?)");
            $stmt_galeri->bind_param("sss", $judul, $kategori, $thumbnail);
            $stmt_galeri->execute();
        }
    }

    echo json_encode(["status" => "success", "message" => "Berita terbit & Masuk Galeri kategori " . $kategori]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>