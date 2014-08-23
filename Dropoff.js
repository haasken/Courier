var Dropoff = function(posX, posY) {
	this.width = 20;
	this.height = 20;

	/* Turn the arbitrary positions into positions on the grid */
	this.posX = grid.snapToGrid(posX) - this.width / 2;
	this.posY = grid.snapToGrid(posY) - this.height / 2;

	this.color = COLORS.red;
}

/* Called when the courier reaches the dropoff and drops off the package.  This
 * marks the dropoff for removal from the dropoffs list, and gives the player
 * points depending on how quickly the dropoff was completed. */
Dropoff.prototype.complete = function() {
	this.removeThis = true;
}

Dropoff.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.posX, this.posY, this.width, this.height);
}

function getRandomDropoff() {
	var randPosX = Math.random() * gridWidth + grid.posX;
	var randPosY = Math.random() * gridHeight + grid.posY;

	return new Dropoff(randPosX, randPosY);
}