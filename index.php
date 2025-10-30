<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    $_SESSION['username'] = htmlspecialchars($_POST['username']);
    $_SESSION['snake_color'] = $_POST['snake_color'] ?? 'lime';
    $_SESSION['snake_pattern'] = $_POST['snake_pattern'] ?? 'solid';
    $_SESSION['gamemode'] = $_POST['gamemode'] ?? 'classic';
    header('Location: game.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game - Main Menu</title>
    <style>
        body {
            background: linear-gradient(135deg, #232526 0%, #0f2027 100%);
            min-height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #fff;
        }
        .container {
            background: rgba(30, 30, 30, 0.95);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            padding: 40px 32px 32px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 24px;
            letter-spacing: 2px;
            color: #39ff14;
            text-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;
        }
        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 24px;
        }
        label {
            font-size: 1.1rem;
            margin-bottom: 8px;
        }
        input[type="text"] {
            padding: 10px;
            border-radius: 6px;
            border: none;
            margin-bottom: 12px;
            font-size: 1.1rem;
            width: 200px;
            background: #222;
            color: #fff;
            outline: none;
        }
        select {
            padding: 10px;
            border-radius: 6px;
            border: none;
            margin-bottom: 12px;
            font-size: 1.1rem;
            width: 200px;
            background: #222;
            color: #fff;
            outline: none;
        }
        button[type="submit"] {
            background: linear-gradient(90deg, #39ff14 0%, #00c3ff 100%);
            color: #222;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        button[type="submit"]:hover {
            background: linear-gradient(90deg, #00c3ff 0%, #39ff14 100%);
        }
        .scoreboard-link {
            color: #00c3ff;
            font-size: 1.1rem;
            margin-top: 12px;
            text-decoration: none;
            transition: color 0.2s;
        }
        .scoreboard-link:hover {
            color: #39ff14;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Snake Game</h1>
        <form method="post" autocomplete="off">
            <label for="username">Enter Username:</label>
            <input type="text" id="username" name="username" required maxlength="20"
                value="<?php echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : ''; ?>">
            <label for="snake_color">Snake Color:</label>
            <select id="snake_color" name="snake_color">
                <option value="lime" <?php if (($_SESSION['snake_color'] ?? '') === 'lime') echo 'selected'; ?>>Lime (Classic)</option>
                <option value="blue" <?php if (($_SESSION['snake_color'] ?? '') === 'blue') echo 'selected'; ?>>Blue</option>
                <option value="orange" <?php if (($_SESSION['snake_color'] ?? '') === 'orange') echo 'selected'; ?>>Orange</option>
                <option value="purple" <?php if (($_SESSION['snake_color'] ?? '') === 'purple') echo 'selected'; ?>>Purple</option>
                <option value="pink" <?php if (($_SESSION['snake_color'] ?? '') === 'pink') echo 'selected'; ?>>Pink</option>
                <option value="red" <?php if (($_SESSION['snake_color'] ?? '') === 'red') echo 'selected'; ?>>Red</option>
                <option value="yellow" <?php if (($_SESSION['snake_color'] ?? '') === 'yellow') echo 'selected'; ?>>Yellow</option>
                <option value="cyan" <?php if (($_SESSION['snake_color'] ?? '') === 'cyan') echo 'selected'; ?>>Cyan</option>
                <option value="white" <?php if (($_SESSION['snake_color'] ?? '') === 'white') echo 'selected'; ?>>White</option>
                <option value="rainbow" <?php if (($_SESSION['snake_color'] ?? '') === 'rainbow') echo 'selected'; ?>>Rainbow</option>
                <option value="fire" <?php if (($_SESSION['snake_color'] ?? '') === 'fire') echo 'selected'; ?>>Fire</option>
                <option value="aqua" <?php if (($_SESSION['snake_color'] ?? '') === 'aqua') echo 'selected'; ?>>Aqua</option>
                <option value="forest" <?php if (($_SESSION['snake_color'] ?? '') === 'forest') echo 'selected'; ?>>Forest</option>
            </select>
            <label for="snake_pattern">Snake Pattern:</label>
            <select id="snake_pattern" name="snake_pattern">
                <option value="solid" <?php if (($_SESSION['snake_pattern'] ?? '') === 'solid') echo 'selected'; ?>>Solid</option>
                <option value="striped" <?php if (($_SESSION['snake_pattern'] ?? '') === 'striped') echo 'selected'; ?>>Striped</option>
                <option value="dotted" <?php if (($_SESSION['snake_pattern'] ?? '') === 'dotted') echo 'selected'; ?>>Dotted</option>
                <option value="gradient" <?php if (($_SESSION['snake_pattern'] ?? '') === 'gradient') echo 'selected'; ?>>Gradient</option>
                <option value="outline" <?php if (($_SESSION['snake_pattern'] ?? '') === 'outline') echo 'selected'; ?>>Outline</option>
                <option value="glow" <?php if (($_SESSION['snake_pattern'] ?? '') === 'glow') echo 'selected'; ?>>Glow</option>
                <option value="checker" <?php if (($_SESSION['snake_pattern'] ?? '') === 'checker') echo 'selected'; ?>>Checker</option>
            </select>
            <label for="gamemode">Gamemode:</label>
            <select id="gamemode" name="gamemode">
                <option value="classic" <?php if (($_SESSION['gamemode'] ?? '') === 'classic') echo 'selected'; ?>>Classic Box</option>
                <option value="openworld" <?php if (($_SESSION['gamemode'] ?? '') === 'openworld') echo 'selected'; ?>>Open World</option>
            </select>
            <button type="submit">Start Game</button>
        </form>
        <a href="scoreboard.php" class="scoreboard-link">View Scoreboard</a>
    </div>
</body>
</html>
