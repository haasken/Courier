var Dropoff = function(posX, posY) {
	this.width = 20;
	this.height = 20;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX - grid.posX) - this.width / 2 + grid.posX;
	this.posY = grid.snapToGrid(posY - grid.posY) - this.height / 2 + grid.posY;

	this.animationRunner = new AnimationRunner(this.posX, this.posY, 0, 0);
	this.animationRunner.setLoopingAnim(ANIMS.dropoffLocation);

	this.colors = COLORS.blue;

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
	this.animationRunner.update(this.posX, this.posY);
}

Dropoff.prototype.draw = function(context) {
	this.animationRunner.draw(context);

	/* Draw the time remaining on the dropoff location. */
	var secondsRemaining = this.timer.getSecondsRemaining();
	context.fillStyle = this.color;
	context.font="14px Georgia";
	context.fillText(secondsRemaining.toFixed(0), this.posX, this.posY);
}

function getRandomDropoff() {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new Dropoff(randPosX, randPosY);
}