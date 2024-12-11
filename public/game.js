class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameOver = false;
        this.won = false;
        this.touchStartX = null;
        this.touchStartY = null;
        this.isDragging = false;
        
        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        // Add initial tiles
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    setupEventListeners() {
        const gameContainer = document.querySelector('.game-container');

        // Mouse events
        gameContainer.addEventListener('mousedown', (e) => {
            this.startDrag(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mouseup', () => {
            this.endDrag();
        });

        // Touch events
        gameContainer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.startDrag(touch.clientX, touch.clientY);
        });

        gameContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging) {
                const touch = e.touches[0];
                this.handleDrag(touch.clientX, touch.clientY);
            }
        });

        gameContainer.addEventListener('touchend', () => {
            this.endDrag();
        });

        // New Game button
        document.querySelector('.new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Retry button
        document.querySelector('.retry-button').addEventListener('click', () => {
            this.resetGame();
        });
    }

    startDrag(x, y) {
        if (!this.gameOver) {
            this.isDragging = true;
            this.touchStartX = x;
            this.touchStartY = y;
        }
    }

    handleDrag(x, y) {
        if (!this.isDragging) return;

        const deltaX = x - this.touchStartX;
        const deltaY = y - this.touchStartY;
        const minSwipeDistance = 50; // Minimum distance for a swipe to register

        if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
            // Determine swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    this.handleMove('right');
                } else {
                    this.handleMove('left');
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    this.handleMove('down');
                } else {
                    this.handleMove('up');
                }
            }
            this.isDragging = false;
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    handleMove(direction) {
        if (!this.gameOver) {
            const moved = this.move(direction);
            if (moved) {
                this.addRandomTile();
                this.updateDisplay();
                this.checkGameEnd();
            }
        }
    }

    move(direction) {
        let moved = false;
        const gridCopy = JSON.parse(JSON.stringify(this.grid));

        switch(direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) row.push(0);
            if (row.join(',') !== this.grid[i].join(',')) moved = true;
            this.grid[i] = row;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) row.unshift(0);
            if (row.join(',') !== this.grid[i].join(',')) moved = true;
            this.grid[i] = row;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (column.length < 4) column.push(0);
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== column[i]) moved = true;
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                }
            }
            while (column.length < 4) column.unshift(0);
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== column[i]) moved = true;
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const tileContainer = document.querySelector('.tile-container');
        tileContainer.innerHTML = '';
        
        const tileSize = 82; // Size matches grid cells exactly
        const gap = 12;      // Gap between cells
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    
                    // Position calculation
                    const top = i * (tileSize + gap);
                    const left = j * (tileSize + gap);
                    
                    tile.style.top = `${top}px`;
                    tile.style.left = `${left}px`;
                    tileContainer.appendChild(tile);
                }
            }
        }

        document.getElementById('score').textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        document.getElementById('best-score').textContent = this.bestScore;
    }

    checkGameEnd() {
        // Check for 2048 tile
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 2048 && !this.won) {
                    this.won = true;
                    this.showMessage('You Win!', 'game-won');
                    return;
                }
            }
        }

        // Check for available moves
        let hasEmptyCell = false;
        let hasPossibleMoves = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    hasEmptyCell = true;
                }
                
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) {
                    hasPossibleMoves = true;
                }
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) {
                    hasPossibleMoves = true;
                }
            }
        }

        if (!hasEmptyCell && !hasPossibleMoves) {
            this.gameOver = true;
            this.showMessage('Game Over!', 'game-over');
        }
    }

    showMessage(message, className) {
        const messageElement = document.querySelector('.game-message');
        messageElement.querySelector('p').textContent = message;
        messageElement.className = `game-message ${className}`;
        
        // Add animation class
        messageElement.style.animation = 'none';
        messageElement.offsetHeight; // Trigger reflow
        messageElement.style.animation = 'fadeIn 0.3s ease-in-out';
    }

    resetGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        document.querySelector('.game-message').className = 'game-message';
        this.setupGame();
    }
}

// Start the game
new Game2048();
