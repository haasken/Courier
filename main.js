function onLoad() {
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	gridWidth = canvasWidth - levelMargin * 2;
	gridHeight = canvasHeight - levelMargin - scoreboardHeight;

	grid = new Grid(levelMargin, levelMargin,
				 	gridWidth, gridHeight, gridSpacing);

	setInterval(mainLoop, updateInterval);
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

function collideCars() {
	for (var i = 0; i < otherCars.length; i++) {
		if (rectanglesOverlap(courier, otherCars[i])) {
			otherCars[i].crash();
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

function updateOtherCars() {
	for (var i = 0; i < otherCars.length; i++) {
		otherCars[i].update();
	}
}

function drawBackground(context) {
	context.fillStyle = COLORS.blue;
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	IMAGES.background.draw(context, 0, 0, 1);
	scoreboard.draw(context);
}

function initializeGame() {
	otherCars = new Array();
	pickupLocations = new Array();
	dropoffLocations = new Array();

	scoreboard = new Scoreboard(0, canvasHeight - scoreboardHeight, canvasWidth, scoreboardHeight);

	courier = new Courier(100, 100);

	for (var i = 0; i < 3; i++) {
		otherCars.push(getRandomCar());
	}

	currentGameState = STATES.inProgress;
}

function printCenteredText(text, posY) {
	var textWidth = context.measureText(text).width;
	context.fillText(text, (canvasWidth - textWidth) / 2, posY);
}

/* Main menu loop */
function menuLoop() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = COLORS.black;
	context.font = "80px Courier";
	printCenteredText("Courier", 100);
	context.font = "30px Courier";
	context.fillText("Controls: ", 50, 175);
	printCenteredText("W / Up arrow:    Move up   ", 225);
	printCenteredText("A / Left arrow:  Move left ", 275);
	printCenteredText("S / Down arrow:  Move down ", 325);
	printCenteredText("D / Right arrow: Move right", 375);

	printCenteredText("You are the red car. Deliver packages, and", 475);
	printCenteredText("don't crash! You can't turn at full speed.", 525);
	printCenteredText("Press S to start.", 600);

	if (keyboard.keyHit(keyboard.KEY.S)) {
		currentLoop = LOOPS.game;
		initializeGame();
	}
	keyboard.updateState();
}

function gameOverLoop() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = COLORS.black;
	context.font = "60px Courier";
	printCenteredText("     Game Over     ", 150);
	printCenteredText("Press R to restart.", 300);
	printCenteredText(" Press Q for menu. ", 450);
	scoreboard.draw(context);

	if (keyboard.keyHit(keyboard.KEY.Q)) {
		currentLoop = LOOPS.menu;
	}
	if (keyboard.keyHit(keyboard.KEY.R)) {
		currentLoop = LOOPS.game;
		initializeGame();
	}
	keyboard.updateState();
}



/* Main game loop */
function gameLoop() {

	switch(currentGameState) {
		case STATES.lost:
			context.fillStyle = COLORS.black;
			context.font = "80px Courier";
			printCenteredText("CRASHED!", 300);

			loopsWaited++;
			
			if (loopsWaited >= restartWaitLoops) {
				loopsWaited = 0;
				currentLoop = LOOPS.gameOver;
			}
			break;
		case STATES.inProgress:
			courier.control();
			courier.update();
			updatePackages();
			updateDropOffs();
			updateOtherCars();

			collectPickupLocations();
			completeDropoffLocations();
			collideCars();

			cull();

			if (pickupLocations.length == 0 && dropoffLocations.length == 0) {
				pickupLocations.push(getRandomDeliveryLocation(LOCATIONS.pickup));
			}

			if (totalDropoffs % addCarInterval == 0 && ! carAdded) {
				carAdded = true;
				otherCars.push(getRandomCar());
			}

			// Drawing
			drawBackground(context);

			if (drawGrid) grid.draw(context);

			for (var i = 0; i < pickupLocations.length; i++) {
				pickupLocations[i].draw(context);
			}
			for (var i = 0; i < dropoffLocations.length; i++) {
				dropoffLocations[i].draw(context);
			}	
			for (var i = 0; i < otherCars.length; i++) {
				otherCars[i].draw(context);
			}

			courier.draw(context);
			break;
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
		case LOOPS.gameOver:
			gameOverLoop();
			break;
	}
}