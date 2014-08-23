gridWidth = 40;

var Courier = function(posX, posY) {
	this.width = courierWidth;
	this.height = courierHeight;

	this.posX = posX;
	this.posY = posY;

	this.velX = 0;
	this.velY = 0;
	this.accX = 0;
	this.accY = 0;

	this.acceleration = 2;

	/* The maximum speed the courier can achieve
	 * This may be modified by external entities */
	this.maxSpeed = 10;
	// this.maxSpeed = grid.getSpeedAtPoint(this.posX, this.posY)

	/* The maximum speed the courier may be traveling when it turns. */
	this.maxTurnSpeed = 5;

	this.color = COLORS.black;

	this.direction = DIRECTIONS.none;
}

Courier.prototype.control = function() {
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

Courier.prototype.stop = function() {
	this.accX = 0;
	this.accY = 0;
	this.velX = 0;
	this.velY = 0;
}

Courier.prototype.update = function() {
	this.velX += this.accX;
	this.velY += this.accY;

	if (this.velX > this.maxSpeed) this.velX = this.maxSpeed;
	if (this.velX < -this.maxSpeed) this.velX = -this.maxSpeed;	
	if (this.velY > this.maxSpeed) this.velY = this.maxSpeed;
	if (this.velY < -this.maxSpeed) this.velY = -this.maxSpeed;

	this.posX += this.velX;
	this.posY += this.velY;
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
	context.fillStyle = this.color;
	context.fillRect(this.posX, this.posY, this.width, this.height);
}