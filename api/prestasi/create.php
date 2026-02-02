<?php
// Matikan error text agar JSON tidak rusak
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include '../../config/database.php';

// FUNGSI BUAT SLUG (Link URL Otomatis)
function buatSlug($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    if (empty($text)) { return 'n-a'; }
    return $text . '-' . time(); // Tambah waktu biar unik
}

$response = [];

try {
    if (!$conn) throw new Exception("Koneksi Database Gagal");

    // 1. Ambil Input Data
    $judul_lomba = $_POST['judul'];
    $peringkat   = $_POST['peringkat'] ?? '-';
    $tingkat     = $_POST['tingkat'] ?? '-';
    $tanggal     = $_POST['tanggal'];
    
    $foto_nama = null;

    // 2. Upload Foto & Copy ke Berita
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $dir_prestasi = "../../uploads/prestasi/";
        $dir_berita   = "../../uploads/berita/";
        
        // Buat folder jika belum ada
        if (!file_exists($dir_prestasi)) @mkdir($dir_prestasi, 0777, true);
        if (!file_exists($dir_berita))   @mkdir($dir_berita, 0777, true);
        
        $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $new_name = time() . "_" . rand(100,999) . "." . $ext;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $dir_prestasi . $new_name)) {
            $foto_nama = $new_name;
            // COPY foto agar masuk ke folder berita juga
            @copy($dir_prestasi . $new_name, $dir_berita . $new_name);
        }
    }

    // 3. SIMPAN KE TABEL PRESTASI (Sesuai Struktur Tabel Prestasi kamu)
    // Kolom: nama_lomba, peringkat, tingkat, tanggal, foto_bukti
    $stmt1 = $conn->prepare("INSERT INTO prestasi (nama_lomba, peringkat, tingkat, tanggal, foto_bukti) VALUES (?, ?, ?, ?, ?)");
    $stmt1->bind_param("sssss", $judul_lomba, $peringkat, $tingkat, $tanggal, $foto_nama);

    if ($stmt1->execute()) {
        $response['status'] = 'success';
        $response['message'] = 'Sukses! Data masuk ke Prestasi & Berita.';

        // 4. AUTO-POST KE TABEL BERITA (Sesuai Struktur Tabel Berita kamu)
        // Kita butuh: judul, slug, konten, kategori, thumbnail, status, views, created_at
        
        $slug = buatSlug($judul_lomba); // << INI YANG TADI BIKIN ERROR (Sekarang sudah ada)
        $konten = "<p>Selamat atas prestasi $peringkat dalam $judul_lomba tingkat $tingkat.</p>";
        $kategori = 'Prestasi'; // Harus persis dengan opsi ENUM di database (huruf besar/kecil berpengaruh)
        $status = 'published';
        $views = 0;
        $created_at = date('Y-m-d H:i:s');

        // Cek dulu apakah ENUM kategori kamu 'Prestasi' atau 'prestasi' (lowercase)?
        // Di screenshot terlihat 'prestasi' (kecil). Kita sesuaikan jadi kecil.
        $kategori = 'prestasi'; 

        $stmt2 = $conn->prepare("INSERT INTO berita (judul, slug, konten, kategori, thumbnail, status, views, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt2->bind_param("ssssssis", $judul_lomba, $slug, $konten, $kategori, $foto_nama, $status, $views, $created_at);
        $stmt2->execute();

    } else {
        throw new Exception("Gagal Simpan Prestasi: " . $stmt1->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>