let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

const gridSize = 50;
const parkingLotRows = 10; // Número de filas del estacionamiento
const parkingLotCols = 10; // Número de columnas del estacionamiento
const parkingLotWidth = parkingLotCols * gridSize;
const parkingLotHeight = parkingLotRows * gridSize;
let parkingX, parkingY;

let cars = [];
let score = 0;
let isCarMoving = false;

const carImages = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    parkingX = (canvas.width - parkingLotWidth) / 2;
    parkingY = (canvas.height - parkingLotHeight) / 2;

    drawParkingLot();
}

window.addEventListener('resize', resizeCanvas); 
resizeCanvas();

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

function isPositionValid(x, y, width, height) {
    if (x < 0 || y < 0 || x + width > parkingLotCols || y + height > parkingLotRows) {
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
        x = Math.floor(Math.random() * (parkingLotCols - width + 1));
        y = Math.floor(Math.random() * (parkingLotRows - height + 1));
        attempts++;
    } while (!isPositionValid(x, y, width, height) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        return null;
    }

    return { x, y };
}

function fillParkingLot() {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
        const carSize = carSizes[Math.floor(Math.random() * carSizes.length)];
        let position = getRandomPosition(carSize);

        if (position !== null) {
            const { x, y } = position;
            const direction = carSize.width === 1 ? 'vertical' : 'horizontal';
            cars.push(new Car(x, y, carSize.width, carSize.height, carSizes.indexOf(carSize), direction));
            drawParkingLot();
            attempts = 0;
        } else {
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn("No se pudo encontrar más espacio para carros.");
            break;
        }
    }
}

function drawParkingLot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(parkingX, parkingY, parkingLotWidth, parkingLotHeight);

    cars.forEach(car => {
        car.draw();
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Puntaje: " + score, 10, 20);
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

loadCarImages(() => {
    fillParkingLot();
});
