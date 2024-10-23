// Gameboard
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const resetBoard = () => board.fill("");

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
    }
  };
  return { getBoard, setMark, resetBoard };
})();

// Player factory

const Player = (name, mark) => {
  return { name, mark };
};

//Game flow controller

const Gamecontroller = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const switchTurn = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes("") ? null : "Tie";
  };

  //start game
  const startGame = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.resetBoard();
    DOMController.renderBoard();
    DOMController.setResultMessage("");
  };

  const handleSquareClick = (index) => {
    if (gameOver || Gameboard.getBoard()[index] !== "") return;

    Gameboard.setMark(index, players[currentPlayerIndex].mark);
    const winner = checkWinner();

    if (winner) {
      gameOver = true;
      DOMController.setResultMessage(
        winner === "Tie"
          ? "It's a Tie!"
          : `${players[currentPlayerIndex].name} Wins!`
      );
    } else {
      switchTurn();
      DOMController.setResultMessage(
        `${players[currentPlayerIndex].name}'s Turn`
      );
    }

    DOMController.renderBoard();
  };
  return { startGame, handleSquareClick };
})();

//Dom Controller Module

const DOMController = (() => {
  const gameBoardElement = document.getElementById("game-board");
  const resultDisplay = document.getElementById("result-display");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const gameContainer = document.getElementById("game-container");

  const renderBoard = () => {
    gameBoardElement.innerHTML = "";
    Gameboard.getBoard().forEach((mark, index) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.textContent = mark;
      square.addEventListener("click", () =>
        Gamecontroller.handleSquareClick(index)
      );
      gameBoardElement.appendChild(square);
    });
  };

  const setResultMessage = (message) => {
    resultDisplay.textContent = message;
  };

  startBtn.addEventListener("click", () => {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";
    gameContainer.classList.remove("hidden");
    Gamecontroller.startGame(player1Name, player2Name);
  });

  restartBtn.addEventListener("click", () => {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";
    Gamecontroller.startGame(player1Name, player2Name);
  });
  return { renderBoard, setResultMessage };
})();
