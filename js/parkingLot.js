const gridSize = 50;
const parkingLotWidth = 10;
const parkingLotHeight = 10;
const walls = [];
const exits = [];

// Crear muro
function createWall(x, y, width, height) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(x * gridSize, y * gridSize, width * gridSize, height * gridSize);
    walls.push({ x, y, width, height });
}

// Crear salida
function createExit(x, y, width, height) {
    exits.push({ x, y, width, height });
}

// Muros con las salidas
function createWalls() {
    for (let i = 0; i < parkingLotWidth; i++) {
        if (i !== 2 && i !== 7) {
            createWall(i, 0, 1, 1);
        } else {
            createExit(i, 0, 1, 1);
        }
    }
    for (let i = 0; i < parkingLotWidth; i++) {
        if (i !== 4 && i !== 5) {
            createWall(i, parkingLotHeight - 1, 1, 1);
        } else {
            createExit(i, parkingLotHeight - 1, 1, 1);
        }
    }
    for (let i = 0; i < parkingLotHeight; i++) {
        if (i !== 3) {
            createWall(0, i, 1, 1);
        } else {
            createExit(0, i, 1, 1);
        }
    }
    for (let i = 0; i < parkingLotHeight; i++) {
        if (i !== 6) {
            createWall(parkingLotWidth - 1, i, 1, 1);
        } else {
            createExit(parkingLotWidth - 1, i, 1, 1);
        }
    }
}


function drawParkingLot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createWalls();

    exits.forEach(exit => {
        ctx.fillStyle = "green";
        ctx.fillRect(exit.x * gridSize, exit.y * gridSize, exit.width * gridSize, exit.height * gridSize);
    });

    cars.forEach(car => {
        car.draw();
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Puntaje: " + score, 10, 20);
}
