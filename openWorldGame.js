class OpenWorldGame extends SnakeGame {
    constructor(canvasId, scoreId, eatAppleSoundId, username, snakeColor = 'lime', snakePattern = 'solid') {
        super(canvasId, scoreId, eatAppleSoundId, username, snakeColor, snakePattern);
        this.worldWidth = 4000;
        this.worldHeight = 4000;
        this.appleCount = 80;
        this.apples = [];
        this.bots = [];
        this.botCount = 12;
        this.playerMoveDelay = 1;
        this.botMoveDelay = 1;
        this.playerFrame = 0;
        this.botFrame = 0;
        this.botNames = [
            "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa",
            "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon",
            "Phi", "Chi", "Psi", "Omega", "Botzilla", "Sneky", "Longboi", "Tiny", "BigChonk", "Swift"
        ];

        // Initialize fullscreen canvas if in fullscreen mode
        if (document.body.classList.contains('fullscreen')) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        }
    }

    initGame() {
        this.score = 0;
        this.snake = [{
            x: Math.floor(this.worldWidth / 2 / this.boxSize) * this.boxSize,
            y: Math.floor(this.worldHeight / 2 / this.boxSize) * this.boxSize,
            username: this.username
        }];
        this.direction = { x: this.boxSize, y: 0 };
        this.spawnApples();
        this.initBots();
        this.updateScore();
        this.specialApple = null;
        this.isRunning = true;
        this.lastFrameTime = 0;
        this.gameSpeed = 250; // ms between updates
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.renderLoop) cancelAnimationFrame(this.renderLoop);
        
        // Separate update and render loops for better performance
        this.gameLoop = setInterval(() => {
            if (this.isRunning) {
                this.updateGame();
            }
        }, this.gameSpeed);
        
        this.startRenderLoop();
    }

    startRenderLoop() {
        const render = (currentTime) => {
            if (this.isRunning) {
                // Limit to 60 FPS for smooth performance
                if (currentTime - this.lastFrameTime >= 16.67) {
                    this.drawGame();
                    this.lastFrameTime = currentTime;
                }
                this.renderLoop = requestAnimationFrame(render);
            }
        };
        this.renderLoop = requestAnimationFrame(render);
    }

    // Enhanced pause/resume functionality
    pauseGame() {
        this.isRunning = false;
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.renderLoop) cancelAnimationFrame(this.renderLoop);
    }

    resumeGame() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop = setInterval(() => {
                if (this.isRunning) {
                    this.updateGame();
                }
            }, this.gameSpeed);
            this.startRenderLoop();
        }
    }

    spawnApples() {
        this.apples = [];
        for (let i = 0; i < this.appleCount; i++) {
            this.apples.push({
                x: Math.floor(Math.random() * (this.worldWidth / this.boxSize)) * this.boxSize,
                y: Math.floor(Math.random() * (this.worldHeight / this.boxSize)) * this.boxSize
            });
        }
    }

    getRandomBotName(usedNames) {
        let name;
        do {
            name = this.botNames[Math.floor(Math.random() * this.botNames.length)];
        } while (usedNames.has(name));
        usedNames.add(name);
        return name;
    }

    randomDirection() {
        const dirs = [
            { x: this.boxSize, y: 0 },
            { x: -this.boxSize, y: 0 },
            { x: 0, y: this.boxSize },
            { x: 0, y: -this.boxSize }
        ];
        return dirs[Math.floor(Math.random() * dirs.length)];
    }

    randomColor() {
        const colors = [
            'lime', 'blue', 'orange', 'purple', 'pink', 'red', 'yellow', 'cyan', 'white',
            'rainbow', 'fire', 'aqua', 'forest'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    randomPattern() {
        const patterns = [
            'solid', 'striped', 'dotted', 'gradient', 'outline', 'glow', 'checker'
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    initBots() {
        this.bots = [];
        this.botCount = 12;
        const usedNames = new Set([this.username]);
        for (let i = 0; i < this.botCount; i++) {
            let botLength = 3 + Math.floor(Math.random() * 30);
            let bot = {
                snake: [],
                direction: this.randomDirection(),
                color: this.randomColor(),
                pattern: this.randomPattern(),
                alive: true,
                username: this.getRandomBotName(usedNames)
            };
            let headX = Math.floor(Math.random() * (this.worldWidth / this.boxSize)) * this.boxSize;
            let headY = Math.floor(Math.random() * (this.worldHeight / this.boxSize)) * this.boxSize;
            for (let j = 0; j < botLength; j++) {
                bot.snake.push({
                    x: headX - j * bot.direction.x,
                    y: headY - j * bot.direction.y,
                    username: bot.username
                });
            }
            this.bots.push(bot);
        }
    }

    getCameraOffset() {
        let camX = this.snake[0].x - this.canvas.width / 2;
        let camY = this.snake[0].y - this.canvas.height / 2;
        camX = Math.max(0, Math.min(camX, this.worldWidth - this.canvas.width));
        camY = Math.max(0, Math.min(camY, this.worldHeight - this.canvas.height));
        return { camX, camY };
    }

    drawGame() {
        // Performance optimization: use requestAnimationFrame for smooth rendering
        const { camX, camY } = this.getCameraOffset();
        
        // Clear canvas with performance optimization
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state for consistent rendering
        this.ctx.save();

        // Draw apples with consistent styling
        this.ctx.shadowBlur = 0; // Reset shadow for apples
        this.apples.forEach(apple => {
            const appleX = apple.x - camX;
            const appleY = apple.y - camY;
            
            // Only draw if apple is visible on screen
            if (appleX >= -this.boxSize && appleX < this.canvas.width && 
                appleY >= -this.boxSize && appleY < this.canvas.height) {
                
                this.ctx.fillStyle = '#ff0044';
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = '#ff0044';
                this.ctx.fillRect(appleX, appleY, this.boxSize, this.boxSize);
                this.ctx.shadowBlur = 0; // Reset shadow immediately
            }
        });

        // Draw bots with improved visibility
        this.bots.forEach(bot => {
            if (!bot.alive) return;
            
            this.drawSnake(bot.snake, bot.color, bot.pattern, bot.username, camX, camY, false);
        });

        // Draw player snake with enhanced visibility
        this.drawSnake(this.snake, this.snakeColor, this.snakePattern, this.username, camX, camY, true);

        // Restore context state
        this.ctx.restore();

        // Draw side scoreboard
        this.drawSideScoreboard();
    }

    // Enhanced snake drawing method with better visibility and performance
    drawSnake(snake, color, pattern, username, camX, camY, isPlayer = false) {
        if (!snake || snake.length === 0) return;
        
        // Get color function for dynamic colors
        const getColor = (i) => {
            if (color === 'rainbow') {
                const colors = ['#ff0000', '#ff9900', '#ffee00', '#33ff00', '#00ffee', '#0066ff', '#cc00ff'];
                return colors[i % colors.length];
            } else if (color === 'fire') {
                const colors = ['#ff6600', '#ff3300', '#ffcc00', '#ff9900'];
                return colors[i % colors.length];
            } else if (color === 'aqua') {
                const colors = ['#00ffff', '#00bfff', '#1e90ff', '#00fa9a'];
                return colors[i % colors.length];
            } else if (color === 'forest') {
                const colors = ['#228B22', '#006400', '#32CD32', '#556B2F'];
                return colors[i % colors.length];
            } else {
                return color;
            }
        };

        // Set shadow for glow effect
        const shouldGlow = pattern === 'glow' || isPlayer;
        this.ctx.shadowBlur = shouldGlow ? 15 : 5;
        this.ctx.shadowColor = color === 'rainbow' ? '#ffffff' : color;

        snake.forEach((part, idx) => {
            const partX = part.x - camX;
            const partY = part.y - camY;
            
            // Only draw if part is visible on screen (performance optimization)
            if (partX >= -this.boxSize && partX < this.canvas.width && 
                partY >= -this.boxSize && partY < this.canvas.height) {
                
                const segmentColor = getColor(idx);
                
                // Always draw base solid color first to ensure visibility
                this.ctx.fillStyle = segmentColor;
                this.ctx.fillRect(partX, partY, this.boxSize, this.boxSize);
                
                // Apply pattern overlay
                this.applySnakePattern(partX, partY, segmentColor, pattern, idx, part);
                
                // Draw username above head with better visibility
                if (idx === 0) {
                    this.drawUsernameLabel(partX, partY, username, isPlayer);
                }
            }
        });
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }

    // Apply snake pattern with guaranteed visibility
    applySnakePattern(x, y, baseColor, pattern, segmentIndex, part) {
        switch (pattern) {
            case 'striped':
                if (segmentIndex % 2 !== 0) {
                    this.ctx.fillStyle = '#444444'; // Darker but visible stripe
                    this.ctx.fillRect(x, y, this.boxSize, this.boxSize);
                }
                break;
                
            case 'dotted':
                // Draw solid base, then dot overlay
                this.ctx.beginPath();
                this.ctx.arc(x + this.boxSize / 2, y + this.boxSize / 2, this.boxSize / 3, 0, 2 * Math.PI);
                this.ctx.fillStyle = segmentIndex % 2 === 0 ? '#ffffff' : baseColor;
                this.ctx.fill();
                break;
                
            case 'gradient':
                // Enhanced gradient with better visibility
                const grad = this.ctx.createLinearGradient(x, y, x + this.boxSize, y + this.boxSize);
                grad.addColorStop(0, baseColor);
                grad.addColorStop(1, '#ffffff');
                this.ctx.fillStyle = grad;
                this.ctx.globalAlpha = 0.8;
                this.ctx.fillRect(x, y, this.boxSize, this.boxSize);
                this.ctx.globalAlpha = 1.0;
                break;
                
            case 'outline':
                // Enhanced outline with visible fill
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 1, y + 1, this.boxSize - 2, this.boxSize - 2);
                break;
                
            case 'checker':
                const isChecked = (segmentIndex + Math.floor(part.x / this.boxSize) + Math.floor(part.y / this.boxSize)) % 2 === 0;
                if (!isChecked) {
                    this.ctx.fillStyle = '#cccccc'; // Light gray for visibility
                    this.ctx.fillRect(x, y, this.boxSize, this.boxSize);
                }
                break;
                
            case 'glow':
                // Glow is handled by shadow, just ensure solid base
                break;
                
            case 'solid':
            default:
                // Already drawn solid base
                break;
        }
    }

    // Enhanced username label drawing
    drawUsernameLabel(x, y, username, isPlayer) {
        this.ctx.save();
        
        // Enhanced font styling
        this.ctx.font = isPlayer ? "bold 14px Space Mono" : "bold 12px Space Mono";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
        
        // Background for better readability
        const textWidth = this.ctx.measureText(username).width;
        const bgPadding = 4;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(
            x + this.boxSize/2 - textWidth/2 - bgPadding, 
            y - 20, 
            textWidth + bgPadding * 2, 
            16
        );
        
        // Text with glow effect
        this.ctx.shadowBlur = 3;
        this.ctx.shadowColor = isPlayer ? '#00ff88' : '#ffffff';
        this.ctx.fillStyle = isPlayer ? '#00ff88' : '#ffffff';
        this.ctx.fillText(username, x + this.boxSize / 2, y - 6);
        
        this.ctx.restore();
    }

    drawSideScoreboard() {
        // Gather all alive snakes (player + bots)
        let snakes = [
            { username: this.username, length: this.snake.length, color: this.snakeColor }
        ];
        this.bots.forEach(bot => {
            if (bot.alive) {
                snakes.push({ username: bot.username, length: bot.snake.length, color: bot.color });
            }
        });
        // Sort by length descending
        snakes.sort((a, b) => b.length - a.length);

        // Responsive scoreboard positioning
        const ctx = this.ctx;
        const boardWidth = Math.min(160, this.canvas.width * 0.25);
        const maxEntries = Math.min(8, Math.floor((this.canvas.height - 100) / 22));
        const boardHeight = 28 + 22 * Math.min(maxEntries, snakes.length);
        
        // Position scoreboard with padding from edges
        const x = Math.max(this.canvas.width - boardWidth - 10, 10);
        const y = 20;

        // Only draw if there's enough space
        if (this.canvas.width >= 300 && this.canvas.height >= 200) {
            ctx.save();
            
            // Enhanced background with border
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = "rgba(15, 15, 30, 0.95)";
            ctx.fillRect(x, y, boardWidth, boardHeight);
            ctx.strokeStyle = "#00ff88";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, boardWidth, boardHeight);
            ctx.globalAlpha = 1.0;
            
            // Title with better scaling
            const titleSize = Math.min(15, boardWidth / 10);
            ctx.font = `bold ${titleSize}px Space Mono`;
            ctx.fillStyle = "#00ff88";
            ctx.textAlign = "center";
            ctx.fillText("Leaderboard", x + boardWidth / 2, y + 18);
            
            // Entries with better formatting
            const entrySize = Math.min(12, boardWidth / 12);
            ctx.font = `${entrySize}px Space Mono`;
            ctx.textAlign = "left";
            
            snakes.slice(0, maxEntries).forEach((s, i) => {
                const entryY = y + 38 + i * 22;
                const rank = i + 1;
                
                // Rank with medal emojis for top 3
                ctx.fillStyle = "#ffffff";
                let rankText = `${rank}.`;
                if (rank === 1) rankText = "🥇";
                else if (rank === 2) rankText = "🥈";
                else if (rank === 3) rankText = "🥉";
                
                ctx.fillText(rankText, x + 8, entryY);
                
                // Username (truncated if too long)
                const maxNameLength = Math.floor(boardWidth / 8);
                const displayName = s.username.length > maxNameLength ? 
                    s.username.substring(0, maxNameLength - 1) + "…" : s.username;
                
                ctx.fillStyle = s.color || "#ffffff";
                ctx.fillText(displayName, x + 25, entryY);
                
                // Score
                ctx.fillStyle = "#00ff88";
                ctx.textAlign = "right";
                ctx.fillText(`(${s.length})`, x + boardWidth - 8, entryY);
                ctx.textAlign = "left";
            });
            
            ctx.restore();
        }
    }

    randomDirectionAvoidingSelf(snake) {
        // Returns a direction that does not collide with the snake's own body
        const dirs = [
            { x: this.boxSize, y: 0 },
            { x: -this.boxSize, y: 0 },
            { x: 0, y: this.boxSize },
            { x: 0, y: -this.boxSize }
        ];
        const head = snake[0];
        // Filter out directions that would collide with own body
        return dirs.filter(dir => {
            const nx = head.x + dir.x;
            const ny = head.y + dir.y;
            return !snake.some(part => part.x === nx && part.y === ny);
        });
    }

    updateGame() {
        // Move bots
        this.botFrame++;
        if (this.botFrame >= this.botMoveDelay) {
            this.bots.forEach(bot => {
                if (!bot.alive) return;
                // Pick a direction that doesn't collide with itself
                let possibleDirs = this.randomDirectionAvoidingSelf(bot.snake);
                if (possibleDirs.length === 0) {
                    // If trapped, pick any direction (will die soon)
                    possibleDirs = [
                        { x: this.boxSize, y: 0 },
                        { x: -this.boxSize, y: 0 },
                        { x: 0, y: this.boxSize },
                        { x: 0, y: -this.boxSize }
                    ];
                }
                // Randomly change direction more frequently
                if (Math.random() < 0.15) bot.direction = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                const head = {
                    x: bot.snake[0].x + bot.direction.x,
                    y: bot.snake[0].y + bot.direction.y
                };
                // Stay in bounds
                if (head.x < 0 || head.y < 0 || head.x >= this.worldWidth || head.y >= this.worldHeight) {
                    bot.direction = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                    return;
                }
                // Prevent moving into own body
                // if (bot.snake.some(part => part.x === head.x && part.y === head.y)) {
                //     bot.direction = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                //     return;
                // }
                // Check apple collision for bot
                let botAteApple = false;
                for (let i = 0; i < this.apples.length; i++) {
                    if (head.x === this.apples[i].x && head.y === this.apples[i].y) {
                        // Bot eats apple: grow by 1, respawn apple
                        bot.snake.unshift({ x: head.x, y: head.y, username: bot.username });
                        this.apples.splice(i, 1);
                        this.apples.push({
                            x: Math.floor(Math.random() * (this.worldWidth / this.boxSize)) * this.boxSize,
                            y: Math.floor(Math.random() * (this.worldHeight / this.boxSize)) * this.boxSize
                        });
                        botAteApple = true;
                        break;
                    }
                }
                if (!botAteApple) {
                    // Move bot normally
                    bot.snake.unshift({ x: head.x, y: head.y, username: bot.username });
                    bot.snake.pop();
                }
            });
            this.botFrame = 0;
        }

        // Universal snake-vs-snake collision (player and bots)
        // Gather all alive snakes (before collision resolution)
        const prevAliveBots = this.bots.filter(bot => bot.alive).length;

        // Gather all alive snakes
        const allSnakes = [
            { snake: this.snake, alive: true, isPlayer: true, ref: this }
        ];
        this.bots.forEach(bot => {
            if (bot.alive) allSnakes.push({ snake: bot.snake, alive: true, isPlayer: false, ref: bot });
        });

        // Check all head-to-body collisions (excluding self)
        for (let i = 0; i < allSnakes.length; i++) {
            const attacker = allSnakes[i];
            if (!attacker.alive) continue;
            const attackerHead = attacker.snake[0];
            for (let j = 0; j < allSnakes.length; j++) {
                if (i === j) continue;
                const defender = allSnakes[j];
                if (!defender.alive) continue;
                // Check if attacker's head collides with defender's body (not head)
                for (let k = 1; k < defender.snake.length; k++) {
                    if (attackerHead.x === defender.snake[k].x && attackerHead.y === defender.snake[k].y) {
                        // Collision detected
                        if (attacker.snake.length >= defender.snake.length) {
                            // Attacker eats defender
                            if (defender.isPlayer) {
                                defender.ref.endGame();
                            } else {
                                defender.ref.alive = false;
                            }
                            // Grow attacker
                            for (let m = 0; m < defender.snake.length; m++) {
                                attacker.snake.push({});
                            }
                            if (attacker.isPlayer) {
                                this.score += defender.snake.length;
                                this.updateScore();
                            }
                        } else {
                            // Defender eats attacker
                            if (attacker.isPlayer) {
                                attacker.ref.endGame();
                            } else {
                                attacker.ref.alive = false;
                            }
                            // Grow defender
                            for (let m = 0; m < attacker.snake.length; m++) {
                                defender.snake.push({});
                            }
                            if (defender.isPlayer) {
                                this.score += attacker.snake.length;
                                this.updateScore();
                            }
                        }
                        // Only one collision per update per snake
                        break;
                    }
                }
            }
        }

        // Bots' heads collision with player body is now handled above

        // After collision handling, respawn bots if any died
        const aliveBots = this.bots.filter(bot => bot.alive).length;
        if (aliveBots < this.botCount) {
            const usedNames = new Set([this.username]);
            this.bots.forEach(bot => { if (bot.alive) usedNames.add(bot.username); });
            for (let i = aliveBots; i < this.botCount; i++) {
                let botLength = 3 + Math.floor(Math.random() * 30);
                let bot = {
                    snake: [],
                    direction: this.randomDirection(),
                    color: this.randomColor(),
                    alive: true,
                    username: this.getRandomBotName(usedNames)
                };
                let headX = Math.floor(Math.random() * (this.worldWidth / this.boxSize)) * this.boxSize;
                let headY = Math.floor(Math.random() * (this.worldHeight / this.boxSize)) * this.boxSize;
                for (let j = 0; j < botLength; j++) {
                    bot.snake.push({
                        x: headX - j * bot.direction.x,
                        y: headY - j * bot.direction.y,
                        username: bot.username
                    });
                }
                this.bots.push(bot);
            }
        }

        // Player move
        this.playerFrame++;
        if (this.playerFrame < this.playerMoveDelay) {
            this.drawGame();
            return;
        }
        this.playerFrame = 0;

        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y, username: this.username };
        // Check world bounds
        if (head.x < 0 || head.y < 0 || head.x >= this.worldWidth || head.y >= this.worldHeight) {
            this.endGame();
            return;
        }

        // Prevent moving into own body
        // if (this.snake.some(part => part.x === head.x && part.y === head.y)) {
        //     this.endGame();
        //     return;
        // }

        // Check apple collision
        let ateApple = false;
        for (let i = 0; i < this.apples.length; i++) {
            if (head.x === this.apples[i].x && head.y === this.apples[i].y) {
                this.score++;
                this.updateScore();
                this.apples.splice(i, 1);
                // Spawn a new apple somewhere else
                this.apples.push({
                    x: Math.floor(Math.random() * (this.worldWidth / this.boxSize)) * this.boxSize,
                    y: Math.floor(Math.random() * (this.worldHeight / this.boxSize)) * this.boxSize
                });
                ateApple = true;
                break;
            }
        }

        this.snake.unshift(head);
        if (!ateApple) {
            this.snake.pop();
        }
        this.drawGame();
    }

    handleResize() {
        // Handle fullscreen canvas resizing
        if (document.body.classList.contains('fullscreen')) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            // Update canvas style to ensure it covers the full viewport
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            
            // Redraw the game with new dimensions
            this.drawGame();
        }
    }
}

