var Courier = function(posX, posY) {
	/* Start out facing to the right. */
	this.direction = DIRECTIONS.right;

	/* Set up the images for each direction. */
	this.images = new Array();
	this.images[DIRECTIONS.up] = IMAGES.redCarUp;
	this.images[DIRECTIONS.down] = IMAGES.redCarDown;
	this.images[DIRECTIONS.left] = IMAGES.redCarLeft;
	this.images[DIRECTIONS.right] = IMAGES.redCarRight;
	this.images[DIRECTIONS.horizontal] = IMAGES.redCarLeft;
	/* Set the current image and update the Courier width and height */
	this.updateImage();

	this.posX = grid.snapToGrid(posX - grid.posX) + grid.posX - this.width / 2;
	this.posY = grid.snapToGrid(posY - grid.posY) + grid.posY - this.height / 2;

	/* The current accelaration, assumed to be directed in this.direction */
	this.acceleration = 0;
	/* The current speed, assumed to be directed in this.direction */
	this.speed = 0;

	/* The acceleration applied when using the gas/brake */
	this.maxAcceleration = 2;
	/* The acceleration that is applied when not applying gas/brake,
	 * assumed to be directed opposite this.direction. */
	this.friction = 1;

	/* The maximum speed the courier can achieve.
	 * This may be modified by external entities. */
	/* e.g. in the future, we can do this for traffic:
	 * 		this.maxSpeed = grid.getSpeedAtPoint(this.posX, this.posY)
	 */
	this.maxSpeed = 15;

	/* The maximum speed the courier may be traveling when it turns.
	 * At speeds greater than this, the courier will not turn when requested. */
	this.maxTurnSpeed = 12;
}

Courier.prototype.control = function() {
	if (controller.isAccelerating()) {
		this.acceleration = this.maxAcceleration;
	}
	else if (controller.isBraking()) {
		this.acceleration = -this.maxAcceleration;
		/* Do not allow braking to cause courier to drive in reverse. */
		if (this.speed <= 0) {
			this.speed = 0;
			this.acceleration = 0;
		}
	}
	/* Apply friction to slow down the car when no gas or brake is applied. */
	else if (this.speed > 0) {
		this.acceleration = -this.friction;
	}

	/* If traveling vertically, and trying to turn horizontally */
	if ((this.direction == DIRECTIONS.up || this.direction == DIRECTIONS.down) &&
		(controller.isTurningLeft() || controller.isTurningRight())) {
		/* Only allow to change directions if the speed is less than the max turning speed. */		
		if (this.speed < this.maxTurnSpeed) {
			/* Check if near enough a horizontal line to turn. */
			if (grid.nearGridLine(this.centerY - grid.posY)) {
				/* Snap to the nearest horizontal line, and change direction. */
				this.direction = controller.isTurningRight() ? DIRECTIONS.right : DIRECTIONS.left;
				/* We just turned. Set the correct image for the facing direction. */
				this.updateImage();
				var linePosY = grid.snapToGrid(this.centerY - grid.posY) + grid.posY;
				this.posY = linePosY - this.height / 2;
			}
		}
	}
	/* Otherwise, if traveling horizontally, and trying to turn vertically */
	else if ((this.direction == DIRECTIONS.left || this.direction == DIRECTIONS.right) &&
		(controller.isTurningUp() || controller.isTurningDown())) {
		/* Only allow to change directions if the speed is less than the max turning speed. */		
		if (this.speed < this.maxTurnSpeed) {
			/* Check if near enough a vertical line to turn. */
			if (grid.nearGridLine(this.centerX - grid.posX)) {
				/* Snap to the nearest vertical line, and change direction. */
				this.direction = controller.isTurningUp() ? DIRECTIONS.up : DIRECTIONS.down;
				/* We just turned. Set the correct image for the facing direction. */
				this.updateImage();
				var linePosX = grid.snapToGrid(this.centerX - grid.posX) + grid.posX;
				this.posX = linePosX - this.width / 2;
			}
		}
	}
}

