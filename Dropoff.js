var Dropoff = function(posX, posY) {
	this.width = 20;
	this.height = 20;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX) - this.width / 2;
	this.posY = grid.snapToGrid(posY) - this.height / 2;

	this.color = COLORS.red;

	/* The timer until this dropoff expires */
	this.timer = null;
}

/* Called when the courier reaches the dropoff and drops off the package.  This
 * marks the dropoff for removal from the dropoffs list, and gives the player
 * points depending on how quickly the dropoff was completed. */
Dropoff.prototype.complete = function() {
	this.removeThis = true;
}

/* Starts the timer for this dropoff location. Once the timer is done, this
 * dropoff location will disappear */
Dropoff.prototype.startTimer = function(timerSeconds) {
	this.timer = new Timer(timerSeconds);
}

Dropoff.prototype.update = function() {
	/* Remove thy self if no time remains. */
	if (this.timer.isExpired()) {
		this.removeThis = true;
	}
}

Dropoff.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.posX, this.posY, this.width, this.height);

	/* Draw the time remaining on the dropoff location. */
	var secondsRemaining = this.timer.getSecondsRemaining();
	context.font="14px Georgia";
	context.fillText(secondsRemaining.toFixed(0), this.posX, this.posY);
}

function getRandomDropoff() {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new Dropoff(randPosX, randPosY);
}