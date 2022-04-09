/*
To-Do:
- zoom in/out without loosing cell status
- paning
- continous drawing of cells instead of having to click each and every cell seperately
- make site responsive
*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const cellColorDead = "rgb(231, 231, 231)";
const cellColorLive = "green";
ctx.fillStyle = cellColorDead;
var cellSize = 25;
var cols = 100;
var rows = 100;
var generations = 0;
const genDisplay = document.getElementById("gens");
var cells = [];
var liveCells = 0;
var simSpeed = 100;
var drawModeCheck = 0;
var drawModeFill = 1;
const drawBtn = document.getElementById("draw");
const eraseBtn = document.getElementById("erase");
drawBtn.style.backgroundColor = "green";

// switch between draw and erase mode
drawBtn.addEventListener("click", function() {
    drawModeCheck = 0;
    drawModeFill = 1;
    drawBtn.style.backgroundColor = "green";
    eraseBtn.style.backgroundColor = "white";
});
eraseBtn.addEventListener("click", function() {
    drawModeCheck = 1;
    drawModeFill = 0;
    eraseBtn.style.backgroundColor = "red";
    drawBtn.style.backgroundColor = "white";
});

// show count of generations
displayGenerationCount();
function displayGenerationCount() {
    genDisplay.innerText = `generation: ${generations} cells alive: ${liveCells}`;
}

// generate cells array
createCellsArray();
function createCellsArray() {
    cells = [];
    for (var r=0;r<rows;r++) {
        for (var c=0;c<cols;c++) {
            var cell = {
                x: c*cellSize+1,
                y: r*cellSize+1-cellSize,
                status: 0,
                nAlive: 0
            };
            cells.push(cell);
        }
    };
    displayGenerationCount();
    generateCells();
}


// create cells on canvas
function generateCells() {
    liveCells = 0;
    for (var i=0;i<cells.length-1;i++) {
        var cell = cells[i];
        cell.nAlive = 0;
        ctx.fillRect(cell.x,cell.y,cellSize-1,cellSize-1);
        if (cells[i+1].status == 1) {
            ctx.fillStyle = cellColorLive;
            liveCells++;
            ctx.fill();
        } else 
            ctx.fillStyle = cellColorDead;
            ctx.fill();
    }
    if (liveCells == 0) {
        displayGenerationCount();
        stopSim();
    }
}

// pause sim while drawing/erasing on canvas
canvas.addEventListener('mousedown', function(m) {
    this.mouseDown = true;   
    if (runSimInterval != 0) {
        this.paused = 1;  
        clearInterval(runSimInterval); // pause sim wile drawing if it was running
    }
}, 0);

// if sim was paused in above function, continue sim when mousebutton is no longer pressed
canvas.addEventListener('mouseup', function() {
    this.mouseDown = false;  
    if (this.paused == 1) {
        runSimInterval = 0;
        this.paused = 0; 
        startSim();
    }
}, 0);


// draw/erase live cells depending on the DrawMode
['mousedown','mousemove'].forEach(event =>
    canvas.addEventListener(event, function(m) {
        var cRect = canvas.getBoundingClientRect();
        var mouseX = Math.round(m.clientX - cRect.left);
        var mouseY = Math.round(m.clientY - cRect.top);
        if(this.mouseDown) {
            for (i=0;i<cells.length;i++) {
                var cell = cells[i];
                if (mouseX > cell.x && mouseX < (cell.x + cellSize) && mouseY > cell.y && mouseY < (cell.y + cellSize) && cell.status == drawModeCheck) {
                    cell.status = drawModeFill;
                    //console.log(`clicked cell:${i} new status:${cell.status} nAlive:${cell.nAlive}`);
                }
            }
            generateCells();
        }
    })
);


// define neighbouring cells (horizontal, vertical and diagonal) and count the live ones
function checkNeighbours() {
    for (var i=0;i<cells.length-1;i++) {
        var cell = cells[i];
        const nbs = [
            cells[i - cols],
            cells[i - cols + 1],
            cells[i + 1],
            cells[i + cols + 1],
            cells[i + cols],
            cells[i + cols - 1],
            cells[i - 1],
            cells[i - cols - 1]
        ]; 
        for (var j=0;j<nbs.length;j++) {
            if (!!nbs[j]) {
                if (nbs[j].status == 1) {
                    cell.nAlive++;
                }
            }
        }
    }
    nextGeneration();
}

/* 
Determine a cell's status debending on the number of live neighbours.
Here, John Comway's rules com into play:
- Any live cell with less than 2 live neighbours dies.
- Any live cell with 2 or 3 live neighbours survives.
- Any live cell with more than 3 live neighbours dies.
- Any dead cell with with 3 live neighbours becomes a live cell.
*/
function nextGeneration() {
    generations++;
    displayGenerationCount();
    for (const cell of cells) {
        if (cell.nAlive < 2) {
            cell.status = 0;
        } else if (cell.nAlive >= 4) {
            cell.status = 0;
        } else if (cell.nAlive == 3) {
            cell.status = 1;
        }
    }
    generateCells();
}

/* 
stop running Sim,
reset generations,
reset all cells and regenerate them, 
reset drawMode
*/
function clearCells() {
    stopSim();
    generations = 0;
    for (var i=0;i<cells.length;i++) {
        cells[i].status = 0;
    }
    drawModeCheck = 0;
    drawModeFill = 1;
    drawBtn.style.backgroundColor = "green";
    eraseBtn.style.backgroundColor = "white";
    generateCells();
    displayGenerationCount();
}

// start the Simulation with the Intervall set in simSpeed
var runSimInterval = 0;
function startSim() {
    if (runSimInterval == 0) {
        runSimInterval = setInterval(checkNeighbours, simSpeed);
    }
}

// stop the Simulation
function stopSim() {
    clearInterval(runSimInterval);
    runSimInterval = 0;
}

function decreaseSpeed() {
    if (simSpeed <4000) {
        simSpeed += 50;
        clearInterval(runSimInterval);
        runSimInterval = 0;
        startSim();
    }
}

function increaseSpeed() {
    if (simSpeed > 50) {
        simSpeed -= 50;
        clearInterval(runSimInterval);
        runSimInterval = 0;
        startSim();
    }
}

function increaseCellSize() {
    if (cellSize < 100 && runSimInterval == 0) {
        cellSize += 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCellsArray();
    }
}

function decreaseCellSize() {
    if (cellSize > 10 && runSimInterval == 0) {
        cellSize -= 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCellsArray();
    }
}