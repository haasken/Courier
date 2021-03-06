var Controller = function() {
	this.accelerationKey = keyboard.KEY.J;
	this.brakeKey = keyboard.KEY.K;

	/* directionKeys is an array of arrays which map from DIRECTIONS to keyboard.KEYS */
	this.directionKeys = new Array();

	var wasdDirs = new Array();
	wasdDirs[DIRECTIONS.up] = keyboard.KEY.W;
	wasdDirs[DIRECTIONS.down] = keyboard.KEY.S;
	wasdDirs[DIRECTIONS.left] = keyboard.KEY.A;
	wasdDirs[DIRECTIONS.right] = keyboard.KEY.D;

	var arrowDirs = new Array();
	arrowDirs[DIRECTIONS.up] = keyboard.KEY.UP;
	arrowDirs[DIRECTIONS.down] = keyboard.KEY.DOWN;
	arrowDirs[DIRECTIONS.left] = keyboard.KEY.LEFT;
	arrowDirs[DIRECTIONS.right] = keyboard.KEY.RIGHT;

	this.directionKeys[0] = (wasdDirs);
	this.directionKeys[1] = (arrowDirs);

	this.logging = false;
	this.direction = DIRECTIONS.none;
}

Controller.prototype.isAccelerating = function() {

	var retVal = false;
	for (var i = 0; i < this.directionKeys.length; i++) {
		var dirMap = this.directionKeys[i];
		retVal = retVal || 
				 (keyboard.keyHeld(dirMap[this.direction]) &&
				  ! keyboard.keyHeld(dirMap[getOppositeDirection(this.direction)]));
	}

	/*var retVal = keyboard.keyHeld(this.accelerationKey) && ! keyboard.keyHeld(this.brakeKey);*/
	if (retVal && this.logging && console)
		console.log("Controller::isAccelerating() returns true.")
	return retVal;
}

Controller.prototype.isBraking = function() {
	var retVal = false;
	for (var i = 0; i < this.directionKeys.length; i++) {
		var dirMap = this.directionKeys[i];
		retVal = retVal ||
				 (keyboard.keyHeld(dirMap[getOppositeDirection(this.direction)]) &&
				  ! keyboard.keyHeld(dirMap[this.direction]));
	}
	/*var retVal = keyboard.keyHeld(this.brakeKey) && ! keyboard.keyHeld(this.accelerationKey);*/
	if (retVal && this.logging && console)
		console.log("Controller::isBraking() returns true.")
	return retVal;
}

Controller.prototype.isTurning = function(direction) {
	var retVal = false;
	for (var i = 0; i < this.directionKeys.length; i++) {
		var dirMap = this.directionKeys[i];
		retVal = retVal || 
				 (keyboard.keyHeld(dirMap[direction]) && 
				  ! keyboard.keyHeld(dirMap[getOppositeDirection(this.direction)]));
	}
	if (retVal && this.logging && console)
		console.log("Controller::isTurning() returns true for direction ", direction)
	return retVal;
}