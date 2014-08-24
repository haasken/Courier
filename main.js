var levelWidth;
var levelHeight;

var COLORS = {
	red: "red",
	blue: "blue",
	purple: "purple",
	black: "black",
	none: "none"
}

var DIRECTIONS = {
	up: 0,
	down: 1,
	left: 2,
	right: 3,
	vertical: 4,
	horizontal: 5,
	none: 6
}

var canvas, context;
/* Space between grid lines, defined here for convenience */
var gridSpacing = 80;
/* Width and height of the grid */
var gridWidth, gridHeight;
var grid;
/* Margin between the grid and the edge of the level */
var levelMargin = 20;
/* Player bounds for convenience */
var boundsLeft, boundsRight, boundsTop, boundsBottom;
var courierWidth = 40;
var courierHeight = 40;
var courier;
var controller = new Controller();

/* Time in seconds for package pickups to expire */
var packageExpireSeconds = 10;
var dropoffExpireSeconds = 10;

var packages = new Array();
var dropoffs = new Array();

function onLoad() {
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );
	levelWidth = canvas.width;
	levelHeight = canvas.height;

	gridWidth = levelWidth - levelMargin * 2;
	gridHeight = levelHeight - levelMargin * 2;

	grid = new Grid(levelMargin, levelMargin,
				 	gridWidth, gridHeight, gridSpacing);

	boundsLeft = levelMargin - courierWidth / 2;
	boundsRight = levelWidth - levelMargin + courierWidth / 2;
	boundsTop = levelMargin - courierHeight / 2;
	boundsBottom = levelHeight - levelMargin + courierHeight / 2;

	courier = new Courier(100, 100);

	packages.push(getRandomPackage());

	setInterval( update, 60 );
}

var cullEntityList = function( entityList ) {
	for ( e in entityList ) {
		if ( entityList[e].removeThis ) entityList.splice( e, 1 );
	}
}

function cull() {
	cullEntityList(packages);
	cullEntityList(dropoffs);
}

function collectPackages() {
	for (var i = 0; i < packages.length; i++) {
		if (rectanglesOverlap(courier, packages[i])) {
			packages[i].collect();
		}
	}
}

function completeDropoffs() {
	for (var i = 0; i < dropoffs.length; i++) {
		if (rectanglesOverlap(courier, dropoffs[i])) {
			dropoffs[i].complete();
		}
	}
}

function updatePackages() {
	for (var i = 0; i < packages.length; i++) {
		packages[i].update();
	}
}

function updateDropOffs() {
	for (var i = 0; i < dropoffs.length; i++) {
		dropoffs[i].update();
	}
}

function rectanglesOverlap(rect1, rect2) {
	// Two upright rectangles
	var left1 = rect1.posX;
	var left2 = rect2.posX;
	var right1 = left1 + rect1.width;
	var right2 = left2 + rect2.width;
	var top1 = rect1.posY;
	var top2 = rect2.posY;
	var bottom1 = top1 + rect1.height;
	var bottom2 = top2 + rect2.height;
	
	if ((bottom1 > top2) &&
		(top1 < bottom2) &&
		(right1 > left2) &&
		(left1 < right2)) { 
	
		// The two objects' collision boxes overlap
		return true;
	}
	// The two objects' collision boxes do not overlap
	return false;
}

function drawBackground(context) {
	context.clearRect(0, 0, levelWidth, levelHeight);
	IMAGES.background.draw(context, 0, 0, 1);
}

/* Main game loop */
function update() {
	courier.control();
	courier.update();
	updatePackages();
	updateDropOffs();

	collectPackages();
	completeDropoffs();

	cull();

	if (packages.length == 0 && dropoffs.length == 0) {
		packages.push(getRandomPackage());
	}

	// Drawing
	drawBackground(context);

	grid.draw(context);
	courier.draw(context);

	for (var i = 0; i < packages.length; i++) {
		packages[i].draw(context);
	}
	for (var i = 0; i < dropoffs.length; i++) {
		dropoffs[i].draw(context);
	}

	keyboard.updateState();
}