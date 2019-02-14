"use strict"

//function to initially set up that game board
function setUpBoard () {
    gameBoard.setUpBoard();
}

//The gameboard oject
var gameBoard = {
    startButton: document.createElement("button"),
    canvas: document.createElement("canvas"),
    restartButton: document.createElement("button"),
    endGameHeader: document.createElement("h1"),
    setUpBoard: function() {
        gameOver = false;
        this.restartButton.id = "restartButton";
        this.endGameHeader.id = "gameOverHeader";
        this.startButton.id = "startButton";
        this.startButton.innerHTML = "Start";
        this.restartButton.innerHTML = "Restart";
        this.endGameHeader.innerHTML = "Game Over";
        this.canvas.id = "gameBoard";
        this.canvas.width = "1920";
        this.canvas.height = "1080";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.body.insertBefore(this.startButton, document.body.childNodes[1]);
        document.body.insertBefore(this.restartButton, document.body.childNodes[2]);
        document.body.insertBefore(this.endGameHeader, document.body.childNodes[3]);
    },
    clearBoard: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    startGame: function() {
        this.context.globalAlpha = 1.0;
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.startButton.style.display = "none";
        let timeAmount = 0;
        player = new component(70, 50, "blue", 920, 1000, "player");
        player.update();
        score = new component("50px", "Arial", "white", 5, 45, "text");
        time = new component("50px", "Arial", "white", 5, 95, "text");
        score.text = "Score: 0";
        score.update();
        time.text = "Time: 0";
        time.update();
        let timeUpdate = setInterval(function() {
            if(gameOver) {
                clearInterval(timeUpdate);
            }
            else {
                timeAmount++;
                gameBoard.clearBoard();
                time.text = `Time: ${timeAmount}`;
                time.update();
                score.update();
                player.update();
            }
        }, 1000);
        let createEnemies = setInterval(function() {
            if(gameOver) {
                clearInterval(createEnemies);
            }
            else {
                let x = Math.floor((Math.random() * 1840) + 1);
                var enemy = new component(70, 50, "green", x, 20, "enemy");
                enemy.update();
                enemies.push(enemy);
            }
            let moveEnemies = setInterval(function() {
                if(gameOver) {
                    clearInterval(moveEnemies);
                }
                else {
                    enemy.newPosition("down");
                    enemy.didLeaveCanvas();
                }
            }, 1000);
        }, 2000);
    },
    endGame: function() {
        enemies = [];
        this.context.globalAlpha = 0.2;
        this.context.fillStyle = "grey";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.restartButton.style.display = "block";
        this.endGameHeader.style.display = "block";
    }
}

//The player
var player;
//The score
var score;
//the time player has played
var time;
//array of all enemies on the canvas
var enemies = [];
//Var to end the game if true
var gameOver = false;

//function to create all components
function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        let context = gameBoard.context;
        context.fillStyle = color;
        if(type === "text") {
            context.font = this.width + " " + this.height;
            context.fillText(this.text, this.x, this.y);
        }
        else {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPosition = function(position) {
        let context = gameBoard.context;
        context.clearRect(this.x, this.y, this.width, this.height);
        if(position === 'up') {
            if(this.y > 0) {
                this.y = this.y - 20;
            }
        }
        else if(position === 'down') {
            if(this.y < 1020 && type === "player") {
                this.y = this.y + 20;
            }
            else if(type === "enemy") {
                this.y = this.y + 20;
            }
        }
        else if(position === 'right') {
            if(this.x < 1840) {
                this.x = this.x + 20;
            }
        }
        else if(position === 'left') {
            if(this.x > 0) {
                this.x = this.x - 20;
            }
        }
        this.update();
    }
    this.didCrash = function() {
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
                gameOver = true;
                gameBoard.clearBoard();
                gameBoard.endGame();
            }
        }
    }
    this.didLeaveCanvas = function() {
        if(this.y > 1000) {
            let context = gameBoard.context;
            let index  = enemies.indexOf(this);
            if(index > -1) {
                enemies.splice(index, 1);
            }
            context.clearRect(this.x, this.y, this.width, this.height);
        }
    }
}

//checks to see if player restarts the game
gameBoard.restartButton.addEventListener("click", () => {
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("gameOverHeader").style.display = "none";
    gameOver = false;
    gameBoard.startGame();
});

//Checks to see if player starts the game
gameBoard.startButton.addEventListener("click", () => {
    gameBoard.startGame();
});

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

/*figure out a way for the restart button to wait 10 seconds before it appears*/