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
	/* A score multiplier.  It will be increased (up to this.maxMultiplier)
	 * when this.requiredMultStreak successful deliveries have been made in a row. */
	this.multiplier = 1;
	this.streak = 0;

	/* Constants */
	this.pointsPerSecondRemaining = 100;
	this.requiredMultStreak = 2;
	this.maxMultiplier = 8;
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

	/* Draw the multiplier on the scoreboard. */
	var multiplierText = "Multiplier: " + this.multiplier + "x";
	var multiplierTextWidth = context.measureText(multiplierText).width;
	context.fillText(multiplierText,
					 this.posX + this.width - multiplierTextWidth - this.rightMargin,
					 this.posY + this.height - this.bottomMargin);
}

Scoreboard.prototype.scoreDelivery = function(secondsRemaining) {
	this.score += secondsRemaining * this.pointsPerSecondRemaining * this.multiplier;

	/* Increment the streak and possibly the multiplier. */
	this.streak += 1;
	if (this.streak % this.requiredMultStreak == 0) {
		this.multiplier *= 2;
	}
	if (this.multiplier > this.maxMultiplier) this.multiplier = this.maxMultiplier;
}

Scoreboard.prototype.resetMultiplier = function() {
	this.multiplier = 1;
	this.streak = 0;
}

Scoreboard.prototype.getPaddedScoreString = function(width) {
	// Get the score as a string
	var scoreString = Math.round(this.score).toString();
	// Pad with zeros
	while (scoreString.length < width) scoreString = " " + scoreString;
	return scoreString;
}