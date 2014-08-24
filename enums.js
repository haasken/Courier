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
	none: 4
}

/* This indicates whether a delivery object is a pickup or a dropoff location. */
var LOCATIONS = {
	pickup: 0,
	dropoff: 1
}

var LOOPS = {
	menu: 0,
	game: 1
}

var STATES = {
	inProgress: 0,
	won: 1,
	lost: 2
}