<?php
include '../../config/database.php';

// Menerima JSON dari JavaScript
$input = file_get_contents("php://input");
$data = json_decode($input, true); // Array of objects [{id: 1, slot: '1a'}, ...]

if ($data) {
    // Reset semua ke pool dulu (opsional, untuk safety)
    // $conn->query("UPDATE guru SET lokasi_slot = 'pool'");

    foreach ($data as $item) {
        $id = $item['guru_id'];
        $slot = $item['slot']; // 'pool', 'kepala_sekolah', '1a', dll
        
        $stmt = $conn->prepare("UPDATE guru SET lokasi_slot = ? WHERE id = ?");
        $stmt->bind_param("si", $slot, $id);
        $stmt->execute();
    }
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Data kosong"]);
}
?>