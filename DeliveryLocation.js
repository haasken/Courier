var DeliveryLocation = function(posX, posY, type) {
	this.removeThis = false;
	this.type = type;

	this.animationRunner = new AnimationRunner(this.posX, this.posY, 0, 0);
	
	/* Set the animation correctly according to this delivery location type. */
	if (this.type == LOCATIONS.pickup) {
		this.animationRunner.setLoopingAnim(ANIMS.pickupLocation);
		this.color = COLORS.green;
	}
	else if (this.type == LOCATIONS.dropoff) {
		this.animationRunner.setLoopingAnim(ANIMS.dropoffLocation);
		this.color = COLORS.blue;
	}

	this.width = ANIMS.pickupLocation.image.frameWidth;
	this.height = ANIMS.pickupLocation.image.frameHeight;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX - grid.posX) - this.width / 2 + grid.posX;
	this.posY = grid.snapToGrid(posY - grid.posY) - this.height / 2 + grid.posY;

	/* Start the timer right when this delivery location is spawned. */
	this.timer = new Timer(deliveryExpirationSeconds);
}

DeliveryLocation.prototype.update = function() {
	/* Remove thy self if no time remains. */
	if (this.timer.isExpired()) {
		this.removeThis = true;
	}
	this.animationRunner.update(this.posX, this.posY);
}

DeliveryLocation.prototype.draw = function(context) {
	this.animationRunner.draw(context);

	/* Draw the time remaining on the dropoff location. */
	var secondsRemaining = this.timer.getSecondsRemaining();
	context.font="20px Georgia";
	context.fillStyle = this.color;
	context.fillText(secondsRemaining.toFixed(0), this.posX, this.posY);
}

/* Starts the timer for this delivery location. Once the timer is done, this
 * delivery location will disappear */
DeliveryLocation.prototype.startTimer = function(timerSeconds) {
	this.timer = new Timer(timerSeconds);
}

/* Called when the courier enters the delivery location. This marks the delivery location
 * for removal.  If this is a pickupLocation, it also spawns a dropoff location. */
DeliveryLocation.prototype.enterLocation = function() {
	this.removeThis = true;

	/* Create a random dropoff location if this was a pickup location. */
	if (this.type == LOCATIONS.pickup) {
		var dropoff = getRandomDeliveryLocation(LOCATIONS.dropoff);
		dropoff.startTimer(dropoffExpireSeconds);

		/* Calculate the distance from this delivery location for calculating timer */
		//TODO

		dropoffLocations.push(dropoff);
	}
}

function getRandomDeliveryLocation(type) {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new DeliveryLocation(randPosX, randPosY, type);
}