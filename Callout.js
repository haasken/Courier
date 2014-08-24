/* Takes in the posX, posY of the point where it looks like the callout
 * is coming from. Takes a direction for the direction the callout is pointed.
 * From these two items, we can calculate the actual position. */
var Callout = function(posX, posY, direction, color) {
	this.direction = direction;

	if (this.direction == DIRECTIONS.upRight) {
		this.image = IMAGES.calloutUpRight;
	}
	// Only have support for two callout directions right now
	else {
		this.image = IMAGES.calloutDownLeft;
	}

	this.width = this.image.image.width;
	this.height = this.image.image.height;

	if (this.direction == DIRECTIONS.upRight) {
		this.posX = posX;
		this.posY = posY - this.height;
	}
	// Only have support for two callout directions right now
	else {
		this.posX = posX - this.width;
		this.posY = posY;
	}

	this.color = color;

	this.text = null;
	this.margin = 8;
	/* Adding some extra size (+ 4) to the text because it works */
	this.fontSize = this.height - this.margin * 2 + 4;
	this.fontStyle = "Courier";
}

Callout.prototype.draw = function(context) {
	this.image.draw(context, this.posX, this.posY, 1);
	if (this.text) {
		context.font = this.fontSize.toFixed(0) + "px " + this.fontStyle;
		context.fillStyle = this.color;

		/* Leave a small margin on the top and bottom. */
		var textPosY = this.posY + this.height - this.margin;
		/* Try to put the text in the middle of the callout */
		var textPosX = this.posX;
		var textWidth = context.measureText(this.text).width;
		/*console.log("textWidth: " + textWidth.toString() + " this.width: " + this.width.toString());*/
		if (textWidth < this.width) {
			textPosX += (this.width - textWidth) / 2.0;
/*			console.log("textWidth: " + textWidth.toString() + " < this.width: " + this.width.toString());
			console.log("Set textPosX to " + textPosX.toString());*/
		}
		context.fillText(this.text, textPosX, textPosY);
	}
}