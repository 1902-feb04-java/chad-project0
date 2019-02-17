"use strict"

//function to initially set up that game board
function setUpBoard () {
    gameBoard.setUpBoard();
}

//The gameboard oject
var gameBoard = {
    scoreAmount: 0,
    startButton: document.createElement("button"),
    canvas: document.createElement("canvas"),
    restartButton: document.createElement("button"),
    endGameHeader: document.createElement("h1"),
    countDownHeader: document.createElement("h1"),
    finalScoreHeader: document.createElement("h1"),
    finalTimeHeader: document.createElement("h1"),
    scoreHeader: document.createElement("h3"),
    timeHeader: document.createElement("h3"),
    setUpBoard: function() {
        gameOver = false;
        this.restartButton.id = "restartButton";
        this.endGameHeader.id = "gameOverHeader";
        this.startButton.id = "startButton";
        this.countDownHeader.id = "countDownHeader";
        this.finalScoreHeader.id = "finalScoreHeader";
        this.finalTimeHeader.id = "finalTimeHeader";
        this.scoreHeader.id = "scoreHeader";
        this.timeHeader.id = "timeHeader";
        this.startButton.innerHTML = "Start";
        this.restartButton.innerHTML = "Restart";
        this.endGameHeader.innerHTML = "Game Over";
        this.timeHeader.innerHTML = "Time: 0";
        this.scoreHeader.innerHTML = "Score: 0";
        this.canvas.id = "gameBoard";
        this.canvas.width = "1920";
        this.canvas.height = "1080";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.body.insertBefore(this.startButton, document.body.childNodes[1]);
        document.body.insertBefore(this.restartButton, document.body.childNodes[2]);
        document.body.insertBefore(this.endGameHeader, document.body.childNodes[3]);
        document.body.insertBefore(this.finalScoreHeader, document.body.childNodes[4]);
        document.body.insertBefore(this.finalTimeHeader, document.body.childNodes[5]);
        document.body.insertBefore(this.scoreHeader, document.body.childNodes[6]);
        document.body.insertBefore(this.timeHeader, document.body.childNodes[7]);
    },
    clearBoard: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    startGame: function() {
        this.scoreAmount = 0;
        this.context.globalAlpha = 1.0;
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.startButton.style.display = "none";
        let timeAmount = 0;
        player = new component(70, 50, "yellow", 920, 1000, "player", 20);
        player.update();
        this.timeHeader.innerHTML = `Time: ${timeAmount}`;
        this.scoreHeader.innerHTML = `Score: ${this.scoreAmount}`;
        this.finalTimeHeader.innerHTML = `Final Time: ${timeAmount}`;
        this.finalScoreHeader.innerHTML = `Final Score: ${this.scoreAmount}`;
        let timeUpdate = setInterval(function() {
            if(gameOver) {
                clearInterval(timeUpdate);
            }
            else {
                timeAmount++;
                this.timeHeader.innerHTML = `Time: ${timeAmount}`;
                this.finalTimeHeader.innerHTML = `Final Time: ${timeAmount}`;
            }
        }, 1000);
        let createMoreEnemies = function() {
            if(gameOver) {
                clearInterval(createEnemies);
            }
            else {
                clearInterval(createEnemies);
                if(timeAmount >= 0 && timeAmount <= 50) {
                    createEnemies = setInterval(createMoreEnemies, 1000);
                }
                if(timeAmount > 50 && timeAmount <= 100) {
                    createEnemies = setInterval(createMoreEnemies, 500);
                }
                else if(timeAmount > 100) {
                   createEnemies = setInterval(createMoreEnemies, 300);
                }
                let x = Math.floor((Math.random() * 1840) + 1);
                let speed = Math.floor((Math.random() * 70) + 1);
                if(speed < 50) {
                    speed = 50;
                }
                let enemy = new component(70, 50, "green", x, -90, "enemy", speed);
                while(!enemy.validSpawnPoint()) {
                    x = Math.floor((Math.random() * 1840) + 1);
                    enemy = new component(70, 50, "green", x, -90, "enemy", speed);
                }
                enemy.update();
                enemies.push(enemy);
            }
        }
        let createEnemies = setInterval(createMoreEnemies, 1000);
        let moveEnemies = setInterval(function() {
            if(gameOver) {
                clearInterval(moveEnemies);
            }
            else {
                if(enemies.length > 0) {
                    for(let e of enemies) {
                        e.newPosition('down');
                        let direction = Math.floor((Math.random() * 3) + 1);
                        if(direction < 2) {
                            direction = 2;
                        }
                        if(direction === 2 && e.x > 0) {
                            e.newPosition('left');
                        }
                        else if(direction === 3 && e.x < 1840) {
                            e.newPosition('right');
                        }
                        e.didLeaveCanvas();
                        e.didCrash();
                    }
                }
            }
        }, 300);
    },
    updateScore: function() {
        this.scoreAmount++;
        this.scoreHeader.innerHTML = `Score: ${this.scoreAmount}`;
        this.finalScoreHeader.innerHTML = `Final Score: ${this.scoreAmount}`;
    },
    endGame: function() {
        enemies = [];
        gameBoard.clearBoard();
        this.context.globalAlpha = 0;
        let countDown = 5;
        this.endGameHeader.style.display = "block";
        this.countDownHeader.style.display = "block";
        this.finalScoreHeader.style.display = "block";
        this.finalTimeHeader.style.display = "block";
        this.scoreHeader.style.display = "none";
        this.timeHeader.style.display = "none";
        this.countDownHeader.innerHTML = countDown;
        document.body.insertBefore(this.countDownHeader, document.body.childNodes[8]);
        let countDownFunc = setInterval(function() {
            countDown--;
            this.countDownHeader.innerHTML = countDown;
            if(countDown <= 0) {
                clearInterval(countDownFunc);
                this.countDownHeader.style.display = "none";
            }
        }, 1000)
        setTimeout(function() {this.restartButton.style.display = "block";}, 5000);
    }
}

