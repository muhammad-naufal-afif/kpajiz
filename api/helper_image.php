<?php
// Matikan error warning biar JSON tetap bersih
error_reporting(0);
ini_set('display_errors', 0);

function resizeImage($file_tmp, $target_file, $max_width = 800) {
    list($width, $height) = getimagesize($file_tmp);
    
    // Kalau gambar sudah kecil, langsung simpan
    if ($width <= $max_width) {
        move_uploaded_file($file_tmp, $target_file);
        return;
    }

    $ratio = $width / $height;
    
    // --- PERBAIKAN DISINI ---
    // Gunakan intval() untuk membulatkan angka koma jadi bulat
    $new_width = intval($max_width);
    $new_height = intval($max_width / $ratio); 

    $src = imagecreatefromstring(file_get_contents($file_tmp));
    
    // Pastikan ukuran canvas juga Integer
    $dst = imagecreatetruecolor($new_width, $new_height);

    // Support Transparansi
    imagealphablending($dst, false);
    imagesavealpha($dst, true);

    // Resize
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

    // Simpan JPG
    imagejpeg($dst, $target_file, 80); 
    
    imagedestroy($src);
    imagedestroy($dst);
}
?>