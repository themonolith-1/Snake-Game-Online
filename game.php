<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('Location: index.php');
    exit;
}
$username = $_SESSION['username'];
$snake_color = $_SESSION['snake_color'] ?? 'lime';
$snake_pattern = $_SESSION['snake_pattern'] ?? 'solid';
$gamemode = $_SESSION['gamemode'] ?? 'classic';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Snake Game</title>
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
        .game-container {
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #gameCanvas {
            background: #111;
            border: 4px solid #39ff14;
            border-radius: 10px;
            box-shadow: 0 0 20px #39ff14;
            margin-bottom: 16px;
        }
        #score {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #39ff14;
            text-shadow: 0 0 8px #39ff14;
        }
        .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(30, 30, 30, 0.98);
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            padding: 32px 40px;
            text-align: center;
            z-index: 100;
        }
        .popup h2 {
            color: #39ff14;
            margin-bottom: 18px;
        }
        .popup button {
            background: linear-gradient(90deg, #39ff14 0%, #00c3ff 100%);
            color: #222;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 18px;
        }
        .popup button:hover {
            background: linear-gradient(90deg, #00c3ff 0%, #39ff14 100%);
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
    <div class="game-container">
        <div id="score">Score: 0</div>
        <canvas id="gameCanvas" width="<?php echo $gamemode === 'openworld' ? 800 : 400; ?>" height="<?php echo $gamemode === 'openworld' ? 600 : 400; ?>"></canvas>
        <audio id="eatAppleSound" src="eat.mp3" preload="auto"></audio>
    </div>
    <div id="gameOverPopup" class="popup">
        <h2>Game Over!</h2>
        <div id="finalScore"></div>
        <button onclick="restartGame()">Restart</button>
        <a href="index.php" class="menu-link">Back to Menu</a>
        <a href="scoreboard.php" class="menu-link">View Scoreboard</a>
    </div>
    <script>
        const USERNAME = <?php echo json_encode($username); ?>;
        const SNAKE_COLOR = <?php echo json_encode($snake_color); ?>;
        const SNAKE_PATTERN = <?php echo json_encode($snake_pattern); ?>;
        const GAMEMODE = <?php echo json_encode($gamemode); ?>;
    </script>
    <script src="snakeGame.js"></script>
    <?php if ($gamemode === 'openworld'): ?>
    <script src="openWorldGame.js"></script>
    <?php endif; ?>
    <script>
        let game;
        window.onload = function() {
            if (GAMEMODE === 'openworld') {
                game = new OpenWorldGame('gameCanvas', 'score', 'eatAppleSound', USERNAME, SNAKE_COLOR, SNAKE_PATTERN);
            } else {
                game = new SnakeGame('gameCanvas', 'score', 'eatAppleSound', USERNAME, SNAKE_COLOR, SNAKE_PATTERN);
            }
            game.addKeyboardControls();
            game.startGame();
        };
        function showGameOver(score) {
            document.getElementById('finalScore').textContent = "Your Score: " + score;
            document.getElementById('gameOverPopup').style.display = 'block';
        }
        function restartGame() {
            document.getElementById('gameOverPopup').style.display = 'none';
            game.resetGame();
        }
    </script>
</body>
</html>
    </script>
</body>
</html>
