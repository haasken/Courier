var Package = function(posX, posY) {
	this.color = COLORS.green;
	this.removeThis = false;

	this.animationRunner = new AnimationRunner(this.posX, this.posY, 0, 0);
	this.animationRunner.setLoopingAnim(ANIMS.pickupLocation);

	this.width = ANIMS.pickupLocation.image.frameWidth;
	this.height = ANIMS.pickupLocation.image.frameHeight;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX - grid.posX) - this.width / 2 + grid.posX;
	this.posY = grid.snapToGrid(posY - grid.posY) - this.height / 2 + grid.posY;

	/* Start the timer right when this package is spawned. */
	this.timer = new Timer(packageExpireSeconds);
}

Package.prototype.update = function() {
	/* Remove thy self if no time remains. */
	if (this.timer.isExpired()) {
		this.removeThis = true;
	}
	this.animationRunner.update(this.posX, this.posY);
}

Package.prototype.draw = function(context) {
	this.animationRunner.draw(context);

	/* Draw the time remaining on the dropoff location. */
	var secondsRemaining = this.timer.getSecondsRemaining();
	context.font="14px Georgia";
	context.fillStyle = this.color;
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