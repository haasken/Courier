var Car = function(posX, posY) {

	/* Select a random direction first, so we can select the correct image. */
	var random = Math.random();
	if (random < 0.25) {
		this.direction = DIRECTIONS.up;
	}
	else if (random < 0.5) {
		this.direction = DIRECTIONS.down;
	}
	else if (random < 0.75) {
		this.direction = DIRECTIONS.left;
	}
	else {
		this.direction = DIRECTIONS.right;
	}

	this.images = new Array();
	this.images[DIRECTIONS.up] = IMAGES.blueCarUp;
	this.images[DIRECTIONS.down] = IMAGES.blueCarDown;
	this.images[DIRECTIONS.left] = IMAGES.blueCarLeft;
	this.images[DIRECTIONS.right] = IMAGES.blueCarRight;
	this.images[DIRECTIONS.horizontal] = IMAGES.blueCarLeft;
	/* Set the current image and update the Courier width and height */
	this.updateImage();

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX - grid.posX) - this.width / 2 + grid.posX;
	this.posY = grid.snapToGrid(posY - grid.posY) - this.height / 2 + grid.posY;

	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;

	this.speed = 5;
	this.turnProbability = 0.4;
	/* This prevents the cow from turning multiple times at one intersection. */
	this.intersectionExamined = false;
}

Car.prototype.updateImage = function() {
	this.currentImage = this.images[this.direction];
	/* Update the width and height according to the current image. */
	this.width = this.currentImage.image.width;
	this.height = this.currentImage.image.height;

	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;
}

Car.prototype.turnToHoriz = function(newDir) {
	if (grid.onLeftEdge(this.centerX))
		this.direction = DIRECTIONS.right;
	else if (grid.onRightEdge(this.centerX))
		this.direction = DIRECTIONS.left;
	else if (Math.random() < 0.5) 
		this.direction = DIRECTIONS.left;
	else
		this.direction = DIRECTIONS.right;

	this.updateImage();

	var linePosY = grid.snapToGrid(this.centerY - grid.posY) + grid.posY;
	this.posY = linePosY - this.height / 2;
}

Car.prototype.turnToVert = function() {
	if (grid.onTopEdge(this.centerY))
		this.direction = DIRECTIONS.down;
	else if (grid.onBottomEdge(this.centerY))
		this.direction = DIRECTIONS.up;
	else if (Math.random() < 0.5)
		this.direction = DIRECTIONS.up;
	else
		this.direction = DIRECTIONS.down;

	this.updateImage();

	var linePosX = grid.snapToGrid(this.centerX - grid.posX) + grid.posX;
	this.posX = linePosX - this.width / 2;
}

Car.prototype.crash = function() {
	console.log("You crashed!  Game over!");
	currentGameState = STATES.lost;
}

Car.prototype.update = function() { 
	/* Apply speed to position according to travel direction. */
	switch(this.direction) {
		case DIRECTIONS.up:
			this.posY -= this.speed;
			break;
		case DIRECTIONS.down:
			this.posY += this.speed;
			break;
		case DIRECTIONS.left:
			this.posX -= this.speed;
			break;
		case DIRECTIONS.right:
			this.posX += this.speed;
			break
	}

	if (this.direction == DIRECTIONS.up || this.direction == DIRECTIONS.down) {
		if (grid.nearGridLine(this.centerY - grid.posY)) {
			if (! this.intersectionExamined) {
				this.intersectionExamined = true;
				if (Math.random() < this.turnProbability || grid.nearHorizEdge(this.centerY)) {
					this.turnToHoriz();
				}
			}
		}
		else
			this.intersectionExamined = false;
	}

	else { 
		/* this.direction == DIRECTIONS.left || this.direction == DIRECTIONS.right */
		if (grid.nearGridLine(this.centerX - grid.posX)) {
			if (! this.intersectionExamined) {
				this.intersectionExamined = true;
				if (Math.random() < this.turnProbability || grid.nearVertEdge(this.centerX)) {
					this.turnToVert();
				}
			}
		}
		else
			this.intersectionExamined = false;
	}

	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;
}

Car.prototype.draw = function(context) {
	this.currentImage.draw(context, this.posX, this.posY, 1);
}

function getRandomCar() {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new Car(randPosX, randPosY);
}