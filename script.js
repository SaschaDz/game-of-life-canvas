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
ctx.fillStyle = cellColorDead;
var cellSize = 25;
var cols = 100;
var rows = 100;
var generations = 0;
const genDisplay = document.getElementById("gens");
var cells = [];
var simSpeed = 100;

// show count of generations
displayGenerationCount();
function displayGenerationCount() {
    genDisplay.innerText = `generation: ${generations}`;
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
    for (var i=0;i<cells.length-1;i++) {
        var cell = cells[i];
        cell.nAlive = 0;
        ctx.fillRect(cell.x,cell.y,cellSize-1,cellSize-1);
        if (cells[i+1].status == 1) {
            ctx.fillStyle = "green";
            ctx.fill();
        } else 
            ctx.fillStyle = cellColorDead;
            ctx.fill();
    }
}

// make cells interactive
canvas.addEventListener("mousedown", function(e) { 
    for (i=0;i<cells.length;i++) {
        var cell = cells[i];
        var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
        var mouseX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
        var mouseY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
        //document.getElementById("gens").innerText = `MouseX: ${mouseX} MouseY: ${mouseY} CellX: ${cell.x} CellX+W: ${cell.x+cellSize} cellY: ${cell.y} cellY+H: ${cell.y+cellSize}`;
        if (mouseX > cell.x && mouseX < (cell.x + cellSize) && mouseY > cell.y && mouseY < (cell.y + cellSize)) {
            if (cell.status == 0) {
                cell.status = 1;
            } else
            cell.status = 0;
            //console.log(`clicked cell:${i} new status:${cell.status} nAlive:${cell.nAlive}`);
            generateCells();
        }
    }
})

// define neighbouring cells (horizontal, vertical and diagonal) and count the ones with status 1
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

// set status of all cells to 0 and re-generate them
function clearCells() {
    stopSim();
    generations = 0;
    for (var i=0;i<cells.length;i++) {
        cells[i].status = 0;
    }
    generateCells();
    displayGenerationCount();
}

var runSimInterval = 0;
function startSim() {
    if (runSimInterval == 0) {
        runSimInterval = setInterval(checkNeighbours, simSpeed);
    }
}

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
    if (cellSize < 100) {
        cellSize += 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCellsArray();
    }
}

function decreaseCellSize() {
    if (cellSize > 10) {
        cellSize -= 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createCellsArray();
    }
}