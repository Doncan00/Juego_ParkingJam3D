let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let cars = [];
let score = 0;
let isCarMoving = false;

const carSizes = [
    { width: 1, height: 1 },
    { width: 2, height: 1 },
    { width: 1, height: 2 },
    { width: 3, height: 1 },
    { width: 1, height: 3 }
];

function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function calculateAvailablePositions() {
    let availablePositions = [];
    
    for (let x = 0; x < parkingLotWidth; x++) {
        for (let y = 0; y < parkingLotHeight; y++) {
            carSizes.forEach(size => {
                const { width, height } = size;
                
                if (x + width <= parkingLotWidth && y + height <= parkingLotHeight) {
                    const isValidPosition = !walls.some(wall =>
                        x < wall.x + wall.width &&
                        x + width > wall.x &&
                        y < wall.y + wall.height &&
                        y + height > wall.y
                    ) && !cars.some(car => car.collidesWith(x, y, width, height));

                    if (isValidPosition) {
                        availablePositions.push({ x, y, width, height });
                    }
                }
            });
        }
    }
    
    return availablePositions;
}

function createRandomCars(numCars) {
    const availablePositions = calculateAvailablePositions();
    
    if (availablePositions.length < numCars) {
        console.error("No hay suficientes posiciones disponibles para crear todos los autos.");
        return;
    }
    
    for (let i = 0; i < numCars; i++) {
        const position = availablePositions.splice(Math.floor(Math.random() * availablePositions.length), 1)[0];
        const { x, y, width, height } = position;
        const direction = width === 1 ? 'vertical' : 'horizontal'; 

        cars.push(new Car(x, y, width, height, getRandomColor(), direction));
    }
}

createRandomCars(9); 

canvas.addEventListener('click', (e) => {
    if (isCarMoving) return; 

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let car of cars) {
        if (car.containsPoint(mouseX, mouseY)) {
            car.moveAutomatically(); 
            isCarMoving = true;
            break;
        }
    }
});

function drawParkingLot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createWalls();

    cars.forEach(car => {
        car.draw();
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Puntaje: " + score, 10, 20);
}

drawParkingLot();
