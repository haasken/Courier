var Grid = function(posX, posY, width, height, spacing) {
	
	/* Location of the top left of the grid. */
	this.posX = posX;
	this.posY = posY;

	this.width = width;
	this.height = height;

	/* The space between grid lines. Equal horizontally and vertically. */
	this.spacing = spacing;
	/* If closer than snapDistance to a grid line, nearGridLine will return true. */
	this.snapDistance = this.spacing / 5;
}

/* Takes in a position (in the grid coordinate system) and determines if it
 * is within this.snapDistance of the nearest grid line.  If so, return true. */
Grid.prototype.nearGridLine = function(relPos) {
	var distToGridLine1 = relPos % this.spacing;
	var distToGridLine2 = this.spacing - distToGridLine1;
	return (distToGridLine1 < this.snapDistance || distToGridLine2 < this.snapDistance);
}

/* The following functions take in a position (in the global coordinate system) and 
 * determines if it is on the respective edge of the grid. */
Grid.prototype.onTopEdge = function(absPosY) {
	return absPosY - this.posY == 0;
}

Grid.prototype.onBottomEdge = function (absPosY) {
	return absPosY - this.posY == this.height;
}

Grid.prototype.onLeftEdge = function(absPosX) {
	return absPosX - this.posX == 0;
}

Grid.prototype.onRightEdge = function(absPosX) {
	return absPosX - this.posX == this.width;
}

/* Deprecated.  Used only by Courier::controlOld().  This seems to tightly coupled
 * to the Courier code. */
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

/* Deprecated.  Used only by Courier::controlOld().  This seems to tightly coupled
 * to the Courier code. */
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

/* Snap a given x or y coordinate (in the grid's coordinate system) 
 * to the nearest grid line.  Note that the returned coordinate is
 * also in terms of the grid's coordinate system. */
Grid.prototype.snapToGrid = function(pos) {
	var curCoord = Math.floor(pos / this.spacing);
	if (curCoord < 0) {
		curCoord = 0;
	}
	var distToPrevCoord = pos % this.spacing;
	var distToNextCoord = this.spacing - pos % this.spacing;

	if (distToPrevCoord <= distToNextCoord) {
		return curCoord * this.spacing;
	}
	else {
		return (curCoord + 1) * this.spacing;
	}
}

/* Draw a grid of lines onto the canvas context. */
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