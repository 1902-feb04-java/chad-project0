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
    setUpBoard: function() {
        gameOver = false;
        this.restartButton.id = "restartButton";
        this.endGameHeader.id = "gameOverHeader";
        this.startButton.id = "startButton";
        this.countDownHeader.id = "countDownHeader";
        this.finalScoreHeader.id = "finalScoreHeader";
        this.finalTimeHeader.id = "finalTimeHeader";
        this.startButton.innerHTML = "Start";
        this.restartButton.innerHTML = "Restart";
        this.endGameHeader.innerHTML = "Game Over";
        this.finalTimeHeader.innerHTML = "Final Time: 0";
        this.finalScoreHeader.innerHTML = "Final Score: 0";
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
        player = new component(70, 50, "yellow", 920, 1000, "player");
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
                this.finalTimeHeader.innerHTML = `Final Time: ${timeAmount}`;
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
        }, 2000);
        let moveEnemies = setInterval(function() {
            if(gameOver) {
                clearInterval(moveEnemies);
            }
            else {
                if(enemies.length > 0) {
                    for(let e of enemies) {
                        e.newPosition("down");
                        e.didLeaveCanvas();
                        e.didCrash();
                    }
                }
            }
        }, 1000);
    },
    updateScore: function() {
        this.scoreAmount++;
        gameBoard.clearBoard();
        score.text = `Score: ${this.scoreAmount}`;
        this.finalScoreHeader.innerHTML = `Final Score: ${this.scoreAmount}`;
        score.update();
        time.update();
        player.update();
        for(let enemy of enemies) {
            enemy.update();
        }
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
        this.countDownHeader.innerHTML = countDown;
        document.body.insertBefore(this.countDownHeader, document.body.childNodes[6]);
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
        if(this.y > 1000) {
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

/*figure out a way for the restart button to wait 10 seconds before it appears*/