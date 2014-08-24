var canvasWidth;
var canvasHeight;

var canvas, context;
/* Space between grid lines, defined here for convenience */
var gridSpacing = 80;
/* Width and height of the grid */
var gridWidth, gridHeight;
var grid;
/* Margin between the grid and the left and upper edges of the level */
var levelMargin = 20;
/* Player bounds for convenience */
var boundsLeft, boundsRight, boundsTop, boundsBottom;
var courierWidth = 40;
var courierHeight = 40;
var courier;
var controller = new Controller();
var scoreboardHeight = 60;
var scoreboard;

/* Time in seconds for deliveryLocations to expire */
var deliveryExpirationSeconds = 10;

var pickupLocations = new Array();
var dropoffLocations = new Array();

function onLoad() {
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	gridWidth = canvasWidth - levelMargin * 2;
	gridHeight = canvasHeight - levelMargin - scoreboardHeight;

	grid = new Grid(levelMargin, levelMargin,
				 	gridWidth, gridHeight, gridSpacing);

	boundsLeft = levelMargin - courierWidth / 2;
	boundsRight = canvasWidth - levelMargin + courierWidth / 2;
	boundsTop = levelMargin - courierHeight / 2;
	boundsBottom = canvasHeight - scoreboardHeight + courierHeight / 2;

	scoreboard = new Scoreboard(0, canvasHeight - scoreboardHeight, canvasWidth, scoreboardHeight);

	courier = new Courier(100, 100);

	setInterval( update, 60 );
}

var cullEntityList = function( entityList ) {
	for (e in entityList) {
		if (entityList[e].removeThis) entityList.splice(e, 1);
	}
}

function cull() {
	cullEntityList(pickupLocations);
	cullEntityList(dropoffLocations);
}

function collectPickupLocations() {
	for (var i = 0; i < pickupLocations.length; i++) {
		if (rectanglesOverlap(courier, pickupLocations[i])) {
			pickupLocations[i].enterLocation();
		}
	}
}

function completeDropoffLocations() {
	for (var i = 0; i < dropoffLocations.length; i++) {
		if (rectanglesOverlap(courier, dropoffLocations[i])) {
			dropoffLocations[i].enterLocation();
		}
	}
}

function updatePackages() {
	for (var i = 0; i < pickupLocations.length; i++) {
		pickupLocations[i].update();
	}
}

function updateDropOffs() {
	for (var i = 0; i < dropoffLocations.length; i++) {
		dropoffLocations[i].update();
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
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	IMAGES.background.draw(context, 0, 0, 1);
	scoreboard.draw(context);
}

/* Main game loop */
function update() {
	courier.control();
	courier.update();
	updatePackages();
	updateDropOffs();

	collectPickupLocations();
	completeDropoffLocations();

	cull();

	if (pickupLocations.length == 0 && dropoffLocations.length == 0) {
		pickupLocations.push(getRandomDeliveryLocation(LOCATIONS.pickup));
	}

	// Drawing
	drawBackground(context);

	grid.draw(context);
	courier.draw(context);

	for (var i = 0; i < pickupLocations.length; i++) {
		pickupLocations[i].draw(context);
	}
	for (var i = 0; i < dropoffLocations.length; i++) {
		dropoffLocations[i].draw(context);
	}

	keyboard.updateState();
}