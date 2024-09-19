const sudoku = (() => {
    function generateEmptyBoard() {
        return Array(9).fill().map(() => Array(9).fill('.'));
    }

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num.toString())) {
                            board[row][col] = num.toString();
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function generateSolvedBoard() {
        const board = generateEmptyBoard();
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Shuffle the numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        // Fill the first row with the shuffled numbers
        for (let col = 0; col < 9; col++) {
            board[0][col] = numbers[col].toString();
        }

        // Solve the board to generate a full, valid Sudoku
        if (!solveSudoku(board)) {
            // If solving fails, try again (this should be rare)
            return generateSolvedBoard();
        }

        return board;
    }

    function removeNumbers(board, numbersToRemove) {
        const flattened = board.flat();
        const indices = Array.from({ length: 81 }, (_, i) => i);

        for (let i = 0; i < numbersToRemove; i++) {
            const randomIndex = Math.floor(Math.random() * indices.length);
            const cellIndex = indices.splice(randomIndex, 1)[0];
            flattened[cellIndex] = '.';
        }

        return flattened;
    }

    function boardToString(board) {
        return board.flat().join('');
    }

    function stringToBoard(str) {
        return str.split('').map(char => char === '.' ? '.' : char);
    }

    return {
        generate: (difficulty) => {
            const difficultyMap = { 'easy': 62, 'medium': 53, 'hard': 44 };
            const numbersToKeep = difficultyMap[difficulty] || 53; // Default to medium if invalid difficulty
            const solvedBoard = generateSolvedBoard();
            const puzzleBoard = removeNumbers(solvedBoard, 81 - numbersToKeep);
            return boardToString(puzzleBoard);
        },

        solve: (puzzleString) => {
            const board = stringToBoard(puzzleString);
            const reshaped = [];
            for (let i = 0; i < 9; i++) {
                reshaped.push(board.slice(i * 9, (i + 1) * 9));
            }
            if (solveSudoku(reshaped)) {
                return boardToString(reshaped);
            }
            return null; // If the puzzle is unsolvable
        }
    };
})();