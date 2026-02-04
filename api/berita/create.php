<?php
include '../helper_image.php';
// 1. Matikan error text agar JSON tidak rusak
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include '../../config/database.php';

// FUNGSI BUAT SLUG (PENTING! Biar error 'slug doesn't have default value' hilang)
function buatSlug($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    if (empty($text)) { return 'n-a'; }
    return $text . '-' . time();
}

$response = [];

try {
    if (!$conn) throw new Exception("Koneksi Database Gagal");

    // 2. Ambil Data Input dari Form
    $judul    = $_POST['judul'];
    $kategori = $_POST['kategori']; // Pastikan nilainya: kegiatan, prestasi, pengumuman, atau artikel
    $konten   = $_POST['konten'];
    $status   = $_POST['status'];   // published atau draft
    
    // Validasi sederhana
    if(empty($judul) || empty($konten)) {
        throw new Exception("Judul dan Konten tidak boleh kosong.");
    }

    // 3. Buat Slug Otomatis
    $slug = buatSlug($judul);

    // 4. Proses Upload Thumbnail
    $thumbnail_nama = null;
    if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
        $target_dir = "../../uploads/berita/";
        
        if (!file_exists($target_dir)) @mkdir($target_dir, 0777, true);
        
        // Pakai JPG/PNG biar aman
        $ext = pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION);
        $new_name = time() . "_" . rand(100,999) . "." . $ext;
        $target_file = $target_dir . $new_name;
        
        // --- PERBAIKAN DISINI ---
        // JANGAN pakai move_uploaded_file, tapi pakai resizeImage biar file kecil & ringan
        
        // move_uploaded_file($_FILES['thumbnail']['tmp_name'], $target_file); <-- INI BIKIN BERAT
        
        resizeImage($_FILES['thumbnail']['tmp_name'], $target_file, 800); // <-- PAKAI INI (Max lebar 800px)
        
        // Cek apakah file berhasil dibuat oleh resizeImage
        if (file_exists($target_file)) {
            $thumbnail_nama = $new_name;
        }
    }

    // Default values
    $views = 0;
    $created_at = date('Y-m-d H:i:s');

    // 5. Simpan ke Database
    // Kolom: judul, slug, kategori, konten, thumbnail, status, views, created_at
    $stmt = $conn->prepare("INSERT INTO berita (judul, slug, kategori, konten, thumbnail, status, views, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    // s = string, i = integer
    $stmt->bind_param("ssssssis", $judul, $slug, $kategori, $konten, $thumbnail_nama, $status, $views, $created_at);

    if ($stmt->execute()) {
        $response['status'] = 'success';
        $response['message'] = 'Berita berhasil diterbitkan!';
    } else {
        throw new Exception("Gagal simpan DB: " . $stmt->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>