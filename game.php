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
    <title>Pixel Squarke - Game Arena</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-neon: #00ff88;
            --secondary-neon: #ff0088;
            --accent-blue: #0088ff;
            --accent-purple: #8800ff;
            --dark-bg: #0a0a0a;
            --card-bg: rgba(15, 15, 30, 0.95);
            --text-light: #ffffff;
            --text-glow: #88ffaa;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: 
                radial-gradient(circle at 25% 25%, var(--accent-purple) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, var(--accent-blue) 0%, transparent 50%),
                linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Space Mono', monospace;
            color: var(--text-light);
            overflow: hidden;
        }

        body.fullscreen-mode {
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
        }

        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: 
                repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 255, 136, 0.03) 2px,
                    rgba(0, 255, 136, 0.03) 4px
                ),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 0, 136, 0.03) 2px,
                    rgba(255, 0, 136, 0.03) 4px
                );
            animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(20px, 20px); }
        }

        .game-header {
            text-align: center;
            margin: 20px 0;
        }

        .brand-title {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon), var(--accent-blue));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease-in-out infinite;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .player-info {
            font-family: 'Space Mono', monospace;
            font-size: 1.1rem;
            color: var(--text-glow);
            opacity: 0.8;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .game-container {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            width: 100%;
            height: 100%;
        }

        .game-container.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            z-index: 1000;
            background: 
                radial-gradient(circle at 25% 25%, var(--accent-purple) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, var(--accent-blue) 0%, transparent 50%),
                linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }

        .game-ui {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            max-width: 100%;
            padding: 0 20px;
        }

        .score-display {
            background: var(--card-bg);
            border: 2px solid var(--primary-neon);
            border-radius: 15px;
            padding: 15px 25px;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            backdrop-filter: blur(10px);
        }

        #score {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-neon);
            text-shadow: 0 0 10px var(--primary-neon);
            margin: 0;
        }

        .controls-hint {
            background: var(--card-bg);
            border: 2px solid var(--accent-blue);
            border-radius: 15px;
            padding: 15px 25px;
            box-shadow: 0 0 20px rgba(0, 136, 255, 0.3);
            backdrop-filter: blur(10px);
            text-align: center;
        }

        .controls-hint p {
            font-size: 0.9rem;
            color: var(--accent-blue);
            margin: 0;
            line-height: 1.4;
        }

        .game-arena {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 100%;
            overflow: hidden;
        }

        #gameCanvas {
            background: rgba(5, 5, 15, 0.9);
            border: 3px solid var(--primary-neon);
            border-radius: 15px;
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.5),
                0 0 60px rgba(0, 255, 136, 0.2),
                inset 0 0 20px rgba(0, 255, 136, 0.1);
            margin-bottom: 20px;
            animation: canvasPulse 3s ease-in-out infinite alternate;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 200px);
        }

        .fullscreen #gameCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none;
            max-height: none;
            margin: 0;
            border: none;
            border-radius: 0;
            background: rgba(5, 5, 15, 1);
            box-shadow: none;
            animation: none;
            z-index: 1;
        }

        @keyframes canvasPulse {
            0% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2); }
            100% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.7), 0 0 80px rgba(0, 255, 136, 0.3); }
        }

        .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border: 3px solid var(--primary-neon);
            border-radius: 20px;
            box-shadow: 
                0 0 50px rgba(0, 255, 136, 0.5),
                0 0 100px rgba(0, 255, 136, 0.2);
            padding: 40px 50px;
            text-align: center;
            z-index: 1000;
            backdrop-filter: blur(15px);
            animation: popupAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes popupAppear {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .popup h2 {
            font-family: 'Orbitron', monospace;
            font-size: 2.2rem;
            font-weight: 900;
            background: linear-gradient(45deg, var(--secondary-neon), var(--primary-neon));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .popup p {
            font-size: 1.3rem;
            color: var(--text-glow);
            margin-bottom: 30px;
        }

        .popup-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .popup button, .menu-link {
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon));
            background-size: 200% 200%;
            color: var(--dark-bg);
            border: none;
            border-radius: 12px;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: 700;
            font-family: 'Orbitron', monospace;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 1px;
            text-decoration: none;
            display: inline-block;
        }

        .popup button:hover, .menu-link:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
            animation: gradientShift 0.5s ease-in-out infinite;
        }

        .menu-link.secondary {
            background: linear-gradient(45deg, var(--accent-blue), var(--accent-purple));
        }

        .game-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            z-index: 999;
        }

        @media (max-width: 768px) {
            .brand-title {
                font-size: 1.5rem;
            }
            .player-info {
                font-size: 0.9rem;
            }
            .game-ui {
                flex-direction: column;
                gap: 10px;
                padding: 0 10px;
            }
            .score-display, .controls-hint {
                padding: 10px 15px;
                width: 100%;
                max-width: 300px;
                box-sizing: border-box;
            }
            .game-arena {
                padding: 0 10px;
            }
            #gameCanvas {
                max-width: calc(100vw - 20px);
                max-height: calc(100vh - 150px);
                width: auto;
                height: auto;
            }
            .popup {
                padding: 20px 15px;
                margin: 10px;
                width: calc(100% - 20px);
                max-width: 350px;
            }
            .popup h2 {
                font-size: 1.5rem;
            }
            .popup-buttons {
                flex-direction: column;
                gap: 10px;
            }
            .popup button, .menu-link {
                padding: 12px 20px;
                font-size: 1rem;
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .brand-title {
                font-size: 1.2rem;
                letter-spacing: 1px;
            }
            .game-ui {
                gap: 8px;
            }
            #gameCanvas {
                max-width: calc(100vw - 10px);
                max-height: calc(100vh - 120px);
            }
            .popup {
                margin: 5px;
                width: calc(100% - 10px);
            }
        }
    </style>
