function onLoad() {
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	gridWidth = canvasWidth - levelMargin * 2;
	gridHeight = canvasHeight - levelMargin - scoreboardHeight;

	grid = new Grid(levelMargin, levelMargin,
				 	gridWidth, gridHeight, gridSpacing);

	scoreboard = new Scoreboard(0, canvasHeight - scoreboardHeight, canvasWidth, scoreboardHeight);

	courier = new Courier(100, 100);

	setInterval(mainLoop, 60);
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

function drawBackground(context) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	IMAGES.background.draw(context, 0, 0, 1);
	scoreboard.draw(context);
}

/* Main menu loop */
function menuLoop() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = COLORS.black;
	context.font = "40px Courier";
	context.fillText("Main menu.", 100, 100);
	context.fillText("Press any key to continue.", 100, 200);

	if (keyboard.anyKeyHit()) {
		currentLoop = LOOPS.game;
	}
	keyboard.updateState();
}

/* Main game loop */
function gameLoop() {
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

	if (drawGrid) grid.draw(context);
	courier.draw(context);

	for (var i = 0; i < pickupLocations.length; i++) {
		pickupLocations[i].draw(context);
	}
	for (var i = 0; i < dropoffLocations.length; i++) {
		dropoffLocations[i].draw(context);
	}

	keyboard.updateState();
}

function mainLoop() {
	switch (currentLoop) {
		case LOOPS.menu:
			menuLoop();
			break;
		case LOOPS.game:
			gameLoop();
			break;
	}
}