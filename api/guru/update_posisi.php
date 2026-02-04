<?php
include '../../config/database.php';

// Ambil JSON input dari JS
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!empty($data)) {
    foreach ($data as $item) {
        $id = $item['id'];
        $jabatan = $item['jabatan'];

        $stmt = $conn->prepare("UPDATE guru SET jabatan = ? WHERE id = ?");
        $stmt->bind_param("si", $jabatan, $id);
        $stmt->execute();
    }
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "No data"]);
}
?>