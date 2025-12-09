document.addEventListener("DOMContentLoaded", function () {
    const BOARD_SIZE = 5;
    const boardElement = document.getElementById("board");
    const moveCountSpan = document.getElementById("moveCount");
    const newGameBtn = document.getElementById("newGameBtn");
    const resetBtn = document.getElementById("resetBtn");

    // Internal board state: true = is-off (dark), false = light (on)
    let boardState = [];
    let startingState = [];
    let moveCount = 0;

    function createEmptyBoard() {
        boardState = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            const row = [];
            for (let c = 0; c < BOARD_SIZE; c++) {
                row.push(false); // start with all lights ON (no "is-off" class)
            }
            boardState.push(row);
        }
    }

    function renderBoard() {
        boardElement.innerHTML = "";
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement("button");
                cell.classList.add("cell");
                cell.setAttribute("data-row", r.toString());
                cell.setAttribute("data-col", c.toString());
                cell.setAttribute("aria-label", "Row " + (r + 1) + " column " + (c + 1));

                if (boardState[r][c]) {
                    cell.classList.add("is-off");
                }

                cell.addEventListener("click", function () {
                    handleUserClick(r, c);
                });

                boardElement.appendChild(cell);
            }
        }
    }

    function toggleCell(r, c) {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return;
        boardState[r][c] = !boardState[r][c];
    }

    function applyMove(r, c) {
        // Toggle clicked cell and its four neighbors
        toggleCell(r, c);
        toggleCell(r - 1, c);
        toggleCell(r + 1, c);
        toggleCell(r, c - 1);
        toggleCell(r, c + 1);
    }

    function handleUserClick(r, c) {
        applyMove(r, c);
        moveCount++;
        moveCountSpan.textContent = moveCount.toString();
        updateDOMClasses();

        if (checkWin()) {
            window.alert("You win!");
        }
    }

    function updateDOMClasses() {
        const cells = boardElement.querySelectorAll(".cell");
        cells.forEach((cell) => {
            const r = parseInt(cell.getAttribute("data-row"), 10);
            const c = parseInt(cell.getAttribute("data-col"), 10);

            if (boardState[r][c]) {
                cell.classList.add("is-off");
            } else {
                cell.classList.remove("is-off");
            }
        });
    }

    function checkWin() {
        // Win if there are NO dark squares left (all lights ON)
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (boardState[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }

    function copyBoardState(target, source) {
        target.length = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            target.push(source[r].slice());
        }
    }

    function generateRandomSolvableBoard() {
        createEmptyBoard();

        // Start from solved (all lights ON) and randomly apply valid moves.
        const randomClicks = BOARD_SIZE * BOARD_SIZE; // enough to mix the board
        for (let i = 0; i < randomClicks; i++) {
            const r = Math.floor(Math.random() * BOARD_SIZE);
            const c = Math.floor(Math.random() * BOARD_SIZE);
            applyMove(r, c);
        }

        // Save this as the "starting" configuration for Reset
        startingState = [];
        copyBoardState(startingState, boardState);
        moveCount = 0;
        moveCountSpan.textContent = moveCount.toString();
    }

    function resetToStart() {
        copyBoardState(boardState, startingState);
        moveCount = 0;
        moveCountSpan.textContent = moveCount.toString();
        updateDOMClasses();
    }

    // Button wiring
    newGameBtn.addEventListener("click", function () {
        generateRandomSolvableBoard();
        renderBoard();
    });

    resetBtn.addEventListener("click", function () {
        resetToStart();
    });

    // Initial board for first page load
    generateRandomSolvableBoard();
    renderBoard();
});
