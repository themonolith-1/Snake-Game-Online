// Modular Snake Game for PHP integration

let username = typeof USERNAME !== 'undefined' ? USERNAME : 'Guest';

class SnakeGame {
    constructor(canvasId, scoreId, eatAppleSoundId, username, snakeColor = 'lime', snakePattern = 'solid') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.defaultBoxSize = 20;
        this.boxSize = this.defaultBoxSize;
        this.defaultWidth = this.canvas.width;
        this.defaultHeight = this.canvas.height;
        this.score = 0;
        this.snake = [{ x: 200, y: 200 }];
        this.direction = { x: this.boxSize, y: 0 };
        this.apple = { x: 0, y: 0 };
        this.specialApple = null;
        this.yellowApple = null;
        this.gameLoop = null;
        this.username = username;
        this.scoreId = scoreId;
        this.eatAppleSound = document.getElementById(eatAppleSoundId);
        this.expandThreshold = 10; // Expand every 10 points
        this.expansionStep = 100; // Pixels to expand per threshold
        this.maxWidth = 800;
        this.maxHeight = 800;
        this.yellowAppleTimer = null;
        this.lastExpansionScore = 0; // Track last expansion
        this.snakeColor = snakeColor;
        this.snakePattern = snakePattern;
    }

    // Function to start the game
    startGame() {
        this.initGame();
        this.isRunning = true;
        this.gameSpeed = 100;
        this.gameLoop = setInterval(() => {
            if (this.isRunning) {
                this.updateGame();
            }
        }, this.gameSpeed);
        this.scheduleYellowApple();
    }

    // Enhanced pause/resume functionality
    pauseGame() {
        this.isRunning = false;
    }

    resumeGame() {
        this.isRunning = true;
    }

    // Function to initialize the game
    initGame() {
        this.score = 0;
        this.snake = [{ x: 200, y: 200 }];
        this.direction = { x: this.boxSize, y: 0 };
        this.placeApple();
        this.updateScore();
        this.specialApple = null;
        this.yellowApple = null;
        this.resetCanvas();
        setTimeout(() => this.spawnSpecialApple(), 5000);
        this.scheduleYellowApple();
        this.lastExpansionScore = 0; // Reset expansion tracker
    }

    resetCanvas() {
        this.canvas.width = this.defaultWidth;
        this.canvas.height = this.defaultHeight;
        this.boxSize = this.defaultBoxSize;
    }

    // Function to expand the canvas size
    expandCanvas() {
        let newWidth = Math.min(this.canvas.width + this.expansionStep, this.maxWidth);
        let newHeight = Math.min(this.canvas.height + this.expansionStep, this.maxHeight);
        if (newWidth > this.canvas.width || newHeight > this.canvas.height) {
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
        }
    }

    // Function to check for apple collision
    checkAppleCollision() {
        if (this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y) {
            // Play sound when apple is eaten
            this.eatAppleSound.currentTime = 0; // Rewind to the start
            this.eatAppleSound.play();

            // Increase the score and spawn a new apple
            this.score++;
            this.placeApple();
        }
    }

    // Function to place the regular apple randomly on the grid
    placeApple() {
        // Ensure apple spawns within visible area (canvas size)
        const maxX = Math.floor(this.canvas.width / this.boxSize);
        const maxY = Math.floor(this.canvas.height / this.boxSize);
        this.apple.x = Math.floor(Math.random() * maxX) * this.boxSize;
        this.apple.y = Math.floor(Math.random() * maxY) * this.boxSize;
    }

    // Function to spawn a special apple at random location
    spawnSpecialApple() {
        // Ensure special apple spawns within visible area
        const maxX = Math.floor(this.canvas.width / this.boxSize);
        const maxY = Math.floor(this.canvas.height / this.boxSize);
        this.specialApple = {
            x: Math.floor(Math.random() * maxX) * this.boxSize,
            y: Math.floor(Math.random() * maxY) * this.boxSize,
            timer: 10000 // Special apple will last for 10 seconds
        };

        // Remove the special apple after its timer expires (always 10s)
        if (this._specialAppleTimeout) clearTimeout(this._specialAppleTimeout);
        this._specialAppleTimeout = setTimeout(() => {
            this.specialApple = null;
            this._specialAppleTimeout = null;
            setTimeout(() => this.spawnSpecialApple(), 5000); // Reschedule the next special apple
        }, this.specialApple.timer);
    }

    // Function to schedule the yellow apple appearance
    scheduleYellowApple() {
        if (this.yellowAppleTimer) clearTimeout(this.yellowAppleTimer);
        this.yellowAppleTimer = setTimeout(() => this.spawnYellowApple(), 7000 + Math.random() * 5000);
    }

    // Function to spawn a yellow apple
    spawnYellowApple() {
        // Ensure yellow apple spawns within visible area
        const maxX = Math.floor(this.canvas.width / this.boxSize);
        const maxY = Math.floor(this.canvas.height / this.boxSize);
        this.yellowApple = {
            x: Math.floor(Math.random() * maxX) * this.boxSize,
            y: Math.floor(Math.random() * maxY) * this.boxSize,
            timer: 5000 // Yellow apple lasts 5 seconds
        };

        // Remove the yellow apple after its timer expires
        if (this._yellowAppleTimeout) clearTimeout(this._yellowAppleTimeout);
        this._yellowAppleTimeout = setTimeout(() => {
            this.yellowApple = null;
            this._yellowAppleTimeout = null;
            this.scheduleYellowApple();
        }, this.yellowApple.timer);
    }

    // Function to draw the game elements
    drawGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context state for consistent rendering
        this.ctx.save();

        // Draw the snake with enhanced visibility
        this.drawSnakeSegments();

        // Restore context state
        this.ctx.restore();

        // Draw enhanced apples
        this.drawApples();
    }

    // Enhanced snake drawing method
    drawSnakeSegments() {
        // Handle color variations
        const getColor = (i) => {
            if (this.snakeColor === 'rainbow') {
                const colors = ['#ff0000', '#ff9900', '#ffee00', '#33ff00', '#00ffee', '#0066ff', '#cc00ff'];
                return colors[i % colors.length];
            } else if (this.snakeColor === 'fire') {
                const colors = ['#ff6600', '#ff3300', '#ffcc00', '#ff9900'];
                return colors[i % colors.length];
            } else if (this.snakeColor === 'aqua') {
                const colors = ['#00ffff', '#00bfff', '#1e90ff', '#00fa9a'];
                return colors[i % colors.length];
            } else if (this.snakeColor === 'forest') {
                const colors = ['#228B22', '#006400', '#32CD32', '#556B2F'];
                return colors[i % colors.length];
            } else {
                return this.snakeColor;
            }
        };

        // Set shadow for glow effect
        this.ctx.shadowBlur = (this.snakePattern === 'glow') ? 20 : 8;
        this.ctx.shadowColor = this.snakeColor === 'rainbow' ? '#ffffff' : this.snakeColor;

        for (let i = 0; i < this.snake.length; i++) {
            const part = this.snake[i];
            const color = getColor(i);

            // Always draw solid base for visibility
            this.ctx.fillStyle = color;
            this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);

            // Apply pattern overlay
            this.applyPattern(part.x, part.y, color, i, part);
        }

        // Reset shadow
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }

    // Apply pattern with guaranteed visibility
    applyPattern(x, y, baseColor, segmentIndex, part) {
        switch (this.snakePattern) {
            case 'striped':
                if (segmentIndex % 2 !== 0) {
                    this.ctx.fillStyle = '#444444'; // Visible darker stripe
                    this.ctx.fillRect(x, y, this.boxSize, this.boxSize);
                }
                break;

            case 'dotted':
                this.ctx.beginPath();
                this.ctx.arc(x + this.boxSize / 2, y + this.boxSize / 2, this.boxSize / 3, 0, 2 * Math.PI);
                this.ctx.fillStyle = segmentIndex % 2 === 0 ? '#ffffff' : baseColor;
                this.ctx.fill();
                break;

            case 'gradient':
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
                    this.ctx.fillStyle = '#cccccc';
                    this.ctx.fillRect(x, y, this.boxSize, this.boxSize);
                }
                break;

            case 'glow':
            case 'solid':
            default:
                // Already drawn solid base
                break;
        }
    }

    // Enhanced apple drawing
    drawApples() {
        // Draw regular apple
        this.ctx.fillStyle = '#ff0044';
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = '#ff0044';
        this.ctx.fillRect(this.apple.x, this.apple.y, this.boxSize, this.boxSize);

        // Draw special apple (blue)
        if (this.specialApple) {
            this.ctx.fillStyle = '#0088ff';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#0088ff';
            this.ctx.fillRect(this.specialApple.x, this.specialApple.y, this.boxSize, this.boxSize);
        }

        // Draw yellow apple (5 points)
        if (this.yellowApple) {
            this.ctx.fillStyle = '#ffdd00';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#ffdd00';
            this.ctx.fillRect(this.yellowApple.x, this.yellowApple.y, this.boxSize, this.boxSize);
        }

        // Reset shadowBlur after drawing
        this.ctx.shadowBlur = 0;
    }

    // Function to update the snake's position and handle game logic
    updateGame() {
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

        // Check for collision with walls or itself
        if (head.x < 0 || head.y < 0 || head.x >= this.canvas.width || head.y >= this.canvas.height ||
            this.snake.some(part => part.x === head.x && part.y === head.y)) {
            this.endGame();
            return;
        }

        // Check for collision with regular apple
        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.score++;
            this.updateScore();
            this.placeApple();
            this.snake.push({});
            this.checkExpansion();
        } 
        // Check for collision with special apple (cyan)
        else if (this.specialApple && head.x === this.specialApple.x && head.y === this.specialApple.y) {
            this.score += 2; // Double points
            this.updateScore();
            this.specialApple = null; // Remove the special apple
            this.snake.push({}, {}); // Grow the snake by two blocks
            this.checkExpansion();
        } 
        // Check for collision with yellow apple (5 points)
        else if (this.yellowApple && head.x === this.yellowApple.x && head.y === this.yellowApple.y) {
            this.score += 5; // Five points for yellow apple
            this.updateScore();
            this.yellowApple = null; // Remove the yellow apple
            this.snake.push({}, {}, {}, {}, {}); // Grow the snake by five blocks
            this.checkExpansion();
            this.scheduleYellowApple();
        } 
        else {
            this.snake.pop(); // Remove the last part if no apple is eaten
        }

        this.snake.unshift(head); // Add new head to the front of the snake
        this.drawGame();
        this.checkAppleCollision();
    }

    // Function to check and handle canvas expansion
    checkExpansion() {
        // Expand for every new threshold crossed
        while (this.score - this.lastExpansionScore >= this.expandThreshold) {
            this.expandCanvas();
            this.lastExpansionScore += this.expandThreshold;
        }
    }

    // Enhanced endGame function with proper cleanup
    endGame() {
        this.isRunning = false;
        
        // Clear all intervals and timeouts
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.renderLoop) cancelAnimationFrame(this.renderLoop);
        if (this.yellowAppleTimer) clearTimeout(this.yellowAppleTimer);
        if (this._specialAppleTimeout) clearTimeout(this._specialAppleTimeout);
        if (this._yellowAppleTimeout) clearTimeout(this._yellowAppleTimeout);
        
        // Submit score to PHP with error handling
        fetch('submit_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, score: this.score })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            if (typeof showGameOver === 'function') {
                showGameOver(this.score);
            }
        })
        .catch(error => {
            console.warn('Failed to submit score:', error);
            // Still show game over even if score submission fails
            if (typeof showGameOver === 'function') {
                showGameOver(this.score);
            }
        });
    }

    // Enhanced resetGame function
    resetGame() {
        this.isRunning = false;
        
        // Clear all timers
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.renderLoop) cancelAnimationFrame(this.renderLoop);
        if (this.yellowAppleTimer) clearTimeout(this.yellowAppleTimer);
        if (this._specialAppleTimeout) clearTimeout(this._specialAppleTimeout);
        if (this._yellowAppleTimeout) clearTimeout(this._yellowAppleTimeout);
        
        // Reset and restart game
        this.initGame();
        this.startGame();
    }

    // Function to update the score on screen
    updateScore() {
        document.getElementById(this.scoreId).textContent = `Score: ${this.score}`;
    }

    // Event listener for keyboard input to control the snake
    // Prevent arrow keys from scrolling the page
    addKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault(); // Disable scrolling
            }

            // Control the snake's direction
            switch (event.key) {
                case 'ArrowUp':
                    if (this.direction.y === 0) this.direction = { x: 0, y: -this.boxSize };
                    break;
                case 'ArrowDown':
                    if (this.direction.y === 0) this.direction = { x: 0, y: this.boxSize };
                    break;
                case 'ArrowLeft':
                    if (this.direction.x === 0) this.direction = { x: -this.boxSize, y: 0 };
                    break;
                case 'ArrowRight':
                    if (this.direction.x === 0) this.direction = { x: this.boxSize, y: 0 };
                    break;
            }
        });
    }
}
