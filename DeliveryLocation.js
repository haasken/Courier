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

	/* Create a callout for the timer display */
	var calloutDirection = DIRECTIONS.upRight;
	var calloutOriginX = this.posX + this.width;
	var calloutOriginY = this.posY;
	if (grid.onTopEdge(this.posY + this.height / 2) || grid.onRightEdge(this.posX + this.width / 2)) {
		calloutDirection = DIRECTIONS.downLeft;
		calloutOriginX = this.posX;
		calloutOriginY = this.posY + this.height;
	}
	this.callout = new Callout(calloutOriginX, calloutOriginY, calloutDirection, this.color);
}

DeliveryLocation.prototype.update = function() {
	/* Remove thy self if no time remains. */
	if (this.timer.isExpired()) {
		scoreboard.resetMultiplier();
		this.removeThis = true;
	}
	this.animationRunner.update(this.posX, this.posY);
}

DeliveryLocation.prototype.draw = function(context) {
	this.animationRunner.draw(context);

	/* Set the callout's text to the seconds remaining. */
	var secondsRemaining = Math.ceil(this.timer.getSecondsRemaining());
	this.callout.text = secondsRemaining.toFixed(0);

	this.callout.draw(context);


/*	context.font="20px Georgia";
	context.fillStyle = this.color;
	context.fillText(secondsRemaining.toFixed(0), this.posX, this.posY);*/
}

/* Starts the timer for this delivery location. Once the timer is done, this
 * delivery location will disappear */
DeliveryLocation.prototype.startTimer = function(timerSeconds) {
	this.timer = new Timer(timerSeconds);
}

/* Called when the courier enters the delivery location. This marks the delivery location
 * for removal.  If this is a pickup location, it also spawns a dropoff location.  If this
 * is a dropoff location, then it adds to the score. */
DeliveryLocation.prototype.enterLocation = function() {
	this.removeThis = true;

	/* Create a random dropoff location if this was a pickup location. */
	if (this.type == LOCATIONS.pickup) {
		var dropoff = getRandomDeliveryLocation(LOCATIONS.dropoff);
		dropoff.startTimer(deliveryExpirationSeconds);

		/* Calculate the distance from this delivery location for calculating timer */
		//TODO

		dropoffLocations.push(dropoff);
	}
	else if (this.type == LOCATIONS.dropoff) {
		scoreboard.scoreDelivery(this.timer.getSecondsRemaining());
		totalDropoffs += 1;
		console.log("Dropoff seconds remaining: ", this.timer.getSecondsRemaining());
	}
}

function getRandomDeliveryLocation(type) {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new DeliveryLocation(randPosX, randPosY, type);
}