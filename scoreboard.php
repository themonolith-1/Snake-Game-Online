<?php
$scores = [];
$scoreFile = __DIR__ . '/scores.json';
if (file_exists($scoreFile)) {
    $scores = json_decode(file_get_contents($scoreFile), true) ?: [];
    // Sort by score descending, then by time ascending
    usort($scores, function($a, $b) {
        if ($b['score'] === $a['score']) {
            return $a['time'] - $b['time'];
        }
        return $b['score'] - $a['score'];
    });
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Snake Game - Scoreboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background: linear-gradient(135deg, #232526 0%, #0f2027 100%);
            min-height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #fff;
        }
        .container {
            margin-top: 40px;
            background: rgba(30, 30, 30, 0.95);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            padding: 40px 32px 32px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            color: #39ff14;
            margin-bottom: 24px;
            text-shadow: 0 0 10px #39ff14;
        }
        table {
            border-collapse: collapse;
            width: 340px;
            background: #181818;
            border-radius: 8px;
            overflow: hidden;
        }
        th, td {
            padding: 10px 12px;
            text-align: center;
        }
        th {
            background: #222;
            color: #39ff14;
            font-size: 1.1rem;
        }
        tr:nth-child(even) {
            background: #222;
        }
        tr:nth-child(odd) {
            background: #181818;
        }
        .menu-link {
            color: #00c3ff;
            font-size: 1.1rem;
            margin-top: 18px;
            text-decoration: none;
            display: inline-block;
        }
        .menu-link:hover {
            color: #39ff14;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Scoreboard</h1>
        <table>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>Score</th>
                <th>Date</th>
            </tr>
            <?php foreach (array_slice($scores, 0, 20) as $i => $entry): ?>
            <tr>
                <td><?= $i + 1 ?></td>
                <td><?= htmlspecialchars($entry['username']) ?></td>
                <td><?= (int)$entry['score'] ?></td>
                <td><?= date('Y-m-d H:i', $entry['time']) ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($scores)): ?>
            <tr><td colspan="4">No scores yet.</td></tr>
            <?php endif; ?>
        </table>
        <a href="index.php" class="menu-link">Back to Menu</a>
        <a href="game.php" class="menu-link">Play Again</a>
    </div>
</body>
</html>
