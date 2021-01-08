"use strict";

const board = document.querySelector(".board");
const squares = document.querySelectorAll(".board__square");
const alertBG = document.querySelector(".alert-bg");
const alertInfo = document.querySelector(".alert-info");
const turnSwitch = document.querySelector(".switch");

resizeBoard();

window.addEventListener("resize", resizeBoard);

function resizeBoard() {
    board.style.height = board.clientWidth + "px";
    board.style.fontSize = (board.clientHeight / 3 - 30) / 10 + "rem";
}

class Player {
    constructor(playerDiv, firstPlayer, turnSwitchKey) {
        this.playerDiv = playerDiv;
        this.nameBox = playerDiv.querySelector(".player__name span");
        this.name = this.nameBox.textContent.toUpperCase();
        this.scoreBox = playerDiv.querySelector(".player__score span");
        this.score = 0;
        this.editButton = playerDiv.querySelector(".player__name .edit");
        this.symbolBox = this.playerDiv.querySelector(".symbol");
        this.symbol = this.symbolBox.textContent;
        this.firstPlayerInPrevGame = firstPlayer;
        this.switchKey = turnSwitchKey;
        this.switchKey.querySelector(".name").textContent = this.name;
        this.switchKey.querySelector(".symbol").textContent = this.symbol;
    }
}

const localStorage = window.localStorage;

var player1 = new Player(
    document.querySelector(".player-1"),
    false,
    turnSwitch.querySelector(".player-1__side")
);

var player2 = new Player(
    document.querySelector(".player-2"),
    true,
    turnSwitch.querySelector(".player-2__side")
);

var isPlayer1Turn = true;

if (localStorage.getItem("player1_name") != null) {
    retriveValues();
    updatePage();
} else {
    storeValues();
}

function retriveValues() {
    player1.name = localStorage.getItem("player1_name");
    player2.name = localStorage.getItem("player2_name");
    player1.score = Number(localStorage.getItem("player1_score"));
    player2.score = Number(localStorage.getItem("player2_score"));
    if (localStorage.getItem("lastGameFirstPlayer") == "1") {
        player1.firstPlayerInPrevGame = true;
        player2.firstPlayerInPrevGame = false;
    } else {
        player1.firstPlayerInPrevGame = false;
        player2.firstPlayerInPrevGame = true;
    }
}

function storeValues() {
    localStorage.setItem("player1_name", player1.name);
    localStorage.setItem("player2_name", player2.name);
    localStorage.setItem("player1_score", player1.score);
    localStorage.setItem("player2_score", player2.score);
    if (player1.firstPlayerInPrevGame) {
        localStorage.setItem("lastGameFirstPlayer", "1");
    } else {
        localStorage.setItem("lastGameFirstPlayer", "2");
    }
}

function updatePage() {
    isPlayer1Turn = player2.firstPlayerInPrevGame;
    switchTurns(isPlayer1Turn);
    if (!isPlayer1Turn) {
        exchangeSymbols();
    }
    player1.nameBox.textContent = player1.name;
    player1.scoreBox.textContent = player1.score;
    player1.symbolBox.textContent = player1.symbol;
    player1.switchKey.querySelector(".name").textContent = player1.name;
    player1.switchKey.querySelector(".symbol").textContent = player1.symbol;

    player2.nameBox.textContent = player2.name;
    player2.scoreBox.textContent = player2.score;
    player2.symbolBox.textContent = player2.symbol;
    player2.switchKey.querySelector(".name").textContent = player2.name;
    player2.switchKey.querySelector(".symbol").textContent = player2.symbol;
}

player1.editButton.addEventListener("click", function () {
    updateName(player1);
});
player2.editButton.addEventListener("click", function () {
    updateName(player2);
});

function updateName(player) {
    player.name = prompt("Enter player name:").substring(0, 8).toUpperCase();
    player.nameBox.textContent = player.name;
    player.switchKey.querySelector(".name").textContent = player.name;
    storeValues();
}

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

squares.forEach(function (square) {
    square.addEventListener("click", function () {
        if (fillSquare(square)) {
            if (checkWin()) {
                updateScore(isPlayer1Turn ? player1 : player2);
                var str = isPlayer1Turn
                    ? player1.name + " WINS"
                    : player2.name + " WINS";
                showInfoAlert(str);
                nextGame();
            } else if (checkDraw()) {
                showInfoAlert("GAME DRAW");
                nextGame();
            } else {
                isPlayer1Turn = !isPlayer1Turn;
                switchTurns(isPlayer1Turn);
            }
        }
    });
});

function fillSquare(square) {
    if (square.textContent == "") {
        square.textContent = isPlayer1Turn ? player1.symbol : player2.symbol;
        return true;
    }
    return false;
}

function checkWin() {
    for (var i = 0; i < 8; i++) {
        if (
            squares[winCombinations[i][0]].textContent != "" &&
            squares[winCombinations[i][0]].textContent ==
                squares[winCombinations[i][1]].textContent &&
            squares[winCombinations[i][1]].textContent ==
                squares[winCombinations[i][2]].textContent
        ) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    var isDraw = true;
    squares.forEach(function (square) {
        if (square.textContent == "") {
            isDraw = false;
        }
    });
    return isDraw;
}

function switchTurns(player1turn) {
    if (player1turn) {
        player1.playerDiv.classList.add("turn");
        player2.playerDiv.classList.remove("turn");
        player1.switchKey.classList.add("player-turn");
        player2.switchKey.classList.remove("player-turn");
    } else {
        player1.playerDiv.classList.remove("turn");
        player2.playerDiv.classList.add("turn");
        player1.switchKey.classList.remove("player-turn");
        player2.switchKey.classList.add("player-turn");
    }
}

function updateScore(player) {
    player.score++;
    player.scoreBox.textContent = player.score;
}

function clearBoard() {
    squares.forEach(function (square) {
        square.textContent = "";
    });
}

function nextGame() {
    clearBoard();
    player1.firstPlayerInPrevGame = !player1.firstPlayerInPrevGame;
    player2.firstPlayerInPrevGame = !player2.firstPlayerInPrevGame;
    isPlayer1Turn = player2.firstPlayerInPrevGame;
    switchTurns(isPlayer1Turn);
    exchangeSymbols();
    storeValues();
}

function exchangeSymbols() {
    var temp = player1.symbol;
    player1.symbol = player2.symbol;
    player2.symbol = temp;
    player1.symbolBox.textContent = player1.symbol;
    player1.switchKey.querySelector(".symbol").textContent = player1.symbol;
    player2.symbolBox.textContent = player2.symbol;
    player2.switchKey.querySelector(".symbol").textContent = player2.symbol;
}

function showInfoAlert(str) {
    alertInfo.querySelector("p").textContent = str;
    alertBG.style.display = "block";
    alertInfo.style.display = "flex";
}

function closeInfoAlert() {
    alertBG.style.display = "none";
    alertInfo.style.display = "none";
    alertInfo.querySelector("p").textContent = "";
}

function resetCurrentGame() {
    clearBoard();
    isPlayer1Turn = player2.firstPlayerInPrevGame;
    switchTurns(isPlayer1Turn);
}

function resetGame() {
    localStorage.clear();
    player1.name = "PLAYER 1";
    player1.score = 0;
    player1.symbol = "X";
    player2.name = "PLAYER 2";
    player2.score = 0;
    player2.symbol = "O";
    player1.firstPlayerInPrevGame = false;
    player2.firstPlayerInPrevGame = true;
    clearBoard();
    updatePage();
    storeValues();
}
