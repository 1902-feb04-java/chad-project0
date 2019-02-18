"use strict"

//function to initially set up that game board
function setUpBoard () {
    gameBoard.setUpBoard();
}

//The gameboard oject
var gameBoard = {
    //To keep track of amount of points player makes
    scoreAmount: 0,
    //to create HTML elements needed in the browser
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
        //game has started, thus game is not over
        gameOver = false;
        //Setting id's on HTML elements to style them with css
        this.restartButton.id = "restartButton";
        this.endGameHeader.id = "gameOverHeader";
        this.startButton.id = "startButton";
        this.countDownHeader.id = "countDownHeader";
        this.finalScoreHeader.id = "finalScoreHeader";
        this.finalTimeHeader.id = "finalTimeHeader";
        this.scoreHeader.id = "scoreHeader";
        this.timeHeader.id = "timeHeader";
        this.canvas.id = "gameBoard";
        //Sets innerHTML to need values
        this.startButton.innerHTML = "Start";
        this.restartButton.innerHTML = "Restart";
        this.endGameHeader.innerHTML = "Game Over";
        this.timeHeader.innerHTML = "Time: 0";
        this.scoreHeader.innerHTML = "Score: 0";
        //Creates width and height of canvas
        this.canvas.width = "1920";
        this.canvas.height = "1080";
        //Sets elements drawn on canvas to be 2D.
        this.context = this.canvas.getContext("2d");
        //Inserts elements inside of HTML
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
        //Clears the board of all elements
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    startGame: function() {
        //Initializes variables to needed amounts
        this.scoreAmount = 0;
        let timeAmount = 0;
        this.context.globalAlpha = 1.0;
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //Removes start button; game has started
        this.startButton.style.display = "none";
        //Creates player
        player = new component(70, 50, "yellow", 920, 1000, "player", 5);
        //Draws player on screen
        player.update();
        //Displays score and time on screen, as well as final score and final time
        this.timeHeader.innerHTML = `Time: ${timeAmount}`;
        this.scoreHeader.innerHTML = `Score: ${this.scoreAmount}`;
        this.finalTimeHeader.innerHTML = `Final Time: ${timeAmount}`;
        this.finalScoreHeader.innerHTML = `Final Score: ${this.scoreAmount}`;
        let timeUpdate = setInterval(function() {
            if(gameOver) {
                //Stop the function if game is over
                clearInterval(timeUpdate);
            }
            else {
                //Increment and update time and final time on screen
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
                //ClearInterval to reset it
                clearInterval(createEnemies);
                if(timeAmount >= 0 && timeAmount <= 50) {
                    //Creates a certain amount of enemies at a time
                    createEnemies = setInterval(createMoreEnemies, 1000);
                }
                if(timeAmount > 50 && timeAmount <= 100) {
                    //Creates more enemies at a time
                    createEnemies = setInterval(createMoreEnemies, 500);
                }
                else if(timeAmount > 100) {
                    //Creates even more enemies at a time
                   createEnemies = setInterval(createMoreEnemies, 300);
                }
                //Random x position
                let x = Math.floor((Math.random() * 1840) + 1);
                //Random speed
                let speed = Math.floor((Math.random() * 70) + 1);
                if(speed < 50) {
                    speed = 50;
                }
                //Creates enemy
                let enemy = new component(70, 50, "green", x, -90, "enemy", speed);
                //If spawn point is already filled by other element, reset spawn point and recreate enemy
                while(!enemy.validSpawnPoint()) {
                    x = Math.floor((Math.random() * 1840) + 1);
                    enemy = new component(70, 50, "green", x, -90, "enemy", speed);
                }
                //Draw enemy on screen
                enemy.update();
                //Place enemy in an array of enemies
                enemies.push(enemy);
            }
        }
        //Initially set interval to create enemies
        let createEnemies = setInterval(createMoreEnemies, 1000);
        let moveEnemies = setInterval(function() {
            if(gameOver) {
                clearInterval(moveEnemies);
            }
            else {
                //If there is enemies on screen
                if(enemies.length > 0) {
                    for(let e of enemies) {
                        //Move enemy down
                        e.newPosition('down');
                        //Generate random number to move enemy
                        let direction = Math.floor((Math.random() * 3) + 1);
                        if(direction < 2) {
                            direction = 2;
                        }
                        if(direction === 2 && e.x > 0) {
                            //Move enemy left
                            e.newPosition('left');
                        }
                        else if(direction === 3 && e.x < 1840) {
                            //Move enemy right
                            e.newPosition('right');
                        }
                        //Check to see if enemy is still inside of canvas
                        e.didLeaveCanvas();
                        //Check to see if enemy crashed into the player
                        e.didCrash();
                    }
                }
            }
        }, 300);
    },
    updateScore: function() {
        //Increment score and update score on screen
        this.scoreAmount++;
        this.scoreHeader.innerHTML = `Score: ${this.scoreAmount}`;
        this.finalScoreHeader.innerHTML = `Final Score: ${this.scoreAmount}`;
    },
    endGame: function() {
        //Remove all enemies from array
        enemies = [];
        //clear the canvas of all elements
        gameBoard.clearBoard();
        //Make the elements in the canvas invisible
        this.context.globalAlpha = 0;
        let countDown = 5;
        //display and remove certain elements
        this.endGameHeader.style.display = "block";
        this.countDownHeader.style.display = "block";
        this.finalScoreHeader.style.display = "block";
        this.finalTimeHeader.style.display = "block";
        this.scoreHeader.style.display = "none";
        this.timeHeader.style.display = "none";
        //Set header equal to 5
        this.countDownHeader.innerHTML = countDown;
        //Insert into HTML
        document.body.insertBefore(this.countDownHeader, document.body.childNodes[8]);
        let countDownFunc = setInterval(function() {
            //Increment countDown and update on screen
            countDown--;
            this.countDownHeader.innerHTML = countDown;
            if(countDown <= 0) {
                //Clear interval and remove header from HTML; countdown has reached 0
                clearInterval(countDownFunc);
                this.countDownHeader.style.display = "none";
            }
        }, 1000)
        //Displays restart button after 5 seconds
        setTimeout(function() {this.restartButton.style.display = "block";}, 5000);
    }
}

//The player
var player;
//array of all enemies on the canvas
var enemies = [];
//Var to end the game if true
var gameOver = false;
//Object to keep track of key presses
var keysPressed = {
    UP: false,
    DOWN: false,
    RIGHT: false,
    LEFT: false
}

//function to create all components
function component(width, height, color, x, y, type, speed) {
    //Initializing variables
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = speed;
    //Updates position of players on screen
    this.update = function() {
        let context = gameBoard.context;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    //Moves player and enemy on canvas and makes sure that they don't go outside of canvas
    this.newPosition = function(position) {
        let context = gameBoard.context;
        context.clearRect(this.x, this.y, this.width, this.height);
        if(type === 'enemy') {
            if(position === 'down') {
                this.y = this.y + this.speed;
            }
            else if(position === 'left') {
                if(this.x > 0) {
                    this.x = this.x - this.speed;
                }
            }
            else if(position === 'right') {
                if(this.x < 1840) {
                    this.x = this.x + this.speed;
                }
            }
        }
        else if(type === 'player') {
            if(position === 'up') {
                if(this.y > 0) {
                    this.y = this.y - this.speed;
                }
            }
            else if(position === 'down') {
                if(this.y < 1020) {
                    this.y = this.y + this.speed;
                }
            }
            else if(position === 'right') {
                if(this.x < 1840) {
                    this.x = this.x + this.speed;
                }
            }
            else if(position === 'left') {
                if(this.x > 0) {
                    this.x = this.x - this.speed;
                }
            }
        }
        this.update();
    }
    //Makes sure that the spawn point is not going to spawn on top of the player or another enemy
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
    //checks to see if player crashes into an enemy and vice versa and if so, ends the game
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
    //checks to see that an enemy did not leave the canvas
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
    //Interval to constantly check if user is trying to move the player 
    let movePlayer = setInterval(function() {
        if(gameOver) {
            clearInterval(movePlayer);
        }
        else {
            if(keysPressed.UP) {
                player.newPosition('up');
            }
            else if(keysPressed.DOWN) {
                player.newPosition('down');
            }
            else if(keysPressed.RIGHT) {
                player.newPosition('right');
            }
            else if(keysPressed.LEFT) {
                player.newPosition('left');
            }
            player.didCrash();
        }
    }, 10);
});

//function to check which key user releases
function keyDownHandler(e) {
    if(e.keyCode === 38) {
        keysPressed.UP = true;
    }
    else if(e.keyCode === 40) {
        keysPressed.DOWN = true;
    }
    else if(e.keyCode === 39) {
        keysPressed.RIGHT = true;
    }
    else if(e.keyCode === 37) {
        keysPressed.LEFT = true;
    }
    //Removes default functionality of pressing an arrow key
    e.preventDefault();
}

//Function to check which key user presses 
function keyUpHandler(e) {
    if(e.keyCode === 38) {
        keysPressed.UP = false;
    }
    else if(e.keyCode === 40) {
        keysPressed.DOWN = false;
    }
    else if(e.keyCode === 39) {
        keysPressed.RIGHT = false;
    }
    else if(e.keyCode === 37) {
        keysPressed.LEFT = false;
    }
    //Removes default functionality of pressing an arrow key
    e.preventDefault();
}

//Checks to see if player starts the game
gameBoard.startButton.addEventListener("click", () => {
    gameBoard.startGame();
    //Functions to check is player presses or releases a key
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    //Interval to constantly check if user is trying to move the player 
    let movePlayer = setInterval(function() {
        if(gameOver) {
            clearInterval(movePlayer);
        }
        else {
            if(keysPressed.UP) {
                player.newPosition('up');
            }
            else if(keysPressed.DOWN) {
                player.newPosition('down');
            }
            else if(keysPressed.RIGHT) {
                player.newPosition('right');
            }
            else if(keysPressed.LEFT) {
                player.newPosition('left');
            }
            player.didCrash();
        }
    }, 10);
});