var Scoreboard = function(posX, posY, width, height) {
	this.posX = posX;
	this.posY = posY;
	this.width = width;
	this.height = height;

	this.leftMargin = levelMargin;
	this.rightMargin = levelMargin;
	this.topMargin = 10;
	this.bottomMargin = 10;

	this.fontSize = this.height - this.topMargin - this.bottomMargin;

	this.color = COLORS.black;
	this.fontStyle = "Courier"

	this.score = 0;
	this.pointsPerSecondRemaining = 50;
}

Scoreboard.prototype.draw = function(context) {
	var roundedScore = Math.round(this.score);
	var scoreText = "Score: " + this.getPaddedScoreString(7);
	/* Draw the score on the scoreboard */
	context.font = this.fontSize.toFixed(0) + "px " + this.fontStyle;
	context.fillStyle = this.color;
	context.fillText(scoreText, 
					 this.posX + this.rightMargin, 
					 this.posY + this.height - this.bottomMargin);
}

Scoreboard.prototype.addScoreSeconds = function(secondsRemaining) {
	this.score += secondsRemaining * this.pointsPerSecondRemaining;
}

Scoreboard.prototype.getPaddedScoreString = function(width) {
	// Get the score as a string
	var scoreString = Math.round(this.score).toString();
	// Pad with zeros
	while (scoreString.length < width) scoreString = " " + scoreString;
	return scoreString;
}