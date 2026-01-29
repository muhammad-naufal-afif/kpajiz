<?php
// File: sync_galeri.php
// Script ini untuk memindahkan foto berita LAMA ke Galeri secara massal

include 'api/config/database.php'; // Sesuaikan jalur jika config ada di folder lain

echo "<h1>Mulai Proses Sinkronisasi...</h1><hr>";

// 1. Ambil semua berita yang punya gambar
$sql = "SELECT * FROM berita WHERE thumbnail IS NOT NULL AND thumbnail != ''";
$result = $conn->query($sql);

$berhasil = 0;
$gagal = 0;
$sudah_ada = 0;

if ($result->num_rows > 0) {
    while($berita = $result->fetch_assoc()) {
        $file_name = $berita['thumbnail'];
        $judul = $berita['judul'];
        
        // Jalur Folder (Sesuaikan dengan struktur foldermu)
        $source = "uploads/berita/" . $file_name;
        $dest = "uploads/galeri/" . $file_name;

        // Cek apakah file fisik ada di folder berita
        if (file_exists($source)) {
            
            // Cek apakah data sudah ada di database galeri (biar tidak dobel)
            $cek_db = $conn->query("SELECT id FROM galeri WHERE file_gambar = '$file_name'");
            
            if ($cek_db->num_rows == 0) {
                // Copy File Fisik
                // Pastikan folder tujuan ada
                if (!file_exists("uploads/galeri/")) mkdir("uploads/galeri/", 0777, true);

                if (copy($source, $dest)) {
                    // Masukkan ke Database Galeri
                    // Gunakan prepared statement biar aman
                    $stmt = $conn->prepare("INSERT INTO galeri (judul, kategori, file_gambar) VALUES (?, 'kegiatan', ?)");
                    $stmt->bind_param("ss", $judul, $file_name);
                    
                    if ($stmt->execute()) {
                        echo "<p style='color:green'>[SUKSES] Berita: <b>$judul</b> berhasil disalin ke Galeri.</p>";
                        $berhasil++;
                    } else {
                        echo "<p style='color:red'>[DB ERROR] Gagal input database: $judul</p>";
                        $gagal++;
                    }
                } else {
                    echo "<p style='color:red'>[COPY ERROR] Gagal menyalin file: $file_name</p>";
                    $gagal++;
                }
            } else {
                echo "<p style='color:orange'>[SKIP] Berita: <b>$judul</b> sudah ada di Galeri.</p>";
                $sudah_ada++;
            }
        } else {
            echo "<p style='color:red'>[FILE HILANG] File gambar tidak ditemukan: $source</p>";
            $gagal++;
        }
    }
} else {
    echo "Tidak ada berita ditemukan.";
}

echo "<hr>";
echo "<h3>Laporan Akhir:</h3>";
echo "<ul>";
echo "<li>Berhasil dipindahkan: <b>$berhasil</b></li>";
echo "<li>Sudah ada sebelumnya: <b>$sudah_ada</b></li>";
echo "<li>Gagal (Error/File Hilang): <b>$gagal</b></li>";
echo "</ul>";
echo "<a href='dashboard.html'>Kembali ke Dashboard</a>";
?>