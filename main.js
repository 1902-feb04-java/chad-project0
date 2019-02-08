"use strict"

//function to initially set up that game board
function setUpBoard () {
    gameBoard.setUpBoard();
}

//The gameboard oject
var gameBoard = {
    startButton: document.createElement("button"),
    canvas: document.createElement("canvas"),
    setUpBoard: function() {
        this.startButton.id = "startButton";
        this.startButton.innerHTML = "Start";
        this.canvas.id = "gameBoard";
        this.canvas.width = "1920";
        this.canvas.height = "1080";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.body.insertBefore(this.startButton, document.body.childNodes[1]);
    },
    clearBoard: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//The player
var player;
//The score
var score;
//the time player has played
var time;

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
            if(this.y < 1020) {
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
}

//Checks to see if player starts the game
gameBoard.startButton.addEventListener("click", () => {
    let timeAmount = 0;
    gameBoard.startButton.style.display = "none";
    player = new component(70, 50, "blue", 920, 1000);
    player.update();
    score = new component("50px", "Arial", "white", 5, 45, "text");
    time = new component("50px", "Arial", "white", 5, 95, "text");
    score.text = "Score: 0";
    score.update();
    time.text = "Time: 0";
    time.update();
    setInterval(function() {
        timeAmount++;
        gameBoard.clearBoard();
        time.text = `Time: ${timeAmount}`;
        time.update();
        score.update();
        player.update();
    }, 1000);
});

document.onkeydown = function(e) {
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
    e.preventDefault();
}