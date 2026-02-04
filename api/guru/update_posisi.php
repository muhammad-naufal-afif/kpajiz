<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include '../../config/database.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!empty($data)) {
    // Mulai Transaksi biar aman
    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("UPDATE guru SET jabatan = ? WHERE id = ?");
        foreach ($data as $item) {
            $stmt->bind_param("si", $item['jabatan'], $item['id']);
            $stmt->execute();
        }
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Posisi berhasil disimpan"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Gagal: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Tidak ada data yang dikirim"]);
}
?>