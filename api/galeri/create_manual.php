<?php
// 1. Matikan error display agar JSON tidak rusak
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json; charset=UTF-8");

// 2. Include Helper & Database
// Pastikan file helper_image.php sudah ada di folder api/
include '../helper_image.php';
include '../../config/database.php';

$response = [];

try {
    // 3. Validasi Input
    if (!isset($_POST['judul']) || !isset($_POST['kategori'])) {
        throw new Exception("Judul dan Kategori wajib diisi.");
    }

    $judul = $_POST['judul'];
    $kategori = $_POST['kategori'];

    // 4. Validasi File
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Pilih file gambar yang valid.");
    }

    // 5. Siapkan Penyimpanan
    $target_dir = "../../uploads/galeri/";
    if (!file_exists($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            throw new Exception("Gagal membuat folder upload.");
        }
    }

    $tmp_name = $_FILES['file']['tmp_name'];
    $new_name = time() . "_" . rand(100, 999) . ".jpg"; // Paksa .jpg
    $target_file = $target_dir . $new_name;

    // 6. PROSES RESIZE (Gunakan Helper)
    // Pastikan function resizeImage ada. Jika tidak, pakai move_uploaded_file sebagai fallback.
    if (function_exists('resizeImage')) {
        resizeImage($tmp_name, $target_file, 800);
    } else {
        move_uploaded_file($tmp_name, $target_file); // Fallback kalau helper belum ada
    }

    // 7. Cek & Simpan Database
    if (file_exists($target_file)) {
        $stmt = $conn->prepare("INSERT INTO galeri (judul, kategori, file_gambar) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $judul, $kategori, $new_name);
        
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Foto berhasil diupload & dikompres!';
        } else {
            // Hapus file jika gagal simpan ke DB
            @unlink($target_file);
            throw new Exception("Gagal menyimpan data ke database.");
        }
    } else {
        throw new Exception("Gagal memproses gambar server.");
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

// Kirim JSON
echo json_encode($response);
?>