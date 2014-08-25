/* This file contains some "enums" (really just maps) that I use in this game. */

var COLORS = {
	red: "red",
	blue: "blue",
	green: "green",
	purple: "purple",
	black: "black",
	none: "none"
}

var DIRECTIONS = {
	up: 0,
	down: 1,
	left: 2,
	right: 3,
	upLeft: 4,
	upRight: 5,
	downLeft: 6,
	downRight: 7,
	none: 8
}

function getOppositeDirection(direction) {
	switch (direction) {
		case DIRECTIONS.up:
			return DIRECTIONS.down;
			break;
		case DIRECTIONS.down:
			return DIRECTIONS.up;
			break;
		case DIRECTIONS.left:
			return DIRECTIONS.right;
			break;
		case DIRECTIONS.right:
			return DIRECTIONS.left;
			break;
		case DIRECTIONS.upLeft:
			return DIRECTIONS.downRight;
			break;
		case DIRECTIONS.upRight:
			return DIRECTIONS.downLeft;
			break;
		case DIRECTIONS.downLeft:
			return DIRECTIONS.upRight;
			break;
		case DIRECTIONS.downRight:
			return DIRECTIONS.upLeft;
			break;
		default:
			return DIRECTIONS.none;
			break;
	}
}


/* This indicates whether a delivery object is a pickup or a dropoff location. */
var LOCATIONS = {
	pickup: 0,
	dropoff: 1
}

var LOOPS = {
	menu: 0,
	game: 1,
	gameOver: 2
}

var STATES = {
	inProgress: 0,
	won: 1,
	lost: 2
}