/* Set this.currentImage to the correct image according to this.direction.
 * Also update this.width, this.height, this.centerX, this.centerY appropriately for
 * the new image. */
Courier.prototype.updateImage = function() {
	this.currentImage = this.images[this.direction];
	/* Update the width and height according to the current image. */
	this.width = this.currentImage.image.width;
	this.height = this.currentImage.image.height;

	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;
}

/* Old control function, deprecated.  Use Courier.control().
 * This function depends on acc{X,Y} and vel{X,Y} being maintained. It allows the player
 * to control the courier using the arrow keys. */
Courier.prototype.controlOld = function() {
	if (this.direction == DIRECTIONS.none) {
		// Move in the first direction of a key held
		if (keyboard.keyHeld(keyboard.KEY.LEFT) || 
				keyboard.keyHeld(keyboard.KEY.RIGHT))
			this.direction = DIRECTIONS.horizontal;
		else if (keyboard.keyHeld(keyboard.KEY.UP) ||
				 	keyboard.keyHeld(keyboard.KEY.DOWN))
			this.direction = DIRECTIONS.vertical;
		else
			return;
	}
	
	if (this.direction == DIRECTIONS.horizontal) {
		// Only allow movement in the x direction
		if (keyboard.keyHeld(keyboard.KEY.LEFT)) {
			if (keyboard.keyHeld(keyboard.KEY.RIGHT)) {
				this.accX = 0;
			}
			else
				this.accX = -this.acceleration;
		}
		else if (keyboard.keyHeld(keyboard.KEY.RIGHT)) {
			this.accX = this.acceleration;
		}
		else
			this.accX = 0;

		// Allow directions to change if on grid
		if (Math.abs(this.velX) < this.maxTurnSpeed &&
				(keyboard.keyHeld(keyboard.KEY.UP) || keyboard.keyHeld(keyboard.KEY.DOWN))) {
			grid.attemptTurnToVert(this);
		}
	}
	else if (this.direction == DIRECTIONS.vertical) {
		// Only allow movement in the y direction
		if (keyboard.keyHeld(keyboard.KEY.UP)) {
			if (keyboard.keyHeld(keyboard.KEY.DOWN)) {
				this.accY = 0;
			}
			else
				this.accY = -this.acceleration;
		} else if (keyboard.keyHeld(keyboard.KEY.DOWN)) {
			this.accY = this.acceleration;
		}
		else
			this.accY = 0;

		// Allow directions to change if on grid
		if (Math.abs(this.velY) < this.maxTurnSpeed &&
				   (keyboard.keyHeld(keyboard.KEY.LEFT) || keyboard.keyHeld(keyboard.KEY.RIGHT))) {
			grid.attemptTurnToHoriz(this);
		}
	}
}

/* Stops the courier by setting acceleration and speed to zero. */
Courier.prototype.stop = function() {
	this.speed = 0;
	this.acceleration = 0;
}

/* Updates velocity and position of the courier. */
Courier.prototype.update = function() {

	/* Add acceleration to speed and make sure it doesn't exceed this.maxSpeed */
	this.speed += this.acceleration;
	if (this.speed > this.maxSpeed) {
		this.speed = this.maxSpeed;
	}
	if (this.speed < 0) {
		this.speed = 0;
	}

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

	/* We updated this.posX and this.posY, so we better update center positions. */
	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;

	/* Make sure we are still in the bounds of the level */
	if (this.posX < boundsLeft) {
		this.posX = boundsLeft;
		this.stop();
	}
	else if (this.posX + this.width > boundsRight) {
		this.posX = boundsRight - this.width;
		this.stop();
	}

	if (this.posY < boundsTop) {
		this.posY = boundsTop;
		this.stop();
	}
	else if (this.posY + this.height > boundsBottom) {
		this.posY = boundsBottom - this.height;
		this.stop();
	}
}

Courier.prototype.draw = function(context) {
	this.currentImage.draw(context, this.posX, this.posY, 1);
}