</head>
<body>
    <div class="animated-bg"></div>
    
    <div class="game-header">
        <h1 class="brand-title">PIXEL SQUARKE</h1>
        <p class="player-info">Player: <?php echo htmlspecialchars($username); ?> | Mode: <?php echo ucfirst($gamemode); ?></p>
    </div>

    <div class="game-container">
        <div class="game-ui">
            <div class="score-display">
                <div id="score">SCORE: 0</div>
            </div>
            <div class="controls-hint">
                <p><strong>WASD</strong> or <strong>Arrow Keys</strong> to move<br>
                <strong>Space</strong> to pause</p>
            </div>
        </div>

        <div class="game-arena">
            <canvas id="gameCanvas" width="<?php echo $gamemode === 'openworld' ? 'auto' : 400; ?>" height="<?php echo $gamemode === 'openworld' ? 'auto' : 400; ?>"></canvas>
        </div>
        
        <audio id="eatAppleSound" src="eat.mp3" preload="auto"></audio>
    </div>

    <div class="game-overlay" id="gameOverlay"></div>
    
    <div id="gameOverPopup" class="popup">
        <h2>Game Over!</h2>
        <div id="finalScore"></div>
        <div class="popup-buttons">
            <button onclick="restartGame()">🔄 Restart</button>
            <a href="index.php" class="menu-link secondary">🏠 Main Menu</a>
            <a href="scoreboard.php" class="menu-link secondary">🏆 Leaderboard</a>
        </div>
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
        
        // Enhanced game over function with overlay
        function showGameOver(score) {
            document.getElementById('finalScore').innerHTML = `<p style="font-size: 1.5rem; color: var(--primary-neon); margin-bottom: 10px;">FINAL SCORE</p><p style="font-size: 2.2rem; font-weight: 900; color: var(--secondary-neon);">${score}</p>`;
            document.getElementById('gameOverlay').style.display = 'block';
            document.getElementById('gameOverPopup').style.display = 'block';
        }
        
        function restartGame() {
            document.getElementById('gameOverPopup').style.display = 'none';
            document.getElementById('gameOverlay').style.display = 'none';
            game.resetGame();
        }
        
        // Enhanced pause functionality
        let isPaused = false;
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!isPaused && game && typeof game.pauseGame === 'function') {
                    game.pauseGame();
                    isPaused = true;
                } else if (isPaused && game && typeof game.resumeGame === 'function') {
                    game.resumeGame();
                    isPaused = false;
                }
            }
        });
        
        window.onload = function() {
            // Add loading animation
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            
            setTimeout(() => {
                if (GAMEMODE === 'openworld') {
                    // Check if fullscreen mode should be enabled for open world
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('fullscreen') === 'true') {
                        document.body.classList.add('fullscreen');
                        document.querySelector('.game-container').classList.add('fullscreen');
                    }
                    
                    game = new OpenWorldGame('gameCanvas', 'score', 'eatAppleSound', USERNAME, SNAKE_COLOR, SNAKE_PATTERN);
                    
                    // Handle window resize for fullscreen mode
                    if (document.body.classList.contains('fullscreen')) {
                        window.addEventListener('resize', () => {
                            if (game && game.handleResize) {
                                game.handleResize();
                            }
                        });
                    }
                } else {
                    game = new SnakeGame('gameCanvas', 'score', 'eatAppleSound', USERNAME, SNAKE_COLOR, SNAKE_PATTERN);
                }
                game.addKeyboardControls();
                game.startGame();
                
                document.body.style.opacity = '1';
            }, 200);
        };
        
        // Close popup when clicking overlay
        document.getElementById('gameOverlay').addEventListener('click', function() {
            restartGame();
        });
    </script>
</body>
</html>
