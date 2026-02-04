<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $old_pass = $_POST['old_password'];
    $new_pass = $_POST['new_password'];

    // Ambil password lama dari DB
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($old_pass, $user['password'])) {
        // Password lama benar, update ke yang baru
        $new_hashed = password_hash($new_pass, PASSWORD_DEFAULT);
        $update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $update->bind_param("si", $new_hashed, $id);
        
        if ($update->execute()) {
            echo json_encode(["status" => "success", "message" => "Password berhasil diubah!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal update database."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Password lama salah!"]);
    }
}
?>