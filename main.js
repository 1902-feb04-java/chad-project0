'use strict'

window.addEventListener('DOMContentLoaded', () => {
    let scoreText = document.getElementById("gameBoard");
    let scoreTextContext = scoreText.getContext("2d");
    scoreTextContext.fillStyle = "white";
    scoreTextContext.font = "10px Arial";
    scoreTextContext.fillText("Score:", 3, 10);
});