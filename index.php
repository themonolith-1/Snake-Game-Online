<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    $_SESSION['username'] = htmlspecialchars($_POST['username']);
    $_SESSION['snake_color'] = $_POST['snake_color'] ?? 'lime';
    $_SESSION['snake_pattern'] = $_POST['snake_pattern'] ?? 'solid';
    $_SESSION['gamemode'] = $_POST['gamemode'] ?? 'classic';
    
    // Add fullscreen parameter for open world mode
    $redirect_url = 'game.php';
    if ($_SESSION['gamemode'] === 'openworld') {
        $redirect_url .= '?fullscreen=true';
    }
    
    header('Location: ' . $redirect_url);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixel Squarke - Main Menu</title>
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
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Space Mono', monospace;
            color: var(--text-light);
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
        }

        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -2;
            background-image: 
                repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 20px,
                    rgba(0, 255, 136, 0.1) 21px,
                    rgba(0, 255, 136, 0.1) 22px,
                    transparent 23px,
                    transparent 40px
                ),
                repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 20px,
                    rgba(0, 255, 136, 0.1) 21px,
                    rgba(0, 255, 136, 0.1) 22px,
                    transparent 23px,
                    transparent 40px
                );
            animation: floatingGrid 20s linear infinite;
        }

        .animated-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                repeating-linear-gradient(
                    45deg,
                    transparent 0px,
                    transparent 25px,
                    rgba(255, 0, 136, 0.08) 26px,
                    rgba(255, 0, 136, 0.08) 27px,
                    transparent 28px,
                    transparent 50px
                ),
                repeating-linear-gradient(
                    -45deg,
                    transparent 0px,
                    transparent 25px,
                    rgba(0, 136, 255, 0.08) 26px,
                    rgba(0, 136, 255, 0.08) 27px,
                    transparent 28px,
                    transparent 50px
                );
            animation: floatingGrid 30s linear infinite reverse;
        }

        /* Floating particles effect */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--primary-neon);
            border-radius: 1px;
            animation: floatSquares 20s infinite linear;
            opacity: 0.7;
            box-shadow: 
                0 0 8px var(--primary-neon),
                inset 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .particle:nth-child(2n) {
            background: var(--secondary-neon);
            box-shadow: 
                0 0 8px var(--secondary-neon),
                inset 0 0 2px rgba(255, 255, 255, 0.3);
            animation-duration: 25s;
            width: 8px;
            height: 8px;
        }

        .particle:nth-child(3n) {
            background: var(--accent-blue);
            box-shadow: 
                0 0 8px var(--accent-blue),
                inset 0 0 2px rgba(255, 255, 255, 0.3);
            animation-duration: 30s;
            width: 5px;
            height: 5px;
        }

        .particle:nth-child(4n) {
            background: var(--accent-purple);
            box-shadow: 
                0 0 10px var(--accent-purple),
                inset 0 0 3px rgba(255, 255, 255, 0.4);
            animation-duration: 35s;
            width: 7px;
            height: 7px;
            border-radius: 2px;
        }

        @keyframes floatSquares {
            0% {
                transform: translateY(100vh) translateX(0px) rotate(0deg) scale(0.5);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
                transform: translateY(90vh) translateX(10px) rotate(45deg) scale(0.7);
            }
            50% {
                transform: translateY(50vh) translateX(-20px) rotate(180deg) scale(1);
                opacity: 1;
            }
            90% {
                opacity: 0.8;
                transform: translateY(10vh) translateX(15px) rotate(315deg) scale(0.8);
            }
            100% {
                transform: translateY(-10vh) translateX(0px) rotate(360deg) scale(0.3);
                opacity: 0;
            }
        }

        @keyframes floatingGrid {
            0% { 
                transform: translate(0px, 100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% { 
                transform: translate(-50px, -100vh) rotate(180deg);
                opacity: 0;
            }
        }

        .fullscreen-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }

        .container {
            background: transparent;
            border: none;
            border-radius: 0;
            box-shadow: none;
            padding: clamp(40px, 8vh, 80px) clamp(20px, 5vw, 60px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            backdrop-filter: none;
            position: relative;
            overflow: visible;
            width: 100vw;
            height: 100vh;
            box-sizing: border-box;
            z-index: 2;
        }

        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: transparent;
            z-index: -1;
        }

        @keyframes ambientGlow {
            0% { 
                opacity: 0.3;
                transform: scale(1);
            }
            100% { 
                opacity: 0.6;
                transform: scale(1.02);
            }
        }

        .brand-title {
            font-family: 'Orbitron', monospace;
            font-size: clamp(3rem, 12vw, 8rem);
            font-weight: 900;
            margin-bottom: clamp(30px, 6vh, 60px);
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon), var(--accent-blue), var(--primary-neon));
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textGlow 2s ease-in-out infinite alternate, gradientShift 6s ease-in-out infinite;
            text-shadow: 0 0 80px rgba(0, 255, 136, 0.8);
            letter-spacing: clamp(2px, 2vw, 8px);
            text-align: center;
            position: relative;
            width: 100%;
        }

        .brand-title::before {
            content: 'PIXEL SQUARKE';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(45deg, transparent, var(--primary-neon), transparent);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: titleScan 3s ease-in-out infinite;
            z-index: -1;
        }

        @keyframes titleScan {
            0%, 100% { opacity: 0; background-position: -200% 0; }
            50% { opacity: 0.8; background-position: 200% 0; }
        }

        .brand-subtitle {
            font-family: 'Space Mono', monospace;
            font-size: 1.2rem;
            color: var(--text-glow);
            margin-bottom: 40px;
            text-align: center;
            opacity: 0.8;
            animation: subtitleFade 3s ease-in-out infinite alternate;
        }

        @keyframes textGlow {
            0% { text-shadow: 0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3); }
            100% { text-shadow: 0 0 30px rgba(0, 255, 136, 0.8), 0 0 60px rgba(255, 0, 136, 0.4); }
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes subtitleFade {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
        }

        .game-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            align-items: start;
            gap: clamp(20px, 4vw, 40px);
            margin-bottom: clamp(30px, 6vh, 60px);
            width: 100%;
            max-width: min(90vw, 1200px);
            justify-items: center;
        }

        .input-group {
            width: 100%;
            max-width: 350px;
            position: relative;
            background: rgba(10, 10, 30, 0.2);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(0, 255, 136, 0.3);
            backdrop-filter: blur(2px);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }

        .input-label {
            display: block;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--text-glow);
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
        }

        .styled-input, .styled-select {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 12px;
            background: rgba(10, 10, 30, 0.8);
            color: var(--text-light);
            font-size: 1.1rem;
            font-family: 'Space Mono', monospace;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
        }

        .styled-input:focus, .styled-select:focus {
            border-color: var(--primary-neon);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
            background: rgba(10, 10, 30, 0.9);
            transform: translateY(-2px);
        }

        .styled-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%2300ff88' viewBox='0 0 16 16'%3e%3cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 15px center;
            background-size: 16px;
            padding-right: 45px;
        }

        .styled-select option {
            background: var(--dark-bg);
            color: var(--text-light);
            padding: 10px;
        }

        .color-preview {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            vertical-align: middle;
        }

        .start-button {
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon));
            background-size: 200% 200%;
            color: var(--dark-bg);
            border: none;
            border-radius: 20px;
            padding: clamp(18px, 3vh, 25px) clamp(40px, 8vw, 60px);
            font-size: clamp(1.2rem, 3vw, 1.8rem);
            font-weight: 900;
            font-family: 'Orbitron', monospace;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: clamp(1px, 0.5vw, 3px);
            position: relative;
            overflow: hidden;
            animation: buttonPulse 2s ease-in-out infinite alternate;
            margin: clamp(20px, 4vh, 40px) 0;
        }

        .start-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
            animation: gradientShift 0.5s ease-in-out infinite;
        }

        .start-button:active {
            transform: translateY(-1px) scale(1.02);
        }

        @keyframes buttonPulse {
            0% { box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3); }
            100% { box-shadow: 0 8px 30px rgba(255, 0, 136, 0.4); }
        }

        .nav-links {
            display: flex;
            gap: clamp(20px, 4vw, 40px);
            margin-top: clamp(20px, 4vh, 40px);
            flex-wrap: wrap;
            justify-content: center;
        }

        .nav-link {
            color: var(--accent-blue);
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 12px 25px;
            border: 2px solid var(--accent-blue);
            border-radius: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 136, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .nav-link:hover {
            color: var(--text-light);
            background: var(--accent-blue);
            box-shadow: 0 5px 20px rgba(0, 136, 255, 0.4);
            transform: translateY(-2px);
        }

        .nav-link:hover::before {
            left: 100%;
        }

        @media (max-width: 768px) {
            .brand-title {
                font-size: 2.2rem;
            }
            .container {
                padding: 30px 25px;
                margin: 20px;
                width: calc(100% - 40px);
            }
            .nav-links {
                flex-direction: column;
                gap: 15px;
            }
        }

        @media (max-width: 480px) {
            .brand-title {
                font-size: 1.8rem;
                letter-spacing: 1px;
            }
            .brand-subtitle {
                font-size: 1rem;
            }
            .container {
                padding: 25px 20px;
                margin: 10px;
                width: calc(100% - 20px);
            }
            .game-form {
                gap: 20px;
            }
            .start-button {
                padding: 15px 30px;
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <div class="animated-bg"></div>
    <div class="particles"></div>
    
    <div class="fullscreen-container">
        <div class="container">
            <h1 class="brand-title">PIXEL SQUARKE</h1>
            <p class="brand-subtitle">► The Ultimate Retro Snake Experience ◄</p>
        
        <form method="post" autocomplete="off" class="game-form">
            <div class="input-group">
                <label for="username" class="input-label">Player Name</label>
                <input type="text" id="username" name="username" class="styled-input" required maxlength="20" placeholder="Enter your name..."
                    value="<?php echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : ''; ?>">
            </div>

            <div class="input-group">
                <label for="snake_color" class="input-label">Snake Style</label>
                <select id="snake_color" name="snake_color" class="styled-select">
                    <option value="lime" <?php if (($_SESSION['snake_color'] ?? '') === 'lime') echo 'selected'; ?>>🟢 Neon Green (Classic)</option>
                    <option value="blue" <?php if (($_SESSION['snake_color'] ?? '') === 'blue') echo 'selected'; ?>>🔵 Electric Blue</option>
                    <option value="orange" <?php if (($_SESSION['snake_color'] ?? '') === 'orange') echo 'selected'; ?>>🟠 Cyber Orange</option>
                    <option value="purple" <?php if (($_SESSION['snake_color'] ?? '') === 'purple') echo 'selected'; ?>>🟣 Mystic Purple</option>
                    <option value="pink" <?php if (($_SESSION['snake_color'] ?? '') === 'pink') echo 'selected'; ?>>🩷 Hot Pink</option>
                    <option value="red" <?php if (($_SESSION['snake_color'] ?? '') === 'red') echo 'selected'; ?>>🔴 Laser Red</option>
                    <option value="yellow" <?php if (($_SESSION['snake_color'] ?? '') === 'yellow') echo 'selected'; ?>>🟡 Solar Yellow</option>
                    <option value="cyan" <?php if (($_SESSION['snake_color'] ?? '') === 'cyan') echo 'selected'; ?>>🔷 Digital Cyan</option>
                    <option value="white" <?php if (($_SESSION['snake_color'] ?? '') === 'white') echo 'selected'; ?>>⚪ Ghost White</option>
                    <option value="rainbow" <?php if (($_SESSION['snake_color'] ?? '') === 'rainbow') echo 'selected'; ?>>🌈 RGB Rainbow</option>
                    <option value="fire" <?php if (($_SESSION['snake_color'] ?? '') === 'fire') echo 'selected'; ?>>🔥 Flame Effect</option>
                    <option value="aqua" <?php if (($_SESSION['snake_color'] ?? '') === 'aqua') echo 'selected'; ?>>💎 Aqua Crystal</option>
                    <option value="forest" <?php if (($_SESSION['snake_color'] ?? '') === 'forest') echo 'selected'; ?>>🌿 Forest Matrix</option>
                </select>
            </div>

            <div class="input-group">
                <label for="snake_pattern" class="input-label">Visual Effect</label>
                <select id="snake_pattern" name="snake_pattern" class="styled-select">
                    <option value="solid" <?php if (($_SESSION['snake_pattern'] ?? '') === 'solid') echo 'selected'; ?>>◼️ Solid Block</option>
                    <option value="striped" <?php if (($_SESSION['snake_pattern'] ?? '') === 'striped') echo 'selected'; ?>>🦓 Striped</option>
                    <option value="dotted" <?php if (($_SESSION['snake_pattern'] ?? '') === 'dotted') echo 'selected'; ?>>⚫ Dotted Matrix</option>
                    <option value="gradient" <?php if (($_SESSION['snake_pattern'] ?? '') === 'gradient') echo 'selected'; ?>>🌅 Gradient Flow</option>
                    <option value="outline" <?php if (($_SESSION['snake_pattern'] ?? '') === 'outline') echo 'selected'; ?>>⬜ Neon Outline</option>
                    <option value="glow" <?php if (($_SESSION['snake_pattern'] ?? '') === 'glow') echo 'selected'; ?>>✨ Glow Effect</option>
                    <option value="checker" <?php if (($_SESSION['snake_pattern'] ?? '') === 'checker') echo 'selected'; ?>>🏁 Checkered</option>
                </select>
            </div>

            <div class="input-group">
                <label for="gamemode" class="input-label">Battle Arena</label>
                <select id="gamemode" name="gamemode" class="styled-select">
                    <option value="classic" <?php if (($_SESSION['gamemode'] ?? '') === 'classic') echo 'selected'; ?>>🎯 Classic Arena</option>
                    <option value="openworld" <?php if (($_SESSION['gamemode'] ?? '') === 'openworld') echo 'selected'; ?>>🌍 Open World Battle</option>
                </select>
            </div>

            <button type="submit" class="start-button">🚀 Launch Game</button>
        </form>

        <div class="nav-links">
            <a href="scoreboard.php" class="nav-link">🏆 Leaderboard</a>
        </div>
    </div>
    </div>

    <script>
        // Create floating particles
        function createParticles() {
            const particleContainer = document.querySelector('.particles');
            const particleCount = window.innerWidth < 768 ? 20 : 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particleContainer.appendChild(particle);
            }
        }

        // Add interactive color preview
        const colorSelect = document.getElementById('snake_color');
        const colorMap = {
            'lime': '#39ff14',
            'blue': '#0088ff',
            'orange': '#ff8800',
            'purple': '#8800ff',
            'pink': '#ff0088',
            'red': '#ff0044',
            'yellow': '#ffdd00',
            'cyan': '#00ffff',
            'white': '#ffffff',
            'rainbow': 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
            'fire': '#ff4500',
            'aqua': '#00ffaa',
            'forest': '#228b22'
        };

        // Add smooth animations on load
        window.addEventListener('load', function() {
            createParticles();
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 1s ease-in-out';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Add input focus animations
        document.querySelectorAll('.styled-input, .styled-select').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    </script>
</body>
</html>
