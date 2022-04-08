var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const cellColorDead = "rgb(231, 231, 231)";
ctx.fillStyle = cellColorDead;
var cellSize = 10;
var cols = Math.floor(canvas.width/cellSize);
var rows = Math.floor(canvas.height/cellSize)+2;
var generations = 0;
const genDisplay = document.getElementById("gens");
var cells = [];
var simSpeed = 200;
const intervalSlider = document.getElementById("intervalSlider");

// show count of generations
displayGenerationCount();
function displayGenerationCount() {
    genDisplay.innerText = `generation: ${generations}`;
}

// generate cells array
createCellsArray();
function createCellsArray() {
    cols = Math.floor(canvas.width/cellSize);
    rows = Math.floor(canvas.height/cellSize)+2;
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
        cell.id = i - cols+1;
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
            console.log(`clicked cell:${i} id:${cell.id} new status:${cell.status} nAlive:${cell.nAlive}`);
            generateCells();
        }
    }
});


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

function nextGeneration() {
    generations++;
    displayGenerationCount();
    for (const cell of cells) {
        if (cell.nAlive <= 1) {
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
    if (simSpeed >= 50 && simSpeed <2000 && runSimInterval == 0) {
        simSpeed += 10;
        displayGenerationCount();
    }
}

function increaseSpeed() {
    if (simSpeed > 50 && simSpeed <=2000 && runSimInterval == 0) {
        simSpeed -= 10;
        displayGenerationCount();
    }
}