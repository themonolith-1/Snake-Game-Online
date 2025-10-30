<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['username'], $data['score'])) {
    http_response_code(400);
    exit('Invalid data');
}
$scoreFile = __DIR__ . '/scores.json';
$scores = [];
if (file_exists($scoreFile)) {
    $scores = json_decode(file_get_contents($scoreFile), true) ?: [];
}
$scores[] = [
    'username' => htmlspecialchars($data['username']),
    'score' => (int)$data['score'],
    'time' => time()
];
file_put_contents($scoreFile, json_encode($scores, JSON_PRETTY_PRINT));
echo 'OK';
