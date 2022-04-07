var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "grey";
const cellWidth = 25;
const cellHeight = 25;
const cols = Math.floor(canvas.width/cellWidth);
const rows = Math.floor(canvas.height/cellHeight)+2;

var cells = [];

// generate cells array
for (r=0;r<rows;r++) {
    for (c=0;c<cols;c++) {
        var cell = {
            x: c*cellWidth+1,
            y: r*cellHeight+1-cellHeight,
            status: 0,
        };
        cells.push(cell);
    }
};

// create cells on canvas
generateCells();
function generateCells() {
    for (i=0;i<cells.length-1;i++) {
        var cell = cells[i];
        cell.id = i - 39;
        ctx.fillRect(cell.x,cell.y,cellWidth-1,cellHeight-1);
        if (cells[i+1].status == 1) {
            ctx.fillStyle = "green";
            ctx.fill();
        } else 
            ctx.fillStyle = "grey";
            ctx.fill();
    }
}


function clearCells() {
    for (i=0;i<cells.length;i++) {
        var cell = cells[i];
        cell.status = 0;
        generateCells();
    }
}

// make cells clickable
canvas.addEventListener("click", function(e) { 
    for (i=0;i<cells.length;i++) {
        var cell = cells[i];
        var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
        var mouseX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
        var mouseY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
        //document.getElementById("gens").innerText = `MouseX: ${mouseX} MouseY: ${mouseY} CellX: ${cell.x} CellX+W: ${cell.x+cellHeight} cellY: ${cell.y} cellY+H: ${cell.y+cellHeight}`;
        if (mouseX > cell.x && mouseX < (cell.x + cellWidth) && mouseY > cell.y && mouseY < (cell.y + cellHeight)) {
            if (cell.status == 0) {
                cell.status = 1;
            } else
            cell.status = 0;
            console.log(`clicked cell: ${cell.id} new status: ${cell.status}`);
            generateCells();
        }
    }
});

