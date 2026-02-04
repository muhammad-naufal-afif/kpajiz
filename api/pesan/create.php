<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../../config/database.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = $_POST['nama'] ?? '';
    $email = $_POST['email'] ?? '';
    $telepon = $_POST['telepon'] ?? '';
    $subjek = $_POST['subjek'] ?? '';
    $pesan = $_POST['pesan'] ?? '';

    if (!empty($nama) && !empty($email) && !empty($pesan)) {
        $stmt = $conn->prepare("INSERT INTO pesan (nama, email, telepon, subjek, pesan) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $nama, $email, $telepon, $subjek, $pesan);

        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Pesan Anda berhasil dikirim!';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Gagal menyimpan pesan.';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Nama, Email, dan Pesan wajib diisi.';
    }
}
echo json_encode($response);
?>