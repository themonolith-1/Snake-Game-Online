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
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.updateGame(), 250);
        this.drawGame();
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
        const { camX, camY } = this.getCameraOffset();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw apples
        this.apples.forEach(apple => {
            this.ctx.fillStyle = 'red';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'red';
            this.ctx.fillRect(apple.x - camX, apple.y - camY, this.boxSize, this.boxSize);
        });

        // Draw bots
        this.bots.forEach(bot => {
            if (!bot.alive) return;
            let getColor = (i) => {
                if (bot.color === 'rainbow') {
                    const colors = ['#ff0000', '#ff9900', '#ffee00', '#33ff00', '#00ffee', '#0066ff', '#cc00ff'];
                    return colors[i % colors.length];
                } else if (bot.color === 'fire') {
                    const colors = ['#ff6600', '#ff3300', '#ffcc00', '#ff9900'];
                    return colors[i % colors.length];
                } else if (bot.color === 'aqua') {
                    const colors = ['#00ffff', '#00bfff', '#1e90ff', '#00fa9a'];
                    return colors[i % colors.length];
                } else if (bot.color === 'forest') {
                    const colors = ['#228B22', '#006400', '#32CD32', '#556B2F'];
                    return colors[i % colors.length];
                } else {
                    return bot.color;
                }
            };
            this.ctx.shadowBlur = (bot.pattern === 'glow') ? 25 : 10;
            this.ctx.shadowColor = bot.color === 'rainbow' ? '#fff' : bot.color;
            bot.snake.forEach((part, idx) => {
                let color = getColor(idx);
                // Always draw a visible base for all patterns
                if (bot.pattern === 'solid') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                } else if (bot.pattern === 'striped') {
                    this.ctx.fillStyle = (idx % 2 === 0) ? color : '#222';
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                } else if (bot.pattern === 'dotted') {
                    this.ctx.beginPath();
                    this.ctx.arc(part.x - camX + this.boxSize / 2, part.y - camY + this.boxSize / 2, this.boxSize / 2, 0, 2 * Math.PI);
                    this.ctx.fillStyle = (idx % 2 === 0) ? color : '#fff';
                    this.ctx.fill();
                } else if (bot.pattern === 'gradient') {
                    // Draw a solid base first for visibility
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                    let grad = this.ctx.createLinearGradient(part.x - camX, part.y - camY, part.x - camX + this.boxSize, part.y - camY + this.boxSize);
                    grad.addColorStop(0, color);
                    grad.addColorStop(1, "#fff");
                    this.ctx.fillStyle = grad;
                    this.ctx.globalAlpha = 0.7;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                    this.ctx.globalAlpha = 1.0;
                } else if (bot.pattern === 'outline') {
                    // Draw a solid base for visibility
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                    this.ctx.strokeStyle = "#fff";
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(part.x - camX + 2, part.y - camY + 2, this.boxSize - 4, this.boxSize - 4);
                } else if (bot.pattern === 'glow') {
                    // Draw a solid base for visibility
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                } else if (bot.pattern === 'checker') {
                    this.ctx.fillStyle = ((idx + Math.floor(part.x / this.boxSize) + Math.floor(part.y / this.boxSize)) % 2 === 0) ? color : '#fff';
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                } else {
                    // Fallback: always draw a solid color
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                }
                // Draw username above head
                if (idx === 0) {
                    this.ctx.font = "bold 13px Arial";
                    this.ctx.fillStyle = "#fff";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText(bot.username, part.x - camX + this.boxSize / 2, part.y - camY - 4);
                }
            });
        });

        // Draw player snake (ensure fillStyle is set for each part)
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.snakeColor;
        this.snake.forEach((part, i) => {
            // Always draw a visible base for all patterns
            if (this.snakePattern === 'solid') {
                this.ctx.fillStyle = this.snakeColor;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'striped') {
                this.ctx.fillStyle = (i % 2 === 0) ? this.snakeColor : '#222';
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'dotted') {
                this.ctx.beginPath();
                this.ctx.arc(part.x - camX + this.boxSize / 2, part.y - camY + this.boxSize / 2, this.boxSize / 2, 0, 2 * Math.PI);
                this.ctx.fillStyle = (i % 2 === 0) ? this.snakeColor : '#fff';
                this.ctx.fill();
            } else if (this.snakePattern === 'gradient') {
                // Draw a solid base first for visibility
                this.ctx.fillStyle = this.snakeColor;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                let grad = this.ctx.createLinearGradient(part.x - camX, part.y - camY, part.x - camX + this.boxSize, part.y - camY + this.boxSize);
                grad.addColorStop(0, this.snakeColor);
                grad.addColorStop(1, "#fff");
                this.ctx.fillStyle = grad;
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                this.ctx.globalAlpha = 1.0;
            } else if (this.snakePattern === 'outline') {
                // Draw a solid base for visibility
                this.ctx.fillStyle = this.snakeColor;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
                this.ctx.strokeStyle = "#fff";
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(part.x - camX + 2, part.y - camY + 2, this.boxSize - 4, this.boxSize - 4);
            } else if (this.snakePattern === 'glow') {
                // Draw a solid base for visibility
                this.ctx.fillStyle = this.snakeColor;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'checker') {
                this.ctx.fillStyle = ((i + Math.floor(part.x / this.boxSize) + Math.floor(part.y / this.boxSize)) % 2 === 0) ? this.snakeColor : '#fff';
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
            } else {
                // Fallback: always draw a solid color
                this.ctx.fillStyle = this.snakeColor;
                this.ctx.fillRect(part.x - camX, part.y - camY, this.boxSize, this.boxSize);
            }
            // Draw username above head
            if (i === 0) {
                this.ctx.font = "bold 13px Arial";
                this.ctx.fillStyle = "#fff";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.username, part.x - camX + this.boxSize / 2, part.y - camY - 4);
            }
        });
        this.ctx.shadowBlur = 0;

        // Draw side scoreboard
        this.drawSideScoreboard();
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

        // Draw scoreboard on right side
        const ctx = this.ctx;
        const x = this.canvas.width - 170;
        const y = 20;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, 150, 28 + 22 * Math.min(10, snakes.length));
        ctx.globalAlpha = 1.0;
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "#39ff14";
        ctx.fillText("Leaderboard", x + 75, y + 18);
        ctx.font = "13px Arial";
        snakes.slice(0, 10).forEach((s, i) => {
            ctx.fillStyle = s.color;
            ctx.fillText(`${i + 1}. ${s.username} (${s.length})`, x + 75, y + 38 + i * 22);
        });
        ctx.restore();
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
}

