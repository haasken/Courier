var Grid = function(posX, posY, width, height, spacing) {
	
	/* Location of the top left of the grid. */
	this.posX = posX;
	this.posY = posY;

	this.width = width;
	this.height = height;

	this.spacing = spacing;
	this.snapDistance = this.spacing / 5;
}

/* Takes in a position (in the grid coordinate system) and determines if it
 * is within this.snapDistance of the nearest grid line.  If so, return true. */
Grid.prototype.nearGridLine = function(relPos) {
	var distToGridLine1 = relPos % this.spacing;
	var distToGridLine2 = this.spacing - distToGridLine1;
	return (distToGridLine1 < this.snapDistance || distToGridLine2 < this.snapDistance);
}

Grid.prototype.attemptTurnToVert = function(courier) {
	var relPosX = courier.centerX - this.posX;
	var curXCoord = Math.floor(relPosX / this.spacing);
	var distToRightVert = this.spacing - relPosX % this.spacing;
	var distToLeftVert = relPosX % this.spacing;

	if (distToRightVert < this.snapDistance) {
		courier.stop();
		courier.posX = this.posX + (curXCoord + 1) * this.spacing - courier.width/2;
		courier.direction = DIRECTIONS.vertical;
	}
	else if (distToLeftVert < this.snapDistance) {
		courier.stop();
		courier.posX = this.posX + curXCoord * this.spacing - courier.width/2;
		courier.direction = DIRECTIONS.vertical;
	}
}

Grid.prototype.attemptTurnToHoriz = function(courier) {
	var relPosY = courier.centerY - this.posY;
	var curYCoord = Math.floor(relPosY / this.spacing);
	var distToBottomHoriz = this.spacing - relPosY % this.spacing;
	var distToTopHoriz = relPosY % this.spacing;

	if (distToBottomHoriz < this.snapDistance) {
		courier.stop();
		courier.posY = this.posY + (curYCoord + 1) * this.spacing - courier.height/2;
		courier.direction = DIRECTIONS.horizontal;
	}
	else if (distToTopHoriz < this.snapDistance) {
		courier.stop();
		courier.posY = this.posY + curYCoord * this.spacing - courier.height/2;
		courier.direction = DIRECTIONS.horizontal;
	}
}

/* Takes in a courier and attempts to turn it, if it's close enough
 * to the next grid line. */
Grid.prototype.attemptTurn = function(courier) {
	var curXCoord = Math.floor((courier.centerX - this.posX) / this.spacing);
	var nextXCoord = Math.floor((courier.centerX + courier.velX - this.posX) / this.spacing);
	var distanceToVert = Math.min(this.spacing - (courier.centerX % this.spacing),
								  courier.centerX % this.spacing);

	var curYCoord = Math.floor((courier.centerY - this.posY) / this.spacing);
	var nextYCoord = Math.floor((courier.centerY + courier.velY - this.posY) / this.spacing);
	var distanceToHoriz = Math.min(this.spacing - (courier.centerY % this.spacing),
								   courier.centerY % this.spacing);

	/* If the current x coord is different from the next x coord, then the
	 * courier is about to cross a grid line, so it should turn. */
	if (curXCoord != nextXCoord) { //} || distanceToVert < this.snapDistance) {
		// Stop the X velocity and snap to vertical line
		courier.stop();
		var desiredXCoord = Math.max(curXCoord, nextXCoord);
		courier.posX = this.posX + desiredXCoord * this.spacing - courier.width/2;
		courier.direction = DIRECTIONS.vertical;
	}
	/* Same for the current vs. next y coord */
	if (curYCoord != nextYCoord) { //} || distanceToHoriz < this.snapDistance) {
		// Stop the Y velocity and snap to horizontal line
		courier.stop();
		var desiredYCoord = Math.max(curYCoord, nextYCoord);
		courier.posY = this.posY + desiredYCoord * this.spacing - courier.height/2;
		courier.direction = DIRECTIONS.horizontal;
	}
}

/* Snap a given x or y coordinate (in the grid's coordinate system) 
 * to the nearest grid line.  Note that the returned coordinate is
 * also in terms of the grid's coordinate system. */
Grid.prototype.snapToGrid = function(pos) {
	var curCoord = Math.floor(pos / this.spacing);
	var distToPrevCoord = pos % this.spacing;
	var distToNextCoord = this.spacing - pos % this.spacing;

	if (distToPrevCoord <= distToNextCoord) {
		return curCoord * this.spacing;
	}
	else {
		return (curCoord + 1) * this.spacing;
	}
}

Grid.prototype.draw = function(context) {
	var numHorizLines = Math.floor(this.height / this.spacing);
	var numVertLines = Math.floor(this.width / this.spacing);

	context.save();
	context.translate(this.posX, this.posY);

	/* Draw all the horizontal lines */
	for (var i = 0; i <= numVertLines; i++) {
		var xCoord = i * this.spacing;
		context.beginPath();
		context.moveTo(xCoord, 0);
		context.lineTo(xCoord, this.height);
		context.stroke()
	}

	/* Draw all the vertical lines */
	for (var i = 0; i <= numHorizLines; i++) {
		var yCoord = i * this.spacing;
		context.beginPath();
		context.moveTo(0, yCoord);
		context.lineTo(this.width, yCoord);
		context.stroke()
	}

	context.restore();
}