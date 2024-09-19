let startTime;
let timerInterval;
let currentPuzzle;
let solvedPuzzle;
let currentDifficulty;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getUTCSeconds().toString().padStart(2, '0');
    $('#timer').text(`Time: ${minutes}:${seconds}`);
}

function generateSudoku(difficulty) {
    currentDifficulty = difficulty;
    currentPuzzle = sudoku.generate(difficulty);
    solvedPuzzle = sudoku.solve(currentPuzzle);
    renderGrid(currentPuzzle);
}

function renderGrid(puzzle) {
    const $grid = $('#grid');
    $grid.empty();

    for (let i = 0; i < 81; i++) {
        const value = puzzle[i] === '.' ? '' : puzzle[i];
        const $cell = $('<input>')
            .addClass('sudoku-cell border border-gray-300 text-center text-xl font-semibold')
            .attr({
                type: 'text',
                maxlength: '1',
                readonly: value !== ''
            })
            .val(value);

        if (i % 9 === 0) {
            $('<div>').addClass('sudoku-row flex').appendTo($grid);
        }

        $cell.appendTo($grid.children().last());
    }

    $('#sudoku-grid').removeClass('hidden');
    $('#difficulty-selection').addClass('hidden');
    $('#congratulations').addClass('hidden');
    startTimer();
}

function validateSudoku() {
    let isCorrect = true;
    $('.sudoku-cell').each(function (index) {
        const cellValue = $(this).val();
        if (cellValue !== solvedPuzzle[index]) {
            isCorrect = false;
            return false;
        }
    });

    if (isCorrect) {
        stopTimer();
        celebrateWin();
    }
}

function celebrateWin() {
    const container = document.querySelector('#fireworks-container');
    const fireworks = new Fireworks.default(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
            min: 0,
            max: 360
        },
        delay: {
            min: 30,
            max: 60
        },
        rocketsPoint: {
            min: 50,
            max: 50
        },
        lineWidth: {
            explosion: {
                min: 1,
                max: 3
            },
            trace: {
                min: 1,
                max: 2
            }
        },
        brightness: {
            min: 50,
            max: 80
        },
        decay: {
            min: 0.015,
            max: 0.03
        },
        mouse: {
            click: false,
            move: false,
            max: 1
        }
    });

    fireworks.start();

    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getUTCSeconds().toString().padStart(2, '0');

    $('#congratulations')
        .html(`Congratulations!<br/>You solved the puzzle in<br/>${minutes}:${seconds}`)
        .removeClass('hidden');

    setTimeout(() => {
        fireworks.stop();
    }, 5000);
}

function restartGame() {
    stopTimer();
    renderGrid(currentPuzzle);
}

function backToLevels() {
    stopTimer();
    $('#sudoku-grid').addClass('hidden');
    $('#difficulty-selection').removeClass('hidden');
    $('#congratulations').addClass('hidden');
}

$(document).ready(function () {
    $('.difficulty-btn').on('click', function () {
        const difficulty = $(this).data('difficulty');
        generateSudoku(difficulty);
    });

    $(document).on('input', '.sudoku-cell', function () {
        $(this).val($(this).val().replace(/[^1-9]/g, ''));
        if ($('.sudoku-cell').filter(function () { return $(this).val() === ''; }).length === 0) {
            validateSudoku();
        }
    });

    $('#restart-btn').on('click', restartGame);
    $('#back-btn').on('click', backToLevels);
});