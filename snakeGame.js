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
        this.gameLoop = setInterval(() => this.updateGame(), 100);
        this.scheduleYellowApple();
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

        // Draw the snake
        // Handle color variations
        let getColor = (i) => {
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

        this.ctx.shadowBlur = (this.snakePattern === 'glow') ? 25 : 10;
        this.ctx.shadowColor = this.snakeColor === 'rainbow' ? '#fff' : this.snakeColor;

        for (let i = 0; i < this.snake.length; i++) {
            let part = this.snake[i];
            let color = getColor(i);

            if (this.snakePattern === 'solid') {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'striped') {
                this.ctx.fillStyle = (i % 2 === 0) ? color : '#222';
                this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'dotted') {
                this.ctx.beginPath();
                this.ctx.arc(part.x + this.boxSize / 2, part.y + this.boxSize / 2, this.boxSize / 2, 0, 2 * Math.PI);
                this.ctx.fillStyle = (i % 2 === 0) ? color : '#fff';
                this.ctx.fill();
            } else if (this.snakePattern === 'gradient') {
                let grad = this.ctx.createLinearGradient(part.x, part.y, part.x + this.boxSize, part.y + this.boxSize);
                grad.addColorStop(0, color);
                grad.addColorStop(1, "#fff");
                this.ctx.fillStyle = grad;
                this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'outline') {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(part.x + 2, part.y + 2, this.boxSize - 4, this.boxSize - 4);
            } else if (this.snakePattern === 'glow') {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);
            } else if (this.snakePattern === 'checker') {
                this.ctx.fillStyle = ((i + Math.floor(part.x / this.boxSize) + Math.floor(part.y / this.boxSize)) % 2 === 0) ? color : '#fff';
                this.ctx.fillRect(part.x, part.y, this.boxSize, this.boxSize);
            }
        }
        this.ctx.shadowBlur = 0;

        // Draw the apples
        this.ctx.fillStyle = 'red';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = 'red';
        this.ctx.fillRect(this.apple.x, this.apple.y, this.boxSize, this.boxSize);
        
        // Draw special apple (cyan)
        if (this.specialApple) {
            this.ctx.fillStyle = 'cyan';
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'cyan';
            this.ctx.fillRect(this.specialApple.x, this.specialApple.y, this.boxSize, this.boxSize);
        }

        // Draw yellow apple (5 points)
        if (this.yellowApple) {
            this.ctx.fillStyle = 'yellow';
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'yellow';
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

    // Function to display the game over popup
    endGame() {
        clearInterval(this.gameLoop);
        if (this.yellowAppleTimer) clearTimeout(this.yellowAppleTimer);
        if (this._specialAppleTimeout) clearTimeout(this._specialAppleTimeout);
        if (this._yellowAppleTimeout) clearTimeout(this._yellowAppleTimeout);
        // Submit score to PHP
        fetch('submit_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, score: this.score })
        }).then(() => {
            if (typeof showGameOver === 'function') {
                showGameOver(this.score);
            }
        });
    }

    // Function to reset the game
    resetGame() {
        this.initGame();
        this.gameLoop = setInterval(() => this.updateGame(), 100);
        if (this._specialAppleTimeout) clearTimeout(this._specialAppleTimeout);
        if (this._yellowAppleTimeout) clearTimeout(this._yellowAppleTimeout);
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
