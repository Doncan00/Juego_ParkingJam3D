let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let cars = [];
let score = 0;
let isCarMoving = false;

const carImages = {};

function loadCarImages(callback) {
    let imagesLoaded = 0;
    carSizes.forEach((carSize, index) => {
        const img = new Image();
        img.src = carSize.imageSrc;
        img.onload = () => {
            carImages[index] = img;
            imagesLoaded++;
            if (imagesLoaded === carSizes.length) {
                callback();
            }
        };
    });
}



const carSizes = [
    { width: 1, height: 1, imageSrc: './img/carHor1.png' },
    { width: 1, height: 2, imageSrc: './img/carVer2.png' },
    { width: 1, height: 3, imageSrc: './img/carVer3.png' },
    { width: 2, height: 1, imageSrc: './img/carHor2.png' },
    { width: 3, height: 1, imageSrc: './img/carHor3.png' }
];


function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function isPositionValid(x, y, width, height) {
    if (x < 1 || y < 1 || x + width > parkingLotWidth - 1 || y + height > parkingLotHeight - 1) {
        return false;
    }

    for (let car of cars) {
        if (
            x < car.x + car.width &&
            x + width > car.x &&
            y < car.y + car.height &&
            y + height > car.y
        ) {
            return false;
        }
    }

    return true;
}



function getRandomPosition(size) {
    const { width, height } = size;
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        x = Math.floor(Math.random() * (parkingLotWidth - width + 1));
        y = Math.floor(Math.random() * (parkingLotHeight - height + 1));
        attempts++;
    } while (!isPositionValid(x, y, width, height) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        console.error("No se pudo encontrar una posición válida para el carro.");
        return null;
    }

    return { x, y };
}

function createRandomCars(numCars) {
    for (let i = 0; i < numCars; i++) {
        const carSize = carSizes[Math.floor(Math.random() * carSizes.length)]; // Selecciona un tamaño aleatorio
        const direction = carSize.width === 1 ? 'vertical' : 'horizontal'; // Determina la dirección basándose en el tamaño

        let position;
        do {
            position = getRandomPosition(carSize);
        } while (position === null);

        const { x, y } = position;

         cars.push(new Car(x, y, carSize.width, carSize.height, carSizes.indexOf(carSize), direction));
    }
}


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


loadCarImages(() => {
    createRandomCars(9);
    drawParkingLot();
});
