var Controller = function() {
	this.accelerationKey = keyboard.KEY.J;
	this.brakeKey = keyboard.KEY.K;

	this.directionKeys = new Array();
	this.directionKeys[DIRECTIONS.up] = keyboard.KEY.UP;
	this.directionKeys[DIRECTIONS.down] = keyboard.KEY.DOWN;
	this.directionKeys[DIRECTIONS.left] = keyboard.KEY.LEFT;
	this.directionKeys[DIRECTIONS.right] = keyboard.KEY.RIGHT;
	this.upKey = keyboard.KEY.W;
	this.downKey = keyboard.KEY.S;
	this.leftKey = keyboard.KEY.A;
	this.rightKey = keyboard.KEY.D;

	this.logging = false;
	this.direction = DIRECTIONS.none;
}

Controller.prototype.isAccelerating = function() {

	var retVal = keyboard.keyHeld(this.directionKeys[this.direction]) &&
				 ! keyboard.keyHeld(this.directionKeys[getOppositeDirection(this.direction)]);

	/*var retVal = keyboard.keyHeld(this.accelerationKey) && ! keyboard.keyHeld(this.brakeKey);*/
	if (retVal && this.logging && console)
		console.log("Controller::isAccelerating() returns true.")
	return retVal;
}

Controller.prototype.isBraking = function() {
	var retVal = keyboard.keyHeld(this.directionKeys[getOppositeDirection(this.direction)]) &&
				 ! keyboard.keyHeld(this.directionKeys[this.direction]);
	/*var retVal = keyboard.keyHeld(this.brakeKey) && ! keyboard.keyHeld(this.accelerationKey);*/
	if (retVal && this.logging && console)
		console.log("Controller::isBraking() returns true.")
	return retVal;
}

Controller.prototype.isTurning = function(direction) {
	var retVal = keyboard.keyHeld(this.directionKeys[direction]) && 
				 ! keyboard.keyHeld(this.directionKeys[getOppositeDirection(this.direction)]);
	if (retVal && this.logging && console)
		console.log("Controller::isTurning() returns true for direction ", direction)
	return retVal;
}

Controller.prototype.isTurningUp = function() {
	var retVal = keyboard.keyHeld(this.upKey) && ! keyboard.keyHeld(this.downKey);
	if (retVal && this.logging && console)
		console.log("Controller::isTurningUp() returns true.")
	return retVal;
}

/* Turn down for what?? */
Controller.prototype.isTurningDown = function() {
	var retVal = keyboard.keyHeld(this.downKey) && ! keyboard.keyHeld(this.upKey);
	if (retVal && this.logging && console)
		console.log("Controller::isTurningDown() returns true.")
	return retVal;
}

Controller.prototype.isTurningLeft = function() {
	var retVal = keyboard.keyHeld(this.leftKey) && ! keyboard.keyHeld(this.rightKey);
	if (retVal && this.logging && console)
		console.log("Controller::isTurningLeft() returns true.")
	return retVal;
}

Controller.prototype.isTurningRight = function() {
	var retVal = keyboard.keyHeld(this.rightKey) && ! keyboard.keyHeld(this.leftKey);
	if (retVal && this.logging && console)
		console.log("Controller::isTurningRight() returns true.")
	return retVal;
}