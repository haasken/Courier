var Package = function(posX, posY) {
	this.width = 20;
	this.height = 20;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX) - this.width / 2;
	this.posY = grid.snapToGrid(posY) - this.height / 2;

	this.color = COLORS.blue;
	this.removeThis = false;

	/* Start the timer right when this package is spawned. */
	this.timer = new Timer(packageExpireSeconds);
}

Package.prototype.update = function() {
	/* Remove thy self if no time remains. */
	if (this.timer.isExpired()) {
		this.removeThis = true;
	}
}

Package.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.posX, this.posY, this.width, this.height);

	/* Draw the time remaining on the dropoff location. */
	var secondsRemaining = this.timer.getSecondsRemaining();
	context.font="14px Georgia";
	context.fillText(secondsRemaining.toFixed(0), this.posX, this.posY);
}

/* Called when the courier picks up the package.  This marks the package for
 * removal from the packages list and adds a dropoff point to the dropoffs list. */
Package.prototype.collect = function() {
	this.removeThis = true;

	/* Create a random dropoff point */
	var dropoff = getRandomDropoff();
	dropoff.startTimer(dropoffExpireSeconds);

	/* Calculate the distance from this package for calculating timer */
	//TODO

	dropoffs.push(dropoff);
}

function getRandomPackage() {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new Package(randPosX, randPosY);
}