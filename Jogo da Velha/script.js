let board = ['', '', '', '', '', '', '', '', ''];
let playerSymbol = '';
let aiSymbol = '';
let playerWins = 0;
let aiWins = 0;
let gameOver = false;

function chooseSymbol(symbol) {
    playerSymbol = symbol;
    aiSymbol = (symbol === 'X') ? 'O' : 'X';
    document.getElementById('choice').style.display = 'none';
}

function checkWinner(symbol) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === symbol)
    );
}

function makeMove(index) {
    if (!playerSymbol) {
        document.getElementById('status').textContent = "Escolha X ou O primeiro!";
        return;
    }

    if (board[index] === '' && !gameOver) {
        board[index] = playerSymbol;
        document.getElementById(`cell-${index}`).textContent = playerSymbol;

        if (checkWinner(playerSymbol)) {
            playerWins++;
            updateScore();
            document.getElementById('status').textContent = "Você venceu esta rodada!";
            gameOver = true;
            setTimeout(() => resetBoard(), 2000);
        } else if (board.every(cell => cell !== '')) {
            document.getElementById('status').textContent = "Empate!";
            gameOver = true;
            setTimeout(() => resetBoard(), 2000);
        } else {
            setTimeout(aiMove, 1000);
        }
    }
}

function aiMove() {
    let bestMove = minimax(board, aiSymbol);
    board[bestMove.index] = aiSymbol;
    document.getElementById(`cell-${bestMove.index}`).textContent = aiSymbol;
    document.getElementById(`cell-${bestMove.index}`).classList.add('ai-move');

    checkGameState(aiSymbol);
}

// Função Minimax
function minimax(newBoard, symbol) {
    let emptyCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    // Se a IA venceu
    if (checkWinner(aiSymbol)) {
        return { score: 1 };
    }
    // Se o jogador venceu
    if (checkWinner(playerSymbol)) {
        return { score: -1 };
    }
    // Se não há mais jogadas
    if (emptyCells.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        let move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = symbol;

        // Alterna entre a IA e o jogador
        if (symbol === aiSymbol) {
            let result = minimax(newBoard, playerSymbol);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiSymbol);
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = ''; // Reverter a jogada
        moves.push(move);
    }

    let bestMove;
    if (symbol === aiSymbol) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

function checkGameState(symbol) {
    if (checkWinner(symbol)) {
        if (symbol === aiSymbol) {
            aiWins++;
            updateScore();
            if (aiWins >= 5) {
                document.getElementById('status').textContent = "A máquina é a campeã!";
                gameOver = true;
            } else {
                document.getElementById('status').textContent = "A máquina venceu esta rodada!";
            }
        } else {
            playerWins++;
            updateScore();
            if (playerWins >= 5) {
                document.getElementById('status').textContent = "Você é o campeão!";
                gameOver = true;
            } else {
                document.getElementById('status').textContent = "Você venceu esta rodada!";
            }
        }
        setTimeout(() => {
            if (gameOver) {
                resetGame();
            } else {
                resetBoard();
            }
        }, 2000);
    } else if (board.every(cell => cell !== '')) {
        document.getElementById('status').textContent = "Empate!";
        gameOver = true;
        setTimeout(resetBoard, 2000);
    }
}

function updateScore() {
    document.getElementById('score').textContent = `Jogador: ${playerWins} | Máquina: ${aiWins}`;
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('ai-move');
    });
    document.getElementById('status').textContent = '';
    gameOver = false;
}

function resetGame() {
    playerWins = 0;
    aiWins = 0;
    updateScore();
    resetBoard();
}

