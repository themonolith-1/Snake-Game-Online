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
    <title>Pixel Squarke - Leaderboard</title>
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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Space Mono', monospace;
            color: var(--text-light);
            overflow: hidden;
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

        .container {
            background: var(--card-bg);
            border: 2px solid var(--primary-neon);
            border-radius: 20px;
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.3),
                0 0 60px rgba(0, 255, 136, 0.1),
                inset 0 0 20px rgba(255, 255, 255, 0.05);
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            backdrop-filter: blur(10px);
            animation: containerPulse 3s ease-in-out infinite alternate;
            position: relative;
            overflow: hidden;
            max-width: 600px;
            width: 90%;
        }

        .container::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon), var(--accent-blue), var(--primary-neon));
            border-radius: 20px;
            z-index: -1;
            animation: borderRotate 4s linear infinite;
        }

        @keyframes containerPulse {
            0% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.1); }
            100% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.5), 0 0 80px rgba(0, 255, 136, 0.2); }
        }

        @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .brand-title {
            font-family: 'Orbitron', monospace;
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 10px;
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon), var(--accent-blue));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textGlow 2s ease-in-out infinite alternate, gradientShift 4s ease-in-out infinite;
            text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
            letter-spacing: 2px;
            text-align: center;
        }

        .leaderboard-title {
            font-family: 'Space Mono', monospace;
            font-size: 1.5rem;
            color: var(--text-glow);
            margin-bottom: 30px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 3px;
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

        .leaderboard-table {
            border-collapse: collapse;
            width: 100%;
            background: rgba(5, 5, 15, 0.8);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
            margin-bottom: 30px;
        }

        .leaderboard-table th {
            background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon));
            color: var(--dark-bg);
            padding: 15px 12px;
            text-align: center;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .leaderboard-table td {
            padding: 12px;
            text-align: center;
            font-size: 1rem;
            border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }

        .leaderboard-table tr:nth-child(even) {
            background: rgba(0, 255, 136, 0.05);
        }

        .leaderboard-table tr:hover {
            background: rgba(0, 255, 136, 0.1);
            transform: scale(1.02);
            transition: all 0.2s ease;
        }

        .rank-cell {
            font-weight: 700;
            color: var(--secondary-neon);
        }

        .rank-1 { color: #ffd700; text-shadow: 0 0 10px #ffd700; }
        .rank-2 { color: #c0c0c0; text-shadow: 0 0 10px #c0c0c0; }
        .rank-3 { color: #cd7f32; text-shadow: 0 0 10px #cd7f32; }

        .score-cell {
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            color: var(--primary-neon);
        }

        .nav-links {
            display: flex;
            gap: 20px;
            margin-top: 20px;
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

        .nav-link.primary {
            border-color: var(--primary-neon);
            color: var(--primary-neon);
        }

        .nav-link.primary:hover {
            background: var(--primary-neon);
            color: var(--dark-bg);
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--text-glow);
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            .brand-title {
                font-size: 2rem;
            }
            .container {
                padding: 25px 20px;
            }
            .nav-links {
                flex-direction: column;
                gap: 15px;
            }
            .leaderboard-table th, .leaderboard-table td {
                padding: 8px 6px;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <div class="animated-bg"></div>
    
    <div class="container">
        <h1 class="brand-title">PIXEL SQUARKE</h1>
        <h2 class="leaderboard-title">🏆 Hall of Fame 🏆</h2>
        
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($scores)): ?>
                    <?php foreach (array_slice($scores, 0, 20) as $i => $entry): ?>
                    <tr>
                        <td class="rank-cell <?= $i < 3 ? 'rank-' . ($i + 1) : '' ?>">
                            <?php if ($i === 0): ?>
                                🥇 #1
                            <?php elseif ($i === 1): ?>
                                🥈 #2
                            <?php elseif ($i === 2): ?>
                                🥉 #3
                            <?php else: ?>
                                #<?= $i + 1 ?>
                            <?php endif; ?>
                        </td>
                        <td><?= htmlspecialchars($entry['username']) ?></td>
                        <td class="score-cell"><?= number_format((int)$entry['score']) ?></td>
                        <td><?= date('M j, Y', $entry['time']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4" class="empty-state">
                            🎮 No scores yet! Be the first to play! 🎮
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
        
        <div class="nav-links">
            <a href="index.php" class="nav-link primary">🏠 Main Menu</a>
            <a href="game.php" class="nav-link">🚀 Play Now</a>
        </div>
    </div>

    <script>
        // Add smooth loading animation
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Add interactive row highlighting
        document.querySelectorAll('.leaderboard-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 5px 15px rgba(0, 255, 136, 0.3)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    </script>
</body>
</html>
