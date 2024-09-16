class Car {
    constructor(x, y, width, height, imageIndex, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageIndex = imageIndex; // Índice de la imagen del carro
        this.direction = direction; // Vertical u horizontal
    }

    draw() {
        const img = carImages[this.imageIndex];
        if (img) {
            ctx.drawImage(img, this.x * gridSize, this.y * gridSize, this.width * gridSize, this.height * gridSize);
        }
    }

    containsPoint(px, py) {
        return px >= this.x * gridSize && px <= (this.x + this.width) * gridSize &&
               py >= this.y * gridSize && py <= (this.y + this.height) * gridSize;
    }

    canMove(dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;

        if (newX < 0) newX = parkingLotWidth - this.width;
        if (newX + this.width > parkingLotWidth) newX = 0;
        if (newY < 0) newY = parkingLotHeight - this.height;
        if (newY + this.height > parkingLotHeight) newY = 0;

        for (let wall of walls) {
            if (newX < wall.x + wall.width &&
                newX + this.width > wall.x &&
                newY < wall.y + wall.height &&
                newY + this.height > wall.y) {
                return false;
            }
        }

        for (let otherCar of cars) {
            if (otherCar !== this) {
                if (newX < otherCar.x + otherCar.width &&
                    newX + this.width > otherCar.x &&
                    newY < otherCar.y + otherCar.height &&
                    newY + this.height > otherCar.y) {
                    return false;
                }
            }
        }

        return { x: newX, y: newY };
    }

    moveAutomatically() {
        if (isCarMoving) return;

        let dx = 0, dy = 0;
        if (this.height === 1) {
            dx = Math.random() > 0.5 ? 1 : -1; 
        } else if (this.width === 1) {
            dy = Math.random() > 0.5 ? 1 : -1; 
        } else {
            return;
        }

        isCarMoving = true;

        const interval = setInterval(() => {
            const newPos = this.canMove(dx, dy);
            if (newPos) {
                this.x = newPos.x;
                this.y = newPos.y;
                drawParkingLot();
            } else {
                clearInterval(interval);
                isCarMoving = false;
            }

            for (let exit of exits) {
                if (this.isInExit(exit)) {
                    score++;

                    cars.splice(cars.indexOf(this), 1);

                    drawParkingLot();

                    clearInterval(interval);
                    isCarMoving = false; 

                    alert('¡Auto salió del estacionamiento! Puntaje: ' + score);
                    break;
                }
            }
        }, 100);
    }

    isInExit(exit) {
        return (
            this.x >= exit.x &&
            this.x + this.width <= exit.x + exit.width &&
            this.y >= exit.y &&
            this.y + this.height <= exit.y + exit.height
        );
    }
}