//The player
var player;
//array of all enemies on the canvas
var enemies = [];
//Var to end the game if true
var gameOver = false;

//function to create all components
function component(width, height, color, x, y, type, speed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        let context = gameBoard.context;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPosition = function(position) {
        let context = gameBoard.context;
        context.clearRect(this.x, this.y, this.width, this.height);
        if(type === 'enemy') {
            if(position === 'down') {
                this.y = this.y + speed;
            }
            else if(position === 'left') {
                if(this.x > 0) {
                    this.x = this.x - speed;
                }
            }
            else if(position === 'right') {
                if(this.x < 1840) {
                    this.x = this.x + speed;
                }
            }
        }
        else if(type === 'player') {
            if(position === 'up') {
                if(this.y > 0) {
                    this.y = this.y - speed;
                }
            }
            else if(position === 'down') {
                if(this.y < 1020) {
                    this.y = this.y + speed;
                }
            }
            else if(position === 'right') {
                if(this.x < 1840) {
                    this.x = this.x + speed;
                }
            }
            else if(position === 'left') {
                if(this.x > 0) {
                    this.x = this.x - speed;
                }
            }
        }
        this.update();
    }
    this.validSpawnPoint = function() {
        let myLeft = this.x
        let myRight = this.x + this.width;
        let myTop = this.y;
        let myBottom = this.y + this.height;
        for(let i = 0; i < enemies.length; i++) {
            let otherTop = enemies[i].y;
            let otherBottom = enemies[i].y + enemies[i].height;
            let otherRight = enemies[i].x + enemies[i].width;
            let otherLeft = enemies[i].x;
            if((myBottom > otherTop) && (myTop < otherBottom) && (myRight > otherLeft) && (myLeft < otherRight)) {
                return false;
            }
        }
        return true;
    }
    this.didCrash = function() {
        let myLeft = this.x
        let myRight = this.x + this.width;
        let myTop = this.y;
        let myBottom = this.y + this.height;
        if(type === 'enemy') {
            let otherTop = player.y;
            let otherBottom = player.y + player.height;
            let otherRight = player.x + player.width;
            let otherLeft = player.x;
            if((myBottom > otherTop) && (myTop < otherBottom) && (myRight > otherLeft) && (myLeft < otherRight)) {
                gameOver = true;
                gameBoard.endGame();
            }
        }
        else {
            for(let i = 0; i < enemies.length; i++) {
                let otherTop = enemies[i].y;
                let otherBottom = enemies[i].y + enemies[i].height;
                let otherRight = enemies[i].x + enemies[i].width;
                let otherLeft = enemies[i].x;
                if((myBottom > otherTop) && (myTop < otherBottom) && (myRight > otherLeft) && (myLeft < otherRight)) {
                    gameOver = true;
                    gameBoard.endGame();
                }
            }
        }
    }
    this.didLeaveCanvas = function() {
        if(this.y >= 1000) {
            let context = gameBoard.context;
            let index  = enemies.indexOf(this);
            if(index > -1) {
                enemies.splice(index, 1);
            }
            context.clearRect(this.x, this.y, this.width, this.height);
            gameBoard.updateScore();
        }
    }
}

//checks to see if player restarts the game
gameBoard.restartButton.addEventListener("click", () => {
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("gameOverHeader").style.display = "none";
    document.getElementById("finalScoreHeader").style.display = "none";
    document.getElementById("finalTimeHeader").style.display = "none";
    document.getElementById("scoreHeader").style.display = "block";
    document.getElementById("timeHeader").style.display = "block";
    gameOver = false;
    gameBoard.startGame();
});

//Checks to see if player starts the game
gameBoard.startButton.addEventListener("click", () => {
    gameBoard.startGame();
    document.onkeydown = function(e) {
        if(!gameOver) {
            if(e.keyCode === 38) {
                player.newPosition('up');
            }
            else if(e.keyCode === 40) {
                player.newPosition('down');
            }
            else if(e.keyCode === 39) {
                player.newPosition('right');
            }
            else if(e.keyCode === 37) {
                player.newPosition('left');
            }
            player.didCrash();
            e.preventDefault();
        }
    }
});
/*Tomorrow, try to create smoother movement*/